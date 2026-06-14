---
title: "Nitro v3.0.260522-beta: Build-Time Tracing-Wrapper, VFS-Performance-Boost, Vercel Queues Lokal"
description: "Das Nitro v3 Beta vom 22. Mai bringt automatische Tracing-Span-Wrapper für Route-Handler zur Build-Zeit, einen VFS-Cache für dynamischen Nitro-App-Code und Vercel-Queue-Support im lokalen Development, zusammen mit den Sicherheitspatches der vorherigen Beta."
date: 2026-06-03
image: "/images/heroes/2026-06-03--nitro-v3-0-260522-beta-tracing-vfs-vercel-queues.png"
author: lschvn
tags: ["frameworks", "typescript", "performance"]
tldr:
  - Nitro umschließt jetzt jeden Route-Handler zur Build-Zeit mit Tracing-Spans und bietet so Request-Span-Observability ohne OpenTelemetry-SDK-Einrichtung
  - Der VFS-Cache für dynamischen Nitro-App-Code verkürzt Dev-Server-Restarts erheblich, da die vollständige Neuauswertung des Modulgraphen entfällt
  - Das Vercel-Preset stellt Queues jetzt lokal über vercel dev bereit, sodass Entwickler Queue-Handler vor dem Deployment debuggen können
  - Zwei Sicherheitspatches schließen eine Proxy-Request-Smuggling- und eine Open-Redirect-Schwachstelle (GHSA-5w89-w975-hf9q, GHSA-9phm-9p8f-hw5m)
faq:
  - question: "Wie unterscheidet sich Build-Time-Tracing von der bestehenden OpenTelemetry-Integration?"
    answer: "Nitros Tracing-Kanäle werden auf der Framework-Ebene emittiert. Spans für Route-Handling, Cache-Operationen und Datenbankabfragen werden direkt in Nitros internem Router generiert. Das bedeutet, dass Spans Framework-spezifischen Kontext (Routenname, Handler-Dauer, Cache Treffer/Fehlschläge) enthalten, den generisches OpenTelemetry-Middleware nicht liefern kann, ohne benutzerdefinierte Instrumentierung."
  - question: "Was ist der VFS-Dynamic-Code-Cache und wem hilft er?"
    answer: "Der VFS-Cache speichert den aufgelösten Zustand von Nitros internem Registry und Router. Bei nachfolgenden Dev-Server-Restarts lädt Nitro diesen Snapshot, anstatt jeden Route-Handler und jeden Modul-Import neu auszuwerten. Bei großen Anwendungen mit vielen Routes oder teuren Dynamic Imports spart dies Sekunden bei jedem Restart."
  - question: "Wie funktionieren Vercel Queues lokal?"
    answer: "Der vercel dev-Befehl in Nitros Vercel-Preset erkennt jetzt Queue-Handler-Definitionen (nitro.tasks) und führt sie über einen lokalen Vercel Runtime Stub aus. Sie können Arbeit aus einem Route-Handler in die Queue einreihen und den vollständigen async Flow debuggen: Retries und Dead-Letter-Queue, vollständig lokal."
---

Nitro v3.0.260522-beta wurde am 22. Mai 2026 veröffentlicht und erweitert die im April begonnene v3-Beta. Die Version fügt drei Funktionen hinzu, die zusammen die Developer Experience für produktionsorientierte serverseitige TypeScript-Anwendungen erheblich verbessern: automatische Tracing-Instrumentierung zur Build-Zeit, einen VFS-gestützten dynamischen Code-Cache und lokale Vercel-Queue-Emulation.

## Automatische Route-Handler-Tracing-Wrapper zur Build-Zeit

PR [#4240](https://github.com/nitrojs/nitro/pull/4240) führt automatische Tracing-Span-Wrapper für jeden Nitro-Route-Handler zur Build-Zeit ein. Wenn eine Anfrage einen Nitro-Server erreicht, werden Spans für jede Handler-Invokation mit Metadaten emitet, einschließlich Routenpfad, HTTP-Methode, Dauer und Cache-Status. Diese Spans integrieren sich mit OpenTelemetry-kompatiblen Empfängern, Sie zeigen mit Ihrem `OTEL_EXPORTER_OTLP_ENDPOINT` auf einen Collector und erhalten vollständige Request-Traces, ohne eine einzige Zeile Instrumentierungscode zu schreiben.

## VFS-Caching für dynamischen Code

PR [#4251](https://github.com/nitrojs/nitro/pull/4251) führt eine VFS-Schicht für Nitros dynamischen App-Code ein. Bisher musste Nitro bei einem Dev-Server-Neustart den gesamten Modulgraphen neu auswerten, jeden Route-Handler, jeden `useStorage()`-Aufruf, jeden Event-Hook. Bei Anwendungen mit Hunderten von Routes oder teurer Initialisierungslogik kamen pro Restart mehrere Sekunden dazu.

Der neue VFS-Cache serialisiert den aufgelösten Zustand von Nitros interner Registry nach dem ersten Request. Nachfolgende Starts laden aus diesem Snapshot und überspringen den Auswertungsschritt. Der Cache wird automatisch invalidiert, wenn sich Quelldateien ändern.

## Vercel Queues im lokalen Development

Das Vercel-Preset erhält Queue-Support im lokalen Development über `vercel dev` ([#4264](https://github.com/nitrojs/nitro/pull/4240)). Queue-Handler, die mit `nitro.tasks` definiert sind, werden jetzt erkannt und von einem lokalen Vercel Runtime Stub ausgeführt. Sie können einen Queue-Consumer schreiben, ihn aus einem Route-Handler aufrufen und den vollständigen Async-Flow, inklusive Retries und Dead-Letter-Queue-Verhalten, vollständig lokal debuggen.

## Sicherheitspatches

Zwei Schwachstellen, die in der v3.0.260429-beta behoben wurden, betreffen auch ältere Releases:

- **GHSA-5w89-w975-hf9q**: Proxy-Route-Regeln konnten über malformed Request-Paths umgangen werden.
- **GHSA-9phm-9p8f-hw5m**: Offene Weiterleitung über protocol-relative URL in Redirect-Route-Regeln.

## AWS Amplify unterstützt Node.js 24

Das AWS-Amplify-Preset unterstützt jetzt Node.js 24 Runtime ([#4245](https://github.com/nitrojs/nitro/pull/4245)).

Nitro v3.0.260522-beta ist auf npm als `nitro@3.0.0-260522-beta` verfügbar.
