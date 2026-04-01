---
title: "Rivet Agent OS: Das In-Process-Betriebssystem, das KI-Agenten 500x günstiger als Sandboxes ausführt"
description: "Von YC und a16z unterstützt, baute Rivet einen Agent-Runtime auf V8-Isolaten und WebAssembly, der in 4,8 ms cold startet — 92x schneller als E2B, zu 1/17 der Kosten. Wir haben die Architektur, Benchmarks und Implikationen tief erforscht."
date: 2026-04-01
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop"
author: lschvn
tags: ["AI agents", "Rivet", "WebAssembly", "V8", "sandbox", "infrastructure", "open source"]
readingTime: 9
tldr:
  - "Rivet Agent OS führt KI-Agenten in 4,8 ms Cold-Start aus — 92x schneller als E2B-Sandboxes zu 1/17 der Kosten, angetrieben durch V8-Isolate und WebAssembly."
  - "Von YC W23 + a16z-Stack-Gründern mit Spiele-Infrastruktur-Hintergrund gebaut, ist agentOS buchstäblich ein In-Process-OS-Kernel: virtuelle Dateisysteme, Prozesstabelle, Pipes, PTYs und Netzwerk-Stack."
  - "Apache 2.0 Open Source + 20$/Monat Cloud-Tier. Hauptkäufer: Backend-Ingenieure bei Startups, die KI-Agenten-Features bauen — keine Solo-Devs."
faq:
  - question: "Wie erreicht agentOS 92x schnellere Cold Starts als E2B?"
    answer: "agentOS nutzt V8-Isolate — dieselbe Sandbox-Technologie wie in Chrome — die im Host-Prozess laufen. E2B bootet eine vollständige Linux-VM. Keine VM zu booten bedeutet p50 Cold Start von 4,8 ms vs. 440 ms. Der Speicherbedarf sinkt auf ~131 MB vs. ~1 GB."
  - question: "Ist agentOS ein Ersatz für E2B- oder Daytona-Sandboxes?"
    answer: "Nein — und das ist der Punkt. agentOS bietet explizit eine Sandbox-Mount-Erweiterung, sodass Sie bei Bedarf E2B starten können, wenn Workloads einen echten Browser oder native Binaries benötigen. agentOS gewinnt bei den 80 % der Agentenaufgaben, die kein vollständiges OS brauchen."
  - question: "ACP vs. MCP — welches Protokoll setzt sich durch?"
    answer: "MCP (Anthropic) hat überwältigenden Mindshare und Verbreitung. ACP (Agent Communication Protocol) ist architektonisch überlegen — es definiert Sessions, Transkripte, Reconnect-Logik und universelle Agent-Formate. Denken Sie an LSP (Language Servers) — es dauerte 10 Jahre, bis es sich durchsetzte, obwohl die Lösung offensichtlich richtig war. ACP steht noch am Anfang."
  - question: "Sollten Startups agentOS heute einsetzen?"
    answer: "Für Produktiv-Agenten-Features: Ja, wenn Sie ein Backend-/Platform-Ingenieur sind, der in Node.js entwickelt. Für den allgemeinen Gebrauch: Es ist Beta, nur der Pi-Agent ist produktionsreif, und es gibt noch kein Drittanbieter-Sicherheitsaudit. Die Architektur ist solide; das Ökosystem ist noch jung."
  - question: "Was kann agentOS nicht tun?"
    answer: "Keine Browser-Automatisierung (dafür wird ein echtes OS benötigt), keine GPU-Workloads, keine nativen Linux-Binaries außerhalb von WASM-Targets, keine macOS/Windows-Agenten. Die WASM-POSIX-Schicht ist unvollständig — git und make sind geplant, aber noch nicht ausgeliefert."
---

Wir haben vollständige Linux-Virtual Machines eingesetzt, um KI-Agenten auszuführen. Dann hat jemand erkannt, dass wir das整个都做错了.

In den letzten zwei Jahren lautete die Standardantwort auf die Frage „Wie führt man einen Coding-Agenten sicher aus?"ans: Starten Sie eine Cloud-VM, booten Sie Linux, öffnen Sie eine Shell-Session, führen Sie Ihren Agenten aus. E2B. Daytona. Modal. Jedes Agent-Framework setzte auf dasselbe mentale Modell wie beim Bereitstellen eines Webservers — ein vollständiges Betriebssystem, ein vollständiges Dateisystem, Syscalls an einen echten Kernel, und das alles für einen Agenten, der 95 % seiner Zeit darauf wartet, dass ein LLM antwortet.

Rivets Antwort ist anders. Sehr anders.

## Was ist agentOS?

