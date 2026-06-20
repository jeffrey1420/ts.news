---
title: "TypeScript 7.0 RC ist da: Der Go-Compiler erreicht den Release Candidate, rund 10-mal schneller, mit Side-by-Side-Migration"
description: "TypeScript 7.0 RC (18. Juni 2026) ist der Release Candidate des Compilers, den Microsoft von seiner in TypeScript gebooteten Codebasis nach Go portiert hat. Er ist oft rund 10-mal schneller als TypeScript 6.0, liefert ein tsc6-Kompatibilitätspaket für den parallelen Betrieb mit 6.0, fügt die Parallelitäts-Flags --checkers/--builders/--singleThreaded und einen neu aufgebauten Watch-Modus auf einem Go-Port von @parcel/watcher hinzu und macht alle Deprecations aus 6.0 zu harten Fehlern. Das stabile Release ist für den kommenden Monat geplant, eine stabile programmierbare API wird auf 7.1 verschoben."
date: 2026-06-20
image: "/images/heroes/2026-06-20--typescript-7-0-rc-go-compiler-10x-faster.png"
author: lschvn
tags: ["typescript", "tooling"]
tldr:
  - "TypeScript 7.0 RC erschien am 18. Juni 2026 über npm install -D typescript@rc (meldet 7.0.1-rc). Es ist der Release Candidate des Go-Ports, den Microsoft seit über einem Jahr baut, oft rund 10-mal schneller als TypeScript 6.0, und behält dieselbe Typ-Prüf-Semantik bei, weil er methodisch portiert statt neu geschrieben wurde."
  - "Die Migration ist so ausgelegt, dass sie nicht stört: Ein neues Paket @typescript/typescript6 liefert ein tsc6-Binary, npm-Aliase erlauben es typescript-eslint, weiter aus typescript zu importieren, und eine stabile programmierbare API wird explizit auf 7.1 verschoben. Das stabile Release ist für den kommenden Monat geplant."
  - "7.0 übernimmt die Defaults von TypeScript 6.0 und macht dessen Deprecations zu harten Fehlern: target es5, moduleResolution node/node10, baseUrl und module amd/umd/systemjs fallen weg, während strict, module esnext und stableTypeOrdering zu Defaults werden. Die neuen Flags --checkers, --builders und --singleThreaded steuern paralleles Parsen, Typ-Prüfen, Emit und Project-Reference-Builds."
