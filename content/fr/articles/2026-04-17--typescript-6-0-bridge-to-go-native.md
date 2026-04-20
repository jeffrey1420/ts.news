---
title: "TypeScript 6.0 : la dernière release JavaScript avant le compilateur natif en Go"
description: "TypeScript 6.0 arrive comme une version de transition avec les imports de sous-chemin en #/, le tri stable des types, et une voie royale vers TypeScript 7.0 compilé en Go."
date: 2026-04-17
image: "https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2026/03/ts-6.0-2.png"
author: lschvn
tags: ["TypeScript", "JavaScript", "Microsoft", "Compiler", "Go"]
tldr:
  - TypeScript 6.0 est la dernière version sur la base de code JavaScript actuelle — TypeScript 7.0 sera construit en Go pour la vitesse native et le parallélisme à mémoire partagée
  - Nouvelles fonctionnalités : imports de sous-chemin #/, Map.getOrInsert/getOrInsertComputed, types pour l'API Temporal, et inférence relâchée pour les méthodes n'utilisant pas `this`
  - Plusieurs valeurs par défaut changent : strict=true, module=esnext, types=[], rootDir=. — beaucoup de projets verront leurs builds accélérés de 20-50% mais devront peut-être configurer explicitement les types
faq:
  - q: "Comment se préparer pour TypeScript 7.0 ?"
    a: "Utilisez TypeScript 6.0 maintenant. Essayez le preview natif de TypeScript 7.0 dans VS Code (extension TypeScriptTeam.native-preview) ou via npmx.dev. Le flag --stableTypeOrdering permet de détecter les différences早早."
  - q: "Pourquoi TypeScript a-t-il réécrit en Go ?"
    a: "Le compilateur en Go vise la vitesse d'exécution native et le multithreading à mémoire partagée, ce que l'implémentation TypeScript actuelle ne peut pas atteindre efficacement. L'équipe a annoncé ce changement en 2025 et la 7.0 est décrite comme 'extrêmement proche de la completion'."
  - q: "Que faire si mon projet casse après la mise à jour ?"
    a: "Déclarez explicitement 'types' (ex: ['node', 'jest']), configurez 'rootDir' si vos sources sont imbriquées, mettez 'strict': false si vous comptiez sur l'ancienne valeur par défaut, et révisez l'option ignoreDeprecations."
---

TypeScript 6.0 est sorti ce mois-ci, et il porte un poids que peu de releases mineures assument : c'est la dernière version construite sur la base de code JavaScript actuelle. Tout ce qui suivra, à partir de la 7.0, sera compilé en Go natif — un compilateur que l'équipe développe depuis plus d'un an.

## Un pont vers TypeScript 7.0

L'histoire principale, c'est ce que 6.0 ne contient pas. Microsoft le dit clairement : c'est une "release de transition" dont le but est d'aligner les comportements et les API pour que le passage à la base de code Go se fasse sans accroc. L'équipe est directe : "TypeScript 7.0 est en fait extrêmement proche de la complétion." Vous pouvez déjà essayer le preview natif dans VS Code ou via `npmx.dev/package/@typescript/native-preview`.

La plupart des changements de la 6.0 existent pour faciliter cette transition. Mais il y a aussi des fonctionnalités nouvelles.

## Moins de sensibilité au `this` dans l'inférence de types

Un grain de sable longtemps irritant disparaît. Quand TypeScript infère des paramètres de type depuis un callback, il saute par-dessus les fonctions "sensibles au contexte" — celles dont les paramètres n'ont pas de type explicite. Les méthodes écrites avec la syntaxe shorthand étaient toujours traitées comme sensibles car elles portent un `this` implicite, même si `this` n'est jamais utilisé. Les fonctions fléchées n'avaient pas ce problème.

