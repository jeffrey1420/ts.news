---
title: "Vite 8.1 Beta : imports `.wasm` directs, `build.chunkImportMap` et rename `server.hmr` → `server.ws`"
description: "Vite 8.1.0-beta.0 (15 juin 2026) est la première beta de la ligne 8.1. Elle livre le standard WASM ESM Integration en imports `.wasm` directs, une option build.chunkImportMap qui exploite les import maps pour améliorer les taux de cache des chunks, l'intégration avec Vite Task pour du cache de build sans configuration, le support des dépendances de plugin lightningcss, et un breaking rename qui déplace toutes les options `server.hmr` vers `server.ws`."
date: 2026-06-15
image: "/images/heroes/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap.png"
author: lschvn
tags: ["tooling", "javascript", "typescript"]
tldr:
  - "Vite 8.1.0-beta.0 est sorti le 15 juin 2026 comme première beta de la ligne 8.1 et première release de features sur la [branche stable Vite 8](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks). Elle livre les imports `.wasm` directs via le draft [WASM ESM Integration](https://github.com/WebAssembly/esm-integration), une option build.chunkImportMap qui utilise les import maps du navigateur pour stabiliser le cache des chunks, l'intégration avec Vite Task pour du cache de build sans configuration, le support des dépendances de plugin lightningcss, et un breaking rename qui déplace toutes les options `server.hmr` vers `server.ws`."
  - "Le support WASM ESM Integration ferme le long-standing vite#4551 et remplace les suffixes `?init` / `?url` / `?raw` par un seul pattern d'import que le bundler résout en glue code ESM. Vite parse le binaire, extrait les imports et exports, et émet un module import-friendly qui fonctionne en dev comme en build SSR."
  - "Autres changements 8.1 qui touchent le quotidien : `import.meta.glob` gagne une option `caseSensitive`, `html.additionalAssetSources` permet d'enregistrer des éléments et attributs custom comme sources d'assets, Vite tracke les dépendances au chargement de la config avec le loader natif Node, et le flag `bundledDev` est replié dans `DevEnvironment` au lieu d'être un environnement séparé. La release bumpe aussi Rolldown à 1.1.1 (voir les [notes Rolldown 1.1.0](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig))."
faq:
  - question: "Quoi de neuf dans la beta Vite 8.1 ?"
    answer: "Vite 8.1.0-beta.0 est la première release de features sur la branche stable Vite 8, publiée le 15 juin 2026. Les têtes d'affiche sont les imports .wasm directs via le standard WASM ESM Integration (plus de suffix `?init`), une option `build.chunkImportMap` qui utilise les import maps pour un meilleur cache des chunks, l'intégration avec Vite Task pour du cache de build sans configuration, le support des dépendances de plugin lightningcss, une config `html.additionalAssetSources` pour les éléments custom, une option `caseSensitive` pour `import.meta.glob`, et un breaking rename qui déplace toutes les options `server.hmr` vers `server.ws`. La release met aussi à jour Rolldown vers 1.1.1."
  - question: "Comment marchent les imports .wasm directs dans Vite 8.1 ?"
    answer: "Vous importez un fichier .wasm exactement comme n'importe quel autre module ES : `import add from './add.wasm'`. Vite parse le binaire, extrait ses imports et exports, et émet du glue code qui retourne une instance WebAssembly.Module. Les anciens suffixes de query `?init`, `?url`, et `?raw` marchent toujours, mais le pattern d'import par défaut suit maintenant le draft WASM ESM Integration. La feature se base sur la proposition esm-integration du WebAssembly community group et fonctionne en build client comme en SSR."
  - question: "Qu'est-ce que le rename `server.hmr` vers `server.ws` change ?"
    answer: "Avant la 8.1, toutes les options WebSocket (host, port, clientPort, path, timeout, overlay) vivaient sous `server.hmr` dans vite.config.ts. À partir de la 8.1, toutes ces options sont à `server.ws`, et `server.hmr` devient un toggle booléen pour activer ou non le HMR. Le fix est mécanique : cherchez `server.hmr` dans votre config et splittez en `server.ws` (pour les options ws) et `server.hmr` (pour le flag booléen d'activation). Le rename règle le long-standing problème qui empêchait de configurer les options ws quand le HMR était désactivé."
  - question: "Qu'est-ce que build.chunkImportMap et pourquoi c'est important ?"
    answer: "`build.chunkImportMap` est une nouvelle option de build qui émet un import map à côté du chunk graph, pour que le navigateur puisse résoudre les URLs de chunk via la map plutôt que via la seule instruction d'import. Comme les entrées d'import map restent stables entre rebuilds tant que le chemin de fichier du chunk ne change pas, le navigateur peut réutiliser des chunks déjà fetched à travers les déploiements. L'option s'implémente au-dessus de la feature chunkImportMap expérimentale de Rolldown et dépend de `import.meta.resolve` dans le navigateur, donc elle ne s'applique pas aux navigateurs plus anciens ; le companion plugin-legacy les couvre avec SystemJS."
  - question: "Comment Vite 8.1 s'intègre-t-il avec Vite Task ?"
    answer: "Vite 8.1 embarque une nouvelle dépendance `@voidzero-dev/vite-task-client` qui lui permet de discuter avec Vite Task à l'exécution via la même IPC que le runner utilise déjà. Vite déclare ses inputs, outputs, et envs `envPrefix` via le client, qui est un no-op quand Vite tourne hors de Vite Task. Résultat : `vp run vite build` cache correctement sans aucune déclaration manuelle d'envs ou d'inputs dans la config de la task. Le changement accompagne le travail sur la [toolchain unifiée Vite+](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source)."
  - question: "Est-ce que la beta Vite 8.1 est safe en production ?"
    answer: "Non, c'est une beta. Le swap Rolldown de Vite 8.0 continue de remonter des edge cases plugins, et la beta 8.1 en ajoute par-dessus. Utilisez 8.1.0-beta.0 pour valider que votre chaîne de plugins marche toujours, que votre config `server.hmr` a bien été migrée vers `server.ws`, et que vos imports WASM sont toujours émis correctement. Ne la pinnez pas en production. Une stable 8.1.0 suivra dans les semaines qui viennent une fois le feedback de beta traité."
