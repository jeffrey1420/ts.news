---
title: "Bun v1.3.11 avec Cron natif au niveau OS et intégration au stack IA d'Anthropic"
description: "Bun v1.3.11 réduit le binaire de 4 Mo, intègre Bun.cron pour les jobs planifiés au niveau OS, et marque un moment pivot alors que le runtime rejoint Anthropic pour alimenter Claude Code."
image: "https://bun.com/og/blog.png"
date: "2026-03-30"
author: lschvn
tags: ["bun", "runtime", "javascript", "typescript", "ai", "anthropic", "news"]
tldr:
  - "Anthropic a acquis Bun en décembre 2025 pour alimenter Claude Code ; Bun reste sous licence MIT et open source avec l'équipe core intacte."
  - "Bun v1.3.11 intègre Bun.cron pour les jobs planifiés au niveau OS multi-plateforme (crontab/launchd/Task Scheduler)."
  - "Le binaire Linux x64 est réduit de 4 Mo ; Bun v1.3.10 a ajouté les décorateurs ES TC39 standards et un REPL natif Zig."
  - "L'optimisation des importations barrel en v1.3.10 réduit les temps de build jusqu'à 2x pour les grosses bibliothèques."
---

L'écosystème JavaScript va vite, mais peu de releases ces derniers temps portent autant de poids que ce qu'a expédié Jarred Sumner avec Bun ce mois-ci. Le 18 mars 2026, Bun v1.3.11 est arrivé avec un mélange d'améliorations de l'expérience développeur, des gains de performance, et une reconnaissance discrète d'un grand changement en coulisses : **Bun a rejoint Anthropic**.

## L'éléphant dans la pièce : Bun rejoint Anthropic

D'abord, la plus grande histoire. En décembre 2025, Anthropic a acquis Bun avec un mandat clair : faire de Bun la colonne vertébrale d'infrastructure de Claude Code, du Claude Agent SDK, et de chaque futur produit de codage IA de l'entreprise. Claude Code [expédie déjà comme un exécutable Bun](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) à des millions d'utilisateurs — et comme Sumner l'a dit dans le post d'acquisition, "si Bun casse, Claude Code casse." Anthropic a maintenant un incitatif d'ingénierie direct pour garder Bun excellent.

Les implications sont significatives. Bun reste sous licence MIT et open source, et l'équipe core reste intacte. Mais la roadmap a maintenant un fokus plus étroit : outillage JavaScript haute performance, compatibilité Node.js, et devenir le runtime serveur par défaut. La différence est que les propres outils d'Anthropic dépendent maintenant de la survie et de la prospérité de Bun — une alignment puissante d'intérêts.

## Bun v1.3.11 : Quoi de neuf

La release du 18 mars est chargée. Voici ce qui compte le plus pour les développeurs TypeScript et JavaScript :

### Bun.cron — Jobs planifiés au niveau OS, nativement

La fonctionnalité principale de v1.3.11 est `Bun.cron`, une API intégrée pour enregistrer des jobs cron au niveau OS qui fonctionne multi-plateforme (crontab sur Linux, launchd sur macOS, Task Scheduler sur Windows).

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

L'API parse nativement les expressions cron — incluant les jours nommés (`MON–SUN`), les surnoms (`@yearly`, `@daily`), et la logique OR POSIX — et supporte la suppression programmatique des jobs. Cela remplace toute une catégorie d'utilisation des packages npm `node-cron` et `cron`, et ça s'exécute au niveau du planificateur OS plutôt que dans la boucle d'événements Node.js, le rendant bien plus fiable pour les workloads de production.

### Bun.sliceAnsi — Découpage de chaînes conscient ANSI

Un nouveau builtin remplace les packages npm `slice-ansi` et `cli-truncate`. `Bun.sliceAnsi` découpe les chaînes par largeur de colonne terminal tout en préservant les codes d'échappement ANSI (couleurs SGR, liens OSC 8) et en respectant les limites de clusters de graphèmes — emoji, marques combinantes et drapeaux sont gérés correctement.

```typescript
Bun.sliceAnsi("\x1b[31mhello\x1b[39m", 1, 4); // "\x1b[31mell\x1b[39m"
Bun.sliceAnsi("unicorn", 0, 4, "…"); // "uni…"
```

En coulisses, il utilise une stratégie de dispatch à trois niveaux : chemin rapide ASCII SIMD, streaming passe unique pour les cas communs, et algorithme deux passes pour les indices négatifs.

### 4 Mo de moins sur Linux x64

