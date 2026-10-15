import React from 'react';
import {Img,staticFile} from 'remotion';
import {clamp,ease,enter,exit,io,mix,out,palette as P} from './motion';
import {Label,Type,M} from './Design';

type Pose={x:number;y:number;s:number;r:number};
const keys=[
  [42,-280,1280,.7,-21],[43.7,190,830,1.02,-24],[45.1,820,510,1.13,13],
  [46.4,925,690,.88,32],[48,640,610,1.15,-10],[50,625,590,1.2,-4],
  [52.7,640,640,1.23,0],[54,640,640,1.23,0]
];
function cat(a:number,b:number,c:number,d:number,t:number){
  return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
}
function flight(t:number):Pose{
  let k=0;while(k<keys.length-2&&t>keys[k+1][0])k++;
  const p=clamp((t-keys[k][0])/(keys[k+1][0]-keys[k][0]));
  const values=[1,2,3,4].map(j=>cat(keys[Math.max(0,k-1)][j],keys[k][j],keys[k+1][j],keys[Math.min(keys.length-1,k+2)][j],p));
  return {x:values[0],y:values[1],s:values[2],r:values[3]};
}

/** Sculptural brand phoenix: original vector paths, animated wings and tails.
 * Frame-addressable wing poses and Catmull-Rom flight avoid simulation drift.
 */
export function Firebird({t,pose,opacity=1,settle=0,id='phoenix'}:{t:number;pose:Pose;opacity?:number;settle?:number;id?:string}){
  const flap=Math.sin((t-42)*Math.PI*2*.85)*(1-settle);
  const wing=-12+flap*29;
  const tail=Math.sin(t*3.1)*(1-settle);
  return <div style={{position:'absolute',left:pose.x-450,top:pose.y-450,width:900,height:900,
    opacity,transform:`scale(${pose.s}) rotate(${pose.r}deg)`,transformOrigin:'450px 450px',pointerEvents:'none'}}>
    <svg width="900" height="900" viewBox="-450 -450 900 900">
      <defs>
        <linearGradient id={id+'Fire'} x1="0" y1="0" x2=".6" y2="1"><stop stopColor="#fff0c2"/><stop offset=".15" stopColor="#ffbf48"/><stop offset=".48" stopColor="#ff6c13"/><stop offset="1" stopColor="#e91d0b"/></linearGradient>
        <linearGradient id={id+'Copper'} x1="0" x2="1" y1="0" y2=".6"><stop stopColor="#7b250b"/><stop offset=".25" stopColor="#f66816"/><stop offset=".42" stopColor="#ffd994"/><stop offset=".54" stopColor="#d65a17"/><stop offset="1" stopColor="#8e260d"/></linearGradient>
        <linearGradient id={id+'Ivory'} x1="0" y1="0" x2=".7" y2="1"><stop stopColor="#fff9e8"/><stop offset=".5" stopColor="#fff0d5"/><stop offset="1" stopColor="#e6bb83"/></linearGradient>
        <radialGradient id={id+'Glow'}><stop stopColor="#ffae38" stopOpacity=".14"/><stop offset=".5" stopColor="#ff5311" stopOpacity=".06"/><stop offset="1" stopColor="#ff5311" stopOpacity="0"/></radialGradient>
      </defs>
      <ellipse cx="-90" cy="10" rx="380" ry="365" fill={`url(#${id}Glow)`}/>
      {/* Far wing opens in the opposite plane before the near feather fan. */}
      <g transform={`translate(-12 5) rotate(${-wing*.65-17}) scale(.8 .85)`} opacity=".7">
        <path d="M-20 10C-130-40-195-150-285-210C-170-185-70-115 40-25Z"
          fill={`url(#${id}Copper)`}/>
      </g>
      {[0,1,2].map(i=><path key={i} d={`M${-21+i*18} 52C${-60-i*22} ${150+tail*10} ${-245-i*22} ${173+i*32+tail*15} ${-318+i*37} ${271+i*29}C${-161+i*25} ${248+i*22} ${-56+i*24} ${183+i*15} ${17+i*9} 73Z`}
        fill={`url(#${id}Fire)`} opacity={1-i*.06}/>)}
      <g transform={`rotate(${wing} -20 10)`}>
        {[0,1,2,3,4].map(i=><path key={i}
          d={`M${-12+i*8} ${27+i*9}C${-118+i*6} ${-32-i*32} ${-228+i*7} ${-190-i*35} ${-365+i*26} ${-201-i*35}C${-251+i*29} ${-259-i*25} ${-79+i*10} ${-155-i*14} ${36+i*8} ${-28+i*12}Z`}
          fill={`url(#${id}Copper)`} stroke="#e49a48" strokeWidth=".55" strokeOpacity=".55"/>)}
      </g>
      <path d="M-19-70C24-76 57-39 57 8C53 51 26 84-13 112C-43 97-52 59-42 22C-34-11-15-33-19-70Z"
        fill={`url(#${id}Ivory)`}/>
      <path d="M-20 110C-90 50-84-39-24-96C17-137 68-140 96-160C77-181 73-211 85-247C67-218 54-196 58-176C33-199 26-225 29-255C7-213 21-172 48-151C-2-152-53-111-72-63C-111 33-55 112 63 141C19 123-4 123-20 110Z"
        fill={`url(#${id}Ivory)`}/>
      <path d="M-22-99C21-145 103-154 139-113C155-96 161-72 157-48C146-75 131-82 113-83C61-92 31-69 2-32Z" fill={`url(#${id}Ivory)`}/>
      <path d="M62-177C36-191 14-218 8-239C1-201 22-172 48-151Z" fill={`url(#${id}Fire)`}/>
      <path d="M20 120Q98 161 174 180Q77 170-20 110" fill="#fff0d5" opacity=".8"/>
    </svg>
  </div>;
}

