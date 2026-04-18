---
title: "Oxc v0.126.0 : Magic Comments Turbopack dans le Parser, Breaking Changes sur l'Allocator"
description: "Oxc v0.126.0 apporte le support des Turbopack Magic Comments dans le parser, un rename breaking des méthodes Box et Vec de l'allocator, de nouvelles options NAPI transform pour l'optimisation des enums, et des gains de performance sur le lexer."
date: 2026-04-18
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Oxc", "Rust", "JavaScript", "Turbopack", "Rolldown", "SWC", "Tooling"]
tldr:
  - Oxc v0.126.0 ajoute le support des Turbopack Magic Comments dans le parser, améliorant la compatibilité avec le code annoté webpack
  - Breaking change : les méthodes Box et Vec de l'allocator sont renommées — les projets avec dépendance directe doivent se mettre à jour
  - Les utilisateurs de NAPI transform peuvent désormais configurer optimizeConstEnums et optimizeEnums
---

## Ce qui a changé

Le release Oxc du 16 avril — crates v0.126.0 — est relativement calme en features visibles mais apporte des améliorations d'outillage importantes.

### Magic Comments Turbopack dans le Parser

L'amélioration principale est [le support des Turbopack Magic Comments par le parser](https://github.com/oxc-project/oxc/pull/20803). Ces commentaires spéciaux comme `/* webpackChunkName */` et `/* resource */` permettent aux bundlers de communiquer des métadonnées sur les imports dynamiques. Avant ce changement, le parser Oxc les traitait comme de simples commentaires. Avec cette mise à jour, ils sont reconnus et préservés sémantiquement.

Si vous utilisez Rolldown ou un outil basé sur le parser Oxc, cela devrait réduire les avertissements parasites et améliorer les décisions de tree-shaking.

### Breaking Change sur l'Allocator

[Les méthodes Box et Vec de l'allocator ont été renommées](https://github.com/oxc-project/oxc/pull/21395). C'est un breaking change pour les projets qui dépendent directement des APIs internes de l'allocator Oxc. La plupart des utilisateurs de Rolldown ou oxlint ne sont pas affectés.

### NAPI Transform : Contrôle de l'Optimisation des Enums

La bindings Node.js (`oxc_transform`) expose désormais `optimizeConstEnums` et `optimizeEnums` en options configurables. Cela donne le contrôle sur l'inlining des enums à la compilation.

### Performance

- L'[allocation Arena a été simplifiée](https://github.com/oxc-project/oxc/pull/21475), réduisant l'overhead lors du traitement de fichiers volumineux.
- Le lexer a [refactoré `LexerContext`](https://github.com/oxc-project/oxc/pull/21275), réduisant les branchements pendant la tokenisation.

## FAQ

### Est-ce que ça touche les utilisateurs d'oxlint ?

Non. oxlint utilise l'infrastructure de linting, pas les changements sur l'allocator ou le parser.

### Comment mettre à jour ?

```bash
cargo update -p oxc_allocator
```

Pour une dépendance directe : consultez le [CHANGELOG](https://github.com/oxc-project/oxc/blob/main/CHANGELOG.md) pour la liste complète des renommages.
