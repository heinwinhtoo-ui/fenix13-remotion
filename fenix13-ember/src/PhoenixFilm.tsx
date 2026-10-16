import React from 'react';
import {AbsoluteFill,Audio,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Atlas} from './Atlas';
import {Label,Type,M,MONO,useFonts} from './Design';
import {Cinema3D} from './Cinema3D';
import {PhoenixIdent} from './Phoenix';
import {clamp,ease,enter,exit,io,mix,palette as P} from './motion';

function Origin({t}:{t:number}){
  const i=t<6?0:t<11?1:2;
  const at=[.5,6.2,11.2][i];
  const op=enter(t,at,.6)*(i===0?exit(t,5.15,.7):i===1?exit(t,10.3,.6):exit(t,17.2,.7));
  // Expand the geographic stages to six, five and seven seconds.
  const mapTime=t<6?t*5/6:t<11?5+(t-6)*3/5:8+(t-11)*4/7;
  return <>
    <Atlas t={mapTime}/>

    <div style={{opacity:op}}>
      <Label style={{position:'absolute',left:90,top:205,color:P.copper}}>{['THE ARRIVAL / 01','MYANMAR / 02','SHAN STATE / 03'][i]}</Label>
      <div style={{position:'absolute',left:84,top:325}}>
        <Type text={['A NEW FIRE.','MYANMAR.','TAUNGGYI.'][i]} t={t} at={at} size={112}/>
        <div style={{fontFamily:M,fontSize:30,fontWeight:500,letterSpacing:2.3,marginTop:22,opacity:enter(t,at+1,1.1)}}>
          {['IS FINDING ITS HOME.','THE JOURNEY GETS CLOSER.','THIS IS OUR CITY.'][i]}
        </div>
      </div>
    </div>
  </>;
}

function Chill({t}:{t:number}){
  const p=ease((t-18)/8);
  return <AbsoluteFill>
    <div style={{position:'absolute',inset:0,opacity:enter(t,18.8,1.8),transform:`translateX(${mix(-12,10,p)}px) scale(${mix(.98,1.025,p)})`}}>
      <Cinema3D t={t} kind="lounge"/>
    </div>
    <Label style={{position:'absolute',left:90,top:215,color:P.copper}}>FENIX /13 — CHILL & GRILL</Label>
    <div style={{position:'absolute',left:80,top:420}}>
      <Type text="CHILL." t={t} at={18.3} size={215}/>
      <div style={{fontFamily:M,fontWeight:500,fontSize:36,letterSpacing:4,marginTop:28,opacity:enter(t,19.6,1.1)}}>TAKE IT EASY.</div>
    </div>
    <Label style={{position:'absolute',left:90,top:1660,color:'#c9ab87',opacity:enter(t,20,1.2)}}>GOOD COMPANY STARTS HERE.</Label>
  </AbsoluteFill>;
}

function Grill({t}:{t:number}){
  return <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 68%,#35190d,#070706 65%)',color:P.paper}}>
    <Cinema3D t={t} kind="grill"/>
    <Label style={{position:'absolute',left:90,top:215}}>FIRE IN OUR NATURE.</Label>
    <div style={{position:'absolute',left:80,top:420}}>
      <Type text="GRILL." t={t} at={26.3} size={215} color={P.paper}/>
      <div style={{fontFamily:M,fontWeight:800,fontSize:38,letterSpacing:3,marginTop:28,opacity:enter(t,27.6,1.1)}}>BRING THE HEAT.</div>
    </div>
    <Label style={{position:'absolute',left:90,top:830,color:P.paper,textShadow:'0 2px 12px #000',opacity:enter(t,28,1.1)}}>BOLD FLAVOUR. GREAT NIGHTS.</Label>
    <Label style={{position:'absolute',left:90,top:1720,color:'#f8cf9e',fontSize:20,opacity:enter(t,29,1.1)}}>CHILL & GRILL / FENIX /13</Label>
  </AbsoluteFill>;
}

function Social({t}:{t:number}){
  const i=Math.min(2,Math.floor((t-34)/(8/3)));
  const at=34+i*8/3;
  const paper=false;
  const col=paper?P.ink:P.paper;
  return <AbsoluteFill style={{background:paper?P.paper:P.ink,color:col}}>
    <div style={{position:'absolute',inset:0,opacity:enter(t,at+.3,1)}}>
      <Cinema3D t={t} kind={i===0?"grill":i===1?"lounge":"detail"}/>
    </div>
    {i===2&&<svg width="1080" height="1920" style={{position:'absolute',inset:0}}>
      <path d="M90 760L430 1570H700Z" fill="#df9438" opacity=".035"/>
      <path d="M990 760L380 1570H650Z" fill="#df9438" opacity=".035"/>
      <path d="M134 1610Q540 1680 950 1610" fill="none" stroke="#b77b3c" strokeWidth="1" opacity=".4"/>
    </svg>}
    <Label style={{position:'absolute',left:90,top:215,color:paper?'#8a542e':P.copper}}>YOUR PEOPLE. YOUR PLACE.</Label>
    <div style={{position:'absolute',left:82,top:440}}>
      <Type text={i===2?'GREAT':'GOOD'} t={t} at={at+.15} size={166} color={col}/>
      <Type text={['FOOD.','COMPANY.','NIGHTS.'][i]} t={t} at={at+.4} size={[170,113,132][i]} color={paper?P.ink:P.orange}/>
    </div>
    <Label style={{position:'absolute',left:90,top:1720,fontSize:20,color:paper?'#704d2e':'#bba180',opacity:enter(t,at+.8)}}>THE NIGHT COMES ALIVE.</Label>
  </AbsoluteFill>;
}

function Cuts({t}:{t:number}){
  return <AbsoluteFill style={{pointerEvents:'none'}}>
    {[18,26,34,34+8/3,34+16/3,42].map((at,i)=>{
      const v=(t-at+.36)/.72;
      if(v<0||v>1)return null;
      return <div key={at} style={{position:'absolute',left:mix(-3300,2330,io(v)),top:-290,width:2050,height:2500,
        transform:'rotate(23deg)',background:i%2?P.ink:P.orange,boxShadow:'-24px 0 45px #ff681633'}}/>;
    })}
  </AbsoluteFill>;
}

export const Film:React.FC=()=>{
  const {fps}=useVideoConfig();const t=useCurrentFrame()/fps;useFonts();
  return <AbsoluteFill style={{background:P.ink,color:P.paper,overflow:'hidden'}}>
    <Audio src={staticFile('audio/FENIX_ORIGINAL_MASTER.wav')}/>
    <Img src={staticFile('brand/fenix13-chill-grill.png')} style={{position:'absolute',width:1,height:1,opacity:0}}/>
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 57%,#75331117,transparent 57%)'}}/>
    {t<18?<Origin t={t}/>:t<26?<Chill t={t}/>:t<34?<Grill t={t}/>:t<42?<Social t={t}/>:<PhoenixIdent t={t}/>}
    <Cuts t={t}/>
    <div style={{position:'absolute',left:90,top:100,width:900,display:'flex',justifyContent:'space-between',fontFamily:MONO,fontSize:19,
      letterSpacing:2,color:'#a18662',opacity:t>=42?exit(t,42,.6):.8}}>
      <span>FENIX /13</span><span>CHILL & GRILL</span>
    </div>
  </AbsoluteFill>;
};
