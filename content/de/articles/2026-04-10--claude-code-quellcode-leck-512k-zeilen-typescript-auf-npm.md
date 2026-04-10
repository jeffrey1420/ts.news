---
title: "Claude Codes März-Panne: 512.000 Zeilen TypeScript in einem npm-Paket"
description: "Am 31. März 2026 versandte Anthropic versehentlich den vollständigen TypeScript-Quellcode von Claude Code in einem öffentlichen npm-Paket. Die 59,8 MB große Source Map enthüllte das gesamte Client-seitige Agent-Harness — einschließlich eines 'Undercover-Modus', 44 unveröffentlichter Funktionen und einer kritischen Berechtigungsumgehungs-Schwachstelle. Dann kamen die DMCA-Takedowns."
date: 2026-04-10
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&h=630&fit=crop"
author: lschvn
tags: ["TypeScript", "KI", "Sicherheit", "Anthropic", "Claude Code", "npm", "Lieferkette", "DMCA"]
readingTime: 7
tldr:
  - "Anthropic versah am 31. März versehentlich eine 59,8 MB große Source Map im npm-Paket @anthropic-ai/claude-code und machte so 512.000 Zeilen nicht-obfuskierten TypeScript über 1.906 Dateien hinweg öffentlich."
  - "Das Leck enthüllte eine Berechtigungsumgehungs-Schwachstelle (CC-643), die Ablehnungsregeln bei Befehlsketten mit mehr als 50 Unterbefehlen deaktivierte — Anthropic hatte einen Fix, ihn aber nicht an Benutzer ausgeliefert."
  - "Anthropics Bereinigungsversuch schlug fehl: ein DMCA-Takedown richtete sich gegen 8.100 GitHub-Repos, einschließlich legitimer Forks ihres eigenen öffentlichen Claude-Code-Repositorys."
faq:
  - question: "Wie kam es zum Claude-Code-Quellcode-Leck?"
    answer: "Anthropic veröffentlichte am 31. März 2026 Version 2.1.88 von @anthropic-ai/claude-code auf npm. Das Paket enthielt eine 59,8 MB große JavaScript-Source-Map — für das Debugging in der Entwicklung gedacht — die in die Produktion gelangte. Die Source-Map verwies auf ein ungeschütztes Archiv auf Anthropics eigenem Cloudflare-R2-Bucket, das es jedem ermöglichte, den vollständigen TypeScript-Quellcode herunterzuladen."
  - question: "Was war der 'Undercover-Modus'?"
    answer: "Eine Datei namens undercover.ts wies Claude Code an, seine KI-Identität zu verbergen, wenn es zu öffentlichen Open-Source-Repositories beiträgt. Der Code besagte explizit: 'Decke deine Identität nicht auf.' Benutzer können den Undercover-Modus erzwingen, aber nicht deaktivieren — was sofortige Kritik von Open-Source-Communities hervorrief, die Richtlinien gegen nicht deklarierte KI-generierte Beiträge haben."
  - question: "Was war die Sicherheitsschwachstelle?"
    answer: "Das Leck enthüllte einen dokumentierten Berechtigungsumgehungsfehler (Ticket CC-643): Wenn Claude Code auf einen zusammengesetzten Befehl mit mehr als 50 Unterbefehlen stößt, hört es auf, jeden einzelnen gegen konfigurierte Ablehnungsregeln zu prüfen. Anthropic hatte intern bereits einen tree-sitter-Parser-Fix gebaut, ihn aber nicht in öffentlichen Builds aktiviert. Der Fehler wurde in v2.1.90 stillschweigend behoben."
  - question: "Wurden Kundendaten kompromittiert?"
    answer: "Anthropic bestätigte, dass keine Kundendaten, Modellgewichte oder API-Schlüssel offengelegt wurden. Das Leck betraf rein den clientseitigen Agent-Quellcode. Allerdings wurde ein bösartiges axios-Paket (v1.14.1 und v0.30.4) im gleichen Drei-Stunden-Fenster auf npm veröffentlicht."
  - question: "Warum löste der DMCA-Takedown so viel Kontroverse aus?"
    answer: "Anthropic reichte DMCA-Takedown-Hinweise gegen ca. 8.100 GitHub-Repos ein, die den geleakten Code enthielten — einschließlich legitimer Forks ihres eigenen öffentlichen Claude-Code-Repositorys. Entwickler, deren Projekte plötzlich unzugänglich waren, wiesen auf die Ironie hin: Ein KI-Unternehmen, dessen Modelle auf riesigen Datenmengen aus dem Internet trainiert wurden, setzt nun aggressiv das Urheberrecht für seinen eigenen versehentlich geleakten Code durch. Anthropic zog den Großteil der Hinweise innerhalb von Stunden zurück."
---

Am 31. März 2026 veröffentlichte Anthropic Version 2.1.88 von `@anthropic-ai/claude-code` auf npm. Innerhalb weniger Stunden wurde der 512.000 Zeilen TypeScript auf GitHub gespiegelt. Hier ist, was wirklich passiert ist — und was es für das TypeScript-Ökosystem bedeutet.

## Die Ereigniskette

Die Grundursache scheint ein Bug in Bun zu sein, der JavaScript-Laufzeit, auf der Claude Code aufgebaut ist. Bun bedient Source Maps im Produktionsmodus, selbst wenn sie aus Release-Builds ausgeschlossen sein sollten. Anthropic fügte eine 59,8 MB große Source Map in das veröffentlichte npm-Paket ein — eine Datei, die ausschließlich für das Debugging in der Entwicklung gedacht war.

