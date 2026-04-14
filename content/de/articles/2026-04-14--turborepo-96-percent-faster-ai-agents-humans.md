---
title: "Turborepo Ist Jetzt 96% Schneller — Vercels KI-Agenten-Experiment"
description: "Vercel-Ingenieure haben KI-Coding-Agenten eingesetzt, um die Rust-Codebasis von Turborepo zu optimieren und eine 81–96% schnellere Taskgraph-Berechnung zu erreichen. Hier sind der Prozess, die Erfolge und die Grenzen."
date: "2026-04-14"
image: "https://opengraph.githubassets.com/vercel/turborepo"
category: Werkzeuge
author: lschvn
readingTime: 5
tags: ["turborepo", "vercel", "monorepo", "build-tools", "rust", "ai-agents"]
tldr:
  - "Die Taskgraph-Berechnung von Turborepo ist nun je nach Repository-Größe 81 bis 96% schneller, nach einer Woche KI-gestützter Rust-Optimierung."
  - "Das Vercel-Team kombinierte KI-Agenten mit LLM-lesbaren Markdown-Profiling-Formaten —Plain-Text-Stack-Traces verbesserten die Qualität der Agentenvorschläge drastisch."
  - "Die größten Gewinne kamen aus Parallelisierung (gleichzeitige Git-, Glob- und Lockfile-Operationen), Beseitigung redundanter Allokationen und Bündelung syscall-intensiver Operationen."
faq:
  - q: "Können KI-Agenten menschliche Ingenieure bei Performance-Arbeit ersetzen?"
    a: "Nein — Vercels Ingenieure fanden heraus, dass Agenten sich auf Microbenchmarks fixierten, irreführende Verbesserungen produzierten und nie Regressionstests schrieben. Menschliches Urteilsvermögen blieb für die Validierung unerlässlich."
  - q: "Was machte das Profiling für Agenten effektiver?"
    a: "Das Standard-Chrome-Trace-JSON-Format war für Agenten schwer zu parsen. Der Wechsel zu einem Markdown-Profil-Format — sortiert nach Eigzeit, greppbar, einzeilige Einträge — führte zu deutlich besseren Optimierungsvorschlägen."
  - q: "Was genau wurde in Turborepo schneller?"
    a: "Die Rust-Implementierung wurde in drei Bereichen optimiert: Parallelisierung sequentieller Operationen, Beseitigung redundanter Allokationen und Klone sowie Bündelung syscall-intensiver Git-Operationen mit schnelleren Bibliotheken wie gix-index."
---

Vercel-Ingenieure verbrachten eine Woche im März 2026 damit, KI-Coding-Agenten einzusetzen, um den Rust-Task-Scheduler von Turborepo zu optimieren. Das Ergebnis: Die Taskgraph-Berechnung ist nun **81 bis 96% schneller**, je nach Repository-Größe. Bei einem 1.000-Pakete-Monorepo sank der `turbo run`-Overhead von 10 Sekunden auf ein quasi-sofortes Gefühl. Der Bericht ist für jeden lesenswert, der an leistungsstarken JavaScript-Tools arbeitet.

## Start mit Unbeaufsichtigten Agenten

Das Experiment begann mit acht Hintergrund-Coding-Agenten, die jeweils unterschiedliche Bereiche der Rust-Codebasis ansteuerten. Jeder Agent erhielt ein locker definiertes Ziel — Performance-Probleme finden — ohne Schritt-für-Schritt-Anleitung. Bis zum Morgen hatten drei brauchbare Ergebnisse geliefert: eine 25%ige Reduzierung der Wanduhrzeit durch Wechsel zu referenzbasiertem Hashing, ein 6%iger Gewinn durch Ersetzen der `twox-hash`-Crate durch `xxhash-rust` und eine Bereinigung eines unnötigen Floyd-Warshall-Algorithmus.

Aber die Ingenieure identifizierten schnell ein Muster: **Agenten produzierten beeindruckende Microbenchmarks, die sich nicht in reale Gewinne übersetzten**. Ein Agent lieferte eine „97%ige Verbesserung" bei einem Microbenchmark, die in der Praxis 0,02% ausmachte. Agenten schrieben nie Regressionstests. Sie nutzten nie das `--profile`-Flag. Und entscheidend: Sie benchmarkten gegen synthetische Ziele statt gegen die eigentliche Turborepo-Codebasis.

