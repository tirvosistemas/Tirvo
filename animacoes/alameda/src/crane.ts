// Grua: ciclos rápidos de içamento (dois por laje). Cada carga desce no ponto onde
// é usada e se integra ao elemento que está sendo executado (viga, pilar ou laje).
import {DUR, eIO, prog, slabY, lvlStart, LEVELS, T, COLX, COLZ} from './tl';

export const CR = {x: -15, z: -11, H: 40, L: 30, CL: 11};
const PARK_Y = CR.H - 3.5;
const PARK_R = 4.5;
// Estacionada: lança para o lado da rua lateral (-x), contralança fora da projeção do prédio
export const PARK_ANG = Math.PI;
export const VSL = 0.6; // linga curta das peças içadas na vertical

export type LoadT = 'cage' | 'cform' | 'mesh' | 'rebar' | 'deck';
// lx: comprimento, lz: largura, h: altura (deitada), sl: altura das lingas, v: sobe na vertical
export const LOADS: Record<LoadT, {lx: number; lz: number; h: number; sl: number; v?: boolean}> = {
  cage: {lx: 2.6, lz: 0.36, h: 0.36, sl: 1.4, v: true}, // armadura de pilar
  cform: {lx: 2.6, lz: 0.66, h: 0.66, sl: 1.4, v: true}, // fôrma de pilar
  mesh: {lx: 6.0, lz: 2.4, h: 0.12, sl: 1.8}, // tela soldada da laje
  rebar: {lx: 6.0, lz: 0.4, h: 0.1, sl: 1.6}, // feixe de vergalhão
  deck: {lx: 2.44, lz: 1.22, h: 0.2, sl: 1.6}, // chapas de compensado
};
export const PILES: Record<LoadT, [number, number]> = {
  cage: [-12.5, -3], cform: [-15.5, -3.5], mesh: [-17.5, 4], rebar: [-14, 4], deck: [-18, -4.5],
};
export const PILE_N = 2;
export const DUNNAGE = 0.12;

const angTo = (x: number, z: number) => Math.atan2(-(z - CR.z), x - CR.x);
const radTo = (x: number, z: number) => Math.hypot(x - CR.x, z - CR.z);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const angLerp = (a: number, b: number, t: number) => {
  let d = b - a;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return a + d * t;
};
export const pileAng = (t: LoadT) => angTo(...PILES[t]);

export const CD = 16; // duração de um ciclo (quadros): dois ciclos por laje (32 quadros)
type Def = {a: number; load: LoadT; drop: [number, number]; y: number; yaw: number; gone: number; travel?: number};
const defs: Def[] = [
  // fundação: vergalhão das vigas baldrame e tela do piso térreo
  {a: 184.5, load: 'rebar', drop: [0, COLZ[0]], y: -1.05, yaw: 0, gone: 236, travel: 6.5},
  {a: 200.5, load: 'rebar', drop: [COLX[3], 0], y: -1.05, yaw: Math.PI / 2, gone: 236, travel: 6.5},
  {a: 216.5, load: 'mesh', drop: [5.75, 3.3], y: 0.04, yaw: 0, gone: 262, travel: 6.5},
];
// estrutura: em cada pavimento, armadura ou fôrma de um pilar e material da laje de cima
const CSEQ = [9, 7, 10, 6, 8, 9, 7, 10, 8];
const FLAT: LoadT[] = ['mesh', 'rebar', 'deck'];
for (let k = 0; k < LEVELS; k++) {
  const s = lvlStart(k), c = CSEQ[k];
  const colStart = s + c * 0.6;
  const vt: LoadT = k % 2 ? 'cform' : 'cage';
  defs.push({a: s - 10, load: vt, drop: [COLX[Math.floor(c / 3)], COLZ[c % 3]], y: slabY(k), yaw: 0, gone: colStart + (vt === 'cform' ? 18 : 12)});
  defs.push({a: s + 6, load: FLAT[k % 3], drop: [5.75, k % 2 ? -3.3 : 3.3], y: slabY(k + 1) - 0.28, yaw: 0, gone: s + 31});
}

