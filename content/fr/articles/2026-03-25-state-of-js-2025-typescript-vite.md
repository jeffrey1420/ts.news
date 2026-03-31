---
title: "State of JavaScript 2025 : TypeScript domine, Vite dépasse Webpack"
description: "L'enquête State of JavaScript 2025 révèle l'utilisation de TypeScript à un record historique, Vite écrasant Webpack en satisfaction, et des préoccupations croissantes sur la complexité de Next.js."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-25"
category: Ecosystem
author: lschvn
readingTime: 5
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "40 % des développeurs écrivent désormais exclusivement en TypeScript (contre 34 % en 2024) ; seulement 6 % utilisent JavaScript pur exclusivement."
  - "Vite atteint 84 % d'utilisation avec un score de satisfaction de 98 %, tandis que la satisfaction Webpack s'est effondrée à 26 % (contre 36 % en 2024)."
  - "React reste le plus utilisé à 83,6 %, mais Next.js attire des critiques croissantes sur la complexité et les incentives business de Vercel."
  - "Rolldown est passé de 1 % à 10 % d'utilisation en un an, annonçant un avenir basé sur Rust pour le pipeline de build JavaScript."
faq:
  - question: "TypeScript remplace-t-il JavaScript comme choix par défaut ?"
    answer: "Presque. 40 % des développeurs écrivent désormais exclusivement en TypeScript (contre 34 % en 2024), tandis que seulement 6 % s'en tiennent à JavaScript pur exclusivement. Daniel Roe, leader de l'équipe core Nuxt, l'a dit sans détour : 'TypeScript a gagné. Pas comme bundler, mais comme langage.' Avec le type stripping Node.js désormais stable, les dernières barrières techniques ont disparu."
  - question: "Pourquoi la satisfaction Webpack s'effondre-t-elle et quoi la remplace ?"
    answer: "La note de satisfaction de Webpack est tombée à 26 % en 2025, contre 36 % en 2024, alors que les développeurs se frustraient de sa complexité et de sa courbe d'apprentissage raide. Vite domine avec 98 % de satisfaction à 84 % d'utilisation. Turbopack se situe à seulement 28 % d'utilisation. Et Rolldown — la toolchain basée sur Rust compatible Rollup — est passé de 1 % à 10 % d'utilisation en un an."
  - question: "Qu'est-ce qui motive les critiques de Next.js malgré sa forte utilisation ?"
    answer: "Next.js affiche un sentiment positif de 21 % contre un sentiment négatif préoccupant de 17 % — générant plus d'activité de commentaires que n'importe quel autre projet. Les développeurs citent la complexité croissante ('la complexité Next.js est devenue absurde') et les préoccupations sur les incentives business de Vercel façonnant la direction du framework. Solid.js maintient la note de satisfaction la plus élevée parmi les frameworks majeurs."
---

L'enquête [State of JavaScript 2025](https://2025.stateofjs.com/en-US), publiée en février 2026 après collecte des réponses jusqu'en novembre 2025, dresse le portrait d'un écosystème qui mûrit. TypeScript a fermement gagné la guerre des langages, Vite a gagné la guerre des outils de build — du moins en termes de sentiment — et les développeurs sont de plus en plus vocaux sur la complexité des frameworks.

## TypeScript : le gagnant sans ambiguïté

L'utilisation de TypeScript continue de grimper. **40 % des répondants écrivent désormais exclusivement en TypeScript**, contre 34 % en 2024 et 28 % en 2022. Seulement 6 % utilisent JavaScript pur exclusivement. Lorsqu'on leur a demandé ce qu'ils changeraient à JavaScript, « manque de typage statique » reste la première douleur.

Les chiffres sont accablants, dans le bon sens. Daniel Roe, leader de l'équipe core Nuxt, l'a dit sans détour dans la conclusion de l'enquête :

> TypeScript a gagné. Pas comme bundler, mais comme langage.

Avec le type stripping désormais disponible dans [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) stable, les dernières barrières techniques s'effritent. La question n'est plus Whether to use TypeScript — c'est how fast you can migrate.

## Outils de build : Vite dévastate Webpack

Le récit des outils de build est tout aussi décisif. Vite se situe à **84 % d'utilisation avec un score de satisfaction de 98 %**. Webpack maintient une utilisation globale légèrement plus élevée à 87 %, mais sa note de satisfaction s'est effondrée à **26 %**, contre 36 % en 2024.

Un répondant a décrit l'état actuel : « essayer de comprendre du code legacy qui utilise Webpack peut être douloureux. » Ce sentiment résonne.

Turbopack, le successeur basé sur Rust de Webpack par Vercel, se situe à peine à 28 % d'utilisation. Malgré un marketing significatif, il n'a pas gagné la traction que beaucoup attendaient. L'avenir basé sur Rust du pipeline de build pourrait plutôt être [Rolldown](/articles/2026-03-26-vite-8-rolldown-era) — la toolchain compatible Rollup qui est passée de 1 % à 10 % d'utilisation en un an.

## Frameworks frontend : React domine, mais Next.js attire les critiques

React reste le framework le plus utilisé à **83,6 %**, mais l'enquête a exposé une insatisfaction croissante. Next.js, utilisé par 59 % des répondants, a affiché un sentiment positif de 21 % contre un sentiment négatif préoccupant de 17 % — générant plus d'activité de commentaires que n'importe quel autre projet.

Les plaintes s'articulent autour de la complexité :

> « J'ai écrit Next.js en production depuis presque 6 ans... la complexité Next est devenue absurde. »

D'autres ont exprimé leur préoccupation concernant les incentives business de Vercel façonnant la direction du framework. Un répondant l'a dit : « Je m'inquiète parce que Vercel essaie de s'en servir pour gagner de l'argent. »

Solid.js a maintenu la note de satisfaction la plus élevée parmi les frameworks majeurs, bien que son utilisation reste bien en dessous de React, Vue et Svelte.

## Ce que cela signifie pour les projets TypeScript

L'enquête confirme ce que beaucoup de développeurs TypeScript vivent déjà : l'écosystème s'est coalisé autour d'un ensemble de préférences stables. TypeScript, Vite, et soit Next.js soit un méta-framework alternatif sont les choix par défaut pour les nouveaux projets.

Le friction change. Ce n'est plus une question de Whether to use TypeScript — c'est une question de managing framework complexity as l'écosystème mûrit au-delà de sa phase d'innovation rapide.

Les résultats complets de l'enquête sont disponibles sur [2025.stateofjs.com](https://2025.stateofjs.com/en-US).
