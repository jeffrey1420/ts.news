---
title: "Pretext: Die DOM-freie Textmessungsbibliothek, die KI-Coding-Agents bereits verwenden"
description: "Cheng Lou hat Pretext veröffentlicht, eine pure JavaScript-Bibliothek, die mehrzeiligen Text misst und layoutet, ohne den DOM zu berühren. Hier ist, warum das für Virtualisierung, Layout-Kontrolle und KI-Agents, die UI-Code schreiben, wichtig ist."
date: "2026-03-31"
image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "typescript", "layout", "performance", "DOM", "library"]
readingTime: 7
category: "release"
tldr:
  - "Pretext (@chenglou/pretext) misst und layoutet mehrzeiligen Text ohne den DOM zu berühren, using canvas measureText as ground truth."
  - "Hot-Path layout() läuft bei ~0.09ms für 500 Texte — 10–50x schneller als einzelne getBoundingClientRect()-Aufrufe ohne Reflow."
  - "Volle Unicode-, Emoji- und Bidirektionale-Text-Unterstützung; der prepare()/layout()-Split ermöglicht gecachten Einmal-Setup mit rein-arithmetischen Hot-Paths."
  - "Wichtigste Anwendungsfälle: Virtualisierung ohne Höhenschätzungen, CLS-Prävention, serverseitiges Layout und KI-Agents, die Textüberlauf vorhersagen."
---

Eine neue Bibliothek tauchte am 29. März auf npm mit null Ankündigung und bereits Hunderten von Downloads auf: **Pretext** (`@chenglou/pretext`), eine pure JavaScript- und TypeScript-Bibliothek für mehrzeilige Textmessung und Layout — ohne jemals den DOM zu berühren.

Der Autor ist Cheng Lou, zuvor bekannt für Arbeit an React und ReasonML. Das Konzept ist klar: Text so messen, wie Browser es tun, using the browser's own font engine as ground truth, aber entirely through canvas — no `getBoundingClientRect`, no `offsetHeight`, no layout reflow.

## Warum das wichtig ist: Das Reflow-Problem

Jeder Frontend-Entwickler ist gegen diese Wand gestoßen: Sie müssen wissen, wie hoch ein Textblock sein wird, bevor er gerendert wird. Die traditionelle Antwort ist, ihn zu rendern, ihn zu messen, dann anzupassen. Das löst **Layout Reflow** aus — eine der teuersten Operationen im Browser. Für ein einzelnes Label ist es in Ordnung. Für eine Liste von 10.000 Nachrichten, einen virtualisierten Scroll oder einen KI-Agenten, der UI dynamisch generiert, ist es eine Katastrophe.

Pretext umgeht dies komplett. Es misst Text mit einer versteckten Canvas und der `measureText()`-API des Browsers, die dieselbe Font-Engine verwendet wie der DOM. Die Messung ist akkurat, weil sie echte Browser-Typografie verwendet — aber es passiert offscreen, ohne jemals Layout auszulösen.

```typescript
import { prepare, layout } from '@chenglou/pretext'

// Einmalige Vorbereitung (einmal pro Text+Font-Kombination)
const prepared = prepare('AGI 春天到了. 시작했다 🚀', '16px Inter')

// Hot Path: rein arithmetisch, kein DOM beteiligt
const { height, lineCount } = layout(prepared, textWidth, 20)
```

`prepare()` macht die einmalige Arbeit: Normalisieren von Whitespace, Segmentieren von Text, Anwenden von Kleber-Regeln, Messen von Segmenten mit Canvas. `layout()` danach ist ungefähr **0.09ms** für 500 Texte im aktuellen Benchmark. Das ist Sub-Millisekunde.

## Zwei Anwendungsfälle, eine Bibliothek

### 1. Messen ohne DOM zu berühren

Der primäre Anwendungsfall: Wissen Sie Ihre Texthöhe vor dem Rendern. Das ermöglicht:

