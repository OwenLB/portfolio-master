# Implémentation du dégradé bleu

## Valeurs retenues

**Mode clair** — Azur
```
linear-gradient(135deg, #0e2248, #1a4aa0 60%, #3a8cff)
```

**Mode sombre** — Marine
```
linear-gradient(135deg, #1c5ae0, #70b0ff)
```

**Couleurs de base** (pour les contextes qui ne supportent pas les dégradés)
- Clair : `#3a8cff`
- Sombre : `#70b0ff`

## Où l'appliquer

Le dégradé remplace `var(--primary)` uniquement sur les éléments décoratifs de grande taille. Les éléments interactifs (bordures, hover states) gardent la couleur solide.

**Oui — dégradé :**
- Titre principal : le mot en `color: var(--primary)` dans le `<h1>` (via `background-clip: text`)
- Icône Spotify pill : `background: var(--primary)` sur le cercle

**Non — couleur solide :**
- Bordures et hover des `text-link`
- Toggle langue / thème
- Tout ce qui est petit (< ~20px)
