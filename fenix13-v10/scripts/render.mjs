import {bundle} from '@remotion/bundler';
import {selectComposition,renderMedia,renderStill} from '@remotion/renderer';
import {mkdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),hero=process.argv.includes('--hero'),stills=process.argv.includes('--stills'),draft=process.argv.includes('--draft');
await mkdir(path.join(root,'out'),{recursive:true});
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||'/usr/bin/chromium';
console.log('Bundling V10…');
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const common={serveUrl,browserExecutable,timeoutInMilliseconds:120000,chromiumOptions:{enableMultiProcessOnLinux:true,gl:'swangle'}};
const composition=await selectComposition({...common,id:hero?'PhoenixHero':'FenixPhoenix'});
if(stills){
 const times=(process.env.STILL_TIMES||'1.5,4.5,7.5,12.8,15,17.8,22,25.5,28.2,28.7,30.6,32.2,33.4,34.4,36.5,39').split(',').map(Number);
 for(const t of times){console.log('Still',t);await renderStill({...common,composition,frame:Math.round(t*30),imageFormat:'png',scale:Number(process.env.STILL_SCALE||.5),output:path.join(root,`out/${hero?'hero-':''}still-${t.toFixed(2)}.png`)});}
 process.exit(0);
}
if(hero||draft){
 let last=-1;const dest=path.join(root,hero?'../FENIX13_V10_PHOENIX_PREVIEW.mp4':'out/V10_WORKING_PREVIEW.mp4');
 await renderMedia({...common,composition,codec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'256k',scale:.5,crf:21,x264Preset:'medium',concurrency:3,imageFormat:'png',outputLocation:dest,onProgress:({progress})=>{const p=Math.floor(progress*100);if(p!==last&&p%10===0){last=p;console.log(p+'%');}}});console.log('Finished:',dest);process.exit(0);
}
const segments=[[0,89,true],[90,179,false],[180,329,true],[330,479,true],[480,599,true],[600,719,true],[720,809,true],[810,1049,true],[1050,1199,false]];
const files=[];
for(let i=0;i<segments.length;i++){
 const [start,end,webgl]=segments[i],dest=path.join(root,`out/segment-${i}.mp4`);files.push(dest);
 if(i<Number(process.env.RESUME_SEGMENT||0)&&existsSync(dest)){console.log('Reusing',i);continue;}
 let last=-1;console.log(`Scene ${i+1}/${segments.length}, frames ${start}-${end}`);
 await renderMedia({...common,chromiumOptions:webgl?common.chromiumOptions:{enableMultiProcessOnLinux:true},composition,codec:'h264',pixelFormat:'yuv420p',muted:true,scale:1,crf:17,x264Preset:'medium',concurrency:3,imageFormat:'png',frameRange:[Number(start),Number(end)],outputLocation:dest,onProgress:({progress})=>{const p=Math.floor(progress*100);if(p!==last&&p%10===0){last=p;console.log(`Scene ${i+1}: ${p}%`);}}});
}
const list=path.join(root,'out/concat.txt');await writeFile(list,files.map(f=>`file '${f}'`).join('\n')+'\n');
const final=path.join(root,'../FENIX13_V10_FINAL_40S.mp4');
execFileSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',list,'-i',path.join(root,'public/audio/FENIX_ORIGINAL_MASTER.wav'),'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-t','40','-movflags','+faststart',final]);
console.log('Finished:',final);
