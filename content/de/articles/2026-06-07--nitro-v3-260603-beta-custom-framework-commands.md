---
title: "Nitro v3.0.260603-beta: Custom Framework Commands und defaultPreset-Config"
description: "Der neueste Nitro-Beta fügt Support für benutzerdefinierte Framework-Preview- und Deploy-Befehle hinzu, führt die defaultPreset-Config-Option ein und behebt einen Edge-Case beim Type-Stripping."
date: 2026-06-07
image: "/images/heroes/2026-06-07--nitro-v3-260603-beta-custom-framework-commands.png"
author: lschvn
tags: ["runtimes", "frameworks", "typescript"]
tldr:
  - "Nitro 3 Beta erlaubt es Frameworks jetzt, eigene Preview- und Deploy-Befehle zu injizieren, was eine engere Integration mit plattformspezifischen Tools ermöglicht."
  - "Eine neue defaultPreset-Config-Option erlaubt die Anpassung des Fallback-Preset, wenn kein explizites Preset angegeben ist, und gibt mehr Kontrolle über das Deployment-Verhalten."
  - "Ein Type-Stripping-Fix stellt sicher, dass TypeScript-Erweiterungsversuche nur für die tatsächlich erneut versuchten Erweiterungen gelten, nicht für alle möglichen."
faq:
  - question: "Was bedeutet 'Custom Framework Preview/Deploy Commands' in Nitro 3?"
    answer: "Framework-Plugins können jetzt ihre eigenen Preview- und Deploy-Befehle bereitstellen, die Nitro als Teil der Build-Pipeline aufruft. Dies erlaubt auf Nitro aufbauenden Frameworks, plattformspezifische Tools einzubinden, ohne separate CLI-Einstiegspunkte zu benötigen."
  - question: "Was ist die defaultPreset-Config-Option?"
    answer: "Die defaultPreset-Option legt fest, auf welches Preset Nitro zurückfallen soll, wenn kein explizites Preset konfiguriert ist. Zuvor war der Fallback fest eingebaut. Jetzt können Sie ihn anpassen, nützlich wenn Ihr Setup einen anderen Standard als das Out-of-Box-Verhalten benötigt."
  - question: "Was war der Type-Stripping-Fix in diesem Release?"
    answer: "Der Fix stellt sicher, dass wenn TypeScript die Auflösung eines Modulpfads mit hinzugefügten Erweiterungen (.ts, .tsx) erneut versucht, Nitro nur die Erweiterungen entfernt, die tatsächlich erneut versucht wurden, nicht alle möglichen Erweiterungen. Dies verhindert Edge-Cases, bei denen legitime Modulauflösungen incorrect übergangen werden könnten."
---

Der Beta-Zug von [Nitro v3](/articles/2026-04-20-nitro-v3-beta-tracing-dep-tracing-vercel-queues) rollt weiter. Build `3.0.260603-beta`, das datumsbasierte Versionsschema steht für den 3. Juni 2026, ist ein kleines Release, aber zwei Änderungen sind für alle relevant, die ein Framework auf Nitro aufbauen. Und das sind seit der [v3-Beta-Ankündigung](https://nitro.build/blog/v3-beta) unter anderem TanStack Start und das kommende [Nuxt](/articles/2026-04-06-nuxt-4-4-vue-router-v5-typed-layout-props-28x-faster-dev-routing)-Major.

## Frameworks besitzen jetzt `preview` und `deploy`

Nitro hat schon immer den Build übernommen; was danach kam, war Sache der Plattform. Dieses Release erlaubt Framework-Plugins, eigene Preview- und Deploy-Kommandos zu registrieren, plattformspezifisches Tooling wandert damit in genau die Pipeline, die Nutzer ohnehin schon ausführen.

Konkret: Zielt ein Framework etwa mit einem eigenen Workflow auf Cloudflare, kann es diesen jetzt als kanonischen `preview`/`deploy`-Pfad anbieten, statt eine separate CLI zu dokumentieren. Weniger „nach dem Build noch unser anderes Tool ausführen", mehr eine Pipeline, die je Plattform das Richtige tut.

## `defaultPreset`: den Fallback kontrollieren

Wenn kein Deployment-Preset konfiguriert und keines erkannt wurde, fiel Nitro bisher auf einen hartkodierten Default zurück. Die neue Option `defaultPreset` macht diesen Fallback explizit:

```ts
export default defineNitroConfig({
  defaultPreset: "cloudflare_module",
});
```

Am nützlichsten ist das in Monorepos und Framework-Presets, wo „kein Preset angegeben" etwas Bestimmtes für das eigene Setup bedeuten soll, und nicht das, was Nitro gerade als Default wählt.

## Ein Type-Stripping-Grenzfall, behoben

Das Release behebt außerdem einen subtilen Bug in der Modulauflösung: Wenn die Auflösung einen Pfad mit angehängten TypeScript-Endungen (`.ts`, `.tsx`) erneut versucht, entfernt Nitro jetzt nur noch die tatsächlich probierten Endungen, nicht mehr alle möglichen. Ein Grenzfall, aber von der Sorte, die in genau einer Datei eines großen Projekts ein rätselhaftes „module not found" erzeugt.

## Lohnt das Update?

Wer schon auf der v3-Beta ist: ja, ein gefahrloses inkrementelles Update per `npm i nitro@beta`. Für Framework-Autoren sind die Custom-Command-Hooks die Schlagzeile: das erste Stück der „Bring your own framework"-Geschichte von v3, das über den Build hinaus bis ins Deployment reicht. Für alle anderen ist es eine gute Erinnerung daran, dass v3 schnell iteriert, wöchentliche, datierte Betas, auf dem Weg zu [Nuxt 5 auf Nitro v3 und H3 v2](/articles/2026-06-03-nitro-v3-0-260522-beta-tracing-vfs-vercel-queues).
