---
title: "Cloudflares vinext: Das kontroverse Projekt, das Next.js in einer Woche neu erfunden hat"
description: "Wie Cloudflare KI nutzte, um Vercels Flaggschiff-Framework neu zu erstellen, und was das für die Zukunft der Webentwicklung bedeutet"
date: "2026-03-21"
category: "deep-dive"
author: lschvn
tags: ["cloudflare", "vercel", "controversy", "vinext"]
readingTime: 12
image: "https://cf-assets.www.cloudflare.com/zkvhlag99gkb/64oL10LCSz30EiEHWVdJPG/aeaed48a681ec3d5bc9d8cb6e5e30a96/BLOG-3194_1.png"
tldr:
  - "vinext reimplementiert die Next.js-API-Oberfläche als Vite-Plugin, größtenteils von KI (Claude Code) für ~1.100$ an API-Tokens in einer Woche erstellt."
  - "Bei einer 33-Routen-App baut vinext 4,4x schneller (1,67s vs 7,38s) mit 57% kleineren Client-Bundles (72,9KB vs 168,9KB)."
  - "Das Projekt enthält 1.700+ Vitest-Tests und 380 Playwright E2E-Tests ; CIO.gov läuft bereits mit vinext in Produktion."
  - "vinext wird nativ auf Cloudflare Workers mit D1/R2/KV-Bindings deployed und unterstützt auch Vercel, Netlify und AWS über Nitro."
faq:
  - question: "Kann vinext wirklich Next.js ersetzen?"
    answer: "vinext deckt laut README 94% der öffentlichen Next.js-API-Oberfläche ab. Einschränkungen umfassen statisches Rendering zur Build-Zeit (auf der Roadmap), einige Edge-Cases beim RSC-Streaming und undokumentierte interne Next.js-APIs. Für CIO.gov werden signifikante Verbesserungen bei Build-Zeiten und Bundle-Größen beschrieben."
  - question: "Ist KI-generierter Code zuverlässig?"
    answer: "Das Cloudflare-Team betont, dass fast jede Zeile von KI geschrieben wurde, aber dieselben Qualitäts-Gates durchläuft wie menschlich geschriebener Code. Mehr als 1.700 Vitest-Tests und 380 Playwright E2E-Tests sind enthalten. Der Engineer bemerkte: 'Es gab PRs, die einfach falsch waren. Die KI implementierte zuversichtlich etwas, das richtig aussah, aber nicht dem tatsächlichen Next.js-Verhalten entsprach.'"
  - question: "Wie verhält sich vinext zu OpenNext?"
    answer: "Cloudflare behauptet, dass der Aufbau auf dem Next.js-Build-Output als Grundlage schwierig und fragil war. By reimplementing from scratch verspricht vinext stabilere Kompatibilität. OpenNext muss den Next.js-Build-Output reverse-engineeren, was zu unvorhersehbaren Änderungen zwischen Versionen führt."
---

Am 24. Februar 2026 veröffentlichte Cloudflare einen Blogbeitrag, der Schockwellen durch die Webentwickler-Community sendete. Der Titel: *"Wie wir Next.js mit KI in einer Woche neu erstellt haben."* Das Projekt, **vinext** (ausgesprochen "vee-next"), wurde als experimentelles Vite-Plugin präsentiert, das die Next.js-API-Oberfläche reimplementiert — damit Entwickler ihre Next.js-Anwendungen auf Cloudflare Workers statt auf Vercel ausführen können.

## Was ist vinext?

 vinext ist ein Vite-Plugin, das die öffentliche Next.js-API reimplementiert — Routing, Server-Side Rendering, React Server Components, Server Actions, Caching, Middleware und mehr — auf Vites Build-Infrastruktur statt auf Next.js' proprietären Compiler.

Der entscheidende Unterschied ist die Deployment-Flexibilität. Wo Next.js traditionell Vercel benötigt, shipped vinext nativ zu Cloudflare Workers mit einem einzigen Befehl:

```bash
npm install vinext
vinext deploy
```

### Die Zahlen, die für Aufsehen sorgten

Cloudflares Benchmarks auf einer 33-Routen-App-Router-Anwendung zeigten beeindruckende Ergebnisse:

| Metrik | Next.js 16.1.6 | vinext (Vite 8/Rolldown) |
|--------|---------------|---------------------------|
| Build-Zeit | 7,38s | 1,67s (**4,4× schneller**) |
| Client-Bundle | 168,9 KB | 72,9 KB (**57% kleiner**) |

Dies sind keine marginalen Verbesserungen — sie repräsentieren eine fundamentale Verschiebung in der Build-Performance.

### KI-generierter Code im großen Maßstab

Die vielleicht erstaunlichste Behauptung: Eine vollständige Reimplementierung der Next.js-API-Oberfläche wurde in einer Woche von einem einzigen Engineer geschrieben, der ein KI-Modell anleitete. Die Kosten: etwa **1.100$ an API-Tokens**.

Das Projekt enthält über **1.700 Vitest-Tests** und **380 Playwright E2E-Tests** mit CI auf jedem Pull Request.

### Wichtige Funktionen

- **Drop-in-Kompatibilität**: `app/`, `pages/` und `next.config.js` funktionieren ohne Änderung
- **TPR (Traffic-aware Pre-Rendering)**: fragt Cloudflare-Analysen zur Deploy-Zeit ab
- **Native Cloudflare-Bindings**: Zugriff auf D1, R2, KV, Durable Objects, AI
- **Multi-Plattform über Nitro**: Deployment zu Vercel, Netlify, AWS, Deno Deploy

## Die Kontroverse

Next.js wurde 2019 von Vercel übernommen. Seitdem hat Vercel sein gesamtes Geschäftsmodell darauf aufgebaut, die Premium-Hosting-Plattform für Next.js-Anwendungen zu sein.

Als Cloudflare vinext veröffentlichte, war die Botschaft an Entwickler klar: **Ihr könnt jetzt Next.js ohne Vercel nutzen.**

## Sicherheit und Qualität

Das vinext GitHub README enthält dies prominent:

> 🚧 **Experimentell — in intensiver Entwicklung.** Dieses Projekt ist ein Experiment in KI-gesteuerter Softwareentwicklung. Die überwältigende Mehrheit des Codes, der Tests und der Dokumentation wurde von KI geschrieben.

### Reale Nutzung

Trotz des experimentellen Labels laufen echte Kunden bereits mit vinext in Produktion:
- **CIO.gov**: läuft mit vinext in Produktion mit "bedeutenden Verbesserungen bei Build-Zeiten und Bundle-Größen"

## Was das für die Industrie bedeutet

### Für Vercel

Vercel steht vor einer unbequemen Wahrheit: Ihr Burggraben könnte dünner sein als erhofft. vinext demonstriert, dass Next.js-Kompatibilität anderswo erreichbar ist.

### Für Cloudflare

Cloudflare hat seine Seriosität im Entwickler-Plattform-Bereich signalisiert. vinext ist ein Beweis, dass Cloudflare Entwickler anziehen kann, die Vercel als einzige Option sahen.

### Für die Entwickler-Community

Der vielleicht größte Gewinner: Entwickler selbst. vinext fügt Wahlmöglichkeiten in ein Ökosystem hinzu, das sich zunehmend wie ein Einparteiensystem anfühlte.

## Fazit

Ob vinext eine praktikable Produktionsalternative wird oder eine experimentelle Kuriosität bleibt, es hat die Konversation bereits verändert. Entwickler wissen jetzt: Wenn sie Next.js auf Cloudflare ausführen wollen, können sie es.
