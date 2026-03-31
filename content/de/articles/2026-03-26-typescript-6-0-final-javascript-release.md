---
title: "TypeScript 6.0 erscheint: Die letzte JavaScript-basierte Version vor dem Go-Rewrite"
description: "Microsoft liefert TypeScript 6.0 als letzte Version auf der ursprünglichen JavaScript-Codebase. DOM-Typ-Updates, verbesserte Inferenz, Subpath-Imports und ein Migrations-Flag bereiten die Bühne für das native Go-basierte TypeScript 7.0."
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
date: "2026-03-26"
category: Release
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "microsoft", "release", "compiler", "nodejs"]
tldr:
  - "TypeScript 6.0 am 23. März 2026 veröffentlicht — die letzte Hauptversion auf dem JS-basierten Compiler vor dem Go-Rewrite in TypeScript 7."
  - "Key Features: verbesserte Inferenz für kontextsensitive Funktionen, DOM-Typ-Updates für Temporal APIs und Subpath-Imports."
  - "Ein neues `--goToJS`-Migrations-Flag hilft Projekten, Patterns zu identifizieren, die sich unter dem Go-basierten Compiler anders verhalten werden."
  - "Import-Assertions-Syntax ist in 6.0 veraltet und wird in 7.0 einen Fehler werfen — Projekte sollten jetzt zur `with`-Syntax migrieren."
faq:
  - question: "Ist TypeScript 6.0 ein Breaking Upgrade?"
    answer: "TypeScript 6.0 bringt eine bedeutsame Anzahl an Breaking Changes gegenüber 5.x mit, insbesondere bei Import-Assertions-Syntax und Typprüfung von Funktionsausdrücken in generischen JSX-Kontexten. Microsoft nutzt dieses Release, um Patterns zu pensionieren, die den Sprung zu 7.0 nicht überleben werden. Lesen Sie die Breaking-Changes-Liste vor dem Upgrade."
  - question: "Sollte ich auf TypeScript 7.0 warten?"
    answer: "Nein — TypeScript 6.0 ist als Bridge-Release konzipiert. Die Breaking Changes in 6.0 bereiten Ihre Codebase auf 7.0 vor. Wenn Sie jetzt upgraden und Deprecation-Warnungen beheben, wird die spätere 7.0-Migration reibungsloser."
  - question: "Was ist der Go-Rewrite von TypeScript?"
    answer: "TypeScript 7.0 ist eine vollständige Neuschreibung des TypeScript-Compilers in Go, die die ursprüngliche JavaScript-basierte Codebase ersetzt. Der Go-Rewrite zielt auf native Ausführungsgeschwindigkeit und Shared-Memory-Multithreading, was die aktuelle Architektur nicht effektiv nutzen kann. Erste Benchmarks zeigen deutlich schnellere Typprüfung auf großen Projekten — die VS-Code-Codebase kompiliert etwa 10x schneller unter dem Go-basierten Compiler."
---

Microsoft veröffentlichte TypeScript 6.0 am 23. März 2026. Es ist, per Design, das Ende einer Ära. Dies ist die letzte Hauptversion von TypeScript, die auf der ursprünglichen JavaScript-basierten Compiler-Codebase gebaut wurde. [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler), derzeit in Entwicklung und in Go geschrieben, wird später dieses Jahr mit nativen Ausführungsgeschwindigkeiten und Shared-Memory-Multithreading erscheinen.

Daniel Rosenwasser, Principal Program Manager für TypeScript, [nannte es](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) eine „Bridge" zwischen TypeScript 5.9 und [TypeScript 7.0](/articles/2026-03-23-typescript-7-native-preview-go-compiler) — und die Beschreibung passt. 6.0 geht es weniger um stylische neue Sprach-Features und mehr um Aufräumen und das Ökosystem bereit machen für den Sprung zu nativem Code.

## Was ist neu in TypeScript 6.0

**DOM-Typ-Updates** bringen TypeScripts eingebaute Typdefinitionen in Einklang mit den neuesten Web-Standards, einschließlich Anpassungen an den Temporal APIs. Wenn Sie die sich entwickelnden `Date`-Alternativen in JavaScript verfolgen, ist das relevant.

**Verbesserte Inferenz für kontextsensitive Funktionen** ist die bedeutsamste benutzerseitige Änderung. TypeScript kann jetzt Parametertypen über die Eigenschaftsreihenfolge in Objektliteralen inferieren, selbst bei Methoden in traditioneller Syntax. Zuvor blieb `y` als `unknown` typisiert, wenn `consume` vor `produce` in einem generischen Aufruf übergeben wurde — das funktioniert jetzt korrekt.

**Subpath-Imports** erlauben präzisere `paths`-Mappings in `tsconfig.json` und lassen Sie verschachtelte Imports mappen, ohne unbeteiligte Geschwister einzufangen.

**Ein neues Migrations-Flag** — `--goToJS` — hilft Projekten, die Transition zu TypeScript 7.0 zu navigieren, indem es Patterns identifiziert, die sich unter dem Go-basierten Compiler anders verhalten werden.

## Breaking Changes, die Sie kennen sollten

TypeScript 6.0 bringt eine bedeutsame Anzahl an Breaking Changes gegenüber 5.x mit. Microsoft nutzt dieses Release, um Patterns zu pensionieren, die den Sprung zu 7.0 nicht überleben werden.

Import-Assertions-Syntax (`import ... assert {...}`) ist jetzt veraltet und wird in 7.0 Fehler produzieren. Die neuere `import()`-Syntax mit `with` (z.B. `import(..., { with: {...} })`) ist der Ersatz.

Die Typprüfung von Funktionsausdrücken in generischen JSX-Kontexten wurde verschärft. Code, der sich hier auf lose Inferenz verließ, benötigt möglicherweise explizite Typargumente in 6.0.

Die Gesamtrichtung vom TypeScript-Team ist klar: Wenn etwas in 6.0 veraltet ist, wird es in 7.0 nicht existieren. Behandeln Sie Warnungen als Fehler und planen Sie entsprechend.

## Warum der Go-Rewrite wichtig ist

Der Umstieg auf Go ist nicht kosmetisch. Der aktuelle TypeScript-Compiler, der auf Node.js läuft, hat dokumentierte Performance-Deckel — besonders auf großen Codebases. Der Go-Rewrite zielt auf zwei Dinge: native Ausführungsgeschwindigkeit und Shared-Memory-Multithreading, was die aktuelle Architektur nicht effektiv nutzen kann.

Erste Benchmarks von Microsoft deuten darauf hin, dass der Go-basierte Compiler bei der Typprüfung großer Projekte deutlich schneller ist. Das ist das Hauptsächliche, was große Enterprise-TypeScript-Codebases nachts wach hält.

## Was das für Ihre Projekte bedeutet

Wenn Sie auf TypeScript 5.x sind, sollte das Upgrade auf 6.0 für die meisten Projekte relativ unkompliziert sein — aber lesen Sie die Breaking-Changes-Liste, bevor Sie es tun. Wenn Sie auf einer älteren Version sind, ist jetzt der Moment, veraltete Patterns zu prüfen und aufzuräumen, bevor 7.0 landet.

Das TypeScript-Team hat Orientierungshilfen für den Migrationspfad auf [devblogs.microsoft.com/typescript](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/) veröffentlicht.

Installieren Sie die neue Version mit:

```bash
npm install -D typescript@6
```
