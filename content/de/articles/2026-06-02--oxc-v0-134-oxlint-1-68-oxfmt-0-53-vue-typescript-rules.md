---
title: "Oxc v0.134: oxlint v1.68 Bringt Vue-Linter-Regeln und TypeScript-Accessor-Prüfungen"
description: "Oxc's Juni-Release liefert oxlint v1.68.0 mit zwei neuen Vue-Regeln, einer method-signature-style TypeScript-Regel und Parser-Verbesserungen, die Ambient-Context-Missbrauch ablehnen."
date: 2026-06-02
image: "/images/heroes/2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules.png"
author: lschvn
tags: ["frameworks", "tooling", "typescript"]
tldr:
  - oxlint v1.68.0 fügt die Vue-Regeln no-reserved-component-names und component-definition-name hinzu, die Namenskonflikte bei Komponentendefinitionen erkennen
  - Die neue method-signature-style TypeScript-Regel erzwingt Konsistenz zwischen Interface-Methodensyntax und Klassenmethodensyntax
  - Der Parser emittiert jetzt präzise TypeScript-Fehlercodes für Accessor-Typparameter (TS1094, TS1095, TS1051) und lehnt Generatoren, Overload-Signaturen und ungültige Index-Signaturen im Ambient-Kontext ab
---

<!-- more -->

## oxlint v1.68.0 — Vue- und TypeScript-Regeln

Die Haupt-Neuerungen in oxlint v1.68.0 sind zwei Vue-spezifische Linter-Regeln.

**`vue/no-reserved-component-names`** verhindert die Verwendung reservierter Namen für Vue-Komponentendefinitionen. Vue reserviert Namen wie `Switch`, `KeepAlive` und `Teleport` — ihre Verwendung als lokale Komponentennamen kann Rendering-Probleme verursachen.

**`vue/component-definition-name`** ist die Gegenregel, die erkennt, wann Komponentendefinitionsnamen mit HTML-Elementen oder Vue-Built-in-Komponenten kollidieren.

Auf der TypeScript-Seite **erzwingt die neue `method-signature-style`-Regel** einen konsistenten Stil für Interface- und Klassenmethodendeklarationen.

Ebenfalls neu in v1.68.0: **`override::exclude_files`** ermöglicht das Ausschließen bestimmter Dateien von Regel-Overrides.

## oxfmt v0.53.0 — Formatierer-Updates

oxfmt erscheint alongside oxlint mit Formatierungsverbesserungen. Das vollständige Changelog für v0.53.0 ist auf der [oxc-project/oxc GitHub-Releases-Seite](https://github.com/oxc-project/oxc/releases) verfügbar.

## Parser: Strengere TypeScript Ambient Context-Validierung

Dieses Release bringt erhebliche Parser-Verbesserungen mit Fokus auf die Durchsetzung des TypeScript Ambient Context. Der Parser emittiert jetzt präzise Fehlercodes für eine Reihe ungültiger Deklarationen:

- **TS1094** — Accessor-Typparameter
- **TS1095** — Setter mit Return-Type-Annotation
- **TS1051** — Optionale Parameter in Settern
- **TS1221 / TS1222** — Generatoren und Overload-Signaturen im Ambient-Kontext
- **TS1268 / TS1337** — Ungültige Index-Signature-Parametertypen
- **TS1038 / TS1036** — `declare` in bereits deklarierten Ambient-Kontexten
- **TS1316** — Export-as-namespace innerhalb eines Namespace-Bodys
- **TS1183** — Funktionsimplementierungen im Ambient-Kontext

## Performance-Verbesserungen

Drei Änderungen zielen auf den Parser-Durchsatz:

1. **Wiederverwendung von gecachtem Token-Kind in delimitierten Listen-Schleifen**
2. **peek_token statt lookahead auf dem Modifier-Pfad**
3. **Verzögerte Declare-Suche für leere Accessors**

## Vollständiges Changelog

Die vollständigen Release-Notes für oxc crates v0.134.0, oxlint v1.68.0 und oxfmt v0.53.0 finden Sie auf der [oxc-project/oxc GitHub-Releases-Seite](https://github.com/oxc-project/oxc/releases).

> **FAQ**
>
> **Q: Wie vergleicht sich oxlint mit ESLint?**
> oxlint ist ein in Rust geschriebener Drop-in-Ersatz für ESLint mit 10–100x höherer Leistung.
>
> **Q: Kann oxfmt Prettier ersetzen?**
> oxfmt ist ein Rust-basierter Formatierer für JavaScript, TypeScript, JSX und Vue, der weitgehend Prettier-kompatibel ist.
