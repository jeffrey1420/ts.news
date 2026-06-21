---
title: "Vue 3.5 : La version 'mineure' qui a réécrit les règles de la performance frontend"
description: "Vue 3.5 est arrivé sans changements cassants et avec un ensemble d'amélioration des internals qui devrait attirer l'attention de tout développeur, 56% d'usage mémoire en moins, hydration paresseuse, et une API props réactive stabilisée."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["frameworks", "typescript", "performance"]
readingTime: 10
image: "/images/heroes/vue-35-major-improvements.png"
tldr:
  - "Vue 3.5 apporte 56% d'usage mémoire en moins et des opérations jusqu'à 10× plus rapides sur les grands tableaux profondément réactifs grâce à une refonte du système de réactivité."
  - "La déstructuration réactive des props est stabilisée : déstructurer dans `<script setup>` préserve désormais la réactivité sans `withDefaults()`."
  - "Une nouvelle API d'hydratation paresseuse (`hydrateOnVisible`) et `useId()` pour des identifiants stables entre serveur et client résolvent des points de douleur SSR historiques."
  - "Vue 3.6 vise Vapor Mode : compilation des templates en opérations DOM directes, avec l'objectif de 100 000 montages de composants en 100 ms."
faq:
  - question: "Vue 3.5 est-il vraiment une version 'mineure' ?"
    answer: "Malgré qu'Evan You l'ait appelée version mineure, Vue 3.5 a livré une refonte complète du système de réactivité avec 56% d'usage mémoire en moins et des opérations jusqu'à 10× plus rapides sur les grands tableaux profondément réactifs. Ce sont des améliorations qui changent ce que 'grand échelle Vue' signifie en pratique."
  - question: "Qu'est-ce que Vapor Mode dans Vue 3.6 ?"
    answer: "Vapor Mode est une stratégie de compilation qui élimine complètement le DOM virtuel. Au lieu de diffing un arbre DOM virtuel à chaque mise à jour, il compile les templates Vue en opérations DOM directes, la même stratégie que Solid.js utilise. La réclamation intéressante : atteint le niveau de performance de Solid.js tout en gardant l'API Vue exacte."
  - question: "La destruction de props réactive fonctionne-t-elle maintenant sans withDefaults() ?"
    answer: "Oui. Dans Vue 3.5, destructurer les props dans <script setup> préserve maintenant la réactivité. Vous n'avez plus besoin de withDefaults() pour maintenir la réactivité lors de la destruction. Mais les computed et composables consommant des props détruites ont toujours besoin d'un getter wrapper."
---

[Vue](/articles/2026-04-16--vue-3-6-beta-vapor-mode-alien-signals) 3.5 est sorti en septembre 2024 avec ce qu'Evan You a appelé une version mineure, et un système de réactivité refactoré qui livre **56% d'usage mémoire en moins** et **des opérations jusqu'à 10× plus rapides sur les grands tableaux profondément réactifs**. La réponse de la communauté des développeurs était approximativement : *"Cela ne ressemble pas à une version mineure."*

Les chiffres confirment cet instinct. Le système de réactivité refactoré de Vue 3.5 livre des gains réels et mesurables.

## Ce qui a rendu Vue 3.5 digne de mise à niveau

### Un système de réactivité réécrit

Le changement central est une refonte interne complète de comment Vue suit l'état réactif. Le but était d'éliminer les valeurs computed stagnantes et les memory leaks qui pouvaient s'accumuler pendant le rendu côté serveur.

Le résultat était un gain net partout : usage mémoire réduit, meilleure performance sur les structures réactives profondément imbriquées, et résolution de problèmes durables avec les "computed suspendus" en contexte SSR. Critiquement, la refonte n'a eu **aucun changement de comportement**, tout ce qui marchait avant fonctionne toujours.

### Destruction de props réactive, maintenant stabilisée

L'une des fonctionnalités les plus demandées du processus RFC de l'API Composition a atterri en 3.5 avec sa stabilisation. Précédemment, destructurer les props dans `<script setup>` cassait la réactivité.

