---
title: 'Orbit — Developer Dashboard'
type: "Personal Project"
description: "Personal dashboard that centralises GitHub activity, time tracking and deployment metrics in one place."
git: [ "Git Repository", "https://github.com/OwenLB/orbit" ]
web: [ "Visit Demo", "https://orbit-demo.owenlebec.fr" ]
stack: [
  "Nuxt 3",
  "TypeScript",
  "Supabase",
  "GitHub API"
]
---

## Context

Working across multiple projects at once makes it hard to have a clear picture of your activity: commits are on GitHub, work time in a spreadsheet, deployment alerts in Slack. This project grew out of the frustration of juggling several tools to answer a simple question — *what did I actually ship this week?*

## Built

The dashboard queries the GitHub API to aggregate commits, PRs and issues from all repositories linked to an access token. Time data is stored in **Supabase** and entered via a built-in timer widget. Authentication uses GitHub OAuth, removing the need to manage a separate user database.

Each widget is an independent **Nuxt island**: this enables progressive loading and prevents a slow data source from blocking the whole UI. Layout is handled by a CSS grid with drag-and-drop reordering powered by VueDraggable.

## Learned

Working with GitHub API rate limiting taught me to design server-side caching from the start rather than bolting it on later. I also found that drag-and-drop inside a dynamic CSS grid requires careful transition handling to prevent visual jumps — a useful lesson on the friction between animations and dynamically recalculated layouts.