agentOS ist ein **In-Process-Betriebssystemkernel, geschrieben in JavaScript**, der innerhalb eines Node.js-Host-Prozesses läuft. Das ist kein Marketing-Jargon — das ist eine präzise Beschreibung der Architektur.

Der Kernel verwaltet:
- Ein **virtuelles Dateisystem** mit Mount-Treibern (S3, SQLite, Host-Verzeichnisse, In-Memory)
- Eine **Prozesstabelle** zur Nachverfolgung von Kindprozessen, PIDs, Exit-Codes
- **Pipes und PTYs** für die Inter-Prozess-Kommunikation
- Einen **virtuellen Netzwerk-Stack** mit programmierbaren Allow/Deny/Proxy-Regeln

In diesen Kernel werden drei Runtimes gemountet:

**1. V8-Isolates für Agent-Code.** Der Agent (Pi, Claude Code, Codex — demnächst) läuft in einem V8-JavaScript-Kontext. Dies ist dieselbe Isolationstechnologie, die Chrome verwendet, um jeden Browser-Tab zu sandboxen. Jedes Isolate hat seinen eigenen Heap und Stack, keinen gemeinsamen Status, Berechtigungen, die standardmäßig verweigert werden, für Dateisystem-, Netzwerk- und Prozesszugriff. Cold Start liegt bei ~4–6 ms, weil Sie nichts booten — Sie erstellen lediglich einen neuen JavaScript-Kontext innerhalb einer bereits laufenden V8-Engine.

**2. WebAssembly für POSIX-Tools.** GNU coreutils, grep, sed, gawk, curl, jq, ripgrep, sqlite3 und über 80 weitere Unix-Befehle, die von C und Rust nach WebAssembly kompiliert wurden. Sie laufen in einem WASM-Runtime, das vom Kernel verwaltet wird — nicht in V8. Der Agent kommuniziert mit ihnen über eine virtuelle PTY, wie in einer Shell.

**3. Sandbox-Erweiterung für schwere Workloads.** Wenn Sie tatsächlich einen echten Browser, native Linux-Binaries oder GPU-Zugriff benötigen, kann agentOS bei Bedarf eine E2B- oder Daytona-Sandbox mounten und sie als Teil des virtuellen Dateisystembaums bereitstellen. Das ist das Hybridmodell: leichte, schnelle Agenten für die 80 % der Aufgaben, die kein vollständiges OS brauchen, vollständige Sandboxes, wenn doch.

### Host Tools: Das Integrationsmuster, das zählt

Das „Host Tools"-Modell ist agentOS' meistunterschätztes Feature. Ihr Backend exponiert JavaScript-Funktionen für den Agenten, als wären sie CLI-Befehle:

```typescript
const weatherToolkit = toolKit({
  name: "weather",
  tools: {
    get: hostTool({
      description: "Das Wetter für eine Stadt abrufen.",
      inputSchema: z.object({ city: z.string() }),
      execute: async ({ city }) => ({ temperature: 18, conditions: "teilweise bewölkt" }),
    }),
  },
});
```

Der Agent ruft auf: `agentos-weather get --city Berlin`. Kein HTTP. Keine Auth-Headers. Kein Netzwerk-Hop. Der Kernel überbrückt direkt zu Ihrer Node.js-Funktion. Das ist das richtige Modell für Backend-Integration.

### ACP: LSP für Agenten

Das Agent Communication Protocol (ACP) ist ein standardisiertes Protokoll für die Kommunikation zwischen Editor und Agent — explizit nach dem Vorbild des Language Server Protocol (LSP) modelliert, das Sprachserver von IDEs entkoppelte. ACP definiert Sessions, Transkripte, Reconnect-Logik und universelle Agent-Formate. Wenn es sich durchsetzt, werden Agenten portabel zwischen Editoren (Cursor, VS Code usw.) und Editoren erhalten Zugriff auf das gesamte ACP-Agenten-Ökosystem. Die Parallele zu LSP ist passend: Es dauerte ein Jahrzehnt, bis sich LSP durchsetzte, obwohl die Lösung offensichtlich richtig war. ACP ist noch am Anfang.

## Die Zahlen

Alle unten aufgeführten Benchmarks stammen aus Rivets eigenen Materialien. Die Benchmarks der secure-exec-Bibliothek (die granulärste Schicht) sind unabhängig reproduzierbar — Rivet veröffentlicht die Skripte. Alles andere ist selbst berichtet.

| Perzentil | agentOS | E2B (schnellste Sandbox) | Beschleunigung |
|---|---|---|---|
| Cold Start p50 | 4,8 ms | 440 ms | **92x** |
| Cold Start p95 | 5,6 ms | 950 ms | **170x** |
| Cold Start p99 | 6,1 ms | 3.150 ms | **516x** |

