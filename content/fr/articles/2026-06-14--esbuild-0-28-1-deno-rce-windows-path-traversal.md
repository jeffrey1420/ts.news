---
title: "esbuild 0.28.1 : première release en deux mois avec une RCE Deno de haute gravité, un path traversal Windows et un bug de disposal `using`"
description: "esbuild v0.28.1 (11 juin 2026) est la première release depuis avril. Elle corrige une exécution de code à distance CVSS 8.1 dans l'API Deno via NPM_CONFIG_REGISTRY, un path traversal du dev server limité à Windows, et un bug du minifier qui cassait silencieusement le disposal des ressources avec `using` et `await using`."
date: 2026-06-14
image: "/images/heroes/2026-06-14--esbuild-0-28-1-deno-rce-windows-path-traversal.png"
author: lschvn
tags: ["security", "tooling", "javascript"]
tldr:
  - "esbuild v0.28.1, publiée le 11 juin 2026, est la première release esbuild en deux mois et corrige une exécution de code à distance CVSS 8.1 (High) dans l'API Deno : l'installeur Deno écrivait le binaire téléchargé sur disque avec les permissions 0o755 et sans contrôle SHA-256, donc quiconque contrôlait NPM_CONFIG_REGISTRY pouvait substituer l'exécutable."
  - "Une seconde advisory (GHSA-g7r4-m6w7-qqqr, Low) corrige un path traversal limité à Windows dans le dev server d'esbuild : path.Clean() de Go ne normalise que les slashs, donc des requêtes contenant des antislashs pouvaient sortir du répertoire servi et lire des fichiers arbitraires."
  - "La release corrige aussi un vrai bug de justesse du minifier : les déclarations `using` et `await using` étaient inlinées dans leurs usages ultérieurs, ce qui supprimait silencieusement l'appel de disposal et faisait fuiter des ressources dans l'output minifié."
faq:
  - question: "La vulnérabilité esbuild sur Deno est-elle exploitable depuis un projet normal ?"
    answer: "Uniquement si vous utilisez esbuild depuis Deno et que la variable d'environnement NPM_CONFIG_REGISTRY pointe vers un registre contrôlé par l'attaquant, ce qui est surtout réaliste dans les pipelines CI, les machines de dev partagées et les réseaux d'entreprise qui proxient npm via un registre custom. L'installeur Node faisait déjà un contrôle d'intégrité SHA-256 (binaryIntegrityCheck) contre des hashes attendus dans package.json ; le chemin Deno l'avait carrément omis. La 0.28.1 ajoute le même contrôle à l'installeur Deno, donc un binaire altéré échoue désormais au lieu de s'exécuter."
  - question: "Le path traversal Windows affecte-t-il les builds de production ?"
    answer: "Non. GHSA-g7r4-m6w7-qqqr n'affecte que le serveur de développement local d'esbuild (esbuild.context().serve() / le flag --serve) sous Windows, et uniquement quand un attaquant peut atteindre ce serveur en HTTP. Une requête malveillante utilisant un antislash pouvait sortir du répertoire serve configuré et lire des fichiers en dehors. Le bundling simple et les builds one-shot ne sont pas affectés, et le problème ne s'applique pas sur macOS ou Linux."
  - question: "Comment savoir si le bug du minifier sur `using` a affecté mon code ?"
    answer: "Si vous cibliez la minification esbuild sur une version antérieure à 0.28.1 et que vous utilisiez la syntaxe d'explicit resource management (`using x = ...` ou `await using y = ...`), vérifiez si la déclaration a été inlinée dans un usage ultérieur. L'échec typique était `{ using x = new Resource(); x.activate() }` minifié en `new Resource().activate()`, ce qui supprime le binding `using`, donc Symbol.dispose ne s'exécute jamais et la ressource fuit. Passez à la 0.28.1 et la déclaration est préservée."
  - question: "Qu'est-ce qui a changé pour `import()` et `require()` sur un module qui lève une erreur ?"
    answer: "Issue #4461. Avant la 0.28.1, si un module levait une erreur pendant l'évaluation, esbuild ne préservait l'erreur lancée que pour le premier import() ou require() de ce module ; les appels suivants récupéraient un état de module périmé au lieu de relancer. La spec exige la même erreur à chaque appel, et la 0.28.1 le fait désormais, ce qui compte pour la logique de retry et la gestion d'erreurs en import dynamique."
