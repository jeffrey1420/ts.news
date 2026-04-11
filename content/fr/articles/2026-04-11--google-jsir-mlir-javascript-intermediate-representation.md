---
title: "JSIR de Google : une représentation intermédiaire basée sur MLIR pour l'analyse JavaScript"
description: "Google a open source JSIR, un nouvel outil d'analyse JavaScript basé sur MLIR. Il supporte à la fois l'analyse de flux de données de haut niveau et la transformation source-à-source sans perte — utilisé en interne pour la décompilation du bytecode Hermes et la désobfuscation JavaScript assistée par IA."
image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=630&fit=crop"
date: "2026-04-11"
category: Open Source
author: lschvn
readingTime: 5
tags: ["Google", "JSIR", "MLIR", "JavaScript", "outillage", "analyse", "décompilation", "open source"]
tldr:
  - "JSIR est la nouvelle représentation intermédiaire de Google basée sur MLIR pour JavaScript, conçue pour supporter simultanément l'analyse de flux de données de haut niveau et la transformation source-à-source — une combinaison que les IR existantes sacrifient généralement."
  - "Google utilise déjà JSIR en interne pour la décompilation du bytecode Hermes et la désobfuscation JavaScript par IA, où il combine Gemini LLM avec JSIR pour inverser le code obfusqué."
  - "Le projet s'adresse aux développeurs d'outils : meilleurs linters, bundlers plus intelligents, outils de refactoring plus puissants — pas directement aux développeurs finaux, mais l'écosystème en ressentira l'impact en aval."
faq:
  - q: "Qu'est-ce qui différencie JSIR des autres IR JavaScript ?"
    a: "La plupart des IR pour JavaScript doivent choisir entre être de haut niveau (préservant assez de structure pour reconstruire la source) ou de bas niveau (permettant une analyse de flux profonde). JSIR utilise les régions MLIR pour modéliser précisément le flux de contrôle de JavaScript — fermetures, try-catch-finally, fonctions async, générateurs — d'une manière qui supporte les deux simultanément."
  - q: "Qu'est-ce que MLIR ?"
    a: "MLIR (Multi-Level Intermediate Representation) est un projet LLVM qui fournit un framework flexible de représentation intermédiaire. Il est conçu pour unifier différentes IR dans l'infrastructure des compilateurs. En construisant JSIR sur MLIR, Google gagne la compatibilité avec l'écosystème et les outils LLVM plus larges."
  - q: "Qu'est-ce que le bytecode Hermes ?"
    a: "Hermes est le moteur JavaScript de Facebook optimisé pour React Native. Il compile JavaScript en bytecode Hermes pour des temps de démarrage plus rapides. JSIR peut décompiler ce bytecode retour en JavaScript en exploitant sa capacité à être remonté à la source — une capacité que les outils existants n'ont pas."
  - q: "Comment JSIR permet-il la désobfuscation par IA ?"
    a: "Google a publié des recherches (article CASCADE, arXiv:2507.17691) montrant comment ils combinent Gemini LLM avec JSIR pour la désobfuscation JavaScript. La représentation structurée de JSIR fournit à l'IA une vue clean et analysable du code obfusqué, et l'IA peut générer des transformations que JSIR applique retour à la source."
---

