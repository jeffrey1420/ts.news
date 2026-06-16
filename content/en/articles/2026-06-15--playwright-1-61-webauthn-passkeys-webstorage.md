---
title: "Playwright v1.61.0 Lands WebAuthn Passkeys, a Real WebStorage API, and Trace-Style Video Modes for the Test Runner"
description: "Playwright v1.61.0 (June 15, 2026) ships a virtual authenticator for WebAuthn/passkey ceremonies, a first-class page.localStorage / page.sessionStorage API, network security details on API responses, and brings test runner video recording to parity with trace recording. Browser channels: Chromium 149, Firefox 151, WebKit 26.5."
date: 2026-06-15
image: "/images/heroes/2026-06-15--playwright-1-61-webauthn-passkeys-webstorage.png"
author: lschvn
tags: ["security", "tooling", "javascript"]
tldr:
  - "Playwright v1.61.0, shipped June 15, 2026, adds a virtual WebAuthn authenticator: tests can now register and answer `navigator.credentials.create()` / `navigator.credentials.get()` ceremonies against `browserContext.credentials` without real hardware, in every browser channel."
  - "A new first-class WebStorage API exposes `page.localStorage` and `page.sessionStorage` with `setItem` / `getItem` / `items`, and the APIResponse side gains `securityDetails()` and `serverAddr()` to mirror the browser-side response API."
  - "The test runner closes a long-standing asymmetry: `testOptions.video` now accepts the same `'on-all-retries'`, `'retain-on-first-failure'`, and `'retain-on-failure-and-retries'` modes as `trace`, plus `expect.soft.poll(...)`, `fullConfig.argv`, and `fullConfig.failOnFlakyTests`. Ubuntu 26.04 is now a supported platform; Chromium 149, Firefox 151, and WebKit 26.5 are bundled."
faq:
  - question: "Do I need real hardware security keys to test passkey flows now?"
    answer: "No. v1.61.0 ships a virtual authenticator on `browserContext.credentials` that answers WebAuthn ceremonies inside the page. You can either seed a passkey your backend already provisioned (`credentials.create(...)` with the credential id, user handle, and key material, then `credentials.install()`), or run a one-shot setup test that registers a passkey through the real UI and then re-seeds it into later tests via `credentials.get()`. It works in every browser channel Chromium, Firefox, and WebKit without any external process."
  - question: "How is the new `page.localStorage` different from `page.evaluate(...)` with `localStorage.setItem`?"
    answer: "The old approach is fine, but every call goes through the page's JS context, requires the page to be navigated, and returns a `JSHandle` you then have to dereference. The new `page.localStorage.setItem(key, value)` / `getItem(key)` / `items()` calls are first-class Playwright protocol commands that talk to the browser directly, so they work on background pages and service workers, do not require `page.evaluate`, and return plain values. It is the same shape the Playwright team has used for cookies and the existing storage state APIs."
  - question: "Are the new test runner video modes a behavior change for existing projects?"
    answer: "Not by default. `testOptions.video` still defaults to the previous behavior; the three new values (`'on-all-retries'`, `'retain-on-first-failure'`, `'retain-on-failure-and-retries'`) are opt-in and mirror the trace runner's existing options. If you have CI scripts that pull videos off disk, switching to `'retain-on-failure'` cuts storage costs by only keeping videos from broken runs. The video modes table at playwright.dev/test-use-options documents which runs are recorded versus retained in each mode."
  - question: "Why does `expect.soft.poll(...)` matter if I already use `expect.poll`?"
    answer: "Plain `expect.poll` is a hard assertion: the first failure throws and aborts the test. `expect.soft.poll(...)` is the polling version of `expect.soft`, so a failed assertion is recorded against the test but execution continues. That is the right shape for dashboards, health checks, and any UI test that wants to assert five loosely-coupled things and report all the failures at the end instead of fixing one, re-running, finding the next, and repeating."
  - question: "What changed for HAR and trace recordings?"
    answer: "Both now include WebSocket requests. Before 1.61.0, Playwright's HAR and trace recordings captured only HTTP traffic, so a regression that surfaced only over a WebSocket connection (chat, live cursors, real-time updates) was invisible in the recorded artifact. With 1.61.0, the network panel in the trace viewer and the HAR file both contain the WebSocket frames, which is what most teams that adopted Playwright in the first place expected."
---

