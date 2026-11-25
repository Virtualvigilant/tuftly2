# Tuftly — Bespoke Tufting Atelier Website

A warm, editorial luxury storefront for **Tuftly**, showcasing hand-tufted sculptural rugs, gallery wall art, and artisan women's handbags with transparent pricing in **Kenyan Shillings (KSh)** and direct **WhatsApp & Instagram DM** ordering.

## Quick Start (Run Locally)

```powershell
npm install
npm run dev
```

Open **http://localhost:5173/** in your browser. To preview on your phone over the same Wi-Fi network:

```powershell
npm run dev -- --host
```

## Studio Admin (Add, Edit & Remove Products)

Open **http://localhost:5173/#admin** (or click **Studio Admin** in the footer of the site):

- **Default Passcode:** `tuftly2026` (change `adminPasscode` anytime in `src/data/tuftlyConfig.js`)
- Add new rugs, wall art, or handbags with multiple sizes, `KSh` prices, yarn colour swatches, and real photo uploads straight from your computer or phone.
- Edit or remove any piece — changes show immediately on the live storefront.
- Use **Export JSON** to back up your catalog, or **Copy Code** to paste your updated `PRODUCTS` list directly into `src/data/tuftlyConfig.js` before publishing online.

## Updating Contact Details, Prices & Products

All business details, prices, rug size tiers, and products live in one file:

- `src/data/tuftlyConfig.js`
  - `BRAND_CONFIG.whatsappNumber` — already set to `254118899336` (`0118899336`)
  - `BRAND_CONFIG.instagramHandle` — update to your real Instagram username (without `@`)
  - `BRAND_CONFIG.email` — update to your studio email
  - `PRODUCTS` — edit titles, descriptions, size options, and `KSh` prices
  - `RUG_PRICING_TIERS` & `OTHER_PRICING_SUMMARY` — update your studio rate card

## Replacing Placeholder Photography with Your Own Pieces

All images live in `public/images/`. When you photograph your own finished rugs, wall art, or handbags, drop them into `public/images/` and either keep the same filenames or update the `image` paths in `src/data/tuftlyConfig.js`.

## Hosting on Vercel (Free)

This project is pre-configured for Vercel via `vercel.json` (Vite build settings, SPA `/admin` route rewrites, and image caching).

### Option A — Deploy via GitHub + Vercel Dashboard (Recommended)
1. Push this folder to a GitHub repository.
2. Sign in at [vercel.com](https://vercel.com) → **Add New Project** → import your `tuftly` repo.
3. Vercel automatically detects **Vite** (`npm run build` → `dist`). Click **Deploy**.
4. Once live, your storefront is at `https://your-project.vercel.app` and your Studio Admin is at `https://your-project.vercel.app/admin` (or `/#admin`).

### Option B — Deploy Directly from Terminal (No GitHub Needed)
```powershell
npx vercel
```
Follow the quick prompts to log in and deploy, then run `npx vercel --prod` whenever you want to publish updates live.

