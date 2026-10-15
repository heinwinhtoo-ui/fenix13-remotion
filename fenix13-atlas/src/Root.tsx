import React from 'react';
import {Composition} from 'remotion';
import {Film} from './AtlasFilm';
export const Root: React.FC = () => <Composition id="FenixAtlas" component={Film}
  width={1080} height={1920} fps={60} durationInFrames={1920} />;
