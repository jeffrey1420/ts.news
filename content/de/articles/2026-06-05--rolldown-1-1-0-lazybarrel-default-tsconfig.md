---
title: "Rolldown 1.1.0: lazyBarrel jetzt standardmäßig aktiviert"
description: "Rolldown 1.1.0 bringt zwei wichtige Verhaltensänderungen: experimental.lazyBarrel ist nun standardmäßig aktiviert, und die tsconfig-Projektreferenz-Auflösung entspricht jetzt dem TypeScript-Verhalten."
date: 2026-06-05
image: "/images/heroes/2026-06-05--rolldown-1-1-0-lazybarrel-default-tsconfig.png"
author: lschvn
tags: ["tooling", "javascript"]
tldr:
  - "\"experimental.lazyBarrel\" ist jetzt standardmäßig true und überspringt nicht verwendete Barrel-Exporte für deutliche Build-Zeitverbesserungen bei großen Komponentenbibliotheken"
  - oxc_resolver auf 11.21.0 aktualisiert, was die tsconfig-Projektreferenz-Auflösung an das genaue TypeScript-Verhalten anpasst
  - Die Deaktivierungsoption für lazyBarrel soll in einer zukünftigen Version entfernt werden
---

Rolldown 1.1.0 erschien am 3. Juni 2026. Trotz der Bezeichnung als Minor-Release bringt es zwei Verhaltensänderungen mit, die vor einem Upgrade geprüft werden sollten.

## lazyBarrel standardmäßig aktiviert

Die wichtigste Änderung: `experimental.lazyBarrel` ist jetzt standardmäßig `true`. Wenn ein Barrel-Modul (eine Datei, die von anderen Modulen re-exportiert) als frei von Nebeneffekten erkannt wird, überspringt Rolldown die Kompilierung der nicht verwendeten re-exportierten Module.

Der praktische Vorteil zeigt sich am deutlichsten bei großen Komponentenbibliotheken wie Ant Design oder `@mui/icons-material`. In vielen Codebasen exportieren diese Bibliotheken Hunderte von Icons oder Komponenten über Barrel-Dateien, aber eine Anwendung verwendet nur eine Handvoll davon. Mit lazyBarrel, das nun standardmäßig aktiviert ist, kann Rolldown die ungenutzten Exporte jetzt vollständig überspringen – sowohl die Build-Zeit als auch die finale Bundle-Größe profitieren davon.

Die Release-Notes weisen auf einen Grenzfall hin: Wenn ein Barrel fälschlicherweise als frei von Nebeneffekten eingestuft wird, könnte die Optimierung ein Modul entfernen, auf das für seine Nebeneffekte verlassen wurde. Der Workaround ist einfach:

```js
export default {
  experimental: { lazyBarrel: false },
}
```

Das Rolldown-Team weist darauf hin, dass diese Deaktivierungsoption in einem zukünftigen Release entfernt werden soll. Falls ein Fall auftritt, in dem sie benötigt wird, sollte ein Issue geöffnet werden, damit die zugrunde liegende Erkennungslogik verbessert werden kann.

## tsconfig-Projektreferenz-Auflösung entspricht TypeScript

Die zweite Änderung betrifft die Auflösung von Pfaden durch Solution-Style-tsconfig-Dateien (das von Vite standardmäßig verwendete Muster, bei dem `tsconfig.json` nur Referenzen auflistet und die eigentlichen Einstellungen an `tsconfig.app.json` oder `tsconfig.node.json` delegiert).

Das Upgrade von oxc_resolver von 11.19.1 auf 11.21.0 bringt Rolldowns Auflösung in Einklang mit dem Verhalten von `tsc`:

- **Referenz-Priorität**: Wenn die Root-tsconfig Referenzen hat, hat nun ein referenziertes Projekt, das eine Datei enthält, Vorrang vor der Root. Zuvor wurde die Root zuerst gematcht.

- **allowJs-Verhalten**: Ob eine `.js`, `.jsx`, `.mjs` oder `.cjs`-Datei eingeschlossen wird, wird nun durch die `allowJs`-Einstellung des jeweiligen referenzierten Projekts entschieden, nicht durch die der Root.

Das Release räumt ein, dass dies eine Verhaltensänderung für Projekte ist, die sich auf das vorherige "Root gewinnt"-Verhalten verlassen haben. Der empfohlene Weg ist, die tsconfig-Struktur an TypeScripts Erwartungen anzupassen.

## Weitere Änderungen

Das vollständige Changelog enthält außerdem:

- `import.meta.glob` unterstützt jetzt eine `caseSensitive`-Option
- Eine `SOURCEMAP_BROKEN`-Warnung wird für die `renderChunk`- und `transform`-Hooks ausgegeben, wenn Sourcemaps ungültig sein könnten
- Verbesserte Fehlermeldungen: eine fehlende tsconfig meldet nun `TSCONFIG_ERROR` statt `UNHANDLEABLE_ERROR`
- Code-Splitting unterstützt jetzt `group-local` `includeDependenciesRecursively`
- Mehrere Bugfixes im Chunk-Optimizer für die Handhabung dynamischer Entries

Rolldown 1.1.0 ist jetzt auf npm verfügbar.

---

faq:
  - question: "Was bedeutet 'lazyBarrel' in Rolldown?"
    answer: "Ein 'Barrel' ist eine Datei, die von mehreren anderen Modulen re-exportiert. Die lazyBarrel-Optimierung erkennt, wenn ein Barrel keine Nebeneffekte hat, und überspringt die Kompilierung der nicht verwendeten re-exportierten Module – das beschleunigt Builds für große Bibliotheken erheblich."
  - question: "Mein Build funktioniert nach dem Rolldown-Upgrade nicht mehr. Was sollte ich prüfen?"
    answer: "Prüfen Sie zuerst, ob Sie sich auf Nebeneffekte von Barrel-Re-exports verlassen. Sie können vorübergehend mit `experimental: { lazyBarrel: false }` deaktivieren. Wenn Sie TypeScript-Projektreferenzen verwenden, verifizieren Sie, dass Ihre tsconfig-Struktur den TypeScript-Erwartungen entspricht."
  - question: "Wie wirkt sich das auf Vite-Nutzer aus?"
    answer: "Rolldown ist der Bundler, der [Vite 8](/articles/2026-04-08--vite-8-stable-seven-patches-in-three-weeks) und höher antreibt. Diese Änderungen gelten automatisch, wenn Sie Rolldown als Abhängigkeit aktualisieren oder wenn Vite eine neue Rolldown-Version ausliefert."
