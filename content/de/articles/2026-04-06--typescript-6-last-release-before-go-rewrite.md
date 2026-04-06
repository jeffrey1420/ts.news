---
title: "TypeScript 6.0 – Die Letzte Version Vor dem Go-Umschreiben"
description: "TypeScript 6.0 ist da — und das Microsoft-Team ist offen: Es ist eine Übergangsversion. Die eigentliche Geschichte kommt als nächstes: TypeScript 7, geschrieben in Go und bereits als Preview verfügbar, verspricht einen 10-fachen Performancegewinn."
date: "2026-04-06"
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "javascript", "microsoft", "compiler", "performance"]
---

TypeScript 6.0 erschien am 23. März 2026, und das Microsoft-Team macht kein Geheimnis daraus: Es ist eine Übergangsversion. TypeScript 6.0 bereitet den Weg für TypeScript 7 — eine grundlegende Neuschreibung des Compilers und der Language Services in Go, mit einem bereits verifizierten 10-fachen Performancegewinn in den Preview-Builds.

## Was sich wirklich in 6.0 geändert hat

Die meisten Änderungen dienen der Angleichung an TypeScript 7, aber mehrere konkrete Verbesserungen haben es in diese Version geschafft.

**Weniger Kontextsensibilität bei `this`-losen Funktionen.** TypeScript 6.0 behebt eine langjährige Inferenzlücke bei Methoden und Callbacks, die `this` nicht verwenden. Zuvor konnte eine Methode wie `consume(y) { return y.toFixed(); }` innerhalb eines generischen Aufrufs scheitern, wenn eine andere Eigenschaft zuerst kam — weil TypeScript annahm, dass `this` den generischen Typ benötigen könnte. Jetzt, wenn `this` nie verwendet wird, überspringt TypeScript die kontextuelle Sensitivitätsprüfung und die Inferenz funktioniert unabhängig von der Eigenschaftsreihenfolge korrekt. Diese Änderung wurde von Mateusz Burzyński beigesteuert.

**Subpath-Imports unterstützen jetzt `#/`-Präfixe.** Node.js hat die Unterstützung für `#/` als nacktes Subpath-Import-Präfix hinzugefügt (statt `#root/` oder ähnliches). TypeScript 6.0 unterstützt dies unter `--moduleResolution nodenext` und `bundler`. Keine umständlichen Workarounds mehr für saubere interne Imports.

**`--moduleResolution bundler` + `--module commonjs` ist jetzt gültig.** Zuvor wurde diese Kombination abgelehnt. Mit der Deprecation von `--moduleResolution node` ist die Kombination `bundler` + `commonjs` nun der empfohlene Migrationspfad für viele Projekte.

**Flag `--stableTypeOrdering`.** TypeScript 7 verwendet parallele Typprüfung, was bedeutet, dass interne Typ-IDs je nach Verarbeitungsreihenfolge unterschiedlich zugewiesen werden. Dies kann dazu führen, dass Deklarationsdateien zwischen 6.0 und 7.0 abweichen. Das neue Flag erzwingt eine deterministische Sortierung in 6.0, um Unterschiede während der Migration leichter zu erkennen. Hinweis: Es kann bis zu 25% Verlangsamung hinzufügen, also ein Migrationswerkzeug, keine dauerhafte Einstellung.

**`es2025` target und lib.** TypeScript 6.0 fügt `es2025` als gültige Option für target und lib hinzu, einschließlich neuer Typen für `RegExp.escape`.

**Import-Assertion-Syntax in `import()`-Aufrufen deprecated.** Die Syntax `import(..., { assert: {...}})` ist jetzt deprecated, ebenso wie die statische Form `import ... assert {...}`.

## Die eigentliche Überschrift: TypeScript 7 ist nah

TypeScript 6.0 existiert hauptsächlich, um das Ökosystem auf 7.0 vorzubereiten. Das Go-Rewrite — Codename "Project Corsa" — läuft seit Anfang 2025. Die native Preview (`@typescript/native-preview` auf npm) ist bereits stabil genug für den täglichen Gebrauch, und eine VS Code-Erweiterung wird jede Nacht aktualisiert.

Der Language Service (Completions, Go-to-Definition, Rename, Find-All-References) ist im nativen Port bereits vollständig funktionsfähig. Die Typprüfung des Compilers wird als "so gut wie vollständig" beschrieben — von 20.000 Testfällen zeigen nur 74 Unterschiede zwischen 6.0 und der 7.0-Preview. Parallelität über Shared Memory ist der architektonische Hauptnutzen, der dramatische Geschwindigkeitsgewinne bei großen Monorepos ermöglicht.

Wenn Sie heute TypeScript 6.0 verwenden, ermutigt Sie das Team, auch die TypeScript-7-Preview auszuprobieren. Beide können parallel über `tsgo` (7.0) und `tsc` (6.0) laufen.

## FAQ

**Ist TypeScript 6.0 ein Breaking Change?**
Nicht wesentlich. Die meisten Änderungen sind additiv oder Verhaltensangleichungen an 7.0. Das `--stableTypeOrdering`-Flag ist neu, und die Deprecation der Import-Assertion ist eine Warnstufenänderung.

**Sollte ich von 5.x auf 6.0 upgraden?**
Ja, besonders wenn Sie sich auf den nativen Port 7.0 vorbereiten. Der Migrationspfad von 6.0 zu 7.0 soll reibungslos sein.

**Wie teste ich TypeScript 7?**
```bash
npm install -D @typescript/native-preview
# tsgo statt tsc verwenden
npx tsgo build
```
Oder installieren Sie die VS Code-Erweiterung "TypeScript 7 (native preview)" aus dem Marketplace.
