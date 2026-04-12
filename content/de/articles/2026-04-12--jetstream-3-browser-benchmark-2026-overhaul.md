---
title: "JetStream 3: Der Benchmark, der Endlich die Realität Moderner Web-Apps Abbildet"
description: "WebKit, Google und Mozilla haben JetStream 3 veröffentlicht — die erste größere Überarbeitung der Benchmark-Suite seit 2019. Er verzichtet auf Microbenchmarks zugunsten realistischer Workloads, überarbeitet das WebAssembly-Scoring und führt Dart, Kotlin und Rust nach Wasm kompiliert ein."
image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=630&fit=crop"
date: "2026-04-12"
category: Standards
author: lschvn
readingTime: 6
tags: ["JetStream", "Benchmark", "WebAssembly", "JavaScript", "WebKit", "Browser", "Performance", "Wasm"]
tldr:
  - "JetStream 3 ersetzt das alte Startup/Runtime Wasm-Scoring durch ein einheitliches Lebenszyklusmodell, das der Arbeitsweise von JavaScript-Benchmarks entspricht — Engines optimieren nun für die vollständige Ausführung, nicht nur für Instantiierungsgeschwindigkeit."
  - "Der Benchmark umfasst jetzt 12 WebAssembly-Workloads in C++, C#, Dart, Java und Kotlin, mit Coverage für WasmGC, SIMD und Exception Handling — und bildet damit die Realität deutlich besser ab als die asm.js-Überreste von 2019."
  - "WebKits JavaScriptCore-Team dokumentierte eine 40-prozentige WasmGC-Verbesserung durch Inlining von GC-Allokationen direkt in generierten Maschinencode und Umstrukturierung von Object-Layouts zur Eliminierung von Doppelallokationen."
faq:
  - q: "Was ist der Unterschied zwischen JetStream 2 und JetStream 3?"
    a: "JetStream 2 stammte aus 2019. Sein WebAssembly-Scoring verwendete zwei separate Phasen — Startup und Runtime — die obsolet wurden, als Engines schneller wurden. JetStream 3 behandelt Wasm wie JavaScript: Ausführung des vollständigen Lebenszyklus über mehrere Iterationen hinweg, die erstmalige Kompilierung, worst-case Ruckler und durchschnittlichen Durchsatz in einer geometrischen Mitteilung erfassen."
  - q: "Warum haben die drei Browser-Engines zusammengearbeitet?"
    a: "Benchmarks sind nur nützlich, wenn sie echte Optimierungen vorantreiben. Eine einzelne Engine, die ihren eigenen Benchmark veröffentlicht, wäre parteiisch. Durch das Poolen von Expertise aus WebKit (Safari), V8 (Chrome) und SpiderMonkey (Firefox) hat JetStream 3 die Glaubwürdigkeit, alle drei Engines zu beeinflussen — zum Vorteil von Entwicklern in jedem Browser."
  - q: "Was sind WasmGC, SIMD und Exception Handling in Wasm?"
    a: "WasmGC fügt WebAssembly einen Garbage-collected Heap (Structs und Arrays) hinzu und ermöglicht Sprachen wie Dart, Kotlin und Java, mit idiomatischen Allokationsmustern nach Wasm zu kompilieren. SIMD (Single Instruction Multiple Data) lässt eine Instruktion auf mehreren Daten parallel operieren — entscheidend für Codecs, Bildverarbeitung und ML-Inferenz. Exception Handling lässt Wasm Exceptions werfen und fangen, passend zum Kontrollfluss von C++ und Java."
  - q: "Was ist Cohens Type-Display-Algorithmus?"
    a: "Eine Technik für schnelle Subtyp-Prüfungen: Jeder Typ speichert ein Array fester Größe (das 'Display') mit Pointern zu allen Ancestor-Typen. Um zu prüfen, ob Typ A ein Subtyp von B ist, schaut die Engine einen Eintrag in As Display an Bs Vererbungstiefe und vergleicht Pointer — O(1) statt eine Parent-Kette zu durchlaufen. WebKit hat die ersten sechs Einträge direkt in jedem Typ-Record eingebettet, damit der Normalfall innerhalb einer Cache-Line bleibt."
