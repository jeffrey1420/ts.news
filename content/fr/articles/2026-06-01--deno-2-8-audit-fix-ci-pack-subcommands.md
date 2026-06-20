---
title: "Deno 2.8 : Audit Fix, Sous-commande CI et Outil de Pack Natif"
description: "Deno 2.8 introduit quatre nouvelles sous-commandes CLI, améliore la compatibilité Node.js et ajoute un packager de paquets ciblant les registries npm."
date: 2026-06-01
image: "/images/heroes/2026-06-01--deno-2-8-audit-fix-ci-pack-subcommands.png"
author: lschvn
tags: ["runtimes", "typescript", "javascript"]
---

[Deno](/articles/2026-04-07--deno-2-7-stabilizes-temporal-api-windows-arm-npm-overrides) 2.8 est disponible, et cette fois l'actualité n'est pas une seule fonctionnalité majeure mais un ensemble d'améliorations qualité de vie qui resserrent l'écart avec [Node.js](/articles/2026-04-12--nodejs-25-stream-iter-async-streams) tout en ajoutant des outils véritablement nouveaux. La release est tombée le 22 mai, avec un patch (v2.8.1) cinq jours plus tard.

<!-- more -->

## TLDR

- `deno audit fix` corrige automatiquement les vulnérabilités npm en une commande
- `deno ci` offre un signal d'installation reproductible pour les pipelines CI
- `deno pack` génère des tarballs prêts pour npm directement depuis des projets Deno
- La compatibilité Node.js progresse vers les 75%, selon les objectifs de la feuille de route Deno

---

## `deno audit fix`: Correction de Vulnérabilités en Une Commande

`deno audit` avait été introduit dans Deno 2.6 comme outil d'audit de sécurité pour les paquets npm. Deno 2.8 va plus loin avec `deno audit fix`, qui met automatiquement à niveau les paquets vulnérables vers la version corrigée la plus proche compatible avec vos contraintes de version.

```bash
$ deno audit fix
╭ body-parser vulnerable to denial of service when url encoding is enabled
│ Severity: high
│ Package: body-parser
│ Vulnerable: <1.20.3
╰ Info: https://github.com/advisories/GHSA-qwcr-r2fm-qrc7
```

Si un paquet nécessite une mise à jour de version majeure, Deno l'affiche séparément pour vous permettre de décider si vous souhaitez assouplir les contraintes. Tout ce qui respecte le semver est corrigé silencieusement.

---

## `deno ci`: Installations CI Reproductibles

Deno 2.8 introduit `deno ci`, une sous-commande dédiée aux environnements CI et Dockerfiles. Auparavant, obtenir une installation reproductible nécessitait de mémoriser la bonne combinaison de flags pour `deno install`. Maintenant :

```bash
$ deno ci
```

La commande génère une erreur si `deno.lock` est absent, supprime tout `node_modules` existant, puis exécute l'installation avec `--frozen` pour que le lockfile corresponde exactement à la configuration. Ajoutez-la à une étape CI ou un Dockerfile et vous obtenez un signal clair et grepable d'installation reproductible.

---

## `deno pack`: Construire des Tarballs npm Sans Quitter Deno

`deno pack` combine le comportement de `tsc` et `npm pack` en une seule commande. Partant d'un `deno.json` :

```json
{
  "name": "@scope/my-lib",
  "version": "1.0.0",
  "exports": "./mod.ts"
}
```

Exécuter `deno pack` produit un `scope-my-lib-1.0.0.tgz` prêt pour `npm publish`. Le tarball inclut :

- Un `package.json` généré avec `type: "module"`, des conditional exports et les dépendances runtime extraites
- TypeScript transpilé en JavaScript
- Des fichiers de déclaration `.d.ts` extraits via le même pipeline fast-check utilisé par `deno publish`
- Les fichiers README et LICENSE

Les spécifieurs sont réécrits pour que les paquets fonctionnent dans l'écosystème npm : `jsr:@std/path` devient `@jsr/std__path`, les imports relatifs gagnent l'extension `.js`, et les builtins `node:` restent intacts.

---

## `deno bump-version`: Gestion Semver pour Workspaces

`deno bump-version` met à jour le champ version dans votre `deno.json` ou `package.json` avec les incréments semver standard :

```bash
$ deno bump-version patch
$ deno bump-version minor
$ deno bump-version major
$ deno bump-version prerelease
```

Dans un workspace, exécuter depuis la racine applique le même incrément à chaque paquet membre, réécrit les contraintes de version `jsr:` correspondantes, et met à jour l'import map pour que les références inter-paquets restent synchronisées. Sans argument, le mode workspace dérive les montées de version par paquet à partir des Conventional Commits.

---

## Compatibilité Node.js : Vers les 75%

L'objectif affiché de Deno est d'atteindre 75% de compatibilité Node.js d'ici 2026. La release 2.8 fait avancer ce cap avec une couverture plus large des modules `node:`, une meilleure gestion des contexts TLS/SSL, et une compatibilité améliorée avec les paquets npm qui reposent sur des internes Node.js. Le changelog liste des dizaines de correctifs pour `ext/node` couvrant `fs.promises`, `crypto`, `http`, `tls` et `sqlite`.

L'équipe travaille aussi sur `module.registerHooks()` pour le rechargement à chaud du CommonJS, le synthetic ESM pour `node:worker_threads`, et la résolution de modules asynchrone.

---

## Autres Changements Notables

- `deno check --watch` surveille maintenant les dépendances de type-check pour les modifications
- `deno why <specifier>` explique pourquoi une dépendance est dans votre lockfile
- Les champs `exports` de `package.json` pour le navigateur sont maintenant supportés dans le bundling
- Nouvelles APIs `node:perf_hooks` : `createHistogram`
- Événements CDP Network inspector pour `fetch()` et `node:http`

---

## FAQ

**Comment mettre à jour ?**
Exécutez `deno upgrade` ou installez depuis `deno.land/install.sh`.

**`deno pack` remplace-t-il `deno publish` ?**
Non. `deno publish` publie sur JSR ; `deno pack` cible les registries npm. Ce sont deux écosystèmes différents.

**Cette release est-elle rétrocompatible ?**
Oui. Deno 2.8 maintient une complète rétrocompatibilité avec la branche 2.x. Aucune rupture n'est prévue avant une future version majeure.
