---
title: "Playwright v1.61.0: WebAuthn-Passkeys, eine echte WebStorage-API und Trace-artige Video-Modi für den Test-Runner"
description: "Playwright v1.61.0 (15. Juni 2026) liefert einen virtuellen Authenticator für WebAuthn/Passkey-Zeremonien, eine erstklassige page.localStorage / page.sessionStorage-API, Netzwerk-Security-Details auf APIResponses und bringt die Video-Aufzeichnung des Test-Runners auf Parität mit der Trace-Aufzeichnung. Browser-Kanäle: Chromium 149, Firefox 151, WebKit 26.5."
date: 2026-06-15
image: "/images/heroes/2026-06-15--playwright-1-61-webauthn-passkeys-webstorage.png"
author: lschvn
tags: ["security", "tooling", "javascript"]
tldr:
  - "Playwright v1.61.0, veröffentlicht am 15. Juni 2026, ergänzt einen virtuellen WebAuthn-Authenticator: Tests können jetzt `navigator.credentials.create()` / `navigator.credentials.get()`-Zeremonien über `browserContext.credentials` ohne echte Hardware beantworten, in jedem Browser-Kanal."
  - "Eine neue erstklassige WebStorage-API exponiert `page.localStorage` und `page.sessionStorage` mit `setItem` / `getItem` / `items`, und auf APIResponse-Seite kommen `securityDetails()` und `serverAddr()` hinzu, passend zur Browser-seitigen Response-API."
  - "Der Test-Runner schließt eine alte Asymmetrie: `testOptions.video` akzeptiert jetzt dieselben Modi wie `trace` (`'on-all-retries'`, `'retain-on-first-failure'`, `'retain-on-failure-and-retries'`), plus `expect.soft.poll(...)`, `fullConfig.argv` und `fullConfig.failOnFlakyTests`. Ubuntu 26.04 ist jetzt eine unterstützte Plattform; Chromium 149, Firefox 151 und WebKit 26.5 sind gebundled."
faq:
  - question: "Brauche ich jetzt echte Hardware-Sicherheitsschlüssel, um Passkey-Flows zu testen?"
    answer: "Nein. v1.61.0 liefert einen virtuellen Authenticator auf `browserContext.credentials`, der WebAuthn-Zeremonien in der Seite beantwortet. Ihr könnt entweder einen Passkey seeden, den euer Backend schon provisioniert hat (`credentials.create(...)` mit credential id, user handle und Schlüsselmaterial, dann `credentials.install()`), oder einen One-Shot-Setup-Test laufen lassen, der einen Passkey über die echte UI registriert und ihn dann über `credentials.get()` in spätere Tests re-seeded. Es funktioniert in allen Browser-Kanälen Chromium, Firefox und WebKit ohne externen Prozess."
  - question: "Wie unterscheidet sich das neue `page.localStorage` von `page.evaluate(...)` mit `localStorage.setItem`?"
    answer: "Der alte Ansatz funktioniert, aber jeder Aufruf geht durch den JS-Kontext der Seite, erfordert, dass die Seite navigiert ist, und liefert einen `JSHandle`, den ihr danach dereferenzieren müsst. Die neuen Aufrufe `page.localStorage.setItem(key, value)` / `getItem(key)` / `items()` sind erstklassige Playwright-Protokoll-Kommandos, die direkt mit dem Browser sprechen, also funktionieren sie auf Hintergrund-Seiten und Service Workern, brauchen kein `page.evaluate` und liefern native Werte. Es ist dieselbe Form, die das Playwright-Team bereits für Cookies und die Storage-State-APIs verwendet."
  - question: "Sind die neuen Video-Modi des Test-Runners eine Verhaltensänderung für bestehende Projekte?"
    answer: "Nicht standardmäßig. `testOptions.video` behält sein bisheriges Standardverhalten; die drei neuen Werte (`'on-all-retries'`, `'retain-on-first-failure'`, `'retain-on-failure-and-retries'`) sind Opt-in und spiegeln die bestehenden Optionen des Trace-Runners. Wenn ihr CI-Skripte habt, die Videos von der Platte ziehen, reduziert der Wechsel zu `'retain-on-failure'` die Storage-Kosten, weil nur Videos kaputter Runs behalten werden. Die Video-Modi-Tabelle auf playwright.dev/test-use-options dokumentiert, welche Runs in welchem Modus aufgenommen bzw. behalten werden."
  - question: "Warum ist `expect.soft.poll(...)` relevant, wenn ich bereits `expect.poll` nutze?"
    answer: "Einfaches `expect.poll` ist eine harte Assertion: der erste Fehler wirft und bricht den Test ab. `expect.soft.poll(...)` ist die Polling-Form von `expect.soft`, also wird eine fehlgeschlagene Assertion am Test vermerkt, aber die Ausführung läuft weiter. Das ist die richtige Form für Dashboards, Health-Checks und jeden UI-Test, der fünf lose gekoppelte Dinge asserten und am Ende alle Fehler berichten will, statt das erste zu fixen, neu zu laufen, das nächste zu finden und zu wiederholen."
  - question: "Was hat sich für HAR- und Trace-Aufzeichnungen geändert?"
    answer: "Beide enthalten jetzt WebSocket-Requests. Vor 1.61.0 haben Playwrights HAR- und Trace-Aufzeichnungen nur HTTP-Traffic erfasst, daher war eine Regression, die nur über eine WebSocket-Verbindung auftrat (Chat, Live-Cursor, Echtzeit-Updates), im aufgenommenen Artefakt unsichtbar. Mit 1.61.0 enthalten das Network-Panel im Trace-Viewer und die HAR-Datei beide die WebSocket-Frames, was die meisten Teams, die Playwright überhaupt adoptiert haben, von Anfang an erwartet haben."
