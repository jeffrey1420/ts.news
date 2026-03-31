---
title: "Vite+ : Une CLI pour tout unifier — Ou juste une couche de plus de battage ?"
description: "Vite+ de VoidZero promet d'unifier runtime, gestionnaire de paquets, bundler, linter, formateur et runner de tests sous une seule commande. Nous avons lu les annonces, benchmarké les affirmations et parlé à des personnes l'utilisant en production."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["vite", "javascript", "tooling", "rolldown", "oxc", "build-tools", "open-source"]
readingTime: 14
image: "https://viteplus.dev/og.jpg"
tldr:
  - "Vite+ est une CLI alpha par VoidZero (Evan You) enveloppant Vite, Vitest, Oxlint, Oxfmt, Rolldown et tsdown sous une seule commande `vp`."
  - "Rolldown delivers 1,6x–7,7x faster production builds than Vite 7 ; Oxlint is 50–100x faster than ESLint ; Oxfmt ~30x faster than Prettier."
  - "Tous les outils partagent le même parser/résolveur Oxc, éliminant la reconstruction AST redondante à travers le pipeline."
  - "Vite+ est sous licence MIT ; les revenus de VoidZero viennent de la couche entreprise VoidCloud prévue — l'engagement open-source est réel mais mérite surveillance."
faq:
  - question: "Vite+ est-il prêt pour la production ?"
    answer: "Vite+ est explicitement alpha. Certaines API changeront avant la version stable, la compatibilité des plugins peut ne pas être entièrement testée pour les cas limites, et la documentation est incomplète. Cependant, les outils sous-jacents — Vite 8, Rolldown, Oxc — sont plus matures que la mention 'alpha' ne le suggère."
  - question: "Quelle est la différence entre Vite+ et utiliser les outils individuellement ?"
    answer: "Vite+ ajoute de la commodité : un seul binaire, un seul fichier de configuration, un seul modèle mental pour le cycle de développement complet. Pour les nouveaux projets et équipes frustrées par la complexité des outils, cette commodité a de la valeur. Mais les outils eux-mêmes valent la peine d'être connus, que vous utilisiez l'enveloppe ou non."
  - question: "VoidZero va-t-il changer la licence comme Terraform ou Redis ?"
    answer: "La licence MIT est un engagement réel — VoidZero a explicitement abandonné un modèle de licence payant après les retours de la communauté. Mais le modèle commercial dépend de VoidCloud, pas encore public. L'histoire de HashiCorp avec Terraform est值得注意, mais VoidZero a été explicite sur ses intentions."
---

Tous les quelques années, quelqu'un dans l'écosystème JavaScript annonce un outilchain unifié — moins de fichiers de config, une seule commande à apprendre. Le résultat est généralement plus compliqué qu'annoncé. Mais Vite+, de VoidZero (fondé par Evan You, créateur de Vue.js et Vite, avec 4,6M$ de Accel), arrive avec des outils dont les affirmations de performance sont indépendamment vérifiées : Rolldown livre des builds production 1,6× à 7,7× plus rapides que Vite 7, et Oxlint fonctionne 50-100× plus vite que ESLint.

## Qu'est-ce que Vite+ ?

Vite+ est une CLI au stade alpha qui enveloppe les projets VoidZero existants — Vite, Vitest, Oxlint, Oxfmt, Rolldown et tsdown — sous un seul point d'entrée appelé `vp`.

Les commandes :
- `vp env` : gère l'installation de Node.js globalement et par projet
- `vp install` : délègue à un gestionnaire de paquets (par défaut pnpm)
- `vp dev` : lance le serveur de développement Vite
- `vp check` : lance Oxlint, Oxfmt et tsgo en un seul passage
- `vp test` : lance Vitest
- `vp build` : build avec Rolldown
- `vp run` : exécute les scripts via Vite Task avec cache automatique
- `vp pack` : package les bibliothèques avec tsdown + Rolldown

L'objectif est de remplacer la séquence de commandes séparées par un seul binaire et un seul fichier de configuration (`vite.config.ts`).

## Pourquoi VoidZero fait-il cela ?

