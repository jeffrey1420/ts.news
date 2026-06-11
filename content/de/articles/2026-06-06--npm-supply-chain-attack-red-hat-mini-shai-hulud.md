---
title: "npm Supply-Chain-Angriff: Red Hat durch Mini Shai-Hulud Kompromittiert"
description: "Wiz Research entdeckt Miasma, einen neuen Supply-Chain-Angriff, der Credential-Diebstahl-Malware in 32+ Red Hat npm-Pakete einschleust."
date: 2026-06-06
image: "/images/heroes/2026-06-06--npm-supply-chain-attack-red-hat-mini-shai-hulud.png"
author: lschvn
tags: ["security", "typescript", "javascript"]
tldr:
  - "Am 1. Juni 2026 wurden 32+ @redhat-cloud-services npm-Pakete mit Mini-Shai-Hulud-Malware kompromittiert, mit insgesamt ca. 80.000 Weekly Downloads."
  - "Angreifer kompromittierten ein Red-Hat-Mitarbeiter-GitHub-Konto, um bösartige Orphan-Commits zu推送, die die Code-Review umgingen und gültige SLSA-Provenienz-Attestierungen erzeugten."
  - "Die Malware zielt jetzt auf GCP- und Azure-Cloud-Identitäten mit Per-Infection-Verschlüsselung ab, was die Hash-basierte Erkennung deutlich erschwert."
faq:
  - question: "Welche npm-Pakete waren betroffen?"
    answer: "32+ Pakete im @redhat-cloud-services-Namensraum wurden kompromittiert, darunter topological-inventory-client, compliance-client, rbac-client, insights-client, frontend-components und weitere."
  - question: "Was ist Mini Shai-Hulud?"
    answer: "Mini Shai-Hulud ist Open-Source-npm-Supply-Chain-Angriffs-Malware, die ursprünglich von der Bedrohungsgruppe TeamPCP Ende 2025 veröffentlicht wurde. Der Miasma-Variant verwendet dieselbe Technik, ersetzt aber Dune-Referenzen durch griechische Mythologie ('spartan')."
  - question: "Wie umging der Angriff die Sicherheitskontrollen?"
    answer: "Der Angreifer nutzte einen GitHub-Actions-Workflow, der ein OIDC-Identitätstoken (id-token: write) anforderte, um Pakete mit gültigen SLSA-Attestierungen zu veröffentlichen, was sie als vertrauenswürdig erscheinen ließ."
  - question: "Was sollten Entwickler tun?"
    answer: "Systeme auf betroffene Pakete, GitHub-Aktivität und VSCode-Erweiterungen prüfen. GitHub-Tokens, SSH-Schlüssel und Cloud-Credentials erneuern. Dependency-Allowlisting und SBOM-Generierung einführen."
---

Am 1. Juni 2026 identifizierte Wiz Research eine neue Welle von npm-Supply-Chain-Kompromittierungen, die auf den npm-Namensraum `@redhat-cloud-services` abzielten. Die Kampagne, genannt **Miasma**, schleuste Credential-Diebstahl-Malware in mindestens 32 Paket-Releases ein, mit insgesamt rund 80.000 Weekly Downloads. Der bösartige Code wurde inzwischen größtenteils widerrufen, aber der Vorfall zeigt, wie weit Supply-Chain-Angreifer sich entwickelt haben.

## Ein Vertrautes Werkzeugset mit Neuen Tricks

Die Payload stammt von der **Mini-Shai-Hulud**-Malware, die von der Bedrohungsgruppe TeamPCP Ende 2025 Open-Source gestellt wurde. Frühere Kampagnen mit diesem Toolkit zielten auf Tanstack und andere große npm-Pakete ab. Der Miasma-Variant nimmt kosmetische Änderungen vor — Dune-Referenzen werden durch griechische Mythologie ersetzt ("spartan") — aber das zugrunde liegende Vorgehen bleibt im Wesentlichen gleich.

Was sich in dieser Iteration geändert hat, ist der Zielumfang. Die Malware sammelt jetzt explizit **GCP- und Azure-Identitäten** und erfasst jede Cloud-Identität, auf die die infizierte Maschine Zugriff hat. Anstatt nur Secrets zu extrahieren, sind die Angreifer nun daran interessiert, direkten Zugang zu Cloud-Umgebungen selbst zu erhalten.

Die zweite bemerkenswerte Evolution ist **Per-Infection-Verschlüsselung**. Frühere Shai-Hulud-Varianten replizierten sich mit minimaler Variation, was Hash-basiertes IOC-Tracking ermöglichte. Miasma generiert eine einzigartig verschlüsselte Payload für jede Infektion, was bedeutet, dass ein Hash, der eine kompromittierte Maschine erkennt, eine andere nicht erkennen wird.

