---
title: "Anthropic's Project Glasswing: When AI Finds Zero-Days Faster Than Humans Can Count Them"
description: "In one month, Claude Mythos² Preview found thousands of zero-day vulnerabilities that survived decades of human review — in OpenBSD, the Linux kernel, FFmpeg, and every major browser. We dug into the technical details, the industry coalition, and what it means for every security team on the planet."
date: 2026-04-07
image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop"
author: lschvn
tags: ["AI", "cybersecurity", "Anthropic", "zero-day", "vulnerabilities", "Project Glasswing"]
readingTime: 8
tldr:
  - "Claude Mythos² Preview found thousands of zero-day vulnerabilities in one month — including a 27-year-old OpenBSD bug and a 16-year-old FFmpeg flaw that survived 5 million automated tests."
  - "Project Glasswing brings together Apple, Microsoft, Google, AWS, Cisco, CrowdStrike, JPMorganChase and 11 others to coordinate AI-powered vulnerability fixes across critical infrastructure before attacks can weaponize these capabilities."
  - "The attack timeline has collapsed from months to minutes. Non-experts at Anthropic woke up to working exploits written overnight by Mythos² — with no security training."
faq:
  - question: "What is Project Glasswing?"
    answer: "A 13-company coalition (AWS, Anthropic, Apple, Cisco, CrowdStrike, Google, JPMorganChase, Microsoft, NVIDIA, Palo Alto Networks, and others) launched on April 7, 2026 to coordinate AI-powered vulnerability finding across the world's most critical software infrastructure. Anthropic is committing $100M in API credits and $4M to open-source security organizations."
  - question: "What makes Claude Mythos² different from Claude Opus?"
    answer: "Mythos² is a specialized frontier model trained for cybersecurity tasks. On CyberGym (vulnerability reproduction), it scores 83.1% vs Opus 4.6's 66.6%. On SWE-bench (software engineering), it hits 94.6% vs 91.3%. It finds and exploits zero-days autonomously — something Opus cannot do reliably."
  - question: "What were the most alarming vulnerabilities found?"
    answer: "A 27-year-old OpenBSD remote crash (no authentication required), a 16-year-old FFmpeg bug missed by 5 million automated tests, a Linux kernel privilege escalation (user to root), and a FreeBSD NFS exploit that granted root to unauthenticated users. Every major OS and browser was affected."
  - question: "Why isn't Mythos² being released publicly?"
    answer: "Because the same capabilities that find vulnerabilities also write working exploits. Anthropic explicitly states it would be irresponsible to release a model that non-experts can use to generate working zero-day exploits overnight. The model is only available to Glasswing partners and select open-source maintainers."
  - question: "What does this mean for OpenClaw users and AI agent operators?"
    answer: "Two things: First, AI agents with system access are now part of the attack surface — Mythos²-style capabilities will eventually proliferate, meaning autonomous agents need governance controls. Second, the vulnerability landscape is shifting faster than human-led security teams can track. Managed AI oversight (what Alizé provides) becomes critical infrastructure."
---

Ein Bug überlebte 27 Jahre menschlicher Sicherheitsforschung. Tausende CVEs wurden eingereicht und gepatcht. Unzählige Auditoren, Penetrationstester und unabhängige Forscher untersuchten den Code. Dann, innerhalb weniger Minuten, fand ein KI-Modell einen Remote-Crash-Bug in OpenBSD — ohne jegliche Authentifizierung erforderlich. Innerhalb weniger Tage war der Exploit geschrieben und der Patch live. Das ist die Geschichte von Claude Mythos² Preview und Project Glasswing.

Anthropic hatte nicht vorgehabt, ein Angriffsmodell für die Sicherheitsforschung zu entwickeln. Das Unternehmen gibt an, man habe die Sicherheit von KI-Systemen und die Fähigkeiten von Modellen erforscht, als Forscher etwas Alarmierendes bemerkten: Dieselben Reasoning-Fähigkeiten, die Frontier-Modelle für Softwareentwicklung nützlich machen, machen sie auch außergewöhnlich effektiv darin, Software-Schwachstellen zu finden — und auszunutzen. Nicht theoretisch. In der Praxis. Funktionierende Exploits. Über Nacht.

## Die Entdeckung

