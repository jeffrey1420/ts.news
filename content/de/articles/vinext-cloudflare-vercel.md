---
title: "Cloudflares vinext: Das kontroverse Projekt, das Next.js in einer Woche neu aufgebaut hat"
description: "Wie Cloudflare KI verwendete, um Vercel's Flaggschiff-Framework neu zu erstellen, und was das für die Zukunft der Webentwicklung bedeutet"
date: "2026-03-21"
category: "deep-dive"
author: lschvn
tags: ["cloudflare", "vercel", "controversy", "vinext"]
readingTime: 12
image: "https://cf-assets.www.cloudflare.com/zkvhlag99gkb/64oL10LCSz30EiEHWVdJPG/aeaed48a681ec3d5bc9d8cb6e5e30a96/BLOG-3194_1.png"
tldr:
  - "Cloudflares vinext reimplementiert die Next.js API-Oberfläche als Vite-Plugin, größtenteils von KI (Claude Code) für ~$1.100 an API-Tokens in einer Woche gebaut."
  - "Auf einer 33-Route-App baut vinext 4.4x schneller (1.67s vs 7.38s) mit 57% kleineren Client-Bundles (72.9KB vs 168.9KB)."
  - "Das Projekt umfasst 1.700+ Vitest-Tests und 380 Playwright E2E-Tests; CIO.gov läuft vinext bereits in Produktion."
  - "vinext deployt nativ auf Cloudflare Workers mit D1/R2/KV-Bindings und unterstützt auch Vercel, Netlify und AWS via Nitro."
---

Am 24. Februar 2026 veröffentlichte Cloudflare einen Blog-Post, der Schockwellen durch die Webentwickler-Community sendete. Der Titel: *"How we rebuilt Next.js with AI in one week."* Das Projekt, genannt **vinext** (ausgesprochen "vee-next"), wurde als experimentelles Vite-Plugin präsentiert, das die Next.js API-Oberfläche reimplementiert —allowing developers to run their Next.js applications on Cloudflare Workers instead of Vercel.

Die Ankündigung war nicht nur ein technisches Demo. Es war eine direkte Herausforderung an eines der erfolgreichsten Unternehmen im modernen Web-Ökosystem. Und die Entwickler-Community bemerkte es.

---

## Was ist vinext?

In seinem Kern ist vinext ein Vite-Plugin, das die öffentliche Next.js-API — Routing, Server-Rendering, React Server Components, Server Actions, Caching, Middleware und mehr — auf Vite's Build-Infrastruktur aufbaut, statt auf Next.js's proprietären Compiler.

Der Schlüssel-Unterschied ist Deployment-Flexibilität. Wo Next.js traditionell Vercel erfordert (oder komplexe Workarounds für andernorts), shippt vinext zu Cloudflare Workers nativ mit einem einzigen Befehl:

```bash
npm install vinext
# Ersetze "next" durch "vinext" in deinen Scripts
vinext deploy # Build und Deploy zu Cloudflare Workers
```

### Die Zahlen, die Köpfe drehten

Cloudflares Benchmarks, durchgeführt auf einer 33-Route App Router-Anwendung, zeigten eindrucksvolle Ergebnisse:

| Metrik | Next.js 16.1.6 | vinext (Vite 8/Rolldown) |
|--------|---------------|---------------------------|
| Build-Zeit | 7.38s | 1.67s (**4.4x schneller**) |
| Client-Bundle | 168.9 KB | 72.9 KB (**57% kleiner**) |

Dies sind keine marginalen Verbesserungen — sie repräsentieren eine fundamentale Verschiebung in der Build-Performance, erreicht durch Nutzung von Vite's modernem [Rolldown Bundler](/articles/2026-03-26-vite-8-rolldown-era) statt Next.js's Turbopack.

### KI-generierter Code in großem Maßstab

Vielleicht der erstaunlichste Anspruch: Eine vollständige Neuimplementierung der Next.js API-Oberfläche wurde in einer Woche von einem einzigen Ingenieur geschrieben (technisch ein Engineering Manager), der ein KI-Modell anleitete. Die Kosten: ungefähr **$1.100 an API-Tokens**.

Aus dem Cloudflare-Blog:

> *"Almost every line of code in vinext was written by AI. But here's the thing that matters more: every line passes the same quality gates you'd expect from human-written code."*

Das Projekt umfasst über **1.700 Vitest-Tests** und **380 Playwright E2E-Tests**, mit CI, das auf jedem Pull Request läuft. Tests wurden direkt aus der Next.js-Testsuite und OpenNext's Cloudflare-Conformance-Suite portiert.

### Schlüssel-Features

- **Drop-in-Kompatibilität**: Existierende `app/`, `pages/` und `next.config.js` funktionieren ohne Modifikation
- **Traffic-aware Pre-Rendering (TPR)**: Ein experimentelles Feature, das Cloudflare-Analytik zur Deploy-Zeit abfragt, um nur die Seiten vorzurendern, die tatsächlich Traffic erhalten (90% der Visits in Sekunden abdeckend, nicht Minuten)
- **Native Cloudflare-Bindings**: Zugang zu D1, R2, KV, Durable Objects, AI und mehr via `import { env } from "cloudflare:workers"`
- **Multi-Platform via Nitro**: Kann auf Vercel, Netlify, AWS, Deno Deploy und mehr deployen

---

## Die Kontroverse: Warum es sich wie eine Kriegserklärung anfühlte

Um zu verstehen, warum die Community so stark reagierte, müssen Sie die Beziehung zwischen Next.js und Vercel verstehen.

Next.js wurde 2019 von Vercel übernommen. Seitdem hat Vercel sein gesamtes Geschäftsmodell darum aufgebaut, die Premier-Hosting-Plattform für Next.js-Anwendungen zu sein. Das Framework ist eng mit Vercel's Infrastruktur integriert — Deploy Previews, Edge Functions, Bildoptimierung und mehr funktionieren nahtlos auf Vercel, erfordern aber woanders Workarounds.

Als Cloudflare vinext veröffentlichte, war die Botschaft an Entwickler klar: **Sie können jetzt Next.js ohne Vercel verwenden**. Nicht als Hack, nicht als Nachgedanke — sondern als Erstklassiger Bürger auf Cloudflares Plattform.

Das Timing war provokativ. Cloudflare kündigte nicht nur einen Konkurrenten zu Vercel an — sie kündigten einen eine Woche nach ihrem eigenen Ingenieur an, der Next.js mit KI neu aufbaute. Der Subtext war fast aggressiv:

> *"If one engineer and an AI can build this in a week, imagine what happens when the ecosystem rallies around it."*

### Das OpenNext-Problem

Cloudflare erkannte in ihrer Ankündigung an, dass sie sich bestehender Lösungen wie OpenNext bewusst waren, das Next.js-Build-Output für verschiedene Plattformen adaptiert:

> *"Building on top of Next.js output as a foundation has proven to be a difficult and fragile approach. Because OpenNext has to reverse-engineer Next.js's build output, this results in unpredictable changes between versions that take a lot of work to correct."*

Durch Neuimplementierung von Grund auf statt Adaption des Outputs verspricht vinext stabilere Kompatibilität und sauberere Builds. Aber dieses Framing kritisierte implizit jahrelange Arbeit des OpenNext-Teams — und positionierte Cloudflare als das Unternehmen, das bereit war zu tun, was andere nicht konnten.

---

## Vercels Antwort

*Hinweis: Ich konnte keine spezifischen offiziellen Aussagen von Vercel bezüglich vinext verifizieren. Das Folgende spiegelt Community-gemeldete Reaktionen und beobachtbares Verhalten wider.*

Stand dieser Recherche konnte ich keine verifizierte offizielle Antwort von Vercel oder seinem CEO Guillermo Rauch lokalisieren. Twitter/X-Zugang war während meiner Recherche blockiert, was meine Fähigkeit einschränkte, Echtzeit-Reaktionen von Schlüsselfiguren einzufangen.

Was die Community beobachtete, umfasste:

- **Anfängliches Schweigen**: Vercel veröffentlichte keinen unmittelbaren Blog-Post oder keine Pressemitteilung als Antwort auf vinext
- **GitHub-Aktivität**: Das Next.js-Repository sah erhöhte Diskussion über vinext, mit einigen Mitwirkenden, die die langfristigen Implikationen für das Framework in Frage stellten
- **Entwickler-Spekulation**: Viele Entwickler interpretierten das Fehlen einer Antwort entweder als Vertrauen in Vercel's Burggraben oder als Zeichen, dass sie überrascht wurden

