---
title: "Bun intègre le React Compiler directement dans son bundler, environ 20x plus rapide que le plugin Babel"
description: "La PR #32504, fusionnée dans oven-sh/bun le 20 juin 2026, transforme le portage Rust amont du React Compiler en transformation intégrée à `bun build`, derrière `--react-compiler` et `Bun.build({ reactCompiler: true })`. Bun porte directement l'espace de travail `compiler/crates/` de `facebook/react` dans une unique crate `src/react_compiler/` (~62 k LOC) plutôt que de passer par Babel, SWC ou Oxc, et sur une grosse base de code React (environ 860 composants, 1400 slots de mémo) la passe du compilateur s'exécute en 465 ms contre 9,15 s pour le plugin Babel. La fonctionnalité est expérimentale, désactivée par défaut, et livrée avec `reactCompilerOutputMode` (client ou ssr) et un script `scripts/sync-react-compiler.sh` pour resynchroniser le portage."
date: 2026-06-21
image: "/images/heroes/2026-06-21--bun-react-compiler-bundler-integration-20x.png"
author: lschvn
tags: ["tooling", "performance", "runtimes"]
tldr:
  - "La PR #32504 de Bun, fusionnée le 20 juin 2026, intègre le portage Rust amont du React Compiler comme transformation intégrée à `bun build`, exposée via l'option CLI `--react-compiler` et l'option `reactCompiler: true` de `Bun.build`. Le mode de sortie est dérivé de `--target` (`browser` -> `client`, `bun` ou `node` -> `ssr`) et peut être surchargé avec `reactCompilerOutputMode`. La fonctionnalité est désactivée par défaut et marquée expérimentale."
  - "Bun porte directement l'espace de travail Rust `compiler/crates/` de `facebook/react` dans une unique crate `src/react_compiler/` (~62 k LOC), au lieu de passer par Babel, SWC ou Oxc comme adaptateur AST séparé. Sur une grosse base de code React (environ 860 composants, 1400 slots de mémo) la passe du compilateur s'exécute en 465 ms contre 9,15 s pour `babel-plugin-react-compiler`, soit environ 20x plus vite ; la build complète d'un exécutable autonome via `--compile` s'exécute en 3,62 s contre 13,04 s avec le plugin Babel (3,6x)."
  - "C'est le premier bundler à livrer le React Compiler comme transformation native. Vite, webpack, Next.js avec Turbopack et Rsbuild exécutent tous le compilateur via un plugin Babel/SWC/Oxc aujourd'hui ; le chemin de Bun va directement de l'AST produit par son propre parser vers la HIR du compilateur, puis revient dans l'AST de Bun pour le codegen, sans couche AST intermédiaire. La livraison ajoute aussi `scripts/sync-react-compiler.sh` pour resynchroniser le portage sur la pointe de `facebook/react`."
