---
title: "Oxc Construisit Discrètement En Rust Le Toolkit JavaScript Le Plus Rapide — Et Il Est Presque Prêt"
description: "Alors qu'ESLint v10 se battait avec le ménage legacy, le projet Oxc a livré un linter 100x plus rapide, un formateur 30x plus rapide que Prettier, et un parser qui laisse SWC dans la poussière. Voici ce qu'est réellement le compilateur d'oxydation JavaScript."
date: "2026-04-05"
image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "rust", "tooling", "oxc", "performance", "typescript"]
---

Il y a un projet appelé [Oxc](https://oxc.rs/) que la plupart des développeurs JavaScript n'ont pas encore entendu. C'est le compilateur d'oxydation JavaScript — une collection d'outils JavaScript haute performance écrits en Rust. Et selon le benchmark que vous regardez, il pourrait déjà être la chose la plus rapide de sa catégorie.

## Ce qu'Oxc réellement est

Oxc n'est pas un outil unique. C'est une suite de composants qui ciblent chacun un travail spécifique dans le pipeline d'outils JavaScript :

- **Oxlint** — un linter compatible ESLint réclamant 50–100x plus rapide qu'ESLint, avec 700+ règles et support des plugins JS ESLint
- **Oxfmt** — un formateur compatible Prettier affichant 30x plus rapide que Prettier et 3x plus rapide que Biome
- **oxc-parser** — un parser JavaScript/TypeScript 3x plus rapide que SWC et 5x plus rapide que Biome sur les benchmarks de parsing
- **oxc-transform** — un transpileur gérant TypeScript, JSX et React Fast Refresh
- **oxc-resolver** — un résolveur de modules 28x plus rapide que enhanced-resolve de webpack
- **oxc-minify** — un minifier en alpha avec élimination du code mort et mangling des noms de variables

Le tout est open source, et tout vient de [Void Zero](https://voidzero.dev/), la société derrière le projet.

## Les chiffres ne sont pas proches

Les benchmarks d'Oxc valent le détour. Sur un MacBook Pro M3 Max parsant `typescript.js` :

- Oxc : 26,3ms
- SWC : 84,1ms
- Biome : 130,1ms

Pour le linting, Oxlint est 50–100x plus rapide qu'ESLint selon le nombre de cœurs CPU. Pour le formatage, Oxfmt est 3x plus rapide que Biome et 35x plus rapide que Prettier. Le transformateur est 4x plus rapide que SWC, utilise 20% moins de mémoire, et ship comme un package de 35MB contre 37MB pour SWC.

Ce ne sont pas des gains incrementaux. C'est un écart architectural.

## Linting type-aware sans tsc

L'une des affirmations les plus intéressantes est le « vrai linting type-aware alimenté par tsgo ». La plupart des règles ESLint type-aware (ou l'inférence de type de Biome) nécessitent d'exécuter le compilateur TypeScript en étape séparée ou d'implémenter une inférence de type personnalisée. L'approche d'Oxc ne semble pas reposer sur `tsc` de la même manière — ce qui serait significatif pour la vitesse de lint dans les grandes codebases TypeScript.

## Compatibilité plugins ESLint

Oxlint supporte les plugins JS ESLint nativement. C'est le déverrouillage critique pour l'adoption : les équipes n'ont pas besoin de réécrire leurs configurations de règles existantes from scratch. Si un plugin est écrit en JavaScript simple (la majorité de l'écosystème ESLint), il peut tourner sur Oxlint avec un friction minimal.

La couverture des règles est le manque restant. Oxlint a 700+ règles, mais l'écosystème ESLint est bien plus large. Pour les équipes avec des exigences de règles spécifiques et niches, cela peut encore être un blocker.

## Le tableau d'ensemble

Oxc s'inscrit dans un pattern plus large dans l'écosystème JavaScript : des outils écrits à l'origine en JavaScript being réécrits en Rust (ou Go, comme TypeScript l'explorerait apparemment) pour la performance. Biome l'a fait en premier avec un linter+formateur combiné. SWC a établi la baseline. Rolldown l'a fait pour le bundling. Oxc le fait pour l'ensemble du pipeline.

La release d'ESLint v10 cette semaine — avec sa migration legacy douloureuse et la frustration de la communauté autour des chemins de migration — est un rappel que la position d'acteur établi ne protège pas contre un meilleur produit. Oxc n'y est pas encore sur la parité écosystème. Mais la trajectoire est à surveiller de près en 2026.

tldr[]
- Oxc est un toolkit JavaScript basé sur Rust de Void Zero couvrant le linting, le formatage, le parsing, la transformation et la résolution de modules — tous réclamant des avances de performance significatives sur les alternatives JS-native existantes
- Oxlint est 50–100x plus rapide qu'ESLint avec 700+ règles et compatibilité plugins JS ESLint ; Oxfmt est 30x plus rapide que Prettier et 3x plus rapide que Biome
- Le principal manque restant est la largeur de l'écosystème — Oxlint n'a pas encore le catalogue complet des règles ESLint, mais l'avantage architectural est structurel, pas incrementiel

faq[]
- **Puis-je remplacer ESLint par Oxlint aujourd'hui ?** Pour la plupart des projets, probablement — Oxlint a 700+ règles et supporte les plugins JS ESLint. Mais vérifiez d'abord vos exigences de règles spécifiques.
- **Oxc est-il prêt pour la production ?** Le linter (Oxlint) et le formateur (Oxfmt) sont considérés stables. Le minifier est en alpha. Le parser passe tous les tests Test262 stage 4.
- **Comment se compare-t-il à Biome ?** Biome combine linting et formatage dans un seul outil et a un support de framework plus mature (Vue, Svelte, Astro). Oxc est plus rapide en performance brute et couvre plus du pipeline (transformateur, résolveur, minifier).
- **Qui finance ceci ?** Void Zero est la société derrière Oxc. Ils ont des sponsors or, argent et bronze, et le projet est open source sous l'OpenJS Foundation.
