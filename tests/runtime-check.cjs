// Lightweight independent runtime smoke test without npm packages; uses globally available TypeScript compiler.
const fs=require('fs'),assert=require('assert'),ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript');
require.extensions['.ts']=function(mod,file){const source=fs.readFileSync(file,'utf8');const js=ts.transpileModule(source,{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true,resolveJsonModule:true}}).outputText;mod._compile(js,file)};
const {calculate,defaults}=require('../src/engine/index.ts');
const {txHours,txProgress,txSolve}=require('../src/engine/txcraig.ts');
const {thermalSegments}=require('../src/engine/thermal.ts');
const {activeReferences}=require('../src/engine/references.ts');
for(const [t,d] of [[4.4,.792],[10,.227],[20,.034],[25,.017]])assert(Math.abs(txHours(t,d)-48)<1e-5);
assert.deepEqual(activeReferences.map(x=>x.id),['001']);
const ref=thermalSegments(130/60,25,3.5,22,4);const target=txProgress(ref,100*3/964);assert(Math.abs(txSolve(ref,target)-100*3/964)<1e-6);
const s=defaults(),r=calculate(s);assert(!r.errors.length);assert(r.txYeast>0);assert(Math.abs(r.flour+r.water+r.salt+r.oil+r.yeast-1620)<1e-6);
s.start='2026-11-07T12:00';s.end='2026-11-08T12:00';const a=calculate(s);s.end='2026-11-09T12:00';const b=calculate(s);assert(b.txYeast<a.txYeast);
s.roomTemp=30;assert.strictEqual(calculate(s).txYeast,null);
console.log('Runtime smoke checks: 6 passed');
console.log('Reference dose at 25h cold, 130min initial, 3.5h final:',(txSolve(ref,target)*964/100).toFixed(3),'g');
