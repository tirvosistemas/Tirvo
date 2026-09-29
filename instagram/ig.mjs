#!/usr/bin/env node
// Integração da Tirvo com a API oficial do Instagram. Veja instagram/README.md.

import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import * as api from './lib/api.mjs';
import * as rascunhos from './lib/rascunhos.mjs';
import { publicar } from './lib/publicar.mjs';
import { renderizar } from './lib/render.mjs';

const AJUDA = `Uso: node instagram/ig.mjs <comando>

Conta
  conta                                   perfil e cota de publicações
  token                                   confere se o token do ambiente funciona

Peças
  render <modelo.html> --saida <arq.jpg|arq.mp4> [--formato post|quadrado|story|reels]
         [--duracao s] [--fps 30] [--tempo ms]

Rascunhos e publicação
  rascunho criar --tipo post|carrossel|reels|story --midia <arq> [--midia <arq> ...]
                 [--legenda "..." | --legenda-arquivo <arq>] [--capa <arq.jpg>] [--id nome] [--sem-feed]
  rascunho resposta --comentario <id> (--texto "..." | --texto-arquivo <arq>) [--id nome]
  rascunho listar
  rascunho ver <id>
  rascunho apagar <id>
  aprovar <id>                            só depois do sim explícito na conversa
  publicar <id> [--trailer "Chave: valor" ...]

Comentários e métricas
  comentarios [--midia <id>] [--limite 10] [--sem-resposta]
  metricas conta [--dias 7]
  metricas midia <id>
  metricas recentes [--limite 10]`;

const { values: o, positionals: [comando, ...resto] } = parseArgs({
  allowPositionals: true,
  options: {
    tipo: { type: 'string' },
    midia: { type: 'string', multiple: true },
    legenda: { type: 'string' },
    'legenda-arquivo': { type: 'string' },
    capa: { type: 'string' },
    id: { type: 'string' },
    'sem-feed': { type: 'boolean' },
    comentario: { type: 'string' },
    texto: { type: 'string' },
    'texto-arquivo': { type: 'string' },
    saida: { type: 'string' },
    formato: { type: 'string' },
    duracao: { type: 'string' },
    fps: { type: 'string' },
    tempo: { type: 'string' },
    trailer: { type: 'string', multiple: true },
    limite: { type: 'string' },
    dias: { type: 'string' },
    'sem-resposta': { type: 'boolean' },
    ajuda: { type: 'boolean', short: 'h' },
  },
});

const data = iso => new Date(iso).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' });
const recuo = (texto, n = 4) => String(texto).split('\n').map(l => ' '.repeat(n) + l).join('\n');
const numero = v => Number(v).toLocaleString('pt-BR');

function mostrarValidacao({ erros = [], avisos = [], notas = [] }) {
  for (const n of notas) console.log(`  nota: ${n}`);
  for (const a of avisos) console.log(`  aviso: ${a}`);
  for (const e of erros) console.log(`  ERRO: ${e}`);
  if (!erros.length) console.log('  Nenhum erro de regra.');
}

function mostrarRascunho(r) {
  console.log(`${r.id}  (${r.tipo})  criado em ${data(r.criado_em)}`);
  if (r.tipo === 'resposta') {
    console.log(`  Comentário de @${r.comentario.autor}:\n${recuo(r.comentario.texto)}`);
    if (r.comentario.midia) console.log(`  Na publicação: ${r.comentario.midia}`);
    console.log(`  Resposta:\n${recuo(r.texto)}`);
  } else {
    for (const nome of [...r.midias, ...(r.capa ? [r.capa] : [])]) console.log(`  ${rascunhos.caminhoDaMidia(r, nome)}`);
    if (r.legenda) console.log(`  Legenda:\n${recuo(r.legenda)}`);
    if (r.tipo === 'reels') console.log(`  Aparece também no feed: ${r.opcoes?.compartilhar_no_feed === false ? 'não' : 'sim'}`);
  }
  const aprovado = r.aprovacao && r.aprovacao.hash === rascunhos.hashDoRascunho(r);
  if (r.publicacao?.id) console.log(`  Publicado em ${data(r.publicacao.em)}${r.publicacao.link ? `: ${r.publicacao.link}` : ''}`);
  else if (aprovado) console.log(`  Aprovado em ${data(r.aprovacao.em)}.`);
  else if (r.aprovacao) console.log('  Mudou depois da aprovação. Precisa aprovar de novo.');
  else console.log('  Aguardando aprovação.');
}

