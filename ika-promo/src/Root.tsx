import React from 'react';
import {Composition} from 'remotion';
import {IkaPromo} from './Main';
import {TOTAL_FRAMES} from './timeline';
import {FPS, H, W} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="IkaPromo"
    component={IkaPromo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={W}
    height={H}
    defaultProps={{vo: true, music: false, sfx: true}}
  />
);
