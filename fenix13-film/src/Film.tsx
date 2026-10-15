import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, staticFile, useCurrentFrame} from 'remotion';
import {World} from './World';
import {clamp,ease,enter,exit,io,mix,out,palette as P} from './motion';
import typeface from './typeface.json';

const S='"Syne",sans-serif';
const M='"Manrope",sans-serif';
const mono='"Space",monospace';

function useFonts(){
  const [handle]=useState(()=>delayRender('Loading bundled OFL typography'));
  useEffect(()=>{
    Promise.all([
      ['Syne','fonts/syne-latin-800-normal.woff2','800'],
      ['Manrope','fonts/manrope-latin-500-normal.woff2','500'],
      ['Manrope','fonts/manrope-latin-800-normal.woff2','800'],
      ['Space','fonts/space-mono-latin-400-normal.woff2','400']
    ].map(async([name,path,weight])=>{
      const face=new FontFace(name,`url("${staticFile(path)}")`,{weight});
      await face.load();document.fonts.add(face);
    })).then(()=>continueRender(handle));
  },[handle]);
}

const Label:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=>
  <div style={{fontFamily:mono,fontSize:23,letterSpacing:3.2,lineHeight:1.6,...style}}>{children}</div>;

// 3D letter hinges through clipped baselines, with optical rather than random staggering.
const Hinge:React.FC<{text:string;t:number;at:number;size:number;color?:string;delay?:number;style?:React.CSSProperties;maxWidth?:number;center?:boolean}>=
({text,t,at,size,color=P.paper,delay=.035,style,maxWidth=900,center=false})=>{
  const glyphs=typeface.glyphs as Record<string,{ha:number}>;
  const natural=Array.from(text).reduce((a,c)=>a+glyphs[c].ha/typeface.resolution*size-size*.052,0);
  const fit=Math.min(1,maxWidth/natural);
  return <div style={{position:'relative',width:maxWidth,height:size*1.04,fontFamily:S,fontWeight:800,fontSize:size,
    fontKerning:'none',letterSpacing:-size*.052,lineHeight:1.04,whiteSpace:'nowrap',color,perspective:1000,...style}}>
  <div style={{position:'absolute',left:center?(maxWidth-natural*fit)/2:0,top:0,width:natural+10,
    transform:`scaleX(${fit})`,transformOrigin:'left top'}}>{Array.from(text).map((c,i)=>{
    const p=out((t-at-i*delay)/.72);
    return <span key={i} style={{display:'inline-block',whiteSpace:'pre',transformOrigin:'50% 80%',
      opacity:clamp(p*3),transform:`translate3d(0,${(1-p)*size*.7}px,${(1-p)*-140}px) rotateX(${(1-p)*-100}deg) rotateY(${(1-p)*18}deg)`,
      filter:`blur(${(1-p)*6}px)`}}>{c}</span>;
  })}</div>
</div>;
};

const Cross:React.FC<{x:number;y:number;color?:string}>=({x,y,color=P.copper})=><svg style={{position:'absolute',left:x,top:y}} width="22" height="22">
  <path d="M11 0V22M0 11H22" stroke={color} strokeWidth="1.2"/></svg>;

function Hook({t}:{t:number}){
  const opacity=exit(t,3.56,.4);
  return <AbsoluteFill style={{opacity}}>
    <Label style={{position:'absolute',left:88,top:183,opacity:enter(t,.15,.7)}}>TAUNGGYI, SHAN STATE <span style={{color:P.orange}}>↗</span></Label>
    <div style={{position:'absolute',left:82,top:331,transform:`scale(${mix(1.035,1,ease(t/4))})`,transformOrigin:'left top'}}>
      <Hinge text="SOMETHING" t={t} at={.6} size={99}/>
      <Hinge text="IS HEATING" t={t} at={.83} size={103}/>
      <Hinge text="UP." t={t} at={1.06} size={176} color={P.orange}/>
    </div>
    <div style={{position:'absolute',left:90,top:1600,width:900,display:'flex',justifyContent:'space-between',opacity:enter(t,1.1)}}>
      <Label style={{fontSize:19,color:'#ad9984'}}>A NEW SOCIAL DESTINATION</Label><Label style={{fontSize:19,color:P.orange}}>01 / IGNITION</Label>
    </div>
  </AbsoluteFill>;
}

