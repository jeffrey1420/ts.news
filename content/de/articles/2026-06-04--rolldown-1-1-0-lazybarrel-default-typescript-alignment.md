---
title: "Rolldown 1.1.0: Lazy Barrel Standardmassig Und TypeScript-konforme Project References"
description: "Rolldown 1.1.0 aktiviert experimental.lazyBarrel standardmassig, bringt bedeutende Build-Zeit-Verbesserungen fur Projekte mit grossen Barrel-Dateien und korrigiert gleichzeitig die tsconfig Project-Reference-Auflosung auf das TypeScript-Verhalten."
date: 2026-06-04
image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200"
author: lschvn
tags:
  - Rolldown
  - Vite
  - bundler
  - performance
  - TypeScript
tldr:
  - experimental.lazyBarrel ist jetzt standardmassig true, uberspringt die Kompilierung nicht genutzter Barrel-Exports fur bedeutende Build-Zeit-Gewinne bei Komponentenbibliotheken wie Ant Design und MUI
  - Die tsconfig Project-Reference-Auflosung entspricht jetzt dem TypeScript-Verhalten und korrigiert ein langstistiges Problem, bei dem Path-Aliasse in Monorepos falsch aufgelost wurden
  - Rolldown 1.1.0 aktualisiert oxc auf v0.134.0 und fugt die caseSensitive-Option fur import.meta.glob junto mit Sourcemap- und Code-Splitting-Verbesserungen hinzu
---

Rolldown 1.1.0 erschien am 3. Juni mit zwei verhaltensandernden Verbesserungen, die fur jeden wichtig sind, der mit Vite baut oder Rolldown direkt verwendet. Dies ist eine Minor-Version mit brechenden Standardeinstellungen, also vor dem Upgrade lesen.

## lazyBarrel Standardmassig Aktiviert

Die wichtigste Anderung: `experimental.lazyBarrel` ist jetzt standardmassig `true`. Rolldown kann jetzt erkennen, wann eine Barrel-Re-Export-Datei keine Nebeneffekte hat, und uberspringt das Kompilieren der nie tatsachlich importierten re-exportierten Module.

Fur die meisten Projekte ist dies unsichtbar — die Ausgabe ist identisch. Aber fur Codebasen mit grossen Barrel-Dateien, insbesondere Komponentenbibliotheken wie Ant Design oder `@mui/icons-material`, fuhrt dies zu einem echten Build-Zeit-Gewinn. Die Optimierung greift automatisch, wenn die Barrel-Datei als nebeneffektfrei erkannt wird.

Die Opt-out-Moglichkeit existiert, ist aber als temporar gekennzeichnet:

```js
// rolldown.config.js
export default {
  experimental: { lazyBarrel: false },
}
```

Das Rolldown-Team weist darauf hin, dass dieses Flag in einer zukunftigen Version entfernt wird. Wenn Sie es deaktivieren mussen, offnen Sie ein Issue, damit die zugrundeliegende Erkennung stattdessen verbessert werden kann.

## TypeScript Project References Funktionieren Jetzt Korrekt

Die zweite wichtige Anderung ist eine Korrektur der Art und Weise, wie Rolldown Solution-Style-tsconfigs auflost — die Art, die Vite mit einer Root-`tsconfig.json` scaffolt, die nur References auflistet und die eigentlichen Compiler-Optionen an `tsconfig.app.json` oder `tsconfig.node.json` delegiert.

Rolldown loste Project References zuvor anders auf als `tsc`:

- **Reference-Match-Prioritat**: Wenn die Root References hat, hat ein referenziertes Projekt, das eine Datei enthalt, jetzt Vorrang vor der Root — entsprechend TypeScript. Zuvor stimmte die Root zuerst uberein und uberschrieb die `paths`-Einstellungen auf Projektebene.
- **allowJs-Verhalten**: Ob eine `.js`/`.jsx`-Datei eingeschlossen wird, wird jetzt durch das eigene `allowJs` jedes referenzierten Projekts entschieden, nicht durch das der Root. Das bedeutet, `tsconfig.app.json` mit `allowJs: true` + `paths` lost jetzt Aliasse fur JS-Dateien auf, selbst wenn die Root kein `allowJs` setzt.

Fur die meisten Vite-Monorepo-Setups ist dies eine **Korrektur**, keine Regression. Die standardmassigen Path-Aliasse funktionieren jetzt wie erwartet und losen ein als [#8468](https://github.com/rolldown/rolldown/issues/8468) gemeldetes Problem.

Wenn Sie sich auf das alte "Root gewinnt"-Verhalten verlassen haben: Es gibt keine Option, es wiederherzustellen, da das alte Verhalten der Bug war. Der empfohlene Weg ist, Ihre Konfiguration mit TypeScript auszurichten, indem Sie die Paths auf dem referenzierten Projekt deklarieren, das die Dateien tatsachlich besitzt.

## Weitere Anderungen

Rolldown 1.1.0 enthalt ausserdem:

- `import.meta.glob` erhalt eine `caseSensitive`-Option
- Neue `SOURCEMAP_BROKEN`-Warnungen fur die `renderChunk`- und `transform`-Hooks
- `NO_SIDE_EFFECTS`-Hint wird jetzt ausgegeben, wenn `@__PURE__` falsch vor Funktionsdeklarationen platziert wird
- Code-Splitting erhalt Unterstutzung fur `group-local includeDependenciesRecursively`
- oxc auf v0.134.0 aktualisiert, bringt strengeres TypeScript-Declaration-Parsing

Rolldown betreibt Vites Bundler, daher werden diese Verbesserungen automatisch wirksam, sobald Vite die neue Rolldown-Version einsetzt. Achten Sie in den nachsten Tagen auf ein Vite-Update.
