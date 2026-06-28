---
title: "Prettier 3.9 refond cinq parseurs : micromark pour Markdown, yaml v2, GraphQL.js v17, un parseur Flow en Rust et Angular"
description: "Prettier 3.9.0, publié le 27 juin 2026 (prettier/prettier, billet de Fisker Cheung), est une release centrée sur les parseurs qui fait passer Markdown de remark-parse v8 à micromark v4 (meilleure conformité CommonMark et GFM et une série de bugs de parsing de longue date corrigés), YAML à yaml v2, GraphQL à GraphQL.js v17 (arguments de fragment et directives sur les définitions de directive), Flow au nouveau parseur oxidized basé sur Rust de l'équipe Flow (environ 37 % plus rapide sur les fixtures Flow valides de Prettier et 43 % plus rapide sur flow_parser.js en benchmarks parser-only locaux) et Angular. Le formateur JavaScript et TypeScript est aussi retravaillé, en particulier en mode --no-semi où les commentaires autour de break et continue sont maintenant stables entre plusieurs passages (un fix d'idempotence), plus la suppression des parenthèses redondantes dans les return, l'alignement des interpolations de template embarquées et l'inlining des expressions de négation logique. La release retire la syntaxe legacy import ... assert {} (Babel 8 a supprimé le plugin de parseur ; migrez vers with), corrige une option --cache-strategy content silencieusement cassée et empêche les fichiers EditorConfig au-dessus des worktrees Git de s'infiltrer. L'équipe rappelle d'épingler la version exacte dans package.json car les changements de formatage vont produire des diffs."
date: 2026-06-28
image: "/images/heroes/2026-06-28--prettier-3-9-micromark-yaml-graphql-rust-flow-parser.png"
author: lschvn
tags: ["tooling", "javascript", "ecosystem"]
tldr:
  - "Prettier 3.9.0 ([billet de blog](https://prettier.io/blog/2026/06/27/3.9.0), publié le 27 juin 2026 par Fisker Cheung) est une release de mise à niveau des parseurs. Markdown passe de l'obsolète remark-parse v8 à [micromark v4](https://github.com/micromark/micromark) pour une bien meilleure conformité CommonMark et GFM et un lot de bugs de parsing de longue date corrigés ; YAML passe à yaml v2 ; GraphQL passe à GraphQL.js v17, ajoutant les arguments de fragment et les directives sur les définitions de directive ; le parseur Angular est mis à jour ; et Flow passe au nouveau parseur (oxidized) basé sur Rust de l'équipe Flow."
  - "Le passage du parseur Flow est le point fort en performance. Dans les benchmarks parser-only locaux de Prettier, le nouveau parseur Rust a formaté les fixtures Flow valides de Prettier en une médiane de 266,4 ms contre 422,6 ms pour l'ancien parseur, et a parsé flow_parser.js en 1298,0 ms contre 2269,6 ms. Soit environ 37 % et 43 % plus rapide respectivement, ce qui poursuit la tendance des frontends natifs en Rust que Prettier avait amorcée avec ses [plugins OXC et Hermes](/articles/2026-06-23--oxlint-v1-71-oxfmt-v0-56)."
  - "Deux choses vont toucher votre codebase. D'abord, le formateur JavaScript et TypeScript a changé (notamment en mode `--no-semi`, où les commentaires autour de `break` et `continue` sont maintenant idempotents entre les passages), donc un reformatage va produire un diff. Ensuite, la syntaxe legacy `import ... assert { type: \"json\" }` est retirée parce que Babel 8 a supprimé le plugin de parseur ; migrez vers `import ... with { type: \"json\" }`. La release rappelle d'épingler la version exacte (`\"prettier\": \"3.9.0\"`, pas `^3.9.0`) dans package.json."
