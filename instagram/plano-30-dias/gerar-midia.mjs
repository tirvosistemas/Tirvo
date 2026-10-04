// Gera dados/midia.js a partir das pastas midia/<ID>/ (arquivos em ordem alfabética).
import { readdirSync, writeFileSync, existsSync } from 'node:fs';
const base = new URL('./midia/', import.meta.url);
const mapa = {};
if (existsSync(base)) for (const id of readdirSync(base).sort()) {
  const arqs = readdirSync(new URL(id + '/', base)).filter((f) => /\.(jpg|png|mp4)$/.test(f)).sort();
  if (arqs.length) mapa[id] = arqs.map((f) => `midia/${id}/${f}`);
}
writeFileSync(new URL('./dados/midia.js', import.meta.url), '// Gerado por gerar-midia.mjs: arquivos de mídia prontos por peça.\nwindow.PLANO_MIDIA = ' + JSON.stringify(mapa, null, 1) + ';\n');
console.log(Object.keys(mapa).length, 'peças com mídia');