## Das Profiling-Problem

Als das Team versuchte, Standard-Chrome-Trace-JSON-Profile mit den Agenten zu verwenden, waren die Ergebnisse schlecht. Funktionsnamen wurden über Zeilen hinweg geteilt, irrelevante Metadaten mit Timing-Daten vermischt, nicht grep-freundlich. Die Agenten kämpften sich durch diese Dateien auf die gleiche Weise wie ein Mensch — schlecht.

Der Durchbruch kam durch die Beobachtung, dass Bun ein `--cpu-prof-md`-Flag eingeführt hatte, das Profile als Markdown generiert. Das Vercel-Team erstellte eine `turborepo-profile-md`-Crate, die Begleit-`.md`-Dateien neben jeder Trace ausgibt: heiße Funktionen sortiert nach Eigzeit, Aufruf-Bäume nach Gesamtzeit, Aufrufer-/Aufgerufenen-Beziehungen — alles greppbar, alles einzeilig.

Der Unterschied war sofort sichtbar. Gleiches Modell, gleiche Codebasis, gleicher Harness. Nur ein anderes Format. Die Agenten produzierten plötzlich dramatisch bessere Optimierungsvorschläge.

## Was Tatsächlich Schneller Wurde

Die menschlich geführte Iterationsschleife — Profilieren, Hotspots identifizieren, Vorschlagen, Implementieren, Validieren mit Hyperfine — lief vier Tage lang und produzierte über 20 PRs. Die Gewinne fielen in drei Kategorien:

**Parallelisierung.** Der Aufbau des Git-Index, das Durchsuchen des Dateisystems nach Glob-Matches, das Parsen von Lockfiles und das Laden von `package.json`-Dateien liefen alle sequentiell. Diese sind nun gleichzeitig. Die Gewinne waren am größten für Repositories mit vielen Paketen.

**Allokationsbeseitigung.** Die Pipeline klonte gesamte HashMaps, wo Referenzen gereicht hätten. Glob-Ausschlussfilter wurden bei jedem Aufruf neu kompiliert, anstatt vorkompiliert zu werden. Jeder HTTP-Client wurde pro Anfrage neu erstellt, anstatt wiederverwendet zu werden. Diese kleinen Kopien summierten sich.

**Syscall-Reduzierung.** Pro-Paket-Git-Subprocess-Aufrufe wurden zu einem einzigen repo-weiten Index zusammengefasst. Dann wurden Git-Subprozesse durch `libgit2` ersetzt, und `libgit2` wiederum durch `gix-index` — eine schnellere, pure-Rust-Implementierung.

## Die Grenze: 85% als Deckel

Bei 85% schneller kam der Fortschritt zum Erliegen. Die verbleibenden Gewinne lagen innerhalb des Messrauschens auf den MacBooks der Ingenieure. Das Team vermutet, dass das Problem in der Benchmark-Methodik lag, nicht im Code selbst — je schneller die Operationen werden, desto mehr überwog die Varianz durch Systemrauschen (Disk-I/O, CPU-Scheduling) das Signal.

Die Lehre: **Ihre Codebasis ist die beste Feedback-Schleife**. Agenten, die zuvor schlechten Code geschrieben hatten, produzierten in späteren Sitzungen bessere Ausgaben — nicht weil sich das Modell geändert hatte, sondern weil die zusammengeführten Verbesserungen nun in der Codebasis sichtbar waren und die Agenten ihnen folgten. Kontext, so stellt sich heraus, bleibt die Schlüsselzutat.

## Was Das Für Das JavaScript-Ökosystem Bedeutet

Turborepo ist fundamentale Infrastruktur für einen großen Teil der JavaScript-Monorepo-Welt. Geschwindigkeitsverbesserungen hier kumulieren bei jedem `turbo run build`, `turbo run test` und `turbo run lint` in jedem Repository, das davon abhängt. Die Tatsache, dass die Optimierung von KI-Agenten vorangetrieben — aber von Menschen validiert wurde — ist ein realistisches Bild davon, wo KI-gestützte Entwicklung 2026 steht: ein stark Beschleuniger für das Finden von Erfolgen, noch abhängig von menschlichem Urteilsvermögen, um Signal von Rauschen zu unterscheiden.

Das Markdown-Profiling-Format wird bereits als möglicher Standard für LLM-lesbare Performance-Ausgaben in Rust-Tooling-Projekten diskutiert.
