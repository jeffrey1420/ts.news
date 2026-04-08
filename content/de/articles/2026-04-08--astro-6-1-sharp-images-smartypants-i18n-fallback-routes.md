---
title: "Astro 6.1: Feinsteuerung für Bilder und verbessertes i18n-Routing"
description: "Astro 6.1 ermöglicht die Konfiguration der Sharp-Encoder auf Pipeline-Ebene, fügt erweiterte SmartyPants-Optionen hinzu und macht i18n-Fallback-Routen für Integrationen zugänglich. Die Cloudflare-Übernahme prägt weiterhin die Roadmap."
image: "https://opengraph.githubassets.com/1/withastro/astro"
date: "2026-04-08"
category: Frameworks
author: lschvn
readingTime: 4
tags: ["astro", "javascript", "frameworks", "images", "i18n", "markdown", "release"]
tldr:
  - "Astro 6.1 bietet jetzt Encoder-spezifische Standardwerte für den Sharp-Pipeline — MozJPEG, WebP-Effort, AVIF-Chroma-Subsampling und PNG-Komprimierung können als Defaults gesetzt werden."
  - "SmartyPants akzeptiert nun ein vollständiges Optionsobjekt für die Feinjustierung von Gedankenstrichen, Anführungszeichen, Backticks und Auslassungspunkten — nützlich für Lokalisierung und typografische Standards."
  - "Integrationen können jetzt über `fallbackRoutes` auf dem `IntegrationResolvedRoute`-Typ auf i18n-Fallback-Routen zugreifen, was sitemap- und Routing-Integrationen korrigiert."
  - "Astro ist im Januar 2026 zu Cloudflare gestoßen; die Übernahme zeigt sich in der Priorisierung von content-lastigen, Edge-deployten Workloads."
faq:
  - q: "Was ist neu in Astro 6.1 im Vergleich zu 6.0?"
    a: "Die Kernfunktionen sind Pipeline-Level Sharp-Encoder-Konfiguration, Optionsobjekt-Support für SmartyPants und die Exposition von `fallbackRoutes` auf dem Integrations-Hook. Dies sind gezielte Ergänzungen im Vergleich zu 6.0."
  - q: "Muss ich beim Upgrade von Astro 6.0 etwas ändern?"
    a: "Astro 6.1 ist ein Minor-Release — keine Breaking Changes zu erwarten. Die Sharp-Image-Defaults sind additiv, und das SmartyPants-Verhalten bleibt erhalten, sofern nicht explizit neu konfiguriert."
  - q: "Was bedeutet 'i18n-Fallback-Routen für Integrationen'?"
    a: "Seiten mit `fallbackType: 'rewrite'` erzeugen zusätzliche Routen, die vorher für Integrationen nicht sichtbar waren. Astro 6.1 macht diese über den `astro:routes:resolved`-Hook zugänglich."
---

Astro 6.1 wurde am 31. März veröffentlicht — nicht so dramatisch wie Astros 6.0 mit dem experimentellen Rust-Compiler, aber mit drei gezielten Verbesserungen, die reale Reibungspunkte für content-lastige, Edge-deployte Sites adressieren.

## Sharp: Encoder-Level-Kontrolle

Die praktischste Änderung: Sie können jetzt Codec-spezifische Defaults für Astros integrierten Sharp-Image-Pipeline direkt in `astro.config.mjs` festlegen. Vor 6.1 konnten Sie die `quality` pro Bild steuern, aber die zugrunde liegenden Encoder-Optionen — MozJPEG-Level, WebP-Effort, AVIF-Chroma-Subsampling, PNG-Komprimierung — waren fest.

In 6.1 mit `astro/assets/services/sharp`:

```js
// astro.config.mjs
export default defineConfig({
  image: {
    service: {
      config: {
        jpeg: { mozjpeg: true },
        webp: { effort: 4 },
        avif: { effort: 3, chromaSubsampling: '4:2:0' },
        png: { compressionLevel: 9 }
      }
    }
  }
});
```

Diese werden zu Defaults für die Compile-Time-Bildgenerierung. Die pro Bild gesetzte `quality` auf `<Image />`, `<Picture />` oder `getImage()` hat weiterhin Vorrang.

## SmartyPants mit Optionsobjekt

Astro unterstützt SmartyPants schon lange. 6.1 macht das vollständige `retext-smartypants`-Optionsobjekt verfügbar:

```js
export default defineConfig({
  markdown: {
    smartypants: {
      backticks: 'all',
      dashes: 'oldschool',
      ellipses: 'unspaced',
      openingQuotes: { double: '«', single: '‹' },
      closingQuotes: { double: '»', single: '›' },
      quotes: false
    }
  }
});
```

Dies ist wichtig für Sites mit Lokalisierungsanforderungen oder strengen typografischen Standards — französische, deutsche und nordische Sprachkonventionen für Anführungszeichen sind jetzt ausdrückbar.

## i18n-Fallback-Routen für Integrationen

Integrationen können jetzt Fallback-Routen sehen, die für i18n-Konfigurationen mit `fallbackType: 'rewrite'` generiert wurden. Zuvor waren diese Routen im Runtime vorhanden, wurden aber nicht über den `astro:routes:resolved`-Hook暴露. Integrationen wie die Sitemap-Integration konnten für mehrsprachige Sites unvollständige Sitemaps erzeugen.

## Der Cloudflare-Effekt

Astro ist im Januar 2026 Cloudflare beigetreten. Die 6.1-Version ist konsistent mit dieser Richtung: content-lastige Seiten auf Workers/Pages deployed, Bildoptimierung am Edge, typografisches Finishing. Astro bleibt MIT-lizenziert und plattformunabhängig, aber die Roadmap spiegelt zunehmend wider, was Cloudflares Infrastruktur einfach macht.

```bash
npm install astro@latest
```
