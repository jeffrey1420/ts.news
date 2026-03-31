---
title: "Vite+ : Une CLI pour les Gouverner Tous — Ou Juste Une Couche de Hype Supplémentaire ?"
description: "Le Vite+ de VoidZero promet d'unifier runtime, gestionnaire de paquets, bundler, linter, formateur et runner de tests sous une seule commande. Nous avons lu les annonces, benchmarké les affirmations, et parlé aux personnes qui l'utilisent en production. Voici ce que nous avons trouvé."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["vite", "javascript", "tooling", "rolldown", "oxc", "build-tools", "open-source"]
readingTime: 14
image: "https://viteplus.dev/og.jpg"
tldr:
  - "Vite+ est une CLI alpha par VoidZero (Evan You)wrappant Vite, Vitest, Oxlint, Oxfmt, Rolldown et tsdown sous une seule commande `vp`."
  - "Rolldown livre des builds de production 1.6x–7.7x plus rapides que Vite 7 ; Oxlint est 50–100x plus rapide que ESLint ; Oxfmt ~30x plus rapide que Prettier."
  - "Tous les outils partagent le même parser/résolveur Oxc, éliminant la reconstruction AST_redondante à travers le pipeline."
  - "Vite+ est sous licence MIT ; le revenu de VoidZero provient de la couche enterprise VoidCloud prévue — l'engagement open-source est réel mais worth watching."
---

Tous les quelques années, quelqu'un dans l'écosystème JavaScript annonce un outil unifié — moins de fichiers de config, une seule commande à apprendre, moins de temps à babysitter les pipelines de build. Le résultat est généralement plus compliqué qu'annoncé. Mais Vite+, de VoidZero (fondé par Evan You, créateur de Vue.js et Vite, backed by 4.6 millions de dollars d'Accel), arrive avec des outils dont les affirmations de performance sont indépendamment vérifiées : Rolldown livre des builds de production 1.6× à 7.7× plus rapides que Vite 7, et Oxlint s'exécute 50-100× plus vite que ESLint.

Vite+ est le dernier entrant dans cette tradition, et il arrive avec plus de crédibilité que la plupart. Il vient de VoidZero, la entreprise fondée fin 2024 par Evan You, créateur de Vue.js et Vite. L'équipe inclut des contributeurs core de Vite, Vitest, Oxc, et d'anciens contributeurs de Rspack. L'entreprise a levé 4.6 millions de dollars en seed funding d'Accel, avec le soutien de figures chez Supabase, Netlify, Sentry et NuxtLabs.

Cette pedigree vaut la peine d'être prise au sérieux. Mais crédibilité ne égale pas substance, et "chaîne d'outils unifiée" a été essayée avant. Cet article est une tentative de séparer ce que Vite+ réellement est de ce qu'il prétend être, et de répondre aux questions que les posts d'annonce laissent ouvertes.

## Qu'Est-ce que Vite+ Exactement ?

Vite+ est une CLI au stade alpha qui enveloppe un ensemble de projets VoidZero existants — Vite, Vitest, Oxlint, Oxfmt, Rolldown et tsdown — sous un seul point d'entrée appelé `vp`.

Les commandes sont :

- `vp env` : gère l'installation Node.js globale et par projet
- `vp install` : délègue à un gestionnaire de paquets (défaut pnpm)
- `vp dev` : exécute le serveur de développement Vite
- `vp check` : exécute Oxlint (linter), Oxfmt (formateur) et tsgo (vérification de type) en un seul passage
- `vp test` : exécute Vitest
- `vp build` : build avec Rolldown
- `vp run` : exécute les scripts package.json via Vite Task, un nouveau runner avec caching et awareness des dépendances
- `vp pack` : package les bibliothèques en utilisant tsdown + Rolldown

L'objectif affiché est de remplacer la séquence de commandes et fichiers de config séparés qu'un projet typique requiert — `pnpm install`, `vite`, `vitest`, `eslint`, `prettier`, `tsc --noEmit`, `rollup` — avec un seul binaire et un seul fichier de configuration (`vite.config.ts`).

Sur le papier, Vite+ est une distribution polishée d'outils qui existent déjà. Il n'introduit pas de nouveaux algorithmes de parsing ou stratégies de bundlingnovel. Il enveloppe et orchestre des outils Rust existants que VoidZero a déjà open-sourcé.

## Pourquoi VoidZero Fait-il Cela ?

La logique stratégique est cohérente, même si le framing "chaîne d'outils unifiée" est en partie du marketing.

