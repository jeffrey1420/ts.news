---
title: "Vite+: Eine CLI, um sie alle zu herrschen — Oder nur eine weitere Schicht Hype?"
description: "VoidZero's Vite+ verspricht, Runtime, Package Manager, Bundler, Linter, Formatter und Test-Runner unter einem einzigen Befehl zu vereinen. Wir haben die Ankündigungen gelesen, die Behauptungen benchmarked und mit Menschen gesprochen, die es in Produktion verwenden. Hier ist, was wir fanden."
date: "2026-03-22"
category: "deep-dive"
author: lschvn
tags: ["vite", "javascript", "tooling", "rolldown", "oxc", "build-tools", "open-source"]
readingTime: 14
image: "https://viteplus.dev/og.jpg"
tldr:
  - "Vite+ ist eine Alpha-CLI von VoidZero (Evan You), die Vite, Vitest, Oxlint, Oxfmt, Rolldown und tsdown unter dem einzelnen `vp`-Befehl zusammenfasst."
  - "Rolldown liefert 1.6x–7.7x schnellere Produktions-Builds als Vite 7; Oxlint ist 50–100x schneller als ESLint; Oxfmt ~30x schneller als Prettier."
  - "Alle Tools teilen denselben Oxc-Parser/Resolver und eliminieren redundantes AST-Rebuilding über die Pipeline."
  - "Vite+ ist MIT-lizenziert; VoidZero's Einnahmen kommen von der geplanten VoidCloud-Enterprise-Schicht — das Open-Source-Commitment ist genuin, aber es lohnt sich, im Auge zu behalten."
---

Alle paar Jahre kündigt jemand im JavaScript-Ökosystem ein vereinheitlichtes Toolchain an — weniger Config-Dateien, ein Befehl zu lernen, weniger Zeit damit, Build-Pipelines zu babysitten. Das Ergebnis ist usualerweise komplizierter als angekündigt. Aber Vite+, von VoidZero (gegründet von Evan You, dem Schöpfer von Vue.js und Vite, backed by $4.6 million from Accel), arrives with tools whose performance claims are independently verified: Rolldown delivers 1.6× to 7.7× faster production builds than Vite 7, and Oxlint runs 50-100× faster than ESLint.

Vite+ ist der neueste Teilnehmer in dieser Tradition, und es kommt mit mehr Glaubwürdigkeit als die meisten. Es kommt von VoidZero, der Firma, die Ende 2024 von Evan You gegründet wurde, dem Schöpfer von Vue.js und Vite. Das Team umfasst Kernmitwirkende an Vite, Vitest, Oxc und ehemalige Mitwirkende an Rspack. Die Firma sammelte $4.6 Millionen in Seed-Finanzierung von Accel, mit Backing von Figuren bei Supabase, Netlify, Sentry und NuxtLabs.

Dieses Profil ist es wert, ernst genommen zu werden. Aber Glaubwürdigkeit gleich nicht Substanz, und "vereinheitlichte Toolchain" wurde zuvor versucht. Dieser Artikel ist ein Versuch, zu trennen, was Vite+ tatsächlich ist, von dem, was es behauptet zu sein, und die Fragen zu beantworten, die die Ankündigungsposts offen lassen.

## Was genau ist Vite+?

Vite+ ist eine Alpha-Stage CLI, die eine Reihe existierender VoidZero-Projekte — Vite, Vitest, Oxlint, Oxfmt, Rolldown und tsdown — under a single entry point called `vp`.

Die Befehle sind:

- `vp env`: verwaltet Node.js-Installation global und pro Projekt
- `vp install`: delegiert an einen Package Manager (standardmäßig pnpm)
- `vp dev`: führt den Vite Development Server aus
- `vp check`: führt Oxlint (Linter), Oxfmt (Formatter) und tsgo (Type Checking) in einem Durchgang aus
- `vp test`: führt Vitest aus
- `vp build`: baut mit Rolldown
- `vp run`: führt Package.json-Scripts via Vite Task aus, einem neuen Runner mit Caching und Dependency-Awareness
- `vp pack`: packt Bibliotheken mit tsdown + Rolldown

