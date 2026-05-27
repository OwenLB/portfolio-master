# Prompt — Generate portfolio project description

Tu es dans le repo de mon portfolio photo. Analyse le projet en profondeur puis génère une description structurée destinée à être affichée sur mon portfolio de développeur (owenlebec.fr).

## Ce que tu dois faire

1. **Explorer le repo** : structure des dossiers, fichiers de config, dépendances (`package.json`, `nuxt.config`, `next.config`, etc.), code source, scripts de build, infra/hosting si visible.
2. **Identifier la stack complète** : framework, langage, styling, stockage des images, base de données, hébergement, CI/CD, outils d'optimisation.
3. **Comprendre les choix d'architecture** : SSG/SSR/ISR, gestion des images (format, compression, lazy loading, CDN), routing, internationalisation, performances.
4. **Repérer ce qui est techniquement intéressant** : patterns utilisés, optimisations, décisions non-triviales, ce qui a été ré-écrit par rapport à une éventuelle version précédente.

## Output attendu

Génère **deux fichiers Markdown** : `content/fr/projects/<slug>.md` et `content/en/projects/<slug>.md`.

### Frontmatter obligatoire

```markdown
---
title: '<Titre du projet>'
type: "<Type>"          # ex : "Projet Personnel" / "Personal Project" / "Freelance"
description: "<Une phrase — affichée dans la liste des projets>"
git: [ "<Label>", "<URL>" ]   # omettre si repo privé
web: [ "<Label>", "<URL>" ]   # omettre si pas de démo
stack: [
  "<Techno 1>",
  "<Techno 2>",
  "<Techno 3>"
]
---
```

### Corps du fichier

Génère le contenu en **français** et en **anglais**, dans le format suivant :

---

### FR

**Contexte**
[2-3 phrases : quel est le projet, pour qui, pourquoi il a été re-développé, quel problème l'ancienne version avait]

**Stack & Architecture**
[Liste des technos avec pour chacune une justification courte du choix — pas juste les noms]

**Points techniques notables**
[3-5 bullet points sur les décisions d'archi ou d'implémentation les plus intéressantes — optimisation images, routing, perf, patterns, etc.]

**Ce que j'ai appris / apporté**
[1-2 phrases sur l'apport personnel, ce qui a été le plus challengeant]

---

### EN

[Même structure en anglais]

---

## Contraintes

- Sois précis et technique — c'est pour un public de développeurs et de recruteurs tech
- Évite le bullshit marketing ("solution innovante", "expérience utilisateur optimale")
- Si tu ne trouves pas d'info sur un point, dis-le explicitement plutôt que d'inventer
- Si tu détectes une version précédente (ancienne branche git, commentaires, TODO), mentionne ce qui a changé
- Génère **obligatoirement** tous les schémas que tu juges pertinents parmi :
  - Architecture globale (client / serveur / CDN / stockage)
  - Pipeline de build et déploiement
  - Flux de traitement des images (upload → compression → delivery)
  - Routing et structure des pages
  - Flux de données (fetch → cache → rendu)
  - Tout autre schéma qui aide à comprendre une décision technique non-triviale
- Format des schémas : **Mermaid en priorité** (flowchart, sequenceDiagram, graph TD…), ASCII en fallback si Mermaid ne convient pas
- Minimum 2 schémas, pas de maximum — génère tout ce qui apporte de la clarté
