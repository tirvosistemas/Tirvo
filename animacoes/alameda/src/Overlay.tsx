import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {prog, eOut, eIO, STAGES, T, LEVELS} from './tl';

const AMB = '#f2b32a';
const BC = '"Barlow Condensed", sans-serif';
const PM = '"IBM Plex Mono", monospace';

export const Fonts = () => (
  <style>{`
@font-face{font-family:"Barlow Condensed";font-weight:600;src:url(${staticFile('fonts/bc600.woff2')}) format("woff2")}
@font-face{font-family:"Barlow Condensed";font-weight:700;src:url(${staticFile('fonts/bc700.woff2')}) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:400;src:url(${staticFile('fonts/pm400.woff2')}) format("woff2")}
@font-face{font-family:"IBM Plex Mono";font-weight:500;src:url(${staticFile('fonts/pm500.woff2')}) format("woff2")}
`}</style>
);

const Mark = ({s}: {s: number}) => (
  <svg width={s} height={s} viewBox="0 0 48 48" style={{display: 'block'}}>
    <path d="M0 0H48V30H39V9H9V39H30V48H0Z" fill="#fff" />
    <path d="M39 39H48V48H39Z" fill={AMB} />
  </svg>
);

const mono = (size: number, extra: React.CSSProperties = {}): React.CSSProperties => ({
  fontFamily: PM, fontWeight: 500, fontSize: size, letterSpacing: '0.12em', textTransform: 'uppercase', ...extra,
});
const shadow = '0 2px 18px rgba(4,12,18,.55)';
const pad2 = (n: number) => String(n).padStart(2, '0');

