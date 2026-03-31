---
title: "WebStorm 2026.1 bringt native TypeScript-Engine und Multi-Agent-KI zu JetBrains' Flaggschiff-IDE"
description: "JetBrains veröffentlicht WebStorm 2026.1 mit standardmäßig aktivierter servicegestützter TypeScript-Engine, Integration mit Junie, Claude Agent und Codex, sowie verbesserter Framework-Unterstützung für React, Angular, Vue und Svelte."
image: "https://blog.jetbrains.com/wp-content/uploads/2026/03/WS-releases-BlogSocialShare-1280x720-1.png"
date: "2026-03-27"
category: Release
author: lschvn
readingTime: 4
tags: ["webstorm", "jetbrains", "typescript", "ai", "ide", "release"]
tldr:
  - "WebStorm 2026.1 aktiviert standardmäßig eine servicegestützte TypeScript-Engine und verbessert die Korrektheit bei reduzierter CPU-Nutzung in großen Projekten."
  - "KI-Chat unterstützt jetzt mehrere Agents: Junie, Claude Agent, Codex, Cursor und GitHub Copilot über das ACP Registry."
  - "'Next Edit Suggestions' funktionieren ohne KI-Kontingentverbrauch bei Pro/Ultimate/Enterprise-Plänen und wenden verwandte Änderungen über Dateien hinweg an."
  - "Framework-Updates umfassen React `use memo`/`use no memo` Direktiven, Angular 21 Template-Syntax und Vue 3.2.4 TypeScript-Plugin."
---

WebStorm 2026.1 ist diese Woche erschienen, und die Hauptfunktionen spiegeln wider, wohin sich die JavaScript-Entwicklungstools entwickeln: eine intelligentere TypeScript-Engine standardmäßig und ein einheitlicher KI-Chat, der mehrere Agents einbindet, darunter Claude Agent und Codex neben JetBrains' eigenem Junie.

## Servicegestützte TypeScript-Engine jetzt Standard

Die größte Änderung unter der Haube ist die TypeScript-Engine. WebStorm verwendet jetzt standardmäßig eine servicegestützte Implementierung, die laut JetBrains die Korrektheit verbessert und gleichzeitig die CPU-Nutzung in großen Projekten reduziert. Die Änderung soll Navigation, Inspektionen und Refactorings reaktionsschnell halten, wenn an umfangreichen TypeScript-Codebasen gearbeitet wird.

Das Release alignt WebStorm auch mit TypeScript 6 Änderungen, einschließlich Updates, wie der Compiler `types`-Wert und `rootDir`-Standardwerte behandelt. Für Teams, die die TypeScript 7 Roadmap beobachten – die Go-basierte Neuschreibung, die später dieses Jahr erscheint – hat WebStorm begonnen, seine Konfigurationsbehandlung anzupassen, um den geplanten Änderungen an `baseUrl` zu entsprechen.

## KI-Chat wird ernst

Die KI-Story in diesem Release ist bewusst Multi-Agent. Zusätzlich zu Junie und [Claude Agent](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) fügt WebStorm 2026.1 [Codex](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) zur integrierten KI-Chat der IDE hinzu. Der JetBrains KI-Chat unterstützt jetzt auch Cursor, GitHub Copilot und alle anderen Agents, die im ACP Registry veröffentlicht wurden.

Das ACP Registry, earlier this year eingeführt, lets you browse and install agents without leaving the IDE. Die Idee ist straightforward: verschiedene Agents excels at different tasks, und in der Lage zu sein, between them zu wechseln, ohne seinen Workflow zu unterbrechen, ist das Ziel.

Auch neu: "Next Edit Suggestions" funktionieren jetzt ohne KI-Kontingentverbrauch bei Pro, Ultimate und Enterprise Plänen. Anders als traditionelles Autocomplete, das nur das an der Cursor-Position aktualisiert, wenden diese Vorschläge verwandte Änderungen über eine gesamte Datei hinweg an – JetBrains nennt es ein "Tab Tab Erlebnis" um Code mit minimaler Reibung konsistent zu halten.

## Framework-Updates

Die Framework-Unterstützung hält mit den schnellen Releases im Ökosystem Schritt:

- **React**: Highlighting für die neuen `use memo` und `use no memo` Direktiven neben den bestehenden `use client` und `use server`
- **Angular 21**: Support für Arrow-Funktionen, `instanceof` Operator, reguläre Ausdrücke und Spread-Syntax in Templates
- **Vue**: Aktualisiert auf `@vue/typescript-plugin` 3.2.4 für Kompatibilität mit der neuesten TypeScript-Tooling in `.vue` Dateien
- **Astro**: JSON-Konfiguration kann jetzt direkt vom IDE-Settings an den Astro Language Server übergeben werden
- **Svelte**: Generics-Support in `<script>` Tags mit Usage-Search, Navigation und Rename-Refactoring für Type-Parameter

## String-Literal Import/Export Support

WebStorm parst und versteht jetzt String-Literal-Namen in Import- und Export-Specifiers – standardkonforme Syntax, die mit Code wie `export { a as "a-b" }` und `import { "a-b" as a } from "./file.js"` funktioniert. Navigation, Highlighting und Refactoring funktionieren alle korrekt mit dieser Syntax.

## CSS Color Spaces

Support für moderne CSS Color Spaces bedeutet, dass Color-Picker und Vorschauen jetzt `oklch`, `oklab`, `hwl` und andere im CSS Color Level 4 Spec definierte Color-Formate behandeln.

WebStorm 2026.1 ist über die Toolbox App oder direkten Download von [jetbrains.com/webstorm/download](https://www.jetbrains.com/webstorm/download) verfügbar.
