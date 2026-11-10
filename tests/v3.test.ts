import {describe,it,expect} from 'vitest';
import {calculate,defaults} from '../src/engine';
import {referenceExperiments,activeReferences} from '../src/engine/references';
import {txHours,txProgress,txSolve} from '../src/engine/txcraig';
import {thermalSegments} from '../src/engine/thermal';

describe('Pizzametric V3 models',()=>{
 it('reproduces TXCraig 48-hour anchors',()=>{for(const [temp,dose] of [[4.4,.792],[10,.227],[20,.034],[25,.017]])expect(txHours(temp,dose)).toBeCloseTo(48,5)});
 it('reference #001 is active and uncertain #002 is excluded',()=>{expect(referenceExperiments.length).toBe(2);expect(activeReferences.map(x=>x.id)).toEqual(['001'])});
 it('piecewise solver matches reference calibration',()=>{const seg=thermalSegments(130/60,25,3.5,22,4);const target=txProgress(seg,100*3/964);expect(txSolve(seg,target)).toBeCloseTo(100*3/964,6)});
 it('both models produce finite values and ingredient mass balances',()=>{const s=defaults();const r=calculate(s);expect(r.errors).toHaveLength(0);expect(r.txYeast).not.toBeNull();expect(r.txYeast!).toBeGreaterThan(0);expect(r.flour+r.water+r.salt+r.oil+r.yeast).toBeCloseTo(s.balls*s.ballWeight,6)});
 it('more cold time reduces TXCraig dose for fixed conditions',()=>{const s=defaults();s.start='2026-11-07T12:00';s.end='2026-11-08T12:00';const a=calculate(s);s.end='2026-11-09T12:00';const b=calculate(s);expect(b.txYeast!).toBeLessThan(a.txYeast!)});
 it('unsupported chart temperature is explicitly unavailable',()=>{const s=defaults();s.roomTemp=30;expect(calculate(s).txYeast).toBeNull()});
});