---

Benchmarks sind nur nützlich, wenn sie echte Verbesserungen vorantreiben. Und ein Benchmark, der Engines dafür belohnt, sich spezifisch für sich selbst zu optimieren — statt für echte Anwendungen — wird über die Zeit kontraproduktiv.

Das ist das Kernproblem, das JetStream 3 löst. Veröffentlicht vergangene Woche von Ingenieuren von WebKit, Google und Mozilla, ist es die erste größere Überarbeitung der JetStream-Suite seit 2019. Das Web hat sich in sieben Jahren dramatisch verändert, und der alte Benchmark begann, sein Alter auf Weisen zu zeigen, die den Leistungsfortschritt tatsächlich behinderten.

## Die Microbenchmark-Falle

Das ursprüngliche JetStream 2 bewertete WebAssembly in zwei Phasen: einer Startup-Messung in einer einzelnen Iteration und einer längeren Runtime-Messung. Die Idee war bei der Veröffentlichung vernünftig — frühe Wasm-Adopter kompilierten große C- und C++-Anwendungen (Spiele, Codecs), bei denen Nutzer eine einmalige Startkosten für dauerhaften Durchsatz tolerieren würden.

Aber Engines wurden schnell. Wirklich schnell. WebKit optimierte den Wasm-Instantiierungspfad so aggressiv, dass bei kleineren Workloads die Startzeit effektiv null Millisekunden erreichte. Und weil JetStream 2 `Date.now()` zur Zeitmessung verwendete — was abrundet — wurden Sub-Millisekunden-Zeiten als 0ms erfasst. Die Scoring-Formel `Score = 5000 / Zeit` produzierte dann Unendlich.

Das Team patchte dies durch Clamping des Scores auf 5000, aber es war ein klares Signal: Die Benchmark-Methodik hatte ihr Thema überholt. Ein "unendlicher" Score sagt Ihnen nichts Nützliches darüber, wie eine Engine echte Workloads handhabt. Und eine Startzeit von null in einem Microbenchmark ignoriert, was *nach* der Instantiierung passiert — die eigentliche Arbeit, die Ihre Anwendung leistet.

## Einheitliches Scoring für Wasm

JetStream 3 ersetzt das gespaltene Startup/Runtime-Modell und übernimmt dieselbe Methodik wie für JavaScript-Benchmarks. Jeder Wasm-Workload läuft jetzt über mehrere Iterationen und erfasst:

- **Erste Iteration** — Kompilierung und initiale Einrichtung
- **Worst-Case-Iterationen** — Ruckler, GC-Pausen und Tiering-Spitzen
- **Durchschnitts-Iterationen** — dauerhafter Durchsatz

Diese werden geometrisch gemittelt in einen einzelnen Subtest-Score, der in die geometrische Mitte des vollständigen Benchmarks einfließt. Engines haben nun Anreize, den *gesamten* Lebenszyklus einer Wasm-Instanz zu optimieren, nicht nur die Instantiierung.

## Echte Sprachen, Echte Toolchains

Die Wasm-Workloads von JetStream 3 sind aus fünf Quellsprachen kompiliert: C++, C#, Dart, Java und Kotlin. Das bildet ab, wie Wasm tatsächlich in der Produktion verwendet wird — nicht nur C++-Spiel-Engines, sondern auch Dart und Kotlin über WasmGC (verwendet von modernen Web-Frameworks wie Flutter) und Rust für performancekritische Module.

Die neuen Workloads exercisen Wasm-Features, die JetStream 2 kaum streifte:

