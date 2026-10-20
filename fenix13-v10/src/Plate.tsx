import React,{useMemo} from 'react';
import {ThreeCanvas} from '@remotion/three';
import {useLoader} from '@react-three/fiber';
import {staticFile} from 'remotion';
import * as T from 'three';
export type PlateKind='charcoal'|'chill'|'grill'|'food'|'company'|'night';
export const plates:Record<PlateKind,string>={charcoal:'charcoal-v10.png',chill:'chill-v10.png',grill:'grill.png',food:'food.png',company:'company-v10.png',night:'night-v10.png'};
const vert=`varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
const frag=`precision highp float;varying vec2 vUv;uniform sampler2D photo;uniform float time;uniform float progress;uniform float mode;uniform float closeup;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){return noise(p)*.57+noise(p*2.03)*.28+noise(p*4.1)*.15;}
void main(){
 vec2 uv=vUv;float depth=smoothstep(.9,.1,uv.y);float zoom=1.025+progress*.055+closeup;
 uv=(uv-vec2(.5,.43))/zoom+vec2(.5,.43);uv.x+=sin(progress*1.2)*.012*depth;uv.y-=progress*.009;
 float heat=exp(-pow((uv.y-.48)*7.,2.));
 if(mode<.5||abs(mode-2.)<.1){uv.x+=sin(uv.y*92.+time*3.)*.0018*heat;uv.y+=sin(uv.x*44.-time*2.)*.0012*heat;}
 if(abs(mode-1.)<.1){float liquid=exp(-pow((uv.y-.39)*9.,2.))*smoothstep(.1,.2,uv.x)*smoothstep(.83,.75,uv.x);uv.x+=sin(uv.y*72.+time*1.8)*.0014*liquid;uv.y+=sin(uv.x*40.+time*2.1)*.001*liquid;}
 vec3 col=texture2D(photo,uv).rgb;
 // Warm low-amplitude practical-light response, not a global exposure flicker.
 float warm=max(0.,col.r-col.b)*smoothstep(.25,.85,col.r);
 float pulse=(sin(time*2.3)+sin(time*5.17)*.35)*.016;
 col+=vec3(1.,.35,.06)*warm*pulse;
 if(mode<.5){float energy=smoothstep(.20,.65,col.r-col.b);col+=vec3(.055,.014,0.)*energy*(.5+.5*sin(time*3.8+uv.x*12.));}
 // Slowly moving vapor is independent from the camera and image.
 if(abs(mode-2.)<.1||abs(mode-3.)<.1||abs(mode-4.)<.1||mode<.5){
  float cx=mode<.5?.45:.52;float steamZone=exp(-pow((uv.x-cx)*5.,2.))*smoothstep(.27,.43,uv.y)*smoothstep(.81,.50,uv.y);
  float n=fbm(vec2(uv.x*13.+sin(uv.y*8.+time*.45)*.65,uv.y*23.-time*.42));
  float strand=smoothstep(.54,.70,n)*steamZone;
  col+=vec3(.13,.115,.094)*strand;
 }
 if(abs(mode-1.)<.1){
  // Fine moving bubble glints in the far glass, and a drifting specular caustic.
  for(int i=0;i<12;i++){float k=float(i);vec2 p=vec2(.84+hash(vec2(k,2.))*.13,.23+fract(time*.035+hash(vec2(k,3.)))*.52);float r=length((uv-p)*vec2(1.,.5625));col+=vec3(1.,.69,.31)*exp(-r*r/0.000003)*.21;}
  float caustic=exp(-pow((uv.x-.42-sin(time*.5)*.065)*65.,2.))*exp(-pow((uv.y-.23)*13.,2.));col+=vec3(.12,.09,.04)*caustic;
 }
 if(mode<.5||abs(mode-2.)<.1){
  for(int i=0;i<14;i++){float k=float(i);float q=fract(time*.18+hash(vec2(k,1.)));vec2 p=vec2(.12+hash(vec2(k,4.))*.78+sin(q*5.+k)*.025,.30+q*.48);float d=length((vUv-p)*vec2(1.,.5625));float spark=exp(-d*d/(.000002+hash(vec2(k,6.))*.000002))*sin(q*3.14159);col+=vec3(1.,.4,.05)*spark*.45;}
 }
 // Consistent charcoal black and a gentle highlight roll-off.
 float vignette=1.-.21*pow(length((vUv-.5)*vec2(.9,.65)),1.6);col*=vignette;
 col*=1.-smoothstep(.66,1.,vUv.y)*.62;
 gl_FragColor=vec4(col,1.);
}`;
function Surface({kind,t,progress,closeup}:{kind:PlateKind;t:number;progress:number;closeup:number}){
 const texture=useLoader(T.TextureLoader,staticFile('art/'+plates[kind]));texture.colorSpace=T.NoColorSpace;
 const mat=useMemo(()=>new T.ShaderMaterial({vertexShader:vert,fragmentShader:frag,uniforms:{photo:{value:texture},time:{value:t},progress:{value:progress},mode:{value:['charcoal','chill','grill','food','company','night'].indexOf(kind)},closeup:{value:closeup}},depthTest:false,depthWrite:false}),[texture,kind]);
 mat.uniforms.time.value=t;mat.uniforms.progress.value=progress;mat.uniforms.closeup.value=closeup;
 return <mesh material={mat}><planeGeometry args={[2,2]}/></mesh>;
}
export function Plate({kind,t,progress=0,closeup=0}:{kind:PlateKind;t:number;progress?:number;closeup?:number}){
 return <ThreeCanvas width={1080} height={1920} camera={{position:[0,0,1]}} gl={{alpha:false,antialias:false,preserveDrawingBuffer:true}} dpr={1} style={{position:'absolute',inset:0}}>
  <Surface kind={kind} t={t} progress={progress} closeup={closeup}/>
 </ThreeCanvas>;
}
