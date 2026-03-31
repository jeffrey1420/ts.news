---
title: "Attaque supply chain npm sur Axios : Versions malveillantes déposent un cheval de Troie d'accès à distance"
description: "Deux releases empoisonnées d'axios — l'une des bibliothèques HTTP client Node.js les plus utilisées — ont été publiées puis retirées de npm en quelques heures. Ce qui s'est passé, comment l'attaque a fonctionné, et ce que vous devez faire maintenant."
date: 2026-03-31
image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&h=630&fit=crop"
author: lschvn
tags: ["security", "npm", "supply-chain", "javascript", "node.js"]
tldr:
  - "Les versions malveillantes axios@1.14.1 et axios@0.30.4 ont été publiées le 31 mars 2026, en ligne pendant ~3 heures avant suppression de npm."
  - "L'attaquant a compromis le compte npm du mainteneur principal, contournant OIDC Trusted Publishers pour publier manuellement."
  - "Une dépendance cachée (plain-crypto-js@4.2.1) exécutait un dropper RAT postinstall ciblant macOS, Windows et Linux."
  - "Retrogradez immédiatement vers axios@1.14.0 ou 0.30.3 ; rotatingz tous les identifiants des machines qui ont exécuté npm install pendant la fenêtre."
faq:
  - question: "Axios est-il toujours sûr à utiliser ?"
    answer: "Oui — axios lui-même est sûr. L'attaque a compromis deux versions spécifiques (1.14.1 et 0.30.4) qui ont été publiées et retirées en quelques heures. Si vous utilisez une autre version d'axios, vous n'êtes pas affecté. Les dernières versions propres connues sont axios@1.14.0 et axios@0.30.3."
  - question: "Comment protéger mon projet des attaques supply chain npm ?"
    answer: "Épinglez vos versions de dépendances, utilisez des lockfiles et auditez-les régulièrement. Activez les OIDC Trusted Publishers de npm pour vos propres paquets. Envisagez des outils comme StepSecurity ou Socket qui détectent les patterns de publication anormaux, et surveillez les postinstall scripts inattendus dans votre arbre de dépendances."
  - question: "Quels paquets ont été affectés par l'attaque supply chain ?"
    answer: "Trois paquets étaient impliqués : axios@1.14.1 et axios@0.30.4 (les releases backdoorées) et plain-crypto-js@4.2.1 (une dépendance malveillante se faisant passer pour crypto-js qui servait de dropper RAT postinstall). Les trois ont été supprimés de npm."
---

Deux versions malveillantes d'**axios** — une bibliothèque téléchargée plus de 300 millions de fois chaque semaine, profondément embed dans l'écosystème [Node.js](/articles/2026-03-24-bun-vs-node-vs-deno-2026-runtime-benchmark) — ont été publiées sur npm le 31 mars 2026, et détectées en quelques heures. **axios@1.14.1** et **axios@0.30.4** étaient livrées avec une dépendance cachée qui ne faisait rien d'autre qu'exécuter un dropper postinstall. Le dropper récupérait des payloads de deuxième étape spécifiques au système d'exploitation depuis un serveur live de commande et contrôle, puis s'effaçait et remplaçait son propre manifest pour cacher les preuves.

Si vous avez installé l'une de ces versions, supposez que votre système est compromis.

## L'attaque en chiffres

- **2** versions malveillantes publiées (1.14.1 et 0.30.4)
- **~3 heures** ces versions étaient en ligne sur npm avant suppression
- **~300M** téléchargements hebdomadaires d'axios (rayon de souffle enormous)
- **3** cibles OS (macOS, Windows, Linux) — tous les payloads pré-construits
- **18 heures** l'attaquant a préparé l'infrastructure avant de déclencher

## Comment l'attaque a fonctionné

### Étape 1 — Détournement du compte mainteneur

L'attaquant a compromis le compte npm de jasonsaayman, le mainteneur principal d'axios. Il a changé l'email enregistré pour une adresse ProtonMail contrôlée par l'attaquant, puis publié des builds malveillants manuellement via npm CLI — contournant le pipeline CI/CD normal de GitHub Actions du projet. Ce type de compromis au niveau du compte est un rappel de pourquoi le shift de l'écosystème JavaScript vers les [OIDC Trusted Publishers](/articles/2026-03-26-typescript-6-0-final-javascript-release) compte : la provenance de publication cryptographique rend plus difficile pour un attaquant de faire passer un paquet malveillant pour légitime.

Un signal forensic critique : chaque release axios 1.x légitime est publiée via le mécanisme OIDC Trusted Publisher de npm, cryptographiquement lié à un workflow GitHub Actions vérifié. Le malveillant 1.14.1 rompt ce pattern entièrement — pas de trustedPublisher, pas de gitHead, pas de commit ou tag Git correspondant.

```json
// axios@1.14.0 — LÉGITIME
"_npmUser": {
  "name": "GitHub Actions",
  "email": "npm-oidc-no-reply@github.com",
  "trustedPublisher": { "id": "github", ... }
}

// axios@1.14.1 — MALVEILLANT
"_npmUser": {
  "name": "jasonsaayman",
  "email": "ifstap@proton.me"
  // pas de trustedPublisher, pas de gitHead
}
```

Il n'y a pas de commit ou tag dans le dépôt GitHub axios correspondant à 1.14.1. La release n'existe que sur npm.

