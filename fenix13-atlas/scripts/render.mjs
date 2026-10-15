import {bundle} from '@remotion/bundler';
import {selectComposition, renderMedia, renderStill} from '@remotion/renderer';
import {mkdir} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const isStills=process.argv.includes('--stills');
const draft=process.argv.includes('--draft');
const probe=process.argv.includes('--probe');
const browserExecutable=process.env.REMOTION_BROWSER_EXECUTABLE||(existsSync('/usr/bin/chromium')?'/usr/bin/chromium':null);
const chromiumOptions={enableMultiProcessOnLinux:true};
await mkdir(path.join(root,'out'),{recursive:true});
console.log('Bundling editable Remotion composition…');
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public')});
const common={serveUrl,browserExecutable,chromiumOptions,timeoutInMilliseconds:120000,
  onBrowserLog:(log)=>{if(log.type==='error')console.error(log.text);}};
const composition=await selectComposition({...common,id:'FenixAtlas'});
if(isStills){
  const times=process.env.STILL_TIMES?process.env.STILL_TIMES.split(',').map(Number):[1.8,3.5,5.8,7.3,9,10.8,13.6,17.5,20.9,22.1,23.4,24.8,26.5,29,31.9];
  for(const s of times){
    console.log('Still:',s);
    await renderStill({...common,composition,frame:Math.min(composition.durationInFrames-1,Math.round(s*composition.fps)),imageFormat:'png',scale:.5,
      output:path.join(root,`out/still-${s.toFixed(2)}.png`)});
  }
}else{
  const outputLocation=path.join(root,probe?'out/PROBE.mp4':draft?'out/FENIX13_V5_DRAFT.mp4':'out/FENIX13_MASTER_RENDER.mp4');
  let last=-1;
  await renderMedia({...common,composition,codec:'h264',pixelFormat:'yuv420p',audioCodec:'aac',audioBitrate:'320k',
    sampleRate:48000,outputLocation,scale:draft?.5:1,crf:draft?24:17,x264Preset:'medium',
    concurrency:3,imageFormat:'png',jpegQuality:100,everyNthFrame:draft?2:1,
    frameRange:probe?[180,209]:undefined,muted:probe,
    onProgress:({progress,renderedFrames,encodedFrames})=>{
      const p=Math.floor(progress*100);if(p!==last&&p%5===0){last=p;console.log(`${p}% — frames rendered ${renderedFrames}, encoded ${encodedFrames}`);}
    }});
  if(!draft&&!probe){
    const final=path.join(root,'../FENIX13_CHILL_GRILL_V5_60FPS.mp4');
    // Encode directly from the original WAV, rather than re-encoding the draft's
    // AAC. This also writes an exact 32.000-second AAC presentation timeline.
    execFileSync('ffmpeg',['-y','-hide_banner','-loglevel','error','-i',outputLocation,
      '-i',path.join(root,'public/audio/FENIX_ORIGINAL_MASTER.wav'),
      '-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','320k',
      '-ar','48000','-t',String(composition.durationInFrames/composition.fps),'-movflags','+faststart',final]);
    console.log('Finished:',final);
  } else console.log('Finished:',outputLocation);
}
