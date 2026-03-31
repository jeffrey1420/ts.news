---
title: "Bun v1.3.11 mit nativem OS-Level Cron und Beitritt zu Anthropics KI-Coding-Stack"
description: "Bun v1.3.11 liefert ein 4MB kleineres Binary, Bun.cron für OS-Level-geplante Jobs, und markiert einen entscheidenden Moment, da die Runtime Anthropic beitritt, um Claude Code anzutreiben."
image: "https://bun.com/og/blog.png"
date: "2026-03-30"
author: lschvn
tags: ["bun", "runtime", "javascript", "typescript", "ai", "anthropic", "news"]
tldr:
  - "Anthropic hat Bun im Dezember 2025 übernommen, um Claude Code anzutreiben; Bun bleibt MIT-lizenziert und Open Source mit intaktem Core-Team."
  - "Bun v1.3.11 liefert Bun.cron für plattformübergreifende OS-Level-geplante Jobs (crontab/launchd/Task Scheduler)."
  - "Das Linux-x64-Binary ist 4 MB kleiner; Bun v1.3.10 fügte vollständige TC39-Standard-ES-Decorators und einen nativen Zig-REPL hinzu."
  - "Barrel-Import-Optimierung in v1.3.10 schneidet Build-Zeiten um bis zu 2x für große Bibliotheken wie antd und @mui/material."
---

Das JavaScript-Ökosystem bewegt sich schnell, aber seltene Releases in jüngster Zeit tragen so viel Gewicht wie das, was Jarred Sumner diesen Monat mit Bun ausgeliefert hat. Am 18. März 2026 landete Bun v1.3.11 mit einer Mischung aus Developer-Experience-Verbesserungen, Performancegewinnen und einer stillen Anerkennung einer großen Verschiebung hinter den Kulissen: **Bun ist Anthropic beigetreten**.

## Der Elefant im Raum: Bun tritt Anthropic bei

Zuerst die größere Geschichte. Im Dezember 2025 übernahm Anthropic Bun mit einem klaren Mandat: Bun zum Rückgrat der Infrastruktur von Claude Code, des Claude Agent SDK und jedes zukünftigen KI-Coding-Produkts des Unternehmens zu machen. Claude Code [wird bereits als Bun-Executable](/articles/claude-code-rise-ai-coding-tool-2026) an Millionen von Nutzern ausgeliefert — und wie Sumner im Übernahme-Post sagte, "wenn Bun kaputtgeht, geht Claude Code kaputt." Anthropic hat jetzt direkten Engineering-Anreiz, Bun exzellent zu halten.

Die Implikationen sind signifikant. Bun bleibt MIT-lizenziert und Open Source, und das Core-Team bleibt intakt. Aber die Roadmap hat jetzt einen engeren Fokus: Hochperformantes JavaScript-Tooling, Node.js-Kompatibilität und das Standard-Server-Runtime werden. Der Unterschied ist, dass Anthropics eigene Tools jetzt davon abhängen, dass Bun überlebt und gedeiht — eine kraftvolle Interessenangleichung.

## Bun v1.3.11: Was ist neu

Die März-18-Veröffentlichung ist vollgepackt. Hier ist das, was für TypeScript- und JavaScript-Entwickler am wichtigsten ist:

### Bun.cron — OS-Level-geplante Jobs, nativ

Das Hauptfeature von v1.3.11 ist `Bun.cron`, eine eingebaute API zum Registrieren von OS-Level-Cron-Jobs, die plattformübergreifend funktioniert (crontab unter Linux, launchd unter macOS, Task Scheduler unter Windows).

```typescript
// Cron-Job registrieren
await Bun.cron("./worker.ts", "30 2 * * MON", "weekly-report");
```

```typescript
// worker.ts
export default {
  async scheduled(controller) {
    // controller.cron === "30 2 * * 1"
    await doWork();
  },
};
```

Die API parst nativ Cron-Ausdrücke — einschließlich benannter Tage (`MON–SUN`), Nicknames (`@yearly`, `@daily`) und POSIX-ODER-Logik — und unterstützt das programmatische Entfernen von Jobs. Dies ersetzt eine ganze Kategorie von `node-cron` und `cron` npm-Paketen, und es läuft auf OS-Scheduler-Ebene statt in der Node.js-Event-Loop, was es für Produktions-Workloads viel zuverlässiger macht.

### Bun.sliceAnsi — ANSI-bewusstes String-Slicing

Ein neues Builtin ersetzt sowohl die `slice-ansi` als auch `cli-truncate` npm-Pakete. `Bun.sliceAnsi` slicet Strings nach Terminal-Spaltenbreite und bewahrt dabei ANSI-Escape-Codes (SGR-Farben, OSC-8-Hyperlinks) und respektiert Graphem-Cluster-Grenzen — Emoji, kombinierende Zeichen und Flaggen werden korrekt behandelt.

```typescript
Bun.sliceAnsi("\x1b[31mhello\x1b[39m", 1, 4); // "\x1b[31mell\x1b[39m"
Bun.sliceAnsi("unicorn", 0, 4, "…"); // "uni…"
```

Unter der Haube verwendet es eine dreistufige Dispatch-Strategie: SIMD-ASCII-Fast-Path, Single-Pass-Streaming für häufige Fälle und einen Zwei-Pass-Algorithmus für negative Indizes.

