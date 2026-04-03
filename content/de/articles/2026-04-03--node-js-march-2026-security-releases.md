---
title: "Node.js März 2026: Sechs Sicherheitspatches Auf Allen Aktiven Branches"
description: "Node.js veröffentlichte am 24. März 2026 Notfall-Sicherheitspatches für v25, v24, v22 und v20, darunter zwei High-Severity-CVEs. Hier sind die Details."
date: 2026-04-03
image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=1200&h=630&fit=crop"
author: lschvn
tags: ["Node.js", "Sicherheit", "CVE", "TLS", "HTTP", "TypeScript"]
readingTime: 5
tldr:
  - "Node.js veröffentlichte Sicherheitspatches für v25.8.2, v24.14.1, v22.22.2 und v20.20.2 am 24. März 2026, mit sechs geschlossenen CVEs auf allen aktiven Branches."
  - "Die kritischsten Korrekturen betreffen CVE-2026-21637 (TLS SNICallback Crash, High) und CVE-2026-21710 (HTTP Header Prototype Pollution über headersDistinct/trailersDistinct, High)."
  - "Ebenfalls gepatcht: Timing-safe HMAC-Vergleich, NGHTTP2 Flow-Control-Fehler, Array-Index-Hash-Kollision und zwei Lücken im Permission-System."
faq:
  - question: "Welche Node.js-Versionen sind betroffen?"
    answer: "Alle aktiven Node.js-Release-Linien erhielten Updates: v25.8.2 (Current), v24.14.1 (LTS), v22.22.2 (LTS) und v20.20.2 (LTS)."
  - question: "Was ist CVE-2026-21637?"
    answer: "Diese Schwachstelle ermöglichte es, dass eine unbehandelte Exception im TLS SNICallback den Node.js-Prozess zum Absturz brachte. Das Wrapping des Callbacks in try/catch behebt das Problem."
  - question: "Was ist CVE-2026-21710?"
    answer: "Die headersDistinct- und trailersDistinct-Objekte nutzten einen standardmäßigen Object-Prototype, was sie für Prototype-Pollution-Angriffe anfällig machte. Der Fix verwendet Object.create(null)."
---

Node.js veröffentlichte am 24. März 2026 einen koordinierten Satz von Sicherheitspatches, die sechs CVEs über alle aktiven Release-Linien hinweg abdecken. Wer Node in Produktion betreibt, sollte diese Updates sofort einspielen.

## Die Zwei High-Severity-Fixes

**CVE-2026-21637 — TLS SNICallback Crash (High)**

TLS SNICallback ermöglicht es einem Server, das richtige Zertifikat basierend auf dem Hostname des Clients auszuwählen. Die Schwachstelle: Wenn die SNICallback-Implementierung eine Exception warf, fing Node.js diese nicht ab — der gesamte Prozess stürzte während des TLS-Handshakes ab. Matteo Collina patchte dies, indem er den SNICallback in einen try/catch-Block wrappte.

**CVE-2026-21710 — HTTP Header Prototype Pollution (High)**

Die `headersDistinct`- und `trailersDistinct`-Objekte in Node.js HTTP-Antworten nutzten standardmäßige JavaScript-Prototypen. Das eröffnet einen Prototype-Pollution-Angriffsvektor: Wenn ein Angreifer die Keys dieser Objekte beeinflussen könnte, könnte er Eigenschaften wie `__proto__` oder `constructor` injizieren. Der Fix verwendet einen Null-Prototypen (`Object.create(null)`), der die Prototypenkette vollständig entfernt.

## Vier Weitere Patches

**CVE-2026-21713 — Timing-Safe HMAC-Vergleich (Medium)**
Filip Skokan patchte die Web Cryptography HMAC-Implementierung, um einen timing-safe Vergleich zu verwenden und Seitenkanalangriffe zu verhindern.

**CVE-2026-21714 — NGHTTP2 Flow Control (Medium)**
RafaelGSS korrigierte ein Problem, bei dem nicht behandelte `NGHTTP2_ERR_FLOW_CONTROL`-Fehler zu Hängern in HTTP/2-Verbindungen führen konnten.

**CVE-2026-21717 — Array-Index-Hash-Kollision (Medium)**
Joyee Cheung aktualisierte die V8-Testsuite, um Hash-Kollisionsangriffe auf Array-Indizes zu erkennen.

**CVE-2026-21715 und CVE-2026-21716 — Permission-System-Lücken (Low)**
Zwei fehlende Berechtigungsprüfungen in `realpath.native` und `fs/promises` wurden geschlossen.

## Was Zu Tun Ist

Wer eine der betroffenen Versionen betreibt, sollte sofort aktualisieren. Für LTS-Nutzer ist v22.22.2 die empfohlene aktuelle LTS-Linie.

---

*Tägliche TypeScript- und JavaScript-Ökosystem-Berichterstattung auf [ts.news](https://ts.news).*
