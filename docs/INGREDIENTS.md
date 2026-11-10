# Ingredients calculation

All ingredient percentages are **baker percentages**, relative to flour mass.

Dough mass `D = balls * grams_per_ball`. Hydration `H`, salt `S`, oil `O` are percent values. Fresh yeast ratio `r` is a fraction, not a percent. For instant dry yeast, use `r/3` (approximation).

`F = D / (1 + H/100 + S/100 + O/100 + r)`

`water = F * H/100`; `salt = F * S/100`; `oil = F * O/100`; `yeast = F * r`.

Example: 6 x 270 g, H=65%, S=3%, O=0%, fresh yeast ratio=3/964. Result approximately 962.5 g flour, 625.6 g water, 28.9 g salt, 3.0 g yeast (approximate). Values are rounded for display only.

Source: `src/engine/ingredients.ts`. Do not round during calculation.
