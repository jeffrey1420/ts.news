---
title: "Axios npm Supply Chain Attack: Malicious Versions Drop Remote Access Trojan"
description: "Two poisoned releases of axios — one of the most widely-used Node.js HTTP client libraries — were published and pulled from npm within hours. Here's what happened, how the attack worked, and what you need to do right now."
date: 2026-03-31
image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&h=630&fit=crop"
author: lschvn
tags: ["security", "npm", "supply-chain", "javascript", "node.js"]
faq:
  - question: "Is Axios still safe to use?"
    answer: "Yes — axios itself is safe. The attack compromised two specific versions (1.14.1 and 0.30.4) which were published and removed within hours. If you are using any other version of axios, you are not affected. The last known clean versions are axios@1.14.0 and axios@0.30.3."
  - question: "How do I protect my project from npm supply chain attacks?"
    answer: "Pin your dependency versions, use lockfiles, and audit them regularly. Enable npm's OIDC Trusted Publishers for your own packages. Consider tools like StepSecurity or Socket that detect anomalous publish patterns, and monitor for unexpected postinstall scripts in your dependency tree."
  - question: "What packages were affected by the supply chain attack?"
    answer: "Three packages were involved: axios@1.14.1 and axios@0.30.4 (the backdoored releases) and plain-crypto-js@4.2.1 (a malicious dependency masquerading as crypto-js that served as the postinstall RAT dropper). All three have been removed from npm."
tldr:
  - "Malicious axios@1.14.1 and axios@0.30.4 were published on March 31, 2026, live for ~3 hours before removal from npm."
  - "The attacker compromised the lead maintainer's npm account, bypassing OIDC Trusted Publishers to publish manually."
  - "A hidden dependency (plain-crypto-js@4.2.1) ran a postinstall RAT dropper targeting macOS, Windows, and Linux."
  - "Downgrade to axios@1.14.0 or 0.30.3 immediately; rotate all credentials from machines that ran npm install during the window."
---

Two malicious versions of **axios** — a library downloaded over 300 million times every week, deeply embedded in the [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) ecosystem — were published to npm on March 31, 2026, and caught within hours. **axios@1.14.1** and **axios@0.30.4** shipped with a hidden dependency that did nothing except execute a postinstall dropper. The dropper fetched OS-specific second-stage payloads from a live command-and-control server, then erased itself and replaced its own manifest to hide the evidence.

If you installed either of those versions, assume your system is compromised.

## The Attack in Numbers

- **2** malicious versions published (1.14.1 and 0.30.4)
- **~3 hours** these versions were live on npm before removal
- **~300M** weekly downloads of axios (enormous blast radius)
- **3** OS targets (macOS, Windows, Linux) — all pre-built payloads
- **18 hours** the attacker staged the infrastructure before pulling the trigger

## How the Attack Worked

### Step 1 — Maintainer Account Hijack

The attacker compromised the npm account of jasonsaayman, the lead axios maintainer. They changed the registered email to an attacker-controlled ProtonMail address, then published malicious builds manually via npm CLI — bypassing the project's normal GitHub Actions CI/CD pipeline. This kind of account-level compromise is a reminder of why the JavaScript ecosystem's shift toward [OIDC Trusted Publishers](/articles/2026-03-26-typescript-6-0-final-javascript-release) matters: cryptographic publish provenance makes it harder for an attacker to pass off a malicious package as legitimate.

A critical forensic signal: every legitimate axios 1.x release is published via npm's OIDC Trusted Publisher mechanism, cryptographically bound to a verified GitHub Actions workflow. The malicious 1.14.1 breaks that pattern entirely — no trustedPublisher, no gitHead, no corresponding Git commit or tag.

```json
// axios@1.14.0 — LEGITIMATE
"_npmUser": {
  "name": "GitHub Actions",
  "email": "npm-oidc-no-reply@github.com",
  "trustedPublisher": { "id": "github", ... }
}

// axios@1.14.1 — MALICIOUS
"_npmUser": {
  "name": "jasonsaayman",
  "email": "ifstap@proton.me"
  // no trustedPublisher, no gitHead
}
```

There is no commit or tag in the axios GitHub repository corresponding to 1.14.1. The release exists only on npm.

