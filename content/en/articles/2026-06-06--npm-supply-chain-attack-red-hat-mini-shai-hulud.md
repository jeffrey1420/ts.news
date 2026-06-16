---
title: "npm Supply Chain Attack: Red Hat Compromised via Mini Shai-Hulud"
description: "Wiz Research uncovers Miasma, a new supply chain attack abusing trusted-publishing to inject credential-stealing malware into 32+ Red Hat npm packages."
date: 2026-06-06
image: "/images/heroes/2026-06-06--npm-supply-chain-attack-red-hat-mini-shai-hulud.png"
author: lschvn
tags: ["security", "typescript", "javascript"]
tldr:
  - "On June 1, 2026, 32+ @redhat-cloud-services npm packages were backdoored using Mini Shai-Hulud malware, averaging ~80,000 weekly downloads."
  - "Attackers compromised a Red Hat employee GitHub account to push malicious orphan commits that bypassed code review and produced valid SLSA provenance attestations."
  - "The malware now targets GCP and Azure cloud identities with per-infection encryption, making hash-based detection significantly harder."
faq:
  - question: "Which npm packages were affected?"
    answer: "32+ packages in the @redhat-cloud-services namespace were compromised, including topological-inventory-client, compliance-client, rbac-client, insights-client, frontend-components, and many others."
  - question: "What is Mini Shai-Hulud?"
    answer: "Mini Shai-Hulud is open-source npm supply chain attack malware originally released by threat actor TeamPCP. The Miasma variant borrows its tradecraft but replaces Dune-themed naming with Greek mythology ('spartan')."
  - question: "How did the attack bypass security controls?"
    answer: "The attacker used a GitHub Actions workflow that requested an OIDC identity token (id-token: write) to publish packages with valid SLSA provenance attestations, making them appear trustworthy."
  - question: "What should developers do?"
    answer: "Audit systems for affected packages, GitHub activity, and VSCode extensions. Rotate GitHub tokens, SSH keys, and cloud credentials. Implement dependency allowlisting and SBOM generation going forward."
---

On June 1, 2026, Wiz Research identified a new wave of npm supply chain compromises targeting the `@redhat-cloud-services` namespace. The campaign, dubbed **Miasma**, injected credential-stealing malware into at least 32 package releases, cumulatively averaging around 80,000 weekly downloads. The malicious code has since been mostly revoked, but the incident exposes how far supply chain attackers have evolved.

## A Familiar Toolkit with New Tricks

The payload is derived from the **Mini Shai-Hulud** malware, open-sourced by threat actor TeamPCP in late 2025. Previous campaigns using this toolkit targeted Tanstack and other major npm packages. The Miasma variant makes cosmetic changes, Dune universe references replaced with Greek mythology ("spartan"), but the underlying tradecraft is substantially the same.

What changed in this iteration is the targeting scope. The malware now explicitly harvests **GCP and Azure identities**, collecting every cloud identity the infected machine can access. Rather than purely extracting secrets, the attackers are now interested in gaining direct access to cloud environments themselves.

The second notable evolution is **per-infection encryption**. Previous Shai-Hulud variants self-replicated with minimal variation, making hash-based IOC tracking viable. Miasma generates a unique encrypted payload for each infection, meaning a hash that catches one compromised machine will not catch another.

## How the Attack Worked

Evidence indicates a **Red Hat employee GitHub account was compromised** and used to push malicious orphan commits to three RedHatInsights repositories:

- `RedHatInsights/frontend-components`
- `RedHatInsights/javascript-clients`
- `RedHatInsights/platform-frontend-ai-toolkit`

These commits introduced a minimal GitHub Actions workflow that triggered on any push to any branch. The workflow requested a GitHub OIDC identity token (`id-token: write`) and executed an obfuscated `_index.js` payload that published packages directly to npm, **with valid SLSA provenance attestations**.

SLSA provenance is meant to verify that a package was built from a specific source commit by a trusted builder. By generating valid attestations, the attacker made the malicious packages appear as legitimate Red Hat releases, undermining a key supply chain security mechanism.

## Scope of the Damage

The attack affected a broad range of Red Hat Cloud Services JavaScript clients:

| Package | Compromised Versions |
|---|---|
| `@redhat-cloud-services/topological-inventory-client` | 3.0.10, 3.0.11, 3.0.13 |
| `@redhat-cloud-services/rbac-client` | 9.0.3, 9.0.4, 9.0.6 |
| `@redhat-cloud-services/insights-client` | 4.0.4, 4.0.5, 4.0.7 |
| `@redhat-cloud-services/frontend-components` | 7.7.2, 7.7.3, 7.7.5 |
| `@redhat-cloud-services/notifications-client` | 6.1.4, 6.1.5, 6.1.7 |

A second wave emerged on June 4, using `binding.gyp` (a native [Node.js](/articles/2026-04-12-nodejs-25-stream-iter-async-streams) build configuration file) to execute malicious code during package installation, consistent with the Miasma campaign.

## What This Means for the npm Ecosystem

The Miasma attack demonstrates a troubling progression in npm supply chain warfare. Three key takeaways:

**Trusted publishers are the weak link.** SLSA provenance, OIDC tokens, and "verified publisher" badges were all subverted here. The security model assumes that a publisher's GitHub account and npm account are secure. Both were compromised.

**Open-source malware lowers the bar.** TeamPCP published Mini Shai-Hulud's code publicly. Miasma is not attributed to TeamPCP with certainty, the similarities could indicate copycat actors using the same publicly available toolkit.

**Detection is getting harder, not easier.** Per-infection encryption, SLSA attestation abuse, and living-off-the-land techniques mean traditional defenses (package scanning, hash-based IOCs) are increasingly insufficient.

## Recommended Actions

Organizations using Red Hat's JavaScript clients should:

1. **Audit for affected package versions** and upgrade to patched releases
2. **Rotate all secrets** accessible from developer workstations, GitHub tokens, cloud credentials, CI/CD secrets
3. **Review GitHub activity** for unauthorized repositories, new access tokens, or suspicious workflow executions
4. **Implement dependency allowlisting** and enforce it via `.npmrc` or corporate policy
5. **Generate SBOMs** for all production dependencies to enable faster incident response

The npm ecosystem remains a high-value target. Miasma is not an isolated incident, it is the latest iteration in an escalating campaign.
