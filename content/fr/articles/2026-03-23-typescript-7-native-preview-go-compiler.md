---
title: "Aperçu Natif TypeScript 7 : Project Corsa Réécrit le Compilateur en Go — Et Cela Change Tout"
description: "La décision de Microsoft de porter le compilateur TypeScript et le service de langage vers Go n'est pas qu'une démo technique — les premiers benchmarks montrent que le codebase VS Code compile en 7,5 secondes contre 77,8 secondes. Voici ce que l'ère native signifie pour votre pipeline de build et la performance de l'éditeur."
date: "2026-03-23"
category: "news"
author: lschvn
tags: ["typescript", "compiler", "performance", "go", "tooling", "project-corsa", "nodejs"]
readingTime: 12
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/microsoft/TypeScript"
tldr:
  - "Project Corsa porte le compilateur TypeScript en Go, réduisant la compilation VS Code de 77,8s à 7,5s — environ 10x plus rapide."
  - "TypeScript 6.0 sera la dernière release basée sur JS ; TypeScript 7 est l'ère native Go avec du multithreading à mémoire partagée."
  - "Node.js exécute désormais TypeScript nativement via le type stripping (stable depuis v25.2.0), activé par défaut depuis Node 22.18.0."
  - "Les développeurs doivent auditer les enums et namespaces maintenant — ces fonctionnalités non-érasables ne fonctionneront pas sous type stripping sans migration."
faq:
  - question: "Quand TypeScript 7.0 sera-t-il publié ?"
    answer: "Microsoft a indiqué que TypeScript 7.0 arrivera plus tard en 2026. L'aperçu natif basé sur le compilateur Go est déjà disponible via le tag npm @typescript/native-preview pour tester contre votre codebase aujourd'hui."
  - question: "Combien plus rapide est le compilateur TypeScript basé sur Go ?"
    answer: "Les premiers benchmarks sont dramatiques. Le codebase VS Code compile en 7,5 secondes contre 77,8 secondes avec le compilateur JavaScript — une amélioration d'environ 10x. La suite de tests Playwright est passée de 11,1 secondes à 1,1 seconde. Les temps de chargement de projet dans VS Code se sont également améliorés d'environ 8x."
  - question: "Mon code TypeScript existant fonctionnera-t-il sous le compilateur Go ?"
    answer: "Pour la plupart, oui. Le compilateur Go cible la parité de fonctionnalités avec TypeScript 6.0. Cependant, tout code utilisant des syntaxes non-érasables comme les enums et namespaces peut nécessiter une migration. Activez --erasableSyntaxOnly dans la CI pour détecter les problèmes avant la transition."
---

Le codebase VS Code de Microsoft compile en 7,5 secondes sous l'aperçu natif TypeScript 7 — contre 77,8 secondes avec l'actuel compilateur basé sur JavaScript. C'est une amélioration de 10×, et c'est le résultat principal du Project Corsa, la réécriture complète par Microsoft du compilateur TypeScript et du service de langage en Go.

TypeScript 7 change cela. Ou plutôt, il le changera — mais l'aperçu est déjà là et les chiffres sont difficiles à contester.

## Project Corsa : Le Port Natif

