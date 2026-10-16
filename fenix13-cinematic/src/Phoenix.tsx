import React from 'react';
import {Img,staticFile} from 'remotion';
import {clamp,ease,enter,exit,io,mix,out,palette as P} from './motion';
import {Label,Type,M} from './Design';
import {Cinema3D} from './Cinema3D';

// Measured source image glyph intervals: preserve the supplied three-bar E and
// custom /13 instead of substituting font glyphs during the logo reveal.
const cuts=[206,367,530,720,782,945.5,1039,1108.5,1245];
export const letterTimes=Array.from({length:8},(_,i)=>46+i*.65);

export function PhoenixIdent({t}:{t:number}){
  const crest=io((t-52.8)/1.05);
  const logo=staticFile('brand/fenix13-chill-grill.png');
  const final=enter(t,53.55,.8);
  return <>
    <svg width="1080" height="1920" style={{position:'absolute',inset:0}}>
      <defs><linearGradient id="flightTrail"><stop stopColor="#ff6214" stopOpacity="0"/><stop offset="1" stopColor="#ffd595" stopOpacity=".7"/></linearGradient>
        <radialGradient id="mergeLight"><stop stopColor="#fff3d5" stopOpacity=".45"/><stop offset=".2" stopColor="#ffae51" stopOpacity=".2"/><stop offset="1" stopColor="#ff6713" stopOpacity="0"/></radialGradient>
        <clipPath id="arcSafe"><rect x="0" y="0" width="1080" height="984"/></clipPath>
      </defs>
      <g clipPath="url(#arcSafe)"><circle cx="540" cy="738" r="335" fill="none" stroke="#ce8441" strokeWidth="1.4" pathLength="1"
        strokeDasharray={`${clamp((t-51.8)/1.7)} 1`} transform="rotate(-95 540 738)" opacity={exit(t,54,.7)*.6}/></g>
      <ellipse cx="640" cy="640" rx="240" ry="240" fill="url(#mergeLight)" opacity={Math.sin(clamp((t-51.8)/2.1)*Math.PI)*.85}/>
    </svg>
    {t<53.3&&<Cinema3D t={t} kind="bird"/>}
    <svg width="1120" height="840" viewBox="0 0 1448 1086" style={{position:'absolute',left:-20,top:370,mixBlendMode:'screen'}}>
      <defs>
        <clipPath id="crestCrop"><rect x="0" y="0" width="1448" height="801"/></clipPath>
        <clipPath id="crestReveal"><circle cx="853" cy="349" r={crest*1050}/></clipPath>
        <clipPath id="tagCrop"><rect x="0" y="965" width="1448" height="121"/></clipPath>
        {letterTimes.map((at,i)=>{
          const p=out((t-at)/1.1);
          return <clipPath key={i} id={'letter'+i}><rect x={cuts[i]} y={800+(1-p)*165} width={cuts[i+1]-cuts[i]} height={p*165}/></clipPath>;
        })}
      </defs>
      {t>=54?<image href={logo} width="1448" height="1086"/>:<>
        <g clipPath="url(#crestReveal)"><g clipPath="url(#crestCrop)"><image href={logo} width="1448" height="1086"/></g></g>
        {letterTimes.map((at,i)=>{
          const p=out((t-at)/1.1),cx=(cuts[i]+cuts[i+1])/2;
          return <g key={i} transform={`translate(0 ${(1-p)*65}) rotate(${(1-p)*(i%2?5:-5)} ${cx} 882)`} opacity={p}>
            <g clipPath={`url(#letter${i})`}><image href={logo} width="1448" height="1086"/></g>
          </g>;
        })}
        <g opacity={enter(t,51.8,1.2)} clipPath="url(#tagCrop)"><image href={logo} width="1448" height="1086"/></g>
      </>}
    </svg>
    <Label style={{position:'absolute',left:90,top:205,color:P.copper,opacity:exit(t,47,.8)}}>THE RETURN / FENIX /13</Label>
    <div style={{position:'absolute',left:85,top:1350,opacity:exit(t,46.4,.9)}}>
      <Type text="THE FIRE" t={t} at={42.2} size={93}/>
      <Type text="COMES HOME." t={t} at={42.65} size={83}/>
    </div>
    <div style={{position:'absolute',top:1290,left:90,opacity:final}}>
      <Type text="COMING SOON" t={t} at={53.65} size={87} center stagger={.045} duration={1.05}/>
    </div>
    <div style={{position:'absolute',left:90,top:1450,width:900,textAlign:'center',opacity:enter(t,54.3,.9)}}>
      <div style={{width:620,height:1,margin:'0 auto 32px',background:'linear-gradient(90deg,transparent,#e39555,transparent)'}}/>
      <Label style={{fontSize:26}}>TAUNGGYI, SHAN STATE</Label>
      <div style={{fontFamily:M,fontSize:30,letterSpacing:3,color:P.orange,marginTop:52,opacity:enter(t,55,.9)}}>THE NIGHT COMES ALIVE.</div>
    </div>
    <Label style={{position:'absolute',top:1690,left:90,width:900,textAlign:'center',fontSize:18,color:'#957c60',opacity:enter(t,54.8)}}>CHILL. GRILL. COME ALIVE.</Label>
  </>;
}
