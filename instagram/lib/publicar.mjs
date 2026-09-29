// Publica um rascunho aprovado. Nada sai daqui sem a aprovação conferir com o conteúdo atual.

import * as api from './api.mjs';
import { hospedar } from './hospedagem.mjs';
import { carregar, conferirAprovacao, salvar, validar } from './rascunhos.mjs';

function registrar(rascunho, etapa, dados = {}) {
  rascunho.publicacao = { ...(rascunho.publicacao || {}), etapa, ...dados };
  salvar(rascunho);
}

async function criarEAguardar(params, log) {
  const { id } = await api.criarContainer(params);
  let ultimo;
  await api.aguardarContainer(id, {
    aoAtualizar: codigo => { if (codigo !== ultimo) log(`  container ${id}: ${codigo}`); ultimo = codigo; },
  });
  return id;
}

function paramsDoItem(nome, url, extras = {}) {
  return nome.endsWith('.mp4') ? { media_type: 'VIDEO', video_url: url, ...extras } : { image_url: url, ...extras };
}

export async function publicar(id, { trailers = [], log = console.log } = {}) {
  const rascunho = carregar(id);
  if (rascunho.publicacao?.id) throw new Error(`Já publicado: ${rascunho.publicacao.link || rascunho.publicacao.id}`);
  conferirAprovacao(rascunho);
  const { erros } = validar(rascunho);
  if (erros.length) throw new Error(`O rascunho tem erros:\n- ${erros.join('\n- ')}`);

  const { usado, total } = await api.cota();
  if (usado >= total) throw new Error(`O limite de ${total} publicações em 24 horas já foi atingido.`);

  if (rascunho.tipo === 'resposta') {
    log(`Respondendo ao comentário de @${rascunho.comentario.autor}...`);
    const { id: idDaResposta } = await api.responderComentario(rascunho.comentario.id, rascunho.texto);
    registrar(rascunho, 'publicado', { id: idDaResposta, em: new Date().toISOString() });
    return rascunho;
  }

  log('Enviando as mídias aprovadas ao GitHub para o Instagram buscar...');
  const { commit, urls } = await hospedar(rascunho, { trailers });
  registrar(rascunho, 'hospedado', { commit, urls });

  log('Criando o container no Instagram...');
  const [primeira] = rascunho.midias;
  let container;
  switch (rascunho.tipo) {
    case 'post':
      container = await criarEAguardar({ image_url: urls[primeira], caption: rascunho.legenda }, log);
      break;
    case 'reels':
      container = await criarEAguardar({
        media_type: 'REELS',
        video_url: urls[primeira],
        caption: rascunho.legenda,
        share_to_feed: rascunho.opcoes?.compartilhar_no_feed !== false,
        cover_url: rascunho.capa ? urls[rascunho.capa] : undefined,
      }, log);
      break;
    case 'story':
      container = await criarEAguardar(primeira.endsWith('.mp4')
        ? { media_type: 'STORIES', video_url: urls[primeira] }
        : { media_type: 'STORIES', image_url: urls[primeira] }, log);
      break;
    case 'carrossel': {
      const filhos = [];
      for (const nome of rascunho.midias) {
        log(`  item ${nome}`);
        filhos.push(await criarEAguardar(paramsDoItem(nome, urls[nome], { is_carousel_item: true }), log));
      }
      container = await criarEAguardar({ media_type: 'CAROUSEL', children: filhos.join(','), caption: rascunho.legenda }, log);
      break;
    }
  }
  registrar(rascunho, 'container pronto', { container });

  log('Publicando...');
  const { id: idDaMidia } = await api.publicarContainer(container);
  registrar(rascunho, 'publicado', { id: idDaMidia, em: new Date().toISOString() });
  const detalhes = await api.midia(idDaMidia).catch(() => null);
  if (detalhes?.permalink) registrar(rascunho, 'publicado', { link: detalhes.permalink });
  return rascunho;
}
