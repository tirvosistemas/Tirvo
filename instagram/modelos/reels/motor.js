// Motor dos Reels da Tirvo: monta as camadas fixas (fundo, HUD, transições, grão), controla tudo por
// uma linha do tempo do GSAP pausada e expõe window.tirvoQuadro(ms) para o render quadro a quadro.
// Tudo é função do tempo: o mesmo instante sempre gera o mesmo quadro.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const gsap = window.gsap;
gsap.registerPlugin(window.SplitText, window.CustomEase, window.DrawSVGPlugin);
gsap.ticker.lagSmoothing(0);
window.CustomEase.create('tirvo', 'M0,0 C0.16,1 0.3,1 1,1');
window.CustomEase.create('suave', 'M0,0 C0.65,0 0.35,1 1,1');

export const FPS = 30;
const SIMBOLOS = '01<>/{}#$%&*+=?';

export function semente(s) { let x = s % 2147483647 || 7; return () => (x = (x * 16807) % 2147483647) / 2147483647; }
const hash = (a, b = 0) => { let h = (a * 374761393 + b * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967295; };

export function iniciar(cfg) {
  const reel = document.querySelector('.reel');
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'tirvo' } });
  const sons = [];
  const aoQuadro = [];
  const carregando = [];
  const M = { tl, sons, cfg, reel, aoQuadro, THREE };
  window.__M = M;

  /* ---------- Camadas fixas ---------- */
  reel.insertAdjacentHTML('afterbegin', `
    <div id="fundo"><div class="base"></div><div class="brilho frio"></div><div class="brilho b1"></div><div class="brilho b2"></div>
      <div class="malha"></div><div class="teto"></div><div class="piso"></div><canvas id="particulas" width="1080" height="1920"></canvas><div id="glifos"></div></div>
    <div id="tres"></div><div id="veu"><i class="topo"></i><i class="base"></i></div>`);
  reel.insertAdjacentHTML('beforeend', `
    <div id="hud">
      <img class="logo-topo" data-logo>
      <div class="tc"><span class="rec"></span><span id="tc">00:00</span><span style="color:rgba(255,255,255,.25)">/</span><span>${fmt(cfg.duracao)}</span></div>
      <div class="capitulos">${(cfg.capitulos || [0]).map(() => '<i><b></b></i>').join('')}</div>
      <span class="canto c1"></span><span class="canto c2"></span><span class="canto c3"></span><span class="canto c4"></span>
      <svg class="regua-v" viewBox="0 0 30 1000"></svg>
      <div class="lateral">TIRVO_ · ENGENHARIA DIGITAL · CURITIBA — BR · ${cfg.id}</div>
      <div class="coord" id="coord"></div>
    </div>
    <div id="trans"><div class="cortina"></div><div class="flash"></div><div class="branco"></div><div class="varre"></div><div class="faixas"></div>
      <div class="mira-t"><i></i><i></i><i></i><i></i></div></div>
    <canvas id="grao2" width="540" height="960"></canvas><div id="vinheta2"></div><div id="aberracao"></div>`);

  document.querySelector('#hud .logo-topo').src = '../../../marca/tirvo-logo.svg';
  document.querySelector('#hud .logo-topo').alt = 'Tirvo';

  // Régua vertical da esquerda
  let r = '';
  for (let y = 0; y <= 1000; y += 20) r += `<path d="M${y % 100 === 0 ? 4 : 14} ${y + .5}H30" stroke="rgba(255,255,255,${y % 100 === 0 ? .3 : .12})" stroke-width="1"/>`;
  r += '<rect id="regua-m" x="0" y="0" width="30" height="3" fill="#ff5500"/>';
  document.querySelector('.regua-v').innerHTML = r;

  // Glifos de código nas bordas
  const rg = semente(cfg.semente || 11);
  const glifos = [];
  const gl = document.getElementById('glifos');
  for (let i = 0; i < 26; i++) {
    const lado = i % 4;
    const len = 5 + Math.floor(rg() * 9);
    const el = document.createElement('span');
    const vertical = lado < 2;
    let x, y;
    if (lado === 0) { x = 76 + rg() * 30; y = 380 + rg() * 1100; }
    else if (lado === 1) { x = 990 + rg() * 40; y = 380 + rg() * 700; }
    else if (lado === 2) { x = 120 + rg() * 760; y = 360 + rg() * 30; }
    else { x = 120 + rg() * 760; y = 1500 + rg() * 30; }
    if (rg() < .5 && lado >= 2) continue;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    if (vertical) { el.style.writingMode = 'vertical-rl'; }
    if (rg() < .22) el.className = 'q';
    gl.appendChild(el);
    glifos.push({ el, len, sem: Math.floor(rg() * 9999), vel: .4 + rg() * .9, fase: rg() * 6 });
  }

  // Partículas (poeira e brasas) em canvas 2D
  const pc = document.getElementById('particulas').getContext('2d');
  const rp = semente((cfg.semente || 11) + 99);
  const parts = Array.from({ length: cfg.particulas ?? 90 }, () => ({
    x: rp() * 1080, y: rp() * 1920, z: rp(), vx: (rp() - .5) * 14, vy: -6 - rp() * 26, laranja: rp() < .3, f: rp() * 6,
  }));
  const sprite = (cor) => {
    const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, cor); gr.addColorStop(.25, cor.replace(/[\d.]+\)$/, '.5)')); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return c;
  };
  const spB = sprite('rgba(255,255,255,1)'), spL = sprite('rgba(255,130,60,1)');

  // Grão animado
  const gc = document.getElementById('grao2').getContext('2d');
  const ruidos = Array.from({ length: 6 }, (_, k) => {
    const c = document.createElement('canvas'); c.width = 540; c.height = 960; const g = c.getContext('2d');
    const im = g.createImageData(540, 960); const rr = semente(77 + k);
    for (let i = 0; i < im.data.length; i += 4) { const v = rr() * 255; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
    g.putImageData(im, 0, 0); return c;
  });

  /* ---------- Atualização por quadro (camadas que não estão na timeline) ---------- */
  const capEls = [...document.querySelectorAll('#hud .capitulos b')];
  const caps = cfg.capitulos || [0];
  M.estado = { particulas: 1, piso: 1, glifos: 1, velPiso: 40 };
  function atualizarFixos(t) {
    const q = Math.round(t * FPS);
    document.getElementById('tc').textContent = fmt(t);
    capEls.forEach((b, i) => {
      const a = caps[i], z = caps[i + 1] ?? cfg.duracao;
      const p = Math.min(1, Math.max(0, (t - a) / (z - a)));
      b.style.transform = `scaleX(${p})`;
    });
    document.getElementById('regua-m').setAttribute('y', (t / cfg.duracao) * 997);
    document.getElementById('coord').innerHTML = `X ${String(540 + Math.round(Math.sin(t * .7) * 120)).padStart(4, '0')} · Y ${String(960 + Math.round(Math.cos(t * .5) * 160)).padStart(4, '0')}<br><b>●</b> ${cfg.rotuloHud || 'tirvo.tech'}`;
    // Piso andando
    document.querySelector('#fundo .piso').style.backgroundPosition = `0 ${(t * M.estado.velPiso) % 96}px`;
    document.querySelector('#fundo .piso').style.opacity = M.estado.piso;
    document.querySelector('#fundo .teto').style.backgroundPosition = `0 ${-(t * M.estado.velPiso * .5) % 96}px`;
    // Glifos
    gl.style.opacity = M.estado.glifos;
    for (const g of glifos) {
      let s = '';
      const passo = Math.floor(t * 10 * g.vel);
      for (let k = 0; k < g.len; k++) s += SIMBOLOS[Math.floor(hash(g.sem + k, Math.floor(passo / (1 + (k % 3)))) * SIMBOLOS.length)];
      g.el.textContent = s;
      g.el.style.opacity = (.35 + .65 * (.5 + .5 * Math.sin(t * g.vel + g.fase))).toFixed(3);
    }
    // Partículas
    pc.clearRect(0, 0, 1080, 1920);
    pc.globalAlpha = 1;
    for (const p of parts) {
      const tam = 3 + p.z * 22;
      let x = (p.x + p.vx * t * (.4 + p.z)) % 1180; if (x < -50) x += 1180;
      let y = (p.y + p.vy * t * (.4 + p.z)) % 2020; if (y < -50) y += 2020;
      const brilho = (.25 + .75 * (.5 + .5 * Math.sin(t * 1.6 + p.f))) * (p.laranja ? .9 : .45) * (.3 + p.z * .7) * M.estado.particulas;
      pc.globalAlpha = brilho;
      pc.drawImage(p.laranja ? spL : spB, x - tam, y - tam, tam * 2, tam * 2);
    }
    // Grão
    gc.clearRect(0, 0, 540, 960);
    const rr = ruidos[q % 6];
    const ox = Math.floor(hash(q, 3) * 200), oy = Math.floor(hash(q, 5) * 200);
    gc.drawImage(rr, -ox, -oy); gc.drawImage(rr, 540 - ox, -oy); gc.drawImage(rr, -ox, 960 - oy); gc.drawImage(rr, 540 - ox, 960 - oy);
  }

  /* ---------- API de animação ---------- */
  M.som = (t, nome, vol = 1) => { sons.push({ t, nome, vol }); };

  // Mostra uma cena entre t0 e t1
  M.cena = (sel, t0, t1) => {
    const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    tl.set(el, { visibility: 'visible' }, t0);
    if (t1 != null) tl.set(el, { visibility: 'hidden' }, t1);
    return el;
  };

  // Linhas de título sobem de dentro de uma máscara
  M.sobe = (el, t, o = {}) => {
    const alvos = el.querySelectorAll('.linha > span');
    tl.fromTo(alvos, { yPercent: 115, rotate: o.giro ?? 3, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, duration: o.dur ?? .9, stagger: o.stagger ?? .09, ease: 'expo.out' }, t);
    return el;
  };
  M.desce = (el, t, o = {}) => {
    const alvos = el.querySelectorAll('.linha > span');
    tl.to(alvos, { yPercent: -110, opacity: 0, duration: o.dur ?? .4, stagger: .04, ease: 'power3.in' }, t);
  };

  // Palavras entram com desfoque
  M.palavras = (el, t, o = {}) => {
    const sp = new window.SplitText(el, { type: 'words', wordsClass: 'pl' });
    tl.fromTo(sp.words, { opacity: 0, y: o.y ?? 26, filter: 'blur(10px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: o.dur ?? .6, stagger: o.stagger ?? .045, ease: 'power3.out' }, t);
    return sp;
  };
  M.letras = (el, t, o = {}) => {
    const sp = new window.SplitText(el, { type: 'words,chars', charsClass: 'lt', wordsClass: 'pl' });
    tl.fromTo(sp.chars, { opacity: 0, yPercent: o.y ?? 60, rotateX: -80, transformOrigin: '50% 100%' }, { opacity: 1, yPercent: 0, rotateX: 0, duration: o.dur ?? .7, stagger: o.stagger ?? .025, ease: 'back.out(1.6)' }, t);
    return sp;
  };

  // Decodificação: símbolos de código se embaralham até formar o texto
  M.decod = (el, t, dur = .9, som = true) => {
    const final = el.textContent;
    const n = final.length;
    el.style.opacity = 0;
    const obj = { p: 0 };
    tl.set(el, { opacity: 1 }, t);
    tl.fromTo(obj, { p: 0 }, {
      p: 1, duration: dur, ease: 'none',
      onUpdate() {
        const p = obj.p, q = Math.round(tl.time() * FPS);
        let s = '';
        for (let i = 0; i < n; i++) {
          const c = final[i];
          if (c === ' ' || c === '\n') { s += c; continue; }
          const lim = (i / n) * .75;
          if (p >= lim + .25) s += c;
          else if (p >= lim) s += SIMBOLOS[Math.floor(hash(i, q) * SIMBOLOS.length)];
          else s += ' ';
        }
        el.textContent = s;
      },
      onReverseComplete() { el.textContent = ' '.repeat(n); },
    }, t);
    if (som) M.som(t, 'decodificar', .35);
    return el;
  };

  // Contador numérico
  M.conta = (el, t, dur, de, ate, f = (v) => Math.round(v)) => {
    const o = { v: de };
    tl.fromTo(o, { v: de }, { v: ate, duration: dur, ease: 'power2.out', onUpdate() { el.textContent = f(o.v); } }, t);
  };

  // Divisor com o traço laranja que se desenha
  M.divisor = (el, t, dur = .8) => { tl.fromTo(el, { '--d': 0 }, { '--d': 1, duration: dur, ease: 'expo.out' }, t); };

  // Entrada genérica de bloco
  M.entra = (el, t, o = {}) => {
    const de = { opacity: 0, y: o.y ?? 50, x: o.x ?? 0, scale: o.scale ?? 1, filter: `blur(${o.blur ?? 12}px)`, rotate: o.giro ?? 0 };
    tl.fromTo(el, de, { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0, filter: 'blur(0px)', duration: o.dur ?? .8, ease: o.ease ?? 'expo.out', stagger: o.stagger ?? 0 }, t);
    if (o.som) M.som(t, o.som, o.vol ?? .5);
  };
  M.sai = (el, t, o = {}) => {
    tl.to(el, { opacity: 0, y: o.y ?? -40, scale: o.scale ?? 1, filter: `blur(${o.blur ?? 10}px)`, duration: o.dur ?? .35, ease: 'power2.in', stagger: o.stagger ?? 0 }, t);
  };

  // Véu escuro sobre o 3D, para o texto ler bem (topo ou base)
  M.veu = (t, topo, base, dur = .6) => { tl.to('#veu .topo', { opacity: topo, duration: dur, ease: 'power2.inOut' }, t); tl.to('#veu .base', { opacity: base, duration: dur, ease: 'power2.inOut' }, t); };

  /* ---------- Transições ---------- */
  const palco = document.getElementById('palco');
  M.trans = (t, tipo = 'flash', o = {}) => {
    const T = document.getElementById('trans');
    if (tipo === 'flash') {
      tl.fromTo(T.querySelector('.flash'), { opacity: 0 }, { immediateRender: false,  opacity: o.forca ?? .9, duration: .07, ease: 'none' }, t - .07)
        .to(T.querySelector('.flash'), { opacity: 0, duration: .45, ease: 'power2.out' }, t);
      tl.fromTo(palco, { scale: 1.07, filter: 'blur(10px) brightness(1.6)' }, { immediateRender: false,  scale: 1, filter: 'blur(0px) brightness(1)', duration: .55, ease: 'expo.out' }, t);
      tl.fromTo('#aberracao', { opacity: 1 }, { immediateRender: false,  opacity: 0, duration: .5 }, t);
      M.som(t - .25, 'whoosh', .55);
    } else if (tipo === 'varre') {
      tl.fromTo(T.querySelector('.varre'), { x: 0, opacity: 1 }, { immediateRender: false,  x: 1880, duration: .5, ease: 'power2.inOut' }, t - .25)
        .set(T.querySelector('.varre'), { opacity: 0 }, t + .26);
      tl.fromTo(palco, { x: 40, filter: 'blur(6px)' }, { immediateRender: false,  x: 0, filter: 'blur(0px)', duration: .5, ease: 'expo.out' }, t);
      M.som(t - .3, 'whoosh', .5);
    } else if (tipo === 'glitch') {
      const F = T.querySelector('.faixas');
      const rr = semente(Math.round(t * 1000));
      let html = '';
      for (let i = 0; i < 9; i++) html += `<i style="top:${Math.round(rr() * 1900)}px;height:${Math.round(4 + rr() * 60)}px;opacity:${(.3 + rr() * .7).toFixed(2)};transform:translateX(${Math.round((rr() - .5) * 160)}px)"></i>`;
      tl.call(() => { F.innerHTML = html; }, null, t - .1);
      tl.set(F, { opacity: 1 }, t - .1).set(F, { opacity: 0 }, t + .12);
      const xs = [26, -18, 12, -30, 8, 0];
      xs.forEach((x, i) => tl.set(palco, { x, filter: i < 5 ? 'hue-rotate(-12deg) saturate(1.4)' : 'none' }, t - .1 + i / FPS));
      tl.fromTo('#aberracao', { opacity: 1 }, { immediateRender: false,  opacity: 0, duration: .3 }, t);
      M.som(t - .1, 'glitch', .6);
    } else if (tipo === 'mira') {
      const C = T.querySelector('.mira-t'), I = C.querySelectorAll('i');
      tl.set(C, { opacity: 1 }, t - .45);
      const fora = [[-130, 200], [1090, 200], [-130, 1600], [1090, 1600]], dentro = [[400, 820], [560, 820], [400, 980], [560, 980]];
      I.forEach((el, k) => {
        tl.fromTo(el, { x: fora[k][0], y: fora[k][1] }, { immediateRender: false,  x: dentro[k][0], y: dentro[k][1], duration: .45, ease: 'power3.in' }, t - .45)
          .to(el, { x: fora[k][0], y: fora[k][1], duration: .6, ease: 'expo.out' }, t + .05);
      });
      tl.fromTo(T.querySelector('.cortina'), { opacity: 0 }, { immediateRender: false,  opacity: .85, duration: .4, ease: 'power2.in' }, t - .4).to(T.querySelector('.cortina'), { opacity: 0, duration: .5 }, t + .05);
      tl.set(C, { opacity: 0 }, t + .7);
      M.som(t - .45, 'whoosh-longo', .6); M.som(t, 'clique', .7);
    } else if (tipo === 'zoom') {
      tl.fromTo(palco, { scale: .86, filter: 'blur(14px)', opacity: .2 }, { immediateRender: false,  scale: 1, filter: 'blur(0px)', opacity: 1, duration: .6, ease: 'expo.out' }, t);
      tl.fromTo(T.querySelector('.branco'), { opacity: .5 }, { immediateRender: false,  opacity: 0, duration: .4 }, t);
      M.som(t - .3, 'whoosh-longo', .5);
    } else if (tipo === 'corte') {
      tl.fromTo(T.querySelector('.branco'), { opacity: .7 }, { immediateRender: false,  opacity: 0, duration: .25 }, t);
      M.som(t, 'impacto', .7);
    }
  };

  /* ---------- 3D ---------- */
  M.tres = (montar, o = {}) => {
    const escala = o.escala ?? .8;
    const W = Math.round(1080 * escala), H = Math.round(1920 * escala);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1); renderer.setSize(W, H, false); renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = o.exposicao ?? 1;
    document.getElementById('tres').appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
    scene.environmentIntensity = o.ambiente ?? .9;
    const camera = new THREE.PerspectiveCamera(o.fov ?? 32, 1080 / 1920, .1, 400);
    camera.position.set(0, 0, 20);
    const rt = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, samples: 4 });
    const composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(new THREE.Vector2(W, H), o.bloom ?? .55, o.raio ?? .55, o.limiar ?? .72);
    composer.addPass(bloom);
    composer.addPass(new OutputPass());
    const ctx = { THREE, scene, camera, renderer, composer, bloom, M, RoundedBoxGeometry, textura: texturaCanvas, imagem: carregarImagem };
    M.ctx3 = ctx;
    const r = montar(ctx);
    carregando.push(Promise.resolve(r).then((atualizar) => { M.render3d = (t) => { if (atualizar) atualizar(t); composer.render(); }; }));
    return ctx;
  };

  function texturaCanvas(w, h, desenhar) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    desenhar(c.getContext('2d'), w, h);
    const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; tx.anisotropy = 8;
    return tx;
  }
  function carregarImagem(src) {
    const p = new Promise((ok) => { const im = new Image(); im.onload = () => ok(im); im.onerror = () => ok(null); im.src = src; });
    carregando.push(p);
    return p;
  }

  /* ---------- Quadro ---------- */
  let ultimo = 0;
  window.tirvoQuadro = async (ms) => {
    const t = ms / 1000;
    // Voltar no tempo passa por zero, para todos os tweens anteriores serem refeitos na ordem
    if (t < ultimo) tl.seek(0, false);
    ultimo = t;
    tl.seek(t, false);
    atualizarFixos(t);
    for (const f of aoQuadro) f(t);
    if (M.render3d) M.render3d(t);
  };
  M.pronto = () => {
    window.tirvoInfo = { id: cfg.id, duracao: cfg.duracao, fps: FPS, capa: cfg.capa ?? 1.5, sons, trilha: cfg.trilha, volumeTrilha: cfg.volumeTrilha ?? .8 };
    window.tirvoPronto = Promise.all([document.fonts.ready, window.tirvoPronto, ...carregando]).then(() => window.tirvoQuadro(0));
  };
  return M;
}

function fmt(t) { const s = Math.floor(t); return `00:${String(s).padStart(2, '0')}`; }
