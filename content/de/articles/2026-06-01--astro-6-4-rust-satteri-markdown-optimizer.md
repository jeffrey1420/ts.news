---
title: "Astro 6.4: Rust-basierter Sätteri-Markdown-Prozessor und Schnellere Builds"
description: "Astro 6.4 führt einen optionalen Rust-basierten Markdown-Prozessor ein, eine neue markdown.processor-Konfigurationsoption und eine unabhängige Serververzeichnis-Preservierung."
date: 2026-06-01
image: "/images/heroes/2026-06-01--astro-6-4-rust-satteri-markdown-optimizer.png"
author: lschvn
tags: ["frameworks", "typescript", "javascript"]
---

Astro 6.4 erschien am 28. Mai mit einem Hauptfeature, das für jeden content-lastigen Site wichtig ist: ein optionaler Rust-basierter Markdown-Prozessor namens Sätteri, der entwickelt wurde, um das langsame Unified-Ökosystem für Sites mit Hunderten oder Tausenden von Markdown-Dateien zu ersetzen.

<!-- more -->

## TLDR

- Die neue `markdown.processor`-Konfigurationsoption ermöglicht den Austausch der Markdown-Pipeline von Astro
- `@astrojs/markdown-satteri` ist ein Rust-basierter Prozessor, der Builds für markdown-lastige Sites drastisch beschleunigt
- Die Serververzeichnisstruktur wird nun unabhängig über `preserveBuildServerDir` preserviert
- On-Demand-SSR-Routen leiten nun korrekt weiter, wenn eine vorgerenderte Route übereinstimmt, aber die Anfrage nicht bedienen kann

---

## Das Problem: Unified Ist Langsam bei Skala

Astro's Markdown-Pipeline hat immer das Unified-Ökosystem verwendet, remark und rehype Plugins, was leistungsstark, aber berüchtigt langsam bei Skala ist. Sites mit vielen Markdown- oder MDX-Dateien haben mehrminütige Build-Zeiten, weil der Unified-Prozessor Inhalte sequenziell parst und transformiert.

Astro 6.4 führt `markdown.processor` als neue Konfigurationsoption auf oberster Ebene ein, die die vorhandenen `remarkPlugins`- und `rehypePlugins`-Felder ersetzt:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkToc from 'remark-toc';

export default defineConfig({
  markdown: {
    processor: unified({
      remarkPlugins: [remarkToc],
    }),
  },
});
```

Bestehende Konfigurationen mit `remarkPlugins`, `rehypePlugins`, `gfm` und `smartypants` funktionieren noch, sie sind nun veraltet und werden in einer zukünftigen Major-Version entfernt.

---

## Sätteri: Die Rust-Alternative

Zusätzlich zur neuen Konfigurationsoption liefert Astro `@astrojs/markdown-satteri`, einen Prozessor, der auf der Rust-Bibliothek Sätteri basiert:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

export default defineConfig({
  markdown: {
    processor: satteri({
      features: { directive: true },
    }),
  },
});
```

Sätteri ist in Rust geschrieben und schließt bewusst das remark/rehype-Plugin-Ökosystem aus. Stattdessen unterstützt es MDAST- und HAST-Plugins nativ, bestehende Plugins müssen für den neuen Prozessor neu geschrieben werden, aber der Geschwindigkeitsgewinn bei der Skalierung ist erheblich.

Sites mit Tausenden von Markdown-Dateien sollten die dramatischsten Verbesserungen sehen. Das Astro-Team verweist direkt auf das Sätteri-Projekt unter [satteri.bruits.org](https://satteri.bruits.org/).

---

## Unabhängige Preservierung des Server-Verzeichnisses

Astro 6.4 fügt `preserveBuildServerDir` zur Adapter-Features-API hinzu. Dies bildet die vorhandene Option `preserveBuildClientDir` ab, jedoch für das Server-Ausgabeverzeichnis:

```ts
setAdapter({
  name: 'my-adapter',
  adapterFeatures: {
    buildOutput,
    preserveBuildClientDir: true,
    preserveBuildServerDir: true,
  },
});
```

Zuvor wirkte sich das Preservieren des Client-Verzeichnisses automatisch auf die Server-Verzeichnisstruktur aus. Jetzt können Adapter ein konsistentes `dist/client/`- und `dist/server/`-Layout unabhängig bewahren.

---

## SSR-Route-Fallthrough-Fix

Ein langlebiger Edge-Case in Astro's On-Demand-Rendering ist nun behoben. Wenn eine vorgerenderte dynamische Route und eine SSR-dynamische Route dasselbe URL-Muster teilten, gaben Anfragen an nicht vorgerenderte Pfade 404 zurück, anstatt zur SSR-Handler weiterzuleiten. Der Fix fügt korrekte Fallthrough-Logik hinzu.

---

## FAQ

**Sollte ich sofort auf Sätteri umsteigen?**
Wenn Ihre Site mit dem Unified-Ökosystem schnell genug ist, bleiben Sie dabei. Wenn Sie Hunderte von Markdown-Dateien haben und Build-Zeiten schmerzhaft sind, ist Sätteri einen Test wert. Beachten Sie: remark/rehype-Plugins funktionieren nicht mit Sätteri.

**Unterstützt Sätteri alle Astro-Markdown-Features?**
Es unterstützt Direktiven. Vollständiges GFM (Tabellen, Tasklisten, Durchgestrichen) und smartypants sind über Sätteri's eigene Optionen konfigurierbar.

**Was ist mit bestehenden `remarkPlugins`-Konfigurationen?**
Sie funktionieren noch in 6.4, sind aber veraltet. Astro empfiehlt, proaktiv zur neuen `processor`-API zu migrieren.
