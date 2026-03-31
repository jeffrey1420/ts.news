---
title: "La bêta de Vite 8 arrive : Rolldown est le nouveau cœur de la pipeline de build"
description: "La bêta de Vite 8 abandonne ESBuild et Rollup au profit de Rolldown, signalant un avenir entièrement Rust pour la toolchain de build JavaScript. Ce qui change, ce qui casse, et pourquoi c'est important."
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/vitejs/vite"
date: "2026-03-26"
category: Tooling
author: lschvn
readingTime: 4
tags: ["vite", "javascript", "rolldown", "oxc", "build-tools", "tooling", "release"]
tldr:
  - "La bêta de Vite 8 remplace à la fois ESBuild et Rollup par Rolldown comme bundler unifié — le plus grand changement interne depuis la première version de Vite."
  - "Rolldown est développé par l'équipe Oxc et offre des builds plus rapides avec une utilisation mémoire réduite, surtout sur les grandes bases de code."
  - "L'utilisation de Rolldown est passée de 1 % à 10 % en un an selon l'enquête State of JS 2025, même avant la version stable de Vite 8."
  - "Les plugins écrits pour le système de hooks de Rollup peuvent nécessiter des mises à jour ; les auteurs de plugins Vite devraient tester avec la bêta maintenant."
---

La bêta de Vite 8 est là, et le changement phare est au roadmap depuis deux ans : Rolldown est désormais le bundler par défaut, remplaçant à la fois ESBuild (utilisé pour les dépendances) et Rollup (utilisé pour les builds de production). C'est le changement le plus conséquent dans les internals de Vite depuis sa première version.

Rolldown, développé par la même équipe derrière le parser JavaScript Rust Oxc, vise à être un remplacement direct de Rollup avec de meilleures performances. Vite 8 le livre comme bundler unifié sous les commandes de dev server et de build familières que vous utilisez.

## Ce qui change

En pratique, la plupart des projets devraient voir des temps de build plus rapides et une utilisation mémoire réduite — en particulier sur les grandes bases de code où les bundlers basés sur Node.js atteignent leur plafond. Rolldown s'exécute nativement et est conçu pour exploiter le matériel multi-thread d'une manière que Rollup ne peut pas.

Le chemin de migration de Vite 7 à 8 est décrit par l'équipe Vite comme simple pour la majorité des projets, mais il y a des breaking changes. Les plugins écrits pour le système de hooks de Rollup peuvent nécessiter des mises à jour. Les projets qui s'appuient sur un contrôle fin du processus de bundling devraient tester tôt.

## Une tendance plus large : Rust envahit la pipeline de build

L'ascension de Rolldown s'inscrit dans un changement plus large. L'enquête State of JavaScript 2025 a montré que Rolldown est passé de 1 % à 10 % d'utilisation en un an, même avant la version officielle de Vite 8. Turbopack, l'alternative Rust de Vercel, est à 28 % d'utilisation — mais les scores de satisfaction racontent une autre histoire. Le fossé de l'écosystème Vite s'est révélé durable. Ce mouvement d'outillage Rust s'étend au-delà de Vite : le [Vite+ de VoidZero](/articles/vite-plus-unified-toolchain) enveloppe Rolldown, Oxc et une suite d'autres outils Rust sous une seule CLI, représentant l'interface unifiée la plus cohérente à la toolchain JavaScript Rust à ce jour.

Le pattern est cohérent : les outils écrits en Rust remplacent les équivalents JavaScript dans la pipeline de build non pas parce que les développeurs recherchent la nouveauté, mais parce que les différences de performance sont significatives et réelles. TypeScript a [la réécriture Go qui arrive](/articles/typescript-7-native-preview-go-compiler). Vite a Rolldown. La toolchain JavaScript est réécrite en langages natifs, pièce par pièce.

## Quand Vite 8 arrive-t-il ?

La bêta est disponible maintenant pour les tests. L'équipe Vite n'a pas publié de date de sortie ferme, mais l'attente basée sur les cycles de publication précédents est une version stable dans les prochains mois. Si vous maintenez un plugin Vite ou un projet avec une configuration de build personnalisée, c'est le moment de tester avec la bêta et de signaler les problèmes de compatibilité.

```bash
npm install vite@beta
```

Consultez le [guide de migration Vite 8](https://vite.dev/guide/migration) pour la liste complète des breaking changes avant la mise à jour.
