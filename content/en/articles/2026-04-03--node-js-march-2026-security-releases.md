---
title: "Node.js March 2026: Six Security Patches Land Across All Active Branches"
description: "Node.js shipped emergency security releases for v25, v24, v22, and v20 on March 24, 2026, patching two high-severity CVEs including a TLS SNICallback crash and an HTTP header prototype pollution risk. Here's what each fix does and which versions are affected."
date: 2026-04-03
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Node.js", "security", "CVE", "TLS", "HTTP", "TypeScript"]
readingTime: 5
tldr:
  - "Node.js released security patches for v25.8.2, v24.14.1, v22.22.2, and v20.20.2 on March 24, 2026, closing six CVEs across all active branches."
  - "The highest severity fixes address CVE-2026-21637 (TLS SNICallback crash, High) and CVE-2026-21710 (HTTP header prototype pollution via headersDistinct/trailersDistinct, High)."
  - "Also patched: timing-safe HMAC comparison, NGHTTP2 flow control errors, array index hash collision, and two permission system gaps in realpath.native and fs/promises."
faq:
  - question: "Which Node.js versions are affected?"
    answer: "All active Node.js release lines received updates: v25.8.2 (Current), v24.14.1 (LTS), v22.22.2 (LTS), and v20.20.2 (LTS). Users on older lines like v18 should already be on v18.x LTS with separate support windows."
  - question: "What is CVE-2026-21637?"
    answer: "This vulnerability allowed an unhandled exception in the TLS SNICallback to crash a Node.js process. Since SNICallback runs during TLS handshake, a malicious or misconfigured server could trigger a denial of service by causing that callback to throw."
  - question: "What is CVE-2026-21710?"
    answer: "The headersDistinct and trailersDistinct objects in Node.js HTTP responses used a regular Object prototype, making them vulnerable to prototype pollution attacks. The fix switches to a null prototype (Object.create(null)), removing the prototype chain entirely from these internal structures."
---

Node.js released a coordinated set of security patches on March 24, 2026, covering six CVEs across every active release line. If you're running Node in production, this is the update you've been waiting for.

## The Two High-Severity Fixes

**CVE-2026-21637 — TLS SNICallback Crash (High)**

TLS SNICallback lets a server select the right certificate based on the hostname a client is connecting to. The vulnerability: if your SNICallback implementation threw an exception, Node.js didn't catch it, crashing the entire process during the TLS handshake. Matteo Collina patched this by wrapping the SNICallback invocation in a try/catch, preventing an unhandled rejection from terminating the server.

This is a real concern for anyone using custom SNICallback logic — which is common in environments where you terminate TLS at the application layer rather than at a load balancer.

**CVE-2026-21710 — HTTP Header Prototype Pollution (High)**

The `headersDistinct` and `trailersDistinct` objects in Node.js HTTP responses were using standard JavaScript object prototypes. That sounds innocuous, but it opens a prototype pollution attack vector: if an attacker could influence the keys set on these objects, they could inject properties like `__proto__` or `constructor`, potentially affecting the behavior of other HTTP processing code that touches the same objects.

The fix: use a null prototype (`Object.create(null)`) for these internal structures, cutting off the prototype chain entirely. Dario Piotrowicz and Matteo Collina collaborated on this one.

## Four Medium and Low Severity Fixes

**CVE-2026-21713 — Timing-Safe HMAC Comparison (Medium)**
Filip Skokan patched the Web Cryptography HMAC implementation to use a timing-safe comparison when verifying signatures. Without this, an attacker with sufficient network access could potentially use timing side-channels to forge HMAC tags. This is particularly relevant for any code using Node's `crypto.subtle` API for HMAC-based authentication.

**CVE-2026-21714 — NGHTTP2 Flow Control (Medium)**
RafaelGSS fixed an issue where unhandled `NGHTTP2_ERR_FLOW_CONTROL` errors could cause problems in HTTP/2 connections. When the flow control window is exhausted and the error isn't properly handled, it could lead to hangs or unexpected termination of streams.

**CVE-2026-21717 — Array Index Hash Collision Test (Medium)**
Joyee Cheung updated the V8 test suite to properly detect hash collision attacks on array indices. Hash collision DoS attacks exploit the fact that JavaScript objects use hash tables — if an attacker can craft inputs that all hash to the same value, they can force O(n) behavior instead of O(1), tying up the event loop. This backports V8 hardening from upstream.

**CVE-2026-21715 and CVE-2026-21716 — Permission System Gaps (Low)**
Two separate permission checks were missing in `realpath.native` and `fs/promises` APIs, allowing filesystem access outside permitted paths in Node's experimental permission model. These are lower severity because they only affect code running with Node's `--allow-fs` and `--deny-fs` permission flags enabled — not the default configuration.

## Other Changes in the Release

- **undici updated to v6.24.1** — includes upstream HTTP client fixes
- **npm upgraded to 10.9.7** on the v22 and v25 branches
- V8 upgraded across all branches with upstream security patches

## What to Do

If you're running any of the affected versions, upgrade immediately. For LTS users, v22.22.2 is the current recommended LTS line. If you're still on Node 20 LTS, v20.20.2 is your security patch.

The npm audit tooling catches some of these issues, but for TLS and HTTP-level vulnerabilities, running the latest patch version is the most reliable mitigation.

---

*Daily TypeScript and JavaScript ecosystem coverage at [ts.news](https://ts.news).*