async function comandoConta() {
  const [p, c] = await Promise.all([api.perfil(), api.cota()]);
  console.log(`@${p.username}${p.name ? ` (${p.name})` : ''}, conta ${p.account_type}`);
  console.log(`Publicações: ${numero(p.media_count)} · Seguidores: ${numero(p.followers_count)} · Seguindo: ${numero(p.follows_count)}`);
  console.log(`Cota da API: ${c.usado} de ${c.total} publicações nas últimas 24 horas`);
}

async function comandoRender() {
  const [modelo] = resto;
  if (!modelo || !o.saida) throw new Error('Uso: render <modelo.html> --saida <arquivo.jpg|arquivo.mp4>');
  let ultimo = -1;
  const r = await renderizar(modelo, o.saida, {
    formato: o.formato, duracao: o.duracao, fps: o.fps, tempo: o.tempo,
    aoAvancar: (i, total) => {
      const pct = Math.floor((i / total) * 10) * 10;
      if (pct !== ultimo) { process.stdout.write(`  ${pct}%\r`); ultimo = pct; }
    },
  });
  console.log(`${o.saida}: ${r.largura} x ${r.altura}${r.segundos ? `, ${r.segundos} s a ${r.fps} fps` : ''}`);
}

async function comandoRascunho() {
  const [acao, id] = resto;
  switch (acao) {
    case 'criar': {
      const legenda = o['legenda-arquivo'] ? readFileSync(o['legenda-arquivo'], 'utf8') : o.legenda;
      const r = rascunhos.criar({ tipo: o.tipo, midias: o.midia || [], legenda, capa: o.capa, id: o.id, compartilharNoFeed: !o['sem-feed'] });
      mostrarRascunho(r.rascunho);
      mostrarValidacao(r);
      return;
    }
    case 'resposta': {
      if (!o.comentario) throw new Error('Informe o comentário com --comentario <id>.');
      const texto = o['texto-arquivo'] ? readFileSync(o['texto-arquivo'], 'utf8') : o.texto;
      const comentario = await api.comentario(o.comentario);
      const r = rascunhos.criarResposta({ comentario, texto, id: o.id });
      mostrarRascunho(r.rascunho);
      mostrarValidacao(r);
      return;
    }
    case 'listar': {
      const todos = rascunhos.listar();
      if (!todos.length) console.log('Nenhum rascunho.');
      for (const r of todos) {
        const estado = r.publicacao?.id ? 'publicado'
          : !r.aprovacao ? 'aguardando aprovação'
          : r.aprovacao.hash === rascunhos.hashDoRascunho(r) ? 'aprovado'
          : 'mudou depois da aprovação';
        console.log(`${r.id}  ${r.tipo}  ${estado}`);
      }
      return;
    }
    case 'ver': {
      const r = rascunhos.carregar(id);
      mostrarRascunho(r);
      mostrarValidacao(rascunhos.validar(r));
      return;
    }
    case 'apagar':
      rascunhos.apagar(id);
      console.log(`Rascunho ${id} apagado (só a cópia local; nada muda no Instagram).`);
      return;
    default:
      throw new Error('Use: rascunho criar | resposta | listar | ver <id> | apagar <id>');
  }
}

