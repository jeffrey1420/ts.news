---
title: "WebStorm 2026.1: TypeScript-Engine mit Service-Backend und vollständiger KI-Agent-Roster"
description: "Jetzt mit standardmäßig aktiviertem servicebasiertem TypeScript-Engine, Junie, Claude Agent, Codex und Cursor im KI-Chat, Code With Me wird eingestellt, und native Wayland-Unterstützung unter Linux."
image: "https://blog.jetbrains.com/wp-content/uploads/2026/03/WS-releases-BlogSocialShare-1280x720-1.png"
date: "2026-04-09"
category: IDE
author: lschvn
readingTime: 5
tags: ["webstorm", "jetbrains", "TypeScript", "IDE", "KI", "KI-Agenten", "release"]
tldr:
  - "WebStorm 2026.1 aktiviert standardmäßig die servicebasierte TypeScript-Engine, reduziert die CPU-Auslastung und verbessert die Reaktionsfähigkeit in großen Projekten."
  - "Der KI-Chat bietet jetzt Junie, Claude Agent, Codex, Cursor und GitHub Copilot über die neue ACP-Registry — jeder Agent lässt sich mit einem Klick installieren."
  - "Next-Edit-Vorschläge sind ohne KI-Kontingent verfügbar und verbreiten zusammenhängende Änderungen intelligent über die gesamte Datei."
  - "Code With Me wird mit 2026.1 eingestellt — JetBrains verweist auf zurückgehende Nachfrage und lenkt Nutzer auf modernere kollaborative Workflows."
faq:
  - q: "Was bedeutet 'servicebasierte TypeScript-Engine'?"
    a: "WebStorm delegiert TypeScript-Parsing, Typprüfung und Sprachdienste jetzt an einen externen Prozess statt sie im Haupt-IDE-Thread auszuführen. Das Ergebnis: geringere CPU-Auslastung und bessere Reaktionsfähigkeit in großen Monorepos."
  - q: "Ist Cursor jetzt tatsächlich in WebStorm verfügbar?"
    a: "Cursor ist der ACP-Registry im März 2026 beigetreten, was bedeutet, dass seine Agent-Funktionen direkt über das Agent-Client-Protokoll im KI-Chat-Panel von WebStorm zugänglich sind."
  - q: "Was ist mit Code With Me passiert?"
    a: "JetBrains stellt Code With Me, seinen In-IDE-Paarprogrammierdienst, mit Wirkung ab 2026.1 ein. Er wird aus allen JetBrains-IDEs herausgelöst und als eigenständiges Plugin auf dem Marketplace angeboten. 2026.1 ist die letzte IDE-Version mit offizieller Unterstützung."
  - q: "Unterstützt dieses Release TypeScript 6?"
    a: "Ja. WebStorm 2026.1 ist auf TypeScript 6 ausgerichtet — einschließlich der geänderten Standardwerte für `types` und `rootDir` — und bereitet sich bereits auf die `baseUrl`-Änderungen in TypeScript 7 vor."
---

WebStorm 2026.1 erschien im März mit einem Release, das die Bindung zwischen der IDE und den täglich genutzten Werkzeugen der Entwickler stärkt. DasHauptthema ist eine effizientere TypeScript-Engine standardmäßig, aber die für viele sichtbarere Änderung ist der KI-Chat in der Seitenleiste.

## Servicebasierte TypeScript-Engine, standardmäßig aktiviert

Die technisch bedeutendste Änderung in 2026.1 ist der Wechsel der TypeScript-Engine von optional zu standardmäßig. Große TypeScript-Codebasen belasten Editoren ständig — Typprüfung, Navigation und Refactoring konkurrieren alle um CPU im Haupt-IDE-Thread. Die servicebasierte Engine lagert diese Arbeit auf einen separaten Prozess aus und hält die UI reaktionsschneller, ohne die Arbeitsweise beim Schreiben von Code zu verändern.

