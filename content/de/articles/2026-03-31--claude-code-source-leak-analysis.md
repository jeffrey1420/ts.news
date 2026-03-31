---
title: "Quellcode-Leck bei Claude Code: Verstecktes Agent-OS, Chrome-Automatisierung und Datenschutzlücken"
description: "Am 30.–31. März 2026 entdeckten Entwickler, dass das npm-Paket @anthropic-ai/claude-code@v2.1.88 eine Produktions-Source-Map-Datei enthielt, die den vollständigen TypeScript-Quellcode offenlegte — einschließlich nicht dokumentierter Multi-Agent-Orchestrierung, eines versteckten Chrome-MCP-Servers, einer internen Query-Engine, eines Tool-Berechtigungssystems und eines dreistufigen Telemetriesystems."
date: 2026-03-31
image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop"
author: "lschvn"
tags:
  [
    "security",
    "anthropic",
    "claude-code",
    "npm",
    "typescript",
    "agents",
    "privacy",
  ]
readingTime: 5
tldr:
  - "Claude Code v2.1.88 wurde mit einer Produktions-Source-Map (cli.js.map) ausgeliefert, die ~4.756 Quelldateien einschließlich nicht dokumentierter Multi-Agent-Orchestrierung freigab."
  - "Ein versteckter Chrome-MCP-Server ermöglicht Claude Code die Browser-Steuerung — eine von Anthropic nie angekündigte oder dokumentierte Funktion."
  - "Ein dreistufiges Datenschutzsystem mit Datadog-Integration und 506 Telemetriedateien offenbart umfangreiche Datensammlung."
  - "Die CLAUDE.md-Auflösung hat vier Prioritätsebenen, einschließlich einer undokumentierten systemweiten `/etc/claude-code/CLAUDE.md`."
faq:
  - question: "Sollte ich Claude Code nach dem Source-Map-Leck deinstallieren?"
    answer: "Die Source-Map legte die interne Architektur von Claude Code offen, war aber keine Sicherheitslücke, die Daten von Benutzermaschinen preisgab. Es wurden keine Zugangsdaten, API-Schlüssel oder Benutzerdaten offengelegt. Ein Update auf die neueste Version entfernt die Source-Map-Datei. Der Vorfall ist ein Build-Konfigurationsfehler, kein Sicherheitsbruch Ihrer Umgebung."
  - question: "Welche Daten sammelt Claude Code tatsächlich?"
    answer: "Claude Code hat drei Telemetrie-Stufen: 'default' (alles aktiviert, inklusive Datadog-Fehlerberichterstattung), 'no-telemetry' (Analytik deaktiviert) und 'essential-traffic' (aller nicht wesentlicher ausgehender Traffic blockiert). Es sammelt Plattform-Metadaten, Laufzeitinformationen und GitHub-Actions-Präsenz. Feature-Flags werden über GrowthBook verwaltet."
  - question: "Ist die versteckte Chrome-Automatisierung ein Sicherheitsrisiko?"
    answer: "Der Chrome-MCP-Server erfordert eine explizite Einrichtung mit einer spezifischen Browser-Erweiterungs-ID und ist standardmäßig nicht aktiv. Das Hauptproblem ist nicht die aktive Ausnutzung, sondern die Tatsache, dass Anthropic eine Browser-Automatisierungsfunktion entwickelt und ausgeliefert hat, ohne sie zu dokumentieren."
---

Am 30. März 2026 bemerkten Entwickler, die das npm-Paket `@anthropic-ai/claude-code@v2.1.88` installierten, etwas Ungewöhnliches: Das veröffentlichte Bundle enthielt `cli.js.map`, eine Produktions-Source-Map-Datei, die den minifizierten JavaScript-Code auf seinen ursprünglichen TypeScript-Quellcode abbildet. Innerhalb weniger Stunden verbreitete sich die Entdeckung in den Entwickler-Communities, wobei mehrere Entwickler unabhängig voneinander bestätigten, dass die Source-Map einen nahezu vollständigen Blick auf die interne Architektur von Claude Code bot.

