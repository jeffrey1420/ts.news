---
title: "Deno 2.7 Stabilisiert die Temporal API, Fügt Windows ARM Support und npm Overrides Hinzu"
description: "Deno 2.7 ist ein umfangreiches Release im 2.x-Zyklus: Die Temporal API ist nun produktionsreif, native Windows-on-ARM-Builds sind da, npm overrides funktionieren wie in Node, und Dutzende von Node.js-Kompatibilitätsverbesserungen landen."
date: "2026-04-07"
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop"
author: lschvn
tags: ["deno", "javascript", "typescript", "runtime", "temporal-api", "nodejs"]
---

Deno 2.7 wurde am 25. Februar veröffentlicht und ist eine der funktionsreichsten Releases in der 2.x-Reihe. Die Highlights sind die Stabilisierung der Temporal API, offizielle Windows-on-ARM-Builds und npm `overrides`-Support — aber das Release enthält auch eine bedeutende Menge an Node.js-Kompatibilitätsarbeit.

[tldr]
- Die TC39 Temporal API ist nun stable in Deno ohne das `--unstable-temporal`-Flag — Chrome 144 hat sie im Januar 2026 ausgeliefert, Deno zieht nach
- Native Windows-on-ARM-Builds (aarch64-pc-windows-msvc) sind nun offiziell: Surface Pro X, Snapdragon-Laptops, kein Emulationsoverhead
- Das npm `overrides`-Feld in package.json funktioniert nun, ermöglicht das Pinnen transitiver Abhängigkeiten tief im Baum
- Dutzende von Node.js-Kompatibilitätsfixes: worker_threads, child_process, zlib, sqlite alle verbessert
- Deno Deploy erreichte im selben Zyklus die allgemeine Verfügbarkeit
[/tldr]

## Temporal API: Endlich Stabil

Die [Temporal API](https://tc39.es/proposal-temporal/docs/) ist TC39s lang erwarteter Ersatz für JavaScripts defektes `Date`-Objekt. Deno 2.7 stabilisiert sie und macht Deno zu einer der ersten Runtimes mit einer produktionsreifen Implementierung neben Chrome 144 (Januar 2026).

```typescript
const today = Temporal.Now.plainDateISO();
const nextMonth = today.add({ months: 1 });

const meeting = Temporal.ZonedDateTime.from(
  "2026-03-15T14:30[America/New_York]",
);
const inTokyo = meeting.withTimeZone("Asia/Tokyo");
```

Wenn Sie das `--unstable-temporal`-Flag verwendet haben, entfernen Sie es. Die API ist unverändert.

## Windows on ARM: Die Letzte Plattformlücke schließt sich

Dies war eine [lange angefragte Funktion](https://github.com/denoland/deno/issues/8422). Deno liefert nun offizielle aarch64-pc-windows-msvc-Builds. Native Leistung auf Surface Pro X, Lenovo ThinkPad X13s und Snapdragon-powered Laptops bedeutet keinen x86-Emulationsoverhead für TypeScript-Kompilierung oder jede andere Deno-Workload.

## npm Overrides: Transitive Abhängigkeiten Pinnen

Das `overrides`-Feld von npm ermöglicht es, Packages tief im Abhängigkeitsbaum zu pinnen oder zu ersetzen — nützlich für Sicherheitspatches auf transitiven deps oder zur Durchsetzung von Kompatibilität. Deno's erstklassiger package.json-Support handhabt dies nun:

```json
{
  "dependencies": {
    "express": "^4.18.0"
  },
  "overrides": {
    "cookie": "0.7.0",
    "express": {
      "qs": "6.13.0"
    }
  }
}
```

`cookie` wird überall auf 0.7.0 gepinnt; `qs` wird nur überschrieben, wenn express es benötigt. Dieses Muster ist im npm-Ökosystem üblich, um Sicherheitspatches anzuwenden, ohne auf offizielle Releases zu warten.

## Node.js-Kompatibilität: worker_threads und child_process

Die Node.js-Kompatibilitätsschicht schließt weiterhin Lücken. Highlights der worker_threads-Arbeit:

- stdout wird nun an den übergeordneten Prozess weitergeleitet
- stdin-Support hinzugefügt
- `worker.terminate()` gibt nun den korrekten Exit-Code zurück
- `process.exit()` in einem Worker stoppt die Ausführung sofort
- `ref()`/`unref()` ist nun wie in Node idempotent
- `worker.cpuUsage()` implementiert

Für `child_process`: stdio-Streams sind nun echte Socket-Instanzen, Shell-Weiterleitungen funktionieren in exec, `fork()` akzeptiert URL als modulePath, und `NODE_OPTIONS` wird für `--require` und `--inspect-publish-uid` respektiert.

## Breiteres Deno-Ökosystem

In diesem Zyklus erreichte Deno Deploy auch die allgemeine Verfügbarkeit (3. Februar) und die Einführung von [Deno Sandbox](https://deno.com/blog/introducing-deno-sandbox) — sofort einsatzbereite Linux-MicroVMs zum Ausführen nicht vertrauenswürdigen Codes mit Defense-in-Depth-Sicherheit.

Das Deno-Team deckte auch auf, dass Deno-Deploy-Nutzer vor zwei hochkritischen React-Server-Components-/Next.js-Schwachstellen Ende 2025 geschützt waren (CVE-2025-55184 und die RCE in React Server Functions), mit automatischen Abschwächungen, die am Edge bereitgestellt wurden.

[faq]
- **Muss ich meinen Code für die Temporal API ändern?** Wenn Sie `--unstable-temporal` verwendet haben, entfernen Sie dieses Flag. Die API ist unverändert.
- **Kann ich npm-Pakete mit Deno ausführen?** Ja — Deno hat erstklassigen package.json-Support und kann die meisten npm-Pakete direkt ausführen.
- **Ist Deno Deploy produktionsreif?** Ja — es erreichte am 3. Februar 2026 die allgemeine Verfügbarkeit.
[/faq]