WebStorm zeigt jetzt auch Inline-Hints vom TypeScript-Go-basierten Sprachserver direkt im Editor an, wenn dieser läuft. Und da TypeScript 6 ungefähr zur gleichen Zeit erschien, hat das Team die Standardwerte des Editors an TS6s geändertes Verhalten bei `types` und `rootDir` angepasst und bereits mit der Vorbereitung auf TypeScript 7s `baseUrl`-Änderungen begonnen.

String-Literal-Import- und Export-Spezifizierer werden jetzt vom Parser und Navigator vollständig verstanden:

```typescript
export { a as "a-b" };
import { "a-b" as a } from "./file.js";
```

Syntaxhervorhebung, Ge-zu-Definition und Umbenennungs-Refactoring funktionieren bei den aliassierten Namen alle korrekt.

## KI-Chat erhält vollständigen Agenten-Roster

JetBrains hat vor mehreren Releases ein KI-Chat-Panel eingeführt. In 2026.1 ist es jetzt ein Agent-Hub. Die ACP-Registry — ein Marktplatz innerhalb der IDE — ermöglicht die Installation von Agenten mit einem Klick. Die Liste umfasst bereits Junie (JetBrains eigener Agent), Claude Agent, Codex (OpenAIs Programmiermodell), Cursor und GitHub Copilot, mit mehr in Zukunft.

Der praktische Vorteil: Entwickler können je nach Aufgabe zwischen verschiedenen Agenten wechseln — Codex für bestimmte Codegenerierungsaufgaben, Claude für rechenintensive Arbeit — ohne den Editor zu verlassen.

## Next-Edit-Vorschläge, ohne KI-Kontingent

Die Codevervollständigung in 2026.1 erhält ein bedeutendes Upgrade. Next-Edit-Vorschläge gehen über die einzelnen Token hinaus: sie wenden intelligent verwandte Änderungen auf die gesamte Datei an, wenn Entwickler Tab drücken.

Entscheidend: Diese Vorschläge verbrauchen kein KI-Kontingent bei JetBrains AI Pro-, Ultimate- und Enterprise-Abonnements. Es ist ein Tab-Tab-Erlebnis, das lokal bleibt.

## Framework-Updates

WebStorm 2026.1 bringt Unterstützung für neue React-Direktiven (`use memo`, `use no memo` neben den bestehenden `use client` und `use server`), Angular 21s vollständige Template-Syntax (Pfeilfunktionen, `instanceof`, Regex-Literale, Spread) und aktualisierte Vue-TypeScript-Integration über `@vue/typescript-plugin 3.2.4`.

Svelte-Generics in `<script>`-Tags funktionieren jetzt mit Verwendungs-suche, Deklarationsnavigation und Umbenennungs-Refactoring. Der Astro-Sprachserver akzeptiert JSON-Konfiguration direkt aus den IDE-Einstellungen. Und CSS-Farbfelder zeigen jetzt die `color()`-Funktion und erweiterte CSS-Farbräume in der Vorschau an.

## Code With Me wird eingestellt

JetBrains stellt Code With Me, seinen Pair-Programming- und kollaborativen Programmierdienst, ein. Das Unternehmen verweist auf zurückgehende Nachfrage und einen Shift hin zu moderneren, professionellen Softwareentwicklungs-Workflows. Ab 2026.1 wird Code With Me aus allen JetBrains-IDEs herausgelöst und als eigenständiges Plugin auf dem Marketplace angeboten.

## Wayland standardmäßig unter Linux

WebStorm läuft jetzt standardmäßig nativ auf Wayland unter Linux und ersetzt X11 als Standard-Display-Server. Das Ergebnis: schärferes HiDPI-Rendering und bessere Eingabeverarbeitung. Die IDE fällt automatisch auf X11 zurück, wenn Wayland nicht verfügbar ist.

PowerShell-Benutzer erhalten ebenfalls Terminal-Vervollständigung für Unterbefehle und Parameter, zusätzlich zu Bash und Zsh, wo dieses Feature bereits existierte.

WebStorm 2026.1 ist über die Toolbox App oder zum Direktdownload auf jetbrains.com/webstorm verfügbar.
