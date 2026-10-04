// Texturas procedurais (canvas, semente fixa: todas as abas do render geram o mesmo resultado)
// e mapeamento triplanar em coordenadas de mundo, para caixas escaladas sem UV.
import * as THREE from 'three';

const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

type Ctx = CanvasRenderingContext2D;
const mk = (size: number, draw: (g: Ctx, s: number, r: () => number) => void, seed: number) => {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  draw(g, size, rng(seed));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
};

// Manchas suaves: ruído de baixa resolução ampliado com suavização (repetível nas bordas)
const blotch = (g: Ctx, s: number, r: () => number, cells: number, alpha: number, light: string, dark: string) => {
  const c = document.createElement('canvas');
  c.width = c.height = cells;
  const h = c.getContext('2d')!;
  for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) {
    const v = r();
    h.fillStyle = v > 0.5 ? light : dark;
    h.globalAlpha = Math.abs(v - 0.5) * 2;
    h.fillRect(x, y, 1, 1);
  }
  g.save();
  g.globalAlpha = alpha;
  g.imageSmoothingEnabled = true;
  for (const ox of [-s, 0, s]) for (const oy of [-s, 0, s]) g.drawImage(c, -s / cells / 2 + ox, -s / cells / 2 + oy, s + s / cells, s + s / cells);
  g.restore();
};
const speck = (g: Ctx, s: number, r: () => number, n: number, colors: string[], alpha: number, size = 1.6) => {
  g.save();
  for (let i = 0; i < n; i++) {
    g.globalAlpha = alpha * (0.4 + 0.6 * r());
    g.fillStyle = colors[Math.floor(r() * colors.length)];
    const z = size * (0.5 + r());
    g.fillRect(r() * s, r() * s, z, z);
  }
  g.restore();
};

