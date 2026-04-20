---
title: "Nitro v3 Beta : Tracing intégré, détection inteligente des dépendances et support Vercel Queues"
description: "La mise à jour beta Nitro v3 d'avril 2026 apporte des canaux de tracing intégrés, une détection des dépendances en mode full-trace avec reconnaissance des packages natifs, le support des queues Vercel, et le déploiement sur Tencent EdgeOne Pages."
date: 2026-04-20
image: "https://ts.news/images/nitro-og.png"
author: lschvn
tags: ["TypeScript", "Nitro", "Server", "Framework", "Vue", "Nuxt", "Vercel"]
tldr:
  - Nitro v3 introduit des canaux de tracing intégrés pour l'observabilité, et une détection des dépendances en full-trace qui reconnaît automatiquement les dépendances optionnelles et les packages natifs
  - Le preset Vercel supporte désormais les queues pour le traitement asynchrone et les config de fonction par route (mémoire, timeout, maxDuration)
  - Tencent EdgeOne Pages rejoint la liste des presets de déploiement, et H3 v2 apporte des vérifications de streaming plus strictes, la conformité RFC 6265bis pour les cookies, et une protection contre le path traversal
faq:
  - q: "En quoi le tracing intégré de Nitro v3 diffère-t-il des intégrations OpenTelemetry existantes ?"
    a: "Les canaux de tracing de Nitro fournissent une couche d'observabilité plus basse et native au framework. Sans nécessiter de SDK OpenTelemetry externe, vous obtenez du tracing span requête depuis les internes de Nitro — les spans pour le traitement des routes, les requêtes base de données et les opérations cache sont émis automatiquement."
  - q: "Quels packages natifs sont maintenant détectés automatiquement par traceDeps ?"
    a: "Le mode full-trace de traceDeps utilise une base de données croissante de packages natifs pour identifier les dépendances optionnelles avec des binaires pré-compilés (comme node-sqlite3, canvas ou sharp). Si Nitro les détecte, il évite de les bundler incorrectement."
  - q: "Comment fonctionnent les Vercel Queues dans Nitro ?"
    a: "Vous définissez des handlers de tâches avec nitro.tasks, déployez sur Vercel, et utilisez le SDK Vercel depuis vos handlers. Le preset Vercel gère la configuration automatiquement, vous offrant une exécution asynchrone durable sans infrastructure de queue séparée."
---

La beta publique de Nitro v3 continue de évoluer rapidement. La mise à jour du 15 avril (v3.0.260415-beta) apporte un ensemble de fonctionnalités axées sur l'expérience développeur et la production.

## Canaux de Tracing Intégrés

L'ajout principal est le support expérimental des canaux de tracing ([PR #4001](https://github.com/nitrojs/nitro/pull/4001)). Nitro émet désormais des spans de trace structurés pour le cycle de vie des requêtes — correspondance de route, exécution de handler, cache hits/misses, timing des requêtes base de données — directement depuis le cœur du framework. Pas besoin de SDK OpenTelemetry ; le tracing est une fonctionnalité native de Nitro.

## Détection Intelligente des Dépendances avec Full-trace

L'outil traceDeps de Nitro reçoit une amélioration importante ([PR #4175](https://github.com/nitrojs/nitro/pull/4175)). Le nouveau mode full-trace et les options de trace personnalisées donnent aux développeurs le contrôle sur la façon dont Nitro analyse le graphe de dépendances pendant le build.

L'amélioration clé : le tracer upstream nf3 inclut désormais une base de données de packages natifs en expansion et la détection automatique des dépendances optionnelles. Si votre projet utilise des packages avec des binaires natifs — `sharp`, `canvas`, `better-sqlite3` — Nitro peut désormais les détecter automatiquement et éviter un bundling incorrect, source fréquente d'erreurs "ça marche en local, ça plante en prod".

## Vercel Queues et Configuration par Route

Le preset de déploiement Vercel gagne deux fonctionnalités de production.

**Vercel Queues** : Les handlers de routes Nitro peuvent désormais enfiler du travail asynchrone via l'infrastructure queue de Vercel. Définissez des tâches avec `nitro.tasks`, déployez sur Vercel, et utilisez le SDK Vercel. Le preset gère la configuration automatiquement. Cela apporte une exécution asynchrone durable sans infrastructure queue séparée.

**Override de config par route** : Les routes individuelles peuvent désormais surcharger la configuration de fonction Vercel par défaut — limite mémoire, timeout, `maxDuration`. Pratique quand une route spécifique a besoin de plus de ressources que le reste de l'application.

## Tencent EdgeOne Pages

Nitro ajoute Tencent EdgeOne Pages comme cible de déploiement. Le nouveau preset `edgeone-pages` utilise l'API v3 de EdgeOne Pages Build Output et est documenté sur `nitro.build/deploy/providers/edgeone`.

## Correctifs de Sécurité H3 v2

H3 passe de rc.16 à rc.20 avec plusieurs corrections importantes :

- **Protection path traversal** : les doubles segments pointés encodés dans les URLs sont maintenant rejetés
- **Protection open redirect** : `redirectBack()` valide que la cible n'utilise pas un chemin protocol-relative
- **Streaming body plus strict** : applique les limites de taille quelque soit l'en-tête Content-Length
- **Conformité cookie RFC 6265bis** : parsing et sérialisation des cookies alignés avec le RFC actualisé
- **Fix count cookie illimité** : prévient un vecteur DoS via un nombre arbitraire de cookies

## ocache et unstorage

`ocache` gagne l'invalidation de cache via `handler.invalidate()` et le support multi-tier. `unstorage` flush désormais proactivement les entrées mémoire expirées plutôt que d'attendre le prochain accès.

## Documentation

Nitro.build introduit de nouvelles guides pour [OpenAPI](https://nitro.build/docs/openapi) et [WebSocket](https://nitro.build/docs/websocket).

Cette mise à jour montre Nitro v3 se rapprochant de la GA avec des fonctionnalités d'infrastructure de production plutôt que du confort développeur.
