import {bundle} from '@remotion/bundler';
import {selectComposition, renderMedia, renderStill} from '@remotion/renderer';
import {mkdir,writeFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const isStills=process.argv.includes('--stills');
const identProof=process.argv.includes('--ident-proof');
const draft=process.argv.includes('--draft')||identProof;
const probe=process.argv.includes('--probe');
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':null);
const chromiumOptions={enableMultiProcessOnLinux:true,gl:'swangle'};
await mkdir(path.join(root,'out'),{recursive:true});
console.log('Bundling editable Remotion composition…');
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const common={serveUrl,browserExecutable,chromiumOptions,timeoutInMilliseconds:120000,
  onBrowserLog:(log)=>{if(log.type==='error')console.error(log.text);}};
const composition=await selectComposition({...common,id:'FenixPhoenix'});
if(isStills){
  const times=process.env.STILL_TIMES?process.env.STILL_TIMES.split(',').map(Number):[3,8.4,16.5,22,30,35.9,38.7,41,43.6,45.2,46.5,48,49.8,51.4,52.4,53.1,54.8,58.5];
  for(const s of times){
    console.log('Still:',s);
    await renderStill({...common,composition,frame:Math.min(composition.durationInFrames-1,Math.round(s*composition.fps)),imageFormat:'png',scale:.5,
      output:path.join(root,`out/still-${s.toFixed(2)}.png`)});
  }
}else{
  if(!draft&&!probe){
    // Keep vector maps on Chromium's normal compositor. WebGL scenes use
    // SwiftShader explicitly so the project renders on CPU-only cloud hosts.
    const segments=[[0,1079,false],[1080,3197,true],[3198,3599,false]];
    const files=[];
    for(let i=0;i<segments.length;i++){
      const [start,end,webgl]=segments[i];const dest=path.join(root,`out/segment-${i}.mp4`);files.push(dest);
      if(i<Number(process.env.RESUME_SEGMENT||0)&&existsSync(dest)){console.log(`Reusing completed segment ${i+1}`);continue;}
      let last=-1;console.log(`Segment ${i+1}/3: frames ${start}–${end}`);
      await renderMedia({...common,chromiumOptions:webgl?chromiumOptions:{enableMultiProcessOnLinux:true},
        composition,codec:'h264',pixelFormat:'yuv420p',muted:true,outputLocation:dest,
        scale:1,crf:17,x264Preset:'medium',concurrency:3,imageFormat:'png',
        frameRange:[Number(start),Number(end)],
        onProgress:({progress,renderedFrames})=>{const p=Math.floor(progress*100);if(p!==last&&p%5===0){last=p;console.log(`Segment ${i+1}: ${p}% (${renderedFrames} frames)`);}}});
    }
    const concat=path.join(root,'out/concat.txt');
    await writeFile(concat,files.map(f=>`file '${f}'`).join('\n')+'\n');
    const final=path.join(root,'../FENIX13_CINEMATIC_V7_60S_60FPS.mp4');
    execFileSync('ffmpeg',['-y','-v','error','-f','concat','-safe','0','-i',concat,
      '-i',path.join(root,'public/audio/FENIX_ORIGINAL_MASTER.wav'),'-map','0:v','-map','1:a',
      '-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-t','60','-movflags','+faststart',final]);
    console.log('Finished:',final);process.exit(0);
  }
  const outputLocation=path.join(root,identProof?'out/IDENT_PROOF.mp4':probe?'out/PROBE.mp4':draft?'out/FENIX13_V7_DRAFT.mp4':'out/FENIX13_MASTER_RENDER.mp4');
  let last=-1;
  await renderMedia({...common,composition,codec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'320k',
    sampleRate:48000,outputLocation,scale:draft?.5:1,crf:draft?24:17,x264Preset:'medium',
    concurrency:3,imageFormat:'png',jpegQuality:100,everyNthFrame:draft?2:1,
    frameRange:identProof?[2520,3239]:probe?[2700,2729]:undefined,muted:probe,
    onProgress:({progress,renderedFrames,encodedFrames})=>{
      const p=Math.floor(progress*100);if(p!==last&&p%5===0){last=p;console.log(`${p}% — frames rendered ${renderedFrames}, encoded ${encodedFrames}`);}
    }});
  if(!draft&&!probe){
    const final=path.join(root,'../FENIX13_CINEMATIC_V7_60S_60FPS.mp4');
    // Encode directly from the original WAV, rather than re-encoding the draft's
    // AAC. This also writes an exact 60.000-second AAC presentation timeline.
    execFileSync('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',outputLocation,
      '-i',path.join(root,'public/audio/FENIX_ORIGINAL_MASTER.wav'),
      '-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k',
      '-ar','48000','-t',String(composition.durationInFrames/composition.fps),'-movflags','+faststart',final]);
    console.log('Finished:',final);
  } else console.log('Finished:',outputLocation);
}
