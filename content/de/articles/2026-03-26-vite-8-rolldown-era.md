---
title: "Vite 8 Beta ist da: Rolldown ist das neue Herz des Build-Pipeline"
description: "Vite 8 Beta ersetzt ESBuild und Rollup zugunsten von Rolldown und signalisiert eine vollständige Rust-basierte Zukunft für das JavaScript-Build-Tool. Was sich ändert, was bricht, und warum es wichtig ist."
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/vitejs/vite"
date: "2026-03-26"
category: Tooling
author: lschvn
readingTime: 4
tags: ["vite", "javascript", "rolldown", "oxc", "build-tools", "tooling", "release"]
tldr:
  - "Vite 8 Beta ersetzt sowohl ESBuild als auch Rollup durch Rolldown als einheitlichen Bundler – die größte interne Änderung seit Vites erster Veröffentlichung."
  - "Rolldown wird vom Oxc-Team entwickelt und bietet schnellere Builds mit geringerem Speicherverbrauch, insbesondere bei großen Codebasen."
  - "Die Nutzung von Rolldown stieg laut State of JS 2025 Umfrage von 1% auf 10% in einem Jahr, noch vor der stabilen Veröffentlichung von Vite 8."
  - "Plugins, die gegen das Hook-System von Rollup geschrieben wurden, müssen möglicherweise aktualisiert werden; Vite-Plugin-Autoren sollten jetzt gegen die Beta testen."
---

Die Vite 8 Beta ist da, und die wichtigste Änderung steht seit zwei Jahren auf der Roadmap: Rolldown ist jetzt der Standard-Bundler und ersetzt sowohl ESBuild (für Abhängigkeiten) als auch Rollup (für Produktions-Builds). Dies ist die folgenreichste Änderung an Vites Internals seit seiner ersten Veröffentlichung.

Rolldown, entwickelt vom selben Team hinter dem Rust-basierten JavaScript-Parser Oxc, zielt darauf ab, ein Drop-in-Ersatz für Rollup mit besserer Performance zu sein. Vite 8 liefert es als einheitlichen Bundler unter dem vertrauten Dev-Server und den Build-Befehlen, die du bereits verwendest.

## Was sich ändert

In der Praxis sollten die meisten Projekte schnellere Build-Zeiten und geringeren Speicherverbrauch sehen – insbesondere bei größeren Codebasen, bei denen die Node.js-basierten Bundler an ihre Grenzen stoßen. Rolldown läuft nativ und ist darauf ausgelegt, Multi-Threading-Hardware zu nutzen, wie Rollup es nicht kann.

Der Migrationspfad von Vite 7 zu 8 wird vom Vite-Team als unkompliziert für die majority of Projects beschrieben, aber es gibt Breaking Changes. Plugins, die gegen das Hook-System von Rollup geschrieben wurden, müssen möglicherweise aktualisiert werden. Projekte, die auf feinkörnige Kontrolle über den Bundling-Prozess angewiesen sind, sollten frühzeitig testen.

## Ein größerer Trend: Rust frisst die Build-Pipeline

Die Ascendenz von Rolldown ist Teil einer breiteren Verschiebung. Die State of JavaScript 2025 Umfrage zeigte, dass Rolldown von 1% auf 10% Nutzung in einem einzigen Jahr sprang, noch vor der offiziellen Veröffentlichung von Vite 8. Turbopack, Vercels Rust-basierte Alternative, liegt bei 28% Nutzung – aber die Zufriedenheitswerte erzählen eine andere Geschichte. Vites Ökosystem-Graben hat sich als dauerhaft erwiesen. Diese Rust-basierte Tooling-Bewegung erstreckt sich über Vite hinaus: [VoidZero's Vite+](/articles/vite-plus-unified-toolchain) vereint Rolldown, Oxc und eine Suite anderer Rust-Tools unter einer einzigen CLI und repräsentiert die kohärenteste einheitliche Schnittstelle zur Rust-basierten JavaScript-Toolchain bis heute.

Das Muster ist konsistent: Tools, die in Rust geschrieben wurden, verdrängen JavaScript-basierte Äquivalente in der Build-Pipeline – nicht weil Entwickler Neuheit jagen, sondern weil die Leistungsunterschiede signifikant und real sind. TypeScript hat [die Go-Neuschreibung in Vorbereitung](/articles/typescript-7-native-preview-go-compiler). Vite hat Rolldown. Die JavaScript-Toolchain wird Stück für Stück in nativen Sprachen neu geschrieben.

## Wann erscheint Vite 8?

Die Beta ist jetzt zum Testen verfügbar. Das Vite-Team hat kein festes Veröffentlichungsdatum veröffentlicht, aber basierend auf früheren Release-Zyklen wird eine stabile Veröffentlichung in den nächsten Monaten erwartet. Wenn du ein Vite-Plugin pflegst oder ein Projekt mit benutzerdefinierter Build-Konfiguration hast, ist jetzt der Zeitpunkt, gegen die Beta zu testen und Kompatibilitätsprobleme zu melden.

```bash
npm install vite@beta
```

Sieh dir den [Vite 8 Migrationsleitfaden](https://vite.dev/guide/migration) für die vollständige Liste der Breaking Changes vor dem Upgrade an.
