---
title: "Stand von TypeScript 2026: GitHubs #1-Sprache, Project Corsa und die Supply-Chain-Rechnung"
description: "Ein Rückblick auf die großen Ereignisse, die TypeScripts Position im JavaScript-Ökosystem neu geformt haben — vom Überholen auf GitHub bis zum Go-basierten Compiler-Rewrite mit 10x schnelleren Builds."
image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop"
date: "2026-04-09"
category: Ecosystem
author: lschvn
readingTime: 6
tags: ["TypeScript", "GitHub", "Project Corsa", "npm", "Sicherheit", "Ökosystem", "Go", "Node.js"]
tldr:
  - "TypeScript wurde im August 2025 mit 2,6 Millionen monatlichen Contributoren zur #1-Sprache auf GitHub — ein Anstieg von 66% im Jahresvergleich — und von GitHub als bedeutendste Sprachverschiebung seit über einem Jahrzehnt bezeichnet."
  - "Microsofts Project Corsa, ein nativer Port des TypeScript-Compilers nach Go, zeigte in frühen Benchmarks 10x schnellere Builds und zielt auf TypeScript 7.0 als erste Go-basierte Version."
  - "Das npm-Ökosystem sah koordinierte Supply-Chain-Angriffe (s1ngularity, debug/chalk, Shai-Hulud) und die React2Shell-CVSS-10.0-Schwachstelle, was eine Sicherheitsüberprüfung in der JS-Welt erzwang."
  - "Node.js 22.18 stabilisierte die native TypeScript-Ausführung via Type Stripping und ermöglicht direkte .ts-Dateiausführung ohne Transpilation — ein Meilenstein, der TypeScript grundlegend in löschbare Syntax und Runtime-Syntax aufteilt."
faq:
  - q: "Was ist Project Corsa?"
    a: "Project Corsa ist Microsofts nativer Port des TypeScript-Compilers und Sprachdienstes von JavaScript nach Go. Erste Benchmarks zeigten, dass der VS-Code-Codebase in 7,5 statt 77,8 Sekunden kompilierte. TypeScript 6.0 ist die letzte Version auf dem alten Codebase; TypeScript 7.0 (Mitte 2026 erwartet) soll die erste Go-basierte Version sein."
  - q: "Was waren die npm-Supply-Chain-Vorfälle 2025?"
    a: "Drei große Vorfälle: s1ngularity, die Kompromittierung der Pakete debug und chalk, und die Shai-Hulud-Kampagne. Die CISA warnte im September 2025 davor. Das gemeinsame Muster war automatisierte Ausnutzung von Wartende-Authentifizierungslücken und CI-Workflow-Schwachstellen."
  - q: "Was bedeutet Type Stripping für Node.js?"
    a: "Type Stripping ist eine Node.js-Funktion, die die direkte Ausführung von TypeScript-Dateien ohne Transpilation ermöglicht. Node.js überspringt Typsyntax zur Laufzeit (Typen sind löschbar), führt aber Runtime-Syntax wie Enums und Namespaces direkt aus. Node.js 22.18 stabilisierte dies Ende 2025, vollständig stabil in v25.2.0."
  - q: "Was ist React2Shell (CVE-2025-55182)?"
    a: "Eine kritische Remotecode-Ausführungsschwachstelle in React Server Components mit einem CVSS-Score von 10.0 — der höchsten Schweregrad. Sie wurde in Next.js-Anwendungen gefunden, die RSC nutzen, und zwang zu einer breiten Neubewertung der Sicherheitsmodelle für Full-Stack-JavaScript."
---

2025 war das Jahr, in dem TypeScript aufhörte, eine beliebte Alternative zu sein, und zur Standardsprache des JavaScript-Ökosystems wurde. Diese Vorherrschaft brachte neuen Druck mit sich: Compiler-Leistungsengpässe, Supply-Chain-Prüfungen und Sicherheitsschwachstellen, die an der Schnittstelle von Typen und Runtime leben.

## TypeScript wird GitHubs #1-Sprache

Im August 2025 meldete GitHub, dass TypeScript mit 2.636.006 monatlichen Contributoren zur meistgenutzten Sprache auf der Plattform geworden war — ein Anstieg von 66% im Jahresvergleich. GitHub nannte dies die bedeutendste Sprachverschiebung seit über einem Jahrzehnt. JavaScript führt noch bei der Repository-Anzahl, aber die Richtung ist klar: Neue Projekte setzen zunehmend standardmäßig auf TypeScript, und das Tooling-Ökosystem ist gefolgt.

