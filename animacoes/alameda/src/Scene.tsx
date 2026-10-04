import * as THREE from 'three';
import React, {useMemo} from 'react';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame, getInputProps} from 'remotion';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  prog, eOut, eIO, skyAt, dayAt, W, D, COLX, COLZ, LEVELS, slabY, ROOF, T, lvlStart,
} from './tl';
import {makeTextures, triplanar} from './tex';
import {CR, CYC, LOADS, LoadT, PILES, PILE_N, DUNNAGE, craneAt, craneDown, carried, pileAng} from './crane';

type V3 = [number, number, number];
const UNIT = new THREE.BoxGeometry(1, 1, 1);
const EDGES = new THREE.EdgesGeometry(UNIT);
const ICO = new THREE.IcosahedronGeometry(1, 2);
const CYL = new THREE.CylinderGeometry(1, 1, 1, 14);
const CYLX = new THREE.CylinderGeometry(1, 1, 1, 10).rotateZ(Math.PI / 2);
const TOR = new THREE.TorusGeometry(0.16, 0.045, 6, 14, Math.PI * 1.4);
const YUP = new THREE.Vector3(0, 1, 0);
const AX = {x: 0, y: 1, z: 2} as const;
// Painel de tela soldada: grade de linhas 6 x 2,4 m (malha de 20 cm)
const MESHGRID = (() => {
  const p: number[] = [];
  for (let x = -3; x <= 3.001; x += 0.2) p.push(x, 0, -1.2, x, 0, 1.2);
  for (let z = -1.2; z <= 1.201; z += 0.2) p.push(-3, 0, z, 3, 0, z);
  return new THREE.BufferGeometry().setAttribute('position', new THREE.Float32BufferAttribute(p, 3));
})();

const lerpC = (a: string, b: string, t: number) => new THREE.Color(a).lerp(new THREE.Color(b), Math.max(0, Math.min(1, t)));

// Caixa que "cresce" ao longo de um eixo, ancorada num lado
const Bx = ({p, s, m, g = 1, ax = 'y', from = 'min', o, cast = true}: {
  p: V3; s: V3; m: THREE.Material; g?: number; ax?: 'x' | 'y' | 'z'; from?: 'min' | 'max' | 'mid'; o?: V3; cast?: boolean;
}) => {
  if (g <= 0.002) return null;
  const i = AX[ax];
  const pos = [...p] as V3;
  const sc = [...s] as V3;
  sc[i] = s[i] * g;
  if (from === 'min') pos[i] = p[i] - s[i] / 2 + sc[i] / 2;
  if (from === 'max') pos[i] = p[i] + s[i] / 2 - sc[i] / 2;
  if (o) { pos[0] += o[0]; pos[1] += o[1]; pos[2] += o[2]; }
  return <mesh geometry={UNIT} material={m} position={pos} scale={sc} castShadow={cast} receiveShadow />;
};

// Barra entre dois pontos (treliças, tirantes, cabos)
const Bar = ({a, b, t, m, cast = true}: {a: V3; b: V3; t: number; m: THREE.Material; cast?: boolean}) => {
  const va = new THREE.Vector3(...a), vb = new THREE.Vector3(...b);
  const dir = vb.clone().sub(va);
  const len = dir.length();
  if (len < 1e-4) return null;
  const q = new THREE.Quaternion().setFromUnitVectors(YUP, dir.normalize());
  const mid = va.add(vb).multiplyScalar(0.5);
  return <mesh geometry={UNIT} material={m} position={mid} quaternion={q} scale={[t, len, t]} castShadow={cast} />;
};

const std = (color: string, rough = 0.85, metal = 0, extra: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({color, roughness: rough, metalness: metal, ...extra});

const useMats = () => useMemo(() => {
  const tx = makeTextures();
  return {
    concrete: triplanar(std('#b4b6b5', 0.9), tx.concrete, 3),
    caps: triplanar(std('#9c9f9f', 0.95), tx.concrete, 3),
    soil: triplanar(std('#ffffff', 1), tx.dirt, 5),
    site: triplanar(std('#ffffff', 1), tx.dirt, 5),
    mason: triplanar(std('#ffffff', 0.95), tx.brick, 1.2),
    white: triplanar(std('#f2f1ec', 0.55), tx.paint, 2),
    glass: std('#46667c', 0.06, 0.7, {envMapIntensity: 2.2}),
    store: std('#2c4352', 0.05, 0.75, {envMapIntensity: 2.2}),
    rail: std('#b9d2df', 0.05, 0.3, {transparent: true, opacity: 0.32}),
    terra: std('#c0805a', 0.65),
    copper: std('#b5652f', 0.4, 0.5),
    mull: std('#2a3036', 0.45, 0.6),
    green: std('#5f7f3c', 0.95),
    green2: std('#4d6e31', 0.95),
    trunk: std('#6b5240', 0.9),
    crane: std('#e8a81e', 0.48, 0.3),
    craneD: std('#2a2f33', 0.55, 0.45),
    cable: std('#1d2125', 0.6, 0.6),
    cabGlass: std('#25404f', 0.05, 0.8),
    weight: triplanar(std('#a7a9a7', 0.95), tx.concrete, 3),
    redLight: new THREE.MeshBasicMaterial({color: '#ff3320'}),
    rust: std('#6a4433', 0.8, 0.35),
    rustL: new THREE.LineBasicMaterial({color: '#5a3a2c'}),
    ply: std('#8f3d24', 0.55),
    wood: std('#b08a5c', 0.9),
    galv: std('#aab2b6', 0.4, 0.8),
    orange: std('#e0661f', 0.6),
    fence: triplanar(std('#e9ebe7', 0.7), tx.paint, 2),
    amber: std('#f2b32a', 0.6),
    ground: triplanar(std('#ffffff', 1), tx.grass, 8),
    walk: triplanar(std('#ffffff', 0.95), tx.pavers, 1.2),
    road: triplanar(std('#ffffff', 0.95), tx.asphalt, 5),
    paving: triplanar(std('#ffffff', 0.95), tx.pavers, 1.2),
    stripe: std('#e9e7df', 0.8),
    neigh: triplanar(std('#ffffff', 0.85), tx.neighSide, 6, tx.concrete, 4),
    neigh2: triplanar(std('#ffffff', 0.85), tx.neighSide, 6, tx.concrete, 4),
    neigh3: triplanar(std('#ffffff', 0.85), tx.neighSide, 6, tx.concrete, 4),
    ghost: new THREE.LineBasicMaterial({color: '#f2b32a', transparent: true, opacity: 0}),
    lot: new THREE.LineBasicMaterial({color: '#f2b32a', transparent: true, opacity: 0}),
  };
}, []);

// Câmera: keyframes (quadro, ângulo°, raio, altura, alvo y) interpolados por Catmull-Rom
const KEYS: [number, number, number, number, number][] = [
  [0, -158, 104, 82, 6],
  [110, -122, 72, 44, 3],
  [250, -82, 47, 17, 1],
  [560, -42, 66, 34, 14],
  [700, -20, 62, 22, 15],
  [900, -4, 60, 11, 15],
  [1015, 12, 64, 22, 13],
  [1260, 40, 54, 2.6, 15.5],
];
const cr = (p0: number, p1: number, p2: number, p3: number, t: number) =>
  0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
const camAt = (f: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && f > KEYS[i + 1][0]) i++;
  const k = (j: number) => KEYS[Math.max(0, Math.min(KEYS.length - 1, j))];
  const t = Math.max(0, Math.min(1, (f - KEYS[i][0]) / (KEYS[i + 1][0] - KEYS[i][0])));
  const v = [1, 2, 3, 4].map((c) => cr(k(i - 1)[c], k(i)[c], k(i + 1)[c], k(i + 2)[c], t));
  return {th: (v[0] * Math.PI) / 180, r: v[1], h: v[2], ty: v[3]};
};

