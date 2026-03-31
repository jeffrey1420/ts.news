---
title: "Vue 3.5 : La Release 'Mineure' Qui a Réécrit les Règles de la Performance Frontend"
description: "Vue 3.5 est arrivé sans breaking changes et avec un ensemble d'améliorations internes qui devraient faire attention à tout développeur — 56% d'utilisation mémoire en moins, lazy hydration, et une API de props réactive stabilisée."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["vue", "javascript", "frontend", "performance", "ssr", "typescript"]
readingTime: 10
image: "https://opengraph.githubassets.com/f7b424ad79df220a2cc8c8a5cc2d08e45d1657724c9600dc28af967788f7a38a/vuejs/core"
tldr:
  - "Vue 3.5 delivers 56% d'utilisation mémoire en moins et jusqu'à 10x plus rapides operations sur de grands tableaux profondément réactifs via une refactor du système de réactivité."
  - "La déstructuration de props réactive est stabilisée — la déstructuration dans `<script setup>` préserve maintenant la réactivité sans withDefaults()."
  - "Nouvelle API de lazy hydration (hydrateOnVisible) et useId() pour des IDs stables serveur/client résolvent les points douloureux SSR de longue date."
  - "Vue 3.6 cible Vapor Mode — compilation des templates vers des opérations DOM directes avec un objectif de 100,000 component mounts en 100ms."
---

Vue 3.5 est sorti en septembre 2024 avec ce qu'Evan You a appelé une release mineure — et un système de réactivité refactoré qui livre **56% d'utilisation mémoire en moins** et **jusqu'à 10× plus rapides opérations sur de grands tableaux profondément réactifs**. La réponse de la communauté des développeurs était approximativement : *"Cela ne ressemble pas à une release mineure."*

Les chiffres confirment cet instinct. Le système de réactivité refactoré de Vue 3.5 livre **56% d'utilisation mémoire en moins** et **jusqu'à 10× plus rapides opérations sur de grands tableaux profondément réactifs**. Ce ne sont pas des gains incrémentaux — c'est le genre d'améliorations qui changent ce que "grand scale Vue" signifie en pratique.

Cet article est un regard sur ce qui a réellement changé, ce que cela signifie pour vos applications, et où Vue va ensuite.

## Ce Qui Rendait Vue 3.5 Worth Upgrading

### Un Système de Réactivité Réécrit

Le changement central est une refactor interne complète de comment Vue suit l'état réactif. L'objectif était d'éliminer les valeurs calculées stale et les memory leaks qui pouvaient s'accumuler pendant le server-side rendering — une classe de bug qui a tendance à surface en production sous charge soutenue.

Le résultat était un gain net across the board : utilisation mémoire réduite, meilleure performance sur les structures réactives profondément imbriquées, et résolution de problèmes de longue date avec les "computeds qui pendent" dans les contextes SSR. Critiquement, la refactor n'avait **aucun changement de comportement** — tout ce qui marchait avant marche toujours. C'est purement une amélioration interne.

Pour les applications qui maintiennent de grandes structures de données réactives — pensez aux dashboards avec des données en temps réel, aux formulaires complexes, ou aux surfaces d'édition collaboratives — ces gains se compoundent en interactions sensiblement plus réactives.

### La Déstructuration de Props Réactive, Maintenant Stabilisée

L'une des fonctionnalités les plus demandées du processus RFC de la Composition API a atterri en 3.5 avec sa stabilisation. Auparavant, déstructurer les props dans `<script setup>` cassait la réactivité. La solution de contournement était `withDefaults()` et le typage explicite des props, qui marchait mais semblait verbeux.

```typescript
// Avant 3.5 — la seule façon fiable
const props = withDefaults(
  defineProps<{
    count?: number
    message?: string
  }>(),
  { count: 0, message: 'hello' }
)

// Après 3.5 — la déstructuration native marche réactivement
const { count = 0, message = 'hello' } = defineProps<{
  count?: number
  message?: string
}>()
```

