---
title: "Oxc v0.135: Rust-Port des React Compiler und ein `#[non_exhaustive]`-AST-Break"
description: "Oxc 0.135 integriert den Rust-Port des React Compilers, markiert AST-Knoten als #[non_exhaustive] (Breaking Change für nachgelagerte Rust-Crates), fügt zwei neue AstBuilder-Methoden hinzu und liefert zahlreiche Parser-Strenge- und Codegen-Whitespace-Fixes."
date: 2026-06-12
image: "/images/heroes/2026-06-12--oxc-v0-135-react-compiler-ast-breaking.png"
author: lschvn
tags: ["tooling", "performance", "typescript"]
tldr:
  - "Oxc 0.135 integriert Metas React Compiler als Rust-Tool im oxc-Monorepo (PR #22942) und gibt nachgelagerten Bundlern und Toolchains eine erstklassige Rust-Implementierung."
  - "Das Release markiert Oxc-AST-Knoten als #[non_exhaustive], ein Breaking Change, der einen Patch-Release für jede nachgelagerte Rust-Crate nötig macht, die den AST pattern-matched."
  - "Oxlint v1.69 liefert Schemas für 30+ ESLint-Regeln, fügt Vue-Regeln hinzu (next-tick-style, require-direct-export, no-reserved-props, require-prop-types), und oxfmt 0.54 rundet das Release ab."
faq:
  - question: "Was bricht in Oxc 0.135?"
    answer: "Zwei Breaking Changes. Erstens ist jeder Oxc-AST-Knoten nun #[non_exhaustive] markiert (PR #23046), sodass nachgelagerte Rust-Crates, die AST-Varianten erschöpfend pattern-matchen, einen Patch-Release und einen expliziten `_ =>`-Arm brauchen. Zweitens wurden zwei neue AstBuilder-Methoden hinzugefügt (template_element_escape_raw und template_element_escape_raw_with_lone_surrogates, PR #23047); bestehende AstBuilder-Nutzer:innen brechen nicht, aber eigene Builder müssen die neuen Methodensignaturen kennen."
  - question: "Was ist der Rust-Port des React Compilers, und warum ist er wichtig?"
    answer: "Metas React Compiler memoisiert React-Komponenten und -Hooks automatisch. Bisher lebte die Implementierung als TypeScript im React-Repo. Der Rust-Port ist eine From-Scratch-Neuschreibung, die ab 0.135 im oxc-Monorepo liegt, und nachgelagerte Tools (Vinext, Rolldown, künftige Bundler) können sie aufrufen, ohne von Node oder einer JS-Laufzeit abzuhängen."
  - question: "Welche nachgelagerten Tools sind von 0.135 betroffen?"
    answer: "Alle Rust-Crates, die den Oxc-AST pattern-matchen: Rolldown (verwendet von Vite/Vinext), oxc-traverse, oxc-transform und alle eigenen Transformatoren, die auf oxc_parser aufsetzen. JS/TS-Bundler, die als Standalone-Binaries ausgeliefert werden (Rolldown CLI, Vite, Vinext), erhalten den neuen AST über ihren normalen Update-Zyklus; ihre Nutzer:innen müssen nichts tun."
  - question: "Was bedeutet das praktisch für ein TypeScript-Projekt?"
    answer: "Wer Oxc nur über Vite, Rolldown oder oxlint konsumiert, bekommt die neuen Regeln, die Codegen-Whitespace-Fixes für kleinere Minified-Outputs und (mit der Zeit) einen schnelleren React Compiler im Bundler. Der Breaking Change ist für JS/TS-Nutzer:innen unsichtbar; er landet bei den Rust-Maintainer:innen."
---

