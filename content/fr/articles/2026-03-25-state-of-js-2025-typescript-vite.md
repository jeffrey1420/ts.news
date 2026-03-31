---
title: "État de JavaScript 2025 : TypeScript Domine, Vite Surpasse Webpack"
description: "Le sondage State of JavaScript 2025 révèle l'utilisation de TypeScript à un niveau record, Vite écrasant Webpack en satisfaction et des préoccupations croissantes concernant la complexité de Next.js."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-25"
category: Ecosystem
author: lschvn
readingTime: 5
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "40% des développeurs écrivent désormais exclusivement en TypeScript (contre 34% en 2024) ; seulement 6% utilisent exclusivement du JavaScript simple."
  - "Vite atteint 84% d'utilisation avec un score de satisfaction de 98%, tandis que la satisfaction Webpack s'est effondrée à 26% (contre 36% en 2024)."
  - "React reste le plus utilisé à 83,6%, mais Next.js attire des critiques croissantes sur la complexité et les incitations commerciales de Vercel."
  - "Rolldown a bondi de 1% à 10% d'utilisation en un an, signalant un avenir basé sur Rust pour le pipeline de build JavaScript."
faq:
  - question: "TypeScript remplace-t-il JavaScript comme choix par défaut ?"
    answer: "Presque. 40% des développeurs écrivent désormais exclusivement en TypeScript (contre 34% en 2024), tandis que seulement 6% s'en tiennent à JavaScript simple. Daniel Roe, leader de l'équipe core Nuxt, l'a dit sans détour : 'TypeScript a gagné. Pas comme un bundler, mais comme un langage.' Avec le type stripping Node.js désormais stable, les dernières barrières techniques sont tombées."
  - question: "Pourquoi la satisfaction Webpack s'effondre-t-elle et quoi la remplace ?"
    answer: "La note de satisfaction de Webpack est tombée à 26% en 2025, contre 36% en 2024, les développeurs étant frustrés par sa complexité et sa courbe d'apprentissage abrupte. Vite domine avec 98% de satisfaction à 84% d'utilisation. Turbopack est à seulement 28% d'utilisation, et Rolldown — l'outil basé sur Rust compatible avec Rollup — a bondi de 1% à 10% d'utilisation en un an."
  - question: "Qu'est-ce qui motive les critiques de Next.js malgré sa haute utilisation ?"
    answer: "Next.js affiche un sentiment positif de 21% contre un sentiment négatif préoccupant de 17% — générant plus d'activité de commentaires que tout autre projet. Les développeurs citent la complexité croissante ('la complexité Next.js est devenue absurde') et les préoccupations concernant les incitations commerciales de Vercel façonnant la direction du framework."
---

Le sondage [State of JavaScript 2025](https://2025.stateofjs.com/en-US), publié en février 2026 après avoir collecté les réponses jusqu'en novembre 2025, peint un tableau d'un écosystème qui mûrit. TypeScript a fermement gagné la guerre des langages, Vite a gagné la guerre des outils de build — du moins en termes de sentiment — et les développeurs sont de plus en plus vocaux sur la complexité des frameworks.

## TypeScript : Le Gagnant Sans Ambiguïté

L'utilisation de TypeScript continue de grimper. **40% des répondants écrivent désormais exclusivement en TypeScript**, contre 34% en 2024 et 28% en 2022. Seulement 6% utilisent JavaScript simple exclusivement. Quand on leur demande ce qu'ils changeraient à JavaScript, « le manque de typage statique » reste le point douloureux numéro un.

Les chiffres sont accablants de la meilleure façon. Daniel Roe, leader de l'équipe core Nuxt, l'a dit sans détour dans la conclusion du sondage :

> TypeScript a gagné. Pas comme un bundler, mais comme un langage.

Avec le type stripping désormais disponible dans [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) stable, les dernières barrières techniques s'effritent. La question n'est plus si utiliser TypeScript — c'est à quelle vitesse vous pouvez migrer.

## Outils de Build : Vite Démolit Webpack

Le narrative des outils de build est tout aussi décisif. Vite est à **84% d'utilisation avec un score de satisfaction de 98%**. Webpack maintient une utilisation globale légèrement plus élevée à 87%, mais sa note de satisfaction s'est effondrée à **26%**, contre 36% en 2024.

Un répondant a décrit l'état actuel : « essayer de comprendre du code hérité qui utilise Webpack peut être douloureux. » Ce sentiment résonne.

Turbopack, le successeur de Webpack basé sur Rust de Vercel, est à seulement 28% d'utilisation. Malgré un marketing significatif, il n'a pas gagné la traction que beaucoup attendaient. L'avenir basé sur Rust du pipeline de build pourrait plutôt être [Rolldown](/articles/2026-03-26-vite-8-rolldown-era) — l'outil chain compatible Rollup basé sur Rust qui a bondi de 1% à 10% d'utilisation en un an.

## Frameworks Frontend : React Domine, Mais Next.js Attrape Des Coups

React reste le framework le plus utilisé à **83,6%**, mais le sondage a exposé une insatisfaction croissante. Next.js, utilisé par 59% des répondants, a affiché un sentiment positif de 21% contre un sentiment négatif préoccupant de 17% — générant plus d'activité de commentaires que tout autre projet.

Les plaintes se regroupent autour de la complexité :

> « J'ai écrit Next.js en production depuis presque 6 ans... la complexité Next est devenue absurde »

D'autres ont exprimé leur inquiétude concernant les incitations commerciales de Vercel façonnant la direction du framework. Un répondant a dit : « Je m'inquiète car Vercel essaie de l'utiliser pour gagner de l'argent. »

Solid.js a maintenu la note de satisfaction la plus élevée parmi les frameworks majeurs, bien que son utilisation reste bien en dessous de React, Vue et Svelte.

## Ce Que Cela Signifie Pour Les Projets TypeScript

Le sondage confirme ce que beaucoup de développeurs TypeScript expérimentent déjà : l'écosystème s'est coalisé autour d'un ensemble de préférences stables. TypeScript, Vite, et soit Next.js soit un meta-framework alternatif sont les choix par défaut pour les nouveaux projets.

Les frictions changent. Ce n'est plus une question de si utiliser TypeScript — c'est de gérer la complexité des frameworks alors que l'écosystème mûrit au-delà de sa phase d'innovation rapide.

Les résultats complets du sondage sont disponibles sur [2025.stateofjs.com](https://2025.stateofjs.com/en-US).
