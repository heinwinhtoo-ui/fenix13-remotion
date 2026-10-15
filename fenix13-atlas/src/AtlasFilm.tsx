import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Audio,cancelRender,continueRender,delayRender,Img,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Atlas} from './Atlas';
import {clamp,ease,enter,exit,io,mix,out,palette as P} from './motion';
import typeface from './typeface.json';

const S='"Syne",sans-serif',M='"Manrope",sans-serif',MONO='"Space",monospace';
function useFonts(){
  const [handle]=useState(()=>delayRender('Local brand typography'));
  useEffect(()=>{
    Promise.all([
      ['Syne','syne-latin-800-normal.woff2','800'],['Manrope','manrope-latin-500-normal.woff2','500'],
      ['Manrope','manrope-latin-800-normal.woff2','800'],['Space','space-mono-latin-400-normal.woff2','400']
    ].map(async([family,file,weight])=>{
      const f=new FontFace(family,`url("${staticFile('fonts/'+file)}")`,{weight});
      await f.load();document.fonts.add(f);
    })).then(()=>continueRender(handle)).catch(cancelRender);
  },[handle]);
}
const Label:React.FC<React.PropsWithChildren<{style?:React.CSSProperties}>>=({children,style})=>
  <div style={{fontFamily:MONO,fontSize:23,letterSpacing:3,lineHeight:1.6,...style}}>{children}</div>;

function Type({text,t,at,size=110,color=P.paper,width=900,center=false}:{text:string;t:number;at:number;size?:number;color?:string;width?:number;center?:boolean}){
  const glyphs=typeface.glyphs as Record<string,{ha:number}>;
  const natural=Array.from(text).reduce((a,c)=>a+(glyphs[c]?.ha||600)/typeface.resolution*size-size*.04,0);
  const fit=Math.min(1,width/natural);
  return <div style={{position:'relative',width,height:size*1.08,fontFamily:S,fontWeight:800,fontSize:size,
    lineHeight:1.02,letterSpacing:-size*.04,fontKerning:'none',color,perspective:1200}}>
    <div style={{position:'absolute',top:0,left:center?(width-natural*fit)/2:0,whiteSpace:'nowrap',transform:`scaleX(${fit})`,transformOrigin:'left top'}}>
      {Array.from(text).map((c,i)=>{
        const p=out((t-at-i*.028)/.8);
        return <span key={i} style={{display:'inline-block',whiteSpace:'pre',opacity:clamp(p*4),transformOrigin:'50% 95%',
          transform:`translate3d(${(1-p)*35}px,${(1-p)*size*.85}px,${(1-p)*-180}px) rotateX(${mix(-95,0,p)}deg)`,filter:`blur(${(1-p)*4}px)`}}>{c}</span>;
      })}
    </div>
  </div>;
}

function Star({x,y,scale=1,opacity=1}:{x:number;y:number;scale?:number;opacity?:number}){
  return <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
    <path d="M0-45Q8-8 45 0Q8 8 0 45Q-8 8-45 0Q-8-8 0-45" fill="url(#flame)"/>
  </g>;
}

function OriginCopy({t}:{t:number}){
  const i=t<5?0:t<8?1:2;
  const at=[.35,5.15,8.25][i];
  const op=enter(t,at,.4)*(i===0?exit(t,4.1,.45):i===1?exit(t,7.65,.3):exit(t,11.7,.25));
  return <AbsoluteFill style={{opacity:op}}>
    <Label style={{position:'absolute',left:90,top:205,color:P.copper}}>{['THE ARRIVAL / 01','MYANMAR / 02','SHAN STATE / 03'][i]}</Label>
    <div style={{position:'absolute',left:84,top:325}}>
      <Type text={['A NEW FIRE.','MYANMAR.','TAUNGGYI.'][i]} t={t} at={at} size={[112,112,112][i]}/>
      <div style={{fontFamily:M,fontSize:30,fontWeight:500,letterSpacing:2.3,marginTop:22,opacity:enter(t,at+.4)}}>
        {['IS FINDING ITS HOME.','THE JOURNEY GETS CLOSER.','THIS IS OUR CITY.'][i]}
      </div>
    </div>
  </AbsoluteFill>;
}

