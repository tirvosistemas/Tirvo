// Grua: posição, ciclos de içamento (cada um com uma carga diferente) e balanço do gancho
import {DUR, eIO, prog, slabY, lvlStart, LEVELS, T} from './tl';

export const CR = {x: -15, z: -11, H: 40, L: 30, CL: 11};
export const SL = 2.0; // altura das lingas, do gancho ao topo da carga
const PARK_Y = CR.H - 3.5;
const PARK_R = 4.5;
// Estacionada: lança para o lado da rua lateral (-x), contralança fora da projeção do prédio
export const PARK_ANG = Math.PI;

export type LoadT = 'cage' | 'forms' | 'props' | 'rebar' | 'mesh' | 'timber';
export const LOADS: Record<LoadT, {lx: number; lz: number; h: number}> = {
  cage: {lx: 3.6, lz: 0.55, h: 0.55},
  forms: {lx: 2.44, lz: 1.22, h: 0.5},
  props: {lx: 3.2, lz: 0.9, h: 0.5},
  rebar: {lx: 4.0, lz: 0.5, h: 0.32},
  mesh: {lx: 3.0, lz: 1.5, h: 0.3},
  timber: {lx: 3.6, lz: 1.0, h: 0.55},
};
export const PILE_N = 2; // peças que ficam na pilha embaixo da que será içada
export const DUNNAGE = 0.12;

const angTo = (x: number, z: number) => Math.atan2(-(z - CR.z), x - CR.x);
const radTo = (x: number, z: number) => Math.hypot(x - CR.x, z - CR.z);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const angLerp = (a: number, b: number, t: number) => {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
};

// Laje mais alta concluída no quadro f (0 = térreo)
const topSlab = (f: number) => {
  let n = 0;
  for (let k = 1; k <= LEVELS; k++) if (f >= lvlStart(k - 1) + 31) n = k;
  return n;
};

export const CD = 64; // duração de um ciclo (quadros)
type CycDef = {a: number; load: LoadT; pick: [number, number]; drop: [number, number]; ground?: boolean; gone?: number};
const DEFS: CycDef[] = [
  {a: 180, load: 'cage', pick: [-15, 2], drop: [0, -11.6], ground: true, gone: 590},
  {a: 244, load: 'forms', pick: [-13.5, 6.5], drop: [5.75, 3.3]},
  {a: 308, load: 'props', pick: [-17.5, 5.5], drop: [-5.75, 3.3]},
  {a: 372, load: 'rebar', pick: [-17.5, -2], drop: [5.75, -3.3]},
  {a: 436, load: 'mesh', pick: [-14, -5], drop: [-5.75, -3.3]},
];

export const CYC = DEFS.map((d) => {
  const L = LOADS[d.load];
  const pileTop = DUNNAGE + PILE_N * L.h;
  const n = d.ground ? -1 : topSlab(d.a + 0.62 * CD);
  const surf = d.ground ? 0 : slabY(n);
  const travel = d.ground ? 7.5 : Math.min(PARK_Y, (n < LEVELS ? slabY(n + 1) : slabY(n) + 1.5) + 4.5);
  return {
    ...d, n, surf, pileTop,
    pickAng: angTo(...d.pick), pickR: radTo(...d.pick), pickY: pileTop + L.h + SL,
    dropAng: angTo(...d.drop), dropR: radTo(...d.drop), dropY: surf + L.h + SL,
    travel,
  };
});
export const CYC_END = CYC[CYC.length - 1].a + CD;

export type Pose = {ang: number; r: number; y: number; cyc: number; u: number};

