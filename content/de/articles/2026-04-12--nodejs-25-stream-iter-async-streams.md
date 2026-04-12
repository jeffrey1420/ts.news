---
title: "Node.js 25.9: Die stream/iter-API Landet Endlich als Experimentell"
description: "Node.js 25.9 fügt ein experimentelles stream/iter-Modul für asynchrone Iteration über Streams hinzu, ein --max-heap-size-CLI-Flag, AsyncLocalStorage mit Using-Scopes, TurboSHAKE-Krypto und npm 11.12.1."
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop"
date: "2026-04-12"
category: Runtimes
author: lschvn
readingTime: 5
tags: ["Node.js", "JavaScript", "Streams", "Async-Iteration", "Performance", "CLI", "Crypto", "npm"]
tldr:
  - "stream/iter ist das neue experimentelle Modul, das for-await-of-Schleifen über jeden Readable Stream ermöglicht — und ersetzt Readable.from()-Workarounds mit einer nativen Async-Iteration-Schnittstelle für Streams."
  - "--max-heap-size ermöglicht das Festlegen einer harten Obergrenze für V8s Heap pro Prozess per CLI-Flag und löst eine seit langem bestehende Lücke für containerisierte Node.js-Workloads mit vorhersehbaren Speichergrenzen."
  - "AsyncLocalStorage unterstützt jetzt 'using'-Scopes — ein Pattern aus C#s IDisposable, das deterministische Bereinigung von Ressourcen beim Scope-Austritt garantiert, auch bei Fehlern."
faq:
  - q: "Wie unterscheidet sich stream/iter vom bestehenden Readable.from()-Ansatz?"
    a: "Readable.from(iterable) wrappen einen Iterablen in einen Readable Stream, ist aber zum Erstellen von Streams gedacht, nicht zum Konsumieren. stream/iter bietet stream.iter(readable) und stream.consume(readable) — Funktionen zum Lesen von und Iterieren über einen existierenden Stream mit Standard-Syntax für asynchrone Iteration. Es ist das fehlende Primitiv, das Stream-Programmierung mit JavaScripts nativen Iterationsprotokollen komponierbar macht."
  - q: "Was ist die 'using'-Scope-Syntax in AsyncLocalStorage?"
    a: "Das using-Schlüsselwort (aus dem ECMAScript Explicit Resource Management Stage-3-Vorschlag) ruft eine [Symbol.dispose]()-Methode beim Austritt aus einem Block auf — normal oder via throw. Node.js 25.9 fügt Using-Scopes zu AsyncLocalStorage hinzu, sodass Sie eine AsyncLocalStorage-Instanz an einen Scope binden können, sodass sie automatisch bereinigt wird, wenn der Scope endet, ohne explizites try/finally-Cleanup. Dieses Pattern eliminiert eine Klasse von AsyncLocalStorage-Speicherlecks in langlebigen Servern."
  - q: "Was ist --max-heap-size und wann würde ich es verwenden?"
    a: "--max-heap-size setzt eine maximale V8-Heap-Größe in Megabyte. Es ist ein CLI-Flag beim Prozessstart: node --max-heap-size=512 server.js. In containerisierten Umgebungen (Docker, Kubernetes) hilft das Festlegen einer harten Speicherobergrenze dem Orchestrator, OOM-Prozesse sauber zu beenden, anstatt die unpredictabel agierende OOM-Kill-Routine des OS zuzulassen."
  - q: "Was sind TurboSHAKE und KangarooTwelve?"
    a: "Beides sind kryptografische Hash-Funktionen. TurboSHAKE ist eine hochgeschwindigkeits, variable-length Hash-Funktion vom Keccak-Team (Autoren von SHA-3), für Anwendungen konzipiert, die schnelles Hashing bei hohen Raten benötigen — Streaming-Daten, Tree Hashing, Proof-of-Work. KangarooTwelve ist eine schnellere Variante von SHA-3 (SHA-3/128) mit 128-Bit-Output, als schnellere Alternative zu SHA-256 für alltägliche Anwendungsfälle konzipiert. Node.js macht beide über die WebCrypto-API verfügbar."
---

Node.js 25.9.0 erschien am 1. April mit einer Reihe von Quality-of-Life-Ergänzungen, von denen mehrere seit über einem Jahr in Arbeit waren. Die Hauptfunktionen sind das neue experimentelle `stream/iter`-Modul und das `--max-heap-size`-CLI-Flag, aber es gibt noch mehr zu wissen.

## stream/iter: Asynchrone Iteration für Streams

Das neue Modul `experimental/streams/iter` (in einer zukünftigen Version zu stabil zu befördern) fügt zwei Funktionen hinzu:

- `stream.iter(readable)` — gibt einen asynchronen Iterator zurück, der Chunks von einem Readable Stream liefert
- `stream.consume(readable)` — erstellt einen Writable Stream, der einen Readable drained, nützlich für Pipe-Patterns

