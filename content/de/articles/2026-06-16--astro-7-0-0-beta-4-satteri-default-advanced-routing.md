---
title: "Astro 7.0.0-beta.4 macht Sätteri zum Standard-Markdown-Prozessor und führt erweitertes Routing, benutzerdefinierten Logger und gestreamtes Rendering als stabil"
description: "Astro 7.0.0-beta.4 (15. Juni 2026) aktiviert die Rust-basierte Sätteri-Markdown-Pipeline standardmäßig, entfernt das experimentelle Flag von erweitertem Routing, benutzerdefiniertem Logger und der neuen Rendering-Engine, löscht die veralteten CLI-Befehle astro db/login/logout/link/init und übernimmt den in alpha.2 eingeführten Dev-Server-Hintergrundmodus als Standard in Agentenkontexten."
date: 2026-06-16
image: "/images/heroes/2026-06-16--astro-7-0-0-beta-4-satteri-default-advanced-routing.png"
author: lschvn
tags: ["frameworks", "tooling", "performance"]
tldr:
  - "Astro 7.0.0-beta.4 wurde am 15. Juni 2026 veröffentlicht, die vierte Beta der 7.0-Linie und die erste, in der die bisher optionale [Rust-basierte Sätteri-Markdown-Pipeline](/articles/2026-06-01-astro-6-4-rust-satteri-markdown-optimizer) der Standard-`.md`-Prozessor ist. `@astrojs/markdown-remark` wird nicht mehr standardmäßig installiert; Projekte, die den unified/remark/rehype-Stack benötigen, müssen ihn jetzt explizit hinzufügen."
  - "Die 7.0-Linie stabilisiert außerdem drei Funktionen, die in 6.x hinter experimentellen Flags standen: erweitertes Routing (mit erstklassiger Hono-Unterstützung und einem neuen Standard-Entry-Point `src/fetch.ts`), den benutzerdefinierten Logger (mit eingebauten Handlern `json`, `node` und `console`) sowie die Streaming-Rendering-Engine, die `experimental.queuedRendering` ersetzt. `fetchFile` wird zur Top-Level-Konfigurationsoption."
  - "Weitere 7.0-Änderungen mit Auswirkungen auf den Arbeitsalltag: Die CLI-Befehle `astro db`, `astro login`, `astro logout`, `astro link` und `astro init` werden entfernt, die veralteten Event-Konstanten aus `astro:transitions` und der Helfer `createAnimationScope` verschwinden, und der in alpha.2 eingeführte `astro dev`-Hintergrundmodus wird in Agentenkontexten zum Standard. Die 7.0-Linie ist zudem die erste, die Vite 8 offiziell unterstützt (siehe die [Vite-8.1-Beta-Notizen](/articles/2026-06-15-vite-8-1-beta-wasm-esm-chunk-importmap))."
