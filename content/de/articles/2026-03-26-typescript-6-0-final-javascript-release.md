---
title: "TypeScript 6.0 Erschienen: Die Letzte JavaScript-Basierte Version Vor dem Go-Rewrite"
description: "Microsoft liefert TypeScript 6.0 als die letzte Version, die auf dem ursprünglichen JavaScript-Codebase aufbaut. DOM-Type-Updates, verbesserte Inferenz, Subpath-Imports und ein Migrations-Flag bereiten die Bühne für das native, Go-basierte TypeScript 7.0."
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
date: "2026-03-26"
category: Release
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "microsoft", "release", "compiler", "nodejs"]
tldr:
  - "TypeScript 6.0 wurde am 23. März 2026 veröffentlicht — die letzte Hauptversion auf dem JS-basierten Compiler vor dem Go-Rewrite in TypeScript 7."
  - "Wichtigste Features: verbesserte Inferenz für kontextsensitive Funktionen, DOM-Type-Updates für Temporal APIs und Subpath-Imports."
  - "Ein neues --goToJS Migrations-Flag hilft Projekten, Patterns zu identifizieren, die sich unter dem Go-Compiler anders verhalten werden."
  - "Import-Assertions-Syntax ist in 6.0 veraltet und wird in 7.0 Fehler produzieren — Projekte sollten jetzt zur 'with'-Syntax migrieren."
faq:
  - question: "Ist TypeScript 6.0 ein Breaking Upgrade?"
    answer: "TypeScript 6.0 hat eine bedeutende Anzahl an Breaking Changes gegenüber 5.x, insbesondere Regarding Import-Assertions-Syntax und Type-Checking von Funktionsausdrücken in generischen JSX-Kontexten. Microsoft nutzt dieses Release, um Patterns zu entfernen, die den Sprung zu 7.0 nicht überleben werden. Überprüfen Sie die Breaking-Changes-Liste vor dem Upgrade."
  - question: "Sollte ich auf TypeScript 7.0 warten?"
    answer: "Nein — TypeScript 6.0 ist als Brücken-Release konzipiert. Die Breaking Changes in 6.0 bereiten Ihre Codebase auf 7.0 vor, also jetzt upzugraden und Deprecation-Warnings zu beheben wird die eventual 7.0-Migration erleichtern."
  - question: "Was ist der Go-Rewrite von TypeScript?"
    answer: "TypeScript 7.0 ist eine vollständige Neuschreibung des TypeScript-Compilers in Go und ersetzt den ursprünglichen JavaScript-basierten Codebase. Der Go-Rewrite zielt auf native Ausführungsgeschwindigkeit und Shared-Memory-Multithreading, was die aktuelle Architektur nicht effektiv nutzen kann. Frühe Benchmarks zeigen signifikant schnellere Type-Checking auf großen Projekten — die VS Code-Codebase kompiliert etwa 10x schneller unter dem Go-Compiler."
---

Microsoft veröffentlichte TypeScript 6.0 am 23. März 2026. Es ist, per Design, das Ende einer Ära. Dies ist die letzte Hauptversion von TypeScript, die auf dem ursprünglichen JavaScript-basierten Compiler-Codebase aufbaut. [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler), derzeit in Entwicklung und in Go geschrieben, wird später dieses Jahr mit nativen Ausführungsgeschwindigkeiten und Shared-Memory-Multithreading erscheinen.

Daniel Rosenwasser, Principal Program Manager für TypeScript, [nannte es](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) ein „Bridge" zwischen TypeScript 5.9 und [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler) — und die Beschreibung passt. 6.0 geht es weniger um schicke neue Sprachfeatures und mehr darum, aufzuräumen und das Ökosystem auf den Sprung zu nativem Code vorzubereiten.

## Was Neu Ist in TypeScript 6.0

**DOM-Type-Updates** bringen TypeScripts eingebaute Typdefinitionen in Übereinstimmung mit den neuesten Webstandards, einschließlich Anpassungen an die Temporal APIs. Wenn Sie die sich entwickelnden `Date`-Alternativen in JavaScript verfolgt haben, ist das relevant.

**Verbesserte Inferenz für kontextsensitive Funktionen** ist die bedeutendste benutzerseitige Änderung. TypeScript kann jetzt Parametertypen über die Eigenschaftsreihenfolge in Objektliteralen hinweg inferieren, selbst mit Methoden, die in traditioneller Syntax geschrieben wurden. Zuvor ließ das Übergeben von `consume` vor `produce` in einem generischen Aufruf `y` als `unknown` typisiert — das funktioniert jetzt korrekt.

**Subpath-Imports** erlauben präzisere `paths`-Mappings in `tsconfig.json` und lassen Sie verschachtelte Imports ohne Erfassung nicht verwandter Geschwister mappen.

**Ein neues Migrations-Flag** — `--goToJS` — hilft Projekten, den Übergang zu TypeScript 7.0 zu navigieren, indem es Patterns identifiziert, die sich unter dem Go-Compiler anders verhalten werden.

## Breaking Changes, Die Sie Kennen Sollten

TypeScript 6.0 hat eine bedeutende Anzahl an Breaking Changes gegenüber 5.x. Microsoft nutzt dieses Release, um Patterns zu entfernen, die den Sprung zu 7.0 nicht überleben werden.

Import-Assertions-Syntax (`import ... assert {...}`) ist jetzt veraltet und wird in 7.0 Fehler produzieren. Die neuere `import()`-Syntax mit `with` (z.B. `import(..., { with: {...} })`) ist der Ersatz.

Type-Checking von Funktionsausdrücken in generischen JSX-Kontexten wurde verschärft. Code, der sich hier auf lose Inferenz verließ, kann in 6.0 explizite Typargumente benötigen.

Die generelle Richtung des TypeScript-Teams ist klar: Wenn etwas in 6.0 veraltet ist, wird es in 7.0 nicht existieren. Behandeln Sie Warnings als Fehler und planen Sie dementsprechend.

## Warum Der Go-Rewrite Relevant Ist

Der Wechsel zu Go ist nicht kosmetisch. Der aktuelle TypeScript-Compiler, der auf Node.js läuft, hat dokumentierte Performance-Deckel — besonders auf großen Codebases. Der Go-Rewrite zielt auf zwei Dinge: native Ausführungsgeschwindigkeit und Shared-Memory-Multithreading, was die aktuelle Architektur nicht effektiv nutzen kann.

Frühe Benchmarks von Microsoft deuten darauf hin, dass der Go-Compiler bei Type-Checking großer Projekte signifikant schneller ist. Das ist die Hauptsache, die große Enterprise-TypeScript-Codebases nachts wachhält.

## Was Das Für Ihre Projekte Bedeutet

Wenn Sie auf TypeScript 5.x sind, sollte das Upgrade auf 6.0 für die meisten Projekte relativ unkompliziert sein — aber lesen Sie die Breaking-Changes-Liste, bevor Sie es tun. Wenn Sie auf einer älteren Version sind, ist jetzt der Moment, veraltete Patterns zu prüfen und aufzuräumen, bevor 7.0 landet.

Das TypeScript-Team hat Orientierungshilfen für den Migrationspfad auf [devblogs.microsoft.com/typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) veröffentlicht.

Installieren Sie die neue Version mit:

```bash
npm install -D typescript@6
```
