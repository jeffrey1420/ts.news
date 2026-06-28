---
title: "Prettier 3.9 überholt fünf Parser: micromark für Markdown, yaml v2, GraphQL.js v17, ein Rust-basierter Flow-Parser und Angular"
description: "Prettier 3.9.0, veröffentlicht am 27. Juni 2026 (prettier/prettier, Blogpost von Fisker Cheung), ist eine parserlastige Version, die Markdown von remark-parse v8 auf micromark v4 hebt (bessere CommonMark- und GFM-Konformität sowie eine Reihe lange bestehender Parsing-Bugs behoben), YAML auf yaml v2, GraphQL auf GraphQL.js v17 (Fragment-Argumente und Direktiven auf Direktivdefinitionen), Flow auf den neuen Rust-basierten oxidized-Parser des Flow-Teams (rund 37 % schneller bei Prettiers gültigen Flow-Fixtures und 43 % schneller bei flow_parser.js in lokalen Parser-only-Benchmarks) und Angular. Auch der JavaScript- und TypeScript-Printer wurde überarbeitet, insbesondere im --no-semi-Modus, wo Kommentare um break und continue jetzt über mehrere Durchläufe stabil sind (ein Idempotenz-Fix), sowie redundante Klammern in return, die Ausrichtung von eingebetteten Template-Interpolationen und das Inlining von logischen Negationen. Die Version entfernt die veraltete import ... assert {}-Syntax (Babel 8 hat das Parser-Plugin entfernt; migriert zu with), repariert eine stillschweigend defekte Option --cache-strategy content und verhindert, dass EditorConfig-Dateien oberhalb von Git-Worktrees einsickern. Das Team erinnert daran, die genaue Version in der package.json festzupinnen, da die Formatierungsänderungen Diffs erzeugen."
date: 2026-06-28
image: "/images/heroes/2026-06-28--prettier-3-9-micromark-yaml-graphql-rust-flow-parser.png"
author: lschvn
tags: ["tooling", "javascript", "ecosystem"]
tldr:
  - "Prettier 3.9.0 ([Blogpost](https://prettier.io/blog/2026/06/27/3.9.0), veröffentlicht am 27. Juni 2026 von Fisker Cheung) ist eine Version mit Parser-Upgrades. Markdown wechselt vom veralteten remark-parse v8 zu [micromark v4](https://github.com/micromark/micromark) für deutlich bessere CommonMark- und GFM-Konformität und eine Reihe lange bestehender Parsing-Bugs; YAML wechselt zu yaml v2; GraphQL wechselt zu GraphQL.js v17 und fügt Fragment-Argumente und Direktiven auf Direktivdefinitionen hinzu; der Angular-Parser wird aktualisiert; und Flow wechselt zum neuen (oxidized) Rust-basierten Parser des Flow-Teams."
  - "Der Wechsel des Flow-Parsers ist der Performance-Höhepunkt. In Prettiers lokalen Parser-only-Benchmarks formatierte der neue Rust-Parser Prettiers gültige Flow-Fixtures in einem Median von 266,4 ms gegenüber 422,6 ms beim alten Parser und parsed flow_parser.js in 1298,0 ms gegenüber 2269,6 ms. Das ist rund 37 % bzw. 43 % schneller und setzt den Trend zu nativen Rust-Frontends fort, den Prettier mit seinen [OXC- und Hermes-Plugins](/articles/2026-06-23--oxlint-v1-71-oxfmt-v0-56) begonnen hat."
  - "Zwei Dinge werden deine Codebase berühren. Erstens hat sich der JavaScript- und TypeScript-Printer geändert (insbesondere im `--no-semi`-Modus, wo Kommentare um `break` und `continue` jetzt über Durchläufe idempotent sind), sodass ein Neuformatieren einen Diff erzeugt. Zweitens wird die veraltete Syntax `import ... assert { type: \"json\" }` entfernt, weil Babel 8 das Parser-Plugin gestrichen hat; migriere zu `import ... with { type: \"json\" }`. Die Version erinnert daran, die genaue Version (`\"prettier\": \"3.9.0\"`, nicht `^3.9.0`) in der package.json festzupinnen."
