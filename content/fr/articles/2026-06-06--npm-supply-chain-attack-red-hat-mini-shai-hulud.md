---
title: "Attaque Supply Chain npm : Red Hat Compromis via Mini Shai-Hulud"
description: "Wiz Research découvre Miasma, une nouvelle attaque ciblant 32+ paquets npm Red Hat avec du malware voleur de credentials via un abus de trusted-publishing."
date: 2026-06-06
image: "/images/heroes/2026-06-06--npm-supply-chain-attack-red-hat-mini-shai-hulud.png"
author: lschvn
tags: ["security", "typescript", "javascript"]
tldr:
  - "Le 1er juin 2026, 32+ paquets npm @redhat-cloud-services ont été backdoorés avec le malware Mini Shai-Hulud, cumulant environ 80 000 téléchargements hebdomadaires."
  - "Les attaquants ont compromis un compte GitHub d'employé Red Hat pour pousser des commits isolés malveillants qui contournaient la code review et produisaient des attestations SLSA valides."
  - "Le malware cible désormais les identités cloud GCP et Azure avec un chiffrement par infection, rendant la détection par hash significativement plus difficile."
faq:
  - question: "Quels paquets npm ont été touchés ?"
    answer: "32+ paquets sous @redhat-cloud-services ont été compromis, incluant topological-inventory-client, compliance-client, rbac-client, insights-client, frontend-components et d'autres."
  - question: "Qu'est-ce que Mini Shai-Hulud ?"
    answer: "Mini Shai-Hulud est un malware open-source d'attaque supply chain npm publié par le groupe TeamPCP fin 2025. Le variant Miasma reprend sa technique en remplaçant les références à Dune par la mythologie grecque ('spartan')."
  - question: "Comment l'attaque a-t-elle contourné les contrôles de sécurité ?"
    answer: "L'attaquant a utilisé un workflow GitHub Actions réclamant un token d'identité OIDC (id-token: write) pour publier des paquets avec des attestations SLSA valides, les faisant paraître légitimes."
  - question: "Que doivent faire les développeurs ?"
    answer: "Auditer les systèmes pour les paquets concernés, l'activité GitHub et les extensions VSCode. Renouveler les tokens GitHub, clés SSH et credentials cloud. Mettre en place de l'allowlisting de dépendances et la génération de SBOM."
---

Le 1er juin 2026, Wiz Research a identifié une nouvelle vague de compromissions supply chain ciblant le namespace npm `@redhat-cloud-services`. La campagne, baptisée **Miasma**, a injecté un malware voleur de credentials dans au moins 32 releases de paquets, cumulant environ 80 000 téléchargements hebdomadaires. Le code malveillant a été largement révoqué depuis, mais l'incident révèle à quel point les attaquants supply chain ont évolué.

## Un Kit Outil Familier avec de Nouvelles Ruses

Le payload dérive du malware **Mini Shai-Hulud**, open-sourcé par l'acteur malveillant TeamPCP fin 2025. Les campagnes précédentes utilisant ce kit visaient Tanstack et d'autres paquets npm majeurs. Le variant Miasma apporte des modifications cosmétiques, références à l'univers de Dune remplacées par de la mythologie grecque ("spartan"), mais le craft sous-jacent reste substantiellement le même.

Ce qui change cette fois, c'est la portée du ciblage. Le malware collecte désormais explicitement les **identités GCP et Azure**, récupérant chaque identité cloud accessible depuis la machine infectée. Plutôt que d'extraire uniquement des secrets, les attaquants cherchent désormais à obtenir un accès direct aux environnements cloud eux-mêmes.

La deuxième évolution notable est le **chiffrement par infection**. Les variants Shai-Hulud précédents se répliquaient avec une variation minimale, facilitant le suivi par hash. Miasma génère un payload chiffré unique pour chaque infection, signifiant qu'un hash qui détecte une machine compromise ne détectera pas une autre.

## Comment l'Attaque a Fonctionné

Les preuves indiquent qu'un **compte GitHub d'un employé Red Hat a été compromis** et utilisé pour poussée des commits isolés malveillants sur trois dépôts RedHatInsights :

- `RedHatInsights/frontend-components`
- `RedHatInsights/javascript-clients`
- `RedHatInsights/platform-frontend-ai-toolkit`

Ces commits introduisaient un workflow GitHub Actions minimal déclenché sur toute poussée vers n'importe quelle branche. Le workflow réclamait un token d'identité OIDC (`id-token: write`) et exécutait un payload obfuscated `_index.js` qui publiait les paquets directement sur npm, **avec des attestations SLSA valides**.

La provenance SLSA est censée vérifier qu'un paquet a été construit depuis un commit source spécifique par un builder de confiance. En générant des attestations valides, l'attaquant rendait les paquets malveillants indiscernables des vraies releases Red Hat, sapant un mécanisme clé de sécurité supply chain.

## Portée des Dégâts

L'attaque a touché un large spectre de clients JavaScript Red Hat Cloud Services :

| Paquet | Versions compromises |
|---|---|
| `@redhat-cloud-services/topological-inventory-client` | 3.0.10, 3.0.11, 3.0.13 |
| `@redhat-cloud-services/rbac-client` | 9.0.3, 9.0.4, 9.0.6 |
| `@redhat-cloud-services/insights-client` | 4.0.4, 4.0.5, 4.0.7 |
| `@redhat-cloud-services/frontend-components` | 7.7.2, 7.7.3, 7.7.5 |
| `@redhat-cloud-services/notifications-client` | 6.1.4, 6.1.5, 6.1.7 |

Une seconde vague est apparue le 4 juin, utilisant `binding.gyp` (fichier de configuration de build natif [Node.js](/articles/2026-04-12--nodejs-25-stream-iter-async-streams)) pour exécuter du code malveillant pendant l'installation du paquet, cohérent avec la campagne Miasma.

## Ce Que Cela Signifie pour l'Écosystème npm

L'attaque Miasma démontre une progression inquiétante dans la guerre supply chain npm. Trois points clés :

**Les trusted publishers sont le maillon faible.** La provenance SLSA, les tokens OIDC et les badges "vérifié" ont tous été contournés ici. Le modèle de sécurité suppose que les comptes GitHub et npm d'un éditeur sont sécurisés. Les deux ont été compromis.

**Le malware open-source abaisse le seuil.** TeamPCP a publié le code de Mini Shai-Hulud publiquement. Miasma n'est pas attribué avec certitude à TeamPCP, les similarités pourraient indiquer des acteurs copycat utilisant le même toolkit publicly available.

**La détection devient plus difficile, pas plus facile.** Chiffrement par infection, abus d'attestations SLSA et techniques living-off-the-land font que les défenses traditionnelles (scanning de paquets, IOCs par hash) sont de plus en plus insuffisantes.

## Actions Recommandées

Les organisations utilisant les clients JavaScript Red Hat doivent :

1. **Auditer les versions de paquets affectées** et passer aux releases corrigées
2. **Renouveler tous les secrets** accessibles depuis les postes de développement, tokens GitHub, credentials cloud, secrets CI/CD
3. **Revoir l'activité GitHub** pour des dépôts non autorisés, de nouveaux access tokens ou des exécutions de workflow suspectes
4. **Mettre en place de l'allowlisting de dépendances** et l'imposer via `.npmrc` ou politique corporative
5. **Générer des SBOM** pour toutes les dépendances de production afin d'accélérer la réponse à incident

L'écosystème npm reste une cible de haute valeur. Miasma n'est pas un incident isolé, c'est la dernière itération d'une campagne escalada.
