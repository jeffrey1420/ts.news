---
title: "WebStorm 2026.1 bringt nativen TypeScript-Engine und Multi-Agent-KI zu JetBrains' Flaggschiff-IDE"
description: "JetBrains veröffentlicht WebStorm 2026.1 mit einer service-betriebenen TypeScript-Engine standardmäßig aktiviert, Integration mit Junie, Claude Agent und Codex, und verbessertem Framework-Support für React, Angular, Vue und Svelte."
image: "https://blog.jetbrains.com/wp-content/uploads/2026/03/WS-releases-BlogSocialShare-1280x720-1.png"
date: "2026-03-27"
category: Release
author: lschvn
readingTime: 4
tags: ["webstorm", "jetbrains", "typescript", "ai", "ide", "release"]
tldr:
  - "WebStorm 2026.1 aktiviert standardmäßig eine service-basierte TypeScript-Engine, die Korrektheit verbessert und CPU-Nutzung bei großen Projekten reduziert."
  - "KI-Chat unterstützt jetzt mehrere Agents: Junie, Claude Agent, Codex, Cursor und GitHub Copilot über das ACP Registry."
  - "'Next Edit Suggestions' funktionieren ohne AI-Kontingent auf Pro/Ultimate/Enterprise-Plänen und wenden verwandte Änderungen über Dateien hinweg an."
  - "Framework-Updates umfassen React use memo/use no memo-Direktiven, Angular 21-Template-Syntax und Vue 3.2.4 TypeScript-Plugin."
---

WebStorm 2026.1 ist diese Woche erschienen, und die wichtigsten Features spiegeln wider, wohin sich die JavaScript-Entwicklungstools entwickeln: eine intelligentere TypeScript-Engine standardmäßig, und ein vereinheitlichter KI-Chat, der mehrere Agents einbindet, darunter Claude Agent und Codex neben JetBrains' eigenem Junie.

## Service-basierte TypeScript-Engine jetzt Standard

Die größte Änderung unter der Haube ist die TypeScript-Engine. WebStorm verwendet jetzt standardmäßig eine service-basierte Implementierung, die nach Angaben von JetBrains die Korrektheit verbessert und gleichzeitig die CPU-Nutzung bei großen Projekten reduziert. Die Änderung soll Navigation, Inspektionen und Refactorings reaktionsschnell halten, wenn mit umfangreichen TypeScript-Codebasen gearbeitet wird.

Das Release orientiert sich auch an TypeScript 6-Änderungen, einschließlich Updates, wie der Compiler den `types`-Wert und `rootDir`-Standardwerte behandelt. Für Teams, die die TypeScript 7-Roadmap beobachten — der Go-basierte Rewrite, der später dieses Jahr erscheint — hat WebStorm begonnen, seine Konfigurationsbehandlung anzupassen, um die geplanten Änderungen von `baseUrl` zu entsprechen.

## KI-Chat wird ernst

Die KI-Geschichte in diesem Release ist von Grund auf Multi-Agent. Zusätzlich zu Junie und [Claude Agent](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) fügt WebStorm 2026.1 [Codex](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) zur integrierten KI-Chat der IDE hinzu. Der JetBrains KI-Chat unterstützt jetzt auch Cursor, GitHub Copilot und alle anderen Agents, die im ACP Registry veröffentlicht wurden.

Das ACP Registry, früher in diesem Jahr eingeführt, ermöglicht es Ihnen, Agents zu durchsuchen und zu installieren, ohne die IDE zu verlassen. Die Idee ist straightforward: Verschiedene Agents excel bei verschiedenen Aufgaben, und zwischen ihnen wechseln zu können, ohne Ihren Workflow zu unterbrechen, ist das Ziel.

Ebenfalls neu: "Next Edit Suggestions" funktionieren jetzt ohne AI-Kontingent-Verbrauch auf Pro, Ultimate und Enterprise-Plänen. Im Gegensatz zu traditionellem Autocomplete, das nur das an Ihrem Cursor aktualisiert, wenden diese Vorschläge verwandte Änderungen über eine gesamte Datei hinweg an — JetBrains nennt es ein "Tab Tab-Erlebnis" für die Aufrechterhaltung von Code-Konsistenz mit minimaler Reibung.

## Framework-Updates

Framework-Support hält mit schnellen Releases im gesamten Ökosystem Schritt:

- **React**: Highlighting für die neuen `use memo` und `use no memo` Direktiven neben bestehenden `use client` und `use server`
- **Angular 21**: Support für Arrow-Funktionen, `instanceof`-Operator, reguläre Ausdrücke und Spread-Syntax in Templates
- **Vue**: Aktualisiert auf `@vue/typescript-plugin` 3.2.4 für Kompatibilität mit dem neuesten TypeScript-Tooling in `.vue`-Dateien
- **Astro**: JSON-Konfiguration kann jetzt direkt vom IDE-Einstellungen an den Astro-Sprachserver übergeben werden
- **Svelte**: Generics-Support in `<script>`-Tags mit Usage-Suche, Navigation und Rename-Refactoring für Typparameter

## String-Literal Import/Export-Support

WebStorm parst und versteht jetzt String-Literal-Namen in Import- und Export-Spezifizierern — standardkonforme Syntax, die mit Code wie `export { a as "a-b" }` und `import { "a-b" as a } from "./file.js"` funktioniert. Navigation, Highlighting und Refactoring funktionieren alle korrekt mit dieser Syntax.

## CSS-Farbräume

Unterstützung für moderne CSS-Farbräume bedeutet, dass Farbauswahlen und Vorschauen jetzt `oklch`, `oklab`, `hwl` und andere Farbformate verarbeiten, die in den CSS Color Level 4-Spezifikationen definiert sind.

WebStorm 2026.1 ist über die Toolbox App oder direkten Download von [jetbrains.com/webstorm/download](https://www.jetbrains.com/webstorm/download) verfügbar.
