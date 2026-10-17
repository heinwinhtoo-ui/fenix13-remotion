import React from 'react';
import {AbsoluteFill,Audio,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Atlas} from './Atlas';
import {Label,Type,M,MONO,useFonts} from './Design';
import {Cinema3D} from './Cinema3D';
import {PhoenixIdent} from './Phoenix';
import {clamp,enter,exit,io,mix,palette as P} from './motion';

function Origin({t}:{t:number}){
  const i=t<4?0:t<7?1:2,at=[.15,4.15,7.15][i];
  const end=[4,7,10][i];const op=enter(t,at,.45)*exit(t,end-.45,.4);
  const mapTime=t<4?t*5/4:t<7?5+(t-4):8+(t-7)*4/3;
  return <><Atlas t={mapTime}/><div style={{opacity:op}}>
    <Label style={{position:'absolute',left:90,top:205,color:P.copper}}>{['THE ARRIVAL / 01','MYANMAR / 02','SHAN STATE / 03'][i]}</Label>
    <div style={{position:'absolute',left:84,top:325}}>
      <Type text={['A NEW FIRE.','MYANMAR.','TAUNGGYI.'][i]} t={t} at={at} size={112} duration={.75} stagger={.04}/>
      <div style={{fontFamily:M,fontSize:30,fontWeight:500,letterSpacing:2.3,marginTop:22,opacity:enter(t,at+.65,.6)}}>
        {['IS FINDING ITS HOME.','THE JOURNEY GETS CLOSER.','THIS IS OUR CITY.'][i]}
      </div>
    </div>
  </div></>;
}

function Lifestyle({t}:{t:number}){
  const grill=t>=14,at=grill?14:10;
  return <AbsoluteFill>
    <div style={{position:'absolute',inset:0,opacity:enter(t,at,.65)}}><Cinema3D t={t} kind={grill?'grill':'lounge'}/></div>
    <Label style={{position:'absolute',left:90,top:215,color:P.copper}}>{grill?'FIRE IN OUR NATURE.':'FENIX /13 — CHILL & GRILL'}</Label>
    <div style={{position:'absolute',left:80,top:420}}>
      <Type text={grill?'GRILL.':'CHILL.'} t={t} at={at+.15} size={215} duration={.7} stagger={.04}/>
      <div style={{fontFamily:M,fontWeight:grill?800:500,fontSize:36,letterSpacing:3,marginTop:28,opacity:enter(t,at+.8,.6)}}>{grill?'BRING THE HEAT.':'TAKE IT EASY.'}</div>
    </div>
    <Label style={{position:'absolute',left:90,top:1660,color:P.paper,fontSize:20,textShadow:'0 2px 12px #000',opacity:enter(t,at+1,.6)}}>{grill?'BOLD FLAVOUR. GREAT NIGHTS.':'GOOD COMPANY STARTS HERE.'}</Label>
  </AbsoluteFill>;
}

function Social({t}:{t:number}){
  const i=Math.min(2,Math.floor((t-18)/3)),at=18+i*3;
  return <AbsoluteFill>
    <div style={{position:'absolute',inset:0,opacity:enter(t,at,.6)}}><Cinema3D t={t} kind={i===0?'food':i===1?'friends':'detail'}/></div>
    <Label style={{position:'absolute',left:90,top:215,color:P.copper}}>YOUR PEOPLE. YOUR PLACE.</Label>
    <div style={{position:'absolute',left:82,top:i===2?330:440}}>
      <Type text={i===2?'GREAT':'GOOD'} t={t} at={at+.1} size={166} duration={.7} stagger={.035}/>
      <Type text={['FOOD.','COMPANY.','NIGHTS.'][i]} t={t} at={at+.3} size={[170,113,132][i]} color={P.orange} duration={.7} stagger={.035}/>
    </div>
    <Label style={{position:'absolute',left:90,top:1720,fontSize:20,color:'#d8b991',textShadow:'0 2px 12px #000',opacity:enter(t,at+.8,.5)}}>THE NIGHT COMES ALIVE.</Label>
  </AbsoluteFill>;
}

function Cuts({t}:{t:number}){
  return <AbsoluteFill style={{pointerEvents:'none'}}>{[10,14,18,21,24,27].map((at,i)=>{
    const p=(t-at+.24)/.48;if(p<0||p>1)return null;
    return <div key={at} style={{position:'absolute',left:mix(-3300,2330,io(p)),top:-290,width:2050,height:2500,
      transform:'rotate(23deg)',background:i%2?P.ink:P.orange,boxShadow:'-24px 0 45px #ff681633'}}/>;
  })}</AbsoluteFill>;
}

export const Film:React.FC=()=>{
  const t=useCurrentFrame()/useVideoConfig().fps;useFonts();
  return <AbsoluteFill style={{background:P.ink,color:P.paper,overflow:'hidden'}}>
    <Audio src={staticFile('audio/FENIX_ORIGINAL_MASTER.wav')}/>
    <Img src={staticFile('brand/fenix13-chill-grill.png')} style={{position:'absolute',width:1,height:1,opacity:0}}/>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 57%,#75331117,transparent 57%)'}}/>
    {t<10?<Origin t={t}/>:t<18?<Lifestyle t={t}/>:t<27?<Social t={t}/>:<PhoenixIdent t={t}/>}
    <Cuts t={t}/>
    <div style={{position:'absolute',left:90,top:100,width:900,display:'flex',justifyContent:'space-between',fontFamily:MONO,fontSize:19,
      letterSpacing:2,color:'#a18662',opacity:t>=27?exit(t,27,.5):.8}}><span>FENIX /13</span><span>CHILL & GRILL</span></div>
  </AbsoluteFill>;
};