async function comandoComentarios() {
  const eu = (await api.perfil()).username;
  const midias = o.midia ? [await api.midia(o.midia)] : await api.midiasRecentes(Number(o.limite || 10));
  let total = 0;
  for (const m of midias) {
    const lista = await api.comentarios(m.id);
    const filtrada = lista.filter(c => !o['sem-resposta'] || (c.username !== eu && !(c.replies?.data || []).some(r => r.username === eu)));
    if (!filtrada.length) continue;
    console.log(`\n${m.permalink}  (${m.media_product_type}, ${data(m.timestamp)})`);
    for (const c of filtrada) {
      total++;
      console.log(`  [${c.id}] @${c.username} em ${data(c.timestamp)}${c.hidden ? ' (oculto)' : ''}\n${recuo(c.text, 6)}`);
      for (const r of c.replies?.data || []) console.log(`      ↳ @${r.username}: ${r.text}`);
    }
  }
  console.log(total ? `\n${total} comentário(s).` : 'Nenhum comentário encontrado.');
}

function mostrarMetricas({ dados, indisponiveis }) {
  for (const m of dados) {
    const valor = m.total_value?.value ?? m.values?.reduce((s, v) => s + (typeof v.value === 'number' ? v.value : 0), 0);
    console.log(`  ${m.name.padEnd(32)} ${numero(valor ?? 0)}`);
  }
  for (const i of indisponiveis) console.log(`  (indisponível) ${i}`);
}

async function comandoMetricas() {
  const [alvo, id] = resto;
  if (alvo === 'conta') {
    const dias = Math.min(Number(o.dias || 7), 30);
    const ate = new Date();
    const desde = new Date(ate.getTime() - dias * 86400 * 1000);
    console.log(`Conta, últimos ${dias} dias (${data(desde.toISOString())} a ${data(ate.toISOString())})`);
    mostrarMetricas(await api.metricasDaConta(desde, ate));
    const seguidores = await api.seguidoresPorDia(desde, ate);
    if (seguidores.dados.length) mostrarMetricas({ dados: seguidores.dados.map(d => ({ ...d, name: 'novos seguidores (follower_count)' })), indisponiveis: [] });
    return;
  }
  const midias = alvo === 'midia' ? [await api.midia(id)] : alvo === 'recentes' ? await api.midiasRecentes(Number(o.limite || 10)) : null;
  if (!midias) throw new Error('Use: metricas conta | midia <id> | recentes');
  if (!midias.length) console.log('Nenhuma publicação ainda.');
  for (const m of midias) {
    console.log(`\n${m.permalink}  (${m.media_product_type}, ${data(m.timestamp)})`);
    if (m.caption) console.log(recuo(m.caption.split('\n')[0].slice(0, 90), 2));
    mostrarMetricas(await api.metricasDaMidia(m.id, m.media_product_type));
  }
}

async function comandoToken() {
  const { usuario, confereComId } = await api.verificarToken();
  console.log(`Token válido para @${usuario}.`);
  if (!confereComId) console.log('Atenção: IG_USER_ID não corresponde à conta deste token.');
}

try {
  if (o.ajuda || !comando) console.log(AJUDA);
  else if (comando === 'conta') await comandoConta();
  else if (comando === 'token') await comandoToken();
  else if (comando === 'render') await comandoRender();
  else if (comando === 'rascunho') await comandoRascunho();
  else if (comando === 'aprovar') {
    const r = rascunhos.aprovar(resto[0]);
    console.log(`Rascunho ${r.id} aprovado. Publique com: node instagram/ig.mjs publicar ${r.id}`);
  } else if (comando === 'publicar') {
    const r = await publicar(resto[0], { trailers: o.trailer || [] });
    console.log(`Publicado. ${r.publicacao.link || `ID ${r.publicacao.id}`}`);
  } else if (comando === 'comentarios') await comandoComentarios();
  else if (comando === 'metricas') await comandoMetricas();
  else throw new Error(`Comando desconhecido: ${comando}\n\n${AJUDA}`);
} catch (e) {
  console.error(`Erro: ${e.message}`);
  process.exitCode = 1;
}
