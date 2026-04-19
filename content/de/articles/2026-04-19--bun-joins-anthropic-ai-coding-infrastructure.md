---
title: "Bun tritt Anthropic bei: Was die Übernahme für das JavaScript-Ökosystem bedeutet"
description: "Die JavaScript-Runtime, der Bundler und das Toolkit, das von einem 14-köpfigen Team aufgebaut wurde und von Millionen Entwicklern genutzt wird, wurde von Anthropic übernommen. Bun bleibt Open Source und MIT-lizenziert, aber die Roadmap biegt nun in Richtung KI-Coding-Infrastruktur ab."
date: 2026-04-19
image: "https://opengraph.githubassets.com/0d28e9b3ac4dfd5536d7cc7636993191f76820b868588c2ae9731ee4bb06673c/oven-sh/bun"
author: lschvn
tags: ["TypeScript", "Bun", "Anthropic", "AI", "Runtime"]
tldr:
  - "Bun wurde von Anthropic übernommen und dient als Infrastrukturschicht für Claude Code, den Claude Agent SDK und zukünftige KI-Coding-Produkte"
  - "Bun bleibt MIT-lizenziert und Open Source, mit demselben Team, das die aktive Entwicklung fortsetzt — kein Umsatzmodell-Druck in Sicht"
  - "Single-File-Executable-Verteilung erwies sich als Killer-Feature für KI-Coding-Tools — schneller Start, keine Runtime-Abhängigkeit, leicht zu verteilen"
faq:
  - "Q: Bedeutet das, dass Bun nicht mehr Open Source ist?
A: Nein. Bun bleibt MIT-lizenziert und Open Source. Anthropic kauft das IP nicht, um es zu schließen — es investiert in Bun als strategische Infrastrukturkomponente."
  - "Q: Was gewinnt Anthropic dabei?
A: Direkte Kontrolle über die Runtime, die Claude Code und zukünftige KI-Coding-Tools antreibt. Wenn Bun ausfällt, fällt Claude Code aus — damit sind die Anreize direkt ausgerichtet."
  - "Q: Wie betrifft das existierende Bun-Nutzer?
A: Vorerst ändert sich im Alltag nichts. Buns Roadmap priorisiert weiterhin Node.js-Kompatibilität und Performance, und das Team erwartet höhere Liefergeschwindigkeit."
---

## Vom Minecraft-Klon zur KI-Coding-Infrastruktur

Vor fünf Jahren baute Jarred Sumner ein Minecraft-artiges Voxel-Spiel im Browser. Der Hot-Reload-Zyklus dauerte 45 Sekunden. Er ließ sich ablenken, indem er versuchte, ihn zu beheben, portierte esbuilds JSX- und TypeScript-Transpiler von Go nach Zig — und schuf versehentlich Bun.

Heute verzeichnet Bun über 7,2 Millionen monatliche npm-Downloads, konkurriert direkt mit Node.js beim HTTP-Durchsatz (59K vs. 19K req/s in den offiziellen Benchmarks) und bietet ein Single-File-Executable-Format, das zum bevorzugten Verteilungsmechanismus für KI-Coding-Tools geworden ist.

Im Oktober 2025 übernahm Anthropic Bun. Die Vereinbarung wurde im Bun-Blog angekündigt und liest sich weniger wie eine Unternehmensübernahme und mehr wie ein Gründerbrief, der erklärt, warum der beste verfügbare Weg vorwärts durch Claude Code führt.

## Warum Anthropic Bun Wollte

Single-File-Executables entpuppten sich als unerwartetes Killer-Feature für das KI-Coding-Zeitalter. Tools wie Claude Code, FactoryAI und OpenCode werden alle als eigenständige Bun-Binärdateien ausgeliefert. Benutzer laden sie herunter und führen sie aus, ohne zuerst eine Runtime zu installieren. Der Start ist nahezu sofortig. Es funktioniert identisch auf macOS, Linux und Windows.

Für KI-Agenten, die autonom Code schreiben, testen und bereitstellen, zählt diese Vorhersagbarkeit. Die Ausführungsumgebung muss schnell und konsistent sein — Buns JavaScriptCore-basierter Cold-Start ist laut dem Bun-Team etwa 4x schneller als V8.

Anthropics eigener Claude Code wird als Bun-Executable an Millionen von Nutzern ausgeliefert. Jedes Mal, wenn Bun eine Regression hat, bricht Claude Code. Die Übernahme richtet die Anreize aus: Anthropic hat nun direktes Engineering-Engagement dafür, Bun schnell, kompatibel und zuverlässig zu halten.

## Was gleich bleibt

Bun bleibt MIT-lizenziert und Open Source. Dasselbe Team von etwa 14 Personen arbeitet weiter daran, immer noch in San Francisco ansässig. Das GitHub-Repo bleibt öffentlich. Die Roadmap priorisiert weiterhin Node.js-Kompatibilität und allgemeine JavaScript-Runtime-Performance, neben der KI-spezifischen Arbeit.

Der Beitrag ist bemerkenswert offen über Buns wirtschaftliche Lage: Zum Zeitpunkt der Übernahme erzeugte Bun 0 $ Umsatz mit über vier Jahren Runway aus insgesamt 26 Mio. $ (7 Mio. Seed, 19 Mio. Series A). Sie mussten nicht verkaufen. Die Entscheidung betraf die Positionierung für eine Welt, in der KI-Coding-Tools der primäre Weg sind, Software zu bauen.

## Der Weg nach vorn

Das erklärte Ziel des Bun-Teams ist, es zum besten Ort zum Bauen, Ausführen und Testen von KI-gesteuerter Software zu machen — während es ein erstklassiger universeller JavaScript-Runtime, Bundler, Paketmanager und Test-Runner bleibt.

Dies bedeutet, dass zukünftige Arbeit wahrscheinlich engere Integrationen mit KI-Coding-Workflows beinhalten wird: schnellere Agent-Startzeiten, bessere Debugging- und Test-Tools für von LLMs geschriebenen Code, und Verbesserungen am Single-File-Executable-Format.

Bun v1.3.12 lieferte Bun.WebView, eine native Headless-Browser-Automatisierungs-API, direkt in die Runtime eingebaut, powered by WebKit auf macOS und Chrome via DevTools Protocol auf anderen Plattformen. Features wie dieses — die traditionelle Browser-Tools mit einer Hochleistungs-JS-Runtime überbrücken — sind die Art von Wetten, die mehr Sinn mit einem großen KI-Partner ergeben, der die langfristige Entwicklung unterstützt.
