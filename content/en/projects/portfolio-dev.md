---
title: 'Developer Portfolio'
type: "Personal Project"
description: "Bilingual portfolio built with Nuxt 3 in static SPA mode — Markdown content, live Spotify integration and CSS-only page transitions."
git: [ "Git Repository", "https://github.com/OwenLB/portfolio-master" ]
web: [ "Visit site", "https://owenlebec.fr" ]
stack: [
  "Nuxt 3",
  "TypeScript",
  "Vue 3",
  "@nuxt/content",
  "@nuxt/image",
  "SCSS",
  "Netlify"
]
---

## Context

Personal portfolio covering projects, work experience, and contact information. The site handles two languages (FR/EN) without a dedicated i18n module, embeds a live Spotify integration to display the currently playing track, and is deployed statically on Netlify. Even in fully static mode, the Spotify API route runs as a Netlify Function via Nitro.

## Stack & Architecture

- **Nuxt 3 (`ssr: false`)** — SPA mode: the build (`nuxt generate`) produces a static HTML shell, rendering is entirely client-side. This simplifies animated page transitions and global state management (theme, language) without server hydration constraints.
- **@nuxt/content v2** — all content in Markdown with TypeScript-typed frontmatter. No database, no REST API — `.md` files are the source of truth, queried with `queryContent()`.
- **Custom i18n via cookie** — the active locale is a `useCookie()` coupled to a global `useState` (`useLang.ts`). `queryContent` queries filter by `_locale`, with `watch()` for automatic refetch without page navigation.
- **SCSS without a CSS framework** — custom design system: `space($n)` function (= `n × 4px`), `transition()` mixin, CSS custom properties for light/dark theming (`--primary`, `--background`, `--accent`, `--text`).
- **@nuxt/image with Netlify provider** — project cover images (`.webp`) are served through the Netlify CDN with on-the-fly resizing at delivery.
- **Git LFS** — `.webp` files are tracked via `.gitattributes` to avoid storing large binaries in git history.
- **Nitro server route** — `/server/api/spotify.ts` runs as a Netlify Function. Exchanges a refresh token for an access token on every request, without storing tokens in memory or exposing credentials client-side.
- **Umami Analytics** — async script loaded via `useHead`, no cookies, no personal data sent to third parties.

## Notable technical points

- **CSS Grid with `display: contents`**: the main grid is defined on `.page` (4–5 columns). `AppHeader` and `AppSection` use `display: contents`, making their child cells direct participants of the parent grid regardless of depth in the Vue component tree. Editorial layout without wrapper noise — but `display: contents` removes elements from the accessibility tree, requiring explicit ARIA handling on affected components.

- **CSS-only page transitions**: transitions use the `.cell:before` pseudo-element positioned off-screen by default (`inset: -1px calc(100% + 1px) -1px -1px`). The `.page-leave-to` class slides it over the full cell, creating coordinated blind-closing effects. Zero JavaScript — only Nuxt page transition hooks + CSS. Cleanly disabled via `prefers-reduced-motion`.

- **Slug validation middleware**: `middleware/project.ts` runs a `queryContent()` before rendering the project page. If the slug doesn't exist in the current locale, `abortNavigation()` is called — navigation is cancelled cleanly instead of rendering an empty page.

- **Inlined SVGs for diagrams**: `ProseImg.vue` detects `.svg` images and fetches them via `useFetch` to inject as raw HTML inside a `.svg-wrapper`. Diagrams are therefore themable via CSS — hence the explicit `fill`, `stroke` and `color` overrides on internal SVG elements in `[slug].vue` for dark mode.

- **Stagger animation via IntersectionObserver**: the project list animates with an `IntersectionObserver` (threshold 0.6). Each project link gets a `transitionDelay` calculated from its index (`index × 400ms`), producing the staggered entrance without an animation library.

## What I learned

Designing a CSS Grid layout that flows through multiple Vue component levels via `display: contents` requires a precise understanding of its accessibility tree impact: elements with `display: contents` are transparent to the visual DOM but not to screen readers. The CSS-only page transition required several iterations of timing to coordinate the old component's exit with the new one's entrance without a flash of content in between.

---

## Diagrams

### Global architecture

![Global architecture](/diagrams/portfolio-dev/architecture.svg)

---

### Reactive i18n system

![Reactive i18n system](/diagrams/portfolio-dev/i18n.svg)

---

### CSS Grid layout structure

![CSS Grid layout structure](/diagrams/portfolio-dev/grid.svg)
