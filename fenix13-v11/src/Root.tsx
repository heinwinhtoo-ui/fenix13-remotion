import React from 'react';
import {Composition} from 'remotion';
import {Film} from './PhoenixFilm';
export const Root:React.FC=()=> <Composition id="FenixCream" component={Film} width={1080} height={1920} fps={30} durationInFrames={960}/>;
