---
title: "TypeScript 7 Native Preview: Project Corsa Schreibt Den Compiler in Go Neu — Und Es Verändert Alles"
description: "Microsofts Entscheidung, den TypeScript-Compiler und Language Service nach Go zu portieren, ist kein Tech-Demo — frühe Benchmarks zeigen, dass der VS Code-Codebase in 7,5 Sekunden statt 77,8 Sekunden kompiliert. Hier ist, was die native Ära für Ihre Build-Pipeline und Editor-Performance bedeutet."
date: "2026-03-23"
category: "news"
author: lschvn
tags: ["typescript", "compiler", "performance", "go", "tooling", "project-corsa", "nodejs"]
readingTime: 12
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/microsoft/TypeScript"
tldr:
  - "Project Corsa portiert den TypeScript-Compiler nach Go und reduziert die VS Code-Kompilierung von 77,8s auf 7,5s — etwa 10x schneller."
  - "TypeScript 6.0 wird die letzte JS-basierte Version sein ; TypeScript 7 ist die native Go-Ära mit Shared-Memory-Multithreading."
  - "Node.js führt TypeScript nativ über Type Stripping aus (stabil seit v25.2.0), standardmäßig aktiviert seit Node 22.18.0."
  - "Entwickler sollten Enums und Namespaces jetzt prüfen — diese nicht-löschbaren Features funktionieren unter Type Stripping nicht ohne Migration."
faq:
  - question: "Wann wird TypeScript 7.0 veröffentlicht?"
    answer: "Microsoft hat angedeutet, dass TypeScript 7.0 später im Jahr 2026 erscheinen wird. Die Native Preview basierend auf dem Go-Compiler ist bereits über das npm-Tag @typescript/native-preview für Tests gegen Ihre Codebase verfügbar."
  - question: "Wie viel schneller ist der Go-basierte TypeScript-Compiler?"
    answer: "Frühe Benchmarks sind dramatisch. Die VS Code-Codebase kompiliert in 7,5 Sekunden statt 77,8 Sekunden mit dem JavaScript-basierten Compiler — eine etwa 10-fache Verbesserung. Die Playwright-Testsuite sank von 11,1 Sekunden auf 1,1 Sekunde. Projektladezeiten in VS Code verbesserten sich ebenfalls um etwa das 8-fache."
  - question: "Wird mein bestehender TypeScript-Code mit dem Go-basierten Compiler funktionieren?"
    answer: "In den meisten Fällen, ja. Der Go-basierte Compiler zielt auf Feature-Parität mit TypeScript 6.0. Code, der jedoch nicht-löschbare Syntax wie Enums und Namespaces verwendet, kann eine Migration erfordern. Aktivieren Sie --erasableSyntaxOnly in der CI, um Probleme vor dem Übergang aufzudecken."
---

Microsofts VS Code-Codebase kompiliert in 7,5 Sekunden unter der TypeScript 7 Native Preview — gegenüber 77,8 Sekunden mit dem aktuellen JavaScript-basierten Compiler. Das ist eine 10× Verbesserung, und es ist das Hauptergebnis von Project Corsa, Microsofts vollständiger Neuschreibung des TypeScript-Compilers und Language Service in Go.

TypeScript 7 ändert das. Oder besser gesagt, es wird es tun — aber die Preview ist bereits da und die Zahlen sind schwer zu widerlegen.

## Project Corsa: Der Native Port