- **WasmGC** — Garbage-collected Heap-Allokationen (Structs, Arrays), die idiomatsche Muster aus höheren Sprachen ermöglichen
- **SIMD** — eine Instruktion, mehrere Daten für parallele Datenverarbeitung
- **Exception Handling** — strukturiertes Werfen und Fangen von Exceptions

Die JavaScript-Coverage wurde ebenfalls aktualisiert: Promises und async Funktionen, moderne RegExp-Features und öffentliche/private Klassen-Felder. Mehrere asm.js-Workloads wurden entfernt — die Technologie wurde von WebAssembly überholt.

## Die Ingenieurskunst Hinter WebKits Gewinnen

Das WebKit-Team veröffentlichte eine detaillierte Aufschlüsselung ihrer JavaScriptCore-Optimierungen für JetStream 3. Die Ergebnisse sind substanziell:

**GC-Allocation-Inlining**: WasmGC-Programme erzeugen Millionen kleiner Objekte. Die ursprüngliche JSC-Implementierung rief für jede Allokation eine C++-Funktion auf. Zwei Änderungen lieferten ~40% Verbesserung bei WasmGC-Subtests:

1. Änderung des Object-Layouts, damit Structs und Arrays Feldendaten *inline* nach dem Header in einer einzelnen Allokation speichern, was die zweite Allokation und Pointer-Indirektion eliminiert
2. Inlining des Fast-Path für Allokationen direkt in generierten Maschinencode — eine kurze Instruktionssequenz, die einen Pointer erhöht, den Header schreibt und zurückkehrt, ohne generierten Code zu verlassen

**Type-Display-Inlining**: WasmGC-Sprachen verlassen sich stark auf Runtime-Typprüfungen (Casts, instanceof-Tests, indirekte Funktionsaufrufe). WebKit implementierte Cohen's Type-Display-Algorithmus und inlinte ihn in beide Compiler — Baseline (BBQ) und Optimizer (OMG). Sie betteten auch die ersten sechs Display-Einträge direkt in jeden Typ-Record ein, damit flache Hierarchien keine Pointer-Indirektion benötigen und in einer einzelnen Cache-Line bleiben.

**Eliminierung von GC-Destruktor-Overhead**: Zuvor hielt jedes WasmGC-Objekt eine Referenz auf seine Typdefinition und führte beim Abbau einen Destruktor aus — der den Referenzzähler unter einem globalen Lock dekrementieren musste. Die Umstrukturierung der Typinformation zur Nutzung des existierenden Garbage-Collector-Structure-Mechanismus eliminierte Destruktoren vollständig und lieferte weitere ~40% beim dart-flute-wasm-Subtest.

## Warum Das für JavaScript-Entwickler Relevant Ist

Browser-Benchmarks klingen nach Browser-Engineer-Trivia, aber sie haben direkte praktische Konsequenzen. Wenn Engines sich für Benchmarks optimieren, profitieren alle Web-Anwendungen — die Optimierungen sind real, die Workloads sind nur ein Proxy.

Der Shift von JetStream 3 weg von Microbenchmarks hin zu größeren, länger laufenden Workloads bedeutet, dass die Optimierungen, die Engines verfolgen, die sein werden, die in Produktionsanwendungen zählen. Eine 40-prozentige Verbesserung bei einem WasmGC-Subtest bedeutet, dass Flutter-Web-Apps, Kotlin-zu-Wasm-Tools und jede Anwendung, die Wasm für rechenintensive Aufgaben nutzt, in Safari schneller laufen werden.

Die Zusammenarbeit der drei großen Engines ist ebenfalls bemerkenswert. JetStream 3 verwendet ein offenes Governance-Modell, mit Beiträgen in einem gemeinsamen GitHub-Repository gepoolt. Das Ziel ist ein Benchmark, für den alle Engines ehrlich zu optimieren motiviert sind — was ihn letztlich für Entwickler nützlich macht.

JetStream 3 ist jetzt verfügbar unter [browserbench.org](https://browserbench.org/JetStream3.0/).
