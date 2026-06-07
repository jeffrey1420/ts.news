---
title: "Nitro v3.0.260603-beta : Commandes de Framework Personnalisées et Config defaultPreset"
description: "Le dernier beta de Nitro ajoute le support des commandes preview et deploy personnalisées, introduit l'option de configuration defaultPreset, et corrige un cas limite sur le stripping des types TypeScript."
date: 2026-06-07
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Nitro", "Deno", "TypeScript", "JavaScript", "framework"]
tldr:
  - "Le beta Nitro 3 permet maintenant aux frameworks d'injecter leurs propres commandes preview et deploy, permettant une intégration plus étroite avec les outils propres à chaque plateforme."
  - "Une nouvelle option de config defaultPreset permet de personnaliser le preset de fallback quand aucun preset explicite n'est configuré, donnant plus de contrôle sur le comportement de déploiement."
  - "Un fix sur le stripping des types assure que TypeScript ne re-essaye la résolution qu'avec les extensions qu'il a réellement essayées, évitant des problèmes de build avec certaines résolutions de modules."
faq:
  - q: "Que signifie 'commandes preview/deploy de framework personnalisées' dans Nitro 3 ?"
    a: "Les plugins de framework peuvent maintenant fournir leurs propres commandes preview et deploy que Nitro invoquera dans le pipeline de build. Cela permet aux frameworks bâtis sur Nitro de brancher leurs outils spécifiques sans avoir besoin de points d'entrée CLI séparés."
  - q: "Qu'est-ce que l'option de config defaultPreset ?"
    a: "L'option defaultPreset permet de définir quel preset Nitro doit utiliser en fallback quand aucun preset explicite n'est configuré. Auparavant le fallback était codé en dur ; vous pouvez maintenant le personnaliser — utile quand votre setup a besoin d'un défaut différent du comportement out-of-box."
  - q: "Quel était le fix sur le stripping des types dans cette version ?"
    a: "Le fix garantit que quand TypeScript ré-essaie de résoudre un chemin de module avec des extensions ajoutées (.ts, .tsx), Nitro ne retire que les extensions qu'il a réellement essayées — pas toutes les extensions possibles. Cela évite que des cas légitimes de résolution de modules soient incorrectement sautés."
---