Das erklärte Ziel ist, die Sequenz separater Befehle und Config-Dateien, die ein typisches Projekt erfordert — `pnpm install`, `vite`, `vitest`, `eslint`, `prettier`, `tsc --noEmit`, `rollup` — mit einem Binary und einer Konfigurationsdatei (`vite.config.ts`) zu ersetzen.

Auf dem Papier ist Vite+ eine polierte Distribution von Tools, die bereits existieren. Es führt keine neuen Parsing-Algorithmen oder neuartige Bundling-Strategien ein. Es wrappen und orchestriert existierendes Rust-basiertes Tooling, das VoidZero bereits Open-Source gestellt hat.

## Warum macht VoidZero das?

Die strategische Logik ist kohärent, selbst wenn das "vereinheitlichte Toolchain"-Framing teilweise Marketing ist.

VoidZero's Kernargument ist, dass das JavaScript-Ökosystem zu viele Nähte zwischen Tools angehäuft hat. ESLint parsed Ihren Code. Prettier formatiert ihn. tsc type-checkt ihn. Rollup bundled ihn. Vitest testet ihn. Jedes Tool macht sein eigenes Parsing, seine eigene Traversierung, seine eigene Transformation. Der AST wird aus Quelle wiederholt rebuilt. Das Tooling ist individuell schnell, aber die Pipeline hat strukturelle Ineffizienzen, die keine inkrementelle Optimierung innerhalb jedes Tools beheben kann.

Die VoidZero-Vision — am klarsten artikuliert in Evan You's Gründungsannouncement — ist es, den vollständigen Stack der Toolchain zu besitzen: Parser (oxc-parser), Transformer (oxc-transform), Linter (Oxlint), Formatter (Oxfmt), Bundler (Rolldown), Test Runner (Vitest) und Dev Server (Vite). Wenn jedes Tool dieselbe AST-Darstellung und denselben Resolver teilt, eliminieren Sie redundantes Parsing und Sie können die gesamte Pipeline als System optimieren, nicht als Sammlung unabhängiger Komponenten.

Dies ist dasselbe vertikale Integrationsargument, das Bun für die JavaScript-Runtime-Schicht gemacht hat, und das Turbopack für die Bundler-Schicht. VoidZero macht es für die gesamte Frontend-Toolchain.

Das Geschäftsmodell: Vite+ selbst ist MIT-lizenziert und vollständig Open Source. VoidZero's Einnahmen kommen von "VoidCloud," einer Enterprise-Schicht, die voraussichtlich Sicherheits-Scanning, Compliance-Tooling und verwaltete Infrastruktur hinzufügt — dasselbe Modell, das HashiCorp mit Terraform verwendete, und das Redis vor seiner Lizenzkontroverse adoptierte.

## Was ist tatsächlich neu vs. Umverpackt?

Diese Unterscheidung ist wichtig.

**Rolldown** ist der bedeutendste originäre Beitrag. Es ist ein Rust-basierter Bundler, aufgebaut auf Oxc, designed to replace both esbuild (which Vite used for dev transforms) und Rollup (which Vite used for production builds). Rolldown ist genuin neue Infrastruktur, und seine Performance-Zahlen sind real. Auf einer mittelgroßen React-Anwendung (180K Zeilen TypeScript, 60 Routes) maß ein Entwickler Produktions-Builds, die von 94 Sekunden (Rollup) auf 11 Sekunden (Rolldown) fielen — roughly 8.5× faster. Andere Teams berichten von 4× bis 20× Verbesserungen je nach Projektgröße.

**Oxc** ist die zugrundeliegende Engine. Es stellt den Parser, Transformer, Resolver, Linter und Formatter bereit. Oxlint ist 50–100× schneller als ESLint. Oxfmt ist ungefähr 30× schneller als Prettier. Dies sind echte Zahlen aus Oxc's eigenen Benchmarks, und sie wurden in mehreren Community-Tests unabhängig verifiziert.

