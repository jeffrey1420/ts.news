---
title: "Anthropics Project Glasswing: Wenn KI Zero-Days schneller findet, als Menschen sie zählen können"
description: "In einem Monat hat Claude Mythos Preview tausende Zero-Day-Schwachstellen gefunden, die jahrzehntelanger menschlicher Prüfung standhielten, in OpenBSD, dem Linux-Kernel, FFmpeg und jedem großen Browser. Wir haben die technischen Details, die Branchenkoalition und die Folgen für jede Sicherheits-Division des Planeten untersucht."
date: 2026-04-07
image: "/images/heroes/2026-04-07--anthropic-project-glasswing-ai-finds-zero-days-faster-than-humans.png"
author: lschvn
tags: ["security", "ai"]
readingTime: 8
tldr:
  - "Claude Mythos Preview fand in einem Monat tausende Zero-Day-Schwachstellen, darunter einen 27 Jahre alten OpenBSD-Bug und eine 16 Jahre alte FFmpeg-Schwachstelle, die 5 Millionen automatisierte Tests überstanden."
  - "Project Glasswing bringt Apple, Microsoft, Google, AWS, Cisco, CrowdStrike, JPMorganChase und 11 weitere Akteure zusammen, um KI-gestützte Schwachstellen-Fixes für kritische Infrastruktur zu koordinieren, bevor Angriffe diese Fähigkeiten als Waffe einsetzen können."
  - "Die Angriffs-Zeitachse ist von Monaten auf Minuten kollabiert. Nicht-Experten bei Anthropic wachten über Nacht zu funktionierenden Exploits auf, die von Mythos geschrieben wurden, ohne Sicherheits-Training."
faq:
  - question: "Was ist Project Glasswing?"
    answer: "Eine 13-Unternehmen-Koalition (AWS, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, die Linux Foundation, Microsoft, NVIDIA und Palo Alto Networks), die am 7. April 2026 antrat, um KI-gestützte Schwachstellensuche in der weltweit kritischsten Software-Infrastruktur zu koordinieren. Anthropic stellt 100 Mio. $ an API-Guthaben und 4 Mio. $ für Open-Source-Sicherheitsorganisationen bereit."
  - question: "Was unterscheidet Claude Mythos von Claude Opus?"
    answer: "Mythos ist ein spezialisiertes Frontier-Modell für Cybersicherheits-Aufgaben. Auf CyberGym (Schwachstellen-Reproduktion) erreicht es 83,1 % gegen Opus 4.6 mit 66,6 %. Auf SWE-bench (Software-Engineering) kommt es auf 94,6 % gegen 91,3 %. Es findet und nutzt Zero-Days autonom aus, etwas, das Opus nicht zuverlässig kann."
  - question: "Was waren die alarmierendsten gefundenen Schwachstellen?"
    answer: "Ein 27 Jahre alter OpenBSD-Remote-Crash (keine Authentifizierung nötig), ein 16 Jahre alter FFmpeg-Bug, der 5 Millionen automatisierten Tests entging, eine Linux-Kernel-Privilegienausweitung (vom User zu Root) und ein FreeBSD-NFS-Exploit, der nicht authentifizierten Usern Root-Zugriff gab. Jedes große OS und jeder große Browser war betroffen."
  - question: "Warum wird Mythos nicht öffentlich veröffentlicht?"
    answer: "Weil dieselben Fähigkeiten, die Schwachstellen finden, auch funktionierende Exploits schreiben. Anthropic sagt explizit, es wäre verantwortungslos, ein Modell zu veröffentlichen, mit dem Nicht-Experten über Nacht funktionierende Zero-Day-Exploits erzeugen können. Das Modell ist nur für Glasswing-Partner und ausgewählte Open-Source-Maintainer verfügbar."
  - question: "Was bedeutet das für OpenClaw-Nutzer und KI-Agent-Betreiber?"
    answer: "Zwei Dinge: Erstens sind KI-Agenten mit Systemzugriff nun Teil der Angriffsfläche. Mythos-artige Fähigkeiten werden sich nach und nach verbreiten, und autonome Agenten brauchen Governance-Kontrollen. Zweitens verschiebt sich die Schwachstellen-Landschaft schneller, als menschliche Sicherheits-Teams folgen können. Verwaltete KI-Aufsicht (wie Alizé sie bietet) wird zur kritischen Infrastruktur."
---

Ein Bug überlebte 27 Jahre menschlicher Sicherheitsforschung. Tausende CVEs wurden eingereicht und gepatcht. Unzählige Auditoren, Penetrationstester und unabhängige Forscher untersuchten den Code. Dann, innerhalb weniger Minuten, fand ein KI-Modell einen Remote-Crash-Bug in OpenBSD — ohne jegliche Authentifizierung erforderlich. Innerhalb weniger Tage war der Exploit geschrieben und der Patch live. Das ist die Geschichte von Claude Mythos Preview und Project Glasswing.