export function OpeningPhoenix({t}:{t:number}){
  const p=io((t-1.6)/3.2);
  if(t<1.6||t>4.8)return null;
  return <Firebird t={t+42} pose={{x:mix(-100,1230,p),y:1120-Math.sin(p*Math.PI)*390,s:.22+.05*Math.sin(p*Math.PI),r:mix(-18,12,p)}}
    opacity={enter(t,1.6,.45)*exit(t,4.3,.5)} id="openingPhoenix"/>;
}

// Measured source image glyph intervals: preserve the supplied three-bar E and
// custom /13 instead of substituting font glyphs during the logo reveal.
const cuts=[206,367,530,720,782,945.5,1039,1108.5,1245];
export const letterTimes=Array.from({length:8},(_,i)=>46+i*.65);

export function PhoenixIdent({t}:{t:number}){
  const basePose=flight(t);
  const absorption=io((t-51.2)/1.45);
  const pose={x:mix(basePose.x,640,absorption),y:mix(basePose.y,640,absorption),s:basePose.s*mix(1,.035,absorption),r:basePose.r};
  const settle=io((t-50.7)/2.1);
  const birdOpacity=enter(t,42,.7)*exit(t,52.2,.65);
  const crest=io((t-52.25)/1.6);
  const logo=staticFile('brand/fenix13-chill-grill.png');
  const trailPoints=Array.from({length:38},(_,i)=>flight(Math.max(42,t-.035*(37-i))));
  const path='M'+trailPoints.map(p=>`${p.x-60},${p.y+40}`).join('L');
  const rayOpacity=exit(t,51.9,.6);
  const final=enter(t,53.55,.8);
  return <>
    <svg width="1080" height="1920" style={{position:'absolute',inset:0}}>
      <defs><linearGradient id="flightTrail"><stop stopColor="#ff6214" stopOpacity="0"/><stop offset="1" stopColor="#ffd595" stopOpacity=".7"/></linearGradient>
        <radialGradient id="mergeLight"><stop stopColor="#fff3d5" stopOpacity=".45"/><stop offset=".2" stopColor="#ffae51" stopOpacity=".2"/><stop offset="1" stopColor="#ff6713" stopOpacity="0"/></radialGradient>
        <clipPath id="arcSafe"><rect x="0" y="0" width="1080" height="984"/></clipPath>
      </defs>
      {t<52.7&&<g opacity={birdOpacity*.7}><path d={path} fill="none" stroke="url(#flightTrail)" strokeWidth="2"/>
        <path d={path} fill="none" stroke="#f76a1c" strokeWidth="10" opacity=".045"/>
      </g>}
      {letterTimes.map((at,i)=>{
        const q=clamp((t-at+.22)/.65);
        const x=-20+(cuts[i]+cuts[i+1])/2*1120/1448;
        if(q<=0||q>=1)return null;
        return <g key={i} opacity={Math.sin(q*Math.PI)*.46*rayOpacity}>
          <path d={`M${pose.x+90} ${pose.y-80}Q${x+40} 790 ${x} 1015`} fill="none" stroke="#e9a34e" strokeWidth="1.3"
            pathLength="1" strokeDasharray={`${out(q)} 1`}/>
          <circle cx={x} cy="1010" r="45" fill="url(#mergeLight)"/>
        </g>;
      })}
      <g clipPath="url(#arcSafe)"><circle cx="540" cy="738" r="335" fill="none" stroke="#ce8441" strokeWidth="1.4" pathLength="1"
        strokeDasharray={`${clamp((t-51.8)/1.7)} 1`} transform="rotate(-95 540 738)" opacity={exit(t,54,.7)*.6}/></g>
      <ellipse cx="640" cy="640" rx="240" ry="240" fill="url(#mergeLight)" opacity={Math.sin(clamp((t-51.8)/2.1)*Math.PI)*.85}/>
    </svg>
    {t<52.85&&<Firebird t={t} pose={pose} opacity={birdOpacity} settle={settle}/>}
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