**Vite Task** ist das neue Stück innerhalb Vite+. Es ist ein Task-Runner, der automatisiertes Caching zur Script-Ausführung hinzufügt — wenn sich die Inputs nicht geändert haben, überspringt es den Task und spielt die gecachte Output ab. Es versteht auch den Monorepo-Abhängigkeitsgraphen und führt Tasks in der richtigen Reihenfolge aus. Dies ist genuin nützlich für große Monorepos, und das Caching-Verhalten ist eine Quality-of-Life-Verbesserung, die die meisten Teams mit Turbo oder Nx approximiert haben.

**tsdown** ist ein Library-Packaging-Tool, das TypeScript-Deklarationsdateien generiert und Bibliotheken für npm bundled. Es ist eingeschlossen, aber nicht neuartig.

Was nicht neu ist: Vite, Vitest, Oxlint, Oxfmt und Rolldown existierten alle vor Vite+. Vite+ ist ein Distributionsmechanismus, kein Forschungsprojekt.

## Die Performance-Behauptungen: Real, aber lesen Sie das Kleingedruckte

Die Kernbehauptungen sind kühn:

- ~1.6× bis ~7.7× schnellere Produktions-Builds compared to Vite 7
- ~50× bis ~100× schnelleres Linting als ESLint
- Bis zu ~30× schnelleres Formatieren als Prettier
- Bis zu 100.000 Komponenten-Mounts in 100ms (Vue 3.6 mit Vapor Mode)

Diese Zahlen sind real, aber sie erfordern Kontext.

Die 1.6× bis 7.7× Build-Geschwindigkeitsverbesserung ist real und signifikant, aber die Varianz ist groß. Kleinere Projekte sehen bescheidene Gewinne. Komplexe Codebases mit vielen Modulen sehen die größeren Gewinne. Die Zahl zu beobachten ist nicht die Obergrenze — es ist die Tatsache, dass Produktions-Builds, die jahrelang der langsamste Teil des Entwicklungszyklus waren, jetzt 5–10× schneller werden overall. Das Vue-Team hat [ähnliche Performance-Gewinne mit Vapor Mode](/articles/vue-35-major-improvements) berichtet — 100.000 Komponenten-Mounts in 100ms — und unterstreicht, wie breit Rust-basiertes Tooling Leistungserwartungen umgestaltet.

Die Linting- und Formatierungszahlen sind die dramatischsten, und sie sind auch die am wenigsten überraschenden. ESLint und Prettier sind in JavaScript geschrieben. Oxlint und Oxfmt sind in Rust geschrieben. Die Performance-Lücke zwischen diesen Implementierungen wurde wiederholt demonstriert — Biome zeigte ähnliche Zahlen, bevor Oxfmt herauskam. Die echte Frage ist nicht, ob Oxlint schneller ist (es ist), sondern ob es genug von der ESLint- und Prettier-Oberfläche abdeckt, um ein vollständiger Ersatz für Teams mit komplexen Regelkonfigurationen zu sein.

Die Vue 3.6 / Vapor Mode-Zahlen sind kein Vite+-Feature. Sie sind ein separates Release, und sie sind noch in Beta.

## Das vereinheitlichte Toolchain-Konzept: Substanz oder Slogans?

"Vereinheitlichte Toolchain" ist ein Ausdruck, der kritisch untersucht werden sollte.

Im Fall von Vite+ bedeutet es, dass alle Tools dieselbe Konfigurationsdatei (`vite.config.ts`) und denselben CLI-Entry-Point teilen. Die Tools selbst sind auf der Konfigurationsebene integriert. Unter der Haube sind Oxlint, Oxfmt, Rolldown, Vitest und tsdown noch separate Binaries, die über definierte Schnittstellen kommunizieren. Sie bekommen kein einzelnes Rust-Programm, das alles macht — Sie bekommen einen einzelnen Wrapper, der mehrere Rust-Programme orchestriert.

Dies ist nicht unbedingt ein Problem. Gute Komposition guter Tools ist wertvoller als ein monolithisches Tool, das alles schlecht macht. Aber es lohnt sich, klar zu sein darüber, was "vereint" hier bedeutet: es bedeutet konsistente Konfiguration und eine konsistente CLI, nicht ein einzelnes integriertes Programm.

