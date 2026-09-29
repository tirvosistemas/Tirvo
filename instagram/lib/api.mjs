// Cliente da API do Instagram com login do Instagram (graph.instagram.com).
// O token e o ID da conta vêm só das variáveis de ambiente e nunca aparecem em saídas ou erros.

const BASE = 'https://graph.instagram.com';
const VERSAO = process.env.IG_API_VERSION || 'v23.0';

export class ErroApi extends Error {
  constructor(erro, status) {
    super(`${erro.message || 'Erro desconhecido'} (código ${erro.code ?? '?'}${erro.error_subcode ? `/${erro.error_subcode}` : ''}, HTTP ${status})`);
    this.codigo = erro.code;
    this.subcodigo = erro.error_subcode;
    this.transitorio = Boolean(erro.is_transient) || [1, 2, 4, 17, 341].includes(erro.code);
  }
}

function credenciais() {
  const token = process.env.IG_ACCESS_TOKEN;
  const usuario = process.env.IG_USER_ID;
  if (!token || !usuario) throw new Error('Defina IG_ACCESS_TOKEN e IG_USER_ID nas variáveis de ambiente.');
  return { token, usuario };
}

const esperar = ms => new Promise(r => setTimeout(r, ms));

async function chamar(metodo, caminho, params = {}, { versionado = true, tentativas = 3 } = {}) {
  const { token } = credenciais();
  const url = caminho.startsWith('https://') ? new URL(caminho) : new URL(`${BASE}/${versionado ? `${VERSAO}/` : ''}${caminho}`);
  const corpo = new URLSearchParams();
  const destino = metodo === 'GET' ? url.searchParams : corpo;
  for (const [chave, valor] of Object.entries(params)) {
    if (valor === undefined || valor === null) continue;
    destino.set(chave, typeof valor === 'object' ? JSON.stringify(valor) : String(valor));
  }
  destino.set('access_token', token);

  for (let tentativa = 1; ; tentativa++) {
    let resposta;
    try {
      resposta = await fetch(url, metodo === 'GET' ? {} : { method: metodo, body: corpo });
    } catch (e) {
      // Falha de rede: só repete leituras, para nunca duplicar uma publicação ou resposta.
      if (metodo === 'GET' && tentativa < tentativas) { await esperar(2000 * tentativa); continue; }
      throw new Error(`Falha de rede ao chamar a API do Instagram: ${e.cause?.code || e.message}`);
    }
    const dados = await resposta.json().catch(() => ({}));
    if (resposta.ok && !dados.error) return dados;
    const erro = new ErroApi(dados.error || { message: resposta.statusText }, resposta.status);
    if (erro.transitorio && tentativa < tentativas) { await esperar(3000 * tentativa); continue; }
    throw erro;
  }
}

async function todasAsPaginas(primeira, limite = Infinity) {
  const itens = [...(primeira.data || [])];
  let proxima = primeira.paging?.next;
  while (proxima && itens.length < limite) {
    // O link "next" já traz o token; a chamada o substitui pelo do ambiente de qualquer forma.
    const pagina = await chamar('GET', proxima);
    itens.push(...(pagina.data || []));
    proxima = pagina.paging?.next;
  }
  return itens.slice(0, limite);
}

// Conta

export const idDaConta = () => credenciais().usuario;

export function perfil() {
  return chamar('GET', 'me', { fields: 'user_id,username,name,account_type,media_count,followers_count,follows_count' });
}

export async function cota() {
  const { data } = await chamar('GET', `${idDaConta()}/content_publishing_limit`, { fields: 'config,quota_usage' });
  return { usado: data?.[0]?.quota_usage ?? 0, total: data?.[0]?.config?.quota_total ?? 100 };
}

// Publicação

export function criarContainer(params) {
  return chamar('POST', `${idDaConta()}/media`, params, { tentativas: 1 });
}

export function statusDoContainer(id) {
  return chamar('GET', id, { fields: 'id,status_code,status' });
}

export async function aguardarContainer(id, { limiteMs = 15 * 60 * 1000, aoAtualizar } = {}) {
  const inicio = Date.now();
  for (;;) {
    const { status_code: codigo, status } = await statusDoContainer(id);
    aoAtualizar?.(codigo);
    if (codigo === 'FINISHED') return;
    if (codigo === 'ERROR' || codigo === 'EXPIRED') throw new Error(`O Instagram recusou a mídia (${codigo}): ${status || 'sem detalhes'}`);
    if (codigo === 'PUBLISHED') throw new Error('Este container já foi publicado.');
    if (Date.now() - inicio > limiteMs) throw new Error('O Instagram demorou demais para processar a mídia.');
    await esperar(5000);
  }
}