L'écosystème JavaScript a accumulé trop de coutures entre les outils. ESLint parse votre code. Prettier le formate. tsc le type-check. Rollup le bundle. Chaque outil fait son propre parsing. L'AST est reconstruit encore et encore.

La vision VoidZero est de posséder la pile complète : parser (oxc-parser), transformateur (oxc-transform), linter (Oxlint), formateur (Oxfmt), bundler (Rolldown), test runner (Vitest) et dev server (Vite). Si chaque outil partage la même représentation AST et le même résolveur, vous éliminez le parsing redondant.

Le modèle commercial : Vite+ lui-même est sous licence MIT et open source. Les revenus de VoidZero viennent de "VoidCloud", une couche entreprise — le même modèle que HashiCorp avec Terraform.

## Qu'est-ce qui est réellement nouveau vs réemballé ?

**Rolldown** est la contribution originale la plus significative. C'est un bundler Rust basé sur Oxc, conçu pour remplacer à la fois esbuild et Rollup. Sur une application React de taille moyenne (180K lignes TypeScript, 60 routes), un développeur a mesuré des builds production passant de 94 secondes (Rollup) à 11 secondes (Rolldown) — environ 8,5× plus rapide.

**Oxc** est le moteur sous-jacent. Oxlint est 50-100× plus rapide que ESLint. Oxfmt est environ 30× plus rapide que Prettier. Ces chiffres sont réels et indépendamment vérifiés.

**Vite Task** est la nouvelle pièce inside Vite+. C'est un task runner qui ajoute du cache automatique à l'exécution des scripts. Il comprend également le graphe de dépendances du monorepo et exécute les tâches dans le bon ordre.

Ce qui n'est pas nouveau : Vite, Vitest, Oxlint, Oxfmt et Rolldown existaient tous avant Vite+.

## Les affirmations de performance : réelles, mais lisez les petites lignes

Les affirmations principales :
- ~1,6× à ~7,7× plus rapides pour les builds production vs Vite 7
- ~50× à ~100× plus rapide pour le linting vs ESLint
- ~30× plus rapide pour le formatting vs Prettier

Ces chiffres sont réels mais la variance est grande. Les petits projets voient des gains modestes. Les codebases complexes voient les plus gros gains.

La migration pour les équipes utilisant déjà Vite est réellement fluide :
1. Installer `vp` globalement
2. Exécuter `vp migrate` — un outil de migration automatisé
3. Remplacer les commandes individuelles par `vp dev`, `vp test`, `vp check`, `vp build`

## Qui devrait s'en soucier maintenant, et qui devrait attendre

**Mettez à jour maintenant si :**
- Vous démarrez un nouveau projet en 2026 et voulez une config rapide et minimale
- Vous utilisez déjà Vite et voulez simplifier votre outilchain
- Vous avez un grand monorepo et voulez le cache Vite Task

**Attendez si :**
- Votre projet utilise des règles ESLint complexes personnalisées qu'Oxlint ne supporte pas encore
- Vous êtes sur une ancienne version de Vite et ne pouvez pas consacrer de cycles à tester la migration

## Le cas sceptique

Le cas le plus fort contre Vite+ est que c'est un réemballage d'outils existants. Si vous utilisez déjà Vite 8 avec Rolldown, Oxlint et Vitest, Vite+ vous donne une CLI plus belle et un fichier de config. C'est de la valeur réelle — mais incrémentale.

La dépendance VoidZero est également une préoccupation. Vite était à l'origine un projet communautaire sans entreprise derrière. C'est maintenant une entreprise avec du financement, une feuille de route produit entreprise et un modèle commercial pas entièrement disclose.

## Le verdict éditorial

Vite+ n'est pas une révolution. C'est une distribution bien conçue d'outils vraiment bons qui méritaient déjà d'être utilisés individuellement.

Les outils sous Vite+ valent la peine d'être connus, que vous utilisiez l'enveloppe ou non. Rolldown remplace Rollup. Oxlint remplace ESLint pour les équipes qui veulent de la vitesse. Le paysage des outils JavaScript se déplace vers des langages natifs, et Vite+ est l'interface la plus cohérente vers ce déplacement pour l'instant.