Le hic : les propriétés calculées et les composables qui consomment des props déstructurées ont toujours besoin d'un wrapper getter pour maintenir le suivi de réactivité. `watch(() => count)` marche ; `watch(count)` lève une erreur de compilation. C'est un garde-fou délibéré, pas un bug.

### Lazy Hydration pour SSR

La performance du server-side rendering a été un point douloureux connu dans l'écosystème Vue. Le modèle de hydration SSR traditionnel hydrate la page entière à la fois, ce qui crée une cascade de travail sur le client que les utilisateurs expérience comme un lento Time-to-Interactive.

Vue 3.5 introduit une API de plus bas niveau pour contrôler la stratégie de hydration. `defineAsyncComponent()` accepte maintenant une option `hydrate` qui vous laisse spécifier quand un composant devrait être hydraté :

```typescript
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  hydrate: hydrateOnVisible()
})
```

Les composants peuvent maintenant être différés jusqu'à ce qu'ils scrollent dans la vue, deviennent interactifs, ou correspondent à d'autres conditions. L'équipe Nuxt a immédiatement commencé à construire une syntaxe de plus haut niveau sur cette API, ce qui vous dit à quel point cette capacité était demandée.

### useId() : IDs Stables Across Server et Client

L'accessibilité des formulaires nécessite des paires `for`/`id` uniques. Dans les applications SSR, générer ceux-ci sur le serveur et les faire correspondre sur le client est une source commune de mismatches de hydration — le serveur génère un ID, le client en génère un autre.

`useId()` résout cela en générant des IDs qui sont stables à travers la frontière serveur/client :

```vue
<script setup>
import { useId } from 'vue'
const id = useId()
</script>

<template>
  <form>
    <label :for="id">Email :</label>
    <input :id="id" type="email" />
  </form>
</template>
```

Le même composant rendu sur le serveur ou le client produit le même ID. Plus d'avertissements de hydration de mismatched associations de champs de formulaire.

### data-allow-mismatch

Les applications SSR produisent fréquemment du contenu qui diffère légitimement entre les rendus serveur et client — timestamps affichés dans le fuseau horaire local de l'utilisateur, dates formatées par `Intl`, contenu qui dépend de l'état côté client disponible seulement après hydration.

Auparavant, ces différences produiraient des avertissements console qui étaient du bruit plutôt que du signal. `data-allow-mismatch` vous laisse explicitement supprimer les avertissements pour les discrepancies known, acceptables :

```html
<span data-allow-mismatch>{{ user.localBirthday }}</span>
```

Vous pouvez le scorer sur des types de mismatch spécifiques : `text`, `children`, `class`, `style`, ou `attribute`. C'est une amélioration silencieuse de qualité de vie qui rend le debugging SSR genuinement traitable dans les applications complexes.

### useTemplateRef()

Les template refs dans Vue 3 required que les attributs ref soient statiquement analysables par le compilateur — meaning ils devaient être des chaînes statiques, pas des bindings dynamiques. Si vous vouliez une ref dont le nom venait d'une variable, vous étiez malchanceux.

`useTemplateRef()` résout cela en faisant correspondre les refs par ID de chaîne runtime plutôt que par analyse au moment de la compilation :

```vue
<script setup>
import { useTemplateRef } from 'vue'

const inputRef = useTemplateRef('input')
// marche avec les noms de ref dynamiques
</script>

<template>
  <input :ref="dynamicRefName" />
</template>
```

### Autres Ajouts Notables

- **Deferred Teleport** : `<Teleport>` requérait auparavant que sa cible existe au moment du mount. Le prop `defer` en 3.5 vous laisse téléporter vers des éléments qui n'existent pas encore mais seront rendus plus tard dans le même cycle.
- **onWatcherCleanup()** : Une API importée globalement pour enregistrer des callbacks de cleanup à l'intérieur des watchers — la réponse native Vue au pattern AbortController pour annuler les opérations async stale.
- **Améliorations Custom Elements** : `useHost()`, `useShadowRoot()`, `this.$host`, l'option de mount `shadowRoot: false`, et injection de nonce pour les environnements CSP sensibles à la sécurité.