- **Virtualisierung ohne Schätzungen**: Rendern Sie nur, was in den Viewport passt, messen Sie den Rest vorab
- **CLS (Cumulative Layout Shift) Prävention**: Text vor dem Laden vormatierten, damit Sie den richtigen Platz reservieren und die Scroll-Position stabil halten können
- **Entwicklungszeit-Overflow-Erkennung**: KI-Coding-Agents können verifizieren, dass ein Button-Label nicht auf zwei Zeilen umbricht, bevor der Code überhaupt läuft
- **Fancier Userland-Layouts**: Masonry, benutzerdefinierte Flexbox-Implementierungen, Layouts, die Werte ohne CSS-Hacks anpassen

```typescript
// Overflow erkennen, bevor er passiert
const { height } = layout(prepared, buttonWidth, buttonLineHeight)
if (height > buttonMaxHeight) {
  // Abschneiden, Tooltip oder Reflow
}
```

### 2. Manuelles Zeilen-Layout

Wenn Sie die tatsächlichen Zeileninhalte benötigen — für Canvas/SVG-Rendering, für Text, der um Floats herumfließt, oder für das Erstellen benutzerdefinierter Renderer — bietet Pretext APIs auf niedrigerer Ebene:

```typescript
import { prepareWithSegments, layoutWithLines } from '@chenglou/pretext'

const prepared = prepareWithSegments('AGI 春天到了. 시작했다 🚀', '18px "Helvetica Neue"')
const { lines } = layoutWithLines(prepared, 320, 26) // 320px max Breite, 26px Zeilenhöhe

for (let i = 0; i < lines.length; i++) {
  ctx.fillText(lines[i].text, 0, i * 26)
}
```

Die `walkLineRanges()`-Variante baut nie einmal Zeilen-Strings — sie ruft einen Callback für jede Zeile mit ihrer Breite und Cursor-Positionen auf. Das ermöglicht binäre Suchen über Layout-Dimensionen, Shrink-Wrap-Container und balancierten Text ohne String-Allokation.

```typescript
// Finde die engste Breite, die allen Text passt
let maxW = 0
walkLineRanges(prepared, 320, line => {
  if (line.width > maxW) maxW = line.width
})
// maxW = die minimale Containerbreite, die nicht überläuft
```

Und `layoutNextLine()` behandelt Spalten mit variabler Breite — der kanonische Fall von Text, der um ein gefloatetes Bild herumfließt:

```typescript
let cursor = { segmentIndex: 0, graphemeIndex: 0 }
let y = 0

while (true) {
  const width = y < image.bottom ? columnWidth - image.width : columnWidth
  const line = layoutNextLine(prepared, cursor, width)
  if (line === null) break
  ctx.fillText(line.text, 0, y)
  cursor = line.end
  y += 26
}
```

## Was Pretext anders macht

### Benchmark-Zahlen

Aus der eigenen geprüften Benchmark des Projekts auf einem geteilten 500-Text-Batch:
- **`prepare()`**: ~19ms (einmalig, gecacht)
- **`layout()`**: ~0.09ms (Hot Path, rein arithmetisch)

Zur Einordnung: Ein einzelner `getBoundingClientRect()`-Aufruf auf einem moderat komplexen DOM-Subtree kann 1-5ms auf einem Mittelklasse-Gerät dauern. Pretext's Hot Path ist 10-50x schneller als DOM-Messung, mit null Nebenwirkungen.

### Volle Unicode + Emoji + Bidirektionale Unterstützung

Pretext behandelt Text-Shaping korrekt über alle Sprachen hinweg. Das README hebt spezifisch die Unterstützung für Emojis und gemischten bidirektionalen (bidi) Text hervor — Arabisch gemischt mit Englisch, Hebräisch gemischt mit Zahlen. Die Bibliothek verwendet die Font-Engine des Browsers als Quelle der Wahrheit, also shaping sie Text genau so, wie es der DOM tun wird.

```typescript
// Gemischte Skripte, Emojis, bidirektional — alles korrekt behandelt
prepare('AGI 春天到了. بدأت الرحلة 🚀', '16px Inter')
```