faq:
  - question: "Was ist neu in Astro 7.0.0-beta.4?"
    answer: "Astro 7.0.0-beta.4 (15. Juni 2026) ist die vierte Beta der 7.0-Linie. Die wichtigste Änderung ist, dass Sätteri, der native Rust-Markdown-Prozessor, der in 6.4 noch optional war, nun der Standard-`.md`-Prozessor ist. Die 7.0-Linie stabilisiert darüber hinaus erweitertes Routing, den benutzerdefinierten Logger und die neue Streaming-Rendering-Engine, entfernt mehrere veraltete CLI-Befehle und Übergangs-Event-Konstanten und macht den in 7.0.0-alpha.2 eingeführten `astro dev --background`-Modus in KI-Agentenkontexten zum Standard."
  - question: "Was ist Sätteri und warum wird es in Astro 7 zum Standard?"
    answer: "Sätteri ist Astros nativer Rust-Markdown-Prozessor, der als `@astrojs/markdown-satteri` ausgeliefert wird. Er wurde in [Astro 6.4](/articles/2026-06-01-astro-6-4-rust-satteri-markdown-optimizer) als optionale Alternative zur unified/remark/rehype-Pipeline eingeführt, mit messbaren Build-Zeitgewinnen von etwa 50 bis 80 Prozent bei inhaltslastigen Sites. In 7.0.0-beta.4 wird er zum Standard für jedes neue und jedes aktualisierte Astro-Projekt. Die Legacy-Pipeline bleibt verfügbar, indem man `@astrojs/markdown-remark` installiert und `markdown.processor: unified()` in `astro.config.mjs` setzt."
  - question: "Was ändert sich, wenn ich in Astro 6 das experimentelle advanced-routing-Flag verwendet habe?"
    answer: "Die in 6.3 hinter `experimental.advancedRouting` eingeführte Advanced-Routing-Funktion ist in 7.0 stabil und standardmäßig aktiv. Der Standard-Entry-Point ist nun `src/fetch.ts` statt `src/app.ts`, und die Option `fetchFile` ist eine Top-Level-Konfigurationsoption, nicht mehr unter `experimental` verschachtelt. Die Migration besteht darin, das `experimental.advancedRouting`-Flag aus der Konfiguration zu entfernen und entweder den Entry-Point in `src/fetch.ts` umzubenennen oder `fetchFile: 'app.ts'` zu setzen, um den alten Pfad beizubehalten. Auch die Integration mit Hono (über `astro/hono`) wird stabilisiert, und `getFetchState()` wird als öffentliche API für Hono-Middleware freigegeben."
  - question: "Werden die Befehle `astro db`, `astro login` und `astro init` entfernt?"
    answer: "Ja. Die CLI-Befehle `astro db`, `astro login`, `astro logout`, `astro link` und `astro init` werden in 7.0 entfernt. Das Paket `@astrojs/db` ist veraltet; das Team empfiehlt, stattdessen direkt einen Datenbank-Client (Drizzle, Kysely usw.) zu verwenden. Der Befehl `astro init` war bereits weitgehend durch `npm create astro@latest` ersetzt worden; die anderen vier sind Produkte, in die Astro nicht mehr investiert."
  - question: "Unterstützt Astro 7 Vite 8?"
    answer: "Ja. Astro 7.0 ist die erste Hauptlinie, die Vite 8 offiziell unterstützt. Der Patch 7.0.0-alpha.1 entfernt ausdrücklich die Warnung, dass Astro Vite v8 nicht unterstützt, und die übrigen 7.0-Betas werden gegen den stabilen Vite-8-Branch gebaut und getestet. Die kürzlich erschienene [Vite-8.1-Beta](/articles/2026-06-15-vite-8-1-beta-wasm-esm-chunk-importmap) behandelt die neuen Funktionen der Vite-Linie."
  - question: "Ist Astro 7.0.0-beta.4 produktionstauglich?"
    answer: "Nein. Dies ist eine Beta der 7.0-Linie, mit den üblichen Einschränkungen: APIs können sich bis zur stabilen 7.0.0 noch ändern, mehrere experimentelle Funktionen werden gerade stabilisiert, und Sätteri als Standard ist eine Verhaltensänderung für jedes Projekt, das sich auf die implizite unified-Pipeline verlassen hat. Verwenden Sie 7.0.0-beta.4, um zu validieren, dass Ihre Markdown-Pipeline weiterhin funktioniert, dass Ihre `experimental.advancedRouting`-Konfiguration auf die neue Top-Level-Option `fetchFile` migriert wurde und dass Sie nicht von den entfernten CLI-Befehlen abhängen. Pinnen Sie sie nicht in der Produktion."
---

