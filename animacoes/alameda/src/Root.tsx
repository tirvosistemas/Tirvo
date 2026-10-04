import React from 'react';
import {AbsoluteFill, Composition, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import * as THREE from 'three';
import {Scene} from './Scene';
import {Overlay} from './Overlay';
import {DUR, FPS, skyAt} from './tl';

const Alameda = () => {
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const sky = skyAt(useCurrentFrame());
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${sky.top} 0%, ${sky.bot} 62%, ${sky.bot} 100%)`}}>
      <ThreeCanvas
        width={width} height={height} shadows={{type: THREE.PCFSoftShadowMap}}
        gl={{antialias: true, preserveDrawingBuffer: true}}
        camera={{fov: portrait ? 52 : 36, position: [0, 30, 90], near: 0.5, far: 900}}
      >
        <Scene portrait={portrait} />
      </ThreeCanvas>
      <Overlay />
    </AbsoluteFill>
  );
};

export const Root = () => (
  <>
    <Composition id="Alameda" component={Alameda} durationInFrames={DUR} fps={FPS} width={1920} height={1080} />
    <Composition id="AlamedaVertical" component={Alameda} durationInFrames={DUR} fps={FPS} width={1080} height={1920} />
  </>
);
