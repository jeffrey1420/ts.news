---
title: "numpy-ts 1.2: Bit-genaue NumPy-RNG-Parität und Float16-Support in purem TypeScript"
description: "Die reine TypeScript-Implementierung von NumPy erreicht einen Korrektheits-Meilenstein: Die Zufallszahlengenerierung stimmt jetzt Bit für Bit mit NumPy überein, Float16 kommt als vollwertiger dtype, und das Paket braucht keine Runtime-spezifischen Entry-Points mehr."
date: 2026-04-01
image: "/images/heroes/2026-04-01-numpy-ts-1-2-half-native-performance.png"
author: lschvn
tags: ["javascript", "typescript", "performance"]
faq:
  - question: "Was ist numpy-ts?"
    answer: "numpy-ts ist eine reine TypeScript-Implementierung der NumPy-API von Nico Dupont, die in Browsern, Node.js, Bun und Deno ohne native Abhängigkeiten läuft. Sie deckt rund 94 % der NumPy-API ab (476 von 507 Funktionen) und validiert ihre Ausgaben mit über 6.000 Tests direkt gegen NumPy."
  - question: "Wie schnell ist es im Vergleich zum echten NumPy?"
    answer: "Langsamer, der Autor misst im Schnitt etwa 15x langsamer als natives NumPy, was für pures JavaScript gegen C/BLAS zu erwarten ist. Die Optimierungs-Roadmap umfasst algorithmische Verbesserungen und gezieltes WebAssembly. Für Preprocessing, Statistik und interaktive Browser-Tools reicht es in der Regel; für schweres Number-Crunching gewinnt natives NumPy deutlich."
  - question: "Was bedeutet bit-genaue RNG-Parität und warum ist sie wichtig?"
    answer: "Mit demselben Seed erzeugt numpy-ts 1.2 exakt dieselbe Zufallszahlenfolge wie NumPy, nicht statistisch ähnlich, sondern identisch. Das zählt beim Reproduzieren von Experimenten, beim Portieren von Test-Fixtures und beim Validieren eines TypeScript-Ports von Python-Code gegen dessen Referenzausgabe."
  - question: "Kann ich mit numpy-ts Machine-Learning-Modelle trainieren?"
    answer: "numpy-ts ist für inferenznahe Arbeit und allgemeines numerisches Rechnen gedacht, nicht fürs Training. Für ML-Training im Browser lohnt sich ein Blick auf WebGPU-basierte Projekte wie JAX.js. Für Daten-Preprocessing, Visualisierungs-Pipelines und statistische Operationen ist numpy-ts dagegen gut geeignet."
tldr:
  - "numpy-ts 1.2 erzeugt aus demselben Seed Bit für Bit identische Zufallszahlenfolgen wie NumPy, frühere Versionen wichen nach den ersten Werten ab."
  - "Float16 (halbe Präzision) kommt als vollwertiger dtype, obwohl JavaScript kein natives float16 kennt, nützlich für ML-nahe Workflows und Signalverarbeitung."
  - "Ein Entry-Point funktioniert jetzt auf Node.js, Bun, Deno und im Browser; die Runtime-spezifischen Imports sind Geschichte."
  - "Mit ~94 % API-Abdeckung, validiert gegen NumPy selbst, ist numpy-ts der vollständigste NumPy-Port im JavaScript-Ökosystem. Schnell ist er nicht (~15x langsamer als natives NumPy), er ist kompatibel, und genau darum geht es."
---

