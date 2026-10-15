/**
 * FENIX /13 · The Arrival
 * Original physical studio ident. No models, photographs, or external textures.
 * Editable real Montserrat outlines -> beveled 3D meshes -> copper light assembly.
 * All states derive from the HyperFrames playhead. No wall-clock animation.
 */
import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader.js';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry.js';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import typeface from './montserrat.typeface.json';

const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const easeOut=v=>1-Math.pow(1-clamp(v),4);
const mix=(a,b,p)=>a+(b-a)*p;

function makeStarTexture(){
  const c=document.createElement('canvas');c.width=128;c.height=128;
  const ctx=c.getContext('2d');
  const g=ctx.createRadialGradient(64,64,0,64,64,64);
  g.addColorStop(0,'rgba(255,250,225,1)');g.addColorStop(.06,'rgba(255,228,172,1)');
  g.addColorStop(.20,'rgba(255,154,57,.6)');g.addColorStop(.48,'rgba(255,107,32,.12)');g.addColorStop(1,'rgba(255,107,32,0)');
  ctx.fillStyle=g;ctx.fillRect(0,0,128,128);
  ctx.strokeStyle='rgba(255,245,220,.55)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(64,25);ctx.lineTo(64,103);ctx.moveTo(25,64);ctx.lineTo(103,64);ctx.stroke();
  return new THREE.CanvasTexture(c);
}

