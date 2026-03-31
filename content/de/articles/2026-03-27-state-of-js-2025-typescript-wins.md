---
title: "State of JavaScript 2025: TypeScript erreicht 40% exklusive Nutzung während das Ökosystem zur Ruhe kommt"
description: "Die State of JavaScript 2025 Umfrage zeigt TypeScript exklusive Nutzung bei 40%, Vite-Zufriedenheit bei 98% gegenüber Webpacks 26%, und Claude verdoppelt seinen Entwickleranteil. Das Ökosystem wird erwachsen statt zu rotieren."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-27"
category: Survey
author: lschvn
readingTime: 4
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "TypeScript exklusive Nutzung erreichte 40% (von 34% in 2024, 28% in 2022); nur 6% nutzen plain JS exklusiv."
  - "Vite Zufriedenheit ist 98% vs Webpacks 26%; React-Nutzung bei 83,6% aber Next.js negatives Sentiment erreicht 17%."
  - "Claude-Nutzung verdoppelte sich von 22% auf 44%; Cursor verdoppelte sich mehr als von 11% auf 26%; ChatGPT ging von 68% auf 60% zurück."
  - "Node.js bleibt dominant bei 90% Runtime-Nutzung; Bun wuchs um 4 Punkte auf 21%, weit vor Deno bei 11%."
---

Die Ergebnisse der [State of JavaScript 2025](https://2025.stateofjs.com/en-US) Umfrage sind da, und sie zeigen ein Ökosystem, das seinen Fuß findet. Die jährliche Umfrage – durchgeführt im November 2025 und veröffentlicht im Februar 2026, geleitet von Devographics und gesponsert von Google Chrome und JetBrains – zeigt klare Gewinner bei Tools, Frameworks und Sprachpräferenzen, wobei die Entwicklerzufriedenheit zum fünften Mal in Folge bei 3,8 von 5 stabil bleibt.

## TypeScript hat gewonnen – und jetzt?

Die Hauptzahl: Vierzig Prozent der Befragten schreiben jetzt ausschließlich in TypeScript – ein Trend, der unterstreicht, warum [TypeScript 6.0](/articles/2026-03-26-typescript-6-0-final-javascript-release), die letzte JS-basierte Veröffentlichung vor dem nativen Go-Rewrite, ein so entscheidender Übergangspunkt für das Ökosystem ist. Diese Zahl stieg von 34% in 2024 und 28% in 2022. Nur 6% nutzen plain JavaScript ausschließlich. Daniel Roe, Nuxt Core-Team-Leader, [drückte es klar aus](https://2025.stateofjs.com/en-US/conclusion/) in der Schlussfolgerung der Umfrage: "TypeScript hat gewonnen. Nicht als Bundler, sondern als Sprache."

Die interessante Spannung ist, dass "Fehlende statische Typisierung" das am häufigsten genannte Sprach-Schmerzpunkt bleibt – unter Entwicklern, die TypeScript nicht angenommen haben. Als gefragt wurde, wie Typen nativen in JavaScript funktionieren sollten, führten TypeScript-ähnliche Annotationen mit 5.380 Stimmen, vor Runtime-Typen bei 3.524.

## Build-Tools: Vites Zufriedenheitsherrschaft

Vite hat Webpack effektiv in der Entwicklerstimmung überholt. Während Webpack leicht höhere Gesamtnutzung behält (87% vs 84%), ist die Zufriedenheitslücke enorm: [Vite](/articles/2026-03-26-vite-8-rolldown-era) erreicht 98 Prozent, Webpack erreicht 26 Prozent – von 36% in 2024.

Ein Kommentar eines Befragten fasst die Stimmung ein: "Zu versuchen, Legacy-Code zu verstehen, der Webpack verwendet, kann schmerzhaft sein."

Turbopack, Vercels Rust-basierter Nachfolger für Webpack, liegt bei nur 28% Nutzung und deutet darauf hin, dass Vites Vorsprung und Developer-Experience-Vorteil schwer zu überwinden sein werden. Rolldown – der Rust-basierte Rollup-Ersatz, der in Vites Zukunft integriert wird – sprang von 1% auf 10% und deutet auf eine JavaScript-Build-Pipeline hin, die zunehmend von Rust angetrieben wird.

## React-Frustration, Solid-Zufriedenheit

React bleibt das am häufigsten verwendete Framework bei 83,6%, aber die Umfrage zeigt bemerkenswerte Unzufriedenheit. Next.js, verwendet von 59% der Befragten, erzielte eine positive Sentiment-Bewertung von 21% gegenüber einem negativen Sentiment von 17% – und generierte die meisten Kommentare von jedem Projekt.

Repräsentative Antworten aus der Umfrage:
- "Ich schreibe seit fast 6 Jahren Next.js in Produktion... die Next-Komplexität ist absurd geworden"
- "Während ich positive Erfahrungen mit Next hatte, mache ich mir Sorgen, weil Vercel versucht, es zu nutzen, um Geld zu verdienen"

Solid.js behielt die höchste Zufriedenheitsbewertung zum fünften Mal in Folge. Im Meta-Framework-Bereich machte Astro weiterhin Boden gut als content-first Alternative.

## AI-Tool-Nutzung verschiebt sich

KI-gestützte Entwicklungsmuster verschieben sich. Claude-Nutzung verdoppelte sich von 22 auf 44 Prozent, während Cursor sich mehr als verdoppelte von 11 auf 26 Prozent. ChatGPT-Nutzung ging von 68 auf 60 Prozent zurück – immer noch dominant in absoluten Zahlen, aber rückläufig.

## Backend: Node hält, Bun wächst

Bei den Runtimes bleibt Node.js dominant bei 90%. [Bun](/articles/2026-03-30--bun-v1-3-11-cron-anthropic) liegt auf dem dritten Platz bei 21% – ein Zuwachs von 4% gegenüber dem Vorjahr – weit vor Deno bei 11%. Für einen tieferen Blick darauf, wie sich die drei Runtimes bei Durchsatz, Cold Starts und asynchroner Performance vergleichen, sieh dir unsere [2026 Runtime-Benchmark-Analyse](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) an.

Die Temporal API, der langjährige Vorschlag zur Ersetzung von JavaScript problematischem `Date`-Objekt, sah die Begeisterung um 22% im Jahresvergleich zurückgehen, während sie von Proposal zur Browser-Implementierung übergeht. Die API bleibt der am meisten erwartete Vorschlag in der Umfrage.

Die vollständigen Ergebnisse sind auf [2025.stateofjs.com](https://2025.stateofjs.com/en-US) verfügbar.