const Cam = ({f, portrait}: {f: number; portrait: boolean}) => {
  const {camera} = useThree();
  const c = camAt(f);
  const r = c.r * (portrait ? 1.22 : 1);
  const cam = camera as THREE.PerspectiveCamera;
  cam.fov = portrait ? 52 : 36;
  cam.near = 0.5; cam.far = 900;
  cam.position.set(Math.sin(c.th) * r, c.h * (portrait ? 1.1 : 1), Math.cos(c.th) * r);
  const dbg = getInputProps() as {cam?: number[]};
  if (dbg.cam) { cam.position.set(dbg.cam[0], dbg.cam[1], dbg.cam[2]); cam.lookAt(dbg.cam[3], dbg.cam[4], dbg.cam[5]); } else cam.lookAt(0, c.ty, 0);
  cam.updateProjectionMatrix();
  return null;
};

type M = ReturnType<typeof useMats>;

// ---------- Cargas içadas pela grua (geometria centrada; comprimento no eixo x) ----------
const Load = ({t, p, yaw, tilt = 0, m, sc = 1}: {t: LoadT; p: V3; yaw: number; tilt?: number; m: M; sc?: number}) => {
  if (sc <= 0.01) return null;
  const L = LOADS[t];
  const k: React.ReactElement[] = [];
  if (t === 'cage') {
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([a, b], i) => k.push(
      <mesh key={`l${i}`} geometry={UNIT} material={m.rust} position={[0, b * 0.15, a * 0.15]} scale={[L.lx, 0.03, 0.03]} castShadow />));
    for (let x = -L.lx / 2 + 0.08; x < L.lx / 2; x += 0.18) k.push(
      <lineSegments key={`s${x.toFixed(2)}`} geometry={EDGES} material={m.rustL} position={[x, 0, 0]} scale={[0.01, 0.32, 0.32]} />);
  } else if (t === 'cform') {
    [[0, 0.31, 0.66, 0.04], [0, -0.31, 0.66, 0.04], [0.31, 0, 0.04, 0.58], [-0.31, 0, 0.04, 0.58]].forEach(([z, y, sz, sy], i) => k.push(
      <mesh key={`f${i}`} geometry={UNIT} material={m.ply} position={[0, y, z]} scale={[L.lx, sy, sz]} castShadow receiveShadow />));
    for (let x = -1.1; x <= 1.11; x += 0.55) k.push(<lineSegments key={`g${x}`} geometry={EDGES} material={m.rustL} position={[x, 0, 0]} scale={[0.06, 0.7, 0.7]} />);
  } else if (t === 'mesh') {
    for (let i = 0; i < 2; i++) k.push(<lineSegments key={`g${i}`} geometry={MESHGRID} material={m.rustL} position={[0, -0.03 + i * 0.06, 0]} />);
  } else if (t === 'rebar') {
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) k.push(
      <mesh key={`r${r}${i}`} geometry={UNIT} material={m.rust} position={[0, -0.025 + r * 0.05, (i - 2.5) * 0.065]} scale={[L.lx, 0.03, 0.03]} castShadow />);
  } else if (t === 'deck') {
    for (let i = 0; i < 3; i++) k.push(<mesh key={`p${i}`} geometry={UNIT} material={i === 1 ? m.wood : m.ply} position={[0, -0.067 + i * 0.067, 0]} scale={[L.lx, 0.06, L.lz]} castShadow receiveShadow />);
  }
  return (
    <group position={p} rotation={[0, yaw, 0]} scale={[sc, sc, sc]}>
      <group rotation={[0, 0, tilt * Math.PI / 2]}>{k}</group>
    </group>
  );
};

