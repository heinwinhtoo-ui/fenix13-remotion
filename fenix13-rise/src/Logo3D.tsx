import React,{useLayoutEffect,useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as T from 'three';
import data from './logo-geometry.json';
import {clamp,ease,io,mix,out,enter,exit} from './motion';

function Environment(){
  const {gl,scene}=useThree();
  useLayoutEffect(()=>{
    gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=.85;
    const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d')!;
    ctx.fillStyle='#15100d';ctx.fillRect(0,0,1024,512);
    for(const [x,y,w,h,col] of [[20,10,110,350,'#ff9c50'],[250,20,240,160,'#fff4dd'],[610,70,45,380,'#fffafa'],[780,15,160,90,'#e0d4bc']] as const){ctx.fillStyle=col;ctx.fillRect(x,y,w,h);}
    const tex=new T.CanvasTexture(c);tex.mapping=T.EquirectangularReflectionMapping;tex.colorSpace=T.SRGBColorSpace;
    const pmrem=new T.PMREMGenerator(gl),env=pmrem.fromEquirectangular(tex);scene.environment=env.texture;
    return()=>{scene.environment=null;tex.dispose();env.dispose();pmrem.dispose();};
  },[gl,scene]);
  return <><ambientLight intensity={.8}/><directionalLight position={[-4,7,8]} color="#fff0dc" intensity={3.2}/>
    <directionalLight position={[5,-1,3]} color="#ff7b30" intensity={2}/><directionalLight position={[-3,2,-6]} color="#ff9239" intensity={4}/></>;
}

type Contour={group:string;color:string;outer:number[][];holes:number[][][]};
function build(item:Contour){
  const s=new T.Shape();
  item.outer.forEach(([x,y],i)=>i?s.lineTo((x-724)/100,(543-y)/100):s.moveTo((x-724)/100,(543-y)/100));s.closePath();
  for(const hole of item.holes){const p=new T.Path();hole.forEach(([x,y],i)=>i?p.lineTo((x-724)/100,(543-y)/100):p.moveTo((x-724)/100,(543-y)/100));p.closePath();s.holes.push(p);}
  return new T.ExtrudeGeometry(s,{depth:item.group==='crest'?.20:.32,bevelEnabled:true,bevelSize:.008,bevelThickness:.012,bevelSegments:3,curveSegments:8,steps:1});
}

function Brand({t}:{t:number}){
  const geos=useMemo(()=>data.map(build),[]);
  const settle=io((t-30.2)/4.35);
  const orbit=clamp((t-31.3)/2.7);
  const ribbon=useMemo(()=>{
    const pts=Array.from({length:161},(_,i)=>{const a=i/160*Math.PI*1.9-.9;return new T.Vector3(Math.cos(a)*4.9,Math.sin(a)*3.5+1.1,Math.sin(a)*.8);});
    return new T.TubeGeometry(new T.CatmullRomCurve3(pts),160,.012,5,false);
  },[]);
  ribbon.setDrawRange(Math.floor(Math.max(0,orbit-.24)*160)*30,Math.ceil(Math.min(orbit,.24)*160)*30);
  return <group rotation={[mix(.12,0,settle),mix(-.52,0,settle),mix(-.04,0,settle)]}
    position={[mix(.25,0,settle),mix(.1,0,settle),mix(-.8,0,settle)]}>
    {data.map((item,i)=>{
      const crest=item.group==='crest',index=crest?i:Number(item.group.slice(5));
      const at=crest?32.45+i*.045:30.1+index*.22;
      const p=out((t-at)/(crest?1.35:1.05));
      if(p<=0)return null;
      const orange=item.color==='orange';
      return <group key={i} position={[crest?(1-p)*.14:(1-p)*(index%2?.35:-.35),(1-p)*(crest?.2:(index%2?.5:-.5)),-.32+(1-p)*(crest?-2.4:3.8)]}
        rotation={[0,(1-p)*(crest?-.13:(index%2?.26:-.26)),0]}>
        <mesh geometry={geos[i]}>
          <meshPhysicalMaterial attach="material-0" color={orange?'#ff6a21':'#fff0d5'} metalness={orange?.58:.32} roughness={.23}
            clearcoat={.7} envMapIntensity={1.15} transparent opacity={p} emissive={orange?'#872102':'#17100a'} emissiveIntensity={.15}/>
          <meshStandardMaterial attach="material-1" color={orange?'#b94d19':'#ba773f'} metalness={.93} roughness={.19} transparent opacity={p}/>
        </mesh>
      </group>;
    })}
    {t>31.3&&t<34.4&&<mesh geometry={ribbon}><meshBasicMaterial color="#ffb866" transparent opacity={exit(t,33.9,.5)} toneMapped={false}/></mesh>}
    <pointLight position={[mix(-6,6,clamp((t-32.8)/1.7)),1,4]} intensity={t>32.8&&t<34.5?28:0} color="#ffcc89" distance={15}/>
  </group>;
}

export function Logo3D({t}:{t:number}){
  if(t<30||t>=35.05)return null;
  return <div style={{position:'absolute',left:-20,top:370,width:1120,height:840,opacity:exit(t,34.65,.4)}}>
    <ThreeCanvas width={1120} height={840} camera={{position:[0,0,18],fov:2*Math.atan(10.86/36)*180/Math.PI}}
      gl={{alpha:true,antialias:true,preserveDrawingBuffer:true}} dpr={1}>
      <Environment/><Brand t={t}/>
    </ThreeCanvas>
  </div>;
}
