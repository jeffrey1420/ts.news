---
title: "Pretext: Die DOM-freie Textmessungsbibliothek, die KI-Coding-Agents bereits verwenden"
description: "Cheng Lou hat Pretext veröffentlicht, eine reine JavaScript-Bibliothek, die mehrzeiligen Text misst und layoutet, ohne das DOM zu berühren. Hier erfahren Sie, warum das für Virtualisierung, Layout-Kontrolle und KI-Agenten wichtig ist, die UI-Code schreiben."
date: "2026-03-31"
image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "typescript", "layout", "performance", "DOM", "library"]
readingTime: 7
tldr:
  - "Pretext (@chenglou/pretext) misst und layoutet mehrzeiligen Text ohne DOM-Zugriff, mit canvas measureText als Grundlage."
  - "Der heiße layout()-Pfad läuft in ~0,09ms für 500 Texte — 10–50x schneller als einzelne getBoundingClientRect()-Aufrufe ohne Reflow."
  - "Vollständige Unicode-, Emoji- und bidirektionale Textunterstützung; die prepare()/layout()-Trennung ermöglicht gecachten Einmal-Setup mit rein arithmetischen heißen Pfaden."
  - "Wichtigste Anwendungsfälle: Virtualisierung ohne Höhenschätzungen, CLS-Prävention, serverseitiges Layout und KI-Agenten, die Textüberlauf vorhersagen."
faq:
  - question: "Wie misst Pretext Text ohne DOM-Zugriff?"
    answer: "Pretext verwendet die measureText()-API des Browser-Canvas, die dieselbe Schrift-Engine wie das DOM nutzt. Die Messung ist präzise, weil sie echte Browser-Typografie verwendet — aber alles passiert offscreen, ohne jemals Layout auszulösen."
  - question: "Kann Pretext von KI-Coding-Agenten verwendet werden?"
    answer: "Ja, das ist ein Hauptanwendungsfall. Wenn ein KI-Agent UI-Code generiert, hat er derzeit keine Möglichkeit zu wissen, ob ein Label überläuft, ohne den Code in einem Browser auszuführen. Pretext gibt KI-Agenten die Fähigkeit, das Textlayout zur Generierungszeit vorherzusagen — bevor der Code überhaupt läuft."
  - question: "Was sind die Einschränkungen von Pretext?"
    answer: "Pretext zielt auf white-space: normal, word-break: normal, overflow-wrap: break-word, line-break: auto — den häufigsten Fall, nicht jedes CSS-Textmodell. system-ui ist auf macOS für Messgenauigkeit unsicher — Sie brauchen eine benannte Schrift. Es ist keine vollständige Font-Rendering-Engine."
---

Eine neue Bibliothek erschien am 29. März auf npm — ohne Ankündigung und bereits mit Hunderten von Downloads: **Pretext** (`@chenglou/pretext`), eine reine JavaScript- und TypeScript-Bibliothek für mehrzeilige Textmessung und Layout — ohne jemals das DOM zu berühren.

Der Autor ist Cheng Lou, bekannt für seine Arbeit an React und ReasonML. Das Konzept ist klar: Text so messen, wie Browser es tun, mit der eigenen Font-Engine des Browsers als Grundlage, aber vollständig über Canvas — kein `getBoundingClientRect`, keine `offsetHeight`, kein Layout-Reflow.

## Warum das wichtig ist: Das Reflow-Problem

Jeder Frontend-Entwickler ist gegen diese Wand gestoßen: Sie müssen wissen, wie hoch ein Textblock sein wird, bevor er gerendert wird. Die traditionelle Antwort ist: rendern, messen, anpassen. Das löst **Layout-Reflow** aus — eine der teuersten Operationen im Browser.

Pretext umgeht das vollständig. Es misst Text mit einer versteckten Canvas und der `measureText()`-API des Browsers, die dieselbe Font-Engine wie das DOM verwendet.

```typescript
import { prepare, layout } from '@chenglou/pretext'

const prepared = prepare('AGI 春天到了. 시작했다 🚀', '16px Inter')
const { height, lineCount } = layout(prepared, textWidth, 20)
```

`prepare()` macht die einmalige Arbeit: Normalisieren von Leerzeichen, Segmentieren von Text, Anwenden von Kleberegeln, Messen von Segmenten mit Canvas. `layout()` danach ist ungefähr **0,09 ms** für 500 Texte.

## Benchmark-Zahlen

- **`prepare()`**: ~19 ms (einmalig, gecacht)
- **`layout()`**: ~0,09 ms (heißer Pfad, rein arithmetisch)

Ein einzelner `getBoundingClientRect()`-Aufruf auf einem moderat komplexen DOM-Subtree kann 1-5 ms auf einem Mittelklasse-Gerät dauern. Pretexts heißer Pfad ist 10-50× schneller als DOM-Messung.

## Vollständige Unicode + Emoji + Bidirektionale Unterstützung

Pretext behandelt Text-Shaping korrekt über alle Sprachen hinweg. Das README hebt speziell Emoji- und gemischten bidirektionalen (bidi) Text hervor — Arabisch gemischt mit Englisch, Hebräisch gemischt mit Zahlen.

## Installation

```bash
npm install @chenglou/pretext
```

Demos auf [chenglou.me/pretext](https://chenglou.me/pretext/). Der Quellcode auf [GitHub](https://github.com/chenglou/pretext).
