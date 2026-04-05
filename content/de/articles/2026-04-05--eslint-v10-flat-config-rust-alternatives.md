---
title: "ESLint v10 Verwirft Legacy-Config — Und Die JS-Ökosystem Notiert Es Sich"
description: "ESLint v10 bringt die größte Breaking-Change-Release seit Jahren: Flat Config wird final, eslintrc fällt vollständig weg, und JSX-Reference-Tracking kommt neu dazu. Aber die größere Geschichte ist vielleicht das, was ihr im Nacken sitzt."
date: "2026-04-05"
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["javascript", "typescript", "eslint", "tooling", "openjs"]
---

ESLint v10 ist diesen Monat erschienen, und obwohl die Überschrift wie ein internen Aufräumen klingt — Flat Config ist jetzt final, Legacy eslintrc ist weg — zeigt diese Version eine Bruchlinie in der JavaScript-Tooling-Landschaft, die sich seit Jahren aufgebaut hat.

## Was sich wirklich geändert hat

Die wichtigste Entfernung ist `LegacyESLint`, die Kompatibilitätsschicht, die `.eslintrc.json` am Leben hielt, nachdem Flat Config (`eslint.config.js`) in v9 zum Standard wurde. Das ist jetzt vollständig weg. Die Methoden `defineParser()`, `defineRule()`, `defineRules()` und `getRules()` auf `Linter` sind entfernt. `shouldUseFlatConfig()` gibt jetzt unbedingt `true` zurück.

Die Konfigurationsauflösung hat sich ebenfalls bedeutsam geändert: ESLint löst die Konfiguration jetzt aus dem Verzeichnis jeder analysierten Datei auf, statt aus dem aktuellen Arbeitsverzeichnis. Für Monorepos, in denen Pakete unterschiedliche Regelsätze benötigen, ist dies eine direkte Lösung für einen seit langem bestehenden Schmerzpunkt.

JSX-Reference-Tracking ist die andere wichtige Neuerung. Zuvor flaggte ESLints `no-unused-vars` Komponenten, die nur in JSX importiert und verwendet wurden, als unbenutzt — ein False Positive, das Workarounds wie `@eslint-react/jsx-uses-vars` erforderte. Dieses Plugin wird nicht mehr benötigt.

`RuleTester` erhält drei neue Assertionsoptionen — `requireMessage`, `requireLocation` und `requireData` — mit denen Plugin-Autoren strengere und konsistentere Testdefinitionen durchsetzen können. Stack Traces enthalten jetzt den Index und Dateispeicherort der fehlgeschlagenen Testfälle.

Die Node.js-Unterstützung wurde verschärft auf `^20.19.0 || ^22.13.0 || >=24` — alle Versionen 21 und 23 sind gestrichen.

## Die Migration

Das offizielle Tool übernimmt das sauber:

```bash
px @eslint/migrate-config .eslintrc.json
```

Dies erzeugt eine `eslint.config.mjs`-Datei, die Teams prüfen und anpassen. Der [offizielle Migrationsleitfaden](https://eslint.org/docs/latest/use/migrate-to-10.0.0) deckt jede Breaking Change im Detail ab.

Ein Hindernis: `eslint-plugin-react` hatte ESLint 10 zum Zeitpunkt der Veröffentlichung nicht in seinen Peer-Abhängigkeiten deklariert, was Installationskonflikte für React-Projekte verursachte. `eslint-config-next` hatte [ein ähnliches offenes Problem](https://github.com/vercel/next.js/issues/91702). Beide wurden inzwischen behoben, aber es ist eine Erinnerung daran, dass der Ökosystem-Rückstand real ist, wenn eine so signifikante Breaking Change ausgeliefert wird.

## Der Wettbewerbskontext

ESLint saß über ein Jahrzehnt lang weitgehend unangegriffen als Standard-JS-Linter. Diese Position wird jetzt von zwei Richtungen gleichzeitig in Frage gestellt.

[Biome](https://biomejs.dev/) kombiniert Linting und Formatierung in einem einzigen Tool — keine separate ESLint + Prettier-Einrichtung — mit 467 Regeln aus ESLint, TypeScript ESLint und anderen Quellen. Die Version 2.4 (Februar 2026) fügte Unterstützung für eingebettete CSS- und GraphQL-Snippets, 15 HTML-Barrierefreiheitsregeln und experimentelle vollständige Unterstützung für Vue, Svelte und Astro hinzu. Es verwendet einen Rust-basierten Parser und ist bekannt für deutlich geringeren Speicherverbrauch.

[Oxc](https://oxc.rs/) trägt das Performance-Argument weiter. Sein Linter, Oxlint, beansprucht 50–100x schnelleren Durchsatz als ESLint, je nach CPU-Kernanzahl. Es hat über 700 Regeln, echtes Type-Aware-Linting über sein `tsgo`-Projekt und unterstützt nativ ESLint-JS-Plugins. Sein Formatter, Oxfmt, erreicht 30x schneller als Prettier und 3x schneller als Biome. Alles ist Open Source unter der OpenJS Foundation.

Der Kompromiss ist die Regelabdeckung. Oxlint hat noch nicht den vollständigen Katalog von ESLint, und Biome holt bei TypeScript-spezifischen Regeln noch auf. Aber die Richtung ist klar, und der Leistungsunterschied ist nicht marginal — er ist strukturell. ESLints Single-Threaded-JavaScript-Architektur hat eine Decke, die Rust-basierte Alternativen nicht teilen.

tldr[]
- ESLint v10 entfernt LegacyESLint und Legacy eslintrc vollständig — Flat Config ist die einzige Option, und die Konfigurationsauflösung startet aus dem Verzeichnis jeder Datei für besseren Monorepo-Support
- JSX-Reference-Tracking eliminiert einen lange bestehenden False Positive bei no-unused-vars, und RuleTester erhält bedeutende Verbesserungen für Plugin-Autoren
- Rust-basierte Herausforderer Biome und Oxc machen echte Fortschritte: Biome kombiniert Linting und Formatierung in einem Tool, während Oxlint 50–100x schneller als ESLint mit 700+ Regeln und ESLint-Plugin-Kompatibilität beansprucht

faq[]
- **Sollte ich sofort upgraden?** Wenn Sie auf Vercel oder einer Plattform mit verwaltetem ESLint sind, wird Ihre Konfiguration wahrscheinlich automatisch aktualisiert. Für benutzerdefinierte Setups: in der CI testen, bevor Sie ausrollen.
- **Zerstört das mein React-Projekt?** Möglicherweise — wenn eslint-plugin-react nicht für Ihr Projekt aktualisiert wurde, könnten Sie auf Peer-Abhängigkeitskonflikte stoßen. Überprüfen Sie die Auflösungsausgabe Ihres Paketmanagers.
- **Sollte ich zu Biome oder Oxlint wechseln?** Noch nicht für vollständige ESLint-Parität, aber lohnend zu prüfen, wenn die Lint-Performance ein Engpass ist. Beide sind für die meisten Projekte produktionsreif.
- **Was sind die Node.js-Anforderungen?** v10 braucht Node.js 20.19+, 22.13+ oder 24+. Node 21 und 23 sind gestrichen.