*Dieser Abschnitt enthält nicht verifizierte Beobachtungen. Wenn Sie Links zu offiziellen Vercel-Antworten haben, kontaktieren Sie mich bitte.*

---

## Sicherheits- und Qualitätsbedenken

Das vinext-Projekt macht kein Hehl aus seinem experimentellen Charakter. Das GitHub README enthält dies prominent:

> 🚧 **Experimental — under heavy development.** This project is an experiment in AI-driven software development. The vast majority of the code, tests, and documentation were written by AI (Claude Code). Humans have not reviewed most of the code line-by-line.

### Bekannte Einschränkungen

Das Projekt listet explizit, was NICHT unterstützt wird:

- Statisches Pre-Rendering zur Build-Zeit (auf der Roadmap)
- Einige Edge Cases in RSC-Streaming
- Undocumented Next.js internal APIs

### Die KI-Code-Qualitätsdebatte

Der Ansatz des Projekts warf wichtige Fragen auf:

1. **Kann KI-generierter Code in diesem Maßstab vertraut werden?** Mit 94% API-Abdeckung, was ist mit den verbleibenden 6%?
2. **Wer überprüft die Arbeit der KI?** Das Projekt verlässt sich auf Test-Suiten statt auf menschliche Code-Review
3. **Was passiert, wenn Next.js neue Features veröffentlicht?** vinext verfolgt die öffentliche API-Oberfläche, aber experimentelle Features könnten hinterherhinken

Der Cloudflare-Ingenieur acknowledging dies im Blog-Post:

> *"There were PRs that were just wrong. The AI would confidently implement something that seemed right but didn't match actual Next.js behavior. I had to course-correct regularly."*

### Echtwelt-Nutzung

Trotz des experimentellen Labels laufen echte Kunden bereits vinext in Produktion:

- **CIO.gov** (National Design Studio): Läuft vinext in Produktion mit "bedeutenden Verbesserungen bei Build-Zeiten und Bundle-Größen"

---

## Community-Reaktion und Tweet-Einbettungen

*Hinweis: Aufgrund von Twitter/X-API-Einschränkungen konnte ich keine spezifischen Tweet-Inhalte abrufen. Das Folgende repräsentiert dokumentierte Reaktionen aus zugänglichen Quellen.*

Der Hacker News-Thread zur Cloudflare-vinext-Ankündigung zog bedeutende Debatte an. Entwickler äußerten sich zu mehreren Schlüsselbedenken:

### Die "Nur ein Wrapper"-Kritik

Einige Entwickler argumentierten, dass vinext, trotz seiner beeindruckenden Zahlen, die Machtdynamik nicht fundamental verändert:

> *"Vercel's value isn't just the runtime—it's the developer experience, the ecosystem, the integrations. Build time is a small part of what makes Next.js on Vercel valuable."*

### Die KI-Entwicklungsimplikationen

Der Erfolg des Projekts entfachte Diskussion über die Zukunft der Framework-Entwicklung:

> *"If one engineer can rebuild Next.js in a week with AI, what does that mean for the competitive moats of any software company?"*

### Fragen zur Nachhaltigkeit

Andere äußerten Bedenken bezüglich Langzeitwartung:

> *"Who maintains this when the AI-generated code needs to evolve with Next.js? Are we building software or creating technical debt at scale?"*

---

## Die Nachwehen

Seit der Ankündigung am 24. Februar sind mehrere Entwicklungen aufgetreten:

### GitHub-Aktivität