### Step 2 — Staging a Phantom Dependency

Before publishing the backdoored axios versions, the attacker seeded a malicious package on npm: **plain-crypto-js@4.2.1**, published from a separate throwaway account. This package masqueraded as the legitimate crypto-js library — same description, same author attribution, same repository URL — but contained a postinstall hook whose only job was to run a dropper.

A grep across all 86 files in axios@1.14.1 confirms: **plain-crypto-js is never imported or require()'d anywhere in the axios source code**. It appears in package.json solely to trigger the postinstall hook. Zero lines of malicious code exist inside axios itself.

### Step 3 — Cross-Platform RAT Dropper

The postinstall script is a heavily obfuscated JavaScript file. All sensitive strings — C2 URL, shell commands, file paths — are XOR-encoded in an array and decoded at runtime using a key derived from the string "OrDeR_7077". The dropper branches into three OS-specific attack paths:

- **macOS**: Downloads a RAT binary to `/Library/Caches/com.apple.act.mond` (designed to mimic an Apple system cache), makes it executable, and launches it silently via osascript
- **Windows**: Copies PowerShell to `%PROGRAMDATA%\wt.exe` (disguised as Windows Terminal), drops a VBScript to fetch and execute a second-stage RAT
- **Linux**: Targets CI/CD environments, fetches a Python-based RAT

### Step 4 — Self-Destruct

After deploying the second-stage payload, the dropper deletes itself and swaps in a clean package manifest:

```javascript
// The attacker's own cleanup code embedded in the dropper
// Replaces malicious package.json with a clean decoy
rename("package.md", "package.json")  // clean stub overwrites evidence
unlink("setup.js")                    // dropper erases itself
```

A developer inspecting their `node_modules` after the fact sees no indication anything went wrong.

## Indicators of Compromise (IOCs)

**Malicious packages:**
- `plain-crypto-js@4.2.1` — malicious dependency, postinstall RAT dropper
- `axios@1.14.1` — backdoored 1.x release
- `axios@0.30.4` — backdoored 0.x legacy release

**C2 infrastructure:**
- `sfrclak.com:8000` — command and control server (stage-2 delivery)
- Path segments: `/6202033`, `packages.npm.org/product0`, `packages.npm.org/product1`, `packages.npm.org/product2`

**macOS persistence:**
- `/Library/Caches/com.apple.act.mond` — RAT binary dropped on macOS

**Windows persistence:**
- `%PROGRAMDATA%\wt.exe` — RAT disguised as Windows Terminal

## What You Need to Do Right Now

1. **Check your node_modules** for axios versions 1.14.1 and 0.30.4. If present, assume compromise.
2. **Downgrade immediately** to axios@1.14.0 or axios@0.30.3 — the last known clean versions.
3. **Audit your systems for IOCs** — check for unexpected outbound connections to sfrclak.com:8000, unusual cron/scheduled tasks, or unknown binaries in /Library/Caches (macOS) or %PROGRAMDATA% (Windows).
4. **Rotate all secrets and credentials** accessed from development machines that ran `npm install` during the window the malicious versions were live (~March 31, 00:21–03:15 UTC).
5. **Review your npm publish workflow** — ensure your project uses OIDC Trusted Publishers so that manual token-based publishes break the signature chain.

## Why This Attack Wasn'T Opportunistic

The operational sophistication here is notable:

- The attacker seeded a clean decoy package (plain-crypto-js@4.2.0) **18 hours before** the malicious release, establishing npm publishing history to avoid "zero-history package" alerts
- Both the 1.x and 0.x release branches were hit **39 minutes apart** to maximize coverage
- Separate payloads were pre-built for **three operating systems**
- The C2 URL uses path segments tied to the npm registry path structure — `packages.npm.org/product0/1/2` — making the exfiltration look like ordinary npm traffic
- The dropper uses Apple's legitimate osascript binary on macOS — no malicious binary written to disk until after validation, making EDR detection harder

This is supply chain attack tradecraft at a level previously reserved for state-sponsored operations, now deployed against a top-10 npm package.

---

*Sources: [StepSecurity](https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan), npm registry metadata, axios GitHub repository. The axios security advisory is available on the [npm security advisory database](https://www.npmjs.com/advisories).*
