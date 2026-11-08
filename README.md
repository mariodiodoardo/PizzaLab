# PizzaLab

Personal pizza dough calculator. React + TypeScript + Vite PWA. Static frontend only: no backend, NAS, database or accounts.

## Start locally

Install Node.js 20.19+ or 22.12+ (compatible with Vite 6), then:

```bash
npm install
npm run dev
```

Open the local address shown by Vite.

## Verify

```bash
npm test
npm run build
npm run preview
```

## Publish on GitHub

Create a new GitHub repository named `pizzalab`. In this directory:

```bash
git init
git add .
git commit -m "Initial PizzaLab"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/pizzalab.git
git push -u origin main
```

Or upload the unzipped project through the GitHub web interface. Do not commit `node_modules` or `dist`.

## Deploy on Cloudflare Pages

1. In Cloudflare, go to **Workers & Pages**, create a Pages project and connect your GitHub repository.
2. Framework preset: **Vite** (or None).
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Deploy. Cloudflare provides an HTTPS `*.pages.dev` URL.
6. Open the URL in Safari on iPhone, then use **Share > Add to Home Screen**.

The PWA caches static assets for offline use after installation/first load. No data is stored or synchronized.

## Current limitations

- Yeast calculation is **experimental**. Reference: 3 g fresh yeast / 964 g flour, 25 h fridge at 4°C, 3.5 h final at 22°C. A simplified Q10=2 equivalent exposure model scales this reference; it is not scientifically validated for pizza and does not model dough cooling/warming lag.
- For hand and planetary methods, internal kneading rests may overlap the separate rest-and-fold phase. Set the latter to 0 if already included.
- Default dates are generated on page load. The chosen end time is for stretching/baking; account for baking duration as needed.
- Recipe and timeline do not persist across devices or page reloads.
- This is an initial implementation, not a production-validated fermentation advisor.

## Project structure

- `src/engine.ts`: ingredient, fermentation estimate and scheduling logic.
- `src/main.tsx`: interactive UI.
- `src/style.css`: responsive design.
- `tests/engine.test.ts`: calculation checks.
- `vite.config.ts`: PWA manifest and offline asset caching.

## PizzaLab V2 updates

- Italian / English language switcher (preference saved locally).
- Full preparation guide, with method-specific mixing instructions and detailed stages through baking.
- Pizza dough tray or individual container guidance.
- Fermentation timing sliders hidden in an expandable panel; temperatures remain visible.
- Default hand-mixing rests counted only once.

### Build and deployment

Install dependencies with `npm install`, run `npm test` and `npm run build`.
Cloudflare Pages: preset **React (Vite)**, build command `npm run build`, output directory `dist`.

**Validation note:** The yeast model remains experimental. The build was not executable in the authoring environment because package installation timed out. Please run the build locally or let Cloudflare Pages run it and inspect any reported errors before replacing a working deployment.
