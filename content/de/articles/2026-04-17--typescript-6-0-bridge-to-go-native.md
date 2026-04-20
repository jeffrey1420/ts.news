---
title: "TypeScript 6.0: Die letzte JavaScript-Version vor dem nativen Go-Compiler"
description: "TypeScript 6.0 erscheint als Brücken-Release mit neuen Features wie #/-Subpath-Imports, stabiler Type-Order und dem Weg zu TypeScript 7.0s nativem Go-Compiler."
date: 2026-04-17
image: "https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2026/03/ts-6.0-2.png"
author: lschvn
tags: ["TypeScript", "JavaScript", "Microsoft", "Compiler", "Go"]
tldr:
  - TypeScript 6.0 ist die letzte Version auf der aktuellen JavaScript-Codebasis — TypeScript 7.0 wird in Go für native Geschwindigkeit und Shared-Memory-Parallelität gebaut
  - Neue Features: #/-Subpath-Imports, Map.getOrInsert/getOrInsertComputed, Typen für die Temporal-API, und relaxierte Typinferenz für Methoden ohne `this`
  - Mehrere Defaults ändern sich: strict=true, module=esnext, types=[], rootDir=. — viele Projekte werden 20-50% schnellere Builds sehen, müssen aber möglicherweise explizit Types konfigurieren
faq:
  - q: "Wie bereite ich mich auf TypeScript 7.0 vor?"
    a: "Verwenden Sie TypeScript 6.0 jetzt. Testen Sie die TypeScript-7.0-Native-Preview in VS Code (Erweiterung: TypeScriptTeam.native-preview) oder über npmx.dev. Das neue Flag --stableTypeOrdering hilft, Unterschiede früh zu erkennen."
  - q: "Warum hat TypeScript nach Go neu geschrieben?"
    a: "Der Go-Compiler zielt auf native Ausführungsgeschwindigkeit und Shared-Memory-Multithreading, was die aktuelle TypeScript-Implementierung nicht effizient erreichen kann. Das Team kündigte dies 2025 an und 7.0 wird als 'extrem nah an der Fertigstellung' beschrieben."
  - q: "Was tun, wenn mein Projekt nach dem Upgrade bricht?"
    a: "Setzen Sie 'types' explizit (z.B. ['node', 'jest']), konfigurieren Sie 'rootDir' falls Sources verschachtelt sind, setzen Sie 'strict': false falls Sie sich auf den alten Default verlassen haben, und prüfen Sie die ignoreDeprecations-Option."
---

TypeScript 6.0 ist diesen Monat erschienen, und es trägt ein Gewicht, das die meisten Nebenversionen nicht tragen: Es ist die letzte Version auf der aktuellen JavaScript-Codebasis. Alles ab 7.0 wird auf einem nativen Go-Compiler laufen, den das Team seit über einem Jahr aufbaut.

## Eine Brücke zu TypeScript 7.0

Die Hauptgeschichte ist, was 6.0 nicht enthält. Microsoft ist deutlich: Es ist ein "Brücken-Release" — dazu gedacht, APIs und Verhalten zu vereinheitlichen, damit der Umstieg auf die Go-Codebasis reibungslos verläuft. Das Team ist offen: "TypeScript 7.0 ist tatsächlich extrem nah an der Fertigstellung." Sie können die Native-Preview bereits in VS Code oder über `npmx.dev/package/@typescript/native-preview` ausprobieren.

Die meisten Änderungen in 6.0 dienen diesem Übergang. Aber es gibt auch neue Features.

## Weniger `this`-Sensitivität bei der Typinferenz

Ein lange Zeit nerviger Edge Case wird behoben. Wenn TypeScript Type-Parameter aus einem Callback inferiert, überspringt es "kontextsensitive" Funktionen — solche mit ungetypten Parametern. Methoden in Shorthand-Syntax wurden immer als sensitiv behandelt, weil sie einen impliziten `this`-Parameter tragen, selbst wenn `this` nie verwendet wird. Arrow-Funktionen hatten dieses Problem nicht.

