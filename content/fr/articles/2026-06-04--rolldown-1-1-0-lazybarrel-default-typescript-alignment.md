---
title: "Rolldown 1.1.0 : Lazy Barrel par Defaut et Alignement TypeScript"
description: "Rolldown 1.1.0 active experimental.lazyBarrel par defaut, apportant des gains significatifs sur les temps de build pour les projets utilisant de grands barrel files, tout en corrigeant la resolution des references tsconfig pour correspondre au comportement de TypeScript."
date: 2026-06-04
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200"
author: lschvn
tags:
  - Rolldown
  - Vite
  - bundler
  - performance
  - TypeScript
tldr:
  - experimental.lazyBarrel est maintenant true par defaut, evitand la compilation des exports barrel non utilises pour des gains de build sur les libraries comme Ant Design et MUI
  - La resolution tsconfig project-reference correspond maintenant au comportement TypeScript, corrigeant un probleme historique ou les aliases de paths ne fonctionnaient pas en monorepo
  - Rolldown 1.1.0 met a jour oxc vers v0.134.0 et ajoute l'option caseSensitive pour import.meta.glob avec des ameliorations sur les sourcemaps et le code-splitting
---

Rolldown 1.1.0 est sorti le 3 juin, avec deux changements de comportement qui comptent pour tous ceux qui buildent avec Vite ou utilisent Rolldown directement. C'est une version mineure avec des defaults cassants, donc a lire avant de mettre a jour.

## lazyBarrel Active par Defaut

Le changement principal : `experimental.lazyBarrel` est maintenant `true` par defaut. Rolldown peut maintenant detecter quand un fichier barrel re-export n'a pas de side effects, et eviter de compiler les modules re-exportes jamais importes.

Pour la plupart des projets c'est invisible — la sortie est identique. Mais pour les codebases avec de grands barrel files, particulierement les libraries de composants comme Ant Design ou `@mui/icons-material`, cela se traduit par un vrai gain en temps de build. L'optimisation se declenche automatiquement quand le barrel est reconnu comme sans side effects.

L'opt-out existe mais est marque comme temporaire :

```js
// rolldown.config.js
export default {
  experimental: { lazyBarrel: false },
}
```

L'equipe Rolldown note que ce flag sera retire dans une future version. Si vous devez le desactiver, ouvrez un issue pour que la detection sous-jacente soit corrigee a la place.

## Les References TypeScript Project Fonctionnent Correctement

Le deuxieme changement important est une correction de la facon dont Rolldown resout les configs tsconfig de type solution — le style que Vite utilise avec un `tsconfig.json` racine qui ne liste que des references, delegant les vraies options du compilateur a `tsconfig.app.json` ou `tsconfig.node.json`.

Rolldown resolvait precedemment les references de projet differemment de `tsc` :

- **Priorite de reference** : Quand la racine a des references, un projet reference qui inclut un fichier a desormais la priorite sur la racine — comme TypeScript. Auparavant la racine correspondait d'abord, surclassant les settings `paths` du projet.
- **Comportement allowJs** : Le fait qu'un fichier `.js`/`.jsx` soit inclus est desormais decide par le `allowJs` de chaque projet reference, pas celui de la racine. Ainsi `tsconfig.app.json` avec `allowJs: true` + `paths` resout maintenant les aliases pour les fichiers JS meme quand la racine ne definit pas `allowJs`.

Pour la plupart des setups Vite monorepo c'est une **correction**, pas une regression. Les aliases paths standard fonctionnent maintenant comme prevu, resolvant le bug reporte en [#8468](https://github.com/rolldown/rolldown/issues/8468).

Si vous comptiez sur l'ancien comportement "la racine gagne" : il n'y a pas de toggle pour le restaurer, car l'ancien comportement etait le bug. Le chemin recommande est d'aligner votre config avec TypeScript en declarant les paths sur le projet reference qui contient reellement les fichiers.

## Autres Changements

Rolldown 1.1.0 inclut aussi :

- `import.meta.glob` gagne une option `caseSensitive`
- Nouveaux warnings `SOURCEMAP_BROKEN` pour les hooks `renderChunk` et `transform`
- Le hint `NO_SIDE_EFFECTS` se declenche maintenant quand `@__PURE__` est incorrectement place avant des declarations de fonctions
- Le code-splitting gagne le support `group-local includeDependenciesRecursively`
- oxc mis a jour vers v0.134.0, apportant un parsing TypeScript plus strict

Rolldown alimente le bundler de Vite, donc ces ameliorations seront appliquees automatiquement des que Vite adoptera la nouvelle version de Rolldown. Surveillez une mise a jour Vite dans les prochains jours.
