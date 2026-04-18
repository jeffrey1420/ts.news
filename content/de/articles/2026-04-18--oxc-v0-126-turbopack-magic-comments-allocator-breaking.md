---
title: "Oxc v0.126.0 : Turbopack Magic Comments im Parser, Breaking Changes beim Allocator"
description: "Oxc v0.126.0 bringt Parser-Unterstützung für Turbopack Magic Comments, eine breaking Umbenennung der Box- und Vec-Methoden im Allocator, neue NAPI-Transform-Optionen für Enum-Optimierung und weitere Performance-Verbesserungen."
date: 2026-04-18
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Oxc", "Rust", "JavaScript", "Turbopack", "Rolldown", "SWC", "Tooling"]
tldr:
  - Oxc v0.126.0 fügt Parser-Unterstützung für Turbopack Magic Comments hinzu, was die Kompatibilität mit webpack-annotiertem Code verbessert
  - Eine Breaking Change benennt Box- und Vec-Methoden im Allocator um – Projekte mit direkter Abhängigkeit müssen an更新时间
  - NAPI-Transform-Nutzer können optimizeConstEnums und optimizeEnums jetzt direkt konfigurieren
---

## Was sich geändert hat

Oxc's Release v0.126.0 (16. April) bringt bedeutende Verbesserungen in der Tooling-Integration und eine unvermeidliche Breaking Change.

### Turbopack Magic Comments im Parser

Die wichtigste Neuerung ist die [Parser-Unterstützung für Turbopack Magic Comments](https://github.com/oxc-project/oxc/pull/20803). Diese speziellen Kommentare wie `/* webpackChunkName */` und `/* resource */` werden von Bundlern genutzt, um Metadaten über dynamische Imports zu kommunizieren. Bisher behandelte der Oxc-Parser sie als normale Kommentare. Mit diesem Update werden sie erkannt und semantisch erhalten – wichtig für Rolldown-Nutzer, die Code verarbeiten, der ursprünglich für webpack geschrieben wurde.

### Breaking Change beim Allocator

[Box- und Vec-Methoden im Allocator-Crate wurden umbenannt](https://github.com/oxc-project/oxc/pull/21395). Das betrifft hauptsächlich Projekte, die direkt von Oxc's internem Allocator-API abhängen – die meisten Nutzer über Rolldown oder oxlint sind nicht betroffen.

### NAPI Transform: Enum-Optimierung

Die NAPI-Transform-Schnittstelle exponiert jetzt `optimizeConstEnums` und `optimizeEnums` als konfigurierbare Optionen. Damit lässt sich steuern, ob Enum-Werte zur Compile-Zeit inlined werden.

### Performance

Zwei Commits zielen auf kontinuierliche Performance-Verbesserungen: Die Arena-Speicherallokation wurde vereinfacht und der Lexer hat einen `LexerContext`-Refactoring erhalten.

## FAQ

### Betrifft das oxlint-Nutzer?

Nein. oxlint basiert auf Oxc's Linting-Infrastruktur, nicht auf den Allocator-Änderungen.

### Wie aktualisiere ich?

```bash
cargo update -p oxc_allocator
```

Bei direkter Abhängigkeit vom Allocator: die [CHANGELOG](https://github.com/oxc-project/oxc/blob/main/CHANGELOG.md) prüfen.
