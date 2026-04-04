---
title: "TanStack DB 0.6 macht den Client zur lokalen Datenbank"
description: "SQLite-Persistenz auf allen Runtimes, hierarchische Datenprojektionen und reaktive Agent-Workflows — v0.6 ist das Release, das TanStack DB zu einer vollständigen Anwendung datenebene macht."
date: "2026-04-04"
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "database", "local-first", "sqlite", "tanstack"]
---

TanStack DB, die transaktionale Client-seitige Datenbank vom Team hinter React Query und Router, hat letzte Woche Version 0.6 veröffentlicht. Die Hauptfunktionen — SQLite-Persistenz, hierarchische Datenprojektionen und reaktive Agent-Workflows — sind keine inkrementellen Ergänzungen. Es sind die fehlenden Teile, die das gesamte System für echte Anwendungen praktisch machen.

## Das fehlende Teil: Persistenz

TanStack DB hatte bereits eine ausgefeilte Query-Engine, granulare Reaktivität, optimistische Updates und eine Offline-Transaktions-API. Was ihr fehlte, war Dauerhaftigkeit — die Fähigkeit, Daten auch nach dem Schließen der App zu behalten.

Das ändert sich mit 0.6. Die Persistenzschicht basiert auf SQLite und funktioniert über eine breite Palette von Runtimes: Browser (via SQLite WASM), React Native, Expo, Node, Electron, Tauri, Capacitor und Cloudflare Durable Objects.

Die wichtige Designentscheidung ist pragmatisch: Anstatt eine neue Speicherabstraktion zu erfinden, dient SQLite als Persistenz-Backend. Das bedeutet, TanStack DB bekommt große Datensatzbehandlung, Multi-Tab-Support, Schema-Evolution und Cross-Runtime-Kompatibilität geschenkt. Sobald lokaler Zustand dauerhaft ist, kann der gesamte Stack — Query-Engine, optimistische Updates, Offline-Transaktionen — als vollständig local-first-System funktionieren, statt nur während die App offen ist lokal zu wirken.

PowerSync und Trailbase unterstützen bereits inkrementelle Sync mit dieser neuen Persistenzschicht, aufbauend auf dem Query-Collections-Sync-Modell, das in v0.5 eingeführt wurde.

## Includes: Hierarchische Daten ohne GraphQL

Die `includes`-Funktion löst ein Problem, das in der UI-Entwicklung ständig auftritt: Eure Daten sind in der Datenbank normalisiert, aber eure UI-Komponenten erwarten eine verschachtelte Form.

Die klassische Lösung ist GraphQL, mit Resolvern und einer separaten Infrastrukturschicht. TanStack DBs `includes` projiziert normalisierte Daten in die hierarchische Struktur, die eure UI braucht — dasselbe Ergebnis, ohne zusätzliches Backend.

## createEffect: Reaktive Nebenwirkungen für Agents

Eine neue `createEffect`-Funktion ermöglicht es, reaktive Nebenwirkungen direkt von Live-Queries auszulösen. Dies richtet sich an Agent-ähnliche Automatisierungs-Workflows, bei denen ihr programmatisch auf Datenänderungen reagieren müsst, sie nicht nur rendern.

Virtual Props (`$synced`, `$origin`) ergänzen dies, indem sie Metadaten auf Zeilenebene verfolgen — Outbox-Ansichten, Sync-Status und Datenherkunft werden zu Fragen der ersten Klasse in Queries.

## queryOnce und andere Ergonomie

`queryOnce` bietet einmalige Queries mit derselben Abfragesprache wie Live-Queries. Zuvor wichen die beiden Modelle voneinander ab; jetzt sind sie vereinheitlicht.

Indizes sind jetzt optional, und Mutations-Handler verlassen sich nicht mehr auf implizites Rückgabeverhalten. Beides sind Breaking Changes beim Upgrade, aber sie machen die API vorhersehbarer.

## Richtung v1

Das Team sucht SSR-Designpartner (Server-Side Rendering), während sie auf v1 hinarbeiten. Wenn ihr TanStack DB beobachtet und darauf gewartet habt, dass es produktionsreif wird, ist dieses Release das stärkste Signal, dass die Teile zusammenkommen.

tldr[]
- TanStack DB 0.6 fügt SQLite-Persistenz über Browser, React Native, Node, Electron, Tauri und mehr hinzu — macht Local-First-Apps tatsächlich dauerhaft
- Die neue `includes`-API projiziert normalisierte Daten in hierarchische UI-Formen, ohne eine GraphQL-Schicht zu erfordern
- `createEffect` und Virtual Props (`$synced`, `$origin`) ermöglichen reaktive Agent-Workflows und Outbox-ähnliche Sync-UI-Patterns

faq[]
- **Ist das produktionsreif?** Es ist noch vor v1, aber das Feature-Set und die Unterstützung durch TanStack (React-Query-Maintainer) machen eine Evaluierung für nicht-kritische Apps jetzt schon sinnvoll.
- **Wie vergleicht es sich mit Dexie.js oder WatermelonDB?** TanStack DB ist Query-Engine-first mit granularer Reaktivität und eingebautem Sync-Modell; Dexie ist mehr auf IndexedDB-Ergonomie ausgerichtet und WatermelonDB eher ORM-orientiert.
- **Funktioniert das mit SSR?** Das Team arbeitet aktiv an SSR-Support und sucht Designpartner.
