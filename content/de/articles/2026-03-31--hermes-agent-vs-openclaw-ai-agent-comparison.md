---
title: "Hermes Agent vs OpenClaw: Der Open-Source-KI-Agent-Schlagabtausch"
description: "Hermes Agent hat gerade eine native OpenClaw-Migration hinzugefügt. Wir haben beide Plattformen eingehend recherchiert — hier ist alles, was wichtig ist."
date: 2026-03-31
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80"
author: lschvn
tags: ["KI-Agenten", "open source", "hermes-agent", "openclaw", "nousresearch", "selbst-gehostet"]
readingTime: 8
tldr:
  - Hermes Agent ist ein sich selbst verbessernder autonomer Agent von Nous Research mit RL-Trainingsfähigkeiten und tiefer OpenClaw-Migrationsunterstützung
  - OpenClaw ist ein persönlicher KI-Assistent von Peter Steinberger, der in nur zwei Monaten 100.000 GitHub-Sterne erreichte
  - Beide sind MIT-lizenziert, laufen lokal, unterstützen ähnliche Messaging-Plattformen und können über Hermes' Ein-Befehl-Migrationswerkzeug koexistieren
  - Hermes richtet sich an serverseitige autonome Agenten mit Forschungs-/MLOps-Funktionen; OpenClaw eignet sich hervorragend als persönlicher Desktop-Assistent mit mehr Plattformintegrationen
  - Keiner ist strikt „besser" — die Wahl hängt davon ab, ob Sie einen sich selbst verbessernden Forschungsagenten oder einen polierten persönlichen Assistenten möchten
faq:
  - question: Kann ich von OpenClaw zu Hermes Agent wechseln und alles behalten?
    answer: Ja. Hermes Agent verfügt über einen erstklassigen Befehl `hermes claw migrate`, der automatisch SOUL.md, MEMORY.md, USER.md, Skills, API-Schlüssel, Messaging-Einstellungen und TTS-Assets aus Ihrer bestehenden OpenClaw-Installation importiert. Es ist eine interaktive Migration mit Trockenlauf standardmäßig.
  - question: Hat OpenClaw eine Lernschleife wie Hermes?
    answer: Nein. Hermes Agent ist ausdrücklich als sich selbst verbessernder Agent konzipiert — er erstellt Skills aus Erfahrung, erinnert sich daran, Wissen zu speichern, durchsucht vergangene Gespräche und verbessert Skills während der Nutzung. OpenClaw hat starkes Gedächtnis und Skills, verbessert sich aber nicht autonom über die Zeit.
  - question: Welche Plattformen unterstützt jeder?
    answer: OpenClaw unterstützt die größte Auswahl an Messaging-Plattformen (25+ einschließlich iMessage, WeChat, LINE, Matrix und mehr). Hermes unterstützt Telegram, Discord, Slack, WhatsApp, Signal, E-Mail und CLI. Beide unterstützen die wichtigsten westlichen Plattformen, die die meisten Nutzer benötigen.
  - question: Wie sieht es mit den Kosten aus?
    answer: Beide können auf einem 5-Dollar-VPS laufen. Keiner braucht GPU, es sei denn, Sie führen große lokale Modelle aus. Beide funktionieren mit OpenRouter (200+ Modelle), OpenAI, Anthropic und anderen Anbietern — Sie zahlen also für die API-Nutzung zu dem von Ihnen gewählten Satz.
  - question: Ist Hermes Agent nur für Forscher?
    answer: Überhaupt nicht. Obwohl Hermes Forschungsfunktionen wie Batch-Trajektoriengenerierung und RL-Trainingsintegration hat, ist es auch ein vollständig leistungsfähiger täglicher Treiber-Agent. Die Forschungsfunktionen sind optional — wenn Sie die RL-Tools nicht nutzen, funktioniert Hermes genau wie jeder andere Agent.
  - question: Wer sollte Hermes statt OpenClaw verwenden?
    answer: Wenn Sie einen sich selbst verbessernden Agenten möchten, der mit der Zeit besser wird, RL-/Forschungsfähigkeiten benötigt oder das Skills-Ökosystem und die agentskills.io-Kompatibilität von Hermes bevorzugt, wählen Sie Hermes. Wenn Sie die breiteste Plattformunterstützung (besonders iMessage, WeChat, LINE), das native Desktop-Erlebnis bevorzugen oder die Community und Dynamik von OpenClaw mögen, bleiben Sie bei OpenClaw.
