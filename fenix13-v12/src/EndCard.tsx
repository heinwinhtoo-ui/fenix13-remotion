import React from 'react';
import {AbsoluteFill,Img,staticFile} from 'remotion';
import {M} from './Design';
import {enter,out} from './motion';
import {Wordmark3D} from './Wordmark3D';
export function EndCard({t}:{t:number}){
 const u=t-34,resolve=enter(u,3.7,.5);
 const imageStyle:React.CSSProperties={width:1080,height:810,objectFit:'contain',maskImage:'linear-gradient(to bottom,transparent,black 2%,black 97%,transparent)'};
 return <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 42%,#f0e2cd,#eddec9 75%)',color:'#292621'}}>
  <div style={{position:'absolute',left:0,top:300,width:1080,height:810,opacity:enter(u,.5,1.2),clipPath:'inset(0 0 31% 0)'}}><Img src={staticFile('brand/FENIX13_OFFICIAL_CREAM.jpg')} style={imageStyle}/></div>
  <Wordmark3D u={u}/>
  <div style={{position:'absolute',left:0,top:300,width:1080,height:810,opacity:resolve}}><Img src={staticFile('brand/FENIX13_OFFICIAL_CREAM.jpg')} style={imageStyle}/></div>
  <div style={{position:'absolute',left:80,top:1200,width:920,textAlign:'center',fontFamily:M,opacity:enter(u,2.25,1.2),transform:`translateY(${(1-out((u-2.25)/1.3))*18}px)`}}>
   <div style={{fontSize:80,fontWeight:800,letterSpacing:2}}>COMING SOON</div>
   <div style={{height:1,width:560,margin:'46px auto 38px',background:'linear-gradient(90deg,transparent,#765038,transparent)'}}/>
   <div style={{fontSize:29,fontWeight:500,letterSpacing:4}}>TAUNGGYI, SHAN STATE</div>
   <div style={{fontSize:31,fontWeight:500,letterSpacing:2.4,color:'#67442e',marginTop:52}}>THE NIGHT COMES ALIVE.</div>
  </div>
 </AbsoluteFill>;
}
