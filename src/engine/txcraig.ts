import {table48,chartGrid} from './data/txcraigTable';
const interp=(x:number,x0:number,y0:number,x1:number,y1:number)=>y0+(x-x0)*(y1-y0)/(x1-x0);
export function anchor48(t:number){
 if(t<table48[0][0]||t>table48[table48.length-1][0])throw Error('TXCraig temperature outside chart range');
 for(let i=0;i<table48.length-1;i++){const [a,ya]=table48[i],[b,yb]=table48[i+1];if(a<=t&&t<=b)return Math.exp(interp(t,a,Math.log(ya),b,Math.log(yb)));}
 return table48[table48.length-1][1];
}
function slope(t:number){
 const row=chartGrid[String(t)],anchor=anchor48(t);
 const points=Object.entries(row).map(([d,h])=>({d:+d,h,dist:Math.abs(Math.log(+d/anchor))})).filter(p=>p.h>=8).sort((a,b)=>a.dist-b.dist).slice(0,5);
 let top=0,bottom=0;for(const p of points){const x=Math.log(p.d/anchor),y=Math.log(p.h/48);top+=x*y;bottom+=x*x;}
 return -top/bottom;
}
function rowHours(t:number,dose:number){
 const entries=Object.entries(chartGrid[String(t)]).map(([d,h])=>[+d,h] as [number,number]);
 entries.push([anchor48(t),48]);
 const points=entries.map(([d,h])=>[Math.log(d),Math.log(h)] as [number,number]).sort((a,b)=>a[0]-b[0]);
 const x=Math.log(dose);
 for(let i=0;i<points.length-1;i++){const [x0,y0]=points[i],[x1,y1]=points[i+1];if(x0<=x&&x<=x1)return Math.exp(interp(x,x0,y0,x1,y1));}
 const [px,py]=x<points[0][0]?points[0]:points[points.length-1];return Math.exp(py-slope(t)*(x-px));
}
/** Piecewise log interpolation, extrapolation outside sampled dose cells; temperatures 1.7-26.7C only. */
export function txHours(temp:number,dosePct:number){
 if(temp<1.7||temp>26.7||dosePct<=0)throw Error('Outside digitized TXCraig chart domain');
 const temps=Object.keys(chartGrid).map(Number).sort((a,b)=>a-b);
 if(temp<=temps[0]||temp>=temps[temps.length-1]){const base=temp<=temps[0]?temps[0]:temps[temps.length-1];return rowHours(base,dosePct*anchor48(base)/anchor48(temp));}
 for(let i=0;i<temps.length-1;i++){const lo=temps[i],hi=temps[i+1];if(lo<=temp&&temp<=hi){const a=Math.log(rowHours(lo,dosePct*anchor48(lo)/anchor48(temp)));const b=Math.log(rowHours(hi,dosePct*anchor48(hi)/anchor48(temp)));return Math.exp(interp(temp,lo,a,hi,b));}}
 throw Error('Unreachable');
}
export type Segment={hours:number;temp:number};
export function txProgress(segments:Segment[],dosePct:number){return segments.reduce((a,s)=>a+s.hours/txHours(s.temp,dosePct),0);}
export function txSolve(segments:Segment[],target:number){let lo=0.00001,hi=10;for(let i=0;i<80;i++){const mid=(lo+hi)/2;if(txProgress(segments,mid)<target)lo=mid;else hi=mid;}return (lo+hi)/2;}
