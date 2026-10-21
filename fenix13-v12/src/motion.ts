export const clamp = (v:number, lo=0, hi=1) => Math.min(hi,Math.max(lo,v));
export const ease = (v:number) => { const t=clamp(v); return t*t*(3-2*t); };
export const out = (v:number) => 1-Math.pow(1-clamp(v),4);
export const io = (v:number) => {const t=clamp(v);return t<.5?8*t**4:1-(-2*t+2)**4/2;};
export const mix = (a:number,b:number,t:number) => a+(b-a)*t;
export const enter = (t:number,at:number,len=.7) => out((t-at)/len);
export const exit = (t:number,at:number,len=.4) => 1-io((t-at)/len);
export const palette = {ink:'#070706',paper:'#fff1dc',orange:'#ff5816',copper:'#c47d40',violet:'#7256c8'};
