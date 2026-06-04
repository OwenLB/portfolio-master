# TODO — Audit portfolio (juin 2026)

> Liste de correctifs issue de l'audit du 04/06/2026 (panel : recruteur, ingénieur senior, visiteur non-tech, spécialiste perf/SEO/a11y).
> Audité sur le code source (egress live indisponible : pas de Lighthouse réel ni de test des démos).
>
> Contexte : les audits précédents (`docs/audit-complet.md`, `docs/notation.md`, 20/05/2026, 51/100) décrivaient une version antérieure. Leurs reproches critiques (Spotify hardcodé, clones de tutoriels, canonical `owenlebec.frF`, typo `Toogle`, pas de projets en home, `AUTRES PROJETS` non traduit) sont **déjà corrigés**. Cette todo porte sur l'état actuel.

**Légende :** `P1` fort impact cibles · `P2` moyen · `P3` polish — effort `(S/M/L)`.

> **✅ Lot 1 réalisé le 2026-06-04** (6 commits, un par thème) : skip-link, retrait adresse + téléphone du legal, nettoyage des artefacts + `.idea`, `prefers-reduced-motion`, robustesse Spotify, code mort. Items cochés `[x]` ci-dessous.
>
> **✅ Lot 2 réalisé le 2026-06-04** (5 commits, un par thème) : contraste de l'accent clair (`#1a64d6`, ≈5.2:1), focus visible (`:focus-visible` global), anti-FOUC thème, stagger projets (120 ms), arc photo thémé (`--arc`).
>
> **✅ Lot 3A réalisé le 2026-06-04** (6 commits) : CI, en-têtes de sécurité (CSP Report-Only), JSON-LD `CreativeWork`, Spotify (prod-only + URL web), icônes stack tactiles, retrait `about_button`. Page « À propos » **volontairement abandonnée** (filler). **Lot 3B** (SSR/prerender, i18n par URL, sitemap, favicon) à faire **via la CI**.

---

## 🔴 SEO, indexabilité & partage

