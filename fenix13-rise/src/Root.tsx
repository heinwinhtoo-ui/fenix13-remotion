import React from 'react';
import {Composition} from 'remotion';
import {Film} from './PhoenixFilm';
export const Root: React.FC = () => <Composition id="FenixPhoenix" component={Film}
  width={1080} height={1920} fps={60} durationInFrames={2400} />;
