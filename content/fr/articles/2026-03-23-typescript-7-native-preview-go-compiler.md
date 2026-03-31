---
title: "Aperçu natif TypeScript 7 : Project Corsa réécrit le compilateur en Go — et tout change"
description: "La décision de Microsoft de porter le compilateur TypeScript et le service de langage vers Go n'est pas une démonstration technique — les benchmarks préliminaires montrent que le codebase de VS Code se compile en 7,5 secondes contre 77,8 secondes. Voici ce que l'ère native signifie pour votre pipeline de build et la performance de l'éditeur."
date: "2026-03-23"
category: "news"
author: lschvn
tags: ["typescript", "compiler", "performance", "go", "tooling", "project-corsa", "nodejs"]
readingTime: 12
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/microsoft/TypeScript"
tldr:
  - "Project Corsa porte le compilateur TypeScript vers Go, réduisant la compilation de VS Code de 77,8s à 7,5s — environ 10x plus rapide."
  - "TypeScript 6.0 sera la dernière version basée sur JS ; TypeScript 7 est l'ère Go native avec du multithreading à mémoire partagée."
  - "Node.js exécute désormais TypeScript nativement via le type stripping (stable depuis v25.2.0), activé par défaut depuis Node 22.18.0."
  - "Les développeurs doivent auditer enums et namespaces dès maintenant — ces fonctionnalités non effaçables ne fonctionneront pas sans migration."
faq:
  - question: "Quand TypeScript 7.0 sera-t-il publié ?"
    answer: "Microsoft a indiqué que TypeScript 7.0 arrivera plus tard en 2026. L'aperçu natif basé sur le compilateur Go est déjà disponible via le tag npm @typescript/native-preview pour tester contre votre codebase dès aujourd'hui."
  - question: "Combien de fois plus rapide est le compilateur TypeScript basé sur Go ?"
    answer: "Les benchmarks préliminaires sont spectaculaires. Le codebase de VS Code se compile en 7,5 secondes contre 77,8 secondes avec le compilateur JavaScript — une amélioration d'environ 10x. La suite de tests Playwright est passée de 11,1 secondes à 1,1 seconde. Les temps de chargement des projets dans VS Code se sont également améliorés d'environ 8x."
  - question: "Mon code TypeScript existant fonctionnera-t-il sous le compilateur Go ?"
    answer: "Pour la plupart, oui. Le compilateur Go vise la parité de fonctionnalités avec TypeScript 6.0. Cependant, tout code utilisant une syntaxe non effaçable comme les enums et namespaces peut nécessiter une migration. Activez --erasableSyntaxOnly dans votre CI pour détecter les problèmes avant la transition."
---

Le codebase de VS Code de Microsoft se compile en 7,5 secondes sous l'aperçu natif TypeScript 7 — contre 77,8 secondes avec l'actuel compilateur basé sur JavaScript. C'est une amélioration de 10×, et c'est le résultat phare de Project Corsa, la réécriture complète par Microsoft du compilateur TypeScript et du service de langage en Go.

TypeScript 7 change cela. Ou plutôt, il le changera — mais l'aperçu est déjà là, et les chiffres sont difficiles à contester.

## Project Corsa : le port natif