---

[Playwright v1.61.0](https://github.com/microsoft/playwright/releases/tag/v1.61.0) ist heute, am 15. Juni 2026 um 10:05 UTC erschienen, etwa sechs Wochen nach [v1.60.0 am 11. Mai](https://github.com/microsoft/playwright/releases/tag/v1.60.0). Es ist ein Feature-Release ohne Breaking Changes, und drei der neuen APIs adressieren direkt langjährige Lücken dabei, wie Teams Passkey-Flows testen, Browser-Storage manipulieren und flaky CI-Runs nachvollziehen. Die Release bringt außerdem die Browser-Kanäle Chromium 149, Firefox 151 und WebKit 26.5 und nimmt Ubuntu 26.04 in die Liste der unterstützten Plattformen auf.

## Ein virtueller WebAuthn-Authenticator für Passkey-Tests

Das Headline-Feature ist [`browserContext.credentials`](https://playwright.dev/docs/api/class-browsercontext#browser-context-credentials), ein virtueller Authenticator, der Passkeys registrieren und `navigator.credentials.create()` / `navigator.credentials.get()`-Zeremonien in der Seite beantworten kann. Es wird kein echter Hardware-Key benötigt, und es funktioniert in jedem Browser-Kanal, Chromium, Firefox und WebKit.

Der typische Ablauf ist, einen Passkey zu seeden, den das Backend bereits für einen Test-User provisioniert hat, und dann den `navigator.credentials.get()` der Seite mit diesem Key auf den Challenge antworten zu lassen:

```js
const context = await browser.newContext();

// Seeded einen Passkey, den euer Backend für einen Test-User provisioniert hat.
await context.credentials.create('example.com', {
  id: credentialId,
  userHandle,
  privateKey,
  publicKey,
});
await context.credentials.install();

const page = await context.newPage();
await page.goto('https://example.com/login');
// Der navigator.credentials.get() der Seite wird mit dem geseedeten Passkey beantwortet.
```

Die Release-Notes nennen ein alternatives Muster: einen One-Shot-Setup-Test laufen lassen, der einen Passkey über die echte UI registriert, ihn mit [`credentials.get()`](https://playwright.dev/docs/api/class-credentials#credentials-get) zurückliest und in den Rest der Suite re-seeded. Das ist die richtige Form für Projekte, die feststellen, dass Passkey-Support zum Login nötig ist und diese Tests vorher komplett übersprungen haben.

Die praktische Konsequenz ist, dass der [`explicit resource management`-Patch, den Bun in 1.3.12 geliefert hat](/articles/2026-04-13-bun-1-3-12-webview-browser-automation-using-await-using), jetzt eine viel dünnere Ausrede ist: einen Passkey-only-Login zu testen erforderte vorher einen echten YubiKey auf dem CI-Runner, einen Custom-Treiber für einen virtuellen Authenticator oder das Überspringen des Flows. Nach 1.61.0 ist es ein `credentials.create`-Aufruf in einem `beforeEach`.

## Eine erstklassige `page.localStorage`- und `page.sessionStorage`-API

Das zweite Stück ist die neue [`WebStorage`](https://playwright.dev/docs/api/class-webstorage)-API, exponiert als [`page.localStorage`](https://playwright.dev/docs/api/class-page#page-local-storage) und [`page.sessionStorage`](https://playwright.dev/docs/api/class-page#page-session-storage). Reads und Writes gehen direkt in den Storage der Seite für die aktuelle Origin, ohne `page.evaluate`-Round-Trip:

```js
await page.localStorage.setItem('token', 'abc');
const token = await page.localStorage.getItem('token');
const items = await page.sessionStorage.items();
```

`page.evaluate(() => localStorage.setItem('token', 'abc'))` funktioniert weiterhin, aber die neue API ist eine erstklassige Protokoll-Kommando in derselben Form, die Playwright bereits für Cookies und Storage-State verwendet. Das macht sie auf Hintergrund-Seiten, auf Service Workern und in Tests nutzbar, die einfach nur einen Storage-Zustand asserten wollen, ohne durch den JS-Kontext zu hüpfen.

## Netzwerk: `securityDetails()` und `serverAddr()` auf API-Responses

Die neuen [`apiResponse.securityDetails()`](https://playwright.dev/docs/api/class-apiresponse#api-response-security-details) und [`apiResponse.serverAddr()`](https://playwright.dev/docs/api/class-apiresponse#api-response-server-addr) spiegeln die Browser-seitigen [`response.securityDetails()`](https://playwright.dev/docs/api/class-response#response-security-details) und [`response.serverAddr()`](https://playwright.dev/docs/api/class-response#response-server-addr). Für Teams, die HTTP über Playwrights `request`- / `APIRequestContext`-API abfangen und replay-en, ist das endlich ein Weg, die ausgehandelte TLS-Version, die Cipher, den Zertifikats-Subject und die aufgelöste Server-Adresse in einem einzigen Test zu asserten. Es ist dieselbe Klasse von Capability, die [die esbuild-0.28.1-Dev-Server-Path-Traversal-Story](/articles/2026-06-14-esbuild-0-28-1-deno-rce-windows-path-traversal) auf Offense-Seite getrieben hat; hier ist es die Defense-Seite.

## Test-Runner: Trace-artige Video-Modi und `expect.soft.poll`

Der Runner nimmt drei Video-Modi auf, die `testOptions.video` auf Parität mit `testOptions.trace` bringen. Die neuen Werte sind `'on-all-retries'`, `'retain-on-first-failure'` und `'retain-on-failure-and-retries'`. Die [Video-Modi-Tabelle](https://playwright.dev/docs/test-use-options#video-modes) dokumentiert, welche Runs in welchem Modus aufgenommen und behalten werden. Für CI ist `'retain-on-failure'` der offensichtliche Gewinn: nur kaputte Runs verbrauchen Disk.

Weitere Runner-Verbesserungen sind klein, aber nützlich:

- [`expect.soft.poll(...)`](https://playwright.dev/docs/api/class-expect) wird jetzt unterstützt, die Polling-Form von `expect.soft`. Fehlgeschlagene Assertions werden am Test vermerkt, aber die Ausführung läuft weiter, sodass ein Dashboard-Test fünf lose gekoppelte Dinge asserten und am Ende alle Fehler berichten kann, statt das erste zu fixen, neu zu laufen, das nächste zu finden und zu wiederholen.
- [`fullConfig.argv`](https://playwright.dev/docs/api/class-fullconfig#full-config-argv) ist ein Snapshot von `process.argv` aus dem Runner-Prozess, den Reporter lesen können, um Custom-Argumente hinter dem `--`-Separator offenzulegen.
- [`fullConfig.failOnFlakyTests`](https://playwright.dev/docs/api/class-fullconfig#full-config-fail-on-flaky-tests) spiegelt die Config-Option, sodass Reporter erklären können, warum ein als flaky markierter Run fehlgeschlagen ist.
- [`testInfo.errors`](https://playwright.dev/docs/api/class-testinfo#test-info-errors) listet jetzt jeden Sub-Fehler eines `AggregateError` als separaten Eintrag, sodass eine Multi-Failure-Assertion im Report nicht mehr zu einer einzelnen Zeile kollabiert.
- Eine neue CLI-Kurzform `-G` für `--grep-invert`.

## Browser-Versionen, HAR und Plattform-Support

Die Release pinnt Chromium 149.0.7827.55, Mozilla Firefox 151.0 und WebKit 26.5 und wird zusätzlich gegen die Stable-Kanäle Google Chrome 149 und Microsoft Edge 149 getestet. Ubuntu 26.04 ist jetzt eine unterstützte Plattform.

[HAR- und Trace-Aufzeichnungen](https://playwright.dev/docs/trace-viewer) enthalten jetzt WebSocket-Requests. Vor 1.61.0 haben Playwrights HAR- und Trace-Aufzeichnungen nur HTTP-Traffic erfasst, sodass eine Regression, die nur über eine WebSocket-Verbindung auftrat (Chat, Live-Cursor, Echtzeit-Updates, Server-Sent-Events, die über einen einzelnen Socket multiplexed sind), im Artefakt unsichtbar war. Das Network-Panel des Trace-Viewers und die HAR-Datei enthalten jetzt beide die WebSocket-Frames, was die meisten Teams vom ersten Tag an erwartet haben.

## Kleinere Touches

- Eine neue `artifactsDir`-Option auf [`browserType.connectOverCDP()`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp) steuert, wo Traces und Downloads landen, wenn man sich an einen existierenden Browser anhängt.
- Eine neue `cursor`-Option auf [`screencast.showActions()`](https://playwright.dev/docs/api/class-screencast#screencast-show-actions) steuert die Cursor-Dekoration, die für Pointer-Aktionen gerendert wird.
- Der `onFrame`-Callback in [`screencast.start()`](https://playwright.dev/docs/api/class-screencast#screencast-start) erhält jetzt einen `timestamp`, wann die Frame vom Browser präsentiert wurde.

Für die meisten Teams ist das Upgrade `bun install @playwright/test@latest` und eine Neuinstallation der Browser. Die neuen APIs sind additiv, kein Flag-Day. Die Passkey- und WebStorage-APIs lohnen eine kleine Migration, weil sie die Test-Suite deutlich ehrlicher machen, was die Produktions-App tatsächlich handhaben muss.
