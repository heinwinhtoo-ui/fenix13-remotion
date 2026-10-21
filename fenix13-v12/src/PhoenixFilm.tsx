import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {useFonts,M} from './Design';
import {Plate,PlateKind} from './Plate';
import {GeoV10} from './GeoV10';
import {EndCard} from './EndCard';
import {clamp,io,enter,exit,out} from './motion';
export const CUTS=[0,4,9,14,20,25,30,34,42];
const C={ink:'#070706',paper:'#fff0d8',orange:'#ff792f'};
function Headline({lines,t,at,size=122,accent=-1}:{lines:string[];t:number;at:number;size?:number;accent?:number}){
 return <div style={{fontFamily:M,fontWeight:800,letterSpacing:-3.5,lineHeight:1.05}}>{lines.map((line,j)=>{
  const p=out((t-at-j*.18)/1.05);return <div key={line} style={{overflow:'hidden',paddingBottom:12}}><div style={{fontSize:size,color:j===accent?C.orange:C.paper,opacity:enter(t,at+j*.18,.65),transform:`translateY(${(1-p)*110}%)`}}>{line}</div></div>;
 })}</div>;
}
function Ember({t}:{t:number}){
 return <><div style={{position:'absolute',left:528,top:1030,width:24,height:24,borderRadius:'50%',background:'#fff1d5',boxShadow:'0 0 22px 8px #ff8429,0 0 90px 26px #ff4a192e',opacity:enter(t,.08,.3)*exit(t,.8,.6),transform:`scale(${.15+Math.min(t,1)*.8})`}}/>
 {Array.from({length:14},(_,i)=>{const q=clamp((t-.18-i*.018)/2),a=i*2.399;return <div key={i} style={{position:'absolute',left:540+Math.sin(a)*q*240,top:1040-q*(260+i*22),width:3,height:5,borderRadius:3,background:'#ffb66d',opacity:Math.sin(q*Math.PI)*.6}}/>;})}</>;
}
function Lifestyle({t,index}:{t:number;index:number}){
 const start=CUTS[index],end=CUTS[index+1],u=t-start;
 const kind:PlateKind=(['chill','grill','food','company','night'] as PlateKind[])[index-2];
 const lines=[['CHILL.'],['GRILL.'],['GOOD','FOOD.'],['GOOD','COMPANY.'],['GREAT','NIGHTS.']][index-2];
 const size=[174,174,130,109,130][index-2],accent=index>=4?1:-1;
 const dissolve=enter(u,1.65,.8);
 return <>
  {index===3?<>
   {dissolve<1&&<Plate kind="charcoal" t={t*.85} progress={clamp(u/2.45)} closeup={.08}/>}
   <AbsoluteFill style={{opacity:dissolve}}><Plate kind="grill" t={t*.85} progress={clamp(u/6)} closeup={.20*(1-io((u-3.25)/1.1))}/></AbsoluteFill>
  </>:<Plate kind={kind} t={t*.85} progress={clamp(u/(end-start))} closeup={index===4?.06:0}/>}
  <AbsoluteFill style={{background:'linear-gradient(180deg,#070706aa 0%,transparent 43%,transparent 89%,#07070666)'}}/>
  <div style={{position:'absolute',left:84,top:200,width:912}}><Headline lines={lines} t={t} at={start+.32} size={size} accent={accent}/>
   {index===3&&<div style={{fontFamily:M,fontSize:29,fontWeight:500,letterSpacing:4,marginTop:22,opacity:enter(u,1.1,.6)}}>BRING THE HEAT.</div>}
  </div>
  {index>=5&&<div style={{position:'absolute',left:84,bottom:125,fontFamily:M,fontSize:23,letterSpacing:2.5,color:'#e8cba8',opacity:.8}}>ATMOSPHERE CONCEPT</div>}
 </>;
}
function Scene({index,t}:{index:number;t:number}){
 if(index===0)return <><AbsoluteFill style={{opacity:enter(t,.4,1)}}><Plate kind="charcoal" t={t*.85} progress={t/4} closeup={.12}/></AbsoluteFill><Ember t={t}/><div style={{position:'absolute',left:84,top:210}}><Headline lines={['A NEW FIRE','IS COMING.']} t={t} at={.75} size={103} accent={1}/></div></>;
 if(index===1)return <><GeoV10 t={t}/><div style={{position:'absolute',left:84,top:230}}><Headline lines={['TAUNGGYI.','GET READY.']} t={t} at={4.65} size={105} accent={1}/></div></>;
 if(index===7)return <EndCard t={t}/>;
 return <Lifestyle index={index} t={t}/>;
}
export const Film:React.FC=()=>{
 const t=useCurrentFrame()/useVideoConfig().fps;useFonts();
 const index=Math.max(0,CUTS.findIndex((a,i)=>t>=a&&t<CUTS[i+1]));
 const p=index===0?1:io((t-CUTS[index])/.65);
 return <AbsoluteFill style={{background:C.ink,color:C.paper,overflow:'hidden'}}>
  <Audio src={staticFile('audio/FENIX_ORIGINAL_MASTER.wav')}/>
  {index>0&&p<1&&<AbsoluteFill><Scene index={index-1} t={CUTS[index]-1/30}/></AbsoluteFill>}
  <AbsoluteFill style={{opacity:p,background:C.ink}}><Scene index={index} t={t}/></AbsoluteFill>
 </AbsoluteFill>;
};
