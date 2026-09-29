// Confere legendas e respostas contra as regras de tom de voz do CLAUDE.md.
// Erros bloqueiam o rascunho; avisos só pedem uma segunda leitura.

const semAcento = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

const CLICHES = [
  'transforme seu negocio', 'transformar seu negocio', 'transforme o seu negocio',
  'proximo nivel', 'solucoes inovadoras', 'solucao inovadora',
];

const CLICHES_PROVAVEIS = [
  'alavanc', 'potencialize', 'fora da caixa', 'no mundo de hoje', 'revolucion', 'disrupt',
  'sem mais delongas', 'faca a diferenca', 'sucesso garantido', 'nao perca tempo',
];

const PORTUGUES_DE_PORTUGAL = [
  [/\bfacto\b/, 'facto → fato'],
  [/\bequipa\b/, 'equipa → equipe'],
  [/\becra\b/, 'ecrã → tela'],
  [/\btelemove(l|is)\b/, 'telemóvel → celular'],
  [/\butilizador(es)?\b/, 'utilizador → usuário'],
  [/\bregisto\b/, 'registo → registro'],
  [/\bcontacto\b/, 'contacto → contato'],
  [/\bsitio web\b/, 'sítio web → site'],
  [/\b(estou|esta|estamos|estao|continua|continuamos|ficamos) a \w+(ar|er|ir)\b/, '"estamos a fazer" → "estamos fazendo"'],
];

const PRECO = /r\$\s*\d|\bus\$\s*\d|\$\s*\d|\d+([.,]\d+)?\s*(reais|mil reais)\b|a partir de \d|por apenas|\bgratis\b|\bdesconto\b/;

const PRAZO = /\bgaranti(do|da|mos|a)\b|\bem (\d+|um|uma|dois|duas|tres) (horas?|dias?|semanas?|meses?)\b|\bate (amanha|sexta|segunda)\b/;

const EMOJI = /\p{Extended_Pictographic}/gu;
const NAO_EMOJI = new Set(['©', '®', '™', '‼', '⁉']);

export function contarEmojis(texto) {
  return (texto.match(EMOJI) || []).filter(c => !NAO_EMOJI.has(c)).length;
}

export function hashtags(texto) {
  return texto.match(/#[\p{L}\p{N}_]+/gu) || [];
}

export function verificarTexto(texto, { tipo }) {
  const erros = [];
  const avisos = [];
  const normal = semAcento(texto);

  if (/[!¡‼⁉]/.test(texto)) erros.push('Tem ponto de exclamação. A marca não usa.');
  for (const c of CLICHES) if (normal.includes(c)) erros.push(`Clichê proibido: "${c}".`);
  for (const c of CLICHES_PROVAVEIS) if (normal.includes(c)) avisos.push(`Soa como clichê: "${c}". Reescreva de forma direta, se possível.`);
  for (const [padrao, dica] of PORTUGUES_DE_PORTUGAL) if (padrao.test(normal)) erros.push(`Português de Portugal: ${dica}.`);
  if (PRECO.test(normal)) erros.push('Menciona preço, valor ou desconto. A marca não fala de valores nas redes.');
  if (PRAZO.test(normal)) avisos.push('Menciona prazo ou garantia. Confirme que isso foi combinado antes de publicar.');

  const emojis = contarEmojis(texto);
  if (emojis > 1) erros.push(`Tem ${emojis} emojis. O máximo é um.`);

  if (texto.length > 2200) erros.push(`Tem ${texto.length} caracteres. O Instagram aceita até 2.200.`);
  const mencoes = texto.match(/@[\w.]+/g) || [];
  if (mencoes.length > 20) erros.push('Tem mais de 20 menções.');

  const tags = hashtags(texto);
  if (tipo === 'resposta') {
    if (tags.length) avisos.push('Respostas a comentários normalmente não levam hashtags.');
  } else {
    if (tags.length < 3 || tags.length > 5) erros.push(`Tem ${tags.length} hashtags. Use de 3 a 5, no fim da legenda.`);
    const ultimaLinha = texto.trim().split('\n').pop();
    const foraDoFim = tags.filter(t => !ultimaLinha.includes(t));
    if (tags.length && foraDoFim.length) avisos.push(`Hashtags fora da última linha: ${foraDoFim.join(' ')}. Deixe todas no fim.`);
    const repetidas = tags.filter((t, i) => tags.findIndex(u => u.toLowerCase() === t.toLowerCase()) !== i);
    if (repetidas.length) erros.push(`Hashtags repetidas: ${repetidas.join(' ')}.`);
  }

  if (!texto.trim()) erros.push('O texto está vazio.');
  return { erros, avisos };
}
