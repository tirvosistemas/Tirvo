// A API do Instagram só aceita mídia por URL pública. Na hora de publicar, os arquivos aprovados
// vão para instagram/midia/<id>/, entram em um commit enviado ao GitHub e são servidos pelo
// raw.githubusercontent.com a partir do hash do commit, que não muda depois.
// A pasta instagram/ fica fora do site pelo _config.yml, então nada disso aparece em tirvo.tech.

import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { PASTA_INSTAGRAM, caminhoDaMidia } from './rascunhos.mjs';

const RAIZ = join(PASTA_INSTAGRAM, '..');
const esperar = ms => new Promise(r => setTimeout(r, ms));

function git(args) {
  return execFileSync('git', args, { cwd: RAIZ, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function repositorioNoGitHub() {
  const remoto = git(['remote', 'get-url', 'origin']);
  const achado = remoto.match(/github\.com[/:]([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
  if (!achado) throw new Error(`O remoto origin não aponta para o GitHub: ${remoto}`);
  return { dono: achado[1], nome: achado[2] };
}

async function enviar(ramo) {
  for (let tentativa = 1; ; tentativa++) {
    try {
      git(['push', '-u', 'origin', ramo]);
      return;
    } catch (e) {
      if (tentativa >= 5) throw new Error(`Não foi possível enviar o commit ao GitHub: ${e.stderr || e.message}`);
      await esperar(2000 * 2 ** (tentativa - 1));
    }
  }
}

async function aguardarUrl(url) {
  for (let tentativa = 1; tentativa <= 20; tentativa++) {
    const resposta = await fetch(url, { method: 'HEAD' }).catch(() => null);
    if (resposta?.ok) return;
    await esperar(3000);
  }
  throw new Error(`A mídia não ficou acessível em ${url}. O repositório precisa ser público para o Instagram buscar o arquivo.`);
}

export async function hospedar(rascunho, { trailers = [] } = {}) {
  const arquivos = [...rascunho.midias, ...(rascunho.capa ? [rascunho.capa] : [])];
  const pasta = join(PASTA_INSTAGRAM, 'midia', rascunho.id);
  const caminhoNoRepo = relative(RAIZ, pasta);
  mkdirSync(pasta, { recursive: true });
  for (const nome of arquivos) copyFileSync(caminhoDaMidia(rascunho, nome), join(pasta, nome));

  git(['add', '--', caminhoNoRepo]);
  const pendente = git(['status', '--porcelain', '--', caminhoNoRepo]);
  if (pendente) {
    const mensagem = [`Mídia do Instagram: ${rascunho.id}`, '', `Arquivos aprovados para publicar (${rascunho.tipo}).`];
    git(['commit', '-m', mensagem.join('\n'), ...trailers.flatMap(t => ['--trailer', t]), '--', caminhoNoRepo]);
  }
  const ramo = git(['rev-parse', '--abbrev-ref', 'HEAD']);
  if (ramo === 'HEAD') throw new Error('O repositório está sem ramo ativo. Faça checkout de um ramo antes de publicar.');
  await enviar(ramo);

  const commit = git(['rev-parse', 'HEAD']);
  const { dono, nome } = repositorioNoGitHub();
  const urls = {};
  for (const arquivo of arquivos) {
    urls[arquivo] = `https://raw.githubusercontent.com/${dono}/${nome}/${commit}/${caminhoNoRepo}/${arquivo}`;
    await aguardarUrl(urls[arquivo]);
  }
  return { commit, ramo, urls };
}
