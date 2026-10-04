// node render.mjs <ID> [--de s] [--ate s] [--quadros s1,s2,...] [--rapido]
// Renderiza instagram/modelos/reels/<ID>.html em MP4 1080x1920 a 30 fps, mixa trilha e efeitos e salva a capa.
// Saída: instagram/plano-30-dias/midia/<ID>/01.mp4 (vídeo) e 02.jpg (capa).
// --quadros só tira fotos dos instantes pedidos (para conferir), sem gerar vídeo.
import { createRequire } from 'node:module';
import { execFileSync, spawn } from 'node:child_process';
import http from 'node:http';
import { readFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim() + '/')('playwright');
const FF = '/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '../../..');
const TIPOS = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.html': 'text/html', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.woff2': 'font/woff2', '.json': 'application/json' };

const args = process.argv.slice(2);
const id = args[0];
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
const quadros = opt('--quadros');

const srv = http.createServer(async (q, r) => {
  try {
    const f = join(RAIZ, decodeURIComponent(q.url.split('?')[0]));
    r.writeHead(200, { 'content-type': TIPOS[extname(f)] || 'application/octet-stream' });
    r.end(await readFile(f));
  } catch { r.writeHead(404); r.end(); }
});
await new Promise((ok) => srv.listen(0, ok));
const porta = srv.address().port;

const b = await chromium.launch({ args: ['--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-vsync'] });
const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
const erros = [];
p.on('pageerror', (e) => erros.push(e.message));
p.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
await p.goto(`http://localhost:${porta}/instagram/modelos/reels/${id}.html`, { waitUntil: 'load' });
await p.waitForFunction(() => window.tirvoInfo && window.tirvoPronto, null, { timeout: 30000 });
await p.evaluate(() => window.tirvoPronto);
const info = await p.evaluate(() => window.tirvoInfo);
if (erros.length) console.log(id, 'avisos:', erros);

const ir = (ms) => p.evaluate(async (t) => { await window.tirvoQuadro(t); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }, ms);
const SCR = '/tmp/claude-0/-home-user-Tirvo/c4119cb9-f149-5c39-8eb4-88ffa71df1f6/scratchpad/reels';

if (quadros) {
  await mkdir(SCR, { recursive: true });
  for (const s of quadros.split(',').map(Number)) {
    await ir(s * 1000);
    await p.screenshot({ path: `${SCR}/${id}-${String(s).replace('.', '_')}.jpg`, type: 'jpeg', quality: 85 });
  }
  console.log(id, 'quadros em', SCR);
} else {
  const fps = info.fps;
  const de = Number(opt('--de') ?? 0), ate = Number(opt('--ate') ?? info.duracao);
  const total = Math.round((ate - de) * fps);
  const OUT = resolve(RAIZ, 'instagram/plano-30-dias/midia', id);
  const TMP = resolve(AQUI, 'saida'); await mkdir(TMP, { recursive: true });
  const mudo = `${TMP}/${id}-mudo.mp4`;
  const soAudio = args.includes('--audio') && existsSync(mudo);
  if (!soAudio) { await rm(OUT, { recursive: true, force: true }); }
  await mkdir(OUT, { recursive: true });
  const t0 = Date.now();
  if (!soAudio) {
  const enc = spawn(FF, ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '14', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(fps), '-g', String(fps), mudo], { stdio: ['pipe', 'ignore', 'pipe'] });
  let errEnc = ''; enc.stderr.on('data', (d) => { errEnc += d; });
  const fim = new Promise((ok, falha) => enc.on('close', (c) => (c === 0 ? ok() : falha(new Error(errEnc)))));
  for (let i = 0; i < total; i++) {
    await ir(de * 1000 + (i * 1000) / fps);
    const img = await p.screenshot({ type: 'jpeg', quality: 93 });
    if (!enc.stdin.write(img)) await new Promise((r) => enc.stdin.once('drain', r));
    if (i % 60 === 0) console.log(id, `${i}/${total}`, `${((Date.now() - t0) / (i + 1)).toFixed(0)} ms/quadro`);
  }
  enc.stdin.end(); await fim;
  }

  // Capa
  await ir(info.capa * 1000);
  await p.screenshot({ path: `${OUT}/02.jpg`, type: 'jpeg', quality: 92 });

  // Áudio: trilha + efeitos, normalizado para -14 LUFS
  const trilha = resolve(AQUI, 'audio', info.trilha);
  const dur = ate - de;
  const ins = ['-i', mudo, '-i', trilha];
  const filtros = [`[1:a]atrim=${de}:${de + dur + .5},asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.25,afade=t=out:st=${(dur - 1.4).toFixed(2)}:d=1.4,volume=${info.volumeTrilha}[m]`];
  const rotulos = ['[m]'];
  let k = 2;
  for (const s of info.sons) {
    const arq = resolve(AQUI, 'audio/sfx', s.nome + '.mp3');
    if (!existsSync(arq)) { console.log(id, 'efeito ausente:', s.nome); continue; }
    const ms = Math.max(0, Math.round((s.t - de) * 1000));
    if (ms > dur * 1000) continue;
    ins.push('-i', arq);
    filtros.push(`[${k}:a]adelay=${ms}|${ms},volume=${s.vol}[s${k}]`);
    rotulos.push(`[s${k}]`); k++;
  }
  filtros.push(`${rotulos.join('')}amix=inputs=${rotulos.length}:normalize=0:dropout_transition=0,atrim=0:${dur},loudnorm=I=-14:TP=-1.2:LRA=11,aresample=48000[a]`);
  execFileSync(FF, ['-hide_banner', '-loglevel', 'error', '-y', ...ins, '-filter_complex', filtros.join(';'), '-map', '0:v', '-map', '[a]',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '21', '-maxrate', '3.6M', '-bufsize', '7.2M', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', `${OUT}/01.mp4`]);
  console.log(id, 'pronto', `${((Date.now() - t0) / 1000).toFixed(0)} s`, info.sons.length, 'efeitos');
}
await b.close(); srv.close();
