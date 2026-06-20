---
title: "TypeScript 7.0 RC arrive : le compilateur Go atteint le Release Candidate, environ 10 fois plus rapide, avec une migration côte à côte"
description: "TypeScript 7.0 RC (18 juin 2026) est le release candidate du compilateur que Microsoft a porté depuis sa base de code TypeScript auto-amorcée vers Go. Il est souvent environ 10 fois plus rapide que TypeScript 6.0, fournit un paquet de compatibilité tsc6 pour fonctionner côte à côte avec 6.0, ajoute les options de parallélisme --checkers/--builders/--singleThreaded et un mode watch reconstruit sur un port Go de @parcel/watcher, et transforme toutes les dépréciations de 6.0 en erreurs fatales. La version stable est prévue dans le mois qui vient, une API programmatique stable étant repoussée à 7.1."
date: 2026-06-20
image: "/images/heroes/2026-06-20--typescript-7-0-rc-go-compiler-10x-faster.png"
author: lschvn
tags: ["typescript", "tooling"]
tldr:
  - "TypeScript 7.0 RC est sorti le 18 juin 2026 via npm install -D typescript@rc (affiche 7.0.1-rc). C'est le release candidate du port Go que Microsoft construit depuis plus d'un an, souvent environ 10 fois plus rapide que TypeScript 6.0, et qui conserve les mêmes sémantiques de vérification de types parce qu'il a été porté méthodiquement plutôt que réécrit."
  - "La migration est conçue pour ne pas être disruptive : un nouveau paquet @typescript/typescript6 fournit un binaire tsc6, les alias npm permettent à typescript-eslint de continuer à importer depuis typescript, et une API programmatique stable est explicitement repoussée à 7.1. La version stable est prévue dans le mois qui vient."
  - "7.0 adopte les valeurs par défaut de TypeScript 6.0 et transforme ses dépréciations en erreurs fatales : target es5, moduleResolution node/node10, baseUrl et module amd/umd/systemjs disparaissent, tandis que strict, module esnext et stableTypeOrdering deviennent les valeurs par défaut. Les nouvelles options --checkers, --builders et --singleThreaded contrôlent l'analyse, la vérification de types, l'émission et les builds de références de projet en parallèle."
faq:
  - question: "TypeScript 7.0 RC est-il un changement cassant pour le code existant ?"
    answer: "Pour les résultats de vérification de types, non. La base de code Go a été portée méthodiquement depuis l'implémentation de TypeScript 6.0 plutôt que réécrite, sa logique de vérification de types est donc structurellement identique et produit les mêmes résultats. Les changements cassants concernent uniquement la configuration : 7.0 adopte les nouvelles valeurs par défaut de 6.0 (strict true, module esnext, types []) et transforme les dépréciations de 6.0 en erreurs fatales (target es5, moduleResolution node/node10, baseUrl, module amd/umd/systemjs). Tout projet qui compile proprement sur 6.0 avec stableTypeOrdering activé et sans option ignoreDeprecations devrait compiler de façon identique sur 7.0."
  - question: "Comment faire tourner TypeScript 7.0 à côté de TypeScript 6.0 ?"
    answer: "Installez le RC avec npm install -D typescript@rc, ce qui vous donne le binaire tsc de 7.0. Pour les outils comme typescript-eslint qui importent TypeScript directement via une dépendance peer, utilisez les alias npm : aliassez le paquet typescript vers npm:@typescript/typescript6 pour que ces outils continuent à utiliser 6.0, et ajoutez un second alias (par exemple typescript-7) pointant vers npm:typescript@rc pour garder le tsc de 7.0 accessible via npx. @typescript/typescript6 fournit aussi un binaire tsc6 pour la ligne de commande."
  - question: "Quand TypeScript 7.0 sera-t-il stable, et quand l'API programmatique arrive-t-elle ?"
    answer: "Le plan annoncé par Microsoft est de publier TypeScript 7.0 stable dans le mois qui suit le RC. Une API programmatique stable est explicitement repoussée à TypeScript 7.1, c'est la raison d'être du dispositif côte à côte avec tsc6. Avant 7.1, les outils qui consomment l'API TypeScript programmatiquement doivent continuer à épingler 6.0."
  - question: "Que font les nouvelles options --checkers et --builders ?"
    answer: "--checkers fixe le nombre de workers de vérification de types (4 par défaut). La vérification de types a des dépendances entre fichiers, TypeScript crée donc un pool fixe de workers qui divisent les fichiers de façon identique pour des résultats déterministes ; augmenter la valeur accélère les gros builds au prix de la mémoire. --builders contrôle les builders de références de projet en parallèle, utile pour les monorepos. Les deux options sont multiplicatives (--checkers 4 --builders 4 peut lancer jusqu'à 16 checkers), et --singleThreaded plafonne tout à un seul thread pour le débogage ou une CI contrainte."