Die Zahlen aus Anthropics internem Red-Team-Test sind deutlich. Auf CyberGym, einem Benchmark zur Prüfung der Fähigkeit eines Modells, bekannte Schwachstellen zu reproduzieren, erzielte Claude Mythos² 83,1 %. Claude Opus 4.6 erzielte 66,6 %. Die Lücke ist groß. Auf SWE-bench Verified — einem Test für echte Softwareentwicklungsfähigkeiten — erreichte Mythos² 94,6 % gegenüber Opus 4.6s 91,3 %. Auf Terminal-Bench, das die Fähigkeit eines Modells misst, in einer Shell-Umgebung zu operieren und komplexe Terminal-Operationen zu verketten, erzielte Mythos² 92,1 %. Dies sind keine bloßen Benchmarks. Sie zeichnen das Bild eines Modells, das zuverlässig das tun kann, was Sicherheitsforscher tun — Bugs finden, Code-Pfade verstehen und funktionierende Exploits schreiben — ohne dass es aufgefordert wird, sich ethisch oder sicher zu verhalten.

In einem Monat koordinierter Tests fand Mythos² Zero-Day-Schwachstellen in nahezu allen großen Betriebssystemen und Browsern, die heute im Einsatz sind.

Der älteste war ein 27 Jahre alter Remote-Crash-Bug in OpenBSD, der keine Authentifizierung erforderte. Er befand sich seit 1999 im Codebase, unsichtbar für Jahrzehnte menschlicher Prüfer. Der technisch beunruhigendste war ein 16 Jahre alter Fehler in FFmpeg — der allgegenwärtigen Multimedia-Codec-Bibliothek, die in allem verwendet wird, von Browsern über Videokonferenzplattformen bis hin zu mobilen Betriebssystemen. Fünf Millionen automatisierte Tests waren im Laufe der Jahre gegen die FFmpeg-Codebase gelaufen. Mythos² fand den Bug trotzdem, ohne besondere Anweisung oder Zugang über das hinaus, was jeder Entwickler hätte.

Anthropics eigene Ingenieure — Nicht-Experten ohne formale Sicherheitsausbildung — erhielten Zugang und wurden gebeten, über Nacht zu sehen, was Mythos² leisten konnte. Sie wachten mit vollständigen, funktionierenden Exploits auf. Remote Code Execution. Keine Anleitung. Keine Steuerung. Das Modell hatte die Schwachstelle identifiziert, den Exploit-Pfad verstanden und eigenständig funktionalen Proof-of-Concept-Code geschrieben.

Weitere Ergebnisse umfassten eine Linux-Kernel-Rechteausweitung, die einem Standardbenutzerkonto das Escalieren zu Root ermöglichte, einen Browser-JIT-Compiler-Heap-Spray in Kombination mit einer Sandbox-Escape (vier separate Schwachstellen miteinander verkettet) und einen FreeBSD-NFS-Remote-Root-Exploit, aufgebaut auf einer 20-Gadget-ROP-Kette (Return-Oriented Programming). Alle großen Browser und Betriebssysteme waren betroffen. Alle Schwachstellen wurden offengelegt und gepatcht.

## Die Koalition

Am 7. April 2026 kündigte Anthropic Project Glasswing an — eine formelle Branchen-Koalition, die darauf ausgerichtet ist, zu handeln, was das Red Team gefunden hatte. Dreizehn Gründungspartner tragen die Initiative: AWS, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, die Linux Foundation, Microsoft, NVIDIA und Palo Alto Networks. Apple ist der auffälligste Name auf der Liste — ein Unternehmen, das in der öffentlichen Positionierung zu künstlicher Intelligenz bemerkenswert zurückhaltend war, nun aber formal Teil der bedeutendsten KI-Cybersicherheits-Partnerschaft der Branchengeschichte ist.

Anthropic verpflichtet sich zu 100 Millionen Dollar an API-Gutschriften für die Initiative und zusätzlich 4 Millionen Dollar an direkter Förderung für Open-Source-Sicherheitsorganisationen, darunter das Alpha-Omega Project, die Open Source Security Foundation (OpenSSF) und die Apache Software Foundation. Nach der Ankündigung ist die Glasswing-API zu 25 Dollar pro Million Tokens für Kontextfenster und 125 Dollar pro Million Tokens für Generierung bepreist — ein bewusst zugänglicher Preis, der darauf ausgelegt ist, gefährdete Open-Source-Projekte abzudecken, nicht Einnahmen zu maximieren.

