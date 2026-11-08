import {describe,it,expect} from 'vitest';
import {calculate,defaults} from '../src/engine';
describe('PizzaLab calculation engine',()=>{
 it('ingredients sum to target dough weight',()=>{const s=defaults();const r=calculate(s);expect(r.flour+r.water+r.salt+r.oil+r.yeast).toBeCloseTo(s.balls*s.ballWeight,6)});
 it('reference formula reproduces the reference when its phases match',()=>{const s=defaults();s.mixMinutes=0;s.start='2026-11-07T08:00';s.end='2026-11-08T14:40';s.restMinutes=40;s.bulkMinutes=60;s.ballRestMinutes=30;s.finalHours=3.5;const r=calculate(s);expect(r.cold).toBeCloseTo(25,6);expect(r.yeast/r.flour).toBeCloseTo(3/964,6)});
 it('rejects negative cold time',()=>{const s=defaults();s.start='2026-11-07T12:00';s.end='2026-11-07T13:00';expect(calculate(s).errors.length).toBeGreaterThan(0)});
 it('direct mode has no fridge phase',()=>{const s=defaults();s.mode='direct';const r=calculate(s);expect(r.cold).toBe(0);expect(r.events.some(e=>e.label.includes('frigorifero'))).toBe(false)});
 it('instant dry yeast is approximately one third fresh yeast',()=>{const s=defaults();const fresh=calculate(s);s.yeast='instant';const dry=calculate(s);expect(dry.yeast).toBeCloseTo(fresh.yeast/3,1)});
});
