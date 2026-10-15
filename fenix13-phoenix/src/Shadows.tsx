import React from 'react';
import {ease,enter,mix,palette as P} from './motion';

/** Original, featureless vector silhouettes, explicitly requested for V6. */
export function PeopleShadow({t,mode='friends',opacity=.8}:{t:number;mode?:'bar'|'friends';opacity?:number}){
  const count=mode==='bar'?2:4;
  return <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity}}>
    <defs>
      <radialGradient id={'peopleGlow'+mode}><stop stopColor="#d88032" stopOpacity=".2"/><stop offset="1" stopColor="#d88032" stopOpacity="0"/></radialGradient>
      <linearGradient id={'person'+mode} x1="0" x2="1"><stop stopColor="#080807"/><stop offset=".65" stopColor="#13100c"/><stop offset="1" stopColor="#302112"/></linearGradient>
    </defs>
    <ellipse cx="540" cy="1280" rx="535" ry="480" fill={`url(#peopleGlow${mode})`}/>
    <path d="M140 1440Q540 1370 940 1440L860 1490H220Z" fill="#050505" stroke="#b1793c" strokeWidth="1.2" opacity=".7"/>
    {Array.from({length:count},(_,i)=>{
      const x=mode==='bar'?[340,730][i]:[230,440,650,850][i];
      const s=mode==='bar'?[1.12,1.02][i]:[.91,1.12,1.06,.86][i];
      const angle=Math.sin(t*.55+i)*1.4;
      const lift=mode==='bar'?-.06:mix(.08,-.15,.5+.5*Math.sin(t*.4+i));
      return <g key={i} transform={`translate(${x} 1450) scale(${s}) rotate(${angle})`}>
        <ellipse cx="0" cy="72" rx="94" ry="13" fill="#000" opacity=".4"/>
        <path d="M-56-206Q-75-156-81-78L-70 55H70L80-76Q75-159 49-201Q17-225-56-206Z"
          fill={`url(#person${mode})`} stroke="#9b6b3a" strokeWidth="1.3" strokeOpacity=".6"/>
        <path d="M-22-236L-23-201Q0-184 24-205L23-237Z" fill="#0b0a08"/>
        <ellipse cx="0" cy="-270" rx="43" ry="53" fill="#0b0a08" stroke="#ba844c" strokeWidth="1.15" strokeOpacity=".48"/>
        <path d="M-62-175Q-93-120-96-78L-35-62" fill="none" stroke="#0a0908" strokeWidth="30" strokeLinecap="round"/>
        <g transform={`rotate(${lift*180/Math.PI} 59 -170)`}>
          <path d="M58-173L100-116L137-198" fill="none" stroke="#110d09" strokeWidth="27" strokeLinejoin="round" strokeLinecap="round"/>
          <path d="M127-232H153L150-202H130Z" fill="#21170d" stroke="#d28e48" strokeWidth="1.4"/>
          <path d="M140-202V-190M130-189H150" fill="none" stroke="#bd884d" strokeWidth="1.2"/>
        </g>
      </g>;
    })}
    {mode==='bar'&&<g><path d="M155 1420H925L960 1450H120Z" fill="#080706" stroke="#b5834c" strokeWidth="1.4"/>
      <path d="M190 1452V1620H890V1452" fill="#0c0a08" stroke="#593d25" strokeWidth="1"/>
      <path d="M222 1535H857" stroke="#cf8242" strokeWidth="1" opacity=".25"/>
    </g>}
    <path d="M80 1640Q540 1690 1000 1640" fill="none" stroke="#6d4b2d" strokeWidth="1" opacity=".3"/>
  </svg>;
}

