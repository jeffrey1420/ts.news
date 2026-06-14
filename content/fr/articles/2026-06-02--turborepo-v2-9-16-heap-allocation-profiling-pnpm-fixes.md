---
title: "Turborepo v2.9.16 Ajoute le Profiling Mémoire et des Correctifs pnpm"
description: "Les dernières versions stables de Turborepo ajoutent le profiling heap allocation via OpenTelemetry, corrigent le comportement des peers injectés pnpm, harden la validation OTEL endpoint, et règlent les hangs de shutdown PTY."
date: 2026-06-02
image: "/images/heroes/2026-06-02--turborepo-v2-9-16-heap-allocation-profiling-pnpm-fixes.png"
author: lschvn
tags: ["tooling", "typescript", "javascript"]
tldr:
  - Turborepo v2.9.16 intègre le profiling heap allocation dans les traces OpenTelemetry, offrant de la visibilité sur l'utilisation mémoire par task et par package
  - Les workspaces pnpm avec peer dependencies injectées fonctionnent maintenant correctement ; Turborepo ne drop plus ces entrées pendant l'exécution
  - La validation OTEL endpoint est renforcée et les échecs de publication npm tlog sont désormais réessayés automatiquement
---

<!-- more -->

## Heap Allocation Profiling

L'ajout le plus significatif en v2.9.16 est le **support du profiling heap allocation** via OpenTelemetry. Cette release ajoute des données heap aux traces OTEL existantes de Turborepo, permettant de voir la consommation mémoire par task et par package.

Pour l'utiliser, pointez `TURBO_TRACE_ENDPOINT` vers votre collecteur OTEL, les données heap apparaissent désormais aux côtés des informations de durée et de span existantes. L'implémentation ajoute un nouvel événement `heap.allocated` aux spans de tasks.

## Correction pnpm Injected Peer

La release v2.9.15 avait introduit une régression dans la gestion des **peer packages injectés par pnpm**. Quand un package utilise `injected: true` du workspace protocol pnpm pour ses peer dependencies, Turborepo incorrectement omettait ou gérait mal ces entrées lors de la résolution du task graph.

v2.9.16 corrige cela. Les monorepos utilisant pnpm avec des injected peers fonctionnent désormais correctement.

## Validation OTEL Endpoint Renforcée

Turborepo v2.9.16 renforce également la **validation d'URL de l'endpoint OTEL**. Une URL endpoint malformée pouvait causer des crashes silencieux. La nouvelle validation est plus stricte et fail fast avec un message d'erreur clair.

## Correctifs PTY et npm tlog

- **Hang PTY shutdown**: sur certaines distributions Linux, le pseudo-terminal pouvait hanger au shutdown, laissant des processes `turbo` orphelins. Corrigé.
- **Retry npm tlog publish**: les échecs de publication npm transient sont désormais réessayés automatiquement.

## Mise à Jour

```bash
npm install -g turbo@latest
# ou
brew install turbo
```

Turborepo v2.9.16 est la release stable actuelle.
