---
title: "Bun v1.3.12 — Headless Browser-Automation und Native Explicit Resource Management"
description: "Buns neuestes Release fügt WebView für headless Browser-Automatisierung hinzu, landet TC39s using/await using in JavaScriptCore und liefert einen 2,3-fachen Speedup für URLPattern."
date: 2026-04-13
image: "https://bun.com/og/blog.png"
author: lschvn
tags: ["bun", "javascript", "typescript", "runtime", "browser-automation"]
---

Bun v1.3.12 erschien am 10. April mit einem der ambitioniertesten Feature-Sets der letzten Releases. Zwei Highlights verändern, was ein JavaScript-Runtime out of the box kann: native headless Browser-Automatisierung und nativer Support für den TC39 Explicit Resource Management-Vorschlag. Hier ist, was sich geändert hat.

## Bun.WebView — Headless Browser-Automatisierung Eingebaut

Das Hauptfeature ist `Bun.WebView`, eine headless Browser-Automatisierungs-API, die direkt im Runtime enthalten ist. Kein Puppeteer, keine Playwright-Abhängigkeit — nur eine native API mit zwei Backends:

- **WebKit** (Standard auf macOS) — keine externen Abhängigkeiten, nutzt das System-WKWebView
- **Chrome** (plattformübergreifend) — steuert Chromium über das DevTools Protocol, erkennt automatisch installierte Browser oder akzeptiert einen benutzerdefinierten Pfad

Selektorbasierte Aktionen warten automatisch auf Actionability (Playwright-Style), das heißt ein Element muss attached, sichtbar, stabil und unbedeckt sein, bevor ein Klick ausgelöst wird. Alle Eingaben werden als OS-Level-Events mit `isTrusted: true` dispatched.

```javascript
await using view = new Bun.WebView({ width: 800, height: 600 });

await view.navigate("https://example.com");
await view.click("a[href='/docs']");   // wartet auf Actionability, nativer Klick
await view.scroll(0, 400);             // natives Wheel-Event, isTrusted: true

const title = await view.evaluate("document.title");
const png = await view.screenshot({ format: "jpeg", quality: 90 });
await Bun.write("page.jpg", png);
```

Ein Browser-Subprozess wird pro Bun-Prozess geteilt; zusätzliche `new Bun.WebView()`-Aufrufe öffnen Tabs in derselben Instanz. Rohe CDP-Aufrufe sind über `view.cdp(method, params)` für fortgeschrittene Anwendungsfälle verfügbar.

## Natives `using` und `await using` in JavaScriptCore

Der TC39 Explicit Resource Management-Vorschlag — bereits in TypeScript über Downleveling verfügbar — funktioniert jetzt nativ in Buns JavaScriptCore-Engine. Über 1.650 Upstream-WebKit-Commits sind in diesem Release gelandet und bringen die `using`- und `await using`-Deklarationen als natives Sprachfeature.

```javascript
function readFile(path) {
  using file = openFile(path);   // file[Symbol.dispose]() wird am Blockende aufgerufen
  return file.read();
}

async function fetchData(url) {
  await using connection = await connect(url);  // [Symbol.asyncDispose]() wird geawaited
  return connection.getData();
}
```

Kein Transpilierungsschritt erforderlich. Dies bringt Bun mit dem nativen Modulgraphen in Einklang und macht Resource-Cleanup ergonomisch ohne Utility-Wrapper.

## URLPattern — Bis zu 2,3× Schneller

`URLPattern.test()` und `URLPattern.exec()` haben ein signifikantes Performance-Overhaul erhalten. Das interne Regex-Matching ruft nun direkt die kompilierte Regex-Engine auf, anstatt temporäre JavaScript-Objekte pro Aufruf zu allokieren, und eliminiert bis zu 24 GC-Allokationen pro Aufruf.

| Benchmark | Vorher | Nachher | Speedup |
|---|---|---|---|
| `test()` Match, benannte Gruppen | 1,05 µs | 487 ns | **2,16×** |
| `test()` Kein Match | 579 ns | 337 ns | **1,72×** |
| `test()` Match, einfach | 971 ns | 426 ns | **2,28×** |
| `exec()` Match, benannte Gruppen | 1,97 µs | 1,38 µs | **1,43×** |

Als Nebeneffekt verschmutzen URLPattern-Internals nicht mehr `RegExp.lastMatch` oder `RegExp.$N`.

## In-Process Bun.cron()-Scheduler

Bun.cron hat jetzt eine In-Process-Callback-Überladung, die eine Funktion nach einem Cron-Schedule ausführt, als Ergänzung zur bestehenden OS-Level-Variante, die crontab/launchd/Task Scheduler-Einträge registriert. Die In-Process-Version ist leichter, funktioniert identisch auf allen Plattformen und teilt den Status direkt mit dem Rest der Anwendung.

Wichtige Garantien: kein Overlap (der nächste Fire wird erst nach dem Setteln des Handlers geplant), UTC-Scheduling, `--hot`-safe (Jobs werden vor der Modulgraph-Neu evaluation gelöscht), und disposable via `using`.

## Weitere Verbesserungen

- **UDP-Socket-Fixes**: ICMP-Fehler (port unreachable, host unreachable) werden nun über den Error-Handler surfaced, anstatt den Socket stillschweigend zu schließen. Truncated Datagrams sind über ein neues `flags.truncated`-Argument erkennbar.
- **Unix Domain Socket Lifecycle**: entspricht nun Node.js — Binding an eine existierende Socket-Datei gibt korrekt `EADDRINUSE` zurück, und `stop()` räumt die Socket-Datei automatisch auf.
- **Standalone Executables auf Linux**: `bun build --compile` embeddet den Modulgraphen nun über einen ELF `.bun`-Abschnitt, anstatt von `/proc/self/exe` zu lesen, was Binaries mit Execute-Only-Berechtigungen repariert.
- **SIMD-Optimierungen**: `Bun.stripANSI`, `Bun.stringWidth` und gemeinsame ANSI-Helper haben SIMD-Beschleunigung erhalten (4×-unrolled Prologue, Bulk CSI/OSC Skips), mit bis zu ~4× Verbesserung bei reinen ASCII-Eingaben.
- **JIT-Verbesserungen**: schnellerer Tier-Up für stabile Funktionen, `Array.isArray` als JIT-Intrinsic, optimiertes `String#includes` und verbesserte BigInt-Arithmetik.

Upgrade mit `bun upgrade` oder installiere von [bun.sh](https://bun.sh).

{tldr}
- Bun.WebView bringt Headless-Browser-Automatisierung mit WebKit- und Chrome-Backends, keine externen Abhängigkeiten — native Klicks, Scrolls, Screenshots und CDP-Zugriff in einer einzigen API
- TC39s `using`/`await using` (Explicit Resource Management) wird nun nativ in JavaScriptCore unterstützt, was TypeScript-Downleveling für Resource-Cleanup überflüssig macht
- URLPattern-Operationen sind dank direkter Regex-Engine-Aufrufe und der Eliminierung von 24 GC-Allokationen pro Aufruf bis zu 2,3× schneller
{/tldr}
