export type Method = 'hand'|'planetary'|'spiral'|'bimby';
export type Mode = 'cold'|'direct';
export type Yeast = 'fresh'|'instant';
export interface Settings {balls:number;ballWeight:number;hydration:number;salt:number;oil:number;yeast:Yeast;method:Method;mode:Mode;start:string;end:string;mixMinutes:number;restMinutes:number;bulkMinutes:number;ballRestMinutes:number;finalHours:number;roomTemp:number;fridgeTemp:number}
export interface Event {label:string;at:Date;detail:string}
export type YeastDisplay = 'both'|'q10'|'txcraig';