[Oxc 0.135.0](https://github.com/oxc-project/oxc/releases/tag/crates_v0.135.0) und [oxlint 1.69.0](https://github.com/oxc-project/oxc/releases/tag/apps_v1.69.0) wurden am 8. Juni 2026 veröffentlicht. Die Schlagzeile ist die Landung des Rust-Ports des React Compilers im oxc-Monorepo. Die zweite Schlagzeile ist ein AST-Break, den jede nachgelagerte Rust-Crate behandeln muss.

## React Compiler, in Rust

Die wichtigste Änderung in 0.135 ist [PR #22942, « react_compiler: Integrate the Rust port of the React Compiler »](https://github.com/oxc-project/oxc/pull/22942). Meta hat seit einiger Zeit an einem Rust-Port des React Compilers gearbeitet, und 0.135 ist die Version, die ihn als erstklassige Crate im oxc-Workspace ausliefert. Der Compiler analysiert React-Funktionskomponenten und -Hooks und emittiert dann memoisierten Output, der Re-Renders überspringt, wenn Props und State referenz-stabil sind.

Für Rust-basierte JS/JSX/TS-Toolchains ist das das fehlende Puzzleteil. Die vorherige Implementierung lebte als TypeScript im React-Repo, was jedes Rust-Tool, das React-Compiler-Output wollte, zwang, an Node zu delegieren oder eine JS-Laufzeit mitzuliefern. Mit dem Rust-Port in oxc können Rolldown, Vinext und künftige Bundler den Compiler direkt integrieren, was der Weg ist, den die VoidZero-Toolchain seit [dem Vite+-Alpha-Launch](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source) verfolgt.

Für Anwendungsentwickler:innen ist die sichtbare Änderung inkrementell: kleinere Minified-Outputs und schnellere Builds, sobald nachgelagerte Bundler die neue Crate adoptieren. Die architektonische Bewegung ist es, die für das Ökosystem zählt.

## Der `#[non_exhaustive]`-Breaking Change

0.135 markiert zusätzlich jeden Oxc-AST-Knoten als `#[non_exhaustive]` (PR #23046). Das ist ein echter Breaking Change für Rust-Downstreams, die AST-Varianten erschöpfend pattern-matchen: Rolldown, oxc-traverse, oxc-transform und alle eigenen Transformatoren, die auf `oxc_parser` aufsetzen, brauchen einen Patch-Release mit einem expliziten Wildcard-Arm oder einem `_ =>`-Zweig.

In der Praxis ist der Patch mechanisch. Die Änderung ist der erste Eingriff in die öffentliche AST-Oberfläche, seit das Projekt den AST als stabilen Vertrag behandelt, und sie signalisiert einen breiteren Härtungsschub. Wer eine Rust-Crate wartet, die von oxc abhängt, sollte mit einer kleinen PR rechnen, die bald landet.

Eine zweite, kleinere Ergänzung: zwei neue `AstBuilder`-Methoden, `template_element_escape_raw` und `template_element_escape_raw_with_lone_surrogates` (PR #23047), für Codegen-Pfade, die ungepaarte Surrogate in Template-Literalen behandeln müssen. Bestehende AstBuilder-Nutzer:innen brechen nicht, aber eigene Builder sollten die neuen Methoden aufnehmen.

## Parser, Codegen und oxlint

Der 0.135-Parser gewinnt mehrere Strenge-Prüfungen, die bisher durchrutschten. Reservierte Type-Declaration-Namen werden nun gemeldet, ebenso Import-Type-Aliase auf nicht-externe Referenzen, abstrakte private Klassen-Felder und doppelte `default`-Klauseln in `switch`. Codegen-seitig kommt eine lange Liste an Whitespace-Fixes für den Minified-Output hinzu: dichterer Abstand bei Conditional-Type und Constructor-Type, entfernte überflüssige Leerzeichen nach `else` und `export default` und korrekter Abstand um Postfix-Operatoren `++` und `--`.

Oxlint 1.69 liefert Schemas für [30+ ESLint-Regeln](https://github.com/oxc-project/oxc/releases/tag/apps_v1.69.0), darunter `jest/vitest/max-expects`, `jest/vitest/expect-expect`, `jest/vitest/consistent-test-it`, `import-max-dependencies`, `prefer-default-export`, `sort-vars`, `radix`, `prefer-const`, `no-warning-comments`, `no-unused-vars`, `no-shadow`, `no-restricted-exports`, `no-param-reassign`, `no-magic-numbers`, `no-inner-declarations`, `no-constant-condition`, `no-empty-function`, `id-match`, `capitalized-comments`, `id-length`, `complexity` und `class-methods-use-this`. Der Vue-Analyzer nimmt `next-tick-style`, `require-direct-export`, `no-reserved-props` und `require-prop-types` mit. oxfmt 0.54 rundet das Release mit nicht-brevigenden Formatter-Fixes ab.

Das Release ist die natürliche Folge von [der hier behandelten 0.134](/articles/2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules) und folgt dem beschleunigten Rhythmus des Projekts: ein [0.126-Release im April brachte Turbopack Magic Comments und einen Allocator-Break](/articles/2026-04-18--oxc-v0-126-turbopack-magic-comments-allocator-breaking), ein 0.134 im Juni fügte Vue- und TypeScript-Regeln hinzu, und 0.135 liefert den Rust-Port des React Compilers. Rolldown, das Oxc nutzt, hat [lazyBarrel in 1.1.0 als Default aktiviert](/articles/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig); in der nächsten Rolldown-Minorversion ist zu erwarten, dass die React-Compiler-Integration in Produktions-Builds sichtbar wird.