L'argument central de VoidZero est que l'écosystème JavaScript a accumulé trop de coutures entre les outils. ESLint parse votre code. Prettier le formate. tsc le type-check. Rollup le bundle. Vitest le teste. Chaque outil fait son propre parsing, sa propre traversée, sa propre transformation. L'AST est rebuild depuis la source encore et encore. Les outils sont rapides individuellement, mais le pipeline a des inefficiences structurelles qu'aucune optimisation incrémentale à l'intérieur de chaque outil ne peut corriger.

La vision VoidZero — articulée le plus clairement dans l'annonce de fondation d'Evan You — est de posséder la pile complète de la chaîne d'outils : parser (oxc-parser), transformateur (oxc-transform), linter (Oxlint), formateur (Oxfmt), bundler (Rolldown), test runner (Vitest), et dev server (Vite). Si chaque outil partage la même représentation AST et le même résolveur, vous éliminez le parsing_redondant et vous pouvez optimiser le pipeline entier comme un système plutôt que comme une collection de composants indépendants.

C'est le même argument d'intégration verticale que Bun a fait pour la couche runtime JavaScript, et que Turbopack a fait pour la couche bundler. VoidZero le fait pour l'ensemble de la chaîne d'outils frontend.

Le modèle commercial : Vite+ lui-même est sous licence MIT et fully open source. Le revenu de VoidZero vient de "VoidCloud," une couche enterprise qui presumablement ajoute scanning de sécurité, outils de conformité et infrastructure gérée — le même modèle que HashiCorp a utilisé avec Terraform, et que Redis a adopté avant sa controverse de licence.

## Quoi de Neuf Réellement vs. Reconditionné ?

Cette distinction compte.

**Rolldown** est la contribution originale la plus significative. C'est un bundler basé sur RustBuilt on Oxc, conçu pour remplacer à la fois esbuild (que Vite utilisait pour les transforms dev) et Rollup (que Vite utilisait pour les builds de production). Rolldown est genuinement une nouvelle infrastructure, et ses chiffres de performance sont réels. Sur une application React de taille moyenne (180K lignes de TypeScript, 60 routes), un développeur a mesuré les builds de production passant de 94 secondes (Rollup) à 11 secondes (Rolldown) — approximativement 8.5× plus rapide. D'autres équipes rapportent des améliorations de 4× à 20× selon la taille du projet.

**Oxc** est le moteur sous-jacent. Il fournit le parser, le transformateur, le résolveur, le linter et le formateur. Oxlint est 50–100× plus rapide que ESLint. Oxfmt est approximativement 30× plus rapide que Prettier. Ce sont des chiffres réels des propres benchmarks du projet Oxc, et ils ont été indépendamment vérifiés dans plusieurs tests communautaires.

**Vite Task** est la pièce nouvelle à l'intérieur de Vite+. C'est un task runner qui ajoute du caching automatisé à l'exécution de scripts — si les entrées n'ont pas changé, il skip la task et rejoue la sortie cached. Il comprend également le graphe de dépendances du monorepo et exécute les tasks dans le bon ordre. C'est genuinement utile pour les grands monorepos, et le comportement de caching est une amélioration de qualité de vie que la plupart des équipes ont été approximées avec Turbo ou Nx.

**tsdown** est un outil de packaging de bibliothèque qui génère des fichiers de déclaration TypeScript et bundle les bibliothèques pour npm. Il est inclus mais pas novateur.

Ce qui n'est pas nouveau : Vite, Vitest, Oxlint, Oxfmt et Rolldown existaient tous avant Vite+. Vite+ est un mécanisme de distribution, pas un projet de recherche.

## Les Affirmations de Performance : Réelles, mais Lisez les Petits Caractères

Les affirmations principales sont audacieuses :

- ~1.6× à ~7.7× plus rapides builds de production comparés à Vite 7
- ~50× à ~100× plus rapide linting que ESLint
- Jusqu'à ~30× plus rapide formatting que Prettier
- Jusqu'à 100,000 component mounts en 100ms (Vue 3.6 avec Vapor Mode)

Ces chiffres sont réels, mais ils nécessitent du contexte.

L'amélioration de vitesse de build de 1.6× à 7.7× est réelle et significative, mais la variance est grande. Les petits projets voient des gains modestes. Les codebases complexes avec beaucoup de modules voient les plus grosses victoires. Le chiffre à surveiller n'est pas le plafond — c'est le fait que les builds de production, qui ont été la partie la plus lente du cycle de développement pendant des années, deviennent 5–10× plus rapides à travers le board. L'équipe Vue a rapporté [des gains de performance similaires avec Vapor Mode](/articles/vue-35-major-improvements) — 100,000 component mounts en 100ms — underscoring à quel point les outils basés sur Rust reshapent les attentes de performance.