export function createStage(canvas){
  const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(1);renderer.setSize(1080,1920,false);
  renderer.setClearColor(0x070708,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(35,1080/1920,.1,8000);
  camera.position.set(0,30,2000);camera.lookAt(0,30,0);
  const pmrem=new THREE.PMREMGenerator(renderer);
  const room=new RoomEnvironment(renderer);const env=pmrem.fromScene(room,.03);
  scene.environment=env.texture;room.dispose();pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffedd0,0x24111b,1.7));
  const key=new THREE.DirectionalLight(0xffeed5,3.6);key.position.set(-550,600,800);scene.add(key);
  const rim=new THREE.DirectionalLight(0xff7b31,3.3);rim.position.set(650,400,-500);scene.add(rim);
  const violet=new THREE.DirectionalLight(0x8054e8,.18);violet.position.set(-700,-100,-300);scene.add(violet);
  const traveller=new THREE.PointLight(0xffbe69,90000,1500,2);scene.add(traveller);

  const copper=new THREE.MeshPhysicalMaterial({color:0xe77036,metalness:.82,roughness:.23,clearcoat:.7,clearcoatRoughness:.21,envMapIntensity:1.3});
  const side=new THREE.MeshStandardMaterial({color:0x8e3517,metalness:.87,roughness:.3});
  const lightMat=new THREE.MeshBasicMaterial({color:0xffd396,transparent:true,opacity:.75,depthWrite:false});
  const system=new THREE.Group();scene.add(system);
  const rings=[];
  for(let i=0;i<3;i++){
    const mat=new THREE.MeshBasicMaterial({color:i===1?0x8054e8:0xff943f,transparent:true,opacity:.1,depthWrite:false});
    const mesh=new THREE.Mesh(new THREE.TorusGeometry(230+i*52,i===1?1.2:.8,6,112),mat);
    rings.push(mesh);system.add(mesh);
  }
  const blades=[];
  for(let i=0;i<3;i++){
    const shape=new THREE.Shape();
    shape.moveTo(-13,-150);shape.lineTo(24,-132);shape.lineTo(99,151);shape.lineTo(59,134);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:11,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:2,bevelThickness:2,curveSegments:2});
    const mesh=new THREE.Mesh(geo,[copper,side]);blades.push(mesh);system.add(mesh);
  }

  // Actual Montserrat Black glyph geometry, not a flat texture or a premade logo.
  const font=new FontLoader().parse(typeface);const logo=new THREE.Group();scene.add(logo);
  const letters=[];let advance=0;
  const chars=[...'FENIX/13'];
  chars.forEach((char,i)=>{
    const g=new TextGeometry(char,{font,size:110,height:20,curveSegments:7,bevelEnabled:true,bevelThickness:1.1,bevelSize:.55,bevelSegments:3,steps:1});
    g.computeBoundingBox();const bounds=g.boundingBox;
    const width=bounds.max.x-bounds.min.x;
    g.translate(-bounds.min.x-width/2,-(bounds.min.y+bounds.max.y)/2,-10);
    const front=new THREE.MeshPhysicalMaterial({
      color:i>=5?0xffb171:0xffecd0,metalness:.65,roughness:.22,clearcoat:.8,
      clearcoatRoughness:.17,envMapIntensity:1.45,emissive:0x160702,emissiveIntensity:.1
    });
    const m=new THREE.Mesh(g,[front,side]);m.userData.finalX=advance+width/2;
    logo.add(m);letters.push(m);
    advance+=typeface.glyphs[char].ha/typeface.resolution*110-6.5;
    if(i===4)advance+=12;
  });
  const minX=letters[0].userData.finalX-letters[0].geometry.boundingBox.getSize(new THREE.Vector3()).x/2;
  const last=letters[letters.length-1];
  const maxX=last.userData.finalX+last.geometry.boundingBox.getSize(new THREE.Vector3()).x/2;
  const center=(minX+maxX)/2;
  letters.forEach(m=>m.userData.finalX-=center);
  const wordScale=540/(maxX-minX);logo.scale.setScalar(wordScale);logo.position.y=75;
  const reflected=new THREE.Group();scene.add(reflected);reflected.scale.set(wordScale,-wordScale,wordScale);
  reflected.position.y=-65;
  const reflections=letters.map(m=>{
    const mat=new THREE.MeshBasicMaterial({color:0x9a5936,transparent:true,opacity:.075,depthWrite:false});
    const r=new THREE.Mesh(m.geometry,mat);reflected.add(r);return r;
  });

  // One light travels a 3D arch and lands at the actual slash in the wordmark.
  const endX=letters[5].userData.finalX*wordScale;
  const arc=new THREE.CatmullRomCurve3([
    new THREE.Vector3(-360,100,20),new THREE.Vector3(-300,350,-55),
    new THREE.Vector3(-40,425,-140),new THREE.Vector3(305,290,-50),
    new THREE.Vector3(endX,75+40*wordScale,45)
  ]);
  const arch=new THREE.Group();scene.add(arch);
  const tubes=[];
  [1.15,3.8,9].forEach((r,i)=>{
    const mat=lightMat.clone();mat.opacity=[.85,.10,.025][i];
    const geo=new THREE.TubeGeometry(arc,150,r,5,false);
    const mesh=new THREE.Mesh(geo,mat);mesh.userData.alpha=mat.opacity;arch.add(mesh);tubes.push(mesh);
  });
  const starTexture=makeStarTexture();
  const comet=new THREE.Sprite(new THREE.SpriteMaterial({map:starTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
  comet.scale.set(56,56,1);scene.add(comet);
  const gleams=[];
  for(let i=0;i<5;i++){
    const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:starTexture,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));
    scene.add(sprite);gleams.push(sprite);
  }

  function update(t){
    const final=t>=14.9;
    const pull=smooth((t-15.05)/2.12);
    camera.position.set(final?mix(-125,0,pull):Math.sin(t*.19)*22,
      final?mix(90,30,pull):30+Math.sin(t*.23)*14,final?mix(1200,2000,pull):2000);
    camera.lookAt(final?mix(-105,0,pull):0,final?mix(60,30,pull):30,0);
    system.visible=!final;
    if(system.visible){
      system.position.set(180+Math.sin(t*.22)*55,230,-320);
      system.rotation.set(.2+Math.sin(t*.18)*.18,t*.10,-.22);
      const build=smooth((t-.25)/2.3);
      rings.forEach((m,i)=>{
        m.rotation.set(.35+i*.72,t*.12+i*.6,.28+i*.18);
        m.geometry.setDrawRange(0,Math.floor(build*m.geometry.index.count/6)*6);
        m.material.opacity=.08+(i===1?.025:.03)*Math.sin(t*.4+i)**2;
      });
      blades.forEach((m,i)=>{
        const a=i*2.094+t*.09;m.position.set(Math.cos(a)*220,Math.sin(a)*200,-130);
        m.rotation.set(.12+Math.sin(a)*.24,t*.16+i*.4,.5+i*.3);
        m.scale.setScalar(t<3?.12:.35+Math.sin(t*.3+i)*.04);
        m.visible=t>2.75;
      });
    }
    logo.visible=final;reflected.visible=final;
    letters.forEach((m,i)=>{
      const u=easeOut((t-(15.03+i*.105))/.95);
      m.visible=final&&t>=15.03+i*.105;
      m.position.set(m.userData.finalX+(i-3.5)*100*(1-u),Math.sin(i*1.6)*230*(1-u),(i%2===0?1:-1)*330*(1-u));
      m.rotation.set((1-u)*.8,(1-u)*(i%2===0?1:-1)*1.65,(1-u)*(i-3.5)*.12);
      m.material[0].emissiveIntensity=.06+.16*(1-u);
      reflections[i].visible=m.visible;reflections[i].position.copy(m.position);
      reflections[i].rotation.copy(m.rotation);
      reflections[i].material.opacity=.023*smooth((t-16.65)/.7);
    });
    const arcP=clamp((t-15.10)/1.58);
    arch.visible=final&&arcP>0;const archAlpha=1-.76*smooth((t-17.25)/.85);
    tubes.forEach(m=>{m.geometry.setDrawRange(0,Math.floor(arcP*m.geometry.index.count/6)*6);m.material.opacity=m.userData.alpha*archAlpha;});
    comet.visible=final&&t<17.30;
    if(final){
      const v=arc.getPointAt(arcP);comet.position.copy(v);
      comet.material.opacity=(1-smooth((t-16.9)/.4));
      comet.scale.setScalar(34+32*Math.sin(arcP*Math.PI)**2);
      traveller.position.copy(v);traveller.intensity=90000*(1-smooth((t-17.1)/1.));
    }else{
      comet.visible=t>.17&&t<1.8;
      const a=t*1.6;comet.position.set(Math.sin(a)*28,80+Math.cos(a)*25,0);
      comet.scale.setScalar(25*(1-smooth((t-1.05)/.75)));comet.material.opacity=1;
      traveller.position.set(0,100,350);traveller.intensity=35000;
    }
    gleams.forEach((s,i)=>{
      const dt=t-(16.60+i*.16);const envelope=Math.sin(clamp(dt/.5)*Math.PI);
      s.visible=dt>0&&dt<.5;
      s.position.set(letters[i+1].userData.finalX*wordScale,75+(i%2?33:-28),35);
      s.scale.set(26*envelope,26*envelope,1);s.material.opacity=.65*envelope;
    });
    renderer.render(scene,camera);
  }
  update(0);
  return {update,dispose:()=>{renderer.dispose();env.dispose();starTexture.dispose();}};
}

window.FENIX_STUDIO={createStage};
