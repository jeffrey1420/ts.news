---
title: "Astro 7.0.0-beta.6 stabilisiert das Routen-Caching und führt JSX-Whitespace-Kompression als Standard ein"
description: "Astro 7.0.0-beta.6 (19. Juni 2026) befördert die experimentelle Routen-Caching-API auf stabile Top-Level-Konfiguration. Die Flags experimental.cache und experimental.routeRules entfallen, ersetzt durch eine cache-Konfiguration der obersten Ebene und einen Cache-Helper. Beta.5 (18. Juni) hat „jsx“ zum Standardwert von compressHTML gemacht, was das gerenderte HTML jeder Site verändert, die sich auf die Whitespace-Erhaltung verlassen hat. Beta.6 zieht außerdem @astrojs/markdown-satteri 0.3.1-beta.2 nach."
date: 2026-06-20
image: "/images/heroes/2026-06-20--astro-7-0-0-beta-6-stable-cache-jsx-whitespace.png"
author: lschvn
tags: ["frameworks", "tooling", "performance"]
tldr:
  - "Astro 7.0.0-beta.6 (19. Juni 2026) befördert das seit 6.0 experimentelle Routen-Caching in eine stabile API der obersten Ebene. Die Konfigurationsschlüssel experimental.cache und experimental.routeRules entfallen und werden durch eine cache-Konfiguration auf Top-Level sowie eine deklarative routeRules-Konfiguration ersetzt, die auf standardisierte HTTP-Caching-Semantik über die Provider abgebildet wird."
  - "Beta.5 (18. Juni) hat „jsx“ zum Standardwert von compressHTML gemacht. Whitespace um Elemente herum wird nun wie bei React und ähnlichen JSX-Frameworks entfernt. Sites, die sich darauf verließen, dass Whitespace zwischen Inline-Elementen erhalten bleibt, bekommen ein anderes gerendertes HTML, sofern sie nicht zurück auf compressHTML: true (HTML-bewusste Kompression) oder false (alles erhalten) wechseln."
  - "Beta.6 zieht außerdem @astrojs/markdown-satteri 0.3.1-beta.2 nach und räumt einen Schwung kleinerer Probleme auf: Vite- und Rolldown-Build-Warnungen werden bereinigt, und die eigene 500.astro-Seite erhält keinen leeren error-Prop mehr, wenn der Fehler aus Middleware stammt (ein Beta.5-Fix, der mit Beta.6 ausgeliefert wird)."
faq:
  - question: "Was ändert sich in Astro 7.0.0-beta.6?"
    answer: "Die wichtigste Änderung in Beta.6 ist die Stabilisierung des Routen-Cachings, das seit 6.0 experimentell war. Die Konfigurationsschlüssel experimental.cache und experimental.routeRules werden entfernt; die Konfiguration erfolgt nun auf der obersten Ebene von astro.config.mjs, und die Regeln pro Route werden in einem routeRules-Block auf Top-Level deklariert. Astro übersetzt diese Regeln in Provider-spezifische Header (memoryCache, Cloudflare KV, Vercel ISR usw.) oder in Laufzeitverhalten. Beta.6 zieht außerdem @astrojs/markdown-satteri 0.3.1-beta.2 nach und räumt Vite- und Rolldown-Build-Warnungen auf."
  - question: "Was ändert sich in Astro 7.0.0-beta.5?"
    answer: "Beta.5 setzt den neuen Standardwert der Option compressHTML auf „jsx“. Whitespace um Elemente herum wird entfernt, genau wie bei React, Solid und anderen JSX-basierten Frameworks. Whitespace, der innerhalb einer einzelnen Zeile bedeutend ist, etwa ein einfaches Leerzeichen zwischen zwei Inline-Elementen, bleibt erhalten, sofern man ihn nicht explizit mit {' '} schreibt. Um Astros früheres Verhalten wiederherzustellen, setzen Sie compressHTML: true (HTML-bewusste Kompression) oder compressHTML: false (allen Whitespace erhalten)."
  - question: "Wie migriere ich von experimental.cache und experimental.routeRules in Astro 6?"
    answer: "Verschieben Sie cache und routeRules aus dem experimental-Block heraus. Verwenden Sie memoryCache, cloudflareKV, vercelISR oder einen anderen Provider aus astro/config als Wert für cache.provider, und legen Sie Ihre Regeln pro Route in routeRules auf der obersten Ebene der Konfiguration ab. In den Routen setzen Sie die Direktiven mit Astro.cache in .astro-Seiten oder mit context.cache in API-Routen und Middleware; Astro übersetzt sie in die passenden Header oder das passende Laufzeitverhalten für den konfigurierten Provider."
  - question: "Kann der neue compressHTML-Standard meine Site kaputtmachen?"
    answer: "Ja, wenn Ihre Templates darauf angewiesen sind, dass Whitespace zwischen Inline-Elementen im gerenderten HTML erhalten bleibt. Inline-Whitespace ist der häufigste Verlustfall: Ein wörtlicher Zeilenumbruch zwischen zwei Inline-Tags wird nun so entfernt, wie React es tun würde. Wenn Sie ein Leerzeichen brauchen, das der JSX-Modus entfernen würde, schreiben Sie es explizit mit {' '}. Um Astros früheres Verhalten für die Dauer einer Prüfung beizubehalten, setzen Sie compressHTML: true (HTML-bewusste Kompression, die etwas Whitespace entfernt) oder compressHTML: false (allen Whitespace erhalten)."
  - question: "Funktionieren routeRules auf vorgerenderten Seiten?"
    answer: "routeRules gelten für on-demand gerenderte Seiten und Endpoints. Für vorgerenderte Seiten werden die Cache-Direktiven beim Build in die Cache-Control-Header des statischen HTML kodiert, und zwar über die routeRules-Konfiguration. Das bedeutet, dass die Regel weiterhin steuert, wie lange ein CDN die vorgerenderte Ausgabe zwischenspeichert. Die vollständige Provider-Matrix (memoryCache, fsCache, cloudflareKV, vercelISR usw.) ist im Routen-Caching-Leitfaden dokumentiert, der mit 7.0 ausgeliefert wird."
  - question: "Ist Astro 7.0.0-beta.6 produktionsreif?"
    answer: "Nein. Beta.6 ist feature-frozen für die 7.0-Linie, aber bleibt eine Beta mit den üblichen Einschränkungen. APIs können sich bis zur stabilen 7.0 noch ändern, zwei Standardwert-Wechsel (JSX-Whitespace-Kompression in Beta.5 und die Caching-Beförderung in Beta.6) verändern das gerenderte HTML oder die Konfigurationsform für bestehende Projekte, und die in Beta.6 festgepinnte Version von @astrojs/markdown-satteri ist selbst eine Vorabversion. Verwenden Sie Beta.6, um Ihre Cache-Konfigurationsmigration, Ihre Markdown-Pipeline und Ihre Whitespace-Annahmen zu validieren, halten Sie die Produktion aber auf der aktuellen 6.x-Linie."