// ---------- Grua torre (geometria em coordenadas locais) ----------
const useCraneParts = (m: M) => useMemo(() => {
  const {H, L, CL} = CR;
  const q = 0.8, SEC = 2.5;
  const mast: React.ReactElement[] = [];
  [[-q, -q], [q, -q], [q, q], [-q, q]].forEach(([a, b], i) => mast.push(<Bx key={`p${i}`} p={[a, H / 2, b]} s={[0.17, H, 0.17]} m={m.crane} />));
  for (let y = 0, s = 0; y < H - 0.1; y += SEC, s++) {
    const y1 = y + SEC, fl = s % 2 ? 1 : -1;
    mast.push(<Bx key={`h${s}a`} p={[0, y1, -q]} s={[1.6, 0.1, 0.1]} m={m.crane} cast={false} />);
    mast.push(<Bx key={`h${s}b`} p={[0, y1, q]} s={[1.6, 0.1, 0.1]} m={m.crane} cast={false} />);
    mast.push(<Bx key={`h${s}c`} p={[-q, y1, 0]} s={[0.1, 0.1, 1.6]} m={m.crane} cast={false} />);
    mast.push(<Bx key={`h${s}d`} p={[q, y1, 0]} s={[0.1, 0.1, 1.6]} m={m.crane} cast={false} />);
    mast.push(<Bar key={`d${s}a`} a={[-q * fl, y, q]} b={[q * fl, y1, q]} t={0.08} m={m.crane} />);
    mast.push(<Bar key={`d${s}b`} a={[q * fl, y, -q]} b={[-q * fl, y1, -q]} t={0.08} m={m.crane} />);
    mast.push(<Bar key={`d${s}c`} a={[q, y, q * fl]} b={[q, y1, -q * fl]} t={0.08} m={m.crane} />);
    mast.push(<Bar key={`d${s}d`} a={[-q, y, -q * fl]} b={[-q, y1, q * fl]} t={0.08} m={m.crane} />);
  }
  // base em concreto com chumbadores
  mast.push(<Bx key="base" p={[0, 0.25, 0]} s={[4.6, 0.5, 4.6]} m={m.weight} />);
  mast.push(<Bx key="bs" p={[0, 0.7, 0]} s={[2.2, 0.4, 2.2]} m={m.craneD} />);
  // giratória
  mast.push(<mesh key="ring" geometry={CYL} material={m.craneD} position={[0, H + 0.3, 0]} scale={[1.15, 0.6, 1.15]} castShadow />);

  // Parte giratória: lança (+x), contralança (-x), torre de topo, cabine
  const top: React.ReactElement[] = [];
  const hz = 0.6, TH = 1.45, TIP = L - 2.5;
  // banzos inferiores e superior da lança (seção triangular)
  top.push(<Bar key="bi1" a={[-1, 0, -hz]} b={[TIP, 0, -hz]} t={0.15} m={m.crane} />);
  top.push(<Bar key="bi2" a={[-1, 0, hz]} b={[TIP, 0, hz]} t={0.15} m={m.crane} />);
  top.push(<Bar key="bs1" a={[-1, TH, 0]} b={[TIP, TH, 0]} t={0.15} m={m.crane} />);
  for (let x = 0; x < TIP - 0.01; x += SEC) {
    const xm = x + SEC / 2, x1 = x + SEC;
    top.push(<Bar key={`w${x}a`} a={[x, 0, -hz]} b={[xm, TH, 0]} t={0.07} m={m.crane} />);
    top.push(<Bar key={`w${x}b`} a={[xm, TH, 0]} b={[x1, 0, -hz]} t={0.07} m={m.crane} />);
    top.push(<Bar key={`w${x}c`} a={[x, 0, hz]} b={[xm, TH, 0]} t={0.07} m={m.crane} />);
    top.push(<Bar key={`w${x}d`} a={[xm, TH, 0]} b={[x1, 0, hz]} t={0.07} m={m.crane} />);
    top.push(<Bar key={`w${x}e`} a={[x, 0, -hz]} b={[x, 0, hz]} t={0.06} m={m.crane} cast={false} />);
    top.push(<Bar key={`w${x}f`} a={[x, 0, -hz]} b={[x1, 0, hz]} t={0.05} m={m.crane} cast={false} />);
  }
  // ponta da lança: seção afunilada e quadro de fechamento
  const tz = 0.3, tyy = 0.62;
  top.push(<Bar key="pt1" a={[TIP, 0, -hz]} b={[L, 0, -tz]} t={0.13} m={m.crane} />);
  top.push(<Bar key="pt2" a={[TIP, 0, hz]} b={[L, 0, tz]} t={0.13} m={m.crane} />);
  top.push(<Bar key="pt3" a={[TIP, TH, 0]} b={[L, tyy, 0]} t={0.13} m={m.crane} />);
  top.push(<Bar key="pt4" a={[TIP, 0, -hz]} b={[TIP, 0, hz]} t={0.07} m={m.crane} />);
  top.push(<Bar key="pt5" a={[TIP, 0, -hz]} b={[L, tyy, 0]} t={0.07} m={m.crane} />);
  top.push(<Bar key="pt6" a={[TIP, 0, hz]} b={[L, tyy, 0]} t={0.07} m={m.crane} />);
  top.push(<Bar key="pt7" a={[L, 0, -tz]} b={[L, 0, tz]} t={0.1} m={m.crane} />);
  top.push(<Bar key="pt8" a={[L, 0, -tz]} b={[L, tyy, 0]} t={0.1} m={m.crane} />);
  top.push(<Bar key="pt9" a={[L, 0, tz]} b={[L, tyy, 0]} t={0.1} m={m.crane} />);
  top.push(<Bx key="ptb" p={[L - 0.15, 0.1, 0]} s={[0.35, 0.25, 0.7]} m={m.craneD} />);
  top.push(<mesh key="ptl" geometry={UNIT} material={m.redLight} position={[L - 0.1, tyy + 0.15, 0]} scale={[0.18, 0.18, 0.18]} />);
  // batentes do carrinho
  top.push(<Bx key="stp" p={[TIP - 0.2, -0.15, 0]} s={[0.2, 0.3, 1.3]} m={m.craneD} />);

  // torre de topo (pirâmide treliçada) com tirantes
  const AH = 7.5, aq = 0.85;
  const legs: V3[] = [[-aq, 0, -aq], [aq, 0, -aq], [aq, 0, aq], [-aq, 0, aq]];
  const apex: V3 = [0, AH, 0];
  legs.forEach((p, i) => top.push(<Bar key={`al${i}`} a={p} b={apex} t={0.17} m={m.crane} />));
  const mid = (p: V3, f: number): V3 => [p[0] * (1 - f), AH * f, p[2] * (1 - f)];
  [0.33, 0.62].forEach((fv, j) => legs.forEach((p, i) => {
    const n = legs[(i + 1) % 4];
    top.push(<Bar key={`ah${j}${i}`} a={mid(p, fv)} b={mid(n, fv)} t={0.08} m={m.crane} cast={false} />);
    top.push(<Bar key={`ad${j}${i}`} a={mid(p, j ? 0.33 : 0)} b={mid(n, fv)} t={0.06} m={m.crane} cast={false} />);
  }));
  top.push(<Bx key="apc" p={[0, AH + 0.2, 0]} s={[0.55, 0.45, 0.55]} m={m.craneD} />);
  top.push(<mesh key="apl" geometry={UNIT} material={m.redLight} position={[0, AH + 0.55, 0]} scale={[0.2, 0.22, 0.2]} />);
  [-0.12, 0.12].forEach((dz, i) => {
    top.push(<Bar key={`tj1${i}`} a={[0.1, AH, dz]} b={[L * 0.52, TH, dz]} t={0.04} m={m.craneD} />);
    top.push(<Bar key={`tj2${i}`} a={[0.1, AH - 0.1, dz]} b={[L * 0.84, TH, dz]} t={0.035} m={m.craneD} />);
    top.push(<Bar key={`tc${i}`} a={[-0.1, AH, dz]} b={[-CL + 0.6, 0.35, dz]} t={0.04} m={m.craneD} />);
  });

  // contralança: vigas laterais, passarela com guarda-corpo, guincho e contrapesos
  const cz = 0.9;
  [-cz, cz].forEach((z, i) => {
    top.push(<Bx key={`cg${i}`} p={[(-CL - 1) / 2, 0, z]} s={[CL - 1, 0.55, 0.22]} m={m.crane} />);
    top.push(<Bx key={`cr${i}`} p={[(-CL - 1) / 2, 1.25, z * 1.05]} s={[CL - 1, 0.06, 0.06]} m={m.crane} cast={false} />);
    for (let x = -1.5; x > -CL + 0.4; x -= 1.5) top.push(<Bx key={`cp${i}${x}`} p={[x, 0.75, z * 1.05]} s={[0.06, 1.0, 0.06]} m={m.crane} cast={false} />);
  });
  for (let x = -1.2; x > -CL; x -= 1.2) top.push(<Bx key={`cx${x}`} p={[x, 0, 0]} s={[0.14, 0.3, 2 * cz]} m={m.crane} cast={false} />);
  top.push(<Bx key="cw" p={[(-CL - 1) / 2, 0.29, 0]} s={[CL - 1.4, 0.04, 1.55]} m={m.craneD} cast={false} />);
  top.push(<mesh key="drum" geometry={CYL} material={m.craneD} position={[-3.6, 0.85, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.5, 1.1, 0.5]} castShadow />);
  top.push(<Bx key="mot" p={[-3.6, 0.75, 0.75]} s={[0.9, 0.7, 0.45]} m={m.crane} />);
  top.push(<Bx key="elb" p={[-5.8, 0.95, -0.3]} s={[1.2, 1.1, 0.7]} m={m.white} />);
  for (let i = 0; i < 4; i++) top.push(<Bx key={`cw${i}`} p={[-CL + 0.35 + i * 0.52, -0.95, 0]} s={[0.46, 2.3, 2.1]} m={m.weight} />);
  top.push(<Bx key="cwb" p={[-CL + 1.1, 0.25, 0]} s={[2.3, 0.2, 2.3]} m={m.craneD} />);
  // plataforma da giratória e cabine do operador
  top.push(<Bx key="sp" p={[0, -0.35, 0]} s={[2.4, 0.5, 2.4]} m={m.crane} />);
  top.push(<Bx key="cab" p={[1.55, -1.05, 1.45]} s={[1.6, 2.0, 1.4]} m={m.crane} />);
  top.push(<Bx key="cabg" p={[2.37, -0.9, 1.45]} s={[0.05, 1.4, 1.2]} m={m.cabGlass} cast={false} />);
  top.push(<Bx key="cabs" p={[1.6, -0.9, 2.16]} s={[1.3, 1.3, 0.04]} m={m.cabGlass} cast={false} />);
  return {mast, top};
}, [m]);

