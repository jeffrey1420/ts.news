---
title: "Biome 2.5 liefert `@biomejs/js-api` v6.0.0: ein Major-Bump für die JS-API"
description: "Biomes CLI erreicht 2.5.0 und die JavaScript-API springt auf ein v6.0.0-Major. Die Schlagzeile ist der neue spanInBytesToSpanInCodeUnits-Helper, der einen echten UTF-16-Surrogate-Bug bei der Extraktion von nicht-ASCII-Diagnosetext behebt, plus eine lange Liste an SCSS-, JSON-, Linter- und CLI-Verbesserungen."
date: 2026-06-12
image: "/images/heroes/2026-06-12--biome-v2-5-js-api-v6-major.png"
author: lschvn
tags: ["tooling", "javascript", "ecosystem"]
tldr:
  - "Biomes JavaScript-API erreicht am 12. Juni 2026 das v6.0.0-Major, mit spanInBytesToSpanInCodeUnits als Schlagzeile, einem Helper, der einen echten UTF-16-Surrogate-Bug bei der nicht-ASCII-Diagnosetext-Extraktion behebt."
  - "Der CLI-Bump auf 2.5.0 ist im Wesentlichen ein WASM-Package-Sync, bringt aber einen neuen kompakten Reporter, ein Biome-Logo im ANSI-Art-Stil und eine lange Liste an SCSS-, JSON-, Linter- und HTML-A11y-Features."
  - "biome_service erhält Unterstützung für GritQL-Plugin-Rewrites via --write und öffnet die Tür zu eigenen Refactorings im selben Pipeline wie die eingebauten Regeln."
faq:
  - question: "Was bricht beim Upgrade von @biomejs/js-api 5.x auf 6.0.0?"
    answer: "Die öffentliche API-Oberfläche bleibt formgleich; der Major-Bump ist ein Hinweis auf den neuen Helper und das versionierte Pinning der Abhängigkeiten @biomejs/wasm-web, @biomejs/wasm-bundler und @biomejs/wasm-nodejs, die alle auf 2.5.0 festgelegt sind. Wer die WASM-Module direkt aufruft, muss sie parallel mitbumppen. CLI-seitig ist alles vollständig rückwärtskompatibel."
  - question: "Wie behebe ich das Byte-vs-UTF-16-Span-Problem in meinem eigenen Code?"
    answer: "Wer den Bug bisher durch manuelles Umrechnen von Biomes Byte-Offsets vor dem Slice auf den JavaScript-String-Content umgangen hat, ersetzt den Workaround durch den neuen Helper: `const [start, end] = spanInBytesToSpanInCodeUnits(diagnostic.location.span, content); const text = content.slice(start, end);` Der Helper behandelt Surrogate-Paare und ungepaarte Surrogate korrekt, also genau den Fall, den manuelle Umrechnungen meist falsch gemacht haben."
  - question: "Fügt Biome 2.5 HTML-Linting hinzu?"
    answer: "Ja, in dem Sinne, dass mehrere A11y-Regeln vom JS-Analyzer in biome_html_analyze portiert wurden. Ab 2.5 enthält der HTML-Analyzer noRedundantRoles, useKeyWithMouseEvents und useAriaActivedescendantWithTabindex. Eine noRedundantRoles-Regel für HTML wurde portiert, zurückgenommen und nach einem Follow-up-Fix erneut gelandet."
  - question: "Was ist die GritQL-Plugin-Rewrite-Funktion?"
    answer: "biome_service unterstützt nun das Anwenden von GritQL-Plugin-Rewrites über das Standard-Flag --write. GritQL ist eine Pattern-Matching-Sprache für Source-Code-Refactorings; die Integration bedeutet, dass ein eigenes GritQL-Plugin ausgeliefert werden kann und Biome das Rewrite auf denselben Dateien anwendet, die auch Linter und Formatter anfassen, mit derselben projektbewussten Konfiguration."
---

