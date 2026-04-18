---
title: "Next.js v16.3.0-Canary : Prefetch, Dedup et Nouveau Overlay de Dév"
description: "Next.js 16.3.0-canary introduit des contrôles de prefetch plus fins, un meilleur dédoublonnage pour la directive 'use cache', et un overlay de dev redesigné pour les erreurs de routes bloquantes."
date: 2026-04-18
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Next.js", "React", "Vercel", "JavaScript", "Turbopack", "Web"]
tldr:
  - Next.js 16.3.0-canary ajoute des options de configuration de prefetch granulaire et améliore le dédoublonnage du 'use cache' pour éviter les appels serveur redondants
  - L'overlay d'erreur pour les routes bloquantes et les erreurs de build a été redesigné pour une meilleure expérience développeur
  - Les builds CI abandonnent les binaires sccache pré-compilés au profit de cargo-binstall
---

## Ce qui a changé

Next.js 16.3.0-canary est tombé il y a deux jours et le changelog est bien chargé.

### Configuration de Prefetch Granulaire

La prop `prefetch` sur `<Link>` gagne de nouvelles options. Les développeurs peuvent désormais contrôler *quoi* est préchargé et *quand*, au-delà du simple booléen existant. Cela réduit la charge réseau pour les apps avec des arbres de routes complexes.

Le changement inclut aussi un meilleur traitement des partial fallbacks : quand une requête de prefetch arrive, le shell est géré plus proprement lors des mises à jour de shell.

### Meilleur Dédoublonnage du 'use cache'

La directive expérimentale `'use cache'` — le mécanisme de caching serveur de Next.js — dédoublonne désormais les appels concurrents de manière plus agressive. Si plusieurs composants réclament la même computation mise en cache simultanément, un seul l'exécute réellement.

### Redesign de l'Overlay de Dév

Les erreurs de routes bloquantes (l'écran rouge plein qui arrête le dev) ont été redesignées visuellement et fonctionnellement. L'objectif : des messages d'erreur plus lisibles et un diagnostic plus rapide.

### Infrastructure : cargo-binstall pour sccache

Le dépôt Next.js est passé des binaires sccache pré-compilés à `cargo-binstall` pour bootstrap sccache. C'est un win en termes de supply chain et de reproductibilité.

## FAQ

### Quand la 16.3.0 stable est-elle prévue ?

Pas de date officielle. Le cycle canary vient de commencer. Surveillez le [blog Next.js](https://nextjs.org/blog).