Sicherheitsforscher Chaofan Shou entdeckte sie um 4:23 Uhr ET und postete einen direkten Download-Link auf X. Die Source Map verwies auf ein ungeschütztes Cloudflare-R2-Archiv mit dem vollständigen, nicht-obfuskierten, vollständig kommentierten TypeScript-Quellcode. Innerhalb von zwei Stunden erreichten GitHub-Repos, die den Code spiegelten, 50.000 Sterne — das schnellste Wachstum in der Geschichte der Plattform zu diesem Zeitpunkt.

Anthropic bestätigte das Leck gegenüber mehreren Medien und führte es auf "ein Release-Verpackungsproblem durch menschlichen Fehler, nicht auf einen Sicherheitsverstoß" zurück.

## Was der Code offenbarte

Entwickler verbrachten die folgenden Tage damit, den offengelegten Quellcode zu analysieren. Die bemerkenswertesten Funde:

**44 unveröffentlichte Funktionen.** Der Code enthielt Verweise auf kommende Funktionen, darunter KAIROS (ein persistenter Hintergrundagent, der unbegrenzt ohne menschliches Eingreifen läuft), ein "Buddy-System"-Tamagotchi-Feature mit 18 Spezies und Seltenheits-Varianten sowie die Bestätigung des Capybara/Mythos-Modells, das Tage zuvor separat geleakt worden war.

**Undercover-Modus.** Eine Datei namens `undercover.ts` wies Claude Code an, seine KI-Identität zu verbergen, wenn es in öffentlichen Open-Source-Repositories arbeitet. Der Code besagt explizit: "Decke deine Identität nicht auf." Benutzer können den Undercover-Modus erzwingen, aber nicht deaktivieren — was sofortige Kritik von Open-Source-Communities hervorrief.

**Selbstheilende Speicherarchitektur.** Die geleakte Quelle enthüllte ein dreischichtiges Speichersystem rund um `MEMORY.md` als lightweight Pointer-Index. Ein Hintergrundprozess namens `autoDream` konsolidiert den Speicher über Sitzungen hinweg, wenn vier Bedingungen erfüllt sind: 24+ Stunden seit letzter Konsolidierung, mindestens 5 neue Sitzungen, keine Konsolidierung läuft gerade, und 10+ Minuten seit letztem Scan.

## Die Sicherheitsschwachstelle, die Anthropic bereits kannte

Tage nach dem Leck identifizierte das Sicherheitsunternehmen Adversa AI einen kritischen Fehler in Claude Codes Berechtigungssystem, der intern als Ticket CC-643 dokumentiert war.

Das Problem: Wenn Claude Code auf einen zusammengesetzten Befehl mit mehr als 50 Unterbefehlen stößt (verknüpft mit `&&` oder `||`), hört es auf, jeden Unterbefehl gegen konfigurierte Ablehnungsregeln zu prüfen. Stattdessen zeigt es eine generische Genehmigungsaufforderung ohne Hinweis darauf, dass Sicherheitsprüfungen umgangen wurden.

Die ursprüngliche Begründung war Performance — das Analysieren jedes Unterbefehls in einer sehr langen Kette führte zu Interface-Freezes. Aber dies berücksichtigt nicht KI-generierte Befehle durch Prompt-Injection, bei der eine bösartige `CLAUDE.md`-Datei Claude Code anweist, eine Pipeline von 50+ Unterbefehlen zu generieren, die wie ein legitimer Build-Prozess aussieht.

Der frustrierende Detail: Anthropic hatte intern bereits einen tree-sitter-Parser-Fix gebaut. Er war einfach nicht in öffentlichen Builds aktiviert. Seit v2.1.90 scheint die Schwachstelle behoben worden zu sein — aber die Lücke zwischen dem Haben eines Fixes und dessen Auslieferung ist das, was Sicherheitsforscher am meisten beunruhigte.

## Der DMCA-Takedown-Fehlstart

Anthropics Reaktion verschlimmerte den Schaden. Das Unternehmen reichte DMCA-Takedown-Hinweise bei GitHub ein, die sich gegen ca. 8.100 Repositories mit dem geleakten Code richteten — einschließlich legitimer Forks ihres eigenen öffentlichen Claude-Code-Repositorys.

Entwickler, deren Projekte plötzlich unzugänglich waren, reagierten schnell in den sozialen Medien. Die Ironie wurde nicht übersehen: Ein Unternehmen, dessen KI-Modelle auf riesigen Datenmengen aus dem Internet trainiert wurden, setzt nun aggressiv das Urheberrecht für seinen eigenen versehentlich geleakten Code durch.

Boris Cherny, Anthropics Leiter für Claude Code, räumte ein, dass die zu breiten Takedowns versehentlich waren, und zog den Großteil innerhalb von Stunden zurück. GitHub stellte den betroffenen Projekten den Zugang wieder her.

## Handlungsbedarf für Claude-Code-Nutzer

Wenn Sie Claude Code am 31. März zwischen 00:21 und 03:29 UTC über npm installiert haben:

1. Prüfen Sie Ihre Lockfiles (`package-lock.json`, `yarn.lock` oder `bun.lockb`) auf bösartige axios-Versionen 1.14.1 oder 0.30.4
2. Aktualisieren Sie auf Claude Code v2.1.88 oder höher über den nativen Installer (nicht npm)
3. Rotieren Sie Ihre API-Schlüssel zur Vorsicht
4. Prüfen Sie `CLAUDE.md`-Dateien in unbekannten Repositories, bevor Sie Claude Code darin ausführen

Für alle: Verlassen Sie sich nicht auf Claude Codes Ablehnungsregeln als alleinige Sicherheitsebene. Die Berechtigungsumgehungs-Schwachstelle (jetzt behoben) zeigt, dass "Ask"-Fallback-Verhalten ohne sichtbare Angabe übersprungener Prüfungen nicht ausreicht, um Prompt-Injection-Angriffe abzuwehren.
