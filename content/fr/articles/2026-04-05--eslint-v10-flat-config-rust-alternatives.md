---
title: "ESLint v10 Supprime la Config Legacy — Et l'Écosystème JS Prend Note"
description: "La plus importante release de breaking changes d'ESLint finalise la flat config, supprime entirely le support eslintrc, et ajoute le suivi des références JSX. Mais la vraie histoire est peut-être ce qui le talonne."
date: "2026-04-05"
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "typescript", "eslint", "tooling", "openjs"]
---

ESLint v10 est arrivé ce mois-ci, et bien que le titre ressemble à un ménage interne — flat config est enfin finalisé, eslintrc legacy est parti — cette release expose une ligne de fracture dans le paysage des outils JavaScript qui se construit depuis des années.

## Ce qui a réellement changé

La suppression majeure est `LegacyESLint`, la couche de compatibilité qui permettait à `.eslintrc.json` de fonctionner après que flat config (`eslint.config.js`) soit devenu la valeur par défaut en v9. C'est entièrement supprimé. Les méthodes `defineParser()`, `defineRule()`, `defineRules()` et `getRules()` sur `Linter` sont supprimées. `shouldUseFlatConfig()` retourne maintenant inconditionnellement `true`.

La recherche du fichier de config a aussi changé de façon significative : ESLint résout maintenant la configuration depuis le répertoire de chaque fichier analysé plutôt que le répertoire de travail courant. Pour les monorepos où les paquets ont besoin de règles différentes, c'est une correction directe à un point douloureux de longue date.

Le suivi des références JSX est l'autre ajout majeur. Auparavant, `no-unused-vars` d'ESLint signalait comme inutilisées les composantes importées et utilisées uniquement en JSX — un faux positif qui nécessitait des contournements comme `@eslint-react/jsx-uses-vars`. Ce plugin n'est plus nécessaire.

`RuleTester` reçoit trois nouvelles options d'assertion — `requireMessage`, `requireLocation` et `requireData` — permettant aux auteurs de plugins d'appliquer des définitions de tests plus strictes et cohérentes. Les stack traces incluent maintenant l'index et l'emplacement du cas de test défaillant.

Le support Node.js est limité à `^20.19.0 || ^22.13.0 || >=24` — toutes les versions 21 et 23 sont supprimées.

## La migration

L'outil officiel gère ça proprement :

```bash
px @eslint/migrate-config .eslintrc.json
```

Cela génère un fichier `eslint.config.mjs` que les équipes vérifient et ajustent. Le [guide de migration officiel](https://eslint.org/docs/latest/use/migrate-to-10.0.0) couvre chaque breaking change en détail.

Un accroc : `eslint-plugin-react` n'avait pas déclaré ESLint 10 dans ses dépendances peer au moment de la release, causant des conflits d'installation pour les projets React. `eslint-config-next` avait [un problème similaire ouvert](https://github.com/vercel/next.js/issues/91702). Les deux ont été corrigés depuis, mais c'est un rappel que le décalage de l'écosystème est réel quand un changement aussi significatif est déployé.

## Le contexte concurrentiel

ESLint est resté pendant plus d'une décennie largement invaincu comme le linter JS par défaut. Cette position est maintenant mise à l'épreuve de deux directions simultanément.

[Biome](https://biomejs.dev/) combine linting et formatage dans un seul outil — plus besoin de configuration ESLint + Prettier séparée — avec 467 règles couvrant ESLint, TypeScript ESLint et d'autres sources. Sa release v2.4 (février 2026) a ajouté le support des snippets CSS et GraphQL embarqués, 15 règles d'accessibilité HTML, et le support expérimental complet pour Vue, Svelte et Astro. Il utilise un parser Rust et est reconnu pour son utilisation mémoire nettement inférieure.

[Oxc](https://oxc.rs/) pousse l'argument performance plus loin. Son linter, Oxlint, revendique 50–100x plus rapide qu'ESLint selon le nombre de cœurs CPU. Il a plus de 700 règles, un linting vrai type-aware via son projet `tsgo`, et supporte nativement les plugins JS ESLint. Son formateur, Oxfmt, affiche 30x plus rapide que Prettier et 3x plus rapide que Biome. Le tout est open source sous l'OpenJS Foundation.

Le compromis est la couverture des règles. Oxlint n'a pas encore le catalogue complet des règles ESLint, et Biome rattrape encore son retard sur les règles spécifiques TypeScript. Mais la trajectoire est claire, et l'écart de performance n'est pas marginal — il est structurel. L'architecture JavaScript single-threaded d'ESLint a un plafond que les alternatives Rust ne partagent pas.

tldr[]
- ESLint v10 supprime entièrement LegacyESLint et eslintrc legacy — flat config est la seule option, et la recherche de config part du répertoire de chaque fichier pour un meilleur support monorepo
- Le suivi des références JSX élimine un faux positif de longue date avec no-unused-vars, et RuleTester reçoit des améliorations concrètes pour les auteurs de plugins
- Les challengers basés sur Rust Biome et Oxc progressent réellement : Biome combine linting et formatage dans un seul outil, tandis qu'Oxlint revendique 50–100x plus rapide qu'ESLint avec 700+ règles et compatibilité plugins ESLint

faq[]
- **Dois-je migrer immédiatement ?** Si vous êtes sur Vercel ou une plateforme avec ESLint géré, votre config sera probablement mise à jour automatiquement. Pour les configs personnalisées, testez en CI avant de déployer.
- **Cela casse-t-il mon projet React ?** Possibly — si eslint-plugin-react n'a pas été mis à jour pour votre projet, vous pourriez avoir des conflits de dépendances peer. Vérifiez la sortie de résolution de votre gestionnaire de paquets.
- **Devrais-je passer à Biome ou Oxlint ?** Pas encore pour la parité ESLint complète, mais vaut le coup d'évaluer si la performance de linting est un goulot d'étranglement. Les deux sont prêts pour la production pour la plupart des projets.
- **Quelle est l'exigence Node.js ?** v10 nécessite Node.js 20.19+, 22.13+ ou 24+. Node 21 et 23 sont supprimés.
