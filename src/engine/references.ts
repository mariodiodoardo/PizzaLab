import experiments from './data/experiments.json';
import {thermalSegments} from './thermal';
import {txProgress} from './txcraig';
export type Experiment={id:string;flourG:number;freshYeastG:number|null;freshYeastRangeG:number[]|null;roomTempC:number;fridgeTempC:number;coldHours:number;finalHours:number;initialMinutes:number;fdtC:number|null;result:string;useForCalibration:boolean;notes:string};
export const referenceExperiments=experiments as Experiment[];
export const activeReferences=referenceExperiments.filter(r=>r.useForCalibration&&r.freshYeastG!==null&&r.result==='good');
/** Multi-reference calibration: geometric mean of target progress, not mean of yeast grams.
 * Add new observations in data/experiments.json and opt in explicitly only after review.
 * See docs/CALIBRATION.md. Reference #002 is excluded because yeast mass is uncertain.
 */
export function calibrationTarget(){if(!activeReferences.length)throw Error('No eligible calibration experiments');const logs=activeReferences.map(r=>{
 const segments=thermalSegments(r.initialMinutes/60,r.coldHours,r.finalHours,r.roomTempC,r.fridgeTempC,r.fdtC??r.roomTempC);
 return Math.log(txProgress(segments,100*r.freshYeastG!/r.flourG));
 });return Math.exp(logs.reduce((a,b)=>a+b,0)/logs.length);
}
export function q10Calibration(){if(!activeReferences.length)throw Error('No eligible references');return Math.exp(activeReferences.map(r=>{
 const e=thermalSegments(r.initialMinutes/60,r.coldHours,r.finalHours,r.roomTempC,r.fridgeTempC,r.fdtC??r.roomTempC).reduce((sum,s)=>sum+s.hours*Math.pow(2,(s.temp-22)/10),0);
 return Math.log((r.freshYeastG!/r.flourG)*e);
 }).reduce((a,b)=>a+b,0)/activeReferences.length);}
