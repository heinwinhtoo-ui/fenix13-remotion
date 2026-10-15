import React from 'react';
import {Composition} from 'remotion';
import {Film} from './Film';
export const Root: React.FC = () => <Composition id="FenixNightEngine" component={Film}
  width={1080} height={1920} fps={30} durationInFrames={900} />;
