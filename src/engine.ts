export type Method = 'hand'|'planetary'|'spiral'|'bimby';
export type Mode = 'cold'|'direct';
export type Yeast = 'fresh'|'instant';
export interface Settings {balls:number;ballWeight:number;hydration:number;salt:number;oil:number;yeast:Yeast;method:Method;mode:Mode;start:string;end:string;mixMinutes:number;restMinutes:number;bulkMinutes:number;ballRestMinutes:number;finalHours:number;roomTemp:number;fridgeTemp:number}
export interface Event {label:string;at:Date;detail:string}
export const methodMinutes:Record<Method,number>={hand:40,planetary:45,spiral:13,bimby:9};
export const methodNames:Record<Method,string>={hand:'A mano',planetary:'Planetaria',spiral:'Spirale',bimby:'Bimby'};
export const instructions:Record<Method,string[]>={
 hand:['Sciogli il lievito nell’acqua e incorpora gradualmente la farina. Aggiungi il sale.','Lavora l’impasto alternando brevi riposi e pieghe fino a ottenere una massa omogenea.','Se i 40 minuti di riposi e pieghe sono già compresi nell’impastamento, imposta a zero il riposo successivo.'],
 planetary:['Impasta con il gancio per circa 12 minuti; aggiungi il sale dopo circa 3 minuti.','Esegui tre riposi da 10 minuti intervallati da brevi riprese della macchina.','Non duplicare i riposi interni nella fase successiva.'],
 spiral:['Impasta circa 10 minuti a velocità lenta, aggiungendo il sale dopo 3 minuti.','Prosegui circa 3 minuti a velocità superiore. Controlla la temperatura finale.'],
 bimby:['Acqua fredda e lievito: 30 secondi a velocità 2,5.','Aggiungi la farina: 5 minuti modalità Spiga.','Aggiungi sale e acqua rimanente: 2 minuti Spiga.','Se usi olio, aggiungilo e lavora ancora circa 1 minuto. Controlla la temperatura finale.']
};
export const reference={flour:964, freshYeast:3, roomTemp:22, fridgeTemp:4, coldHours:25, finalHours:3.5, restMinutes:40, bulkMinutes:60, ballRestMinutes:30};
const hour=3600000;
export function calculate(s:Settings){
 const start=new Date(s.start),end=new Date(s.end);const total=(end.getTime()-start.getTime())/hour;
 const pre=(s.mixMinutes+s.restMinutes+s.bulkMinutes+(s.mode==='cold'?s.ballRestMinutes:0))/60;
 const final=s.mode==='cold'?s.finalHours:total-pre;
 const cold=s.mode==='cold'?total-pre-final:0;
 const errors:string[]=[];
 if(!Number.isFinite(total)||total<=0)errors.push('La data di fine deve essere successiva all’inizio.');
 if(!Number.isFinite(cold)||cold<0||final<=0)errors.push('Tempo insufficiente per le fasi impostate.');
 if(s.balls<1||s.ballWeight<=0||s.hydration<40||s.hydration>100||s.salt<0||s.roomTemp<10||s.roomTemp>35||s.fridgeTemp<1||s.fridgeTemp>12)errors.push('Controlla quantità e temperature.');
 const dough=s.balls*s.ballWeight;
 // Calibrate ingredients including yeast by solving total dough mass, not by omitting yeast.
 // Simplified exploratory temperature exposure; NOT a validated fermentation model.
 const q10=(t:number)=>Math.pow(2,(t-22)/10);
 const referenceExposure=((reference.restMinutes+reference.bulkMinutes+reference.ballRestMinutes)/60+reference.finalHours)*q10(22)+reference.coldHours*q10(4);
 const exposure=(pre+final)*q10(s.roomTemp)+Math.max(0,cold)*q10(s.fridgeTemp);
 const freshRatio=(reference.freshYeast/reference.flour)*referenceExposure/Math.max(exposure,0.01);
 const yeastRatio=s.yeast==='fresh'?freshRatio:freshRatio/3;
 const flour=dough/(1+s.hydration/100+s.salt/100+s.oil/100+yeastRatio);
 const add=(hours:number)=>new Date(start.getTime()+hours*hour);
 const events:Event[]=[{label:'Inizia a impastare',at:add(0),detail:methodNames[s.method]},{label:'Riposo e pieghe',at:add(s.mixMinutes/60),detail:`${s.restMinutes} minuti`},{label:'Puntata in massa',at:add((s.mixMinutes+s.restMinutes)/60),detail:`${s.bulkMinutes} minuti a ${s.roomTemp}°C`},{label:'Forma i panetti',at:add((s.mixMinutes+s.restMinutes+s.bulkMinutes)/60),detail:`${s.balls} panetti da ${s.ballWeight} g`}];
 if(s.mode==='cold')events.push({label:'Metti in frigorifero',at:add(pre),detail:`${cold.toFixed(1)} ore a ${s.fridgeTemp}°C`},{label:'Togli dal frigorifero',at:add(pre+cold),detail:`${final.toFixed(1)} ore a ${s.roomTemp}°C`});
 else events.push({label:'Appretto a temperatura ambiente',at:add(pre),detail:`${final.toFixed(1)} ore a ${s.roomTemp}°C`});
 events.push({label:'Stesura e cottura',at:end,detail:'Pizza pronta'});
 return {errors,total,cold,final,pre,flour,water:flour*s.hydration/100,salt:flour*s.salt/100,oil:flour*s.oil/100,yeast:flour*yeastRatio,events,referenceExposure,exposure};
}
export function localDatetime(d:Date){const pad=(n:number)=>String(n).padStart(2,'0');return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;}
export function defaults():Settings{const d=new Date();d.setMinutes(0,0,0);const tomorrow=new Date(d.getTime()+24*hour);tomorrow.setHours(12,30,0,0);d.setHours(12,0,0,0);return {balls:6,ballWeight:270,hydration:65,salt:3,oil:0,yeast:'fresh',method:'hand',mode:'cold',start:localDatetime(d),end:localDatetime(tomorrow),mixMinutes:40,restMinutes:40,bulkMinutes:60,ballRestMinutes:30,finalHours:3.5,roomTemp:22,fridgeTemp:4};}