### Zwei-Schritt-Cache-Architektur

Der `prepare()`/`layout()`-Split ist der wichtige Performance-Insight. `prepare()` ist teuer (Canvas-Messung, Text-Segmentierung, Bidi-Neusortierung) aber gecacht. `layout()` ist Arithmetik auf vorkomputierten Daten. Sie zahlen die Setup-Kosten einmal; der Hot Path bleibt kalt.

Resize? Nur `layout()` läuft erneut. Font-Änderung? Nur `prepare()` läuft erneut für betroffenen Text. Das ist die Art von API-Design, die AI-Code-Generierung tractable macht — der Agent kann `layout()` in einer engen Schleife aufrufen ohne Bedenken.

## Die Einschränkungen

Pretext ist explizit darüber, was es (noch) nicht tut:

- Es zielt auf `white-space: normal`, `word-break: normal`, `overflow-wrap: break-word`, `line-break: auto` — den häufigen Fall, nicht jedes CSS-Textmodell
- `system-ui` ist unsicher für Messungsgenauigkeit auf macOS — Sie brauchen einen benannten Font
- Es ist keine vollständige Font-Rendering-Engine — es behandelt einige erweiterte OpenType-Features nicht, aber für den 95%-Fall des Messens, wo Text umbricht, deckt es alles ab

Der `white-space: pre-wrap`-Modus wird auch für Textarea-ähnliche Fälle unterstützt, wo Leerzeichen, Tabs und Zeilenumbrüche erhalten bleiben.

## Für wen ist das eigentlich gedacht

Die offensichtliche Antwort sind UI-Bibliotheksautoren und Virtualisierungsschicht-Maintainer. Aber Pretext's README macht eine interessante Beobachtung über **KI-Coding-Agents**:

> "Development time verification (especially now with AI) that labels on e.g. buttons don't overflow to the next line, browser-free"

Wenn eine KI UI-Code generiert, hat sie derzeit keine Möglichkeit zu wissen, ob ein Label überlaufen wird, ohne den Code in einem Browser auszuführen. Pretext gibt KI-Agenten die Fähigkeit, Textlayout zur Generierungszeit vorherzusagen — bevor der Code läuft. Das ist eine bedeutende Fähigkeit für KI-unterstützte UI-Entwicklung. Für einen breiteren Blick darauf, wie KI-Coding-Tools wie [Claude Code](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) und Cursor das Entwicklererlebnis entwickeln, sehen Sie unsere [AI Dev Tool Rankings](/articles/2026-03-25-ai-dev-tool-rankings-march-2026).

Die Bibliothek ist auch wichtig für:
- **Canvas/SVG-Rendering**, wo Sie überhaupt keinen DOM haben
- **Serverseitige Layout-Berechnung** (serverseitiges Rendering ohne DOM)
- **Game UIs**, die auf Canvas aufgebaut sind
- **Native App Toolkits**, die eine JS-Engine einbetten, aber nicht das Layout-System des Browsers exponieren

[Bun](/articles/2026-03-30--bun-v1-3-11-cron-anthropic) ist eine solche Umgebung, wo Pretext's Ansatz glänzt — mit seiner eingebetteten JavaScript-Engine und nativem TypeScript-Support kann Pretext Layouts serverseitig berechnen, ohne überhaupt einen DOM zu haben.

## Installation

```bash
npm install @chenglou/pretext
```

Demos leben unter [chenglou.me/pretext](https://chenglou.me/pretext/). Der Quellcode ist auf [GitHub](https://github.com/chenglou/pretext).

---

*Pretext ist Cheng Lou's zweiter Akt im Text-Rendering-Raum — aufbauend auf seiner früheren Arbeit an [text-layout](https://github.com/chenglou/text-layout) von vor einem Jahrzehnt. Sebastian Markbage's ursprüngliches Text-Layout-Design (Canvas measureText für Shaping, Bidi von pdf.js, Streaming-Zeilenumbruch) informierte die Architektur, die Pretext jetzt vorantreibt.*