// Logo depois do FINISHED, o media_publish às vezes responde 9007/2207027 ("Media ID is not available").
// Nesse caso nada foi publicado, então é seguro esperar e tentar de novo.
export async function publicarContainer(idDoContainer, { tentativas = 6 } = {}) {
  for (let tentativa = 1; ; tentativa++) {
    try {
      return await chamar('POST', `${idDaConta()}/media_publish`, { creation_id: idDoContainer }, { tentativas: 1 });
    } catch (e) {
      const naoPronto = e instanceof ErroApi && (e.codigo === 9007 || e.subcodigo === 2207027);
      if (!naoPronto || tentativa >= tentativas) throw e;
      await esperar(5000 * tentativa);
    }
  }
}

// Mídias e comentários

const CAMPOS_MIDIA = 'id,media_type,media_product_type,permalink,timestamp,caption,like_count,comments_count';

export function midia(id) {
  return chamar('GET', id, { fields: CAMPOS_MIDIA });
}

export async function midiasRecentes(limite = 10) {
  const primeira = await chamar('GET', `${idDaConta()}/media`, { fields: CAMPOS_MIDIA, limit: Math.min(limite, 50) });
  return todasAsPaginas(primeira, limite);
}

const CAMPOS_COMENTARIO = 'id,text,username,timestamp,like_count,hidden,from{id,username}';

export async function comentarios(idDaMidia) {
  const primeira = await chamar('GET', `${idDaMidia}/comments`, {
    fields: `${CAMPOS_COMENTARIO},replies{${CAMPOS_COMENTARIO}}`,
    limit: 50,
  });
  return todasAsPaginas(primeira);
}

export function comentario(id) {
  return chamar('GET', id, { fields: `${CAMPOS_COMENTARIO},media{id,permalink},replies{${CAMPOS_COMENTARIO}}` });
}

export function responderComentario(idDoComentario, texto) {
  return chamar('POST', `${idDoComentario}/replies`, { message: texto }, { tentativas: 1 });
}

// Métricas

// Pede as métricas juntas e, se a API recusar alguma, repete uma a uma para aproveitar as que funcionam.
async function metricasComTolerancia(caminho, metricas, extras = {}) {
  try {
    const { data } = await chamar('GET', caminho, { metric: metricas.join(','), ...extras });
    return { dados: data || [], indisponiveis: [] };
  } catch (e) {
    if (!(e instanceof ErroApi) || metricas.length === 1) throw e;
    const dados = [];
    const indisponiveis = [];
    for (const metrica of metricas) {
      try {
        const { data } = await chamar('GET', caminho, { metric: metrica, ...extras });
        dados.push(...(data || []));
      } catch (erro) {
        if (!(erro instanceof ErroApi)) throw erro;
        indisponiveis.push(`${metrica}: ${erro.message}`);
      }
    }
    return { dados, indisponiveis };
  }
}

export const METRICAS_DA_CONTA = [
  'reach', 'views', 'accounts_engaged', 'total_interactions', 'likes', 'comments',
  'shares', 'saves', 'replies', 'profile_links_taps', 'follows_and_unfollows',
];

export function metricasDaConta(desde, ate) {
  return metricasComTolerancia(`${idDaConta()}/insights`, METRICAS_DA_CONTA, {
    period: 'day',
    metric_type: 'total_value',
    since: Math.floor(desde.getTime() / 1000),
    until: Math.floor(ate.getTime() / 1000),
  });
}

export function seguidoresPorDia(desde, ate) {
  return metricasComTolerancia(`${idDaConta()}/insights`, ['follower_count'], {
    period: 'day',
    since: Math.floor(desde.getTime() / 1000),
    until: Math.floor(ate.getTime() / 1000),
  });
}

export const METRICAS_POR_TIPO = {
  FEED: ['reach', 'views', 'likes', 'comments', 'shares', 'saved', 'total_interactions', 'profile_visits', 'follows'],
  REELS: ['reach', 'views', 'likes', 'comments', 'shares', 'saved', 'total_interactions', 'ig_reels_avg_watch_time', 'ig_reels_video_view_total_time'],
  STORY: ['reach', 'views', 'replies', 'shares', 'total_interactions', 'follows', 'profile_visits'],
};

export function metricasDaMidia(id, tipoDeProduto) {
  return metricasComTolerancia(`${id}/insights`, METRICAS_POR_TIPO[tipoDeProduto] || METRICAS_POR_TIPO.FEED);
}

// Token

// Confere se o token do ambiente ainda funciona, sem nunca mostrá-lo.
export async function verificarToken() {
  const dados = await perfil();
  return { usuario: dados.username, confereComId: String(dados.user_id) === String(idDaConta()) };
}
