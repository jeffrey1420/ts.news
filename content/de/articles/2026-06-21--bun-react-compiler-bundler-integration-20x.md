---
title: "Bun integriert den React Compiler direkt in seinen Bundler, rund 20x schneller als das Babel-Plugin"
description: "PR #32504, am 20. Juni 2026 in oven-sh/bun gemergt, macht den Upstream-Rust-Port des React Compilers zu einer eingebauten `bun build`-Transformation hinter `--react-compiler` und `Bun.build({ reactCompiler: true })`. Bun portiert den Upstream-Workspace `compiler/crates/` aus `facebook/react` direkt in eine einzelne Crate `src/react_compiler/` (~62k LOC), anstatt den Weg über Babel, SWC oder Oxc zu gehen, und in einer großen React-Codebasis (rund 860 Komponenten, 1400 Memo-Slots) läuft der Compiler-Durchlauf in 465 ms gegenüber 9,15 s für das Babel-Plugin. Das Feature ist experimentell, standardmäßig deaktiviert und wird zusammen mit `reactCompilerOutputMode` (client oder ssr) und einem `scripts/sync-react-compiler.sh`-Resync-Skript ausgeliefert."
date: 2026-06-21
image: "/images/heroes/2026-06-21--bun-react-compiler-bundler-integration-20x.png"
author: lschvn
tags: ["tooling", "performance", "runtimes"]
tldr:
  - "Buns PR #32504, am 20. Juni 2026 gemergt, integriert den Upstream-Rust-Port des React Compilers als eingebaute `bun build`-Transformation, erreichbar über das CLI-Flag `--react-compiler` und die Option `reactCompiler: true` auf `Bun.build`. Der Ausgabemodus wird aus `--target` abgeleitet (`browser` -> `client`, `bun` oder `node` -> `ssr`) und kann mit `reactCompilerOutputMode` überschrieben werden. Das Feature ist standardmäßig deaktiviert und als experimentell markiert."
  - "Bun portiert den Rust-Workspace `compiler/crates/` aus `facebook/react` direkt in eine einzelne Crate `src/react_compiler/` (~62k LOC), statt den Weg über Babel, SWC oder Oxc als separaten AST-Adapter zu gehen. In einer großen React-Codebasis (rund 860 Komponenten, 1400 Memo-Slots) läuft der Compiler-Durchlauf in 465 ms gegenüber 9,15 s für `babel-plugin-react-compiler`, also rund 20x schneller; der vollständige `--compile`-Standalone-Build läuft in 3,62 s gegenüber 13,04 s mit dem Babel-Plugin (3,6x)."
  - "Dies ist der erste Bundler, der den React Compiler als native Transformation ausliefert. Vite, webpack, Next.js mit Turbopack und Rsbuild führen den Compiler heute alle über ein Babel-/SWC-/Oxc-Plugin aus; Buns Weg geht direkt vom eigenen Parser-AST in die HIR des Compilers und danach zurück in Buns AST für das Codegen, ohne zwischengeschaltete AST-Schicht. Das Release bringt außerdem `scripts/sync-react-compiler.sh` mit, um den Port gegen den `facebook/react`-Tip zu resynchronisieren."
