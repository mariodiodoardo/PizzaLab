import type {Settings} from './types';
import {schedule,localDatetime} from './scheduling';
import {ingredients} from './ingredients';
import {yeastModels} from './fermentation';
export type {Settings,Method,Mode,Yeast,YeastDisplay} from './types';
export type {Event} from './types';

/** Public result contract used by React and the tests. */
export interface CalculationResult {
 errors:string[];total:number;pre:number;final:number;cold:number;
 events:import('./types').Event[];flour:number;water:number;salt:number;oil:number;
 yeast:number;txYeast:number|null;exposure:number;
}

export {localDatetime} from './scheduling';
export {methodMinutes} from '../guides/methods';
export function calculate(s:Settings):CalculationResult{
 const {total,pre,final,cold,events}=schedule(s);const errors:string[]=[];
 if(!Number.isFinite(total)||total<=0)errors.push('La data di fine deve essere successiva all’inizio.');
 if(!Number.isFinite(cold)||cold<0||final<=0)errors.push('Tempo insufficiente per le fasi impostate.');
 if(s.balls<1||s.ballWeight<=0||s.hydration<40||s.hydration>100||s.salt<0||s.roomTemp<10||s.roomTemp>35||s.fridgeTemp<1||s.fridgeTemp>12)errors.push('Controlla quantità e temperature.');
 let q10FreshRatio=0,txFreshRatio:null|number=null,exposure=0;
 if(!errors.length){({q10FreshRatio,txFreshRatio,exposure}=yeastModels(s,pre,cold,final));}
 const dough=s.balls*s.ballWeight;
 const base=ingredients(dough,s.hydration,s.salt,s.oil,q10FreshRatio,s.yeast);
 // Display doses on the same flour basis, so differences are directly comparable.
 const txYeast=txFreshRatio===null?null:base.flour*(s.yeast==='fresh'?txFreshRatio:txFreshRatio/3);
 return {errors,total,pre,final,cold,events,...base,txYeast,exposure};
}
export function defaults():Settings{const d=new Date();d.setMinutes(0,0,0);const tomorrow=new Date(d.getTime()+24*3600000);tomorrow.setHours(12,30,0,0);d.setHours(12,0,0,0);return {balls:6,ballWeight:270,hydration:65,salt:3,oil:0,yeast:'fresh',method:'hand',mode:'cold',start:localDatetime(d),end:localDatetime(tomorrow),mixMinutes:40,restMinutes:0,bulkMinutes:60,ballRestMinutes:30,finalHours:3.5,roomTemp:22,fridgeTemp:4};}
