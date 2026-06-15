---
title: "Vite 8.1 Beta: direkte `.wasm`-Imports, `build.chunkImportMap` und `server.hmr` → `server.ws`-Umbenennung"
description: "Vite 8.1.0-beta.0 (15. Juni 2026) ist die erste Beta der 8.1-Linie. Sie liefert den WASM-ESM-Integration-Standard als direkte .wasm-Imports, eine build.chunkImportMap-Option, die Import Maps nutzt, um Chunk-Cache-Hit-Raten zu verbessern, die Integration mit Vite Task für Zero-Config-Build-Caching, Support für lightningcss-Plugin-Dependencies, und einen Breaking Rename, der alle `server.hmr`-Optionen nach `server.ws` verschiebt."
date: 2026-06-15
image: "/images/heroes/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap.png"
author: lschvn
tags: ["tooling", "javascript", "typescript"]
tldr:
  - "Vite 8.1.0-beta.0 ist am 15. Juni 2026 als erste Beta der 8.1-Linie und erstes Feature-Release auf dem [Vite-8-Stable-Branch](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks) erschienen. Es liefert direkte .wasm-Imports via den [WASM ESM Integration](https://github.com/WebAssembly/esm-integration)-Draft-Standard, eine build.chunkImportMap-Option, die Browser-Import-Maps für Chunk-Cache-Stabilität nutzt, die Integration mit Vite Task für Zero-Config-Build-Caching, Support für lightningcss-Plugin-Dependencies, und einen Breaking Rename, der alle `server.hmr`-Optionen nach `server.ws` verschiebt."
  - "Der WASM-ESM-Integration-Support schließt das langjährige vite#4551 und ersetzt die `?init` / `?url` / `?raw`-Suffixe durch ein einziges Import-Pattern, das der Bundler in sauberen ESM-Glue-Code auflöst. Vite parst das Binary, extrahiert Imports und Exports, und emittiert ein import-freundliches Modul, das sowohl in Dev- als auch in SSR-Builds funktioniert."
  - "Weitere 8.1-Änderungen, die den Alltag betreffen: `import.meta.glob` bekommt eine `caseSensitive`-Option, `html.additionalAssetSources` erlaubt es, Custom-Elemente und -Attribute als Asset-Quellen zu registrieren, Vite trackt Dependencies beim Laden der Config mit dem nativen Node-Loader, und das `bundledDev`-Flag wird in `DevEnvironment` integriert, statt eine separate Environment zu sein. Das Release bumpt außerdem Rolldown auf 1.1.1 (siehe die [Rolldown-1.1.0-Notes](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig))."