Au début de 2025, Microsoft a annoncé [Project Corsa](https://devblogs.microsoft.com/typescript/typescript-native-port/), un port natif complet du compilateur TypeScript et du service de langage vers Go. L'objectif était ambitieux : des temps de build ~10x plus rapides et une réactivité significativement améliorée de l'éditeur.

Les benchmarks initiaux étaient saisissants. Sur le codebase de VS Code lui-même — un grand projet TypeScript réel — la compilation est passée de **77,8 secondes à 7,5 secondes**. Sur la suite de tests Playwright, elle est passée de 11,1 secondes à 1,1 seconde. Ce ne sont pas des micro-benchmarks synthétiques. C'est le même codebase que Microsoft utilise pour construire VS Code, sur le même matériel.

Le port n'est pas encore terminé. [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) reste la version basée sur JavaScript à travers laquelle l'écosystème effectue sa transition. Microsoft a indiqué que TypeScript 6.0 sera la dernière version majeure construite sur la toolchain JavaScript. TypeScript 7 est là où l'ère native commence véritablement.

## Ce que « natif » signifie réellement en pratique

Il y a deux dimensions à ce que TypeScript 7 change, et il vaut la peine de les séparer.

**Le compilateur (`tsc`)** — Le compilateur TypeScript en ligne de commande. Un `tsc` basé sur Go signifie des compilations plus rapides, une utilisation mémoire plus faible pendant les builds et une meilleure intégration avec les toolchains non-JavaScript. Pour les projets qui exécutent `tsc` dans les pipelines CI, cela se traduit directement par des cycles de feedback plus rapides.

**Le service de langage** — C'est ce qui alimente l'IntelliSense de VS Code, le soulignement des erreurs, la navigation vers les définitions et le refactoring. La performance de l'éditeur est limitée par le service de langage, pas le compilateur. Microsoft rapporte que les temps de chargement des projets ont diminué d'environ **8x** dans les tests préliminaires. Pour quiconque a attendu 30+ secondes qu'un grand projet TypeScript devienne réactif dans VS Code, ce chiffre compte.

## Type stripping Node.js : exécuter TypeScript sans transpiler

En parallèle du travail sur le compilateur natif, Node.js a expédié le support natif de TypeScript via une fonctionnalité appelée **type stripping**. C'est une approche fondamentalement différente pour exécuter TypeScript — au lieu de compiler des fichiers `.ts` vers `.js`, Node.js peut maintenant exécuter TypeScript directement en strippant les annotations de type avant l'exécution.

Le calendrier a avancé vite :
- Node.js 22.18.0 (juillet 2025) a activé le type stripping par défaut
- Les avertissements ont été supprimés dans v24.3.0/22.18.0
- La fonctionnalité s'est stabilisée dans v25.2.0

La distinction clé est entre **syntaxe effaçable** (types, interfaces — tout ce qui disparaît à l'exécution) et **syntaxe runtime** (enums, namespaces — choses qui produisent du JavaScript réel). Le type stripping fonctionne proprement pour la première. Pour la seconde, l'équipe Node.js a introduit un flag `--erasableSyntaxOnly` qui enforce cette séparation explicitement.

Cela signifie que vous pouvez maintenant écrire un fichier TypeScript et l'exécuter avec `node file.ts` — aucune étape de build, aucune transpilation. Pour les scripts, les CLIs et le prototypage rapide, c'est une amélioration significative du workflow. Pour les builds de production, vous voudrez toujours `tsc` pour le ciblage cross-plateforme et la vérification de types complète, mais l'écart entre « je veux essayer quelque chose » et « code en cours d'exécution » se réduit considérablement.

## Ce que les développeurs doivent faire maintenant

La transition n'est pas automatique, et il y a des étapes concrètes à prendre avant le changement :

**Audit de l'utilisation des enums et namespaces.** Ce sont les fonctionnalités TypeScript qui n'ont pas d'équivalent effaçable propre. Les enums peuvent être remplacés par des objets `as const` ; les namespaces peuvent migrer vers les modules ES. Si votre codebase utilise l'un ou l'autre intensivement, commencez la migration maintenant.

**Activez `--erasableSyntaxOnly` dans CI.** Cela signale toute syntaxe TypeScript non effaçable dans votre codebase, vous donnant une feuille de route de migration claire avant que le type stripping ne devienne le comportement par défaut.

**Ajoutez l'aperçu TypeScript 7 aux pipelines CI.** Le tag npm `@typescript/native-preview` vous permet de tester le compilateur Go contre votre codebase aujourd'hui. Il ne remplacera pas encore votre build de production, mais il expose les problèmes avant que la migration n'arrive.

**Surveillez les changements vers strict par défaut.** [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) envisage de faire du mode `strict` le défaut pour les nouveaux projets. Si vous avezreporté l'activation des vérifications strict, maintenant est le moment — cela ne sera plus optionnel longtemps.

## Le tableau d'ensemble

Deux forces convergent. La première est la performance du compilateur : un compilateur TypeScript natif résout le plus gros point douloureux de l'expérience développeur quotidienne — démarrage lent de l'éditeur et vérification de types paresseuse dans les grandes codebases. La seconde est le support runtime : Node.js exécutant TypeScript nativement supprime le dernier point de friction entre l'écriture d'un fichier annoté en types et son exécution.

Ensemble, ils font passer TypeScript de « un langage qui compile vers JavaScript » vers quelque chose de plus proche d'un langage système de première classe pour l'écosystème JavaScript. Que ce soit une bonne chose dépend de votre perspective — mais la direction est claire, et les gains de performance sont réels.

L'ère TypeScript basée sur JavaScript n'est pas encore terminée. Mais TypeScript 7, avec son compilateur basé sur Go et la fonctionnalité de type stripping Node.js qu'il permet, est le début d'un chapitre différent.
