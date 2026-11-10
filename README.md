# Pizzametric V3

Static pizza dough calculator PWA (React, TypeScript, Vite) for Cloudflare Pages. **Yeast models are experimental, not validated**.

## Run

```bash
npm install
npm test
npm run build
npm run dev
```

Cloudflare Pages build command `npm run build`, output `dist`. The GitHub repository and Cloudflare project can be renamed separately; do not delete an existing working deployment before verifying the new one.

## Features

Bilingual IT/EN, hand/planetary/spiral/Thermomix guides, dough tray vs individual containers, adjustable timing accordion, temperature fields always visible, Q10 and TXCraig1 experimental estimates selectable inside advanced settings, thermal lag approximation, ingredient and schedule calculator.

## Developer documentation

Start with [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md), [docs/INGREDIENTS.md](docs/INGREDIENTS.md), [docs/FERMENTATION.md](docs/FERMENTATION.md), [docs/THERMAL_MODEL.md](docs/THERMAL_MODEL.md) and [docs/CALIBRATION.md](docs/CALIBRATION.md).

## Images

The images in `public/images` are **generated illustrative placeholders**, not the user's own pizzas. Replace `pizza-hero.webp` with your photograph (same filename) to update the homepage; optional detail placeholders are reserved for later.

## Research

Python exploratory code and the user's source charts are preserved under `research/fermentation/txcraig_full`.


See [deployment troubleshooting](docs/DEPLOY.md).
