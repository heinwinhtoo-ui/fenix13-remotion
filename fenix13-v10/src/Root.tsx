import React from 'react';
import {Composition,AbsoluteFill,useCurrentFrame,Audio,staticFile} from 'remotion';
import {Film,EndCard} from './PhoenixFilm';
import {useFonts} from './Design';
import {Hero} from './Hero';
const HeroProof=()=> {useFonts();const t=27+useCurrentFrame()/30;return <AbsoluteFill style={{background:'#070706'}}><Audio src={staticFile('audio/FENIX_ORIGINAL_MASTER.wav')} startFrom={810}/><Hero t={t}/><EndCard t={t}/></AbsoluteFill>;};
export const Root:React.FC=()=> <><Composition id="FenixPhoenix" component={Film} width={1080} height={1920} fps={30} durationInFrames={1200}/><Composition id="PhoenixHero" component={HeroProof} width={1080} height={1920} fps={30} durationInFrames={270}/></>;
