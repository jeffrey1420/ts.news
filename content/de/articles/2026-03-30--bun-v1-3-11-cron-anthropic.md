---
title: "Bun v1.3.11 mit nativer OS-Level Cron und Beitritt zu Anthropics KI-Coding-Stack"
description: "Bun v1.3.11 liefert ein 4MB kleineres Binary, Bun.cron für OS-Level geplante Jobs, und markiert einen entscheidenden Moment, da die Runtime Anthropic beitritt, um Claude Code und zukünftige KI-Coding-Tools anzutreiben."
image: "https://bun.com/og/blog.png"
date: "2026-03-30"
author: lschvn
tags: ["bun", "runtime", "javascript", "typescript", "ai", "anthropic", "news"]
tldr:
  - "Anthropic hat Bun im Dezember 2025 übernommen, um Claude Code anzutreiben; Bun bleibt MIT-lizenziert und Open Source mit intaktem Kernteam."
  - "Bun v1.3.11 liefert Bun.cron für plattformübergreifende OS-Level geplante Jobs (crontab/launchd/Task Scheduler) und ersetzt node-cron."
  - "Das Linux x64 Binary ist 4 MB kleiner; Bun v1.3.10 fügte vollständige TC39 Standard ES Decorators und einen Zig-nativen REPL hinzu."
  - "Barrel-Import-Optimierung in v1.3.10 schneidet Build-Zeiten um bis zu 2x für große Bibliotheken wie antd und @mui/material."
---

Das JavaScript-Ökosystem bewegt sich schnell, aber seltene Releases in letzter Zeit tragen so viel Gewicht wie das, was Jarred Sumner's Bun diesen Monat geliefert hat. Am 18. März 2026 landete Bun v1.3.11 mit einer Mischung aus Developer-Experience-Verbesserungen, Performance-Gewinnen und einer stillen Anerkennung einer großen Verschiebung hinter den Kulissen: **Bun ist Anthropic beigetreten**.

## Das Elefant im Raum: Bun tritt Anthropic bei

