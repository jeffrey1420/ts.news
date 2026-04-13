---
title: "The CSS vertical-align Problem Is Finally Solved: text-box-trim and margin-block"
description: "For decades, centering text vertically in buttons, badges, and layouts felt slightly off. The culprit: leading space — invisible padding built into every font's metrics. Two CSS properties now solve this at different levels: text-box-trim for inline text and margin-block with cap/lh units for block layouts."
date: 2026-04-13
image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=1200&h=630&fit=crop"
author: lschvn
tags: ["CSS", "frontend", "typography", "web development", "layout"]
readingTime: 7
tldr:
  - "Text never truly centers in CSS because browsers align to the line-height box, not the visual letters. Leading space (invisible padding above and below cap height) throws off every button, badge, and heading."
  - "text-box-trim (experimental) removes leading space directly for inline text, paired with text-box-edge to specify which font metric to use as boundaries."
  - "margin-block: calc(0.5cap - 0.5lh) achieves the same effect with superior browser support, using font-relative units that work in production today."
faq:
  - question: "Why does text appear vertically off-center even when CSS says otherwise?"
    answer: "Because browsers align text to the line-height box, not to the visual letters. Fonts include invisible 'leading space' above cap height and below the baseline. A 16px font with line-height 1.5 allocates 24px of vertical space — but the actual letters only occupy ~11px. That 6-7px difference per line is what makes text look misaligned in buttons and badges."
  - question: "What is text-box-trim?"
    answer: "An experimental CSS property that removes leading space from inline text. Use text-box-trim: trim-both to remove space above and below visual letters, combined with text-box-edge: cap alphabetic to specify trimming from cap height down to the alphabetic baseline. Browser support is limited to cutting-edge versions."
  - question: "How does margin-block achieve the same result?"
    answer: "margin-block: calc(0.5cap - 0.5lh) offsets the line-height box against the cap height. The formula subtracts half the line-height from half the cap height, producing a negative margin that pulls visual text up into the center of its allocated space. It works with excellent browser support today."
  - question: "Can I use both techniques together?"
    answer: "No — they stack and create double the adjustment. Always use @supports (text-box-trim: trim-both) to detect text-box-trim support and cancel margin-block inside that block. The correct pattern: start with margin-block as baseline, apply text-box-trim as enhancement, cancel margin-block when text-box-trim is available."
  - question: "What are cap and lh units?"
    answer: "cap is the height of capital letters relative to the font's em-box. lh is the computed line-height value. Both are font-relative units that scale with the font, making the margin-block formula work correctly regardless of font size or family."
---

Öffnen Sie einen Button in Ihrem Browser-Inspector. Fügen Sie Padding hinzu. Der Text scheint zentriert zu sein. Fügen Sie jetzt mehr Padding hinzu, oder wechseln Sie die Schriftart. Plötzlich ist er 4 Pixel verschoben. Das ist kein Bug in Ihrem CSS. Es ist ein grundlegender Konflikt zwischen der Art und Weise, wie Browser Text messen, und wie Menschen ihn wahrnehmen.

## Das Problem — Der Leerraum

Um zu verstehen, warum Text nie wirklich zentriert ist, müssen Sie verstehen, was Browser tatsächlich messen. Jede Schriftart verfügt über einen Satz von Metriken: die **Versalhöhe** (wie hoch Großbuchstaben stehen), die **Basislinie** (auf der Buchstaben ruhen), die **Oberlänge** (Abstand von der Basislinie bis zur Spitze hoher Buchstaben) und die **Unterlänge** (Abstand unterhalb der Basislinie). Diese Metriken definieren das Em-Quadrat, die unsichtbare Box, die jedes Glyph enthält.

Aber es gibt einen Haken. Wenn Sie `line-height: 1.5` für 16px-Text setzen, weist der Browser 24px vertikalen Raum zu. Der tatsächliche visuelle Text — die Buchstaben selbst — nehmen nur etwa 11px im vertikalen Zentrum dieser 24px-Box ein. Der verbleibende Raum wird als **Leerraum** bezeichnet: unsichtbares Padding, das über der Versalhöhe und unterhalb der Basislinie verteilt ist.

Browser richten Text an dieser Line-Height-Box aus, nicht an den visuellen Buchstaben. Deshalb erscheint Text in einem Button immer in der unteren Hälfte seines Containers, selbst mit `display: flex; align-items: center`. Die Line-Height-Box erstreckt sich weiter über die Versalhöhe als unter die Basislinie, sodass das visuelle Zentrum der Buchstaben weit unter dem geometrischen Zentrum des zugewiesenen Raums liegt.

Dieser Konflikt betrifft jeden engen Textcontainer: Buttons, Badges, Navigationselemente, Eingabefelder. Sie können so viel Padding hinzufügen, wie Sie möchten — bis Sie den Leerraum berücksichtigen, wird der Text nie wirklich zentriert sein.

## Lösung 1 — text-box-trim

Die CSS Text Level 4-Spezifikation führt `text-box-trim` ein, eine Eigenschaft, mit der Sie Leerraum direkt aus Inline-Text entfernen können. Die Eigenschaft akzeptiert drei Werte: `trim-start` entfernt Raum über dem Text, `trim-end` entfernt Raum darunter, und `trim-both` entfernt beides.

