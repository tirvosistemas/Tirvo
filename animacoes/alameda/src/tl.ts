// Linha do tempo (30 fps) e utilidades de animação
export const FPS = 30;
export const DUR = 1260;

export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const prog = (f: number, a: number, b: number) => clamp01((f - a) / (b - a));
export const eOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const eIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eBack = (t: number) => {
  const c1 = 1.5, c3 = c1 + 1;
  return t <= 0 ? 0 : t >= 1 ? 1 : 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

// Geometria do Edifício Alameda (metros)
export const W = 18, D = 14;
export const COLX = [-8.6, -2.9, 2.9, 8.6];
export const COLZ = [-6.6, 0, 6.6];
export const LEVELS = 9; // térreo + 8 pavimentos
export const slabY = (k: number) => (k === 0 ? 0.3 : 4.8 + 3.1 * (k - 1)); // topo da laje k (0..9)
export const ROOF = slabY(LEVELS);

// Etapas
export const T = {
  piles: [100, 175], caps: [165, 205], beams: [195, 232], fill: [225, 252],
  struct: 252, lvl: 32, // início e duração entre níveis
  mason: [545, 690],
  facade: [665, 905],
  crane: [548, 612],
  env: [905, 1015],
  end: [1150, 1260],
};
export const lvlStart = (k: number) => T.struct + k * T.lvl;

export const STAGES = [
  {n: '01', t: 'Projeto', s: 'Modelagem e compatibilização', a: 0, b: 100},
  {n: '02', t: 'Fundação', s: 'Estacas, blocos e vigas baldrame', a: 100, b: 252},
  {n: '03', t: 'Estrutura', s: 'Pilares, vigas e lajes em concreto armado', a: 252, b: 545},
  {n: '04', t: 'Alvenaria', s: 'Bloco cerâmico, materiais pela cremalheira', a: 545, b: 665},
  {n: '05', t: 'Fachada', s: 'Fachada ventilada, esquadrias e varandas', a: 665, b: 905},
  {n: '06', t: 'Entrega', s: 'Calçada, paisagismo e entorno', a: 905, b: DUR},
];

import {Color} from 'three';
const lc = (a: string, b: string, t: number) => new Color(a).lerp(new Color(b), Math.max(0, Math.min(1, t)));
export const dayAt = (f: number) => 0.32 * eIO(prog(f, 40, 190)) + 0.68 * eIO(prog(f, 190, 760));
export const skyAt = (f: number) => {
  const d = dayAt(f);
  const top = d < 0.5 ? lc('#08131c', '#32506b', d * 2) : lc('#32506b', '#5b93c8', d * 2 - 1);
  const bot = d < 0.5 ? lc('#122431', '#8a7f78', d * 2) : lc('#8a7f78', '#d6e3ea', d * 2 - 1);
  return {top: '#' + top.getHexString(), bot: '#' + bot.getHexString()};
};
