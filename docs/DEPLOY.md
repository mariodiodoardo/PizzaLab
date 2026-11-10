# Deployment and troubleshooting

## Cloudflare Pages

Framework: React (Vite). Build command: `npm run build`. Output directory: `dist`. Root: `/` if `package.json` is at repository root.

## Local verification

```bash
npm ci   # if package-lock.json exists; otherwise npm install
npm test
npm run build
```

The previous V3 Cloudflare log reported TS2305 for `YeastDisplay` and TS2551 for `txYeast`. `src/engine/index.ts` now explicitly exports `YeastDisplay` and declares a typed `CalculationResult` with `txYeast`. Ensure the entire repository is replaced, not just `App.tsx`.

## Images

`public/images/pizza-hero.webp` is the hero image used by `src/components/App.tsx`. It is an AI-generated cutout, not a pixel-exact cutout of the original. Original user photos are preserved as `user-pizza-original-1.jpg` and `user-pizza-original-2.jpg`.
