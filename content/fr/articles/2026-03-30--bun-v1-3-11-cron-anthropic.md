---
title: "Bun v1.3.11 : OS-Level Cron natif et intégration à la pile IA d'Anthropic"
description: "Bun v1.3.11 réduit le binaire de 4 Mo, introduit Bun.cron pour les tâches planifiées au niveau OS, et marque un tournant majeur : le runtime rejoint Anthropic pour alimenter Claude Code et les futurs outils de coding IA."
image: "https://bun.com/og/blog.png"
date: "2026-03-30"
author: lschvn
tags: ["bun", "runtime", "javascript", "typescript", "ai", "anthropic", "news"]
tldr:
  - "Anthropic a acquis Bun en décembre 2025 pour alimenter Claude Code ; Bun reste sous licence MIT et open source avec l'équipe核心 intacte."
  - "Bun v1.3.11 introduit Bun.cron pour les tâches planifiées cross-platform au niveau OS (crontab/launchd/Task Scheduler), remplaçant node-cron."
  - "Le binaire Linux x64 est réduit de 4 Mo ; Bun v1.3.10 a ajouté les décorateurs ES standard TC39 et un REPL natif en Zig."
  - "L'optimisation des importations barrel dans v1.3.10 réduit les temps de build jusqu'à 2x pour les grandes bibliothèques comme antd et @mui/material."
---

L'écosystème JavaScript évolue rapidement, mais peu de versions récentes ont autant d'importance que ce qu'a publié Jarred Sumner ce mois-ci. Le 18 mars 2026, Bun v1.3.11 est arrivé avec un mélange d'améliorations pour les développeurs, de gains de performance, et une reconnaissance discrète d'un changement majeur en coulisses : **Bun a rejoint Anthropic**.

## L'éléphant dans la pièce : Bun rejoint Anthropic