Le binaire Linux x64 est maintenant 4 Mo plus petit. C'est une amélioration significative pour les environnements CI/CD où chaque milliseconde et mégaoctet compte.

## Bun v1.3.10 : La percée décorateur et REPL

Atterrissant juste sous la release v1.3.11, la mise à jour du 26 février a apporté deux fonctionnalités que les développeurs TypeScript attendaient depuis des années.

### Décorateurs ES TC39 standards complets

Le transpileur de Bun supporte maintenant entièrement les **décorateurs ES de stage-3 TC39** — la variante non-héritée qui s'active quand `experimentalDecorators` n'est *pas* défini dans votre `tsconfig.json`. Cela signifie que le code utilisant la syntaxe moderne des décorateurs — incluant le mot-clé `accessor`, les métadonnées de décorateur via `Symbol.metadata`, et les API `ClassMethodDecoratorContext` / `ClassFieldDecoratorContext` — fonctionne maintenant correctement out of the box.

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

Les auto-accesseurs avec le mot-clé `accessor` — incluant sur les champs privés — sont supportés, de même que `addInitializer`, les métadonnées de décorateur, et l'ordre d'évaluation correct. Les décorateurs legacy TypeScript (`experimentalDecorators: true`) continuent de fonctionner sans changement.

C'est l'une des fonctionnalités les plus demandées depuis 2023. Jusqu'à maintenant, Bun ne supportait que la syntaxe décorateur legacy, ce qui signifiait que les bibliothèques ciblant la spec TC39 — incluant `signal-polyfill` et le pipeline de rendu à venir d'Angular — échouaient à parser ou produisaient des résultats incorrects.

### REPL natif écrit en Zig

Le REPL de Bun était précédemment backed par un package npm tiers. v1.3.10 l'a remplacé entièrement par une implémentation native Zig qui démarre instantanément sans téléchargement de package. Le nouveau REPLexpédie avec coloration syntaxique, keybindings Emacs, historique persistant, complétion par tab, entrée multi-ligne, et `await` de haut niveau — le tout avec les sémantiques `const`/`let` proper qui persistent à travers les lignes.

### Optimisation des importations barrel

Quand vous `import { Button } from 'antd'`, le bundleur doit traditionnellement parser chaque fichier qu'`antd/index.js` ré-exporte — potentiellement des milliers de modules. Bun v1.3.10 détecte les fichiers barrel purs et ne parse que les sous-modules que vous utilisez réellement. Pour les grosses bibliothèques de composants comme `antd`, `@mui/material`, ou `lodash-es`, cela coupe les temps de build jusqu'à 2x. Ça fonctionne automatiquement pour les packages avec `"sideEffects": false`, ou peut être activé explicitement via `optimizeImports` dans `Bun.build()`.

### Autres ajouts notables

- **`--compile --target=browser`** — produit des fichiers HTML autonomes avec tout le JS, CSS et assets inlinés comme data URIs
- **Support natif Windows ARM64** — exécutez Bun nativement sur les machines Windows Snapdragon et cross-compilez des exécutables ciblant `bun-windows-arm64`
- **Jusqu'à 25x plus rapide `structuredClone`** pour les tableaux via la mise à niveau JSC
- **Analyseurs `Bun.JSON5` et `Bun.JSONL` intégrés**

## Ce que ça signifie pour l'écosystème

Le pairing Bun-et-Anthropic est plus qu'une acquisition — c'est une déclaration d'intention sur où le développement assisté par IA se dirige. Les outils qui écrivent, testent et déploient du code à l'échelle sont de plus en plus les mêmes outils que les développeurs utilisent pour exécuter leurs serveurs localement. Bun se positionnant comme le runtime "all-in-one" (bundleur, testeur, gestionnaire de paquets, runtime serveur) en fait un fit naturel pour les agents IA qui ont besoin d'exécuter du code fiablement à travers les environnements.

Pour les développeurs TypeScript spécifiquement, le support complet des décorateurs TC39 dans v1.3.10 est un unlock silencieux mais important. La proposition des décorateurs est en stage 3 depuis plus de deux ans et est largement attendue pour atteindre le stage 4 — etEventually land in the ECMAScript spec — dans un avenir proche. Le support précoce de Bun signifie que vous pouvez commencer à écrire du code basé sur les décorateurs future-proof aujourd'hui.

Installez ou mettez à niveau avec :

```bash
bun upgrade
```

Ou installez depuis zéro sur [bun.sh](https://bun.sh).