[Playwright v1.61.0](https://github.com/microsoft/playwright/releases/tag/v1.61.0) shipped today, June 15, 2026, at 10:05 UTC, about six weeks after [v1.60.0 on May 11](https://github.com/microsoft/playwright/releases/tag/v1.60.0). It is a feature release with no breaking changes, and three of the new APIs directly address long-standing gaps in how teams test passkey flows, manipulate browser storage, and reason about flaky CI runs. The release also ships the Chromium 149, Firefox 151, and WebKit 26.5 browser channels and adds Ubuntu 26.04 to the supported platform list.

## A virtual WebAuthn authenticator for passkey tests

The headline feature is [`browserContext.credentials`](https://playwright.dev/docs/api/class-browsercontext#browser-context-credentials), a virtual authenticator that can register passkeys and answer `navigator.credentials.create()` / `navigator.credentials.get()` ceremonies in the page. No real hardware key is required, and it works in every browser channel Chromium, Firefox, and WebKit.

The typical flow is to seed a passkey the backend already provisioned for a test user, then have the page's `navigator.credentials.get()` answer the challenge with that key:

```js
const context = await browser.newContext();

// Seed a passkey your backend provisioned for a test user.
await context.credentials.create('example.com', {
  id: credentialId,
  userHandle,
  privateKey,
  publicKey,
});
await context.credentials.install();

const page = await context.newPage();
await page.goto('https://example.com/login');
// The page's navigator.credentials.get() is answered with the seeded passkey.
```

The release notes call out an alternative pattern: run a one-shot setup test that registers a passkey through the real UI, read it back with [`credentials.get()`](https://playwright.dev/docs/api/class-credentials#credentials-get), and seed it into the rest of the suite. That is the right shape for projects that discover passkey support is required to log in and that previously skipped those tests entirely.

The practical consequence is that the [`explicit resource management` patch Bun shipped in 1.3.12](/articles/2026-04-13-bun-1-3-12-webview-browser-automation-using-await-using) is now a much smaller excuse: testing a passkey-only login used to require a real YubiKey on the CI runner, a custom virtual authenticator driver, or skipping the flow. After 1.61.0, it is a `credentials.create` call in a `beforeEach`.

## A first-class `page.localStorage` and `page.sessionStorage` API

The second piece is the new [`WebStorage`](https://playwright.dev/docs/api/class-webstorage) API, exposed as [`page.localStorage`](https://playwright.dev/docs/api/class-page#page-local-storage) and [`page.sessionStorage`](https://playwright.dev/docs/api/class-page#page-session-storage). Reads and writes go directly to the page's storage for the current origin, no `page.evaluate` round-trip required:

```js
await page.localStorage.setItem('token', 'abc');
const token = await page.localStorage.getItem('token');
const items = await page.sessionStorage.items();
```

`page.evaluate(() => localStorage.setItem('token', 'abc'))` still works, but the new API is a first-class protocol command on the same shape Playwright uses for cookies and storage state. That makes it usable on background pages, on service workers, and in tests that just want to assert storage state without bouncing through the JS context.

## Network: `securityDetails()` and `serverAddr()` on API responses

The new [`apiResponse.securityDetails()`](https://playwright.dev/docs/api/class-apiresponse#api-response-security-details) and [`apiResponse.serverAddr()`](https://playwright.dev/docs/api/class-apiresponse#api-response-server-addr) mirror the browser-side [`response.securityDetails()`](https://playwright.dev/docs/api/class-response#response-security-details) and [`response.serverAddr()`](https://playwright.dev/docs/api/class-response#response-server-addr). For teams that intercept and replay HTTP via Playwright's `request` / `APIRequestContext` API, that is finally a way to assert the negotiated TLS version, the cipher, the certificate subject, and the resolved server address, all in a single test. It is the same kind of capability that drove the [esbuild 0.28.1 dev-server path-traversal story](/articles/2026-06-14-esbuild-0-28-1-deno-rce-windows-path-traversal) for offense; this is the defense side.

## Test runner: trace-style video modes and `expect.soft.poll`

The runner picks up three video modes that bring `testOptions.video` to parity with `testOptions.trace`. The new values are `'on-all-retries'`, `'retain-on-first-failure'`, and `'retain-on-failure-and-retries'`. The [video modes table](https://playwright.dev/docs/test-use-options#video-modes) documents which runs are recorded and which are kept in each mode. For CI, `'retain-on-failure'` is the obvious win: only broken runs burn disk.

Other runner improvements are small but useful:

- [`expect.soft.poll(...)`](https://playwright.dev/docs/api/class-expect) is now supported, the polling form of `expect.soft`. Failed assertions are recorded against the test, but execution continues, so a dashboard test can assert five loosely-coupled things and report all the failures at the end instead of fixing one, re-running, finding the next, and repeating.
- [`fullConfig.argv`](https://playwright.dev/docs/api/class-fullconfig#full-config-argv) is a snapshot of `process.argv` from the runner process, which reporters can read to surface custom arguments passed after the `--` separator.
- [`fullConfig.failOnFlakyTests`](https://playwright.dev/docs/api/class-fullconfig#full-config-fail-on-flaky-tests) mirrors the config option, so reporters can explain why a run marked flaky failed.
- [`testInfo.errors`](https://playwright.dev/docs/api/class-testinfo#test-info-errors) now lists each sub-error of an `AggregateError` as a separate entry, so a multi-failure assertion no longer collapses to a single line in the report.
- A new `-G` shorthand for `--grep-invert` on the CLI.

## Browser versions, HAR, and platform support

The release pins Chromium 149.0.7827.55, Mozilla Firefox 151.0, and WebKit 26.5, and is also tested against Google Chrome 149 and Microsoft Edge 149 stable channels. Ubuntu 26.04 is now a supported platform.

[HAR and trace recordings](https://playwright.dev/docs/trace-viewer) now include WebSocket requests. Before 1.61.0, a regression that surfaced only over a WebSocket connection (chat, live cursors, real-time updates, server-sent events that are multiplexed over a single socket) was invisible in the recorded artifact. The trace viewer's network panel and the HAR file now both contain the WebSocket frames, which is what most teams expected from day one.

## Smaller touches

- A new `artifactsDir` option on [`browserType.connectOverCDP()`](https://playwright.dev/docs/api/class-browsertype#browser-type-connect-over-cdp) controls where traces and downloads go when attaching to an existing browser.
- A new `cursor` option on [`screencast.showActions()`](https://playwright.dev/docs/api/class-screencast#screencast-show-actions) controls the cursor decoration rendered for pointer actions.
- The `onFrame` callback in [`screencast.start()`](https://playwright.dev/docs/api/class-screencast#screencast-start) now receives a `timestamp` of when the frame was presented by the browser.

For most teams the upgrade is `bun install @playwright/test@latest` and a re-install of the browsers. The new APIs are additive, no flag day. The passkey and WebStorage APIs are the parts worth a small migration, since they make the test suite meaningfully more honest about what the production app actually has to handle.
