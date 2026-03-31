---
title: "State of JavaScript 2025: TypeScript dominiert, Vite überholt Webpack"
description: "Die State of JavaScript 2025 Umfrage zeigt TypeScript-Nutzung auf einem Allzeithoch, Vite schlägt Webpack bei der Zufriedenheit und wachsende Bedenken über die Komplexität von Next.js."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-25"
category: Ecosystem
author: lschvn
readingTime: 5
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "40 % der Entwickler schreiben mittlerweile ausschließlich in TypeScript (gegenüber 34 % 2024); nur 6 % nutzen ausschließlich Plain JavaScript."
  - "Vite erreicht 84 % Nutzung mit einem Zufriedenheitsscore von 98 %, während die Webpack-Zufriedenheit auf 26 % einbrach (von 36 % 2024)."
  - "React bleibt mit 83,6 % das Meistgenutzte, aber Next.js zieht wachsende Kritik über Komplexität und Vercels Geschäftsinteressen auf sich."
  - "Rolldown sprang von 1 % auf 10 % Nutzung in einem Jahr und kündigt eine Rust-basierte Zukunft für die JavaScript-Build-Pipeline an."
faq:
  - question: "Ersetzt TypeScript JavaScript als Standardwahl?"
    answer: "Fast. 40 % der Entwickler schreiben mittlerweile ausschließlich in TypeScript (von 34 % 2024), während nur 6 % ausschließlich bei Plain JavaScript bleiben. Daniel Roe, Nuxt-Core-Teamleiter, brachte es in der Umfrage unverblümt auf den Punkt: 'TypeScript hat gewonnen. Nicht als Bundler, sondern als Sprache.' Mit dem nun stabilen Type Stripping in Node.js sind die letzten technischen Barrieren gefallen."
  - question: "Warum bricht die Webpack-Zufriedenheit ein und was ersetzt es?"
    answer: "Webpacks Zufriedenheitswert fiel auf 26 % 2025, von 36 % 2024, während Entwickler Frust über seine Komplexität und steile Lernkurve äußerten. Vite dominiert mit 98 % Zufriedenheit bei 84 % Nutzung. Turbopack liegt bei nur 28 % Nutzung. Und Rolldown — das Rollup-kompatible, Rust-basierte Toolchain — sprang von 1 % auf 10 % Nutzung in einem einzigen Jahr."
  - question: "Was treibt die Next.js-Kritik trotz hoher Nutzung an?"
    answer: "Next.js weist 21 % positive Stimmung gegen besorgniserregende 17 % negative Stimmung auf — und erzeugt mehr Kommentaraktivität als jedes andere Projekt. Entwickler nennen wachsende Komplexität ('die Next.js-Komplexität ist absurd geworden') und Bedenken über Vercels Geschäftsinteressen, die die Richtung des Frameworks prägen. Solid.js hält den höchsten Zufriedenheitswert unter den großen Frameworks."
---

Die [State of JavaScript 2025](https://2025.stateofjs.com/en-US) Umfrage, im Februar 2026 nach Erfassung der Antworten bis November 2025 veröffentlicht, zeichnet das Bild eines reifenden Ökosystems. TypeScript hat die Sprachkrieg definitiv gewonnen, Vite hat den Build-Tool-Krieg gewonnen — zumindest in der Stimmung — und Entwickler werden zunehmend laut über Framework-Komplexität.

## TypeScript: Der eindeutige Gewinner

Die TypeScript-Nutzung steigt weiter. **40 % der Befragten schreiben mittlerweile ausschließlich in TypeScript**, von 34 % 2024 und 28 % 2022. Nur 6 % nutzen ausschließlich Plain JavaScript. Als sie gefragt wurden, was sie an JavaScript ändern würden, bleibt „Fehlen statischer Typisierung" der meistgenannte Schmerzenspunkt.

Die Zahlen sind vernichtend — im besten Sinne. Daniel Roe, Nuxt-Core-Teamleiter, brachte es in der Umfrage-Konklusion unverblümt auf den Punkt:

> TypeScript hat gewonnen. Nicht als Bundler, sondern als Sprache.

Mit Type Stripping, das nun in stabilem [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) verfügbar ist, bröckeln die letzten technischen Barrieren. Die Frage ist nicht mehr, ob man TypeScript verwenden sollte — es geht darum, wie schnell man migrieren kann.

## Build-Tools: Vite verwüstet Webpack

Die Build-Tool-Erzählung ist ebenso entschieden. Vite liegt bei **84 % Nutzung mit einem Zufriedenheitsscore von 98 %**. Webpack hält eine leicht höhere Gesamtnutzung bei 87 %, aber sein Zufriedenheitswert ist auf **26 %** eingebrochen, von 36 % 2024.

Ein Befragter beschrieb den aktuellen Zustand: „Versuchen, Legacy-Code zu verstehen, der Webpack verwendet, kann schmerzhaft sein." Das Gefühl findet Widerhall.

Turbopack, Vercels Rust-basierter Nachfolger von Webpack, liegt bei nur 28 % Nutzung. Trotz erheblichen Marketings hat es nicht die Zugkraft bekommen, die viele erwarteten. Die Rust-basierte Zukunft der Build-Pipeline könnte stattdessen [Rolldown](/articles/2026-03-26-vite-8-rolldown-era) sein — die Rollup-kompatible Toolchain, die von 1 % auf 10 % Nutzung in einem einzigen Jahr sprang.

## Frontend-Frameworks: React dominiert, aber Next.js zieht Feuer

React bleibt mit **83,6 %** das meißtgenutzte Framework, aber die Umfrage enthüllte wachsende Unzufriedenheit. Next.js, von 59 % der Befragten verwendet, wies 21 % positive Stimmung gegen besorgniserregende 17 % negative Stimmung auf — und erzeugte mehr Kommentaraktivität als jedes andere Projekt.

Die Beschwerden konzentrieren sich auf Komplexität:

> „Ich schreibe seit fast 6 Jahren Next.js in Produktion... die Next-Komplexität ist absurd geworden."

Andere äußerten Bedenken über Vercels Geschäftsinteressen, die die Richtung des Frameworks prägen. Ein Befragter brachte es auf den Punkt: „Ich mache mir Sorgen, weil Vercel es versucht, damit Geld zu verdienen."

Solid.js hielt den höchsten Zufriedenheitswert unter den großen Frameworks, obwohl seine Nutzung weit unter React, Vue und Svelte bleibt.

## Was das für TypeScript-Projekte bedeutet

Die Umfrage bestätigt, was viele TypeScript-Entwickler bereits erleben: Das Ökosystem hat sich um eine Reihe stabiler Präferenzen gesammelt. TypeScript, Vite und entweder Next.js oder eine Meta-Framework-Alternative sind die Standardwahlen für neue Projekte.

Die Reibung verlagert sich. Es geht nicht mehr darum, ob man TypeScript verwendet — es geht darum, Framework-Komplexität zu managen, während das Ökosystem über seine Rapid-Innovations-Phase hinausreift.

Die vollständigen Umfrageergebnisse sind auf [2025.stateofjs.com](https://2025.stateofjs.com/en-US) verfügbar.
