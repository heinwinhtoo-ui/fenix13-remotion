import React,{useLayoutEffect,useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as T from 'three';
import {ease,io,mix,enter,exit} from './motion';

// Geometry, articulation, camera and lighting are evaluated from absolute time.
// Feather surfaces have thickness, a convex vane and a curved central rachis.
function feather(a:T.Vector3,b:T.Vector3,width:number,bow=.15){
  const v:number[]=[],uv:number[]=[],idx:number[]=[];const N=20,W=8;
  const tangent=b.clone().sub(a).normalize();
  const side=new T.Vector3(-tangent.y,tangent.x,0).normalize();
  for(let face=0;face<2;face++)for(let j=0;j<=N;j++){
    const u=j/N,c=a.clone().lerp(b,u);c.z+=Math.sin(u*Math.PI)*bow;
    const w=width*Math.pow(Math.sin(Math.PI*u),.72)*(.55+.45*u);
    for(let k=0;k<=W;k++){
      const q=k/W*2-1,p=c.clone().addScaledVector(side,q*w);
      p.z+=(1-q*q)*w*.27+(face===0?1:-1)*.009*Math.sin(u*Math.PI);
      v.push(p.x,p.y,p.z);uv.push(k/W,u);
    }
  }
  const off=(N+1)*(W+1);
  for(let f=0;f<2;f++)for(let j=0;j<N;j++)for(let k=0;k<W;k++){
    const i=f*off+j*(W+1)+k,d=i+W+1;
    if(f===0)idx.push(i,d,i+1,i+1,d,d+1);else idx.push(i,i+1,d,i+1,d+1,d);
  }
  for(let j=0;j<N;j++)for(const k of [0,W]){const a=j*(W+1)+k,b=a+W+1;idx.push(a,a+off,b,b,a+off,b+off);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
}
const mat=(color:string,roughness=.27,metalness=.88)=>new T.MeshStandardMaterial({color,roughness,metalness});
const gold=mat('#dc8848'),ivory=mat('#ead8b5',.3,.7),dark=mat('#14110e',.3,.85),edge=mat('#bf6030',.22,.95);
const copper=[gold,mat('#bf652e'),mat('#f0b96b'),mat('#a7441d'),ivory];
const beakGeometry=(()=>{
  const shape=new T.Shape();
  shape.moveTo(-.13,.13);shape.bezierCurveTo(.12,.2,.48,.08,.5,-.13);
  shape.bezierCurveTo(.51,-.23,.46,-.3,.43,-.34);
  shape.bezierCurveTo(.43,-.13,.27,-.12,-.13,-.06);shape.closePath();
  const g=new T.ExtrudeGeometry(shape,{depth:.14,bevelEnabled:true,bevelThickness:.035,bevelSize:.035,bevelSegments:3,steps:1,curveSegments:12});
  g.translate(0,0,-.07);return g;
})();

function Studio({t}:{t:number}){
  const {gl,scene}=useThree();
  useLayoutEffect(()=>{
    gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=.76;
    const vane=document.createElement('canvas');vane.width=256;vane.height=512;const vc=vane.getContext('2d')!;
    vc.fillStyle='#898989';vc.fillRect(0,0,256,512);vc.lineWidth=1;
    for(let y=-100;y<610;y+=6){vc.strokeStyle=y%12?'#707070':'#b5b5b5';vc.beginPath();vc.moveTo(0,y-70);vc.lineTo(128,y);vc.lineTo(256,y-70);vc.stroke();}
    vc.strokeStyle='#d0d0d0';vc.lineWidth=3;vc.beginPath();vc.moveTo(128,0);vc.lineTo(128,512);vc.stroke();
    const bump=new T.CanvasTexture(vane);for(const m of [...copper,ivory]){m.bumpMap=bump;m.bumpScale=.016;m.needsUpdate=true;}
    const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d')!;
    x.fillStyle='#15100c';x.fillRect(0,0,1024,512);
    for(const [a,b,w,h,col] of [[30,20,100,400,'#ffb36c'],[300,20,220,140,'#fff1d6'],[550,100,35,340,'#ffffff'],[740,10,130,300,'#efce9f'],[950,150,50,180,'#655b84']] as const){x.fillStyle=col;x.fillRect(a,b,w,h);}
    const tex=new T.CanvasTexture(c);tex.mapping=T.EquirectangularReflectionMapping;tex.colorSpace=T.SRGBColorSpace;
    const gen=new T.PMREMGenerator(gl),env=gen.fromEquirectangular(tex);scene.environment=env.texture;
    return()=>{scene.environment=null;env.dispose();tex.dispose();gen.dispose();bump.dispose();};
  },[gl,scene]);
  return <><ambientLight intensity={.35}/><directionalLight position={[-4,6,7]} color="#fff0dc" intensity={4.5}/>
    <directionalLight position={[5,1,3]} color="#ff863a" intensity={3.1}/><directionalLight position={[-3,3,-4]} color="#ffb05c" intensity={5}/>
    <pointLight position={[Math.sin(t*.5)*5,2,5]} color="#fff4d8" intensity={18} distance={15}/></>;
}

const Feather:React.FC<{a:number[];b:number[];w:number;m?:T.Material;bow?:number}>=({a,b,w,m=gold,bow=.15})=>{
  const g=useMemo(()=>feather(new T.Vector3(...a),new T.Vector3(...b),w,bow),[...a,...b,w,bow]);
  return <mesh geometry={g} material={m}/>;
};
const Egg=({p,s,m=ivory,r=[0,0,0]}:{p:number[];s:number[];m?:T.Material;r?:number[]})=><mesh position={p as any} scale={s as any} rotation={r as any} material={m}><sphereGeometry args={[1,24,16]}/></mesh>;

function Wing({side,t,fold}:{side:number;t:number;fold:number}){
  // Shoulder power stroke, then a delayed wrist response. Long glide between strokes.
  const cycle=(t-42)*Math.PI*2*.38;
  const beat=Math.sin(cycle)*.43;
  return <group position={[side*.28,.45,0]} rotation={[.08,side*(.15+beat*.6),side*(beat+fold*.9)]}>
    <group rotation={[0,side*.13,side*.04]}>
      {Array.from({length:13},(_,i)=>{
        const q=i/12;return <Feather key={i} a={[side*(.15+q*1.45),.24+q*.35,-q*.04]}
          b={[side*(1.3+q*2.22),mix(-.9,.55,q)-Math.sin(q*Math.PI)*.22,-.08-q*.55]}
          w={.12+q*.025} m={copper[i%4]} bow={.24}/>;
      })}
      {Array.from({length:12},(_,i)=>{const q=i/11;return <Feather key={'covert'+i}
        a={[side*(.1+q*1.6),.36+q*.22,.08]} b={[side*(.7+q*1.72),-.25+q*.55,.08-q*.12]}
        w={.11} m={i%3===0?ivory:gold} bow={.19}/>;})}
      {Array.from({length:10},(_,i)=>{const q=i/9;return <Feather key={'upper'+i}
        a={[side*(.04+q*1.4),.55,.1]} b={[side*(.5+q*1.68),.28+q*.48,.13-q*.1]}
        w={.09} m={copper[2]} bow={.12}/>;})}
    </group>
  </group>;
}

export function PhoenixMesh({t,macro=false}:{t:number;macro?:boolean}){
  const arrival=io((t-42)/3.5),settle=io((t-49.8)/2.5),merge=io((t-51.8)/1.05);
  const s=macro?1.9:mix(.28,1.20,arrival)*mix(1,.045,merge);
  return <group position={[macro?.4:mix(-4.4,0,arrival)+merge*.9,macro?-.15:mix(-1,.9,arrival)+merge*.2,0]}
    rotation={[macro?.13:mix(.3,.02,arrival),macro?-.6:mix(-.85,-.4,arrival)+Math.sin((t-45)*.65)*.23*(1-settle),macro?-.25:mix(-.4,.08,arrival)]} scale={s}>
    <Wing side={-1} t={t} fold={merge}/><Wing side={1} t={t+.15} fold={merge}/>
    {/* Long graduated tail plumes; layered behind the breast. */}
    {Array.from({length:9},(_,i)=>{const q=(i-4)/4;return <Feather key={'tail'+i} a={[q*.16,-.45,-.1]}
      b={[q*(1.1+Math.sin(t*1.3+i*.1)*.06),-2.85+Math.abs(q)*.65,-.15+Math.abs(q)*.45]}
      w={.14-Math.abs(q)*.02} m={copper[(i+1)%4]} bow={.35}/>;})}
    <Egg p={[0,.05,.1]} s={[.47,.71,.35]}/>
    {Array.from({length:12},(_,row)=>Array.from({length:7},(_,i)=>{
      const taper=1-row*.045,x=((i-3)*.126+(row%2)*.035)*taper,y=.55-row*.103,z=.18+Math.sqrt(Math.max(0,1-(x/.48)**2))*.25;
      return <Feather key={'breast'+row+'-'+i} a={[x,y,z]} b={[x*1.14,y-.25,z+.012]} w={.064*taper} m={row>8?gold:ivory} bow={.018}/>;
    }))}
    <Egg p={[0,.73,.12]} s={[.22,.44,.24]} r={[.15,0,-.13]}/>
    <group position={[.06,1.16,.15]} rotation={[0,-.12,0]}>
      <Egg p={[.05,0,0]} s={[.31,.235,.22]} r={[0,0,-.12]}/>
      <mesh geometry={beakGeometry} position={[.27,-.015,.04]} scale={.62} material={ivory}/>
      {[-1,1].map(s=><group key={s}>
        <Egg p={[.18,.035,s*.193]} s={[.035,.018,.014]} m={dark} r={[0,0,-.15]}/>
        {Array.from({length:5},(_,j)=><Feather key={j} a={[-.1+j*.05,-.08,s*.18]}
          b={[-.24+j*.04,-.38,s*.17]} w={.045} m={ivory} bow={.018}/>)}
      </group>)}
      {Array.from({length:5},(_,i)=>{const q=i/4;return <Feather key={'crest'+i}
        a={[-.1+q*.1,.12,(q-.5)*.18]} b={[-.57+q*.48,.86-q*.13,(q-.5)*.7]} w={.05} m={i%2?gold:ivory} bow={.08}/>;})}
    </group>
  </group>;
}

function GrillSculpture({t}:{t:number}){
  const a=(t-26)*.045;
  return <group position={[0,-.35,0]} rotation={[.28,-.35+a,0]} scale={1.18}>
    <mesh position={[0,-.35,0]} rotation={[Math.PI,0,0]} material={dark}><sphereGeometry args={[1.65,48,24,0,Math.PI*2,0,Math.PI/2]}/></mesh>
    <mesh position={[0,-.35,0]} rotation={[Math.PI/2,0,0]} material={edge}><torusGeometry args={[1.65,.045,10,80]}/></mesh>
    <mesh position={[0,-.45,0]}><cylinderGeometry args={[1.5,1.45,.12,48]}/><meshStandardMaterial color="#5a1705" emissive="#e34308" emissiveIntensity={.45}/></mesh>
    {Array.from({length:24},(_,i)=>{const a=i*2.399,r=.25+1.1*Math.sqrt(i/24);return <mesh key={i} position={[Math.cos(a)*r,-.38,Math.sin(a)*r]} rotation={[i,i*.3,i*.6]}>
      <dodecahedronGeometry args={[.16+(i%3)*.025,0]}/><meshStandardMaterial color="#28130a" roughness={.9} emissive="#d23d08" emissiveIntensity={.17+(i%4)*.055}/></mesh>;})}
    {Array.from({length:15},(_,i)=>{const z=(i-7)*.205,len=2*Math.sqrt(1.59**2-z*z);return <mesh key={i} position={[0,-.27,z]} rotation={[0,0,Math.PI/2]} material={ivory}><cylinderGeometry args={[.017,.017,len,8]}/></mesh>;})}
    <group position={[0,-.3,-1.58]} rotation={[-1.05,0,0]}>
      <mesh position={[0,0,1.58]} material={dark}><sphereGeometry args={[1.65,48,24,0,Math.PI*2,0,Math.PI/2]}/></mesh>
      <mesh position={[0,1.64,1.58]} rotation={[0,0,Math.PI/2]} material={edge}><capsuleGeometry args={[.06,.65,4,12]}/></mesh>
    </group>
    {[-1,1].map(x=>[-1,1].map(z=><mesh key={x+','+z} position={[x*.92,-1.92,z*.8]} rotation={[z*.12,0,-x*.12]} material={edge}><cylinderGeometry args={[.045,.065,2.15,12]}/></mesh>))}
    <mesh position={[0,-2.8,0]} material={dark}><cylinderGeometry args={[2.12,2.2,.14,64]}/></mesh>
    <pointLight position={[0,.12,0]} color="#ff6b1b" intensity={4} distance={3}/>
  </group>;
}

function Lounge({t}:{t:number}){
  return <group rotation={[.12,-.2+Math.sin(t*.15)*.1,0]} position={[0,-.4,0]}>
    {/* Architectural rings and faceted glassware, photographed with moving light. */}
    {[0,1,2].map(i=><mesh key={i} position={[0,.1,-1.5-i*.8]} rotation={[0,.12*i,0]} material={edge}>
      <torusGeometry args={[2.55+i*.24,.024,8,96]}/></mesh>)}
    <mesh position={[0,-1.65,0]} material={dark}><cylinderGeometry args={[2.9,3,.22,64]}/></mesh>
    <mesh position={[0,-1.52,0]} rotation={[Math.PI/2,0,0]} material={edge}><torusGeometry args={[2.87,.025,8,80]}/></mesh>
    {[-1,1].map((s,i)=><group key={s} position={[s*.8,-1.5,i*.35]} rotation={[0,s*.15,s*-.08]}>
      <mesh position={[0,.72,0]}><cylinderGeometry args={[.5,.39,1.35,12,1,true]}/><meshPhysicalMaterial color="#e7bf82" metalness={.15} roughness={.13} transparent opacity={.29} side={T.DoubleSide}/></mesh>
      <mesh position={[0,.47,0]}><cylinderGeometry args={[.43,.38,.8,12]}/><meshStandardMaterial color="#64300e" metalness={.35} roughness={.21}/></mesh>
      {[.08,1.4].map(y=><mesh key={y} position={[0,y,0]} rotation={[Math.PI/2,0,0]} material={ivory}><torusGeometry args={[y>1?.5:.39,.018,6,36]}/></mesh>)}
      {Array.from({length:12},(_,j)=>{const a=j/12*Math.PI*2;return <mesh key={j} position={[Math.sin(a)*.445,.74,Math.cos(a)*.445]} rotation={[Math.cos(a)*.07,0,-Math.sin(a)*.07]} material={ivory}><cylinderGeometry args={[.006,.006,1.33,5]}/></mesh>;})}
      {[0,1,2].map(j=><mesh key={j} position={[(j-1)*.15,.96+j*.08,Math.sin(j)*.12]} rotation={[j*.4,j*.6,.4]}><boxGeometry args={[.33,.3,.3]}/><meshPhysicalMaterial color="#eddac1" roughness={.13} metalness={.15} transparent opacity={.4}/></mesh>)}
    </group>)}
  </group>;
}

export function Cinema3D({t,kind}:{t:number;kind:'bird'|'grill'|'lounge'|'detail'}){
  const bird=kind==='bird',detail=kind==='detail';
  return <div style={{position:'absolute',left:0,top:bird?280:detail?700:750,width:1080,height:bird?960:1050,
    opacity:bird?enter(t,42,.7)*exit(t,52.65,.22):1}}>
    <ThreeCanvas width={1080} height={bird?960:1050} camera={{position:[0,.1,12.8],fov:38}}
      gl={{alpha:true,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true}} dpr={1}>
      <Studio t={t}/>
      {bird||detail?<PhoenixMesh t={detail?48+(t-34)*.3:t} macro={detail}/>:kind==='grill'?<GrillSculpture t={t}/>:<Lounge t={t}/>}
    </ThreeCanvas>
  </div>;
}
