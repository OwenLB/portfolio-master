---
order: 3
title: 'Portfolio Développeur'
type: "Projet Personnel"
description: "Portfolio bilingue construit avec Nuxt 3 en mode SPA statique — contenu Markdown, intégration Spotify live et transitions de page CSS-only."
git: [ "Répertoire Git", "https://github.com/OwenLB/portfolio-master" ]
web: [ "Voir le site", "https://owenlebec.fr" ]
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

## Contexte

Portfolio personnel qui regroupe projets, expériences et informations de contact. Le site gère deux langues (FR/EN) sans module i18n dédié, embarque une intégration Spotify temps réel pour afficher le morceau en cours d'écoute, et est déployé statiquement sur Netlify. Même en mode purement statique, la route API Spotify tourne via Netlify Functions grâce à Nitro.

## Stack & Architecture

- **Nuxt 3 (`ssr: false`)** — mode SPA : le build (`nuxt generate`) produit un shell HTML statique, le rendu est entièrement client-side. Ce choix simplifie les transitions de page animées et la gestion de l'état global (thème, langue) sans contraintes d'hydratation serveur.
- **@nuxt/content v2** — contenu entièrement en Markdown avec frontmatter typé TypeScript. Pas de base de données ni d'API REST — les fichiers `.md` sont la source de vérité, requêtés via `queryContent()`.
- **i18n maison via cookie** — la langue active est un `useCookie()` couplé à un `useState` global (`useLang.ts`). Les queries `queryContent` filtrent par `_locale`, avec `watch()` pour un refetch automatique sans navigation.
- **SCSS sans framework CSS** — design system maison : fonction `space($n)` (= `n × 4px`), mixin `transition()`, variables CSS custom pour le thème clair/sombre (`--primary`, `--background`, `--accent`, `--text`).
- **@nuxt/image avec provider Netlify** — les images de couverture des projets (`.webp`) sont servies via le CDN Netlify avec redimensionnement automatique à la livraison.
- **Git LFS** — les `.webp` sont trackées via `.gitattributes` pour éviter de stocker des binaires lourds dans l'historique git.
- **Nitro server route** — `/server/api/spotify.ts` s'exécute comme Netlify Function. Échange le refresh token contre un access token à chaque appel, sans stocker de token ni exposer les credentials côté client.
- **Umami Analytics** — script async chargé via `useHead`, sans cookie, sans transmission de données personnelles à des tiers.

## Points techniques notables

- **CSS Grid avec `display: contents`** : la grille principale est définie sur `.page` (4–5 colonnes). `AppHeader` et `AppSection` utilisent `display: contents`, ce qui rend leurs cellules enfants participants directs de la grille du parent, quelle que soit la profondeur dans l'arbre Vue. Layout éditorial sans wrappers parasites — mais `display: contents` retire les éléments de l'arbre d'accessibilité, ce qui a demandé des ajustements ARIA sur les composants concernés.

- **Transition de page CSS-only** : les transitions utilisent le pseudo-élément `.cell:before` positionné hors écran par défaut (`inset: -1px calc(100% + 1px) -1px -1px`). La classe `.page-leave-to` le fait glisser sur toute la cellule, créant un effet de volets fermants coordonnés. Zéro JavaScript, uniquement les hooks Nuxt page transitions + CSS. Désactivé proprement via `prefers-reduced-motion`.

- **Middleware de validation de slug** : `middleware/project.ts` exécute un `queryContent()` avant le rendu de la page projet. Si le slug n'existe pas dans la locale courante, `abortNavigation()` est appelé — la navigation est annulée proprement plutôt que de rendre une page vide.

- **SVG inlinés pour les diagrammes** : `ProseImg.vue` détecte les images `.svg` et les récupère via `useFetch` pour les injecter en HTML brut dans un `.svg-wrapper`. Les diagrammes sont ainsi thémables via CSS — d'où les overrides explicites de `fill`, `stroke` et `color` sur les éléments SVG internes dans `[slug].vue` pour le mode sombre.

- **Stagger animation via IntersectionObserver** : la liste des projets s'anime avec un `IntersectionObserver` (threshold 0.6). Chaque lien projet reçoit un `transitionDelay` calculé depuis son index (`index × 400ms`), créant l'entrée décalée sans librairie d'animation.

## Ce que j'ai appris

Concevoir un layout CSS Grid qui traverse plusieurs niveaux de composants Vue via `display: contents` demande une connaissance précise de l'impact sur l'arbre d'accessibilité : les éléments avec `display: contents` sont transparents pour le DOM visuel mais pas pour les lecteurs d'écran. La transition de page CSS-only a demandé plusieurs itérations de timing pour coordonner la sortie de l'ancien composant et l'entrée du nouveau sans flash de contenu entre les deux.

---

## Schémas

### Architecture globale

![Architecture globale](/diagrams/portfolio-dev/architecture.svg)

---

### Système i18n réactif

![Système i18n réactif](/diagrams/portfolio-dev/i18n.svg)

---

### Structure du layout CSS Grid

![Structure CSS Grid](/diagrams/portfolio-dev/grid.svg)