Anfang 2025 kündigte Microsoft [Project Corsa](https://devblogs.microsoft.com/typescript/typescript-native-port/) an, einen vollständigen nativen Port des TypeScript-Compilers und Language Service nach Go. Das Ziel war ehrgeizig: ~10x schnellere Build-Zeiten und signifikant verbesserte Editor-Reaktionsfähigkeit.

Die ersten Benchmarks waren auffällig. Auf der VS Code-Codebase selbst — einem großen, realen TypeScript-Projekt — fiel die Kompilierung von **77,8 Sekunden auf 7,5 Sekunden**. Bei der Playwright-Testsuite ging es von 11,1 Sekunden auf 1,1 Sekunde. Das sind keine synthetischen Micro-Benchmarks. Es ist dieselbe Codebase, die Microsoft zum Erstellen von VS Code verwendet, auf derselben Hardware ausgeführt.

Der Port ist noch nicht vollständig. [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) bleibt die JavaScript-basierte Version, durch die das Ökosystem migriert. Microsoft hat angekündigt, dass TypeScript 6.0 die letzte Hauptversion sein wird, die auf dem JS-basierten Toolchain aufbaut. TypeScript 7 ist dort, wo die native Ära wirklich beginnt.

## Was „Nativ" In Der Praxis Wirklich Bedeutet

Es gibt zwei Dimensionen dessen, was TypeScript 7 ändert, und es lohnt sich, sie zu trennen.

**Der Compiler (`tsc`)** — Der Kommandozeilen-TypeScript-Compiler. Ein Go-basierter `tsc` bedeutet schnellere Kompilierungen, geringere Speichernutzung während Builds und bessere Integration mit Nicht-JavaScript-Toolchains. Für Projekte, die `tsc` als Teil von CI-Pipelines ausführen, übersetzt sich dies direkt in schnellere Feedback-Zyklen.

**Der Language Service** — Das ist, was VS Codes IntelliSense, Fehlerunterstreichungen, Springen zur Definition und Refactoring ermöglicht. Die Editor-Performance wird vom Language Service ausgebremst, nicht vom Compiler. Microsoft berichtet, dass die Projektladezeiten in frühen Tests um etwa **8x** zurückgegangen sind. Für jeden, der 30+ Sekunden darauf gewartet hat, dass ein großes TypeScript-Projekt in VS Code reagiert, ist diese Zahl relevant.

## Node.js Type Stripping: TypeScript Ohne Transpiling Ausführen

Parallel zur nativen Compiler-Arbeit hat Node.js nativen TypeScript-Support durch eine Funktion namens **Type Stripping** ausgeliefert. Das ist ein fundamental anderer Ansatz zum Ausführen von TypeScript — anstatt `.ts`-Dateien in `.js` zu kompilieren, kann Node.js TypeScript jetzt direkt ausführen, indem es Type-Annotationen vor der Ausführung entfernt.

Der Zeitplan bewegte sich schnell:
- Node.js 22.18.0 (Juli 2025) aktivierte Type Stripping standardmäßig
- Warnungen wurden in v24.3.0/22.18.0 entfernt
- Das Feature stabilisierte sich in v25.2.0

Der Schlüsselunterschied liegt zwischen **löschbarer Syntax** (Types, Interfaces — alles, was zur Laufzeit verschwindet) und **Laufzeitsyntax** (Enums, Namespaces — Dinge, die tatsächliches JavaScript erzeugen). Type Stripping funktioniert sauber für erstere. Für letztere hat das Node.js-Team ein `--erasableSyntaxOnly`-Flag eingeführt, das diese Trennung explizit erzwingt.

Das bedeutet, Sie können jetzt eine TypeScript-Datei schreiben und sie mit `node file.ts` ausführen — kein Build-Schritt, keine Transpilierung. Für Skripte, CLIs und schnelles Prototyping ist das eine signifikante Workflow-Verbesserung. Für Produktions-Builds möchten Sie immer noch `tsc` für Cross-Targeting und vollständige Typprüfung, aber die Lücke zwischen „Ich möchte etwas ausprobieren" und „Code ausführen" schrumpft erheblich.

## Was Entwickler Jetzt Tun Müssen

Der Übergang ist nicht automatisch und es gibt konkrete Schritte, die sich vor der Verschiebung lohnt zu unternehmen:

**Prüfen Sie die Enum- und Namespace-Nutzung.** Das sind TypeScript-Features, die keine saubere löschbare Entsprechung haben. Enums können durch `as const`-Objekte ersetzt werden ; Namespaces können zu ES-Modulen migrieren. Wenn Ihre Codebase eines von beiden stark nutzt, starten Sie die Migration jetzt.

**Aktivieren Sie `--erasableSyntaxOnly` in der CI.** Dies markiert nicht-löschbare TypeScript-Syntax in Ihrer Codebase und gibt Ihnen eine klare Migrations-Roadmap, bevor Type-Stripping zum Standardverhalten wird.

**Fügen Sie TypeScript 7 Preview zu CI-Pipelines hinzu.** Das `@typescript/native-preview`-npm-Tag ermöglicht es Ihnen, den Go-basierten Compiler heute gegen Ihre Codebase zu testen. Es wird Ihre Produktions-Builds noch nicht ersetzen, aber es deckt Probleme auf, bevor die Migration landet.

**Achten Sie auf Strict-by-Default-Änderungen.** [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) erwägt, den `strict`-Modus zum Standard für neue Projekte zu machen. Wenn Sie das Aktivieren der Strict-Prüfungen aufgeschoben haben, ist jetzt der Zeitpunkt — es wird nicht mehr lange optional sein.

## Das Größere Bild

Zwei Kräfte konvergieren. Die erste ist die Compiler-Performance: Ein nativer TypeScript-Compiler löst den größten Schmerzpunkt im täglichen Entwicklerlebnis — langsamen Editor-Start und träge Typprüfung in großen Codebases. Die zweite ist der Runtime-Support: Node.js, das TypeScript nativ ausführt, entfernt den letzten Reibungspunkt zwischen dem Schreiben einer typannotierten Datei und deren Ausführung.

Zusammen bewegen sie TypeScript von „einer Sprache, die nach JavaScript kompiliert" hin zu etwas näher an einer erstklassigen Systemsprache für das JavaScript-Ökosystem. Ob das eine gute Sache ist, hängt von Ihrer Perspektive ab — aber die Richtung ist klar und die Performance-Gewinne sind real.

Die JavaScript-basierte TypeScript-Ära ist noch nicht vorbei. Aber TypeScript 7, mit seinem Go-basierten Compiler und der Node.js Type-Stripping-Funktion, die es ermöglicht, ist der Beginn eines anderen Kapitels.