## Wie der Angriff Funktionierte

Beweise deuten darauf hin, dass ein **Red-Hat-Mitarbeiter-GitHub-Konto kompromittiert** und用来 push bösartiger Orphan-Commits auf drei RedHatInsights-Repositories :

- `RedHatInsights/frontend-components`
- `RedHatInsights/javascript-clients`
- `RedHatInsights/platform-frontend-ai-toolkit`

Diese Commits führten einen minimalen GitHub-Actions-Workflow ein, der bei jedem Push auf jeden Branch ausgelöst wurde. Der Workflow forderte ein GitHub-OIDC-Identitätstoken (`id-token: write`) an und führte eine obfuscated Payload `_index.js` aus, die Pakete direkt auf npm veröffentlichte — **mit gültigen SLSA-Provenienz-Attestierungen**.

SLSA-Provenienz soll verifizieren, dass ein Paket aus einem spezifischen Source-Commit von einem vertrauenswürdigen Builder gebaut wurde. Indem sie gültige Attestierungen generierten, machten die Angreifer die bösartigen Pakete als legitime Red-Hat-Releases erscheinen und unterminierten damit einen Schlüsselmechanismus der Supply-Chain-Sicherheit.

## Umfang der Schäden

Der Angriff traf eine breite Palette von Red-Hat-Cloud-Services-JavaScript-Clients :

| Paket | Kompromittierte Versionen |
|---|---|
| `@redhat-cloud-services/topological-inventory-client` | 3.0.10, 3.0.11, 3.0.13 |
| `@redhat-cloud-services/rbac-client` | 9.0.3, 9.0.4, 9.0.6 |
| `@redhat-cloud-services/insights-client` | 4.0.4, 4.0.5, 4.0.7 |
| `@redhat-cloud-services/frontend-components` | 7.7.2, 7.7.3, 7.7.5 |
| `@redhat-cloud-services/notifications-client` | 6.1.4, 6.1.5, 6.1.7 |

Eine zweite Welle erschien am 4. Juni und nutzte `binding.gyp` (eine native Node.js-Build-Konfigurationsdatei), um während der Paketinstallation bösartigen Code auszuführen, konsistent mit der Miasma-Kampagne.

## Was das für das npm-Ökosystem Bedeutet

Der Miasma-Angriff demonstriert eine beunruhigende Progression im npm-Supply-Chain-Krieg. Drei Kernpunkte :

**Vertrauenswürdige Publisher sind das schwache Glied.** SLSA-Provenienz, OIDC-Tokens und "verifizierter Herausgeber"-Badges wurden hier alle untergraben. Das Sicherheitsmodell nimmt an, dass die GitHub- und npm-Konten eines Herausgebers sicher sind. Beide wurden kompromittiert.

**Open-Source-Malware senkt die Einstiegshürde.** TeamPCP hat den Mini-Shai-Hulud-Code öffentlich veröffentlicht. Miasma wird nicht mit Sicherheit TeamPCP zugeschrieben — die Ähnlichkeiten könnten auf Copycat-Akteure hinweisen, die dasselbe öffentlich verfügbare Toolkit nutzen.

**Erkennung wird schwieriger, nicht einfacher.** Per-Infection-Verschlüsselung, SLSA-Attestierungsmissbrauch und Living-off-the-Land-Techniken bedeuten, dass traditionelle Verteidigungen (Paket-Scanning, Hash-basierte IOCs) zunehmend unzureichend sind.

## Empfohlene Maßnahmen

Organisationen, die Red-Hat-JavaScript-Clients verwenden, sollten :

1. **Systeme auf betroffene Paketversionen prüfen** und auf gepatchte Releases aktualisieren
2. **Alle Secrets erneuern**, die von Entwickler-Workstations aus zugänglich sind — GitHub-Tokens, Cloud-Credentials, CI/CD-Secrets
3. **GitHub-Aktivität überprüfen** auf nicht autorisierte Repositories, neue Zugriffstokens oder verdächtige Workflow-Ausführungen
4. **Dependency-Allowlisting implementieren** und über `.npmrc` oder Unternehmensrichtlinie durchsetzen
5. **SBOMs für alle Produktionsabhängigkeiten generieren**, um schnellere Incident-Response zu ermöglichen

Das npm-Ökosystem bleibt ein Hochwert-Ziel. Miasma ist kein isolierter Vorfall — es ist die letzte Iteration einer eskalierenden Kampagne.
