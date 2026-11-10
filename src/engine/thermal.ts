import type {Segment} from './txcraig';
/** Newtonian lumped thermal model; tau values are unmeasured hypotheses, NOT measured physical constants. */
export const thermalAssumptions={coolingTauHours:2,warmingTauHours:1.5,stepHours:1/12};
export function thermalSegments(initial:number,cold:number,final:number,room:number,fridge:number,startTemp=room){
 const segments:Segment[]=[];let current=startTemp;
 for(const [duration,target,tau] of [[initial,room,thermalAssumptions.warmingTauHours],[cold,fridge,thermalAssumptions.coolingTauHours],[final,room,thermalAssumptions.warmingTauHours]]){
  if(duration<0)throw Error('Negative duration');const n=Math.max(1,Math.ceil(duration/thermalAssumptions.stepHours)),h=duration/n;
  for(let i=0;i<n;i++){const mid=target+(current-target)*Math.exp(-h/(2*tau));segments.push({hours:h,temp:mid});current=target+(current-target)*Math.exp(-h/tau);}
 }
 return segments;
}
