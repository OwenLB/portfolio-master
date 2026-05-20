# Audit Portfolio — Owen Le Bec

> Audit effectué le 20/05/2026. Perspectives combinées : tech lead, UX copywriter, recruteur expérimenté.

---

## 1. Qualité du code

### Verdict global

**Points forts**
- Composition API + TypeScript partout, cohérent
- Types bien définis pour chaque entité métier (`Project`, `Experience`, `Spotify`, etc.)
- Les composables (`useLang`, `useTheme`, `useCursor`) sont propres, courts, responsabilité unique
- La structure `App*` / `Link*` / `Content*` / `Spotify*` est lisible et prévisible

**Points faibles — par ordre de gravité**

**Critique : la Spotify API n'est jamais appelée.** `SpotifyCurrentTrack.vue` affiche des données hardcodées (`title: "Sundress", artist: "A$AP Rocky"`). Le fichier `server/api/spotify.ts` existe mais n'est jamais `$fetch`-é depuis le composant. Pour tout tech qui ouvre le code, c'est un signal d'alarme immédiat : feature brisée exposée fièrement sur la homepage.

**Bug silencieux dans `legal.vue`** : l'URL canonique est `'https://owenlebec.frF' + path` (capital `F` parasite). Mauvais signal SEO.

**`useLang()` appelé hors contexte dans `middleware/project.ts`** : le composable est invoqué au niveau module, en dehors de `defineNuxtRouteMiddleware`. Cela fonctionne par chance mais c'est une violation du cycle de vie Nuxt.

**`link/package.json`** dans `components/link/` : artifact de développement qui n'a rien à faire en production.

**`nuxt3` en dépendance runtime** (`dependencies`) en plus de `nuxt` en devDependency. `nuxt3` est un package déprécié. C'est une redondance qui interroge sur la maîtrise de l'outillage.

**Typo dans le nom de l'enum** : `Toogle` (Header.vue) au lieu de `Toggle`. Répercuté dans la méthode `toogle()`.

**`setTimeout(() => execute(), 1000)`** dans `[slug].vue` pour charger les projets liés : délai artificiel d'une seconde sans justification. Devrait être un `onMounted` ou une stratégie de lazy load propre.

**`any` type** dans `spotify.ts` : `(artist: any) => artist.name`. Mineur mais inutile dans une base TypeScript.

**Bloc commenté volumineux** dans `types/pages/about.ts` (le type Experience complet mis en commentaire). Mort code.

**Mélange de valeurs hardcodées et de `space()`** dans `Experience.vue` : `margin: 8px 0`, `padding: 0 12px`, `height: 36px` au lieu d'utiliser la fonction `space()` définie dans le système de design.

**`AUTRES PROJETS`** hardcodé en français dans `pages/projects/[slug].vue`. Site bilingue, oubli de traduction.

**Recommandations prioritaires**
1. Implémenter l'appel `$fetch('/api/spotify')` dans `SpotifyCurrentTrack.vue` et retirer les données hardcodées
2. Corriger le bug canonical `owenlebec.frF`
3. Déplacer `useLang()` à l'intérieur de `defineNuxtRouteMiddleware` dans le middleware
4. Supprimer `link/package.json` et `nuxt3` de `dependencies`
5. Corriger `Toogle` → `Toggle` partout

---

## 2. Architecture technique

### Verdict global

**Points forts**
- La séparation contenu/présentation via `@nuxt/content` est élégante : modifier le portfolio ne touche jamais le code Vue
- Le système de theming CSS custom properties + data-attribute est propre et performant
- `useCursor`, `useTheme`, `useLang` : responsabilité unique, réutilisables, cookie-persistés correctement
- Les secrets Spotify restent server-side via `runtimeConfig` — aucun credential exposé au client
- Le grid layout avec `display: contents` sur les sections est une approche technique créative et bien exécutée

**Points faibles**

**`ssr: false` dans `nuxt.config.ts`** : le site est rendu côté client. Avec `nuxt generate`, Nuxt produit des shells HTML mais le contenu est injecté côté client. Pour un portfolio dont l'objectif est d'être trouvé sur Google, c'est un compromis SEO significatif.

**Zéro test** : aucun test unitaire, d'intégration, ni e2e. Pour un portfolio destiné à démontrer la qualité du code à des recruteurs tech, c'est une absence qui se remarque.

**`@nuxt/image-edge`** (version instable avec hash de commit) en production. Inutilement risqué pour une feature non critique.

**Pas de CI/CD** : aucun GitHub Action. Un pipeline qui valide au moins le build TypeScript renforcerait la crédibilité.

**L'Experience type a `sub_content`** avec une structure dupliquée en inline. Le sous-type `SubExperience` mériterait d'être extrait et réutilisé.

**La duplication de code dans `LinkExperience.vue`** : le template de sous-expérience reproduit manuellement le même HTML que l'expérience parente.

**Recommandations prioritaires**
1. Activer `ssr: true` et valider que le rendu static fonctionne correctement pour le SEO
2. Ajouter une GitHub Action minimale : `nuxt build` sur les PR
3. Remplacer `@nuxt/image-edge` par la version stable `@nuxt/image`
4. Extraire `SubExperience` comme interface et composant dédiés

---

## 3. Architecture du contenu

### Verdict global

**Points forts**
- Le système bilingue est bien pensé et transparent pour l'utilisateur
- La section Expérience est la plus riche et la plus précise du portfolio
- La page About avec photo + CV + lien photographie donne une identité personnelle

**Points faibles — sévères**

**Les projets sont absents de la homepage.** Un visiteur qui parcourt uniquement la page d'accueil voit : titre → Spotify → bio → expérience → contact. Aucun projet.