function Wings({t}:{t:number}){
  const p=enter(t,12,.85);
  return <svg width="1080" height="1920" style={{position:'absolute',inset:0}}>
    <defs>
      <linearGradient id="flame" x1="0" x2=".6" y1="0" y2="1"><stop stopColor="#fff0c8"/><stop offset=".18" stopColor="#ffae32"/><stop offset=".48" stopColor="#ff5b0b"/><stop offset="1" stopColor="#ed190b"/></linearGradient>
      <linearGradient id="metal" x1="0" x2="1"><stop stopColor="#793916"/><stop offset=".34" stopColor="#ff9742"/><stop offset=".46" stopColor="#ffe8b6"/><stop offset=".51" stopColor="#9c491c"/><stop offset=".74" stopColor="#ed6426"/><stop offset="1" stopColor="#5f2114"/></linearGradient>
    </defs>
    <g transform={`translate(550 1120) rotate(${-16+(t-12)*7}) scale(${mix(.7,1,p)})`}>
      <ellipse rx="420" ry="365" fill="none" stroke="#ce8d4b" strokeWidth="1" opacity=".28"/>
      {[0,1,2,3].map(i=>{
        const q=out((t-12.15-i*.1)/1.1);
        return <g key={i} transform={`translate(${mix(-200,0,q)+i*93} ${i*28}) rotate(${i*9}) scale(${1-i*.09})`} opacity={q}>
          <path d="M-330 300C-625-65-110-450 150-470C-200-285-365-5-330 300Z" fill="url(#metal)"/>
          <path d="M-330 300C-625-65-110-450 150-470" fill="none" stroke="#ffc17a" strokeWidth="1.7" opacity=".6"/>
        </g>;
      })}
      <Star x={300} y={-210} scale={.75+.1*Math.sin(t*2)}/>
    </g>
  </svg>;
}

function Chill({t}:{t:number}){
  return <AbsoluteFill style={{opacity:exit(t,15.75,.25)}}>
    <Wings t={t}/>
    <Label style={{position:'absolute',left:90,top:215,color:P.copper}}>FENIX /13 — CHILL & GRILL</Label>
    <div style={{position:'absolute',left:80,top:435,transform:`perspective(1400px) rotateY(${mix(14,-3,ease((t-12)/4))}deg)`}}>
      <Type text="CHILL." t={t} at={12.15} size={220}/>
      <div style={{fontFamily:M,fontWeight:500,fontSize:36,letterSpacing:4,marginTop:24,opacity:enter(t,12.7)}}>TAKE IT EASY.</div>
    </div>
    <Label style={{position:'absolute',left:90,top:1610,color:'#c9ab87'}}>YOUR PEOPLE. YOUR PLACE.</Label>
  </AbsoluteFill>;
}

function Grill({t}:{t:number}){
  const p=enter(t,16,.7);
  return <AbsoluteFill style={{background:P.orange,color:P.ink}}>
    <svg width="1080" height="1920" style={{position:'absolute',inset:0}}>
      <defs><linearGradient id="peak" x1="0" y1="0" x2=".5" y2="1"><stop stopColor="#fff3d7"/><stop offset="1" stopColor="#ddbc91"/></linearGradient></defs>
      <circle cx="720" cy="1210" r={mix(40,365,enter(t,16.2,1.3))} fill="none" stroke="#772f12" strokeWidth="2"/>
      {[0,1,2].map(i=><g key={i} transform={`translate(${-140+i*110} ${mix(1950,1410+i*145,p)}) scale(${1.4-i*.08})`} opacity={.25+i*.3}>
        <path d="M-140 290L295-165L490 48L625-63L1050 350Z" fill={i===2?'url(#peak)':'#622b17'}/>
        <path d="M295-165L410-38L340-64L315-23L285-99L234-63L200-24Z" fill={i===2?'#fff6e6':'#c97838'}/>
      </g>)}
    </svg>
    <Label style={{position:'absolute',left:90,top:214}}>FIRE IN OUR NATURE.</Label>
    <div style={{position:'absolute',left:80,top:440,transform:`rotate(${mix(-7,0,p)}deg)`}}>
      <Type text="GRILL." t={t} at={16.08} size={221} color={P.ink}/>
      <div style={{fontFamily:M,fontWeight:800,fontSize:41,letterSpacing:3,marginTop:28,opacity:enter(t,16.7)}}>BRING THE HEAT.</div>
    </div>
    <Label style={{position:'absolute',left:90,top:1000,color:P.ink}}>BOLD FLAVOUR. HIGHER NIGHTS.</Label>
  </AbsoluteFill>;
}

