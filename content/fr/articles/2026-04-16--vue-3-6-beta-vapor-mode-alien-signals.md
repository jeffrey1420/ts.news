---
title: "Vue 3.6 entre en beta : Vapor Mode terminé, réactivité refactorée"
description: "Vue 3.6 beta est disponible avec l'achèvement du Vapor Mode — un chemin de compilation sans virtual DOM — et une refonte majeure du système de réactivité basé sur alien-signals, promettant des gains de performance significatifs."
image: "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?w=1200&h=630&fit=crop"
date: "2026-04-16"
category: Frameworks
author: lschvn
readingTime: 5
tags: ["Vue", "Vue 3", "Vapor Mode", "JavaScript", "performance", "réactivité", "alien-signals"]
tldr:
  - "Vue 3.6 beta est sorti avec le Vapor Mode atteignant la parité de fonctionnalités complète avec le mode virtual DOM traditionnel — une cible de compilation qui contourne le vdom entièrement pour des opérations DOM directes."
  - "Le package @vue/reactivity a été refactoré en utilisant alien-signals, une implémentation de signaux qui offre une meilleure performance et une surcharge mémoire plus faible que l'implémentation réactive précédente."
  - "Le Vapor Mode permet aux templates Vue de se compiler en JavaScript optimisé manipulant le DOM directement, similaire à ce que font Solid ou Svelte, tout en maintenant une compatibilité totale avec le modèle de composant de Vue."
faq:
  - q: "Qu'est-ce que le Vapor Mode dans Vue ?"
    a: "Le Vapor Mode est une nouvelle cible de compilation pour Vue 3 qui compile les templates vers du code de manipulation DOM directe au lieu d'opérations de virtual DOM. Il a été annoncé pour la première fois à la VueConf 2025 et est en développement depuis. Contrairement à l'approche virtual DOM (qui crée des objets vnode et les diff), le Vapor Mode compile le code template en JavaScript qui appelle directement les API DOM. Le résultat est une application plus petite et plus rapide car la couche virtual DOM est éliminée entièrement au runtime."
  - q: "En quoi le Vapor Mode diffère-t-il du SSR Nuxt/Vue ?"
    a: "SSR et Vapor Mode sont des concepts indépendants. Le SSR rend les composants Vue en HTML sur le serveur pour un premier affichage rapide. Vapor Mode concerne la stratégie de compilation côté client — il peut être utilisé avec ou sans SSR. Quand SSR et Vapor Mode sont combinés, le serveur rend le HTML une fois (comme toujours) et le client l'hydrate en utilisant les mécanismes de mise à jour DOM efficaces de Vapor au lieu du processus d'hydration vdom plus lourd."
  - q: "Qu'est-ce que alien-signals ?"
    a: "alien-signals est une implémentation de signaux haute performance que l'équipe Vue a adoptée pour @vue/reactivity dans la 3.6. Les signaux sont une primitive réactive où l'accès à un signal suit automatiquement les dépendances et déclenche les mises à jour dans les calculs dépendants. L'implémentation alien-signals privilégie la vitesse d'exécution et l'allocation mémoire minimale par rapport à certaines des qualités de débogage de l'implémentation précédente de Vue."
  - q: "Dois-je changer mon code Vue pour le Vapor Mode ?"
    a: "Le Vapor Mode est conçu pour être aussi compatible que possible avec le code de composant Vue 3 existant. L'objectif est que la plupart des composants utilisant des patterns standard de l'API Composition fonctionnent sans modification. Les composants qui s'appuient fortement sur les API internes vdom de Vue ou qui contournent le système de réactivité de Vue peuvent nécessiter des ajustements. L'équipe Vue teste contre des applications Vue réelles pour identifier les écarts de compatibilité avant la release stable."
---

Vue 3.6 beta est arrivé, et il marque un moment charnière dans l'évolution du framework. Les réalisations principales : **le Vapor Mode a atteint la parité de fonctionnalités avec le système virtual DOM**, et le package de réactivité a subi une refonte fondamentale en utilisant la bibliothèque alien-signals. Ensemble, ces changements positionnent Vue 3.6 comme l'une des releases les plus significatives de l'histoire du framework.

## Vapor Mode : Fonctionnalités Complètes

Le Vapor Mode est la réponse de Vue à une question que le monde frontend se pose depuis des années : et si on pouvait avoir l'ergonomie et le modèle de composant de Vue avec l'efficacité runtime des frameworks compilés, à manipulation DOM directe comme Solid ou Svelte ?

L'idée centrale est simple. Dans le modèle de compilation Vue 3 actuel, les templates sont compilés en fonctions de rendu qui produisent des noeuds virtual DOM. Quand l'état change, Vue crée un nouvel arbre virtual DOM et le diff contre l'arbre précédent pour déterminer l'ensemble minimal de mutations DOM réelles nécessaires. Ce diff vdom est suffisamment rapide pour la plupart des applications, mais il n'est pas gratuit — la création d'objets vnode et l'algorithme de diff consomment tous les deux du CPU et de la mémoire.