faq:
  - question: "Que fait la nouvelle option `--react-compiler` ?"
    answer: "Elle exécute le React Compiler sur les fichiers `.jsx` et `.tsx` pendant `bun build`, en mémoïsant automatiquement les composants et les hooks. La sortie a la même forme que celle produite par `babel-plugin-react-compiler`, y compris l'import `react/compiler-runtime` qui est livré avec React 19 ou ultérieur. L'option est désactivée par défaut et marquée expérimentale dans les définitions de types et dans la documentation sur bun.com/docs/bundler."
  - question: "Combien de fois l'intégration React Compiler de Bun est-elle plus rapide que le plugin Babel ?"
    answer: "Sur une grosse base de code React (environ 860 composants compilés, 1400 slots de mémo), le plugin Babel amont prenait environ 9,15 s de bout en bout, Bun avec React Compiler désactivé prenait 394 ms (base de référence), et Bun avec React Compiler activé prenait 465 ms (1,18x la base de référence, soit environ 20x plus rapide que le plugin Babel). La build complète de l'exécutable autonome via `--compile`, qui bundle tout plus la passe React Compiler, s'exécute en 3,62 s avec le portage Rust contre 13,04 s avec le plugin Babel, soit 3,6x plus rapide. Ces chiffres proviennent du benchmark interne de Bun dans la PR #32504, sur une seule machine de développement, donc les résultats individuels varieront."
  - question: "Pourquoi Bun n'a-t-il pas simplement utilisé la crate React Compiler d'Oxc ?"
    answer: "La description de la PR explique l'arbitrage directement. Le parser de Bun produit déjà un AST complètement résolu, donc passer par un adaptateur Oxc impliquerait de convertir l'AST de Bun en AST Oxc, de le passer au compilateur, puis de reconvertir en retour. Bun porte plutôt les crates `hir/`, `ssa/`, `inference/`, `typeinference/`, `optimization/`, `validation/`, `reactive_scopes/`, `diagnostics/` et `utils/` du compilateur dans `src/react_compiler/` à l'octet près depuis l'amont, en ne réécrivant que les chemins d'import et en retirant les derives `serde`/`serde_json` dont Bun n'a pas besoin. Les couches de lowering et de codegen sont réimplémentées contre `bun_ast`, avec une table de correspondance de types documentée dans `src/react_compiler/DESIGN.md`. Le résultat : aucune allocation d'AST intermédiaire et aucune surface de dépendance supplémentaire."
  - question: "Est-ce que cela remplace le plugin React Compiler de Babel dans Vite ou Next.js ?"
    answer: "Non, cela ne concerne que `bun build` et `Bun.build`. Si vous utilisez Vite, Next.js avec Turbopack, webpack ou Rsbuild, vous passez toujours par le plugin Babel ou SWC. Le chemin que le portage Rust permet à ces bundlers est la crate d'adaptation `react_compiler_oxc` que Meta a publiée en parallèle du portage ; Bun a choisi le portage direct parce que son propre AST est déjà en place. Au fur et à mesure qu'Oxc livre l'adaptateur et que les bundlers l'adoptent, il faut s'attendre à voir les mêmes chiffres de performance ailleurs au second semestre 2026."
  - question: "Quelle est la différence entre `reactCompiler` et `reactCompilerOutputMode` ?"
    answer: "`reactCompiler` est l'interrupteur marche/arrêt ; passez-le à `true` pour exécuter la passe du compilateur. `reactCompilerOutputMode` choisit entre `\"client\"` (par défaut pour `--target browser`, mémoïsation complète) et `\"ssr\"` (par défaut pour `--target bun` ou `--target node`, ignore le runtime `useMemoCache` pour que la sortie rendue côté serveur reste compatible avec un cache). Le mode de sortie ne s'applique que lorsque le compilateur est activé, et Bun dérive la valeur par défaut de `--target` si vous ne le précisez pas explicitement."
  - question: "Est-ce que cela va ralentir mon `bun build` ?"
    answer: "Seulement si vous l'activez. Avec `reactCompiler: false` la build exécute la pipeline de transformation existante et il n'y a pas de surcoût mesurable lié à cette PR. Avec `reactCompiler: true`, Bun rapporte un surcoût de 1,18x en temps mural sur le benchmark grosse base de code (394 ms en base, 465 ms avec le compilateur), ce qui reste largement en-dessous du chemin via plugin Babel. Pour les petits projets, le surcoût absolu se compte en millisecondes."
---

