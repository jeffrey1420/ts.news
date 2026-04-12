---
title: "JetStream 3 : Le Benchmark Qui Reflète Enfin le Fonctionnement des Apps Web Modernes"
description: "WebKit, Google et Mozilla viennent de publier JetStream 3 — la première révision majeure du benchmark depuis 2019. Il abandonne les microbenchmarks au profit de workloads réalistes, refond le scoring WebAssembly, et introduit du Dart, Kotlin et Rust compilés en Wasm."
image: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&h=630&fit=crop"
date: "2026-04-12"
category: Standards
author: lschvn
readingTime: 6
tags: ["JetStream", "benchmark", "WebAssembly", "JavaScript", "WebKit", "navigateur", "performance", "Wasm"]
tldr:
  - "JetStream 3 remplace l'ancien scoring Wasm démarrage/runtime par un modèle unifié de cycle de vie, aligné sur le fonctionnement des benchmarks JavaScript — les moteurs optimisent désormais pour l'exécution complète, pas seulement la vitesse d'instantiation."
  - "Le benchmark inclut désormais 12 workloads WebAssembly en C++, C#, Dart, Java et Kotlin, couvrant WasmGC, SIMD et Exception Handling — reflétant bien mieux l'usage réel que les restes d'asm.js de 2019."
  - "L'équipe JavaScriptCore de WebKit a documenté une amélioration de 40 % sur WasmGC grâce à l'inlining des allocations GC directement dans le code machine généré et à la refonte des layouts d'objets pour éliminer la double allocation."
faq:
  - q: "Quelle est la différence entre JetStream 2 et JetStream 3 ?"
    a: "JetStream 2 datait de 2019. Son scoring WebAssembly utilisait deux phases distinctes — démarrage et exécution — qui sont devenues obsolètes à mesure que les moteurs s'amélioraient. JetStream 3 traite Wasm comme JavaScript : exécution du cycle complet sur plusieurs itérations capturant compilation initiale, à-coups et débit soutenu, le tout moyenné géométriquement."
  - q: "Pourquoi les trois moteurs de navigateur ont-ils collaboré ?"
    a: "Les benchmarks ne servent qu'à conduire de vraies optimisations s'ils sont crédibles. Un seul moteur publiant son propre benchmark serait partial. En mettant en commun l'expertise de WebKit (Safari), V8 (Chrome) et SpiderMonkey (Firefox), JetStream 3 a la légitimité pour influencer les trois moteurs — au bénéfice des développeurs sur chaque navigateur."
  - q: "Que sont WasmGC, SIMD et Exception Handling dans Wasm ?"
    a: "WasmGC ajoute une mémoire à ramasse-miettes (structures et tableaux) à WebAssembly, permettant à des langages comme Dart, Kotlin et Java de compiler vers Wasm avec des modèles d'allocation idiomatiques. SIMD (Single Instruction Multiple Data) permet à une instruction d'opérer sur plusieurs données en parallèle — essentiel pour les codecs, le traitement d'images et l'inférence ML. Exception Handling permet à Wasm de lever et rattraper des exceptions, correspondant au contrôle de flux de C++ et Java."
  - q: "Qu'est-ce que l'algorithme d'affichage de type de Cohen ?"
    a: "C'est une technique de vérification rapide de sous-type : chaque type stocke un tableau de taille fixe (le 'display') contenant des pointeurs vers tous les types ancêtres. Pour vérifier si le type A est un sous-type de B, le moteur regarde une entrée du display de A à la profondeur d'héritage de B et compare les pointeurs — O(1) plutôt que de parcourir une chaîne de parents. WebKit a intégré les six premières entrées directement dans l'enregistrement de type pour garder le cas commun dans une seule ligne de cache."
---

Les benchmarks ne sont utiles que s'ils conduisent à de vraies améliorations. Et un benchmark qui récompense les moteurs pour s'optimiser spécifiquement pour lui-même — plutôt que pour de vraies applications — devient contre-productif à terme.

C'est le problème central que JetStream 3 résout. Publié la semaine dernière par des ingénieurs de WebKit, Google et Mozilla, c'est la première révision majeure de la suite JetStream depuis 2019. Le web a considérablement changé en sept ans, et l'ancien benchmark commençait à montrer son âge de façons qui nuisaient finalement au progrès des performances.

## Le Piège du Microbenchmark

Le JetStream 2 original notait WebAssembly en deux phases : une mesure de démarrage en itération unique et une mesure d'exécution plus longue. L'idée était raisonnable à l'époque — les premiers adopteurs de Wasm compilaient de grosses applications C et C++ (jeux, codecs) où les utilisateurs toléraient un coût de démarrage ponctuel pour un débit soutenu.

Mais les moteurs sont devenus rapides. Vraiment rapides. WebKit a optimisé le chemin d'instantiation Wasm de manière si agressive que pour les workloads plus petits, le temps de démarrage atteignait effectivement zéro milliseconde. Et comme JetStream 2 utilisait `Date.now()` pour le chronométrage — qui arrondit par défaut — les temps sous-millisecondes étaient enregistrés comme 0ms. La formule de score `Score = 5000 / Temps` produisait alors l'infini.

