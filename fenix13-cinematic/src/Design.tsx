import React,{useEffect,useState} from 'react';
import {cancelRender,continueRender,delayRender,staticFile} from 'remotion';
import {clamp,out,palette as P} from './motion';
import typeface from './typeface.json';
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
export const Label:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=>
  <div style={{fontFamily:MONO,fontSize:23,letterSpacing:3,lineHeight:1.6,...style}}>{children}</div>;
export function Type({text,t,at,size=110,color=P.paper,width=900,center=false,stagger=.055,duration=1.05}:{text:string;t:number;at:number;size?:number;color?:string;width?:number;center?:boolean;stagger?:number;duration?:number}){
  const glyphs=typeface.glyphs as Record<string,{ha:number}>;
  const natural=Array.from(text).reduce((a,c)=>a+(glyphs[c]?.ha||600)/typeface.resolution*size-size*.04,0);
  const fit=Math.min(1,width/natural);
  return <div style={{position:'relative',width,height:size*1.08,fontFamily:S,fontWeight:800,fontSize:size,
    lineHeight:1.02,letterSpacing:-size*.04,fontKerning:'none',color,perspective:1400}}>
    <div style={{position:'absolute',top:0,left:center?(width-natural*fit)/2:0,whiteSpace:'nowrap',transform:`scaleX(${fit})`,transformOrigin:'left top'}}>
      {Array.from(text).map((c,i)=>{
        const p=out((t-at-i*stagger)/duration);
        return <span key={i} style={{display:'inline-block',whiteSpace:'pre',opacity:clamp(p*4),transformOrigin:'50% 95%',
          transform:`translate3d(0,${(1-p)*size*.72}px,${(1-p)*-110}px) rotateX(${(1-p)*-75}deg)`,
          filter:p<1?`blur(${(1-p)*3}px)`:undefined}}>{c}</span>;
      })}
    </div>
  </div>;
}