TypeScript 6.0 vérifie désormais si `this` est réellement référencé avant de marquer une méthode comme sensible. Si vous n'utilisez jamais `this`, la méthode participe normalement à l'inférence de type. Le correctif a été contribué par Mateusz Burzyński ([PR #62243](https://github.com/microsoft/TypeScript/pull/62243)).

## Les imports de sous-chemin supportent désormais `#/`

Node.js a récemment ajouté le support des imports de sous-chemin commençant par `#/` plutôt que `#/quelquechose`. TypeScript 6.0 le prend en charge avec `--moduleResolution nodenext` et `bundler`. Vous pouvez désormais écrire :

```json
{
  "imports": {
    "#/*": "./dist/*"
  }
}
```

Cela s'aligne avec la façon dont les bundlers gèrent habituellement les alias de chemin et supprime le besoin d'un segment bidon après `#`.

## Combiner `--moduleResolution bundler` avec `commonjs`

Auparavant `--moduleResolution bundler` nécessitait `--module esnext` ou `--module preserve`. Avec la dépréciation de `moduleResolution: node`, cette contrainte est levée. La nouvelle combinaison valide est `--module commonjs` avec `--moduleResolution bundler`, un chemin de migration pratique pour beaucoup de projets existants ([PR #62320](https://github.com/microsoft/TypeScript/pull/62320)).

## Stable Type Ordering pour les migrations 6.0 vers 7.0

Le vérificateur de types parallèle de TypeScript 7.0 trie les objets internes de façon déterministe. TypeScript 6.0 introduit `--stableTypeOrdering` pour rendre sa sortie conforme à cet ordre. C'est principalement un outil de migration — le flag peut ralentir le type-checking jusqu'à 25% — mais il garantit que les fichiers de déclaration et les messages d'erreur ne changent pas de façon inattendue lors de la montée de version. Le flag n'est pas recommandé pour un usage permanent.

## Cible ES2025 et nouveaux types pour les API natives

TypeScript 6.0 ajoute `es2025` comme valeur valide pour `--target` et `--lib`. Cela apporte `RegExp.escape` (stage 4) et déplace `Promise.try`, les méthodes d'itérateur et les méthodes de Set dans la lib stable. L'API Temporal — le remplaçant attendu de `Date` — reçoit aussi des types intégrés complets dans la 6.0. Les types `Map` et `WeakMap` gagnent `getOrInsert` et `getOrInsertComputed` (stage 4) pour le pattern courant "get or create".

## Consolidation de la lib DOM

Le contenu de `lib.dom.iterable.d.ts` et `lib.dom.asynciterable.d.ts` est désormais entièrement fusionné dans `lib.dom.d.ts`. Vous n'avez plus besoin d'ajouter `dom.iterable` à votre tableau `lib` juste pour itérer sur un `NodeList`.

## Breaking Changes qui vous toucheront probablement

TypeScript 6.0 inverse plusieurs valeurs par défaut sur lesquelles des projets plus anciens ont pu s'appuyer :

- **`strict` est maintenant `true` par défaut** — si vous comptiez sur l'absence de strictitude implicite, passez `"strict": false` explicitement
- **`module` est `esnext` par défaut** — l'ESM est désormais le format supposé pour les nouveaux projets
- **`target` est la valeur de l'année courante** (actuellement `es2025`) — la cible `es5` est dépréciée
- **`types` est maintenant `[]` par défaut** au lieu d'énumérer tout dans `node_modules/@types` — cela seul a réduit les temps de build de 20 à 50% dans les projets étudiés par l'équipe. Ajoutez des types explicites : `["node", "jest"]` etc.
- **`rootDir` est le répertoire du tsconfig par défaut** plutôt que d'être inféré des chemins de fichiers — les répertoires de sources imbriqués peuvent nécessiter une configuration `rootDir` explicite
- **`noUncheckedSideEffectImports` est maintenant `true` par défaut**

## En résumé

Si vous démarrez un nouveau projet, 6.0 est un choix solide avec des valeurs par défaut modernes et sensées. Si vous êtes sur un projet existant, prévoyez du temps pour ajouter des entrées `types` explicites et vérifier votre `rootDir` avant de mettre à jour aveuglément. La 7.0 en Go approche — l'équipe veut que vous soyez sur 6.0 maintenant pour que la transition soit propre.

Installez-la : `npm install -D typescript@latest`
