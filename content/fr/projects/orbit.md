---
title: 'Orbit — Tableau de bord développeur'
type: "Projet Personnel"
description: "Dashboard personnel qui centralise l'activité GitHub, le suivi du temps et les métriques de déploiement en un seul endroit."
git: [ "Répertoire Git", "https://github.com/OwenLB/orbit" ]
web: [ "Visiter le démo", "https://orbit-demo.owenlebec.fr" ]
stack: [
  "Nuxt 3",
  "TypeScript",
  "Supabase",
  "GitHub API"
]
---

## Contexte

Travailler sur plusieurs projets en parallèle rend difficile d'avoir une vision claire de son activité : les commits sont sur GitHub, le temps de travail dans un tableur, les alertes de déploiement dans Slack. Ce projet est né de la frustration de devoir jongler entre plusieurs outils pour répondre à une simple question — *qu'est-ce que j'ai fait cette semaine ?*

## Construit

Le dashboard interroge l'API GitHub pour agréger les commits, les PRs et les issues de tous les dépôts liés à un token d'accès. Les données de temps sont stockées dans **Supabase** et saisies via un timer intégré directement dans l'interface. L'authentification repose sur GitHub OAuth pour éviter de gérer une base d'utilisateurs séparée.

Chaque widget est une **island Nuxt** indépendante : cela permet un chargement progressif et évite de bloquer l'interface si une source de données répond lentement. La mise en page est pilotée par une grille CSS avec réordonnancement par glisser-déposer via VueDraggable.

## Appris

Travailler avec le rate limiting de l'API GitHub m'a appris à concevoir le cache côté serveur dès le départ plutôt que de l'ajouter après coup. J'ai aussi découvert que le drag-and-drop dans une grille CSS dynamique demande une gestion soigneuse des transitions pour éviter les sauts visuels — une bonne leçon sur la friction entre animations et layout recalculé en temps réel.