### 4 MB kleiner auf Linux x64

Das Linux-x64-Binary ist jetzt 4 MB kleiner. Das ist eine sinnvolle Verbesserung für CI/CD-Umgebungen, wo jede Millisekunde und jedes Megabyte zählt.

## Bun v1.3.10: Der Decorator- und REPL-Durchbruch

Nur knapp vor dem v1.3.11-Release brachte das Update vom 26. Februar zwei Features, auf die TypeScript-Entwickler seit Jahren gewartet haben.

### Vollständige TC39-Standard-ES-Decorators

Buns Transpiler unterstützt jetzt vollständig **Stage-3-TC39-Standard-ES-Decorators** — die nicht-legacy Variante, die aktiviert wird, wenn `experimentalDecorators` *nicht* in Ihrer `tsconfig.json` gesetzt ist. Das bedeutet, dass Code mit moderner Decorator-Syntax — einschließlich des `accessor`-Schlüsselworts, Decorator-Metadaten über `Symbol.metadata` und den `ClassMethodDecoratorContext` / `ClassFieldDecoratorContext` APIs — jetzt out of the box korrekt funktioniert.

```typescript
function logged(originalMethod: any, context: ClassMethodDecoratorContext) {
  const name = String(context.name);
  return function (this: any, ...args: any[]) {
    console.log(`Entering ${name}`);
    const result = originalMethod.call(this, ...args);
    console.log(`Exiting ${name}`);
    return result;
  };
}

class Example {
  @logged
  greet(name: string) {
    console.log(`Hello, ${name}!`);
  }
}
```

Auto-Accessors mit dem `accessor`-Schlüsselwort — einschließlich auf privaten Feldern — werden unterstützt, ebenso wie `addInitializer`, Decorator-Metadaten und korrekte Auswertungsreihenfolge. Legacy-TypeScript-Decorators (`experimentalDecorators: true`) funktionieren unverändert weiter.

Dies war eines der am häufigsten angeforderten Features seit 2023. Bis jetzt unterstützte Bun nur die Legacy-Decorator-Syntax, was bedeutete, dass Bibliotheken, die auf die TC39-Spezifikation abzielten — einschließlich `signal-polyfill` und Angulars kommendem Rendering-Pipeline — entweder nicht parsten oder inkorrekte Ergebnisse lieferten.

### Native in Zig geschriebene REPL

Buns REPL wurde zuvor von einem Drittanbieter-npm-Paket unterstützt. v1.3.10 ersetzte es vollständig durch eine native Zig-Implementierung, die ohne Paket-Downloads sofort startet. Die neue REPL wird mit Syntax-Highlighting, Emacs-Keybindings, persistentem Verlauf, Tab-Completion, Multi-Line-Input und Top-Level-`await` ausgeliefert — alles mit proper `const`/`let`-Semantik, die über Zeilen hinweg bestehen.

### Barrel-Import-Optimierung

Wenn Sie `import { Button } from 'antd'` eingeben, musste der Bundler traditionell jede Datei parsen, die `antd/index.js` re-exportiert — potentiell tausende von Modulen. Bun v1.3.10 erkennt reine Barrel-Dateien und parst nur die Submodule, die Sie tatsächlich verwenden. Für große Komponentenbibliotheken wie `antd`, `@mui/material` oder `lodash-es` halbiert dies die Build-Zeiten. Es funktioniert automatisch für Pakete mit `"sideEffects": false`, oder kann explizit über `optimizeImports` in `Bun.build()` aktiviert werden.

### Weitere bemerkenswerte Ergänzungen

- **`--compile --target=browser`** — erzeugt eigenständige HTML-Dateien mit allen JS, CSS und Assets als Data-URIs inline
- **Windows-ARM64-nativer Support** — Bun nativ auf Snapdragon-Windows-Maschinen ausführen und Executables für `bun-windows-arm64` cross-kompilieren
- **Bis zu 25x schnelleres `structuredClone`** für Arrays via JSC-Upgrade
- **`Bun.JSON5` und `Bun.JSONL` Parser eingebaut**

## Was das für das Ökosystem bedeutet

Das Bun-und-Anthropic-Paaring ist mehr als eine Übernahme — es ist eine Absichtserklärung darüber, wohin KI-gestützte Entwicklung sich entwickelt. Die Tools, die Code in großem Maßstab schreiben, testen und bereitstellen, sind zunehmend dieselben Tools, die Entwickler zum lokalen Ausführen ihrer Server verwenden. Bun positioniert sich als "All-in-One"-Runtime (Bundler, Test-Runner, Paketmanager, Server-Runtime), was es zu einer natürlichen Passform für KI-Agents macht, die Code zuverlässig über Umgebungen hinweg ausführen müssen.

Für TypeScript-Entwickler spezifisch ist der vollständige TC39-Decorator-Support in v1.3.10 ein leiser aber wichtiger Durchbruch. Der Decorator-Vorschlag befindet sich seit über zwei Jahren in Stage 3 und wird allgemein erwartet, in naher Zukunft Stage 4 zu erreichen — und letztendlich in der ECMAScript-Spezifikation zu landen. Buns frühe Unterstützung bedeutet, dass Sie heute zukunftssicheren Decorator-basierten Code schreiben können.

Installieren oder upgraden mit:

```bash
bun upgrade
```

Oder von Grund auf installieren auf [bun.sh](https://bun.sh).
