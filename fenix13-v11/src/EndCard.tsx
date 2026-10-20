import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {M} from './Design';
import {enter,out} from './motion';

// The supplied JPEG is displayed directly, without redrawing or recoloring it.
export function EndCard({t}:{t:number}){
 const u=t-27;
 return <AbsoluteFill>
  <Img src={staticFile('brand/ending-bridge.png')} style={{width:1080,height:1920}}/>
  <AbsoluteFill style={{opacity:enter(u,0,.65),background:'radial-gradient(ellipse at 50% 42%,#f0e2cd,#eddec9 75%)',color:'#292621'}}>
   <div style={{position:'absolute',left:0,top:300,width:1080,height:810,opacity:enter(u,.15,.75),transform:`translateY(${(1-out((u-.15)/.85))*20}px)`}}>
    <Img src={staticFile('brand/FENIX13_OFFICIAL_CREAM.jpg')} style={{width:1080,height:810,objectFit:'contain',maskImage:'linear-gradient(to bottom,transparent,black 2%,black 97%,transparent)',WebkitMaskImage:'linear-gradient(to bottom,transparent,black 2%,black 97%,transparent)'}}/>
   </div>
   <div style={{position:'absolute',left:80,top:1200,width:920,textAlign:'center',fontFamily:M,opacity:enter(u,.65,.65),transform:`translateY(${(1-out((u-.65)/.7))*16}px)`}}>
    <div style={{fontSize:80,fontWeight:800,letterSpacing:2}}>COMING SOON</div>
    <div style={{height:1,width:560,margin:'46px auto 38px',background:'linear-gradient(90deg,transparent,#765038,transparent)'}}/>
    <div style={{fontSize:29,fontWeight:500,letterSpacing:4}}>TAUNGGYI, SHAN STATE</div>
    <div style={{fontSize:31,fontWeight:500,letterSpacing:2.4,color:'#67442e',marginTop:52}}>THE NIGHT COMES ALIVE.</div>
   </div>
  </AbsoluteFill>
 </AbsoluteFill>;
}
