---
title: "GitHub Copilots stillschweigender Richtungswechsel: Euer Code trainiert ihre Modelle — außer ihr widersprecht"
description: "Ab dem 24. April 2026 verwendet GitHub Interaktionsdaten von Free-, Pro- und Pro+-Copilot-Nutzern, um KI-Modelle zu trainieren — sofern nicht manuell widersprochen wird. Business- und Enterprise-Tarife sind nicht betroffen."
date: 2026-04-02
image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=630&fit=crop"
author: lschvn
tags: ["GitHub", "Copilot", "KI", "Datenschutz", "Machine Learning", "Open Source"]
readingTime: 5
tldr:
  - "Ab dem 24. April verwendet GitHub standardmäßig Copilot-Free/Pro/Pro+-Interaktionsdaten (Eingaben, Ausgaben, Code-Snippets, Kontext) zum Trainieren von KI-Modellen — Widerspruch erforderlich."
  - "Copilot-Business- und Enterprise-Nutzer sowie Personen, die bereits widersprochen haben, sind nicht betroffen. Die Änderung betrifft Individualabonnenten aller kostenpflichtigen Tarife."
  - "Der Widerspruchsbutton befindet sich in den GitHub-Einstellungen unter Copilot → Datenschutz. Wer ihn nicht ändert, dessen Code-Daten verbessern Copilot für alle."
---

Am 25. März 2026 hat GitHub still und leise seine Richtlinie zur Handhabung von Copilot-Interaktionsdaten aktualisiert. Die Kurzfassung: **sofern ihr nicht aktiv widerspricht, werden eure Coding-Aktivitäten auf den Free-, Pro- und Pro+-Plänen ab dem 24. April zum Trainieren zukünftiger KI-Modelle verwendet**.

## Welche Daten werden erhoben

Wenn ihr eingewilligt bleibt, sammelt GitHub:

- Code-Snippets, die ihr tippt und aus Copilot-Vorschlägen übernehmt
- Eingaben an Copilot, einschließlich des umgebenden Dateikontexts
- Repository-Strukturen, Dateinamen und Navigationsmuster
- Feedback-Signale wie Daumen hoch/runter
- Chat-Gespräche und Interaktionen mit Inline-Vorschlägen

GitHub schließt explizit Daten von Business-, Enterprise- und unternehmenseigenen Repositories aus. Wenn ihr einen Team-Plan habt, ist eure Arbeit geschützt.

## Warum jetzt

GitHub gibt an, bereits „signifikante Verbesserungen" nach der Integration von Interaktionsdaten der Microsoft-Mitarbeiter beobachtet zu haben — höhere Akzeptanzraten in mehreren Sprachen. Das Unternehmen argumentiert, dies sei ein etablierter Branchenstandard, und präsentiert es als Qualitätskompromiss: Gebt eure Codemuster preis, erhaltet bessere Vorschläge.

Das Timing ist bedeutsam. Copilot steht in echtem Wettbewerb mit Claude Code, Cursor und JetBrains KI-Tools. Das Training auf Nutzerdaten ist ein Weg, die Lücke zu schließen, ohne mehr zu verlangen.

## So widersprecht ihr

Falls ihr nicht beitragen möchtet:

1. Geht zu **GitHub Settings → Copilot** (oder direkt zu `github.com/settings/copilot`)
2. Findet den Bereich **„Datenschutz"**
3. Deaktiviert die Option zum Modell-Training

Falls ihr diese Einstellung bereits deaktiviert hattet, wird eure Präferenz automatisch beibehalten.

## Das größere Bild

Dies ist ein vertrautes Muster im KI-Zeitalter: kostenloser oder günstiger Zugang im Austausch für Daten. Der Unterschied hier ist, dass Entwickler — die tendenziell datenschutzbewusst sind — das Produkt sind. Code-Snippets können proprietäre Logik, interne API-Designs und unternehmensspezifische Implementierungen offenlegen.

Mehrere Open-Source-Maintainer haben bereits Bedenken geäußert. Code auf öffentlichen GitHub-Repos wird bereits für Trainingsdaten gescraped; diese Richtlinie erweitert diese Dynamik auf private Repos, die über Copilot genutzt werden.

Der Widerspruch ist bereits heute möglich. Ob ihr dies als fairen Tausch für besseres Autocomplete betrachtet, ist Geschmackssache — aber lasst euch gesagt sein: Die Uhr tickt.

---

*Täglicher TypeScript- und JavaScript-Ökosystem-Coverage auf [ts.news](https://ts.news).*
