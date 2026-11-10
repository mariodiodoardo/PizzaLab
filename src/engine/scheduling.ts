import type {Settings,Event} from './types';
import {methodNames} from '../guides/methods';
const hour=3600000;
export function localDatetime(d:Date){const pad=(n:number)=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;}
export function schedule(s:Settings){
 const start=new Date(s.start),end=new Date(s.end);const total=(end.getTime()-start.getTime())/hour;
 const pre=(s.mixMinutes+s.restMinutes+s.bulkMinutes+(s.mode==='cold'?s.ballRestMinutes:0))/60;
 const final=s.mode==='cold'?s.finalHours:total-pre;
 const cold=s.mode==='cold'?total-pre-final:0;
 const add=(hours:number)=>new Date(start.getTime()+hours*hour);
 const events:Event[]=[{label:'Inizia a impastare',at:add(0),detail:methodNames[s.method]},...(s.restMinutes>0?[{label:'Riposo e pieghe',at:add(s.mixMinutes/60),detail:`${s.restMinutes} minuti`}]:[]),{label:'Puntata in massa',at:add((s.mixMinutes+s.restMinutes)/60),detail:`${s.bulkMinutes} minuti a ${s.roomTemp}°C`},{label:'Forma i panetti',at:add((s.mixMinutes+s.restMinutes+s.bulkMinutes)/60),detail:`${s.balls} panetti da ${s.ballWeight} g`}];
 if(s.mode==='cold')events.push({label:'Metti in frigorifero',at:add(pre),detail:`${cold.toFixed(1)} ore a ${s.fridgeTemp}°C`},{label:'Togli dal frigorifero',at:add(pre+cold),detail:`${final.toFixed(1)} ore a ${s.roomTemp}°C`});
 else events.push({label:'Appretto a temperatura ambiente',at:add(pre),detail:`${final.toFixed(1)} ore a ${s.roomTemp}°C`});
 events.push({label:'Stesura e cottura',at:end,detail:'Pizza pronta'});
 return {total,pre,final,cold,events};
}
