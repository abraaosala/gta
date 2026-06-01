# GTA-Tech Landing Page — Agent Guide

## Stack
React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS 4 + `motion` (framer-motion) + `lucide-react` + `@google/genai`.

## Commands
| Action | Command |
|--------|---------|
| Dev server | `npm run dev` — serves on `http://localhost:3000` (all interfaces) |
| Build | `npm run build` |
| Type-check | `tsc --noEmit` (called `lint` in package.json) |
| No test runner or CI present. | |

## Tailwind v4 specifics
- No `tailwind.config.js`. Configured via `@import "tailwindcss"` in `src/index.css` and `@tailwindcss/vite` plugin in `vite.config.ts`.
- Custom theme tokens defined inside `@theme {}` block in CSS (colors, fonts).
- Use `@apply` in CSS, not in JSX.

## Project structure
```
gta/
├── index.html              # Entry point
├── vite.config.ts          # Vite + React + Tailwind + path alias (@/ → ./)
├── src/
│   ├── main.tsx            # React root mount
│   ├── App.tsx             # Top-level layout (sections assembled here)
│   ├── data.ts             # ALL content data (services, products, testimonials, etc.)
│   ├── types.ts            # TypeScript interfaces for all data shapes
│   ├── index.css           # Tailwind import + theme + custom animations/glass styles
│   └── components/         # 12 section components (Header, Hero, Brands, etc.)
└── assets/.aistudio/       # Google AI Studio metadata
```

## Architecture notes
- **Single-page app** — no router. Uses anchor links (`#servicos`, `#contacto`) with smooth scrolling.
- **All content is hardcoded** in `src/data.ts`. No API calls in this app.
- **Dark mode** toggled in `App.tsx`, persisted to `localStorage` key `gta_tech_dark_mode_light_default`. Default is light.
- **InteractiveEstimator** can receive a `preselectedServiceId` from `Services` grid via state hoisted in `App.tsx`.
- `@/` path alias maps to project root (e.g., `@/src/data.ts`).

## Env
- `GEMINI_API_KEY` — required for Gemini AI features (Google AI Studio injects this at runtime).
- `DISABLE_HMR=true` — disables HMR and file watching to prevent flickering during agent edits.
- Copy `.env.example` to `.env` for local dev.

## Conventions
- Components are default-exported function components in `src/components/`.
- All JSX files use `.tsx` extension.
- CSS uses Tailwind utility classes extensively, with custom glass/tech styles in `index.css`.
- All files have `SPDX-License-Identifier: Apache-2.0` header.
- `tsc --noEmit` is the only type-check command — run before committing.