Das Problem wurde formell als [GitHub Issue #41329](https://github.com/anthropics/claude-code/issues/41329) gemeldet — betitelt "[BUG] Es scheint, dass der Quellcode von Claude Code geleaked wurde, mit cli.js.map auf npm hochgeladen" — und am selben Tag als erledigt geschlossen. Entwickler auf Twitter, darunter @iamsupersocks, @Fried_rai und @chetaslua, teilten Screenshots und Analysen ihrer Entdeckungen.

## Was geleakt wurde

Die Source-Map (`cli.js.map`) ist ein Standard-JavaScript-Build-Artefakt, das Debugging-Tools ermöglicht, minifizierten Code auf Originalquelldateien abzubilden. Wenn sie in einem Produktions-npm-Paket enthalten ist, legt sie effektiv den gesamten TypeScript-Quellbaum für jeden offen, der das Paket herunterlädt. In diesem Fall enthielt die Source-Map Verweise auf **4.756 Quelldateien**, einschließlich ungefähr **25 Claude-spezifischer Dateien**, die, laut Entwicklern, Architekturentscheidungen offenbaren, die Anthropic nicht öffentlich dokumentiert hatte.

## Was sie gefunden haben

### Das Agent-OS: Ein Multi-Agent-Orchestrierungssystem, das niemand kannte

Die auffälligste Entdeckung war ein umfassendes Agent-Orchestrierungssystem. Die Source-Map enthüllt Agent-Typen mit Namen, die in keiner öffentlichen Dokumentation je aufgetaucht sind:

- `AgentTool`, `ExploreAgent`, `PlanAgent`, `VerificationAgent`, `GeneralPurposeAgent`, `StatuslineSetupAgent`

Zusammen mit diesen enthält der Code `TeamCreateTool` und `TeamDeleteTool`, was darauf hindeutet, dass Claude Code Teams von Agenten erstellen und zerstören kann. Das System verwendet `coordinatorMode.ts` für die Multi-Agent-Koordination, und Agenten kommunizieren über ein dateibasiertes Posteingangssystem unter `.claude/teams/{team_name}/inboxes/{agent_name}.json`. Eine `forkSubagent.ts`-Datei behandelt das Erzeugen von Subagenten, und die Ausführungsisolation wird durch `AsyncLocalStorage` aufrechterhalten.

**Tool-Berechtigungen** werden über eine `checkPermissions`-Methode auf jedem Tool erzwungen. Drei Modi existieren: `allow` (läuft sofort), `ask` (pausiert und zeigt einen Bestätigungsdialog) und `deny` (abgelehnt, mit Fehler zurück zum Modell). Ein `bypassPermissions`-Modus überspringt alle Prüfungen — eine signifikante Fähigkeit, die in Verbindung mit dem `--dangerously-skip-permissions`-Flag funktioniert.

### Versteckte Chrome-Integration: Der claude-in-chrome MCP-Server

Entwickler fanden einen vollständigen MCP-Server (Model Context Protocol) für Chrome-Browserautomatisierung:

- Eine Chrome-Erweiterung mit der ID `fcoeoabgfenejglbffodgkkbkcdhcgfn`
- Tools einschließlich `javascript_tool`, `read_page`, `find`, `form_input`, `computer` und `navigate`
- Eine GIF-Aufnahmefähigkeit, freigelegt über `mcp__claude-in-chrome__gif_creator`
- Konsolenlog-Auslesung über `mcp__claude-in-chrome__read_console_messages`

Dieser MCP-Server scheint Claude Code die direkte Steuerung eines Chrome-Browsers von der CLI aus zu ermöglichen — eine Fähigkeit, die von Anthropic weder angekündigt noch dokumentiert wurde.

### Die Datenschutzlücke: Was Claude Code tatsächlich sendet

Die Source-Map enthüllt ein dreistufiges Datenschutzsystem :

| Modus | Telemetrie | Datadog | Erstanbieter-Events | Feedback |
|-------|-----------|---------|---------------------|----------|
| `default` | Alles aktiviert | ✓ | ✓ | ✓ |
| `no-telemetry` | Analytik deaktiviert | ✗ | ✗ | ✗ |
| `essential-traffic` | Nicht-essentieller Traffic blockiert | — | — | — |

Die Analytik-Integration sendet Daten an **Datadog** und protokolliert Erstanbieter-Events throughout the codebase. Feature-Flags werden über **GrowthBook** verwaltet via `getFeatureValue_CACHED_MAY_BE_STALE`. Die Source-Map enthält **506 analytik- und telemetriebezogene Dateien**, mit `logEvent` und `logForDebugging`, die throughout the codebase aufgerufen werden.

### Die CLAUDE.md-Hierarchie: Vier Prioritätsebenen

Claude Code löst `CLAUDE.md`-Dateien in einer spezifischen Reihenfolge mit **umgekehrter Priorität** auf (spätere Ebenen überschreiben frühere):

1. `/etc/claude-code/CLAUDE.md` — Systemweites Global für alle Benutzer
2. `~/.claude/CLAUDE.md` — Privates Benutzer-Global
3. `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md` — Projektebene
4. `CLAUDE.local.md` — Privates projektspezifisches (**höchste Priorität**)

### Der versteckte "good-claude"-Befehl

Vergraben in `src/commands/good-claude/index.js` fanden Entwickler einen völlig versteckten Stub-Befehl:

```javascript
export default { isEnabled: () => false, isHidden: true, name: "stub" };
```

Der Befehl existiert, ist versteckt, deaktiviert und hat keine tatsächliche Implementierung.

## Was es bedeutet

Das Leck ist aus mehreren Gründen bedeutsam. Erstens repräsentiert es einen **Build-Konfigurationsfehler** — Source-Maps sollten niemals in Produktions-npm-Paketen veröffentlicht werden.

Zweitens, und substanzieller, enthüllt die Source-Map eine **erhebliche Lücke zwischen dem, was Claude Code öffentlich behauptet zu sein, und dem, was es tatsächlich ist**. Die nicht dokumentierte Multi-Agent-Orchestrierung, versteckte Chrome-Automatisierung und allgegenwärtige Telemetrie deuten auf ein Produkt mit Fähigkeiten und Datensammlung hin, denen Benutzer nicht zugestimmt haben.

## Anthropics Schweigen

Stand jetzt hat Anthropic keine öffentliche Stellungnahme zur Source-Map-Exposition abgegeben. Die GitHub-Issue wurde als abgeschlossen geschlossen, was darauf hindeutet, dass das Unternehmen vom Leck weiß, aber es wurde kein Changelog-Eintrag, keine Sicherheitswarnung oder Kundenkommunikation veröffentlicht.
