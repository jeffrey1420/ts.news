---
title: "Vue 3.5: Das 'Minor'-Release, das die Regeln der Frontend-Performance neu geschrieben hat"
description: "Vue 3.5 kam ohne Breaking Changes und mit einer Reihe von internen Verbesserungen, die jeden Entwickler aufhorchen lassen sollten — 56% weniger Speicherverbrauch, Lazy Hydration und eine stabilisierte reaktive Props-API."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["vue", "javascript", "frontend", "performance", "ssr", "typescript"]
readingTime: 10
image: "https://opengraph.githubassets.com/f7b424ad79df220a2cc8c8a5cc2d08e45d1657724c9600dc28af967788f7a38a/vuejs/core"
tldr:
  - "Vue 3.5 delivers 56% lower memory usage and up to 10x faster operations on large deeply reactive arrays via a reactivity system refactor."
  - "Reactive props destructuring is stabilized — destructuring in `<script setup>` now preserves reactivity without withDefaults()."
  - "New lazy hydration API (hydrateOnVisible) and useId() for stable server/client IDs solve long-standing SSR pain points."
  - "Vue 3.6 targets Vapor Mode — compiling templates to direct DOM ops with a goal of 100,000 component mounts in 100ms."
faq:
  - question: "Ist Vue 3.5 wirklich ein 'Minor'-Release?"
    answer: "Trotz dass Evan You es als Minor-Release bezeichnete, lieferte Vue 3.5 eine vollständige Überarbeitung des Reaktivitätssystems mit 56% weniger Speicherverbrauch und bis zu 10× schnelleren Operationen auf großen, tief reaktiven Arrays. Das sind keine inkrementellen Verbesserungen."
  - question: "Was ist Vapor Mode in Vue 3.6?"
    answer: "Vapor Mode ist eine Kompilierungsstrategie, die das virtuelle DOM vollständig eliminiert. Statt bei jedem Update einen virtuellen DOM-Baum zu diffen, kompiliert es Vue-Templates in direkte DOM-Operationen — dieselbe Strategie wie Solid.js. Die interessante Behauptung: erreicht Solid.js-Level-Performance bei gleicher Vue-API."
  - question: "Funktioniert reaktives Props-Destructuring jetzt ohne withDefaults()?"
    answer: "Ja. In Vue 3.5 funktioniert Destrukturieren von Props in <script setup> jetzt reaktiv. Sie brauchen withDefaults() nicht mehr, um Reaktivität bei Destrukturierung aufrechtzuerhalten. Aber Computeds und Composables, die destrukturierte Props konsumieren, brauchen immer noch einen Getter-Wrapper."
---

Vue 3.5 erschien im September 2024 mit dem, was Evan You ein Minor-Release nannte — und einem überarbeiteten Reaktivitätssystem, das **56% weniger Speicherverbrauch** und **bis zu 10× schnellere Operationen auf großen, tief reaktiven Arrays** liefert. Die Reaktion der Entwickler-Community war ungefähr: *"Das fühlt sich nicht wie ein Minor-Release an."*

Die Zahlen bestätigen diesen Instinkt. Vue 3.5's überarbeitetes Reaktivitätssystem liefert **56% weniger Speicherverbrauch** und **bis zu 10× schnellere Operationen auf großen, tief reaktiven Arrays**. Das sind keine inkrementellen Verbesserungen — sie sind die Art von Verbesserungen, die definieren, was "großskaliges Vue" in der Praxis bedeutet.

## Was Vue 3.5 Upgrade-würdig machte

### Ein überarbeitetes Reaktivitätssystem

Die zentrale Änderung ist eine vollständige interne Überarbeitung, wie Vue reaktiven Zustand verfolgt. Das Ziel war, stale Computed-Werte und Memory Leaks zu eliminieren, die sich während Server-Side-Rendering ansammeln konnten — eine Klasse von Bugs, die unter Dauerlast in Produktion auftauchen.

Das Ergebnis war ein Nettogewinn überall: weniger Speicherverbrauch, bessere Performance bei tief verschachtelten reaktiven Strukturen, und Lösung langjähriger Probleme mit "hängenden Computeds" in SSR-Kontexten. Entscheidend: Die Überarbeitung hatte **keine Verhaltensänderungen**.

### Reaktives Props-Destructuring, jetzt stabilisiert

Eine der meistgewünschten Features aus dem Composition-API-RFC-Prozess landete in 3.5 mit ihrer Stabilisierung. Zuvor brach Destrukturieren von Props in `<script setup>` die Reaktivität.

