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
    const phase=(t-27)*Math.PI*2*.48;
    const beat=Math.sin(phase),farBeat=Math.sin(phase-.18);
    for(let i=0;i<p.count;i++){
      const x=original[i*3],y=original[i*3+1];
      const px=(x/10+.5)*1536,py=(.5-y/(10*1024/1536))*1024;
      const left=ease((930-px)/540)*ease((710-py)/220);
      const right=ease((px-1060)/390)*ease((690-py)/200);
      const tail=ease((py-570)/350)*ease((1040-px)/420);
      const tip=Math.sin(phase-.7);
      const chest=Math.exp(-Math.pow((px-1010)/170,2)-Math.pow((py-510)/190,2));
      const head=Math.exp(-Math.pow((px-1070)/100,2)-Math.pow((py-270)/110,2));
      const breath=Math.sin(t*1.8)*.025*chest;
      const dy=left*.68*beat+right*.46*farBeat+(left*left+right*right)*tip*.14+breath+head*Math.sin(t*1.25)*.018;
      const dz=left*.8*beat-right*.56*farBeat+Math.sin(py*.008-t*2.1)*tail*.18+breath;
      const dx=(Math.sin(t*1.55+py*.006)*.13+Math.sin(t*3.1-py*.008)*.025)*tail;
      p.setXYZ(i,x+dx,y+dy,dz+.18*Math.exp(-Math.pow((px-1000)/220,2)));
    }
    p.needsUpdate=true;geometry.computeBoundingSphere();
  },[geometry,original,t,texture]);
  const arrival=io((t-27)/2.6),merge=io((t-31.9)/.9);
  const scale=macro?1.25:mix(.48,.88,arrival)*mix(1,.025,merge);
  return <group scale={scale} position={[macro?-.85:mix(-5.7,0,arrival)+merge*.9,macro?-2.7:mix(-.9,.65,arrival)+merge*.45+Math.sin((t-27)*3.016)*.04*(1-merge),0]}
    rotation={[.015,macro?-.08:mix(-.22,.02,arrival),macro?-.13:mix(-.15,.025,arrival)+Math.sin(t*.43)*.012]}>
    <mesh geometry={geometry}>
      <meshBasicMaterial map={texture} transparent depthWrite={false} side={T.DoubleSide} toneMapped={false}/>
    </mesh>
  </group>;
}

function PhoenixArtwork({t,macro=false}:{t:number;macro?:boolean}){
  return <div style={{position:'absolute',left:0,top:macro?0:205,width:1080,height:macro?1920:1000,
    opacity:macro?1:enter(t,27,.5)*exit(t,32.6,.22)}}>
    <ThreeCanvas width={1080} height={macro?1920:1000} camera={{position:[0,0,macro?25.344:13.2],fov:38}}
      gl={{alpha:true,antialias:true,preserveDrawingBuffer:true}} dpr={1}>
      <PhoenixSurface t={macro?29+(t-24)*.8:t} macro={macro}/>
    </ThreeCanvas>
  </div>;
}

function Atmosphere({t,kind}:{t:number;kind:'grill'|'lounge'|'food'|'friends'}){
  const start={lounge:10,grill:14,food:18,friends:21}[kind];
  const p=clamp((t-start)/(kind==='grill'||kind==='lounge'?4:3));
  const s=mix(1.025,1.10,ease(p));
  const transform=`translate(${mix(kind==='grill'?-15:10,kind==='grill'?10:-15,p)}px,${mix(18,-18,p)}px) scale(${s})`;
  return <div style={{position:'absolute',inset:0,overflow:'hidden'}}>
    <Img src={staticFile(`art/${kind}.png`)} style={{position:'absolute',width:1080,height:1920,objectFit:'cover',
      transform,
      transformOrigin:kind==='grill'?'52% 73%':kind==='friends'?'50% 65%':'64% 70%'}}/>
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

export function Cinema3D({t,kind}:{t:number;kind:'bird'|'grill'|'lounge'|'detail'|'food'|'friends'}){
  return kind==='bird'||kind==='detail'?<PhoenixArtwork t={t} macro={kind==='detail'}/>:<Atmosphere t={t} kind={kind}/>;
}