Quand une représentation intermédiaire de compilateur fait la une, c'est que ça compte. Google a publié [JSIR](https://github.com/google/jsir), un outil d'analyse JavaScript nouvelle génération basé sur [MLIR](https://mlir.llvm.org), et il est déjà utilisé en interne pour des tâches qui révèlent toute l'ambition du projet : décompiler le bytecode Hermes vers JavaScript et alimenter des pipelines de désobfuscation assistée par IA combinant JSIR avec Gemini.

## Pourquoi c'est important pour l'outillage

Une représentation intermédiaire est la structure de données qu'un compilateur ou un outil d'analyse utilise pour représenter le code entre le parsing et la génération de code. Si un AST vous dit à quoi ressemble le code结构llement, une IR vous dit ce qu'il *fait*. La qualité de votre IR détermine le type d'analyse et de transformation que vous pouvez effectuer.

L'outillage JavaScript a longtemps souffert d'approches fragmentées des IR. Les plugins Babel travaillent sur des AST. Les règles ESLint travaillent sur des AST. Les bundlers travaillent souvent sur leurs propres représentations internes avec une interopérabilité limitée. Une IR commune et bien conçue pourrait permettre à ces outils de partager le travail d'analyse — et c'est exactement ce que Google propose avec JSIR.

## Haut niveau et bas niveau simultanément

Le défi technique central que JSIR résout est un classique du design de compilateurs : vous devez généralement choisir entre une IR de haut niveau (préserve la structure AST, peut être remontée à la source) et une IR de bas niveau (permet une analyse de flux profonde comme le suivi de taint et la propagation de constantes). La plupart des systèmes choisissent un.

JSIR utilise les régions MLIR pour modéliser précisément les structures de flux de contrôle de JavaScript — fermetures, try-catch-finally, fonctions async, cadres générateurs — d'une manière qui supporte les deux directions simultanément. Vous pouvez transformer le code et le remonter à la source, ou exécuter une analyse de taint sur la même représentation.

Cela ouvre des cas d'usage précédemment impraticables :

**Décompilation** : JSIR est utilisé chez Google pour décompiler le bytecode Hermes jusqu'au JavaScript. Hermes compile les apps React Native vers un bytecode compact pour des démarrages plus rapides ; la capacité de remontée à la source de JSIR est ce qui rend cette décompilation possible quand d'autres outils heurteraient un mur.

**Désobfuscation** : Google a publié des recherches ([CASCADE](https://arxiv.org/abs/2507.17691)) sur la combinaison de Gemini LLM avec JSIR pour la désobfuscation JavaScript. L'IA opère sur la représentation structurée de JSIR plutôt que sur la source obfusquée brute, produisant des transformations que JSIR applique pour reconstruire du code propre.

## La Fondation MLIR

JSIR n'est pas un projet autonome — il est construit sur MLIR, le framework IR flexible du projet LLVM. C'est significatif pour la compatibilité avec l'écosystème : MLIR a déjà un large ensemble de dialectes, transformations et outils existants. En exprimant l'analyse JavaScript en termes MLIR, JSIR peut se brancher sur cet écosystème plutôt que de réinventer l'infrastructure.

## Pour Commencer

JSIR est disponible sur GitHub à [github.com/google/jsir](https://github.com/google/google/tree/main/jsir). Le projet recommande d'utiliser Docker pour l'expérimentation locale :

```bash
docker build -t jsir:latest .
docker run --rm -v $(pwd):/workspace jsir:latest jsir_gen --input_file=/workspace/yourfile.js
```

Compiler depuis les sources requiert clang, Bazel, et un temps de build significatif — le projet note que la récupération et la compilation de LLVM prend du temps. Le chemin Docker est le point d'entrée pratique pour la plupart des développeurs.

## Ce Que Ça Signifie pour l'Écosystème

La plupart des développeurs n'interagiront pas directement avec JSIR dans un avenir proche — c'est une fondation pour que les développeurs d'outils buildent dessus. Mais les implications à long terme sont significatives. Une IR partagée et bien conçue pourrait permettre :

- Des linters avec une compréhension sémantique plus profonde (pas juste de la correspondance de patterns sur des nœuds AST)
- Des bundlers avec une meilleure élimination de code mort utilisant l'analyse de flux
- Des outils de refactoring qui peuvent transformer le code en toute sécurité à travers un flux de contrôle complexe
- Une analyse cross-framework qui fonctionne de manière cohérente quel que soit le framework ou l'outil de build utilisé

Google l'a open source, ce qui signifie que la communauté peut build sur cette fondation. Que ça gagne en traction dépend de si les mainteneurs d'outils voient assez d'avantages pour intégrer l'analyse basée sur JSIR dans leurs pipelines — mais la fondation technique est solide.