- [ ] **P1 (M)** — Sortir du SPA aveugle : activer le **prerender** (`nitro.prerender` / `routeRules` sur `/`, `/projects/*`, `/legal`) pour que le HTML contienne contenu + meta. *Débloque le reste de cette catégorie.* — `nuxt.config.ts`
- [ ] **P1 (S)** — Valider après prerender : le **partage de lien projet** (LinkedIn/Slack/WhatsApp) doit afficher la bonne carte OG (aujourd'hui `useSeoMeta` injecté en JS, invisible des scrapers). — `pages/projects/[slug].vue:29-39`
- [x] **P2 (S)** — **JSON-LD `CreativeWork`** ajouté par projet (indexé une fois le SSR en place). — `pages/projects/[slug].vue`
- [ ] **P2 (S)** — Vérifier le rendu HTML du **JSON-LD `Person`** après prerender. — `app.vue:43-58`
- [ ] **P2 (S)** — Générer le **sitemap** automatiquement (`@nuxtjs/sitemap`) ; ajouter `lastmod` + alternates. — `public/sitemap.xml`
- [ ] **P3 (S)** — Réécrire les **descriptions SEO légales** clichées/hors-sujet. — `content/fr/legal.md:3`, `content/en/legal.md:3`
- [ ] **P3 (S)** — Supprimer la **double vérification Google** (fichier HTML + meta `app.vue:25`). — `app.vue:24-27`

## 🌍 Internationalisation (i18n)

- [ ] **P1 (L)** — i18n par cookie = **une seule URL/page** → anglais invisible des moteurs. Passer aux **préfixes d'URL** (`/en/...`) + **`hreflang`** (garder le cookie pour la préférence). — `composables/useLang.ts`, `nuxt.config.ts`
- [ ] **P2 (S)** — Permettre de **deep-linker/partager une langue** (résolu par le point ci-dessus).
- [ ] **P3 (S)** — Prerender les **deux langues** sur des chemins distincts.

## ♿ Accessibilité

- [x] **P1 (S)** — **Skip-link cassé** hors home : ajouter `id="main-content"` aux `<main>` de `pages/projects/[slug].vue:62`, `pages/legal.vue:31`, `error.vue:9`. — `app.vue:62`
- [x] **P1 (S)** — **Contraste** : accent clair foncé à `#1a64d6` (≈5.2:1, AA). — `assets/scss/style.scss`
- [x] **P1 (S)** — **Focus visible** : règle globale `:focus-visible { outline }` + `outline:none` retirés. — `app.vue`, `Header.vue`, `Footer.vue`, `link/Text.vue`, `link/Project.vue`, `CurrentTrack.vue`, `link/Experience.vue`
- [x] **P2 (S)** — **Reduced-motion** non respecté par Matrix rain, marquee Spotify, égaliseur → gater. — `components/app/Matrix.vue:64-127`, `components/spotify/CurrentTrack.vue:87,164`
- [ ] **P2 (S)** — Pas de `<nav>` ni `role="banner/main/contentinfo"` : ajouter, OU retirer la revendication ARIA fausse de `content/*/projects/portfolio-dev.md:36`.
- [ ] **P2 (S)** — Bouton **langue** sans libellé descriptif → `aria-label`. — `components/app/Header.vue:47`
- [ ] **P3 (S)** — `Experience.vue` : zone de dépliage `<div @click>` souris-only. — `components/link/Experience.vue:32,89`
- [ ] **P3 (S)** — `ProseImg.vue` : `figcaption` duplique l'`aria-label`. — `components/content/ProseImg.vue:25-29`

## ⚡ Performance

- [ ] **P1 (M)** — **LCP** otage du JS (SPA) → résolu par le prerender.
- [ ] **P2 (M)** — **≥ 2 instances de canvas Matrix** en `requestAnimationFrame` continu → une seule + pause `IntersectionObserver`/`visibilitychange`. — `pages/index.vue:85,91`, `components/app/Matrix.vue`
- [ ] **P2 (S)** — **`mousemove` non throttlés** (Matrix × N + `useCursor`). — `components/app/Matrix.vue:133`, `composables/useCursor.ts:14`
- [x] **P2 (S)** — **Flash de thème (FOUC)** : script inline `head` posant `data-theme` depuis le cookie avant peinture. — `nuxt.config.ts`
- [ ] **P2 (S)** — Désactiver/alléger le **Matrix sur mobile** (`< $md`). — `pages/index.vue`
- [ ] **P3 (M)** — Page Finixa : **~200 Ko de SVG inlinés** d'un coup → lazy-load sous la ligne de flottaison. — `components/content/ProseImg.vue:10-16`
- [ ] **P3 (S)** — `favicon.ico` = **220 Ko** → ré-exporter léger. — `public/favicon.ico`
- [ ] **P3 (M)** — `@lottiefiles/lottie-player` (seule dép. runtime) chargée juste pour le 404 → alléger/charger à la demande. — `package.json:21`, `error.vue`

## ✍️ Contenu & narration

- [x] **P1 (M)** — Page « À propos / parcours » : **décidée non retenue** (jugée filler ; parcours déjà porté par la timeline d'expériences + les études de cas projet).
- [x] **P1 (S)** — `about_button` (contenu mort) **supprimé** (FR + EN).
- [ ] **P2 (S)** — Bloc « À propos » home = 2 phrases génériques → renforcer la voix. — `pages/index.vue:99-106`
- [x] **P2 (S)** — **Séniorité** énoncée (« depuis 2021 », alternance comprise) dans la description + le bloc « À propos ». *Mise en avant près du headline → au passage structurel.* — `content/*/home.md`
- [ ] **P3 (S)** — Ouvrir chaque projet par une phrase **résultat/impact**. — `content/*/projects/*.md`
- [ ] **P3 (S)** — **Vérifier les démos live** (`finixa.net`, `scanauto.netlify.app`, `photo.owenlebec.fr`).

## 🧱 Qualité du code & architecture

- [x] **P1 (S)** — **Spotify dédupliqué** : route Nitro `server/api/spotify.ts` supprimée, seule l'edge function Deno (prod) reste.
- [x] **P2 (S)** — Bug `response.status > 400` → `>= 400`. — `server/api/spotify.ts:38`, `netlify/edge-functions/spotify.ts:40`
- [x] **P2 (S)** — Crash si `track.item` null (pub/podcast) → guard. — mêmes fichiers
- [x] **P2 (S)** — **Code mort** : `const cover` jamais utilisé. — `pages/projects/[slug].vue:20-22`
- [ ] **P2 (S)** — `setTimeout(execute, 1000)` artificiel → `onMounted`/scroll. — `pages/projects/[slug].vue:50-54`
- [ ] **P2 (S)** — Collision clé `useAsyncData('legal')` entre `Footer.vue:6` et `legal.vue:14`. — renommer
- [ ] **P3 (S)** — px en dur vs `space()`. — `components/link/Experience.vue`
- [x] **P2 (M)** — **CI ajoutée** (`.github/workflows/ci.yml` : `npm ci` + `npm run generate` sur push/PR). Tests de fumée : optionnels, plus tard.
- [x] **P3 (S)** — Docs (README, CLAUDE.md, case study FR/EN) corrigées : Spotify = edge function Deno.

## 🔒 Sécurité & vie privée

- [x] **P1 (S)** — **Adresse postale + téléphone retirés** du legal (gardé nom, ville, email), FR + EN. — `content/fr/legal.md`, `content/en/legal.md`
- [ ] **P2 (S)** — `mailto:`/`tel:` en clair = spam → obfusquer/form anti-spam. — `content/*/home.md:17,19`
- [x] **P2 (M)** — **En-têtes de sécurité** ajoutés (`netlify.toml` : X-Frame-Options, X-Content-Type-Options, Referrer-Policy, HSTS, Permissions-Policy + **CSP Report-Only**).
- [x] ✅ À conserver — pas de secret exposé, `rel="noopener noreferrer"`, Umami sans cookie.

## 🎨 Design & UX

- [x] **P2 (S)** — **Stagger projets** réduit `400ms → 120ms`/carte. — `components/link/Project.vue:13`
- [x] **P2 (S)** — **Arc photo thémé** via token `--arc` (clair `#89d6ff` / sombre `#16395c`). — `pages/index.vue:276`, `assets/scss/style.scss`
- [x] **P3 (S)** — Lien Spotify : renvoie `external_urls.spotify` (URL web) au lieu de l'URI `spotify:`.
- [x] **P3 (S)** — Icônes de stack affichées au tactile (`@media (hover: none)`). — `components/link/Experience.vue`

## 👋 Première impression & structure de page

- [ ] **P1 (S)** ⏸️ — **Projets above-the-fold** : remonter 1-2 vignettes — *reporté (restructure la grille home → à faire avec preview local).* — `pages/index.vue`
- [ ] **P2 (S)** — **Pas de CTA contact** dans le 1er écran. — `pages/index.vue:157-161`
- [ ] **P3 (S)** — **Accroche factuelle** d'une ligne sous le headline. — `content/*/home.md`

## 🧹 Hygiène du repo & finitions

- [x] **P2 (S)** — Supprimer `components/link/package.json` (stub `npm init` mort).
- [x] **P2 (S)** — Supprimer artefacts dev : `theme-playground.html`, `gradient-implementation.md`, `portfolio-mockup.png`, `docs/scanauto/image.png`.
- [x] **P3 (S)** — Supprimer le favicon Nuxt résiduel `public/nuxt-favicon.ico`.
- [x] **P3 (S)** — Ne plus committer `.idea/` (ajouter au `.gitignore`).
- [x] **P3 (S)** — `.gitignore` ignore `*.png*` mais 2 PNG committés → cohérenciser.
- [x] **P3 (S)** — Typo « Addresse » (ligne supprimée avec l'adresse). — `content/fr/legal.md`
- [ ] **P3 (S)** — Email contact `@yahoo.fr` alors que `owenlebec.fr` dispo → `owen@owenlebec.fr`. — `content/*/home.md:17`, `legal.md`

---

## Volume & ordre conseillé

~50 items : **P1 ≈ 11**, **P2 ≈ 22**, **P3 ≈ 17**.

- **Lot 1 — correctifs courts, faible risque** ✅ *fait le 2026-06-04* : skip-link, retrait adresse + téléphone, artefacts repo, reduced-motion, bugs Spotify (`>=400` + `item` null), code mort (`cover`).
- **Lot 2 — a11y visuelle & UX** ✅ *fait le 2026-06-04* : contraste accent, focus visible, FOUC thème, stagger, arc thémé.
- **Lot 3A — sûr, sans dépendance** ✅ *fait le 2026-06-04* : CI, en-têtes sécurité (CSP Report-Only), JSON-LD CreativeWork, dédup Spotify + URL web, icônes stack tactiles, retrait `about_button`.
- **Lot 3B — architectural, à valider par build/CI** : migration SSR + prerender (SEO/OG/LCP), i18n par URL + hreflang (`@nuxtjs/i18n`), sitemap auto (`@nuxtjs/sitemap`), favicon 220 Ko à ré-exporter.
- **En attente de toi** : cadrage séniorité, vignettes projet above-the-fold (preview local).
