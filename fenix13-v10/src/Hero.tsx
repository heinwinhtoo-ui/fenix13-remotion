import React,{useLayoutEffect,useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useLoader,useThree} from '@react-three/fiber';
import {staticFile} from 'remotion';
import * as T from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {clone} from 'three/examples/jsm/utils/SkeletonUtils.js';
import {clamp,io,mix,enter,exit} from './motion';

export const BRAND={left:15,top:395,width:1050,height:787.5};
const rand=(i:number)=>{const x=Math.sin(i*127.1+31.7)*43758.5453;return x-Math.floor(x);};
function Light(){
 const {scene,gl}=useThree();
 useLayoutEffect(()=>{
  gl.toneMapping=T.ACESFilmicToneMapping;gl.toneMappingExposure=.75;

 },[scene,gl]);
 return <><ambientLight intensity={.28}/><directionalLight position={[-4,7,8]} color="#fff4de" intensity={2.8} castShadow shadow-mapSize={[1024,1024]} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} shadow-bias={-.0005}/>
  <directionalLight position={[5,2,4]} color="#ffd2a2" intensity={.9}/><directionalLight position={[-2,4,-5]} color="#ff762c" intensity={3}/>
  <pointLight position={[0,.1,1]} color="#ff6d20" intensity={3} distance={3}/></>;
}
function Creature({t}:{t:number}){
 const gltf=useLoader(GLTFLoader,staticFile('models/FENIX_V10_CREATURE.glb'));
 const brand=useLoader(T.TextureLoader,staticFile('brand/fenix13-chill-grill.png'));
 const state=useMemo(()=>{
  const scene=clone(gltf.scene);const mixer=new T.AnimationMixer(scene);const action=mixer.clipAction(gltf.animations[0]);action.play();action.setLoop(T.LoopOnce,1);action.clampWhenFinished=true;
  const mats:T.MeshStandardMaterial[]=[];const fade={value:0},heat={value:0};const skins:T.SkinnedMesh[]=[];
  const c=document.createElement('canvas');c.width=128;c.height=512;const ctx=c.getContext('2d')!;
  ctx.fillStyle='#888';ctx.fillRect(0,0,128,512);ctx.lineWidth=1;
  for(let y=-70;y<590;y+=5){ctx.strokeStyle=y%10?'#b5b5b5':'#606060';ctx.beginPath();ctx.moveTo(0,y-25);ctx.lineTo(64,y);ctx.lineTo(128,y-25);ctx.stroke();}
  const bump=new T.CanvasTexture(c);
  scene.traverse(o=>{if((o as T.SkinnedMesh).isSkinnedMesh)skins.push(o as T.SkinnedMesh);if((o as T.Mesh).isMesh){const mesh=o as T.Mesh;mesh.castShadow=(Array.isArray(mesh.material)?mesh.material:[mesh.material]).some(m=>m.name.includes("keratin"));mesh.receiveShadow=true;
   const list=(Array.isArray(mesh.material)?mesh.material:[mesh.material]).map(m=>{const mat=m.clone() as T.MeshStandardMaterial;mat.transparent=false;mat.depthWrite=true;
    mat.onBeforeCompile=(shader)=>{shader.uniforms.fenixFade=fade;shader.uniforms.fenixHeat=heat;shader.vertexShader="varying vec3 vFenix;\n"+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace("#include <project_vertex>","#include <project_vertex>\nvFenix=(modelMatrix*vec4(transformed,1.0)).xyz;");shader.fragmentShader="uniform float fenixFade;uniform float fenixHeat;varying vec3 vFenix;\n"+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace("#include <alphatest_fragment>","#include <alphatest_fragment>\nfloat fenixNoise=fract(sin(dot(floor(vFenix*55.0),vec3(12.9898,78.233,37.719)))*43758.5453);if(fenixNoise<fenixFade)discard;");shader.fragmentShader=shader.fragmentShader.replace("#include <opaque_fragment>","float tipHeat=smoothstep(2.1,3.4,abs(vFenix.x))+smoothstep(1.3,2.8,-vFenix.y);outgoingLight+=vec3(0.75,0.11,0.006)*tipHeat*fenixHeat;if(fenixFade>0.01&&fenixNoise<fenixFade+0.035)outgoingLight+=vec3(1.2,0.3,0.025);\n#include <opaque_fragment>");};mat.side=T.DoubleSide;
    if(mat.name.includes('vanes')){mat.bumpMap=bump;mat.bumpScale=.016;mat.roughness=.57;mat.metalness=.015;}mats.push(mat);return mat;});mesh.material=Array.isArray(mesh.material)?list:list[0];}});
  const count=700,pos=new Float32Array(count*3),color=new Float32Array(count*3);const geom=new T.BufferGeometry();geom.setAttribute('position',new T.BufferAttribute(pos,3));
  for(let i=0;i<count;i++){const col=new T.Color(i%7?'#ff8f37':'#ffedc8');color.set(col.toArray(),i*3);}geom.setAttribute('color',new T.BufferAttribute(color,3));
  return {scene,mixer,mats,skins,geom,count,fade,heat};
 },[gltf]);
 const targets=useMemo(()=>{
  const img=brand.image as HTMLImageElement,c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d')!;ctx.drawImage(img,0,0);
  const d=ctx.getImageData(0,0,c.width,c.height).data,pts:T.Vector3[]=[];const pxPerUnit=1920/(2*17*Math.tan(24*Math.PI/180));
  for(let y=50;y<800;y+=5)for(let x=200;x<1250;x+=5){const k=(y*c.width+x)*4;if(d[k]>145&&d[k]+d[k+1]>180){const px=BRAND.left+x/c.width*BRAND.width,py=BRAND.top+y/c.height*BRAND.height;pts.push(new T.Vector3((px-540)/pxPerUnit,(960-py)/pxPerUnit,0));}}
  return pts;
 },[brand]);
 const u=t-27,merge=io((t-32.6)/1.7),visible=enter(t,27.25,.65)*exit(t,32.65,1.3);
 useLayoutEffect(()=>{
  state.mixer.setTime(Math.min(5.6,Math.max(0,u)));state.scene.scale.setScalar(1.08);state.scene.updateMatrixWorld(true);
  state.fade.value=1-visible;state.heat.value=.16+Math.exp(-(((u-1.6)/.16)**2))*.8+Math.exp(-(((u-2.36)/.16)**2))*.8;
  if(state.skins.length){
   state.skins.forEach(s=>s.skeleton.update());const total=state.skins.reduce((a,s)=>a+s.geometry.attributes.position.count,0);
   const arr=state.geom.attributes.position as T.BufferAttribute;
   for(let i=0;i<state.count;i++){
    let ix=Math.floor(rand(i+10)*total),skin=state.skins[0];
    for(const s of state.skins){skin=s;const n=s.geometry.attributes.position.count;if(ix<n)break;ix-=n;}
    const p=new T.Vector3().fromBufferAttribute(skin.geometry.attributes.position,ix);skin.applyBoneTransform(ix,p);p.applyMatrix4(skin.matrixWorld);
    const target=targets[Math.floor(rand(i+200)*targets.length)];
    if(merge>0){p.lerp(target,merge);p.x+=Math.sin(merge*Math.PI)*Math.sin(i*2.4+merge*7)*.45;p.y+=Math.sin(merge*Math.PI)*.35;p.z+=Math.sin(merge*Math.PI)*(rand(i)*2-1);}
    else if(u<.65){const gather=io(u/.65),a=rand(i)*Math.PI*2;const start=new T.Vector3(Math.sin(a)*4.5,-3+rand(i+2)*2,Math.cos(a)*2);p.lerp(start,1-gather);}
    else{const q=(u*.7+rand(i))%1;p.x+=(rand(i+1)-.5)*q*.30;p.y-=q*.35;p.z+=(rand(i+2)-.5)*.20;}
    arr.setXYZ(i,p.x,p.y,p.z);
   }arr.needsUpdate=true;state.geom.computeBoundingSphere();
  }
 },[state,u,merge,visible,targets]);
 const beat=Math.exp(-(((u-1.6)/.13)**2))+Math.exp(-(((u-2.36)/.13)**2));
 return <><primitive object={state.scene}/>
  <points geometry={state.geom}><pointsMaterial color="#ffa443" vertexColors size={merge>0?.038:.020+beat*.020} transparent opacity={t>32.6?exit(t,34.15,.65):enter(t,27,.6)*.5} blending={T.AdditiveBlending} depthWrite={false} sizeAttenuation/></points>
  <pointLight position={[0,.2,.5]} color="#ff7020" intensity={1.2+beat*4} distance={3}/>
 </>;
}
export function Hero({t}:{t:number}){
 if(t<27||t>34.85)return null;
 return <div style={{position:'absolute',inset:0,opacity:exit(t,34.3,.55)}}>
  <ThreeCanvas shadows="percentage" width={1080} height={1920} camera={{position:[0,0,17],fov:48}} gl={{alpha:true,antialias:true,preserveDrawingBuffer:true}} dpr={1}>
   <Light/><Creature t={t}/>
  </ThreeCanvas>
 </div>;
}