faq:
  - question: "Was ist neu in Prettier 3.9?"
    answer: "Prettier 3.9.0, veröffentlicht am 27. Juni 2026, ist eine Version mit Parser-Upgrades. Sie hebt den Markdown-Parser von remark-parse v8 auf micromark v4 (bessere CommonMark- und GFM-Konformität), den YAML-Parser auf yaml v2, den GraphQL-Parser auf GraphQL.js v17 (Fragment-Argumente und Direktiven auf Direktivdefinitionen), den Angular-Parser und den Flow-Parser auf den neuen oxidized Rust-basierten Parser des Flow-Teams. Sie überarbeitet außerdem den JavaScript- und TypeScript-Printer (besonders im --no-semi-Modus) und entfernt die veraltete import ... assert {}-Syntax."
  - question: "Warum verwendet Prettier jetzt einen Rust-basierten Flow-Parser?"
    answer: "Prettier 3.9 übernimmt den oxidized (Rust-basierten) Flow-Parser, den das Flow-Team veröffentlicht hat. In Prettiers lokalen Parser-only-Benchmarks formatierte der neue Parser Prettiers gültige Flow-Fixtures in einem Median von 266,4 ms gegenüber 422,6 ms beim alten Parser und parsed flow_parser.js in 1298,0 ms gegenüber 2269,6 ms, also rund 37 % bzw. 43 % schneller. Das ist dieselbe Richtung nativer Rust-Frontends, die Prettier über seine OXC- und Hermes-Plugins erkundet hat, hier angewendet auf Flow-getypten Code."
  - question: "Verändert Prettier 3.9 meine Formatierungsausgabe?"
    answer: "Ja, rechne mit einem Diff. Der JavaScript- und TypeScript-Printer hat sich auf mehrere Arten geändert: Kommentare um break und continue im --no-semi-Modus sind jetzt über mehrere Durchläufe stabil (ein Idempotenz-Fix), redundante Klammern in return werden entfernt, eingebettete Template-Interpolationen werden ausgerichtet und Zeilenumbrüche vermieden, logische Negationen werden in if/while-Bedingungen inlined und nachstehende Doppel-Leerzeichen im JSDoc erhalten. Auch die Markdown-, YAML- und GraphQL-Ausgabe kann sich verschieben, weil deren Parser geändert wurden. Das Team empfiehlt, die genaue Version (\"prettier\": \"3.9.0\") festzupinnen, damit die Formatierung über Installationen hinweg stabil bleibt."
  - question: "Ist die Entfernung von Import-Assertions ein Breaking Change?"
    answer: "Ja, für Code, der noch das alte assert-Schlüsselwort verwendet. Die veraltete Syntax `import foo from \"./foo.json\" assert { type: \"json\" }` wird entfernt, weil Babel 8 das Parser-Plugin gestrichen hat, auf das Prettier angewiesen war. Prettier kann diese Syntax nicht mehr zuverlässig parsen oder formatieren. Die Lösung ist die Migration zum aktuellen Standard: `import foo from \"./foo.json\" with { type: \"json\" }`."
  - question: "Sollte ich die genaue Prettier-Version festpinnen?"
    answer: "Ja, und die 3.9-Release-Notes wiederholen den stehenden Rat. Verwende `\"prettier\": \"3.9.0\"` in der package.json statt `^3.9.0`. Da Prettier ein Formatter ist, wird jede Änderung seiner Ausgabe zu einem Code-Diff, und eine Tilde-/Caret-Range kann ein neues Minor oder Patch ziehen, das bei einer Neuinstallation das gesamte Projekt neu formatiert. Festpinnen hält die Formatierung deterministisch. Wenn du @prettier/plugin-oxc oder @prettier/plugin-hermes nutzt, aktualisiere sie gemeinsam mit Prettier, damit die neuen Formatierungsregeln greifen."
  - question: "Was passiert mit MDX nach dem Markdown-Parser-Upgrade?"
    answer: "Der zentrale Markdown-Parser wird auf micromark v4 gehoben, aber die Migration des MDX-Parsers ist noch nicht abgeschlossen. Die Release-Notes bitten explizit um Hilfe von Mitwirkenden, die mit dem unified-Ökosystem, micromark oder MDX vertraut sind, um die Migration fertigzustellen. Wenn du MDX formatierst, teste deine Ausgabe auf 3.9 und melde Probleme; die verbleibende MDX-Arbeit ist noch offen."