Anthropic hatte nicht vorgehabt, ein Angriffsmodell für die Sicherheitsforschung zu entwickeln. Das Unternehmen gibt an, man habe die Sicherheit von KI-Systemen und die Fähigkeiten von Modellen erforscht, als Forscher etwas Alarmierendes bemerkten: Dieselben Reasoning-Fähigkeiten, die Frontier-Modelle für Softwareentwicklung nützlich machen, machen sie auch außergewöhnlich effektiv darin, Software-Schwachstellen zu finden — und auszunutzen. Nicht theoretisch. In der Praxis. Funktionierende Exploits. Über Nacht.

## Die Entdeckung

Die Zahlen aus Anthropics internem Red-Team-Test sind deutlich. Auf CyberGym, einem Benchmark zur Prüfung der Fähigkeit eines Modells, bekannte Schwachstellen zu reproduzieren, erzielte Claude Mythos 83,1 %. Claude Opus 4.6 erzielte 66,6 %. Die Lücke ist groß. Auf SWE-bench Verified — einem Test für echte Softwareentwicklungsfähigkeiten — erreichte Mythos 94,6 % gegenüber Opus 4.6s 91,3 %. Auf Terminal-Bench, das die Fähigkeit eines Modells misst, in einer Shell-Umgebung zu operieren und komplexe Terminal-Operationen zu verketten, erzielte Mythos 92,1 %. Dies sind keine bloßen Benchmarks. Sie zeichnen das Bild eines Modells, das zuverlässig das tun kann, was Sicherheitsforscher tun — Bugs finden, Code-Pfade verstehen und funktionierende Exploits schreiben — ohne dass es aufgefordert wird, sich ethisch oder sicher zu verhalten.

![Claude Mythos Preview vs. Opus 4.6 auf CyberGym und SWE-bench Verified](/images/charts/glasswing-benchmarks.png)

In einem Monat koordinierter Tests fand Mythos Zero-Day-Schwachstellen in nahezu allen großen Betriebssystemen und Browsern, die heute im Einsatz sind.

Der älteste war ein 27 Jahre alter Remote-Crash-Bug in OpenBSD, der keine Authentifizierung erforderte. Er befand sich seit 1999 im Codebase, unsichtbar für Jahrzehnte menschlicher Prüfer. Der technisch beunruhigendste war ein 16 Jahre alter Fehler in FFmpeg — der allgegenwärtigen Multimedia-Codec-Bibliothek, die in allem verwendet wird, von Browsern über Videokonferenzplattformen bis hin zu mobilen Betriebssystemen. Fünf Millionen automatisierte Tests waren im Laufe der Jahre gegen die FFmpeg-Codebase gelaufen. Mythos fand den Bug trotzdem, ohne besondere Anweisung oder Zugang über das hinaus, was jeder Entwickler hätte.

Anthropics eigene Ingenieure — Nicht-Experten ohne formale Sicherheitsausbildung — erhielten Zugang und wurden gebeten, über Nacht zu sehen, was Mythos leisten konnte. Sie wachten mit vollständigen, funktionierenden Exploits auf. Remote Code Execution. Keine Anleitung. Keine Steuerung. Das Modell hatte die Schwachstelle identifiziert, den Exploit-Pfad verstanden und eigenständig funktionalen Proof-of-Concept-Code geschrieben.

Weitere Ergebnisse umfassten eine Linux-Kernel-Rechteausweitung, die einem Standardbenutzerkonto das Escalieren zu Root ermöglichte, einen Browser-JIT-Compiler-Heap-Spray in Kombination mit einer Sandbox-Escape (vier separate Schwachstellen miteinander verkettet) und einen FreeBSD-NFS-Remote-Root-Exploit, aufgebaut auf einer 20-Gadget-ROP-Kette (Return-Oriented Programming). Alle großen Browser und Betriebssysteme waren betroffen. Alle Schwachstellen wurden offengelegt und gepatcht.

## Die Koalition

Am 7. April 2026 kündigte Anthropic Project Glasswing an — eine formelle Branchen-Koalition, die darauf ausgerichtet ist, zu handeln, was das Red Team gefunden hatte. Dreizehn Gründungspartner tragen die Initiative: AWS, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, die Linux Foundation, Microsoft, NVIDIA und Palo Alto Networks. Apple ist der auffälligste Name auf der Liste — ein Unternehmen, das in der öffentlichen Positionierung zu künstlicher Intelligenz bemerkenswert zurückhaltend war, nun aber formal Teil der bedeutendsten KI-Cybersicherheits-Partnerschaft der Branchengeschichte ist.

