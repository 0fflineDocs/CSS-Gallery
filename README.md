# CSS Gallery

A gallery of ready-made UI theme presets for visual reference and design inspiration. Each theme defines a color palette, heading and body fonts, border radius, and shadow, and the gallery shows it applied to real interface components.

<img width="1471" height="963" alt="CSS Gallery screenshot" src="https://github.com/user-attachments/assets/a9cd4c80-0ba8-4937-9f09-dcb1ec5e66c8" />

## Features

- **44 theme presets**, each with its own palette, fonts, radius, and shadow.
- **Category filter**: Light, Dark, Colorful, Minimal, and Brutalist.
- **Theme detail pages** (`/theme/:id`) that render the theme on sample components: meters, donut, pie and bar charts, tables and logs, alerts and toasts, tabs, toggles, avatars, skeleton and empty states, headline motion, and more.
- **One-click copy** for individual colors, the theme as CSS custom properties, or the theme as JSON.

## Stack

React 19, TypeScript, Vite, React Router, Tailwind CSS v4, Radix UI (dialog, toggle group, tooltip), and Framer Motion.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run lint     # ESLint
npm run build    # type-check and build to dist/
npm run preview  # serve the production build
```

## Adding a theme

Themes live in `src/data/themes.ts` and follow the `ThemePreset` type in `src/types/theme.ts`. Add an entry with a unique `id`, a `category`, the seven palette colors (`background`, `foreground`, `primary`, `secondary`, `accent`, `muted`, `border`), `fonts`, `borderRadius`, and `shadow`. The grid, filter counts, and detail page pick it up automatically.

## Deployment

The site is deployed on Vercel. `vercel.json` rewrites all paths to the SPA entry point and sets security headers, including a Content Security Policy.
