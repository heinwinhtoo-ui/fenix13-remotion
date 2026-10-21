import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {mkdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),stills=process.argv.includes('--stills'),draft=process.argv.includes('--draft'),ending=process.argv.includes('--ending');
await mkdir(path.join(root,'out'),{recursive:true});
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||'/usr/bin/chromium';
console.log('Bundling V12…');
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const common={serveUrl,browserExecutable,timeoutInMilliseconds:120000,chromiumOptions:{enableMultiProcessOnLinux:true,gl:'swangle'}};
const composition=await selectComposition({...common,id:'FenixDimensional'});
if(stills){
 const times=(process.env.STILL_TIMES||'5.5,8.3,15.5,17,19,34.5,35.5,36.5,38,41').split(',').map(Number);
 for(const t of times){console.log('Still',t);await renderStill({...common,composition,frame:Math.round(t*30),imageFormat:'png',scale:Number(process.env.STILL_SCALE||.5),output:path.join(root,`out/still-${t.toFixed(2)}.png`)});}
 process.exit(0);
}
if(draft||ending){
 let last=-1;const dest=path.join(root,ending?'out/V12_ENDING_PREVIEW.mp4':'out/V12_WORKING_PREVIEW.mp4');
 await renderMedia({...common,composition,...(ending?{frameRange:[1020,1259]}:{}),codec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'256k',scale:.5,crf:21,x264Preset:'medium',concurrency:3,imageFormat:'png',outputLocation:dest,onProgress:({progress})=>{const p=Math.floor(progress*100);if(p!==last&&p%10===0){last=p;console.log(p+'%');}}});console.log('Finished:',dest);process.exit(0);
}
const segments=[[0,119,true],[120,269,true],[270,419,true],[420,599,true],[600,749,true],[750,899,true],[900,1019,true],[1020,1259,true]];
const files=[];
for(let i=0;i<segments.length;i++){
 const [start,end,webgl]=segments[i],dest=path.join(root,`out/segment-${i}.mp4`);files.push(dest);
 if((process.env.RENDER_SEGMENT!==undefined&&i!==Number(process.env.RENDER_SEGMENT)||i<Number(process.env.RESUME_SEGMENT||0))&&existsSync(dest)){console.log('Reusing',i);continue;}
 console.log(`Scene ${i+1}/${segments.length}, frames ${start}-${end}`);
 // The map needs WebGL only while the preceding charcoal scene dissolves out.
 const ranges=i===1?[[120,139,true],[140,269,false]]:[[start,end,webgl]];
 const parts=[];
 for(let j=0;j<ranges.length;j++){
  const [first,lastFrame,useGL]=ranges[j],part=ranges.length===1?dest:path.join(root,`out/segment-${i}-part-${j}.mp4`);parts.push(part);
  let last=-1;
  await renderMedia({...common,chromiumOptions:useGL?common.chromiumOptions:{enableMultiProcessOnLinux:true},composition,codec:'h264',pixelFormat:'yuv420p',muted:true,scale:1,crf:17,x264Preset:'medium',concurrency:3,imageFormat:'png',frameRange:[Number(first),Number(lastFrame)],outputLocation:part,onProgress:({progress})=>{const p=Math.floor(progress*100);if(p!==last&&p%10===0){last=p;console.log(`Scene ${i+1}.${j+1}: ${p}%`);}}});
 }
 if(parts.length>1){
  const list=path.join(root,`out/segment-${i}-parts.txt`);await writeFile(list,parts.map((p,j)=>`file '${p}'\nduration ${((Number(ranges[j][1])-Number(ranges[j][0])+1)/30).toFixed(9)}`).join('\n')+'\n');
  execFileSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',list,'-c','copy',dest]);
 }

}
const list=path.join(root,'out/concat.txt');await writeFile(list,files.map(f=>`file '${f}'`).join('\n')+'\n');
const final=path.join(root,'../FENIX13_V12_FINAL_42S.mp4');
execFileSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',list,'-i',path.join(root,'public/audio/FENIX_ORIGINAL_MASTER.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-t','42','-movflags','+faststart',final]);
console.log('Finished:',final);
