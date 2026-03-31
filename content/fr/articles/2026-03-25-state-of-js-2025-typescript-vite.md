---
title: "State of JavaScript 2025 : TypeScript domine, Vite dépasse Webpack"
description: "L'enquête State of JavaScript 2025 révèle l'utilisation de TypeScript à un niveau record, Vite écrasant Webpack en satisfaction, et des préoccupations croissantes concernant la complexité de Next.js."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-25"
category: Ecosystem
author: lschvn
readingTime: 5
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "40 % des développeurs écrivent désormais exclusivement en TypeScript (contre 34 % en 2024) ; seulement 6 % utilisent du JavaScript pur exclusivement."
  - "Vite atteint 84 % d'utilisation avec un score de satisfaction de 98 %, tandis que la satisfaction Webpack s'effondre à 26 % (contre 36 % en 2024)."
  - "React reste le plus utilisé à 83,6 %, mais Next.js suscite des critiques croissantes sur la complexité et les incitations commerciales de Vercel."
  - "Rolldown est passé de 1 % à 10 % d'utilisation en un an, signalant un avenir Rust pour la pipeline de build JavaScript."
---

L'enquête [State of JavaScript 2025](https://2025.stateofjs.com/en-US), publiée en février 2026 après avoir collecté les réponses jusqu'en novembre 2025, dresse le portrait d'un écosystème qui mûrit. TypeScript a clairement gagné la guerre des langages, Vite a gagné la guerre des outils de build — au moins en termes de sentiment — et les développeurs sont de plus en plus critiques sur la complexité des frameworks.

## TypeScript : le vainqueur sans ambiguïté

L'utilisation de TypeScript continue de grimper. **40 % des répondants écrivent désormais exclusivement en TypeScript**, contre 34 % en 2024 et 28 % en 2022. Seulement 6 % utilisent du JavaScript pur exclusivement. Quand on leur demande ce qu'ils changeraient à JavaScript, « le manque de typage statique » reste la première source de frustration.

Les chiffres sont accablants de la meilleure façon. Daniel Roe, leader de l'équipe principale de Nuxt, l'a dit crûment dans la conclusion de l'enquête :

> TypeScript a gagné. Pas en tant que bundler, mais en tant que langage.

Avec le type stripping désormais disponible dans [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) stable, les dernières barrières techniques s'effritent. La question n'est plus de savoir s'il faut utiliser TypeScript — c'est la rapidité avec laquelle vous pouvez migrer.

## Outils de build : Vite écrase Webpack

Le récit des outils de build est tout aussi décisif. Vite est à **84 % d'utilisation avec un score de satisfaction de 98 %**. Webpack maintient une utilisation globale légèrement supérieure à 87 %, mais son taux de satisfaction s'est effondré à **26 %**, contre 36 % en 2024.

Un répondant a décrit l'état actuel : « essayer de comprendre du code legacy qui utilise Webpack peut être douloureux ». Ce sentiment fait écho.

Turbopack, le successeur Rust de Vercel, n'est qu'à 28 % d'utilisation. Malgré un effort marketing important, il n'a pas gagné la traction que beaucoup attendaient. L'avenir Rust de la pipeline de build pourrait être [Rolldown](/articles/2026-03-26-vite-8-rolldown-era) — la toolchain compatible Rollup qui est passée de 1 % à 10 % d'utilisation en un an.

## Frameworks frontend : React domine, mais Next.js sous le feu

React reste le framework le plus utilisé à **83,6 %**, mais l'enquête a révélé une insatisfaction croissante. Next.js, utilisé par 59 % des répondants, affiche un sentiment positif de 21 % contre un sentiment négatif préoccupant de 17 % — générant plus d'activité de commentaires que tout autre projet.

Les plaintes se concentrent autour de la complexité :

> « J'écris du Next.js en production depuis bientôt 6 ans... la complexité de Next est devenue absurde »

D'autres ont exprimé des inquiétudes quant aux incitations commerciales de Vercel qui façonnent la direction du framework. Un répondant a déclaré : « Je suis inquiet parce que Vercel essaie de l'utiliser pour gagner de l'argent. »

Solid.js a maintenu le taux de satisfaction le plus élevé parmi les frameworks majeurs, bien que son utilisation reste bien inférieure à React, Vue et Svelte.

## Ce que cela signifie pour les projets TypeScript

L'enquête confirme ce que beaucoup de développeurs TypeScript vivent déjà : l'écosystème s'est regroupé autour d'un ensemble de préférences stables. TypeScript, Vite et soit Next.js soit une alternative méta-framework sont les choix par défaut pour les nouveaux projets.

La friction se déplace. Ce n'est plus une question d'utiliser TypeScript ou non — c'est la gestion de la complexité des frameworks alors que l'écosystème mûrit au-delà de sa phase d'innovation rapide.

Les résultats complets de l'enquête sont disponibles sur [2025.stateofjs.com](https://2025.stateofjs.com/en-US).