function Fire({t}:{t:number}){
  const local=t-4;
  return <AbsoluteFill style={{opacity:enter(t,3.88,.16)*exit(t,7.68,.3)}}>
    <Label style={{position:'absolute',left:90,top:206,color:P.orange}}>TURN UP THE HEAT.</Label>
    <div style={{position:'absolute',left:83,top:478,transform:`rotate(-4deg) scale(${mix(1.08,1,ease(local/4))})`,transformOrigin:'left center'}}>
      <Hinge text="FIRE UP" t={t} at={4.02} size={140} delay={.038}/>
      <div style={{display:'flex',alignItems:'center',gap:35}}>
        <Hinge text="THE" t={t} at={4.25} size={140} maxWidth={465}/>
        <div style={{width:mix(0,285,enter(t,4.5,.5)),height:10,background:P.orange,marginTop:25}}/>
      </div>
      <Hinge text="GRILL." t={t} at={4.46} size={183} color={P.orange}/>
    </div>
    <Label style={{position:'absolute',left:90,top:1580,color:P.paper}}>BBQ <span style={{color:P.orange}}> / </span> BAR <span style={{color:P.orange}}> / </span> RESTAURANT</Label>
    <div style={{position:'absolute',top:1140,left:150,width:780,height:350,background:'radial-gradient(ellipse,#ff5b1730,transparent 66%)',filter:'blur(28px)'}}/>
  </AbsoluteFill>;
}

function Attitude({t}:{t:number}){
  const dark=t>=10;
  const at=dark?10:8;
  const color=dark?P.paper:P.ink;
  const p=enter(t,at,.5);
  return <AbsoluteFill style={{opacity:exit(t,11.75,.25)}}>
    <Label style={{position:'absolute',left:90,top:213,color,opacity:p}}>{dark?'WHEN THE SUN GOES DOWN.':'MADE TO MAKE AN IMPRESSION.'}</Label>
    <div style={{position:'absolute',left:78,top:410,transform:`perspective(1400px) rotateY(${mix(-12,0,p)}deg)`,transformOrigin:'left center'}}>
      <Hinge text={dark?'AFTER':'BOLD'} t={t} at={at+.04} size={dark?153:190} color={color}/>
      <div style={{overflow:'hidden',height:200}}><Hinge text={dark?'DARK.':'FLAVOUR.'} t={t} at={at+.22} size={dark?169:112} color={color}/></div>
    </div>
    <div style={{position:'absolute',left:92,top:1530,width:890,borderTop:`1px solid ${dark?'#ad7854':'#532b1a'}`,paddingTop:29,
      display:'flex',justifyContent:'space-between',opacity:p}}>
      <Label style={{color,fontSize:20}}>UNAPOLOGETICALLY FENIX.</Label><Label style={{color,fontSize:20}}>02 / ATTITUDE</Label>
    </div>
  </AbsoluteFill>;
}

function Energy({t}:{t:number}){
  const index=Math.min(2,Math.floor((t-12)/1.25));
  const local=t-12-index*1.25;
  return <AbsoluteFill>
    <Label style={{position:'absolute',left:90,top:220,color:P.orange}}>THIS IS WHAT THE NIGHT FEELS LIKE.</Label>
    <div style={{position:'absolute',left:85,top:357,fontFamily:S,fontWeight:800,fontSize:78,lineHeight:1.04,letterSpacing:-3,
      opacity:enter(t,12,.4)}}>FEEL THE<br/>FREQUENCY.</div>
    <div style={{position:'absolute',left:90,top:1335,width:900,height:130,display:'flex',gap:15,alignItems:'center'}}>
      {Array.from({length:40},(_,i)=>{
        const amp=(.5+.5*Math.sin(i*.67+t*8))*(.4+.6*Math.exp(-local*3));
        return <div key={i} style={{width:8,height:10+amp*92,background:i%4?P.copper:P.orange,opacity:.45+i%3*.15}}/>;
      })}
    </div>
    <Label style={{position:'absolute',left:90,top:1550,color:'#c5b39c'}}>0{index+1} <span style={{color:P.orange}}>—</span> {['SMOKE.','SPARK.','ENERGY.'][index]}</Label>
  </AbsoluteFill>;
}

function Social({t}:{t:number}){
  const i=t<17.25?0:t<18.5?1:2;
  const at=[16,17.25,18.5][i];
  const col=i===2?P.paper:P.ink;
  const local=t-at;
  const shutter=io(local/.5);
  return <AbsoluteFill style={{color:col}}>
    <Label style={{position:'absolute',top:211,left:90}}>YOUR PEOPLE. YOUR PLACE.</Label>
    {/* Oversized linework forms a moving editorial frame around the typography. */}
    <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:.22}}>
      <g transform={`translate(540 1000) rotate(${-24+local*9})`} fill="none" stroke={col} strokeWidth="1.4">
        <rect x="-790" y="-370" width="1580" height="740" rx="370"/>
        <rect x="-830" y="-410" width="1660" height="820" rx="410"/>
        <rect x="-870" y="-450" width="1740" height="900" rx="450"/>
      </g>
    </svg>
    <div style={{position:'absolute',left:78,top:610,transform:`rotate(${mix(i===1?5:-5,0,shutter)}deg)`}}>
      <Hinge text={i===2?'GREAT':'GOOD'} t={t} at={at+.02} size={i===2?147:177} color={col} delay={.022}/>
      <Hinge text={['FOOD.','VIBES.','NIGHTS.'][i]} t={t} at={at+.17} size={[176,160,132][i]} color={col} delay={.022}/>
    </div>
    <div style={{position:'absolute',left:90,top:1370,width:mix(0,900,enter(t,at+.3,.55)),height:6,background:col}}/>
    <Label style={{position:'absolute',left:90,top:1545}}>SAVE A NIGHT FOR US. <span style={{marginLeft:80}}>↗ FENIX /13</span></Label>
  </AbsoluteFill>;
}

