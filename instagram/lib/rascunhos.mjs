// Rascunhos locais: guardam a mídia pronta, a legenda e a aprovação de cada peça.
// A aprovação registra um hash de tudo o que vai ao ar. Qualquer mudança depois dela exige nova aprovação.

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inspecionar, prepararImagem, prepararVideo, tipoDoArquivo } from './midia.mjs';
import { verificarTexto } from './regras.mjs';

export const PASTA_INSTAGRAM = join(dirname(fileURLToPath(import.meta.url)), '..');
export const PASTA_RASCUNHOS = join(PASTA_INSTAGRAM, 'rascunhos');

export const TIPOS = ['post', 'carrossel', 'reels', 'story', 'resposta'];

const pastaDo = id => join(PASTA_RASCUNHOS, id);
const arquivoDo = id => join(pastaDo(id), 'rascunho.json');

function sha256(conteudo) {
  return createHash('sha256').update(conteudo).digest('hex');
}

export function carregar(id) {
  if (!existsSync(arquivoDo(id))) throw new Error(`Rascunho "${id}" não existe. Veja os disponíveis com: ig rascunho listar`);
  return JSON.parse(readFileSync(arquivoDo(id), 'utf8'));
}

export function salvar(rascunho) {
  writeFileSync(arquivoDo(rascunho.id), JSON.stringify(rascunho, null, 2) + '\n');
}

export function listar() {
  if (!existsSync(PASTA_RASCUNHOS)) return [];
  return readdirSync(PASTA_RASCUNHOS)
    .filter(id => existsSync(arquivoDo(id)))
    .map(carregar)
    .sort((a, b) => a.criado_em.localeCompare(b.criado_em));
}

export function apagar(id) {
  carregar(id);
  rmSync(pastaDo(id), { recursive: true, force: true });
}

export const caminhoDaMidia = (rascunho, nome) => join(pastaDo(rascunho.id), nome);

// Tudo o que vai ao ar entra no hash: tipo, textos, opções e o conteúdo de cada arquivo.
export function hashDoRascunho(rascunho) {
  const arquivos = [...rascunho.midias, ...(rascunho.capa ? [rascunho.capa] : [])];
  return sha256(JSON.stringify({
    tipo: rascunho.tipo,
    legenda: rascunho.legenda ?? null,
    texto: rascunho.texto ?? null,
    comentario: rascunho.comentario?.id ?? null,
    opcoes: rascunho.opcoes ?? {},
    arquivos: arquivos.map(nome => [nome, sha256(readFileSync(caminhoDaMidia(rascunho, nome)))]),
  }));
}

export function aprovar(id) {
  const rascunho = carregar(id);
  if (rascunho.publicacao?.id) throw new Error('Este rascunho já foi publicado.');
  const { erros } = validar(rascunho);
  if (erros.length) throw new Error(`O rascunho tem erros e não pode ser aprovado:\n- ${erros.join('\n- ')}`);
  rascunho.aprovacao = { hash: hashDoRascunho(rascunho), em: new Date().toISOString() };
  salvar(rascunho);
  return rascunho;
}

export function conferirAprovacao(rascunho) {
  if (!rascunho.aprovacao) throw new Error(`O rascunho "${rascunho.id}" ainda não foi aprovado. Mostre a peça e a legenda e rode "ig aprovar ${rascunho.id}" só depois do sim explícito.`);
  if (rascunho.aprovacao.hash !== hashDoRascunho(rascunho)) {
    throw new Error(`O rascunho "${rascunho.id}" mudou depois da aprovação. Mostre de novo e aprove outra vez.`);
  }
}

// Validação

const proporcao = ({ largura, altura }) => largura / altura;

