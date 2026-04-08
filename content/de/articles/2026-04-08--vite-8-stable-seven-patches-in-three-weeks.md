---
title: "Vite 8 Stable: Sieben Patches in drei Wochen nach dem Stable-Release"
description: "Vite 8.0.0 stable wurde am 12. März veröffentlicht, und die Patches haben nicht aufgehört — v8.0.7 landete am 7. April mit Fixes für CSS, SSR, WASM und Dev-Server-Verhalten. Ein Kontrast zum langen Beta-Zyklus."
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/vitejs/vite"
date: "2026-04-08"
category: Tooling
author: lschvn
readingTime: 4
tags: ["vite", "javascript", "build-tools", "tooling", "release", "rolldown"]
tldr:
  - "Vite 8.0.0 stable wurde am 12. März 2026 veröffentlicht, mit Rolldown als unified Bundler, der sowohl ESBuild als auch Rollup ersetzt."
  - "Sieben Patches (v8.0.1 bis v8.0.7) folgten in drei Wochen, mit Fixes für CSS, WASM SSR, Dev-Server-Neustarts und Sourcemap-Handling."
  - "Die Weiterleitung der Browser-Konsole an das Dev-Server-Terminal war eine stark nachgefragte DX-Verbesserung, die im Beta-Zyklus hinzugefügt wurde."
  - "Die rasante Patch-Frequenz spiegelt die Herausforderungen eines großen Bundler-Wechsels wider — Plugin-Autoren und große Projekte sollten das Changelog genau beobachten."
faq:
  - q: "Ist Vite 8 stable sicher für die Produktion?"
    a: "Mit sieben Patches in drei Wochen adressiert das Vite-Team aktiv Regressionen. Für neue Projekte ist v8 vertretbar. Für große bestehende Projekte mit komplexer Build-Konfiguration: vor dem Upgrade testen."
  - q: "Was ist der Unterschied zu dem Vite-8-Beta-Artikel vom 26. März?"
    a: "Der Artikel vom 26. März behandelte die Beta-Features und die Rolldown-Migration. Dieser Artikel konzentriert sich auf das Stable-Release und die ungewöhnlich rasante Patch-Frequenz."
  - q: "Sollte ich auf v8 upgraden oder bei v7 bleiben?"
    a: "Für neue Projekte v8 verwenden. Für stabile v7-Projekte mit komplexer Build-Konfiguration den v7-zu-v8-Migrationsleitfaden prüfen, bevor upgegraded wird."
---

Vite 8.0.0 ist am 12. März 2026 stable geworden. Drei Wochen und sieben Patches später ist das Vite-Team bei v8.0.7 (7. April). Das ist eine schnellere Reaktionsgeschwindigkeit als bei den meisten Major-Releases im JavaScript-Ökosystem, und es spiegelt die Komplexität wider, die mit dem gleichzeitigen Ersetzen von ESBuild und Rollup durch Rolldown als unified Bundler einhergeht.

## Was Stable mitbrachte

Die Hauptänderung ist Rolldown. Vite 8 basiert auf `rolldown 1.0.0-rc.9`, das sowohl ESBuild (für Dependency Pre-Bundling) als auch Rollup (für Production-Builds) durch einen einzelnen Rust-basierten Bundler ersetzt. Die Performance- und Speichervorteile sind real — besonders für größere Projekte — aber auch die Edge Cases, wenn Hunderte von Community-Plugins gegen die exakte Hook-Schnittstelle von Rollup geschrieben wurden.

Ebenfalls neu: Browser-Konsolen-Output wird jetzt an das Dev-Server-Terminal weitergeleitet. Das war eine häufig gewünschte DX-Verbesserung — Fehler und Logs erscheinen nun dort, wo man bereits hinschaut.

## Die Patch-Bilanz

Das Changelog von v8.0.1 bis v8.0.7 zeigt Fixes über eine breite Fläche:

- **v8.0.1** (19. März): Erster Stable-Patch
- **v8.0.2** (23. März): Dev-Server-Watch-Verhaltensfixes
- **v8.0.3** (26. März): Weitere Watcher-Verfeinerungen
- **v8.0.4** (6. April): CSS- und SSR-Fixes
- **v8.0.5** (6. April): Weitere SSR- und Module-Runner-Fixes
- **v8.0.6** (7. April): Fortlaufende Bugfixes
- **v8.0.7** (7. April): Neuester Patch

Die Doppelpack-Releases am 6. und 7. April deuten auf eine spezifische Regressionswelle hin, die schnell gefunden und behoben wurde.

 ## Browser-Console-Forwarding: Kleines Detail, großer DX-Gewinn

Das Hinzufügen der Browser-Konsolenausgabe-Weiterleitung zum Dev-Server-Terminal (gemergt in beta.17) verdient besondere Erwähnung. Zuvor war die Browser-Konsolenausgabe vom Terminal, in dem man `vite` laufen lässt, getrennt. Mit der Standardkonfiguration erscheinen console.log, Fehler und Warnungen nun dort, wo man bereits schaut.

## Vite 7 noch unterstützt

Für Projekte, die noch nicht bereit sind, bleibt Vite 7 unterstützt. Der v7-zu-v8-Migrationsleitfaden ist auf vite.dev verfügbar. Die meisten straightforward Projekte migrieren ohne größere Probleme, aber Projekte mit Custom-Plugins oder ungewöhnlicher Bundler-Konfiguration sollten Zeit fürs Testen einplanen.

```bash
npm install vite@latest
```
