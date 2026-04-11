---
title: "Google JSIR: Eine MLIR-basierte Zwischenrepräsentation für JavaScript-Analyse"
description: "Google hat JSIR quelloffen gemacht, ein neuartiges JavaScript-Analysewerkzeug auf MLIR-Basis. Es unterstützt sowohl hochrangige Datenflussanalyse als auch verlustfreie Quellcode-Transformation — intern genutzt für Hermes-Bytecode-Dekompilierung und KI-gestützte JavaScript-Deobfuskation."
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop"
date: "2026-04-11"
category: Open Source
author: lschvn
readingTime: 5
tags: ["Google", "JSIR", "MLIR", "JavaScript", "Werkzeuge", "Analyse", "Dekompilierung", "Open Source"]
tldr:
  - "JSIR ist Googles neue MLIR-basierte Zwischenrepräsentation für JavaScript, die sowohl hochrangige Datenflussanalyse als auch verlustfreie Quellcode-Transformation gleichzeitig unterstützt — eine Kombination, die bestehende IRs typischerweise opfern."
  - "Google nutzt JSIR intern bereits für die Dekompilierung von Hermes-Bytecode und KI-gestützte JavaScript-Deobfuskation, wobei Gemini LLM mit JSIR kombiniert wird, um obfuskierten Code rückgängig zu machen."
  - "Das Projekt richtet sich an Werkzeugentwickler: bessere Linter, intelligentere Bundler, leistungsfähigere Refactoring-Tools — nicht direkt an Endentwickler, aber die Auswirkungen wird das Ökosystem downstream spüren."
faq:
  - q: "Was unterscheidet JSIR von anderen JavaScript-IRs?"
    a: "Die meisten IRs für JavaScript müssen sich zwischen Hochrangig (genug Struktur bewahren, um Quellcode wiederherzustellen) und Niedrigrangig (ermöglicht tiefe Datenflussanalyse) entscheiden. Die meisten Systeme wählen eines. JSIR nutzt MLIR-Regionen, um die Kontrollflussstrukturen von JavaScript — Closures, try-catch-finally, Async-Funktionen, Generator-Frames — so präzise zu modellieren, dass beide Richtungen gleichzeitig unterstützt werden."
  - q: "Was ist MLIR?"
    a: "MLIR (Multi-Level Intermediate Representation) ist ein LLVM-Projekt, das ein flexibles Framework für Zwischenrepräsentationen bietet. Es wurde entwickelt, um verschiedene IRs in der Compiler-Infrastruktur zu vereinheitlichen. Durch den Aufbau von JSIR auf MLIR erhält Google Kompatibilität mit dem breiteren LLVM-Ökosystem und dessen Tools."
  - q: "Was ist Hermes-Bytecode?"
    a: "Hermes ist Facebooks JavaScript-Engine, die für React Native optimiert ist. Sie kompiliert JavaScript zu Hermes-Bytecode für schnellere Startzeiten. JSIR kann diesen Bytecode zurück nach JavaScript dekomilieren, indem es seine Quellcode-Hebbarkeit nutzt — eine Fähigkeit, die bestehenden Tools fehlt."
  - q: "Wie ermöglicht JSIR KI-Deobfuskation?"
    a: "Google hat Forschung veröffentlicht (CASCADE-Paper, arXiv:2507.17691), die zeigt, wie sie Gemini LLM mit JSIR zur JavaScript-Deobfuskation kombinieren. JSIRs strukturierte Darstellung liefert der KI eine saubere, analysierbare Ansicht des obfuskierten Codes, und die KI kann Transformationen generieren, die JSIR dann zurück auf den Quellcode anwendet."
---