function validarImagem(info, nome, { story = false } = {}) {
  const erros = [];
  const avisos = [];
  if (info.bytes > 8 * 1024 * 1024) erros.push(`${nome}: passa de 8 MB.`);
  if (story) {
    if (info.largura !== 1080 || info.altura !== 1920) avisos.push(`${nome}: story da marca é 1080 x 1920 (esta tem ${info.largura} x ${info.altura}).`);
    return { erros, avisos };
  }
  const p = proporcao(info);
  if (p < 0.8 - 0.005 || p > 1.91 + 0.005) erros.push(`${nome}: proporção ${info.largura} x ${info.altura} fora do aceito pelo feed (de 4:5 a 1,91:1).`);
  if (info.largura < 320 || info.largura > 1440) erros.push(`${nome}: largura de ${info.largura} px fora do aceito (320 a 1440).`);
  const formatoDaMarca = info.largura === 1080 && (info.altura === 1350 || info.altura === 1080);
  if (!formatoDaMarca) avisos.push(`${nome}: a marca usa 1080 x 1350 ou 1080 x 1080 (esta tem ${info.largura} x ${info.altura}).`);
  return { erros, avisos };
}

function validarVideo(info, nome, { minimo, maximo, megas, marca }) {
  const erros = [];
  const avisos = [];
  if (info.segundos < minimo || info.segundos > maximo) erros.push(`${nome}: dura ${info.segundos.toFixed(1)} s. O aceito é de ${minimo} a ${maximo} s.`);
  if (marca && (info.segundos < marca[0] || info.segundos > marca[1])) erros.push(`${nome}: dura ${info.segundos.toFixed(1)} s. O guia da marca pede de ${marca[0]} a ${marca[1]} s.`);
  if (info.bytes > megas * 1024 * 1024) erros.push(`${nome}: passa de ${megas} MB.`);
  if (info.largura > 1920) erros.push(`${nome}: largura acima de 1920 px.`);
  if (info.largura !== 1080 || info.altura !== 1920) avisos.push(`${nome}: vídeo vertical da marca é 1080 x 1920 (este tem ${info.largura} x ${info.altura}).`);
  return { erros, avisos };
}

export function validar(rascunho) {
  const erros = [];
  const avisos = [];
  const juntar = r => { erros.push(...r.erros); avisos.push(...r.avisos); };
  const infos = rascunho.midias.map(nome => [nome, inspecionar(caminhoDaMidia(rascunho, nome))]);

  switch (rascunho.tipo) {
    case 'post':
      if (infos.length !== 1 || infos[0][1].tipo !== 'imagem') erros.push('Post leva exatamente uma imagem. Para vídeo, use reels.');
      else juntar(validarImagem(infos[0][1], infos[0][0]));
      break;
    case 'carrossel': {
      if (infos.length < 2 || infos.length > 10) erros.push(`Carrossel leva de 2 a 10 itens (este tem ${infos.length}).`);
      for (const [nome, info] of infos) {
        juntar(info.tipo === 'imagem' ? validarImagem(info, nome) : validarVideo(info, nome, { minimo: 3, maximo: 60, megas: 100 }));
      }
      const tamanhos = new Set(infos.map(([, i]) => `${i.largura}x${i.altura}`));
      if (tamanhos.size > 1) avisos.push('Os itens têm tamanhos diferentes. O Instagram corta todos na proporção do primeiro.');
      break;
    }
    case 'reels':
      if (infos.length !== 1 || infos[0][1].tipo !== 'video') erros.push('Reels leva exatamente um vídeo.');
      else juntar(validarVideo(infos[0][1], infos[0][0], { minimo: 3, maximo: 900, megas: 300, marca: [7, 30] }));
      if (rascunho.capa) {
        const capa = inspecionar(caminhoDaMidia(rascunho, rascunho.capa));
        if (capa.largura !== 1080 || capa.altura !== 1920) avisos.push(`Capa: a marca usa 1080 x 1920 (esta tem ${capa.largura} x ${capa.altura}).`);
      }
      break;
    case 'story':
      if (infos.length !== 1) erros.push('Story leva exatamente uma imagem ou um vídeo.');
      else if (infos[0][1].tipo === 'imagem') juntar(validarImagem(infos[0][1], infos[0][0], { story: true }));
      else juntar(validarVideo(infos[0][1], infos[0][0], { minimo: 3, maximo: 60, megas: 100 }));
      if (rascunho.legenda) erros.push('A API não publica legenda em story. Coloque o texto na própria arte.');
      break;
    case 'resposta':
      break;
    default:
      erros.push(`Tipo desconhecido: ${rascunho.tipo}`);
  }

  if (rascunho.tipo === 'resposta') juntar(verificarTexto(rascunho.texto || '', { tipo: 'resposta' }));
  else if (rascunho.tipo !== 'story') juntar(verificarTexto(rascunho.legenda || '', { tipo: rascunho.tipo }));

  return { erros, avisos, infos };
}