faq:
  - question: "Quoi de neuf dans Prettier 3.9 ?"
    answer: "Prettier 3.9.0, publié le 27 juin 2026, est une release de mise à niveau des parseurs. Elle met à niveau le parseur Markdown de remark-parse v8 vers micromark v4 (meilleure conformité CommonMark et GFM), le parseur YAML vers yaml v2, le parseur GraphQL vers GraphQL.js v17 (arguments de fragment et directives sur les définitions de directive), le parseur Angular et le parseur Flow vers le nouveau parseur oxidized basé sur Rust de l'équipe Flow. Elle retravaille aussi le formateur JavaScript et TypeScript (surtout en mode --no-semi) et retire la syntaxe legacy import ... assert {}."
  - question: "Pourquoi Prettier utilise-t-il maintenant un parseur Flow en Rust ?"
    answer: "Prettier 3.9 adopte le parseur Flow oxidized (basé sur Rust) publié par l'équipe Flow. Dans les benchmarks parser-only locaux de Prettier, le nouveau parseur a formaté les fixtures Flow valides de Prettier en une médiane de 266,4 ms contre 422,6 ms pour l'ancien, et a parsé flow_parser.js en 1298,0 ms contre 2269,6 ms, soit environ 37 % et 43 % plus rapide. C'est la même direction de frontends natifs en Rust que Prettier a explorée via ses plugins OXC et Hermes, appliquée ici au code typé avec Flow."
  - question: "Prettier 3.9 change-t-il mon formatage en sortie ?"
    answer: "Oui, attendez-vous à un diff. Le formateur JavaScript et TypeScript a changé de plusieurs façons : les commentaires autour de break et continue en mode --no-semi sont maintenant stables entre plusieurs passages (un fix d'idempotence), les parenthèses redondantes dans les return sont supprimées, les interpolations de template embarquées sont alignées et les sauts de ligne évités, les expressions de négation logique sont inlinées dans les conditions if/while, et les doubles espaces de fin dans le JSDoc sont préservés. Les sorties Markdown, YAML et GraphQL peuvent aussi bouger parce que leurs parseurs ont changé. L'équipe recommande d'épingler la version exacte (\"prettier\": \"3.9.0\") pour garder le formatage stable entre les installs."
  - question: "Le retrait des import assertions est-il un breaking change ?"
    answer: "Oui pour le code qui utilise encore l'ancien mot-clé assert. La syntaxe legacy `import foo from \"./foo.json\" assert { type: \"json\" }` est retirée parce que Babel 8 a supprimé le plugin de parseur dont Prettier dépendait. Prettier ne peut plus analyser ni formater cette syntaxe de façon fiable. La correction consiste à migrer vers le standard actuel : `import foo from \"./foo.json\" with { type: \"json\" }`."
  - question: "Dois-je épingler la version exacte de Prettier ?"
    answer: "Oui, et les notes de version de 3.9 répètent le conseil habituel. Utilisez `\"prettier\": \"3.9.0\"` dans package.json plutôt que `^3.9.0`. Comme Prettier est un formateur, tout changement de sa sortie devient un diff de code, et un range en caret peut tirer un nouveau minor ou patch qui reformate tout votre projet sur une install fraîche. L'épinglage garde le formatage déterministe. Si vous utilisez @prettier/plugin-oxc ou @prettier/plugin-hermes, mettez-les à niveau en même temps que Prettier pour que les nouvelles règles de formatage s'appliquent."
  - question: "Qu'en est-il du MDX après la mise à niveau du parseur Markdown ?"
    answer: "Le parseur Markdown central est mis à niveau vers micromark v4, mais la migration du parseur MDX n'est pas encore terminée. Les notes de version demandent explicitement de l'aide aux contributeurs familiers avec l'écosystème unified, micromark ou MDX pour terminer la migration. Si vous formatez du MDX, testez votre sortie sur 3.9 et remontez les soucis ; le travail restant sur MDX est toujours ouvert."
---

