---
title: "Cursor Composer 2, Kimi K2.5 und die Kontroverse, die KI's Open-Source-Rechnung aufgedeckt hat"
description: "Wie ein Entwickler eine versteckte Modell-ID fand, eine weltweite Debatte über Attribution auslöste und offenbarte, wie abhängig die KI-Branche von chinesischen Open-Source-Modellen geworden ist."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["cursor", "kimi", "moonshot", "ai", "open-source", "licensing", "coding-tools"]
readingTime: 12
image: "https://cursor.com/public/opengraph-image.png"
tldr:
  - "Cursor Composer 2 erreichte 61,7% auf Terminal-Bench 2.0, stellte sich aber als auf Kimi K2.5 basierend heraus, nicht als vollständig internes Modell."
  - "Ein Entwickler fand die Modell-ID 'kimi-k2p5' in API-Antworten ; Tokenizer-Analyse bestätigte Byte-für-Byte-Identität mit Kimi."
  - "Kimi K2.5s modifizierte MIT-Lizenz erfordert 'Powered by Kimi K2.5'-Attribution für Produkte über 20M$ monatlichem Umsatz — Cursor liegt bei ~2B$ ARR."
  - "Moonshot AI bestätigte, dass die Fireworks AI-Vereinbarung konform war ; Cursor erkannte das Attributionsversäumnis als Fehler an."
faq:
  - question: "Hat Cursor Kimi K2.5 gestohlen?"
    answer: "Nein. Cursor nutzte Kimi K2.5 als Basismodell über Fireworks AI, eine kommerzielle Vereinbarung, die laut Moonshot AI vollständig konform war. Das Problem war das Fehlen von Attribution im Blogbeitrag und der UI von Cursor, nicht der Diebstahl des Modells selbst."
  - question: "Was bietet Kimi K2.5 genau?"
    answer: "Kimi K2.5 ist ein Open-Weight-Modell mit einem 256K-Token-Kontextfenster, nativer multimodaler Architektur und dem Agent-Swarm-Modus, der bis zu 100 autonome Agenten gleichzeitig ermöglicht. Der API-Preis beträgt 0,60$ pro Million Eingabe-Tokens, compared to 3-15$ für vergleichbare proprietäre Modelle."
  - question: "Was sollten Entwickler tun, die Cursor verwenden?"
    answer: "Das Tool ist so gut wie vor der Kontroverse. Die Modellqualität ist real. Das Attributionsversäumnis ist ein Governance-Problem, kein Leistungsproblem. Entwickler sollten verstehen, was tatsächlich unter der Haube ihrer Tools läuft."
---

Am 19. März 2026 veröffentlichte Cursor einen Blogbeitrag, der Composer 2 ankündigte. Die Benchmarks waren real: **61,7% auf Terminal-Bench 2.0**, übertraf Claude Opus 4.6 (58,0%) bei einem Zehntel des Preises. Der Start wurde als Durchbruch eines 50-köpfigen Teams präsentiert, das Monate damit verbracht hatte, ein internes Coding-Modell zu trainieren und zu verfeinern.

Achtundvierzig Stunden später hatte die Entwickler-Community eine völlig andere Unterhaltung.

## Die Entdeckung

Es begann mit einem Entwickler, der einen API-Endpunkt debuggte. Bei der Inspektion von Cursors OpenAI-kompatiblen API-Antworten fand er eine Modell-ID, die dort nicht hätte sein sollen:

```
accounts/anysphere/models/kimi-k2p5-rl-0317-s515-fast
```

Die Zeichenkette ist nicht subtil. `kimi-k2p5` ist eine Referenz auf **Kimi K2.5**, ein Open-Weight-Modell des chinesischen KI-Labors Moonshot AI, das zwei Monate zuvor veröffentlicht wurde.

## Was Cursor tatsächlich ausgeliefert hat