D'abord, la plus grande nouvelle. En décembre 2025, Anthropic a acquis Bun avec un mandat clair : faire de Bun la colonne vertébrale infrastructurelle de Claude Code, du Claude Agent SDK, et de chaque futur produit de coding IA de l'entreprise. Claude Code [expédie déjà en tant qu'exécutable Bun](/articles/claude-code-rise-ai-coding-tool-2026) des millions d'utilisateurs — et comme l'a dit Sumner dans l'annonce d'acquisition, « si Bun tombe en panne, Claude Code tombe en panne. » Anthropic a désormais un intérêt工程direct à garder Bun excellent.

Les implications sont significatives. Bun reste sous licence MIT et open source, et l'équipe核心reste intacte. Mais la feuille de route a désormais un focus plus serré : outils JavaScript haute performance, compatibilité Node.js, et devenir le runtime serveur par défaut. La différence est qu'Anthropic dépend maintenant directement de Bun pour son propre outillage — une alignment puissante d'intérêts.

## Bun v1.3.11 : Quoi de nouveau

La version du 18 mars est riche. Voici ce qui compte le plus pour les développeurs TypeScript et JavaScript :

### Bun.cron — Tâches planifiées au niveau OS, nativement

La fonctionnalité majeure de v1.3.11 est `Bun.cron`, une API intégrée pour enregistrer des jobs cron au niveau OS qui fonctionne cross-platform (crontab sur Linux, launchd sur macOS, Task Scheduler sur Windows).

```typescript
// Enregistrer un job cron
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

L'API analyse nativement les expressions cron — y compris les jours nommés (`MON–SUN`), les surnoms (`@yearly`, `@daily`), et la logique OR POSIX — et supporte la suppression programmatique des jobs. Cela remplace toute une catégorie d'utilisation des packages npm `node-cron` et `cron`, et ça s'exécute au niveau du planificateur OS plutôt que dans la boucle d'événements Node.js, le rendant bien plus fiable pour les workloads de production.

### Bun.sliceAnsi — Découpage de chaînes ANSI-Aware

Un nouveau built-in remplace à la fois les packages npm `slice-ansi` et `cli-truncate`. `Bun.sliceAnsi` découpe les chaînes par largeur de colonne terminal tout en préservant les codes échappement ANSI (couleurs SGR, liens OSC 8) et en respectant les frontières de clusters de graphèmes — emoji, signes combinants et drapeaux sont gérés correctement.

```typescript
Bun.sliceAnsi("\x1b[31mhello\x1b[39m", 1, 4); // "\x1b[31mell\x1b[39m"
Bun.sliceAnsi("unicorn", 0, 4, "…"); // "uni…"
```

En interne, il utilise une stratégie de dispatch à trois niveaux : chemin rapide ASCII SIMD, streaming single-pass pour les cas communs, et algorithme two-pass pour les indices négatifs.

### 4 Mo de moins sur Linux x64

Le binaire Linux x64 est désormais réduit de 4 Mo. C'est une amélioration significative pour les environnements CI/CD où chaque milliseconde et mégaoctet compte.

## Bun v1.3.10 : Le breakthrough des décorateurs et du REPL

Arrivant juste avant la version v1.3.11, la mise à jour du 26 février a apporté deux fonctionnalités que les développeurs TypeScript attendaient depuis des années.

### Décorateurs ES TC39 standard complets

Le transpileur de Bun supporte désormais pleinement les **décorateurs ES stage-3 TC39 standard** — la variante non-héritée qui s'active quand `experimentalDecorators` n'est *pas* défini dans votre `tsconfig.json`. Cela signifie que le code utilisant la syntaxe moderne des décorateurs — y compris le mot-clé `accessor`, les métadonnées de décorateur via `Symbol.metadata`, et les APIs `ClassMethodDecoratorContext` / `ClassFieldDecoratorContext` — fonctionne désormais correctement out of the box.

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

Les auto-accessors avec le mot-clé `accessor` — y compris sur les champs privés — sont supportés, ainsi que `addInitializer`, les métadonnées de décorateur, et l'ordre d'évaluation correct. Les décorateurs legacy TypeScript (`experimentalDecorators: true`) continuent de fonctionner sans changement.

C'est l'une des fonctionnalités les plus demandées depuis 2023. Jusqu'à maintenant, Bun ne supportait que la syntaxe legacy des décorateurs, ce qui signifiait que les bibliothèques ciblant la spec TC39 — y compris `signal-polyfill` et le pipeline de rendu upcoming d'Angular — échouaient à parser ou produisaient des résultats incorrects.

### REPL natif écrit en Zig

Le REPL de Bun était auparavant backed par un package npm tiers. v1.3.10 l'a entièrement remplacé par une implémentation native Zig qui démarre instantanément sans téléchargements de packages. Le nouveau REPL inclut le highlight syntaxique, les keybindings Emacs, l'historique persistant, la completion par tab, l'input multi-ligne, et le `await` top-level — tout avec les sémantiques `const`/`let` correctes qui persistent entre les lignes.

### Optimisation des importations barrel

Quand vous `import { Button } from 'antd'`, le bundler doit traditionnellement parser chaque fichier qu'`antd/index.js` ré-exporte — potentiellement des milliers de modules. Bun v1.3.10 détecte les fichiers barrel purs et ne parse que les sous-modules que vous utilisez réellement. Pour les grandes bibliothèques de composants comme `antd`, `@mui/material`, ou `lodash-es`, cela réduit les temps de build jusqu'à 2x. Cela fonctionne automatiquement pour les packages avec `"sideEffects": false`, ou peut être activé explicitement via `optimizeImports` dans `Bun.build()`.

### Autres ajouts notables

- **`--compile --target=browser`** — produit des fichiers HTML auto-contenus avec tout le JS, CSS et assets inlined comme data URIs
- **Support natif Windows ARM64** — exécutez Bun nativement sur les machines Windows Snapdragon et cross-compilez des exécutables ciblant `bun-windows-arm64`
- **`structuredClone` jusqu'à 25x plus rapide** pour les tableaux via la mise à niveau JSC
- **Analyseurs `Bun.JSON5` et `Bun.JSONL`** intégrés

## Ce que cela signifie pour l'écosystème

Le pairing Bun-et-Anthropic est plus qu'une acquisition — c'est une déclaration d'intention sur la direction du développement assistée par IA. Les outils qui écrivent, testent et déploient le code à l'échelle sont de plus en plus les mêmes outils que les développeurs utilisent pour exécuter leurs serveurs localement. Bun se positionnant comme le runtime « tout-en-un » (bundler, test runner, package manager, server runtime) en fait un fit naturel pour les agents IA qui ont besoin d'exécuter du code de manière fiable across environments. Pour du contexte sur comment les performances de Bun se comparent à Node.js et Deno dans les benchmarks indépendants, voir notre [comparatif des runtimes](/articles/bun-vs-node-vs-deno-2026-runtime-benchmark).

Pour les développeurs TypeScript spécifiquement, le support complet des décorateurs TC39 dans v1.3.10 est un déverrouillage discret mais important. La proposal des décorateurs est en stage 3 depuis plus de deux ans et est largement attendue pour atteindre le stage 4 — et Eventually landing dans la spec ECMAScript — dans un futur proche. Le support précoce de Bun signifie que vous pouvez commencer à écrire du code basé sur les décorateurs future-proof dès aujourd'hui.

Installez ou mettez à niveau avec :

```bash
bun upgrade
```

Ou installez from scratch sur [bun.sh](https://bun.sh).
