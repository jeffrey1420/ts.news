---
title: "TypeScript 7 Native Preview: Project Corsa schreibt den Compiler in Go um — und das verändert alles"
description: "Microsofts Entscheidung, den TypeScript-Compiler und den Sprachservice nach Go zu portieren, ist nicht nur eine Tech-Demo — frühe Benchmarks zeigen, dass die VS-Code-Codebasis in 7,5 Sekunden statt 77,8 Sekunden kompiliert. Hier ist, was die Native-Ära für Ihre Build-Pipeline und Editor-Performance bedeutet."
date: "2026-03-23"
category: "news"
author: lschvn
tags: ["typescript", "compiler", "performance", "go", "tooling", "project-corsa", "nodejs"]
readingTime: 12
image: "https://opengraph.githubassets.com/80d818d1ffc6c3698c6a86f9be7dc3212b3713a3d3403d7bdb434efaba84e7fa/microsoft/TypeScript"
tldr:
  - "Project Corsa portiert den TypeScript-Compiler nach Go und reduziert die VS-Code-Kompilierung von 77,8 s auf 7,5 s — etwa 10x schneller."
  - "TypeScript 6.0 wird die letzte JS-basierte Version; TypeScript 7 ist die Native-Go-Ära mit Shared-Memory-Multithreading."
  - "Node.js führt TypeScript jetzt nativ über Type Stripping aus (stabil seit v25.2.0), standardmäßig aktiviert seit Node 22.18.0."
  - "Entwickler sollten Enums und Namespaces jetzt prüfen — diese nicht-löschbaren Features funktionieren unter Type Stripping nicht ohne Migration."
faq:
  - question: "Wann wird TypeScript 7.0 veröffentlicht?"
    answer: "Microsoft hat angegeben, dass TypeScript 7.0 später in 2026 erscheinen wird. Das Native Preview basierend auf dem Go-Compiler ist bereits über den @typescript/native-preview npm-Tag verfügbar, um Ihre Codebasis heute zu testen."
  - question: "Wie viel schneller ist der Go-basierte TypeScript-Compiler?"
    answer: "Die frühen Benchmarks sind dramatisch. Die VS-Code-Codebasis kompiliert in 7,5 Sekunden statt 77,8 Sekunden mit dem JavaScript-basierten Compiler — eine etwa 10-fache Verbesserung. Die Playwright-Test-Suite sank von 11,1 Sekunden auf 1,1 Sekunden. Die Projekt-Ladezeiten in VS Code verbesserten sich ebenfalls um etwa 8x."
---

Microsofts VS-Code-Codebasis kompiliert in 7,5 Sekunden unter dem TypeScript 7 Native Preview — gegenüber 77,8 Sekunden mit dem aktuellen JavaScript-basierten Compiler. Das ist eine 10× Verbesserung, und es ist das Haupt-Ergebnis von Project Corsa, Microsofts vollständiger Neuschreibung des TypeScript-Compilers und Sprachservices in Go.

TypeScript 7 ändert das. Oder besser gesagt, es wird es ändern — aber das Preview ist bereits da, und die Zahlen sind schwer zu bestreiten.

## Project Corsa: Der Native Port

