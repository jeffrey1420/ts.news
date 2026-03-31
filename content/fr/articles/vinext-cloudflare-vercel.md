---
title: "vinext de Cloudflare : le projet controversé qui a reconstruit Next.js en une semaine"
description: "Comment Cloudflare a utilisé l'IA pour recréer le framework phare de Vercel et ce que cela signifie pour l'avenir du développement web"
date: "2026-03-21"
category: "deep-dive"
author: lschvn
tags: ["cloudflare", "vercel", "controversy", "vinext"]
readingTime: 12
image: "https://cf-assets.www.cloudflare.com/zkvhlag99gkb/64oL10LCSz30EiEHWVdJPG/aeaed48a681ec3d5bc9d8cb6e5e30a96/BLOG-3194_1.png"
tldr:
  - "vinext réimplémente l'API Surface de Next.js comme plugin Vite, construit principalement par IA (Claude Code) pour ~1 100$ de tokens API en une semaine."
  - "Sur une app de 33 routes, vinext build 4,4x plus vite (1,67s vs 7,38s) avec des bundles clients 57% plus petits (72,9KB vs 168,9KB)."
  - "Le projet inclut 1 700+ tests Vitest et 380 tests E2E Playwright ; CIO.gov fonctionne déjà avec vinext en production."
  - "vinext se déploie natiquement sur Cloudflare Workers avec les bindings D1/R2/KV et supporte aussi Vercel, Netlify et AWS via Nitro."
faq:
  - question: "vinext peut-il vraiment remplacer Next.js ?"
    answer: "vinext couvre 94% de l'API Surface publique de Next.js selon le README. Les limites incluent le rendu statique au moment du build (feuillet de route), certains cas limites du streaming RSC, et les API internes non documentées de Next.js. Pour CIO.gov, les améliorations de temps de build et de taille de bundle sont décrites comme significatives."
  - question: "Le code généré par IA est-il fiable ?"
    answer: "Le projet Cloudflare souligne que presque chaque ligne a été écrite par IA mais passe les mêmes portes de qualité que le code écrit par humain. Plus de 1 700 tests Vitest et 380 tests Playwright E2E sont inclus. L'ingénieur a noté : 'Il y avait des PR qui étaient simplement fausses. L'IA implémentait avec confiance quelque chose qui semblait juste mais ne correspondait pas au comportement réel de Next.js.'"
  - question: "Comment vinext se compare-t-il à OpenNext ?"
    answer: "Cloudflare affirme que построить поверх вывода Next.js как фундамента оказалось сложным и хрупким подходом. Reconstruire from scratch plutôt que d'adapter la sortie promet une compatibilité plus stable. OpenNext doit reverse-engineer la sortie de build de Next.js, ce qui donne des changements imprévisibles entre versions."
---

Le 24 février 2026, Cloudflare a publié un billet de blog qui a envoyé des ondes de choc à travers la communauté du développement web. Le titre : *"Comment nous avons reconstruit Next.js avec l'IA en une semaine."* Le projet, appelé **vinext** (prononcé "vee-next"), a été présenté comme un plugin Vite expérimental qui réimplémente la surface API publique de Next.js — permettant aux développeurs d'exécuter leurs applications Next.js sur Cloudflare Workers au lieu de Vercel.

## Qu'est-ce que vinext ?

 vinext est un plugin Vite qui réimplémente l'API publique de Next.js — routage, rendu serveur, React Server Components, actions serveur, cache, middleware et plus — sur l'infrastructure de build de Vite au lieu du compilateur propriétaire de Next.js.

La différenciation clé est la flexibilité de déploiement. La où Next.js requiert traditionnellement Vercel, vinext expédie vers Cloudflare Workers nativement avec une seule commande :

```bash
npm install vinext
vinext deploy # Build et déploie vers Cloudflare Workers
```

### Les chiffres qui ont tourné les têtes

Les benchmarks de Cloudflare, conduits sur une application App Router de 33 routes, ont montré des résultats frappants :