Der substantiellere Teil der Vereinheitlichungsbehauptung ist die geteilte AST- und Resolver-Schicht. Weil Oxc den Parser und Resolver bereitstellt, den Rolldown, Oxlint und Oxfmt alle verwenden, vermeidet das System, dieselbe Quelldatei drei- oder viermal über die Toolchain zu parsen. In einem großen Monorepo summiert sich das.

## Der Alpha-Status: Was es tatsächlich bedeutet

Vite+ ist explizit Alpha. VoidZero hat nicht versucht, dies zu verbergen — der Ankündigungspost ist titled "Announcing Vite+ Alpha." Aber Alpha verdient hier Prüfung.

**Was Alpha in der Praxis bedeutet:**

- Einige APIs werden sich ändern, bevor stabile Veröffentlichung kommt
- Plugin-Kompatibilität, besonders für Edge Cases in der Rollup Plugin-API, ist möglicherweise nicht vollständig getestet
- Performance-Regressionen sind möglich, während die Toolchain reift
- Dokumentation ist unvollständig

**Die aussagekräftigere Frage ist, was Alpha Ihnen nicht sagt:** ob das Team dieselbe Entwicklungsgeschwindigkeit aufrechterhalten wird, sobald die anfängliche Aufregung nachlässt, ob die Enterprise-Schicht (VoidCloud) Druck erzeugen wird, Features in der Open-Source-Version einzuschränken, und ob die Toolchain MIT-lizenziert bleibt, während sie reift.

Die MIT-Lizenz ist ein genuines Commitment — VoidZero hat explizit ein bezahltes Lizenzmodell nach Community-Feedback aufgegeben. Aber das Geschäftsmodell des Unternehmens hängt von etwas jenseits der MIT-lizenzierten Tools ab. Dieses etwas ist noch nicht öffentlich. Lohnt sich zu beobachten.

## Migrations- und Annahmefriktion

Für Teams, die bereits Vite verwenden, ist der Migrationspfad genuin reibungslos:

1. Installieren Sie `vp` global
2. Führen Sie `vp migrate` aus — ein automatisiertes Migrations-Tool
3. Ersetzen Sie einzelne Befehle (`vite`, `vitest`, `eslint`, `prettier`, `tsc`) mit `vp dev`, `vp test`, `vp check`, `vp build`

Der `vp migrate`-Befehl ist das Schlüsselstück. Er versucht, Ihre existierenden ESLint- und Prettier-Configs zu lesen und in Oxlint- und Oxfmt-Äquivalente zu übersetzen. Für Standardkonfigurationen funktioniert dies. Für Teams mit extensiven benutzerdefinierten ESLint-Regeln oder komplexen Prettier-Plugin-Setups ist einige manuelle Migrationsarbeit wahrscheinlich.

Die größere Friktion ist philosophisch: Teams, die ihre ESLint-Regelsätze über Jahre sorgfältig abgestimmt haben, sind möglicherweise zögerlich, zu Oxlint zu wechseln, selbst wenn Oxlint die meisten commonly used rules besteht. Das Oxlint-Projekt pflegt eine Kompatibilitätstabelle, die zeigt, welche ESLint-Regeln implementiert sind und welche nicht. Bevor Sie Vite+ adoptieren, lohnt es sich zu prüfen, dass Ihre kritischen Regeln abgedeckt sind.

## Wer sollte jetzt cares, und wer sollte warten

**Jetzt upgraden wenn:**
- Sie starten ein neues Projekt in 2026 und wollen eine schnelle, minimale Config
- Sie verwenden bereits Vite und wollen Ihre Toolchain vereinfachen, ohne das Verhalten zu ändern
- Sie haben ein großes Monorepo und wollen das Vite Task-Caching für Script-Ausführung

**Warten Sie wenn:**
- Ihr Projekt komplexe benutzerdefinierte ESLint-Regeln verwendet, die Oxlint noch nicht unterstützt
- Sie auf einer älteren Vite-Version sind und keine Zyklen zum Testen der Migration erübrigen können
- Ihr Team auf spezifische Tooling-Integrationen angewiesen ist, die nicht mit Rolldown getestet wurden

## Der skeptische Fall