const poseRaw = (f: number): Pose => {
  const first = CYC[0];
  if (f < first.a) {
    const t = eIO(prog(f, first.a - 18, first.a));
    return {ang: angLerp(PARK_ANG, first.pickAng, t), r: lerp(PARK_R, first.pickR, t), y: PARK_Y, cyc: -1, u: 0};
  }
  for (let i = 0; i < CYC.length; i++) {
    const c = CYC[i];
    if (f >= c.a + CD) continue;
    const u = (f - c.a) / CD;
    const prevY = i === 0 ? PARK_Y : CYC[i - 1].travel;
    const nx = CYC[i + 1];
    const nAng = nx ? nx.pickAng : PARK_ANG, nR = nx ? nx.pickR : PARK_R;
    let y: number;
    if (u < 0.13) y = lerp(prevY, c.pickY, eIO(u / 0.13));
    else if (u < 0.21) y = c.pickY;
    else if (u < 0.36) y = lerp(c.pickY, c.travel, eIO((u - 0.21) / 0.15));
    else if (u < 0.62) y = c.travel;
    else if (u < 0.74) y = lerp(c.travel, c.dropY, eIO((u - 0.62) / 0.12));
    else if (u < 0.8) y = c.dropY;
    else if (u < 0.9) y = lerp(c.dropY, nx ? c.travel : PARK_Y, eIO((u - 0.8) / 0.1));
    else y = nx ? c.travel : PARK_Y;
    let ang: number;
    if (u < 0.3) ang = c.pickAng;
    else if (u < 0.62) ang = angLerp(c.pickAng, c.dropAng, eIO((u - 0.3) / 0.32));
    else if (u < 0.86) ang = c.dropAng;
    else ang = angLerp(c.dropAng, nAng, eIO((u - 0.86) / 0.14));
    let r: number;
    if (u < 0.34) r = c.pickR;
    else if (u < 0.62) r = lerp(c.pickR, c.dropR, eIO((u - 0.34) / 0.28));
    else if (u < 0.86) r = c.dropR;
    else r = lerp(c.dropR, nR, eIO((u - 0.86) / 0.14));
    return {ang, r, y, cyc: i, u};
  }
  return {ang: PARK_ANG, r: PARK_R, y: PARK_Y, cyc: -1, u: 0};
};

// Fases em que o operador segura a carga parada (o balanço é amortecido rapidamente)
const steady = (p: Pose) => p.cyc >= 0 && ((p.u > 0.06 && p.u < 0.22) || (p.u > 0.64 && p.u < 0.81));

// Simulação do pêndulo (determinística, quadro a quadro, igual em todas as abas)
let SIM: {ox: Float32Array; oz: Float32Array} | null = null;
const sim = () => {
  if (SIM) return SIM;
  const N = DUR + 2;
  const ox = new Float32Array(N), oz = new Float32Array(N);
  const px = (f: number) => { const p = poseRaw(f); return [CR.x + p.r * Math.cos(p.ang), CR.z - p.r * Math.sin(p.ang)]; };
  const w = (2 * Math.PI) / 44;
  let x = 0, z = 0, vx = 0, vz = 0;
  for (let f = 1; f < N - 1; f++) {
    const a = px(f - 1), b = px(f), c = px(f + 1);
    const ax = c[0] - 2 * b[0] + a[0], az = c[1] - 2 * b[1] + a[1];
    const zeta = steady(poseRaw(f)) ? 0.9 : 0.09;
    const K = 0.06, S = 4, dt = 1 / S;
    for (let s = 0; s < S; s++) {
      vx += (-w * w * x - 2 * zeta * w * vx - K * ax) * dt;
      vz += (-w * w * z - 2 * zeta * w * vz - K * az) * dt;
      x += vx * dt; z += vz * dt;
    }
    ox[f] = Math.max(-1.6, Math.min(1.6, x));
    oz[f] = Math.max(-1.6, Math.min(1.6, z));
  }
  SIM = {ox, oz};
  return SIM;
};

export const craneAt = (f: number) => {
  const p = poseRaw(f);
  const s = sim();
  const i = Math.max(0, Math.min(DUR, Math.round(f)));
  const tx = CR.x + p.r * Math.cos(p.ang), tz = CR.z - p.r * Math.sin(p.ang);
  return {...p, tx, tz, hx: tx + s.ox[i], hz: tz + s.oz[i]};
};

// Subida no início e descida (desmontagem) depois da última laje
export const craneDown = (f: number) => (f < 300 ? 1 - eIO(prog(f, 105, 160)) : eIO(prog(f, T.crane[0], T.crane[1])));
