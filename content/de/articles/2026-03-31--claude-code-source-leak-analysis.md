---
title: "Claude Code Source Map Leak Enthüllt Verstecktes Agent-OS, Chrome-Automatisierung und Privacy-Lücken"
description: "Am 30.–31. März 2026 entdeckten Entwickler, dass das npm-Paket @anthropic-ai/claude-code@v2.1.88 eine Produktions-Source-Map-Datei enthielt, die den vollständigen TypeScript-Quellcode offenlegte — mit unver dokumentiertem Multi-Agent-Orchestrierungssystem, einem versteckten Chrome-MCP-Server, einer internen Query-Engine, einem Tool-Berechtigungssystem und einem dreistufigen Telemetriesystem."
date: "2026-03-31"
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
  - "Claude Code v2.1.88 wurde mit einer Produktions-Source-Map (cli.js.map) ausgeliefert, die ~4.756 Quelldateien einschließlich unver dokumentierter Multi-Agent-Orchestrierung offenlegte."
  - "Versteckter Chrome-MCP-Server erlaubt Claude Code, einen Browser zu steuern — eine Fähigkeit, die Anthropic nie angekündigt oder dokumentiert hat."
  - "Ein dreistufiges Datenschutzsystem (default, no-telemetry, essential-traffic) mit Datadog-Integration und 506 Telemetrie-Dateien offenbart umfangreiche Datensammlung."
  - "CLAUDE.md-Auflösung hat vier Präzedenzebenen, einschließlich einer unver dokumentierten systemweiten `/etc/claude-code/CLAUDE.md`, die Konfigurationsrisiken darstellen könnte."
faq:
  - question: "Sollte ich Claude Code nach dem Source-Map-Leak deinstallieren?"
    answer: "Die Source-Map legte Claude Code's interne Architektur offen, aber es war keine Sicherheitslücke, die Daten von Benutzermaschinen leckte. Keine Anmeldedaten, API-Schlüssel oder Benutzerdaten wurden offengelegt. Das Update auf die neueste Version entfernt die Source-Map-Datei. Der Vorfall ist ein Build-Konfigurationsfehler, kein Sicherheitsverstoß Ihrer Umgebung."
  - question: "Welche Daten sammelt Claude Code tatsächlich?"
    answer: "Claude Code hat drei Telemetrie-Stufen: 'default' (alles aktiviert, einschließlich Datadog-Absturzberichte und First-Party-Event-Logging), 'no-telemetry' (Analytics deaktiviert) und 'essential-traffic' (blockiert allen nicht wesentlichen ausgehenden Traffic). Es sammelt Plattform-Metadaten, Runtime-Info und GitHub-Actions-Präsenz. Feature-Flags werden über GrowthBook verwaltet, was darauf hindeutet, dass A/B-Testing eingebaut ist."
  - question: "Ist die versteckte Chrome-Automatisierung ein Sicherheitsrisiko?"
    answer: "Der Chrome-MCP-Server erfordert explizite Einrichtung mit einer spezifischen Browser-Extension-ID und ist standardmäßig nicht aktiv. Das primäre Bedenken ist nicht aktive Ausnutzung, sondern die Tatsache, dass Anthropic eine Browser-Automatisierungsfähigkeit gebaut und ausgeliefert hat, ohne sie zu dokumentieren — was Fragen aufwirft, welche anderen unver dokumentierten Funktionen in Tools mit tiefem Codebase-Zugriff existieren."
---

Am 30. März 2026 bemerkten Entwickler, die das npm-Paket `@anthropic-ai/claude-code@v2.1.88` installierten, etwas Ungewöhnliches: Das veröffentlichte Bundle enthielt `cli.js.map`, eine Produktions-Source-Map-Datei, die die minifizierte JavaScript-Datei zurück auf ihren ursprünglichen TypeScript-Quellcode abbildet. Innerhalb von Stunden verbreitete sich die Entdeckung über Entwickler-Communities, wobei mehrere Entwickler unabhängig voneinander bestätigten, dass die Source-Map einen nahezu vollständigen Blick auf Claude Code's interne Architektur bot.

