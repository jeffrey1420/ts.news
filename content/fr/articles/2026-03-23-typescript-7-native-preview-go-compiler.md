---
title: "Aperçu natif de TypeScript 7 : le projet Corsa réécrit le compilateur en Go — et ça change tout"
description: "La décision de Microsoft de porter le compilateur et le service de langage TypeScript en Go n'est pas juste une démo technique — les premiers benchmarks montrent la base de code VS Code compilant en 7,5 secondes contre 77,8 secondes. Voici ce que l'ère native signifie pour votre pipeline de build et les performances de l'éditeur."
date: "2026-03-23"
category: "news"
author: lschvn
tags: ["typescript", "compiler", "performance", "go", "tooling", "project-corsa", "nodejs"]
readingTime: 12
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/microsoft/TypeScript"
tldr:
  - "Le projet Corsa porte le compilateur TypeScript en Go, faisant passer la compilation VS Code de 77,8s à 7,5s — environ 10x plus rapide."
  - "TypeScript 6.0 sera la dernière version basée sur JS ; TypeScript 7 est l'ère Go native avec multithreading à mémoire partagée."
  - "Node.js exécute désormais TypeScript nativement via le type stripping (stable depuis v25.2.0), activé par défaut depuis Node 22.18.0."
  - "Les développeurs doivent auditer leurs enums et namespaces maintenant — ces fonctionnalités non effaçables ne fonctionneront pas sous le type stripping sans migration."
faq:
  - question: "Quand TypeScript 7.0 sera-t-il publié ?"
    answer: "Microsoft a indiqué que TypeScript 7.0 arrivera courant 2026. L'aperçu natif basé sur le compilateur Go est déjà disponible via le tag npm @typescript/native-preview pour tester votre base de code dès aujourd'hui."
  - question: "Le compilateur TypeScript basé sur Go est-il vraiment plus rapide ?"
    answer: "Les premiers benchmarks sont spectaculaires. La base de code VS Code compile en 7,5 secondes contre 77,8 secondes avec le compilateur JavaScript — une amélioration d'environ 10x. La suite de tests Playwright est passée de 11,1 secondes à 1,1 seconde. Les temps de chargement des projets dans VS Code se sont également améliorés d'environ 8x."
---

La base de code VS Code de Microsoft compile en 7,5 secondes sous l'aperçu natif de TypeScript 7 — contre 77,8 secondes avec le compilateur JavaScript actuel. C'est une amélioration de 10×, et c'est le résultat phare du projet Corsa, la réécriture complète du compilateur et du service de langage TypeScript en Go par Microsoft.

TypeScript 7 change cela. Ou plutôt, il le changera — mais l'aperçu est déjà là, et les chiffres sont difficiles à contester.

## Projet Corsa : le portage natif

