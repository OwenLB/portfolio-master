# Portfolio Développeur — Owen Le Bec

Portfolio personnel déployé sur [owenlebec.fr](https://owenlebec.fr). Bilingue FR/EN, construit avec Nuxt 3 en mode SPA statique. Contenu entièrement en Markdown via `@nuxt/content`, intégration Spotify live et transitions de page CSS-only.

---

## Stack

| Outil | Rôle |
|---|---|
| Nuxt 3 (`ssr: false`) | Framework SPA — rendu client-side, `nuxt generate` pour le build statique |
| Vue 3 Composition API | Composants et logique réactive |
| TypeScript | Typage du frontmatter, des composables et des types de page |
| @nuxt/content v2 | Système de contenu Markdown — source de vérité sans base de données |
| @nuxt/image | Optimisation des images à la livraison via le provider Netlify |
| SCSS | Design system maison (`space()`, `transition()`, variables CSS custom) |
| Netlify | Hébergement statique + Netlify Functions pour la route Spotify |
| Git LFS | Stockage des images `.webp` hors de l'historique git |
| Umami | Analytics privacy-first, sans cookie |

---

## Architecture

```
content/
  fr/                  → home.md, profile.md, experiences.md, projects/
  en/                  → (structure parallèle)
pages/
  index.vue            → home
  about.vue
  projects/[slug].vue  → page projet dynamique
server/api/
  spotify.ts           → Netlify Function (échange refresh_token → track en cours)
composables/
  useLang.ts           → langue active (cookie + useState)
  useTheme.ts          → thème clair/sombre (cookie + system-preference)
  useCursor.ts         → effet de lumière curseur
middleware/
  project.ts           → validation du slug avant rendu
```

**Système i18n** : pas de module dédié. La locale est un `useCookie()` couplé à un `useState` global. Les queries `queryContent` filtrent par `_locale` et se re-déclenchent via `watch()` au changement de langue — sans navigation ni rechargement.

**Layout CSS Grid** : `.page` définit une grille 4–5 colonnes. `AppHeader` et `AppSection` utilisent `display: contents`, rendant leurs cellules enfants participants directs de la grille du parent quelle que soit la profondeur dans l'arbre de composants.

**Transitions de page** : animation CSS-only via `.cell:before` (`inset` slide). Désactivée via `prefers-reduced-motion`.

---

## Lancer en local

```bash
git clone https://github.com/OwenLB/portfolio-master.git
cd portfolio-master
npm install
npm run dev        # http://localhost:3000
```

Variables d'environnement nécessaires pour l'intégration Spotify (optionnel) :

```
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_REFRESH_TOKEN=
```

Sans ces variables, le widget Spotify affiche simplement "Déconnecté".

---

## Commandes

```bash
npm run dev        # Serveur de développement
npm run build      # Build production (SSR/Nitro)
npm run generate   # Génère le site statique (utilisé par Netlify)
npm run preview    # Prévisualisation du build
```

---

## Ajouter un projet

1. Créer `content/fr/projects/<slug>.md` et `content/en/projects/<slug>.md`
2. Ajouter une image de couverture `public/images/projects/<slug>.webp`
3. Le slug est automatiquement disponible sur `/projects/<slug>` — le middleware valide son existence avant le rendu

Frontmatter attendu :

```yaml
---
title: 'Titre du projet'
type: "Projet Personnel"
description: "Une phrase affichée dans la liste."
git: [ "Répertoire Git", "https://github.com/..." ]   # omettre si privé
web: [ "Voir le site", "https://..." ]                 # omettre si pas de démo
stack: [ "Tech 1", "Tech 2" ]
---
```