const Crane = ({f, m, gy}: {f: number; m: M; gy: number}) => {
  const parts = useCraneParts(m);
  const c = craneAt(f);
  const {H} = CR;
  const JY = H + 0.6 + 0.35; // nível dos banzos inferiores da lança
  return (
    <group position={[CR.x, gy, CR.z]}>
      {parts.mast}
      <group position={[0, JY, 0]} rotation={[0, c.ang, 0]}>
        {parts.top}
        {/* carrinho */}
        <group position={[c.r, 0, 0]}>
          <Bx p={[0, -0.3, 0]} s={[1.3, 0.3, 1.0]} m={m.crane} />
          {[-0.45, 0.45].map((x) => [-0.62, 0.62].map((z) => <Bx key={`${x}${z}`} p={[x, 0.08, z]} s={[0.22, 0.16, 0.08]} m={m.craneD} cast={false} />))}
          <mesh geometry={CYLX} material={m.craneD} position={[0, -0.45, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.5, 0.2, 0.2]} />
        </group>
      </group>
    </group>
  );
};

// Lote do canteiro (tapume) e cava da fundação
const LOT = {x0: -20, x1: 13, z0: -14, z1: 10.2};
const PIT = {x: 11, z: 9};

export const Scene = ({portrait}: {portrait: boolean}) => {
  const f = useCurrentFrame();
  const m = useMats();
  const {scene, gl} = useThree();
  const envTex = useMemo(() => {
    const pm = new THREE.PMREMGenerator(gl);
    return pm.fromScene(new RoomEnvironment(), 0.04).texture;
  }, [gl]);

  // Luz do dia: noite de prancheta -> manhã -> dia
  const day = dayAt(f);
  const env = eIO(prog(f, T.env[0], T.env[0] + 60));
  scene.environment = envTex;
  scene.environmentIntensity = 0.08 + 0.42 * day;
  scene.fog = new THREE.Fog(skyAt(f).bot, 150, 430);
  const tint = lerpC('#1a2832', '#ffffff', day);
  [m.ground, m.walk, m.road, m.site].forEach((x) => x.color.copy(tint));
  m.soil.color.copy(lerpC('#2a241d', '#d9cfc4', day));
  m.paving.color.copy(tint);
  m.neigh.color.copy(lerpC('#33404a', '#e4ded2', day));
  m.neigh2.color.copy(lerpC('#33404a', '#d2d4d2', day));
  m.neigh3.color.copy(lerpC('#33404a', '#e6d6c2', day));
  m.stripe.color.copy(lerpC('#2a3640', '#e9e7df', day));

  const ghostIn = (k: number) => prog(f, 12 + k * 7, 34 + k * 7);
  const ghostFade = f < 100 ? 1 : f < 170 ? 1 - 0.88 * prog(f, 100, 170) : 0.12 * (1 - prog(f, 560, 720));
  m.ghost.opacity = 0.95 * ghostFade;
  m.lot.opacity = 0.9 * prog(f, 5, 40) * (1 - prog(f, 120, 260));
  const gridOp = (0.5 * prog(f, 0, 30)) * (1 - 0.7 * prog(f, 100, 220)) * (1 - prog(f, 500, 760));

  // Escavação e reaterro
  const dig = eIO(prog(f, 70, 115));
  const fill = eIO(prog(f, T.fill[0], T.fill[1]));
  const pitTop = -1.6 * dig * (1 - fill);

  const els: React.ReactElement[] = [];
  const add = (e: React.ReactElement | null) => { if (e) els.push(e); };
  let key = 0;
  const K = () => `e${key++}`;

  // ---------- Terreno, ruas e calçadas ----------
  const G = 160;
  const box = (x0: number, x1: number, z0: number, z1: number, y0: number, y1: number, mat: THREE.Material) =>
    add(<Bx key={K()} p={[(x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2]} s={[x1 - x0, y1 - y0, z1 - z0]} m={mat} cast={false} />);
  box(-G, LOT.x0, -G, G, -3, 0, m.ground);
  box(LOT.x1, G, -G, G, -3, 0, m.ground);
  box(LOT.x0, LOT.x1, -G, LOT.z0, -3, 0, m.ground);
  box(LOT.x0, LOT.x1, LOT.z1, G, -3, 0, m.ground);
  box(LOT.x0, -PIT.x, LOT.z0, LOT.z1, -3, 0, m.site);
  box(PIT.x, LOT.x1, LOT.z0, LOT.z1, -3, 0, m.site);
  box(-PIT.x, PIT.x, LOT.z0, -PIT.z, -3, 0, m.site);
  box(-PIT.x, PIT.x, PIT.z, LOT.z1, -3, 0, m.site);
  add(<Bx key={K()} p={[0, (pitTop - 3.2) / 2, 0]} s={[2 * PIT.x, pitTop + 3.2 + 0.001, 2 * PIT.z]} m={m.soil} cast={false} />);
  // rua da frente, rua lateral (lote de esquina) e calçadas
  box(-G, G, 15, 27, -0.2, 0.02, m.road);
  box(-33, -23, -G, 15, -0.2, 0.035, m.road);
  box(-23, G, LOT.z1, 15, -0.2, 0.13, m.walk);
  box(-23, LOT.x0, -G, LOT.z1, -0.2, 0.13, m.walk);
  for (let x = -G + 3; x < G; x += 6) if (x < -36 || x > -20) add(<Bx key={K()} p={[x, 0.03, 21]} s={[2.6, 0.02, 0.14]} m={m.stripe} cast={false} />);
  for (let z = -G + 3; z < 12; z += 6) add(<Bx key={K()} p={[-28, 0.045, z]} s={[0.14, 0.02, 2.6]} m={m.stripe} cast={false} />);
  for (let i = 0; i < 8; i++) add(<Bx key={K()} p={[-31.2 + i * 0.9, 0.03, 16.6]} s={[0.45, 0.02, 2.6]} m={m.stripe} cast={false} />);
  // piso externo concluído na entrega
  add(<Bx key={K()} p={[(LOT.x0 + LOT.x1) / 2, 0.035, (LOT.z0 + LOT.z1) / 2]} s={[LOT.x1 - LOT.x0, 0.07, LOT.z1 - LOT.z0]} m={m.paving} g={eIO(prog(f, T.env[0], T.env[0] + 50))} ax="x" cast={false} />);

  // ---------- Tapume do canteiro ----------
  const fUp = eOut(prog(f, 45, 85)) * (1 - eIO(prog(f, 880, 912)));
  if (fUp > 0.002) {
    const FH = 2.2;
    const wall = (x0: number, x1: number, z0: number, z1: number) => {
      const p: V3 = [(x0 + x1) / 2, FH / 2, (z0 + z1) / 2];
      const s: V3 = [Math.max(0.06, x1 - x0), FH, Math.max(0.06, z1 - z0)];
      add(<Bx key={K()} p={p} s={s} m={m.fence} g={fUp} />);
      add(<Bx key={K()} p={[p[0], 1.75 * fUp, p[2]]} s={[s[0] + 0.02, 0.22 * fUp, s[2] + 0.02]} m={m.amber} cast={false} />);
    };
    wall(LOT.x0, -2, LOT.z1, LOT.z1);
    wall(4, LOT.x1, LOT.z1, LOT.z1);
    wall(LOT.x0, LOT.x0, LOT.z0, LOT.z1);
    wall(LOT.x1, LOT.x1, LOT.z0, LOT.z1);
    wall(LOT.x0, LOT.x1, LOT.z0, LOT.z0);
  }

  // ---------- Fundação ----------
  let pi = 0;
  COLX.forEach((x) => COLZ.forEach((z) => {
    [-0.45, 0.45].forEach((dx) => {
      const t = eOut(prog(f, T.piles[0] + pi * 1.6, T.piles[0] + pi * 1.6 + 26));
      pi++;
      if (t > 0 && fill < 1) add(<mesh key={K()} geometry={CYL} material={m.caps} position={[x + dx, -6.3 + (1 - t) * 16, z]} scale={[0.27, 10, 0.27]} castShadow />);
    });
  }));
  let ci = 0;
  COLX.forEach((x) => COLZ.forEach((z) => {
    const t = eOut(prog(f, T.caps[0] + ci * 1.5, T.caps[0] + ci * 1.5 + 16)); ci++;
    if (fill < 1) add(<Bx key={K()} p={[x, -1.05, z]} s={[1.8, 1.1, 1.1]} m={m.concrete} g={t} />);
  }));
  COLZ.forEach((z, j) => {
    const t = eIO(prog(f, T.beams[0] + j * 4, T.beams[0] + j * 4 + 20));
    if (fill < 1) add(<Bx key={K()} p={[0, -0.78, z]} s={[17.2, 0.55, 0.38]} m={m.concrete} g={t} ax="x" />);
  });
  COLX.forEach((x, j) => {
    const t = eIO(prog(f, T.beams[0] + 6 + j * 4, T.beams[0] + 26 + j * 4));
    if (fill < 1) add(<Bx key={K()} p={[x, -0.78, 0]} s={[0.38, 0.55, 13.2]} m={m.concrete} g={t} ax="z" />);
  });
  add(<Bx key={K()} p={[0, 0.15, 0]} s={[W + 0.4, 0.3, D + 0.4]} m={m.concrete} g={eIO(prog(f, 238, 262))} ax="x" />);

  // ---------- Estrutura ----------
  for (let k = 0; k < LEVELS; k++) {
    const s = lvlStart(k);
    const y0 = slabY(k), y1 = slabY(k + 1) - 0.28;
    let c = 0;
    COLX.forEach((x) => COLZ.forEach((z) => {
      const t = eOut(prog(f, s + c * 0.6, s + 12 + c * 0.6)); c++;
      add(<Bx key={K()} p={[x, (y0 + y1) / 2, z]} s={[0.5, y1 - y0, 0.5]} m={m.concrete} g={t} />);
    }));
    add(<Bx key={K()} p={[0, (y0 + y1) / 2, -3.3]} s={[3.6, y1 - y0, 4.4]} m={m.concrete} g={eOut(prog(f, s + 2, s + 16))} />);
    COLZ.forEach((z, j) => add(<Bx key={K()} p={[0, y1 - 0.3, z]} s={[17.6, 0.6, 0.36]} m={m.concrete} g={eIO(prog(f, s + 10 + j, s + 22 + j))} ax="x" />));
    COLX.forEach((x, j) => add(<Bx key={K()} p={[x, y1 - 0.3, 0]} s={[0.36, 0.6, 13.6]} m={m.concrete} g={eIO(prog(f, s + 12 + j, s + 24 + j))} ax="z" />));
    add(<Bx key={K()} p={[0, slabY(k + 1) - 0.14, 0]} s={[W + 0.4, 0.28, D + 0.4]} m={m.concrete} g={eIO(prog(f, s + 16, s + 31))} ax="x" />);
  }

  // ---------- Alvenaria ----------
  const bays = (a: number[]) => a.slice(0, -1).map((v, i) => [v + 0.25, a[i + 1] - 0.25]);
  for (let k = 0; k < LEVELS; k++) {
    const y0 = slabY(k), y1 = slabY(k + 1) - 0.28;
    const st = T.mason[0] + k * 12;
    let b = 0;
    const wall = (p: V3, sz: V3) => { const t = eOut(prog(f, st + b * 1.4, st + b * 1.4 + 22)); b++; add(<Bx key={K()} p={p} s={sz} m={m.mason} g={t} />); };
    bays(COLX).forEach(([a, c]) => {
      if (k > 0) wall([(a + c) / 2, (y0 + y1) / 2, 6.6], [c - a, y1 - y0, 0.22]);
      wall([(a + c) / 2, (y0 + y1) / 2, -6.6], [c - a, y1 - y0, 0.22]);
    });
    bays(COLZ).forEach(([a, c]) => {
      if (k > 0) wall([-8.6, (y0 + y1) / 2, (a + c) / 2], [0.22, y1 - y0, c - a]);
      wall([8.6, (y0 + y1) / 2, (a + c) / 2], [0.22, y1 - y0, c - a]);
    });
  }

  // ---------- Fachada ----------
  for (let k = 1; k < LEVELS; k++) {
    const fk = T.facade[0] + (k - 1) * 16;
    const y0 = slabY(k), y1 = slabY(k + 1);
    const h = y1 - y0, yc = (y0 + y1) / 2;
    const pan = eOut(prog(f, fk, fk + 16));
    const win = eOut(prog(f, fk + 6, fk + 20));
    // frente
    add(<Bx key={K()} p={[0, yc, 7.25]} s={[W + 0.4, h, 0.12]} m={m.white} g={pan} />);
    add(<Bx key={K()} p={[0, y0 - 0.08, 7.35]} s={[W + 0.7, 0.42, 0.26]} m={m.white} g={pan} ax="x" />);
    [-5.75, 0, 5.75].forEach((x, b) => {
      const off = k % 2 ? 0.9 : -0.9;
      add(<Bx key={K()} p={[x - off * 0.4, y0 + 1.3, 7.33]} s={[3.5, 2.1, 0.06]} m={m.glass} g={win} ax="x" />);
      add(<Bx key={K()} p={[x - off * 0.4, y0 + 1.3, 7.37]} s={[0.07, 2.1, 0.04]} m={m.mull} g={win} />);
      const bt = eOut(prog(f, fk + 10 + b * 2.5, fk + 26 + b * 2.5));
      const bx = x + off;
      add(<Bx key={K()} p={[bx, y0 - 0.16, 8.3]} s={[4.4, 0.34, 1.9]} m={m.white} g={bt} ax="z" />);
      const rt = eOut(prog(f, fk + 20 + b * 2.5, fk + 32 + b * 2.5));
      add(<Bx key={K()} p={[bx, y0 + 0.55, 9.2]} s={[4.4, 1.05, 0.05]} m={m.rail} g={rt} cast={false} />);
      add(<Bx key={K()} p={[bx - 2.18, y0 + 0.55, 8.3]} s={[0.05, 1.05, 1.9]} m={m.rail} g={rt} cast={false} />);
      add(<Bx key={K()} p={[bx + 2.18, y0 + 0.55, 8.3]} s={[0.05, 1.05, 1.9]} m={m.rail} g={rt} cast={false} />);
      add(<Bx key={K()} p={[bx, y0 + 1.1, 9.2]} s={[4.4, 0.06, 0.08]} m={m.white} g={rt} ax="x" />);
    });
    // lateral esquerda e fundos
    add(<Bx key={K()} p={[-9.27, yc, 0]} s={[0.12, h, D + 0.4]} m={m.white} g={pan} />);
    [-3.3, 3.3].forEach((z) => add(<Bx key={K()} p={[-9.35, y0 + 1.3, z]} s={[0.06, 2.1, 3.8]} m={m.glass} g={win} ax="z" />));
    add(<Bx key={K()} p={[0, yc, -7.27]} s={[W + 0.4, h, 0.12]} m={m.white} g={pan} />);
    [-5.75, 0, 5.75].forEach((x) => add(<Bx key={K()} p={[x, y0 + 1.3, -7.35]} s={[3.2, 2.1, 0.06]} m={m.glass} g={win} ax="x" />));
  }
  // lateral direita: fachada ventilada em porcelanato (placas deslizam até o lugar)
  for (let k = 0; k < LEVELS; k++) {
    const fk = T.facade[0] + 8 + k * 15;
    const y0 = slabY(k), y1 = slabY(k + 1);
    const ph = (y1 - y0) / 2;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
      const t = eOut(prog(f, fk + (r * 4 + c) * 1.2, fk + (r * 4 + c) * 1.2 + 18));
      if (t <= 0) continue;
      const zw = (D + 1.2) / 4;
      add(<mesh key={K()} geometry={UNIT} material={m.terra}
        position={[9.36 + (1 - t) * 5, y0 + ph * r + ph / 2, -D / 2 - 0.6 + zw * c + zw / 2]}
        scale={[0.14, ph - 0.05, zw - 0.05]} castShadow receiveShadow />);
    }
  }
  // térreo comercial
  const gs = T.facade[0] + 135;
  const sf = eOut(prog(f, gs, gs + 24));
  add(<Bx key={K()} p={[0, 2.55, 6.85]} s={[17.6, 4.2, 0.08]} m={m.store} g={sf} ax="x" />);
  add(<Bx key={K()} p={[-8.85, 2.55, 0.2]} s={[0.08, 4.2, 13.2]} m={m.store} g={sf} ax="z" from="max" />);
  for (let i = 0; i <= 8; i++) add(<Bx key={K()} p={[-8.8 + i * 2.2, 2.55, 6.92]} s={[0.1, 4.2, 0.1]} m={m.mull} g={eOut(prog(f, gs + 6 + i, gs + 18 + i))} />);
  add(<Bx key={K()} p={[0.2, slabY(1) - 0.55, 7.65]} s={[W + 1.4, 0.55, 1.5]} m={m.copper} g={eIO(prog(f, gs + 22, gs + 46))} ax="x" />);
  // cobertura
  const rs = T.facade[0] + 175;
  const rt = eOut(prog(f, rs, rs + 22));
  add(<Bx key={K()} p={[0, ROOF + 0.5, 7.15]} s={[W + 0.4, 1, 0.2]} m={m.white} g={rt} />);
  add(<Bx key={K()} p={[0, ROOF + 0.5, -7.15]} s={[W + 0.4, 1, 0.2]} m={m.white} g={rt} />);
  add(<Bx key={K()} p={[-9.1, ROOF + 0.5, 0]} s={[0.2, 1, D + 0.4]} m={m.white} g={rt} />);
  add(<Bx key={K()} p={[9.1, ROOF + 0.5, 0]} s={[0.2, 1, D + 0.4]} m={m.terra} g={rt} />);
  add(<Bx key={K()} p={[0, ROOF + 1.6, -3.3]} s={[5, 3.2, 5]} m={m.white} g={eOut(prog(f, rs + 10, rs + 34))} />);

  // ---------- Grua: só na fundação e na estrutura; desmontada após a última laje ----------
  const down = craneDown(f);
  if (down < 0.999) {
    const gy = -down * (CR.H + 12);
    add(<Crane key={K()} f={f} m={m} gy={gy} />);
    const c = craneAt(f);
    const JY = CR.H + 0.95 + gy;
    const dx = Math.cos(c.ang), dz = -Math.sin(c.ang);
    const hy = c.y + gy;
    // cabo de aço em dois ramais, moitão e gancho
    [-0.14, 0.14].forEach((o, i) => add(
      <Bar key={K()} a={[c.tx + dx * o, JY - 0.5, c.tz + dz * o]} b={[c.hx + dx * o, hy + 1.1, c.hz + dz * o]} t={0.035} m={m.cable} cast={i === 0} />));
    add(
      <group key={K()} position={[c.hx, hy, c.hz]} rotation={[0, c.ang, 0]}>
        <mesh geometry={UNIT} material={m.crane} position={[0, 0.72, 0]} scale={[0.55, 0.75, 0.32]} castShadow />
        <mesh geometry={CYLX} material={m.craneD} position={[0, 0.85, 0]} rotation={[0, Math.PI / 2, 0]} scale={[0.36, 0.3, 0.3]} />
        <mesh geometry={UNIT} material={m.craneD} position={[0, 0.27, 0]} scale={[0.12, 0.18, 0.12]} />
        <mesh geometry={TOR} material={m.craneD} position={[0, 0.08, 0]} rotation={[0, Math.PI / 2, -0.6]} />
      </group>,
    );
    // lingas: do gancho à carga (quatro pernas nas peças deitadas, duas nas verticais)
    if (c.cyc >= 0 && c.u >= 0.15 && c.u < 0.8) {
      const cy = CYC[c.cyc], L = LOADS[cy.load];
      const ld = c.u >= 0.17 && c.u < 0.78 ? carried(cy, f) : null;
      const ctr: V3 = ld ? [ld.x, ld.y + gy, ld.z] : c.u < 0.5 ? [cy.pick[0], cy.pileTop + L.h / 2, cy.pick[1]] : [cy.drop[0], cy.y + (L.v ? L.lx / 2 : L.h / 2), cy.drop[1]];
      const yaw = ld ? ld.yaw : c.u < 0.5 ? cy.pickAng : (L.v ? cy.dropAng : cy.yaw);
      const tilt = ld ? ld.tilt : c.u < 0.5 ? 0 : (L.v ? 1 : 0);
      const pts: V3[] = L.v ? [[L.lx * 0.35, L.h / 2, 0], [-L.lx * 0.35, L.h / 2, 0]]
        : [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [a * L.lx * 0.4, L.h / 2, b * L.lz * 0.45] as V3);
      const e = new THREE.Euler(0, yaw, 0), ez = new THREE.Euler(0, 0, tilt * Math.PI / 2);
      const used = L.v && tilt > 0.5 ? [[L.lx / 2, 0, 0] as V3] : pts;
      used.forEach((q) => {
        const v = new THREE.Vector3(...q).applyEuler(ez).applyEuler(e);
        add(<Bar key={K()} a={[c.hx, hy, c.hz]} b={[ctr[0] + v.x, ctr[1] + v.y, ctr[2] + v.z]} t={0.025} m={m.cable} cast={false} />);
      });
    }
  }
  // cargas: nas pilhas, em transporte e já posicionadas (somem dentro do elemento executado)
  const pileOut = 1 - eIO(prog(f, 560, 595));
  if (pileOut > 0.01) (Object.keys(PILES) as LoadT[]).forEach((t) => {
    const L = LOADS[t], [px, pz] = PILES[t], ya = pileAng(t);
    const busy = CYC.some((c) => c.load === t && f >= c.att && f < c.rel + 6);
    add(<group key={K()} position={[px, 0, pz]} rotation={[0, ya, 0]} scale={[1, pileOut, 1]}>
      {[-0.38, 0.38].map((x) => <mesh key={x} geometry={UNIT} material={m.wood} position={[x * L.lx, DUNNAGE / 2, 0]} scale={[0.14, DUNNAGE, L.lz + 0.3]} castShadow receiveShadow />)}
    </group>);
    for (let n = 0; n < PILE_N + (busy ? 0 : 1); n++) add(<Load key={K()} t={t} p={[px, (DUNNAGE + n * L.h + L.h / 2) * pileOut, pz]} yaw={ya} m={m} sc={pileOut} />);
  });
  CYC.forEach((cy) => {
    if (f < cy.att || f >= cy.gone) return;
    const L = LOADS[cy.load];
    if (f < cy.rel) {
      const ld = carried(cy, f);
      add(<Load key={K()} t={cy.load} p={[ld.x, ld.y + (down < 0.999 ? -down * (CR.H + 12) : 0), ld.z]} yaw={ld.yaw} tilt={ld.tilt} m={m} />);
    } else {
      // fôrma de pilar é retirada depois da concretagem; as demais ficam embutidas
      const sc = cy.load === 'cform' ? 1 - eIO(prog(f, cy.gone - 6, cy.gone)) : 1;
      add(<Load key={K()} t={cy.load} p={[cy.drop[0], cy.y + (L.v ? L.lx / 2 : L.h / 2), cy.drop[1]]} yaw={L.v ? cy.dropAng : cy.yaw} tilt={L.v ? 1 : 0} m={m} sc={sc} />);
    }
  });

  // ---------- Entorno: vizinhança existente e paisagismo na entrega ----------
  const NB: [number, number, number, number, number, number][] = [
    [37, 2, 14, 16, 12.4, 1], [4, -31, 20, 12, 9.3, 2], [-30, -32, 14, 14, 18.6, 0], [32, -28, 14, 12, 6.2, 2], [-46, -12, 12, 12, 6.2, 1],
  ];
  const NM = [m.neigh, m.neigh2, m.neigh3];
  NB.forEach(([x, z, w, d, h, mi]) => {
    add(<Bx key={K()} p={[x, h / 2, z]} s={[w, h, d]} m={NM[mi]} />);
    add(<Bx key={K()} p={[x, h + 0.45, z]} s={[w * 0.35, 0.9, d * 0.35]} m={NM[mi]} />);
  });
  const TR: [number, number, number][] = [[-16, 11.9, 1.05], [-8.5, 12.1, 0.9], [-1, 11.8, 1.1], [7.5, 12.1, 0.95], [16, 11.9, 1.05], [-21.6, 4, 1], [-21.6, -6, 0.9], [25, 11.9, 0.9]];
  TR.forEach(([x, z, sc], i) => {
    const t = eOut(prog(f, T.env[0] + 25 + i * 6, T.env[0] + 70 + i * 6));
    if (t <= 0.01) return;
    const s = sc * (0.55 + 0.45 * t);
    add(
      <group key={K()} position={[x, 0.13, z]} scale={[s, s * t, s]}>
        <mesh geometry={CYL} material={m.trunk} position={[0, 1.6, 0]} scale={[0.14, 3.2, 0.14]} castShadow />
        <mesh geometry={ICO} material={m.green} position={[0, 4.3, 0]} scale={[1.7, 1.45, 1.7]} castShadow />
        <mesh geometry={ICO} material={m.green2} position={[0.9, 3.8, 0.4]} scale={[1.15, 1.0, 1.15]} castShadow />
        <mesh geometry={ICO} material={m.green} position={[-0.8, 3.9, -0.3]} scale={[1.1, 0.95, 1.1]} castShadow />
        <mesh geometry={ICO} material={m.green2} position={[0.1, 5.2, -0.5]} scale={[1.0, 0.85, 1.0]} castShadow />
      </group>,
    );
  });

  // ---------- Projeto (linhas âmbar) ----------
  const ghost: React.ReactElement[] = [];
  if (m.ghost.opacity > 0.005) {
    for (let k = 0; k < LEVELS; k++) {
      const g = ghostIn(k);
      if (g <= 0) continue;
      const y0 = slabY(k), y1 = slabY(k + 1);
      ghost.push(<lineSegments key={`g${k}`} geometry={EDGES} material={m.ghost} position={[0, (y0 + y1) / 2, 0]} scale={[W + 0.4, (y1 - y0) * g, D + 0.4]} />);
      if (k > 0) [-5.75, 0, 5.75].forEach((x, b) => {
        const off = k % 2 ? 0.9 : -0.9;
        ghost.push(<lineSegments key={`gb${k}${b}`} geometry={EDGES} material={m.ghost} position={[x + off, y0, 8.25]} scale={[4.4 * g, 0.34, 1.9]} />);
      });
    }
    const gc = prog(f, 20, 80);
    COLX.forEach((x) => COLZ.forEach((z) => ghost.push(
      <lineSegments key={`gc${x}${z}`} geometry={EDGES} material={m.ghost} position={[x, ROOF * gc / 2, z]} scale={[0.5, ROOF * gc + 0.01, 0.5]} />,
    )));
  }
  const lotLine = useMemo(() => new THREE.Line(new THREE.BufferGeometry().setFromPoints(
    [[LOT.x0, LOT.z0], [LOT.x1, LOT.z0], [LOT.x1, LOT.z1], [LOT.x0, LOT.z1], [LOT.x0, LOT.z0]].map(([x, z]) => new THREE.Vector3(x, 0.2, z)),
  ), m.lot), [m]);

  const sunI = 0.3 + 2.7 * day;
  return (
    <>
      <Cam f={f} portrait={portrait} />
      <hemisphereLight args={[lerpC('#3a5878', '#d6e6f4', day), lerpC('#0e1a24', '#8a8274', day), 0.3 + 0.45 * day]} />
      <directionalLight
        position={[46, 58, 40]} intensity={sunI} color={lerpC('#ffc890', '#fff3e2', day)} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-bias={-0.0003} shadow-normalBias={0.03} shadow-radius={3}
        shadow-camera-left={-60} shadow-camera-right={60} shadow-camera-top={60} shadow-camera-bottom={-60} shadow-camera-near={1} shadow-camera-far={220}
      />
      {gridOp > 0.003 && (
        <gridHelper args={[180, 90, '#f2b32a', '#4c6a80']} position={[0, 0.16, 0]}
          material-transparent material-opacity={gridOp} material-depthWrite={false} />
      )}
      <primitive object={lotLine} />
      {els}
      {ghost}
    </>
  );
};
