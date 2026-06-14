---
title: "Node.js 26.3.0: Buffer-Pool verdoppelt, permission.drop() Methode,macOS Intel-Binary vor dem Aus"
description: "Node.js 26.3.0 bringt einen standardmäßigen Buffer.poolSize von 64 KiB, die neue Methode permission.drop() zur feingranularen Abgabe von Berechtigungen, eine Warnung zu macOS Universal-Binaries und gehärtetes WebCrypto. npm wird auf 11.16.0 aktualisiert."
date: 2026-06-03
image: "/images/heroes/2026-06-03--node-js-26-3-0-buffer-pool-permission-drop.png"
author: lschvn
tags: ["security", "runtimes", "typescript"]
tldr:
  - Buffer.poolSize Standardwert steigt von 32 auf 64 KiB, was Allocator-Contention bei HTTP- und I/O-intensiven Workloads reduziert
  - permission.drop() erlaubt laufenden Prozessen, einzelne Berechtigungen Schritt für Schritt abzugeben, ohne den Prozess zu beenden
  - Das macOS Universal Binary (Intel + Apple Silicon) wird möglicherweise nicht mehr für die gesamte Lebensdauer von Node.js 26 gepflegt
  - WebCrypto wird gegen Prototype Pollution gehärtet und erhält einen CryptoJob-Modus; npm aktualisiert auf 11.16.0
faq:
  - question: "Warum beeinflusst Buffer.poolSize die Anwendungsleistung?"
    answer: "Node verwendet intern einen Slab-Allocator. Ein größerer Pool bedeutet, dass weniger kleine Allokationen direkt aus dem Heap bedient werden, was Fragmentierung und Syscall-Overhead reduziert. Die Verdopplung des Standardwerts von 32 auf 64 KiB hilft den meisten HTTP-Servern und Streaming-Pipelines ohne manuelle Konfiguration."
  - question: "Wie unterscheidet sich permission.drop() vom bestehenden Berechtigungsmodell?"
    answer: "Bisher waren Node.js-Berechtigungen beim Start all-oder-nichts. permission.drop() erlaubt laufendem Code, einzelne Berechtigungshandles abzugeben: Dateisystem, Umgebung, Kindprozess, während andere erhalten bleiben. Dies ermöglicht progressive Privilegienreduzierung, z.B. fs-Zugriff nach einer Initialisierungsphase abzugeben."
  - question: "Kann mein Intel-Mac weiterhin Node.js 26 ausführen?"
    answer: "Ja. Node.js 26 wird vorerst weiter Universal-Binaries ausliefern. Die Warnung signalisiert, dass das Node.js-Projekt die Intel-Builds möglicherweise entfernt, bevor Node.js 26 EOL erreicht, falls Apple die x86-Toolchain-Unterstützung weiter einstellt. Apple Silicon (arm64) ist jetzt Tier 1; Intel ist Tier 2."
---

Node.js 26.3.0 wurde am 1. Juni 2026 auf der Current-Release-Linie veröffentlicht. Es ist ein umfangreiches Mid-Cycle-Update: der Buffer-Allocator erhält eine bedeutende Abstimmung, das experimentelle Berechtigungssystem bekommt das am häufigsten angefragte Feature, Apple signalisiert einen weiteren Schritt zum Aus für Intel-Macs, und das Crypto-Team landet mehre PRs zur WebCrypto-Härtung.

## Buffer.poolSize verdoppelt auf 64 KiB