faq:
  - question: "Was ist neu in Vite 8.1 Beta?"
    answer: "Vite 8.1.0-beta.0 ist das erste Feature-Release auf dem Vite-8-Stable-Branch, veröffentlicht am 15. Juni 2026. Die Headlines sind direkte .wasm-Imports via den WASM-ESM-Integration-Standard (kein `?init`-Suffix mehr), eine `build.chunkImportMap`-Option, die Import Maps für besseres Chunk-Caching nutzt, Integration mit Vite Task für Zero-Config-Build-Caching, lightningcss-Plugin-Dependency-Support, eine `html.additionalAssetSources`-Config für Custom-Elemente, eine `caseSensitive`-Option für `import.meta.glob`, und ein Breaking Rename, der alle `server.hmr`-Optionen nach `server.ws` verschiebt. Das Release aktualisiert außerdem Rolldown auf 1.1.1."
  - question: "Wie funktionieren direkte .wasm-Imports in Vite 8.1?"
    answer: "Ihr importiert eine .wasm-Datei genauso wie jedes andere ES-Modul: `import add from './add.wasm'`. Vite parst das Binary, extrahiert seine Imports und Exports, und emittiert Glue-Code, der eine WebAssembly.Module-Instanz zurückgibt. Die alten Query-Suffixe `?init`, `?url`, und `?raw` funktionieren weiterhin, aber das Default-Import-Pattern folgt jetzt dem WASM-ESM-Integration-Draft. Das Feature basiert auf dem esm-integration-Vorschlag der WebAssembly Community Group und funktioniert in Client- wie in SSR-Builds."
  - question: "Was ändert die Umbenennung `server.hmr` zu `server.ws`?"
    answer: "Vor 8.1 lebten alle WebSocket-Optionen (host, port, clientPort, path, timeout, overlay) unter `server.hmr` in vite.config.ts. Ab 8.1 sitzen all diese Optionen unter `server.ws`, und `server.hmr` wird zu einem booleschen Toggle, ob HMR aktiviert ist. Der Fix ist mechanisch: durchsucht eure Config nach `server.hmr` und splittet in `server.ws` (für ws-Optionen) und `server.hmr` (für das boolesche Enable-Flag). Der Rename fixt das langjährige Problem, dass man ws-Optionen nicht konfigurieren konnte, wenn HMR deaktiviert war."
  - question: "Was ist build.chunkImportMap und warum ist es wichtig?"
    answer: "`build.chunkImportMap` ist eine neue Build-Option, die eine Import-Map neben dem Chunk-Graph emittiert, sodass der Browser Chunk-URLs durch die Map auflösen kann statt nur durch die Import-Statement. Da Import-Map-Einträge über Rebuilds hinweg stabil bleiben, solange sich der Chunk-Dateipfad nicht ändert, kann der Browser zuvor gefetchte Chunks über Deployments hinweg wiederverwenden. Die Option ist auf Rolldowns experimenteller chunkImportMap-Feature aufgesetzt und verlässt sich auf `import.meta.resolve` im Browser, also greift sie nicht bei älteren Browsern; das begleitende plugin-legacy deckt sie mit SystemJS ab."
  - question: "Wie integriert sich Vite 8.1 mit Vite Task?"
    answer: "Vite 8.1 zieht eine neue `@voidzero-dev/vite-task-client`-Dependency ein, die es Vite erlaubt, zur Laufzeit über dieselbe IPC mit Vite Task zu sprechen, die der Runner bereits nutzt. Vite deklariert seine Build-Inputs, Outputs und `envPrefix`-Envs über den Client, was ein No-op ist, wenn Vite außerhalb von Vite Task läuft. Das Ergebnis ist, dass `vp run vite build` korrekt cached, ohne dass envs oder inputs manuell in der Task-Config deklariert werden müssen. Die Änderung begleitet die Arbeit an der [Vite+-Unified-Toolchain](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source)."
  - question: "Ist Vite 8.1 Beta produktionstauglich?"
    answer: "Nein, das ist eine Beta. Der Rolldown-Swap in Vite 8.0 fördert weiterhin Plugin-Edge-Cases zutage, und die 8.1 Beta legt oben drauf. Nutzt 8.1.0-beta.0, um zu validieren, dass eure Plugin-Kette noch läuft, eure `server.hmr`-Config zu `server.ws` migriert ist und eure WASM-Imports weiterhin korrekt emittiert werden. Pinnt sie nicht in Produktion. Ein stabiles 8.1.0 wird in den kommenden Wochen folgen, sobald das Beta-Feedback verarbeitet ist."
---

