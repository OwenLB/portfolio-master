# Handoff — Lot 3B étape 2

> À utiliser dans une **session Claude Code locale** (npm install disponible).
> Lot 3A ✅ et Lot 3B étape 1 (SSR + prerender) ✅ sont déjà mergés/poussés sur la branche `claude/exciting-heisenberg-MLQkf`.

---

## 0. Avant de commencer — valider le deploy preview

Ouvre https://deploy-preview-11--owenlebec.netlify.app, clic-droit → "Afficher le code source" et vérifie :

- [ ] Le HTML contient le vrai contenu (pas juste `<div id="__nuxt"></div>`)
- [ ] Les `<meta property="og:…">` sont remplies dans le `<head>`
- [ ] Le JSON-LD `Person` est présent dans le `<head>`
- [ ] Le JSON-LD `CreativeWork` est présent sur `/projects/finixa` (source)
- [ ] Le toggle EN/FR persiste (cookie reconcilié au mount)
- [ ] Pas de flash blanc au chargement en dark mode
- [ ] 404 affiche bien l'animation Lottie
- [ ] Pas d'erreur hydration dans la console

Si tout est OK → merger la PR #11, puis continuer ici.

---

## 1. i18n par URL — `@nuxtjs/i18n` (P1 L)

**Problème actuel** : la langue est dans un cookie → l'anglais est invisible aux moteurs de recherche (une seule URL par page).

**Objectif** : `/en/` prefix pour l'anglais, `hreflang` dans le `<head>`, cookie conservé pour la préférence.

### Installation

```bash
npm install @nuxtjs/i18n
```

### `nuxt.config.ts` — ajouter le module

```ts
modules: [
  '@nuxt/content',
  '@nuxt/image',
  '@nuxtjs/i18n',          // ← ajouter
],
i18n: {
  locales: [
    { code: 'fr', language: 'fr-FR', name: 'Français' },
    { code: 'en', language: 'en-US', name: 'English' },
  ],
  defaultLocale: 'fr',
  strategy: 'prefix_except_default',  // /en/... pour EN, / pour FR
  detectBrowserLanguage: {
    useCookie: true,
    cookieKey: 'lang',
    redirectOn: 'root',
  },
},
```

### Adapter `composables/useLang.ts`

Remplacer le composable custom par le locale d'`@nuxtjs/i18n` :

```ts
// composables/useLang.ts
import { useI18n } from '#i18n'
export default () => {
  const { locale } = useI18n()
  return locale  // 'fr' | 'en'
}
```

> **Attention** : `useLang` retourne actuellement `Lang.Fr | Lang.En` (enum). Adapter les comparaisons dans les composants (chercher `Lang.Fr` / `Lang.En` dans le codebase).

### Adapter les queries `@nuxt/content`

Les queries utilisent `_locale: props.lang`. Vérifier que la valeur correspond bien au code i18n (`'fr'`/`'en'` au lieu de l'enum).

### `hreflang` auto

`@nuxtjs/i18n` injecte automatiquement les `<link rel="alternate" hreflang="…">` dans le `<head>`. Vérifier dans le HTML prérendu après build.

### Prerender les deux langues

Dans `nuxt.config.ts` :

```ts
nitro: {
  prerender: {
    crawlLinks: true,
    routes: ['/', '/en/', '/legal', '/en/legal'],
    ignore: ['/.netlify'],
  },
},
```

---

## 2. Sitemap — `@nuxtjs/sitemap` (P2 S)

### Installation

```bash
npm install @nuxtjs/sitemap
```

### `nuxt.config.ts`

```ts
modules: [
  '@nuxt/content',
  '@nuxt/image',
  '@nuxtjs/i18n',
  '@nuxtjs/sitemap',       // ← ajouter
],
sitemap: {
  hostname: 'https://owenlebec.fr',
  i18n: true,              // génère les alternates hreflang automatiquement
},
```

Supprimer l'ancien `public/sitemap.xml` statique s'il existe.

---

## 3. Favicon — réduire de 220 Ko à < 5 Ko (P3 S)

`public/favicon.ico` fait 220 Ko (favicon multi-résolution non optimisé).

Options :
- **Simple** : recréer un ICO 32×32 + 16×16 depuis l'image source (`assets/` ou Figma) avec ImageMagick : `convert -resize 32x32 source.png public/favicon.ico`
- **Moderne** : remplacer par un `favicon.svg` + PNG 32×32 en fallback, et mettre à jour `app.vue:17`.

---

## 4. Docs à mettre à jour après livraison

- `CLAUDE.md` : mettre à jour la section Architecture (i18n par URL, sitemap)
- `content/fr/projects/portfolio-dev.md` + `content/en/projects/portfolio-dev.md` : mettre à jour la case study (mention SSR, i18n URL, sitemap)
- `docs/todo-audit-2026-06.md` : cocher les items Lot 3B étape 2

---

## 5. Vérifications post-déploiement Lot 3B complet

- [ ] `curl https://owenlebec.fr/en/` → HTML avec contenu EN + `hreflang`
- [ ] `curl https://owenlebec.fr/sitemap.xml` → URLs FR + EN
- [ ] Google Search Console : soumettre le sitemap
- [ ] Supprimer la double vérification Google (`app.vue:24-27` meta tag + fichier HTML si présent)