Die Partner erhalten nicht nur Zugang zu Mythos². Sie tragen Findings bei, koordinieren die Offenlegung und integrieren das Modell in ihre eigenen Sicherheits-Pipelines. Mehr als 40 weitere Organisationen hatten zum Startzeitpunkt Zugang zum System erhalten oder waren mit Zugang ausgestattet worden — von akademischen Sicherheitslabors bis hin zu mittelständischen Softwareunternehmen mit kritischer Infrastruktur-Exposition.

## Die Angriffszeitachse ist kollabiert

Das Fenster zwischen Schwachstellenentdeckung und Exploit-Verfügbarkeit wurde historisch in Monaten gemessen. Sicherheitsforscher finden einen Bug, verifizieren ihn, schreiben einen Proof-of-Concept, koordinieren mit dem Anbieter und warten auf einen Patch — ein Prozess, der selbst unter koordinierten Offenlegungsprogrammen routinemäßig 90 bis 180 Tage dauert. Mythos² folgt dieser Zeitachse nicht. Das Modell fand, verifizierte und produzierte funktionierenden Exploit-Code für mehrere kritische Schwachstellen in einer einzigen Sitzung.

Dies ist keine theoretische Beschleunigung. Es ist ein praktischer Kollaps des Bedrohungsfensters. Verteidiger, die previously monatelang Zeit zum Patchen hatten, haben nun Minuten — oder höchstens Stunden — bevor ein fähiger Akteur einen operativen Exploit produzieren könnte. Die Dual-Use-Natur der Technologie bedeutet, dass diese Fähigkeit nicht auf eine Forschungsumgebung beschränkt ist. Sie ist live, zugänglich und skalierbar.

## Was das für die Branche bedeutet

Für Betreiber von KI-Agenten — einschließlich Plattformen wie OpenClaw, die autonomen Systemen dauerhaften Zugriff auf Dateien, Code und Netzwerkressourcen gewähren — sind die Implikationen direkt. KI-Agenten sind nicht nur Produktivitätswerkzeuge. Sie sind Ausführungsumgebungen. Wenn ein Modell wie Mythos² autonom Schwachstellen finden und ausnutzen kann, dann ist jedes ausreichend fähige Modell in einer permissiven Umgebung potenziell ein Vektor für sowohl offensive als auch defensive Handlungen. Dieselbe Fähigkeit, die Ihr System patcht, kann im falschen Kontext oder mit der falschen Aufforderung darauf angreifen.

Für Sicherheitsteams ist das Bild komplexer. KI-gestützte Schwachstellenfindung ist schneller als menschlich geführte Penetrationstests. Organisationen, die diese Fähigkeiten in ihre Red-Team-Operationen integrieren, werden mehr Bugs finden, schneller. Aber das werden auch ihre Gegner. Das Wettrüsten zwischen Angriff und Verteidigung hat sich in eine Richtung geneigt, die neue Governance-Frameworks erfordert — nicht nur für Modelle wie Mythos², sondern für das breitere Ökosystem leistungsfähiger KI-Systeme, die folgen werden.

Anthropic veröffentlicht Mythos² nicht öffentlich und nennt als Begründung das klare und unmittelbare Risiko, dass Nicht-Experten es nutzen könnten, um funktionierende Exploits ohne Offenlegungsinfrastruktur zu generieren. Das Modell ist für Glasswing-Partner und eine kuratierte Auswahl von Open-Source-Maintainern verfügbar. Diese Entscheidung spiegelt echten Ernst in Bezug auf das Dual-Use-Problem wider. Aber sie löst nicht die zugrunde liegende Dynamik: Die Angriffszeitachse ist kollabiert, die Werkzeuge sind real, und die Branche beginnt erst zu verstehen, was das bedeutet.

**Vorbehalte:** Nur eine Teilmenge der von Mythos² entdeckten Schwachstellen wurde öffentlich offengelegt; Anthropic schätzt, dass mehr als 99 % der Ergebnisse des Modells noch nicht offengelegt sind, während auf koordinierte Patches der Anbieter gewartet wird. Das Modell ist nicht öffentlich verfügbar. Seine Wirksamkeit hängt teilweise vom Zugang zu Quellcode und Binärdateien ab — es funktioniert weniger zuverlässig bei Black-Box-Zielen ohne Code-Sichtbarkeit. Diese Faktoren schränken die unabhängige Überprüfung einiger Behauptungen in diesem Bericht ein.
