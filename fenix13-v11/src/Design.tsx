import React,{useEffect,useState} from 'react';
import {cancelRender,continueRender,delayRender,staticFile} from 'remotion';
import {clamp,out,palette as P} from './motion';
export const S='"Syne",sans-serif',M='"Manrope",sans-serif',MONO='"Space",monospace';
export function useFonts(){
  const [handle]=useState(()=>delayRender('Local brand typography'));
  useEffect(()=>{
    Promise.all([
      ['Syne','syne-latin-800-normal.woff2','800'],['Manrope','manrope-latin-500-normal.woff2','500'],
      ['Manrope','manrope-latin-800-normal.woff2','800'],['Space','space-mono-latin-400-normal.woff2','400']
    ].map(async([family,file,weight])=>{
      const f=new FontFace(family,`url("${staticFile('fonts/'+file)}")`,{weight});
      await f.load();document.fonts.add(f);
    })).then(()=>continueRender(handle)).catch(cancelRender);
  },[handle]);
}
