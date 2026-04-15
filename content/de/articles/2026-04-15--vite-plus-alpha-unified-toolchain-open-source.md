---
title: "Vite+ Alpha: VoidZeros vereinheitlichtes Toolchain will Ihren gesamten JS-Stack ersetzen"
description: "Vite+ Alpha erscheint unter MIT-Lizenz und vereint Vite, Vitest, Oxlint, Oxfmt und Rolldown in einer einzigen vp-Binary. Node.js-Runtime- und Package-Manager-Verwaltung inklusive."
image: "https://viteplus.dev/og.jpg"
date: "2026-04-15"
category: Tooling
author: lschvn
readingTime: 5
tags: ["vite", "javascript", "tooling", "voidzero", "rolldown", "oxc", "release"]
tldr:
  - "Vite+ Alpha ist unter MIT-Lizenz verfügbar und kombiniert Vite, Vitest, Oxlint, Oxfmt, Rolldown und tsdown in einer einzigen vp-Binary."
  - "Der neue Vite Task Runner verwaltet Monorepo-Builds mit automatischem Caching — ohne manuelle Konfiguration."
  - "VoidZero hat Vite+ nach anfänglicher Überlegung einer kommerziellen Lizenz nun als Open Source unter MIT veröffentlicht."
faq:
  - q: "Ersetzt Vite+ Vite?"
    a: "Nein. Vite+ ist eine Metaebene über Vite 8 (und Vitest, Oxlint, Oxfmt, Rolldown und tsdown). Die zugrunde liegenden Projekte bleiben unabhängig."
  - q: "Wie unterscheidet sich Vite+ von der direkten Verwendung von Vite 8?"
    a: "Vite 8 übernimmt den Dev-Server und Production-Builds. Vite+ fügt vp install (intelligenter Paketmanager), vp check (Linting + Formatierung + Typprüfung), vp test (Vitest), vp run (Task-Runner mit Caching), vp pack (Library-Bundling über tsdown) und vp env (Node.js-Versionsverwaltung) hinzu — alles in einem Binary mit einer einzigen Konfigurationsdatei."
  - q: "Was ist mit der Lizenz? Ist das wirklich kostenlos?"
    a: "Ja, MIT-Lizenz. VoidZero hatte ursprünglich eine kommerzielle Lizenz geplant, hat aber nach Community-Feedback umgeschwenkt. Ihr Geschäftsmodell basiert auf Void Cloud, ihrer gehosteten Plattform."
---

VoidZero hat heute Vite+ Alpha veröffentlicht — eine vereinheitlichte Entwicklungstoolchain, die die wachsende Komplexität moderner JavaScript-Tools in eine einzige Binary namens `vp`压缩. Das Announcement deckt alles ab, von der Runtime-Verwaltung bis zum Production-Build, und alles ist Open Source unter der MIT-Lizenz.

## Was in Vite+ steckt

Vite+ orchestriert eine Reihe etablierter Rust-basierter Tools:

- **Vite 8** — Dev-Server und Build-Orchestrator
- **Vitest 4.1** — Test-Runner
- **Oxlint 1.52** — ESLint-kompatibler Linter (50–100× schneller)
- **Oxfmt Beta** — Prettier-kompatibler Formatter (bis zu 30× schneller)
- **Rolldown** — Production-Bundler (1,6× bis 7,7× schneller als Vite 7)
- **tsdown** — TypeScript-Library-Bundler
- **Vite Task** — neuer Task-Runner mit automatischem Caching

Das Versprechen: eine einzige Abhängigkeit, die Node-Version-Manager, `pnpm`/`npm`/`yarn`, `vite`, `vitest`, `eslint`, `prettier` und verschiedene CI-Caching-Skripte ersetzt. Eine `vite.config.ts` für alles.

## Die vp-Befehle

```bash
vp env          # Verwaltet Node.js global und pro Projekt
vp install      # Installiert Dependencies, wählt automatisch den richtigen Package Manager
vp dev          # Startet den Vite Dev-Server mit sofortigem HMR
vp check        # Führt Oxlint + Oxfmt + Typprüfung in einem Durchgang aus
vp test         # Führt Vitest aus
vp build        # Production-Build über Rolldown + Oxc
vp run          # Task-Runner mit automatischem Caching
vp pack         # Bundelt Libraries für npm oder erstellt eigenständige Binaries
vp create       # Generiert neue Projekte oder Monorepos
```

`vp check --fix` behebt Linting- und Formatierungsprobleme in einem Befehl. `vp run` imitiert die `pnpm run`-Oberfläche, fügt aber automatisches Input-Fingerprinting hinzu — wenn sich nichts geändert hat, wird das gecachte Ergebnis sofort wiedergegeben.

## Vite Task: Intelligenteres Monorepo-Building

Das innovativste Feature ist Vite Task, ein in Vite+ integrierter Task-Runner. Er verfolgt, welche Input-Dateien ein Befehl tatsächlich verwendet (via Fingerprinting), und überspringt die Ausführung, wenn sich die Inputs nicht geändert haben. Multi-Command-Skripte wie `tsc && vp build` werden in unabhängig gecachte Sub-Tasks aufgeteilt.

Die Konfiguration lebt in `vite.config.ts`:

```ts
export default defineConfig({
  run: {
    tasks: {
      'generate:icons': {
        command: 'node scripts/generate-icons.js',
        cache: true,
        envs: ['ICON_THEME'],
      },
    },
  },
})
```

Erster Durchlauf: generiert Icons; nachfolgende Durchläufe überspringen den Schritt, außer Quelldateien oder `ICON_THEME` ändern sich.

## Von kommerziell zu MIT

VoidZero hatte ursprünglich eine kommerzielle Lizenz mit kostenpflichtigen Features geplant. Das Alpha-Announcement macht einen Rückzieher: *"Wir hatten es satt, darüber zu streiten, welche Features kostenpflichtig sein sollten und wie sie gegated werden sollten, denn das schuf nur Reibung in den Workflows, die unsere Open-Source-Nutzer bereits genießen."* Das Geschäftsmodell des Unternehmens basiert nun auf Void Cloud, ihrer gehosteten Plattform.

## Zahlen

- **78,7k** GitHub-Sterne
- **69M+** wöchentliche npm-Downloads (Vite-Ökosystem)
- **35M+** wöchentliche npm-Downloads (Rolldown + Oxc-Tools kombiniert)

## Erste Schritte

```bash
# macOS / Linux
curl -fsSL https://vite.plus | bash

# Windows (PowerShell)
irm https://vite.plus/ps1 | iex

# Dann
vp help
vp create my-app
```

Migration läuft über `vp migrate`, oder man fügt den Migrations-Prompt in seinen bevorzugten KI-Coding-Assistenten ein.

Das ist ein Alpha-Release. Die Toolchain ist funktional, aber das Team macht klar, dass Stabilisierung und häufige Releases folgen werden. Für Entwickler, die es leid sind, mit einem halben Dutzend Konfigurationsdateien und CLI-Tools zu jonglieren, lohnt sich ein Blick auf Vite+ — oder ein Test heute.
