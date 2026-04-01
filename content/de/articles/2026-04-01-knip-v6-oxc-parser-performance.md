---
title: "Knip v6 Bringt oxc-Parser und 2- bis 4-fache Performance-Steigerung"
description: "Das beliebte Tool zum Aufspüren von ungenutztem Code in JavaScript und TypeScript hat seinen TypeScript-Backend durch den Rust-basierten oxc-Parser ersetzt — mit beeindruckenden Ergebnissen."
date: 2026-04-01
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "javascript", "werkzeuge", "performance", "open-source", "rust"]
faq:
  - question: "Was ist Knip?"
    answer: "Knip ist ein Open-Source-CLI-Tool, das ungenutzte Dateien, Abhängigkeiten und Exports in JavaScript- und TypeScript-Projekten findet."
  - question: "Was ist oxc?"
    answer: "oxc ist eine Sammlung von Rust-basierten JavaScript/TypeScript-Tools des Oxc Project (oxc.rs). Es enthält einen Parser (oxc-parser), einen Linter und einen Resolver."
  - question: "Wie aktualisiere ich auf Knip v6?"
    answer: "Führen Sie `npm install -D knip@latest` aus. Knip v6 erfordert Node.js v20.19.0 oder neuer."
  - question: "Der Klassenmember-Issue-Typ wurde entfernt?"
    answer: "Ja, er wurde entfernt, da er auf TypeScripts JS-basierter LanguageService-API basierte, die in TypeScript v7 (Go-Rewrite) nicht mehr verfügbar sein wird."
tldr:
  - "Knip v6 ersetzt den TypeScript-Backend vollständig durch oxc-parser und oxc-resolver und reduziert die Analysezeit um das 2- bis 4-fache."
  - "Astros Codebasis ging von 4,0s auf 2,0s, Sentry von 11,0s auf 4,0s und das TypeScript-Repo von Microsoft von 3,7s auf 0,9s."
  - "Knip v6 erfordert Node.js v20.19.0+ und entfernt den classMembers-Issue-Typ."
  - "Der TypeScript-v7-Go-Rewrite machte die LanguageService-API unbrauchbar, weshalb der Wechsel zu oxc notwendig war."
---

Das Team hinter [Knip](https://github.com/webpro-nl/knip) — dem beliebten Open-Source-Tool zum Finden ungenutzter Dateien, Abhängigkeiten und Exports in JavaScript- und TypeScript-Projekten — hat Version 6 veröffentlicht. Die Kernzahl: **2 bis 4 mal schneller** auf ganzer Linie.

Der entscheidende Wechsel: Der komplette Austausch des TypeScript-Backends gegen [oxc-parser](https://oxc.rs/docs/guide/usage/parser), den Rust-basierten Parser des Oxc Project.

## Warum das TypeScript-Backend an eine Wand stieß

Knip parst jede Datei nur einmal, aber die alte TypeScript-Engine schleppte den Overhead eines kompletten Programms und Typecheckers mit. Diese Einrichtung war für IDEs und Sprachserver gedacht — nicht für einen Analysator, der nur einen einzigen Durchgang braucht.

> „Das TypeScript-Backend machte das gesamte Setup schwieriger und langsamer als nötig, besonders für große Monorepos." — Lars Kappert, [v6-Ankündigung](https://knip.dev/blog/knip-v6)

Das TypeScript-Team schreibt den Compiler für v7 gerade in Go um. Die LanguageService-basierten APIs, auf die Knip für Features wie `classMembers` setzte, wären damit gone gewesen.

## Die Zahlen

| Projekt | v5.88.0 | v6.0.0 | Speedup |
|---|---|---|---|
| Astro | 4,0s | 2,0s | 2,0x |
| TanStack Query | 3,8s | 1,7s | 2,2x |
| Rolldown | 3,7s | 1,7s | 2,2x |
| Sentry | 11,0s | 4,0s | 2,8x |
| TypeScript (microsoft/TypeScript) | 3,7s | 0,9s | 4,1x |

Das Microsoft-TypeScript-Repo wird in unter einer Sekunde analysiert.

## Wichtige Breaking Changes

- **Node.js v20.19.0+ erforderlich** — v18 wird nicht mehr unterstützt
- **classMembers-Issue-Typ entfernt** — nicht mehr machbar ohne TypeScripts LanguageService-API
- `--include-libs` und `--isolate-workspaces` Flags entfernt — das ist jetzt das Standardverhalten
- `--experimental-tags` umbenannt in `--tags`

## Upgrade

```bash
npm install -D knip@latest
```

Vollständige Dokumentation auf [knip.dev](https://knip.dev).