Anfang 2025 kündigte Microsoft [Project Corsa](https://devblogs.microsoft.com/typescript/typescript-native-port/) an, einen vollständigen nativen Port des TypeScript-Compilers und Sprachservices nach Go. Das Ziel war ehrgeizig: ~10x schnellere Build-Zeiten und deutlich verbesserte Editor-Responsivität.

Die anfänglichen Benchmarks waren beeindruckend. Auf der VS-Code-Codebasis selbst — einem großen, realen TypeScript-Projekt — sank die Kompilierung von **77,8 Sekunden auf 7,5 Sekunden**. Bei der Playwright-Test-Suite ging es von 11,1 Sekunden auf 1,1 Sekunden. Das sind keine synthetischen Mikro-Benchmarks. Es ist dieselbe Codebasis, die Microsoft für VS Code verwendet, auf derselben Hardware.

Der Port ist noch nicht vollständig. [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) bleibt die JavaScript-basierte Version, über die das Ökosystem die Transition durchführt. Microsoft hat angegeben, dass TypeScript 6.0 die letzte Major-Version auf dem JS-basierten Toolchain sein wird. TypeScript 7 ist, wo die Native-Ära richtig beginnt.

## Was „Native" in der Praxis bedeutet

Es gibt zwei Dimensionen dessen, was TypeScript 7 ändert, und es lohnt sich, sie zu trennen.

**Der Compiler (`tsc`)** — Der Kommandozeilen-TypeScript-Compiler. Ein Go-basierter `tsc` bedeutet schnellere Kompilierungen, geringeren Speicherverbrauch während Builds und bessere Integration mit Nicht-JavaScript-Toolchains. Für Projekte, die `tsc` als Teil von CI-Pipelines ausführen, übersetzt sich das direkt in schnellere Feedback-Zyklen.

**Der Sprachservice** — Das ist, was VS Codes IntelliSense, Fehler-Unterstreichung, Sprung-zu-Definition und Refactoring antreibt. Die Editor-Performance wird vom Sprachservice limitiert, nicht vom Compiler. Microsoft berichtet, dass die Projekt-Ladezeiten in frühen Tests um etwa **8x** gesunken sind. Für jeden, der schon einmal 30+ Sekunden auf ein großes TypeScript-Projekt warten musste, bis es in VS Code reagiert, ist diese Zahl wichtig.

## Node.js Type Stripping: TypeScript ohne Transpilierung ausführen

Parallel zur Arbeit am nativen Compiler hat Node.js nativen TypeScript-Support über eine Funktion namens **Type Stripping** ausgeliefert. Das ist ein grundlegend anderer Ansatz zum Ausführen von TypeScript — statt `.ts`-Dateien in `.js` zu kompilieren, kann Node.js jetzt TypeScript direkt ausführen, indem es Typ-Annotationen vor der Ausführung entfernt.

Der Zeitplan ging schnell voran:
- Node.js 22.18.0 (Juli 2025) aktivierte Type Stripping standardmäßig
- Warnungen wurden in v24.3.0/22.18.0 entfernt
- Die Funktion stabilisierte sich in v25.2.0

Die Schlüsselunterscheidung liegt zwischen **löschbarer Syntax** (Typen, Interfaces — alles, was zur Laufzeit verschwindet) und **Laufzeit-Syntax** (Enums, Namespaces — Dinge, die tatsächliches JavaScript erzeugen). Type Stripping funktioniert sauber für Ersteres. Für Letzteres hat das Node.js-Team ein `--erasableSyntaxOnly`-Flag eingeführt, das diese Trennung explizit erzwingt.

Das bedeutet, Sie können jetzt eine TypeScript-Datei schreiben und mit `node file.ts` ausführen — kein Build-Schritt, keine Transpilierung. Für Skripte, CLIs und schnelles Prototyping ist das eine bedeutende Workflow-Verbesserung. Für Produktions-Builds werden Sie immer noch `tsc` für Cross-Targeting und vollständige Typprüfung wollen, aber die Lücke zwischen „ich will etwas ausprobieren" und „Code ausführen" schrumpft erheblich.

## Was Entwickler jetzt tun müssen

Der Übergang ist nicht automatisch, und es gibt konkrete Schritte, die vor der Umstellung lohnen:

**Enum- und Namespace-Nutzung prüfen.** Das sind die TypeScript-Features, die kein sauberes löschbares Äquivalent haben. Enums können durch `as const`-Objekte ersetzt werden; Namespaces können zu ES-Modulen migrieren. Wenn Ihre Codebasis eines davon intensiv nutzt, starten Sie die Migration jetzt.

**`--erasableSyntaxOnly` in CI aktivieren.** Dies kennzeichnet jede nicht-löschbare TypeScript-Syntax in Ihrer Codebasis und gibt Ihnen eine klare Migrations-Roadmap, bevor Type Stripping zum Standardverhalten wird.

**TypeScript 7 Preview zu CI-Pipelines hinzufügen.** Der `@typescript/native-preview` npm-Tag ermöglicht es Ihnen, den Go-basierten Compiler heute gegen Ihre Codebasis zu testen. Er wird Ihren Produktions-Build noch nicht ersetzen, aber er deckt Probleme auf, bevor die Migration ansteht.

**Auf Strict-by-Default-Änderungen achten.** [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release) erwägt, den `strict`-Modus als Standard für neue Projekte zu setzen. Wenn Sie die Aktivierung strikter Prüfungen aufgeschoben haben, ist jetzt der Zeitpunkt — es wird nicht mehr lange optional sein.

## Das große Bild

Zwei Kräfte konvergieren. Die erste ist Compiler-Leistung: Ein nativer TypeScript-Compiler löst den größten Schmerzpunkt in der täglichen Entwickler-Erfahrung — langsamen Editor-Start und träges Typprüfen in großen Codebasen. Die zweite ist Laufzeit-Unterstützung: Node.js, das TypeScript nativ ausführt, entfernt den letzten Reibungspunkt zwischen dem Schreiben einer typ-annotierten Datei und ihrer Ausführung.

Zusammen bewegen sie TypeScript von „eine Sprache, die zu JavaScript kompiliert" zu etwas, das näher an einer erstklassigen Systemsprache für das JavaScript-Ökosystem ist. Ob das gut ist, hängt von Ihrer Perspektive ab — aber die Richtung ist klar, und die Leistungsgewinne sind real.

Die JavaScript-basierte TypeScript-Ära ist noch nicht vorbei. Aber TypeScript 7, mit seinem Go-basierten Compiler und der Node.js-Type-Stripping-Funktion, die es ermöglicht, ist der Beginn eines anderen Kapitels.
