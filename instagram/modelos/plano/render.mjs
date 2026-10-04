// node render.mjs <ID> [<ID> …] -> renderiza instagram/modelos/plano/<ID>.html em instagram/plano-30-dias/midia/<ID>/NN.jpg
// O número de slides vem de <meta name="tirvo:slides">; o tamanho, de <meta name="tirvo:formato"> (feed 1350 ou story 1920).
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
const { chromium } = createRequire(execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim() + '/')('playwright');
const aqui = dirname(fileURLToPath(import.meta.url));
const b = await chromium.launch();
for (const id of process.argv.slice(2)) {
  const arq = resolve(aqui, id + '.html');
  const html = readFileSync(arq, 'utf8');
  const n = +(html.match(/name="tirvo:slides" content="(\d+)"/) || [0, 1])[1];
  const story = /name="tirvo:formato" content="story"/.test(html);
  const p = await b.newPage({ viewport: { width: 1080, height: story ? 1920 : 1350 }, deviceScaleFactor: 1 });
  const erros = [];
  p.on('pageerror', (e) => erros.push(e.message));
  p.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
  const out = resolve(aqui, '../../plano-30-dias/midia', id);
  rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
  for (let s = 1; s <= n; s++) {
    await p.goto(pathToFileURL(arq).href + '?s=' + s, { waitUntil: 'load' });
    await p.evaluate(async () => { await document.fonts.ready; if (window.tirvoPronto) await window.tirvoPronto; await Promise.all([...document.images].map((i) => i.decode().catch(() => {}))); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); });
    await p.screenshot({ path: resolve(out, String(s).padStart(2, '0') + '.jpg'), type: 'jpeg', quality: 90 });
  }
  console.log(id, n, story ? 'story' : 'feed', erros.length ? erros : 'ok');
  await p.close();
}
await b.close();