## TypeScript : Quietly Getting Better

Vue 3.5 a également amélioré l'inférence TypeScript d'une manière qui compte pour les grands codebases. Meilleure inférence pour les types de composants génériques, improved typing pour les template refs exposés, et des corrections de types utilitaires qui réduisent le besoin d'assertions de type manuelles.

Si vous avez utilisé Vue avec TypeScript et vous êtes battu avec des problèmes d'inférence dans `<script setup>`, 3.5 rendra certains de ces combats disparaissent.

## Vue 3.6 : Ce Qui Arrive

Pendant que 3.5 nettoyait le présent, Vue 3.6 vise l'avenir — et la fonctionnalité headline est **Vapor Mode**.

Vapor Mode est une stratégie de compilation qui élimine le virtual DOM entièrement. Au lieu de diffing un arbre virtual DOM à chaque mise à jour, il compile les templates Vue vers des opérations DOM directes — la même stratégie que Solid.js utilise pour atteindre sa performance topping les benchmarks.

L'affirmation compelling d'Evan You : **Vapor Mode permet à Vue d'atteindre le niveau de performance de rendu de Solid.js tout en gardant exactement la même API Vue.** Vous ne réécrivez pas vos composants. Vous opt-in des sous-arbres individuels en mode Vapor, et le compilateur gère le reste.

L'objectif de performance est frappant : **100,000 component mounts en 100ms**. Pour rappel, le virtual DOM de Vue 3 gère approximativement 10,000-20,000 component mounts dans le même intervalle de temps. Cette approche de compilation s'inscrit dans un changement plus large dans la chaîne d'outils JavaScript — voyez notre couverture de [Vite+ et la chaîne d'outils basée sur Rust](/articles/vite-plus-unified-toolchain) qui reshape comment les frameworks build et ship.

Vapor Mode est actuellement en beta (les versions 3.6.0-beta sont sur npm maintenant). L'intégration dans le dépôt Vue core est en cours. Une release stable est attendue en 2026.

Également notable dans le pipeline 3.6 :

- **Alien Signals** : Une optimisation de réactivité qui réduit l'utilisation mémoire de 14% supplémentaire comparé à 3.5, développée par Johnson Chu
- **Vue base bundle sous 10KB** : L'empreinte runtime se rétrécit significativement
- **Rolldown 1.0** : Le remplacement basé sur Rust de Rollup est maintenant en production, ce qui est le bundler sous-jacent à Vite — des builds plus rapides pour tout le monde utilisant Vite en 2026

## Pourquoi Cela Compte

L'évolution de Vue a suivi un pattern intéressant. Chaque version a emmené le framework plus loin de "outil simple pour petits projets" et plus près de "infrastructure sérieuse pour grandes applications" — sans abandonner l'expérience développeur qui a rendu Vue appealant en premier lieu.

Vue 3.5 est une étude de cas dans cet équilibre. Les améliorations de mémoire et de performance sont le genre qui rend les systèmes de production mesurablement meilleurs — pas cosmétiques, pas théoriques, mais réels. Les nouvelles APIs (lazy hydration, `useId`, `useTemplateRef`) addressent des problèmes que les développeurs ont contournés pendant des années.

La trajectoire vers 3.6 et Vapor Mode suggère que Vue n'est pas satisfait de simplement égaler la concurrence. Il veut définir la barre de performance. C'est une ambition intéressante pour un framework qui s'est toujours défini par l'accessibilité et l'ergonomie plutôt que par la vitesse brute.

Que Vapor Mode tienne sa promesse — et qu'il puisse maintenir la compatibilité avec l'écosystème existant pendant la transition — déterminera si Vue 3.6 est mémorisé comme un point de pivot ou juste une autre release. Les premiers signaux sont prometteurs.
