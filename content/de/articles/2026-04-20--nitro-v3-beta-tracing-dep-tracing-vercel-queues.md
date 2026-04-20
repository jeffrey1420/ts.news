---
title: "Nitro v3 Beta Update: Integriertes Tracing, Intelligente Abhängigkeits-Erkennung und Vercel Queues"
description: "Das Nitro v3 Beta-Update vom April 2026 bringt experimentelle Tracing-Kanäle, Full-Trace-Abhängigkeitserkennung mit Native-Package-Erkennung, Vercel-Queue-Support und Tencent EdgeOne Pages-Deployment — zusammen mit H3 v2 Sicherheits- und Cookie-Verbesserungen."
date: 2026-04-20
image: "https://ts.news/images/nitro-og.png"
author: lschvn
tags: ["TypeScript", "Nitro", "Server", "Framework", "Vue", "Nuxt", "Vercel"]
tldr:
  - Nitro v3 erhält integrierte Tracing-Kanal-Unterstützung für Observability und eine intelligentere Abhängigkeitserkennung im Full-Trace-Modus mit automatischer Erkennung von Optional-Dependencies und Native Packages
  - Das Vercel-Preset unterstützt nun Queues für asynchrone Job-Verarbeitung und Override der Funktionskonfiguration pro Route (Memory, Timeout, maxDuration)
  - Tencent EdgeOne Pages ergänzt die Deployment-Preset-Liste, und H3 v2 bringt striktere Streaming-Body-Checks, RFC 6265bis-Cookie-Compliance und Path-Traversal-Schutz
faq:
  - q: "Wie unterscheidet sich das integrierte Nitro-v3-Tracing von bestehenden OpenTelemetry-Integrationen?"
    a: "Die Tracing-Kanäle von Nitro bieten eine framework-native, niedrigere Observability-Schicht. Ohne ein separates OpenTelemetry SDK einrichten zu müssen, erhalten Sie Request-Span-Tracing direkt aus Nitros Internen — Spans für Route-Handling, Datenbankabfragen und Cache-Operationen werden automatisch emittiert."
  - q: "Welche Native Packages erkennt traceDeps jetzt automatisch?"
    a: "Der Full-Trace-Modus nutzt eine wachsende Native-Packages-Datenbank, um Optional Dependencies mit vorkompilierten Binaries zu identifizieren (z.B. node-sqlite3, canvas oder sharp). Nitro erkennt diese automatisch und vermeidet falsches Bundling."
  - q: "Wie funktionieren Vercel Queues in Nitro?"
    a: "Definieren Sie Queue-Handler mit nitro.tasks, deployen Sie auf Vercel, und nutzen Sie das Vercel SDK aus Ihren Route-Handlern. Das Vercel-Preset übernimmt die Konfiguration automatisch."
---

Das öffentliche Nitro v3 Beta entwickelt sich weiter. Das Update vom 15. April (v3.0.260415-beta) bringt eine Reihe von Developer-Experience- und Production-Readiness-Funktionen näher an die finale Version.

## Integrierte Tracing-Kanäle

Das Haupt-Feature ist die experimentelle Tracing-Kanal-Unterstützung ([PR #4001](https://github.com/nitrojs/nitro/pull/4001)). Nitro emittiert nun strukturierte Trace-Spans für Request-Lifecycle-Events — Routing, Handler-Ausführung, Cache Treffer/Fehlschläge, Datenbank-Timing — direkt aus dem Framework-Kern. Kein OpenTelemetry SDK nötig; Tracing ist eine First-Class-Nitro-Funktion.

## Intelligentere Abhängigkeits-Verfolgung mit Full-Trace

Nitros `traceDeps` Tool erhält ein bedeutendes Upgrade ([PR #4175](https://github.com/nitrojs/nitro/pull/4175)). Der neue Full-Trace-Modus gibt Entwicklern Kontrolle über die Analyse des Abhängigkeitsgraphen während des Builds.

Die wichtigste Verbesserung: der upstream nf3 Tracer nutzt nun eine wachsende Native-Packages-Datenbank und erkennt Optional Dependencies automatisch. Wenn Ihr Projekt Packages mit nativen Binaries nutzt, erkennt Nitro diese nun automatisch und vermeidet falsches Bundling — eine häufige Ursache für "lokal funktioniert, prod ist kaputt"-Fehler.

## Vercel Queues und Per-Route Function Config

Das Vercel Deployment-Preset erhält zwei Production-Features.

**Vercel Queues**: Nitro Route-Handler können nun asynchrone Arbeit über die Vercel-Queue-Infrastruktur einreihen. Definieren Sie Background-Task-Handler mit `nitro.tasks`, deployen Sie auf Vercel, und nutzen Sie das Vercel SDK. Das Preset übernimmt die Konfiguration automatisch.

**Per-Route Function Config Override**: Individuelle Routes können nun die Standard-Vercel-Funktionskonfiguration überschreiben — Memory-Limit, Timeout, `maxDuration`. Praktisch wenn eine bestimmte Route mehr Ressourcen braucht als der Rest der Anwendung.

## Tencent EdgeOne Pages Deployment

Nitros "deploy anywhere"-Versprechen erhält ein weiteres Ziel: Tencent EdgeOne Pages. Das neue `edgeone-pages` Preset nutzt die EdgeOne Pages Build Output API v3.

## H3 v2 Sicherheits- und Kompatibilitätsfixes

Das zugrunde liegende H3 HTTP-Framework aktualisiert von rc.16 auf rc.20 mit mehreren wichtigen Fixes:

- **Path Traversal Schutz**: Doppelte kodierte Dot-Segmente in URLs werden jetzt abgelehnt
- **Open Redirect Schutz**: `redirectBack()` validiert, dass das Redirect-Ziel keinen Protocol-Relative-Path nutzt
- **Striktere Streaming Body Checks**: Erzwingt Stream-basierte Content-Length-Limits unabhängig vom Content-Length Header
- **Cookie RFC 6265bis Compliance**: Cookie-Parsing und -Serialisierung entsprechen dem aktualisierten RFC
- **Unbegrenzte Chunked Cookie Count gefixt**: Verhindert einen DoS-Vektor

## ocache und unstorage Verbesserungen

`ocache` erhält Cache-Invalidierung via `handler.invalidate()` und Multi-Tier-Cache-Support. `unstorage` leert nun proaktiv abgelaufene Memory-Einträge.

## Dokumentation

Nitro.build erhält neue Guides für [OpenAPI](https://nitro.build/docs/openapi) und [WebSocket](https://nitro.build/docs/websocket).

Das April-Beta-Update zeigt Nitro v3 näher an der GA mit Production-Infrastruktur-Features statt nur Developer-Ergonomie.
