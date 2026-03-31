---
title: "State of JavaScript 2025 : TypeScript atteint 40 % d'utilisation exclusive alors que l'écosystème se stabilise"
description: "L'enquête State of JavaScript 2025 montre l'utilisation exclusive de TypeScript à 40 %, la satisfaction Vite à 98 % contre 26 % pour Webpack, et Claude doublant sa part de développeurs. L'écosystème mûrit plutôt que de tourner."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-27"
category: Survey
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "L'utilisation exclusive de TypeScript a atteint 40 % (contre 34 % en 2024, 28 % en 2022) ; seulement 6 % utilisent du JS pur exclusivement."
  - "La satisfaction Vite est de 98 % contre 26 % pour Webpack ; l'utilisation de React à 83,6 % mais le sentiment négatif envers Next.js atteint 17 %."
  - "L'utilisation de Claude a doublé de 22 % à 44 % ; Cursor a plus que doublé de 11 % à 26 % ; ChatGPT a décliné de 68 % à 60 %."
  - "Node.js reste dominant à 90 % d'utilisation runtime ; Bun a progressé de 4 points à 21 %, bien devant Deno à 11 %."
---

Les résultats de l'enquête [State of JavaScript 2025](https://2025.stateofjs.com/en-US) sont tombés, et ils peignent un écosystème qui trouve ses repères. Réalisée en novembre 2025 et publiée en février 2026, l'enquête annuelle — gérée par Devographics et sponsorisée par Google Chrome et JetBrains — montre des vainqueurs clairs en matière d'outils, de frameworks et de préférences linguistiques, avec un bonheur des développeurs stable à 3,8 sur 5 pour la cinquième année consécutive.

## TypeScript a gagné — et maintenant ?

Le chiffre phare : 40 pour cent des répondants écrivent désormais exclusivement en TypeScript — une tendance qui souligne pourquoi [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release), la dernière version JS avant la réécriture native Go, est un point de transition si crucial pour l'écosystème. Ce chiffre est en hausse par rapport à 34 pour cent en 2024 et 28 pour cent en 2022. Seulement 6 pour cent utilisent du JavaScript pur exclusivement. Daniel Roe, leader de l'équipe principale de Nuxt, [l'a dit clairement](https://2025.stateofjs.com/en-US/conclusion/) dans la conclusion de l'enquête : « TypeScript a gagné. Pas en tant que bundler, mais en tant que langage. »

La tension intéressante est que « le manque de typage statique » reste le premier point de douleur signalé — parmi les développeurs qui n'ont pas adopté TypeScript. Quand on leur demande comment les types devraient fonctionner nativement en JavaScript, les annotations de type TypeScript ont mené avec 5 380 votes, devant les types d'exécution à 3 524.

## Outils de build : la domination de la satisfaction Vite

Vite a effectivement dépassé Webpack en termes de sentiment développeur. Alors que Webpack maintient une utilisation globale légèrement supérieure (87 % contre 84 %), l'écart de satisfaction est frappant : [Vite](/articles/2026-03-26-vite-8-rolldown-era) obtient 98 pour cent, Webpack obtient 26 pour cent — contre 36 pour cent en 2024.

Le commentaire d'un répondant capture l'ambiance : « Essayer de comprendre du code legacy qui utilise Webpack peut être douloureux. »

Turbopack, le successeur Rust de Webpack par Vercel, n'est qu'à 28 pour cent d'utilisation, suggérant que l'avance de Vite et son avantage en expérience développeur seront difficiles à surmonter. Rolldown — le remplacement Rust de Rollup intégré dans l'avenir de Vite — est passé de 1 pour cent à 10 pour cent, indiquant une pipeline de build JavaScript de plus en plus propulsée par Rust.

## Frustration React, satisfaction Solid

React reste le framework le plus utilisé à 83,6 pour cent, mais l'enquête révèle une insatisfaction notable. Next.js, utilisé par 59 pour cent des répondants, affiche un score de sentiment positif de 21 pour cent contre un sentiment négatif de 17 pour cent — générant le plus de commentaires de tous les projets.

Réponses représentatives de l'enquête :
- « J'écris du Next.js en production depuis bientôt 6 ans... la complexité de Next est devenue absurde »
- « Bien que j'aie eu une expérience positive avec Next, je suis inquiet parce que Vercel essaie de l'utiliser pour gagner de l'argent »

Solid.js a maintenu le taux de satisfaction le plus élevé pour la cinquième année consécutive. Dans l'espace méta-framework, Astro a continué à gagner du terrain comme alternative axée sur le contenu.

## L'usage des outils IA évolue

Les patterns de développement assisté par IA évoluent. L'utilisation de Claude a doublé de 22 à 44 pour cent, tandis que celle de Cursor a plus que doublé de 11 à 26 pour cent. L'utilisation de ChatGPT a décliné de 68 à 60 pour cent — toujours dominante en termes absolus, mais en baisse.

## Backend : Node résiste, Bun grandit

Côté runtime, Node.js reste dominant à 90 pour cent. [Bun](/articles/2026-03-30--bun-v1-3-11-cron-anthropic) est à la troisième place à 21 pour cent — un gain de 4 pour cent par rapport à l'année précédente — bien devant Deno à 11 pour cent. Pour une analyse plus approfondie de la comparaison des trois runtimes sur le débit, les démarrages à froid et les performances asynchrones, consultez notre [analyse des runtimes 2026](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark).

L'API Temporal, la proposition de longue date pour remplacer l'objet `Date` problématique de JavaScript, a vu l'excitation décliner de 22 pour cent d'une année sur l'autre alors qu'elle passe de proposition à implémentation navigateur. L'API reste la proposition la plus attendue dans l'enquête.

Les résultats complets sont disponibles sur [2025.stateofjs.com](https://2025.stateofjs.com/en-US).