faq:
  - question: "Was macht das neue Flag `--react-compiler`?"
    answer: "Es führt den React Compiler über `.jsx`- und `.tsx`-Dateien während `bun build` aus und memoisiert Komponenten sowie Hooks automatisch. Die Ausgabe hat dieselbe Form wie die von `babel-plugin-react-compiler`, einschließlich des `react/compiler-runtime`-Imports, der mit React 19 oder neuer ausgeliefert wird. Das Flag ist standardmäßig deaktiviert und sowohl in den Typdefinitionen als auch in der Dokumentation unter bun.com/docs/bundler als experimentell markiert."
  - question: "Um wie viel schneller ist Buns React-Compiler-Integration als das Babel-Plugin?"
    answer: "In einer großen React-Codebasis (rund 860 kompilierte Komponenten, 1400 Memo-Slots) brauchte das Upstream-Babel-Plugin ungefähr 9,15 s, Bun mit deaktiviertem React Compiler brauchte 394 ms (Baseline), und Bun mit aktiviertem React Compiler brauchte 465 ms (1,18x der Baseline, also rund 20x schneller als das Babel-Plugin). Der vollständige `--compile`-Standalone-Executable-Build, der alles bündelt plus den React-Compiler-Durchlauf, läuft mit dem Rust-Port in 3,62 s gegenüber 13,04 s mit dem Babel-Plugin, eine 3,6-fache Beschleunigung. Diese Zahlen stammen aus Buns eigenem Benchmark in PR #32504 auf einer einzelnen Entwicklungsmaschine, also werden die individuellen Ergebnisse variieren."
  - question: "Warum hat Bun nicht einfach die React-Compiler-Crate von Oxc verwendet?"
    answer: "Die PR-Beschreibung erklärt den Trade-off direkt. Buns Parser erzeugt bereits einen vollständig aufgelösten AST, daher würde der Weg über einen Oxc-Adapter bedeuten, Buns AST in den Oxc-AST zu konvertieren, ihn an den Compiler zu übergeben und dann zurückzukonvertieren. Bun portiert stattdessen die Crates `hir/`, `ssa/`, `inference/`, `typeinference/`, `optimization/`, `validation/`, `reactive_scopes/`, `diagnostics/` und `utils/` des Compilers Byte für Byte aus dem Upstream nach `src/react_compiler/`, schreibt nur die Import-Pfade um und entfernt die `serde`-/`serde_json`-Derives, die Bun nicht braucht. Die Lowering- und Codegen-Schichten sind gegen `bun_ast` neu implementiert, mit einer Typ-Mapping-Tabelle in `src/react_compiler/DESIGN.md`. Das Ergebnis: keine zwischengeschaltete AST-Allokation und keine zusätzliche Abhängigkeitsoberfläche."
  - question: "Ersetzt das das React-Compiler-Plugin von Babel in Vite oder Next.js?"
    answer: "Nein, es gilt nur für `bun build` und `Bun.build`. Wenn Sie Vite, Next.js mit Turbopack, webpack oder Rsbuild nutzen, gehen Sie weiterhin über das Babel- oder SWC-Plugin. Der Pfad, den der Rust-Port diesen Bundlern eröffnet, ist die `react_compiler_oxc`-Adaptercrate, die Meta zusammen mit dem Port veröffentlicht hat; Bun hat den direkten Port gewählt, weil der eigene AST bereits steht. Sobald Oxc den Adapter ausliefert und Bundler ihn übernehmen, sind dieselben Leistungszahlen in der zweiten Jahreshälfte 2026 auch anderswo zu erwarten."
  - question: "Was ist der Unterschied zwischen `reactCompiler` und `reactCompilerOutputMode`?"
    answer: "`reactCompiler` ist der An/Aus-Schalter; setzen Sie ihn auf `true`, um den Compiler-Durchlauf auszuführen. `reactCompilerOutputMode` wählt zwischen `\"client\"` (Standard für `--target browser`, vollständige Memoisierung) und `\"ssr\"` (Standard für `--target bun` oder `--target node`, überspringt die `useMemoCache`-Runtime, damit die serverseitig gerenderte Ausgabe cache-freundlich bleibt). Der Ausgabemodus greift nur, wenn der Compiler aktiv ist, und Bun leitet den Standard aus `--target` ab, wenn Sie ihn nicht explizit setzen."
  - question: "Wird das meinen `bun build` verlangsamen?"
    answer: "Nur wenn Sie es einschalten. Mit `reactCompiler: false` durchläuft der Build die bestehende Transformationspipeline, und es gibt keinen messbaren Overhead durch diese PR. Mit `reactCompiler: true` berichtet Bun einen Overhead von 1,18x in der Wandzeit auf dem Großcodebasis-Benchmark (394 ms Baseline, 465 ms mit Compiler), was immer noch weit unter dem Babel-Plugin-Pfad liegt. Für kleine Projekte liegt der absolute Overhead im einstelligen Millisekundenbereich."
---

