# Notation Portfolio — Owen LE BEC

> Notation effectuée le 20/05/2026. Barème sur 100 points.

---

## 1. Qualité du code — 16 / 25

**Justification**
La base est solide : TypeScript partout, Composition API cohérent, composables à responsabilité unique, nommage des composants lisible, système SCSS avec `space()` et `transition()` bien utilisé. Cependant, `SpotifyCurrentTrack.vue` expose des données hardcodées alors que l'API server-side existe — feature vitrine brisée. Bug canonical dans `legal.vue` (`owenlebec.frF`). `useLang()` appelé hors contexte dans le middleware (violation du cycle de vie Nuxt). Typo `Toogle` propagée dans l'enum et la méthode. Commits non atomiques : 5× "fix css xp" le même jour, mélange FR/EN, format conventionnel appliqué aléatoirement.

**Actions pour améliorer**
1. Implémenter `useFetch('/api/spotify')` dans le composant et retirer les données hardcodées
2. Adopter un format de commit strict (conventional commits) et regrouper les correctifs

---

## 2. Architecture technique — 10 / 20

**Justification**
La séparation contenu/présentation via `@nuxt/content` est une décision mûre. Les credentials Spotify sont correctement isolés via `runtimeConfig` — aucun secret exposé au client. Mais : zéro test (unitaire, intégration, e2e) dans une base de code présentée comme vitrine de qualité. Aucun pipeline CI/CD. `ssr: false` sur un portfolio SEO-dépendant interroge. `nuxt3` (package déprécié) en `dependencies` runtime. `@nuxt/image-edge` (version instable avec hash de commit) en production.

**Actions pour améliorer**
1. Ajouter un GitHub Action qui exécute `nuxt build` sur chaque PR
2. Retirer `nuxt3` des dépendances et remplacer `@nuxt/image-edge` par `@nuxt/image` stable

---

## 3. Contenu & narration — 8 / 20

**Justification**
La section Expérience est structurée et couvre 5 postes avec stack technologique. Mais aucun projet n'est visible sur la homepage. Les descriptions de projets ne répondent à aucune des trois questions attendues (problème / solution / impact). WeatherApp est rédigé au "nous" comme un rapport académique. Uber Clone est affiché "en cours de développement" sans justification narrative. Les descriptions d'expérience sont vagues ("Creating POCs within the Innovation department"). La bio répète le même cliché deux fois dans deux langues.

**Actions pour améliorer**
1. Ajouter 2-3 cartes projet sur la homepage entre la section expérience et le contact
2. Réécrire chaque description projet : Contexte → Ce que j'ai construit → Ce que ça m'a appris

---

## 4. Pertinence & positionnement — 6 / 15

**Justification**
Le design visuel est distinctif et au-dessus de la moyenne : grid layout CSS avancé, typographie PP Formula Condensed, transitions de page, custom cursor. Mais déconnexion majeure entre le niveau réel et ce qui est montré : 3 ans d'expérience professionnelle (Naval Group, Arkea, Thales) réduits à 3 clones/tutoriels. Profil "Full Stack" sans aucun backend original visible. Apple Clone affiche un lien crédit JSMastery — reconnaissable par tout recruteur tech.

**Actions pour améliorer**
1. Construire un projet personnel original full-stack (même simple) avec frontend + API + BDD, déployé
2. Produire un mini case study sur le projet Naval Group : problème, contraintes, choix d'architecture

---

## 5. Copywriting — 3 / 10

**Justification**
"J'adore explorer de nouvelles technologies web et je suis toujours en quête de nouvelles compétences" apparaît mot pour mot dans home.md et about.md — formulation la plus commune de tous les portfolios dev. Fautes visibles dans le contenu rendu : `PostreSQL` × 3, `"outil de destion des ressources"`, `AUTRES PROJETS` en français sur la page anglaise. Section contact sans accroche. Headline "FULL STACK WEB DEVELOPER" correct mais ne différencie pas.

**Actions pour améliorer**
1. Corriger les fautes (`PostreSQL`, `destion`, `AUTRES PROJETS`, canonical `owenlebec.frF`) — 30 minutes, impact immédiat
2. Réécrire le headline et la bio : 1 fait concret, 1 différenciateur, 0 cliché

---

## 6. Complétude — 5 / 10

**Justification**
Le portfolio est bilingue (effort significatif). Un CV PDF est disponible. Apple Clone a une démo live fonctionnelle. La page légale est présente et complète. Mais : Uber Clone marqué "en développement" fragilise la crédibilité. WeatherApp sans démo live. Feature Spotify techniquement incomplète (API non appelée). Aucun test documenté.

**Actions pour améliorer**
1. Retirer l'Uber Clone du portfolio publié jusqu'à finition, ou le relabeller "sandbox d'apprentissage"
2. Finaliser l'intégration Spotify (appel API réel) pour que la feature soit complète end-to-end

---

## 7. Première impression — 3 / 5

**Justification**
L'identité visuelle est immédiatement reconnaissable : grid layout avec séparateurs 1px, typographie condensée, fond topographique, transitions entre pages — un non-technicien voit "ce développeur soigne son travail". Mais en 10 secondes sur la homepage, aucun projet n'est visible. Le Spotify widget affiche une chanson figée (hardcodée). La section "À propos" commence par un texte générique, pas par un fait différenciant.

**Actions pour améliorer**
1. Insérer 1-2 projets visuels sur la homepage au-dessus de la ligne de flottaison
2. Remplacer le greeting générique par une ligne d'accroche factuelle

---

## Score global

| Critère | Obtenu | Maximum |
|---|---|---|
| Qualité du code | 16 | 25 |
| Architecture technique | 10 | 20 |
| Contenu & narration | 8 | 20 |
| Pertinence & positionnement | 6 | 15 |
| Copywriting | 3 | 10 |
| Complétude | 5 | 10 |
| Première impression | 3 | 5 |
| **Total** | **51** | **100** |

**Verdict :** Un portfolio avec une carcasse technique et visuelle au-dessus de la moyenne, plombé par un contenu qui ne reflète pas le niveau réel et des finitions manquantes qui fragilisent la crédibilité.

**Critère le plus urgent :** Contenu & narration (8/20 — 40% du maximum). Ajouter des projets sur la homepage, réécrire les descriptions selon le format problème/solution/impact, et retirer l'Uber Clone non terminé peut faire passer ce critère de 8 à 14+ en quelques heures de travail.