| Métrique | Next.js 16.1.6 | vinext (Vite 8/Rolldown) |
|----------|---------------|---------------------------|
| Temps de build | 7,38s | 1,67s (**4,4× plus rapide**) |
| Bundle client | 168,9 KB | 72,9 KB (**57% plus petit**) |

Ces ne sont pas des améliorations marginales — elles représentent un changement fondamental dans la performance de build, atteint en tirant parti du moderne bundler [Rolldown](/articles/2026-03-26-vite-8-rolldown-era) de Vite.

### Code généré par IA à l'échelle

Peut-être la réclamation la plus étonnante : une réimplémentation complète de la surface API de Next.js a été écrite en une semaine par un seul ingénieur dirigeant un modèle IA. Le coût : environ **1 100$ en tokens API**.

Le projet inclut plus de **1 700 tests Vitest** et **380 tests Playwright E2E**, avec CI fonctionnant sur chaque pull request.

### Fonctionnalités clés

- **Compatibilité drop-in** : `app/`, `pages/`, et `next.config.js` fonctionnent sans modification
- **TPR (Traffic-aware Pre-Rendering)** : interroge les analytiques Cloudflare au déploiement pour pré-rendre uniquement les pages recevant du trafic
- **Bindings Cloudflare natifs** : accédez à D1, R2, KV, Durable Objects, AI via `import { env } from "cloudflare:workers"`
- **Multi-plateforme via Nitro** : déploiement vers Vercel, Netlify, AWS, Deno Deploy et plus

## La controverse : pourquoi ça a ressemblé à une déclaration de guerre

Pour comprendre pourquoi la communauté a réagir si fort, il faut comprendre la relation entre Next.js et Vercel.

Next.js a été acquis par Vercel en 2019. Depuis, Vercel a bâti tout son modèle commercial autour du statut de plateforme d'hébergement premium pour les applications Next.js. Le framework est étroitement intégré à l'infrastructure de Vercel.

Quand Cloudflare a publié vinext, le message aux développeurs était clair : **vous pouvez maintenant utiliser Next.js sans Vercel**.

## Sécurité et qualité

Le README de vinext inclut ceci en évidence :

> 🚧 **Expérimental — sous développement intensif.** Ce projet est une expérience en développement logiciel piloté par IA. La grande majorité du code, des tests et de la documentation ont été écrits par IA.

Le projet liste explicitement ce qui n'est PAS supporté :
- Rendu statique au moment du build (sur la feuille de route)
- Certains cas limites dans le streaming RSC
- API internes non documentées de Next.js

### Utilisation dans le monde réel

Malgré l'étiquette expérimentale, de vrais clients fonctionnent déjà avec vinext en production :
- **CIO.gov** (National Design Studio) : fonctionne avec vinext en production avec "des améliorations significatives dans les temps de build et les tailles de bundle"

## Ce que cela signifie pour l'industrie

### Pour Vercel

Vercel fait face à une vérité inconfortable : leur fossé concurrentiel peut être plus fin qu'espéré. La компании a bâti un excellent produit, mais vinext démontre que la compatibilité Next.js peut être atteinte ailleurs.

### Pour Cloudflare

Cloudflare a signalé sa sérieuxité concernant l'espace de la plateforme développeur. vinext n'est pas qu'une démo technique — c'est une preuve que Cloudflare peut attirer des développeurs qui voyaient précédemment Vercel comme la seule option.

### Pour la communauté de développeurs

Peut-être le plus grand gagnant : les développeurs eux-mêmes. vinext ajoute du choix à un écosystème qui se sentait de plus en plus comme un système à parti unique.

## La conclusion

Le projet vinext de Cloudflare est soit un mouvement concurrentiel brillant, soit une expérience fascinante en développement piloté par IA, soit les deux. La controverse qu'il a provoquée reflète des tensions plus profondes : propriétaire vs. ouvert, intégré vs. composable.

Que vinext devienne une alternative de production viable ou reste une curiosité expérimentale, il a déjà changé la conversation. Les développeurs savent maintenant que s'ils veulent exécuter Next.js sur Cloudflare, ils le peuvent.
