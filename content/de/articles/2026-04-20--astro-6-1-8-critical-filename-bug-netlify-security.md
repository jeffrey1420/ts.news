---
title: "Astro 6.1.8 behebt kritischen Netlify-Deploy-Bug und Sicherheitslücke im /_image-Endpoint"
description: "Astro 6.1.8 behebt eine Regression, bei der Build-Output-Dateinamen mit Sonderzeichen Deployments auf Netlify und Vercel brach, und patcht ein Content-Type-Confusion-Problem im integrierten Bild-Endpoint, das nicht-SVG-Inhalte als SVG ausliefern konnte."
date: 2026-04-20
image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop"
author: lschvn
tags: ["TypeScript", "Astro", "Framework", "JavaScript", "Netlify", "Security"]
tldr:
  - Astro 6.1.8 behebt einen Bug, bei dem Build-Output-Dateien mit Sonderzeichen (!, ~, {, }) Deployments auf Netlify und Vercel wegen der Plattform-Skew-Protection brachen
  - Der /_image-Endpoint hatte eine Content-Type-Confusion-Schwachstelle: f=svg konnte nicht-SVG-Inhalte als image/svg+xml ausliefern ; der Fix validiert nun, dass die Quelle tatsächlich SVG ist
  - Performance-Verbesserung: Der Dev-Server cached nun das Crawling der Projekt-Abhängigkeiten zwischen Requests
faq:
  - q: "Was verursachte die Netlify-Deploy-Fehler in Astro 6.1.7 und früher?"
    a: "Astro's Build-Output-Namensgebung konnte Sonderzeichen (!, ~, {, }) in Dateinamen von Chunks erzeugen. Netlify's Skew-Protection streift diese Zeichen vor dem Deployment, sodass die HTML-Referenzen auf nicht existierende Dateien auf dem CDN zeigen."
  - q: "Wie schwerwiegend ist die /_image-Endpoint-Sicherheitslücke?"
    a: "Mittel. Ein Angreifer konnte eine Anfrage an /_image?url=<interner-endpoint>&f=svg basteln, die internen JSON oder HTML mit einem image/svg+xml Content-Type Header zurückgab. Die Auswirkung wird durch das erforderliche allowedDomains begrenzt."
  - q: "Sollte ich sofort upgraden?"
    a: "Ja, besonders wenn Sie auf Netlify oder Vercel deployen. Der Dateinamen-Bug kann stillschweigend kaputte Deployments produzieren — der Build läuft durch, aber manche Seiten laden in der Produktion nicht."
---

Astro 6.1.8 erschien am 18. April mit zwei Fixes, die Entwickler auf Netlify oder Vercel sofort anwenden sollten.

## Der Dateinamen-Bug, der Netlify Deployments brach

Der wichtigste Fix adressiert eine Regression: Build-Output-Dateinamen konnten Sonderzeichen (`!`, `~`, `{`, `}`) enthalten, die auf bestimmten Deployment-Plattformen ungültig oder getrimmt werden.

Das Problem zeigt sich auf Netlify. Die Skew-Protection von Netlify — die sicherstellt, dass deployte Assets zum Build-Output passen — entfernt diese Zeichen vor dem Deployment. Wenn Ihr gebautes HTML auf `chunk.abc123!~{x}.js` verweist und Netlify es als `chunk.abc123.js` ausliefert, ist die Referenz kaputt.

Das Astro-Team bestätigt, dass dies Builds betraf, bei denen dynamische Imports oder bestimmte Code-Splitting-Patterns Chunks mit Hash-Segmenten erzeugten, die diese Zeichen enthielten. Version 6.1.8 normalisiert die Ausgabe-Dateinamen.

## /_image Endpoint Content-Type Confusion

Der zweite bemerkenswerte Fix schließt eine Sicherheitslücke im integrierten Bildoptimierungs-Endpoint von Astro (`/_image`). Der Endpoint akzeptierte einen beliebigen `f=svg` Query-Parameter und lieferte den von der Upstream-URL zurückgegebenen Inhalt als `image/svg+xml` aus — ohne zu prüfen, ob der Inhalt tatsächlich SVG war.

Ein Angreifer konnte dies für Content-Type-Confusion-Angriffe oder Cache-Poisoning nutzen. Das Astro-Team merkt an, dass der Endpoint `allowedDomains` explizit erfordert, was die Angriffsfläche begrenzt, aber der Fix ist dennoch richtig.

## Performance: Dev-Server Dependency Caching

Der Dev-Server erhält eine kleine aber messbare Verbesserung: Das interne Crawling der Projekt-Abhängigkeiten wird nun zwischen Requests gecached. In Projekten mit vielen Routes reduziert dies redundante Dateisystem-Durchsuchungen bei jedem Page-Refresh.

## Andere Fixes in 6.1.8

- Fix für dynamische Import-Chunks, die bei jedem Build frische Hashes erhielten
- `allowedDomains` werden nun korrekt an den Dev-Server propagiert
- Vue Scoped Styles funktionieren korrekt während Client-Side-Router-Navigation im Dev-Modus
- /_image-Endpoint validiert nun, dass die Quelle tatsächlich SVG ist
- Fix für Build-Fehler auf Vercel und Netlify bei inter-Chunk JavaScript mit dynamischen Imports

## Upgrade

Führen Sie `px @astrojs/upgrade` oder `npm install astro@latest` aus. Prüfen Sie auf Netlify oder Vercel, ob Ihr letztes Deployment alle Assets korrekt lädt.
