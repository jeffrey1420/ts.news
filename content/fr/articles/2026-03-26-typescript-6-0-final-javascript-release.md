---
title: "TypeScript 6.0 sort : la dernière version basée sur JavaScript avant la réécriture en Go"
description: "Microsoft publie TypeScript 6.0 comme la dernière version construite sur la base de code JavaScript originale. Les mises à jour des types DOM, une inférence améliorée, les imports par sous-chemins et un flag de migration préparent le terrain pour TypeScript 7.0 natif en Go."
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
date: "2026-03-26"
category: Release
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "microsoft", "release", "compiler", "nodejs"]
tldr:
  - "TypeScript 6.0 publié le 23 mars 2026 — la dernière version majeure sur le compilateur JS avant la réécriture Go dans TypeScript 7."
  - "Fonctionnalités clés : inférence améliorée pour les fonctions sensibles au contexte, mises à jour des types DOM pour les API Temporal, et imports par sous-chemins."
  - "Un nouveau flag de migration `--goToJS` aide les projets à identifier les patterns qui se comporteront différemment sous le compilateur Go."
  - "La syntaxe des assertions d'import est obsolète dans 6.0 et provoquera des erreurs dans 7.0 — les projets doivent migrer vers la syntaxe `with` maintenant."
faq:
  - question: "TypeScript 6.0 est-il une mise à jour avec des breaking changes ?"
    answer: "TypeScript 6.0 comporte un nombre significatif de breaking changes par rapport à 5.x, notamment autour de la syntaxe des assertions d'import et de la vérification de type des expressions de fonctions dans les contextes JSX génériques. Microsoft utilise cette version pour abandonner les patterns qui ne survivront pas au passage à 7.0. Consultez la liste des breaking changes avant de mettre à jour."
  - question: "Dois-je attendre TypeScript 7.0 ?"
    answer: "Non — TypeScript 6.0 est conçu comme une version de transition. Les breaking changes dans 6.0 préparent votre base de code pour 7.0, donc mettre à jour maintenant et corriger les avertissements de dépréciation rendra la migration vers 7.0 plus fluide."
  - question: "Qu'est-ce que la réécriture Go de TypeScript ?"
    answer: "TypeScript 7.0 est une réécriture complète du compilateur TypeScript en Go, remplaçant la base de code JavaScript originale. La réécriture Go vise la vitesse d'exécution native et le multithreading à mémoire partagée, que l'architecture actuelle ne peut pas exploiter efficacement. Les premiers benchmarks montrent une vérification de type significativement plus rapide sur les grands projets."
---

Microsoft a publié TypeScript 6.0 le 23 mars 2026. C'est, par conception, la fin d'une ère. C'est la dernière version majeure de TypeScript construite sur la base de code du compilateur JavaScript originale. [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler), actuellement en développement et écrit en Go, arrivera plus tard cette année avec des vitesses d'exécution natives et du multithreading à mémoire partagée.

Daniel Rosenwasser, principal program manager pour TypeScript, [l'a qualifié](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) de « pont » entre TypeScript 5.9 et [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler) — et la description correspond. 6.0 est moins axé sur les nouvelles fonctionnalités de langage flashy et plus sur le nettoyage et la préparation de l'écosystème pour le saut vers le code natif.

## Quoi de neuf dans TypeScript 6.0

**Les mises à jour des types DOM** alignent les définitions de types intégrées de TypeScript avec les dernières normes web, y compris des ajustements pour les API Temporal. Si vous suivez les alternatives `Date` évolutives en JavaScript, c'est important.

**L'inférence améliorée pour les fonctions sensibles au contexte** est le changement le plus significatif pour les utilisateurs. TypeScript peut désormais inférer les types de paramètres à travers l'ordre des propriétés dans les littéraux d'objet, même avec des méthodes écrites en syntaxe traditionnelle. Auparavant, passer `consume` avant `produce` dans un appel générique laissait `y` typé comme `unknown` — cela fonctionne désormais correctement.

**Les imports par sous-chemins** permettent des mappages `paths` plus précis dans `tsconfig.json`, vous permettant de mapper des imports imbriqués sans attraper des frères non apparentés.

**Un nouveau flag de migration** — `--goToJS` — aide les projets à naviguer la transition vers TypeScript 7.0 en identifiant les patterns qui se comporteront différemment sous le compilateur Go.

## Breaking changes à connaître

TypeScript 6.0 comporte un nombre significatif de breaking changes par rapport à 5.x. Microsoft utilise cette version pour abandonner les patterns qui ne survivront pas au passage à 7.0.

La syntaxe des assertions d'import (`import ... assert {...}`) est désormais obsolète et provoquera des erreurs dans 7.0. La nouvelle syntaxe `import()` avec `with` (par exemple `import(..., { with: {...} })`) est le remplacement.

La vérification de type des expressions de fonctions dans les contextes JSX génériques a été resserrée. Le code qui s'appuyait sur une inférence lâche ici peut nécessiter des arguments de type explicites dans 6.0.

La direction générale de l'équipe TypeScript est claire : si quelque chose est obsolète dans 6.0, il n'existera pas dans 7.0. Traitez les avertissements comme des erreurs et planifiez en conséquence.

## Pourquoi la réécriture Go compte

Le passage à Go n'est pas cosmétique. Le compilateur TypeScript actuel, fonctionnant sur Node.js, a des plafonds de performance bien documentés — surtout sur les grandes bases de code. La réécriture Go vise deux choses : la vitesse d'exécution native et le multithreading à mémoire partagée, que l'architecture actuelle ne peut pas exploiter efficacement.

Les premiers benchmarks de Microsoft suggèrent que le compilateur Go est significativement plus rapide pour la vérification de type sur les grands projets. C'est la principale préoccupation qui maintient les grandes bases de code TypeScript d'entreprise éveillées la nuit.

## Ce que cela signifie pour vos projets

Si vous êtes sur TypeScript 5.x, la mise à jour vers 6.0 devrait être relativement simple pour la plupart des projets — mais lisez la liste des breaking changes avant de le faire. Si vous êtes sur une version plus ancienne, c'est le moment d'auditer les patterns obsolètes et de les nettoyer avant que 7.0 n'arrive.

L'équipe TypeScript a publié des conseils sur le chemin de migration sur [devblogs.microsoft.com/typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/).

Installez la nouvelle version avec :

```bash
npm install -D typescript@6
```
