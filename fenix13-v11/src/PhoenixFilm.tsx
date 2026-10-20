import React from 'react';
import {AbsoluteFill,Audio,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {useFonts,M} from './Design';
import {Plate,PlateKind} from './Plate';
import {GeoV10} from './GeoV10';
import {EndCard} from './EndCard';
import {clamp,io,mix,enter,exit,out} from './motion';
const C={ink:'#070706',paper:'#fff0d8',orange:'#ff792f'};
function Headline({lines,t,at,size=122,accent=-1}:{lines:string[];t:number;at:number;size?:number;accent?:number}){
 return <div style={{fontFamily:M,fontWeight:800,letterSpacing:-3.5,lineHeight:1.05}}>{lines.map((line,j)=>{
  const p=out((t-at-j*.13)/.7);return <div key={line} style={{overflow:'hidden',paddingBottom:12}}><div style={{fontSize:size,color:j===accent?C.orange:C.paper,opacity:enter(t,at+j*.13,.4),transform:`translateY(${(1-p)*110}%)`}}>{line}</div></div>;
 })}</div>;
}
function Ember({t}:{t:number}){
 return <><div style={{position:'absolute',left:528,top:1030,width:24,height:24,borderRadius:'50%',background:'#fff1d5',boxShadow:'0 0 22px 8px #ff8429,0 0 90px 26px #ff4a192e',opacity:enter(t,.08,.25)*exit(t,.65,.45),transform:`scale(${.15+Math.min(t,1)*.8})`}}/>
 {Array.from({length:14},(_,i)=>{const q=clamp((t-.18-i*.018)/1.6),a=i*2.399;return <div key={i} style={{position:'absolute',left:540+Math.sin(a)*q*240,top:1040-q*(260+i*22),width:3,height:5,borderRadius:3,background:'#ffb66d',opacity:Math.sin(q*Math.PI)*.6}}/>;})}</>;
}
function Lifestyle({t}:{t:number}){
 let kind:PlateKind='chill',start=6,end=11,lines=['CHILL.'],size=174,accent=-1,closeup=0;
 if(t>=11&&t<16){kind=t<12.1?'charcoal':'grill';start=11;end=16;lines=['GRILL.'];size=174;closeup=t>=12.1&&t<13.8?.21:0;}
 if(t>=16&&t<20){kind='food';start=16;end=20;lines=['GOOD','FOOD.'];size=130;accent=1;closeup=.06;}
 if(t>=20&&t<24){kind='company';start=20;end=24;lines=['GOOD','COMPANY.'];size=109;accent=1;}
 if(t>=24){kind='night';start=24;end=27;lines=['GREAT','NIGHTS.'];size=130;accent=1;}
 return <><Plate kind={kind} t={t} progress={clamp((t-start)/(end-start))} closeup={closeup}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#070706aa 0%,transparent 43%,transparent 89%,#07070666)'}}/>
  <div style={{position:'absolute',left:84,top:200,width:912}}><Headline lines={lines} t={t} at={start+.12} size={size} accent={accent}/>
   {t>=11&&t<16&&<div style={{fontFamily:M,fontSize:29,fontWeight:500,letterSpacing:4,marginTop:22,opacity:enter(t,11.65,.4)}}>BRING THE HEAT.</div>}
  </div>
  {t>=20&&<div style={{position:'absolute',left:84,bottom:125,fontFamily:M,fontSize:23,letterSpacing:2.5,color:'#e8cba8',opacity:.8}}>ATMOSPHERE CONCEPT</div>}
 </>;
}
export const Film:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps;useFonts();
 return <AbsoluteFill style={{background:C.ink,color:C.paper,overflow:'hidden'}}>
  <Audio src={staticFile('audio/FENIX_ORIGINAL_MASTER.wav')}/>
  {t<3?<><div style={{position:'absolute',inset:0,opacity:enter(t,.35,.7)}}><Plate kind="charcoal" t={t} progress={t/3} closeup={.12}/></div><Ember t={t}/><div style={{position:'absolute',left:84,top:210}}><Headline lines={['A NEW FIRE','IS COMING.']} t={t} at={.58} size={103} accent={1}/></div></>:
   t<6?<><GeoV10 t={t}/><div style={{position:'absolute',left:84,top:230}}><Headline lines={['TAUNGGYI.','GET READY.']} t={t} at={3.8} size={105} accent={1}/></div></>:
   t<27?<Lifestyle t={t}/>:<EndCard t={t}/>}
  {/* Brief motivated warm lens veils bridge the photographic cuts. */}
  {[3,6,11,12.1,13.8,16,20,24,27].map(at=>{const q=(t-at+.16)/.32;if(q<0||q>1)return null;return <div key={at} style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 82% 62%,#ffc280,transparent 65%)',mixBlendMode:'screen',opacity:Math.sin(q*Math.PI)*.13}}/>;})}
 </AbsoluteFill>;
};
