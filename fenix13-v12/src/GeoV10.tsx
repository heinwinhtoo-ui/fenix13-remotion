import React from 'react';
import {geoOrthographic,geoMercator,geoPath,geoGraticule10} from 'd3-geo';
import d from './geodata.json';
import {clamp,io,mix,enter,exit} from './motion';
const data=d as any,city=d.taunggyi as [number,number];
export function GeoV10({t}:{t:number}){
 const u=t-4,spin=io(u/1.35),zoom=io((u-2.4)/1.5);
 const globe=geoOrthographic().rotate([-mix(55,97.038,spin),-mix(12,20.782,spin)]).translate([540,1080]).scale(mix(440,800,io((u-.9)/.9)));
 const gp=geoPath(globe),country=geoMercator().center([mix(96.2,city[0],zoom),mix(19.6,city[1],zoom)]).translate([540,1080]).scale(2600*Math.pow(40000/2600,zoom)),cp=geoPath(country),pin=country(city)!;
 return <svg width="1080" height="1920" style={{position:'absolute',inset:0}}><defs>
  <radialGradient id="sphere"><stop stopColor="#694326"/><stop offset=".65" stopColor="#271b12"/><stop offset="1" stopColor="#070907"/></radialGradient>
  <radialGradient id="globeShade" cx="25%" cy="25%"><stop stopColor="#000" stopOpacity="0"/><stop offset=".7" stopColor="#000" stopOpacity=".05"/><stop offset="1" stopColor="#000" stopOpacity=".8"/></radialGradient>
  <clipPath id="region"><rect x="0" y="620" width="1080" height="960"/></clipPath>
 </defs>
 <g opacity={exit(u,1.3,.5)}><path d={gp({type:'Sphere'})!} fill="url(#sphere)" stroke="#a87547"/>
  {data.world.map((f:any,i:number)=><path key={i} d={gp(f)||''} fill={f.properties.ADMIN==='Myanmar'?'#f88b35':'#5a422b'} stroke="#ba8c5c" strokeWidth=".7"/>)}
  <path d={gp(geoGraticule10())!} fill="none" stroke="#c3935a" strokeWidth=".7" opacity=".3"/>
  <path d={gp({type:'Sphere'})!} fill="url(#globeShade)"/>
 </g>
 <g opacity={enter(u,1.3,.5)} clipPath="url(#region)"><path d={cp(data.myanmar)||''} fill="#211a13" stroke="#ebbc87" strokeWidth="2"/>
  {data.states.map((f:any,i:number)=><path key={i} d={cp(f)||''} fill={f.properties.name==='Shan'?'#a45a25':'none'} fillOpacity={mix(.75,.08,zoom)} stroke="#b48450" strokeWidth="1"/>)}
  <g opacity={zoom}>{data.roads.map((f:any,i:number)=><path key={i} d={cp(f)||''} fill="none" stroke="#cd9a60" strokeWidth="1.8"/>)}{data.lakes.map((f:any,i:number)=><path key={i} d={cp(f)||''} fill="#233d36"/>)}</g>
  <g opacity={enter(u,1.9,.55)}><circle cx={pin[0]} cy={pin[1]} r={22+((u*.8)%1)*45} fill="none" stroke="#ff782e" opacity={1-((u*.8)%1)}/><circle cx={pin[0]} cy={pin[1]} r="8" fill="#ff7a2c"/><circle cx={pin[0]} cy={pin[1]} r="3" fill="#fff1d7"/></g>
 </g>
 </svg>;
}
