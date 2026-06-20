---
title: "Das CSS-Problem der vertikalen Zentrierung ist endlich gelöst: text-box-trim und margin-block"
description: "Jahrzehntelang wirkte das vertikale Zentrieren von Text in Buttons, Badges und Layouts leicht daneben. Der Übeltäter: der Leading Space, ein unsichtbarer Abstand, der in den Metriken jeder Schriftart eingebaut ist. Zwei CSS-Eigenschaften lösen das jetzt auf unterschiedlichen Ebenen: text-box-trim für Inline-Text und margin-block mit cap/lh-Einheiten für Block-Layouts."
date: 2026-04-13
image: "/images/heroes/2026-04-13--css-text-box-trim-margin-block-vertical-center.png"
author: lschvn
tags: ["css", "javascript"]
readingTime: 7
tldr:
  - "Text wird in CSS nie wirklich zentriert, weil Browser an der Line-Height-Box ausrichten, nicht an den sichtbaren Buchstaben. Der Leading Space (unsichtbare Polsterung ober- und unterhalb der Versalhöhe) verschiebt jeden Button, jedes Badge und jede Überschrift."
  - "text-box-trim (experimentell) entfernt den Leading Space direkt für Inline-Text, kombiniert mit text-box-edge, um festzulegen, welche Schriftmetrik als Begrenzung dient."
  - "margin-block: calc(0.5cap - 0.5lh) erzielt denselben Effekt mit deutlich besserer Browser-Unterstützung und nutzt schriftrelative Einheiten, die heute in der Produktion funktionieren."
faq:
  - question: "Warum wirkt Text vertikal versetzt, obwohl das CSS anderes sagt?"
    answer: "Weil Browser den Text an der Line-Height-Box ausrichten, nicht an den sichtbaren Buchstaben. Schriftarten enthalten unsichtbaren 'Leading Space' oberhalb der Versalhöhe und unterhalb der Grundlinie. Eine 16px-Schriftart mit line-height 1,5 weist 24px vertikalen Raum zu, aber die eigentlichen Buchstaben nehmen nur etwa 11px ein. Dieser Unterschied von 6–7px pro Zeile sorgt dafür, dass Text in Buttons und Badges verschoben wirkt."
  - question: "Was ist text-box-trim?"
    answer: "Eine experimentelle CSS-Eigenschaft, die den Leading Space aus Inline-Text entfernt. Verwenden Sie text-box-trim: trim-both, um den Raum ober- und unterhalb der sichtbaren Buchstaben zu entfernen, kombiniert mit text-box-edge: cap alphabetic, um den Schnitt von der Versalhöhe bis zur Grundlinie festzulegen. Die Browser-Unterstützung beschränkt sich auf aktuelle Versionen."
  - question: "Wie erreicht margin-block dasselbe Ergebnis?"
    answer: "margin-block: calc(0.5cap - 0.5lh) verschiebt die Line-Height-Box gegen die Versalhöhe. Die Formel zieht die halbe Zeilenhöhe von der halben Versalhöhe ab und erzeugt so einen negativen Außenabstand, der den sichtbaren Text in die Mitte seines zugewiesenen Raums zieht. Die Technik funktioniert mit hervorragender Browser-Unterstützung bereits heute."
  - question: "Kann ich beide Techniken kombinieren?"
    answer: "Nein, sie addieren sich und erzeugen eine doppelte Anpassung. Verwenden Sie immer @supports (text-box-trim: trim-both), um die text-box-trim-Unterstützung zu erkennen und margin-block innerhalb dieses Blocks aufzuheben. Das richtige Muster: Starten Sie mit margin-block als Basis, ergänzen Sie text-box-trim als Erweiterung und heben Sie margin-block auf, sobald text-box-trim verfügbar ist."
  - question: "Was sind die Einheiten cap und lh?"
    answer: "cap ist die Höhe der Großbuchstaben relativ zur Em-Box der Schriftart. lh ist der berechnete line-height-Wert. Beides sind schriftrelative Einheiten, die mit der Schriftart skalieren und dafür sorgen, dass die margin-block-Formel unabhängig von Schriftgröße und -familie korrekt funktioniert."
---

Öffnen Sie einen Button in Ihrem Browser-Inspector. Fügen Sie Padding hinzu. Der Text scheint zentriert zu sein. Fügen Sie jetzt mehr Padding hinzu, oder wechseln Sie die Schriftart. Plötzlich ist er 4 Pixel verschoben. Das ist kein Bug in Ihrem CSS. Es ist ein grundlegender Konflikt zwischen der Art und Weise, wie Browser Text messen, und wie Menschen ihn wahrnehmen.

## Das Problem: Der Leerraum