La [PR #32504 de Bun](https://github.com/oven-sh/bun/pull/32504), fusionnée le 20 juin 2026, transforme le portage Rust amont du React Compiler en transformation intégrée à `bun build`. Activez-la avec `--react-compiler` côté CLI ou `reactCompiler: true` sur `Bun.build`, et Bun mémoïsera vos composants et hooks `.jsx` et `.tsx` pendant la build, sans plugin Babel, sans fichier de configuration, sans rien à installer. La fonctionnalité est désactivée par défaut et marquée expérimentale à la fois dans les [définitions de types](https://github.com/oven-sh/bun/blob/main/packages/bun-types/bun.d.ts) et dans la [documentation du bundler](https://bun.com/docs/bundler).

C'est le premier bundler à livrer le React Compiler comme transformation native. Vite, Next.js avec Turbopack, webpack et Rsbuild passent tous par un plugin Babel ou SWC aujourd'hui. Le chemin de Bun saute complètement cette étape intermédiaire.

## Ce qui a été livré

L'intégration ferme l'[issue #24356](https://github.com/oven-sh/bun/issues/24356), la demande de fonctionnalité de longue date pour un support de première classe du React Compiler dans le bundler, et remplace une [PR #31785](https://github.com/oven-sh/bun/pull/31785) antérieure qui dépendait d'une crate `oxc_react_compiler` qui n'existait pas à l'époque. La nouvelle PR porte l'espace de travail Rust du compilateur directement depuis `facebook/react` plutôt que de passer par Oxc, ce qui explique pourquoi la description de la PR amont [facebook/react#36173](https://github.com/facebook/react/pull/36173) invitait explicitement les intégrations de bundlers via l'adaptateur `react_compiler_oxc` et que Bun a pris un chemin différent.

Une [PR de suivi #32545](https://github.com/oven-sh/bun/pull/32545) livrée le même jour corrige trois commentaires de revue issus de la PR fusionnée, dont un bug subtil où `reactCompilerOutputMode: 'client'` activait silencieusement le compilateur même lorsque `reactCompiler: false` était positionné. Le mode de sortie est désormais stocké séparément et n'est appliqué que lorsque le compilateur est activé, ce qui correspond au comportement documenté dans `bun.d.ts`.

## L'architecture : AST Bun directement vers HIR

Le compilateur vit dans `src/react_compiler/`, une unique crate d'environ 62 k LOC. L'essentiel est un portage à l'octet près de l'espace de travail Rust amont, avec les chemins d'import réécrits et les derives `serde` et `serde_json` dont Bun n'a pas besoin retirés. Les crates amont qui sont portées intégralement : `hir/`, `ssa/`, `inference/`, `typeinference/`, `optimization/`, `validation/`, `reactive_scopes/`, `diagnostics/` et `utils/`. Les structures de données du chemin chaud ont été densifiées : `HashMap<SmallId, _>` devient `Vec<_>`, `HashSet<ValueReason>` devient `EnumSet` (u16), et les points-to sets deviennent `SmallVec<[_; 4]>`. L'API `IndexMap` et `IndexSet` est adaptée au-dessus de `bun_collections::ArrayHashMap` à base d'arène.

Les quatre couches qui touchent l'AST (lowering, codegen, pipeline, et la colle program/imports) sont réimplémentées contre `bun_ast`, avec la table de correspondance de types dans `src/react_compiler/DESIGN.md` qui documente comment les nœuds AST de Bun correspondent à l'AST de forme Babel que le compilateur attend.

Le hook de compilation se déclenche dans `visit_stmts(FnBody)`, entre sa phase de visite et sa phase de mangle inline. La détection de candidats sur `S::Function`, `S::Local`, `S::ExportDefault` et `S::Expr` enregistre la `Ref` du binding et le bit wrapper `memo`/`forwardRef` ; `visit_func` et la visite des arrow functions copient les arguments, flags et locations de la fonction dans une struct `Copy` `PendingCompile` ; le hook appelle `maybe_compile_pending`, qui construit un `G::Fn` local à la pile et exécute `maybe_compile_node`. Le corps compilé atterrit dans le buffer `stmts` vivant pour que la phase de mangle existante s'exécute dessus. Les nouveaux arguments et flags remontent via un unique champ `CompileResult`. Pas de pointeurs bruts, pas de passe supplémentaire ; le chemin non-RC ajoute un seul `is_some()` par déclaration de niveau racine.

Le compilateur honore aussi les suppressions `// eslint-disable react-hooks/*`. Le lexer exécute une vérification de sous-chaîne par commentaire, gardée par le drapeau de fonctionnalité, et propage la suppression comme un bit de flag sur `G::Fn` et `E::Arrow` ; le compilateur saute toute fonction qui le porte.

## Les chiffres

La PR livre un benchmark sur une grosse base de code React (environ 860 composants compilés, 1400 slots de mémo). Le même code, sur la même machine :

| | Temps mural | vs plugin Babel |
|---|---|---|
| Référence (`reactCompiler: false`) | 394 ms | - |
| `reactCompiler: true` | 465 ms (1,18x la base) | ~20x plus rapide que Babel |
| Plugin Babel (même entrée) | 9,15 s | 1x |

La build complète de l'exécutable autonome via `--compile`, qui bundle tout plus la passe React Compiler, s'exécute en 3,62 s avec le portage Rust contre 13,04 s avec le plugin Babel, soit 3,6x plus rapide en bout en bout.

Ce ne sont pas des micro-benchmarks synthétiques. La base de code est réelle, les composants compilent vers de vrais appels de mémoïsation `_c(N)` avec des vérifications de cache `$[0] !== label`, et l'import `react/compiler-runtime` que Bun injecte se résout contre l'installation de React 19+ livrée avec l'application. Bun note que le surcoût baseline+RC (394 ms à 465 ms, ~18%) provient de la construction HIR et de la passe SSA ; le reste du bundler (parser, mangle, minify) est inchangé.

## À quoi ressemble l'API

CLI :

```sh
bun build ./app.tsx --react-compiler --target browser
```

`Bun.build` :

```ts
await Bun.build({
  entrypoints: ["./app.tsx"],
  reactCompiler: true,
  // reactCompilerOutputMode: "client", // par défaut pour target browser
  // reactCompilerOutputMode: "ssr",   // par défaut pour target bun/node
  target: "browser",
});
```

`reactCompilerOutputMode` vaut par défaut `"client"` quand `target` est `"browser"` et `"ssr"` quand `target` est `"bun"` ou `"node"`. Le mode SSR ignore le runtime `useMemoCache` pour que la sortie rendue côté serveur reste compatible avec un cache entre requêtes. La sémantique `compilationMode: "infer"` est héritée du compilateur amont, donc seuls les composants et hooks sont compilés ; les directives `"use no memo"` sont honorées, et `node_modules` est ignoré.

## Ce que cela signifie pour la course aux bundlers

C'est la première fois que le portage Rust du React Compiler est livré comme transformation au moment du build plutôt que comme bibliothèque dans laquelle d'autres outils doivent se brancher. L'[intégration Oxc v0.135](/articles/2026-06-12--oxc-v0-135-react-compiler-ast-breaking) mi-juin a ajouté le compilateur comme crate Rust appelable, mais le seul bundler à l'avoir effectivement câblé depuis est Bun. [Vite 8](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks) et [Vite 8.1](/articles/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap) passent toujours par `babel-plugin-react-compiler` ; Next.js avec Turbopack utilise le portage SWC ; webpack utilise Babel. Le choix de Bun de porter l'amont directement dans sa propre couche AST est un arbitrage délibéré : il évite le coût de conversion cross-AST et la surface de dépendance, au prix d'avoir à resynchroniser périodiquement avec `facebook/react`.

Le chemin de maintenance est câblé. `scripts/sync-react-compiler.sh` récupère par sparse-fetch `facebook/react` et affiche un diff fichier par fichier entre `src/react_compiler/UPSTREAM_PORTED` et la pointe amont, groupé en ports de crate entiers (qui s'appliquent mécaniquement) et en ports côté frontière AST (qui se re-portent via la table de correspondance de types). `--fixtures` resynchronise le corpus de tests. Tant que l'API amont reste de forme AST Babel, le coût du suivi du portage est à peu près proportionnel à la fréquence à laquelle l'amont touche les couches de frontière.

## À surveiller

Trois signaux intéressants à suivre sur les prochaines semaines :

1. Les [notes de release de Bun v1.3.15](https://github.com/oven-sh/bun/releases) lorsqu'elles arriveront, qui devraient regrouper la PR #32504 plus la PR de suivi et promouvoir la fonctionnalité de `bun build` expérimental à un drapeau stable.
2. L'adaptateur Oxc `react_compiler_oxc` livré comme crate stable dans une release Oxc, qui est le chemin que Vite et Rolldown prendront très probablement pour obtenir les mêmes chiffres de performance sans porter l'amont.
3. Tout changement dans l'« API publique » amont du React Compiler depuis « AST Babel + scope info » vers une forme plus native aux bundlers, qui permettrait à Oxc (et via lui Vite, Next.js, Rsbuild) de se passer entièrement de leurs propres crates d'adaptation.