faq:
  - question: "Ist TypeScript 7.0 RC ein Breaking Change für bestehenden Code?"
    answer: "Bei den Typ-Prüf-Ergebnissen nein. Die Go-Codebasis wurde methodisch aus der TypeScript-6.0-Implementierung portiert statt neu geschrieben, daher ist ihre Typ-Prüf-Logik strukturell identisch und liefert dieselben Ergebnisse. Die Breaking Changes betreffen ausschließlich die Konfiguration: 7.0 übernimmt die neuen Defaults aus 6.0 (strict true, module esnext, types []) und macht die Deprecations aus 6.0 zu harten Fehlern (target es5, moduleResolution node/node10, baseUrl, module amd/umd/systemjs). Jedes Projekt, das unter 6.0 mit aktiviertem stableTypeOrdering und ohne ignoreDeprecations-Flag sauber kompiliert, sollte unter 7.0 identisch kompilieren."
  - question: "Wie betreibe ich TypeScript 7.0 parallel zu TypeScript 6.0?"
    answer: "Installieren Sie den RC mit npm install -D typescript@rc, womit Sie das tsc-Binary von 7.0 erhalten. Für Werkzeuge wie typescript-eslint, die TypeScript direkt über eine Peer-Dependency importieren, sind npm-Aliase der Weg: Aliasieren Sie das Paket typescript auf npm:@typescript/typescript6, damit diese Werkzeuge weiter 6.0 nutzen, und fügen Sie einen zweiten Alias (etwa typescript-7) hinzu, der auf npm:typescript@rc zeigt, um das tsc von 7.0 über npx verfügbar zu halten. @typescript/typescript6 liefert außerdem ein tsc6-Binary für die Kommandozeile."
  - question: "Wann wird TypeScript 7.0 stabil und wann kommt die programmierbare API?"
    answer: "Der von Microsoft genannte Plan ist, das stabile TypeScript 7.0 innerhalb des kommenden Monats nach dem RC zu veröffentlichen. Eine stabile programmierbare API wird explizit auf TypeScript 7.1 verschoben, weshalb die Side-by-Side-Story mit tsc6 existiert. Bis 7.1 sollten Werkzeuge, die die TypeScript-API programmatisch nutzen, weiter 6.0 pinnen."
  - question: "Was bewirken die neuen Flags --checkers und --builders?"
    answer: "--checkers legt die Anzahl der Typ-Prüf-Worker fest (Standard 4). Typ-Prüfen hat dateiübergreifende Abhängigkeiten, daher erzeugt 7.0 einen festen Pool von Workern, die die Dateien stets identisch aufteilen, um deterministische Ergebnisse zu erhalten; ein höherer Wert beschleunigt große Builds auf Kosten des Speichers. --builders steuert parallele Project-Reference-Builder, was vor allem für Monorepos relevant ist. Beide Flags sind multiplikativ (--checkers 4 --builders 4 kann bis zu 16 Checker erzeugen), und --singleThreaded begrenzt den gesamten Compiler auf einen Thread für Debugging oder beengte CI."
---

[TypeScript 7.0 RC](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0-rc/) erschien am 18. Juni 2026 und ist der Release Candidate des Compilers, den Microsoft seit über einem Jahr nach Go portiert. Die Schlagzeile ist Geschwindigkeit: 7.0 ist oft rund **10-mal schneller als TypeScript 6.0**, Resultat nativer Ausführung plus Shared-Memory-Parallelität statt des Single-Threaded-Compilers, der in JavaScript gebootet war und den das Ökosystem seit Beginn nutzt. Sie können ihn heute mit `npm install -D typescript@rc` installieren, und `npx tsc --version` meldet `7.0.1-rc`.

Das ist das Ergebnis von [Project Corsa](/articles/2026-03-23-typescript-7-native-preview-go-compiler), dem nativen Port, den Microsoft Anfang 2025 angekündigt hat. [TypeScript 6.0](/articles/2026-04-17-typescript-6-0-bridge-to-go-native) war bewusst als „Bridge-Release" angelegt, um den Sprung zu glätten, und [das Team beschrieb 7.0 bereits im April als „extrem kurz vor der Fertigstellung"](/articles/2026-04-06-typescript-6-last-release-before-go-rewrite). Der RC ist diese Fertigstellung, eingefroren im Funktionsumfang.

## Portiert, nicht neu geschrieben

Das wichtigste Detail für alle, die ein Upgrade vorbereiten: 7.0 ist ein methodischer Port, keine Neu-Schreibung von Grund auf. Microsoft hat die bestehende TypeScript-Codebasis Datei für Datei nach Go verschoben, und die Typ-Prüf-Logik ist strukturell identisch mit 6.0. Der Compiler wurde gegen die über ein Jahrzehnt gewachsene Test-Suite evaluiert und läuft bereits in mehreren Codebasen mit mehreren Millionen Zeilen, innerhalb wie außerhalb von Microsoft, wobei Teams bei Bloomberg, Canva, Figma, Google, Linear, Notion, Slack, Vercel und VoidZero zu den Early Adopters zählen, die deutliche Build-Zeit-Reduktionen melden.

Praktisch: Jeder Code, der unter 6.0 sauber kompiliert, mit aktiviertem `stableTypeOrdering` und ohne gesetztes `ignoreDeprecations`-Flag, sollte unter 7.0 identisch kompilieren. Die Semantik hat sich nicht bewegt.