Début 2025, Microsoft a annoncé [Project Corsa](https://devblogs.microsoft.com/typescript/typescript-native-port/), un port natif complet du compilateur TypeScript et du service de langage vers Go. L'objectif était ambitieux : des temps de build environ 10x plus rapides et une réactivité significativement améliorée de l'éditeur.

Les premiers benchmarks étaient frappants. Sur le codebase VS Code lui-même — un grand projet TypeScript réel — la compilation est passée de **77,8 secondes à 7,5 secondes**. Sur la suite de tests Playwright, elle est passée de 11,1 secondes à 1,1 seconde. Ce ne sont pas des micro-benchmarks synthétiques. C'est le même codebase que Microsoft utilise pour construire VS Code, fonctionnant sur le même matériel.

Le port n'est pas encore complet. [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) reste la release basée sur JavaScript à travers laquelle l'écosystème migre. Microsoft a indiqué que TypeScript 6.0 sera la dernière version majeure construite sur la toolchain basée sur JS. TypeScript 7 est là où l'ère native commence véritablement.

## Ce Que « Natif » Signifie Vraiment En Pratique

Il y a deux dimensions à ce que TypeScript 7 change, et ça vaut le coup de les séparer.

**Le compilateur (`tsc`)** — Le compilateur TypeScript en ligne de commande. Un `tsc` basé sur Go signifie des compilations plus rapides, une utilisation mémoire plus faible pendant les builds et une meilleure intégration avec des toolchains non-JavaScript. Pour les projets qui exécutent `tsc` dans les pipelines CI, cela se traduit directement en cycles de feedback plus rapides.

**Le service de langage** — C'est ce qui alimente l'IntelliSense de VS Code, le soulignement des erreurs, la navigation vers les définitions et le refactoring. La performance de l'éditeur est bottlenecked par le service de langage, pas le compilateur. Microsoft rapporte que les temps de chargement de projet ont diminué d'environ **8x** dans les premiers tests. Pour tous ceux qui ont attendu 30+ secondes qu'un grand projet TypeScript devienne réactif dans VS Code, ce chiffre compte.

## Node.js Type Stripping : Exécuter TypeScript Sans Transpiler

En parallèle du travail sur le compilateur natif, Node.js a été livré avec le support natif TypeScript via une fonctionnalité appelée **type stripping**. C'est une approche fondamentalement différente pour exécuter TypeScript — au lieu de compiler des fichiers `.ts` en `.js`, Node.js peut maintenant exécuter TypeScript directement en strippant les annotations de type avant l'exécution.

Le calendrier a avancé vite :
- Node.js 22.18.0 (juillet 2025) a activé le type stripping par défaut
- Les avertissements ont été supprimés dans v24.3.0/22.18.0
- La fonctionnalité s'est stabilisée dans v25.2.0

La distinction clé est entre **syntaxe effaçable** (types, interfaces — tout ce qui disparaît à l'exécution) et **syntaxe runtime** (enums, namespaces — choses qui produisent du vrai JavaScript). Le type stripping fonctionne proprement pour la première. Pour la seconde, l'équipe Node.js a introduit un flag `--erasableSyntaxOnly` qui enforce cette séparation explicitement.

Cela signifie que vous pouvez maintenant écrire un fichier TypeScript et l'exécuter avec `node file.ts` — pas d'étape de build, pas de transpilation. Pour les scripts, les CLIs et le prototypage rapide, c'est une amélioration significative du workflow. Pour les builds de production, vous voudrez toujours `tsc` pour le cross-targeting et la vérification complète des types, mais l'écart entre « je veux essayer quelque chose » et « exécuter du code » se réduit considérablement.

## Ce Que Les Développeurs Doivent Faire Maintenant

La transition n'est pas automatique et il y a des étapes concrètes à prendre avant le changement :

**Auditez l'utilisation des enums et namespaces.** Ce sont les fonctionnalités TypeScript qui n'ont pas d'équivalent effaçable propre. Les enums peuvent être remplacés par des objets `as const` ; les namespaces peuvent migrer vers des modules ES. Si votre codebase utilise l'un ou l'autre intensivement, commencez la migration maintenant.

**Activez `--erasableSyntaxOnly` dans la CI.** Cela signale toute syntaxe TypeScript non-effaçable dans votre codebase, vous donnant une feuille de route de migration claire avant que le type-stripping ne devienne le comportement par défaut.

**Ajoutez TypeScript 7 preview aux pipelines CI.** Le tag npm `@typescript/native-preview` vous permet de tester le compilateur basé sur Go contre votre codebase aujourd'hui. Il ne remplacera pas encore votre build de production, mais il révèle les problèmes avant que la migration n'arrive.

**Surveillez les changements strict-by-default.** [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) envisage de faire de `strict` le mode par défaut pour les nouveaux projets. Si vous avezreporté l'activation des vérifications strict, maintenant c'est le moment — ce ne sera plus optionnel longtemps.

## Le Tableau Plus Large

Deux forces convergent. La première est la performance du compilateur : un compilateur TypeScript natif résout le plus gros point douloureux de l'expérience développeur quotidienne — lento editor startup et vérification de types lethargargique dans les grandes codebases. La seconde est le support runtime : Node.js exécutant TypeScript nativement supprime le dernier point de friction entre écrire un fichier avec annotations de type et l'exécuter.

Ensemble, ils font passer TypeScript de « un langage qui compile vers JavaScript » vers quelque chose de plus proche d'un langage système de première classe pour l'écosystème JavaScript. Que ce soit une bonne chose dépend de votre perspective — mais la direction est claire et les gains de performance sont réels.

L'ère TypeScript basée sur JavaScript n'est pas encore terminée. Mais TypeScript 7, avec son compilateur basé sur Go et la fonctionnalité de type-stripping Node.js qu'il rend possible, est le début d'un chapitre différent.
