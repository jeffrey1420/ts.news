---
title: "Nitro v3.0.260603-beta : Commandes de Framework Personnalisées et Config defaultPreset"
description: "Le dernier beta de Nitro ajoute le support des commandes preview et deploy personnalisées, introduit l'option de configuration defaultPreset, et corrige un cas limite sur le stripping des types TypeScript."
date: 2026-06-07
image: "/images/heroes/2026-06-07--nitro-v3-260603-beta-custom-framework-commands.png"
author: lschvn
tags: ["runtimes", "frameworks", "typescript"]
tldr:
  - "Le beta Nitro 3 permet maintenant aux frameworks d'injecter leurs propres commandes preview et deploy, permettant une intégration plus étroite avec les outils propres à chaque plateforme."
  - "Une nouvelle option de config defaultPreset permet de personnaliser le preset de fallback quand aucun preset explicite n'est configuré, donnant plus de contrôle sur le comportement de déploiement."
  - "Un fix sur le stripping des types assure que TypeScript ne re-essaye la résolution qu'avec les extensions qu'il a réellement essayées, évitant des problèmes de build avec certaines résolutions de modules."
faq:
  - question: "Que signifie 'commandes preview/deploy de framework personnalisées' dans Nitro 3 ?"
    answer: "Les plugins de framework peuvent maintenant fournir leurs propres commandes preview et deploy que Nitro invoquera dans le pipeline de build. Cela permet aux frameworks bâtis sur Nitro de brancher leurs outils spécifiques sans avoir besoin de points d'entrée CLI séparés."
  - question: "Qu'est-ce que l'option de config defaultPreset ?"
    answer: "L'option defaultPreset permet de définir quel preset Nitro doit utiliser en fallback quand aucun preset explicite n'est configuré. Auparavant le fallback était codé en dur. Vous pouvez maintenant le personnaliser, utile quand votre setup a besoin d'un défaut différent du comportement out-of-box."
  - question: "Quel était le fix sur le stripping des types dans cette version ?"
    answer: "Le fix garantit que quand TypeScript ré-essaie de résoudre un chemin de module avec des extensions ajoutées (.ts, .tsx), Nitro ne retire que les extensions qu'il a réellement essayées, pas toutes les extensions possibles. Cela évite que des cas légitimes de résolution de modules soient incorrectement sautés."
---

Le train des betas Nitro v3 continue d'avancer. Le build `3.0.260603-beta`, le versioning daté signifie 3 juin 2026, est une petite release, mais deux de ses changements comptent pour quiconque construit un framework au-dessus de Nitro, ce qui depuis [l'annonce de la beta v3](https://nitro.build/blog/v3-beta) inclut TanStack Start et la prochaine majeure de Nuxt.

## Les frameworks possèdent désormais `preview` et `deploy`

Nitro a toujours géré le build ; ce qui venait après restait l'affaire de la plateforme. Cette release permet aux plugins de framework d'enregistrer leurs propres commandes de preview et de déploiement, pour intégrer l'outillage spécifique à une plateforme dans le pipeline que les utilisateurs exécutent déjà.

Concrètement : si votre framework cible Cloudflare avec un workflow particulier, il peut maintenant l'exposer comme chemin canonique de `preview`/`deploy`, plutôt que de documenter une CLI séparée. Moins de « lancez notre autre outil après le build », plus un seul pipeline qui fait ce qu'il faut selon la plateforme.

## `defaultPreset` : contrôler le fallback

Quand aucun preset de déploiement n'est configuré ni détecté, Nitro retombait sur un défaut codé en dur. La nouvelle option `defaultPreset` rend ce fallback explicite :

```ts
export default defineNitroConfig({
  defaultPreset: "cloudflare_module",
});
```

C'est surtout utile dans les monorepos et les presets de framework, où « aucun preset précisé » doit signifier quelque chose de spécifique à votre setup, pas le défaut du moment de Nitro.

## Un cas limite de type-stripping corrigé

La release corrige aussi un bug subtil de résolution de modules : quand la résolution réessaie un chemin avec des extensions TypeScript ajoutées (`.ts`, `.tsx`), Nitro ne retire désormais que les extensions réellement réessayées, et plus toutes les extensions possibles. Cas limite, certes, mais du genre à produire un « module not found » incompréhensible dans exactement un fichier d'un gros projet.

## Faut-il mettre à jour ?

Si vous êtes déjà sur la beta v3, oui, c'est une mise à jour incrémentale sans risque via `npm i nitro@beta`. Si vous êtes auteur de framework, les hooks de commandes personnalisées sont le vrai titre : c'est la première pièce du « bring your own framework » de la v3 qui dépasse le build pour toucher au déploiement. Pour tous les autres, c'est un bon rappel que la v3 itère vite, betas hebdomadaires datées, avant [Nuxt 5 qui arrivera sur Nitro v3 et H3 v2](/articles/2026-06-03--nitro-v3-0-260522-beta-tracing-vfs-vercel-queues).
