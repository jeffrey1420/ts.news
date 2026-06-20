---
title: "Nitro v3.0.260522-beta : Tracing à la Compilation, Cache VFS, Queues Vercel en Local"
description: "Le beta Nitro v3 du 22 mai apporte des wrappers de tracing pour les handlers de routes à la compilation, un cache VFS pour le code dynamique nitro, et le support des queues Vercel accessible en développement local, avec les correctifs de sécurité de la beta précédente."
date: 2026-06-03
image: "/images/heroes/2026-06-03--nitro-v3-0-260522-beta-tracing-vfs-vercel-queues.png"
author: lschvn
tags: ["frameworks", "typescript", "performance"]
tldr:
  - Nitro enveloppe maintenant chaque handler de route avec des spans de tracing à la compilation, offrant une observabilité sans configuration OpenTelemetry
  - Le cache VFS du code dynamique nitro réduit considérablement le temps de redémarrage du dev-server en évitant la ré-évaluation complète du graphe de modules
  - Le preset Vercel expose désormais les queues en développement local via vercel dev, permettant de déboguer les handlers de queue avant le déploiement
  - Deux correctifs de sécurité corrigent une vulnérabilité de proxy request-smuggling et une open-redirect (GHSA-5w89-w975-hf9q, GHSA-9phm-9p8f-hw5m)
faq:
  - question: "En quoi le tracing à la compilation diffère-t-il de l'intégration OpenTelemetry existante ?"
    answer: "Les canaux de tracing de Nitro sont émis au niveau du framework. Les spans pour la gestion des routes, les opérations de cache et les requêtes base de données sont générés directement dans le routeur interne de Nitro lors de la phase de build. Cela signifie que les spans portent un contexte spécifique à Nitro (nom de la route, durée du handler, cache hit/miss) qu'un middleware HTTP générique ne peut pas produire sans instrumentation personnalisée."
  - question: "Qu'est-ce que le cache VFS pour le code dynamique et qui en profite ?"
    answer: "Le cache VFS stocke l'état résolu du registre interne et du routeur de Nitro après le premier request. Les démarrages suivants chargent depuis ce snapshot, évitant la ré-évaluation de chaque handler de route et chaque import de module. Pour les grandes applications avec de nombreuses routes ou des imports dynamiques coûteux, cela réduit considérablement les temps de redémarrage."
  - question: "Comment les queues Vercel fonctionnent-elles en local ?"
    answer: "La commande vercel dev dans le preset Vercel de Nitro détecte désormais les définitions de handlers de queue (nitro.tasks) et exécute un stub local du Vercel Runtime qui traite les jobs. Vous pouvez enfiler du travail depuis un route handler et déboguer le flux async complet : retries, dead-letter queue, avant de déployer."
---

[Nitro v3](/articles/2026-04-20--nitro-v3-beta-tracing-dep-tracing-vercel-queues).0.260522-beta est sorti le 22 mai 2026, prolongeant la phase bêta v3 démarrée en avril. Cette release ajoute trois fonctionnalités qui améliorent ensemble significativement l'expérience de développement pour les applications TypeScript server-side orientées production : instrumentation de tracing automatique à la compilation, un cache VFS pour le code dynamique, et l'émulation locale des queues Vercel.

## Tracing automatique des handlers à la compilation

Le PR [#4240](https://github.com/nitrojs/nitro/pull/4240) introduit l'enrobage automatique des spans de tracing autour de chaque handler de route Nitro à la compilation. Quand une requête arrive sur un serveur Nitro, des spans sont émis pour chaque invocation de handler avec les métadonnées incluant le chemin de la route, la méthode HTTP, la durée et le statut du cache. Ces spans s'intègrent avec les récepteurs compatibles OpenTelemetry, vous pointez votre `OTEL_EXPORTER_OTLP_ENDPOINT` vers un collecteur et obtenez des traces de requêtes complètes sans écrire une seule ligne de code d'instrumentation.

## Cache VFS pour le code dynamique

Le PR [#4251](https://github.com/nitrojs/nitro/pull/4251) introduit une couche VFS pour le code dynamique de Nitro. Auparavant, un redémarrage du dev-server forçait Nitro à ré-évaluer tout le graphe de modules, chaque handler de route, chaque appel `useStorage()`, chaque hook d'événement. Pour les applications avec des centaines de routes ou une initialisation coûteuse, cela ajoutait des secondes à chaque redémarrage.

Le nouveau cache VFS sérialise l'état résolu du registre interne de Nitro après le premier request. Les démarrages suivants chargent depuis ce snapshot, évitant l'étape d'évaluation. Le cache est invalidé automatiquement quand les fichiers sources changent.

## Les queues Vercel accessibles en développement local

Le preset Vercel intègre le support des queues en développement local via `vercel dev` ([#4264](https://github.com/nitrojs/nitro/pull/4264)). Les handlers de queue définis avec `nitro.tasks` sont désormais reconnus et exécutés par un stub local du Vercel Runtime. Vous pouvez écrire un consumer de queue, l'appeler depuis un route handler, et déboguer le flux async complet, retries et dead-letter queue, entièrement en local.

## Correctifs de sécurité

Deux vulnérabilités corrigées dans la beta v3.0.260429-beta affectent également les releases antérieures :

- **GHSA-5w89-w975-hf9q** : Les règles de route proxy pouvaient être contournées via des chemins de requête malformés, permettant à des requêtes d'atteindre des services backend qui auraient dû être exclus.
- **GHSA-9phm-9p8f-hw5m** : Open redirect via URL protocol-relative dans les règles de redirection.

## AWS Amplify supporte Node.js 24

Le preset AWS Amplify supporte désormais le runtime [Node.js](/articles/2026-04-12--nodejs-25-stream-iter-async-streams) 24 ([#4245](https://github.com/nitrojs/nitro/pull/4245)).

Nitro v3.0.260522-beta est disponible sur npm via `nitro@3.0.0-260522-beta`.