Das stärkste Argument gegen Vite+ ist, dass es ein Umverpacken existierender Tools ist, angetan mit vereinheitlichter Markenbildung. Wenn Sie bereits Vite 8 mit Rolldown, Oxlint und Vitest verwenden, gibt Ihnen Vite+ eine schönere CLI und eine Config-Datei. Das ist realer Wert — aber es ist inkrementeller Wert auf Tools, die Sie bereits selbst zusammenstellen konnten.

Das zweite Anliegen ist die VoidZero-Abhängigkeit. Vite war ursprünglich ein Community-Projekt ohne Firma dahinter. Es ist jetzt eine Firma mit Venture-Finanzierung, einer Enterprise-Produkt-Roadmap und einem Geschäftsmodell, das noch nicht vollständig offengelegt wurde. Die MIT-Lizenz ist genuiner Schutz. Aber die Geschichte von Open-Source-Infrastruktur-Firmen ist übersät mit Lizenzen, die sich änderten, als das Geschäftsmodell es erforderte. Terraform, Redis und Elasticsearch begannen alle mit permissiven Lizenzen und schränkten sie später ein. VoidZero war explizit über seine Absichten — aber explizit ist nicht dasselbe wie permanent.

Das dritte Anliegen ist Ecosystem-Lock-in. Vite+ funktioniert nur mit Tools aus dem VoidZero-Stack. Wenn Sie Biome statt Oxlint verwenden möchten, oder SWC statt Rolldown, ist Vite+ nicht die richtige Wahl. Das "eine wahre Toolchain"-Modell ist ansprechend, bis Sie etwas außerhalb davon verwenden möchten.

## Das redaktionelle Urteil

Vite+ ist keine Revolution. Es ist ein gut gestaltetes Distribution von echtem gutem Tooling, das bereits individuell wert war, es zu verwenden.

Das Rust-basierte JavaScript-Toolchain — Oxc, Rolldown und die darauf aufgebauten Projekte — repräsentiert einen realen und signifikanten Performance-Sprung über die JavaScript-basierten Tools, die es ersetzt. Dieser Sprung ist kein Marketing. Unabhängige Benchmarks bestätigen es, und Entwickler, die diese Tools in Produktion verwenden, berichten von konsistenten Ergebnissen. Diese Rust-Migration ist im gesamten Ökosystem sichtbar: [Vite 8 hat Rolldown](/articles/vite-8-rolldown-era) als seinen vereinheitlichten Bundler adoptiert und ersetzt sowohl ESBuild als auch Rollup in einem Zug.

Was Vite+ on top of those tools hinzufügt, ist Bequemlichkeit: ein Binary, eine Config-Datei, ein mentales Modell für den vollständigen Entwicklungszyklus. Für neue Projekte und Teams, die von Tooling-Komplexität frustriert sind, ist diese Bequemlichkeit etwas wert.

Das Alpha-Label sollte ernst genommen werden. "Alpha" bedeutet, dass das Team noch an Edge Cases arbeitet, und das Ökosystem holt noch auf. Aber die Fundament — Vite 8, Rolldown, Oxc — ist reifer als das "Alpha"-Label auf Vite+ selbst suggeriert.

Ob Vite+ zum Standard-Entry-Point für die VoidZero-Toolchain wird oder eine Nischen-Bequemlichkeit bleibt, hängt davon ab, ob das versprochene VoidCloud-Enterprise-Produkt genug Trennung zwischen der Open-Source- und der kommerziellen Schicht schafft, um das Vertrauen der Community zu halten. Diese Geschichte wird noch geschrieben. Separat, [der TypeScript-Compiler selbst erhält eine native Neuimplementierung](/articles/typescript-7-native-preview-go-compiler) — in Go rather than Rust — was signalisiert, dass die native Tooling-Welle sich über die Build-Pipeline hinaus in die Sprachinfrastruktur erstreckt.

Für jetzt: die Tools unter Vite+ sind es wert, sie zu kennen, unabhängig davon, ob Sie den Wrapper verwenden. Rolldown ersetzt Rollup. Oxlint ersetzt ESLint für Teams, die Geschwindigkeit wollen. Die JavaScript-Tooling-Landschaft verschiebt sich hin zu nativen Sprachen, und Vite+ ist die bisher kohärenteste Schnittstelle zu dieser Verschiebung.