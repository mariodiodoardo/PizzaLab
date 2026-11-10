# Repository map

- `src/components/App.tsx`: React UI and interaction.
- `src/engine/ingredients.ts`: baker percentages and total mass.
- `src/engine/scheduling.ts`: phase timing and schedule.
- `src/engine/fermentation.ts`: orchestrates both yeast models.
- `src/engine/txcraig.ts`: piecewise table interpolation and solver.
- `src/engine/thermal.ts`: estimated dough temperature trajectory.
- `src/engine/references.ts`: experiment filtering and calibration.
- `src/engine/data/experiments.json`: editable experiment records.
- `src/guides/index.ts`: full bilingual instructions; `methods.ts`: mixing presets.
- `src/i18n/translations.ts`: Italian/English UI strings.
- `src/styles/app.css`: visual design.
- `research/fermentation/txcraig_full`: original Python research and chart images.
- `public/images/`: replaceable **illustrative** pizza placeholders.

Cloudflare Pages: build `npm run build`, output `dist`. No backend or database.
