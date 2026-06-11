---
title: "Oxc v0.134 : oxlint v1.68 Ajoute des Règles Vue et des Contrôles TypeScript Accessor"
description: "La version de juin d'Oxc publie oxlint v1.68.0 avec deux nouvelles règles Vue, une règle lint method-signature-style pour TypeScript, et des améliorations du parser pour rejecter les déclarations en contexte ambient."
date: 2026-06-02
image: "/images/heroes/2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules.png"
author: lschvn
tags: ["frameworks", "tooling", "typescript"]
tldr:
  - oxlint v1.68.0 ajoute les règles Vue no-reserved-component-names et component-definition-name, pour éviter les conflits de nommage
  - La nouvelle règle method-signature-style TypeScript enforce l的一致性 entre la syntaxe des méthodes d'interface et des méthodes de classe
  - Le parser émet désormais des codes d'erreur TypeScript précis pour les accessors (TS1094, TS1095, TS1051) et rejecte les générateurs, signatures d'overload et index signatures en contexte ambient
---

<!-- more -->

## oxlint v1.68.0 — Règles Vue et TypeScript

Les ajouts principaux dans oxlint v1.68.0 sont deux règles spécifiques à Vue.

**`vue/no-reserved-component-names`** empêche d'utiliser des noms réservés pour les définitions de composants Vue. Vue réserve des noms comme `Switch`, `KeepAlive` et `Teleport` — les utiliser comme noms de composants locaux peut causer des problèmes de rendu, notamment avec `resolveComponent` ou dans les blocs `<script>` des fichiers `.vue`.

**`vue/component-definition-name`** est la règle counterpart qui détecte quand les noms de définitions de composants entrent en conflit avec les éléments HTML ou les composants intégrés de Vue.

Coté TypeScript, **la nouvelle règle `method-signature-style`** enforce un style cohérent pour les déclarations de méthodes d'interface et de classe. Elle signale les cas où une méthode de classe pourrait être écrite comme une signature de méthode d'interface.

Également nouveau en v1.68.0 : **`override::exclude_files`** permet d'exclure des fichiers spécifiques des overrides de règles, offrant un contrôle plus fin sur la configuration lint sans patterns glob complexes.

## oxfmt v0.53.0 — Mises à Jour du Formateur

oxfmt publie aux côtés d'oxlint avec des améliorations de formatting. Le changelog complet de v0.53.0 est disponible sur la [page des releases oxc-project/oxc](https://github.com/oxc-project/oxc/releases).

## Parser : Validation Plus Stricte du Contexte Ambient TypeScript

Cette release apporte un lot important d'améliorations du parser axées sur l enforce du contexte ambient TypeScript. Le parser émet désormais des codes d'erreur précis pour une gamme de déclarations invalides :

- **TS1094** — type parameters sur accessors (setters/getters avec paramètres de type)
- **TS1095** — setters avec une annotation de type de retour
- **TS1051** — paramètres optionnels dans les setters
- **TS1221 / TS1222** — générateurs et overload signatures en contexte ambient
- **TS1268 / TS1337** — types de paramètres d'index signature invalides
- **TS1038 / TS1036** — `declare` dans des contextes déjà ambient et instructions dans des blocs ambient
- **TS1316** — export-as-namespace à l'intérieur d'un body de namespace
- **TS1183** — implémentations de fonctions en contexte ambient

Le parser rejecte également les combinaisons invalides de modifiers de class members, les imports/exports module-referencing à l'intérieur de namespaces, et les clauses `implements` où le nom de la classe est lui-même `implements`.

## Améliorations de Performance

Trois changements ciblent le débit du parser :

1. **Réutilisation du cached token kind dans les boucles de listes délimitées** — évite des lookups redondants dans les littéraux array/object, paramètres de fonction, etc.
2. **peek_token au lieu de lookahead sur le chemin des modifiers** — un peek plus léger remplace le lookahead plus coûteux lors du scanning des modifiers.
3. **Lookup defer de declare pour les accessors vides** — saute la résolution de symbole inutile pour les accessors sans corps.

## Changelog Complet

Les notes de release complètes pour oxc crates v0.134.0, oxlint v1.68.0 et oxfmt v0.53.0 sont sur la [page releases GitHub d'oxc-project/oxc](https://github.com/oxc-project/oxc/releases).

> **FAQ**
>
> **Q : Comment oxlint se compare-t-il à ESLint ?**
> oxlint est un remplacement drop-in d'ESLint écrit en Rust. Il vise la compatibilité avec les règles et configs ESLint tout en offrant des performances 10 à 100 fois supérieures.
>
> **Q : oxfmt peut-il remplacer Prettier ?**
> oxfmt est un formateur Rust qui supporte JavaScript, TypeScript, JSX et Vue. Il est compatible Prettier pour la plupart des décisions de formatting et est significativement plus rapide.
>
> **Q : Quels projets utilisent Oxc ?**
> Rolldown (le successeurs Rust de Rollup), les pipelines de transpilation, et divers frameworks utilisent Oxc en interne.
