import React, {useLayoutEffect, useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import typeface from './typeface.json';
import {clamp, ease, enter, io, mix, out, palette} from './motion';

// Every pose is a pure function of the Remotion frame. No animation loop, physics
// accumulation, random particles, external textures, or network dependencies.
const font = new FontLoader().parse(typeface as any);
const wordCache = new Map<string, TextGeometry>();
function textGeo(text:string,size=1,depth=.19){
  const key = `${text}:${size}:${depth}`;
  if (!wordCache.has(key)) {
    const g = new TextGeometry(text,{font,size,depth,curveSegments:8,
      bevelEnabled:true,bevelThickness:.022,bevelSize:.018,bevelSegments:3});
    g.computeBoundingBox(); g.center(); wordCache.set(key,g);
  }
  return wordCache.get(key)!;
}

function Environment(){
  const {gl,scene} = useThree();
  useLayoutEffect(()=>{
    const c=document.createElement('canvas'); c.width=1024; c.height=512;
    const ctx=c.getContext('2d')!;
    ctx.fillStyle='#161511'; ctx.fillRect(0,0,1024,512);
    // Rectangular studio softboxes produce deliberate metallic reflections.
    const panels=[[35,20,100,370,'#ffb781'],[250,5,180,140,'#ffffef'],
      [550,80,46,350,'#ffffff'],[700,5,185,125,'#eee2c8'],[905,200,70,280,'#684cba']] as const;
    for(const [x,y,w,h,col] of panels){ctx.fillStyle=col;ctx.fillRect(x,y,w,h);}
    const tex=new THREE.CanvasTexture(c);tex.mapping=THREE.EquirectangularReflectionMapping;
    tex.colorSpace=THREE.SRGBColorSpace;
    const pmrem=new THREE.PMREMGenerator(gl);const env=pmrem.fromEquirectangular(tex);
    scene.environment=env.texture;
    return ()=>{scene.environment=null;env.dispose();pmrem.dispose();tex.dispose();};
  },[gl,scene]);
  return <><ambientLight intensity={.6}/><directionalLight position={[-6,8,8]} color="#fff3de" intensity={4.8}/>
    <directionalLight position={[6,-2,5]} color="#ff752d" intensity={3.4}/>
    <directionalLight position={[1,5,-6]} color="#9073ee" intensity={2.1}/></>;
}

const Metal:React.FC<{orange?:boolean; glow?:boolean}> = ({orange=false,glow=false}) =>
  <meshPhysicalMaterial color={orange?'#dc7b3e':'#efdfc8'} metalness={.94} roughness={.19}
    clearcoat={1} clearcoatRoughness={.15} envMapIntensity={1.5}
    emissive={orange?'#a32a06':'#b8642d'} emissiveIntensity={glow?.65:.045}/>;

function ribbonGeo(radius:number,width:number,turns=1.5,phase=0){
  const pos:number[]=[],norm:number[]=[],uv:number[]=[],idx:number[]=[];
  const n=180;
  for(let i=0;i<=n;i++){
    const a=i/n*Math.PI*2*turns;
    for(let s=0;s<2;s++){
      const side=(s-.5)*width;
      const twist=a*.8+phase;
      const r=radius+side*Math.cos(twist);
      pos.push(Math.cos(a)*r,Math.sin(a)*r,(i/n-.5)*1.7+side*Math.sin(twist));
      norm.push(Math.cos(a)*Math.sin(twist),Math.sin(a)*Math.sin(twist),Math.cos(twist));
      uv.push(i/n,s);
    }
    if(i<n){const b=i*2;idx.push(b,b+1,b+2,b+1,b+3,b+2);}
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(norm,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);g.computeVertexNormals();return g;
}

function Camera({t}:{t:number}){
  const {camera} = useThree();
  useLayoutEffect(()=>{
    let x=0,y=0,z=15,ty=0;
    if(t<4){const p=io(t/4);x=mix(-1.1,.6,p);y=mix(.3,0,p);z=mix(9.5,15,p);ty=-.4;}
    else if(t<8){x=Math.sin((t-4)*.8)*.4;z=14.5;ty=0;}
    else if(t<12){x=.8*Math.sin(t*.5);z=16;}
    else if(t<16){x=.5*Math.sin(t*2);z=14;}
    else if(t<20){z=16;}
    else {const p=io((t-20)/4.4);x=mix(4.2,0,p);y=mix(.8,0,p);z=mix(5.7,16.8,p);ty=mix(.15,0,p);}
    camera.position.set(x,y,z);camera.lookAt(0,ty,0);camera.updateProjectionMatrix();
  },[t,camera]);
  return null;
}

function Sculpture({t}:{t:number}){
  const ribbon=useMemo(()=>ribbonGeo(2.23,.73,1.45,.2),[]);
  const ribbon2=useMemo(()=>ribbonGeo(2.53,.1,1.45,1),[]);
  const p=enter(t,.1,1.7);
  const s=(t<3.5?mix(.25,1,p):mix(1,4.2,io((t-3.5)/.5)));
  if(t>=4) return null;
  return <group position={[0,-1.35,0]} rotation={[.35+t*.12,t*.39,-.3+t*.12]} scale={s}>
    <mesh geometry={ribbon}><meshPhysicalMaterial color="#d2753e" metalness={.97} roughness={.18}
      side={THREE.DoubleSide} envMapIntensity={1.8} clearcoat={1}/></mesh>
    <mesh geometry={ribbon2}><meshBasicMaterial color="#ff7b36" toneMapped={false} side={THREE.DoubleSide}/></mesh>
    <mesh rotation={[.8,0,0]}><torusGeometry args={[1.7,.085,12,120]}/><Metal/></mesh>
    <mesh rotation={[0,.7,.3]}><torusGeometry args={[2.8,.018,6,120]}/><meshBasicMaterial color="#bd6338"/></mesh>
    <mesh scale={.7}><icosahedronGeometry args={[.74,1]}/><Metal orange glow/></mesh>
    {Array.from({length:12},(_,i)=>{
      const a=i/12*Math.PI*2+t*.7;
      return <mesh key={i} position={[Math.cos(a)*3.15,Math.sin(a)*3.15,Math.sin(a*2)*.3]} rotation={[0,0,a]}>
        <boxGeometry args={[.13,.025,.025]}/><meshBasicMaterial color={i%3?'#a55b31':'#ffe4bd'}/></mesh>;
    })}
  </group>;
}

function Tunnel({t}:{t:number}){
  if(t<3.5||t>=8.1) return null;
  const progress=(t-4)*5.4;
  return <group rotation={[0,0,-.19+Math.sin(t)*.035]}>
    {Array.from({length:24},(_,i)=>{
      const z=8-((i*2.4-progress+120)%57.6);
      const a=i%2===0;
      return <group key={i} position={[0,-1,z]} rotation={[0,0,i*.025]}>
        <mesh position={[-3.1,0,0]}><boxGeometry args={[a?.055:.11,12,.06]}/><meshBasicMaterial color={a?'#ff5b14':'#6b3520'}/></mesh>
        <mesh position={[3.1,0,0]}><boxGeometry args={[a?.055:.11,12,.06]}/><meshBasicMaterial color={a?'#fba46f':'#6b3520'}/></mesh>
        <mesh position={[0,-5.7,0]}><boxGeometry args={[6.2,.05,.06]}/><meshBasicMaterial color="#ed6d25"/></mesh>
        <mesh position={[0,5.7,0]}><boxGeometry args={[6.2,.05,.06]}/><meshBasicMaterial color="#ed6d25"/></mesh>
      </group>;
    })}
  </group>;
}

function Orbital({t}:{t:number}){
  const r=useMemo(()=>ribbonGeo(2.15,.66,1.55,.7),[]);
  if(t<8||t>=12) return null;
  const p=(t-8)/4;
  return <group position={[1,-1.3,-.7]} rotation={[.6, p*3,-.6+p*.3]} scale={1.3}>
    <mesh geometry={r}><meshPhysicalMaterial color={t<10?'#26201b':'#b66e43'} metalness={.95}
      roughness={.2} clearcoat={1} side={THREE.DoubleSide} envMapIntensity={1.7}/></mesh>
    <mesh rotation={[.8,.4,0]}><torusGeometry args={[2.35,.025,6,120]}/><meshBasicMaterial color={t<10?'#3d2113':'#ff9c56'}/></mesh>
  </group>;
}

function WordSculptures({t}:{t:number}){
  if(t<12||t>=16) return null;
  const index=Math.min(2,Math.floor((t-12)/1.25));
  const local=t-12-index*1.25;
  const p=out(local/.68);
  const word=['SMOKE','SPARK','ENERGY'][index];
  const geom=textGeo(word,1.42,.28);geom.computeBoundingBox();
  const width=geom.boundingBox!.max.x-geom.boundingBox!.min.x;
  const scale=Math.min(1,5.8/width);
  return <group position={[mix(index%2?7:-7,0,p),.3,mix(-4,0,p)]}
    rotation={[mix(.9,-.12,p),mix(index%2?-.75:.75,0,p),mix(-.16,0,p)]} scale={scale}>
    <mesh geometry={geom}>
      <meshPhysicalMaterial attach="material-0" color={index===1?'#ff973e':'#fff2dc'} metalness={.25}
        roughness={.2} clearcoat={1} emissive={index===1?'#d94b09':'#73614c'} emissiveIntensity={.12}/>
      <meshPhysicalMaterial attach="material-1" color="#a65328" metalness={.9} roughness={.17} envMapIntensity={1.8}/>
    </mesh>
    {[1,2,3,4].map(i=><lineSegments key={i} position={[0,-i*.14,-i*.8]}>
      <edgesGeometry args={[geom,32]}/>
      <lineBasicMaterial color={index===1?'#ff7c29':'#bb8456'} transparent opacity={.26-i*.044}/>
    </lineSegments>)}
    <mesh position={[0,-1.3,-.3]} rotation={[0,0,-.08]}><boxGeometry args={[11,.025,.1]}/><meshBasicMaterial color="#ff691c"/></mesh>
  </group>;
}

function Brand({t}:{t:number}){
  const geos=useMemo(()=>Array.from('FENIX/13').map(c=>textGeo(c,1.35,.22)),[]);
  const widths=useMemo(()=>geos.map(g=>{g.computeBoundingBox();return g.boundingBox!.max.x-g.boundingBox!.min.x;}),[geos]);
  const total=widths.reduce((a,b)=>a+b,0)+.11*7+.14;
  const scl=6.9/total;
  const r=useMemo(()=>ribbonGeo(1,.24,1.18,.5),[]);
  if(t<20) return null;
  const assembly=io((t-20.6)/3.5);
  let cur=-total/2;
  return <>
    <group position={[0,1.52,0]} scale={scl} rotation={[0,mix(-.23,0,assembly),mix(-.1,0,assembly)]}>
      {geos.map((g,i)=>{
        const x=cur+widths[i]/2;cur+=widths[i]+.11+(i===4?.14:0);
        const p=out((t-20.5-i*.11)/2.6);
        const y=mix((i%2?1:-1)*(1.7+i*.18),0,p);
        return <group key={i} position={[mix(x*1.2,x,p),y,mix((i%2?1:-1)*3.2,0,p)]}
          rotation={[mix((i%2?.7:-.7),0,p),mix((i%2?1.4:-1.4),0,p),mix(i%2?.23:-.23,0,p)]}>
          <mesh geometry={g}><meshPhysicalMaterial color={i>=5?'#ff9954':'#f8ecda'} metalness={i>=5?.76:.3}
            roughness={.17} envMapIntensity={1.35} clearcoat={1} emissive={i>=5?'#ad3105':'#35251b'}
            emissiveIntensity={.12+.08*Math.exp(-(((t-24.25-i*.04)/.25)**2))}/></mesh>
        </group>;
      })}
    </group>
    {/* The signature slash is a bespoke sculptural seal, rather than a mascot. */}
    <group position={[0,3.95,-.8]} rotation={[.15,.15+(1-assembly)*1.8,-.25]} scale={mix(2,.72,assembly)}>
      <mesh geometry={r} rotation={[.5,t<24?(t-20)*.28:1.12,0]}>
        <meshPhysicalMaterial color="#e08042" metalness={.95} roughness={.18} side={THREE.DoubleSide} envMapIntensity={1.9}/>
      </mesh>
      <mesh rotation={[0,0,-.3]}><boxGeometry args={[.15,1.6,.17]}/><Metal orange glow/></mesh>
    </group>
    <pointLight position={[mix(-6,6,clamp((t-23.8)/1.2)),2.3,3]} intensity={t>23.8&&t<25.2?55:0}
      distance={12} color="#ffcc90"/>
  </>;
}

function Conductor({t}:{t:number}){
  const {curve,geos,sprite}=useMemo(()=>{
    const curve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(-8,-3.5,3),new THREE.Vector3(-4,2.4,1.2),
      new THREE.Vector3(-1,5,-1.6),new THREE.Vector3(3.5,4,-1),
      new THREE.Vector3(4.6,1.6,0),new THREE.Vector3(2.1,1.65,1)]);
    const geos=[.014,.045,.11].map(r=>new THREE.TubeGeometry(curve,200,r,5,false));
    const c=document.createElement('canvas');c.width=c.height=128;
    const ctx=c.getContext('2d')!;const g=ctx.createRadialGradient(64,64,0,64,64,64);
    g.addColorStop(0,'#fff5ce');g.addColorStop(.08,'#ffe6b0');g.addColorStop(.2,'#ff943cb0');
    g.addColorStop(.5,'#f8641930');g.addColorStop(1,'#f8641900');
    ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
    const sprite=new THREE.CanvasTexture(c);
    return {curve,geos,sprite};
  },[]);
  const p=io((t-20.5)/3.9);
  const fade=1-ease((t-24.4)/.9);
  geos.forEach(g=>{
    const start=Math.max(0,p-.23);
    g.setDrawRange(Math.floor(start*200)*30,Math.max(0,Math.floor((p-start)*200)*30));
  });
  if(t<20.5||t>=25.3)return null;
  const point=curve.getPoint(p);
  return <group>
    {geos.map((g,i)=><mesh geometry={g} key={i}>
      <meshBasicMaterial color={i===0?'#ffe9ae':'#ff7429'} transparent opacity={[1,.16,.045][i]*fade}
        blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>)}
    <sprite position={point} scale={[1.45,1.45,1]}>
      <spriteMaterial map={sprite} transparent opacity={fade} blending={THREE.AdditiveBlending} depthWrite={false}/>
    </sprite>
    <pointLight position={point} color="#ffb56b" intensity={fade*9} distance={6}/>
  </group>;
}

export const World:React.FC<{t:number}> = ({t}) => <ThreeCanvas width={1080} height={1920}
  camera={{fov:48,near:.1,far:140,position:[0,0,15]}}
  gl={{alpha:true,antialias:true,powerPreference:'high-performance'}} dpr={.8}
  style={{position:'absolute',inset:0,width:1080,height:1920}}>
  <Environment/><Camera t={t}/><Sculpture t={t}/><Tunnel t={t}/><Orbital t={t}/>
  <WordSculptures t={t}/><Brand t={t}/><Conductor t={t}/>
</ThreeCanvas>;