[Vite 8.1.0-beta.0](https://github.com/vitejs/vite/releases/tag/v8.1.0-beta.0) ist am 15. Juni 2026 erschienen, das erste Feature-Release auf dem [Vite-8-Stable-Branch](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks) und die erste 8.x-Beta seit [Vite 8 Stable am 12. März](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks). Nach zehn Wochen kleiner Patch-Releases auf der v8.0-Linie nutzt das Vite-Team 8.1, um ein Bündel von Änderungen auszuliefern, die seit Monaten in PRs liegen: eine echte Implementierung des WASM-ESM-Integration-Standards für direkte `.wasm`-Imports, eine `build.chunkImportMap`-Option, die Browser-Import-Maps nutzt, um Chunk-Caching zu stabilisieren, die Integration mit dem Voidzero-Vite-Task-Runner für Zero-Config-Build-Caching, Support für lightningcss-Plugin-Dependencies, und ein lang erwarteter Breaking Rename, der alle `server.hmr`-Optionen nach `server.ws` verschiebt. Das Release bumpt außerdem Rolldown auf 1.1.1 (siehe die [Rolldown-1.1.0-Notes](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig) für den Hintergrund der 1.1-Linie).

Die Beta kommt etwas über drei Monate nach Vite 8.0 Stable, also schneller als der 5.x-auf-6.x-Übergang. Die meisten 8.1-Features sind Opt-in oder hinter neuen Config-Keys, daher ist der Upgrade von 8.0 weitgehend non-breaking, mit der einen bemerkenswerten Ausnahme des `server.hmr`-Renames, der eine Config-Bearbeitung für jedes Projekt erfordert, das aktuell WebSocket-Optionen setzt.

## Direkte `.wasm`-Imports via den WASM-ESM-Integration-Standard

Das Headline-Feature der 8.1 ist [PR #21779](https://github.com/vitejs/vite/issues/21779), die das langjährige [Issue #4551](https://github.com/vitejs/vite/issues/4551) schließt, indem sie Support für den direkten Import von `.wasm`-Dateien ohne `?init`-Suffix hinzufügt. Das Feature implementiert den [WASM-ESM-Integration](https://github.com/WebAssembly/esm-integration)-Draft der WebAssembly Community Group, derselbe Spec, der es Browsern erlauben wird, `.wasm`-Dateien nativ als ES-Module zu behandeln.

Das neue Import-Pattern sieht so aus:

```js
// Vorher (Vite 8.0 und früher)
import init from './add.wasm?init';
const instance = await init();

// Neu (Vite 8.1+)
import { add } from './add.wasm';
console.log(add(2, 3));
```

Unter der Haube parst Vite das Binary, extrahiert seine Imports und Exports, und emittiert Glue-Code, der eine sauber typisierte `WebAssembly.Module`-Instanz zurückgibt. Das Plugin deckt Dev- und SSR-Build-Modi ab, und die Query-Suffixe `?init`, `?url` und `?raw` funktionieren weiterhin, sodass bestehender Code nicht im Lockstep migrieren muss.

Der Shift ist relevant, weil jeder andere Bundler im JavaScript-Ökosystem ein nicht-standardmäßiges Import-Suffix für WASM erfinden musste. Vite 8.1 richtet den Import-Pfad am künftigen Browser-Spec aus, was bedeutet, dass dasselbe Import-Statement in einer Zukunft funktionieren wird, in der Browser WASM ESM nativ liefern und Vite wegfällt. Das Feature ist heute unabhängig vom Browser-Support, weil Vite weiterhin das Parsing und die Glue-Generierung übernimmt; der Browser-Level-Spec standardisiert nur das langfristige Ziel.

## `build.chunkImportMap` für stabiles Chunk-Caching

[PR #21580](https://github.com/vitejs/vite/issues/21580) fügt eine neue `build.chunkImportMap`-Option hinzu, implementiert auf Basis von [Rolldowns experimenteller chunkImportMap-Feature](https://rolldown.rs/reference/InputOptions.experimental#chunkimportmap). Die Motivation ist Chunk-Cache-Stabilität über Deployments hinweg.

In einem Standard-Rolldown-Build enthält jeder Chunk-Dateiname einen Content-Hash, und die Import-Statements zeigen direkt auf die gehashte URL. Wenn sich eine einzige Source-Datei ändert, bekommt jeder Chunk, der sie importiert (direkt oder transitiv), einen neuen Hash, was durch den Import-Graph kaskadiert und mehr Chunks invalidiert als unbedingt nötig. Import-Maps entkoppeln das Import-Statement von der Chunk-URL: das Statement sagt `import { x } from '/chunks/x.js'`, die Import-Map sagt, dass `/chunks/x.js` zu `/chunks/x-abc123.js` auflöst, und wenn der Chunk-Inhalt unverändert ist, bleibt die gehashte URL gleich und der Browser verwendet sie erneut.

Die Implementierung stützt sich auf `import.meta.resolve` im Browser, also funktioniert `chunkImportMap` nur auf Browsern, die das unterstützen. Das begleitende [plugin-legacy](https://github.com/vitejs/vite)-Release deckt ältere Browser mit SystemJS-basiertem Import-Map-Support ab. Zwei Caveats, die es zu beachten gilt: `experimental.renderBuiltUrl` funktioniert aktuell nicht mit dieser Option, und die Optimierung greift noch nicht für CSS und Assets, nur für JavaScript-Chunks.

Der Fix zielt auf die langjährigen Issues [#6773](https://github.com/vitejs/vite/issues/6773) und [#10636](https://github.com/vitejs/vite/issues/10636), was bedeutet, dass dies ein Feature ist, das das Vite-Team seit der v3-Ära erwägt. Es ist Opt-in und hinter Rolldowns experimentellem Flag, also lohnt es sich, auf einem echten Produktions-Build zu messen, bevor es per Default aktiviert wird.

## Vite-Task-Integration für Zero-Config-Build-Caching

[PR #22453](https://github.com/vitejs/vite/issues/22453) integriert Vite mit dem Voidzero-Vite-Task-Runner (`vp run` in [Vite+](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source)), sodass `vite build` mit null User-Konfiguration gecacht werden kann. Der Mechanismus ist eine kleine neue Dependency, `@voidzero-dev/vite-task-client`, die Vite an den relevanten Code-Pfaden aufruft, um seine Build-Inputs, Outputs und `envPrefix`-Envs zu deklarieren. Die Calls sind No-ops, wenn Vite außerhalb von Vite Task läuft, also gibt es keinen Cost für Nutzer, die nicht auf dem Runner sind.

Das Problem, das das löst, ist real und nervig: Vite Task trackt File-Reads und -Writes auf Syscall-Ebene, aber Env-Vars müssen manuell in der Task-Config deklariert werden. Die meisten Projekte nutzen die `VITE_*`-Prefix-Konvention für clientseitig sichtbare Envs, und vorher musste man zwei Configs synchron halten, den `envPrefix` in `vite.config.ts` und die `env`-Liste in der Vite-Task-Config, sonst produzierte der Cache stillschweigend falsche Bundles. Mit 8.1 reportet Vite die `VITE_*`-Envs, die es tatsächlich liest, und Vite Task fingerprintet sie automatisch. Eine Env zu vergessen produziert keinen Stale-Cache-Bug mehr.

Die Integration ist ein Baustein in der [Vite+-Unified-Toolchain](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source)-Story: sie macht die Caching-Story des Runners für Vite-Nutzer bedeutsam, ohne eine Config-Migration zu erzwingen, und sie gibt Voidzero einen Weg, schrittweise mehr Task-Level-Optimierungen zu `vite build` hinzuzufügen, ohne die Vite-Config-Oberfläche zu verändern.

## Der `server.hmr` → `server.ws`-Rename

[PR #21357](https://github.com/vitejs/vite/issues/21357) ist der Breaking Change des Releases. Vor 8.1 lebten alle WebSocket-bezogenen Optionen (host, port, clientPort, path, timeout, overlay) unter `server.hmr` in `vite.config.ts`. Das Problem dabei: man konnte die WebSocket-Settings nicht konfigurieren, wenn HMR selbst per `server.hmr: false` deaktiviert war, weil das Config-Objekt dann komplett off war.

Der Split in 8.1 ist unkompliziert:

```ts
// Vorher (Vite 8.0 und früher)
export default defineConfig({
  server: {
    hmr: {
      host: 'localhost',
      port: 24678,
      clientPort: 24678,
    },
  },
});

// Neu (Vite 8.1+)
export default defineConfig({
  server: {
    hmr: false, // boolescher Toggle, wie zuvor
    ws: {
      host: 'localhost',
      port: 24678,
      clientPort: 24678,
    },
  },
});
```

Die Migration ist mechanisch: grept eure Config nach `server.hmr` und splittet in `server.ws` (für die WebSocket-Optionen) und `server.hmr` (für das boolesche Enable-Flag). Jede Config, die nur `server.hmr: true` oder `server.hmr: false` verwendet, braucht keine Änderung. Der Rename wird seit Issue [#18489](https://github.com/vitejs/vite/issues/18489) diskutiert und landet in 8.1 als einziger Breaking Change der Linie.

## Weitere 8.1-Änderungen, die es zu kennen lohnt

Der Rest der 8.1-Beta ist ein Mix aus kleinen ergonomischen Verbesserungen und Refactors:

- **`html.additionalAssetSources`** ([#21412](https://github.com/vitejs/vite/issues/21412)) erlaubt es, Custom-HTML-Elemente und -Attribute als Asset-Quellen zu registrieren, für Dinge wie `<html-import src="...">` oder `<img data-src-dark="..." data-src-light="...">`. Ohne dies schreibt Vite URLs nur in einer fest einprogrammierten Liste von Elementen um, was die URLs in Custom-Web-Components kaputtmacht.
- **`caseSensitive`-Option für `import.meta.glob`** ([#21707](https://github.com/vitejs/vite/issues/21707)) gibt dem Glob-Pattern-Matching einen Opt-in-Case-Sensitive-Modus. Der Default bleibt Case-Insensitive, um mit der Glob-Semantik übereinzustimmen, aber auf Case-Sensitive-Filesystems (Linux, macOS) kann das Case-Insensitive-Match überraschende Ergebnisse liefern.
- **Support für lightningcss-Plugin-Dependencies** ([#21748](https://github.com/vitejs/vite/issues/21748)) sorgt dafür, dass Vite Plugin-Dependencies honoriert, die von `lightningcss` selbst deklariert werden, sodass das Hinzufügen eines lightningcss-Plugins keine manuelle Registrierung auf Vite-Seite mehr erfordert.
- **Mehrere Hosts in `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS`** ([#21501](https://github.com/vitejs/vite/issues/21501)) lässt die Env-Variable eine kommaseparierte Liste erlaubter Hosts annehmen, statt nur einen einzelnen.
- **Dependency-Tracking für natives Config-Loading** ([#22602](https://github.com/vitejs/vite/issues/22602)) trackt Dependencies der `vite.config.ts`, wenn Vite sie über den nativen Node-Loader lädt, sodass Edits an importierten Config-Files korrekt einen Dev-Server-Neustart auslösen.
- **`bundledDev` in `DevEnvironment` integriert** ([#22587](https://github.com/vitejs/vite/issues/22587)) entfernt die separate `DevEnvironment`-Subklasse für den `bundledDev`-Modus. Das Flag ist jetzt eine Option auf der Standard-`DevEnvironment`-Klasse, was Plugin-Code vereinfacht, der beide Modi handhaben muss.
- **Pnpm-Global-Virtual-Store-FS-Restriktionen** ([#22415](https://github.com/vitejs/vite/issues/22415)) wenden die korrekten FS-Restriktionen an, wenn eine Dep im gvs-Layout von pnpm installiert ist, sodass Vite korrekt unterscheidet, welche Deps vom Dev-Server gelesen werden können und welche nicht.
- **Sourcemap-Erhalt für optimierte Deps mit Follow-up-Transforms** ([#22428](https://github.com/vitejs/vite/issues/22428)) lässt die Original-Sourcemap intakt, wenn eine Dep nach dem Pre-Bundling re-transformiert wird, sodass Stack-Traces weiterhin auf die Original-Source zeigen.

## Wie man's ausprobiert

```bash
bun add -D vite@8.1.0-beta.0
# oder
npm install -D vite@8.1.0-beta.0
```

Ein paar Dinge, die ihr beim Upgrade validieren solltet:

1. Den `server.hmr`-Rename. Wenn eure Config eine WebSocket-Option setzt, verschiebt sie nach `server.ws` und behält `server.hmr` als boolesches Enable-Flag.
2. Eure WASM-Imports. Startet den Dev-Server und einen Produktions-Build, und bestätigt, dass sowohl das neue direkte Import-Pattern als auch das Legacy-`?init`-Pattern weiterhin funktionierenden Code emittieren.
3. Das Plugin-Verhalten auf Rolldown 1.1.1. Das Vite-8.0-Stable-Release förderte während des Patch-Zyklus mehrere Plugin-Edge-Cases zutage, und 8.1 erbt dieselbe Situation. Das Rolldown-Update selbst ist klein, aber der kombinierte Effekt auf Plugin-Ketten rechtfertigt einen Smoke-Test.
4. `import.meta.glob` mit `caseSensitive: true` auf Case-Sensitive-Filesystems, falls euer Projekt auf Glob-Matching für Routing oder Asset-Collection setzt.

Vite 8.1 ist eine Beta, kein stabiles Release, und das Vite-Team wird einige Wochen Beta-Feedback sammeln, bevor es 8.1.0 stable schneidet. Der Breaking Change ist klein, die neuen Features sind Opt-in, und die Abhängigkeit von Rolldown 1.1.1 ist dieselbe, die Vite 8.0.x bereits hatte, also ist das Upgrade-Risiko für Projekte auf Vite 8.0 Stable niedrig. Pinnt auf 8.0.16 für Produktion und nutzt 8.1.0-beta.0, um zu validieren, dass eure Plugin-Kette und Config den Rename überstehen. Stable 8.1 wird in den kommenden Wochen erscheinen.