**Les 3 projets sont des clones de tutoriels.**
- Apple Clone : le lien de crédit pointe vers une vidéo JSMastery — reconnaissable par tout recruteur tech
- Uber Clone : marqué "en cours de développement" — ne devrait pas être showcasé dans cet état
- WeatherApp : projet académique de groupe ("nous avons développée")

**Déconnexion totale entre le vrai niveau et ce qui est montré.** Le travail le plus impressionnant (Blazor/.NET Naval Group 16 mois, Vue + Spring Boot Arkea 2 ans, React + Spring Boot Thales) est réduit à 3 lignes dans la section expérience et invisible en tant que projet.

**Recommandations prioritaires**
1. Créer une section projets sur la homepage (même réduite à 2 cartes)
2. Retirer l'Uber Clone du portfolio tant qu'il n'est pas terminé
3. Créer 1 ou 2 projets originaux full-stack (frontend + backend) sans tutoriel
4. Envisager un case study light sur le projet Naval Group : problème technique, contraintes, choix d'architecture

---

## 4. Copywriting & narration

### Verdict global

**Points faibles**

**Le headline est générique.** "FULL STACK WEB DEVELOPER" dit ce que tu fais, pas ce que tu apportes ni à qui.

**La bio répète les mêmes clichés :**
- "j'adore explorer de nouvelles technologies web" (home.md)
- "I love exploring new web technologies" (about.md)
- "I am always looking for new skills to acquire" (about.md)

**Les descriptions de projets ne répondent pas à "problème / solution / impact"** :
- Apple Clone : liste de features copy-paste d'un tuto
- WeatherApp : rédigé à la 1ère personne du pluriel ("nous", "notre projet") — rapport de stage
- Uber Clone : commence par "🛠️ Projet en cours de développement"

**Les descriptions d'expérience sont trop vagues** :
- "Creating POCs within the Innovation department" — quels POCs ? Quel résultat business ?
- "Development of a scheduling tool for workshops" — pour combien d'utilisateurs ? Quel gain ?

**Fautes & bugs de contenu à corriger :**
- `"outil de destion des ressources"` → `"gestion"` (fr/home.md)
- `"PostreSQL"` → `"PostgreSQL"` (3 occurrences dans fr/home.md)
- `"AUTRES PROJETS"` hardcodé en FR sur la page projet en anglais
- Canonical URL : `owenlebec.frF`

**Les calls-to-action sont faibles.** La section contact s'appelle "CONTACT" et propose un email et un téléphone sans accroche.

**Recommandations prioritaires**
1. Réécrire le headline : quelque chose de factuel et différenciant
2. Réécrire chaque description de projet selon le format : Contexte → Ce que j'ai construit → Ce que j'ai appris
3. Réécrire la bio à la 1ère personne singulière avec un fait concret
4. Corriger toutes les fautes listées ci-dessus
5. Ajouter une accroche à la section contact

---

## 5. Pertinence & positionnement

### Verdict global

**Ce qu'un recruteur tech verra positivement en 2 minutes**
- Architecture Nuxt 3 clean, TypeScript partout, bonne séparation des responsabilités
- Système bilingue et theme toggle bien implémentés
- Grid layout avec `display: contents` montre une maîtrise CSS avancée
- Transitions de page et custom cursor montrent une attention au détail UI

**Ce qu'un recruteur tech verra négativement en 2 minutes**
- La Spotify API n'est pas appelée — données hardcodées → feature incomplète
- Zéro test dans une base de code présentée comme vitrine de qualité
- `nuxt3` comme dépendance runtime → questionable
- Tous les projets sont des clones de tutoriels YouTube
- `ssr: false` → question sur la compréhension du SEO

**Ce qu'un recruteur RH comprendra**
- Développeur web depuis 2021, expérience en entreprise sérieuse (Thales), bonne progression
- Portfolio visuellement soigné — signe de soin apporté au travail
- Ne comprendra pas : pourquoi des projets "en développement" sont montrés

**Ce qu'un client freelance retiendra**
- Positif : beau rendu visuel, montre qu'il peut livrer des interfaces propres
- Négatif : aucun projet de A à Z livré pour un vrai usage, "en cours de développement" sur un projet principal

**Le portfolio se démarque-t-il ?**
- Visuellement : **oui, clairement au-dessus de la moyenne**
- Contenu : **non, dans la masse** — trois clones de tutoriels, bio générique

---

## Top 5 des actions à fort impact

**#1 — Brancher l'API Spotify (1h)**
Implémenter `const { data } = await useFetch('/api/spotify')` dans `SpotifyCurrentTrack.vue`. Feature brisée exposée sur la homepage = signal d'alarme immédiat pour tout tech.

**#2 — Ajouter un projet original full-stack (2-4 semaines)**
Un projet personnel de bout en bout : frontend Vue ou React + backend (Spring Boot ou Node) + base de données, déployé. Même une app simple construite entièrement par toi vaut 10× plus qu'un clone Apple.

**#3 — Corriger les fautes et le bug canonical (30 min)**
`PostreSQL` × 3, `destion`, `AUTRES PROJETS` en FR sur page EN, `owenlebec.frF`. Visibles dans le contenu rendu.

**#4 — Réécrire les descriptions de projets (2-3h)**
Pour chaque projet : **Contexte** → **Ce que j'ai construit** → **Ce que j'ai appris**. Supprimer WeatherApp en "nous". Retirer ou relabeller Uber Clone.

**#5 — Ajouter une section projets sur la homepage (2-4h)**
Le chemin actuel : hero → Spotify → bio → expériences → contact. Aucun projet visible. Ajouter 2-3 cartes projet entre expérience et contact. Impact maximal pour les recruteurs qui scannent en 90 secondes.
