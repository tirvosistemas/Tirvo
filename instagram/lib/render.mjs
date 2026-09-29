// Renderiza modelos HTML em JPEG (peças estáticas) ou MP4 (animações) com o Chromium do Playwright.
//
// O modelo pode declarar o formato e a duração:
//   <meta name="tirvo:formato" content="post">     post, quadrado, story ou reels (ou 1080x1350)
//   <meta name="tirvo:duracao" content="8">        segundos, só para vídeo
//
// Animações em CSS e na Web Animations API são controladas quadro a quadro. Para animações feitas
// em JavaScript, o modelo expõe window.tirvoQuadro(ms), chamada antes de cada quadro com o tempo exato.

import { execFileSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ffmpeg } from './midia.mjs';

export const FORMATOS = {
  post: [1080, 1350],
  quadrado: [1080, 1080],
  story: [1080, 1920],
  reels: [1080, 1920],
};

async function carregarPlaywright() {
  try {
    return await import('playwright');
  } catch {
    const global = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
    return createRequire(`${global}/`)('playwright');
  }
}

function lerFormato(valor) {
  if (!valor) return null;
  if (FORMATOS[valor]) return FORMATOS[valor];
  const m = String(valor).match(/^(\d+)x(\d+)$/);
  if (!m) throw new Error(`Formato inválido: ${valor}. Use post, quadrado, story, reels ou LARGURAxALTURA.`);
  return [Number(m[1]), Number(m[2])];
}

// Leva todas as animações ao instante t (em ms) e espera a página desenhar.
async function irPara(pagina, ms) {
  await pagina.evaluate(async t => {
    if (window.tirvoQuadro) await window.tirvoQuadro(t);
    for (const animacao of document.getAnimations()) {
      animacao.pause();
      animacao.currentTime = t;
    }
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, ms);
}

export async function renderizar(modelo, saida, opcoes = {}) {
  const video = extname(saida).toLowerCase() === '.mp4';
  const { chromium } = await carregarPlaywright();
  const navegador = await chromium.launch();
  try {
    const pagina = await navegador.newPage({ deviceScaleFactor: 1 });
    await pagina.goto(pathToFileURL(resolve(modelo)).href, { waitUntil: 'load' });

    const meta = await pagina.evaluate(() => ({
      formato: document.querySelector('meta[name="tirvo:formato"]')?.content,
      duracao: document.querySelector('meta[name="tirvo:duracao"]')?.content,
    }));
    const [largura, altura] = lerFormato(opcoes.formato || meta.formato) || FORMATOS.post;
    await pagina.setViewportSize({ width: largura, height: altura });
    await pagina.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode().catch(() => {})));
    });
    const faltando = await pagina.evaluate(() => [...document.fonts].filter(f => f.status === 'error').map(f => f.family));
    if (faltando.length) throw new Error(`Fontes que não carregaram: ${[...new Set(faltando)].join(', ')}`);

    if (!video) {
      // Sem --tempo, usa o fim das animações finitas (o estado final da peça).
      const tempo = opcoes.tempo ?? await pagina.evaluate(() => Math.max(0, ...document.getAnimations()
        .map(a => a.effect?.getComputedTiming().endTime)
        .filter(Number.isFinite)));
      await irPara(pagina, Number(tempo));
      await pagina.screenshot({ path: saida, type: 'jpeg', quality: 95 });
      return { largura, altura };
    }

    const segundos = Number(opcoes.duracao || meta.duracao);
    if (!segundos) throw new Error('Informe a duração do vídeo com --duracao ou <meta name="tirvo:duracao">.');
    const fps = Number(opcoes.fps || 30);
    const quadros = Math.round(segundos * fps);

    const codificador = spawn(ffmpeg(), [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
      '-map', '0:v', '-map', '1:a', '-shortest',
      '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-maxrate', '20M', '-bufsize', '40M',
      '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-r', String(fps), '-g', String(fps * 2),
      '-c:a', 'aac', '-b:a', '128k',
      '-movflags', '+faststart', saida,
    ], { stdio: ['pipe', 'ignore', 'pipe'] });
    let erroDoFfmpeg = '';
    codificador.stderr.on('data', d => { erroDoFfmpeg += d; });
    const terminou = new Promise((ok, falha) => codificador.on('close', c => (c === 0 ? ok() : falha(new Error(`ffmpeg falhou: ${erroDoFfmpeg.trim()}`)))));

    for (let i = 0; i < quadros; i++) {
      await irPara(pagina, (i * 1000) / fps);
      const quadro = await pagina.screenshot({ type: 'png' });
      if (!codificador.stdin.write(quadro)) await new Promise(r => codificador.stdin.once('drain', r));
      opcoes.aoAvancar?.(i + 1, quadros);
    }
    codificador.stdin.end();
    await terminou;
    return { largura, altura, segundos, fps };
  } finally {
    await navegador.close();
  }
}
