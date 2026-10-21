import React,{useMemo,useLayoutEffect} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import * as T from 'three';
import rawContours from './wordmark-geometry.json';
type Outline={glyph:number;cx:number;cy:number;outer:number[][];holes:number[][][]};
const contours=rawContours as Outline[];
import {clamp,io,mix,out,exit} from './motion';
function Studio(){
 const {gl,scene}=useThree();
 useLayoutEffect(()=>{
  gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=1;
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=256;
  const c=canvas.getContext('2d')!;c.fillStyle='#a18e76';c.fillRect(0,0,512,256);
  c.fillStyle='#fff9ed';c.fillRect(60,20,65,170);c.fillRect(310,30,28,190);
  c.fillStyle='#e4c79c';c.fillRect(390,15,90,60);
  const texture=new T.CanvasTexture(canvas);texture.mapping=T.EquirectangularReflectionMapping;texture.colorSpace=T.SRGBColorSpace;
  const pmrem=new T.PMREMGenerator(gl),env=pmrem.fromEquirectangular(texture);scene.environment=env.texture;
  return()=>{scene.environment=null;texture.dispose();env.dispose();pmrem.dispose();};
 },[gl,scene]);
 return <><ambientLight intensity={.65}/><directionalLight position={[-3,5,12]} intensity={2.6} color="#fff7eb"/><directionalLight position={[5,-1,4]} intensity={1.1} color="#dca675"/></>;
}
function Letters({u}:{u:number}){
 const geometries=useMemo(()=>contours.map(item=>{
  const shape=new T.Shape();item.outer.forEach(([x,y],i)=>i?shape.lineTo((x-item.cx)/100,(item.cy-y)/100):shape.moveTo((x-item.cx)/100,(item.cy-y)/100));shape.closePath();
  for(const hole of item.holes){const path=new T.Path();hole.forEach(([x,y],i)=>i?path.lineTo((x-item.cx)/100,(item.cy-y)/100):path.moveTo((x-item.cx)/100,(item.cy-y)/100));path.closePath();shape.holes.push(path);}
  return new T.ExtrudeGeometry(shape,{depth:.24,bevelEnabled:true,bevelThickness:.016,bevelSize:.012,bevelSegments:3,curveSegments:6,steps:1});
 }),[]);
 const settled=io((u-1.1)/2.45),size=mix(1.10,1,settled);
 return <>
  <group position={[0,-2.5,0]} rotation={[mix(.10,0,settled),mix(-.36,0,settled),0]} scale={size}>
   {contours.map((item,i)=>{
    const p=out((u-.55-item.glyph*.17)/1.25);if(p<=0)return null;
    return <group key={i} position={[(item.cx-640)/100,(1-p)*-.38,(1-p)*.55]} rotation={[(1-p)*.10,(1-p)*(item.glyph%2?.22:-.22),0]} scale={[1,mix(.94,1,p),1]}>
     <mesh geometry={geometries[i]}>
      <meshStandardMaterial attach="material-0" color={item.glyph>=5?'#67432c':'#302c27'} metalness={.62} roughness={.28} transparent opacity={p}/>
      <meshStandardMaterial attach="material-1" color="#a97d52" metalness={.8} roughness={.24} transparent opacity={p}/>
     </mesh>
    </group>;
   })}
  </group>
  <pointLight position={[mix(-6,6,clamp((u-1.9)/2)),0,3.5]} intensity={u>1.9&&u<4.1?12:0} distance={12} color="#fff0cf"/>
 </>;
}
export function Wordmark3D({u}:{u:number}){
 if(u<.5||u>4.2)return null;
 return <div style={{position:'absolute',left:0,top:300,width:1080,height:810,opacity:exit(u,3.7,.5),filter:'drop-shadow(0px 8px 6px rgba(69,43,25,.22))'}}>
  <ThreeCanvas orthographic width={1080} height={810} camera={{position:[0,0,20],zoom:84.375,near:.1,far:100}} gl={{alpha:true,antialias:true,preserveDrawingBuffer:true}} dpr={1}>
   <Studio/><Letters u={u}/>
  </ThreeCanvas>
 </div>;
}