Der praktische Effekt ist, dass Sie jetzt `for await...of` direkt über jeden Node.js Readable Stream verwenden können:

```javascript
import { iter } from 'node:experimental/streams/iter';
import { createReadStream } from 'node:fs';

for await (const chunk of iter(createReadStream('file.txt'))) {
  process(chunk);
}
```

Dies ersetzt den `Readable.from()`-Workaround, den viele Entwickler verwendeten, um Streams und async Iterables zu überbrücken. `Readable.from()` war zum Erstellen eines Streams aus einem Iterablen gedacht — es als Stream-Konsument zu verwenden, war immer ein Hack. Die neue API macht die Absicht explizit und vermeidet den Double-Buffering-Overhead des alten Patterns.

Die `consume()`-Funktion ist auf Stream-Transformationen ausgerichtet:

```javascript
import { consume } from 'node:experimental/streams/iter';
import { createReadStream, createWriteStream } from 'node:fs';

const writable = createWriteStream('output.txt');
await consume(createReadStream('input.txt')).pipe(writable);
```

James M Snell, der die Funktionalität implementierte, fügte auch Benchmarks in derselben PR hinzu — die API ist darauf ausgelegt, minimalen Overhead im Vergleich zu manuellem Stream-Konsum zu haben.

## --max-heap-size: Harte Speichergrenzen

Node.js-Prozesse waren schon immer an V8s Heap-Limits gebunden, aber diese zu setzen erforderte entweder Umgebungsvariablen (`--max-old-space-size`) oder programmatische APIs. `--max-heap-size` ist ein unkompliziertes CLI-Flag:

```bash
node --max-heap-size=512 server.js
```

Anders als `--max-old-space-size`, das nur die alte Generation kontrolliert, gilt `--max-heap-size` für V8s gesamten Heap inklusive Code-Generierung und neuer Generation. Dies macht es vorhersehbarer für containerisierte Workloads, bei denen Sie eine harte Speicherobergrenze wollen, auf die sich der Orchestrator verlassen kann.

Das Flag wurde von tannal beigesteuert und hatte mehrere Jahre in der Diskussion, bevor es landete.

## AsyncLocalStorage Bekommt Using Scopes

AsyncLocalStorage ist seit Node.js 16 ein Grundpfeiler für request-scoped Context in Web-Frameworks. Die neue Ergänzung ist die Unterstützung von `using` Scopes — basierend auf dem ECMAScript Explicit Resource Management Stage-3-Vorschlag (dem `Symbol.dispose`-Pattern).

Das `using`-Schlüsselwort ruft eine `[Symbol.dispose]()`-Methode beim Austritt aus einem Block auf, ob normal oder via Fehler. Mit der neuen API können Sie eine AsyncLocalStorage-Instanz an einen Scope binden:

```javascript
import { AsyncLocalStorage } from 'node:async_hooks';

const storage = new AsyncLocalStorage();

{
  using scope = storage.enable();
  storage.run({ requestId: 'abc123' }, () => {
    // storage.get() gibt { requestId: 'abc123' } zurück
  });
}
// Speicher wird automatisch bereinigt, wenn Scope endet
```

Dies eliminiert das Bedürfnis nach explizitem try/finally-Cleanup in vielen Patterns. In Hochdurchsatz-Servern, die viele kurzlebige Storage-Instanzen erstellen, verhindern Using Scopes das unbegrenzte Wachsen des AsyncLocalStorage-Stores.

## Crypto: TurboSHAKE und KangarooTwelve

Das `crypto`-Modul erhält zwei neue Hash-Funktionen über die WebCrypto-Integration:

- **TurboSHAKE** — variable Länge, geeignet für Streaming und Tree-Hashing-Anwendungen
- **KangarooTwelve** — schneller 128-Bit-Hash, ein SHA-3-Abkömmling als schnellere Alternative zu SHA-256 für alltägliche Anwendungsfälle

Diese sind über die Standard-WebCrypto-`SubtleCrypto.digest()`-Schnittstelle unter ihren jeweiligen Algorithmen-Namen verfügbar.

## Weitere Bemerkenswerte Änderungen

- **Test-Runner-Mocking konsolidiert**: `MockModuleOptions.defaultExport` und `MockModuleOptions.namedExports` zu `MockModuleOptions.exports` zusammengeführt, mit automatischem Codemod verfügbar
- **npm auf 11.12.1 aktualisiert**: enthält die neuesten npm-Funktionen und Sicherheitsfixes
- **SEA Code Cache für ESM**: Single Executable Applications unterstützen jetzt Code-Caching für ESM-Entry-Points, was die Startzeit von gebündelten Node.js-Anwendungen verbessert
- **module.register() deprecated**: die Legacy-Registrierungs-API ist jetzt formell deprecated (DEP0205)

Node.js 25 ist die aktuelle instabile Versionslinie; Node.js 24 wird später dieses Jahr der nächste LTS-Kandidat. Die meisten dieser Funktionen werden auf LTS-Linien zurückportiert, sobald sie sich stabilisieren.
