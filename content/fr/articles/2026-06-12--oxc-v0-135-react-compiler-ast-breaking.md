---
title: "Oxc v0.135 : le port Rust du React Compiler et un break AST #[non_exhaustive]"
description: "Oxc 0.135 intègre le port Rust du React Compiler, marque les nœuds AST comme #[non_exhaustive] (breaking change pour les crates Rust en aval), ajoute deux nouvelles méthodes AstBuilder, et apporte de nombreuses corrections de stricte parser et d'espaces en codegen."
date: 2026-06-12
image: "/images/heroes/2026-06-12--oxc-v0-135-react-compiler-ast-breaking.png"
author: lschvn
tags: ["tooling", "performance", "typescript"]
tldr:
  - "Oxc 0.135 intègre le React Compiler de Meta comme outil Rust dans le monorepo oxc (PR #22942), donnant aux bundlers et toolchains en aval une implémentation Rust de première classe."
  - "La release marque les nœuds AST d'Oxc comme #[non_exhaustive], un breaking change qui impose un patch release pour chaque crate Rust qui pattern-matche l'AST."
  - "Oxlint v1.69 livre des schémas pour 30+ règles ESLint, ajoute des règles Vue (next-tick-style, require-direct-export, no-reserved-props, require-prop-types), et oxfmt 0.54 complète la release."
faq:
  - question: "Qu'est-ce qui casse dans Oxc 0.135 ?"
    answer: "Deux breaking changes. D'abord, chaque nœud AST d'Oxc est désormais marqué #[non_exhaustive] (PR #23046), donc les crates Rust en aval qui pattern-matchent de façon exhaustive sur les variantes AST auront besoin d'un patch release et d'un bras `_ =>` explicite. Ensuite, deux nouvelles méthodes AstBuilder ont été ajoutées (template_element_escape_raw et template_element_escape_raw_with_lone_surrogates, PR #23047) ; les utilisateurs d'AstBuilder existants ne cassent pas, mais tout builder custom devra tenir compte des nouvelles signatures."
  - question: "Qu'est-ce que le port Rust du React Compiler, et pourquoi c'est important ?"
    answer: "Le React Compiler de Meta mémoïse automatiquement les composants et hooks React. Jusqu'ici, l'implémentation était en TypeScript dans le repo React. Le port Rust est une réécriture from scratch qui vit dans le monorepo oxc depuis la 0.135, et les outils en aval (Vinext, Rolldown, futurs bundlers) peuvent l'appeler sans dépendre de Node ou d'un runtime JS."
  - question: "Quels outils en aval sont affectés par la 0.135 ?"
    answer: "Toute crate Rust qui pattern-matche sur l'AST Oxc : Rolldown (utilisé par Vite/Vinext), oxc-traverse, oxc-transform, et tout transformateur custom construit sur oxc_parser. Les bundlers JS/TS livrés en binaires standalone (Rolldown CLI, Vite, Vinext) récupèreront le nouvel AST via leur cycle de mise à jour normal ; leurs utilisateurs n'ont rien à faire."
  - question: "Quel est l'impact pratique pour un projet TypeScript ?"
    answer: "Si vous consommez Oxc uniquement via Vite, Rolldown ou oxlint, vous récupérez les nouvelles règles, les corrections d'espaces en codegen pour un output minifié plus compact, et (à terme) un React Compiler plus rapide dans votre bundler. Le breaking change est invisible pour les utilisateurs JS/TS ; il atterrit sur les mainteneurs Rust en aval."
---