---

[TypeScript 7.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/) est sorti le 18 juin 2026, et c'est le release candidate du compilateur que Microsoft porte en Go depuis plus d'un an. Le titre, c'est la vitesse : 7.0 est souvent environ **10 fois plus rapide que TypeScript 6.0**, résultat de l'exécution native et du parallélisme en mémoire partagée plutôt que du compilateur mono-thread et auto-amorcé en JavaScript que l'écosystème utilise depuis le début. Vous pouvez l'installer dès aujourd'hui avec `npm install -D typescript@rc`, et `npx tsc --version` affiche `7.0.1-rc`.

C'est l'aboutissement de [Project Corsa](/articles/2026-03-23-typescript-7-native-preview-go-compiler), le port natif annoncé par Microsoft début 2025. [TypeScript 6.0](/articles/2026-04-17--typescript-6-0-bridge-to-go-native) avait été délibérément conçu comme une version « pont » pour préparer la transition, et [l'équipe décrivait 7.0 comme « extrêmement proche d'être terminé »](/articles/2026-04-06--typescript-6-last-release-before-go-rewrite) dès avril. Le RC est cette fin, figé en fonctionnalités.

## Porté, pas réécrit

Le détail le plus important pour quiconque prépare une montée de version est que 7.0 est un port méthodique, pas une réécriture à partir de zéro. Microsoft a déplacé la base de code TypeScript existante vers Go fichier par fichier, et la logique de vérification de types est structurellement identique à 6.0. Le compilateur a été évalué face à la suite de tests constituée sur une décennie et tourne déjà dans plusieurs bases de code de plusieurs millions de lignes, en interne comme hors de Microsoft, avec des équipes chez Bloomberg, Canva, Figma, Google, Linear, Notion, Slack, Vercel et VoidZero parmi les adopteurs précoces qui rapportent des réductions majeures des temps de build.

En pratique : tout code qui compile proprement sur 6.0, avec `stableTypeOrdering` activé et sans option `ignoreDeprecations`, devrait compiler de façon identique sur 7.0. Les sémantiques n'ont pas bougé.

## Une migration pensée pour le côte à côte

Parce que la base de code Go n'expose pas encore d'API programmatique stable (elle est explicitement repoussée à TypeScript 7.1, dans plusieurs mois), Microsoft a rendu 7.0 exécutable à côté de 6.0 sans conflit de type « quel `tsc` est lequel ? ». Il a publié `@typescript/typescript6`, un paquet de compatibilité qui réexporte l'API de 6.0 et fournit un binaire `tsc6`.

Pour les outils comme typescript-eslint qui importent depuis `typescript` via une dépendance peer, le chemin recommandé passe par les alias npm. Épinglez `typescript` sur l'alias 6.0 pour que ces outils continuent à fonctionner, et ajoutez un second alias pour 7.0 :

```json
{
  "devDependencies": {
    "typescript": "npm:@typescript/typescript6@^6.0.0",
    "typescript-7": "npm:typescript@rc"
  }
}
```

Désormais `npx tsc` lance 7.0 tandis que typescript-eslint continue de consommer 6.0 sous le nom `typescript`. Les nightlies sont toujours publiées sous `@typescript/native-preview` (binaire `tsgo`) ; une fois 7.0 passé sur le tag `latest`, toutes les versions convergent vers le paquet `typescript`.

## Un parallélisme que l'on peut régler

Le gain de vitesse vient de la parallélisation de l'analyse, de la vérification de types et de l'émission, et 7.0 expose les réglages. `--checkers` fixe le nombre de workers de vérification de types, à 4 par défaut. La vérification de types a des dépendances entre fichiers : plutôt que de disperser les fichiers sur des workers totalement indépendants, 7.0 crée un pool fixe qui divise toujours les mêmes fichiers d'entrée de façon identique, ce qui garde les résultats déterministes au prix d'un peu de travail dupliqué. Monter la valeur accélère les gros builds sur des machines multicœurs mais consomme plus de mémoire ; la baisser aide les runners de CI contraints.

`--builders` contrôle les builders de références de projet en parallèle, ce qui compte surtout pour les monorepos. Les deux options sont multiplicatives : `--checkers 4 --builders 4` peut lancer jusqu'à 16 checkers, ce que Microsoft juge potentiellement excessif. `--singleThreaded` plafonne tout le compilateur à un seul thread pour le débogage ou la comparaison avec 6.0.