Die wichtigste Runtime-Änderung ist die Erhöhung des Standard-`Buffer.poolSize` von 32 auf 64 KiB, beigetragen von Matteo Collina ([#63597](https://github.com/nodejs/node/pull/63597)). Nodes interner Slab-Allocator verwendet diesen Pool für `Buffer.allocUnsafe()` und `Buffer.from()`-Aufrufe, die unter dem Schwellenwert liegen. Ein größerer Slab reduziert die Häufigkeit, mit der der Allocator neue Speicherseiten vom OS anfordern muss, was Fragmentierung verringert und den Durchsatz für HTTP-Server, Streaming-Pipelines und jeden Code verbessert, der viele kleine bis mittlere Buffers alloziert.

Die Änderung ist nicht Breaking, sie betrifft nur den Standardwert. Anwendungen können `Buffer.poolSize` weiterhin manuell konfigurieren. Aber wenn Sie Benchmarks ausführen, die den Allocator selbst messen, ist jetzt ein guter Zeitpunkt, diese erneut auszuführen.

## permission.drop() für feingranulare Privilegienabgabe

Rafael Gonzaga steuerte `permission.drop()` ([#62672](https://github.com/nodejs/node/pull/62672)) bei, die meistgefragte Ergänzung zum experimentellen Berechtigungssystem von Node.js. Das bestehende Modell gewährte Fähigkeiten beim Start und hielt sie für die gesamte Prozesslebensdauer. `permission.drop()` erlaubt laufendem Code, einzelne Berechtigungshandles, Dateisystem, Umgebung, Kindprozess, abzugeben, ohne den Prozess zu beenden. Dies ermöglicht Patterns wie:

```javascript
// Nach der Initialisierung, fs-Zugriff abgeben
permission.drop('fs');
// Nur Netzwerkzugriff bleibt übrig
```

Die Änderung bringt Node.js näher an kapazitätsbasierte Sicherheitsmodelle und reduziert die Blast-Radius von Supply-Chain- oder Injection-Angriffen, bei denen ein kompromittiertes Modul nach Abschluss der Initialisierung seinen Dateisystemzugriff verliert.

## Warnung zum macOS Universal Binary

Antoine du Hamels PR [#63055](https://github.com/nodejs/node/pull/63055) dokumentiert formal, was das Projekt informell angedeutet hat: das macOS Universal Binary, das sowohl Intel- (x64) als auch Apple-Silicon- (arm64) Slices in einer einzigen Binärdatei bündelt, ist möglicherweise nicht für die gesamte Lebensdauer von Node.js 26 wartbar. Apple hat die Intel-Toolchain-Unterstützung schrittweise eingestellt, und die Node.js-Build-Infrastruktur stößt auf Reibung bei der Pflege des x64-Slice. Intel-basierte Macs bleiben Tier 2; arm64 ist Tier 1. Dies ist eine Warnung, keine unmittelbare Entfernung.

## WebCrypto-Härtung und npm 11.16.0

Filip Skokan leitete einen Multi-PR-Effort zur WebCrypto-Härtung ([#63363](https://github.com/nodejs/node/pull/63363)). Die Änderungen umfassen:

- WebCrypto-Methoden verwenden intern keine `async`-Wrapper mehr, was den Overhead reduziert
- CryptoKey-Handles werden direkt an KDF-Jobs übergeben, anstatt serialisiert und deserialisiert zu werden
- Ein neuer CryptoJob-Modus bringt Nodes WebCrypto-Implementierung in Einklang mit der Spec und verbessert die Leistung
- Die Implementierung ist gegen Prototype-Pollution-Angriffe gehärtet, die auf `CryptoKey`-Eigenschaftsdefinitionen abzielen

npm wird auf 11.16.0 aktualisiert ([#63602](https://github.com/nodejs/node/pull/63602)), was Verbesserungen am Abhängigkeitsbaum und eine schnellere Auflösung enthält. Das mit Node gebündelte SQLite wird mit einem Cherry-Pick aktualisiert, das ein Speicherkorruptionsrisiko behebt ([#63525](https://github.com/nodejs/node/pull/63525)).

Das `http`-Modul erhält eine `httpValidation`-Option ([#61597](https://github.com/nodejs/node/pull/61597)), die es Servern ermöglicht zu konfigurieren, wie streng eingehende Header-Werte validiert werden, mit permissivem Standardverhalten. Das Inspector-API erhält auch ein `preciseCoverageStart`-Flag ([#63079](https://github.com/nodejs/node/pull/63079)) für präzisere Code-Coverage-Instrumentierung.

Node.js 26.3.0 ist die Current- (nicht LTS-) Linie. Der LTS-Übergang für Node.js 26 wird mit Node.js 26.9.0 im September 2026 erwartet.