// Criação

function novoId(base) {
  const data = new Date().toISOString().slice(0, 10);
  const slug = semAcentoSlug(base) || 'peca';
  let id = `${data}-${slug}`;
  for (let n = 2; existsSync(pastaDo(id)); n++) id = `${data}-${slug}-${n}`;
  return id;
}

function semAcentoSlug(texto) {
  return String(texto).normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
}

export function criar({ tipo, midias = [], legenda, capa, id, compartilharNoFeed = true }) {
  if (!TIPOS.includes(tipo) || tipo === 'resposta') throw new Error(`Tipo inválido: ${tipo}. Use post, carrossel, reels ou story.`);
  if (!midias.length) throw new Error('Indique ao menos uma mídia com --midia.');
  const idFinal = id ? semAcentoSlug(id) : novoId(basename(midias[0]).replace(/\.[^.]+$/, ''));
  if (existsSync(pastaDo(idFinal))) throw new Error(`Já existe um rascunho "${idFinal}".`);
  mkdirSync(pastaDo(idFinal), { recursive: true });

  const notas = [];
  try {
    const nomes = midias.map((origem, i) => {
      const numero = String(i + 1).padStart(2, '0');
      if (tipoDoArquivo(origem) === 'imagem') {
        const nome = `${numero}.jpg`;
        prepararImagem(origem, join(pastaDo(idFinal), nome));
        return nome;
      }
      const nome = `${numero}.mp4`;
      const r = prepararVideo(origem, join(pastaDo(idFinal), nome));
      if (r.recodificado) notas.push(`${basename(origem)} foi recodificado em H.264.`);
      if (r.audioAdicionado) notas.push(`${basename(origem)} não tinha áudio; recebeu uma faixa silenciosa.`);
      return nome;
    });
    let nomeDaCapa = null;
    if (capa) {
      if (tipo !== 'reels') throw new Error('Capa só vale para reels.');
      nomeDaCapa = 'capa.jpg';
      prepararImagem(capa, join(pastaDo(idFinal), nomeDaCapa));
    }
    const rascunho = {
      id: idFinal,
      tipo,
      criado_em: new Date().toISOString(),
      legenda: legenda?.trim() || null,
      midias: nomes,
      capa: nomeDaCapa,
      opcoes: tipo === 'reels' ? { compartilhar_no_feed: compartilharNoFeed } : {},
      aprovacao: null,
      publicacao: null,
    };
    salvar(rascunho);
    return { rascunho, notas, ...validar(rascunho) };
  } catch (e) {
    rmSync(pastaDo(idFinal), { recursive: true, force: true });
    throw e;
  }
}

export function criarResposta({ comentario, texto, id }) {
  if (!texto?.trim()) throw new Error('Escreva a resposta com --texto ou --texto-arquivo.');
  const idFinal = id ? semAcentoSlug(id) : novoId(`resposta-${comentario.username || comentario.id}`);
  mkdirSync(pastaDo(idFinal), { recursive: true });
  const rascunho = {
    id: idFinal,
    tipo: 'resposta',
    criado_em: new Date().toISOString(),
    comentario: {
      id: comentario.id,
      autor: comentario.username,
      texto: comentario.text,
      midia: comentario.media?.permalink || null,
    },
    texto: texto.trim(),
    midias: [],
    capa: null,
    aprovacao: null,
    publicacao: null,
  };
  salvar(rascunho);
  return { rascunho, notas: [], ...validar(rascunho) };
}
