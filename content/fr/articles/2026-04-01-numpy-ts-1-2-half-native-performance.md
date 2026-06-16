---
title: "numpy-ts 1.2 : parité RNG bit à bit avec NumPy et support Float16 en pur TypeScript"
description: "L'implémentation NumPy en pur TypeScript atteint un jalon de correction : la génération de nombres aléatoires correspond désormais bit à bit à NumPy, Float16 arrive comme dtype de première classe, et le package n'a plus besoin d'entrées par runtime."
date: 2026-04-01
image: "/images/heroes/2026-04-01-numpy-ts-1-2-half-native-performance.png"
author: lschvn
tags: ["typescript", "performance", "javascript"]
faq:
  - question: "Qu'est-ce que numpy-ts ?"
    answer: "numpy-ts est une implémentation en pur TypeScript de l'API NumPy, créée par Nico Dupont, conçue pour tourner dans les navigateurs, Node.js, Bun et Deno sans dépendances natives. Elle couvre environ 94 % de la surface d'API de NumPy (476 fonctions sur 507) et valide ses sorties contre NumPy lui-même avec plus de 6 000 tests."
  - question: "Quelle est sa vitesse comparée au vrai NumPy ?"
    answer: "Plus lent, l'auteur mesure environ 15x plus lent que NumPy natif en moyenne, ce qui est attendu pour du pur JavaScript face à du C/BLAS. La feuille de route d'optimisation prévoit des améliorations algorithmiques et du WebAssembly ciblé. Pour le préprocessing, les statistiques et les outils navigateur interactifs, c'est généralement suffisant ; pour du calcul intensif, NumPy natif gagne confortablement."
  - question: "Que signifie la parité RNG bit à bit et pourquoi est-ce important ?"
    answer: "Avec la même graine, numpy-ts 1.2 produit exactement la même séquence de nombres aléatoires que NumPy, pas statistiquement similaire, identique. C'est essentiel pour reproduire des expériences, porter des fixtures de test, et valider un portage TypeScript de code Python contre sa sortie de référence."
  - question: "Puis-je utiliser numpy-ts pour entraîner des modèles de machine learning ?"
    answer: "numpy-ts est conçu pour le calcul numérique général et les tâches proches de l'inférence, pas l'entraînement. Pour l'entraînement ML dans le navigateur, regardez les projets basés WebGPU comme JAX.js. Mais pour le préprocessing de données, les pipelines de visualisation et les opérations statistiques, numpy-ts est bien adapté."
tldr:
  - "numpy-ts 1.2 génère des séquences aléatoires identiques bit à bit à NumPy à partir de la même graine, les versions précédentes divergeaient après les premières valeurs."
  - "Float16 (demi-précision) arrive comme dtype de première classe, alors que JavaScript n'a pas de float16 natif, utile pour les workflows proches du ML et le traitement du signal."
  - "Un seul point d'entrée fonctionne désormais sur Node.js, Bun, Deno et navigateurs ; les imports par runtime ont disparu."
  - "Avec ~94 % de couverture d'API validée contre NumPy lui-même, numpy-ts est le portage NumPy le plus complet de l'écosystème JavaScript. Il n'est pas rapide (~15x plus lent que NumPy natif), il est compatible, et c'est le but."
---

