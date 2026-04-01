---
title: "numpy-ts 1.2 Erreicht 50% der nativen NumPy-Performance mit Float16-Support"
description: "Die reine TypeScript-Implementierung von NumPy erreicht einen neuen Performance-Meilenstein und fügt Float16-Unterstützung hinzu — ein Schritt hin zu echtem wissenschaftlichem Rechnen im Browser."
date: 2026-04-01
image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "javascript", "numpy", "wissenschaftliches-rechnen", "webassembly", "browser"]
faq:
  - question: "Was ist numpy-ts?"
    answer: "numpy-ts ist eine reine TypeScript-Implementierung der NumPy-API, die ohne native Abhängigkeiten in Browsern und Node.js läuft. Sie deckt etwa 94% der NumPy-API ab und wird gegen die echte NumPy-Testsuite validiert."
  - question: "Wie schnell ist numpy-ts im Vergleich zu nativem NumPy?"
    answer: "Version 1.2 erreicht ungefähr 50% der nativen NumPy-Performance — ein signifikanter Sprung. Für viele webbasierte Anwendungsfälle ist das mehr als ausreichend."
  - question: "Was ist Float16 und warum ist es wichtig?"
    answer: "Float16 (Halbpräzision) verwendet 16 Bits pro Zahl statt 32 oder 64. Es wird häufig im ML-Inferencing verwendet, wo Speicherbandbreite der Flaschenhals ist."
  - question: "Kann man mit numpy-ts ML-Modelle trainieren?"
    answer: "numpy-ts ist für Inferencing und allgemeine numerische Berechnungen gedacht, nicht für Training. Für browserbasiertes ML-Training eignen sich WebGPU-Lösungen wie JAX.js."
tldr:
  - "numpy-ts 1.2 erreicht ~50% der nativen NumPy-Performance in reinem TypeScript/JavaScript, ohne native Binärdateien oder WebAssembly."
  - "Das Release fügt Float16-Dtype-Support hinzu, was speichereffiziente Workflows für ML-Inferencing und Signalverarbeitung ermöglicht."
  - "Mit 94% API-Abdeckung ist numpy-ts die vollständigste NumPy-Portierung im JavaScript-Ökosystem."
  - "Installation: `npm install numpy-ts` — funktioniert in Node.js und modernen Browsern."
---

[numpy-ts](https://numpyts.dev), die umfassendste NumPy-Implementierung in TypeScript, hat Version 1.2 veröffentlicht — ein bedeutender Meilenstein. Die Bibliothek erreicht jetzt etwa **50% der nativen NumPy-Performance** und fügt **Float16-Support** für speichereffiziente numerische Workflows hinzu.

## Das Problem, das numpy-ts löst

Python's NumPy ist der De-facto-Standard für arraybasiertes Rechnen — von linearer Algebra über Signalverarbeitung bis zur Datenvorverarbeitung für Machine Learning. Diese API in JavaScript und TypeScript verfügbar zu machen, ohne auf native Binärdateien oder WebAssembly-Kompilierung zu setzen, erfüllt einen lange bestehenden Bedarf.

Reines JavaScript/TypeScript hatte immer mit demselben Problem zu kämpfen: NumPy erreicht seine Geschwindigkeit durch hochoptimierten C- und Fortran-Code. numpy-ts umgeht das, indem es heiße Pfade optimiert und SIMD-freundliche Datenstrukturen nutzt, wo die JavaScript-Engine es erlaubt — und validiert die Ergebnisse gegen die echte NumPy-Testsuite.

## Float16: der neue Datentyp

Float16 verwendet 16 Bits pro Zahl statt der üblichen 32 oder 64. Es ist ein Standard in der GPU-Programmierung — NVIDIA Tensor Cores arbeiten nativ in Float16 — weil es den Speicherverbrauch drastisch reduziert.

numpy-ts 1.2 fügt Float16 neben Float32, Float64, Int8/16/32, Uint8/16/32 und komplexen Zahlentypen hinzu.

## API-Kompatibilität mit NumPy

Das Projekt zielt auf API-Kompatibilität mit NumPy, nicht nur auf konzeptionelle Ähnlichkeit. Die Dokumentation enthält einen Migrationsleitfaden:

```python
import numpy as np
a = np.array([[1, 2], [3, 4]])
b = np.linalg.inv(a)
```

```typescript
import { array, linalg } from 'numpy-ts';
const a = array([[1, 2], [3, 4]]);
const b = linalg.inv(a);
```

## Installation

```bash
npm install numpy-ts
```

Dokumentation unter [numpyts.dev](https://numpyts.dev).