Cursors eigener Blogbeitrag war technisch genau, aber tonal irreführend. Das Unternehmen beschrieb "kontinuierliches Vortraining eines Basismodells kombiniert mit Reinforcement Learning" ohne Angabe welches Basismodell.

Die tatsächliche Zusammensetzung, wie Aman Sanger (Cursor Mitgründer) klärte:
- **Basismodell**: Kimi K2.5 (nach Auswertung mehrerer Optionen gewählt)
- **Zusätzliche Arbeit**: Kontinuierliches Vortraining + 4× skaliertes Reinforcement Learning
- **Compute-Aufteilung**: Ungefähr 25% von Kimis Basis, 75% von Cursors zusätzlichem Training

## Das Lizenzproblem

Kimi K2.5 ist Open-Source unter einer **Modified MIT License** mit spezifischen kommerziellen Bedingungen:

> Kommerzielle Produkte oder Dienste, die **20 Millionen US-Dollar monatlichen Umsatz** überschreiten, müssen "Powered by Kimi K2.5" prominent in der Benutzeroberfläche anzeigen.

Cursors Umsatzzahlen, die 2026 weit verbreitet wurden, liegen bei ungefähr **2 Milliarden US-Dollar annualisiertem ARR** — etwa **8× über dem monatlichen Schwellenwert**, der die Attributionsanforderung auslöst.

## Die Fireworks-Lösung

Cursor griff über **Fireworks AI** auf Kimi K2.5 zu, eine gehostete Inferenzplattform. Moonshot AI bestätigte, dass die Fireworks-Vereinbarung vollständig konform war.

Lee Robinson, Cursors VP of Developer Experience, erkannte das Offenlegungsversäumnis direkt an: *"Nicht Kimi als Basis im Blogbeitrag zu erwähnen war ein Fehler."*

## Kimi K2.5: Das Modell, das man kennen sollte

Kimi K2.5 ist ein Open-Weight-Modell mit Fähigkeiten, die erklären, warum Cursor es als Basis wählte:

- **256K-Token-Kontextfenster** — viermal mehr als die meisten Konkurrenten bieten
- **Native multimodale Architektur** — verarbeitet Text, Vision und visuelle Spezifikationen in einem einheitlichen Framework
- **Agent Swarm** — bis zu 100 autonome Agenten, die gleichzeitig an Sub-Tasks arbeiten
- **Preis** — 0,60$ pro Million Eingabe-Tokens über API

## Das tiefere Muster: Chinesisches Open-Source als globale Infrastruktur

Die unbequeme Wahrheit ist, dass **chinesische Open-Source-KI-Modelle still und leise zur fundamentalen Infrastruktur für die globale KI-Industrie geworden sind**. Kimi K2.5, Qwen (Alibaba), DeepSeek und GLM sind keine regionalen Außenseiter — sie sind wettbewerbsfähig oder überlegen gegenüber westlichen Open-Weight-Angeboten zu einem Bruchteil der Kosten.

## Was das für Entwickler bedeutet

1. **Untersuchen Sie, was Sie kaufen.** Modellattribution ist zunehmend unzuverlässig. Die technischen Marker — Tokenizer-Signaturen, Modell-IDs in API-Antworten — sind verifizierbar.

2. **Open-Source-Lizenzen in KI holen auf.** Kimi K2.5s Modified MIT ist sophistizierter als die meisten. "Open-Source" bedeutet nicht "bedingungslos kostenlos für kommerzielle Nutzung."

3. **Der echte Burggraben ist Integration, nicht Basismodelle.** Cursors Wettbewerbsposition beruht darauf, tief in den Entwickler-Workflow eingebettet zu sein — nicht darauf, das Basismodell zu besitzen.

4. **Kimi K2.5 ist einen Blick wert.** Ob als Basis für Ihr eigenes Fine-Tuning oder als API-Endpunkt für Entwicklungsarbeit, es ist ein leistungsfähiges Modell mit einem Preis-Leistungs-Verhältnis, das proprietäre Alternativen nicht erreichen können.
