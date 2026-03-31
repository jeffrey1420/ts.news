---
title: "State of JavaScript 2025: TypeScript Dominiert, Vite Überholt Webpack"
description: "Die State of JavaScript 2025 Umfrage zeigt TypeScript-Nutzung auf einem Allzeithoch, Vite, das Webpack bei der Zufriedenheit übertrifft, und wachsende Bedenken wegen Next.js-Komplexität."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-25"
category: Ecosystem
author: lschvn
readingTime: 5
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "40% der Entwickler schreiben jetzt ausschließlich TypeScript (vs. 34% 2024) ; nur 6% verwenden ausschließlich Plain JavaScript."
  - "Vite erreicht 84% Nutzung mit 98% Zufriedenheitswert, während Webpacks Zufriedenheit auf 26% eingebrochen ist (vs. 36% 2024)."
  - "React bleibt mit 83,6% das meistgenutzte, aber Next.js zieht wachsende Kritik wegen Komplexität und Vercels Geschäftsanreizen auf sich."
  - "Rolldown sprang von 1% auf 10% Nutzung in einem Jahr und signalisiert eine Rust-basierte Zukunft für die JavaScript-Build-Pipeline."
faq:
  - question: "Ersetzt TypeScript JavaScript als Standardwahl?"
    answer: "Fast. 40% der Entwickler schreiben jetzt ausschließlich TypeScript (vs. 34% 2024), während nur 6% ausschließlich bei Plain JavaScript bleiben. Daniel Roe, Nuxt Core-Teamleiter, fasste es unverblümt zusammen: 'TypeScript hat gewonnen. Nicht als Bundler, sondern als Sprache.' Da Node.js Type Stripping nun stabil ist, sind die letzten technischen Barrieren gefallen."
  - question: "Warum bricht Webpacks Zufriedenheit ein und was ersetzt es?"
    answer: "Webpacks Zufriedenheitswert fiel auf 26% 2025, von 36% 2024, als Entwicklerfrust über seine Komplexität und steile Lernkurve wuchs. Vite dominiert mit 98% Zufriedenheit bei 84% Nutzung. Turbopack liegt bei nur 28% Nutzung, und Rolldown — das Rust-basierte Rollup-kompatible Toolchain — sprang von 1% auf 10% Nutzung in einem einzigen Jahr."
  - question: "Was treibt die Next.js-Kritik trotz seiner hohen Nutzung an?"
    answer: "Next.js weist 21% positives Sentiment gegen besorgniserregende 17% negatives Sentiment auf — und generiert mehr Kommentaraktivität als jedes andere Projekt. Entwickler nennen zunehmende Komplexität ('die Next.js-Komplexität ist absurd geworden') und Bedenken wegen Vercels Geschäftsanreizen, die die Richtung des Frameworks prägen."
---

Die [State of JavaScript 2025](https://2025.stateofjs.com/en-US) Umfrage, veröffentlicht im Februar 2026 nach Erhebung der Antworten bis November 2025, zeichnet ein Bild eines reifenden Ökosystems. TypeScript hat die Sprachkrieg eindeutig gewonnen, Vite hat den Build-Tool-Krieg gewonnen — zumindest beim Sentiment — und Entwickler werden zunehmend laut über Framework-Komplexität.

## TypeScript: Der Eindeutige Gewinner

Die TypeScript-Nutzung steigt weiter. **40% der Befragten schreiben jetzt ausschließlich TypeScript**, von 34% 2024 und 28% 2022. Nur 6% verwenden ausschließlich Plain JavaScript. Als sie gefragt wurden, was sie an JavaScript ändern würden, bleibt „Fehlen von statischer Typisierung" die größte Schmerzpunkte.

Die Zahlen sind auf die beste Art vernichtend. Daniel Roe, Nuxt Core-Teamleiter, fasste es in der Schlussfolgerung der Umfrage unverblümt zusammen:

> TypeScript hat gewonnen. Nicht als ein Bundler, sondern als eine Sprache.

Mit Type Stripping, das nun in stabilem [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) verfügbar ist, bröckeln die letzten technischen Barrieren. Die Frage ist nicht mehr, ob man TypeScript verwendet — es ist, wie schnell man migrieren kann.

## Build-Tools: Vite Verwüstet Webpack

Die Build-Tool-Erzählung ist ebenso entschieden. Vite sitzt bei **84% Nutzung mit einem 98% Zufriedenheitswert**. Webpack behält eine leicht höhere Gesamtnutzung von 87%, aber sein Zufriedenheitswert ist auf **26%** eingebrochen, von 36% 2024.

Ein Teilnehmer beschrieb den aktuellen Zustand: „Versuchen, Legacy-Code zu verstehen, der Webpack verwendet, kann schmerzhaft sein." Dieses Gefühl findet Widerhall.

Turbopack, Vercels Rust-basierter Nachfolger für Webpack, liegt bei nur 28% Nutzung. Trotz erheblichen Marketings hat es nicht die Traktion gewonnen, die viele erwartet hatten. Die Rust-basierte Zukunft der Build-Pipeline könnte stattdessen [Rolldown](/articles/2026-03-26-vite-8-rolldown-era) sein — das Rollup-kompatible Toolchain, das von 1% auf 10% Nutzung in einem einzigen Jahr sprang.

## Frontend-Frameworks: React Dominiert, Aber Next.js Zieht Feuer

React bleibt das meistgenutzte Framework bei **83,6%**, aber die Umfrage zeigte wachsende Unzufriedenheit. Next.js, verwendet von 59% der Befragten, wies 21% positives Sentiment gegen ein besorgniserregendes 17% negatives Sentiment auf — und generierte mehr Kommentaraktivität als jedes andere Projekt.

Die Beschwerden konzentrieren sich auf Komplexität:

> „Ich schreibe seit fast 6 Jahren Next.js in Produktion... die Next-Komplexität ist absurd geworden"

Andere äußerten Bedenken, dass Vercels Geschäftsanreize die Richtung des Frameworks prägen. Ein Teilnehmer sagte: „Ich mache mir Sorgen, weil Vercel versucht, es zu benutzen, um Geld zu verdienen."

Solid.js behielt den höchsten Zufriedenheitswert unter den großen Frameworks, obwohl seine Nutzung weit unter React, Vue und Svelte bleibt.

## Was Das Für TypeScript-Projekte Bedeutet

Die Umfrage bestätigt, was viele TypeScript-Entwickler bereits erleben: das Ökosystem hat sich um eine Reihe stabiler Präferenzen herum konsolidiert. TypeScript, Vite und entweder Next.js oder eine Meta-Framework-Alternative sind die Standardwahlen für neue Projekte.

Die Reibung verschiebt sich. Es geht nicht mehr darum, ob man TypeScript verwendet — es geht darum, Framework-Komplexität zu managen, während das Ökosystem über seine Rapid-Innovations-Phase hinaus reift.

Die vollständigen Umfrageergebnisse sind auf [2025.stateofjs.com](https://2025.stateofjs.com/en-US) verfügbar.