Speicher pro Instanz: **~131 MB** (vollständiger Coding-Agent) vs. **~1.024 MB** (Daytona). Einfache Shell: **~22 MB** vs. ~1 GB.

Self-hosted-Kosten auf Hetzner ARM: **0,0000011 $/Sekunde**. Vergleichen Sie das mit Daytona bei 0,0504 $/vCPU-Stunde: **17x günstiger**. Bei voller Self-hosted-Auslastung sind die Kosten in einer völlig anderen Liga.

Dies sind die Self-hosted-Zahlen. Rivet Cloud beginnt bei **20 $/Monat** für den verwalteten Tier.

## Wettbewerbslandschaft

agentOS konkurriert nicht mit Modal (serverloses GPU, ein anderes Problem), und es konkurriert nicht wirklich mit E2B oder Daytona — es ist darauf ausgelegt, sie zu ergänzen. Die Sandbox-Mount-Erweiterung macht die Beziehung explizit: Sie verwenden agentOS für leichte Arbeit, und starten bei Bedarf eine Sandbox.

Echte Konkurrenz: Lambda (schlechte Wahl für Agenten — 100 ms+ Cold Starts, keine Agent-Primitiven, 15-Minuten-Ausführungslimits), Cloudflare Workers AI (nur Inference, kein Agent-Runtime).

**Hauptkäufer:** Backend- und Plattformingenieure in Startups, die KI-Agenten-Funktionen entwickeln und eine schnelle, günstige, einbettbare Agent-Infrastruktur in ihrem Node.js-Backend benötigen. NichtSolo-Entwickler (obwohl das kostenlose Apache-2.0-Angebot real ist), und nicht Unternehmen, die HIPAA oder SOC 2 benötigen — agentOS hat diese Zertifizierungen noch nicht.

## Das Unternehmen

Rivet Gaming, Inc. — unterstützt von YC W23 + a16z Speedrun SR002. Gründer Nathan Flurry und Nicholas Kissel. Flurry hat zuvor Infrastruktur für Spiele mit 15M+ MAU und 20k gleichzeitigen Spielern aufgebaut. Das Spieleserver-Erbe ist erkennbar: Das ist Infrastruktur-Denken in großem Maßstab auf Agenten angewendet — Kosten bei Skala, schnelle Ausführung, minimaler Overhead.

Die grundlegende Sandbox-Bibliothek, **secure-exec**, ist separat Open Source. **Rivet Cloud** bietet verwaltetes Hosting (100k Actor-Stunden/Monat kostenlos, kostenpflichtig ab 20 $/Monat). YC- und a16z-Speedrun-Unternehmen erhalten 12 Monate lang 50 % Rabatt.

## Implikationen

Wenn agentOS seine Zahlen in großem Maßstab liefert, steht jeder Sandbox-Anbieter unter Druck. Das Ausführungssubstrat für eine einfache Agent-Aufgabe — Dateioperationen, API-Aufrufe, Scripting — kann von ca. 0,05 $/vCPU-Minute auf 0,0000011 $/Sekunde fallen. Das ist eine 500-fache Kostenreduzierung für den Runtime, nicht für das LLM.

Für OpenClaw, Hermes und jedes Agent-Framework: Die V8-Isolate-Architektur ist das, was es zu beobachten gilt. Selbst wenn Sie agentOS nicht direkt übernehmen, sind das „Host Tools"-Muster (direkte Funktionsaufrufe, kein HTTP-Auth), das Actor-per-Session-Modell und der hybride Sandbox-Ansatz architektonische Ideen, die es wert sind, absorbiert zu werden.

ACP vs. MCP ist eine separate und längerfristige Auseinandersetzung. MCP hat den Mindsshare. ACP ist architektonisch sauberer. Die LSP-Parallele sollte man im Hinterkopf behalten — die richtige Antwort gewinnt nicht immer am ersten Tag.

## Einschränkungen

Das ist Beta. Nur der **Pi-Agent** ist heute produktionsreif; Claude Code, Codex, OpenCode und Amp sind als „demnächst verfügbar" aufgeführt. Es wurde kein Drittanbieter-Sicherheitsaudit veröffentlicht. Die WASM-POSIX-Schicht ist unvollständig — git und make sind geplant, aber noch nicht ausgeliefert. GitHub hat 1.576 Sterne, was bescheiden ist. Die Architektur ist solide; das Ökosystem ist noch jung.

Das Bild, das diesen Artikel eröffnet, ist eine Leiterplatte. Das fühlte sich passend an: agentOS ist Infrastruktur für Menschen, denen egal ist, was unter der Haube steckt.