export const CYC = defs.map((d) => {
  const L = LOADS[d.load];
  const pileTop = DUNNAGE + PILE_N * L.h;
  const pickY = pileTop + L.h + L.sl;
  const dropY = L.v ? d.y + L.lx + VSL : d.y + L.h + L.sl;
  const travel = Math.min(PARK_Y, d.travel ?? dropY + 2.5);
  const [px, pz] = PILES[d.load];
  return {
    ...d, pileTop, pickY, dropY, travel,
    pick: PILES[d.load], pickAng: angTo(px, pz), pickR: radTo(px, pz),
    dropAng: angTo(...d.drop), dropR: radTo(...d.drop),
    att: d.a + 0.17 * CD, rel: d.a + 0.78 * CD,
  };
});
export type Cyc = (typeof CYC)[number];

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
    const prevY = i === 0 ? PARK_Y : CYC[i - 1].travel;
    if (f < c.a) return {ang: c.pickAng, r: c.pickR, y: prevY, cyc: -1, u: 0}; // intervalo entre ciclos
    const u = (f - c.a) / CD;
    const nx = CYC[i + 1];
    const nAng = nx ? nx.pickAng : PARK_ANG, nR = nx ? nx.pickR : PARK_R;
    const endY = nx ? c.travel : PARK_Y;
    let y: number;
    if (u < 0.14) y = lerp(prevY, c.pickY, eIO(u / 0.14));
    else if (u < 0.2) y = c.pickY;
    else if (u < 0.42) y = lerp(c.pickY, c.travel, eIO((u - 0.2) / 0.22));
    else if (u < 0.62) y = c.travel;
    else if (u < 0.74) y = lerp(c.travel, c.dropY, eIO((u - 0.62) / 0.12));
    else if (u < 0.8) y = c.dropY;
    else if (u < 0.92) y = lerp(c.dropY, endY, eIO((u - 0.8) / 0.12));
    else y = endY;
    let ang: number;
    if (u < 0.26) ang = c.pickAng;
    else if (u < 0.62) ang = angLerp(c.pickAng, c.dropAng, eIO((u - 0.26) / 0.36));
    else if (u < 0.84) ang = c.dropAng;
    else ang = angLerp(c.dropAng, nAng, eIO((u - 0.84) / 0.16));
    let r: number;
    if (u < 0.28) r = c.pickR;
    else if (u < 0.62) r = lerp(c.pickR, c.dropR, eIO((u - 0.28) / 0.34));
    else if (u < 0.84) r = c.dropR;
    else r = lerp(c.dropR, nR, eIO((u - 0.84) / 0.16));
    return {ang, r, y, cyc: i, u};
  }
  return {ang: PARK_ANG, r: PARK_R, y: PARK_Y, cyc: -1, u: 0};
};

// Fases em que a carga está apoiada: sem balanço
const steady = (p: Pose) => p.cyc >= 0 && ((p.u > 0.08 && p.u < 0.22) || (p.u > 0.66 && p.u < 0.82));

// Simulação do pêndulo (determinística, quadro a quadro, igual em todas as abas)
let SIM: {ox: Float32Array; oz: Float32Array} | null = null;
const sim = () => {
  if (SIM) return SIM;
  const N = DUR + 2;
  const ox = new Float32Array(N), oz = new Float32Array(N);
  const px = (f: number) => { const p = poseRaw(f); return [CR.x + p.r * Math.cos(p.ang), CR.z - p.r * Math.sin(p.ang)]; };
  const w = (2 * Math.PI) / 26;
  let x = 0, z = 0, vx = 0, vz = 0;
  for (let f = 1; f < N - 1; f++) {
    const a = px(f - 1), b = px(f), c = px(f + 1);
    const ax = c[0] - 2 * b[0] + a[0], az = c[1] - 2 * b[1] + a[1];
    const zeta = steady(poseRaw(f)) ? 1.5 : 0.12;
    const K = 0.025, S = 4, dt = 1 / S;
    for (let s = 0; s < S; s++) {
      vx += (-w * w * x - 2 * zeta * w * vx - K * ax) * dt;
      vz += (-w * w * z - 2 * zeta * w * vz - K * az) * dt;
      x += vx * dt; z += vz * dt;
    }
    ox[f] = Math.max(-0.7, Math.min(0.7, x));
    oz[f] = Math.max(-0.7, Math.min(0.7, z));
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

// Carga em transporte: centro, giro e inclinação (peças verticais tombam ao subir)
export const carried = (c: Cyc, f: number) => {
  const p = craneAt(f);
  const L = LOADS[c.load];
  const tilt = L.v ? (p.u < 0.62 ? Math.max(0, Math.min(1, (p.y - c.pickY) / 2.2)) : 1) : 0;
  const flatY = p.y - L.sl - L.h / 2, vertY = p.y - VSL - L.lx / 2;
  const yaw = L.v ? p.ang : angLerp(c.pickAng, c.yaw, eIO(prog(p.u, 0.26, 0.66)));
  return {x: p.hx, y: lerp(flatY, vertY, eIO(tilt)), z: p.hz, yaw, tilt: eIO(tilt), hookY: p.y};
};

// Subida no início e descida (desmontagem) depois da última laje
export const craneDown = (f: number) => (f < 300 ? 1 - eIO(prog(f, 105, 160)) : eIO(prog(f, T.crane[0], T.crane[1])));