```typescript
// Avant 3.5, la seule façon fiable
const props = withDefaults(
  defineProps<{
    count?: number
    message?: string
  }>(),
  { count: 0, message: 'hello' }
)

// Après 3.5, la destruction native fonctionne réactivement
const { count = 0, message = 'hello' } = defineProps<{
  count?: number
  message?: string
}>()
```

### Hydratation paresseuse pour SSR

Le rendu côté serveur a été un point de douleur connu. Vue 3.5 introduit une API de bas niveau pour contrôler la stratégie d'hydratation :

```typescript
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  hydrate: hydrateOnVisible()
})
```

Les composants peuvent maintenant être différés jusqu'à ce qu'ils apparaissent dans le viewport.

### useId() : IDs stables entre serveur et client

`useId()` résout le problème des IDs de formulaire qui diffèrent entre le serveur et le client :

```vue
<script setup>
import { useId } from 'vue'
const id = useId()
</script>

<template>
  <form>
    <label :for="id">Email:</label>
    <input :id="id" type="email" />
  </form>
</template>
```

Le même composant rendu sur le serveur ou le client produit le même ID.

### data-allow-mismatch

`data-allow-mismatch` permet de supprimer explicitement les avertissements pour les divergences connues entre serveur et client :

```html
<span data-allow-mismatch>{{ user.localBirthday }}</span>
```

### useTemplateRef()

`useTemplateRef()` résout le problème des refs de template qui nécessitaient des noms statiques :

```vue
<script setup>
import { useTemplateRef } from 'vue'
const inputRef = useTemplateRef('input')
</script>

<template>
  <input :ref="dynamicRefName" />
</template>
```

## TypeScript : silencieusement en amélioration

Vue 3.5 a également amélioré l'inférence TypeScript pour les grands codebases.

## Vue 3.6 : Ce qui vient

La fonctionnalité phare de Vue 3.6 est **Vapor Mode**.

Vapor Mode est une stratégie de compilation qui élimine complètement le DOM virtuel. Au lieu de comparer un arbre DOM virtuel à chaque mise à jour, il compile les templates Vue en opérations DOM directes, la même stratégie que Solid.js utilise pour atteindre ses performances de référence.

La promesse d'Evan You : **Vapor Mode permet à Vue d'atteindre le niveau de performance de Solid.js tout en gardant l'API Vue exacte.** Vous ne réécrivez pas vos composants. Vous activez le mode Vapor sur des sous-arbres spécifiques, et le compilateur s'occupe du reste.

L'objectif de performance : **100 000 montages de composants en 100 ms**. Pour contexte, le DOM virtuel de Vue 3 gère environ 10 000-20 000 montages de composants dans le même laps de temps.

Vapor Mode est actuellement en bêta. L'intégration dans le dépôt principal Vue est en cours. Une version stable est attendue en 2026.

Également remarquable dans le pipeline 3.6 :
- **Alien Signals** : une réduction supplémentaire de 14% de l'usage mémoire par rapport à 3.5
- **Vue base bundle sous 10KB** : l'empreinte runtime diminue significativement

## Pourquoi cela importe

L'évolution de Vue a suivi un schéma intéressant. Chaque version a mené le framework plus loin de "outil simple pour petits projets" et plus près de "infrastructure sérieuse pour grandes applications", sans abandonner l'expérience développeur qui a rendu Vue attrayant.

Vue 3.5 est une étude de cas de cet équilibre. Les améliorations mémoire et performance sont du type qui rend les systèmes de production mesurablement meilleurs, pas cosmétiques, pas théoriques, mais réels.

La trajectoire vers 3.6 et Vapor Mode suggère que Vue ne se contente pas de vouloir suivre la concurrence. Il veut fixer la norme en matière de performance. C'est une ambition intéressante pour un framework qui s'est toujours défini par l'accessibilité et l'ergonomie plutôt que par la vitesse brute.

Que Vapor Mode tienne sa promesse, et qu'il puisse maintenir la compatibilité avec l'écosystème existant pendant la transition, déterminera si Vue 3.6 sera retenu comme un tournant ou comme une version de plus. Les premiers signaux sont prometteurs.
