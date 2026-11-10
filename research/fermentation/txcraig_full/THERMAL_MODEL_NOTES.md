# TXCraig reconstruction: interpolation and thermal lag sensitivity

## Scope
This is a reconstruction from user-supplied images, not the author's original implementation and not a validated pizza-yeast dosing tool. The original chart values were manually transcribed (selected cells only). The 48-hour chart is the temperature anchor.

## Model alternatives
- `model.py`: power-law hours versus CY percent, with a fitted log-dose slope at each of six temperatures. It reproduces 48-hour anchors exactly. Largest in-sample discrepancy is 36.4% at 25 C and 0.010% CY (56 chart hours versus 76.4 predicted).
- `piecewise.py`: log-log interpolation through selected grid cells and each 48-hour anchor. Exact reproduction of those points is *not* independent validation. Outside the observed yeast-dose range, the previous power-law slope is used for extrapolation. At temperatures between grid rows, it interpolates log-hours with a dose adjustment from the 48-hour anchor.
- `thermal_analysis.py`: Newton exponential cooling and warming with tunable time constants. `tau_cool` and `tau_warm` are in hours; temperature moves about 63% of the way toward its target after one time constant. This is a scenario model, not a measured cooling curve.

## Results, recipe #002 (963 g flour, 17.5 h at 4 C, 3 h final at 22 C), calibrated to recipe #001 (964 g, 3 g fresh, 25 h at 4 C, 3.5 h final at 22 C, 2 h 10 min initial)
- Previous power-law without thermal lag: 3.668 g.
- Piecewise without thermal lag: 3.741 g.
- Piecewise with cooling/warming constants 2 h/1.5 h: 3.695 g.
- Across sampled thermal constants (near instant to 4 h/3 h): 3.541 to 3.808 g.

## Important caveats
- The initial phase timing and dough start temperature are assumptions, not measured observations.
- The #002 actual yeast amount was reported only as about 3-4 g; its overproofing proximity is qualitative.
- The thermal constants depend on dough-ball size, container, loading, fridge airflow, and surface area. The model uses a single lumped temperature and cannot infer the constants without measurements.
- The 48-hour anchor doses and selected chart cells are model construction data, not held-out validation data. More independent cells should be digitized before treating the piecewise fit as an improvement in accuracy.
- All chart calculations assume constant salt/hydration/flour properties and a fixed endpoint; the actual endpoint may differ from the author's.
- Temperature curves and yeast activity are not the same as gas production or dough structural readiness.
- In `thermal_analysis.py`, temperature sensitivity examples recalibrate #001 at each new scenario. These demonstrate relative changes only, not real-world dosing at those temperatures.
- The models should not yet be used to automatically recommend a yeast dose in the production app.

## Reproduce
`python thermal_analysis.py`
`python piecewise.py`
`python -m unittest discover -p 'test*.py' -v`

## Suggested next experiment
Measure fresh yeast with 0.01 g resolution and record dough-ball temperature at fridge entry, after 1/2/4 hours in fridge, on removal, and after 1/2 hours out. If intrusive temperature measurement would damage dough, use a separate similarly sized test ball. Record flour, salt, hydration, container, room and fridge temperatures, dough-ball size and sensory readiness. Use these observations to fit thermal time constants, then test predictions on a new batch.
