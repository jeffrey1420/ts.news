---
title: "Playwright v1.61.0 : passkeys WebAuthn, vraie API WebStorage et modes vidéo à la trace pour le test runner"
description: "Playwright v1.61.0 (15 juin 2026) livre un authentificateur virtuel pour les cérémonies WebAuthn/passkey, une API de première classe page.localStorage / page.sessionStorage, les détails de sécurité réseau sur les APIResponse, et aligne l'enregistrement vidéo du test runner sur l'enregistrement de trace. Canaux navigateur : Chromium 149, Firefox 151, WebKit 26.5."
date: 2026-06-15
image: "/images/heroes/2026-06-15--playwright-1-61-webauthn-passkeys-webstorage.png"
author: lschvn
tags: ["security", "tooling", "javascript"]
tldr:
  - "Playwright v1.61.0, publiée le 15 juin 2026, ajoute un authentificateur WebAuthn virtuel : les tests peuvent désormais enregistrer et répondre aux cérémonies `navigator.credentials.create()` / `navigator.credentials.get()` via `browserContext.credentials` sans matériel réel, dans tous les canaux navigateur."
  - "Une nouvelle API WebStorage de première classe expose `page.localStorage` et `page.sessionStorage` avec `setItem` / `getItem` / `items`, et le côté APIResponse gagne `securityDetails()` et `serverAddr()` pour refléter l'API response côté navigateur."
  - "Le test runner comble une asymétrie ancienne : `testOptions.video` accepte désormais les mêmes modes que `trace` (`'on-all-retries'`, `'retain-on-first-failure'`, `'retain-on-failure-and-retries'`), plus `expect.soft.poll(...)`, `fullConfig.argv` et `fullConfig.failOnFlakyTests`. Ubuntu 26.04 est désormais une plateforme supportée ; Chromium 149, Firefox 151 et WebKit 26.5 sont bundled."
faq:
  - question: "Faut-il de vraies clés de sécurité matérielles pour tester des flux passkey maintenant ?"
    answer: "Non. La v1.61.0 livre un authentificateur virtuel sur `browserContext.credentials` qui répond aux cérémonies WebAuthn dans la page. Vous pouvez soit seed une passkey déjà provisionnée par votre backend (`credentials.create(...)` avec le credential id, le user handle et le matériel de clé, puis `credentials.install()`), soit exécuter un test de setup one-shot qui enregistre une passkey via la vraie UI puis la re-seed dans les tests suivants via `credentials.get()`. Ça marche dans tous les canaux navigateur, Chromium, Firefox et WebKit, sans aucun process externe."
  - question: "En quoi le nouveau `page.localStorage` diffère de `page.evaluate(...)` avec `localStorage.setItem` ?"
    answer: "L'ancienne approche fonctionne, mais chaque appel passe par le contexte JS de la page, exige que la page soit naviguée, et renvoie un `JSHandle` qu'il faut ensuite déréférencer. Les nouveaux appels `page.localStorage.setItem(key, value)` / `getItem(key)` / `items()` sont des commandes protocolaires Playwright de première classe qui parlent directement au navigateur, donc ils marchent sur les pages d'arrière-plan et les service workers, ne nécessitent pas `page.evaluate`, et renvoient des valeurs natives. C'est la même forme que celle utilisée par l'équipe Playwright pour les cookies et les API de storage state."
  - question: "Les nouveaux modes vidéo du test runner sont-ils un changement de comportement pour les projets existants ?"
    answer: "Pas par défaut. `testOptions.video` garde son comportement par défaut précédent ; les trois nouvelles valeurs (`'on-all-retries'`, `'retain-on-first-failure'`, `'retain-on-failure-and-retries'`) sont opt-in et reflètent les options existantes du trace runner. Si vous avez des scripts CI qui récupèrent des vidéos sur disque, passer à `'retain-on-failure'` réduit les coûts de stockage en ne gardant que les vidéos des runs cassés. Le tableau des modes vidéo sur playwright.dev/test-use-options documente quels runs sont enregistrés versus retenus dans chaque mode."
  - question: "Pourquoi `expect.soft.poll(...)` compte-t-il si j'utilise déjà `expect.poll` ?"
    answer: "Le `expect.poll` simple est une assertion dure : le premier échec lève et abort le test. `expect.soft.poll(...)` est la forme polling de `expect.soft`, donc un échec d'assertion est enregistré sur le test mais l'exécution continue. C'est la bonne forme pour des dashboards, des health checks, et tout test UI qui veut asserter cinq choses lâchement couplées et reporter toutes les défaillances à la fin au lieu de fixer la première, relancer, trouver la suivante et recommencer."
  - question: "Qu'est-ce qui a changé pour les enregistrements HAR et trace ?"
    answer: "Les deux incluent désormais les requêtes WebSocket. Avant la 1.61.0, les enregistrements HAR et trace de Playwright ne capturaient que le trafic HTTP, donc une régression qui n'apparaissait qu'au-dessus d'une connexion WebSocket (chat, curseurs temps réel, mises à jour temps réel) était invisible dans l'artefact enregistré. Avec la 1.61.0, le panneau network du trace viewer et le fichier HAR contiennent tous les deux les frames WebSocket, ce que la plupart des équipes qui ont adopté Playwright attendaient depuis le début."
