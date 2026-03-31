---
title: "Axios npm Supply-Chain-Angriff: Bösartige Versionen Installieren Remote Access Trojaner"
description: "Zwei vergiftete Releases von axios — einer der am häufigsten verwendeten Node.js HTTP-Client-Bibliotheken — wurden veröffentlicht und innerhalb von Stunden wieder von npm entfernt. Hier ist, was passiert ist, wie der Angriff funktionierte und was Sie jetzt tun müssen."
date: 2026-03-31
image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&h=630&fit=crop"
author: lschvn
tags: ["security", "npm", "supply-chain", "javascript", "node.js"]
faq:
  - question: "Ist Axios noch sicher zu verwenden?"
    answer: "Ja — axios selbst ist sicher. Der Angriff kompromittierte zwei spezifische Versionen (1.14.1 und 0.30.4), die veröffentlicht und innerhalb von Stunden entfernt wurden. Wenn Sie eine andere Version von axios verwenden, sind Sie nicht betroffen. Die letzten bekannten sauberen Versionen sind axios@1.14.0 und axios@0.30.3."
  - question: "Wie schütze ich mein Projekt vor npm Supply-Chain-Angriffen?"
    answer: "Pinnen Sie Ihre Abhängigkeitsversionen, verwenden Sie Lockfiles und prüfen Sie diese regelmäßig. Aktivieren Sie npm's OIDC Trusted Publishers für Ihre eigenen Pakete. Erwägen Sie Tools wie StepSecurity oder Socket, die anomale Publish-Muster erkennen, und überwachen Sie auf unerwartete Postinstall-Scripts in Ihrem Abhängigkeitsbaum."
  - question: "Welche Pakete waren vom Supply-Chain-Angriff betroffen?"
    answer: "Drei Pakete waren involviert: axios@1.14.1 und axios@0.30.4 (die backdoored Releases) und plain-crypto-js@4.2.1 (eine bösartige Abhängigkeit, die sich als crypto-js ausgab und als Postinstall RAT Dropper diente). Alle drei wurden von npm entfernt."
tldr:
  - "Bösartige axios@1.14.1 und axios@0.30.4 wurden am 31. März 2026 veröffentlicht, ca. 3 Stunden lang auf npm live, bevor sie entfernt wurden."
  - "Der Angreifer kompromittierte das npm-Konto des Lead-Maintainers und umging OIDC Trusted Publishers, um manuell zu veröffentlichen."
  - "Eine versteckte Abhängigkeit (plain-crypto-js@4.2.1) führte einen Postinstall RAT Dropper aus, der auf macOS, Windows und Linux abzielte."
  - "Downgraden Sie sofort auf axios@1.14.0 oder 0.30.3; rotieren Sie alle Anmeldedaten von Maschinen, die während des Zeitfensters npm install ausgeführt haben."
---

Zwei bösartige Versionen von **axios** — einer Bibliothek, die über 300 Millionen Mal pro Woche heruntergeladen wird und tief im [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark)-Ökosystem verankert ist — wurden am 31. März 2026 auf npm veröffentlicht und innerhalb von Stunden erkannt. **axios@1.14.1** und **axios@0.30.4** wurden mit einer versteckten Abhängigkeit ausgeliefert, die nichts anderes tat, als einen Postinstall-Dropper auszuführen. Der Dropper lud betriebssystemspezifische Second-Stage-Payloads von einem Live-Command-and-Control-Server, löschte sich dann selbst und ersetzte sein eigenes Manifest, um die Beweise zu verbergen.

Wenn Sie eine dieser Versionen installiert haben, gehen Sie davon aus, dass Ihr System kompromittiert ist.

## Der Angriff in Zahlen

- **2** bösartige Versionen veröffentlicht (1.14.1 und 0.30.4)
- **~3 Stunden** diese Versionen auf npm live, bevor Entfernung
- **~300M** wöchentliche Downloads von axios (enormer Blast-Radius)
- **3** OS-Ziele (macOS, Windows, Linux) — alle vorab erstellten Payloads
- **18 Stunden** der Angreifer die Infrastruktur vorbereitet, bevor er den Auslöser zog