[Astro 7.0.0-beta.4](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.4) wurde am 15. Juni 2026 veröffentlicht, die vierte Beta der 7.0-Linie und die erste, in der die bisher optionale Rust-basierte Markdown-Pipeline [Sätteri](https://github.com/withastro/astro/pull/16966) zum Standard wird. Das Release baut auf zwei vorherigen Betas auf (7.0.0-beta.3 am 9. Juni und 7.0.0-beta.2 Anfang Juni), die den Großteil der Arbeit zur Stabilisierung von erweitertem Routing, benutzerdefiniertem Logger und der neuen Streaming-Rendering-Engine geleistet haben, sowie auf zwei Alphas (7.0.0-alpha.2 und 7.0.0-alpha.0), die das Vite-8-Upgrade und den `astro dev --background`-Modus für KI-Code-Agenten brachten. Die 7.0-Linie folgt auf den [Astro-6-Launch im März](/articles/2026-03-30-astro-6-rust-compiler-cloudflare) und auf [Astro 6.4 mit Sätteri als Opt-in](/articles/2026-06-01-astro-6-4-rust-satteri-markdown-optimizer); der rote Faden von 7.0 ist, dass fast alle experimentellen Funktionen, die 6.x hinter einem Flag ausgeliefert hat, nun graduieren, der Standard-Markdown-Prozessor nun in Rust läuft und eine Reihe lange veralteter APIs endlich gelöscht werden.

## Sätteri wird zum Standard-Markdown-Prozessor

Das Ereignis von 7.0.0-beta.4 ist [PR #16966](https://github.com/withastro/astro/pull/16966), die den Standard-`.md`-Prozessor von der Legacy-unified/remark/rehype-Pipeline auf Sätteri umstellt, den nativen Rust-Markdown-Prozessor, den Astro 6.4 als Opt-in ausgeliefert hat. Die Motivation ist Build-Performance: der [Astro-6.4-Launch-Post](https://astro.build/blog/astro-6-4/) maß Gewinne von etwa 50 bis 80 Prozent bei den Build-Zeiten inhaltslastiger Sites, und das Team behandelt Sätteri als die Zukunft von Astro-Markdown, seit der Rust-Markdown-Optimizer eingeführt wurde. Beta.4 macht diese Zukunft zum Standard für jedes neue und jedes aktualisierte Astro-Projekt.

Die Änderung ist mechanisch für Projekte, die `markdown.remarkPlugins` oder `markdown.rehypePlugins` nicht anfassen. Die in Astro 6.4 eingeführten Deprecation-Warnungen für diese Konfigurationsschlüssel werden nun standardmäßig ausgelöst; die Schlüssel funktionieren weiterhin, sofern `@astrojs/markdown-remark` installiert ist und `markdown.processor` auf `unified()` gesetzt ist:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  markdown: {
    processor: unified(),
  },
});
```

Wenn das Projekt Markdown nur über die Defaults verwendet (keine remark/rehype-Plugins, kein GFM, keine Syntaxhervorhebung über unified), ist das Upgrade ein No-op. Sätteri ist API-kompatibel mit dem Standardumfang der Markdown-Funktionen, den Astros `.md`-Dateien out of the box nutzen, und Astro 6.4 hat in Sätteri bereits Syntaxhervorhebung über Shiki und GFM-Tabellen unterstützt. Die wesentlichen Migrationskosten betreffen Projekte, die auf `remark-mermaid`, `rehype-slug` oder andere benutzerdefinierte Plugins gesetzt haben; diese müssen entweder auf Sätteris Erweiterungs-API portiert werden oder auf der Legacy-Pipeline bleiben.

Ein weiterer praktischer Effekt ist die Bundle-Größe: `@astrojs/markdown-remark` und sein transitive unified-Ökosystem werden nicht mehr standardmäßig installiert, was sich in einem kleineren `node_modules` und einem schnelleren Cold-Install für Projekte niederschlägt, die darauf verzichten können. Die Deprecation-Warnung wird zur harten Anforderung: setzt eine Konfiguration `markdown.remarkPlugins` oder `markdown.rehypePlugins`, weigert sich Astro 7.0 zu starten, sofern `@astrojs/markdown-remark` nicht als direkte Abhängigkeit vorhanden ist.

## Erweitertes Routing wird stabil, `fetchFile` rückt auf die Top-Level-Ebene

Die größte Funktion, die 7.0 aus dem experimentellen Status befördert, ist das [erweiterte Routing](https://github.com/withastro/astro/pull/16877), eingeführt hinter `experimental.advancedRouting` in Astro 6.3. Die Funktion gibt die volle Kontrolle darüber, wie Anfragen durch eine Astro-Anwendung fließen, mit erstklassiger Unterstützung für Nicht-Astro-Router wie Hono. Die 7.0-Beförderung macht es zum Standardverhalten, entfernt das experimentelle Flag und verschiebt die Entry-Point-Konfiguration auf eine neue Top-Level-Option `fetchFile`.

Der Standard-Entry-Point ist nun `src/fetch.ts` statt `src/app.ts`. Projekte, die den Entry-Point nicht anpassen, müssen nichts tun; die neue Datei wird beim ersten Lauf automatisch erzeugt. Projekte, die ein benutzerdefiniertes `src/app.ts` geschrieben haben und sich auf das experimentelle Flag verlassen, haben zwei Optionen:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';

export default defineConfig({
  fetchFile: 'app.ts', // alten Entry-Point-Pfad beibehalten
});
```

