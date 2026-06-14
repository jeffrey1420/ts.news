---
title: "Node.js 26.3.0 : Buffer Pool double, permission.drop() arrive, les Macs Intel en péril"
description: "Node.js 26.3.0 apporte un Buffer.poolSize par défaut de 64 KiB, une méthode permission.drop() pour abandonner les capacités une par une, un avertissement sur les binaires universels macOS, et un WebCrypto renforcé. npm passe à 11.16.0."
date: 2026-06-03
image: "/images/heroes/2026-06-03--node-js-26-3-0-buffer-pool-permission-drop.png"
author: lschvn
tags: ["security", "runtimes", "typescript"]
tldr:
  - Le Buffer.poolSize par défaut passe de 32 à 64 KiB, réduisant la contention de l'allocateur dans les workloads HTTP et I/O intensifs
  - permission.drop() permet à un processus en cours d'exécution de renoncer à des permissions individuelles sans s'arrêter, ouvrant la voie à des modèles de privilège minimum
  - Le binaire universel macOS (Intel + Apple Silicon) pourrait ne plus être maintenu pendant toute la durée de vie de Node.js 26
  - WebCrypto est renforcé contre la pollution de prototype et gagne un mode CryptoJob ; npm est mis à jour en 11.16.0
faq:
  - question: "Pourquoi le Buffer.poolSize impacte-t-il les performances ?"
    answer: "Node utilise un allocateur slab en interne. Un pool plus grand signifie que moins de petites allocations sont servies directement depuis le tas, réduisant la fragmentation et le overhead syscall. Doubler la valeur par défaut de 32 à 64 KiB aide la plupart des serveurs HTTP sans configuration manuelle."
  - question: "Comment permission.drop() se distingue-t-il du modèle de permission existant ?"
    answer: "Auparavant, les permissions Node.js étaient tout-ou-rien au démarrage. permission.drop() permet à du code en cours d'exécution de renoncer à des permissions spécifiques : accès fichier, environnement, processus enfant, tout en conservant les autres. Cela permet de mettre en place une réduction progressive des privilèges, par exemple abandonner l'accès fs après une phase d'initialisation."
  - question: "Mon Mac Intel pourra-t-il toujours exécuter Node.js 26 ?"
    answer: "Oui, Node.js 26 livrera pour l'instant des binaires universels. L'avertissement signale que si Apple continue de déprécier le support de la toolchain x86, le projet Node.js pourrait abandonner les builds Intel avant que Node.js 26 n'atteigne sa fin de vie. Apple Silicon (arm64) est désormais Tier 1 ; Intel est Tier 2."
---

Node.js 26.3.0 est sorti le 1er juin 2026 sur la ligne Current. C'est une mise à jour mi-cycle substantielle : l'allocateur Buffer reçoit un ajustement significatif, le système de permissions expérimental gagne sa fonctionnalité la plus demandée, Apple signale une nouvelle étape vers l'abandon des Macs Intel, et l'équipe crypto applique un renforcement multi-PR sur WebCrypto.

## Buffer.poolSize double à 64 KiB

Le changement runtime le plus impactant est l'augmentation du `Buffer.poolSize` par défaut de 32 à 64 KiB, contribution de Matteo Collina ([#63597](https://github.com/nodejs/node/pull/63597)). L'allocateur slab interne de Node utilise ce pool pour les appels `Buffer.allocUnsafe()` et `Buffer.from()` qui restent sous le seuil. Un slab plus grand réduit la fréquence à laquelle l'allocateur doit demander de nouvelles pages mémoire à l'OS, diminuant la fragmentation et améliorant le débit pour les serveurs HTTP, les pipelines de streaming, et tout code allouant de nombreux buffers de petite à moyenne taille.

Ce changement n'est pas breaking, il affecte uniquement la valeur par défaut. Les applications peuvent toujours configurer `Buffer.poolSize` manuellement. Mais si vous avez des benchmarks qui mesurent l'allocateur lui-même, c'est le bon moment pour les relancer.

## permission.drop() pour la cession granulaire de privilèges

Rafael Gonzaga a contribué `permission.drop()` ([#62672](https://github.com/nodejs/node/pull/62672)), l'ajout le plus demandé au système de permissions expérimental de Node.js. Le modèle existant accordait les capacités au démarrage et les conservait pendant toute la durée de vie du processus. `permission.drop()` permet au code en cours d'exécution de renoncer aux handles de permission individuels, système de fichiers, environnement, processus enfant, sans s'arrêter. Cela permet des modèles tels que :

```javascript
// Après l'initialisation, abandonner l'accès au système de fichiers
permission.drop('fs');
// Seul l'accès réseau reste
```

Ce changement rapproche Node.js des modèles de sécurité basés sur les capacités et réduit le rayon d'action des attaques par chaîne d'approvisionnement ou injection où un module compromis perd sa mainmise sur le système de fichiers après la fin de l'initialisation.

## Avertissement binaire universel macOS

Le PR [#63055](https://github.com/nodejs/node/pull/63055) d'Antoine du Hamel documente formellement ce que le projet annonçait informellement : le binaire universel macOS, qui regroupe les deux slices Intel (x64) et Apple Silicon (arm64) dans un seul binaire, pourrait ne plus être maintenable pendant toute la durée de vie de Node.js 26. Apple a progressivement déconseillé le support de la toolchain Intel, et l'infrastructure de build de Node.js rencontre des difficultés à maintenir la slice x64 fonctionnelle. Les Macs Intel restent Tier 2 ; arm64 est Tier 1. C'est un avertissement, pas une suppression immédiate.

## Renforcement WebCrypto et npm 11.16.0

Filip Skokan a mené un effort multi-PR pour renforcer WebCrypto ([#63363](https://github.com/nodejs/node/pull/63363)). Les changements incluent :

- Les méthodes WebCrypto n'utilisent plus de wrappers `async` en interne, réduisant l'overhead
- Les handles CryptoKey sont passés directement aux jobs KDF au lieu d'être sérialisés et désérialisés
- Un nouveau mode CryptoJob aligne l'implémentation WebCrypto de Node avec la spec et améliore les performances
- L'implémentation est protégée contre les attaques par pollution de prototype ciblant les définitions de propriétés CryptoKey

npm est mis à jour en 11.16.0 ([#63602](https://github.com/nodejs/node/pull/63602)), incluant des corrections d'arborescence de dépendances et une résolution plus rapide. SQLite bundlé avec Node est mis à jour avec un cherry-pick corrigeant un risque de corruption mémoire ([#63525](https://github.com/nodejs/node/pull/63525)).

Le module `http` gagne une option `httpValidation` ([#61597](https://github.com/nodejs/node/pull/61597)) permettant aux serveurs de configurer la rigueur de validation des valeurs d'en-têtes entrants, avec un comportement permissif par défaut. L'API inspector gagne également un flag `preciseCoverageStart` ([#63079](https://github.com/nodejs/node/pull/63079)) pour une instrumentation de couverture de code plus précise.

Node.js 26.3.0 est la ligne Current (non-LTS). La transition LTS pour Node.js 26 est attendue avec Node.js 26.9.0 en septembre 2026.
