---
title: "Nuxt 4.4 : Vue Router v5, Props de Layout Typées et Routage 28x Plus Rapide"
description: "La dernière mise à jour de Nuxt apporte des améliorations majeures : Vue Router v5, une API factory pour useFetch personnalisé, un composable d'accessibilité pour l'annonce, et une migration du système de routage qui accélère drastically le hot-module replacement."
date: "2026-04-06"
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["nuxt", "vue", "javascript", "typescript", "router", "accessibility"]
---

Nuxt 4.4 est sorti le 12 mars 2026, et c'est l'une des mises à jour ponctuelles les plus substantielles du cycle 4.x. Les ajouts majeurs — Vue Router v5, les factories `useFetch` personnalisées, et le composable d'annonce d'accessibilité — coexistent avec une migration du moteur de routage qui accélère drastiquement l'expérience de développement.

## Vue Router v5

La mise à niveau de dépendance la plus significative est Vue Router v5, qui supprime la dépendance historique de Nuxt sur `unplugin-vue-router`. C'est la première montée de version majeure de vue-router depuis le lancement de Nuxt 3. Pour la plupart des applications, la mise à niveau devrait être transparente. Si vous utilisiez `unplugin-vue-router` directement dans d'autres projets, vous pouvez le retirer de vos dépendances.

Les routes typées devraient sortir du statut expérimental dans une prochaine version — les fondations sont posées dès maintenant.

## Factories `useFetch` / `useAsyncData` personnalisées

C'est la fonctionnalité que les auteurs de modules et les applications riches en API vont adopter en premier. `createUseFetch` permet d'instancier un client fetch entièrement typé avec ses propres valeurs par défaut :

```ts
// composables/api.ts
export const useApiFetch = createUseFetch((currentOptions) => {
  const runtimeConfig = useRuntimeConfig()
  return {
    ...currentOptions,
    baseURL: currentOptions.baseURL ?? runtimeConfig.public.baseApiUrl,
  }
})
```

```vue
<!-- pages/dashboard.vue -->
<script setup lang="ts">
// baseURL depuis runtimeConfig appliqué automatiquement
const { data: users } = await useApiFetch('/users')
</script>
```

La fonction factory donne un contrôle total sur la façon dont les options fusionnent — y compris les intercepteurs et les headers composés. Il existe un `createUseAsyncData` équivalent pour le même schéma.

## Props de layout typées

Les layouts peuvent désormais recevoir des props typées directement depuis `definePageMeta`, sans contournements comme `provide/inject` :

```vue
<!-- pages/dashboard.vue -->
definePageMeta({
  layout: {
    name: 'panel',
    props: {
      sidebar: true,
      title: 'Dashboard',
    },
  },
})
```

```vue
<!-- layouts/panel.vue -->
<script setup lang="ts">
defineProps<{
  sidebar?: boolean
  title?: string
}>()
</script>
```

Si votre layout définit des props, vous obtenez l'autocomplete et le contrôle de type dans `definePageMeta`.

## Accessibilité : le composable `useAnnouncer`

Nuxt 4.4 introduit un nouveau composable `useAnnouncer` et le composant `<NuxtAnnouncer>` pour les annonces dynamiques in-page — soumissions de formulaire, états de chargement, résultats de recherche sans navigation. Associez-le à `<NuxtRouteAnnouncer>` pour les announcements de navigation de page :

```vue
<template>
  <NuxtAnnouncer />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

Cela fait partie de la feuille de route accessibilité plus large de Nuxt.

## Routage 28x plus rapide avec unrouting

Nuxt a migré sa génération de routes par système de fichiers vers [unrouting](https://github.com/unjs/unrouting), qui utilise une structure de données trie pour la construction des routes. Le démarrage à froid est roughly equivalent (~8ms vs ~6ms pour les grandes apps), mais le hot-module replacement est dramatically plus rapide : jusqu'à 28x plus rapide lors de l'édition de pages existantes, et ~15% plus rapide même lors de l'ajout ou suppression de pages. Le système est aussi désormais déterministe — la génération de routes n'est plus sensible à l'ordre des fichiers de pages.

## Gestion plus intelligente des payloads ISR/SWR

Les routes cachées (ISR/SWR) avec extraction de payload avaient un problème : les requêtes du navigateur pour `_payload.json` déclenchaient un re-render SSR complet, ce qui dans les environnements serverless pouvait démarrer un second lambda avant que la première réponse n'ait fini de streamer. Nuxt 4.4 corrige ceci avec un nouveau mode `payloadExtraction: 'client'` qui inline le payload complet dans la réponse HTML initiale et ajoute un cache LRU en mémoire pour les requêtes `_payload.json` suivantes.

## Autres améliorations

- **Option `refresh` pour `useCookie`** — prolonger l'expiration d'un cookie sans modifier sa valeur, utile pour la gestion de session
- **Reset de `clearNuxtState`** — réinitialise désormais à la valeur initiale au lieu de `undefined`, en alignement avec le comportement de `useAsyncData`
- **Protection des imports** — messages d'erreur améliorés avec des suggestions de correction pour les modules protégés

## FAQ

**Vue Router v5 est-il un changement cassant ?**
Pour la plupart des apps Nuxt, non. La mise à niveau devrait être transparente. L'utilisation directe de `unplugin-vue-router` dans d'autres projets est le cas affecté.

**Quand `payloadExtraction: 'client'` devient-il le défaut ?**
Avec `compatibilityVersion: 5` dans une prochaine version. Le cache LRU runtime est actif pour tous les utilisateurs immédiatement.

**Comment tester les nouvelles performances de routage ?**
C'est automatique en 4.4. Modifiez un fichier de page et observez la réponse HMR dans le terminal — les améliorations sont les plus visibles dans les grandes applications avec de nombreux fichiers de route.
