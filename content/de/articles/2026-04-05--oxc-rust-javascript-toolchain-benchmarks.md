---
title: "Oxc Baut still Und Leise Das Schnellste JavaScript-Toolkit in Rust — Und Es Ist Fast Fertig"
description: "Während ESLint v10 sich mit Legacy-Bereinigung herumschlug, lieferte das Oxc-Projekt einen Linter 100x schneller, einen Formatter 30x schneller als Prettier, und einen Parser, der SWC im Staub zurücklässt. Hier ist, was der JavaScript Oxidation Compiler wirklich ist."
date: "2026-04-05"
image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "rust", "tooling", "oxc", "performance", "typescript"]
---

Es gibt ein Projekt namens [Oxc](https://oxc.rs/), das die meisten JavaScript-Entwickler noch nicht gehört haben. Es ist der JavaScript Oxidation Compiler — eine Sammlung von Hochleistungs-JavaScript-Tools in Rust geschrieben. Und je nachdem, welches Benchmark Sie betrachten, könnte es bereits das Schnellste in der Kategorie sein.

## Was Oxc tatsächlich ist

Oxc ist kein einzelnes Tool. Es ist eine Suite von Komponenten, die jeweils einen bestimmten Job in der JavaScript-Tooling-Pipeline adressieren:

- **Oxlint** — ein ESLint-kompatibler Linter mit 50–100x schnellerem Durchsatz als ESLint, mit über 700 Regeln und ESLint-JS-Plugin-Unterstützung
- **Oxfmt** — ein Prettier-kompatibler Formatter mit 30x schneller als Prettier und 3x schneller als Biome
- **oxc-parser** — ein JavaScript/TypeScript-Parser, der beim Parsing-Benchmark 3x schneller als SWC und 5x schneller als Biome ist
- **oxc-transform** — ein Transpiler für TypeScript, JSX und React Fast Refresh
- **oxc-resolver** — ein Modulresolver, der 28x schneller als Webpacks enhanced-resolve ist
- **oxc-minify** — ein Alphaminifier mit Dead Code Elimination und Variablenname Mangling

Alles ist Open Source, und alles kommt von [Void Zero](https://voidzero.dev/), der Firma hinter dem Projekt.

## Die Zahlen sind nicht eng beieinander

Oxc's eigene Benchmarks lohnen sich zu betrachten. Auf einem MacBook Pro M3 Max beim Parsen von `typescript.js`:

- Oxc: 26,3ms
- SWC: 84,1ms
- Biome: 130,1ms

Beim Linting ist Oxlint 50–100x schneller als ESLint, je nach CPU-Kernanzahl. Beim Formatieren ist Oxfmt 3x schneller als Biome und 35x schneller als Prettier. Der Transformer ist 4x schneller als SWC, nutzt 20% weniger Speicher und wird als 35MB-Paket ausgeliefert statt SWCs 37MB.

Dies sind keine inkrementellen Gewinne. Es ist eine architektonische Lücke.

## Type-Aware Linting ohne tsc

Eine der interessanteren Behauptungen ist „echtes Type-Aware Linting powered by tsgo". Die meisten type-aware ESLint-Regeln (oder Biome's Type-Inferenz) erfordern das Ausführen des TypeScript-Compilers als separaten Schritt oder die Implementierung benutzerdefinierter Type-Inferenz. Oxc's Ansatz scheint nicht auf die gleiche Weise auf `tsc` angewiesen zu sein — was für die Lint-Geschwindigkeit in großen TypeScript-Codebasen bedeutsam wäre.

## ESLint-Plugin-Kompatibilität

Oxlint unterstützt ESLint-JS-Plugins nativ. Das ist die entscheidende Freischaltung für die Adoption: Teams müssen ihre bestehenden Regelkonfigurationen nicht von Grund auf neu schreiben. Wenn ein Plugin in einfachem JavaScript geschrieben ist (die Mehrheit des ESLint-Ökosystems), kann es mit minimaler Friktion auf Oxlint laufen.

Die verbleibende Lücke ist die Reglabdeckung. Oxlint hat über 700 Regeln, aber ESLints Ökosystem ist viel größer. Für Teams mit spezifischen, Nischenregel-Anforderungen könnte dies noch ein Blocker sein.

## Das größere Bild

Oxc passt in ein breiteres Muster im JavaScript-Ökosystem: Tools, die ursprünglich in JavaScript geschrieben wurden, werden in Rust (oder Go, wie TypeScript angeblich erkundet) für Performance umgeschrieben. Biome hat es zuerst mit einem kombinierten Linter+Formatter getan. SWC hat die Baseline gesetzt. Rolldown tat es fürs Bundling. Oxc tut es für die gesamte Pipeline.

ESLint v10's Veröffentlichung diese Woche — mit seiner schmerzhaften Legacy-Migration und der Community-Frustration über Migrationspfade — ist eine Erinnerung, dass Inhaberposition nicht vor einem besseren Produkt schützt. Oxc ist dort noch nicht bei der Ökosystem-Parität. Aber die Richtung ist 2026 genau zu beobachten.

tldr[]
- Oxc ist ein Rust-basiertes JavaScript-Toolkit von Void Zero, das Linting, Formatierung, Parsing, Transformation und Modulauflösung abdeckt — alle mit signifikanten Performance-Vorsprüngen gegenüber bestehenden JS-nativen Alternativen
- Oxlint ist 50–100x schneller als ESLint mit über 700 Regeln und ESLint-JS-Plugin-Kompatibilität ; Oxfmt ist 30x schneller als Prettier und 3x schneller als Biome
- Die wichtigste verbleibende Lücke ist die Ökosystem-Breite — Oxlint hat noch nicht den vollständigen ESLint-Regelkatalog, aber der architektonische Vorteil ist strukturell, nicht inkrementiell

faq[]
- **Kann ich ESLint heute durch Oxlint ersetzen?** Für die meisten Projekte, wahrscheinlich — Oxlint hat über 700 Regeln und unterstützt ESLint-JS-Plugins. Aber prüfen Sie zuerst Ihre spezifischen Regel-Anforderungen.
- **Ist Oxc produktionsreif?** Der Linter (Oxlint) und der Formatter (Oxfmt) gelten als stabil. Der Minifier ist Alpha. Der Parser besteht alle Test262 Stage-4-Tests.
- **Wie vergleicht es sich mit Biome?** Biome kombiniert Linting und Formatierung in einem Tool und hat ausgereiftere Framework-Unterstützung (Vue, Svelte, Astro). Oxc ist beim reinen Performance-Vorsprung schneller und deckt mehr der Pipeline ab (Transformer, Resolver, Minifier).
- **Wer finanziert das?** Void Zero ist die Firma hinter Oxc. Sie haben Gold-, Silber- und Bronze-Sponsoren, und das Projekt ist Open Source unter der OpenJS Foundation.
