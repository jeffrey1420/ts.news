---
title: "Turborepo v2.9.16: Heap-Allocation-Profiling und pnpm-Fixes"
description: "Turborepos neueste Stable-Releases fügen Heap-Allocation-Profiling über OpenTelemetry, Korrekturen für pnpm-injizierte Peer-Dependencies, gehärtete OTEL-Endpoint-Validierung und PTY-Shutdown-Fixes hinzu."
date: 2026-06-02
image: "/images/heroes/2026-06-02--turborepo-v2-9-16-heap-allocation-profiling-pnpm-fixes.png"
author: lschvn
tags: ["tooling", "typescript", "javascript"]
tldr:
  - Turborepo v2.9.16 integriert Heap-Allocation-Profiling in OpenTelemetry-Traces, mit Sichtbarkeit in den Speicherverbrauch pro Task und Package
  - pnpm-Workspaces mit injizierten Peer-Dependencies funktionieren jetzt korrekt — Turborepo verwirft diese Einträge nicht mehr
  - Die OTEL-Endpoint-Validierung ist gehärtet, und npm tlog-Publishing-Fehler werden jetzt automatisch wiederholt
---

<!-- more -->

## Heap Allocation Profiling

Die wichtigste neue Funktion in v2.9.16 ist der **Heap-Allocation-Profiling-Support** über OpenTelemetry. Dieses Release fügt Heap-Daten zu Turborepos bestehender OTEL-Trace-Ausgabe hinzu, sodass Sie den Speicherverbrauch pro Task und Package sehen können.

Um es zu nutzen, zeigen Sie mit `TURBO_TRACE_ENDPOINT` auf Ihren OTEL-Collector — Heap-Daten erscheinen jetzt neben den vorhandenen Duration- und Span-Informationen.

## pnpm Injected Peer Fix

v2.9.15 hatte eine Regression bei der Handhabung von **pnpm-injizierten Peer-Packages** eingeführt. v2.9.16 behebt dies. Monorepos mit pnpm und injizierten Peers funktionieren jetzt korrekt.

## Gehärtete OTEL-Endpoint-Validierung

Turborepo v2.9.16 härtet auch die **OTEL-Endpoint-URL-Validierung**. Fehlerhafte URLs führen jetzt zu einer klaren Fehlermeldung statt zu stillen Abstürzen.

## PTY-Shutdown und npm tlog Fixes

- **PTY-Shutdown-Hang** — auf bestimmten Linux-Distributionen konnte der Pseudo-Terminal beim Herunterfahren hängen bleiben. Behoben.
- **npm tlog Retry** —transiente Netzwerkfehler beim npm-Publishing werden jetzt automatisch wiederholt.

## Update

```bash
npm install -g turbo@latest
```

Turborepo v2.9.16 ist das aktuelle Stable Release.