---

[Playwright v1.61.0](https://github.com/microsoft/playwright/releases/tag/v1.61.0) est sortie aujourd'hui, le 15 juin 2026 à 10:05 UTC, environ six semaines après [v1.60.0 le 11 mai](https://github.com/microsoft/playwright/releases/tag/v1.60.0). C'est une release de fonctionnalités sans breaking change, et trois des nouvelles API adressent directement des lacunes anciennes dans la façon dont les équipes testent les flux passkey, manipulent le stockage navigateur et raisonnent sur les runs CI flaky. La release livre aussi les canaux navigateur Chromium 149, Firefox 151 et WebKit 26.5, et ajoute Ubuntu 26.04 à la liste des plateformes supportées.

## Un authentificateur WebAuthn virtuel pour les tests passkey

La fonctionnalité phare est [`browserContext.credentials`](https://playwright.dev/docs/api/class-browsercontext#browser-context-credentials), un authentificateur virtuel qui peut enregistrer des passkeys et répondre aux cérémonies `navigator.credentials.create()` / `navigator.credentials.get()` dans la page. Aucune clé matérielle réelle n'est requise, et ça marche dans tous les canaux navigateur, Chromium, Firefox et WebKit.

Le flux typique consiste à seeder une passkey que le backend a déjà provisionnée pour un utilisateur de test, puis à laisser le `navigator.credentials.get()` de la page répondre au challenge avec cette clé :

```js
const context = await browser.newContext();

// Seed une passkey que votre backend a provisionnée pour un user de test.
await context.credentials.create('example.com', {
  id: credentialId,
  userHandle,
  privateKey,
  publicKey,
});
await context.credentials.install();

const page = await context.newPage();
await page.goto('https://example.com/login');
// Le navigator.credentials.get() de la page est répondu avec la passkey seedée.
```

Les notes de release mentionnent un pattern alternatif : exécuter un test de setup one-shot qui enregistre une passkey via la vraie UI, la relire avec [`credentials.get()`](https://playwright.dev/docs/api/class-credentials#credentials-get), et la seeder dans le reste de la suite. C'est la bonne forme pour les projets qui découvrent que le support passkey est requis pour se logger et qui sautaient complètement ces tests auparavant.

La conséquence pratique est que le [patch `explicit resource management` que Bun a livré en 1.3.12](/articles/2026-04-13-bun-1-3-12-webview-browser-automation-using-await-using) est désormais une excuse beaucoup plus mince : tester un login passkey-only exigeait auparavant une vraie YubiKey sur le runner CI, un driver d'authentificateur virtuel custom, ou bien de sauter le flux. Après la 1.61.0, c'est un appel `credentials.create` dans un `beforeEach`.

## Une API de première classe `page.localStorage` et `page.sessionStorage`

La seconde pièce est la nouvelle API [`WebStorage`](https://playwright.dev/docs/api/class-webstorage), exposée comme [`page.localStorage`](https://playwright.dev/docs/api/class-page#page-local-storage) et [`page.sessionStorage`](https://playwright.dev/docs/api/class-page#page-session-storage). Les lectures et écritures vont directement au stockage de la page pour l'origine courante, sans round-trip `page.evaluate` :

```js
await page.localStorage.setItem('token', 'abc');
const token = await page.localStorage.getItem('token');
const items = await page.sessionStorage.items();
```

`page.evaluate(() => localStorage.setItem('token', 'abc'))` fonctionne toujours, mais la nouvelle API est une commande protocolaire de première classe sur la même forme que ce que Playwright utilise pour les cookies et le storage state. Ça la rend utilisable sur les pages d'arrière-plan, sur les service workers, et dans les tests qui veulent juste asserter un état de stockage sans rebondir dans le contexte JS.

## Réseau : `securityDetails()` et `serverAddr()` sur les API responses

Les nouveaux [`apiResponse.securityDetails()`](https://playwright.dev/docs/api/class-apiresponse#api-response-security-details) et [`apiResponse.serverAddr()`](https://playwright.dev/docs/api/class-apiresponse#api-response-server-addr) reflètent les [`response.securityDetails()`](https://playwright.dev/docs/api/class-response#response-security-details) et [`response.serverAddr()`](https://playwright.dev/docs/api/class-response#response-server-addr) côté navigateur. Pour les équipes qui interceptent et rejouent du HTTP via l'API `request` / `APIRequestContext` de Playwright, c'est enfin un moyen d'assertir la version TLS négociée, le cipher, le sujet du certificat et l'adresse serveur résolue, le tout dans un seul test. C'est le même type de capacité qui a motivé [l'histoire du path-traversal du dev server d'esbuild 0.28.1](/articles/2026-06-14-esbuild-0-28-1-deno-rce-windows-path-traversal) côté offense ; ici c'est le côté défense.

## Test runner : modes vidéo à la trace et `expect.soft.poll`

Le runner récupère trois modes vidéo qui amènent `testOptions.video` à parité avec `testOptions.trace`. Les nouvelles valeurs sont `'on-all-retries'`, `'retain-on-first-failure'` et `'retain-on-failure-and-retries'`. Le [tableau des modes vidéo](https://playwright.dev/docs/test-use-options#video-modes) documente quels runs sont enregistrés et lesquels sont retenus dans chaque mode. Pour la CI, `'retain-on-failure'` est le gain évident : seuls les runs cassés brûlent du disque.

Les autres améliorations du runner sont petites mais utiles :

- [`expect.soft.poll(...)`](https://playwright.dev/docs/api/class-expect) est désormais supporté, la forme polling de `expect.soft`. Les assertions échouées sont enregistrées sur le test, mais l'exécution continue, donc un test de dashboard peut asserter cinq choses lâchement couplées et reporter toutes les défaillances à la fin au lieu de fixer la première, relancer, trouver la suivante et recommencer.
- [`fullConfig.argv`](https://playwright.dev/docs/api/class-fullconfig#full-config-argv) est un snapshot de `process.argv` du process runner, que les reporters peuvent lire pour exposer les arguments custom passés après le séparateur `--`.
- [`fullConfig.failOnFlakyTests`](https://playwright.dev/docs/api/class-fullconfig#full-config-fail-on-flaky-tests) reflète l'option de config, donc les reporters peuvent expliquer pourquoi un run marqué flaky a échoué.
- [`testInfo.errors`](https://playwright.dev/docs/api/class-testinfo#test-info-errors) liste désormais chaque sous-erreur d'un `AggregateError` comme entrée séparée, donc une assertion multi-failures ne se collapse plus en une seule ligne dans le report.
- Un nouveau shorthand CLI `-G` pour `--grep-invert`.

## Versions navigateur, HAR et support plateforme

La release pin Chromium 149.0.7827.55, Mozilla Firefox 151.0 et WebKit 26.5, et est aussi testée contre les canaux stables Google Chrome 149 et Microsoft Edge 149. Ubuntu 26.04 est désormais une plateforme supportée.

Les [enregistrements HAR et trace](https://playwright.dev/docs/trace-viewer) incluent désormais les requêtes WebSocket. Avant la 1.61.0, une régression qui n'apparaissait qu'au-dessus d'une connexion WebSocket (chat, curseurs temps réel, mises à jour temps réel, server-sent events multiplexés sur un seul socket) était invisible dans l'artefact enregistré. Le panneau network du trace viewer et le fichier HAR contiennent désormais tous les deux les frames WebSocket, ce que la plupart des équipes attendaient depuis le jour un.

## Petites touches

- Une nouvelle option `artifactsDir` sur [`browserType.connectOverCDP()`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp) contrôle où vont traces et downloads quand on s'attache à un browser existant.
- Une nouvelle option `cursor` sur [`screencast.showActions()`](https://playwright.dev/docs/api/class-screencast#screencast-show-actions) contrôle la décoration de curseur rendue pour les actions de pointeur.
- Le callback `onFrame` dans [`screencast.start()`](https://playwright.dev/docs/api/class-screencast#screencast-start) reçoit désormais un `timestamp` du moment où la frame a été présentée par le navigateur.

Pour la plupart des équipes l'upgrade est `bun install @playwright/test@latest` et une réinstall des browsers. Les nouvelles API sont additives, pas de flag day. Les API passkey et WebStorage sont les parties qui valent une petite migration, puisqu'elles rendent la suite de tests significativement plus honnête sur ce que l'app de production doit réellement gérer.
