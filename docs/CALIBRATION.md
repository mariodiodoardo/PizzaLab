# Adding experiments

Edit **`src/engine/data/experiments.json`**, not mathematical formulas. Duplicate an object and assign a unique `id` (e.g. `003`). Record actual flour, fresh yeast (or set `freshYeastG:null` and provide `freshYeastRangeG`), room/fridge temperatures, exact cold/final hours, total initial minutes, and optional measured `fdtC` (immediately after mixing). Document result and notes.

New experiments start with `useForCalibration:false`. Only set true after checking exact yeast mass, actual timing, temperatures, method overlap and an appropriate `good` outcome. If uncertain, keep false. #002 is excluded due to uncertain yeast mass.

`references.ts` loads **all** eligible records. For Q10 it uses the geometric mean of the exposure-scaled yeast fractions; for TXCraig1 it uses the geometric mean of target progress values. This is a preliminary equal-weight approach, not statistical fitting or automatic quality scoring. Review outcomes and rerun tests before deploying.

Current #001 includes **assumed** initial 130 min; the precise mixing/recovery timing was not measured. When you obtain reliable timestamps, update that record and verify the predictions. Avoid adding copies of the same batch as independent observations.

Run `npm test`, `npm run build`, and compare predictions against held-out experiments. Python source in `research/fermentation/txcraig_full` is for investigation and is not used by the deployed app.