---

Im Februar 2026 hat Nous Research einen neuen Befehl für Hermes Agent herausgebracht: `hermes claw migrate`. Führen Sie ihn aus, und Ihre OpenClaw-Installation — jede Gedächtnisdatei, jeder Skill, jeder API-Schlüssel, jede Persona — wird in Sekunden in Hermes gesaugt. Es ist, auf den ersten Blick, ein Migrationswerkzeug. Aber die Existenz des Befehls sagt etwas viel Seltsameres: Die Entwickler von Hermes haben OpenClaw angeschaut, es genug respektiert, um einen nahtlosen Ausstieg für seine Nutzer zu bauen, und haben diesen Ausstieg dann zu einem Verkaufsargument gemacht.

Willkommen im Open-Source-KI-Agentenkrieg.

## Was Ist Hermes Agent?

Hermes Agent ist ein autonomer KI-Agent, der von [Nous Research](https://nousresearch.com) entwickelt wurde, einer Forschungsorganisation für KI-Sicherheit und -Fähigkeiten, deren erklärte Mission es ist, menschliche Rechte und Freiheiten durch Open-Source-Sprachmodelle voranzubringen. Nous Research ist vielleicht am besten bekannt für die Hermes- und Nomos-Modellfamilien, aber Hermes Agent ist etwas Neues: ein vollständig autonomer Agent mit einer echten geschlossenen Lernschleife.

Was bedeutet das in der Praxis? Im Gegensatz zu einem Chatbot, der jede Sitzung zurückgesetzt wird, erstellt Hermes Skills aus Erfahrung, erinnert sich daran, Wissen zu bewahren, durchsucht seine eigenen vergangenen Gespräche nach relevantem Kontext und baut ein tieferes Modell davon auf, wer Sie über Sitzungen hinweg sind. Skills verbessern sich während der Nutzung. Der Agent führt nicht nur Aufgaben aus — er wird besser darin, sie auszuführen.

Die technische Architektur basiert auf einem modularen Python-Codebase mit unterschiedlichen Subsystemen: der Agentenschleife (`AIAgent` in `run_agent.py`), einem Prompt-Assembly- und Komprimierungssystem, einem Provider-Laufzeit-Resolver, der OpenRouter, OpenAI, Anthropic, Nous Portal, z.ai/GLM, Kimi/Moonshot und MiniMax unterstützt, einer Werkzeug-Laufzeit mit über 40 eingebauten Werkzeugen, einem Messaging-Gateway für Plattformadapter und einem RL-/Umgebungs-Subsystem für Trajektoriengenerierung und Trainingsdaten.

Die Installation ist ein einzelner curl-Befehl auf Linux, macOS oder WSL2. Sechs Terminal-Backends sind verfügbar: lokal, Docker, SSH, Singularity, Modal und Daytona — die letzten beiden bieten serverloses Persistenz, wobei die Umgebung des Agenten im Leerlauf hiberniert und bei Bedarf zu praktisch null Kosten aufwacht. Sie können es auf einem 5-Dollar-VPS oder einem GPU-Cluster ausführen.

Das Skills-System ist kompatibel mit dem offenen [agentskills.io](https://agentskills.io)-Standard. Skills verwenden ein progressives Offenlegungs muster, um die Token-Nutzung zu minimieren, können bedingt basierend auf verfügbaren Toolsets aktiviert werden und unterstützen externe Verzeichnisse, sodass Ihre Skills über mehrere Agenten-Installationen hinweg funktionieren.

## Was Ist OpenClaw?

OpenClaw ist ein persönlicher KI-Assistent, erstellt von Peter Steinberger, einem bekannten Entwickler und Gründer von PSPDFKit. Er wurde im November 2025 unter dem Namen Moltbot gestartet (später umbenannt in Clawdbot, dann OpenClaw nach einer Markenanfrage von Anthropic), und er explodierte regelrecht. Das GitHub-Repository erreichte 100.000 Sterne in nur zwei Monaten — ein Tempo, das es zu einem der am schnellsten wachsenden Open-Source-Projekte der letzten Zeit machte. Wired, CNET, Axios und Forbes berichteten darüber. Sicherheitsforscher gaben angemessene Warnungen bezüglich autonomer Agenten mit echtem Messaging-Zugang heraus. Die Community baute Skills, teilte Workflows und begann, ihre Unternehmen damit zu führen.

OpenClaw ist in TypeScript gebaut, läuft als lokaler First-Entry-Gateway-Daemon und verbindet sich mit einer beeindruckenden Bandbreite an Messaging-Plattformen: WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (via BlueBubbles), IRC, Microsoft Teams, Matrix, Feishu, LINE, Mattermost, Nextcloud Talk, Nostr, Synology Chat, Tlon, Twitch, Zalo, WeChat und WebChat. Die macOS-App fügt eine Menüleisten-Kontrollebene, Voice Wake, Talk-Mode-Overlay und Fern-Gateway-Steuerung hinzu. iOS- und Android-Begleit-Apps bringen Kamera, Bildschirmaufnahme, Standort und Benachrichtigungen in das Werkzeugset des Agenten.

Die Architektur zentriert sich auf eine Gateway-WebSocket-Kontrollebene bei `ws://127.0.0.1:18789`, mit einer Pi-Agent-Laufzeit im RPC-Modus, einem Multi-Channel-Posteingang, Session-Routing und einer Skills-Plattform mit gebündelten, verwalteten und Workspace-Level-Skills. OpenClaw hat auch das Moltbook-Konzept Pionierarbeit geleistet — eine soziale Schicht, in der OpenClaw-Agenten miteinander in autonomen Sub-Communities, sogenannten Submolts, interagieren, aufkommende Verhaltensweisen erzeugen, die bereits KI-Debatten über Bewusstsein und selbst-erfundene Religionen hervorgebracht haben.

## Direkter Vergleich

### Kernphilosophie

Der tiefgreifendste Unterschied ist philosophisch. Hermes Agent ist als **sich selbst verbessernder autonomer Agent** konzipiert — die Lernschleife ist das Produkt. Der Agent reflektiert über seine eigene Leistung, erstellt prozedurale Erinnerungen aus Erfahrung und wird messbar leistungsfähiger, je länger er läuft. OpenClaw ist als **persönlicher KI-Assistent** konzipiert — ein leistungsstarkes, rund um die Uhr verfügbares Werkzeug, das Dinge für Sie erledigt, mit starkem Gedächtnis und Skills, aber ohne die geschlossene Rückkopplungsschleife, die es ihm ermöglicht, sich wirklich zu verbessern.

Dieser Unterschied wird mit der Zeit wichtiger. Nach sechs Monaten mit Hermes haben Sie einen Agenten, der Ihre Codebasis, Ihre Präferenzen, Ihre Workflows gelernt und seine eigenen Skills iteriert hat, um Ihnen besser zu dienen. Nach sechs Monaten mit OpenClaw haben Sie einen sehr gut konfigurierten Assistenten. Beide sind nützlich; sie sind nicht dasselbe.

### Plattformabdeckung

OpenClaw gewinnt bei der reinen Plattformanzahl. Es verbindet sich mit über 25 Messaging-Plattformen, einschließlich Plattformen, die Hermes nicht unterstützt, wie iMessage, WeChat, LINE, Matrix und Nostr. Wenn Sie Ihren persönlichen Assistenten über WeChat oder iMessage laufen lassen müssen, ist OpenClaw derzeit Ihre einzige Option von den beiden.

Hermes deckt die großen westlichen Plattformen ab — Telegram, Discord, Slack, WhatsApp, Signal, E-Mail und CLI — was 95% dessen abdeckt, was die meisten Nutzer tatsächlich brauchen. Es fügt auch Home-Assistant-Integration hinzu, die OpenClaw nativ nicht bietet.

### Gedächtnis und Lernen

Hermes hat begrenztes kuratiertes Gedächtnis (2.200 Zeichen für die Notizen des Agenten, 1.375 Zeichen für das Benutzerprofil) mit automatischer Konsolidierung bei Erreichen der Kapazität. Der Agent verwaltet sein eigenes Gedächtnis über ein Gedächtnis-Werkzeug, fügt Einträge hinzu, ersetzt oder entfernt sie. Es integriert auch Honcho für dialektische Benutzermodellierung — ein sophistizierterer Ansatz zur Verfolgung von Benutzerpräferenzen und -kontext über die Zeit.

OpenClaw verwendet einen ähnlichen dateibasierten Gedächtnisansatz (MEMORY.md, USER.md), der zu Sitzungsbeginn in den System-Prompt injiziert wird. Die Gedächtnisstruktur ist vergleichbar, aber ohne die Selbstkuratierung und Kapazitätsverwaltung, die Hermes implementiert. OpenClaw hat sich in der Praxis als robust erwiesen — Nutzer berichten von ausgezeichnetem Kontexterhalt — aber es hat nicht Hermes' explizite Selbstverbesserungsschleife.

### Skills-Ökosystem

Beide unterstützen Slash-Command-Skills mit Bundle-/Managed-/Workspace-Stufen. Hermes-Skills sind kompatibel mit dem offenen agentskills.io-Standard, was sie über Tools hinweg portierbar macht, die die Spezifikation unterstützen. OpenClaw-Skills sind innerhalb seiner Community teilbar, aber bestäuben sich nicht so leicht über. Hermes unterstützt auch externe Skills-Verzeichnisse, sodass Sie es auf ein gemeinsam genutztes `~/.agents/skills/` verweisen können, das von anderen Tools verwendet wird.

### Ausführungsumgebungen

Hermes bietet sechs Terminal-Backends (lokal, Docker, SSH, Singularity, Modal, Daytona). OpenClaw läuft lokal und unterstützt Docker. Hermes' serverlose Backends (Modal, Daytona) sind ein echtes Unterscheidungsmerkmal für kostenbewusste Nutzer — der Agent hiberniert im Leerlauf und wacht bei Bedarf auf, mit praktisch null Kosten zwischen den Sitzungen.

### Forschungs- und MLOps-Fähigkeiten

Hier ist Hermes in einer anderen Kategorie. Gebaut von Modell-Trainern bei Nous Research, verfügt Hermes über Batch-Trajektoriengenerierung, Atropos-RL-Umgebungsintegration, Trajektorie-Komprimierung für das Training von Tool-Calling-Modellen und ein vollständiges Umgebungs-Framework für Evaluation und SFT-Datengenerierung. Wenn Sie die Interaktionsdaten Ihres Assistenten zum Trainieren oder Feintunen von Modellen verwenden möchten, hat Hermes die Infrastruktur dafür. OpenClaw hat kein Äquivalent — es ist ein Verbraucherprodukt, keine Forschungsplattform.

### Preis

Beide können auf einem 5-Dollar-VPS mit minimalen Ressourcen laufen. Beide funktionieren mit OpenRouter, das über 200 Modelle zu wettbewerbsfähigen Preisen anbietet. Keines berechnet die Software selbst. Die Kosten sind Ihre API-Nutzung. Wenn Sie große lokale Modelle mit GPU ausführen, steigen die Kosten — aber für typische Nutzung mit Cloud-API-Anbietern sind beide effektiv kostenlos zu betreiben.

### Der OpenClaw-Migrationspfad

Dies ist der interessanteste Schachzug im Vergleich. `hermes claw migrate` importiert nicht nur Dateien — es importiert Ihre SOUL.md-Persona, alle Gedächtniseinträge, benutzergenerierte Skills, Befehls-Allowlisten, Messaging-Plattform-Konfigs, API-Schlüssel (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs), TTS-Assets und optional Ihre AGENTS.md-Workspace-Anweisungen.

Die Migration ist interaktiv, standardmäßig Trockenlauf, und unterstützt selektiven Import. Es ist ein klares Signal, dass Nous Research OpenClaw-Nutzer als potenzielle Hermes-Nutzer sieht und die Onboarding-Friktion absichtlich niedrig gehalten hat. Die Tatsache, dass sie das gebaut haben — und als erstklassige Funktion ausgeliefert haben — deutet darauf hin, dass sie nicht nur mit OpenClaw konkurrieren, sondern speziell dessen Community umwerben.

## Das Elefant im Raum: Sollten OpenClaw-Nutzer Wechseln?

Nicht unbedingt, und wahrscheinlich noch nicht. Hier ist warum.

OpenClaw hat zwei Monate Vorsprung, 100.000 GitHub-Sterne an Community-Schwung, breitere Plattformunterstützung, ein ausgereiftes macOS-/iOS-/Android-App-Ökosystem und eine aktive soziale Moltbook-Schicht, für die Hermes nichts Gleichwertiges hat. Für einen Nutzer, der mit OpenClaw zufrieden ist, bedeutet die Migration zu Hermes, Community-Schwung und Plattformbreite gegen Selbstverbesserung und Forschungsfunktionen einzutauschen, die die meisten Nutzer nicht nutzen werden.

Der Fall für Hermes ist am stärksten, wenn: Sie einen Agenten möchten, der sich wirklich über die Zeit verbessert; Sie an RL-Training oder Trajektoriengenerierung interessiert sind; Sie die Modellflexibilität von Hermes bevorzugen (besonders die Nous-Portal-Integration); oder Sie das agentskills.io-Ökosystem überzeugend finden. Der Fall für OpenClaw ist am stärksten, wenn: Sie auf iMessage, WeChat oder andere Plattformen angewiesen sind, die Hermes nicht unterstützt; Sie in die OpenClaw-Community und Moltbook investiert sind; oder Sie einfach das polierteste persönliche Assistenten-Erlebnis ohne Forschungs-Overhead möchten.

Der Migrationspfad existiert genau, weil die Entwickler von Hermes glauben, dass einige OpenClaw-Nutzer wechseln möchten. Sie haben es schmerzlos gemacht. Ob Sie tatsächlich wechseln möchten, ist eine Frage der Prioritäten, nicht der Fähigkeit.

## Größere Implikationen

Das Aufkommen von Hermes neben OpenClaw, AutoGen, LangChain Agents, CrewAI, Claude Cowork und Cursor Composer ist Beweis für ein fragmentiertes, aber schnell reifendes Open-Source-Agenten-Ökosystem. Diese Tools versuchen nicht alle dasselbe. AutoGen (Microsoft) zielt auf Enterprise-Multi-Agent-Workflows ab. LangChain zielt auf Entwickler ab, die LLM-Anwendungen bauen. CrewAI konzentriert sich auf rollenbasierte Multi-Agent-Kollaboration. Claude Cowork zielt auf Wissensarbeitsautomatisierung ab. Cursor Composer ist IDE-gebunden. OpenClaw und Hermes sind sich am ähnlichsten — beide positionieren sich als persönliche/serverseitige autonome Agenten — aber mit bedeutsam unterschiedlichen Philosophien.

Das Zusammenleben von Hermes und OpenClaw, und die Tatsache, dass Hermes native OpenClaw-Migration gebaut hat, anstatt seinen Konkurrenten zu ignorieren, signalisiert eine gesündere Dynamik als Nullsummenwettbewerb. Nutzer gewinnen, wenn Tools interoperabel sind. Das Migrationswerkzeug ist Beweis dafür, dass beide Communities das anerkennen.

Die Selbstverbesserungsfrage ist die interessanteste ungelöste Frage in diesem Bereich. Hermes' geschlossene Lernschleife ist der expliziteste Versuch, einen Agenten zu bauen, der sich wirklich über die Zeit selbst verbessert. Ob es gut genug funktioniert, um zu mattern — und ob OpenClaw oder andere ähnliche Fähigkeiten hinzufügen werden — ist eine der interessanteren Fragen für die nächsten 12 Monate der KI-Agenten-Entwicklung.

## Wer Sollte Was Verwenden

**Wählen Sie Hermes Agent, wenn:**
- Sie einen sich selbst verbessernden Agenten möchten, der mit der Zeit besser wird
- Sie an RL-Training, Trajektoriengenerierung oder Modell-Finetuning interessiert sind
- Sie das offene agentskills.io-Standard-Ökosystem bevorzugen
- Sie serverlose Ausführung mit nahezu null Leerlaufkosten möchten
- Sie sich mit den großen Messaging-Plattformen wohlfühlen (Telegram, Discord, Slack, WhatsApp, Signal)
- Sie Nous Portal oder eine große Auswahl an Modell-Anbietern nutzen möchten

**Wählen Sie OpenClaw, wenn:**
- Sie iMessage, WeChat, LINE, Matrix oder andere ungewöhnlichere Plattformen benötigen
- Sie das native macOS-/iOS-/Android-App-Erlebnis möchten
- Sie Teil der Moltbook-Agenten-Social-Layer sind oder daran interessiert sind
- Sie Community-Schwung und den Status des am schnellsten wachsenden Projekts schätzen
- Sie TypeScript-basierte Tools bevorzugen
- Sie die breiteste Palette an Verbraucher-Plattform-Integrationen standardmäßig möchten

Beide sind MIT-lizenziert, beide laufen lokal, beide funktionieren auf einem 5-Dollar-VPS, und beide werden aktiv von engagierten Teams weiterentwickelt. Die wahre Antwort ist, dass der Open-Source-KI-Agenten-Raum groß genug für beide ist — und die Existenz von Hermes' Migrationswerkzeug ist Beweis dafür, dass ihre Schöpfer es auch wissen.
