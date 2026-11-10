import type {Settings} from './types';
import {thermalSegments} from './thermal';
import {calibrationTarget,q10Calibration} from './references';
import {txSolve} from './txcraig';
/** Both algorithms use the same assumed dough temperature curve for fair comparison. */
export function yeastModels(s:Settings,pre:number,cold:number,final:number){
 const segments=thermalSegments(pre,Math.max(0,cold),final,s.roomTemp,s.fridgeTemp);
 const exposure=segments.reduce((a,v)=>a+v.hours*Math.pow(2,(v.temp-22)/10),0);
 const q10FreshRatio=q10Calibration()/Math.max(0.01,exposure);
 // Piecewise TXCraig chart is bounded to 1.7-26.7 C. Reject unsupported temperatures, do not silently clamp.
 let txFreshRatio:number|null=null;
 if(segments.every(v=>v.temp>=1.7&&v.temp<=26.7))txFreshRatio=txSolve(segments,calibrationTarget())/100;
 return {q10FreshRatio,txFreshRatio,exposure};
}