function Final({t}:{t:number}){
  const p=enter(t,24.25,.8);
  return <AbsoluteFill>
    <Label style={{position:'absolute',top:1540,left:0,width:'100%',textAlign:'center',color:P.copper,
      opacity:t<24?enter(t,20.5)*exit(t,23.2,.5):0}}>THE ARRIVAL.</Label>
    <div style={{position:'absolute',left:0,top:940,width:'100%',textAlign:'center',opacity:p}}>
      <div style={{fontFamily:M,fontWeight:500,fontSize:30,letterSpacing:7.5,color:'#c7b49b'}}>BBQ • BAR • RESTAURANT</div>
      <div style={{marginTop:97,overflow:'hidden'}}><Hinge text="COMING SOON" t={t} at={24.5} size={91}
        color={P.paper} center style={{margin:'0 auto'}} delay={.018}/></div>
      <div style={{width:580,height:1,margin:'48px auto 40px',background:'linear-gradient(90deg,transparent,#cd7443,transparent)',
        transform:`scaleX(${p})`}}/>
      <Label style={{fontSize:27,letterSpacing:3.5}}>TAUNGGYI, SHAN STATE</Label>
      <div style={{fontFamily:M,fontSize:31,letterSpacing:3.2,color:P.orange,marginTop:84,
        opacity:enter(t,25.25,1)}}>THE NIGHT COMES ALIVE.</div>
    </div>
    <Label style={{position:'absolute',top:1690,left:0,width:'100%',textAlign:'center',fontSize:19,color:'#807568',opacity:p}}>A NEW SOCIAL DESTINATION.</Label>
  </AbsoluteFill>;
}

function Transitions({t}:{t:number}){
  const cuts=[4,8,10,12,16,17.25,18.5,20];
  return <AbsoluteFill style={{pointerEvents:'none'}}>
    {cuts.map((at,i)=>{
      const v=(t-at+.15)/.36;
      if(v<0||v>1) return null;
      // Two fast diagonal blades occlude the scene cut. The soft orange edge
      // supplies motion direction without white flash frames.
      return <div key={at} style={{position:'absolute',left:mix(-1600,1600,io(v)),top:-300,width:650,height:2500,
        transform:'rotate(23deg)',background:i%3===0?P.orange:P.paper,
        boxShadow:`-35px 0 65px ${P.orange}70`}}/>;
    })}
  </AbsoluteFill>;
}

export const Film:React.FC=()=>{
  const t=useCurrentFrame()/30;
  useFonts();
  const bg=t>=8&&t<10?P.orange:t>=16&&t<17.25?P.paper:t>=17.25&&t<18.5?P.orange:P.ink;
  const dark=bg===P.ink;
  return <AbsoluteFill style={{background:bg,color:P.paper,overflow:'hidden'}}>
    <Audio src={staticFile('audio/FENIX_ORIGINAL_MASTER.wav')}/>
    {dark&&<AbsoluteFill style={{background:`radial-gradient(ellipse at ${t>=20?'50% 38%':'55% 66%'},#6630192a,transparent 52%),radial-gradient(ellipse at 100% 5%,#42245d1c,transparent 50%)`}}/>}
    <World t={t}/>
    {t<4?<Hook t={t}/>:t<8?<Fire t={t}/>:t<12?<Attitude t={t}/>:t<16?<Energy t={t}/>:t<20?<Social t={t}/>:<Final t={t}/>}
    <Transitions t={t}/>
    {/* Broad, low-opacity vignette; deliberately no animated grain/noise. */}
    <AbsoluteFill style={{boxShadow:'inset 0 0 150px #00000015',pointerEvents:'none'}}/>
    <div style={{position:'absolute',top:99,left:89,width:902,display:'flex',justifyContent:'space-between',fontFamily:mono,fontSize:19,
      letterSpacing:2,color:dark?'#987b60':'#40251b',opacity:t>=20?exit(t,20.1,.5):.7}}><span>F /13</span><span>TAUNGGYI — MM</span></div>
  </AbsoluteFill>;
};