```typescript
// Vor 3.5 — die einzige zuverlässige Methode
const props = withDefaults(
  defineProps<{
    count?: number
    message?: string
  }>(),
  { count: 0, message: 'hello' }
)

// Nach 3.5 — natives Destrukturieren funktioniert reaktiv
const { count = 0, message = 'hello' } = defineProps<{
  count?: number
  message?: string
}>()
```

### Lazy Hydration für SSR

Server-Side-Rendering-Performance war ein bekannter Schmerzpunkt im Vue-Ökosystem. Vue 3.5 führt eine Low-Level-API zur Kontrolle der Hydrationsstrategie ein. `defineAsyncComponent()` akzeptiert jetzt eine `hydrate`-Option:

```typescript
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  hydrate: hydrateOnVisible()
})
```

Komponenten können jetzt verzögert werden, bis sie in den Viewport scrollen.

### useId(): Stabile IDs über Server und Client

Form-Zugänglichkeit erfordert eindeutige `for`/`id`-Paare. In SSR-Anwendungen ist die Generierung auf dem Server und das Matching auf dem Client eine häufige Ursache für Hydration-Mismatches.

`useId()` löst das durch IDs, die stabil über die Server/Client-Grenze sind:

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

Dieselbe Komponente, auf dem Server oder Client gerendert, produziert dieselbe ID.

### data-allow-mismatch

`data-allow-mismatch` ermöglicht explizites Unterdrücken von Warnungen für bekannte, akzeptable Diskrepanzen:

```html
<span data-allow-mismatch>{{ user.localBirthday }}</span>
```

### useTemplateRef()

`useTemplateRef()` löst das Problem, dass Template-Refs statisch analysierbar sein mussten:

```vue
<script setup>
import { useTemplateRef } from 'vue'
const inputRef = useTemplateRef('input')
</script>

<template>
  <input :ref="dynamicRefName" />
</template>
```

## TypeScript: Leise wird besser

Vue 3.5 verbesserte auch die TypeScript-Inferenz auf Arten, die für große Codebases wichtig sind.

## Vue 3.6: Was kommt

Der Headline-Feature von Vue 3.6 ist **Vapor Mode**.

Vapor Mode ist eine Kompilierungsstrategie, die das virtuelle DOM vollständig eliminiert. Statt bei jedem Update einen virtuellen DOM-Baum zu diffen, kompiliert es Vue-Templates zu direkten DOM-Operationen — dieselbe Strategie, die Solid.js verwendet.

Die interessante Behauptung von Evan You: **Vapor Mode erlaubt Vue, Solid.js-Level-Rendering-Performance zu erreichen, während die exakt gleiche Vue-API behalten wird.**

Das Performance-Ziel: **100.000 Komponenten-Mounts in 100ms**. Zum Vergleich: Vue 3's virtuelles DOM bewältigt etwa 10.000-20.000 Komponenten-Mounts in derselben Zeit.

Vapor Mode ist derzeit in Beta. Die Integration in das Haupt-Vue-Repository läuft. Ein stabiles Release wird für 2026 erwartet.

Auch bemerkenswert in der 3.6-Pipeline:
- **Alien Signals**: Eine weitere 14%ige Speicherverbrauchsreduzierung gegenüber 3.5
- **Vue Base Bundle unter 10KB**: Der Runtime-Fußabdruck schrumpft erheblich

## Warum es wichtig ist

Vue's Evolution hat einem interessanten Muster gefolgt. Jede Version hat das Framework weiter von "einfaches Tool für kleine Projekte" und näher an "seriöse Infrastruktur für große Anwendungen" geführt — ohne die Developer Experience aufzugeben, die Vue attraktiv gemacht hat.

Vue 3.5 ist eine Fallstudie in dieser Balance. Die Speicher- und Performance-Verbesserungen sind die Art, die Produktionssysteme messbar besser macht — nicht kosmetisch, nicht theoretisch, sondern real.

Die Richtung zu 3.6 und Vapor Mode suggeriert, dass Vue nicht zufrieden ist, nur mit der Konkurrenz gleichzuziehen. Es will die Performance-Blattr setzen. Das ist eine interessante Ambition für ein Framework, das sich immer über Zugänglichkeit und Ergonomie definiert hat, nicht über rohe Geschwindigkeit.

Ob Vapor Mode sein Versprechen hält, wird bestimmen, ob Vue 3.6 als Wendepunkt oder als weitere Release erinnert wird. Die frühen Signale sind vielversprechend.