export const Overlay = () => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const P = portrait ? 64 : 72;

  const endT = eIO(prog(f, T.end[0], T.end[0] + 30));
  const hud = eOut(prog(f, 4, 30)) * (1 - endT);
  const intro = eOut(prog(f, 8, 34)) * (1 - eIO(prog(f, 78, 100)));
  const si = STAGES.findIndex((s) => f >= s.a && f < s.b);
  const st = STAGES[Math.max(0, si)];
  const sp = prog(f, st.a, st.b);
  const enter = eOut(prog(f, st.a, st.a + 16));
  const stageVis = eOut(prog(f, 92, 112)) * (1 - endT);

  const month = Math.max(1, Math.min(26, Math.floor(1 + 25 * prog(f, 100, 1140))));
  const floors = Math.max(0, Math.min(LEVELS, Math.floor((f - T.struct - 16) / T.lvl + 1)));
  const pct = Math.round(100 * prog(f, 100, 1140));

  const stat = (label: string, value: string) => (
    <div style={{minWidth: portrait ? 0 : 150}}>
      <div style={mono(14, {color: 'rgba(255,255,255,.72)'})}>{label}</div>
      <div style={{fontFamily: BC, fontWeight: 700, fontSize: portrait ? 50 : 54, lineHeight: 1, color: '#fff', marginTop: 6, fontVariantNumeric: 'tabular-nums'}}>{value}</div>
    </div>
  );

  return (
    <AbsoluteFill style={{color: '#fff', textShadow: shadow}}>
      <Fonts />
      {/* vinheta */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(5,14,21,.42) 100%)'}} />
      <AbsoluteFill style={{background: `linear-gradient(${portrait ? 0 : 15}deg, rgba(8,18,26,.62) 0%, rgba(8,18,26,0) ${portrait ? 34 : 42}%)`, opacity: 1 - endT}} />

      {/* marca e ficha */}
      <div style={{position: 'absolute', left: P, top: P - 8, display: 'flex', alignItems: 'center', gap: 16, opacity: hud}}>
        <Mark s={42} />
        <div>
          <div style={{fontFamily: BC, fontWeight: 700, fontSize: 36, letterSpacing: '0.06em', lineHeight: 1}}>ORTIVAL</div>
          <div style={mono(12, {color: 'rgba(255,255,255,.75)', marginTop: 4, letterSpacing: '0.3em'})}>Engenharia</div>
        </div>
      </div>
      <div style={{
        position: 'absolute', opacity: hud, textAlign: portrait ? 'left' : 'right',
        ...(portrait ? {left: P, top: P + 64} : {right: P, top: P - 4}),
      }}>
        <div style={mono(15, {color: '#fff'})}>Edifício Alameda</div>
        <div style={mono(13, {color: 'rgba(255,255,255,.7)', marginTop: 6})}>Água Verde · Curitiba</div>
        <div style={mono(12, {color: AMB, marginTop: 6})}>Animação 3D · Projeto demonstrativo</div>
      </div>

      {/* abertura */}
      <div style={{
        position: 'absolute', left: P, right: P, top: portrait ? 470 : 0, bottom: portrait ? 'auto' : 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: portrait ? 'flex-start' : 'center',
        textAlign: portrait ? 'left' : 'center', opacity: intro,
      }}>
        <div style={mono(18, {color: AMB, letterSpacing: '0.34em', transform: `translateY(${(1 - intro) * 14}px)`})}>Do projeto à entrega</div>
        <div style={{fontFamily: BC, fontWeight: 700, fontSize: portrait ? 132 : 150, lineHeight: 0.92, marginTop: 18, letterSpacing: '0.01em', transform: `translateY(${(1 - intro) * 30}px)`}}>
          Edifício{portrait ? <br /> : ' '}Alameda
        </div>
        <div style={mono(17, {color: 'rgba(255,255,255,.82)', marginTop: 26, letterSpacing: '0.16em'})}>Térreo + 8 pavimentos · 32 apartamentos · 6.240 m²</div>
      </div>

      {/* etapa atual */}
      <div style={{position: 'absolute', left: P, bottom: portrait ? 300 : P, width: portrait ? width - 2 * P : 620, opacity: stageVis}}>
        <div style={{display: 'flex', gap: 8, marginBottom: 26}}>
          {STAGES.map((s, i) => {
            const fill = i < si ? 1 : i === si ? sp : 0;
            return (
              <div key={s.n} style={{flex: 1, height: 4, background: 'rgba(255,255,255,.22)', borderRadius: 2, overflow: 'hidden'}}>
                <div style={{width: `${fill * 100}%`, height: '100%', background: AMB}} />
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 22, opacity: enter, transform: `translateY(${(1 - enter) * 22}px)`}}>
          <div style={{fontFamily: BC, fontWeight: 700, fontSize: portrait ? 104 : 112, lineHeight: 0.8, color: AMB}}>{st.n}</div>
          <div>
            <div style={mono(14, {color: 'rgba(255,255,255,.72)'})}>Etapa {st.n} de 06</div>
            <div style={{fontFamily: BC, fontWeight: 700, fontSize: portrait ? 64 : 68, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: 6}}>{st.t}</div>
          </div>
        </div>
        <div style={mono(16, {color: 'rgba(255,255,255,.86)', marginTop: 16, letterSpacing: '0.08em', textTransform: 'none', opacity: enter})}>{st.s}</div>
      </div>

      {/* números da obra */}
      <div style={{
        position: 'absolute', display: 'flex', gap: portrait ? 0 : 44, opacity: stageVis,
        ...(portrait ? {left: P, right: P, bottom: 130, justifyContent: 'space-between'} : {right: P, bottom: P + 4}),
      }}>
        {stat('Mês', `${pad2(month)}/26`)}
        {stat('Lajes', `${pad2(floors)}/${pad2(LEVELS)}`)}
        {stat('Execução', `${pct}%`)}
      </div>

      {/* encerramento */}
      <AbsoluteFill style={{
        opacity: endT, background: 'linear-gradient(180deg, rgba(8,18,26,0) 30%, rgba(8,18,26,.78) 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: portrait ? 'flex-start' : 'center',
        padding: portrait ? `0 ${P}px 210px` : `0 ${P}px 96px`, textAlign: portrait ? 'left' : 'center',
      }}>
        <div style={{transform: `translateY(${(1 - endT) * 26}px)`, display: 'flex', flexDirection: 'column', alignItems: portrait ? 'flex-start' : 'center'}}>
          <Mark s={64} />
          <div style={{fontFamily: BC, fontWeight: 700, fontSize: portrait ? 104 : 112, lineHeight: 0.95, marginTop: 26}}>Edifício Alameda</div>
          <div style={mono(17, {color: 'rgba(255,255,255,.88)', marginTop: 18, letterSpacing: '0.14em'})}>Entregue em 26 meses · 32 apartamentos</div>
          <div style={{width: 90, height: 3, background: AMB, margin: portrait ? '30px 0 22px' : '30px auto 22px'}} />
          <div style={{fontFamily: BC, fontWeight: 600, fontSize: 40, letterSpacing: '0.08em'}}>ORTIVAL ENGENHARIA</div>
          <div style={mono(12, {color: 'rgba(255,255,255,.6)', marginTop: 12, letterSpacing: '0.2em'})}>Empresa fictícia · animação demonstrativa criada pela Tirvo</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