function Social({t}:{t:number}){
  const i=Math.min(2,Math.floor((t-20)/(4/3)));
  const at=20+i*4/3;
  const p=enter(t,at,.65),col=i===1?P.ink:P.paper;
  return <AbsoluteFill style={{background:i===1?P.paper:P.ink,color:col,perspective:1400}}>
    <Label style={{position:'absolute',left:90,top:214,color:i===1?'#8a542e':P.copper}}>MAKE ROOM FOR GREAT COMPANY.</Label>
    <div style={{position:'absolute',inset:0,transform:`rotate(${mix(i%2?6:-6,0,p)}deg)`}}>
      {Array.from({length:5},(_,j)=><div key={j} style={{position:'absolute',left:-150,top:750+j*80,width:1400,height:180,
        borderTop:`1px solid ${i===1?'#a5743d':'#bd7136'}`,opacity:.12+j*.05,
        transform:`perspective(1500px) rotateX(${50-j*5}deg) translateZ(${-j*55}px) rotate(-24deg)`}}/>)}
    </div>
    <div style={{position:'absolute',left:82,top:655,transform:`perspective(1200px) rotateY(${mix(-25,0,p)}deg)`,transformOrigin:'left center'}}>
      <Type text={i===2?'GREAT':'GOOD'} t={t} at={at+.03} size={166} color={col}/>
      <Type text={['FOOD.','COMPANY.','NIGHTS.'][i]} t={t} at={at+.18} size={[170,113,132][i]} color={i===1?P.ink:P.orange}/>
    </div>
    <div style={{position:'absolute',left:90,top:1290,height:4,width:900*p,background:i===1?P.ink:P.orange}}/>
    <Label style={{position:'absolute',left:90,top:1540}}>THE NIGHT COMES ALIVE.</Label>
  </AbsoluteFill>;
}

function Logo({t}:{t:number}){
  const p=io((t-24)/3.4);
  const master=enter(t,27.45,.6);
  return <AbsoluteFill>
    <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:exit(t,27.45,.6)}}>
      <defs><linearGradient id="logoArc"><stop stopColor="#fff2d7"/><stop offset="1" stopColor="#ff5415"/></linearGradient></defs>
      <circle cx="540" cy="795" r={mix(500,335,p)} fill="none" stroke="url(#logoArc)" strokeWidth="2.2"
        pathLength="1" strokeDasharray={`${clamp((t-24.1)/2.1)} 1`} transform={`rotate(${-130+(t-24)*16} 540 795)`}/>
      <circle cx="540" cy="795" r={mix(520,356,p)} fill="none" stroke="#f77a2b" strokeWidth="1" opacity=".18"/>
    </svg>
    <div style={{position:'absolute',left:-20,top:340,width:1120,height:900,perspective:1500,mixBlendMode:'screen',
      transform:`scale(${mix(1.13,1,p)})`,transformOrigin:'center center'}}>
      {Array.from({length:6},(_,i)=>{
        const q=out((t-24.1-i*.16)/2.5);
        return <div key={i} style={{position:'absolute',inset:0,opacity:q,
          clipPath:`inset(0 ${100-(i+1)*100/6}% 0 ${i*100/6}%)`,
          transform:`translate3d(${mix((i%2?1:-1)*135,0,q)}px,${mix(i%2?100:-100,0,q)}px,0) rotateY(${mix(i%2?65:-65,0,q)}deg)`,
          filter:`blur(${(1-q)*6}px)`}}>
          <Img src={staticFile('brand/fenix13-chill-grill.png')} style={{width:'100%',height:'100%',objectFit:'contain'}}/>
        </div>;
      })}
    </div>
    <div style={{position:'absolute',top:1280,left:90,opacity:master}}>
      <Type text="COMING SOON" t={t} at={27.5} size={87} center/>
    </div>
    <div style={{position:'absolute',left:90,top:1440,width:900,textAlign:'center',opacity:master}}>
      <div style={{width:620,height:1,margin:'0 auto 32px',background:'linear-gradient(90deg,transparent,#e39555,transparent)'}}/>
      <Label style={{fontSize:26}}>TAUNGGYI, SHAN STATE</Label>
      <div style={{fontFamily:M,fontSize:30,letterSpacing:3,color:P.orange,marginTop:52,opacity:enter(t,28.1,.7)}}>THE NIGHT COMES ALIVE.</div>
    </div>
    <Label style={{position:'absolute',top:1690,left:90,width:900,textAlign:'center',fontSize:18,color:'#957c60',opacity:master}}>A NEW HOME FOR GREAT NIGHTS.</Label>
  </AbsoluteFill>;
}

function Cuts({t}:{t:number}){
  return <AbsoluteFill style={{pointerEvents:'none'}}>
    {[12,16,20,21.333333,22.666667,24].map((at,i)=>{
      const v=(t-at+.18)/.36;
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
    <AbsoluteFill style={{background:'radial-gradient(ellipse at 50% 57%,#75331117,transparent 57%)'}}/>
    {t<12?<><Atlas t={t}/><OriginCopy t={t}/></>:t<16?<Chill t={t}/>:t<20?<Grill t={t}/>:t<24?<Social t={t}/>:<Logo t={t}/>}
    <Cuts t={t}/>
    <div style={{position:'absolute',left:90,top:100,width:900,display:'flex',justifyContent:'space-between',fontFamily:MONO,fontSize:19,
      letterSpacing:2,color:t>=16&&t<20?'#4d2917':'#a18662',opacity:t>=24?exit(t,24,.3):.8}}>
      <span>FENIX /13</span><span>CHILL & GRILL</span>
    </div>
  </AbsoluteFill>;
};