Oder, wenn das Projekt frisch auf 7.0 startet, benennt man den Entry-Point in `src/fetch.ts` um und entfernt das `experimental.advancedRouting`-Flag vollständig. `fetchFile: null` deaktiviert den Entry-Point für Projekte, die `src/fetch.ts` als eigene Datei behalten wollen.

Die Beförderung stabilisiert auch die `astro/hono`-Integration. `getFetchState()` ist nun eine öffentliche API von `astro/hono`, abrufbar aus einem Hono-Kontextobjekt, sodass Drittanbieter-Pakete Hono-Middleware bauen können, die mit Astros Per-Request-State interagiert. Die Integration gibt `astro/hono` die gleiche Erweiterbarkeit, die `astro/fetch` seit 6.0 hat.

## Benutzerdefinierter Logger und neue Streaming-Rendering-Engine werden stabil

Zwei weitere experimentelle Funktionen der 6.x werden in 7.0 befördert. [PR #16745](https://github.com/withastro/astro/pull/16745) stabilisiert den benutzerdefinierten Logger, der es Projekten erlaubt, Astros Standard-Konsolenausgabe durch strukturiertes JSON oder einen benutzerdefinierten Logger-Entry-Point zu ersetzen, der mit einem Log-Aggregationsdienst spricht. Die eingebauten Handler sind `logHandlers.json()`, `logHandlers.node()` und `logHandlers.console()`:

```js
import { defineConfig, logHandlers } from 'astro/config';

export default defineConfig({
  logger: logHandlers.json({
    pretty: true,
    level: 'warn',
  }),
});
```

`context.logger` ist nun in API-Routen und Middleware immer verfügbar, auch ohne konfigurierten benutzerdefinierten Logger, was eine langjährige Stolperfalle beseitigt: ein Projekt, das sich nicht aktiv entschied, bekam stillschweigend einen nicht anpassbaren Default-Logger.

[PR #16981](https://github.com/withastro/astro/pull/16981) entfernt `experimental.queuedRendering` vollständig, da die Streaming-Rendering-Engine, die es abgelöst hat, nun stabil ist. Die alte Queue-basierte Engine verschwindet; die neue Engine streamt Komponenten, sobald sie angetroffen werden, verzichtet auf das Node-Polling (das keine konkreten Gewinne brachte) und schrumpft den Content-Cache auf einen Tag-Namens-Cache. Die Migration besteht darin, das `experimental.queuedRendering: {}`-Flag aus der Konfiguration zu entfernen; hatte ein Projekt es gesetzt, existiert der Schlüssel nicht mehr und Astro 7.0 gibt eine Warnung aus, bevor es auf den Default zurückfällt.

## Dev-Server im Hintergrund für KI-Code-Agenten

7.0.0-alpha.2 hat eine Funktion hinzugefügt, die im Ökosystem der KI-Code-Agenten still und leise populär geworden ist: die [Verwaltung des Dev-Servers im Hintergrund](https://github.com/withastro/astro/pull/16610). Wird ein KI-Code-Agent erkannt, startet `astro dev` den Dev-Server automatisch als detached Hintergrundprozess und schreibt eine Lock-Datei (`.astro/dev.json`) mit der Server-URL, dem Port und der PID. Die neuen Subkommandos sind `astro dev --background` (im Hintergrund starten), `astro dev stop` (beenden), `astro dev status` (URL, PID, Uptime prüfen) und `astro dev logs` (mit `--follow` / `-f`, um neue Ausgaben zu streamen).

Die Motivation ist einfach: KI-Code-Agenten (Claude Code, Codex CLI, Cursor) laufen in Terminals, in denen ein im Vordergrund laufender Dev-Server die Hauptschleife des Agenten blockiert. Der Hintergrundmodus hält den Server über die Tool-Aufrufe des Agenten hinweg am Leben und schreibt strukturierte Ausgaben in eine Log-Datei, die der Agent mitlesen kann. Der Opt-out ist `ASTRO_DEV_BACKGROUND=0`. Die Funktion ist nun in Agentenkontexten der Standard, was Mitte 2026 den Großteil der CLI-Landschaft der KI-Code-Agenten ausmacht.

Die Lock-Datei ist auch der Ansatzpunkt für eine breitere Fähigkeit, die das Team schrittweise aufbaut: Agenten können `.astro/dev.json` lesen, um zu wissen, welcher Dev-Server zu einem Projekt gehört, ihn bei Bedarf neu starten und am Ende einer Session aufräumen. Dasselbe Lock-Muster bildet die Grundlage für die Lifecycle-Hooks von `astro dev`, die mehrere Integratoren seit 6.4 nachfragen.

## Was in Astro 7.0 entfernt wird

Die 7.0-Linie ist auch ein Cleanup-Release. [PR #17010](https://github.com/withastro/astro/pull/17010) entfernt die CLI-Befehle `astro db`, `astro login`, `astro logout`, `astro link` und `astro init`. `@astrojs/db` ist veraltet; die Empfehlung des Teams ist, direkt einen Datenbank-Client (Drizzle, Kysely usw.) zu verwenden. `astro init` war bereits weitgehend durch `npm create astro@latest` ersetzt worden. Die anderen drei sind Produkte, in die Astro nicht mehr investiert.

Die veralteten Helfer aus `astro:transitions` und `astro:transitions/client` (`TRANSITION_BEFORE_PREPARATION`, `TRANSITION_AFTER_PREPARATION`, `TRANSITION_BEFORE_SWAP`, `TRANSITION_AFTER_SWAP`, `TRANSITION_PAGE_LOAD`, die beiden `isTransition*Event()`-Type-Guards und `createAnimationScope()`) werden ebenfalls entfernt. Der Ersatz besteht darin, die Lifecycle-Event-Namen direkt zu nutzen (`event.type === 'astro:before-preparation'`, `'astro:after-swap'` usw.). Auch die internen Erweiterungspunkte `state.provide()`, `state.resolve()`, `state.finalizeAll()` und `App.Providers` der Advanced-Routing-API werden entfernt; der öffentliche Ersatz ist `locals` für den Per-Request-State.

Die 7.0-Linie ist zudem die erste, die Vite 8 offiziell unterstützt; der [Patch 7.0.0-alpha.1](https://github.com/withastro/astro/releases/tag/astro%407.0.0-alpha.1) entfernt ausdrücklich die Warnung, dass Astro Vite v8 nicht unterstützt. Die 7.0-Betas werden gegen den stabilen Vite-8-Branch gebaut und getestet, was bedeutet, dass die [Funktionen der Vite-8.1-Beta](/articles/2026-06-15-vite-8-1-beta-wasm-esm-chunk-importmap) (direkte `.wasm`-Imports, `build.chunkImportMap`, Umbenennung `server.hmr` → `server.ws`) Astro-7-Projekten zur Verfügung stehen, sobald der Anwender Vite auf 8.1 aktualisiert.

## Wer ist betroffen

Die Migrationskosten für das durchschnittliche Astro-Projekt sind gering: die meisten werden beim Upgrade eine schnellere Markdown-Pipeline sehen, und die neuen Defaults funktionieren einfach. Die riskanteren Migrationen sind diejenigen, die `experimental.advancedRouting` angefasst haben (Flag entfernen, entscheiden, ob man nach `src/fetch.ts` umbenennt oder `fetchFile` setzt), diejenigen, die `astro:transitions`-Event-Konstanten verwendet haben (durch die Event-Namen als Strings ersetzen) und diejenigen, die von den entfernten CLI-Befehlen abhängen (`astro db`, `astro login`, `astro logout`, `astro link`, `astro init`).

Der stabile 7.0-Cut wird erwartet, sobald sich das aktuelle Beta-Feedback stabilisiert, wobei die Deprecation-Warnungen auf `markdown.remarkPlugins`, `markdown.rehypePlugins` und `markdown.remarkRehype` für einen weiteren Release-Zyklus laut bleiben, bevor sie zu harten Fehlern werden. Bis dahin ist 7.0.0-beta.4 die richtige Version, gegen die man validiert, und der richtige Zeitpunkt, um verbleibende Beschwerden über den Sätteri-Default oder die neue `src/fetch.ts`-Entry-Point-Konvention einzureichen.