---

[Vite 8.1.0-beta.0](https://github.com/vitejs/vite/releases/tag/v8.1.0-beta.0) est sorti le 15 juin 2026, première release de features sur la [branche stable Vite 8](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks) et première beta 8.x depuis la [Vite 8 stable du 12 mars](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks). Après dix semaines de petits patchs sur la ligne v8.0, l'équipe Vite profite de la 8.1 pour livrer un cluster de changements qui attendaient dans des PRs depuis des mois : une vraie implémentation du standard WASM ESM Integration pour les imports `.wasm` directs, une option `build.chunkImportMap` qui exploite les import maps du navigateur pour stabiliser le cache des chunks, l'intégration avec le runner Voidzero Vite Task pour du cache de build sans configuration, le support des dépendances de plugin lightningcss, et un breaking rename longtemps attendu qui déplace toutes les options `server.hmr` vers `server.ws`. La release bumpe aussi Rolldown à 1.1.1 (voir les [notes Rolldown 1.1.0](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig) pour le contexte de la ligne 1.1).

La beta arrive un peu plus de trois mois après la Vite 8.0 stable, une cadence plus rapide que la transition 5.x vers 6.x. La plupart des features 8.1 sont opt-in ou gardées derrière de nouvelles clés de config, donc l'upgrade depuis la 8.0 est largement non-breaking, à la notable exception du rename `server.hmr`, qui demandera une édition de config pour tout projet qui règle actuellement des options WebSocket.

## Imports `.wasm` directs via le standard WASM ESM Integration

La feature phare de la 8.1 est la [PR #21779](https://github.com/vitejs/vite/issues/21779), qui ferme la long-standing [issue #4551](https://github.com/vitejs/vite/issues/4551) en ajoutant le support d'importer des fichiers `.wasm` directement sans le suffix `?init`. La feature implémente le draft [WASM ESM Integration](https://github.com/WebAssembly/esm-integration) du WebAssembly community group, le même spec qui permettra aux navigateurs de traiter nativement les fichiers `.wasm` comme des modules ES.

Le nouveau pattern d'import ressemble à ça :

```js
// Avant (Vite 8.0 et antérieur)
import init from './add.wasm?init';
const instance = await init();

// Nouveau (Vite 8.1+)
import { add } from './add.wasm';
console.log(add(2, 3));
```

Sous le capot, Vite parse le binaire, extrait ses imports et exports, et émet du glue code qui retourne une instance `WebAssembly.Module` proprement typée. Le plugin gère les modes dev et SSR build, et les suffixes de query `?init`, `?url`, et `?raw` marchent toujours, donc le code existant n'a pas à migrer en lockstep.

Le shift compte parce que tous les autres bundlers de l'écosystème JavaScript ont dû inventer un suffix d'import non standard pour WASM. Vite 8.1 aligne le chemin d'import avec la spec navigateur à venir, ce qui veut dire que la même instruction d'import marchera dans un futur où les navigateurs livrent WASM ESM nativement et où Vite s'efface. La feature est indépendante du support navigateur aujourd'hui, parce que Vite fait toujours le parsing et la génération de glue ; la spec niveau navigateur standardise juste la cible long terme.

## `build.chunkImportMap` pour un cache de chunks stable

La [PR #21580](https://github.com/vitejs/vite/issues/21580) ajoute une nouvelle option `build.chunkImportMap`, implémentée au-dessus de la [feature chunkImportMap expérimentale de Rolldown](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap). La motivation, c'est la stabilité du cache de chunks entre déploiements.

Dans un build Rolldown par défaut, chaque nom de fichier de chunk contient un content hash, et les instructions d'import pointent directement vers l'URL hashée. Quand un seul fichier source change, chaque chunk qui l'importe (directement ou transitivement) reçoit un nouveau hash, ce qui cascade à travers le graphe d'imports et invalide plus de chunks que strictement nécessaire. Les import maps découplent l'instruction d'import de l'URL du chunk : l'instruction dit `import { x } from '/chunks/x.js'`, l'import map dit que `/chunks/x.js` résout vers `/chunks/x-abc123.js`, et quand le contenu du chunk ne change pas, l'URL hashée reste la même et le navigateur la réutilise.

L'implémentation dépend de `import.meta.resolve` dans le navigateur, donc `chunkImportMap` ne marche que sur les navigateurs qui le supportent. La release companion de [plugin-legacy](https://github.com/vitejs/vite) couvre les navigateurs plus anciens avec un support d'import map basé sur SystemJS. Deux caveats à noter : `experimental.renderBuiltUrl` ne marche pas encore avec cette option, et l'optimisation ne s'applique pas encore au CSS et aux assets, seulement aux chunks JavaScript.

Le fix vise les long-running issues [#6773](https://github.com/vitejs/vite/issues/6773) et [#10636](https://github.com/vitejs/vite/issues/10636), ce qui veut dire que c'est une feature que l'équipe Vite considère depuis l'ère v3. Elle est opt-in et gardée derrière le flag expérimental de Rolldown, donc ça vaut le coup de mesurer sur un vrai build de production avant de l'activer par défaut.

## Intégration Vite Task pour du cache de build sans configuration

La [PR #22453](https://github.com/vitejs/vite/issues/22453) intègre Vite avec le runner Voidzero Vite Task (`vp run` dans [Vite+](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source)) pour que `vite build` puisse être caché avec zéro configuration utilisateur. Le mécanisme est une petite nouvelle dépendance, `@voidzero-dev/vite-task-client`, que Vite appelle aux points de code pertinents pour déclarer ses inputs de build, ses outputs, et ses envs `envPrefix`. Les appels sont des no-ops quand Vite tourne hors de Vite Task, donc il n'y a aucun coût pour les utilisateurs qui ne sont pas sur le runner.

Le problème que ça résout est réel et pénible : Vite Task tracke les reads et writes de fichiers au niveau syscall, mais les env vars doivent être déclarées à la main dans la config de la task. La plupart des projets utilisent la convention de préfixe `VITE_*` pour les envs visibles côté client, et avant il fallait garder deux configs en sync, le `envPrefix` dans `vite.config.ts` et la liste `env` dans la config Vite Task, sinon le cache produisait silencieusement des bundles incorrects. Avec la 8.1, Vite reporte les envs `VITE_*` qu'il lit réellement, et Vite Task les fingerprint automatiquement. Oublier de déclarer un env ne produit plus un bug de cache périmé.

L'intégration est une brique de l'histoire de la [toolchain unifiée Vite+](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source) : elle rend l'histoire de caching du runner significative pour les utilisateurs Vite sans forcer une migration de config, et elle donne à Voidzero un moyen d'ajouter incrémentalement plus d'optimisations task-level à `vite build` sans changer la surface de config de Vite.

## Le rename `server.hmr` → `server.ws`

La [PR #21357](https://github.com/vitejs/vite/issues/21357) est le breaking change de la release. Avant la 8.1, toutes les options liées au WebSocket (host, port, clientPort, path, timeout, overlay) vivaient sous `server.hmr` dans `vite.config.ts`. Le problème que ça causait, c'est que vous ne pouviez pas configurer les paramètres WebSocket quand le HMR lui-même était désactivé par `server.hmr: false`, parce que l'objet de config était carrément off.

Le split en 8.1 est straightforward :

```ts
// Avant (Vite 8.0 et antérieur)
export default defineConfig({
  server: {
    hmr: {
      host: 'localhost',
      port: 24678,
      clientPort: 24678,
    },
  },
});

// Nouveau (Vite 8.1+)
export default defineConfig({
  server: {
    hmr: false, // toggle booléen, comme avant
    ws: {
      host: 'localhost',
      port: 24678,
      clientPort: 24678,
    },
  },
});
```

La migration est mécanique : grep votre config pour `server.hmr` et splittez en `server.ws` (pour les options WebSocket) et `server.hmr` (pour le flag booléen d'activation). Toute config qui utilisait juste `server.hmr: true` ou `server.hmr: false` n'a pas besoin de changement. Le rename était discuté depuis l'issue [#18489](https://github.com/vitejs/vite/issues/18489), et il atterrit en 8.1 comme le seul breaking change de la ligne.

## Autres changements 8.1 à connaître

Le reste de la beta 8.1 est un mix de petites améliorations ergonomiques et de refactors :

- **`html.additionalAssetSources`** ([#21412](https://github.com/vitejs/vite/issues/21412)) permet d'enregistrer des éléments et attributs HTML custom comme sources d'assets, pour des trucs comme `<html-import src="...">` ou `<img data-src-dark="..." data-src-light="...">`. Sans ça, Vite ne réécrit les URLs que dans une liste hardcodée d'éléments, ce qui casse les URLs dans les web components custom.
- **Option `caseSensitive` pour `import.meta.glob`** ([#21707](https://github.com/vitejs/vite/issues/21707)) donne au matching de patterns glob un mode case-sensitive opt-in. Le défaut reste case-insensitive pour matcher la sémantique glob, mais sur les filesystems case-sensitive (Linux, macOS) le match case-insensitive peut produire des résultats surprenants.
- **Support des dépendances de plugin lightningcss** ([#21748](https://github.com/vitejs/vite/issues/21748)) fait que Vite honore les dépendances de plugin déclarées par `lightningcss` lui-même, donc ajouter un plugin lightningcss ne demande plus d'enregistrement manuel côté Vite.
- **Hosts multiples dans `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`** ([#21501](https://github.com/vitejs/vite/issues/21501)) permet à la variable d'env de prendre une liste d'hosts autorisés séparés par des virgules, au lieu d'un seul.
- **Tracking de dépendances pour le chargement de config natif** ([#22602](https://github.com/vitejs/vite/issues/22602)) tracke les dépendances de la `vite.config.ts` quand Vite la charge via le loader natif Node, pour que les éditions de fichiers de config importés déclenchent correctement un redémarrage du dev server.
- **`bundledDev` replié dans `DevEnvironment`** ([#22587](https://github.com/vitejs/vite/issues/22587)) supprime la sous-classe `DevEnvironment` séparée pour le mode `bundledDev`. Le flag est maintenant une option sur la classe standard `DevEnvironment`, ce qui simplifie le code de plugin qui doit gérer les deux modes.
- **Restrictions fs pnpm global virtual store** ([#22415](https://github.com/vitejs/vite/issues/22415)) applique les bonnes restrictions fs quand une dep est installée dans le layout gvs de pnpm, pour que Vite distingue correctement quelles deps peuvent être lues depuis le dev server et lesquelles ne peuvent pas.
- **Préservation de sourcemap pour les deps optimisées avec transforms de suivi** ([#22428](https://github.com/vitejs/vite/issues/22428)) garde la sourcemap originale intacte quand une dep est re-transformée après le pre-bundling, pour que les stack traces pointent toujours vers la source originale.

## Comment essayer

```bash
bun add -D vite@8.1.0-beta.0
# ou
npm install -D vite@8.1.0-beta.0
```

Quelques trucs à valider en upgradeant :

1. Le rename `server.hmr`. Si votre config règle une option WebSocket, déplacez-la vers `server.ws` et gardez `server.hmr` comme flag booléen d'activation.
2. Vos imports WASM. Lancez le dev server et un build de production, et confirmez qu'à la fois le nouveau pattern d'import direct et le legacy `?init` émettent toujours du code qui marche.
3. Le comportement de plugins sur Rolldown 1.1.1. La stable Vite 8.0 a remonté plusieurs edge cases plugins pendant le cycle de patch, et la 8.1 hérite de la même situation. La mise à jour Rolldown elle-même est petite, mais l'effet combiné sur les chaînes de plugins justifie un smoke test.
4. `import.meta.glob` avec `caseSensitive: true` sur les filesystems case-sensitive, si votre projet s'appuie sur du matching glob pour du routing ou de la collection d'assets.

Vite 8.1 est une beta, pas une release stable, et l'équipe Vite va mener quelques semaines de feedback beta avant de couper la 8.1.0 stable. Le breaking change est petit, les nouvelles features sont opt-in, et la dépendance sur Rolldown 1.1.1 est la même que ce que la Vite 8.0.x avait déjà, donc le risque d'upgrade pour les projets sur Vite 8.0 stable est faible. Pinnez en 8.0.16 pour la production, et utilisez 8.1.0-beta.0 pour valider que votre chaîne de plugins et votre config survivent au rename. La stable 8.1 sortira dans les semaines qui viennent.
