---
title: "Vite 8 Beta : Rolldown devient le cœur du pipeline de build"
description: "La bêta de Vite 8 abandonne ESBuild et Rollup au profit de Rolldown, annonçant un avenir entièrement basé sur Rust pour l'outillage JavaScript. Ce qui change, ce qui casse, et pourquoi c'est important."
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/vitejs/vite"
date: "2026-03-26"
category: Tooling
author: lschvn
readingTime: 4
tags: ["vite", "javascript", "rolldown", "oxc", "build-tools", "tooling", "release"]
tldr:
  - "Vite 8 beta remplace ESBuild et Rollup par Rolldown comme bundleur unifié — le plus grand changement interne depuis la sortie de Vite."
  - "Rolldown, créé par l'équipe Oxc, offre des builds plus rapides avec une empreinte mémoire réduite, surtout sur les gros projets."
  - "L'utilisation de Rolldown est passée de 1% à 10% en un an selon State of JS 2025, avant même la sortie stable de Vite 8."
  - "Les plugins écrits pour le système de hooks de Rollup peuvent nécessiter des mises à jour ; les auteurs de plugins Vite doivent tester maintenant."
---

La bêta de Vite 8 est là, et le changement principal était prévu depuis deux ans : Rolldown est désormais le bundleur par défaut, remplaçant à la fois ESBuild (utilisé pour les dépendances) et Rollup (utilisé pour les builds de production). C'est le changement le plus conséquent dans les entrailles de Vite depuis sa sortie initiale.

Rolldown, créé par la même équipe derrière l'analyseur JavaScript Rust Oxc, vise à être un remplacement drop-in de Rollup avec de meilleures performances. Vite 8 l'expédie comme bundleur unifié sous le serveur de dev et les commandes de build familières que vous utilisez.

## Ce qui change

En pratique, la plupart des projets devraient voir des temps de build plus rapides et une utilisation mémoire réduite — particulièrement sur les grosses bases de code où les bundleurs Node.js atteignent leur plafond. Rolldown s'exécute nativement et est conçu pour tirer parti du matériel multi-threadé d'une manière que Rollup ne peut pas.

Le chemin de migration de Vite 7 vers 8 est décrit par l'équipe Vite comme simple pour la majorité des projets, mais il y a des changements cassants. Les plugins écrits pour le système de hooks de Rollup peuvent nécessiter des mises à jour. Les projets qui comptent sur un contrôle fin du processus de bundling devraient tester tôt.

## Une tendance plus large : Rust dévore le pipeline de build

L'ascension de Rolldown fait partie d'un mouvement plus vaste. L'enquête State of JavaScript 2025 a montré Rolldown passant de 1% à 10% d'utilisation en un an, avant même la sortie officielle de Vite 8. Turbopack, l'alternative Rust de Vercel, est à 28% d'utilisation — mais les scores de satisfaction racontent une autre histoire. L'avantage éco-système de Vite s'est révélé durable. Ce mouvement d'outillage Rust s'étend au-delà de Vite : [VoidZero's Vite+](/articles/vite-plus-unified-toolchain) enveloppe Rolldown, Oxc, et une suite d'autres outils Rust sous une seule CLI, représentant l'interface unifiée la plus cohérente pour l'outillage JavaScript basé sur Rust à ce jour.

Le schéma est cohérent : les outils écrits en Rust déplacent les équivalents basés sur JavaScript dans le pipeline de build non pas parce que les développeurs courent après la nouveauté, mais parce que les différences de performances sont significatives et réelles. TypeScript a [la réécriture Go prévue](/articles/typescript-7-native-preview-go-compiler). Vite a Rolldown. La boîte à outils JavaScript est réécrite en langages natifs, pièce par pièce.

## Quand sort Vite 8 ?

La bêta est disponible maintenant pour les tests. L'équipe Vite n'a pas publié de date de sortie ferme, mais l'attente basée sur les cycles de sortie précédents est une sortie stable dans les prochains mois. Si vous maintenez un plugin Vite ou un projet avec une configuration de build personnalisée, c'est le moment de tester contre la bêta et de signaler les problèmes de compatibilité.

```bash
npm install vite@beta
```

Consultez le [guide de migration Vite 8](https://vite.dev/guide/migration) pour la liste complète des changements cassants avant de mettre à niveau.