---

[Astro 7.0.0-beta.6](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.6) ist am 19. Juni 2026 erschienen, einen Tag nach [Beta.5](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.5) vom 18. Juni, und setzt den Lauf der 7.0-Linie fort, jede langjährige experimentelle Funktion in den stabilen Zweit zu übernehmen. Die Schlagzeile von Beta.6 ist, dass das [Routen-Caching](https://github.com/withastro/astro/pull/17116), das seit der 6.0-Veröffentlichung hinter `experimental.cache` und `experimental.routeRules` lag, nun eine stabile API auf Top-Level ist. Beta.5, die Version unmittelbar davor, hat den Standardwert von `compressHTML` auf `'jsx'` geändert, was das gerenderte HTML jedes Projekts verändert, das sich auf den Erhalt von Whitespace zwischen Inline-Elementen verlassen hat. Beide Änderungen kommen auf die [in Beta.4 vollzogene Stabilisierung der Sätteri-Markdown-Pipeline als Standard](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.4) oben drauf, die in den [Release-Notes zu Astro 7.0.0-beta.4](/articles/2026-06-16--astro-7-0-0-beta-4-satteri-default-advanced-routing) früher im Zyklus behandelt wurde.

Die 7.0-Linie bewegt sich zügig Richtung [stabil](/articles/2026-06-22--astro-7-stable-vite8-rust-compiler-ai-agents). Beta.4 (15. Juni), Beta.5 (18. Juni), Beta.6 (19. Juni) und zwei Alphas davor haben fast jede experimentelle API, die 6.x hinter einem Flag auslieferte, in stabil überführt, das Rust-native Markdown zum Standard gemacht, das Standard-Whitespace-Handling auf JSX-Stil umgestellt und nun das Routen-Caching stabilisiert. Der Migrationsaufwand für jedes Projekt auf 6.x ist real, aber mechanisch: eine Konfigurationsumbenennung, ein Whitespace-Audit und die Prüfung, dass Ihr benutzerdefinierter Cache-Provider zu den unterstützten Top-Level-Optionen gehört.

## Routen-Caching wird stabil

Das Routen-Caching war der letzte große `experimental`-Block, der aus 6.0 übrig war. Beta.6 befördert es auf eine Top-Level-Konfiguration. Die Migration besteht aus einer Umbenennung und einer Provider-Wahl:

```js
// astro.config.mjs
import { defineConfig, memoryCache } from 'astro/config';

export default defineConfig({
  cache: {
    provider: memoryCache(),
  },
  routeRules: {
    '/blog/[...path]': { maxAge: 300, swr: 60 },
  },
});
```

In `.astro`-Seiten setzen Sie die Direktiven mit `Astro.cache`, in API-Routen und Middleware mit `context.cache`. Astro übersetzt diese Direktiven in die passenden Header oder das passende Laufzeitverhalten für den konfigurierten Provider, sodass dieselbe Konfiguration mit memoryCache, fsCache, cloudflareKV, vercelISR und den weiteren Providern funktioniert, die mit der 7.0-Linie ausgeliefert werden. Die vollständige Provider-Matrix ist im [Routen-Caching-Leitfaden](https://docs.astro.build/en/guides/caching/) dokumentiert, der mit dem Release erscheint.

Für vorgerenderte Seiten greifen die Regeln weiterhin beim Build: Die Direktiven werden in die `Cache-Control`-Header des statischen HTML kodiert, was bedeutet, dass ein CDN vor Ihrer Site dieselben `maxAge`- und `swr`-Werte respektiert, die Sie auch für eine on-demand gerenderte Seite verwenden würden. Das ist die subtilste Änderung für Projekte, die bereits ein CDN vor vorgerenderter Ausgabe hatten: Dieselbe `routeRules`-Konfiguration steuert nun sowohl den on-demand Laufzeit-Cache als auch die Cache-Header der statischen Assets.

## „jsx" wird der neue Standardwert für compressHTML

[Beta.5](https://github.com/withastro/astro/releases/tag/astro%407.0.0-beta.5) hat `'jsx'` zum neuen Standardwert der Option `compressHTML` gemacht. Das ist derselbe Whitespace-Stripping-Modus, den React, Solid, Preact und die anderen JSX-basierten Frameworks verwenden: Whitespace um Elemente herum wird entfernt, eine Zeile bedeutsamen Whitespace zwischen zwei Inline-Elementen bleibt erhalten.

Der Unterschied ist in der Praxis relevant. Im älteren HTML-bewussten Kompressionsmodus (der bisherige Standard `compressHTML: true`) behielt Astro ein einzelnes Leerzeichen zwischen zwei Inline-Elementen, wenn in der Quelle ein wörtlicher Zeilenumbruch dazwischen stand. Im neuen Standard `'jsx'` wird dieser Zeilenumbruch entfernt, was bedeutet, dass ein Template wie:

```astro
<p>
  Hallo <span>Welt</span>
</p>
```

wie bisher gerendert wird, ein Template wie:

```astro
<p>
  Klick
  <a href="/x">hier</a>
  für mehr
</p>
```

aber nun ohne den Zeilenumbruch zwischen „Klick", dem Link und „für mehr" gerendert wird. Wo Sie diesen Whitespace tatsächlich sichtbar haben wollen, schreiben Sie ihn explizit mit `{' '}`.

Für Projekte, die das alte Verhalten für die Dauer eines Audits behalten müssen, ist die Migration eine Zeile:

```js
// astro.config.mjs
export default defineConfig({
  compressHTML: true, // HTML-bewusste Kompression, der 6.x-Standard
});
```

Setzen Sie `compressHTML: false`, um die Kompression komplett zu deaktivieren, oder `compressHTML: 'jsx'`, um den neuen Standard explizit festzuhalten. Beta.5 behebt außerdem eine Reihe von `astro/hono`- und `astro/fetch`-Bugs aus dem Advanced-Routing-Bereich, die sich im 7.0-Zyklus angesammelt hatten, darunter einen, bei dem die eigene `500.astro`-Seite einen leeren `error`-Prop erhielt, wenn der Fehler aus der Middleware stammte.

## Das Gesamtbild der 7.0

Zwischen Beta.4 und Beta.6 hat die 7.0-Linie nun fast alle experimentellen Funktionen, die 6.x hinter einem Flag auslieferte, stabilisiert oder ersetzt. Sätteri (Rust-natives Markdown) ist der Standard, Advanced Routing mit Hono ist stabil, der benutzerdefinierte Logger ist stabil, die Streaming-Rendering-Engine ist stabil, die JSX-Whitespace-Kompression ist der Standard, und das Routen-Caching ist nun auf Top-Level stabil. Die verbleibende 7.0-Arbeit vor der stabilen Version besteht vor allem aus Politur der Build-Toolchain, der endgültigen Graduierung von `@astrojs/markdown-satteri` und der [Vite-8-Unterstützung](https://vite.dev/), die im Laufe des Alpha- und Beta-Zyklus hinzugekommen ist.

## Was jetzt zu tun ist

Für Projekte auf 6.x: Aktualisieren Sie auf den letzten 6.x-Patch und starten Sie frühzeitig mit der Konfigurationsmigration. Ziehen Sie `cache` und `routeRules` aus dem `experimental`-Block heraus, entscheiden Sie sich für einen Provider und führen Sie Beta.6 gegen einen Staging-Branch aus. Prüfen Sie Ihre Templates auf die Whitespace-Änderung: Wo immer Sie sich darauf verlassen, dass ein Zeilenumbruch zwischen zwei Inline-Elementen sichtbaren Whitespace erzeugt, wechseln Sie auf `{' '}` oder fallen Sie vorübergehend auf `compressHTML: true` zurück, bis Sie das Audit abgeschlossen haben. Die vollständige Liste der Breaking Changes der 7.0-Linie steht im [CHANGELOG](https://github.com/withastro/astro/blob/main/packages/astro/CHANGELOG.md) des `withastro/astro`-Repos. Halten Sie die Produktion auf der 6.x-Linie und behandeln Sie Beta.6 als Validierungsziel.
