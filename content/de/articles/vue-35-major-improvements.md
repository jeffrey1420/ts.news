---
title: "Vue 3.5: Das 'Minor'-Release, das die Regeln der Frontend-Performance neu schrieb"
description: "Vue 3.5 arrived mit keinen breaking Changes und einer Reihe von Internals-Verbesserungen, die jeden Entwickler aufhorchen lassen sollten — 56% weniger Speichernutzung, Lazy Hydration und eine stabilisierte Reactive Props API."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["vue", "javascript", "frontend", "performance", "ssr", "typescript"]
readingTime: 10
image: "https://opengraph.githubassets.com/f7b424ad79df220a2cc8c8a5cc2d08e45d1657724c9600dc28af967788f7a38a/vuejs/core"
tldr:
  - "Vue 3.5 liefert 56% niedrigere Speichernutzung und bis zu 10x schnellere Operationen auf großen tief reaktiven Arrays via ein Reaktivitätssystem-Refactor."
  - "Reactive Props Destructuring ist stabilisiert — Destrukturierung in `<script setup>` bewahrt jetzt Reaktivität ohne withDefaults()."
  - "Neue Lazy Hydration API (hydrateOnVisible) und useId() für stabile Server/Client-IDs lösen lange bestehende SSR-Schmerzpunkte."
  - "Vue 3.6 zielt auf Vapor Mode — Kompilierung von Templates zu direkten DOM-Operationen mit einem Ziel von 100.000 Komponenten-Mounts in 100ms."
---

Vue 3.5 wurde im September 2024 veröffentlicht mit dem, was Evan You ein Minor-Release nannte — und einem refaktorierten Reaktivitätssystem, das **56% weniger Speichernutzung** und **bis zu 10× schnellere Operationen auf großen, tief reaktiven Arrays** liefert. Die Reaktion der Entwickler-Community war ungefähr: *"Das fühlt sich nicht wie ein Minor-Release an."*

Die Zahlen bestätigen dieses Instinkt. Vue 3.5's refaktoriertes Reaktivitätssystem liefert **56% niedrigere Speichernutzung** und **bis zu 10× schnellere Operationen auf großen, tief reaktiven Arrays**. Das sind keine inkrementellen Gewinne — sie sind die Art von Verbesserungen, die ändern, was "großskaliges Vue" in der Praxis bedeutet.

Dieser Artikel ist ein Blick darauf, was sich tatsächlich geändert hat, was es für Ihre Anwendungen bedeutet und wohin Vue als nächstes geht.

## Was Vue 3.5 das Upgrade wert machte

### Ein neu geschriebenes Reaktivitätssystem

Die Kernänderung ist ein vollständiger interner Refactor dessen, wie Vue reaktiven State verfolgt. Das Ziel war, stale berechnete Werte und Speicherlecks zu eliminieren, die sich während des serverseitigen Renderings ansammeln konnten — eine Klasse von Bugs, die dazu neigen, in Produktion unter anhaltender Last aufzutreten.

Das Ergebnis war ein Nettogewinn über die ganze Linie: niedrigere Speichernutzung, bessere Performance auf tief verschachtelten reaktiven Strukturen und Lösung von lange bestehenden Problemen mit "hängenden Computeds" in SSR-Kontexten. Kritisch: der Refactor hatte **keine Verhaltensänderungen** — alles, was vorher funktionierte, funktioniert noch. Es ist rein eine interne Verbesserung.

Für Anwendungen, die große reaktive Datenstrukturen pflegen — denken Sie an Dashboards mit Echtzeit-Daten, komplexe Formulare oder kollaborative Bearbeitungsoberflächen — summieren sich diese Gewinne zu messbar schnelleren Interaktionen.

### Reactive Props Destructure, jetzt stabilisiert

Eines der meistgewünschten Features aus dem Composition API RFC-Prozess landete in 3.5 mit seiner Stabilisierung. Zuvor würde Destrukturierung von Props in `<script setup>` die Reaktivität brechen. Der Workaround war `withDefaults()` und explizite Prop-Typisierung, was funktionierte, aber umständlich wirkte.

```typescript
// Vor 3.5 — die einzige zuverlässige Methode
const props = withDefaults(
  defineProps<{
    count?: number
    message?: string
  }>(),
  { count: 0, message: 'hello' }
)

// Nach 3.5 — native Destrukturierung funktioniert reaktiv
const { count = 0, message = 'hello' } = defineProps<{
  count?: number
  message?: string
}>()
```

