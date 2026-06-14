---
title: "esbuild 0.28.1: Erstes Release seit zwei Monaten mit einer High-Severity-Deno-RCE, einem Windows-Path-Traversal und einem `using`-Disposal-Bug"
description: "esbuild v0.28.1 (11. Juni 2026) ist das erste Release seit April. Es behebt eine CVSS-8.1-Remote-Code-Execution in der Deno-API via NPM_CONFIG_REGISTRY, einen nur Windows betreffenden Path-Traversal im Dev-Server und einen Minifier-Bug, der das Ressourcen-Disposal mit `using` und `await using` stillschweigend kaputtgemacht hat."
date: 2026-06-14
image: "/images/heroes/2026-06-14--esbuild-0-28-1-deno-rce-windows-path-traversal.png"
author: lschvn
tags: ["security", "tooling", "javascript"]
tldr:
  - "esbuild v0.28.1, veröffentlicht am 11. Juni 2026, ist das erste esbuild-Release seit zwei Monaten und behebt eine Remote-Code-Execution CVSS 8.1 (High) in der Deno-API: Der Deno-Installer schrieb die heruntergeladene Binary mit 0o755-Berechtigungen und ohne SHA-256-Prüfung auf die Platte, sodass jeder, der NPM_CONFIG_REGISTRY kontrolliert, die Binary austauschen konnte."
  - "Ein zweites Advisory (GHSA-g7r4-m6w7-qqqr, Low) behebt einen nur Windows betreffenden Path-Traversal im Dev-Server von esbuild: Go's path.Clean() normalisiert nur Schrägstriche, daher konnten Anfragen mit Backslash aus dem Serve-Verzeichnis ausbrechen und beliebige Dateien lesen."
  - "Das Release behebt außerdem einen echten Korrektheits-Bug im Minifier: `using`- und `await using`-Deklarationen wurden in spätere Verwendungen inlined, wodurch der Disposal-Aufruf stillschweigend wegfiel und Ressourcen im minifizierten Output geleakt haben."
faq:
  - question: "Ist die esbuild-Deno-Schwachstelle aus einem normalen Projekt ausnutzbar?"
    answer: "Nur wenn ihr esbuild aus Deno nutzt und die Umgebungsvariable NPM_CONFIG_REGISTRY auf eine vom Angreifer kontrollierte Registry zeigt, was vor allem in CI-Pipelines, geteilten Dev-Maschinen und Firmennetzwerken mit Custom-npm-Proxy realistisch ist. Der Node-Installer führte bereits eine SHA-256-Integritätsprüfung (binaryIntegrityCheck) gegen erwartete Hashes aus package.json durch; der Deno-Pfad hatte sie komplett ausgelassen. 0.28.1 fügt dieselbe Prüfung dem Deno-Installer hinzu, sodass eine manipulierte Binary jetzt fehlschlägt, statt ausgeführt zu werden."
  - question: "Betrifft der Windows-Path-Traversal Produktions-Builds?"
    answer: "Nein. GHSA-g7r4-m6w7-qqqr betrifft nur den lokalen Entwicklungs-Server von esbuild (esbuild.context().serve() bzw. den --serve-Flag) unter Windows und nur, wenn ein Angreifer diesen Server über HTTP erreichen kann. Eine bösartige Anfrage mit Backslash konnte aus dem konfigurierten Serve-Verzeichnis ausbrechen und Dateien außerhalb davon lesen. Reines Bundling und One-Shot-Builds sind nicht betroffen, macOS und Linux ebenfalls nicht."
  - question: "Wie merke ich, ob der `using`-Minifier-Bug meinen Code betroffen hat?"
    answer: "Wenn ihr auf einer Version vor 0.28.1 esbuild-Minifizierung eingesetzt und die Explicit-Resource-Management-Syntax (`using x = ...` oder `await using y = ...`) genutzt habt, prüft, ob die Deklaration in eine spätere Verwendung inlined wurde. Der klassische Fehler war `{ using x = new Resource(); x.activate() }`, minifiziert zu `new Resource().activate()`, was das `using`-Binding verwirft, sodass Symbol.dispose nie läuft und die Ressource leakt. Upgrade auf 0.28.1, und die Deklaration bleibt erhalten."
  - question: "Was hat sich bei `import()` und `require()` für Module geändert, die werfen?"
    answer: "Issue #4461. Vor 0.28.1 hat esbuild, wenn ein Modul während der Auswertung geworfen hat, den Fehler nur beim ersten import() bzw. require() dieses Moduls erhalten; spätere Aufrufe bekamen einen veralteten Modulzustand statt erneut zu werfen. Die Spec verlangt denselben Fehler bei jedem Aufruf, und 0.28.1 macht das jetzt, was für Retry-Logik und Fehlerbehandlung bei dynamischen Imports wichtig ist."
