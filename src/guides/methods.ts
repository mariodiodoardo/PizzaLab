import type {Method} from '../engine/types';
export const methodMinutes:Record<Method,number>={hand:40,planetary:45,spiral:13,bimby:9};
export const methodNames:Record<Method,string>={hand:'A mano',planetary:'Planetaria',spiral:'Spirale',bimby:'Bimby'};
export const instructions:Record<Method,string[]>={
 hand:['Sciogli il lievito nell’acqua e incorpora gradualmente la farina. Aggiungi il sale.','Lavora l’impasto alternando brevi riposi e pieghe fino a ottenere una massa omogenea.','Se i 40 minuti di riposi e pieghe sono già compresi nell’impastamento, imposta a zero il riposo successivo.'],
 planetary:['Impasta con il gancio per circa 12 minuti; aggiungi il sale dopo circa 3 minuti.','Esegui tre riposi da 10 minuti intervallati da brevi riprese della macchina.','Non duplicare i riposi interni nella fase successiva.'],
 spiral:['Impasta circa 10 minuti a velocità lenta, aggiungendo il sale dopo 3 minuti.','Prosegui circa 3 minuti a velocità superiore. Controlla la temperatura finale.'],
 bimby:['Acqua fredda e lievito: 30 secondi a velocità 2,5.','Aggiungi la farina: 5 minuti modalità Spiga.','Aggiungi sale e acqua rimanente: 2 minuti Spiga.','Se usi olio, aggiungilo e lavora ancora circa 1 minuto. Controlla la temperatura finale.']
};
