// Leitura e conversão de imagens e vídeos para os formatos que a API aceita.

import { execFileSync, spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, openSync, readSync, closeSync, statSync } from 'node:fs';
import { extname } from 'node:path';

let caminhoDoFfmpeg;

// Usa o ffmpeg indicado em FFMPEG, o do PATH ou o do pacote Python imageio-ffmpeg, que traz libx264.
export function ffmpeg() {
  if (caminhoDoFfmpeg) return caminhoDoFfmpeg;
  const candidatos = [process.env.FFMPEG, 'ffmpeg'];
  try {
    candidatos.push(execFileSync('python3', ['-c', 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim());
  } catch {}
  for (const c of candidatos.filter(Boolean)) {
    if (spawnSync(c, ['-hide_banner', '-version'], { stdio: 'ignore' }).status === 0) return (caminhoDoFfmpeg = c);
  }
  throw new Error('ffmpeg não encontrado. Instale com: pip install imageio-ffmpeg');
}

export function rodarFfmpeg(args) {
  const r = spawnSync(ffmpeg(), ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`ffmpeg falhou: ${r.stderr.trim().split('\n').slice(-3).join(' ')}`);
}

const IMAGENS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const VIDEOS = new Set(['.mp4', '.mov']);

export function tipoDoArquivo(arquivo) {
  const ext = extname(arquivo).toLowerCase();
  if (IMAGENS.has(ext)) return 'imagem';
  if (VIDEOS.has(ext)) return 'video';
  throw new Error(`Formato não suportado: ${arquivo}. Use JPEG, PNG, WebP, MP4 ou MOV.`);
}

function lerInicio(arquivo, bytes) {
  const fd = openSync(arquivo, 'r');
  const buf = Buffer.alloc(bytes);
  const lidos = readSync(fd, buf, 0, bytes, 0);
  closeSync(fd);
  return buf.subarray(0, lidos);
}

// Lê as dimensões de um JPEG percorrendo os marcadores até o SOF.
function dimensoesJpeg(arquivo) {
  const buf = lerInicio(arquivo, Math.min(statSync(arquivo).size, 1 << 20));
  if (buf[0] !== 0xff || buf[1] !== 0xd8) throw new Error(`${arquivo} não é um JPEG válido.`);
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const marcador = buf[i + 1];
    if (marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador)) {
      return { altura: buf.readUInt16BE(i + 5), largura: buf.readUInt16BE(i + 7), progressivo: marcador === 0xc2 };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  throw new Error(`Não foi possível ler as dimensões de ${arquivo}.`);
}

export function inspecionarImagem(arquivo) {
  const { largura, altura } = dimensoesJpeg(arquivo);
  return { tipo: 'imagem', largura, altura, bytes: statSync(arquivo).size };
}

// Verifica se o átomo moov vem antes do mdat, o que permite ao Instagram ler o vídeo sem baixá-lo inteiro.
function temInicioRapido(arquivo) {
  const tamanho = statSync(arquivo).size;
  const fd = openSync(arquivo, 'r');
  const cabecalho = Buffer.alloc(16);
  let posicao = 0;
  try {
    while (posicao + 8 <= tamanho) {
      readSync(fd, cabecalho, 0, 16, posicao);
      let tamanhoDoAtomo = cabecalho.readUInt32BE(0);
      const nome = cabecalho.toString('latin1', 4, 8);
      if (tamanhoDoAtomo === 1) tamanhoDoAtomo = Number(cabecalho.readBigUInt64BE(8));
      if (tamanhoDoAtomo === 0) tamanhoDoAtomo = tamanho - posicao;
      if (nome === 'moov') return true;
      if (nome === 'mdat') return false;
      if (tamanhoDoAtomo < 8) return false;
      posicao += tamanhoDoAtomo;
    }
    return false;
  } finally {
    closeSync(fd);
  }
}

export function inspecionarVideo(arquivo) {
  const r = spawnSync(ffmpeg(), ['-hide_banner', '-i', arquivo], { encoding: 'utf8' });
  const saida = r.stderr;
  const duracao = saida.match(/Duration: (\d+):(\d+):([\d.]+)/);
  const video = saida.match(/Stream #\S+.*?Video: (\w+).*?, (\w+)(?:\([^)]*\))?, (\d+)x(\d+)/);
  const fps = saida.match(/, ([\d.]+) fps/);
  const audio = saida.match(/Stream #\S+.*?Audio: (\w+).*?, (\d+) Hz/);
  if (!duracao || !video) throw new Error(`Não foi possível ler o vídeo ${arquivo}.`);
  return {
    tipo: 'video',
    segundos: Number(duracao[1]) * 3600 + Number(duracao[2]) * 60 + Number(duracao[3]),
    codec: video[1],
    formatoDePixel: video[2],
    largura: Number(video[3]),
    altura: Number(video[4]),
    fps: fps ? Number(fps[1]) : null,
    audio: audio ? { codec: audio[1], hz: Number(audio[2]) } : null,
    inicioRapido: temInicioRapido(arquivo),
    bytes: statSync(arquivo).size,
  };
}

export function inspecionar(arquivo) {
  if (!existsSync(arquivo)) throw new Error(`Arquivo não encontrado: ${arquivo}`);
  return tipoDoArquivo(arquivo) === 'imagem' ? inspecionarImagem(arquivo) : inspecionarVideo(arquivo);
}

// A API só aceita JPEG. PNG e WebP viram JPEG de alta qualidade; JPEG é copiado como está.
export function prepararImagem(origem, destino) {
  const ext = extname(origem).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') {
    copyFileSync(origem, destino);
    return;
  }
  rodarFfmpeg(['-i', origem, '-frames:v', '1', '-q:v', '1', '-pix_fmt', 'yuvj444p', destino]);
}

// Garante H.264 em yuv420p com áudio AAC e início rápido. Só recodifica o que precisar.
export function prepararVideo(origem, destino) {
  const info = inspecionarVideo(origem);
  const videoOk = ['h264', 'hevc'].includes(info.codec) && info.formatoDePixel === 'yuv420p' && info.fps >= 23 && info.fps <= 60;
  const audioOk = info.audio && info.audio.codec === 'aac' && info.audio.hz <= 48000;
  const args = ['-i', origem];
  if (!info.audio) args.push('-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest');
  args.push('-map', '0:v:0', '-map', info.audio ? '0:a:0' : '1:a:0');
  args.push(...(videoOk ? ['-c:v', 'copy'] : ['-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-maxrate', '20M', '-bufsize', '40M', '-pix_fmt', 'yuv420p', '-r', String(Math.min(Math.max(Math.round(info.fps || 30), 23), 60))]));
  args.push(...(audioOk ? ['-c:a', 'copy'] : ['-c:a', 'aac', '-b:a', '128k', '-ar', '48000']));
  args.push('-map_metadata', '-1', '-movflags', '+faststart', destino);
  rodarFfmpeg(args);
  return { recodificado: !videoOk, audioAdicionado: !info.audio };
}