---

[Prettier 3.9.0](https://prettier.io/blog/2026/06/27/3.9.0), veröffentlicht am 27. Juni 2026 in einem 37-minütigen Blogpost von Fisker Cheung, ist ungewöhnlich für ein Prettier-Release: Die Schlagzeile ist keine neue Config-Option und kein schnelleres CLI, sondern fünf Parser-Upgrades, die gleichzeitig landen. Markdown, YAML, GraphQL, Flow und Angular wechseln alle zu neueren Upstream-Parsern, und der JavaScript- und TypeScript-Printer wird überarbeitet, was in den meisten Repos als Diff auftauchen wird. Wer die Prettier-Ausgabe als stabil betrachtet, sollte 3.9 gezielt einführen und die genaue Version festpinnen.

## Fünf Parser, eine Version

Die Markdown-Änderung werden die meisten Nutzer spüren. Prettiers Markdown-Parser wechselt vom veralteten `remark-parse` v8 zu [micromark v4](https://github.com/micromark/micromark), dem modernen CommonMark-Parser. Die Release-Notes beschreiben das als „deutlich verbesserte CommonMark- und GFM-Konformität" plus „zahlreiche lange bestehende Parsing-Bugs" behoben und schafft eine sauberere Grundlage für künftige Arbeit. Ein Vorbehalt: Die Migration des MDX-Parsers ist noch nicht abgeschlossen, und das Team bittet Mitwirkende, die mit dem unified-Ökosystem und micromark vertraut sind, sie abzuschließen.

YAML wechselt zu `yaml` v2, was viele lange bestehende Parsing-Probleme behebt, mit Dank an ota-meshis Arbeit am `yaml-unist-parser`. GraphQL wechselt zu [GraphQL.js](https://github.com/graphql/graphql-js) v17, das neuere Syntax unterstützt: Fragment-Argumente (`...dynamicProfilePic(size: $size)`) und Direktiven auf Direktivdefinitionen sowie `extend directive`, die beide auf 3.8 einen Fehler oder falsches Parsing verursachten.

Das Flow-Upgrade ist die Performance-Geschichte. Prettier verwendet jetzt den neuen (oxidized) Rust-basierten Flow-Parser des Flow-Teams. In Prettiers lokalen Parser-only-Benchmarks formatierte der neue Parser Prettiers gültige Flow-Fixtures in einem **Median von 266,4 ms gegenüber 422,6 ms** beim alten Parser und parsed `flow_parser.js` in **1298,0 ms gegenüber 2269,6 ms**. Das ist rund 37 % bzw. 43 % schneller und ist dieselbe Richtung nativer Rust-Frontends, die das Projekt über seine [OXC- und Hermes-Plugins](/articles/2026-06-23--oxlint-v1-71-oxfmt-v0-56) erkundet hat und die das breitere Ökosystem mit [Oxc](/articles/2026-06-22--oxc-v0-137-react-compiler-treeshake-perf) und [SWC](/articles/2026-06-23--swc-v1-15-43-react-compiler-template-literal-bug) einschlägt.

## Der JavaScript- und TypeScript-Printer hat sich geändert

Die Parser-Upgrades sind die Hälfte der Version; die andere Hälfte ist eine Reihe von Printer-Änderungen, die einen Diff erzeugen. Die auffälligste ist ein lange bestehender Idempotenz-Bug im `--no-semi`-Modus. Auf 3.8 erzeugte ein `break` oder `continue` gefolgt von einem Zeilenkommentar unterschiedliche Ausgabe beim ersten und zweiten Durchlauf, sodass zweimaliges Ausführen von Prettier die Datei immer wieder verändern konnte. Auf 3.9 ist die Kommentarbehandlung um `break` und `continue` über Durchläufe hinweg stabil.

Eine kurze Liste der weiteren Printer-Änderungen:

- **Redundante Klammern entfernt** in `return`-Anweisungen, sodass `return (a, b)` nicht mehr zu `return ((a, b))` umgeschrieben wird.
- **Eingebettete Template-Interpolationen neu ausgerichtet** in getaggten Templates, unerwartete Zeilenumbrüche werden vermieden und die Ausrichtung in CSS-in-Template-Literal-Blöcken korrigiert.
- **Inlining logischer Negationen**: `!(...)` in `if`/`while`/`do..while`-Bedingungen wird inlined, um den Diff zu reduzieren, wenn eine Bedingung in ihren negierten Wert kippt; das behebt einen realen Doppel-Klammer-Fall innerhalb des Prettier-Codebasen selbst.
- **Nachstehende Doppel-Leerzeichen im JSDoc erhalten**, weil manche Tools sie als bedeutsam behandeln.
- **Kommentar-Platzierung** um leere Aufruf-Argumentlisten und geklammerte Callees korrigiert.

Nichts davon ist eine Config-Änderung, aber zusammen bedeuten sie, dass ein `prettier --write .` nach dem Upgrade Dateien neu formatiert.

## Der echte Breaking Change: Import-Assertions

Die Version entfernt die Unterstützung für die veraltete `import ... assert {}`-Syntax:

```diff
- import foo from "./foo.json" assert { type: "json" };
+ import foo from "./foo.json" with { type: "json" };
```

Der Grund liegt upstream: Babel 8 hat die Unterstützung für das veraltete `assert`-Schlüsselwort komplett entfernt (das alte Parser-Plugin ist weg), und ohne Babel-Parser-Support kann Prettier diese Syntax nicht mehr zuverlässig parsen oder formatieren. Der aktuelle Standard ist das `with`-Schlüsselwort aus dem Import-Attributes-Proposal. Wer noch `assert` verwendet, sollte vor dem Upgrade migrieren; Prettier verweist auf seinen Hinweis zu nicht standardmäßiger Syntax als Kontext.

## CLI-Fixes, die man kennen sollte

Einige CLI-Fixes runden die Version ab. `--cache-strategy content` war stillschweigend defekt: `file-entry-cache` v11 benannte die Option `useChecksum` in `useCheckSum` (großes S) um, und Prettier übergab noch die alte Schreibweise, sodass der inhaltsbasierte Cache-Vergleich deaktiviert war und nur die Dateigröße verglichen wurde. Das ist nun behoben, sodass inhaltsbasiertes Caching wieder funktioniert.

Prettier sucht außerdem nicht mehr nach EditorConfig-Dateien oberhalb von Git-Worktrees: Eine `.git`-Datei (genutzt in Worktrees und Submodulen) wird jetzt als Projekt-Root-Marker behandelt, ebenso wie ein `.git`-Verzeichnis, sodass eine EditorConfig aus einem übergeordneten Verzeichnis nicht mehr in die Worktree-Formatierung einsickert. Zwei Crash-Fixes behandeln Verzeichnis- und Dateinamen mit Sonderzeichen (eckige Klammern wie `username[repo-name]` und führende Anführungszeichen), und die experimentelle CLI erhält Updates.

## Was man beobachten sollte

Der praktische Rat ist einfach: Pinnen Sie die genaue Version fest. Die Release-Notes wiederholen die stehende Empfehlung, `"prettier": "3.9.0"` statt `^3.9.0` zu verwenden, weil die Markdown-, YAML-, GraphQL- und JS/TS-Änderungen alle Ausgabe-Diffs erzeugen und eine Caret-Range ein neues Minor ziehen kann, das bei einer Neuinstallation ein ganzes Projekt neu formatiert. Wer `@prettier/plugin-oxc` oder `@prettier/plugin-hermes` nutzt, sollte sie zeitgleich aktualisieren, damit die neuen Formatierungsregeln greifen.

Zwei Dinge vor dem Upgrade testen: jegliche Markdown- oder MDX-Dokumentation (der micromark-Wechsel ist die breiteste Änderung) und jeglichen Flow- oder GraphQL-lastigen Code. Die MDX-Migration ist noch offen, sodass insbesondere die MDX-Ausgabe einen sorgfältigen Diff verdient. Das vollständige Changelog steht in der [Compare-Ansicht](https://github.com/prettier/prettier/compare/3.8.5...3.9.0), und 3.9.1 folgte am selben Tag mit Nachbesserungen.
