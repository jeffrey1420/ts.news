---
title: "State of JavaScript 2025 : TypeScript atteint 40% d'utilisation exclusive, l'écosystème se stabilise"
description: "L'enquête State of JavaScript 2025 montre l'utilisation exclusive de TypeScript à 40%, la satisfaction Vite à 98% contre 26% pour Webpack, et Claude doublant sa part développeurs. L'écosystème murit plutôt qu'il ne brûle."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-27"
category: Survey
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "L'utilisation exclusive de TypeScript a atteint 40% (contre 34% en 2024, 28% en 2022) ; seulement 6% utilisent du JS pur exclusivement."
  - "La satisfaction Vite est de 98% contre 26% pour Webpack ; React à 83,6% mais le sentiment négatif de Next.js atteint 17%."
  - "L'utilisation de Claude a doublé de 22% à 44% ; Cursor a plus que doublé de 11% à 26% ; ChatGPT a décliné de 68% à 60%."
  - "Node.js reste dominant à 90% d'utilisation comme runtime ; Bun a grandi de 4 points à 21%, bien devant Deno à 11%."
---

Les résultats de l'enquête [State of JavaScript 2025](https://2025.stateofjs.com/en-US) sont là, et ils peignent un écosystème qui trouve ses repères. Menée en novembre 2025 et publiée en février 2026, l'enquête annuelle — organisée par Devographics et sponsorisée par Google Chrome et JetBrains — montre des gagnants clairs dans les outils, les frameworks et les préférences de langage, avec le bonheur des développeurs stable à 3,8 sur 5 pour la cinquième année consécutive.

## TypeScript a gagné — Et maintenant ?

Le chiffre principal : 40 pour cent des répondants écrivent désormais exclusivement en TypeScript — une tendance qui souligne pourquoi [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release), la dernière版本 basée sur JS avant la réécriture native Go, est un point de transition si crucial pour l'écosystème. Ce chiffre est passé de 34 pour cent en 2024 et 28 pour cent en 2022. Seulement 6 pour cent utilisent JavaScript pur exclusivement. Daniel Roe, leader de l'équipe core Nuxt, [l'a dit clairement](https://2025.stateofjs.com/en-US/conclusion/) dans la conclusion de l'enquête : "TypeScript a gagné. Pas comme un bundleur, mais comme un langage."

La tension intéressante est que "le manque de typage statique" reste le principal point de douleur du langage rapporté — parmi les développeurs qui n'ont pas adopté TypeScript. Lorsqu'on leur demande comment les types devraient fonctionner nativement en JavaScript, les annotations de type TypeScript-like ont mené avec 5 380 voix, devant les types runtime à 3 524.

## Outils de build : La domination de satisfaction de Vite

Vite a effectivement dépassé Webpack dans le sentiment des développeurs. Alors que Webpack conserve une utilisation globale légèrement supérieure (87% contre 84%), l'écart de satisfaction est saisissant : [Vite](/articles/2026-03-26-vite-8-rolldown-era) score 98 pour cent, Webpack score 26 pour cent — en baisse par rapport à 36 pour cent en 2024.

Le commentaire d'un répondant capture l'ambiance : "Essayer de comprendre du code legacy qui utilise Webpack peut être douloureux."

Turbopack, le successeur Rust de Vercel pour Webpack, est à seulement 28 pour cent d'utilisation, suggérant que l'avance de Vite et l'avantage expérience développeur seront difficiles à surmonter. Rolldown — le remplacement Rust de Rollupbeing intégré dans le futur de Vite — est passé de 1 pour cent à 10 pour cent, laissant entendre un pipeline de build JavaScript de plus en plus alimenté par Rust.

## Frustration React, Satisfaction Solid

React reste le framework le plus utilisé à 83,6 pour cent, mais l'enquête révèle une insatisfaction notable. Next.js, utilisé par 59 pour cent des répondants, a affiché un score de sentiment positif de 21 pour cent contre un sentiment négatif de 17 pour cent — générant le plus de commentaires de n'importe quel projet.

Réponses représentatives de l'enquête :
- "J'ai écrit Next.js en production depuis près de 6 ans... la complexité de Next est devenue absurde"
- "Bien que j'ai eu une expérience positive avec Next, je m'inquiète car Vercel essaie de l'utiliser pour gagner de l'argent"

Solid.js a maintenu la note de satisfaction la plus élevée pour la cinquième année consécutive. Dans l'espace des méta-frameworks, Astro a continué à gagner du terrain comme alternative orientée contenu.

## Les usages de l'IA changent

Les patterns de développement assisté par IA changent. L'utilisation de Claude a doublé de 22 à 44 pour cent, tandis que Cursor a plus que doublé de 11 à 26 pour cent. L'utilisation de ChatGPT a décliné de 68 à 60 pour cent — toujours dominant en termes absolus, mais en baisse.

## Backend : Node tient, Bun grandit

Du côté des runtimes, Node.js reste dominant à 90 pour cent. [Bun](/articles/2026-03-30-bun-v1-3-11-cron-anthropic) se place en troisième position à 21 pour cent — un gain de 4 pour cent sur l'année précédente — bien devant Deno à 11 pour cent. Pour un regard plus profond sur comment les trois runtimes se comparent en throughput, cold starts, et performance async, voyez notre [analyse de benchmark des runtimes 2026](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark).

L'API Temporal, la proposition de longue date pour remplacer l'objet `Date` problématique de JavaScript, a vu son enthousiasme décliner de 22 pour cent d'année en année alors qu'elle passe de proposition à implémentation navigateur. L'API reste la proposition la plus anticipée de l'enquête.

Les résultats complets sont disponibles sur [2025.stateofjs.com](https://2025.stateofjs.com/en-US).