[Prettier 3.9.0](https://prettier.io/blog/2026/06/27/3.9.0), publié le 27 juin 2026 dans un billet de 37 minutes de Fisker Cheung, est inhabituel pour une release Prettier : le point fort n'est pas une nouvelle option de config ou un CLI plus rapide, ce sont cinq mises à niveau de parseurs qui atterrissent d'un coup. Markdown, YAML, GraphQL, Flow et Angular passent tous à des parseurs upstream plus récents, et le formateur JavaScript et TypeScript reçoit un retravail qui se manifestera par un diff dans la plupart des repos. Si vous traitez la sortie de Prettier comme stable, 3.9 est une release à déployer délibérément et en épinglant la version exacte.

## Cinq parseurs, une release

Le changement Markdown est celui que la plupart des utilisateurs vont sentir. Le parseur Markdown de Prettier passe de l'obsolète `remark-parse` v8 à [micromark v4](https://github.com/micromark/micromark), le parseur CommonMark moderne. Les notes de version présentent cela comme une « conformité CommonMark et GFM significativement améliorée » plus de « nombreux bugs de parsing de longue date » résolus, et ça pose des fondations plus propres pour le travail futur. Une réserve : la migration du parseur MDX n'est pas encore terminée, et l'équipe demande aux contributeurs familiers de l'écosystème unified et de micromark de l'achever.

YAML passe à `yaml` v2, qui corrige de nombreux problèmes de parsing de longue date, avec mention du travail de ota-meshi sur `yaml-unist-parser`. GraphQL passe à [GraphQL.js](https://github.com/graphql/graphql-js) v17, qui ajoute le support de syntaxes plus récentes : les arguments de fragment (`...dynamicProfilePic(size: $size)`) et les directives sur les définitions de directive et `extend directive`, qui produisaient tous deux une erreur ou un mauvais parsing sur 3.8.

La mise à niveau de Flow est le point fort en performance. Prettier utilise maintenant le nouveau parseur Flow (oxidized) basé sur Rust publié par l'équipe Flow. Dans les benchmarks parser-only locaux de Prettier, le nouveau parseur a formaté les fixtures Flow valides de Prettier en une **médiane de 266,4 ms contre 422,6 ms** pour l'ancien parseur, et a parsé `flow_parser.js` en **1298,0 ms contre 2269,6 ms**. Soit environ 37 % et 43 % plus rapide, et c'est la même direction de frontends natifs en Rust que le projet a explorée via ses [plugins OXC et Hermes](/articles/2026-06-23--oxlint-v1-71-oxfmt-v0-56) et que l'écosystème au sens large prend avec [Oxc](/articles/2026-06-22--oxc-v0-137-react-compiler-treeshake-perf) et [SWC](/articles/2026-06-23--swc-v1-15-43-react-compiler-template-literal-bug).

## Le formateur JavaScript et TypeScript a changé

Les mises à niveau de parseurs font la moitié de la release ; l'autre moitié est un lot de changements du formateur qui vont produire un diff. Le plus notable est un vieux bug d'idempotence en `--no-semi`. Sur 3.8, un `break` ou `continue` suivi d'un commentaire de ligne produisait une sortie différente au premier et au deuxième passage, donc lancer Prettier deux fois pouvait continuer à modifier le fichier. Sur 3.9, la gestion des commentaires autour de `break` et `continue` est stable entre les passages.

Une courte liste des autres changements du formateur :

- **Parenthèses redondantes supprimées** dans les `return`, donc `return (a, b)` n'est plus réécrit en `return ((a, b))`.
- **Interpolations de template réalignées** dans les tagged templates, en évitant les sauts de ligne inattendus et en corrigeant l'alignement dans les blocs CSS-in-template-literal.
- **Inlining des négations logiques** : `!(...)` dans les conditions `if`/`while`/`do..while` est inliné pour réduire le diff quand une condition bascule vers sa valeur niée, corrigeant un cas réel de double parenthèse dans le codebase de Prettier lui-même.
- **Doubles espaces de fin préservés dans le JSDoc**, parce que certains outils les traitent comme significatifs.
- **Placement des commentaires** autour des listes d'arguments d'appel vides et des callees entre parenthèses corrigé.

Rien de tout ça n'est un changement de config, mais ensemble ils signifient qu'un `prettier --write .` après l'upgrade va reformater des fichiers.

## Le vrai breaking change : les import assertions

La release retire le support de la syntaxe legacy `import ... assert {}` :

```diff
- import foo from "./foo.json" assert { type: "json" };
+ import foo from "./foo.json" with { type: "json" };
```

La raison est en amont : Babel 8 a complètement supprimé le support du mot-clé legacy `assert` (le vieux plugin de parseur a disparu), et sans le support du parseur Babel, Prettier ne peut plus analyser ni formater cette syntaxe de façon fiable. Le standard actuel est le mot-clé `with` de la proposition import attributes. Si votre codebase utilise encore `assert`, migrez avant l'upgrade ; Prettier renvoie à sa clause de non-responsabilité sur la syntaxe non standard pour le contexte.

## Des correctifs CLI à connaître

Quelques correctifs CLI complètent la release. `--cache-strategy content` était silencieusement cassé : `file-entry-cache` v11 a renommé l'option `useChecksum` en `useCheckSum` (S majuscule), et Prettier passait encore l'ancienne casse, donc la comparaison de cache basée sur le contenu était désactivée et seule la taille du fichier était comparée. C'est maintenant corrigé, donc le cache basé sur le contenu fonctionne à nouveau.

Prettier arrête aussi de chercher les fichiers EditorConfig au-dessus des worktrees Git : un fichier `.git` (utilisé dans les worktrees et les submodules) est maintenant traité comme un marqueur de racine de projet au même titre qu'un répertoire `.git`, donc un EditorConfig d'un répertoire parent n'influence plus le formatage d'un worktree. Deux corrections de crash gèrent les noms de répertoires et de fichiers avec des caractères spéciaux (noms entre crochets comme `username[repo-name]`, et guillemets en tête), et le CLI expérimental reçoit des mises à jour.

## Ce qu'il faut surveiller

Le conseil pratique est simple : épinglez la version exacte. Les notes de version répètent la recommandation habituelle d'utiliser `"prettier": "3.9.0"` plutôt que `^3.9.0`, parce que les changements Markdown, YAML, GraphQL et JS/TS produisent tous des diffs de sortie, et qu'un range en caret peut tirer un nouveau minor qui reformate tout un projet sur une install fraîche. Si vous utilisez `@prettier/plugin-oxc` ou `@prettier/plugin-hermes`, mettez-les à niveau en même temps pour que les nouvelles règles de formatage s'appliquent.

Deux choses à tester avant de valider l'upgrade : toute documentation Markdown ou MDX (le passage à micromark est le changement le plus large), et tout code lourd en Flow ou en GraphQL. La migration MDX est toujours ouverte, donc la sortie MDX en particulier mérite un diff attentif. Le changelog complet est sur la [vue compare](https://github.com/prettier/prettier/compare/3.8.5...3.9.0), et 3.9.1 a suivi le même jour avec des correctifs de suivi.