[numpy-ts](https://numpyts.dev), l'implémentation NumPy la plus complète écrite entièrement en TypeScript, publie sa version 1.2, et le titre n'est pas la vitesse. C'est quelque chose de plus strict : **avec la même graine, numpy-ts produit désormais exactement les mêmes nombres aléatoires que NumPy, bit à bit.** En parallèle, la release ajoute le support **Float16** de première classe et fusionne les points d'entrée par runtime en un seul package qui fonctionne partout.

## Le problème que numpy-ts veut résoudre

NumPy est le standard de fait du calcul sur tableaux en Python, algèbre linéaire, traitement du signal, préprocessing pour le machine learning. Amener cette API en TypeScript a un intérêt évident pour les outils web, les notebooks et les applications de données dans le navigateur.

La difficulté n'a jamais été la surface d'API ; c'est de reproduire le *comportement* de NumPy. numpy-ts aborde le problème en validant directement contre NumPy : plus de 6 000 tests comparent ses sorties avec l'original, sur l'arithmétique, la FFT, l'algèbre linéaire et les distributions aléatoires. La couverture atteint environ **94 % de l'API NumPy**, 476 fonctions sur 507, ce qui en fait de loin le portage le plus complet de l'écosystème JavaScript.

## L'histoire du RNG : identique, pas similaire

Avant la 1.2, numpy-ts utilisait des approximations de la génération aléatoire de NumPy, suffisant pour un usage occasionnel, mais les séquences divergeaient de NumPy après les premières valeurs. Pour du travail scientifique, c'est disqualifiant : impossible de reproduire l'expérience d'un papier, de porter une fixture de test, ou de vérifier une migration si `seed(42)` donne des nombres différents.

La version 1.2 réimplémente les générateurs pour correspondre à NumPy **bit à bit** :

```typescript
import { random } from 'numpy-ts';

const rng = random.default_rng(42);
rng.random(3);
// [0.7739560485559633, 0.4388784397520523, 0.8585979199113825]
//, exactement les trois nombres que NumPy affiche pour default_rng(42)
```

Si vous portez un pipeline NumPy et que vos tests vérifient des données aléatoires avec graine, ces fixtures se transfèrent désormais sans modification.

## Float16, sans support natif

Float16 (demi-précision) utilise 16 bits par nombre et fait partie du paysage de l'inférence GPU depuis des années, la bande passante mémoire est généralement le goulot d'étranglement, et la demi-précision suffit souvent. JavaScript n'a pas de type float16 natif, donc numpy-ts implémente lui-même la conversion et le stockage, aux côtés de Float32, Float64, des dtypes entiers et des nombres complexes.

## Un package, tous les runtimes

Jusqu'ici, chaque runtime demandait son point d'entrée, un import pour Node, un autre pour les navigateurs. La 1.2 les unifie : un package au comportement identique sur [Node.js](/articles/2026-04-12-nodejs-25-stream-iter-async-streams), [Bun](/articles/2026-04-19-bun-joins-anthropic-ai-coding-infrastructure), [Deno](/articles/2026-04-07-deno-2-7-stabilizes-temporal-api-windows-arm-npm-overrides) et navigateurs, pour environ 93 kB minifié et gzippé, sans aucune dépendance.

## Alors, c'est rapide ou pas ?

C'est le point sur lequel il faut être précis : numpy-ts n'est **pas** proche des performances de NumPy natif, et son auteur ne prétend pas le contraire. NumPy tire sa vitesse de décennies de C, BLAS et LAPACK ; une implémentation en pur TypeScript tourne en moyenne environ **15x plus lentement**. La feuille de route vise des optimisations algorithmiques et du WebAssembly ciblé sur les chemins chauds.

![Le vrai tableau des performances : NumPy natif vs numpy-ts](/images/charts/numpy-ts-performance.png)

En pratique, l'écart compte moins qu'il n'y paraît pour les cas d'usage réels de la bibliothèque, nettoyer un dataset dans un outil navigateur, calculer des statistiques descriptives, faire une petite opération matricielle dans une visualisation. Il compte beaucoup si vous tentez du vrai calcul numérique sur de grands tableaux. Sachez dans quel cas vous êtes.

## Compatibilité d'API avec NumPy

L'objectif du projet est la compatibilité d'API, pas seulement les concepts, et le [guide de migration](https://numpyts.dev) montre les traductions côte à côte. La plupart du code se transpose directement :

```python
import numpy as np

a = np.array([[1, 2], [3, 4]])
b = np.linalg.inv(a)
c = np.dot(a, b)
d = np.sum(a, axis=0)
```

```typescript
import { array, linalg, dot, sum } from 'numpy-ts';

const a = array([[1, 2], [3, 4]]);
const b = linalg.inv(a);
const c = dot(a, b);
const d = sum(a, { axis: 0 });
```

## Pour commencer

```bash
npm install numpy-ts
```

Aucune dépendance runtime, fonctionne sur Node.js (CommonJS et ESM) et navigateurs modernes. La documentation complète, le guide de migration et la référence d'API sont sur [numpyts.dev](https://numpyts.dev), avec les sources sur [github.com/dupontcyborg/numpy-ts](https://github.com/dupontcyborg/numpy-ts).
