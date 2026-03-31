---
title: "TypeScript 6.0 Sort : La Dernière Release Basée sur JavaScript Avant la Réécriture Go"
description: "Microsoft livre TypeScript 6.0 comme la dernière release construite sur le codebase JavaScript original. Mises à jour des types DOM, inférence améliorée, imports de sous-chemins et un flag de migration préparent le terrain pour le TypeScript 7.0 natif basé sur Go."
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
date: "2026-03-26"
category: Release
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "microsoft", "release", "compiler", "nodejs"]
tldr:
  - "TypeScript 6.0 publié le 23 mars 2026 — la dernière version majeure sur le compilateur basé sur JS avant la réécriture Go dans TypeScript 7."
  - "Fonctionnalités clés : inférence améliorée pour les fonctions contextuellement sensibles, mises à jour des types DOM pour les API Temporelles et imports de sous-chemins."
  - "Un nouveau flag de migration --goToJS aide les projets à identifier les patterns qui se comporteront différemment sous le compilateur Go."
  - "La syntaxe des import assertions est dépréciée dans 6.0 et produira des erreurs dans 7.0 — les projets doivent migrer vers la syntaxe 'with' maintenant."
faq:
  - question: "TypeScript 6.0 est-il une mise à niveau cassante ?"
    answer: "TypeScript 6.0 porte un nombre significatif de changements cassants par rapport à la 5.x, particulièrement autour de la syntaxe des import assertions et de la vérification de type des expressions de fonction dans les contextes JSX génériques. Microsoft utilise cette release pour retirer les patterns qui ne survivront pas au saut vers 7.0. Révisez la liste des changements cassants avant de mettre à niveau."
  - question: "Dois-je attendre TypeScript 7.0 ?"
    answer: "Non — TypeScript 6.0 est conçu comme une release de transition. Les changements cassants dans 6.0 préparent votre codebase pour 7.0, donc mettre à niveau maintenant et corriger les avertissements de dépréciation facilitera la migration vers 7.0."
  - question: "Qu'est-ce que la réécriture TypeScript en Go ?"
    answer: "TypeScript 7.0 est une réécriture complète du compilateur TypeScript en Go, remplaçant le codebase original basé sur JavaScript. La réécriture Go cible la vitesse d'exécution native et le multithreading à mémoire partagée, que l'architecture actuelle ne peut pas exploiter efficacement. Les premiers benchmarks montrent une vérification de type significativement plus rapide sur les grands projets — le codebase VS Code compile environ 10x plus vite sous le compilateur Go."
---

Microsoft a publié TypeScript 6.0 le 23 mars 2026. C'est, par conception, la fin d'une ère. C'est la dernière version majeure de TypeScript construite sur le codebase original du compilateur basé sur JavaScript. [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler), actuellement en développement et écrit en Go, arrivera plus tard cette année avec des vitesses d'exécution natives et du multithreading à mémoire partagée.

Daniel Rosenwasser, directeur de programme principal pour TypeScript, [l'a qualifié](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) de « pont » entre TypeScript 5.9 et [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler) — et la description correspond. 6.0 est moins sobre de nouvelles fonctionnalités языка flashy et plus sobre de nettoyer la maison et préparer l'écosystème pour le saut vers du code natif.

## Quoi de Neuf dans TypeScript 6.0

**Les mises à jour des types DOM** amènent les définitions de types intégrées de TypeScript en conformité avec les derniers standards web, y compris des ajustements aux API Temporelles. Si vous avez suivi les alternatives `Date` en évolution en JavaScript, cela compte.

**L'inférence améliorée pour les fonctions contextuellement sensibles** est le changement utilisateur le plus significatif. TypeScript peut désormais inférer les types de paramètres à travers l'ordre des propriétés dans les littéraux d'objet, même avec des méthodes écrites en syntaxe traditionnelle. Auparavant, passer `consume` avant `produce` dans un appel générique laisserait `y` typé comme `unknown` — cela fonctionne maintenant correctement.

**Les imports de sous-chemins** permettent des mappings `paths` plus précis dans `tsconfig.json`, vous laissant mapper des imports imbriqués sans capturer des siblings non liés.

**Un nouveau flag de migration** — `--goToJS` — aide les projets à naviguer la transition vers TypeScript 7.0 en identifiant les patterns qui se comporteront différemment sous le compilateur Go.

## Changements Cassants à Connaître

TypeScript 6.0 porte un nombre significatif de changements cassants par rapport à la 5.x. Microsoft utilise cette release pour retirer les patterns qui ne survivront pas au saut vers 7.0.

La syntaxe des import assertions (`import ... assert {...}`) est désormais dépréciée et produira des erreurs dans 7.0. La syntaxe `import()` plus récente avec `with` (ex: `import(..., { with: {...} })`) est le remplacement.

La vérification de type des expressions de fonction dans les contextes JSX génériques a été resserrée. Le code qui comptait sur une inférence lâche ici peut avoir besoin d'arguments de type explicites dans 6.0.

La direction globale de l'équipe TypeScript est claire : si quelque chose est déprécié dans 6.0, cela n'existera pas dans 7.0. Traitez les avertissements comme des erreurs et planifiez en conséquence.

## Pourquoi la Réécriture Go Compte

Le passage à Go n'est pas cosmétique. Le compilateur TypeScript actuel, fonctionnant sur Node.js, a des plafonds de performance bien documentés — particulièrement sur les grandes codebases. La réécriture Go cible deux choses : la vitesse d'exécution native et le multithreading à mémoire partagée, que l'architecture actuelle ne peut pas exploiter efficacement.

Les premiers benchmarks de Microsoft suggèrent que le compilateur Go est significativement plus rapide pour la vérification de type des grands projets. C'est la principale chose qui maintient les grandes codebases TypeScript d'entreprise éveillées la nuit.

## Ce Que Cela Signifie Pour Vos Projets

Si vous êtes sur TypeScript 5.x, mettre à niveau vers 6.0 devrait être relativement simple pour la plupart des projets — mais lisez la liste des changements cassants avant de le faire. Si vous êtes sur une version plus ancienne, c'est le moment d'auditer les patterns dépréciés et de les nettoyer avant que 7.0 n'arrive.

L'équipe TypeScript a publié des conseils sur le chemin de migration sur [devblogs.microsoft.com/typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/).

Installez la nouvelle version avec :

```bash
npm install -D typescript@6
```