Um genau zu steuern, welcher Teil der Schriftmetrik getrimmt wird, kombinieren Sie es mit `text-box-edge`. Diese Eigenschaft akzeptiert Werte wie `cap`, `alphabetic`, `ex` und `text` — jeder repräsentiert eine andere Messung im Em-Quadrat der Schrift.

Für die engste vertikale Anpassung verwenden Sie `text-box-edge: cap alphabetic` in Kombination mit `text-box-trim: trim-both`. Dies teilt dem Browser mit, von der Versalhöhe bis zur alphabetischen Basislinie zu trimmen und den gesamten Leerraum über und unter den sichtbaren Buchstaben zu entfernen.

```css
.button-text {
  text-box-edge: cap alphabetic;
  text-box-trim: trim-both;
}
```

Die Browserunterstützung ist derzeit auf die neuesten Versionen beschränkt. Dies macht `text-box-trim` ideal als progressive Verbesserung: Sie wenden es für Browser an, die es unterstützen, während Sie einen Fallback für alle anderen behalten.

## Lösung 2 — margin-block

Wenn Sie heute funktionierenden Code benötigen, liefert `margin-block` mit schriftrelative Einheiten das gleiche Ergebnis mit ausgezeichneter Browserunterstützung. Die Technik verwendet zwei weniger bekannte CSS-Einheiten: `cap`, das der Versalhöhe der aktuellen Schrift entspricht, und `lh`, das dem berechneten Line-Height-Wert entspricht.

Die Formel ist elegant:

```css
.button-text {
  margin-block: calc(0.5cap - 0.5lh);
}
```

Dies erzeugt einen negativen Margin, der die Line-Height-Box gegen die Versalhöhe ausgleicht. Die Hälfte der Versalhöhe minus der Hälfte der Line-Height ergibt genau den Abstand, der benötigt wird, um den visuellen Text in die Mitte seines zugewiesenen Raums zu ziehen. Da sich sowohl `cap` als auch `lh` mit der Schrift skalieren, funktioniert dies unabhängig von Schriftgröße oder -familie korrekt.

Für eine 16px-Schrift mit `line-height: 1.5` (24px) ergibt die Berechnung ungefähr -4px. Dieser negative Margin hebt den visuellen Text in das geometrische Zentrum. Das Ergebnis ist die gleiche enge, präzise Ausrichtung, die `text-box-trim` bietet — aber in jedem modernen Browser heute verfügbar.

## Muster für progressive Verbesserung

Der kluge Ansatz kombiniert beide Techniken: Beginnen Sie mit `margin-block` als Basis, dann verbessern Sie mit `text-box-trim`, wo unterstützt. Der Schlüssel ist die Verwendung von `@supports`, um die Unterstützung von `text-box-trim` zu erkennen und den margin-block in diesem Block zu canceln.

```css
.button-text {
  /* Basis: funktioniert überall */
  margin-block: calc(0.5cap - 0.5lh);
}

/* Verbesserung: text-box-trim verwenden, wenn verfügbar */
@supports (text-box-trim: trim-both) {
  .button-text {
    text-box-edge: cap alphabetic;
    text-box-trim: trim-both;
    margin-block: 0;
  }
}
```

Dieses Muster stellt sicher, dass jeder Browser eine korrekte Textausrichtung erhält. Ältere Browser erhalten die `margin-block`-Lösung. Moderne Browser erhalten den nativen `text-box-trim`-Ansatz. Kein Browser erhält eine doppelte Anpassung oder ein kaputtes Layout.

## Praktische Anwendungsfälle

**Button-Text**: Wenden Sie `margin-block: calc(0.5cap - 0.5lh)` auf das Textelement des Buttons an, während der Button selbst `display: inline-flex; align-items: center` verwendet. Dies ergibt perfekt zentrierten Button-Text, der standhält, wenn Sie Schriftarten wechseln oder Padding anpassen.

**Badges und Pills**: Behälter mit engem Padding offenbaren Fehlausrichtungen sofort. Fügen Sie `margin-block` zum Badge-Text hinzu und beobachten Sie, wie das Label in die geometrische Mitte springt, selbst mit asymmetrischem Padding.

**Hero-Überschriften**: Großer Anzeigetext macht selbst winzige Fehlausrichtungen offensichtlich. `margin-block` auf einer 72px-Überschrift mit `line-height: 1.1` liefert die pixelgenaue Ausrichtung, die Premium-Designs erfordern.

**Icon + Text**: Wenn Sie ein Icon mit Text paaren und `display: flex; align-items: center` verwenden, stellen Sie durch Hinzufügen von `margin-block` zum Textelement sicher, dass Icon und Buchstaben dieselbe visuelle Basislinie teilen, selbst wenn ihre internen Metriken unterschiedlich sind.

Text war in CSS schon immer leicht außerhalb der Mitte — nicht wegen Bugs, sondern wegen der Art und Weise, wie Browser Raum messen. Mit `margin-block`, das heute verfügbar ist, und `text-box-trim`, das bald kommt, ist diese Ära endlich vorbei.