## Wie der Angriff funktionierte

### Schritt 1 — Maintainer-Konto-Kaperung

Der Angreifer kompromittierte das npm-Konto von jasonsaayman, dem Lead-axios-Maintainer. Sie änderten die registrierte E-Mail zu einer angreiferkontrollierten ProtonMail-Adresse und veröffentlichten dann bösartige Builds manuell über die npm-CLI — unter Umgehung der normalen GitHub Actions CI/CD-Pipeline des Projekts. Diese Art von Konto-Kompromittierung erinnert daran, warum die Verlagerung des JavaScript-Ökosystems hin zu [OIDC Trusted Publishers](/articles/2026-03-26-typescript-6-0-final-javascript-release) wichtig ist: kryptografische Publish-Provenance erschwert es einem Angreifer, ein bösartiges Paket als legitim auszugeben.

Ein kritisches forensisches Signal: Jedes legitime axios 1.x-Release wird über npm's OIDC Trusted Publisher-Mechanismus veröffentlicht, kryptografisch an einen verifizierten GitHub-Actions-Workflow gebunden. Das bösartige 1.14.1 bricht dieses Muster komplett — kein trustedPublisher, kein gitHead, kein entsprechender Git-Commit oder -Tag.

```json
// axios@1.14.0 — LEGITIM
"_npmUser": {
  "name": "GitHub Actions",
  "email": "npm-oidc-no-reply@github.com",
  "trustedPublisher": { "id": "github", ... }
}

// axios@1.14.1 — BÖSARTIG
"_npmUser": {
  "name": "jasonsaayman",
  "email": "ifstap@proton.me"
  // kein trustedPublisher, kein gitHead
}
```

Es gibt keinen Commit oder Tag im axios GitHub-Repository, der 1.14.1 entspricht. Das Release existiert nur auf npm.

### Schritt 2 — Vorbereitung einer Phantom-Abhängigkeit

Bevor die backdoored axios-Versionen veröffentlicht wurden, platzierte der Angreifer ein bösartiges Paket auf npm: **plain-crypto-js@4.2.1**, veröffentlicht von einem separaten Wegwerf-Konto. Dieses Paket gab sich als die legitime crypto-js-Bibliothek aus — gleiche Beschreibung, gleiche Autor-Zuordnung, gleiche Repository-URL — enthielt aber einen Postinstall-Hook, dessen einzige Aufgabe es war, einen Dropper auszuführen.

Ein Grep über alle 86 Dateien in axios@1.14.1 bestätigt: **plain-crypto-js wird nirgendwo im axios-Quellcode importiert oder require()'d**. Es erscheint in package.json solely to trigger the postinstall hook. Zero lines of malicious code exist inside axios itself.

### Schritt 3 — Plattformübergreifender RAT-Dropper

Das Postinstall-Script ist eine stark obfuscierte JavaScript-Datei. Alle sensiblen Strings — C2-URL, Shell-Befehle, Dateipfade — sind XOR-kodiert in einem Array und werden zur Runtime mit einem aus dem String "OrDeR_7077" abgeleiteten Schlüssel dekodiert. Der Dropper verzweigt in drei betriebssystemspezifische Angriffspfade:

- **macOS**: Lädt ein RAT-Binary nach `/Library/Caches/com.apple.act.mond` herunter (darauf ausgelegt, einen Apple-System-Cache nachzuahmen), macht es ausführbar und startet es still über osascript
- **Windows**: Kopiert PowerShell nach `%PROGRAMDATA%\wt.exe` (getarnt als Windows Terminal), legt ein VBScript ab, um ein Second-Stage-RAT abzurufen und auszuführen
- **Linux**: Zielt auf CI/CD-Umgebungen, ruft ein Python-basiertes RAT ab

### Schritt 4 — Selbstzerstörung

Nach der Bereitstellung der Second-Stage-Payload löscht sich der Dropper selbst und tauscht ein sauberes Paketmanifest ein:

```javascript
// Des Angreifers eigener Aufräumcode, eingebettet im Dropper
// Ersetzt bösartige package.json mit einem sauberen Köder
rename("package.md", "package.json")  // sauberer Stub überschreibt Beweise
unlink("setup.js")                    // Dropper löscht sich selbst
```

Ein Entwickler, der seine `node_modules` anschließend inspiziert, sieht keine Anzeichen dafür, dass etwas schief gelaufen ist.

## Indicators of Compromise (IOCs)

**Bösartige Pakete:**
- `plain-crypto-js@4.2.1` — bösartige Abhängigkeit, Postinstall RAT Dropper
- `axios@1.14.1` — backdoored 1.x Release
- `axios@0.30.4` — backdoored 0.x Legacy-Release

**C2-Infrastruktur:**
- `sfrclak.com:8000` — Command and Control Server (Stage-2-Zustellung)
- Pfadsegmente: `/6202033`, `packages.npm.org/product0`, `packages.npm.org/product1`, `packages.npm.org/product2`

**macOS-Persistenz:**
- `/Library/Caches/com.apple.act.mond` — RAT-Binary, auf macOS abgelegt

**Windows-Persistenz:**
- `%PROGRAMDATA%\wt.exe` — RAT getarnt als Windows Terminal

## Was Sie jetzt tun müssen

1. **Überprüfen Sie Ihre node_modules** auf axios-Versionen 1.14.1 und 0.30.4. Wenn vorhanden, gehen Sie von Kompromittierung aus.
2. **Downgraden Sie sofort** auf axios@1.14.0 oder axios@0.30.3 — die letzten bekannten sauberen Versionen.
3. **Auditieren Sie Ihre Systeme auf IOCs** — prüfen Sie auf unerwartete ausgehende Verbindungen zu sfrclak.com:8000, ungewöhnliche Cron/geplante Tasks oder unbekannte Binaries in /Library/Caches (macOS) oder %PROGRAMDATA% (Windows).
4. **Rotieren Sie alle Secrets und Anmeldedaten**, auf die von Entwicklermaschinen zugegriffen wurde, die während des Zeitfensters, in dem die bösartigen Versionen live waren, `npm install` ausgeführt haben (~31. März, 00:21–03:15 UTC).
5. **Überprüfen Sie Ihren npm-Publish-Workflow** — stellen Sie sicher, dass Ihr Projekt OIDC Trusted Publishers verwendet, sodass manuelle Token-basierte Publishs die Signaturkette unterbrechen.

## Warum dieser Angriff nicht opportunistisch war

Die operative Sophistikation hier ist bemerkenswert:

- Der Angreifer platzierte ein sauberes Köder-Paket (plain-crypto-js@4.2.0) **18 Stunden bevor** das bösartige Release erschien, etablierte npm-Publishing-Historie, um "Zero-History-Paket"-Warnungen zu vermeiden
- Beide 1.x- und 0.x-Release-Zweige wurden **39 Minuten voneinander entfernt** getroffen, um die Abdeckung zu maximieren
- Separate Payloads wurden für **drei Betriebssysteme** vorab erstellt
- Die C2-URL verwendet Pfadsegmente, die an die npm-Registry-Pfadstruktur gebunden sind — `packages.npm.org/product0/1/2` — wodurch die Exfiltration wie gewöhnlicher npm-Traffic aussieht
- Der Dropper verwendet Apples legitimes osascript-Binary auf macOS — kein bösartiges Binary wird vor der Validierung auf die Disk geschrieben, was EDR-Erkennung erschwert

Dies ist Supply-Chain-Angriff-Tradecraft auf einem Niveau, das zuvor staatlich unterstützten Operationen vorbehalten war, jetzt eingesetzt gegen ein Top-10-npm-Paket.

---

*Quellen: [StepSecurity](https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan), npm Registry-Metadaten, axios GitHub-Repository. Der axios-Sicherheitshinweis ist in der [npm Security Advisory Database](https://www.npmjs.com/advisories) verfügbar.*