---

esbuild [v0.28.1](https://github.com/evanw/esbuild/releases/tag/v0.28.1), veröffentlicht am 11. Juni 2026, ist das erste Release des Bundlers seit [v0.28.0 am 2. April](https://github.com/evanw/esbuild/releases/tag/v0.28.0). Eine zweimonatige Pause ist ungewöhnlich für ein Projekt, das normalerweise alle paar Wochen ein Release herausbringt, und 0.28.1 investiert das Budget in drei Dinge, die je für sich ein Upgrade rechtfertigen: eine Remote-Code-Execution von hoher Schwere in der Deno-API, einen nur Windows betreffenden Path-Traversal im Dev-Server und einen Korrektheits-Bug im Minifier, der die `using`- und `await using`-Disposal-Syntax stillschweigend kaputtgemacht hat.

Weil esbuild unter [Vites Dependency-Optimizer und TS/JSX-Pipeline](/articles/2026-04-15--vite-plus-alpha-unified-toolchain-open-source) liegt, erben viele Projekte diese Fixes transitiv. Hier ist, was sich geändert hat und wer handeln muss.

## Eine High-Severity-RCE in der Deno-API

Das ernsteste Element ist [GHSA-gv7w-rqvm-qjhr](https://github.com/evanw/esbuild/security/advisories/GHSA-gv7w-rqvm-qjhr), eingestuft als High mit CVSS 8.1. Die Deno-Distribution von esbuild (`lib/deno/mod.ts`) lädt die native esbuild-Binary aus einer npm-Registry herunter und schreibt sie mit ausführbaren Berechtigungen (`0o755`) auf die Platte, ohne ihren Inhalt zu verifizieren. Der Node-Installer hatte bereits ein `binaryIntegrityCheck()`, das einen SHA-256-Hash der heruntergeladenen Binary gegen erwartete Werte aus `package.json` vergleicht; der Deno-Pfad bekam das Pendant nie.

Der Angrifsvektor ist die Umgebungsvariable `NPM_CONFIG_REGISTRY`. Das Deno-Modul baut seine Download-URL aus dieser Variable, daher kann jeder, der sie setzen kann, in einer CI-Pipeline, einer geteilten Entwicklungsmaschine oder einem Firmennetzwerk, das npm über eine Custom-Registry proxied, eine trojanierte Binary ausliefern, die esbuild gern ausführt. Das ist dieselbe Klasse von Supply-Chain-Vertrauensversagen, die den jüngsten [npm-`shai-hulud`-Account-Takeover-Vorfall](/articles/2026-06-06--npm-supply-chain-attack-red-hat-mini-shai-hulud) hervorgebracht hat: Die Registry ist standardmäßig vertraut, und es gibt keinen zweiten Check beim Konsumenten.

0.28.1 portiert die SHA-256-Integritätsprüfung auf den Deno-Installer. Eine Binary, deren Hash nicht zum erwarteten Wert passt, schlägt jetzt mit einem Fehler fehl, statt ausgeführt zu werden. Beachtet, dass esbuilds Deno-API weiterhin standardmäßig aus `registry.npmjs.org` installiert und weiterhin `NPM_CONFIG_REGISTRY` respektiert; der Fix ist die Verifikation, nicht ein Quellenwechsel.

## Ein Windows-Path-Traversal im Dev-Server

Das zweite Advisory, [GHSA-g7r4-m6w7-qqqr](https://github.com/evanw/esbuild/security/advisories/GHSA-g7r4-m6w7-qqqr), ist mit CVSS 2.5 als Low eingestuft, ist aber ein sauberes Beispiel für einen Klassiker. Der lokale Entwicklungs-Server von esbuild hat eingehende Request-Pfade mit Go's `path.Clean()` bereinigt. Diese Funktion ist rein POSIX: Sie versteht Schrägstriche, behandelt einen Backslash aber als gewöhnliches Zeichen. Unter Windows, wo `\` ein gültiges Pfadtrennzeichen ist, konnte eine präparierte Anfrage daher aus dem konfigurierten `serve`-Verzeichnis ausbrechen und beliebige Dateien lesen.

Die Ursache ist eine Zeile:

```go
queryPath := path.Clean(req.URL.Path)[1:]
```

0.28.1 verbietet Backslashes in Request-Pfaden des Dev-Servers komplett. Die Angriffsfläche ist eng: Sie erfordert den Dev-Server (`esbuild.context().serve()` oder den `--serve`-Flag) unter Windows, erreichbar für einen Angreifer. Produktions-Bundling und One-Shot-Builds sind nicht betroffen, macOS- und Linux-Hosts ebenfalls nicht.

## Der `using`- und `await using`-Minifier-Bug

Der dritte Fix ist der, für den die meisten Anwendungsentwickler ihren Output tatsächlich auditiern sollten. [Issue #4482](https://github.com/evanw/esbuild/issues/4482): Der Minifier von esbuild hat manchmal eine `using`- oder `await using`-Deklaration in ihre spätere Verwendung inlined, was das Binding verwirft und bedeutet, dass `Symbol.dispose` / `Symbol.asyncDispose` nie läuft. Der Fehler sieht so aus:

```js
// Original-Code
{
  using x = new Resource()
  x.activate()
}

// Alter esbuild-Output (mit --minify)
new Resource().activate();

// Korrigierter Output (0.28.1)
{using e=new Resource;e.activate()}
```

Der alte Output leakt die Ressource jedes Mal, weil kein `using` mehr übrig ist, das am Ende des Blocks das Disposal auslöst. Der Bug existiert, weil die Inlining-Pass des Minifiers für `let` und `const` geschrieben, dann für `var` ausgenommen und nie aktualisiert wurde, als die Explicit-Resource-Management-Syntax zwei weitere Deklarationsarten hinzufügte. Wenn ihr minifizierte Produktions-Builds ausliefert und `using` für File-Handles, Datenbankverbindungen, Locks oder ein `AsyncDisposable` nutzt, ist das eine stille Korrektheits-Regression, nach der ihr in eurem Build-Output grep-en solltet.

## Kleinere Korrektheits-Fixes

Der Rest von 0.28.1 ist ein Cluster von Korrektheits-Fixes, die meistens Bundling-Edge-Cases betreffen:

- **Neu geworfene Modul-Fehler ([#4461](https://github.com/evanw/esbuild/issues/4461), [#4467](https://github.com/evanw/esbuild/pull/4467)).** Wenn ein Modul während der Auswertung wirft, verlangt die Spec, dass jeder spätere `import()` oder `require()` dieses Moduls denselben Fehler wirft. esbuild hat den Fehler bisher nur beim ersten Aufruf erhalten. Das ist relevant für Retry-Logik und Fehlerbehandlung bei dynamischen Imports.
- **Wrapping des `new`-Operators ([#4477](https://github.com/evanw/esbuild/issues/4477)).** Komplexe Ziele von `new`, insbesondere getaggte Template-Literale und Optional-Chains, wurden nicht immer in Klammern gewrapped. Der alte Output war manchmal ein Syntaxfehler und manchmal semantisch verändert, etwa `new (foo()`bar`)()` und `new (foo()?.bar)()`.
- **Umbenennung von gehoistetem `var` ([#4471](https://github.com/evanw/esbuild/issues/4471)).** Ein `var`, das in einem verschachtelten Scope deklariert und auf Modulscope gehoistet wurde, galt beim Name-Collision-Pass nicht als Symbol auf Modulebene, was zu Namenskollisionen führen konnte, wenn Minifizierung deaktiviert war.
- **ES5: `const` zu `var` ([#4448](https://github.com/evanw/esbuild/issues/4448)).** Für TypeScript-only `import x = require('y')`-Konstrukte mit Target ES5 emitet esbuild jetzt `var` statt `const`, was es nicht korrekt downgraden konnte.

## Wer upgraden muss

Die Deno-RCE ist der einzige Punkt, der ein sofortiges, jetzt-gleich-Upgrade für alle rechtfertigt, und zwar nur für Projekte, die esbuild über Deno in einer Umgebung konsumieren, in der `NPM_CONFIG_REGISTRY` gesetzt ist. Alle anderen sollten trotzdem beim nächsten Build-Tooling-Bump auf 0.28.1 wechseln: Der Windows-Path-Traversal schließt eine echte, wenn auch enge, Angriffsfläche, und der `using`-Disposal-Fix ist ein Korrektheits-Bug, den ihr nicht im minifizierten Produktions-Output haben wollt.

Das Release ist auch eine nützliche Erinnerung daran, dass esbuild nicht nur ein Vite-Implementierungsdetail ist. Es ist das Transpilierungs- und Minifizierungs-Substrat unter einem großen Teil der [Rust-basierten JavaScript-Toolchain](/articles/2026-06-12--oxc-v0-135-react-compiler-ast-breaking), und seine zweimonatige Release-Pause fällt auf, gemessen am wöchentlichen Rhythmus von Oxc und Rolldown. Vorerst landen die Fixes sauber, und das Upgrade ist ein `bun install esbuild@latest` oder Äquivalent. Wenn ihr den esbuild-Dev-Server unter Windows betreibt oder esbuild aus Deno hinter einer Custom-Registry nutzt, macht es heute.
