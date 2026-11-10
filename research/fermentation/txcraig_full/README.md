# Pizzametric: TXCraig1 extended-table reconstruction (research prototype)

Run `python model.py` and `python -m unittest test_model.py`. No third-party packages required.

## What is implemented

- The supplied 48-hour **CY (fresh/compressed yeast)** chart, transcribed in `../pizzametric_model/compare.py`, anchors the amount needed for 48h at each temperature.
- 36+ selected readable cells from `Fermentation-Table---Extended.jpg` are transcribed in `model.py` to estimate a temperature-dependent exponent `alpha(T)`.
- Approximation: `time(T, Y) = 48 * (Y / Y48(T)) ** (-alpha(T))` with Y and Y48 in **percent of flour weight**. Y48 is log-interpolated; alpha is linearly interpolated in temperature.
- For multiple phases, assume additive fractional progress `sum(hours_i / time(T_i, Y))`. Bisection finds Y for progress=1.
- A *separate* personalized calibration instead targets the fractional progress reached by recipe #001 using 3g fresh yeast and 964g flour. This is not independent validation.

## Scope and cautions

This is **not** the original author's published formula, and does not reproduce the complete extended image. It reconstructs a smooth approximation using selected cells. Original table times are rounded to integer hours; this yields large relative errors for very short times. Across selected cells with displayed time >=8h, the median in-sample absolute relative deviation is around 2.6%, but max is around 36%; this is **not out-of-sample predictive accuracy**. Some cells may have been transcribed incorrectly from the low-resolution image. 48-hour table values at the warmest edge are very small and should be handled cautiously.

The 4°C refrigerator temperature is assumed to be the dough temperature immediately. Real dough cools and warms gradually. Initial warm time 2h10 is an assumption and must not double-count rests included in kneading. Flour strength, salt, hydration, container size, yeast strain, and final dough temperature are not explicitly modeled. The chart's 'ready' endpoint may differ from the user's desired endpoint. No clinical/food safety guarantee; use this only for exploratory pizza recipes.

## Observed recipes

- #001: 964g flour, 3g fresh yeast, 25h at 4°C, 3.5h at 22°C, assumed 2h10 warm early. Reported good.
- #002: ~963g flour, uncertain 3-4g fresh yeast, ~17.5h at 4°C, 3h at 22°C, assumed 2h10 warm early. Reported very good, near overproofed.

## Next development

Transcribe more cells and validate with held-out cells, model temperature trajectories, collect accurate yeast weights and dough temperatures, then compare independent experiments before modifying the app. Dry yeast conversion is **not** independently implemented here; source tables distinguish CY, IDY and ADY and these should not be conflated.
