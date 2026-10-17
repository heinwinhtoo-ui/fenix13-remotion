import React from 'react';
import {AbsoluteFill} from 'remotion';
import {geoDistance,geoGraticule,geoGraticule10,geoMercator,geoOrthographic,geoPath} from 'd3-geo';
import data from './geodata.json';
import {clamp,ease,enter,exit,io,mix,palette as P} from './motion';

const city=data.taunggyi as [number,number];
const geo=data as any;
const mono='"Space",monospace';
const Label:React.FC<React.PropsWithChildren<{x:number;y:number;size?:number;color?:string;opacity?:number}>>=
({x,y,size=23,color=P.paper,opacity=1,children})=><text x={x} y={y} fill={color} fontFamily={mono} fontSize={size}
  letterSpacing="3" opacity={opacity}>{children}</text>;

function Locator({x,y,t,scale=1}:{x:number;y:number;t:number;scale?:number}){
  const phase=(t*.65)%1;
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <circle r={18+phase*52} fill="none" stroke={P.orange} strokeWidth="1.3" opacity={(1-phase)*.6}/>
    <circle r="20" fill="#ff561217" stroke={P.orange} strokeWidth="1"/>
    <path d="M0-14Q3-3 14 0Q3 3 0 14Q-3 3-14 0Q-3-3 0-14" fill={P.orange}/>
    <circle r="3" fill={P.paper}/>
  </g>;
}

function Globe({t}:{t:number}){
  const spin=io(clamp(t/4.4));
  const lon=mix(15,97.038,spin),lat=mix(8,20.782,spin);
  const zoom=io((t-4.1)/1.45);
  const r=mix(427,2150,zoom);
  const projection=geoOrthographic().rotate([-lon,-lat,mix(-13,0,spin)]).translate([540,1080]).scale(r).precision(.45);
  const path=geoPath(projection);
  const point=projection(city)!;
  const visible=geoDistance([lon,lat],city)<Math.PI/2;
  const opacity=exit(t,5.02,.55);
  return <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity}}>
    <defs>
      <radialGradient id="planet" cx="28%" cy="22%" r="82%"><stop stopColor="#5b3821"/><stop offset=".5" stopColor="#17130d"/><stop offset="1" stopColor="#040605"/></radialGradient>
      <radialGradient id="aura"><stop offset=".77" stopColor="#ff8625" stopOpacity="0"/><stop offset=".88" stopColor="#e5671c" stopOpacity=".2"/><stop offset=".94" stopColor="#ffba72" stopOpacity=".06"/><stop offset="1" stopColor="#e5671c" stopOpacity="0"/></radialGradient>
      <radialGradient id="night" cx="24%" cy="28%" r="80%"><stop offset=".22" stopColor="#000" stopOpacity="0"/><stop offset=".69" stopColor="#000" stopOpacity=".2"/><stop offset="1" stopColor="#000" stopOpacity=".95"/></radialGradient>
    </defs>
    {Array.from({length:35},(_,i)=><circle key={i} cx={(i*263+43)%1080} cy={(i*397+117)%1920} r={i%4?1:1.8}
      fill="#ead1a5" opacity={.1+(i%5)*.045}/>)}
    <circle cx="540" cy="1080" r={r*1.12} fill="url(#aura)"/>
    <path d={path({type:'Sphere'})!} fill="url(#planet)" stroke="#c98a4c" strokeWidth="1.5"/>
    {geo.world.map((f:any,i:number)=><path key={i} d={path(f)||''} fill={f.properties.ADMIN==='Myanmar'?'#d38438':'#45331c'}
      stroke={f.properties.ADMIN==='Myanmar'?'#ffe2aa':'#c18c56'} strokeWidth={f.properties.ADMIN==='Myanmar'?1.9:.6}
      strokeOpacity={.64}/>)}
    <path d={path(geoGraticule10())!} fill="none" stroke="#c9955c" strokeWidth=".7" opacity=".32"/>
    <path d={path({type:'Sphere'})!} fill="url(#night)"/>
    <ellipse cx="540" cy="1080" rx={r*1.18} ry={r*.18} transform="rotate(-24 540 1080)" fill="none"
      stroke="#d8944a" strokeWidth="1" strokeDasharray="95 9 1 12" opacity=".48"/>
    {visible&&t>2.6&&<g opacity={enter(t,2.6,.8)}><Locator x={point[0]} y={point[1]} t={t}/></g>}
    <Label x={92} y={1596} size={20} color="#be9b71" opacity={exit(t,4,.3)}>EARTH / SOUTHEAST ASIA</Label>
    <Label x={92} y={1633} size={18} color="#80684d" opacity={exit(t,4,.3)}>A NEW NIGHT IS ON THE HORIZON.</Label>
  </svg>;
}

