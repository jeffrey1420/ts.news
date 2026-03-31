---
title: "State of JavaScript 2025: TypeScript erreicht 40% exklusive Nutzung, Ökosystem stabilisiert sich"
description: "Die State of JavaScript 2025 Umfrage zeigt TypeScript-Exklusivnutzung bei 40%, Vite-Zufriedenheit bei 98% vs Webpacks 26%, und Claude verdoppelt seinen Entwickleranteil. Das Ökosystem reift, anstatt zu rotieren."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-27"
category: Survey
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "TypeScript-Exklusivnutzung erreichte 40% (von 34% 2024, 28% 2022); nur 6% nutzen ausschließlich Plain-JS."
  - "Vite-Zufriedenheit 98% vs Webpacks 26%; React-Nutzung 83,6% aber Next.js negatives Sentiment bei 17%."
  - "Claude-Nutzung verdoppelte sich von 22% auf 44%; Cursor verdreifachte sich von 11% auf 26%; ChatGPT sank von 68% auf 60%."
  - "Node.js bleibt dominant bei 90% Runtime-Nutzung; Bun wuchs um 4 Punkte auf 21%, weit vor Deno bei 11%."
---

Die Ergebnisse der [State of JavaScript 2025](https://2025.stateofjs.com/en-US) Umfrage sind da, und sie zeigen ein Ökosystem, das seinen Platz findet. Die jährliche Umfrage — durchgeführt von Devographics und gesponsert von Google Chrome und JetBrains — zeigt klare Gewinner bei Tools, Frameworks und Sprachpräferenzen, mit einer stabilen Entwicklerzufriedenheit von 3,8 von 5 zum fünften Mal in Folge.

## TypeScript hat gewonnen — Was nun?

Die Kernzahl: 40 Prozent der Befragten schreiben jetzt ausschließlich in TypeScript — eine Entwicklung, die unterstreicht, warum [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release), die letzte JS-basierte Version vor dem nativen Go-Rewrite, ein so entscheidender Übergangspunkt für das Ökosystem ist. Diese Zahl stieg von 34 Prozent im Jahr 2024 und 28 Prozent im Jahr 2022. Nur 6 Prozent nutzen ausschließlich Plain JavaScript. Daniel Roe, Nuxt-Core-Teamleiter, [sagte es klipp und klar](https://2025.stateofjs.com/en-US/conclusion/) in der Schlussfolgerung der Umfrage: "TypeScript hat gewonnen. Nicht als Bundler, sondern als Sprache."

Die interessante Spannung ist, dass "fehlende statische Typisierung" das am häufigsten genannte Sprache-Problem bleibt — unter Entwicklern, die TypeScript nicht angenommen haben. Als sie gefragt wurden, wie Typen nativ in JavaScript funktionieren sollten, führten TypeScript-ähnliche Annotationen mit 5.380 Stimmen, vor Runtime-Typen bei 3.524.

## Build-Tools: Vites Zufriedenheits-Dominanz

Vite hat Webpack effektiv im Entwickler-Sentiment überholt. Während Webpack leicht höhere Gesamtnutzung behält (87% vs 84%), ist die Zufriedenheitslücke eklatant: [Vite](/articles/2026-03-26-vite-8-rolldown-era) punkte 98 Prozent, Webpack 26 Prozent — runter von 36 Prozent im Jahr 2024.

Ein Kommentar eines Befragten fängt die Stimmung ein: "Versuchen, Legacy-Code zu verstehen, der Webpack verwendet, kann schmerzhaft sein."

Turbopack, Vercels Rust-basierter Nachfolger für Webpack, liegt bei nur 28 Prozent Nutzung, was darauf hindeutet, dass Vites Vorsprung und Developer-Experience-Vorteil schwer aufzuholen sein wird. Rolldown — der Rust-basierte Rollup-Ersatz, der in Vites Zukunft integriert wird — sprang von 1 Prozent auf 10 Prozent und deutet auf eine JavaScript-Build-Pipeline hin, die zunehmend von Rust angetrieben wird.

## React-Frustration, Solid-Zufriedenheit

React bleibt das meistgenutzte Framework bei 83,6 Prozent, aber die Umfrage zeigt deutliche Unzufriedenheit. Next.js, verwendet von 59 Prozent der Befragten, erzielte einen positiven Sentiment-Wert von 21 Prozent gegen einen negativen Sentiment von 17 Prozent — und generierte die meisten Kommentare von jedem Projekt.

Repräsentative Antworten aus der Umfrage:
- "Ich schreibe seit knapp 6 Jahren Next.js in Produktion... die Next-Komplexität ist absurd geworden"
- "Obwohl ich positive Erfahrungen mit Next hatte, mache ich mir Sorgen, weil Vercel versucht, es zu nutzen, um Geld zu verdienen"

Solid.js behielt die höchste Zufriedenheitsbewertung zum fünften Mal in Folge. Im Meta-Framework-Bereich machte Astro als content-first Alternative weiter Boden gut.

## KI-Tool-Nutzung verschiebt sich

KI-gestützte Entwicklungsmuster verschieben sich. Claude-Nutzung verdoppelte sich von 22 auf 44 Prozent, während Cursor sich mehr als verdreifachte von 11 auf 26 Prozent. ChatGPT-Nutzung sank von 68 auf 60 Prozent — immer noch dominant in absoluten Zahlen, aber rückläufig.

## Backend: Node hält, Bun wächst

Bei den Runtimes bleibt Node.js dominant bei 90 Prozent. [Bun](/articles/2026-03-30-bun-v1-3-11-cron-anthropic) liegt an dritter Stelle bei 21 Prozent — ein Zugewinn von 4 Prozent gegenüber dem Vorjahr — weit vor Deno bei 11 Prozent. Für einen tieferen Blick darauf, wie die drei Runtimes bei Durchsatz, Cold Starts und Async-Performance abschneiden, sehen Sie unsere [Runtime-Benchmark-Analyse 2026](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark).

Die Temporal API, der langjährige Vorschlag zur Ersetzung von JavaScripts problematischem `Date`-Objekt, sah die Begeisterung um 22 Prozent im Jahresvergleich sinken, während sie von Vorschlag zur Browser-Implementierung übergeht. Die API bleibt der am sehnlichsten erwartete Vorschlag in der Umfrage.

Vollständige Ergebnisse sind auf [2025.stateofjs.com](https://2025.stateofjs.com/en-US) verfügbar.