## Eine Migration für den parallelen Betrieb

Weil die Go-Codebasis noch keine stabile programmierbare API freigibt (sie ist explizit auf TypeScript 7.1 in mehreren Monaten verschoben), hat Microsoft 7.0 so ausgelegt, dass es neben 6.0 ohne „welches `tsc` ist welches?"-Konflikte läuft. Veröffentlicht wurde `@typescript/typescript6`, ein Kompatibilitätspaket, das die 6.0-API re-exportiert und ein `tsc6`-Binary mitliefert.

Für Werkzeuge wie typescript-eslint, die über eine Peer-Dependency direkt aus `typescript` importieren, ist der empfohlene Weg über npm-Aliase. Pinnen Sie `typescript` auf den 6.0-Alias, damit diese Werkzeuge weiterlaufen, und fügen Sie einen zweiten Alias für 7.0 hinzu:

```json
{
  "devDependencies": {
    "typescript": "npm:@typescript/typescript6@^6.0.0",
    "typescript-7": "npm:typescript@rc"
  }
}
```

Nun läuft `npx tsc` mit 7.0, während typescript-eslint weiterhin 6.0 unter dem Namen `typescript` verbraucht. Nightlies erscheinen weiterhin unter `@typescript/native-preview` (Binary `tsgo`); sobald 7.0 auf den `latest`-Tag wechselt, konvergieren alle Releases auf das Paket `typescript`.

## Parallelität, die sich einstellen lässt

Der Geschwindigkeitsgewinn stammt aus der Parallelisierung von Parsen, Typ-Prüfen und Emit, und 7.0 legt die Hebel offen. `--checkers` setzt die Anzahl der Typ-Prüf-Worker, standardmäßig 4. Typ-Prüfen hat dateiübergreifende Abhängigkeiten, daher erzeugt 7.0 statt vollständig unabhängiger Worker einen festen Pool, der dieselben Eingabedateien stets identisch aufteilt und so deterministische Ergebnisse liefert, wenn auch mit etwas duplizierter Arbeit. Ein höherer Wert beschleunigt große Builds auf Mehrkernmaschinen, kostet aber Speicher; ein niedrigerer hilft beengten CI-Runnern.

`--builders` steuert parallele Project-Reference-Builder, was vor allem für Monorepos zählt. Beide Flags sind multiplikativ: `--checkers 4 --builders 4` kann bis zu 16 Checker erzeugen, was Microsoft als möglicherweise übermäßig einstuft. `--singleThreaded` begrenzt den gesamten Compiler auf einen Thread für Debugging oder den Vergleich mit 6.0.

Auch der `--watch`-Modus wurde neu aufgebaut. Microsoft hat den File-Watcher des Parcel-Bundlers (`@parcel/watcher`) von C++ nach Go portiert, mit minimalen Assembler-Shims, um keine C++-Toolchain-Abhängigkeit einzuführen. Das Resultat sind laut Team deutliche Ressourcen-Verbesserungen im Watch-Modus über alle Plattformen hinweg, mit Dank an Devon Govett für den ursprünglichen Parcel-Watcher.

## 6.0s Defaults werden zum Fundament, und seine Deprecations werden zu harten Fehlern

7.0 übernimmt die neuen Defaults aus 6.0 und duldet nicht länger, was 6.0 als deprecated markiert hat. Die Defaults, die sich ändern: `strict` ist `true`, `module` ist `esnext`, `target` ist die aktuelle stabile ECMAScript-Version vor `esnext`, `noUncheckedSideEffectImports` ist `true`, `libReplacement` ist `false`, und `stableTypeOrdering` ist `true` und lässt sich nicht abschalten.

