---
title: "TypeScript 6.0 disponible : la dernière version basée sur JavaScript avant la réécriture Go"
description: "Microsoft livre TypeScript 6.0 comme la dernière version construite sur la base de code JavaScript originale. Mises à jour des types DOM, inférence améliorée, imports de subpath et un flag de migration préparent le terrain pour TypeScript 7.0 Go natif."
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
date: "2026-03-26"
category: Release
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "microsoft", "release", "compiler", "nodejs"]
tldr:
  - "TypeScript 6.0 publié le 23 mars 2026 — la dernière version majeure sur le compilateur JS avant la réécriture Go de TypeScript 7."
  - "Fonctionnalités clés : inférence améliorée pour les fonctions contextuellement sensibles, mises à jour des types DOM pour les APIs Temporal, et imports de subpath."
  - "Un nouveau flag de migration `--goToJS` aide les projets à identifier les patterns qui se comporteront différemment sous le compilateur Go."
  - "La syntaxe des import assertions est dépréciée en 6.0 et produira une erreur en 7.0 — migrez vers la syntaxe `with` dès maintenant."
faq:
  - question: "TypeScript 6.0 est-il une mise à niveau cassante ?"
    answer: "TypeScript 6.0 porte un nombre significatif de changements cassants par rapport à la 5.x, particulièrement autour de la syntaxe des import assertions et de la vérification de types des expressions de fonction dans les contextes JSX génériques. Microsoft utilise cette version pour retraite les patterns qui ne survivront pas au saut vers la 7.0. Lisez la liste des changements cassants avant de mettre à niveau."
  - question: "Dois-je attendre TypeScript 7.0 ?"
    answer: "Non — TypeScript 6.0 est conçu comme une version puente. Les changements cassants en 6.0 préparent votre codebase pour la 7.0, donc mettre à niveau maintenant et corriger les avertissements de dépréciation rendra la migration vers la 7.0 plus fluide."
  - question: "Qu'est-ce que la réécriture Go de TypeScript ?"
    answer: "TypeScript 7.0 est une réécriture complète du compilateur TypeScript en Go, remplaçant la base de code originale basée sur JavaScript. La réécriture Go cible la vitesse d'exécution native et le multithreading à mémoire partagée, que l'architecture actuelle ne peut pas exploiter efficacement. Les benchmarks préliminaires montrent une vérification de types significativement plus rapide sur les grands projets — le codebase de VS Code se compile environ 10x plus vite sous le compilateur Go."
---

Microsoft a publié TypeScript 6.0 le 23 mars 2026. C'est, par conception, la fin d'une ère. C'est la dernière version majeure de TypeScript construite sur la base de code originale du compilateur basée sur JavaScript. [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler), actuellement en développement et écrit en Go, arrivera plus tard cette année avec des vitesses d'exécution natives et du multithreading à mémoire partagée.

Daniel Rosenwasser, chef de programme principal pour TypeScript, [l'a qualifié](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) de « puente » entre TypeScript 5.9 et [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler) — et la description convient. La 6.0 est moins axée sur des fonctionnalités языковые flashy et plus sur le ménage et la préparation de l'écosystème pour le saut vers du code natif.

## Quoi de neuf dans TypeScript 6.0

**Les mises à jour des types DOM** mettent les définitions de types intégrées de TypeScript en accord avec les dernières normes web, y compris les ajustements des APIs Temporal. Si vous avez suivi les alternatives `Date` en évolution dans JavaScript, cela compte.

**L'inférence améliorée pour les fonctions contextuellement sensibles** est le changement utilisateur le plus significatif. TypeScript peut désormais inférer les types de paramètres à travers l'ordre des propriétés dans les littéraux objet, même avec des méthodes écrites en syntaxe traditionnelle. Auparavant, passer `consume` avant `produce` dans un appel générique laissait `y` typé comme `unknown` — cela fonctionne désormais correctement.

**Les imports de subpath** permettent des mappings `paths` plus précis dans `tsconfig.json`, vous laissant mapper des imports imbriqués sans attraper les siblings non liés.

**Un nouveau flag de migration** — `--goToJS` — aide les projets à naviguer la transition vers TypeScript 7.0 en identifiant les patterns qui se comporteront différemment sous le compilateur Go.

## Changements cassants à connaître

TypeScript 6.0 porte un nombre significatif de changements cassants par rapport à la 5.x. Microsoft utilise cette version pour retirer des patterns qui ne survivront pas au saut vers la 7.0.

La syntaxe des import assertions (`import ... assert {...}`) est désormais dépréciée et produira des erreurs en 7.0. La syntaxe `import()` plus récente avec `with` (ex : `import(..., { with: {...} })`) est le remplacement.

La vérification de types des expressions de fonction dans les contextes JSX génériques a été renforcée. Le code qui s'appuyait sur une inférence lâche ici peut avoir besoin d'arguments de type explicites en 6.0.

La direction globale de l'équipe TypeScript est claire : si quelque chose est déprécié en 6.0, cela n'existera pas en 7.0. Traitez les avertissements comme des erreurs et planifiez en conséquence.

## Pourquoi la réécriture Go compte

Le passage à Go n'est pas cosmétique. Le compilateur TypeScript actuel, fonctionnant sur Node.js, a des plafonds de performance bien documentés — particulièrement sur les grandes codebases. La réécriture Go cible deux choses : la vitesse d'exécution native et le multithreading à mémoire partagée, que l'architecture actuelle ne peut pas exploiter efficacement.

Les benchmarks préliminaires de Microsoft suggèrent que le compilateur Go est significativement plus rapide pour la vérification de types sur les grands projets. C'est la principale chose qui empêche les grandes codebases TypeScript enterprise de dormir.

## Ce que cela signifie pour vos projets

Si vous êtes sur TypeScript 5.x, la mise à niveau vers la 6.0 devrait être relativement simple pour la plupart des projets — mais lisez la liste des changements cassants avant de le faire. Si vous êtes sur une ancienne version, c'est le moment d'auditer les patterns dépréciés et de les nettoyer avant l'arrivée de la 7.0.

L'équipe TypeScript a publié des conseils sur le chemin de migration sur [devblogs.microsoft.com/typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/).

Installez la nouvelle version avec :

```bash
npm install -D typescript@6
```
