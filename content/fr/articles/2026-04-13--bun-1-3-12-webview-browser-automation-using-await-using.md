---
title: "Bun v1.3.12 — Automatisation Naveau Et Native, Supporte `using` et `await using`"
description: "La dernière version de Bun ajoute WebView pour l'automatisation naveau, supporte nativement la proposition TC39 using/await using dans JavaScriptCore, et accélère URLPattern jusqu'à 2,3×."
date: 2026-04-13
image: "https://bun.com/og/blog.png"
author: lschvn
tags: ["bun", "javascript", "typescript", "runtime", "browser-automation"]
---

Bun v1.3.12 est arrivé le 10 avril avec l'un des ensembles de fonctionnalités les plus ambitieux des dernières versions. Deux avancées redéfinissent ce qu'un runtime JavaScript peut faire nativement : l'automatisation naveau sans navigateur et le support natif de la proposition TC39 Explicit Resource Management. Voici ce qui a changé.

## Bun.WebView — Automatisation Naveau Intégrée

La fonctionnalité principale est `Bun.WebView`, une API d'automatisation naveau intégrée directement au runtime. Pas de Puppeteer, pas de Playwright — juste une API native avec deux moteurs :

- **WebKit** (défaut sur macOS) — zéro dépendance externe, utilise le WKWebView système
- **Chrome** (cross-platform) — piloté via le DevTools Protocol, détecte automatiquement les navigateurs installés ou accepte un chemin personnalisé

Les actions basées sur des sélecteurs attendent automatiquement l'actionabilité (style Playwright) — un élément doit être attaché, visible, stable et non obstrué avant qu'un clic se déclenche. Toutes les entrées sont dispatchées comme des événements au niveau de l'OS avec `isTrusted: true`.

```javascript
await using view = new Bun.WebView({ width: 800, height: 600 });

await view.navigate("https://example.com");
await view.click("a[href='/docs']");   // attend l'actionabilité, clic natif
await view.scroll(0, 400);             // événement wheel natif, isTrusted: true

const title = await view.evaluate("document.title");
const png = await view.screenshot({ format: "jpeg", quality: 90 });
await Bun.write("page.jpg", png);
```

Un sous-processus navigateur est partagé par processus Bun ; les appels supplémentaires à `new Bun.WebView()` ouvrent des onglets dans la même instance. Les appels CDP bruts sont disponibles via `view.cdp(method, params)` pour les cas avancés.

## `using` et `await using` Natifs dans JavaScriptCore

La proposition TC39 Explicit Resource Management — déjà disponible en TypeScript via le downleveling — fonctionne désormais nativement dans le moteur JavaScriptCore de Bun. Plus de 1 650 commits WebKit en amont ont atterri dans cette version, apportant les déclarations `using` et `await using` en tant que fonctionnalité native.

```javascript
function readFile(path) {
  using file = openFile(path);   // file[Symbol.dispose]() appelé en fin de bloc
  return file.read();
}

async function fetchData(url) {
  await using connection = await connect(url);  // [Symbol.asyncDispose]() awaité
  return connection.getData();
}
```

Aucune étape de transpilation requise. Cela aligne Bun avec le graphe de modules natif et rend le nettoyage des ressources ergonomique sans wrapper utilitaire.

## URLPattern — Jusqu'à 2,3× Plus Rapide

`URLPattern.test()` et `URLPattern.exec()` ont reçu une refonte、性能 significative. La correspondance regex interne appelle désormais directement le moteur regex compilé au lieu d'allouer des objets JavaScript temporaires à chaque appel, éliminant jusqu'à 24 allocations GC par appel.

| Benchmark | Avant | Après | Accélération |
|---|---|---|---|
| `test()` correspondance, groupes nommés | 1,05 µs | 487 ns | **2,16×** |
| `test()` pas de correspondance | 579 ns | 337 ns | **1,72×** |
| `test()` correspondance, simple | 971 ns | 426 ns | **2,28×** |
| `exec()` correspondance, groupes nommés | 1,97 µs | 1,38 µs | **1,43×** |

Effet secondaire : les internaux de `URLPattern` ne polluent plus `RegExp.lastMatch` ou `RegExp.$N`.

## Planificateur Bun.cron() In-Process

Bun.cron dispose désormais d'une surcharge callback in-process qui exécute une fonction selon un schedule cron, complétant la variante existante au niveau OS qui enregistre des entrées crontab/launchd/Task Scheduler. La version in-process est plus légère, fonctionne de manière identique sur toutes les plateformes, et partage l'état directement avec le reste de l'application.

Garanties clés : pas de chevauchement (le prochain déclenchement est planifié uniquement après la résolution du handler), scheduling UTC, compatible `--hot` (les jobs sont nettoyés avant la ré-évaluation du graphe de modules), et disposable via `using`.

## Autres Améliorations

- **Corrections sockets UDP** : les erreurs ICMP (port unreachable, host unreachable) sont désormais transmises via le handler d'erreur au lieu de fermer silencieusement le socket. Les datagrammes tronqués sont détectables via un nouveau paramètre `flags.truncated`.
- **Cycle de vie des unix domain sockets** : correspond désormais à Node.js — se lier à un fichier socket existant retourne correctement `EADDRINUSE`, et `stop()` nettoie automatiquement le fichier socket.
- **Exécutables autonomes sur Linux** : `bun build --compile` embed désormais le graphe de modules via une section ELF `.bun` au lieu de lire depuis `/proc/self/exe`, corrigeant les binaires avec permissions execute-only.
- **Optimisations SIMD** : `Bun.stripANSI`, `Bun.stringWidth` et les helpers ANSI partagés ont reçu une accélération SIMD (prologue 4×-unrolled, skips CSI/OSC en vrac), avec jusqu'à ~4× d'amélioration sur les entrées ASCII simples.
- **Améliorations JIT** : tier-up plus rapide pour les fonctions stables, `Array.isArray` en intrinsèque JIT, `String#includes` optimisé, et arithmétique BigInt améliorée.

Mettez à jour avec `bun upgrade` ou installez depuis [bun.sh](https://bun.sh).

{tldr}
- Bun.WebView apporte l'automatisation naveau avec les moteurs WebKit et Chrome, aucune dépendance externe — clics, scrolls, screenshots et accès CDP natifs dans une seule API
- La proposition TC39 `using`/`await using` (Explicit Resource Management) est désormais supportée nativement dans JavaScriptCore, éliminant le besoin de downleveling TypeScript pour le nettoyage des ressources
- Les opérations URLPattern sont jusqu'à 2,3× plus rapides grâce aux appels directs du moteur regex et à l'élimination de 24 allocations GC par appel
{/tldr}