[Buns PR #32504](https://github.com/oven-sh/bun/pull/32504), am 20. Juni 2026 gemergt, macht den Upstream-Rust-Port des React Compilers zu einer eingebauten `bun build`-Transformation. Schalten Sie sie mit `--react-compiler` auf der CLI oder `reactCompiler: true` auf `Bun.build` ein, und Bun memoisiert Ihre `.jsx`- und `.tsx`-Komponenten und -Hooks während des Builds, ohne Babel-Plugin, ohne Konfigurationsdateien und ohne etwas zu installieren. Das Feature ist standardmäßig deaktiviert und sowohl in den [Typdefinitionen](https://github.com/oven-sh/bun/blob/main/packages/bun-types/bun.d.ts) als auch in der [Bundler-Dokumentation](https://bun.com/docs/bundler) als experimentell markiert.

Dies ist der erste Bundler, der den React Compiler als native Transformation ausliefert. Vite, Next.js mit Turbopack, webpack und Rsbuild führen ihn heute alle über ein Babel- oder SWC-Plugin aus. Buns Weg überspringt diese Zwischenstation vollständig.

## Was geliefert wurde

Die Integration schließt [Issue #24356](https://github.com/oven-sh/bun/issues/24356), den langjährigen Feature-Wunsch nach erstklassigem React-Compiler-Support im Bundler, und ersetzt eine frühere [PR #31785](https://github.com/oven-sh/bun/pull/31785), die von einer `oxc_react_compiler`-Crate abhing, die es zu dem Zeitpunkt nicht gab. Die neue PR portiert den Rust-Workspace des Compilers direkt aus `facebook/react`, statt den Weg über Oxc zu gehen, daher lud die Upstream-PR-Beschreibung in [facebook/react#36173](https://github.com/facebook/react/pull/36173) explizit zu Bundler-Integrationen über den `react_compiler_oxc`-Adapter ein, und Bun wählte einen anderen Weg.

Eine am selben Tag ausgelieferte [Folge-PR #32545](https://github.com/oven-sh/bun/pull/32545) behebt drei Review-Kommentare aus der gemergten PR, darunter einen subtilen Bug, bei dem `reactCompilerOutputMode: 'client'` den Compiler stillschweigend aktivierte, obwohl `reactCompiler: false` gesetzt war. Der Ausgabemodus wird nun separat gespeichert und nur angewendet, wenn der Compiler aktiv ist, was zum dokumentierten Verhalten in `bun.d.ts` passt.

## Die Architektur: Bun-AST direkt in HIR

Der Compiler lebt in `src/react_compiler/`, einer einzelnen Crate mit rund 62k LOC. Der Hauptteil ist ein Byte-für-Byte-Port des Upstream-Rust-Workspace, mit umgeschriebenen Import-Pfaden und ohne die `serde`- und `serde_json`-Derives, die Bun nicht braucht. Die Crates aus dem Upstream, die vollständig portiert werden: `hir/`, `ssa/`, `inference/`, `typeinference/`, `optimization/`, `validation/`, `reactive_scopes/`, `diagnostics/` und `utils/`. Die Datenstrukturen auf dem Hot Path wurden verdichtet: `HashMap<SmallId, _>` wird zu `Vec<_>`, `HashSet<ValueReason>` wird zu `EnumSet` (u16), und Points-to-Sets werden zu `SmallVec<[_; 4]>`. Die `IndexMap`- und `IndexSet`-API ist über arena-basiertes `bun_collections::ArrayHashMap` überbrückt.

Die vier Schichten, die den AST berühren (Lowering, Codegen, Pipeline und der Program/Imports-Kleber), sind gegen `bun_ast` neu implementiert, mit der Typ-Mapping-Tabelle in `src/react_compiler/DESIGN.md`, die dokumentiert, wie Buns AST-Knoten dem Babel-förmigen AST entsprechen, den der Compiler erwartet.

Der Compile-Hook feuert in `visit_stmts(FnBody)`, zwischen dessen Visit-Phase und der Inline-Mangle-Phase. Die Kandidatenerkennung auf `S::Function`, `S::Local`, `S::ExportDefault` und `S::Expr` zeichnet die `Ref` des Bindings und das `memo`/`forwardRef`-Wrapper-Bit auf; `visit_func` und der Arrow-Visit kopieren die Argumente, Flags und Locations der Funktion in eine `Copy`-`PendingCompile`-Struktur; der Hook ruft `maybe_compile_pending` auf, das ein stack-lokales `G::Fn` baut und `maybe_compile_node` ausführt. Der kompilierte Body landet im laufenden `stmts`-Buffer, sodass die bestehende Mangle-Phase darauf läuft. Neue Argumente und Flags fließen über ein einziges `CompileResult`-Feld zurück. Keine rohen Pointer, keine zusätzliche Pass; der Nicht-RC-Pfad fügt pro Top-Level-Deklaration eine einzige `is_some()`-Prüfung hinzu.

Der Compiler respektiert außerdem `// eslint-disable react-hooks/*`-Unterdrückungen. Der Lexer führt eine Substring-Prüfung pro Kommentar aus, gegated auf das Feature-Flag, und propagiert die Unterdrückung als Flag-Bit auf `G::Fn` und `E::Arrow`; der Compiler überspringt jede Funktion, die dieses Bit trägt.

## Die Zahlen

Die PR liefert einen Benchmark auf einer großen React-Codebasis (rund 860 kompilierte Komponenten, 1400 Memo-Slots). Derselbe Code, auf derselben Maschine:

| | Wandzeit | vs. Babel-Plugin |
|---|---|---|
| Baseline (`reactCompiler: false`) | 394 ms | - |
| `reactCompiler: true` | 465 ms (1,18x Baseline) | ~20x schneller als Babel |
| Babel-Plugin (gleiche Eingabe) | 9,15 s | 1x |

Der vollständige `--compile`-Standalone-Executable-Build, der alles bündelt plus den React-Compiler-Durchlauf, läuft mit dem Rust-Port in 3,62 s gegenüber 13,04 s mit dem Babel-Plugin, eine 3,6-fache Beschleunigung im gesamten Build.

Das sind keine synthetischen Mikro-Benchmarks. Die Codebasis ist real, die Komponenten kompilieren zu echten `_c(N)`-Memoisierungsaufrufen mit `$[0] !== label`-Cache-Prüfungen, und der `react/compiler-runtime`-Import, den Bun einfügt, löst sich gegen die React-19+-Installation auf, die mit der Anwendung mitkommt. Bun weist darauf hin, dass der Baseline-mit-RC-Overhead (394 ms zu 465 ms, ~18%) aus dem HIR-Aufbau und der SSA-Pass kommt; der Rest des Bundlers (Parser, Mangle, Minify) bleibt unverändert.

## Wie die API aussieht

CLI:

```sh
bun build ./app.tsx --react-compiler --target browser
```

`Bun.build`:

```ts
await Bun.build({
  entrypoints: ["./app.tsx"],
  reactCompiler: true,
  // reactCompilerOutputMode: "client", // Standard für target browser
  // reactCompilerOutputMode: "ssr",   // Standard für target bun/node
  target: "browser",
});
```

`reactCompilerOutputMode` ist standardmäßig `"client"`, wenn `target` `"browser"` ist, und `"ssr"`, wenn `target` `"bun"` oder `"node"` ist. Der SSR-Modus überspringt die `useMemoCache`-Runtime, damit die serverseitig gerenderte Ausgabe über Anfragen hinweg cache-freundlich bleibt. Die Semantik `compilationMode: "infer"` wird vom Upstream-Compiler übernommen, also werden nur Komponenten und Hooks kompiliert; `"use no memo"`-Direktiven werden respektiert, und `node_modules` wird übersprungen.

## Was das für das Bundler-Wettrüsten bedeutet

Es ist das erste Mal, dass der Rust-Port des React Compilers als Build-Time-Transformation ausgeliefert wird, statt als Bibliothek, in die sich andere Tools einklinken müssen. Die [Oxc-v0.135-Integration](/articles/2026-06-12--oxc-v0-135-react-compiler-ast-breaking) Mitte Juni hat den Compiler als aufrufbare Rust-Crate hinzugefügt, aber der einzige Bundler, der ihn seither tatsächlich verdrahtet hat, ist Bun. [Vite 8](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks) und [Vite 8.1](/articles/2026-06-15--vite-8-1-beta-wasm-esm-chunk-importmap) gehen weiterhin über `babel-plugin-react-compiler`; Next.js mit Turbopack nutzt den SWC-Port; webpack nutzt Babel. Buns Entscheidung, den Upstream direkt in die eigene AST-Schicht zu portieren, ist ein bewusster Trade-off: keine Cross-AST-Konvertierungskosten und keine Abhängigkeitsoberfläche, zum Preis einer regelmäßigen Resynchronisierung mit `facebook/react`.

Der Wartungspfad ist eingerichtet. `scripts/sync-react-compiler.sh` holt per Sparse-Fetch `facebook/react` und gibt einen Diff pro Datei zwischen `src/react_compiler/UPSTREAM_PORTED` und dem Upstream-Tip aus, gruppiert in vollständige Crate-Ports (die mechanisch anwendbar sind) und AST-Grenzports (die über die Typ-Mapping-Tabelle neu portiert werden). `--fixtures` resynchronisiert die Testsuite. Solange die Upstream-API Babel-AST-förmig bleibt, sind die Port-Kosten ungefähr proportional dazu, wie oft der Upstream die Grenzschichten anfasst.

## Was zu beobachten ist

Drei Signale, die in den nächsten Wochen interessant sind:

1. Die [Release-Notes zu Bun v1.3.15](https://github.com/oven-sh/bun/releases), sobald sie erscheinen, die PR #32504 plus die Folge-PR bündeln und das Feature von `bun build` experimentell auf ein stabiles Flag heben sollten.
2. Der Oxc-`react_compiler_oxc`-Adapter, der als stabile Crate in einem Oxc-Release landet, der Weg, den Vite und Rolldown sehr wahrscheinlich gehen werden, um an dieselben Leistungszahlen zu kommen, ohne den Upstream zu portieren.
3. Jede Änderung der „Public API" des Upstream-React-Compilers von „Babel-AST + Scope-Info" hin zu einer stärker bundler-nativen Form, die es Oxc (und darüber Vite, Next.js, Rsbuild) erlauben würde, ihre eigenen Adapter-Crates komplett zu überspringen.