Die beiden Optionen, die Microsoft als „am überraschendsten" kennzeichnet, sind `rootDir` und `types`. `rootDir` ist nun standardmäßig `./`, sodass Projekte, deren `tsconfig.json` außerhalb von `src` liegt, es explizit setzen müssen, um die Verzeichnisstruktur zu erhalten. `types` ist nun standardmäßig `[]`, sodass globale Deklarationen aus `@types`-Paketen explizit aufgelistet werden müssen (das alte Verhalten lässt sich mit `"types": ["*"]` wiederherstellen).

Die als deprecated geltenden Optionen, die zu harten Fehlern werden, umfassen `target: es5`, `downlevelIteration`, `moduleResolution: node`/`node10` (nutzen Sie `nodenext` oder `bundler`), `module: amd`/`umd`/`systemjs`/`none`, `baseUrl`, `moduleResolution: classic` sowie das Setzen von `esModuleInterop` oder `allowSyntheticDefaultImports` auf `false`. Das Schlüsselwort `asserts` auf Imports muss zu `with` werden, und `/// <reference no-default-lib />` wird unter `skipDefaultLibCheck` nicht mehr respektiert. Die vollständige Liste steht in der [CHANGES.md](https://github.com/microsoft/typescript-go/blob/main/CHANGES.md) im Repo `microsoft/typescript-go`.

## Zwei echte Änderungen auf Typebene

Zwei Änderungen betreffen das Verhalten auf Typebene statt die Konfiguration. Die Inferenz von Template-Literal-Typen erhält nun Unicode-Codepunkte: `HeadTail<"😀abc">` ergibt `["😀", "abc"]` statt das Emoji in zwei UTF-16-Surrogathälften zu zerlegen. Das richtet die Inferenz an der Semantik von `for...of` und Spread aus, bricht aber String-Utilities auf Typebene, die bewusst UTF-16-Codeeinheiten modellierten, etwa einige `Length`-Helfer.

Auch die Unterstützung von JavaScript (JSDoc) wurde überarbeitet, um konsistent mit der Analyse von `.ts`-Dateien zu sein. `@enum`, ein eigenständiger `?`-Typ, `@class` als Konstruktor-Marker, das postfixe `!` und die Closure-artige Funktionssyntax wie `function(string): void` werden nicht mehr speziell behandelt. Werte, die eingesetzt werden, wo Typen erwartet werden, benötigen nun `typeof`.

## Die Editor-Erfahrung

Der Language-Service basiert auf dem Language Server Protocol und nutzt mehrere Threads, sodass der Editor dieselbe Parallelität gewinnt wie die Kommandozeile. Die VS-Code-Erweiterung [TypeScript Native Preview](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview) ist der weg mit der geringsten Reibung zum Ausprobieren, und Microsoft hat die seit der Beta fehlenden Funktionen nachgeliefert: Auto-Imports, semantisches Highlighting, Inlay-Hints, Code-Linsen, Go-to-Source-Definition, verknüpftes Bearbeiten von JSX sowie das Sortieren und Entfernen ungenutzter Imports. Die internen Daten des Teams sprechen von über 20-mal weniger scheiternden Language-Server-Befehlen gegenüber 6.0.

## Was jetzt tun und was beobachten

Der Upgrade-Pfad für die meisten Teams: Wechseln Sie, falls noch nicht geschehen, zuerst zu 6.0, räumen Sie dessen Deprecations aus, dann `npm install -D typescript@rc` und lassen Sie es in der CI laufen. Pinnen Sie `--checkers`, wenn Sie über Maschinen hinweg identische Ergebnisse wollen. Microsoft plant das stabile 7.0-Release für den kommenden Monat, wobei 7.1 die stabile programmierbare API bringt, die es den Werkzeugen erlaubt, 6.0 endgültig zu verlassen. Melden Sie Regressionen auf dem [Issue-Tracker von microsoft/typescript-go](https://github.com/microsoft/typescript-go/issues), denn das RC-Fenster ist der Moment, in dem dieses Feedback am meisten zählt.
