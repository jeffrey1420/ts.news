---
title: "Deno 2.7 Stabilise l'API Temporelle, Ajoute le Support Windows ARM et les Overrides npm"
description: "Deno 2.7 est une version majeure du cycle : l'API Temporal est désormais en production, les builds Windows on ARM natifs arrivent, npm overrides fonctionne comme dans Node, et des dizaines d'amélioration de compatibilité Node.js atterrissent."
date: "2026-04-07"
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop"
author: lschvn
tags: ["deno", "javascript", "typescript", "runtime", "api-temporelle", "nodejs"]
---

Deno 2.7 est sorti le 25 février, et c'est l'une des versions les plus riches en fonctionnalités de la lignée 2.x. Les points forts : stabilisation de l'API Temporal, builds Windows on ARM officiels, support des overrides npm, et un lot significatif de travaux de compatibilité Node.js.

[tldr]
- L'API Temporal TC39 est désormais stable dans Deno sans le flag `--unstable-temporal` — Chrome 144 l'a expédiée en janvier 2026, Deno suit
- Les builds Windows on ARM (aarch64-pc-windows-msvc) sont désormais officiels : Surface Pro X, ordinateurs Snapdragon, sans surcoût d'émulation
- Le champ `overrides` de npm fonctionne désormais, permettant de piner des dépendances transitives profondément dans l'arbre
- Des dizaines de corrections de compatibilité Node.js : worker_threads, child_process, zlib, sqlite tous améliorés
- Deno Deploy a atteint la disponibilité générale dans le même cycle
[/tldr]

## L'API Temporal : Enfin Stable

L'[API Temporal](https://tc39.es/proposal-temporal/docs/) est la proposition TC39 de remplacement du `Date` JavaScript défaillant. Deno 2.7 la stabilise, faisant de Deno l'un des premiers runtimes à fournir une implémentation en production aux côtés de Chrome 144 (janvier 2026).

```typescript
const today = Temporal.Now.plainDateISO();
const nextMonth = today.add({ months: 1 });

const meeting = Temporal.ZonedDateTime.from(
  "2026-03-15T14:30[America/New_York]",
);
const inTokyo = meeting.withTimeZone("Asia/Tokyo");
```

Si vous utilisiez le flag `--unstable-temporal`, supprimez-le. L'API est inchangée.

## Windows on ARM : La Dernière Lacune Plateforme se Comble

C'était une [fonctionnalité demandée depuis longtemps](https://github.com/denoland/deno/issues/8422). Deno propose désormais des builds officiels aarch64-pc-windows-msvc. Les performances natives sur Surface Pro X, Lenovo ThinkPad X13s et ordinateurs alimentés par Snapdragon signifient aucun overhead d'émulation x86 pour la compilation TypeScript ou toute autre charge Deno.

## npm Overrides : Piner les Dépendances Transitives

Le champ `overrides` de npm permet de piner ou remplacer des packages profondément dans l'arbre des dépendances — utile pour les correctifs de sécurité sur des dépendances transitives ou forcer la compatibilité. Le support de package.json de Deno gère désormais ceci :

```json
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "overrides": {
    "cookie": "0.7.0",
    "express": {
      "qs": "6.13.0"
    }
  }
}
```

`cookie` est pinné à 0.7.0 partout ; `qs` n'est écrasé que quand express le requiert. Ce pattern est courant dans l'écosystème npm pour appliquer des correctifs de sécurité sans attendre les versions officielles.

## Compatibilité Node.js : worker_threads et child_process

La couche de compatibilité Node.js continue de réduire les écarts. Points forts du travail sur worker_threads :

- stdout est désormais transmis au processus parent
- Support stdin ajouté
- `worker.terminate()` retourne désormais le bon code de sortie
- `process.exit()` dans un worker arrête immédiatement l'exécution
- `ref()`/`unref()` est désormais idempotent comme dans Node
- `worker.cpuUsage()` implémenté

Pour `child_process` : les flux stdio sont désormais de vraies instances Socket, les redirections shell fonctionnent dans exec, `fork()` accepte URL comme modulePath, et `NODE_OPTIONS` est respecté pour `--require` et `--inspect-publish-uid`.

## Écosystème Deno : Actualités Complémentaires

Ce cycle a aussi vu Deno Deploy atteindre la disponibilité générale (3 février) et l'introduction de [Deno Sandbox](https://deno.com/blog/introducing-deno-sandbox) — des microVMs Linux instantanées pour exécuter du code non fiable avec une sécurité defense-in-depth.

L'équipe Deno a également révélé que les utilisateurs de Deno Deploy étaient protégés contre deux vulnérabilités haute sévérité dans React Server Components / Next.js fin 2025 (CVE-2025-55184 et la RCE dans React Server Functions), avec des atténuations automatiques déployées à la périphérie.

[faq]
- **Dois-je modifier mon code pour l'API Temporal ?** Si vous utilisiez `--unstable-temporal`, supprimez ce flag. L'API est inchangée.
- **Puis-je exécuter des packages npm avec Deno ?** Oui — Deno a un support de package.json de première classe et peut exécuter la plupart des packages npm directement.
- **Deno Deploy est-il prêt pour la production ?** Oui — il a atteint la disponibilité générale le 3 février 2026.
[/faq]
