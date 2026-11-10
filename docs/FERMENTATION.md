# Fermentation models

Both models are **experimental** and calibrated against eligible reference experiments. They are not microbiological laws or guaranteed recipes.

## Q10 baseline

`activity(T) = 2 ^ ((T - 22)/10)`

`E = sum(deltaHours * activity(estimatedDoughTemp))`

For each eligible experiment `i`, `k_i = (freshYeastG_i/flourG_i) * E_i`. The geometric mean `k` of all eligible `k_i` is used. New fresh yeast fraction `r = k/E`.

## TXCraig1 piecewise

Digitized selected values from the user-provided extended TXCraig1 chart and 48h table, stored in `src/engine/data/txcraigTable.ts`. Temperatures between sampled rows use log-time interpolation; within each row, log-dose/log-time interpolation. Outside the dose cells the previous fitted slope extrapolates. Supported temperatures 1.7-26.7 C only. This is a reconstruction, **not** the original author's formula.

For dose percentage `p` and time segments: `progress(p) = sum(deltaHours / predictedHours(temp,p))`. Each eligible experiment yields a target progress `progress(100 * freshYeastG / flourG)`; the geometric mean target is used. Binary search finds new `p` reaching the target; convert `p` to fraction `p/100`.

Do not treat a small difference between the two algorithms as evidence of accuracy. The selected digitized cells are not independent validation data.

Files: `fermentation.ts`, `txcraig.ts`, `references.ts`, `data/txcraigTable.ts`.
