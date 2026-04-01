---
title: "Knip v6 Intègre le Parser oxc pour des Gains de Performance de 2 à 4x"
description: "L'outil populaire de détection de code mort en JavaScript et TypeScript换上 Rust 版解析器，性能提升 2 到 4 倍。"
date: 2026-04-01
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "javascript", "outillage", "performance", "open-source", "rust"]
faq:
  - question: "Qu'est-ce que Knip ?"
    answer: "Knip est un outil en ligne de commande open source qui détecte les fichiers, dépendances et exports inutilisés dans les projets JavaScript et TypeScript."
  - question: "Qu'est-ce que oxc ?"
    answer: "oxc est une suite d'outils JavaScript/TypeScript écrits en Rust par l'Oxc Project (oxc.rs). Elle comprend un parser (oxc-parser), un linter et un resolver."
  - question: "Comment passer à Knip v6 ?"
    answer: "Exécutez `npm install -D knip@latest`. Notez que Knip v6 nécessite Node.js v20.19.0 minimum."
  - question: "Le type d'issue classMembers a disparu ?"
    answer: "Oui, il a été supprimé car il dépendait de l'API LanguageService de TypeScript, qui ne sera plus disponible dans TypeScript v7 rewrite en Go."
tldr:
  - "Knip v6 remplace le backend TypeScript par oxc-parser et oxc-resolver, divisant le temps d'analyse par 2 à 4 sur les gros projets."
  - "Le codebase Astro passe de 4,0s à 2,0s, Sentry de 11,0s à 4,0s, et le dépôt TypeScript de Microsoft de 3,7s à 0,9s."
  - "Knip v6 nécessite Node.js v20.19.0 minimum et supprime le type d'issue classMembers."
  - "La réécriture de TypeScript v7 en Go rendait le maintien de l'API LanguageService impossible, rendant la migration vers oxc nécessaire."
---

L'équipe derrière [Knip](https://github.com/webpro-nl/knip), l'outil open source très utilisé pour détecter les fichiers, dépendances et exports inutilisés dans les projets JavaScript et TypeScript, a publié la version 6 — et le chiffre principal ne laisse pas indifférent : **2 à 4 fois plus rapide** sur toute la ligne.

Le changement clé est le remplacement complet du backend TypeScript par [oxc-parser](https://oxc.rs/docs/guide/usage/parser), le parser écrit en Rust du projet Oxc.

## Pourquoi le backend TypeScript avait atteint ses limites

Knip parse chaque fichier une seule fois, mais l'ancien moteur basé sur TypeScript trainait la complexité d'un programme complet et d'un vérificateur de types pour une analyse statique qui n'en avait pas besoin. Cette configuration était pensée pour les IDEs et serveurs de langage, pas pour un analyseur qui ne fait qu'une passe.

> « Le backend TypeScript rendait l'ensemble de la configuration plus difficile et plus lent qu'il n'aurait dû l'être, surtout pour les gros monorepos. » — Lars Kappert, [annonce de la v6](https://knip.dev/blog/knip-v6)

L'équipe TypeScript est aussi en train de réécrire le compilateur en Go pour la v7 (preview disclosed en mars 2026). Cette réécriture aurait cassé les API LanguageService sur lesquelles Knip comptait pour ses fonctionnalités les plus niches.

## Les chiffres

| Projet | v5.88.0 | v6.0.0 | Gain |
|---|---|---|---|
| Astro | 4,0s | 2,0s | 2,0x |
| TanStack Query | 3,8s | 1,7s | 2,2x |
| Rolldown | 3,7s | 1,7s | 2,2x |
| Sentry | 11,0s | 4,0s | 2,8x |
| TypeScript (microsoft/TypeScript) | 3,7s | 0,9s | 4,1x |

Le parser Rust parcourt le dépôt TypeScript de Microsoft en moins d'une seconde.

## Changements importants

- **Node.js v20.19.0+ requis** — v18 n'est plus supporté
- **Type d'issue classMembers supprimé** — plus viable sans l'API LanguageService de TypeScript
- Les flags `--include-libs` et `--isolate-workspaces` sont supprimés (comportement par défaut)
- `--experimental-tags` renommé en `--tags`

## Mise à jour

```bash
npm install -D knip@latest
```

La [documentation complète](https://knip.dev) est sur le site de Knip.