L'équipe a corrigé cela en clampant le score à 5000, mais c'était un signal clair : la méthodologie du benchmark avait dépassé son sujet. Un score "infini" ne vous dit rien d'utile sur la façon dont un moteur gère de vraies charges. Et un temps de démarrage nul dans un microbenchmark ignore ce qui se passe *après* l'instantiation — le vrai travail que fait votre application.

## Un Scoring Unifié pour Wasm

JetStream 3 remplace le modèle divisé démarrage/runtime par la même méthodologie utilisée pour les benchmarks JavaScript. Chaque workload Wasm s'exécute maintenant sur plusieurs itérations, capturant :

- **Première itération** — compilation et configuration initiale
- **Itérations du cas pire** — à-coups, pauses GC et pics de tiering
- **Itérations du cas moyen** — débit soutenu

Le tout est moyenné géométriquement en un score de sous-test unique, qui alimente la moyenne géométrique du benchmark complet. Les moteurs sont maintenant incités à optimiser le *cycle de vie entier* d'une instance Wasm, pas seulement l'instantiation.

## Langages Réels, Chaînes d'outils Réelles

Les workloads Wasm de JetStream 3 sont compilés depuis cinq langages sources : C++, C#, Dart, Java et Kotlin. Cela reflète comment Wasm est réellement utilisé en production — pas seulement les moteurs de jeu C++, mais aussi Dart et Kotlin via WasmGC (utilisés par les frameworks web modernes comme Flutter), et Rust pour les modules critiques.

Les nouveaux workloads exercent des fonctionnalités Wasm à peine effleurées par JetStream 2 :

- **WasmGC** — allocations mémoire à ramasse-miettes (structures, tableaux) permettant des motifs idiomatiques des langages de haut niveau
- **SIMD** — une instruction, plusieurs données pour le traitement parallèle
- **Exception Handling** — levée et rattrape structurée d'exceptions

La couverture JavaScript a aussi été mise à jour : Promises et fonctions async, fonctionnalités RegExp modernes, champs de classe publics et privés. Plusieurs workloads asm.js ont été supprimés — la technologie a été supplantée par WebAssembly.

## L'Ingénierie Derrière les Gains de WebKit

L'équipe WebKit a publié une analyse détaillée de leurs optimisations JavaScriptCore pour JetStream 3. Les résultats sont substantiels :

**Inlining des allocations GC** : les programmes WasmGC créent des millions de petits objets. L'implémentation JSC originale appelait une fonction C++ pour chaque allocation. Deux changements ont livré ~40% d'amélioration sur les sous-tests WasmGC :

1. Changement du layout des objets pour que structures et tableaux stockent leurs données *inline* après l'en-tête dans une allocation unique, éliminant la deuxième allocation et l'indirection de pointeur
2. Inlining du chemin rapide d'allocation directement dans le code machine généré — une courte séquence d'instructions qui incrémente un pointeur, écrit l'en-tête et retourne sans quitter le code généré

**Inlining du display de type** : les langages WasmGC s'appuient fortement sur les vérifications de type runtime (casts, tests instanceof, appels de fonction indirects). WebKit a implémenté l'algorithme de display de type de Cohen et l'a inliné dans ses deux compilateurs — baseline (BBQ) et optimiseur (OMG). Ils ont aussi intégré les six premières entrées du display directement dans chaque enregistrement de type pour que les hiérarchies peu profondes nécessitent aucune indirection de pointeur et restent dans une seule ligne de cache.

**Élimination du coût des destructeurs GC** : précédemment, chaque objet WasmGC tenait une référence à sa définition de type et exécutait un destructeur lors de sa destruction — ce qui devait décrémenter le compteur de référence sous un verrou global. Restructurer l'information de type pour utiliser le mécanisme Structure existant du ramasse-miettes a éliminé les destructeurs entièrement, livrant encore ~40% sur le sous-test dart-flute-wasm.

## Pourquoi Cela Compte pour les Développeurs JavaScript

Les benchmarks de navigateur ressemblent à de la trivia pour ingénieurs de navigateur, mais ils ont des conséquences pratiques directes. Quand les moteurs s'optimisent pour des benchmarks, toutes les applications web bénéficient — les optimisations sont réelles, les workloads ne sont qu'un proxy.

Le déplacement de JetStream 3 des microbenchmarks vers des workloads plus grands et plus longs signifie que les optimisations poursuivies par les moteurs seront celles qui comptent en production. Une amélioration de 40% sur un sous-test WasmGC signifie que les apps web Flutter, les outils Kotlin-vers-Wasm et toute application utilisant Wasm pour des tâches coûteuses tourneront plus vite dans Safari.

La collaboration entre les trois moteurs majeurs est aussi notable. JetStream 3 utilise un modèle de gouvernance ouvert, avec des contributions regroupées dans un dépôt GitHub partagé. L'objectif est un benchmark que tous les moteurs ont intérêt à optimiser honnêtement — ce qui le rend finalement utile aux développeurs.

JetStream 3 est disponible sur [browserbench.org](https://browserbench.org/JetStream3.0/).