---

esbuild [v0.28.1](https://github.com/evanw/esbuild/releases/tag/v0.28.1), publiée le 11 juin 2026, est la première release du bundler depuis [v0.28.0 le 2 avril](https://github.com/evanw/esbuild/releases/tag/v0.28.0). Un tel écart de deux mois est inhabituel pour un projet qui sort normalement une release toutes les quelques semaines, et la 0.28.1 dépense son budget sur trois choses qui méritent chacune une mise à jour : une exécution de code à distance de haute gravité dans l'API Deno, un path traversal limité à Windows dans le dev server, et un bug de justesse du minifier qui cassait silencieusement la syntaxe de disposal `using` et `await using`.

Comme esbuild est le substrat de [l'optimiseur de dépendances et du pipeline TS/JSX de Vite](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source), beaucoup de projets héritent de ces correctifs transitivement. Voici ce qui a changé et qui doit agir.

## Une RCE de haute gravité dans l'API Deno

L'élément le plus sérieux est [GHSA-gv7w-rqvm-qjhr](https://github.com/evanw/esbuild/security/advisories/GHSA-gv7w-rqvm-qjhr), notée High avec CVSS 8.1. La distribution Deno d'esbuild (`lib/deno/mod.ts`) télécharge le binaire natif d'esbuild depuis un registre npm et l'écrit sur disque avec les permissions exécutables (`0o755`) sans en vérifier le contenu. L'installeur Node avait déjà un `binaryIntegrityCheck()` qui compare un hash SHA-256 de l'exécutable téléchargé aux valeurs attendues figées dans `package.json` ; le chemin Deno n'a jamais eu l'équivalent.

Le vecteur d'exploitation est la variable d'environnement `NPM_CONFIG_REGISTRY`. Le module Deno construit son URL de téléchargement à partir de cette variable, donc quiconque peut la positionner, dans un pipeline CI, une machine de dev partagée ou un réseau d'entreprise qui proxie npm via un registre custom, peut servir un binaire piégé qu'esbuild exécutera sans sourciller. C'est la même classe de défaut de confiance supply-chain qui a produit le récent [incident de prise de contrôle du compte npm `shai-hulud`](/articles/2026-06-06--npm-supply-chain-attack-red-hat-mini-shai-hulud) : le registre est fié par défaut et le consommateur n'a pas de second contrôle.

La 0.28.1 porte le contrôle d'intégrité SHA-256 sur l'installeur Deno. Un binaire dont le hash ne correspond pas à la valeur attendue échoue désormais avec une erreur au lieu de s'exécuter. Notez que l'API Deno d'esbuild installe toujours depuis `registry.npmjs.org` par défaut et honore toujours `NPM_CONFIG_REGISTRY` ; le correctif porte sur la vérification, pas sur un changement de source.

## Un path traversal Windows dans le dev server

La seconde advisory, [GHSA-g7r4-m6w7-qqqr](https://github.com/evanw/esbuild/security/advisories/GHSA-g7r4-m6w7-qqqr), est notée Low (CVSS 2.5) mais illustre parfaitement un bug classique. Le serveur de développement local d'esbuild nettoyait les chemins de requêtes entrantes avec `path.Clean()` de Go. Cette fonction est purement POSIX : elle comprend les slashs mais traite un antislash comme un caractère ordinaire. Sous Windows, où `\` est un séparateur de chemin valide, une requête forgée pouvait donc sortir du répertoire `serve` configuré et lire des fichiers arbitraires.

La cause racine tient en une ligne :

```go
queryPath := path.Clean(req.URL.Path)[1:]
```

La 0.28.1 interdit purement et simplement les antislashs dans les chemins de requêtes du dev server. L'exposition est étroite : elle nécessite le dev server (`esbuild.context().serve()` ou le flag `--serve`) sous Windows, joignable par un attaquant. Le bundling de production et les builds one-shot ne sont pas affectés, pas plus que les hôtes macOS et Linux.

## Le bug du minifier sur `using` et `await using`

Le troisième correctif est celui pour lequel la plupart des développeurs d'application devraient vraiment auditer leur output. [Issue #4482](https://github.com/evanw/esbuild/issues/4482) : le minifier d'esbuild inlinait parfois une déclaration `using` ou `await using` dans son usage ultérieur, ce qui supprime le binding et signifie que `Symbol.dispose` / `Symbol.asyncDispose` ne s'exécute jamais. L'échec ressemble à ça :

```js
// Code original
{
  using x = new Resource()
  x.activate()
}

// Ancien output esbuild (avec --minify)
new Resource().activate();

// Output corrigé (0.28.1)
{using e=new Resource;e.activate()}
```

L'ancien output fait fuiter la ressource à chaque fois, parce qu'il ne reste plus de `using` pour déclencher le disposal en fin de bloc. Le bug existe parce que la passe d'inlining du minifier avait été écrite pour `let` et `const`, exclue ensuite pour `var`, et jamais mise à jour quand la syntaxe d'explicit resource management a ajouté deux nouveaux types de déclaration. Si vous livrez des builds de production minifiés et que vous utilisez `using` pour des handles de fichiers, des connexions de base de données, des verrous ou n'importe quel `AsyncDisposable`, c'est une régression de justesse silencieuse qu'il vaut la peine de grep dans votre output de build.

## Correctifs de justesse plus petits

Le reste de la 0.28.1 est un cluster de correctifs qui touchent surtout des cas limites de bundling :

- **Erreurs de module relancées ([#4461](https://github.com/evanw/esbuild/issues/4461), [#4467](https://github.com/evanw/esbuild/pull/4467)).** Si un module lève une erreur pendant l'évaluation, la spec exige que chaque `import()` ou `require()` ultérieur de ce module relance la même erreur. esbuild ne préservait l'erreur que pour le premier appel. Ça compte pour la logique de retry et la gestion d'erreurs en import dynamique.
- **Wrapping de l'opérateur `new` ([#4477](https://github.com/evanw/esbuild/issues/4477)).** Les cibles complexes de `new`, en particulier les template literals taggés et les optional chains, n'étaient pas toujours wrappées de parenthèses. L'ancien output était parfois une erreur de syntaxe et parfois modifiait la sémantique, par exemple `new (foo()`bar`)()` et `new (foo()?.bar)()`.
- **Renommage de `var` hoisté ([#4471](https://github.com/evanw/esbuild/issues/4471)).** Un `var` déclaré dans un scope imbriqué et hoisté vers le scope module n'était pas traité comme un symbole de niveau module lors de la passe de collision de noms, ce qui pouvait faire collider des noms quand la minification était désactivée.
- **`const` vers `var` en ES5 ([#4448](https://github.com/evanw/esbuild/issues/4448)).** Pour les constructs TypeScript-only `import x = require('y')` ciblant ES5, esbuild émet désormais `var` au lieu de `const`, qu'il ne pouvait pas downgrader correctement.

## Qui doit mettre à jour

La RCE Deno est le seul élément qui justifie une mise à jour immédiate du type « tout le monde, maintenant », et uniquement pour les projets qui consomment esbuild via Deno dans un environnement où `NPM_CONFIG_REGISTRY` est positionné. Tout le monde devrait quand même passer à la 0.28.1 au prochain bump d'outils de build : le path traversal Windows ferme une exposition réelle, même si étroite, et le correctif de disposal `using` est un bug de justesse que vous ne voulez pas dans votre output de production minifié.

La release est aussi un rappel utile qu'esbuild n'est pas qu'un détail d'implémentation de Vite. C'est le substrat de transpilation et de minification sous une grande part de la [toolchain JavaScript en Rust](/articles/2026-06-12--oxc-v0-135-react-compiler-ast-breaking), et son écart de release de deux mois vaut la peine d'être noté face au rythme hebdomadaire d'Oxc et Rolldown. Pour l'instant, les correctifs atterrissent proprement et la mise à jour est un `bun install esbuild@latest` ou équivalent. Si vous faites tourner le dev server d'esbuild sous Windows, ou si vous utilisez esbuild depuis Deno derrière un registre custom, faites-le aujourd'hui.