Der Haken: berechnete Eigenschaften und Composables, die destrukturierte Props konsumieren, benötigen immer noch einen Getter-Wrapper, um Reaktivitätsverfolgung aufrechtzuerhalten. `watch(() => count)` funktioniert; `watch(count)` wirft einen Kompilierfehler. Dies ist ein bewusster Guard Rail, kein Bug.

### Lazy Hydration für SSR

Serverseitige Rendering-Performance war ein bekannter Schmerzpunkt im Vue-Ökosystem. Das traditionelle SSR-Hydrationsmodell hydratisiert die gesamte Seite auf einmal, was eine Kaskade von Arbeit auf dem Client erzeugt, die Nutzer als langsame Time-to-Interactive erleben.

Vue 3.5 führt eine API auf niedrigerer Ebene zur Steuerung der Hydrationsstrategie ein. `defineAsyncComponent()` akzeptiert jetzt eine `hydrate`-Option, die es Ihnen ermöglicht anzugeben, wann eine Komponente hydratisiert werden sollte:

```typescript
import { defineAsyncComponent, hydrateOnVisible } from 'vue'

const AsyncComp = defineAsyncComponent({
  loader: () => import('./HeavyChart.vue'),
  hydrate: hydrateOnVisible()
})
```

Komponenten können jetzt verzögert werden, bis sie beim Scrollen in den Viewport kommen, interaktiv werden oder andere Bedingungen erfüllen. Das Nuxt-Team begann sofort, höherrangige Syntax auf dieser API aufzubauen, was Ihnen sagt, wie lange diese Fähigkeit gebraucht wurde.

### useId(): Stabile IDs über Server und Client

Formular-Barrierefreiheit erfordert eindeutige `for`/`id`-Paare. In SSR-Anwendungen ist das Generieren dieser auf dem Server und das Zuordnen auf dem Client eine häufige Quelle für Hydrations-Mismatches — der Server generiert eine ID, der Client eine andere.

`useId()` löst dies, indem es IDs generiert, die über die Server/Client-Grenze hinweg stabil sind:

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

Dieselbe Komponente, auf dem Server oder Client gerendert, produziert dieselbe ID. Keine Hydrations-Warnungen mehr von mismatched Formularfeld-Zuordnungen.

### data-allow-mismatch

SSR-Anwendungen produzieren häufig Content, der legitimerweise zwischen Server- und Client-Renders differenziert — Zeitstempel, angezeigt in der lokalen Zeitzone des Benutzers, Daten formatiert von `Intl`, Content, der von clientseitigem State abhängt, der erst nach Hydration verfügbar ist.

Zuvor würden diese Differenzen Warnungen produzieren, die Rauschen statt Signal waren. `data-allow-mismatch` ermöglicht Ihnen, Warnungen für bekannte, akzeptable Diskrepanzen explizit zu unterdrücken:

```html
<span data-allow-mismatch>{{ user.localBirthday }}</span>
```

Sie können es auf spezifische Mismatch-Typen eingrenzen: `text`, `children`, `class`, `style` oder `attribute`. Dies ist eine ruhige Quality-of-Life-Verbesserung, die SSR-Debugging in komplexen Anwendungen tatsächlich tractable macht.

### useTemplateRef()

Template Refs in Vue 3 erforderten, dass Ref-Attribute statisch vom Compiler analysierbar waren — meaning they had to be static strings, not dynamic bindings. Wenn Sie einen Ref wollten, dessen Name aus einer Variablen kam, hatten Sie Pech.

`useTemplateRef()` löst dies, indem esRefs per Runtime-String-ID matching statt Compile-Time-Analyse:

```vue
<script setup>
import { useTemplateRef } from 'vue'

const inputRef = useTemplateRef('input')
// funktioniert mit dynamischen Ref-Namen
</script>

<template>
  <input :ref="dynamicRefName" />
</template>
```

### Andere bemerkenswerte Ergänzungen

- **Deferred Teleport**: `<Teleport>` required its target to exist at mount time previously. The `defer` prop in 3.5 lets you teleport to elements that don't exist yet but will be rendered later in the same cycle.
- **onWatcherCleanup()**: Eine global importierte API zum Registrieren von Cleanup-Callbacks innerhalb von Watchern — die Vue-native Antwort auf das AbortController-Pattern zum Canceln von stale async Operations.
- **Custom Elements improvements**: `useHost()`, `useShadowRoot()`, `this.$host`, `shadowRoot: false` mounting option und Nonce-Injection für sicherheitssensitive CSP-Umgebungen.