Das Problem wurde formal als [GitHub Issue #41329](https://github.com/anthropics/claude-code/issues/41329) gemeldet — mit dem Titel "[BUG] Es scheint, dass der Claude-Code-Quellcode geleakt wurde, mit cli.js.map auf npm hochgeladen" — und wurde am selben Tag als erledigt geschlossen. Entwickler auf Twitter, einschließlich @iamsupersocks, @Fried_rai und @chetaslua, teilten Screenshots und Analysen dessen, was sie fanden. Ein französischer Entwickler soll einen umfangreichen Thread geteilt haben, der die bedeutendsten Entdeckungen aufschlüsselte.

## Was geleakt wurde

Die Source-Map (`cli.js.map`) ist ein Standard-JavaScript-Build-Artefakt, das Debugging-Tools erlaubt, minifizierten Code zurück auf ursprüngliche Quelldateien abzubilden. Wenn es in einem Produktions-npm-Paket enthalten ist, legt es effektiv den gesamten TypeScript-Quellbaum jedem offen, der das Paket herunterlädt. In diesem Fall enthielt die Source-Map Referenzen auf **4.756 Quelldateien**, einschließlich ungefähr **25 Claude-spezifischer Dateien**, von denen Entwickler sagen, dass sie architektonische Entscheidungen offenbaren, die Anthropic nicht öffentlich dokumentiert hatte.

Das Paket wurde mit der Source-Map intakt auf npm veröffentlicht — ein Build-Konfigurationsfehler, der niemals Produktion erreichen sollte.

## Was sie fanden

### Das Agent-OS: Ein Multi-Agent-Orchestrierungssystem, von dem niemand wusste

Die auffälligste Entdeckung war ein umfassendes Agent-Orchestrierungssystem. Die Source-Map enthüllt eine Reihe von Agent-Typen mit Namen, die in keiner öffentlichen Dokumentation jemals erschienen sind:

- `AgentTool`, `ExploreAgent`, `PlanAgent`, `VerificationAgent`, `GeneralPurposeAgent`, `StatuslineSetupAgent`

Zusammen mit diesen enthält der Code `TeamCreateTool` und `TeamDeleteTool`, was darauf hindeutet, dass Claude Code Teams von Agenten erstellen und zerstören kann. Das System verwendet `coordinatorMode.ts` für Multi-Agent-Koordination, und Agenten kommunizieren durch ein dateibasiertes Posteingangssystem unter `.claude/teams/{team_name}/inboxes/{agent_name}.json`. Eine `forkSubagent.ts`-Datei behandelt das Spawnen von Subagenten, und Ausführungsisolation wird durch `AsyncLocalStorage` aufrechterhalten.

Der System-Prompt selbst hat **drei distinct prefixes**: `DEFAULT_PREFIX`, `AGENT_SDK_CLAUDE_CODE_PRESET_PREFIX` und `AGENT_SDK_PREFIX` — was auf mindestens drei verschiedene Betriebsmodi oder Kontexte für die KI hindeutet, von denen keiner von Anthropic öffentlich dokumentiert wurde.

**Tool-Berechtigungen** werden über eine `checkPermissions`-Methode auf jedem Tool erzwungen. Drei Modi existieren: `allow` (läuft sofort), `ask` (pausiert und zeigt einen Bestätigungsdialog) und `deny` (abgelehnt, mit einem Fehler an das Modell zurückgegeben). Ein `bypassPermissions`-Modus überspringt alle Checks — eine signifikante Fähigkeit, die in Verbindung mit dem `--dangerously-skip-permissions`-Flag funktioniert. Der `acceptEdits`-Modus genehmigt automatisch Datei-Bearbeitungen, aber nicht Bash-Befehle, und bietet einen Mittelweg zwischen vollständigem Bypass und interaktiver Genehmigung.

### Versteckte Chrome-Integration: Der claude-in-chrome MCP-Server

Entwickler fanden einen vollständigen MCP (Model Context Protocol)-Server für Chrome-Browser-Automatisierung. Die Source-Map enthüllt:

- Eine Chrome-Extension mit ID `fcoeoabgfenejglbffodgkkbkcdhcgfn`
- Tools einschließlich `javascript_tool`, `read_page`, `find`, `form_input`, `computer` und `navigate` (aus einem `BROWSER_TOOLS`-Modul)
- Eine GIF-Aufnahmefähigkeit, freigelegt über `mcp__claude-in-chrome__gif_creator`
- Konsolen-Log-Lesen über `mcp__claude-in-chrome__read_console_messages`

Dieser MCP-Server scheint Claude Code zu erlauben, einen Chrome-Browser direkt von der CLI aus zu steuern — eine Fähigkeit, die Anthropic nicht angekündigt oder dokumentiert hat.

### Die Privacy-Lücke: Was Claude Code tatsächlich sendet

Die Source-Map enthüllt ein dreistufiges Datenschutzsystem, das klärt (und kompliziert), welche Daten Claude Code sammelt:

| Modus                | Telemetrie                        | Datadog | First-Party-Events | Feedback |
| -------------------- | -------------------------------- | ------- | ------------------ | -------- |
| `default`           | Alles aktiviert               | ✓       | ✓                  | ✓        |
| `no-telemetry`      | Analytics deaktiviert           | ✗       | ✗                  | ✗        |
| `essential-traffic` | Alle nicht wesentlichen ausgehenden Traffic blockiert | —       | —                  | —        |

Die Analytics-Integration sendet Daten an **Datadog** und protokolliert First-Party-Events throughout the codebase. Feature-Flags werden über **GrowthBook** via `getFeatureValue_CACHED_MAY_BE_STALE` verwaltet. Ein Attributions-Header kann über die Umgebungsvariable `CLAUDE_CODE_ATTRIBUTION_HEADER` deaktiviert werden. Die Source-Map enthält **506 Analytics- und Telemetrie-bezogene Dateien**, mit `logEvent` und `logForDebugging`, die throughout the codebase aufgerufen werden. Gesammelte Umgebungsmetadaten umfassen Plattform, Runtime und GitHub-Actions-Informationen.

Die Existenz des `essential-traffic`-Modus — der virtually allen nicht wesentlichen ausgehenden Traffic blockiert — könnte für Entwickler neu sein, die glaubten, die einzigen Optionen seien "alles an" oder "alles aus".

### Die CLAUDE.md-Hierarchie: Vier Ebenen von Präzedenz, von denen niemand wusste

Die Source-Map enthüllt, dass Claude Code `CLAUDE.md`-Dateien in einer spezifischen Reihenfolge mit **umgekehrter Priorität** auflöst (spätere Ebenen überschreiben frühere):

1. `/etc/claude-code/CLAUDE.md` — Systemweites Global für alle Benutzer
2. `~/.claude/CLAUDE.md` — Privates Benutzer-Global
3. `CLAUDE.md`, `.claude/CLAUDE.md`, `.claude/rules/*.md` — Projektebene
4. `CLAUDE.local.md` — Privates projektspezifisches (**höchste Priorität**)

Dieses vierstufige System, insbesondere die Existenz von `/etc/claude-code/CLAUDE.md` und `CLAUDE.local.md`, ist in keinem öffentlichen Anthropic-Material dokumentiert. Systemadministratoren könnten theoretisch eine globale `CLAUDE.md` bei `/etc/claude-code/` platzieren, und Entwickler haben möglicherweise `CLAUDE.local.md`-Konfigurationen, von denen sie nicht wissen, dass sie Projekt-Regeln überschreiben.

### Der versteckte "good-claude"-Befehl

Vergraben in `src/commands/good-claude/index.js` fanden Entwickler einen völlig versteckten Stub-Befehl:

```javascript
export default { isEnabled: () => false, isHidden: true, name: "stub" };
```

Der Befehl existiert, ist als versteckt markiert, ist deaktiviert und hat keine tatsächliche Implementierung. Sein Zweck ist völlig unklar — es könnte ein aufgegebenes Feature, ein interner Easter Egg oder etwas völlig anderes sein. Aber seine Existenz in einem Produktions-Build wirft Fragen auf, welche anderen unver dokumentierten Features im Codebase lauern könnten.

### Analytics überall

Mit 506 Telemetrie-bezogenen Dateien ist das Ausmaß der Datensammlung in Claude Code erheblich. Die Codebase verwendet:

- **Datadog** für Crash- und Fehlerberichte
- **First-Party-Event-Logging** throughout
- **`logEvent`**-Aufrufe, pervasive across the source
- **`logForDebugging`** für Entwicklungszeit-Diagnostik
- Umgebungsmetadaten-Sammlung: Plattform, Runtime, GitHub-Actions-Präsenz

Die Präsenz von GrowthBook für Feature-Flags (`getFeatureValue_CACHED_MAY_BE_STALE`) deutet darauf hin, dass Anthropic A/B-Tests und schrittweise Rollouts direkt in Claude Code durchführt.

### Inside the Query Engine: Wie Each Turn ausgeführt wird

Eine Mintlify-gehostete interne Dokumentationsseite (von VineeTagarwaL-code/claude-code/concepts/how-it-works) bietet seltenen Einblick in Claude Code's Per-Turn-Ausführungs-Engine und bestätigt und erweitert, was die Source-Map zeigte.

**Die Query-Engine** (`query.ts`) ist der zentrale Dispatcher für jeden Benutzer-Turn. Sie streamt Tokens zum Terminal, behandelt `tool_use`-Blöcke as they arrive, erzwingt Per-Turn-Token- und Tool-Call-Budgets und löst **Kontext-Verdichtung** aus, wenn das Konversationsfenster voll ist. Ergebnisse, die `maxResultSizeChars` überschreiten, werden in eine temporäre Datei gespeichert; das Modell erhält nur eine Vorschau mit dem Dateipfad.

**Jeder API-Aufruf fügt zwei Kontextblöcke voran:**

- `getSystemContext()` — injiziert Git-Status (aktueller Branch, Git-Benutzername, letzte 5 Commit-Nachrichten) und ein Cache-Breaking-Injection-Token. Memoisiert für die Konversationsdauer.
- `getUserContext()` — lädt CLAUDE.md-Memory-Dateien und das aktuelle Datum. Ebenfalls memoisiert.

Wenn `CLAUDE_CODE_REMOTE=1` gesetzt ist (Cloud-Modus), wird das Git-Status-Abrufen komplett übersprungen — ein wichtiges Detail für Entwickler, die Claude Code in Umgebungen verwenden, in denen Git-Metadaten sensibel oder nicht verfügbar sein könnten.

**Konversationsspeicherung** verwendet JSON-Transkript-Dateien, gespeichert unter `~/.claude/`, was Sessions vollständig fortsetzbar macht via the `--resume <session-id>`-Flag. Sessions werden separat indiziert, und die Transkripte werden als strukturierte JSON-Dateien auf der Disk gespeichert.

**Sub-Agenten** laufen via einem `Task`-Tool. Jeder Sub-Agent läuft seine eigene verschachtelte Agenten-Schleife mit einem isolierten Konversationskontext und einem optional eingeschränkten Toolset. Sie können In-Process laufen (using `AsyncLocalStorage` for isolation, matching what the source map showed) oder auf entfernter Compute.

### Andere Erkenntnisse

Die Source-Map enthüllte auch:

- Ein **Buddy/Companion-System** in `src/buddy/` — ein Haustier/Tier-Begleiter, das neben der Input-Box sitzt und über Sprechblase kommentieren kann. Nicht anthropomorphisiert und separat von der Haupt-Claude-Instanz.
- Ein **Plugin-Hint-System**, das `<claude-code-hint />`-Tags zu stderr emittiert, Plugin-Installationsaufforderungen mit 30-Sekunden-Auto-Dismiss und Show-once-Semantik pro Plugin präsentiert.
- Ein **Skills-Framework** in `src/skills/bundled/claudeApi.ts` mit 247KB gebündelter `.md`-Dateien für den `/claude-api`-Befehl, abdeckend Python, TypeScript, Java, Go, Ruby, C#, PHP und curl, mit Sprach-Auto-Erkennung aus Dateierweiterungen.
- Build-System-Details: Claude Code wird mit **Bun** gebaut, verwendet die **React Compiler Runtime**, rendert über **Ink** (ein React-ähnliches CLI-Framework) und verwendet **Zod** für Schema-Validierung und **lodash-es** für Utilities.

## Was es bedeutet

Der Leak ist aus mehreren Gründen signifikant. Erstens repräsentiert er ein **Versagen der Build-Konfiguration** — Source-Maps sollten niemals in Produktions-npm-Paketen veröffentlicht werden. Dies ist eine grundlegende Sicherheitspraxis, die Anthropic's Build-Pipeline anscheinend verpasst hat.

Zweitens, und substantieller, enthüllt die Source-Map eine **erhebliche Lücke zwischen dem, was Claude Code öffentlich behauptet zu sein, und dem, was es tatsächlich ist**. Das unver dokumentierte Multi-Agent-Orchestrierungssystem, die versteckte Chrome-Automatisierung und die allgegenwärtige Telemetrie deuten auf ein Produkt mit Fähigkeiten und Datensammlung hin, denen Benutzer nicht zugestimmt haben. Das dreistufige Datenschutzsystem wird in Anthropic's Dokumentation nicht klar kommuniziert, und die `/etc/claude-code/CLAUDE.md`- und `CLAUDE.local.md`-Dateien schaffen Konfigurationsvektoren, deren sich Entwickler möglicherweise nicht bewusst sind.

Für die Industrie veranschaulicht der Leak ein breiteres Muster: AI-Coding-Tools **akkumulieren erhebliche unver dokumentierte Fähigkeiten** — Agenten-Orchestrierung, Browser-Automatisierung, Telemetrie — die ihre Enterprise- und Individualbenutzer nicht einsehen konnten. Da diese Tools zu festen Bestandteilen von Entwickler-Workflows werden, wird die Frage, was sie tatsächlich tun (vs. was sie sagen, was sie tun), zunehmend wichtig.

## Anthropics Schweigen

Stand dieser Veröffentlichung hat Anthropic keine öffentliche Erklärung zur Source-Map-Offenlegung abgegeben. Das GitHub-Issue wurde als erledigt geschlossen, was darauf hindeutet, dass das Unternehmen sich des Leaks bewusst ist, aber es wurde kein Changelog-Eintrag, keine Sicherheitsberatung oder Kundenkommunikation veröffentlicht. Keine Erklärung wurde angeboten, wie die Source-Map in das Produktionspaket aufgenommen wurde, welche Daten möglicherweise offengelegt wurden oder was das Unternehmen plant, um ähnliche Leaks in Zukunft zu verhindern.

Das `@anthropic-ai/claude-code`-Paket wurde seitdem aktualisiert, aber der Vorfall wirft Fragen auf über Anthropic's Build- und Release-Prozesse — und über die Transparenzverpflichtungen, die Entwickler von einem Unternehmen erwarten, dessen Tool tiefen Zugriff auf ihre Codebases hat.