[numpy-ts](https://numpyts.dev), die vollständigste komplett in TypeScript geschriebene NumPy-Implementierung, hat Version 1.2 veröffentlicht, und die Schlagzeile ist nicht Geschwindigkeit. Sie ist strenger: **Mit demselben Seed erzeugt numpy-ts jetzt exakt dieselben Zufallszahlen wie NumPy, Bit für Bit.** Daneben bringt das Release vollwertigen **Float16-Support** und führt die Runtime-spezifischen Entry-Points zu einem Paket zusammen, das überall läuft.

## Welches Problem numpy-ts lösen will

Pythons NumPy ist der De-facto-Standard für Array-Computing, lineare Algebra, Signalverarbeitung, Daten-Preprocessing fürs Machine Learning. Diese API nach TypeScript zu bringen, hat offensichtlichen Reiz für Web-Tools, Notebooks und Browser-native Datenanwendungen.

Der schwierige Teil war nie die API-Oberfläche, sondern NumPys *Verhalten* zu treffen. numpy-ts geht das an, indem es direkt gegen NumPy validiert: Über 6.000 Tests vergleichen die Ausgaben mit dem Original, über Arithmetik, FFT, lineare Algebra und Zufallsverteilungen hinweg. Die Abdeckung liegt bei rund **94 % der NumPy-API**, 476 von 507 Funktionen, und macht numpy-ts mit Abstand zum vollständigsten Port im JavaScript-Ökosystem.

## Die RNG-Geschichte: identisch, nicht ähnlich

Vor 1.2 nutzte numpy-ts Annäherungen an NumPys Zufallszahlengenerierung, für Gelegenheitsnutzung ausreichend, aber die Folgen wichen nach den ersten Werten von NumPy ab. Für wissenschaftliche Arbeit ist das disqualifizierend: Man kann kein Paper-Experiment reproduzieren, keine Test-Fixture portieren und keine Migration verifizieren, wenn `seed(42)` andere Zahlen liefert.

Version 1.2 implementiert die Generatoren neu, sodass sie NumPy **Bit für Bit** entsprechen:

```typescript
import { random } from 'numpy-ts';

const rng = random.default_rng(42);
rng.random(3);
// [0.7739560485559633, 0.4388784397520523, 0.8585979199113825]
//, exakt die drei Zahlen, die NumPy für default_rng(42) ausgibt
```

Wer eine NumPy-Pipeline portiert und in Tests auf geseedete Zufallsdaten prüft, kann diese Fixtures jetzt unverändert übernehmen.

## Float16, ohne native Unterstützung

Float16 (halbe Präzision) nutzt 16 Bit pro Zahl und gehört seit Jahren zur GPU-Inferenz, Speicherbandbreite ist meist der Engpass, und halbe Präzision reicht oft. JavaScript kennt keinen nativen float16-Typ, also implementiert numpy-ts Konvertierung und Speicherung selbst, neben Float32, Float64, den Integer-dtypes und komplexen Zahlen.

## Ein Paket, jede Runtime

Bisher brauchten verschiedene Runtimes verschiedene Entry-Points, ein Import für Node, ein anderer für Browser. Version 1.2 vereinheitlicht das: ein Paket, das sich auf Node.js, Bun, Deno und im Browser identisch verhält, bei rund 93 kB minifiziert und gzipped, ohne Abhängigkeiten.

## Und wie schnell ist es ehrlicherweise?

Hier lohnt Präzision: numpy-ts ist **nicht** annähernd so schnell wie natives NumPy, und sein Autor behauptet das auch nicht. NumPy holt seine Geschwindigkeit aus Jahrzehnten von C, BLAS und LAPACK; eine reine TypeScript-Implementierung läuft im Schnitt etwa **15x langsamer**. Die Roadmap zielt auf algorithmische Optimierungen und gezieltes WebAssembly für heiße Pfade.

![Das ehrliche Performance-Bild: natives NumPy vs. numpy-ts](/images/charts/numpy-ts-performance.png)

In der Praxis wiegt die Lücke für die eigentlichen Anwendungsfälle der Bibliothek weniger schwer, als es klingt, ein Dataset in einem Browser-Tool säubern, deskriptive Statistiken berechnen, eine kleine Matrixoperation in einer Visualisierung. Sie wiegt schwer, wenn man echtes numerisches Rechnen auf großen Arrays versucht. Man sollte wissen, in welchem Fall man ist.

## API-Kompatibilität mit NumPy

Ziel des Projekts ist API-Kompatibilität, nicht nur die Konzepte, und der [Migration Guide](https://numpyts.dev) zeigt Übersetzungen Seite an Seite. Der meiste Code lässt sich direkt übertragen:

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.linalg.inv(a)
c = np.dot(a, b)
d = np.sum(a, axis=0)
```

```typescript
import { array, linalg, dot, sum } from 'numpy-ts';

const a = array([[1, 2], [3, 4]]);
const b = linalg.inv(a);
const c = dot(a, b);
const d = sum(a, { axis: 0 });
```

## Loslegen

```bash
npm install numpy-ts
```

Keine Runtime-Abhängigkeiten, läuft auf Node.js (CommonJS und ESM) und in modernen Browsern. Vollständige Dokumentation, Migration Guide und API-Referenz unter [numpyts.dev](https://numpyts.dev), Quellcode auf [github.com/dupontcyborg/numpy-ts](https://github.com/dupontcyborg/numpy-ts).