## Project Corsa: Der Go-Rewrite kommt

Microsoft kündigte Project Corsa Anfang 2025 an: einen nativen Port des TypeScript-Compilers und Sprachdienstes nach Go. Das Ziel sind etwa 10x schnellere Builds und nahezu instante inkrementelle Kompilierung. Erste Benchmarks waren eindrucksvoll — die VS-Code-Codebase fiel von 77,8 Sekunden auf 7,5 Sekunden; Playwright von 11,1 auf 1,1 Sekunden.

TypeScript 6.0, erschienen im Q1 2026, ist als letzte Major-Version auf dem aktuellen JavaScript-basierten Codebase geplant. TypeScript 7.0 (Mitte 2026 erwartet) soll die erste Version sein, die auf dem Go-basierten Compiler aufbaut. Plugin-Autoren, die die Compiler-API nutzen, müssen die Kompatibilität mit der neuen Implementierung prüfen.

## Native TypeScript-Ausführung in Node.js

Node.js 22.18 stabilisierte die native TypeScript-Ausführung via Type Stripping. Anstatt .ts vor der Ausführung nach .js zu transpilieren, versteht Node.js nun, welche TypeScript-Syntax löschbar ist (Typen, Interfaces) und welche Runtime ist (Enums, Namespaces), und führt letztere direkt aus. Das Flag `--erasableSyntaxOnly` formalisiert diese Einschränkung.

Für viele Projekte entfällt damit der Bedarf an `ts-node` und `tsx` als Dev-Abhängigkeiten. Für typbewusste Bibliotheken bedeutet das, Patterns wie Enum-Nutzung zugunsten von `as const`-Objekten und ES-Modulen zu überdenken.

## Die Supply-Chain-Rechnung

Drei koordinierte Vorfälle stachen 2025 heraus:

**s1ngularity**: Eine automatisierte Kampagne, die mehrere weit verbreitete Pakete kompromittierte, indem sie Wartende-Authentifizierungslücken ausnutzte.

**debug/chalk**: Zwei fundamentale Pakete — in praktisch jedem JavaScript-Projekt verwendet — wurden durch Übernahmen von Wartende-Konten kompromittiert. Die Reichweite war enorm.

**Shai-Hulud**: Eine von der CISA dokumentierte Kampagne gegen das npm-Ökosystem im September 2025, die CI-Workflow-Schwachstellen nutzte, um bösartige Versionen unter legitimen Paketnamen zu veröffentlichen.

Die Reaktion war systemisch: npm erzwingt nun umfassender Zwei-Faktor-Authentifizierung bei der Veröffentlichung, die Community drängt auf granulare kurzlebige Tokens, und Organisationen überprüfen ihre Abhängigkeitsbäume mit neuer Dringlichkeit.

## React2Shell: Der CVSS-10.0-Weckruf

Next.js-Anwendungen, die React Server Components nutzten, erwiesen sich als verwundbar durch CVE-2025-55182, eine Remotecode-Ausführungsschwachstelle mit einem CVSS-Score von 10.0. Der Fehler lag in der Serialisierungsbehandlung von serverseitigen Daten in RSC — eine Klasse von Schwachstellen, die theoretisch verstanden, aber nie in diesem Schweregrad weaponisiert worden war.

Der Patch erschien im Dezember 2025, aber der Vorfall veränderte die Art, wie die Community über die Grenze zwischen Server und Client in Reacts Komponentenmodell denkt. Full-Stack-JavaScript-Frameworks stehen nun unter stärkerer Beobachtung durch Sicherheitsforscher.

## Ausblick: TypeScript 7 und die strenge Zukunft

Der State-of-TypeScript-2026-Bericht beschreibt eine Roadmap für 2026, die von Migration dominiert wird. TypeScript 7 ist nicht nur ein Leistungsupgrade — es bringt breaking Changes. Der `strict`-Modus wird standardmäßig aktiviert, ES5-Targeting wird fallengelassen (nur ES2015+), `baseUrl` wird entfernt, und die klassische Node-Modulauflösung verschwindet.

Die Dominanz von TypeScript steht außer Frage. Was noch zu sehen bleibt, ist, wie das Ökosystem die damit einhergehende Komplexität bewältigt.