[Oxc 0.135.0](https://github.com/oxc-project/oxc/releases/tag/crates_v0.135.0) et [oxlint 1.69.0](https://github.com/oxc-project/oxc/releases/tag/apps_v1.69.0) sont sortis le 8 juin 2026. Le gros titre est l'arrivée du port Rust du React Compiler dans le monorepo oxc. Le sous-titre est un break AST que chaque crate Rust en aval doit gérer.

## React Compiler, en Rust

Le changement le plus important de la 0.135 est la [PR #22942, « react_compiler: Integrate the Rust port of the React Compiler »](https://github.com/oxc-project/oxc/pull/22942). Meta travaillait à une réécriture from scratch en Rust du React Compiler, et la 0.135 est la version qui la livre comme crate de première classe dans le workspace oxc. Le compilateur analyse les composants et hooks React, puis émet un output mémoïsé qui saute les re-renders quand les props et le state sont référentiellement stables.

Pour les toolchains Rust JS/JSX/TS, c'est la pièce manquante. L'implémentation précédente vivait en TypeScript dans le repo React, ce qui forçait tout outil Rust voulant la sortie du React Compiler à déléguer à Node ou à embarquer un runtime JS. Avec le port Rust dans oxc, Rolldown, Vinext, et les futurs bundlers peuvent intégrer le compilateur directement, ce qui est la trajectoire que la stack VoidZero construit depuis [le lancement de l'alpha de Vite+](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source).

Pour les développeurs applicatifs, le changement visible est incrémental : un output minifié plus compact et des builds plus rapides à mesure que les bundlers en aval adoptent la nouvelle crate. Le mouvement architectural est ce qui compte pour l'écosystème.

## Le breaking change `#[non_exhaustive]`

La 0.135 marque aussi chaque nœud AST d'Oxc comme `#[non_exhaustive]` (PR #23046). C'est un vrai breaking change pour les downstreams Rust qui pattern-matchent de façon exhaustive sur les variantes AST : Rolldown, oxc-traverse, oxc-transform, et tout transformateur custom construit sur `oxc_parser` auront besoin d'un patch release avec un bras wildcard explicite ou une branche `_ =>`.

En pratique, le patch est mécanique. Le changement est la première fois qu'Oxc touche la surface publique de l'AST depuis que le projet traite l'AST comme un contrat stable, et il signale un durcissement plus large. Si vous maintenez une crate Rust qui dépend d'oxc, attendez-vous à une petite PR à landed bientôt.

Une deuxième addition, plus petite : deux nouvelles méthodes `AstBuilder`, `template_element_escape_raw` et `template_element_escape_raw_with_lone_surrogates` (PR #23047), pour les chemins de codegen qui doivent gérer les surrogates non appariés dans les template literals. Les utilisateurs d'AstBuilder existants ne cassent pas, mais les builders custom devraient intégrer les nouvelles méthodes.

## Parser, codegen, et oxlint

Le parser 0.135 gagne plusieurs contrôles de stricte qui passaient auparavant. Les noms de type-declaration réservés sont désormais signalés, ainsi que les alias d'import-type vers des références non-externes, les champs de classe abstraits privés, et les clauses `default` dupliquées dans les `switch`. Côté codegen, s'ajoute une longue liste de corrections d'espaces pour l'output minifié : espacement plus serré sur les conditional-type et constructor-type, suppression d'espaces redondants après `else` et `export default`, et espacement correct autour des opérateurs postfix `++` et `--`.

Oxlint 1.69 livre des schémas pour [30+ règles ESLint](https://github.com/oxc-project/oxc/releases/tag/apps_v1.69.0), dont `jest/vitest/max-expects`, `jest/vitest/expect-expect`, `jest/vitest/consistent-test-it`, `import-max-dependencies`, `prefer-default-export`, `sort-vars`, `radix`, `prefer-const`, `no-warning-comments`, `no-unused-vars`, `no-shadow`, `no-restricted-exports`, `no-param-reassign`, `no-magic-numbers`, `no-inner-declarations`, `no-constant-condition`, `no-empty-function`, `id-match`, `capitalized-comments`, `id-length`, `complexity`, et `class-methods-use-this`. L'analyseur Vue embarque `next-tick-style`, `require-direct-export`, `no-reserved-props`, et `require-prop-types`. oxfmt 0.54 complète la release avec des corrections côté formatter, non breaking.

La release est le suivi naturel de [la 0.134 couverte ici](/articles/2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules), et suit la cadence accélérée du projet : une 0.126 en [avril a ajouté les magic comments Turbopack et un break d'allocator](/articles/2026-04-18--oxc-v0-126-turbopack-magic-comments-allocator-breaking), une 0.134 en juin a ajouté les règles Vue et TypeScript, et la 0.135 livre le port Rust du React Compiler. Rolldown, qui utilise Oxc, a activé [lazyBarrel par défaut en 1.1.0](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig) ; c'est dans la prochaine mineure de Rolldown qu'on attend la surface de l'intégration React Compiler en production.
