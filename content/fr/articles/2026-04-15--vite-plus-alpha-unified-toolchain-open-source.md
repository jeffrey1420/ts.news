---
title: "Vite+ Alpha : la toolchain unifiée de VoidZero veut remplacer tout votre écosystème JS"
description: "Vite+ Alpha sort en licence MIT, unifiant Vite, Vitest, Oxlint, Oxfmt et Rolldown dans un seul binaire vp. Gestion du runtime Node.js et du gestionnaire de paquets incluse."
image: "https://viteplus.dev/og.jpg"
date: "2026-04-15"
category: Outils
author: lschvn
readingTime: 5
tags: ["vite", "javascript", "outillage", "voidzero", "rolldown", "oxc", "release"]
tldr:
  - "Vite+ Alpha est disponible en licence MIT, combinant Vite, Vitest, Oxlint, Oxfmt, Rolldown et tsdown dans un seul binaire vp."
  - "Le nouveau runner de tâches Vite Task gère les builds monorepo avec du cache automatique — sans configuration manuelle."
  - "VoidZero a publié Vite+ en open source après avoir envisagé une licence payante, citant le feedback communautaire comme raison du passage au MIT."
faq:
  - q: "Vite+ remplace-t-il Vite ?"
    a: "Non. Vite+ est une surcouche au-dessus de Vite 8 (et Vitest, Oxlint, Oxfmt, Rolldown, tsdown). Les projets sous-jacents restent indépendants."
  - q: "Comment Vite+ diffère-t-il de l'utilisation directe de Vite 8 ?"
    a: "Vite 8 gère le serveur de dev et les builds de prod. Vite+ ajoute vp install (gestionnaire de paquets intelligent), vp check (linting + formatage + typage), vp test (Vitest), vp run (task runner avec cache), vp pack (bundling library via tsdown), et vp env (gestion de version Node.js) — le tout dans un binaire avec un seul fichier de config."
  - q: "Qu'en est-il de la licence ? C'est vraiment gratuit ?"
    a: "Oui, licence MIT. VoidZero avait initialement prévu une licence commerciale mais a changé de cap. Leur modèle repose sur Void Cloud, leur plateforme hébergée."
---

VoidZero publie aujourd'hui Vite+ Alpha, une toolchain de développement unifiée qui condense la complexité croissante de l'écosystème JavaScript en un seul binaire appelé `vp`. L'annonce couvre tout, de la gestion du runtime à la build de production, et tout est open source sous licence MIT.

## Ce que contient Vite+

Vite+ orchestre un ensemble d'outils établis écrits en Rust :

- **Vite 8** — serveur de dev et orchestrateur de build
- **Vitest 4.1** — runner de tests
- **Oxlint 1.52** — linter compatible ESLint (50 à 100× plus rapide)
- **Oxfmt beta** — formateur compatible Prettier (jusqu'à 30× plus rapide)
- **Rolldown** — bundler de prod (1,6× à 7,7× plus rapide que Vite 7)
- **tsdown** — bundler de bibliothèque TypeScript
- **Vite Task** — nouveau task runner avec cache automatique

L'idée : une seule dépendance qui remplace les gestionnaires de version Node, `pnpm`/`npm`/`yarn`, `vite`, `vitest`, `eslint`, `prettier`, et divers scripts de cache CI. Un seul `vite.config.ts` pour tout configurer.

## Les commandes vp

```bash
vp env          # Gère Node.js globalement et par projet
vp install      # Installe les dépendances, sélectionne automatiquement le bon pkg manager
vp dev          # Démarre le serveur de dev Vite avec HMR instantané
vp check        # Lance Oxlint + Oxfmt + vérification de types en une passe
vp test         # Exécute Vitest
vp build        # Build de prod via Rolldown + Oxc
vp run          # Task runner avec cache automatique
vp pack         # Bundling de bibliothèque pour npm ou binaires autonomes
vp create       # Génère de nouveaux projets ou monorepos
```

`vp check --fix` corrige linting et formatage en une commande. `vp run` imite l'interface de `pnpm run` mais ajoute du fingerprinting automatique des inputs — si rien n'a changé, il rejoue le résultat en cache instantanément.

## Vite Task : des builds monorepo plus malins

La pièce la plus innovante est Vite Task, un task runner intégré à Vite+. Il suit quels fichiers d'entrée une commande utilise réellement (via fingerprinting) et saute l'exécution si les entrées n'ont pas changé. Les scripts multi-commandes comme `tsc && vp build` sont découpés en sous-tâches indépendamment cachées.

La configuration vit dans `vite.config.ts` :

```ts
export default defineConfig({
  run: {
    tasks: {
      'generate:icons': {
        command: 'node scripts/generate-icons.js',
        cache: true,
        envs: ['ICON_THEME'],
      },
    },
  },
})
```

Première exécution : génère les icônes ; les suivantes les skippent sauf si les fichiers sources ou `ICON_THEME` changent.

## De payants à MIT

VoidZero avait prévu au départ une licence commerciale avec des fonctionnalités payantes. L'annonce Alpha fait marche arrière : *"Nous en avons eu marre de débattre sur quelles fonctionnalités devraient être payantes et comment les contrôler, car ça ne créait que de la friction dans les workflows que nos utilisateurs open source apprécient déjà."* Le modèle économique de l'entreprise repose désormais sur Void Cloud, leur plateforme hébergée.

## Les chiffres

- **78,7k** étoiles GitHub
- **69M+** téléchargements npm hebdomadaires (écosystème Vite)
- **35M+** téléchargements npm hebdomadaires (outils Rolldown + Oxc combinés)

## Premiers pas

```bash
# macOS / Linux
curl -fsSL https://vite.plus | bash

# Windows (PowerShell)
irm https://vite.plus/ps1 | iex

# Ensuite
vp help
vp create my-app
```

La migration se fait via `vp migrate`, ou en collant le prompt de migration dans votre assistant IA préféré.

C'est une alpha. La toolchain est fonctionnelle mais l'équipe précise que stabilisation et releases fréquentes suivront. Pour les développeurs fatigués de jongler avec une demi-douzaine de fichiers de config et d'outils CLI, Vite+ mérite qu'on s'y intéresse — ou qu'on l'essaie dès aujourd'hui.