TypeScript 6.0 prüft jetzt, ob `this` tatsächlich referenziert wird, bevor eine Methode als sensitiv markiert wird. Wenn Sie `this` nie verwenden, nimmt die Methode normal an der Typinferenz teil. Die Korrektur wurde von Mateusz Burzyński beigesteuert ([PR #62243](https://github.com/microsoft/TypeScript/pull/62243)).

## Subpath-Imports unterstützen jetzt `#/`

Node.js hat kürzlich Support für Subpath-Imports hinzugefügt, die mit `#/` statt mit `#/etwas` beginnen. TypeScript 6.0 übernimmt dies unter `--moduleResolution nodenext` und `bundler`. Sie können jetzt schreiben:

```json
{
  "imports": {
    "#/*": "./dist/*"
  }
}
```

Das entspricht der Art und Weise, wie Bundler üblicherweise mit Path-Aliasen umgehen, und entfernt die Notwendigkeit eines Dummy-Segments nach `#`.

## `--moduleResolution bundler` mit `commonjs` kombinieren

Bisher erforderte `--moduleResolution bundler` `--module esnext` oder `--module preserve`. Mit der Deprecation von `moduleResolution: node` fällt diese Einschränkung. Die neue gültige Kombination ist `--module commonjs` mit `--moduleResolution bundler`, ein praktischer Migrationspfad für viele bestehende Projekte ([PR #62320](https://github.com/microsoft/TypeScript/pull/62320)).

## Stable Type Ordering für 6.0-zu-7.0-Migrationen

TypeScript 7.0s paralleler Type-Checker sortiert interne Objekte deterministisch. TypeScript 6.0 führt `--stableTypeOrdering` ein, um die Ausgabe an diese Ordnung anzupassen. Das ist primär ein Migrationstool — das Flag kann das Type-Checking um bis zu 25% verlangsamen — aber es stellt sicher, dass Declaration-Files und Fehlermeldungen nicht unerwartet beim Upgrade wechseln. Das Flag ist nicht für den dauerhaften Einsatz empfohlen.

## ES2025-Target und neue Built-in-API-Typen

TypeScript 6.0 fügt `es2025` als gültigen Wert für `--target` und `--lib` hinzu. Das bringt `RegExp.escape` (Stage 4) und verschiebt `Promise.try`, Iterator-Methoden und Set-Methoden in die stabile Lib. Die Temporal-API — der lang erwartete date/time-Ersatz für `Date` — erhält ebenfalls vollständige Built-in-Typen in 6.0. Die `Map`- und `WeakMap`-Typen erhalten `getOrInsert` und `getOrInsertComputed` (Stage 4) für das häufige "get or create"-Pattern.

## DOM-Lib-Konsolidierung

Der Inhalt von `lib.dom.iterable.d.ts` und `lib.dom.asynciterable.d.ts` ist jetzt vollständig in `lib.dom.d.ts` zusammengeführt. Sie brauchen `dom.iterable` nicht mehr zur `lib`-Array hinzuzufügen, nur um über eine `NodeList` zu iterieren.

## Breaking Changes, die Sie wahrscheinlich betreffen

TypeScript 6.0 kehrt mehrere Defaults um, auf die ältere Projekte sich verlassen haben könnten:

- **`strict` ist jetzt standardmäßig `true`** — wenn Sie sich auf fehlende implizite Strenge verlassen haben, setzen Sie explizit `"strict": false`
- **`module` ist standardmäßig `esnext`** — ESM ist jetzt das angenommene Format für neue Projekte
- **`target` ist standardmäßig das aktuelle Jahr** (effektiv `es2025` gerade) — das `es5`-Target ist deprecated
- **`types` ist jetzt standardmäßig `[]`** statt alles in `node_modules/@types` aufzuzählen — das allein hat Build-Zeiten um 20-50% in den vom Team untersuchten Projekten reduziert. Fügen Sie explizite Types hinzu: `["node", "jest"]` usw.
- **`rootDir` ist standardmäßig das tsconfig-Verzeichnis** statt von den Dateipfaden inferiert zu werden — verschachtelte Source-Verzeichnisse brauchen möglicherweise eine explizite `rootDir`-Konfiguration
- **`noUncheckedSideEffectImports` ist jetzt standardmäßig `true`**

## Fazit

Wenn Sie ein neues Projekt starten, ist 6.0 eine solide Wahl mit vernünftigen modernen Defaults. Wenn Sie auf einem bestehenden Codebase sind, planen Sie Zeit ein, um explizite `types`-Einträge hinzuzufügen und Ihr `rootDir` zu prüfen, bevor Sie blind upgraden. Der Go-basierte 7.0 kommt — das Team möchte, dass Sie jetzt auf 6.0 sind, damit der Übergang sauber verläuft.

Installieren: `npm install -D typescript@latest`