Le mode `--watch` a lui aussi été reconstruit. Microsoft a porté le file-watcher du bundler Parcel (`@parcel/watcher`) du C++ vers Go, avec des cales assembleur minimales, pour éviter d'introduire une dépendance à une chaîne d'outils C++. Le résultat est ce que l'équipe décrit comme des améliorations significatives de ressources en mode watch sur toutes les plateformes, avec des remerciements à Devon Govett pour le file-watcher Parcel d'origine.

## Les valeurs par défaut de 6.0 deviennent le socle, et ses dépréciations deviennent des erreurs fatales

7.0 adopte les nouvelles valeurs par défaut de 6.0 et cesse de tolérer ce que 6.0 a déprécié. Les valeurs par défaut qui changent : `strict` vaut `true`, `module` vaut `esnext` par défaut, `target` vaut la version stable actuelle d'ECMAScript avant `esnext`, `noUncheckedSideEffectImports` vaut `true`, `libReplacement` vaut `false`, et `stableTypeOrdering` vaut `true` sans pouvoir être désactivé.

Les deux options que Microsoft signale comme « les plus surprenantes » sont `rootDir` et `types`. `rootDir` vaut désormais `./` par défaut, donc les projets dont le `tsconfig.json` se trouve hors de `src` doivent le définir explicitement pour préserver la structure des répertoires. `types` vaut désormais `[]` par défaut, donc les déclarations globales issues des paquets `@types` doivent être listées explicitement (l'ancien comportement se restaure avec `"types": ["*"]`).

Les options dépréciées qui deviennent des erreurs fatales comprennent `target: es5`, `downlevelIteration`, `moduleResolution: node`/`node10` (utilisez `nodenext` ou `bundler`), `module: amd`/`umd`/`systemjs`/`none`, `baseUrl`, `moduleResolution: classic`, et la mise à `false` de `esModuleInterop` ou `allowSyntheticDefaultImports`. Le mot-clé `asserts` sur les imports doit devenir `with`, et `/// <reference no-default-lib />` n'est plus respecté sous `skipDefaultLibCheck`. La liste complète figure dans le [CHANGES.md](https://github.com/microsoft/typescript-go/blob/main/CHANGES.md) du dépôt `microsoft/typescript-go`.

## Deux vrais changements au niveau des types

Deux changements affectent le comportement au niveau des types plutôt que la configuration. L'inférence des types littéraux de gabarit préserve désormais les points de code Unicode : `HeadTail<"😀abc">` produit `["😀", "abc"]` au lieu de couper l'emoji en deux moitiés de substituts UTF-16. Cela aligne l'inférence avec les sémantiques de `for...of` et de la décomposition, mais casse les utilitaires de chaîne au niveau des types qui modélisaient intentionnellement les unités de code UTF-16, comme certains assistants `Length`.

La prise en charge de JavaScript (JSDoc) a aussi été retravaillée pour la cohérence avec l'analyse des fichiers `.ts`. `@enum`, un type `?` isolé, `@class` comme marqueur de constructeur, le `!` postfixé, et la syntaxe de fonction façon Closure comme `function(string): void` ne sont plus traités de façon spéciale. Les valeurs utilisées là où des types sont attendus requièrent désormais `typeof`.

## L'expérience éditeur

Le service de langage est bâti sur le Language Server Protocol et utilise plusieurs threads, l'éditeur gagne donc le même parallélisme que la ligne de commande. L'extension VS Code [TypeScript Native Preview](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview) est le moyen le plus simple d'essayer, et Microsoft a complété les fonctionnalités manquantes depuis la bêta : auto-imports, coloration sémantique, inlay hints, code lenses, go-to-source-definition, édition liée du JSX, et tri et suppression des imports inutilisés. Les données internes de l'équipe avancent plus de 20 fois moins de commandes du serveur de langage en échec par rapport à 6.0.

## Que faire maintenant, et quoi surveiller

Le chemin de montée de version pour la plupart des équipes : passez d'abord à 6.0 si ce n'est pas fait, nettoyez ses dépréciations, puis `npm install -D typescript@rc` et lancez-le en CI. Épinglez `--checkers` si vous voulez des résultats identiques d'une machine à l'autre. Microsoft prévoit la version stable de 7.0 dans le mois qui vient, 7.1 apportant l'API programmatique stable qui permettra aux outils de quitter 6.0 pour de bon. Remontez les régressions sur le [suivi d'issues microsoft/typescript-go](https://github.com/microsoft/typescript-go/issues), car la fenêtre du RC est le moment où ce retour compte le plus.