export function BBQShadow({t,at=26,small=false}:{t:number;at?:number;small?:boolean}){
  const p=enter(t,at+.4,1.8);
  return <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:p}}>
    <defs>
      <radialGradient id="coalGlow"><stop stopColor="#ff9d32" stopOpacity=".65"/><stop offset=".4" stopColor="#f64b13" stopOpacity=".25"/><stop offset="1" stopColor="#ed2d09" stopOpacity="0"/></radialGradient>
      <linearGradient id="grillMetal" x1="0" y1="0" x2="1" y2=".5"><stop stopColor="#0b0b09"/><stop offset=".46" stopColor="#342313"/><stop offset=".65" stopColor="#100e0a"/><stop offset="1" stopColor="#060605"/></linearGradient>
      <linearGradient id="coal" x1="0" y1="1" x2="0" y2="0"><stop stopColor="#c52e09"/><stop offset="1" stopColor="#ffa835"/></linearGradient>
    </defs>
    <g transform={`translate(540 ${small?1370:1400}) scale(${small?.73:1}) translate(-540 -1400)`}>
      <ellipse cx="540" cy="1285" rx="475" ry="345" fill="url(#coalGlow)" opacity={.8+.1*Math.sin(t*2)}/>
      <ellipse cx="550" cy="1660" rx="390" ry="38" fill="#000" opacity=".22"/>
      <g transform={`rotate(${mix(-7,0,ease((t-at)/3))} 540 1300)`}>
        {/* Raised lid; the food is represented by abstract skewer silhouettes. */}
        <path d="M215 1190C170 1080 294 984 539 984C784 984 908 1080 863 1190Z" fill="#10100c" stroke="#6d4c28" strokeWidth="2"/>
        <path d="M475 1000V978Q540 947 605 978V1000" fill="none" stroke="#2b2116" strokeWidth="17" strokeLinecap="round"/>
        <path d="M219 1260C235 1443 340 1502 540 1502C740 1502 845 1443 861 1260Z" fill="url(#grillMetal)" stroke="#5e3c20" strokeWidth="2"/>
        <ellipse cx="540" cy="1258" rx="325" ry="102" fill="#080907" stroke="#75512b" strokeWidth="3"/>
        <ellipse cx="540" cy="1270" rx="287" ry="70" fill="#4a200b"/>
        {Array.from({length:12},(_,i)=><path key={i} d={`M${275+i*43} ${1234-Math.sin(i/11*Math.PI)*28}L${270+i*44} ${1280+Math.sin(i/11*Math.PI)*45}`}
          stroke={i%3?'#7c4922':'#ef8b35'} strokeWidth="5" opacity=".8"/>)}
        <ellipse cx="540" cy="1258" rx="325" ry="102" fill="none" stroke="#b17838" strokeWidth="3"/>
        {[0,1].map(i=><g key={i} transform={`translate(${375+i*185} ${1210+i*24}) rotate(-10)`}>
          <path d="M-60-10L155 53" stroke="#d28a42" strokeWidth="3"/>
          {[0,1,2,3].map(j=><path key={j} d={`M${-23+j*43} ${-10+j*12}l29 8-5 25-29-8Z`} fill="#0a0a07" stroke="#785124" strokeWidth="1"/>)}
        </g>)}
        <path d="M346 1453L300 1640M731 1453L790 1640M318 1587H771" fill="none" stroke="#1a1711" strokeWidth="18" strokeLinecap="round"/>
        <circle cx="301" cy="1642" r="34" fill="#080807" stroke="#7d552b" strokeWidth="3"/>
        <circle cx="789" cy="1642" r="34" fill="#080807" stroke="#7d552b" strokeWidth="3"/>
        <path d="M230 1330H185M855 1330H900" stroke="#332617" strokeWidth="13" strokeLinecap="round"/>
      </g>
      {[0,1,2,3].map(i=>{
        const drift=(t*.15+i*.24)%1;
        return <path key={i} d={`M${400+i*80} 1190C${320+i*90} 1110 ${540+i*20} 1070 ${400+i*65} 980S${330+i*95} 850 ${430+i*70} 800`}
          transform={`translate(${Math.sin(t*.6+i)*18} ${-drift*80})`} fill="none" stroke="#f9d49a" strokeWidth={3-i*.4}
          opacity={(1-drift)*.15} strokeLinecap="round"/>;
      })}
    </g>
  </svg>;
}
