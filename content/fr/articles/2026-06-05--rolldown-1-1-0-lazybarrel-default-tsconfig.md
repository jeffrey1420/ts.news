---
title: "Rolldown 1.1.0 : lazyBarrel activé par défaut"
description: "Rolldown 1.1.0 introduit deux changements notables : experimental.lazyBarrel est maintenant activé par défaut, et la résolution des références de projet tsconfig alignée sur le comportement de TypeScript."
date: 2026-06-05
image: "https://rolldown.rs/og.jpg"
author: lschvn
tags: [rolldown, bundler, rust, javascript, vite]
tldr:
  - "experimental.lazyBarrel" est désormais true par défaut, ignorant les exports de barrel non utilisés pour des gains significatifs sur les grandes bibliothèques de composants
  - oxc_resolver passe en 11.21.0, corrigeant la résolution des références de projet tsconfig pour correspondre exactement au comportement de TypeScript
  - L'option pour désactiver lazyBarrel sera supprimée dans une future version
---

Rolldown 1.1.0 est sorti le 3 juin 2026. Malgré le标签 de version mineure, cette release apporte deux changements de comportement à connaître avant de mettre à jour.

## lazyBarrel activé par défaut

Le changement principal : `experimental.lazyBarrel` passe maintenant à `true`. Lorsqu'un module barrel (un fichier qui réexporte depuis d'autres modules) est reconnu comme sans effets secondaires, Rolldown ignore la compilation des modules réexportés qui ne sont jamais utilisés par le code consommateur.

L'impact pratique est le plus visible sur les grandes bibliothèques de composants comme Ant Design ou `@mui/icons-material`. Dans de nombreux projets, ces bibliothèques exposent des centaines d'icônes ou composants via des fichiers barrel, mais une application n'utilise qu'une poignée d'entre eux. Avec lazyBarrel activé par défaut, Rolldown peut désormais ignorer les exports non utilisés, réduisant à la fois le temps de compilation et la taille du bundle final.

Les notes de version reconnaissent un cas limites : si un barrel est incorrectement classé comme sans effets secondaires, l'optimisation pourrait supprimer un module sur lequel comptait du code pour ses effets secondaires. La solution de contournement est simple pour l'instant :

```js
export default {
  experimental: { lazyBarrel: false },
}
```

L'équipe Rolldown précise que cette option sera supprimée dans une future version. Si vous rencontrez un cas nécessitant sa désactivation, la recommandation est d'ouvrir une issue pour améliorer la logique de détection sous-jacente.

## Résolution des références de projet tsconfig alignée sur TypeScript

Le deuxième changement concerne la façon dont Rolldown résout les chemins via les fichiers tsconfig de type solution (le pattern utilisé par Vite par défaut, où `tsconfig.json` ne liste que des références et délègue les vraies options à `tsconfig.app.json` ou `tsconfig.node.json`).

La mise à niveau d'oxc_resolver de 11.19.1 vers 11.21.0 aligne le comportement de Rolldown sur celui de `tsc` :

- **Priorité des références** : quand le tsconfig racine a des références, un projet référencé qui inclut un fichier prime désormais sur la racine. Auparavant la racine était matchée en premier.

- **Comportement allowJs** : le choix d'inclure un fichier `.js`, `.jsx`, `.mjs` ou `.cjs` dépend désormais du `allowJs` du projet référencé concerné, pas de celui de la racine.

La release reconnaît que c'est un changement de comportement pour les projets qui comptaient sur l'ancienne résolution "la racine gagne". La recommandation est d'aligner votre structure tsconfig sur les attentes de TypeScript.

## Autres changements

Le changelog complet inclut également :

- `import.meta.glob` supporte désormais une option `caseSensitive`
- Un avertissement `SOURCEMAP_BROKEN` est émis pour les hooks `renderChunk` et `transform` quand les sourcemaps peuvent être invalides
- Meilleurs messages d'erreur : un tsconfig manquant émet désormais `TSCONFIG_ERROR` au lieu de `UNHANDLEABLE_ERROR`
- Le code-splitting supporte `group-local` `includeDependenciesRecursively`
- Plusieurs corrections de bugs dans l'optimiseur de chunks pour la gestion des entrées dynamiques

Rolldown 1.1.0 est disponible sur npm.

---

faq:
  - q: "Que signifie 'lazyBarrel' dans Rolldown ?"
    a: "Un 'barrel' est un fichier qui réexporte depuis plusieurs autres modules. L'optimisation lazyBarrel détecte quand un barrel n'a pas d'effets secondaires et ignore la compilation des modules réexportés non utilisés, accélérant les builds pour les grandes bibliothèques."
  - q: "Mon build ne fonctionne plus après la mise à jour de Rolldown. Que vérifier ?"
    a: "Vérifiez d'abord si vous comptez sur des effets secondaires des réexports d'un barrel. Vous pouvez temporairement désactiver avec `experimental: { lazyBarrel: false }`. Ensuite, si vous utilisez les références de projet TypeScript, vérifiez que votre structure tsconfig correspond aux attentes de TypeScript."
  - q: "Quel impact pour les utilisateurs de Vite ?"
    a: "Rolldown est le bundler qui équipe Vite 8 et supérieur. Ces changements s'appliquent automatiquement quand vous mettez à jour Rolldown ou quand Vite publie une nouvelle version de Rolldown."
