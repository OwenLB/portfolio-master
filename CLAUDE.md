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

Language is URL-based via **`@nuxtjs/i18n`** (`prefix_except_default`): French is served at `/`, English under `/en/…`, each with its own `hreflang` + canonical (emitted by `useLocaleHead()` in `app.vue`). The `lang` cookie still persists the visitor's preference. `composables/useLang.ts` now returns the i18n `locale` ref (`'fr' | 'en'`, values map 1:1 onto the `Lang` enum), and content queries filter by `_locale: lang.value`. **Important:** `@nuxt/content` `_path` values carry no locale prefix (`/projects/finixa`), so look up content by the slug/unprefixed path — not `route.path`, which gains a `/en` prefix in English (see `pages/projects/[slug].vue`).

### Key Composables

- `useLang.ts` — returns the `@nuxtjs/i18n` `locale` ref (`'fr' | 'en'`); switch language by navigating to `switchLocalePath()`, not by mutating it
- `useTheme.ts` — dark/light theme (cookie-persisted, system-preference aware)
- `useCursor.ts` — custom cursor tracking

### Routing

File-based (`pages/`). `@nuxtjs/i18n` auto-generates a localized route per page (`/projects/:slug` and `/en/projects/:slug`). `pages/projects/[slug].vue` uses a route middleware (`middleware/project.ts`) to validate the slug exists in content before rendering. Internal `<NuxtLink>`s must wrap their target in `localePath()` (or `switchLocalePath()`) so navigation keeps the active locale prefix.

### Sitemap & SEO

`@nuxtjs/sitemap` serves `/sitemap.xml` (a per-locale index → `/__sitemap__/fr-FR.xml` + `en-US.xml`), built from the prerendered routes. The canonical site URL lives in `site.url` (`nuxt.config.ts`), shared with i18n's `baseUrl`. There is no static `public/sitemap.xml` anymore — it's generated.

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
