---
title: "Vite+: Eine CLI zum Herrschen — Oder nur eine weitere Ebene des Hypes?"
description: "VoidZeros Vite+ verspricht, Runtime, Paketmanager, Bundler, Linter, Formatter und Test-Runner unter einem einzigen Befehl zu vereinen. Wir haben die Ankündigungen gelesen, die Behauptungen benchmarkt und mit Menschen gesprochen, die es in Produktion nutzen."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["vite", "javascript", "tooling", "rolldown", "oxc", "build-tools", "open-source"]
readingTime: 14
image: "https://viteplus.dev/og.jpg"
tldr:
  - "Vite+ ist eine Alpha-CLI von VoidZero (Evan You), die Vite, Vitest, Oxlint, Oxfmt, Rolldown und tsdown unter dem einzelnen Befehl `vp` bündelt."
  - "Rolldown liefert 1,6x–7,7x schnellere Production-Builds als Vite 7 ; Oxlint ist 50–100x schneller als ESLint ; Oxfmt ~30x schneller als Prettier."
  - "Alle Tools teilen denselben Oxc-Parser/Resolver und eliminieren so redundante AST-Neuerstellung über die Pipeline hinweg."
  - "Vite+ ist MIT-lizenziert ; VoidZeros Einnahmen kommen von der geplanten VoidCloud-Enterprise-Schicht — das Open-Source-Commitment ist echt, aber值得关注."
faq:
  - question: "Ist Vite+ produktionsreif?"
    answer: "Vite+ ist explizit Alpha. Einige APIs werden sich vor dem stabilen Release ändern, Plugin-Kompatibilität für Edge-Cases ist möglicherweise nicht vollständig getestet, und die Dokumentation ist unvollständig. Die darunterliegenden Tools — Vite 8, Rolldown, Oxc — sind jedoch reifer, als das 'Alpha'-Label vermuten lässt."
  - question: "Was ist der Unterschied zwischen Vite+ und einfach die Tools einzeln verwenden?"
    answer: "Vite+ fügt Bequemlichkeit hinzu: ein einzelnes Binary, eine einzelne Konfigurationsdatei, ein einzelnes mentales Modell für den vollständigen Entwicklungszyklus. Für neue Projekte und Teams, die von Tool-Komplexität frustriert sind, hat diese Bequemlichkeit Wert. Aber die Tools selbst sind einen Blick wert, ob man den Wrapper nutzt oder nicht."
  - question: "Wird VoidZero die Lizenz ändern wie Terraform oder Redis?"
    answer: "Die MIT-Lizenz ist ein echtes Commitment — VoidZero hat nach Community-Feedback explizit ein Paid-Lizenzmodell aufgegeben. Aber das Geschäftsmodell des Unternehmens hängt von etwas jenseits der MIT-lizenzierten Tools ab. Dieses 'VoidCloud' ist noch nicht öffentlich. Die Geschichte von HashiCorp mit Terraform ist beachtenswert, aber VoidZero war explizit bei seinen Absichten."
---

Alle paar Jahre kündigt jemand im JavaScript-Ökosystem ein vereinheitlichtes Toolchain an — weniger Konfigurationsdateien, ein Befehl zu lernen, weniger Zeit damit, Build-Pipelines zu überwachen. Das Ergebnis ist meist komplizierter als angekündigt. Aber Vite+, von VoidZero (gegründet von Evan You, dem Schöpfer von Vue.js und Vite, mit 4,6M$ von Accel), kommt mit Tools, deren Leistungsbehauptungen unabhängig verifiziert sind: Rolldown liefert 1,6× bis 7,7× schnellere Production-Builds als Vite 7, und Oxlint läuft 50-100× schneller als ESLint.

## Was genau ist Vite+?

Vite+ ist eine Alpha-CLI, die eine Reihe bestehender VoidZero-Projekte — Vite, Vitest, Oxlint, Oxfmt, Rolldown und tsdown — unter einem einzigen Einstiegspunkt namens `vp` bündelt.

Die Befehle:
- `vp env`: verwaltet Node.js-Installation global und pro Projekt
- `vp install`: delegiert an einen Paketmanager (Standard: pnpm)
- `vp dev`: startet den Vite-Entwicklungsserver
- `vp check`: führt Oxlint, Oxfmt und tsgo in einem Durchgang aus
- `vp test`: führt Vitest aus
- `vp build`: baut mit Rolldown
- `vp run`: führt package.json-Scripts über Vite Task mit automatischem Cache aus
- `vp pack`: packt Bibliotheken mit tsdown + Rolldown

Das erklärte Ziel ist, die Sequenz separater Befehle durch ein einzelnes Binary und eine einzelne Konfigurationsdatei (`vite.config.ts`) zu ersetzen.

## Warum macht VoidZero das?

VoidZeros Kernargument: Das JavaScript-Ökosystem hat zu viele Nahtstellen zwischen Tools angehäuft. ESLint parsed Ihren Code. Prettier formatiert ihn. tsc type-checkt ihn. Rollup bundlet ihn. Jedes Tool macht sein eigenes Parsing, seine eigene Traversierung, seine eigene Transformation. Der AST wird immer wieder aus der Quelle neu aufgebaut.

