# Finir l'audit — ce qu'il reste à faire

> Guide des 3 derniers items non cochés de [`docs/todo-audit-2026-06.md`](./todo-audit-2026-06.md).
> Pour chaque tâche : **ce que toi seul peux faire** (UI Netlify, vérif live) vs **ce que Claude peut coder** une fois débloqué.

---

## 1. Retirer le plugin sitemap legacy (P2) — ✅ FAIT (2026-06-05)

- Plugin `@netlify/plugin-sitemap` désinstallé dans l'UI Netlify (ton action).
- Bloc `[[plugins]]` retiré de `netlify.toml` + commit/push (`b61bb22`).
- Dette Lot 3B soldée. `@nuxtjs/sitemap` reste seul propriétaire de `/sitemap.xml`.

> À surveiller au prochain déploiement Netlify : confirmer que le build passe toujours (plus d'`EISDIR`) — ce qui est attendu puisque le plugin n'est plus appelé ni par l'UI ni par le toml.

---

## 2. Content-Type du sitemap (P2) — ✅ FAIT (2026-06-05)

**Investigation a révélé que la prémisse de l'item était fausse.** L'architecture réelle du sitemap :

| URL | Rôle | Content-Type |
|-----|------|-------------|
| `/sitemap.xml` | **Redirection HTML** (meta-refresh) vers l'index — générée par `@nuxtjs/sitemap` sous i18n | `text/html` (normal) |
| `/sitemap_index.xml` | **Le vrai index** (liste fr-FR + en-US) | `application/xml` ✅ |
| `/__sitemap__/fr-FR.xml`, `en-US.xml` | Sous-sitemaps par locale | `application/xml` ✅ |

Forcer `application/xml` sur `/sitemap.xml` (commit `7a02037`) a **cassé** la redirection : le navigateur parsait le HTML meta-refresh comme du XML → `XML Parsing Error: mismatched tag </meta>`. **Annulé** (commit `d1997e4`).

**Vraie correction** (commit `d1997e4`) :
- `netlify.toml` : header retiré + note expliquant pourquoi ne pas forcer le type.
- `public/robots.txt` : `Sitemap:` pointe désormais sur **`/sitemap_index.xml`** (au lieu de `/sitemap.xml`) → les crawlers attaquent directement le XML valide, sans la redirection meta-refresh que Googlebot ne suit pas pour les sitemaps.

> **À faire de ton côté, après le prochain deploy :**
> 1. `https://owenlebec.fr/sitemap.xml` ne doit plus afficher d'erreur XML (il redirige de nouveau normalement).
> 2. `https://owenlebec.fr/robots.txt` doit montrer `Sitemap: …/sitemap_index.xml`.
> 3. **Google Search Console** : soumettre `https://owenlebec.fr/sitemap_index.xml` comme sitemap.

---

## 3. Lazy-load des ~200 Ko de SVG Finixa (P3) — *dev + tes yeux requis*

Le plus délicat. Aujourd'hui, `components/content/ProseImg.vue` fait un **`await useFetch` au setup** (ligne 11) : le SVG est inliné **dans le HTML prérendu** au build. Avantage : zéro requête au runtime, pas de décalage de mise en page. Inconvénient : la page Finixa charge ~200 Ko de SVG d'un coup, y compris ceux tout en bas.

Risque si on passe en chargement client à l'intersection : les diagrammes **disparaissent du HTML prérendu**, et leur chargement après coup fait « sauter » le contenu en dessous → **CLS** (Cumulative Layout Shift, mauvais pour la perf).

**Ton action :** lancer le dev server et rester dispo pour valider visuellement.

```
! npm run dev
```
Puis ouvre `http://localhost:3000/projects/finixa`.

**Travail à deux :**
1. Claude modifie `ProseImg.vue` pour ne fetch le SVG **qu'à l'approche du viewport** (`IntersectionObserver`, comme déjà fait pour les projets liés dans `pages/projects/[slug].vue`).
2. Pour **éviter le CLS**, réserver la place du SVG avant chargement (hauteur/ratio de placeholder). C'est le point qui demande tes yeux : vérifier que les diagrammes gardent leur place pendant le scroll.
3. Comparer avant/après dans l'onglet **Network** des DevTools (les SVG du bas ne partent plus au chargement initial) et **Lighthouse** pour confirmer que le CLS reste à ~0.

> **Avis honnête :** P3 « polish », vrai risque de régression visuelle, gain limité à **une seule page**. Pour clôturer l'audit sans risque, on peut **laisser cet item reporté assumé** (comme déjà noté dans la todo) et ne traiter que les items 1 et 2.

---

## Récap & ordre conseillé

| # | Ton action | Action Claude | Bloquant ? |
|---|-----------|--------------|-----------|
| ~~**1**~~ | ✅ Plugin retiré dans l'UI Netlify | ✅ Bloc `[[plugins]]` supprimé, commit `b61bb22` | — Fait |
| ~~**2**~~ | ✅ Header vérifié (`text/html`) | ✅ Header `Content-Type` XML ajouté, commit `7a02037` | — Fait (re-vérifier post-deploy) |
| **3** | `! npm run dev` + valider à deux | Lazy-load + placeholder anti-CLS | Optionnel (P3) |

**Le plus rapide pour « finir » :** faire l'action UI de l'item 1 et le `curl` de l'item 2 → de quoi clôturer les deux P2. L'item 3 (P3) est le seul qui mérite une vraie session à deux, et il est légitime de le laisser reporté.