function Myanmar({t}:{t:number}){
  const zoom=io((t-7.8)/3.5);
  const projection=geoMercator().center([mix(96.2,city[0],zoom),mix(19.6,city[1],zoom)])
    .translate([540,mix(1105,1005,zoom)]).scale(2600*Math.pow(40000/2600,zoom)).precision(.3);
  const path=geoPath(projection);
  const p=projection(city)!;
  const regional=enter(t,9,.7);
  const dim=ease((zoom-.1)/.7);
  const shanColor=`rgb(${Math.round(mix(142,33,dim))},${Math.round(mix(83,24,dim))},${Math.round(mix(34,14,dim))})`;
  return <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:enter(t,5,.5)}}>
    <defs>
      <linearGradient id="land" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#422b16"/><stop offset="1" stopColor="#16130e"/></linearGradient>
      <linearGradient id="shan" x1="0" x2="1"><stop stopColor="#b25d22" stopOpacity=".7"/><stop offset="1" stopColor="#422917" stopOpacity=".7"/></linearGradient>
      <radialGradient id="mapSpot"><stop stopColor="#bd6b2c" stopOpacity=".13"/><stop offset="1" stopOpacity="0"/></radialGradient>
      <clipPath id="mapView"><rect x="0" y="600" width="1080" height="930" rx="0"/></clipPath>
      <clipPath id="insideCountry"><path d={path(geo.myanmar)||''}/></clipPath>
    </defs>
    <g clipPath="url(#mapView)">
      <circle cx="540" cy="1050" r="620" fill="url(#mapSpot)"/>
      <path d={path(geoGraticule10())!} fill="none" stroke="#aa7d45" strokeWidth=".65" opacity=".2"/>
      <path d={path(geo.myanmar)||''} fill="#17130d" stroke="#c89255" strokeWidth={1.5+zoom}/>
      {geo.states.map((f:any,i:number)=><path key={i} d={path(f)||''} fill={f.properties.name==='Shan'?shanColor:'none'}
        stroke="#af783e" strokeWidth={.8+zoom*.2} strokeOpacity=".65"/>)}
      <g opacity={regional}>
        <path d={path(geoGraticule().extent([[95,19],[99,23]]).step([.2,.2])())||''} fill="none"
          stroke="#a77e45" strokeWidth=".7" opacity=".22"/>
        {/* Real generalized regional roads. Deliberately no invented street grid. */}
        {geo.roads.map((f:any,i:number)=><path key={i} d={path(f)||''} fill="none" stroke={i%3?'#ba8d56':'#ffc47f'}
          strokeWidth={i%3?1.6:2.6} strokeOpacity={i%3?.5:.8} strokeLinecap="round"/>)}
        {geo.lakes.map((f:any,i:number)=><path key={i} d={path(f)||''} fill="#19393b" stroke="#839c88" strokeWidth="1"/>)}
      </g>
      <path d={path(geo.myanmar)||''} fill="none" stroke="#ffd2a1" strokeWidth="2.4" pathLength="1"
        strokeDasharray={`${enter(t,5.15,1.6)} 1`} opacity={exit(t,8.2,.5)}/>
      <g opacity={enter(t,6.6,.7)}><Locator x={p[0]} y={p[1]} t={t}/>
        <path d={`M${p[0]+24},${p[1]-2}h65l32,-43h160`} fill="none" stroke="#d79955" strokeWidth="1.1"/>
        <Label x={p[0]+127} y={p[1]-58} size={t<8?22:27} color={P.paper}>TAUNGGYI</Label>
      </g>
    </g>
    {t>9&&<g opacity={regional}>
      <path d="M90 1320V1420H990V1320" fill="none" stroke="#ba845233"/>
      <Label x={90} y={1510} size={20} color="#caaa80">SHAN HIGHLANDS / CITY LOCATOR</Label>
      <Label x={90} y={1555} size={20} color={P.orange}>20.782° N — 97.038° E</Label>
    </g>}
    <Label x={90} y={1680} size={16} color="#76654e">MAP DATA: NATURAL EARTH / PUBLIC DOMAIN</Label>
  </svg>;
}

export const Atlas:React.FC<{t:number}>=({t})=><AbsoluteFill style={{overflow:'hidden'}}>
  {t<5.6&&<Globe t={t}/>}
  {t>=5&&<Myanmar t={t}/>}
</AbsoluteFill>;