Biome hat am 12. Juni 2026 zwei koordinierte Releases veröffentlicht: [Biome CLI v2.5.0](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fbiome%402.5.0) und [@biomejs/js-api v6.0.0](https://github.com/biomejs/biome/releases/tag/%40biomejs%2Fjs-api%406.0.0). Die Schlagzeile ist der erste Major-Bump der JavaScript-API seit der Trennung der WASM-Pakete von der CLI. Der CLI-Bump ist im Wesentlichen ein WASM-Sync, mit einer langen Liste kleiner Features obendrauf.

## Die js-api v6.0.0-Schlagzeile

Der Major-Bump dreht sich um einen einzigen neuen Export: `spanInBytesToSpanInCodeUnits(diagnostic.location.span, content)`. Biomes Diagnostik trägt UTF-8-Byte-Offsets, weil der Analyzer die Quellen intern so indexiert. JavaScript-Strings sind UTF-16, daher lieferte jeder Code, der eine Biome-Diagnostik nahm und `content.slice(spanStart, spanEnd)` auf dem Original-String aufrief, bei nicht-ASCII-Inhalt den falschen Text: Emojis, Akzente, CJK. Die Slice-Grenze landete mitten in einer Code-Unit, lieferte `undefined` für den abschließenden Surrogate und korrumpierte den extrahierten Ausschnitt stillschweigend.

Der neue Helper konvertiert byte-basierte Spans in UTF-16-Code-Unit-Spans, inklusive der Edge-Cases mit Surrogate-Paaren und ungepaarten Surrogaten. Es ist genau die Art Fix, die einen Major-Bump für sich genommen rechtfertigt, und Biome nutzte die Gelegenheit, die WASM-Pakete mitzubumpen: `@biomejs/wasm-web`, `@biomejs/wasm-bundler` und `@biomejs/wasm-nodejs` pinnen sich alle auf 2.5.0, um mit der CLI gleichzuziehen.

## SCSS, JSON, Linter und CLI

Das 2.5.0-Release deckt eine lange Liste inkrementeller Features ab. Parser-seitig wird die SCSS-Unterstützung deutlich erweitert: qualifizierte Namen in Werten und Funktionsaufrufen, Unary-Expression-Parsing, verschachtelte Deklarationen in Deklarationslisten, Deklarationen in `@page`-Blöcken und Delimiter in eingeklammerten Wertelisten. JSON erhält eine neue `useSortedPackageJson`-Regel. Der Linter nimmt zwei neue Cross-Language-Regeln mit, eine neue `includes`-Option für Plugin-Datei-Scoping, eine `ignore`-Option für `no-unused-variables` und eine Änderung an `noUndeclaredClasses`, die nun lokale und globale Styles sammelt. `organizeImports` ergänzt eine `sortBareImports`-Option.

Die CLI erhält ein Biome-Logo im ANSI-Art-Stil beim Start und einen neuen kompakten Reporter. `biome_service` unterstützt nun [GritQL-Plugin-Rewrites](https://docs.grit.io/) über das Standard-`--write`-Flag, das fehlende Puzzleteil, um eine eigene Refactoring-Regel auszuliefern, die durch denselben Pipeline läuft wie Linter und Formatter.

Der HTML-Analyzer wächst weiter. Ab 2.5 enthält er `noRedundantRoles`, `useKeyWithMouseEvents` und `useAriaActivedescendantWithTabindex` (der `noRedundantRoles`-Port wurde zurückgenommen und nach einem Follow-up-Fix erneut gelandet, daher die doppelte Erwähnung im Changelog).

## Warum der Major-Bump zählt

Für Nutzer:innen, die Biome als CLI oder über Editor-Integrationen konsumieren, ist 2.5.0 ein Routine-Upgrade. Die interessante Geschichte betrifft Projekte, die `@biomejs/js-api` direkt einbetten: der Helper ist das erste Stück einer breiteren Anstrengung, die API auf nicht-ASCII-Quellcode sicher zu machen, und der Major-Bump signalisiert, dass das Projekt die öffentliche Oberfläche als stabilen Vertrag behandelt.

Diese Positionierung rückt Biome näher an [Oxc mit der Rust-Toolchain](/articles/2026-06-02--oxc-v0-134-oxlint-1-68-oxfmt-0-53-vue-typescript-rules) heran: eine von Rust gestützte JavaScript-Toolchain mit programmatischer API zur Einbettung. Die beiden Projekte nehmen unterschiedliche Positionen im Spektrum ein (Biome bündelt Linter, Formatter und Import-Organizer in einer Binärdatei, Oxc trennt dies in eigene Crates), aber beide sind nun reif genug, dass programmatische Einbettung ein First-Class-Anwendungsfall ist. Für Teams, die die vorherige API mit einem UTF-8-zu-UTF-16-Workaround umschifft haben, ist 6.0.0 das Upgrade, das den Workaround überflüssig macht.
