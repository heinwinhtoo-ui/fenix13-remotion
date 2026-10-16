import React,{useLayoutEffect,useMemo} from 'react';
import {Img,staticFile} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useLoader} from '@react-three/fiber';
import * as T from 'three';
import {clamp,ease,io,mix,enter,exit} from './motion';

/** CGI artwork on a continuous depth mesh: a 2.5D compositing rig,
 * not a fully modelled volumetric creature. No body/wing cut-out seams. */
function PhoenixSurface({t,macro}:{t:number;macro:boolean}){
  const texture=useLoader(T.TextureLoader,staticFile('art/phoenix.png'));
  const {geometry,original}=useMemo(()=>{
    const geometry=new T.PlaneGeometry(10,10*1024/1536,84,56);
    return {geometry,original:new Float32Array(geometry.attributes.position.array)};
  },[]);
  useLayoutEffect(()=>{
    texture.colorSpace=T.SRGBColorSpace;
    const p=geometry.attributes.position as T.BufferAttribute;
    const beat=Math.sin((t-42)*Math.PI*2*.32);
    for(let i=0;i<p.count;i++){
      const x=original[i*3],y=original[i*3+1];
      const px=(x/10+.5)*1536,py=(.5-y/(10*1024/1536))*1024;
      const left=ease((930-px)/540)*ease((710-py)/220);
      const right=ease((px-1060)/390)*ease((690-py)/200);
      const tail=ease((py-570)/350)*ease((1040-px)/420);
      const tip=Math.sin((t-42)*Math.PI*2*.32-.65);
      const dy=(left*.55+right*.34)*beat+(left*left+right*right)*tip*.12;
      const dz=(left*.7-right*.48)*beat+Math.sin(px*.006+t*1.3)*tail*.14;
      const dx=Math.sin(t*1.15+py*.004)*tail*.11;
      p.setXYZ(i,x+dx,y+dy,dz+.18*Math.exp(-Math.pow((px-1000)/220,2)));
    }
    p.needsUpdate=true;geometry.computeBoundingSphere();
  },[geometry,original,t,texture]);
  const arrival=io((t-42)/3.5),merge=io((t-51.8)/1.05);
  const scale=macro?1.48:mix(.48,.88,arrival)*mix(1,.025,merge);
  return <group scale={scale} position={[macro?-.85:mix(-5.7,0,arrival)+merge*.9,macro?-.25:mix(-.9,.65,arrival)+merge*.45,0]}
    rotation={[.015,macro?-.08:mix(-.22,.02,arrival),macro?-.13:mix(-.15,.025,arrival)+Math.sin(t*.43)*.012]}>
    <mesh geometry={geometry}>
      <meshBasicMaterial map={texture} transparent depthWrite={false} side={T.DoubleSide} toneMapped={false}/>
    </mesh>
  </group>;
}

function PhoenixArtwork({t,macro=false}:{t:number;macro?:boolean}){
  return <div style={{position:'absolute',left:0,top:macro?675:205,width:1080,height:1000,
    opacity:macro?1:enter(t,42,.65)*exit(t,52.65,.22)}}>
    <ThreeCanvas width={1080} height={1000} camera={{position:[0,0,13.2],fov:38}}
      gl={{alpha:true,antialias:true,preserveDrawingBuffer:true}} dpr={1}>
      <PhoenixSurface t={macro?48+(t-39.33)*.8:t} macro={macro}/>
    </ThreeCanvas>
  </div>;
}

function Atmosphere({t,kind}:{t:number;kind:'grill'|'lounge'}){
  const start=kind==='grill'?(t<34?26:34):(t<34?18:36.6667);
  const p=clamp((t-start)/(t<34?8:8/3));
  const s=mix(1.025,1.10,ease(p));
  const transform=`translate(${mix(kind==='grill'?-15:10,kind==='grill'?10:-15,p)}px,${mix(18,-18,p)}px) scale(${s})`;
  return <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
    <Img src={staticFile(`art/${kind}.png`)} style={{position:'absolute',width:1080,height:1920,objectFit:'cover',
      transform,
      transformOrigin:kind==='grill'?'52% 73%':'64% 70%'}}/>
    {kind==='grill'&&<>
      <svg width="0" height="0" style={{position:'absolute'}}><defs>
        <filter id="heatMotion" x="-3%" y="-3%" width="106%" height="106%">
          <feTurbulence type="fractalNoise" baseFrequency=".014 .025" numOctaves="1" seed="13" result="heat"/>
          <feOffset in="heat" dy={-(t-start)*22} result="risingHeat"/>
          <feDisplacementMap in="SourceGraphic" in2="risingHeat" scale={8+Math.sin(t*2.7)*3} xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs></svg>
      <div style={{position:'absolute',inset:0,maskImage:'linear-gradient(transparent 29%,#000 39%,#000 52%,transparent 60%)'}}>
        <Img src={staticFile('art/grill.png')} style={{position:'absolute',width:1080,height:1920,objectFit:'cover',transform,
          transformOrigin:'52% 73%',filter:'url(#heatMotion)'}}/>
      </div>
    </>}
    <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#070706 0%,#070706b0 28%,transparent 50%,transparent 82%,#070706a0 100%)'}}/>
    {kind==='grill'&&<>
      <div style={{position:'absolute',left:50,top:1060,width:980,height:530,background:'radial-gradient(ellipse,#ff651a,transparent 68%)',
        mixBlendMode:'screen',opacity:.045+.025*Math.sin(t*3.3)+.009*Math.sin(t*8.1),transform:`scale(${1+Math.sin(t*1.3)*.03})`}}/>
      {[0,1,2,3,4].map(i=>{const q=(t*.17+i*.19)%1;return <div key={i} style={{position:'absolute',left:170+i*165+Math.sin(t+i)*15,
        top:1300-q*470,width:2+i%2,height:4,borderRadius:5,background:'#ffd093',opacity:Math.sin(q*Math.PI)*.48,filter:'blur(.6px)'}}/>;})}
    </>}
    {kind==='lounge'&&<div style={{position:'absolute',left:mix(-700,1200,p),top:1050,width:180,height:530,
      transform:'rotate(21deg)',background:'linear-gradient(90deg,transparent,#ffe5b3,transparent)',opacity:.055,mixBlendMode:'screen',filter:'blur(20px)'}}/>}
  </div>;
}

export function Cinema3D({t,kind}:{t:number;kind:'bird'|'grill'|'lounge'|'detail'}){
  return kind==='bird'||kind==='detail'?<PhoenixArtwork t={t} macro={kind==='detail'}/>:<Atmosphere t={t} kind={kind}/>;
}