Wenn eine Compiler-Zwischenrepräsentation (IR) in den Nachrichten auftaucht, weiß man, dass sie wichtig ist. Google hat [JSIR](https://github.com/google/jsir) veröffentlicht, ein neuartiges JavaScript-Analysewerkzeug auf [MLIR](https://mlir.llvm.org)-Basis, das bereits intern für Aufgaben eingesetzt wird, die zeigen, wie ambitioniert das Projekt ist: Dekomilierung von Hermes-Bytecode zurück nach JavaScript und KI-gestützte Deobfuskations-Pipelines, die JSIR mit Gemini kombinieren.

## Warum das für Werkzeuge wichtig ist

Eine Zwischenrepräsentation ist die Datenstruktur, die ein Compiler oder Analysewerkzeug verwendet, um Code zwischen Parsing und Codegenerierung darzustellen. Wenn ein AST sagt, wie der Code strukturell aussieht, sagt eine IR, was er *tut*. Die Qualität der IR bestimmt, welche Art von Analyse und Transformation möglich ist.

JavaScript-Tooling hat lange unter fragmentierten IR-Ansätzen gelitten. Babel-Plugins arbeiten auf ASTs. ESLint-Regeln arbeiten auf ASTs. Bundler arbeiten oft mit eigenen internen Repräsentationen mit begrenzter Interoperabilität. Eine gemeinsame, gut gestaltete IR könnte es diesen Tools ermöglichen, Analyses工作 zu teilen — und genau das schlägt Google mit JSIR vor.

## Hoch- und Niedrigrangig gleichzeitig

Die zentrale technische Herausforderung, die JSIR löst, ist eine bekannte im Compiler-Design: Man muss sich typischerweise zwischen einer hochrangigen IR (bewahrt AST-Struktur, kann zu Quellcode angehoben werden) und einer niedrigrangigen IR (ermöglicht tiefe Datenflussanalyse wie Taint-Tracking und Konstantenpropagation) entscheiden. Die meisten Systeme wählen eines.

JSIR nutzt MLIR-Regionen, um JavaScripts Kontrollflussstrukturen — Closures, try-catch-finally, Async-Funktionen, Generator-Frames — präzise so zu modellieren, dass beide Richtungen gleichzeitig unterstützt werden. Man kann Code transformieren und zu Quellcode anheben, oder Taint-Analyse auf derselben Repräsentation ausführen.

Dies ermöglicht Anwendungsfälle, die zuvor unpraktisch waren:

**Dekomilierung**: JSIR wird bei Google eingesetzt, um Hermes-Bytecode komplett zurück nach JavaScript zu dekomilieren. Hermes kompiliert React Native Apps zu kompaktem Bytecode für schnellere Starts; JSIRs Quellcode-Hebbarkeit ist, was diese Dekomilierung möglich macht, wo andere Tools an eine Wand stoßen würden.

**Deobfuskation**: Google hat Forschung ([CASCADE](https://arxiv.org/abs/2507.17691)) zur Kombination von Gemini LLM mit JSIR für JavaScript-Deobfuskation veröffentlicht. Die KI arbeitet auf JSIRs strukturierter Repräsentation statt auf rohem obfuskiertem Quellcode und erzeugt Transformationen, die JSIR anwendet, um sauberen Code zu rekonstruieren.

## Die MLIR-Grundlage

JSIR ist kein eigenständiges Projekt — es basiert auf MLIR, dem flexiblen IR-Framework des LLVM-Projekts. Das ist bedeutsam für die Ökosystem-Kompatibilität: MLIR hat bereits eine breite Palette existierender Dialekte, Transformationen und Tools. Durch die Ausdrucksweise der JavaScript-Analyse in MLIR-Begriffen kann sich JSIR in dieses Ökosystem einklinken, anstatt Infrastruktur neu zu erfinden.

## Erste Schritte

JSIR ist auf GitHub unter [github.com/google/jsir](https://github.com/google/google/tree/main/jsir) verfügbar. Das Projekt empfiehlt Docker für lokale Experimente:

```bash
docker build -t jsir:latest .
docker run --rm -v $(pwd):/workspace jsir:latest jsir_gen --input_file=/workspace/yourfile.js
```

Der Build aus den Quellen erfordert clang, Bazel und erhebliche Build-Zeit — das Projekt weist darauf hin, dass das Abrufen und Kompilieren von LLVM Zeit braucht. Der Docker-Weg ist der praktische Einstiegspunkt für die meisten Entwickler.

## Was das für das Ökosystem bedeutet

Die meisten Entwickler werden in naher Zukunft nicht direkt mit JSIR interagieren — es ist eine Grundlage, auf der Werkzeugentwickler aufbauen. Aber die langfristigen Implikationen sind bedeutsam. Eine geteilte, gut gestaltete IR könnte ermöglichen:

- Linter mit tieferem semantischem Verständnis (nicht nur Musterabgleich auf AST-Knoten)
- Bundler mit besserer Todcode-Elimination durch Datenflussanalyse
- Refactoring-Tools, die Code sicher über komplexe Kontrollflüsse hinweg transformieren können
- Cross-Framework-Analyse, die unabhängig vom verwendeten Framework oder Build-Tool konsistent funktioniert

Google hat es quelloffen gemacht, was bedeutet, dass die Community auf dieser Grundlage aufbauen kann. Ob es an Traktion gewinnt, hängt davon ab, ob Tool-Maintainer genügend Vorteile sehen, um JSIR-basierte Analyse in ihre Pipelines zu integrieren — aber die technische Grundlage ist solide.
