---
title: "Biome 2.5 livre `@biomejs/js-api` v6.0.0 : un bump majeur pour l'API JS"
description: "La CLI Biome passe en 2.5.0 et l'API JavaScript passe en v6.0.0 majeure. Le gros titre est le nouveau helper spanInBytesToSpanInCodeUnits, qui corrige un vrai bug de surrogates UTF-16 dans l'extraction de texte diagnostique non-ASCII, plus une longue liste d'améliorations SCSS, JSON, linter et CLI."
date: 2026-06-12
image: "/images/heroes/2026-06-12--biome-v2-5-js-api-v6-major.png"
author: lschvn
tags: ["tooling", "javascript", "ecosystem"]
tldr:
  - "L'API JavaScript de Biome passe en v6.0.0 majeure le 12 juin 2026, avec en tête spanInBytesToSpanInCodeUnits, un helper qui corrige un vrai bug de surrogates UTF-16 dans l'extraction de texte diagnostique non-ASCII."
  - "Le bump CLI en 2.5.0 est essentiellement un alignement des packages WASM, mais livre un nouveau reporter concis, un logo Biome en art ASCII, et une longue liste de features SCSS, JSON, linter et a11y HTML."
  - "biome_service gagne le support des réécritures de plugins GritQL via --write, ouvrant la porte à des refactors custom dans le même pipeline que les règles intégrées."
faq:
  - question: "Qu'est-ce qui casse quand j'upgrade de @biomejs/js-api 5.x à 6.0.0 ?"
    answer: "La surface publique garde la même forme ; le bump majeur sert d'avertissement sur le nouveau helper et sur le version pinning des dépendances @biomejs/wasm-web, @biomejs/wasm-bundler, et @biomejs/wasm-nodejs, qui s'alignent tous sur 2.5.0. Si vous appelez les modules WASM directement, il faudra les bumper en parallèle. Côté CLI, c'est totalement rétrocompatible."
  - question: "Comment corriger le problème d'octets vs UTF-16 dans mon propre code ?"
    answer: "Si vous contourniez le bug en convertissant manuellement les offsets en octets de Biome avant de slice dans le contenu de la string JavaScript, remplacez le contournement par le nouveau helper : `const [start, end] = spanInBytesToSpanInCodeUnits(diagnostic.location.span, content); const text = content.slice(start, end);` Le helper gère correctement les surrogate pairs et les surrogates non appariés, le cas que les conversions manuelles rataient en général."
  - question: "Est-ce que Biome 2.5 ajoute du linting HTML ?"
    answer: "Oui, en ce sens que plusieurs règles a11y ont été portées de l'analyseur JS vers biome_html_analyze. À partir de 2.5, l'analyseur HTML inclut noRedundantRoles, useKeyWithMouseEvents et useAriaActivedescendantWithTabindex. La règle noRedundantRoles pour HTML a été portée, annulée, puis re-validée après un fix."
  - question: "Qu'est-ce que la feature de réécriture GritQL ?"
    answer: "biome_service supporte désormais l'application des réécritures de plugins GritQL via le flag standard --write. GritQL est un langage de pattern-matching conçu pour les refactors de code source ; l'intégration signifie que vous pouvez livrer un plugin GritQL custom et laisser Biome appliquer la réécriture sur les mêmes fichiers que le linter et le formatter, avec la même configuration project-aware."
---

Biome a livré deux releases coordonnées le 12 juin 2026 : [Biome CLI v2.5.0](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.5.0) et [@biomejs/js-api v6.0.0](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fjs-api%406.0.0). Le gros titre est le premier bump majeur de l'API JavaScript depuis que le projet a séparé les packages WASM de la CLI. Le bump CLI est essentiellement un alignement WASM, avec une longue liste de petites features par-dessus.

## Le gros titre js-api v6.0.0

Le bump majeur est centré sur un seul nouvel export : `spanInBytesToSpanInCodeUnits(diagnostic.location.span, content)`. Les diagnostics de Biome portent des offsets en octets UTF-8 parce que c'est ainsi que l'analyseur indexe la source en interne. Les strings JavaScript sont en UTF-16, donc tout code qui prenait un diagnostic Biome et appelait `content.slice(spanStart, spanEnd)` sur la string originale obtenait le mauvais texte sur tout contenu non-ASCII : emoji, caractères accentués, CJK. La frontière de slice atterrissait au milieu d'une code unit, renvoyait `undefined` pour le surrogate final, et corrompait silencieusement l'extrait.

Le nouveau helper convertit des spans en octets vers des spans en code units UTF-16, y compris les edge cases de surrogate pairs et surrogates non appariés. C'est le genre de fix qui justifie à lui seul un bump de version majeure, et Biome a saisi l'occasion pour bumper les packages WASM : `@biomejs/wasm-web`, `@biomejs/wasm-bundler`, et `@biomejs/wasm-nodejs` se pinent tous sur 2.5.0 pour s'aligner sur la CLI.

## SCSS, JSON, linter, et CLI

La release 2.5.0 couvre une longue liste de features incrémentales. Côté parser, le support SCSS est significativement étendu : noms qualifiés dans les valeurs et appels de fonction, parsing d'expressions unaires, déclarations imbriquées dans les listes de déclarations, déclarations dans les blocs `@page`, et délimiteurs dans les listes de valeurs entre crochets. JSON obtient une nouvelle règle `useSortedPackageJson`. Le linter embarque deux nouvelles règles cross-language, une nouvelle option `includes` pour le scoping de fichiers de plugin, une option `ignore` pour `no-unused-variables`, et un changement de `noUndeclaredClasses` qui collecte maintenant les styles locaux et globaux. `organizeImports` ajoute une option `sortBareImports`.

La CLI obtient un logo Biome en art ANSI au démarrage et un nouveau reporter concis. `biome_service` gagne le support des [réécritures de plugins GritQL](https://docs.grit.io/) via le flag `--write` standard, ce qui est la pièce manquante pour livrer une règle de refactor custom qui passe par le même pipeline que le linter et le formatter.

L'analyseur HTML continue de grandir. À partir de 2.5, il inclut `noRedundantRoles`, `useKeyWithMouseEvents`, et `useAriaActivedescendantWithTabindex` (le port de `noRedundantRoles` a été annulé puis re-validé après un fix, d'où sa double présence dans le changelog).

## Pourquoi le bump majeur compte

Pour les utilisateurs qui consomment Biome comme CLI ou via des intégrations éditeur, 2.5.0 est un upgrade de routine. L'histoire intéressante est pour les projets qui embarquent `@biomejs/js-api` directement : le helper est la première pièce d'un effort plus large pour rendre l'API sûre à utiliser sur du code source non-ASCII, et le bump majeur signale que le projet traite la surface publique comme un contrat stable.

Ce positionnement rapproche Biome de [la place qu'occupe Oxc avec la toolchain Rust](/articles/2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules) : une toolchain JavaScript backed par Rust, avec une API programmatique pour l'embarquer. Les deux projets prennent des positions différentes sur le spectre — Biome bundle linter, formatter et organizeur d'imports dans un binaire unique, Oxc sépare cela en crates distinctes — mais les deux sont désormais assez matures pour que l'embarquement programmatique soit un cas d'usage de première classe. Pour les équipes qui faisaient passer l'API précédente par un contournement UTF-8 vers UTF-16, 6.0.0 est l'upgrade qui rend le contournement superflu.