Les chiffres de linting et formatting sont les plus dramatiques, et ils sont aussi les moins surprenants. ESLint et Prettier sont écrits en JavaScript. Oxlint et Oxfmt sont écrits en Rust. L'écart de performance entre ces implémentations a été démontré repeatedly — Biome a montré des chiffres similaires avant qu'Oxfmt ne ship. La vraie question n'est pas si Oxlint est plus rapide (il l'est), mais s'il couvre enough de la surface ESLint et Prettier pour être un remplacement complet pour les équipes avec des configurations de règles complexes.

Les chiffres Vue 3.6 / Vapor Mode ne sont pas une fonctionnalité Vite+. Ils sont une release séparée, et ils sont encore en beta.

## Le Concept de Chaîne d'Outils Unifiée : Substance ou Sloganeering ?

"Chaîne d'outils unifiée" est une phrase qui devrait être examinée de manière critique.

Dans le cas de Vite+, cela signifie que tous les outils partagent le même fichier de configuration (`vite.config.ts`) et le même point d'entrée CLI. Les outils eux-mêmes sont intégrés au niveau configuration. Sous le capot, Oxlint, Oxfmt, Rolldown, Vitest et tsdown sont toujours des binaires séparés qui communiquent à travers des interfaces définies. Vous n'obtenez pas un seul programme Rust qui fait tout — vous obtenez un seul wrapper qui orchestre plusieurs programmes Rust.

Ce n'est pas nécessairement un problème. Une bonne composition de bons outils est plus précieuse qu'un outil monolithique qui fait tout poorly. Mais ça vaut le coup d'être clair sur ce que "unifié" signifie ici : cela signifie configuration cohérente et CLI cohérente, pas un seul programme intégré.

La partie plus substantielle de la revendication d'unification est la couche AST et résolveur partagée. Parce qu'Oxc fournit le parser et le résolveur que Rolldown, Oxlint et Oxfmt utilisent tous, le système évite de parser le même fichier source trois ou quatre fois à travers la chaîne d'outils. Dans un grand monorepo, ça s'additionne.

## Le Statut Alpha : Ce Que Alpha Signifie Réellement

Vite+ est explicitement alpha. VoidZero n'a pas tenté de cacher cela — le post d'annonce est titled "Announcing Vite+ Alpha." Mais alpha mérite un examen ici.

**Ce que alpha signifie en pratique :**

- Certaines APIs changeront avant la release stable
- La compatibilité des plugins, particulièrement pour les cas limites dans l'API de plugin Rollup, peut ne pas être pleinement testée
- Des régressions de performance sont possibles alors que la chaîne d'outils mature
- La documentation est incomplète

**La question plus significative est ce qu'alpha ne vous dit pas :** si l'équipe maintiendra le même rythme de développement une fois l'excitation initiale dissipée, si la couche enterprise (VoidCloud) créera une pression pour restreindre les fonctionnalités dans la version open-source, et si la chaîne d'outils restera sous licence MIT à mesure qu'elle grandit.

La licence MIT est un engagement réel — VoidZero a explicitement abandonné un modèle de licence payante après retour communautaire. Mais le modèle commercial de l'entreprise dépend de quelque chose au-delà des outils sous licence MIT. Ce quelque chose n'est pas encore public. Worth watching.

## Friction de Migration et d'Adoption

Pour les équipes utilisant déjà Vite, le chemin de migration est genuinement fluide :

1. Installer `vp` globalement
2. Exécuter `vp migrate` — un outil de migration automatisé
3. Remplacer les commandes individuelles (`vite`, `vitest`, `eslint`, `prettier`, `tsc`) par `vp dev`, `vp test`, `vp check`, `vp build`

La commande `vp migrate` est la pièce clé. Elle tente de lire vos configs ESLint et Prettier existantes et de les traduire en équivalents Oxlint et Oxfmt. Pour les configurations standard, ça marche. Pour les équipes avec des règles ESLint custom étendues ou des configurations de plugin Prettier complexes, un certain travail de migration manuelle est likely.

Le point de friction plus grand est philosophique : les équipes qui ont soigneusement réglé leurs ensembles de règles ESLint sur des années peuvent être réticentes à passer à Oxlint, même si Oxlint passe la plupart des règles couramment utilisées. Le projet Oxlint maintient un tableau de compatibilité montrant exactement quelles règles ESLint sont implémentées et lesquelles ne le sont pas. Avant d'adopter Vite+, ça vaut le coup de vérifier que vos règles critiques sont couvertes.

