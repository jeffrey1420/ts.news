---
title: "Nuxt 4.4: Vue Router v5, Typisierte Layout-Props und 28x Schnelleres Dev-Routing"
description: "Das neueste Nuxt-Release bringt große Verbesserungen unter der Haube: Vue Router v5, eine Custom-useFetch-Factory-API, ein Accessibility-Announcer-Composable und eine Routing-System-Migration, die Hot-Module-Replacement drastisch beschleunigt."
date: "2026-04-06"
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["nuxt", "vue", "javascript", "typescript", "router", "accessibility"]
---

Nuxt 4.4 erschien am 12. März 2026, und es ist eines der substantiellsten Point-Releases im 4.x-Zyklus. Die Headline-Additionen — Vue Router v5, Custom-`useFetch`-Factories und ein Accessibility-Announcer-Composable — stehen neben einer Routing-Engine-Migration, die die Entwicklererfahrung drastisch beschleunigt.

## Vue Router v5

Die wichtigste Abhängigkeitsaktualisierung ist Vue Router v5, das Nuxts historische Abhängigkeit von `unplugin-vue-router` entfernt. Dies ist das erste größere vue-router-Upgrade seit dem Start von Nuxt 3. Für die meisten Anwendungen sollte das Upgrade transparent sein. Wenn Sie `unplugin-vue-router` direkt in anderen Projekten verwenden, können Sie es aus Ihren Abhängigkeiten entfernen.

Typisierte Routen sollen in einem zukünftigen Release den experimentellen Status verlassen — die Grundlagen werden gerade gelegt.

## Custom `useFetch` / `useAsyncData` Factories

Dies ist die Funktion, die Modulautoren und API-reiche Anwendungen zuerst verwenden werden. `createUseFetch` ermöglicht es, einen vollständig typisierten Fetch-Client mit eigenen Standardwerten zu instanziieren:

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
// baseURL von runtimeConfig automatisch angewendet
const { data: users } = await useApiFetch('/users')
</script>
```

Die Factory-Funktion gibt Ihnen volle Kontrolle darüber, wie Optionen zusammengeführt werden — einschließlich Interceptors und zusammengesetzter Headers. Es gibt einen passenden `createUseAsyncData` für dasselbe Muster.

## Typisierte Layout-Props

Layouts können jetzt direkt von `definePageMeta` typisierte Props empfangen, ohne Workarounds wie `provide/inject`:

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

Wenn Ihr Layout Props definiert, erhalten Sie vollständigen Autocomplete und Typprüfung in `definePageMeta`.

## Barrierefreiheit: `useAnnouncer`-Composable

Nuxt 4.4 führt ein neues `useAnnouncer`-Composable und die `<NuxtAnnouncer>`-Komponente für dynamische In-Page-Ankündigungen ein — Formularübermittlungen, Ladezustände, Suchergebnisse ohne Navigation. Kombinieren Sie es mit `<NuxtRouteAnnouncer>` für seitenübergreifende Navigation:

```vue
<template>
  <NuxtAnnouncer />
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

Dies ist Teil von Nuxts breiterer Barrierefreiheits-Roadmap.

## 28x schnelleres Dev-Routing mit unrouting

Nuxt hat seine Dateisystem-Routengenerierung zu [unrouting](https://github.com/unjs/unrouting) migriert, das eine Trie-Datenstruktur für den Routenbau verwendet. Cold Start ist ungefähr gleich (~8ms vs ~6ms für große Apps), aber Hot-Module-Replacement ist dramatisch schneller: bis zu 28x schneller beim Bearbeiten bestehender Seiten, und ~15% schneller selbst beim Hinzufügen oder Entfernen von Seiten. Das System ist jetzt auch deterministisch — die Routengenerierung ist nicht mehr empfindlich gegenüber der Reihenfolge der Seitendateien.

## Intelligentere ISR/SWR-Payload-Verarbeitung

Gecachte Routen (ISR/SWR) mit Payload-Extraktion hatten ein Problem: Browser-Anfragen nach `_payload.json` lösten einen vollständigen SSR-Re-Render aus, was in serverlosen Umgebungen eine zweite Lambda-Instanz starten konnte, bevor die erste Antwort mit dem Streaming fertig war. Nuxt 4.4 behebt dies mit einem neuen `payloadExtraction: 'client'`-Modus, der die vollständige Payload in die ursprüngliche HTML-Antwort inlined und einen Runtime-In-Memory-LRU-Cache für nachfolgende `_payload.json`-Anfragen hinzufügt.

## Weitere Verbesserungen

- **`useCookie` refresh-Option** — verlängern Sie die Ablaufzeit eines Cookies, ohne seinen Wert zu ändern, nützlich für Session-Management
- **`clearNuxtState`-Reset** — setzt jetzt auf den Initialwert statt auf `undefined` zurück, in Übereinstimmung mit dem Verhalten von `useAsyncData`
- **Import-Schutz** — verbesserte Fehlermeldungen mit Lösungsvorschlägen beim Importieren geschützter Module

## FAQ

**Ist Vue Router v5 ein Breaking Change?**
Für die meisten Nuxt-Apps: nein. Das Upgrade sollte transparent sein. Die direkte Verwendung von `unplugin-vue-router` in anderen Projekten ist der betroffene Fall.

**Wann wird `payloadExtraction: 'client'` zum Standard?**
Mit `compatibilityVersion: 5` in einem zukünftigen Release. Der Runtime-LRU-Cache ist für alle Benutzer sofort aktiv.

**Wie teste ich die neuen Routing-Performance-Verbesserungen?**
Sie sind automatisch in 4.4. Bearbeiten Sie eine Seitendatei und beobachten Sie die HMR-Antwort im Terminal — die Verbesserungen sind am deutlichsten in großen Anwendungen mit vielen Routendateien.