Um zu verstehen, warum Text nie wirklich zentriert ist, müssen Sie verstehen, was Browser tatsächlich messen. Jede Schriftart verfügt über einen Satz von Metriken: die **Versalhöhe** (wie hoch Großbuchstaben stehen), die **Basislinie** (auf der Buchstaben ruhen), die **Oberlänge** (Abstand von der Basislinie bis zur Spitze hoher Buchstaben) und die **Unterlänge** (Abstand unterhalb der Basislinie). Diese Metriken definieren das Em-Quadrat, die unsichtbare Box, die jedes Glyph enthält.

Aber es gibt einen Haken. Wenn Sie `line-height: 1.5` für 16px-Text setzen, weist der Browser 24px vertikalen Raum zu. Der tatsächliche visuelle Text, die Buchstaben selbst, nehmen nur etwa 11px im vertikalen Zentrum dieser 24px-Box ein. Der verbleibende Raum wird als **Leerraum** bezeichnet: unsichtbares Padding, das über der Versalhöhe und unterhalb der Basislinie verteilt ist.

Browser richten Text an dieser Line-Height-Box aus, nicht an den visuellen Buchstaben. Deshalb erscheint Text in einem Button immer in der unteren Hälfte seines Containers, selbst mit `display: flex; align-items: center`. Die Line-Height-Box erstreckt sich weiter über die Versalhöhe als unter die Basislinie, sodass das visuelle Zentrum der Buchstaben weit unter dem geometrischen Zentrum des zugewiesenen Raums liegt.

Dieser Konflikt betrifft jeden engen Textcontainer: Buttons, Badges, Navigationselemente, Eingabefelder. Sie können so viel Padding hinzufügen, wie Sie möchten, bis Sie den Leerraum berücksichtigen, wird der Text nie wirklich zentriert sein.

## Lösung 1: text-box-trim

Die CSS Text Level 4-Spezifikation führt `text-box-trim` ein, eine Eigenschaft, mit der Sie Leerraum direkt aus Inline-Text entfernen können. Die Eigenschaft akzeptiert drei Werte: `trim-start` entfernt Raum über dem Text, `trim-end` entfernt Raum darunter, und `trim-both` entfernt beides.

Um genau zu steuern, welcher Teil der Schriftmetrik getrimmt wird, kombinieren Sie es mit `text-box-edge`. Diese Eigenschaft akzeptiert Werte wie `cap`, `alphabetic`, `ex` und `text`, jeder repräsentiert eine andere Messung im Em-Quadrat der Schrift.

Für die engste vertikale Anpassung verwenden Sie `text-box-edge: cap alphabetic` in Kombination mit `text-box-trim: trim-both`. Dies teilt dem Browser mit, von der Versalhöhe bis zur alphabetischen Basislinie zu trimmen und den gesamten Leerraum über und unter den sichtbaren Buchstaben zu entfernen.

```css
.button-text {
  text-box-edge: cap alphabetic;
  text-box-trim: trim-both;
}
```

Die Browserunterstützung ist derzeit auf die neuesten Versionen beschränkt. Dies macht `text-box-trim` ideal als progressive Verbesserung: Sie wenden es für Browser an, die es unterstützen, während Sie einen Fallback für alle anderen behalten.

## Lösung 2: margin-block

Wenn Sie heute funktionierenden Code benötigen, liefert `margin-block` mit schriftrelative Einheiten das gleiche Ergebnis mit ausgezeichneter Browserunterstützung. Die Technik verwendet zwei weniger bekannte CSS-Einheiten: `cap`, das der Versalhöhe der aktuellen Schrift entspricht, und `lh`, das dem berechneten Line-Height-Wert entspricht.

Die Formel ist elegant:

```css
.button-text {
  margin-block: calc(0.5cap - 0.5lh);
}
```

Dies erzeugt einen negativen Margin, der die Line-Height-Box gegen die Versalhöhe ausgleicht. Die Hälfte der Versalhöhe minus der Hälfte der Line-Height ergibt genau den Abstand, der benötigt wird, um den visuellen Text in die Mitte seines zugewiesenen Raums zu ziehen. Da sich sowohl `cap` als auch `lh` mit der Schrift skalieren, funktioniert dies unabhängig von Schriftgröße oder -familie korrekt.

Für eine 16px-Schrift mit `line-height: 1.5` (24px) ergibt die Berechnung ungefähr -4px. Dieser negative Margin hebt den visuellen Text in das geometrische Zentrum. Das Ergebnis ist die gleiche enge, präzise Ausrichtung, die `text-box-trim` bietet, aber in jedem modernen Browser heute verfügbar.

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

Text war in CSS schon immer leicht außerhalb der Mitte, nicht wegen Bugs, sondern wegen der Art und Weise, wie Browser Raum messen. Mit `margin-block`, das heute verfügbar ist, und `text-box-trim`, das bald kommt, ist diese Ära endlich vorbei.