Début 2025, Microsoft a annoncé le [projet Corsa](https://devblogs.microsoft.com/typescript/typescript-native-port/), un portage natif complet du compilateur et du service de langage TypeScript vers Go. L'objectif était ambitieux : des temps de build ~10x plus rapides et une réactivité de l'éditeur significativement améliorée.

Les premiers benchmarks étaient frappants. Sur la base de code VS Code elle-même — un grand projet TypeScript réel — la compilation est passée de **77,8 secondes à 7,5 secondes**. Sur la suite de tests Playwright, elle est passée de 11,1 secondes à 1,1 seconde. Ce ne sont pas des micro-benchmarks synthétiques. C'est la même base de code que Microsoft utilise pour construire VS Code, exécutée sur le même matériel.

Le portage n'est pas encore terminé. [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) reste la version basée sur JavaScript par laquelle l'écosystème fait la transition. Microsoft a indiqué que TypeScript 6.0 serait la dernière version majeure construite sur la toolchain JavaScript. TypeScript 7 est là où l'ère native commence véritablement.

## Ce que « natif » signifie concrètement

Il y a deux dimensions à ce que TypeScript 7 change, et il vaut la peine de les séparer.

**Le compilateur (`tsc`)** — Le compilateur TypeScript en ligne de commande. Un `tsc` basé sur Go signifie des compilations plus rapides, une utilisation mémoire réduite pendant les builds, et une meilleure intégration avec les toolchains non-JavaScript. Pour les projets qui exécutent `tsc` dans leurs pipelines CI, cela se traduit directement par des cycles de feedback plus rapides.

**Le service de langage** — C'est ce qui alimente l'IntelliSense de VS Code, le soulignement des erreurs, le saut vers la définition et le refactoring. Les performances de l'éditeur sont limitées par le service de langage, pas par le compilateur. Microsoft rapporte que les temps de chargement des projets ont diminué d'environ **8x** lors des premiers tests. Pour quiconque a attendu 30+ secondes pour qu'un grand projet TypeScript devienne réactif dans VS Code, ce chiffre compte.

## Node.js Type Stripping : exécuter TypeScript sans transpiler

En parallèle du travail sur le compilateur natif, Node.js a livré le support natif de TypeScript via une fonctionnalité appelée **type stripping**. C'est une approche fondamentalement différente pour exécuter TypeScript — au lieu de compiler les fichiers `.ts` en `.js`, Node.js peut désormais exécuter TypeScript directement en supprimant les annotations de type avant l'exécution.

La chronologie a évolué rapidement :
- Node.js 22.18.0 (juillet 2025) a activé le type stripping par défaut
- Les avertissements ont été supprimés dans v24.3.0/22.18.0
- La fonctionnalité s'est stabilisée dans v25.2.0

La distinction clé se situe entre la **syntaxe effaçable** (types, interfaces — tout ce qui disparaît à l'exécution) et la **syntaxe d'exécution** (enums, namespaces — les choses qui produisent du JavaScript réel). Le type stripping fonctionne proprement pour les premiers. Pour les seconds, l'équipe Node.js a introduit un flag `--erasableSyntaxOnly` qui impose cette séparation explicitement.

Cela signifie que vous pouvez désormais écrire un fichier TypeScript et l'exécuter avec `node file.ts` — pas d'étape de build, pas de transpilation. Pour les scripts, les CLI et le prototypage rapide, c'est une amélioration significative du flux de travail. Pour les builds de production, vous aurez toujours besoin de `tsc` pour le cross-targeting et la vérification complète des types, mais l'écart entre « je veux essayer quelque chose » et « du code qui s'exécute » se réduit considérablement.

## Ce que les développeurs doivent faire maintenant

La transition n'est pas automatique, et il y a des étapes concrètes à prendre avant le basculement :

**Auditez l'utilisation des enums et namespaces.** Ce sont les fonctionnalités TypeScript qui n'ont pas d'équivalent effaçable propre. Les enums peuvent être remplacés par des objets `as const` ; les namespaces peuvent migrer vers les modules ES. Si votre base de code utilise l'un ou l'autre massivement, commencez la migration maintenant.

**Activez `--erasableSyntaxOnly` dans la CI.** Cela signale toute syntaxe TypeScript non effaçable dans votre base de code, vous donnant une feuille de route claire de migration avant que le type stripping ne devienne le comportement par défaut.

**Ajoutez l'aperçu TypeScript 7 aux pipelines CI.** Le tag npm `@typescript/native-preview` vous permet de tester le compilateur Go contre votre base de code dès aujourd'hui. Il ne remplacera pas encore votre build de production, mais il identifiera les problèmes avant que la migration n'arrive.

**Surveillez les changements strict-by-default.** [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) envisage de rendre le mode `strict` par défaut pour les nouveaux projets. Si vous avez repoussé l'activation des vérifications strictes, c'est le moment — elles ne seront bientôt plus optionnelles.

## La vue d'ensemble

Deux forces convergent. La première est la performance du compilateur : un compilateur TypeScript natif résout le plus grand point de douleur dans l'expérience développeur quotidienne — le démarrage lent de l'éditeur et la vérification de type lente dans les grandes bases de code. La seconde est le support d'exécution : Node.js exécutant TypeScript nativement supprime le dernier point de friction entre l'écriture d'un fichier annoté en types et son exécution.

Ensemble, ils font évoluer TypeScript d'« un langage qui compile vers JavaScript » vers quelque chose de plus proche d'un langage système de premier plan pour l'écosystème JavaScript. Que ce soit une bonne chose dépend de votre perspective — mais la direction est claire, et les gains de performance sont réels.

L'ère du TypeScript basé sur JavaScript n'est pas encore terminée. Mais TypeScript 7, avec son compilateur Go et la fonctionnalité de type stripping de Node.js qu'il permet, est le début d'un chapitre différent.