### Étape 2 — Mise en scène d'une dépendance fantôme

Avant de publier les versions axios backdoorées, l'attaquant a seedé un paquet malveillant sur npm : **plain-crypto-js@4.2.1**, publié depuis un compte séparé jetable. Ce paquet se faisait passer pour la bibliothèque crypto-js légitime — même description, même attribution d'auteur, même URL de dépôt — mais contenait un hook postinstall dont le seul travail était d'exécuter un dropper.

Un grep à travers les 86 fichiers d'axios@1.14.1 confirme : **plain-crypto-js n'est jamais importé ou require()'d nulle part dans le code source axios**. Il apparaît dans package.json uniquement pour déclencher le hook postinstall. Zéro ligne de code malveillant n'existe à l'intérieur d'axios lui-même.

### Étape 3 — Dropper RAT multi-plateforme

Le script postinstall est un fichier JavaScript heavily obfuscated. Toutes les chaînes sensibles — URL C2, commandes shell, chemins de fichiers — sont XOR-encodées dans un tableau et décodées à l'exécution en utilisant une clé dérivée de la chaîne "OrDeR_7077". Le dropper se divise en trois chemins d'attaque spécifiques au OS :

- **macOS** : Télécharge un binaire RAT vers `/Library/Caches/com.apple.act.mond` (conçu pour imiter un cache système Apple), le rend exécutable, et le lance silencieusement via osascript
- **Windows** : Copie PowerShell vers `%PROGRAMDATA%\wt.exe` ( déguisé en Windows Terminal), dépose un VBScript pour récupérer et exécuter un RAT de deuxième étape
- **Linux** : Cible les environnements CI/CD, récupère un RAT basé sur Python

### Étape 4 — Auto-destruction

Après avoir déployé le payload de deuxième étape, le dropper se supprime et échange un manifest de paquet propre :

```javascript
// Le propre code de nettoyage de l'attaquant intégré dans le dropper
// Remplace le package.json malveillant par un décoy propre
rename("package.md", "package.json")  // stub propre écrase les preuves
unlink("setup.js")                    // le dropper s'efface
```

Un développeur qui inspecte son `node_modules` après coup ne voit aucune indication que quelque chose s'est mal passé.

## Indicateurs de compromission (IOCs)

**Paquets malveillants :**
- `plain-crypto-js@4.2.1` — dépendance malveillante, dropper RAT postinstall
- `axios@1.14.1` — release 1.x backdoorée
- `axios@0.30.4` — release 0.x legacy backdoorée

**Infrastructure C2 :**
- `sfrclak.com:8000` — serveur de commande et contrôle (livraison étape 2)
- Segments de chemin : `/6202033`, `packages.npm.org/product0`, `packages.npm.org/product1`, `packages.npm.org/product2`

**Persistance macOS :**
- `/Library/Caches/com.apple.act.mond` — binaire RAT déposé sur macOS

**Persistance Windows :**
- `%PROGRAMDATA%\wt.exe` — RAT déguisé en Windows Terminal

## Ce que vous devez faire maintenant

1. **Vérifiez votre node_modules** pour les versions axios 1.14.1 et 0.30.4. Si présentes, supposez la compromission.
2. **Retrogradez immédiatement** vers axios@1.14.0 ou axios@0.30.3 — les dernières versions propres connues.
3. **Auditez vos systèmes pour les IOCs** — vérifiez les connexions sortantes inattendues vers sfrclak.com:8000, les tâches cron/planifiées inhabituelles, ou les binaires inconnus dans /Library/Caches (macOS) ou %PROGRAMDATA% (Windows).
4. **Rotatez tous les secrets et identifiants** accédés depuis les machines de développement qui ont exécuté `npm install` pendant la fenêtre où les versions malveillantes étaient en ligne (~31 mars, 00:21–03:15 UTC).
5. **Vérifiez votre workflow de publication npm** — assurez-vous que votre projet utilise les OIDC Trusted Publishers pour que les publications manuelles basées sur tokens cassent la chaîne de signature.

## Pourquoi cette attaque n'était pas opportuniste

La sophistication opérationnelle ici est notable :

- L'attaquant a seedé un paquet décoy propre (plain-crypto-js@4.2.0) **18 heures avant** la release malveillante, établissant un historique de publication npm pour éviter les alertes de "paquet zero-history"
- Les deux branches de release 1.x et 0.x ont été touchées **39 minutes d'intervalle** pour maximiser la couverture
- Des payloads séparés ont été pré-construits pour **trois systèmes d'exploitation**
- L'URL C2 utilise des segments de chemin liés à la structure du chemin du registre npm — `packages.npm.org/product0/1/2` — rendant l'exfiltration ressemble à du trafic npm ordinaire
- Le dropper utilise le binaire osascript légitime d'Apple sur macOS — pas de binaire malveillant écrit sur le disque avant la validation, rendant la détection EDR plus difficile

C'est du savoir-faire d'attaque supply chain à un niveau précédemment réservé aux opérations sponsorisées par des États, maintenant déployé contre un paquet npm top-10.

---

*Sources : [StepSecurity](https://www.stepsecurity.io/blog/axios-compromised-on-npm-malicious-versions-drop-remote-access-trojan), métadonnées du registre npm, dépôt GitHub axios. L'avis de sécurité axios est disponible dans la [base de données des avis de sécurité npm](https://www.npmjs.com/advisories).*