Anthropic verpflichtet sich zu 100 Millionen Dollar an API-Gutschriften für die Initiative und zusätzlich 4 Millionen Dollar an direkter Förderung für Open-Source-Sicherheitsorganisationen, darunter das Alpha-Omega Project, die Open Source Security Foundation (OpenSSF) und die Apache Software Foundation. Nach der Ankündigung ist die Glasswing-API zu 25 Dollar pro Million Tokens für Kontextfenster und 125 Dollar pro Million Tokens für Generierung bepreist — ein bewusst zugänglicher Preis, der darauf ausgelegt ist, gefährdete Open-Source-Projekte abzudecken, nicht Einnahmen zu maximieren.

Die Partner erhalten nicht nur Zugang zu Mythos. Sie tragen Findings bei, koordinieren die Offenlegung und integrieren das Modell in ihre eigenen Sicherheits-Pipelines. Mehr als 40 weitere Organisationen hatten zum Startzeitpunkt Zugang zum System erhalten oder waren mit Zugang ausgestattet worden — von akademischen Sicherheitslabors bis hin zu mittelständischen Softwareunternehmen mit kritischer Infrastruktur-Exposition.

## Die Angriffszeitachse ist kollabiert

Das Fenster zwischen Schwachstellenentdeckung und Exploit-Verfügbarkeit wurde historisch in Monaten gemessen. Sicherheitsforscher finden einen Bug, verifizieren ihn, schreiben einen Proof-of-Concept, koordinieren mit dem Anbieter und warten auf einen Patch — ein Prozess, der selbst unter koordinierten Offenlegungsprogrammen routinemäßig 90 bis 180 Tage dauert. Mythos folgt dieser Zeitachse nicht. Das Modell fand, verifizierte und produzierte funktionierenden Exploit-Code für mehrere kritische Schwachstellen in einer einzigen Sitzung.

Dies ist keine theoretische Beschleunigung. Es ist ein praktischer Kollaps des Bedrohungsfensters. Verteidiger, die previously monatelang Zeit zum Patchen hatten, haben nun Minuten — oder höchstens Stunden — bevor ein fähiger Akteur einen operativen Exploit produzieren könnte. Die Dual-Use-Natur der Technologie bedeutet, dass diese Fähigkeit nicht auf eine Forschungsumgebung beschränkt ist. Sie ist live, zugänglich und skalierbar.

## Was das für die Branche bedeutet

Für Betreiber von KI-Agenten — einschließlich Plattformen wie OpenClaw, die autonomen Systemen dauerhaften Zugriff auf Dateien, Code und Netzwerkressourcen gewähren — sind die Implikationen direkt. KI-Agenten sind nicht nur Produktivitätswerkzeuge. Sie sind Ausführungsumgebungen. Wenn ein Modell wie Mythos autonom Schwachstellen finden und ausnutzen kann, dann ist jedes ausreichend fähige Modell in einer permissiven Umgebung potenziell ein Vektor für sowohl offensive als auch defensive Handlungen. Dieselbe Fähigkeit, die Ihr System patcht, kann im falschen Kontext oder mit der falschen Aufforderung darauf angreifen.

Für Sicherheitsteams ist das Bild komplexer. KI-gestützte Schwachstellenfindung ist schneller als menschlich geführte Penetrationstests. Organisationen, die diese Fähigkeiten in ihre Red-Team-Operationen integrieren, werden mehr Bugs finden, schneller. Aber das werden auch ihre Gegner. Das Wettrüsten zwischen Angriff und Verteidigung hat sich in eine Richtung geneigt, die neue Governance-Frameworks erfordert — nicht nur für Modelle wie Mythos, sondern für das breitere Ökosystem leistungsfähiger KI-Systeme, die folgen werden.

Anthropic veröffentlicht Mythos nicht öffentlich und nennt als Begründung das klare und unmittelbare Risiko, dass Nicht-Experten es nutzen könnten, um funktionierende Exploits ohne Offenlegungsinfrastruktur zu generieren. Das Modell ist für Glasswing-Partner und eine kuratierte Auswahl von Open-Source-Maintainern verfügbar. Diese Entscheidung spiegelt echten Ernst in Bezug auf das Dual-Use-Problem wider. Aber sie löst nicht die zugrunde liegende Dynamik: Die Angriffszeitachse ist kollabiert, die Werkzeuge sind real, und die Branche beginnt erst zu verstehen, was das bedeutet.

**Vorbehalte:** Nur eine Teilmenge der von Mythos entdeckten Schwachstellen wurde öffentlich offengelegt; Anthropic schätzt, dass mehr als 99 % der Ergebnisse des Modells noch nicht offengelegt sind, während auf koordinierte Patches der Anbieter gewartet wird. Das Modell ist nicht öffentlich verfügbar. Seine Wirksamkeit hängt teilweise vom Zugang zu Quellcode und Binärdateien ab — es funktioniert weniger zuverlässig bei Black-Box-Zielen ohne Code-Sichtbarkeit. Diese Faktoren schränken die unabhängige Überprüfung einiger Behauptungen in diesem Bericht ein.