Das [vinext GitHub-Repository](https://github.com/cloudflare/vinext) zeigt aktive Entwicklung mit:
- Über 600+ Issues geöffnet
- Regelmäßige Commits von Cloudflare-Ingenieuren
- Community-Beiträge für Plattform-Adapter

### Wachsende Plattform-Unterstützung

Das Projekt hat sich über Cloudflare Workers hinaus erweitert:
- Vercel-Deployment demonstriert (via Nitro)
- Netlify-Support in Arbeit
- AWS Amplify-Adapter in Entwicklung

### Industrielle Bewegung

Die Ankündigung katalysierte breitere Gespräche über:
- **Die Kosten proprietärer Frameworks**: Wenn Frameworks geklont werden können, was ist der Wert von Lock-in?
- **KI-gesteuerte Entwicklung**: Ob KI komplexe Softwareprojekte im Maßstab warten kann
- **Edge-Computing-Wettbewerb**: Cloudflare, Vercel, Netlify und andere, die darum wetteifern, das beste serverlose React-Deployment anzubieten

---

## Analyse: Was das für die Industrie bedeutet

### Für Vercel

Vercel steht vor einer unbequemen Wahrheit: Ihr Burggraben könnte dünner sein als erhofft. Das Unternehmen hat ein ausgezeichnetes Produkt aufgebaut, aber vinext demonstriert, dass Next.js-Kompatibilität anderswo erreicht werden kann. Vercel muss auf mehr konkurrieren als nur "wo Next.js am besten läuft."

**Mögliche Antworten umfassen:**
- Beschleunigung von Next.js-spezifischen Integrationen, die nicht leicht geklont werden können
- Preissenkung, um mit Cloudflares Edge-Netzwerk zu konkurrieren
- Verdopplung bei Entwicklererlebnis und Tooling

### Für Cloudflare

Cloudflare hat seine Ernsthaftigkeit über den Developer-Plattform-Raum signalisiert. vinext ist nicht nur ein technisches Demo — es ist ein Beweis, dass Cloudflare Entwickler anziehen kann, die Vercel zuvor als einzige Option sahen. Diese Investition in Developer-Tooling spiegelt Cloudflares breitere Plattformstrategie wider, die auch Partnerschaften mit Frameworks wie [Astro](/articles/2026-03-30-astro-6-rust-compiler-cloudflare) beinhaltet.

**Die Herausforderung:** Aufrechterhaltung der Kompatibilität mit einem sich schnell entwickelnden Framework (Next.js), während ein nachhaltiges Geschäftsmodell aufgebaut wird.

### Für die Entwickler-Community

Vielleicht der größte Gewinner sind die Entwickler selbst. vinext fügt Wahl in ein Ökosystem hinzu, das sich zunehmend wie ein Einparteiensystem anfühlte. Ob dies zu Innovation oder Fragmentierung führt, bleibt abzuwarten.

### Das größere Bild: KI's Rolle in der Softwareentwicklung

vinext repräsentiert eine neue Kategorie von Projekt: **KI-reimplementierte Infrastruktur**. Die Frage ist nicht, ob dies wieder passieren wird — es ist, wie oft, und ob die Ergebnisse produktionsreif sein werden.

Aus dem Cloudflare-Blog:

> *"It doesn't need an intermediate framework to stay organized. It just needs a spec and a foundation to build on... The layers we've built up over the years aren't all going to make it."*

Dies ist vielleicht die signifikanteste Implikation von vinext. Es ist nicht nur ein Konkurrent zu Next.js — es ist ein Beweis, dass sich die Regeln der Softwareentwicklung ändern.

---

## Fazit

Cloudflares vinext-Projekt ist entweder ein brillanter strategischer Schachzug, ein faszinierendes Experiment in KI-gesteuerter Entwicklung, oder beides. Die Kontroverse, die es auslöste, reflektiert tiefere Spannungen im Webentwicklungs-Ökosystem: proprietär vs. offen, integriert vs. komponierbar, proprietärer Lock-in vs. Deployment-Flexibilität.

Ob vinext zu einer lebensfähigen Produktionsalternative wird oder ein experimentelles Kuriosum bleibt, es hat bereits das Gespräch verändert. Entwickler wissen jetzt, dass sie, wenn sie Next.js auf Cloudflare ausführen möchten, dies können. Und dieses Wissen verändert alles.

Die Woche, in der ein Ingenieur und eine KI Next.js neu aufgebaut haben, könnte durchaus als Wendepunkt in Erinnerung bleiben — nicht nur für Cloudflare und Vercel, sondern für, wie wir über Framework-Entwicklung selbst denken.

---

*Was sind Ihre Gedanken zu vinext und der Zukunft von Next.js-Deployment? Lassen Sie es uns in den Kommentaren wissen.*