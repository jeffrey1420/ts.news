---
title: "Astro 6.4.4 Behebt Sieben Bugs bei Routing, i18n und Dev-Erfahrung"
description: "Astro 6.4.4 ist ein Patch-Release, das Probleme mit dynamischen Routen, i18n-Domain-Routing, Bearbeitung von Client-Komponenten und der Groß-/Kleinschreibung von Routenmustern behebt."
date: 2026-06-05
image: "/images/heroes/2026-06-05--astro-6-4-4-routing-i18n-dev-fixes.png"
author: lschvn
tags: ["frameworks", "javascript"]
tldr:
  - Fix: Astro.routePattern behält jetzt korrekt die Groß-/Kleinschreibung von Parametern aus Dateinamen bei
  - Dynamische Routen werfen keine 500-Fehler mehr bei domain-basiertem i18n-Routing im SSR-Modus
  - Bearbeitung von Client-Komponenten löst keine unnötigen vollständigen Programm-Neustarts mehr im Development aus
---

[Astro 6.4](/articles/2026-06-01--astro-6-4-rust-satteri-markdown-optimizer).4 erschien am 3. Juni 2026 als fokussiertes Patch-Release mit sieben Bugfixes rund um Routing, Internationalisierung und Entwicklererfahrung.

## Routenpattern-Groß-/Kleinschreibung Behoben

Eine der subtileren, aber wichtigeren Korrekturen betrifft `Astro.routePattern`. Zuvor gab eine Datei unter `src/pages/blog/[postId].astro` den Wert `/blog/[postid]` für `Astro.routePattern` zurück, wegen eines internen `.toLowerCase()`-Aufrufs. Die Methode behält jetzt korrekt die ursprüngliche Groß-/Kleinschreibung des Dateinamens bei und gibt `/blog/[postId]` zurück.

Dies ist wichtig für Projekte, die Routen programmatisch generieren und auf konsistente Groß-/Kleinschreibung für die weitere Verarbeitung angewiesen sind.

## SSR i18n Domain-Routing Behoben

Dynamische Routen im SSR-Modus warfen einen 500-`"TypeError: Missing parameter"`-Fehler bei Verwendung von domain-basiertem internationalisiertem Routing. Der Bug wurde in der Art und Weise gefunden, wie Astro eingehende Requests gegen Routenmuster in Multi-Domain-i18n-Konfigurationen abglich.

Zusätzlich gibt `Astro.currentLocale` jetzt korrekt die Domain-Locale auf dynamischen Routen zurück, die von einer zugeordneten Domain bedient werden, anstatt fälschlicherweise die Standard-Locale zurückzugeben.

## Dev-Erfahrung: Keine Vollständigen Neustarts Mehr

Zuvor löste das Bearbeiten einer Client-Komponente (mit `client:idle`, `client:load` usw.) während der Entwicklung einen unnötigen vollständigen Backend-Neustart aus. Das ist jetzt behoben, Komponenten-Bearbeitungen triggern nun nur noch das erwartete Hot Module Replacement ohne Server-Neustart.

## Weitere Fixes

- `App.match()` wirft keine Ausnahme mehr bei Request-Pfaden mit ungültiger Percent-Encoding-Sequenz
- Statische Dateiendpoints mit `getStaticPaths` und `.html` in dynamischen Parameterwerten scheitern nicht mehr mit `NoMatchingStaticPathFound`, das `.html`-Suffix wird nicht mehr fälschlicherweise entfernt
- Probleme mit Style-Stripping bei case-sensitiven Dateisystemen (z.B. `d:\dev\app` vs. `D:\dev\app`) wurden behoben
- Dynamische Routen geben nicht mehr den String `[object Object]` statt des erwarteten Contents in bestimmten Runtimes zurück

Das `@astrojs/mdx`-Integration wurde ebenfalls auf v6.0.2 aktualisiert, mit dem aktualisierten Sätteri-Prozessor (v0.8.0).

[Astro 6](/articles/2026-03-30-astro-6-rust-compiler-cloudflare).4.4 ist jetzt auf npm verfügbar.