Die VoidZero-Vision: Besitz der vollständigen Toolchain-Stapel: Parser (oxc-parser), Transformer (oxc-transform), Linter (Oxlint), Formatter (Oxfmt), Bundler (Rolldown), Test-Runner (Vitest) und Dev-Server (Vite). Wenn jedes Tool dieselbe AST-Darstellung und denselben Resolver teilt, eliminieren Sie redundantes Parsing.

Das Geschäftsmodell: Vite+ selbst ist MIT-lizenziert und vollständig Open Source. VoidZeros Einnahmen kommen von "VoidCloud," einer Enterprise-Schicht — demselben Modell wie HashiCorp mit Terraform.

## Was ist wirklich neu vs. neu verpackt?

**Rolldown** ist der bedeutendste originäre Beitrag. Es ist ein Rust-basierter Bundler auf Oxc, der sowohl esbuild (für Dev-Transforms) als auch Rollup (für Production-Builds) ersetzen soll. Auf einer mittelgroßen React-Anwendung (180K Zeilen TypeScript, 60 Routes) maß ein Entwickler Production-Builds, die von 94 Sekunden (Rollup) auf 11 Sekunden (Rolldown) fielen — etwa 8,5× schneller.

**Oxc** ist die darunterliegende Engine. Oxlint ist 50-100× schneller als ESLint. Oxfmt ist etwa 30× schneller als Prettier. Diese Zahlen sind real und unabhängig verifiziert.

**Vite Task** ist das neue Stück in Vite+. Es ist ein Task-Runner, der automatischen Caching zur Script-Ausführung hinzufügt. Es versteht auch den Monorepo-Abhängigkeitsgraphen und führt Tasks in der richtigen Reihenfolge aus.

Was nicht neu ist: Vite, Vitest, Oxlint, Oxfmt und Rolldown existierten alle vor Vite+.

## Die Leistungsbehauptungen: Real, aber lesen Sie das Kleingedruckte

Die Hauptbehauptungen:
- ~1,6× bis ~7,7× schnellere Production-Builds vs Vite 7
- ~50× bis ~100× schnelleres Linting vs ESLint
- ~30× schnelleres Formatting vs Prettier

Diese Zahlen sind real, aber die Varianz ist groß. Kleinere Projekte sehen bescheidene Gewinne. Komplexe Codebases sehen die größeren Gewinne.

Die Migrationspfad für Teams, die bereits Vite verwenden, ist genuin fließend:
1. `vp` global installieren
2. `vp migrate` ausführen — ein automatisches Migrations-Tool
3. einzelne Befehle durch `vp dev`, `vp test`, `vp check`, `vp build` ersetzen

## Wer sollte sich jetzt darum kümmern, und wer sollte warten

**Jetzt upgraden wenn:**
- Sie ein neues Projekt in 2026 starten und eine schnelle, minimale Config wollen
- Sie bereits Vite verwenden und Ihre Toolchain vereinfachen wollen
- Sie ein großes Monorepo haben und Vite Task-Caching für Script-Ausführung wollen

**Warten Sie wenn:**
- Ihr Projekt komplexe benutzerdefinierte ESLint-Regeln verwendet, die Oxlint noch nicht unterstützt
- Sie auf einer älteren Vite-Version sind und keine Zyklen zum Testen der Migration aufwenden können

## Der skeptische Fall

Das stärkste Argument gegen Vite+ ist, dass es ein Neuverpacken bestehender Tools in unified Branding ist. Wenn Sie bereits Vite 8 mit Rolldown, Oxlint und Vitest verwenden, gibt Ihnen Vite+ eine schönere CLI und eine Konfigurationsdatei. Das ist echter Wert — aber inkrementeller Wert auf Tools, die Sie bereits selbst zusammensetzen konnten.

Die VoidZero-Abhängigkeit ist auch eine Sorge. Vite war ursprünglich ein Community-Projekt ohne Unternehmen dahinter. Jetzt ist es ein Unternehmen mit Venture-Finanzierung, einer Enterprise-Produkt-Roadmap und einem Geschäftsmodell, das noch nicht vollständig offengelegt wurde.

## Das redaktionelle Urteil

Vite+ ist keine Revolution. Es ist eine gut gestaltete Distribution genuin guter Tools, die bereits einzeln wert waren, verwendet zu werden.

Die Rust-basierte JavaScript-Toolchain — Oxc, Rolldown und die darauf aufbauenden Projekte — repräsentiert einen echten und signifikanten Leistungssprung über die JavaScript-basierten Tools, die sie ersetzt. Dieser Rust-Migration ist im gesamten Ökosystem sichtbar.

Die Tools unter Vite+ sind es wert, bekannt zu sein, ob man den Wrapper verwendet oder nicht. Rolldown ersetzt Rollup. Oxlint ersetzt ESLint für Teams, die Geschwindigkeit wollen. Die JavaScript-Toolchain-Landschaft verschiebt sich hin zu nativen Sprachen, und Vite+ ist die kohärenteste Schnittstelle zu diesem Wandel bisher.
