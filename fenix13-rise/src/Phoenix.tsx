import React from 'react';
import {Img,staticFile} from 'remotion';
import {clamp,enter,exit,palette as P} from './motion';
import {Label,Type,M} from './Design';
import {Cinema3D} from './Cinema3D';
import {Logo3D} from './Logo3D';

export const letterTimes=Array.from({length:8},(_,i)=>30.1+i*.22);
export function PhoenixIdent({t}:{t:number}){
  return <>
    <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 59% 34%,#8a350c22,transparent 43%)'}}/>
    {t<33.1&&<Cinema3D t={t} kind="bird"/>}
    <Logo3D t={t}/>
    <div style={{position:'absolute',left:-20,top:370,width:1120,height:840,mixBlendMode:'screen',opacity:enter(t,34.65,.4)}}>
      <Img src={staticFile('brand/fenix13-chill-grill.png')} style={{width:'100%',height:'100%'}}/>
    </div>
    <div style={{position:'absolute',left:440,top:455,width:400,height:400,borderRadius:'50%',background:'radial-gradient(circle,#fff4d7 0%,#ffc06355 8%,#ff671314 32%,transparent 67%)',
      opacity:Math.sin(clamp((t-31.9)/1.9)*Math.PI)*.9,mixBlendMode:'screen'}}/>
    <Label style={{position:'absolute',left:90,top:205,color:P.copper,opacity:exit(t,30.5,.6)}}>THE RETURN / FENIX /13</Label>
    <div style={{position:'absolute',left:85,top:1350,opacity:exit(t,30,.65)}}>
      <Type text="THE FIRE" t={t} at={27.2} size={93} duration={.7} stagger={.035}/>
      <Type text="COMES HOME." t={t} at={27.5} size={83} duration={.7} stagger={.035}/>
    </div>
    <div style={{position:'absolute',top:1290,left:90,opacity:enter(t,34.7,.65)}}>
      <Type text="COMING SOON" t={t} at={34.75} size={87} center stagger={.035} duration={.8}/>
    </div>
    <div style={{position:'absolute',left:90,top:1450,width:900,textAlign:'center',opacity:enter(t,35.35,.65)}}>
      <div style={{width:620,height:1,margin:'0 auto 32px',background:'linear-gradient(90deg,transparent,#e39555,transparent)'}}/>
      <Label style={{fontSize:26}}>TAUNGGYI, SHAN STATE</Label>
      <div style={{fontFamily:M,fontSize:30,letterSpacing:3,color:P.orange,marginTop:52,opacity:enter(t,35.7,.7)}}>THE NIGHT COMES ALIVE.</div>
    </div>
    <Label style={{position:'absolute',top:1690,left:90,width:900,textAlign:'center',fontSize:18,color:'#957c60',opacity:enter(t,36)}}>CHILL. GRILL. COME ALIVE.</Label>
  </>;
}
