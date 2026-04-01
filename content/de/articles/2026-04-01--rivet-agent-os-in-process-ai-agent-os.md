---
title: "Rivet Agent OS: The In-Process OS That Runs AI Agents 500x Cheaper Than Sandboxes"
description: "YC and a16z-backed Rivet built an agent runtime on V8 isolates and WebAssembly that cold-starts in 4.8ms — 92x faster than E2B, at 1/17th the cost. We deeply researched the architecture, the benchmarks, and what it means for every agent framework."
date: 2026-04-01
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop"
author: lschvn
tags: ["AI agents", "Rivet", "WebAssembly", "V8", "sandbox", "infrastructure", "open source"]
readingTime: 9
tldr:
  - "Rivet Agent OS runs AI agents in 4.8ms cold start — 92x faster than E2B sandboxes at 1/17th the cost, powered by V8 isolates and WebAssembly."
  - "Built by YC W23 + a16z backed founders on game-infrastructure DNA, agentOS is literally an in-process OS kernel: virtual filesystem, process table, pipes, PTYs, and network stack."
  - "Apache 2.0 open source + $20/mo cloud tier. Primary buyer: backend engineers at startups building AI agent features — not solo devs."
faq:
  - question: "How does agentOS achieve 92x faster cold starts than E2B?"
    answer: "agentOS uses V8 isolates — the same sandboxing technology in Chrome — running inside the host process. E2B boots a full Linux VM. No VM to boot means p50 cold start of 4.8ms vs 440ms. Memory footprint drops to ~131MB vs ~1GB."
  - question: "Is agentOS a replacement for E2B or Daytona sandboxes?"
    answer: "No — and that's the point. agentOS explicitly offers a sandbox mounting extension so you can spin up E2B on demand when workloads need a real browser or native binaries. agentOS wins for the 80% of agent tasks that don't need a full OS."
  - question: "ACP vs MCP — which protocol wins?"
    answer: "MCP (Anthropic) has overwhelming mindshare and adoption. ACP (Agent Communication Protocol) is architecturally superior — it defines sessions, transcripts, reconnection, and universal agent formats. Think LSP (language servers) — it took 10 years to win despite being obviously right. ACP is early."
  - question: "Should startups adopt agentOS today?"
    answer: "For production agent features: yes if you're a backend/platform engineer building in Node.js. For general use: it's beta, only Pi agent is production-ready, and there's no third-party security audit yet. The architecture is sound; the ecosystem is nascent."
  - question: "What can't agentOS do?"
    answer: "No browser automation (needs a real OS for that), no GPU workloads, no native Linux binaries outside WASM targets, no macOS/Windows agents. The WASM POSIX layer is partial — git and make are planned but not yet shipped."
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
