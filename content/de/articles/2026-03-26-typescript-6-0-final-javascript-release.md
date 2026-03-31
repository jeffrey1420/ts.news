---
title: "TypeScript 6.0 erscheint: Die letzte JavaScript-basierte Version vor dem Go-Rewrite"
description: "Microsoft veröffentlicht TypeScript 6.0 als letzte Version auf der ursprünglichen JavaScript-Codebasis. DOM-Typ-Updates, verbesserte Inferenz, Subpath-Imports und ein Migrations-Flag bereiten den Weg für das nativ Go-basierte TypeScript 7.0."
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
date: "2026-03-26"
category: Release
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "microsoft", "release", "compiler", "nodejs"]
tldr:
  - "TypeScript 6.0 erschien am 23. März 2026 — die letzte Major-Version auf dem JS-basierten Compiler vor dem Go-Rewrite in TypeScript 7."
  - "Hauptfeatures: verbesserte Inferenz für kontextsensitive Funktionen, DOM-Typ-Updates für Temporal-APIs und Subpath-Imports."
  - "Ein neues `--goToJS`-Migrations-Flag hilft Projekten, Muster zu identifizieren, die sich unter dem Go-basierten Compiler anders verhalten werden."
  - "Import-Assertions-Syntax ist in 6.0 veraltet und wird in 7.0 Fehler werfen — Projekte sollten jetzt zur `with`-Syntax migrieren."
faq:
  - question: "Ist TypeScript 6.0 ein Breaking-Update?"
    answer: "TypeScript 6.0 enthält eine bedeutende Anzahl von Breaking Changes gegenüber 5.x, insbesondere bei der Import-Assertions-Syntax und der Typprüfung von Funktionsausdrücken in generischen JSX-Kontexten. Microsoft nutzt dieses Release, um Muster zu entfernen, die den Sprung auf 7.0 nicht überleben. Überprüfen Sie die Breaking-Changes-Liste vor dem Upgrade."
  - question: "Sollte ich auf TypeScript 7.0 warten?"
    answer: "Nein — TypeScript 6.0 ist als Brücken-Release konzipiert. Die Breaking Changes in 6.0 bereiten Ihre Codebasis auf 7.0 vor. Ein Upgrade jetzt und das Beheben von Veraltungswarnungen wird die spätere 7.0-Migration reibungsloser machen."
  - question: "Was ist der Go-Rewrite von TypeScript?"
    answer: "TypeScript 7.0 ist eine vollständige Neuschreibung des TypeScript-Compilers in Go, die die ursprüngliche JavaScript-basierte Codebasis ersetzt. Der Go-Rewrite zielt auf native Ausführungsgeschwindigkeit und Shared-Memory-Multithreading ab, was die aktuelle Architektur nicht effektiv nutzen kann. Frühe Benchmarks zeigen deutlich schnellere Typprüfung bei großen Projekten."
---

Microsoft veröffentlichte TypeScript 6.0 am 23. März 2026. Es ist per Design das Ende einer Ära. Dies ist die letzte Major-Version von TypeScript, die auf dem ursprünglichen JavaScript-basierten Compiler-Codebase aufgebaut ist. [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler), derzeit in Entwicklung und in Go geschrieben, wird später dieses Jahr mit nativen Ausführungsgeschwindigkeiten und Shared-Memory-Multithreading erscheinen.

Daniel Rosenwasser, Principal Program Manager für TypeScript, [bezeichnete es](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) als „Brücke" zwischen TypeScript 5.9 und [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler) — und die Beschreibung passt. 6.0 ist weniger von spektakulären neuen Sprachfeatures geprägt und mehr von der Aufräumung und Vorbereitung des Ökosystems für den Sprung zu nativem Code.

## Was ist neu in TypeScript 6.0

**DOM-Typ-Updates** bringen TypeScript's eingebaute Typdefinitionen auf den neuesten Stand der Web-Standards, einschließlich Anpassungen an die Temporal-APIs. Wenn Sie die Entwicklung der `Date`-Alternativen in JavaScript verfolgt haben, ist das relevant.

**Verbesserte Inferenz für kontextsensitive Funktionen** ist die wichtigste änderungsbezogene Neuerung. TypeScript kann jetzt Parametertypen über die Eigenschaftsreihenfolge in Objektliteralen inferieren, auch bei Methoden in traditioneller Syntax. Zuvor würde `consume` vor `produce` in einem generischen Aufruf `y` als `unknown` typisieren — das funktioniert jetzt korrekt.

**Subpath-Imports** erlauben präzisere `paths`-Mappings in `tsconfig.json`, sodass Sie verschachtelte Imports zuordnen können, ohne unverwandte Geschwister zu erfassen.

**Ein neues Migrations-Flag** — `--goToJS` — hilft Projekten beim Übergang zu TypeScript 7.0, indem es Muster identifiziert, die sich unter dem Go-basierten Compiler anders verhalten.

## Bekannte Breaking Changes

TypeScript 6.0 enthält eine bedeutende Anzahl von Breaking Changes gegenüber 5.x. Microsoft nutzt dieses Release, um Muster zu entfernen, die den Sprung auf 7.0 nicht überleben.

Import-Assertions-Syntax (`import ... assert {...}`) ist jetzt veraltet und wird in 7.0 Fehler werfen. Die neuere `import()`-Syntax mit `with` (z.B. `import(..., { with: {...} })`) ist der Ersatz.

Die Typprüfung von Funktionsausdrücken in generischen JSX-Kontexten wurde verschärft. Code, der auf lockere Inferenz hier vertraute, braucht in 6.0 möglicherweise explizite Typargumente.

Die allgemeine Richtung vom TypeScript-Team ist klar: Wenn etwas in 6.0 veraltet ist, wird es in 7.0 nicht existieren. Behandeln Sie Warnungen als Fehler und planen Sie entsprechend.

## Warum der Go-Rewrite wichtig ist

Der Wechsel zu Go ist nicht kosmetisch. Der aktuelle TypeScript-Compiler, laufend auf Node.js, hat gut dokumentierte Leistungsdecken — besonders bei großen Codebasen. Der Go-Rewrite zielt auf zwei Dinge: native Ausführungsgeschwindigkeit und Shared-Memory-Multithreading, was die aktuelle Architektur nicht effektiv nutzen kann.

Frühe Benchmarks von Microsoft legen nahe, dass der Go-basierte Compiler bei der Typprüfung großer Projekte deutlich schneller ist. Das ist die Hauptsache, die große Enterprise-TypeScript-Codebasen nachts wach hält.

## Was das für Ihre Projekte bedeutet

Wenn Sie auf TypeScript 5.x sind, sollte das Upgrade auf 6.0 für die meisten Projekte relativ unkompliziert sein — aber lesen Sie vorher die Breaking-Changes-Liste. Wenn Sie auf einer älteren Version sind, ist jetzt der Moment, veraltete Muster zu prüfen und aufzuräumen, bevor 7.0 erscheint.

Das TypeScript-Team hat Anleitung zum Migrationspfad unter [devblogs.microsoft.com/typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) veröffentlicht.

Installieren Sie die neue Version mit:

```bash
npm install -D typescript@6
```