## TypeScript: Leise wird es besser

Vue 3.5 verbesserte auch die TypeScript-Inferenz auf Weisen, die für große Codebases wichtig sind. Bessere Inferenz für generische Komponententypen, verbesserte Typisierung für exponierte Template Refs und Utility-Type-Fixes, die den Bedarf an manuellen Type-Assertions reduzieren.

Wenn Sie Vue mit TypeScript verwendet haben und mit Inferenzproblemen in `<script setup>` gekämpft haben, wird 3.5 einige dieser Kämpfe verschwinden lassen.

## Vue 3.6: Was kommt

Während 3.5 die Gegenwart aufräumte, zielt Vue 3.6 auf die Zukunft — und das Kopf-feature ist **Vapor Mode**.

Vapor Mode ist eine Kompilierungsstrategie, die den virtuellen DOM komplett eliminiert. Statt einen virtuellen DOM-Baum bei jedem Update zu diffen, kompiliert es Vue-Templates zu direkten DOM-Operationen — dieselbe Strategie, die Solid.js verwendet, um seine benchmark-toppende Performance zu erreichen.

Die überzeugende Behauptung von Evan You: **Vapor Mode erlaubt Vue, Solid.js-level Rendering-Performance zu erreichen, während die exakt gleiche Vue-API behalten wird.** Sie schreiben Ihre Komponenten nicht um. Sie optieren individuelle Sub-Trees in Vapor Mode, und der Compiler übernimmt den Rest.

Das Performance-Ziel ist bemerkenswert: **100.000 Komponenten-Mounts in 100ms**. Zum Vergleich: Vue 3's virtueller DOM bewältigt ungefähr 10.000-20.000 Komponenten-Mounts in demselben Zeitrahmen. Dieser Kompilierungsansatz sitzt innerhalb einer breiteren Verschiebung in der JavaScript-Toolchain — see our coverage of [Vite+ and the Rust-based toolchain](/articles/vite-plus-unified-toolchain) that's reshaping how frameworks bauen und ship.

Vapor Mode ist derzeit in Beta (3.6.0-beta-Versionen sind jetzt auf npm). Die Integration in das Core Vue Repository ist im Gange. Eine stabile Veröffentlichung wird für 2026 erwartet.

Auch bemerkenswert in der 3.6-Pipeline:

- **Alien Signals**: Eine Reaktivitätsoptimierung, die die Speichernutzung um weitere 14% im Vergleich zu 3.5 reduziert, entwickelt von Johnson Chu
- **Vue base bundle under 10KB**: Der Runtime-Footprint schrumpft erheblich
- **Rolldown 1.0**: Der Rust-basierte Rollup-Ersatz ist jetzt in Produktion, was der Bundler ist, der Vite untermauert — schnellere Builds für jeden, der Vite in 2026 verwendet

## Warum es wichtig ist

Vue's Evolution hat einem interessanten Muster gefolgt. Jede Version hat das Framework weiter von "einfaches Tool für kleine Projekte" und näher an "seriöse Infrastruktur für große Anwendungen" gebracht — ohne die Entwicklererfahrung aufzugeben, die Vue ursprünglich ansprechend machte.

Vue 3.5 ist eine Fallstudie in dieser Balance. Die Speicher- und Performance-Verbesserungen sind die Art, die Produktionssysteme messbar besser machen — nicht kosmetisch, nicht theoretisch, sondern real. Die neuen APIs (Lazy Hydration, `useId`, `useTemplateRef`) adressieren Probleme, für die Entwickler jahrelang Workarounds gebaut haben.

Die Trajektorie hin zu 3.6 und Vapor Mode deutet darauf hin, dass Vue nicht zufrieden damit ist, die Konkurrenz zu matchen. Es will die Performance-Bar setzen. Das ist eine interessante Ambition für ein Framework, das sich immer durch Zugänglichkeit und Ergonomie definiert hat, nicht durch rohe Geschwindigkeit.

Ob Vapor Mode sein Versprechen einlöst — und ob es die Kompatibilität mit dem existierenden Ökosystem während der Transition aufrechterhalten kann — wird bestimmen, ob Vue 3.6 als Pivot-Punkt erinnert wird oder nur als ein weiteres Release. Die frühen Signale sind vielversprechend.