export const makeTextures = () => {
  // Concreto aparente (3 m): manchas, poros e juntas de fôrma
  const concrete = mk(512, (g, s, r) => {
    g.fillStyle = '#f1f1ef'; g.fillRect(0, 0, s, s);
    blotch(g, s, r, 12, 0.35, '#ffffff', '#c9c9c4');
    blotch(g, s, r, 40, 0.18, '#ffffff', '#bdbdb8');
    speck(g, s, r, 9000, ['#9a9a95', '#ffffff', '#b5b5b0'], 0.35);
    g.fillStyle = 'rgba(80,80,78,.22)';
    for (let y = 0; y < s; y += s / 2.5) g.fillRect(0, y, s, 2);
    for (let x = 0; x < s; x += s / 1.25) g.fillRect(x, 0, 2, s);
    g.fillStyle = 'rgba(60,60,58,.35)';
    for (let y = s / 5; y < s; y += s / 2.5) for (let x = s / 5; x < s; x += s / 2.5) { g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); }
  }, 11);

  // Bloco cerâmico 29 x 19 cm com argamassa (1,2 m): cor própria, material branco
  const brick = mk(512, (g, s, r) => {
    const px = s / 1.2;
    g.fillStyle = '#9d968c'; g.fillRect(0, 0, s, s);
    const bw = 0.3 * px, bh = 0.2 * px, m = 0.012 * px;
    for (let row = 0; row < 6; row++) {
      const off = row % 2 ? bw / 2 : 0;
      for (let i = -1; i < 5; i++) {
        const t = r();
        const R = 176 + t * 30, G = 92 + t * 22, B = 58 + t * 14;
        g.fillStyle = `rgb(${R | 0},${G | 0},${B | 0})`;
        const x = i * bw + off;
        g.fillRect(x + m / 2, row * bh + m / 2, bw - m, bh - m);
        g.fillStyle = 'rgba(70,30,15,.18)';
        g.fillRect(x + m / 2, row * bh + bh - m * 1.6, bw - m, m);
      }
    }
    speck(g, s, r, 5000, ['#7a3e24', '#e09a74', '#5a2c1a'], 0.25);
  }, 23);

  // Grama urbana / terreno (8 m)
  const grass = mk(512, (g, s, r) => {
    g.fillStyle = '#7e8c5a'; g.fillRect(0, 0, s, s);
    blotch(g, s, r, 10, 0.55, '#9aa36a', '#5f6f42');
    blotch(g, s, r, 36, 0.3, '#a59f74', '#4f5f38');
    speck(g, s, r, 14000, ['#56663a', '#9fae6c', '#7b7450'], 0.45, 1.4);
  }, 37);

  // Terra do canteiro (5 m)
  const dirt = mk(512, (g, s, r) => {
    g.fillStyle = '#8a7158'; g.fillRect(0, 0, s, s);
    blotch(g, s, r, 10, 0.5, '#a08869', '#6b5440');
    blotch(g, s, r, 34, 0.3, '#9c8a72', '#5e4a38');
    speck(g, s, r, 12000, ['#5a4634', '#b9a487', '#7d7670', '#3f3226'], 0.5, 2);
  }, 41);

  // Asfalto (5 m)
  const asphalt = mk(512, (g, s, r) => {
    g.fillStyle = '#55595d'; g.fillRect(0, 0, s, s);
    blotch(g, s, r, 8, 0.35, '#62666a', '#45484c');
    speck(g, s, r, 16000, ['#3b3e41', '#7a7e82', '#2e3134'], 0.5, 1.5);
  }, 53);

  // Calçada em blocos de concreto 20 x 10 cm (1,2 m)
  const pavers = mk(512, (g, s, r) => {
    const px = s / 1.2;
    g.fillStyle = '#8f8f8a'; g.fillRect(0, 0, s, s);
    const bw = 0.2 * px, bh = 0.1 * px;
    for (let row = 0; row < 12; row++) for (let i = -1; i < 7; i++) {
      const t = r();
      const v = 196 + t * 26;
      g.fillStyle = `rgb(${v | 0},${(v - 2) | 0},${(v - 8) | 0})`;
      g.fillRect(i * bw + (row % 2 ? bw / 2 : 0) + 1.5, row * bh + 1.5, bw - 3, bh - 3);
    }
    speck(g, s, r, 6000, ['#9b9b96', '#ffffff'], 0.25);
  }, 61);

  // Fachada dos vizinhos: janelas em grade (6 m por 6,2 m de altura)
  const neighSide = mk(512, (g, s, r) => {
    g.fillStyle = '#ecebe6'; g.fillRect(0, 0, s, s);
    blotch(g, s, r, 10, 0.25, '#ffffff', '#cfcdc6');
    const fy = s / 2;
    for (let fl = 0; fl < 2; fl++) for (let b = 0; b < 2; b++) {
      const x = b * s / 2 + s * 0.08, y = fl * fy + fy * 0.24, w = s * 0.34, h = fy * 0.5;
      const t = r();
      g.fillStyle = '#4e5a63'; g.fillRect(x - 4, y - 4, w + 8, h + 8);
      const gr = g.createLinearGradient(x, y, x + w * 0.4, y + h);
      gr.addColorStop(0, `rgb(${70 + t * 40 | 0},${96 + t * 40 | 0},${118 + t * 30 | 0})`);
      gr.addColorStop(1, `rgb(${34 + t * 20 | 0},${48 + t * 20 | 0},${60 + t * 20 | 0})`);
      g.fillStyle = gr; g.fillRect(x, y, w, h);
      g.fillStyle = '#d9d8d2'; g.fillRect(x + w / 2 - 2, y, 4, h);
      g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(0, fl * fy + fy - 6, s, 6);
    }
  }, 71);

  // Ruído claro para pintura branca
  const paint = mk(256, (g, s, r) => {
    g.fillStyle = '#f7f7f5'; g.fillRect(0, 0, s, s);
    blotch(g, s, r, 8, 0.25, '#ffffff', '#dddcd6');
    speck(g, s, r, 2500, ['#e2e1db', '#ffffff'], 0.4, 1.2);
  }, 83);

  return {concrete, brick, grass, dirt, asphalt, pavers, neighSide, paint};
};

let triId = 0;
// Aplica textura em coordenadas de mundo (escala em metros por repetição)
export const triplanar = (mat: THREE.MeshStandardMaterial, side: THREE.Texture, scale: number, top?: THREE.Texture, topScale?: number) => {
  const id = triId++;
  mat.customProgramCacheKey = () => `tri${id}`;
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.tSide = {value: side};
    sh.uniforms.tTop = {value: top ?? side};
    sh.uniforms.sS = {value: 1 / scale};
    sh.uniforms.sT = {value: 1 / (topScale ?? scale)};
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTW;\nvarying vec3 vTN;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvTW = (modelMatrix * vec4(transformed, 1.0)).xyz;\nvTN = normalize(mat3(modelMatrix) * objectNormal);');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vTW;\nvarying vec3 vTN;\nuniform sampler2D tSide;\nuniform sampler2D tTop;\nuniform float sS;\nuniform float sT;')
      .replace('#include <map_fragment>', `
        vec3 bw = pow(abs(normalize(vTN)), vec3(6.0));
        bw /= (bw.x + bw.y + bw.z);
        vec4 tx = texture2D(tSide, vTW.zy * sS) * bw.x + texture2D(tTop, vTW.xz * sT) * bw.y + texture2D(tSide, vTW.xy * sS) * bw.z;
        diffuseColor.rgb *= tx.rgb;`);
  };
  return mat;
};
