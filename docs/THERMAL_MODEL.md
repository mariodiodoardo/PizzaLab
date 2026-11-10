# Temperature trajectory

Newton cooling/warming approximation: `T(t) = T_env + (T_start - T_env) * exp(-t/tau)`.

For each time step, use midpoint temperature to integrate fermentation. Default assumptions `tau_cooling=2h`, `tau_warming=1.5h`, integration step 5 min. These constants are hypothetical, **not measured for the user's containers**. The start temperature is assumed equal to room temperature for prospective calculation.

The same trajectory is used for both Q10 and TXCraig1. Final dough temperature (FDT) is not requested in the pre-mixing calculator because it is only measurable after kneading. Measured FDT and other temperatures can be recorded in experimental data to refine the model later.

Source: `src/engine/thermal.ts`. For temperature outside 1.7-26.7 C, TXCraig1 is unavailable rather than silently extrapolated.