## Qui Devrait S'en Soucier Maintenant, et Qui Devrait Attendre

**Mettez à jour maintenant si :**
- Vous démarrez un nouveau projet en 2026 et voulez une config rapide et minimale
- Vous utilisez déjà Vite et voulez simplifier votre chaîne d'outils sans changer le comportement
- Vous avez un grand monorepo et voulez le caching Vite Task pour l'exécution de scripts

**Attendez si :**
- Votre projet utilise des règles ESLint custom complexes qu'Oxlint ne supporte pas encore
- Vous êtes sur une ancienne version de Vite et ne pouvez pas sacrifier de cycles pour tester la migration
- Votre équipe dépend d'intégrations d'outils spécifiques qui n'ont pas été testées avec Rolldown

## Le Cas Sceptique

L'argument le plus fort contre Vite+ est que c'est un reconditionnement d'outils existants vêtu d'une marque unifiée. Si vous utilisez déjà Vite 8 avec Rolldown, Oxlint et Vitest, Vite+ vous donne un plus beau CLI et un fichier de config. C'est de la valeur réelle — mais c'est de la valeur incrémentale sur des outils que vous pouviez déjà composer vous-mêmes.

La deuxième préoccupation est la dépendance VoidZero. Vite était à l'origine un projet communautaire sans entreprise derrière lui. C'est maintenant une entreprise avec du venture funding, une roadmap produit enterprise, et un modèle commercial qui n'a pas encore été pleinement disclosed. La licence MIT est une protection réelle. Mais l'histoire des entreprises d'infrastructure open-source est jonchée de licences qui ont changé quand le modèle commercial l'exigeait. Terraform, Redis et Elasticsearch ont tous commencé avec des licences permissives et les ont later restricted. VoidZero a été explicite sur ses intentions — mais explicite n'est pas la même chose que permanent.

La troisième préoccupation est le lock-in de l'écosystème. Vite+ ne fonctionne qu'avec les outils de la pile VoidZero. Si vous voulez utiliser Biome au lieu d'Oxlint, ou SWC au lieu de Rolldown, Vite+ n'est pas le bon choix. Le modèle "une seule vraie chaîne d'outils" est appealant jusqu'à ce que vous vouliez utiliser quelque chose en dehors.

## Le Jugement Éditorial

Vite+ n'est pas une révolution. C'est une distribution bien conçue d'outils genuinement bons qui valaient déjà le coup d'être utilisés individuellement.

La chaîne d'outils JavaScript basée sur Rust — Oxc, Rolldown et les projets construits dessus — représente un bond réel et significatif en performance sur les outils JavaScript qu'elle remplace. Ce bond n'est pas du marketing. Les benchmarks indépendants le confirment, et les développeurs utilisant ces outils en production rapportent des résultats cohérents. Cette migration Rust est visible à travers l'écosystème : [Vite 8 a adopté Rolldown](/articles/vite-8-rolldown-era) comme son bundler unifié, remplaçant à la fois ESBuild et Rollup en un seul mouvement.

Ce que Vite+ ajoute par-dessus ces outils, c'est la commodité : un binaire, un fichier de config, un modèle mental pour le cycle de développement complet. Pour les nouveaux projets et les équipes frustrées par la complexité des outils, cette commodité vaut quelque chose.

L'étiquette alpha devrait être prise au sérieux. "Alpha" signifie que l'équipe travaille encore sur les cas limites, et que l'écosystème rattrape encore. Mais le fondement — Vite 8, Rolldown, Oxc — est plus mature que ce que l'étiquette "alpha" sur Vite+ elle-même suggère.

Que Vite+ devienne le point d'entrée standard pour la chaîne d'outils VoidZero ou reste une commodité de niche dépend de si le produit enterprise VoidCloud promis crée assez de séparation entre les couches open-source et commerciales pour maintenir la confiance de la communauté. Cette histoire est encore en train d'être écrite. Séparément, [le compilateur TypeScript lui-même obtient une réécriture native](/articles/typescript-7-native-preview-go-compiler) — en Go plutôt qu'en Rust — signalant que la vague d'outils natifs s'étend au-delà du pipeline de build vers l'infrastructure du langage.

Pour l'instant : les outils sous-jacents à Vite+ valent le coup de connaître indépendamment de si vous utilisez le wrapper. Rolldown remplace Rollup. Oxlint remplace ESLint pour les équipes qui veulent de la vitesse. Le paysage des outils JavaScript se déplace vers les langages natifs, et Vite+ est l'interface la plus cohérente à ce changement jusqu'à présent.
