---
title: "State of JavaScript 2025: TypeScript dominiert, Vite überholt Webpack"
description: "Die State of JavaScript 2025-Umfrage zeigt TypeScript-Nutzung auf einem Allzeithoch, Vite zerstört Webpack bei der Zufriedenheit, und wachsende Bedenken über Next.js-Komplexität."
image: "https://assets.devographics.com/surveys/js2025-og.png"
date: "2026-03-25"
category: Ecosystem
author: lschvn
readingTime: 5
tags: ["typescript", "javascript", "state-of-js", "survey", "vite", "ecosystem"]
tldr:
  - "40 % der Entwickler schreiben jetzt ausschließlich in TypeScript (von 34 % in 2024); nur 6 % verwenden ausschließlich reines JavaScript."
  - "Vite erreicht 84 % Nutzung mit einem 98 % Zufriedenheitsscore, während die Webpack-Zufriedenheit auf 26 % zusammenbrach (von 36 % in 2024)."
  - "React bleibt mit 83,6 % am meisten genutzt, aber Next.js zieht wachsende Kritik wegen Komplexität und Vercels Geschäftsinteressen auf sich."
  - "Rolldown sprang von 1 % auf 10 % Nutzung in einem Jahr und signalisiert eine Rust-basierte Zukunft für die JavaScript-Build-Pipeline."
---

Die [State of JavaScript 2025](https://2025.stateofjs.com/en-US)-Umfrage, veröffentlicht im Februar 2026 nach der Datensammlung bis November 2025, zeichnet das Bild eines reifenden Ökosystems. TypeScript hat den Sprachkrieg klar gewonnen, Vite hat den Build-Tool-Krieg gewonnen — zumindest was die Stimmung betrifft — und Entwickler äußern sich zunehmend über Framework-Komplexität.

## TypeScript: Der eindeutige Gewinner

Die TypeScript-Nutzung steigt weiter an. **40 % der Befragten schreiben jetzt ausschließlich in TypeScript**, von 34 % in 2024 und 28 % in 2022. Nur 6 % verwenden ausschließlich reines JavaScript. Auf die Frage, was sie an JavaScript ändern würden, bleibt „fehlende statische Typisierung" der größte Schmerzpunkt.

Die Zahlen sind auf die beste Weise vernichtend. Daniel Roe, Nuxt-Core-Team-Leiter, brachte es im Fazit der Umfrage auf den Punkt:

> TypeScript hat gewonnen. Nicht als Bundler, sondern als Sprache.

Mit Type Stripping jetzt in stabilem [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) verfügbar, bröckeln die letzten technischen Barrieren. Die Frage ist nicht mehr, ob man TypeScript verwenden sollte — sondern wie schnell man migrieren kann.

## Build-Tools: Vite devastiert Webpack

Die Build-Tool-Narrative ist ebenso eindeutig. Vite liegt bei **84 % Nutzung mit einem 98 % Zufriedenheitsscore**. Webpack behält eine leicht höhere Gesamtnutzung bei 87 %, aber sein Zufriedenheitswert ist auf **26 %** zusammengebrochen, von 36 % in 2024.

Ein Befragter beschrieb den aktuellen Zustand: „Legacy-Code zu verstehen, der Webpack verwendet, kann schmerzhaft sein." Diese Stimmung resoniert.

Turbopack, Vercels Rust-basierter Webpack-Nachfolger, liegt bei nur 28 % Nutzung. Trotz erheblichem Marketing hat es nicht die Traktion gewonnen, die viele erwarteten. Die Rust-basierte Zukunft der Build-Pipeline könnte stattdessen [Rolldown](/articles/2026-03-26-vite-8-rolldown-era) sein — das Rollup-kompatible Toolchain, das von 1 % auf 10 % Nutzung in einem einzigen Jahr sprang.

## Frontend-Frameworks: React dominiert, aber Next.js kassiert Kritik

React bleibt mit **83,6 %** das am meisten genutzte Framework, aber die Umfrage enthüllte wachsende Unzufriedenheit. Next.js, von 59 % der Befragten genutzt, erzielte 21 % positive Stimmung gegenüber besorgniserregenden 17 % negativer Stimmung — und erzeugte mehr Kommentaraktivität als jedes andere Projekt.

Die Beschwerden gruppieren sich um Komplexität:

> „Ich habe Next.js seit 6 Jahren in Produktion geschrieben... die Next-Komplexität ist absurd geworden."

Andere äußerten Bedenken über Vercels Geschäftsinteressen, die die Richtung des Frameworks beeinflussen. Ein Befragter sagte: „Ich bin besorgt, weil Vercel versucht, damit Geld zu verdienen."

Solid.js hielt den höchsten Zufriedenheitswert unter den großen Frameworks, obwohl seine Nutzung deutlich unter React, Vue und Svelte liegt.

## Was das für TypeScript-Projekte bedeutet

Die Umfrage bestätigt, was viele TypeScript-Entwickler bereits erleben: Das Ökosystem hat sich um eine Reihe stabiler Präferenzen konsolidiert. TypeScript, Vite und entweder Next.js oder eine Meta-Framework-Alternative sind die Standardauswahl für neue Projekte.

Die Friktion verschiebt sich. Es geht nicht mehr darum, ob man TypeScript verwenden sollte — sondern darum, die Framework-Komplexität zu managen, wenn das Ökosystem über seine schnelle Innovationsphase hinausreift.

Die vollständigen Umfrageergebnisse sind verfügbar unter [2025.stateofjs.com](https://2025.stateofjs.com/en-US).