Zuerst die größere Geschichte. Im Dezember 2025 übernahm Anthropic Bun mit einem klaren Mandat: Make Bun das infrastrukturelle Rückgrat von Claude Code, dem Claude Agent SDK und jedem zukünftigen KI-Coding-Produkt, das das Unternehmen baut. Claude Code [wird bereits als Bun-Executable]((https://bun.sh)) an Millionen von Nutzern ausgeliefert – und wie Sumner in der Übernahme-Ankündigung sagte: "If Bun breaks, Claude Code breaks." Anthropic hat jetzt direkten engineering incentive, Bun exzellent zu halten.

Die Implikationen sind signifikant. Bun bleibt MIT-lizenziert und Open Source, und das Kernteam bleibt intakt. Aber die Roadmap hat jetzt einen engeren Fokus: hochperformantes JavaScript-Tooling, Node.js-Kompatibilität und das Standard-Server-Side-Runtime werden. Der Unterschied ist, dass Anthropics eigene Tools jetzt davon abhängen, dass Bun überlebt und gedeiht – eine potente Interessenangleichung.

## Bun v1.3.11: Was ist neu

Die March 18 Veröffentlichung ist vollgepackt. Hier ist, was für TypeScript und JavaScript-Entwickler am wichtigsten ist:

### Bun.cron — OS-Level geplante Jobs, nativ

Die Hauptfunktion von v1.3.11 ist `Bun.cron`, eine eingebaute API zum Registrieren von OS-Level Cron-Jobs, die plattformübergreifend funktioniert (crontab auf Linux, launchd auf macOS, Task Scheduler auf Windows).

```typescript
// Register a cron job
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

Die API parst Cron-Ausdrücke nativ – einschließlich benannter Tage (`MON–SUN`), Nicknames (`@yearly`, `@daily`) und POSIX OR-Logik – und unterstützt das programmatische Entfernen von Jobs. Dies ersetzt eine ganze Kategorie von `node-cron` und `cron` npm-Paketen, und es läuft auf OS-Scheduler-Ebene statt innerhalb der Node.js Event-Loop und ist damit wesentlich zuverlässiger für Produktionsworkloads.

### Bun.sliceAnsi — ANSI-bewusstes String-Slicing

Ein neues Built-in ersetzt sowohl das `slice-ansi` als auch das `cli-truncate` npm-Paket. `Bun.sliceAnsi` slicet Strings nach Terminal-Spaltenbreite und erhält dabei ANSI Escape Codes (SGR Colors, OSC 8 Hyperlinks) und respektiert Grapheme-Cluster-Grenzen – Emoji, Combining Marks und Flags werden korrekt behandelt.

```typescript
Bun.sliceAnsi("\x1b[31mhello\x1b[39m", 1, 4); // "\x1b[31mell\x1b[39m"
Bun.sliceAnsi("unicorn", 0, 4, "…"); // "uni…"
```

Unter der Haube verwendet es eine Three-Tier-Dispatch-Strategie: SIMD ASCII Fast Path, Single-Pass-Streaming für häufige Cases und einen Two-Pass-Algorithmus für negative Indizes.

### 4 MB kleiner auf Linux x64

Das Linux x64 Binary ist jetzt 4 MB kleiner. Das ist eine sinnvolle Verbesserung für CI/CD-Umgebungen, wo jede Millisekunde und jedes Megabyte zählt.

## Bun v1.3.10: Der Decorator und REPL-Durchbruch

Just under the v1.3.11 Release, brachte das February 26 Update zwei Features, auf die TypeScript-Entwickler besonders seit Jahren warten.

### Vollständige TC39 Standard ES Decorators

Bun's Transpiler unterstützt jetzt vollständig **Stage-3 TC39 Standard ES Decorators** – die nicht-legacy Variante, die aktiviert wird, wenn `experimentalDecorators` *nicht* in deiner `tsconfig.json` gesetzt ist. Das bedeutet, dass Code mit moderner Decorator-Syntax – einschließlich des `accessor` Keywords, Decorator-Metadaten via `Symbol.metadata` und den `ClassMethodDecoratorContext` / `ClassFieldDecoratorContext` APIs – jetzt out of the box korrekt funktioniert.

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

Auto-Accessors mit dem `accessor` Keyword – einschließlich auf privaten Feldern – werden unterstützt, ebenso wie `addInitializer`, Decorator-Metadaten und korrekte Evaluierungsreihenfolge. Legacy TypeScript Decorators (`experimentalDecorators: true`) funktionieren weiterhin unverändert.

Dies war eine der meist angefragten Features seit 2023. Bis jetzt unterstützte Bun nur die Legacy-Decorator-Syntax, was bedeutete, dass Bibliotheken, die auf die TC39-Spec ausgerichtet waren – einschließlich `signal-polyfill` und Angular's upcoming Rendering Pipeline – entweder nicht parsten oder inkorrekte Ergebnisse produzierten.

### Native REPL in Zig geschrieben

Bun's REPL wurde zuvor von einem Drittanbieter-npm-Paket betrieben. v1.3.10 ersetzte es vollständig durch eine Zig-native Implementierung, die instant startet ohne Package-Downloads. Das neue REPL kommt mit Syntax-Highlighting, Emacs-Keybindings, persistenter History, Tab-Completion, Multi-Line-Input und Top-Level-`await` – alles mit korrekten `const`/`let` Semantics, die über Zeilen hinweg persistieren.

### Barrel Import Optimierung

Wenn du `import { Button } from 'antd'` importierst, musste der Bundler traditionell jede Datei parsen, die `antd/index.js` re-exported – potenziell tausende Module. Bun v1.3.10 erkennt pure Barrel-Dateien und parst nur die Submodule, die du tatsächlich verwendest. Für große Komponentenbibliotheken wie `antd`, `@mui/material` oder `lodash-es` schneidet dies Build-Zeiten um bis zu 2x. Es funktioniert automatisch für Packages mit `"sideEffects": false`, oder kann explizit via `optimizeImports` in `Bun.build()` aktiviert werden.

### Andere bemerkenswerte Ergänzungen

- **`--compile --target=browser`** – produziert eigenständige HTML-Dateien mit allen JS, CSS und Assets als Data URIs inline
- **Windows ARM64 native Unterstützung** – Bun nativ auf Snapdragon Windows-Maschinen ausführen und Executables für `bun-windows-arm64` kreuzkompilieren
- **Bis zu 25x schnelleres `structuredClone`** für Arrays via JSC-Upgrade
- **`Bun.JSON5` und `Bun.JSONL`** Parser eingebaut

## Was das für das Ökosystem bedeutet

Das Bun-and-Anthropic Pairing ist mehr als eine Übernahme – es ist eine Absichtserklärung darüber, wohin KI-gestützte Entwicklung geht. Die Tools, die Code in großem Maßstab schreiben, testen und deployen, sind zunehmend dieselben Tools, die Entwickler zum lokalen Ausführen ihrer Server verwenden. Bun, das sich als "All-in-One" Runtime positioniert (Bundler, Test-Runner, Package Manager, Server Runtime), macht es zu einer natürlichen Passform für KI-Agents, die Code zuverlässig über Umgebungen hinweg ausführen müssen. Für Kontext, wie Buns Performance im Vergleich zu Node.js und Deno in unabhängigen Benchmarks abschneidet, sieh dir unseren [Runtime-Vergleich](/articles/bun-vs-node-vs-deno-2026-runtime-benchmark) an.

Für TypeScript-Entwickler speziell ist die vollständige TC39 Decorator-Unterstützung in v1.3.10 ein leiser aber wichtiger Freischalter. Der Decorator-Vorschlag befindet sich seit über zwei Jahren in Stage 3 und wird allgemein erwartet, in naher Zukunft Stage 4 zu erreichen – und schließlich im ECMAScript-Spec zu landen. Buns frühe Unterstützung bedeutet, du kannst heute zukunftssicheren Decorator-basierten Code schreiben.

Installiere oder upgrade mit:

```bash
bun upgrade
```

Oder installiere von Grund auf auf [bun.sh](https://bun.sh).