Le Vapor Mode remplace entièrement ceci. Au lieu de compiler les templates en fonctions de rendu, il les compile en JavaScript qui appelle directement les API DOM. Une boucle `v-for` devient une boucle qui appelle `document.createElement` et `appendChild` directement. Un `v-if` devient une condition qui insère ou supprime des noeuds. Le résultat est un bundle sans runtime virtual DOM et moins d'allocations au runtime.

L'équipe Vue a d'abord décrit le Vapor Mode fin 2024 et itère dessus depuis 2025. Avec la beta 3.6, l'équipe a atteint une étape : **le Vapor Mode supporte maintenant toutes les fonctionnalités stables disponibles en mode virtual DOM**. Cela signifie que les composants utilisant `v-if`, `v-for`, `v-show`, `v-model`, les slots, `Suspense` et l'API Composition devraient fonctionner en Vapor Mode sans modification.

L'exception est `Suspense` en mode Vapor-only — pas encore supporté, bien que les composants Vapor puissent être rendus à l'intérieur d'un边界 `Suspense` basé sur vdom.

### Ce qui Change en Pratique

Pour les développeurs, la transition est conçue pour être largement invisible. Vous écrivez les composants Vue de la même manière. Sous le capot, le compilateur choisit le chemin Vapor. Le bundle qui atteint le navigateur est plus petit car le runtime vdom a disparu, et le comportement runtime est plus rapide car les mises à jour DOM contournent l'étape de diffing.

Pour les auteurs de bibliothèques et les développeurs utilisant les API de bas niveau de Vue — `h()`, `createVNode`, la manipulation directe de l'instance de composant — des ajustements peuvent être nécessaires. Le Vapor Mode fonctionne au niveau de la compilation des templates, donc le code qui passe par le pipeline des fonctions de rendu continue de fonctionner normalement.

## Refonte @vue/reactivity avec alien-signals

Le système de réactivité, le moteur qui propulse `ref()`, `reactive()`, `computed()` et `watch()` de Vue, a été refactoré pour utiliser [alien-signals](https://github.com/stackblitz/alien-signals). C'est un changement fondamental plutôt qu'un changement d'API de surface — `ref()` et `reactive()` fonctionnent toujours de la même manière.

La motivation est la performance. L'implémentation de réactivité précédente, bien qu'ingénieuse, avait des frais généraux liés à la façon dont elle suivait les dépendances et planifiait les mises à jour. alien-signals est conçu avec un objectif plus étroit : exécuter les calculs réactifs aussi rapidement que possible avec un minimum d'allocation mémoire. L'équipe Vue a évalué plusieurs implémentations de signaux et a choisi alien-signals pour ses performances de benchmark et son alignement avec le modèle de planification des mises à jour de Vue.

Cette refonte affecte le package `@vue/reactivity` directement, qui est également publié séparément sur npm et utilisé dans des projets en dehors de Vue — incluant certaines intégrations Solid.js et d'autres frameworks qui ont adopté les primitives de réactivité de Vue.

## Améliorations de l'Hydration

La beta 3.6 ships également un grand lot de correctifs liés à l'hydration — plus de 30 commits dans la release beta.10 seule. L'hydration SSR de Vue 3, qui fait correspondre le HTML rendu serveur contre l'arbre de composants côté client, a été renforcée sur les cas limites impliquant :

- Les boundary d'hydration multi-racines et les composants asynchrones
- Les cibles Teleport avec des cibles manquantes ou changeantes
- L'hydration du contenu slot avec du contenu de fallback
- Les composants dynamiques rendus entre les boundaries SSR et client

Ce sont le genre de correctifs qui ne ressortent que dans des applications réelles complexes, et leur présence indique que Vue 3.6 est renforcé pour des cas d'usage en production à grande échelle.

## Vers la Release Stable

Vue 3.6 entrant en beta signifie que l'ensemble des fonctionnalités est verrouillé et que l'équipe se concentre sur la stabilisation et les correctifs de compatibilité. Sans régressions majeures découvertes pendant la période beta, la release stable devrait suivre dans quelques semaines. L'équipe Vue itère rapidement — beta.1 a été publiée le 30 mars et beta.10 a été publiée le 13 avril, indiquant un développement actif.

Pour les équipes projet utilisant Vue 3, c'est maintenant un bon moment pour tester la beta 3.6 contre votre application, particulièrement si vous utilisez des patterns de code compatibles Vapor Mode. La politique de l'équipe Vue est d'éviter les changements cassants dans les releases mineures, mais les changements internes de réactivité dans la 3.6 signifient que les cas limites dans l'utilisation personnalisée de la réactivité valent la peine d'être testés.
