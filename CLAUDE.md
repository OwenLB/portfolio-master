# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build
npm run generate   # Pre-render static site (used for Netlify deployment)
npm run preview    # Preview the production build locally
```

No linting or test suite is configured in this project.

## Architecture

**Nuxt 3** (Vue 3 Composition API) + TypeScript portfolio site, deployed statically on Netlify.

### Content System

All page text lives as Markdown in `content/{fr,en}/`. Pages query their content via `@nuxt/content`:

```
content/
  fr/ → home.md, about.md, legal.md, projects/
  en/ → (parallel structure)
```

The active language (`Fr | En`) is stored in a cookie via `composables/useLang.ts`, and queries use the lang value to pick the correct locale path.

### Key Composables

- `useLang.ts` — language state (cookie-persisted, `Fr | En` enum)
- `useTheme.ts` — dark/light theme (cookie-persisted, system-preference aware)
- `useCursor.ts` — custom cursor tracking

### Routing

File-based (`pages/`). `pages/projects/[slug].vue` uses a route middleware (`middleware/project.ts`) to validate the slug exists in content before rendering.

### Spotify Integration

`netlify/edge-functions/spotify.ts` — Netlify edge function (Deno) that exchanges a refresh token for an access token and returns the currently playing track. Credentials are kept server-side via environment variables:

- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`
- `SPOTIFY_REFRESH_TOKEN`

### Styling

Global SCSS in `assets/scss/style.scss`. Key conventions:
- `space($n)` utility → `$n * 4px`
- `transition()` mixin for consistent animation
- CSS custom properties for theming (`--primary`, `--background`, `--accent`, `--text`)
- Responsive breakpoint: `$md: 768px`
- Fonts: PP Formula Condensed, Strawford (in `assets/fonts/`)

### Images

Large images (`.webp`) are tracked via Git LFS. Use `@nuxt/image-edge` with the Netlify provider for optimized delivery.
