---
title: "Turborepo Est 96% Plus Rapide — L'Expérience AI Agents Chez Vercel"
description: "Les ingénieurs de Vercel ont utilisé des agents de coding IA pour optimiser la base de code Rust de Turborepo, atteignant 81 à 96% de réduction du temps de calcul du graphe de tâches. Voici le processus, les gains et les limites rencontrées."
date: "2026-04-14"
image: "https://opengraph.githubassets.com/vercel/turborepo"
category: Outillage
author: lschvn
readingTime: 5
tags: ["turborepo", "vercel", "monorepo", "build-tools", "rust", "ai-agents"]
tldr:
  - "Le calcul du graphe de tâches de Turborepo est désormais 81 à 96% plus rapide selon la taille du dépôt, après une semaine d'optimisation Rust assistée par IA."
  - "L'équipe Vercel a combiné des agents IA avec des formats de profilage Markdown lisibles par LLMs — les stack traces en texte brut ont considérablement amélioré la qualité des suggestions des agents."
  - "Les gains les plus importants viennent de la parallélisation (opérations git, glob et lockfile simultanées), de l'élimination des allocations redondantes et du regroupement des opérations syscalls lourdes."
faq:
  - q: "Les agents IA peuvent-ils remplacer les ingénieurs humains pour le travail de performance ?"
    a: "Non — les ingénieurs Vercel ont constaté que les agents se focalisaient sur des microbenchmarks, produisaient des améliorations trompeuses et n'écrivaient jamais de tests de régression. Le jugement humain est resté essentiel pour la validation."
  - q: "Qu'est-ce qui a rendu l'approche de profilage plus efficace pour les agents ?"
    a: "Le format JSON standard Chrome Trace était difficile à parser pour les agents. Passer à un format de profil Markdown — trié par temps propre, greppable, entrées sur une seule ligne — a produit des suggestions d'optimisation nettement meilleures."
  - q: "Qu'est-ce qui a exactement accéléré dans Turborepo ?"
    a: "L'implémentation Rust a été optimisée selon trois axes : la parallélisation des opérations séquentielles, l'élimination des allocations et clones redondants, et le regroupement des opérations git lourdes en syscalls via des bibliothèques plus rapides comme gix-index."
---

Les ingénieurs de Vercel ont passé une semaine en mars 2026 à utiliser des agents de coding IA pour optimiser le planificateur de tâches Rust de Turborepo. Le résultat : le calcul du graphe de tâches est désormais **81 à 96% plus rapide**, selon la taille du dépôt. Sur un monorepo de 1 000 paquets, `turbo run` est passé de 10 secondes de surcharge à une sensation quasi instantanée. Le compte-rendu mérite d'être lu pour tous ceux qui travaillent sur des outils JavaScript haute performance.

## Commencer Avec des Agents Non Supervisés

L'expérience a commencé avec huit agents de coding en arrière-plan, chacun ciblant une zone différente de la base de code Rust. Chaque agent recevait un objectif vague — trouver des problèmes de performance — sans guidance détaillée. Le lendemain matin, trois avaient produit des résultats exploitables : une réduction de 25% du temps réel en passant au hachage par référence, un gain de 6% grâce au remplacement de la crate `twox-hash` par `xxhash-rust`, et un nettoyage d'un algorithme de Floyd-Warshall devenu inutile.

Mais les ingénieurs ont rapidement identifié un schéma : **les agents produisaient des microbenchmarks impressionnants qui ne se traduisaient pas en gains réels**. Un agent a produit une « amélioration de 97% » sur un microbenchmark qui ne représentait que 0,02% en pratique. Les agents n'écrivaient jamais de tests de régression. Ils n'utilisaient jamais le flag `--profile`. Et surtout, ils effectuaient leurs tests sur des cibles synthétiques plutôt que sur la base de code Turborepo réelle.

## Le Problème du Profilage

Lorsque l'équipe a essayé d'utiliser les profils JSON Chrome Trace standard avec les agents, les résultats étaient médiocres. Les noms de fonctions coupés sur plusieurs lignes, des métadonnées non pertinentes mélangées aux données de timing, impossibles à grepper. Les agents se débattaient avec ces fichiers de la même façon qu'un humain — mal.

La percée est venue de l'observation que Bun avait introduit un flag `--cpu-prof-md` qui génère des profils en Markdown. L'équipe Vercel a créé une crate `turborepo-profile-md` qui génère des fichiers `.md` compagnons à côté de chaque trace : fonctions chaudes triées par temps propre, arbres d'appels par temps total, relations appelant/appelé — tout greppable, tout sur des lignes uniques.

La différence fut immédiate. Même modèle, même base de code, même harnais. Juste un format différent. Les agents produisaient soudain des suggestions d'optimisation dramatiquement meilleures.

## Ce Qui a Vraiment Accéléré

La boucle d'itération guidée par humain — profiler, identifier les points chauds, proposer, implémenter, valider avec hyperfine — a tourné pendant quatre jours et a produit plus de 20 PRs. Les gains se sont répartis en trois catégories :

**Parallélisation.** La construction de l'index git, la marche dans le système de fichiers pour les correspondances glob, l'analyse des lockfiles et le chargement des `package.json` étaient tous séquentiels. Ils sont maintenant concurrents. Les gains étaient les plus importants pour les dépôts avec de nombreux paquets.

**Élimination des allocations.** Le pipeline clonait des HashMaps entières quand des références auraient suffi. Les filtres d'exclusion glob étaient recompilés à chaque appel au lieu d'être précompilés. Chaque client HTTP était construit par requête au lieu d'être réutilisé. Ces petites copies s'accumulaient.

**Réduction des syscalls.** Les appels git subprocess par paquet ont été regroupés en un seul index global. Ensuite, les subprocesses git ont été remplacés par `libgit2`, lui-même remplacé par `gix-index` — une implémentation pure Rust plus rapide.

## La Limite : 85% Comme Plafond

À 85% plus rapide, les progrès se sont arrêtés. Les gains restants se situaient dans le bruit de mesure sur les MacBooks des ingénieurs. L'équipe soupçonne que le problème venait de la méthodologie de benchmark plutôt que du code lui-même — plus les opérations s'accélèrent, plus la variance du bruit système (I/O disque, ordonnancement CPU) submerge le signal.

La leçon : **votre code source est la meilleure boucle de rétroaction**. Les agents qui avaient précédemment écrit du code médiocre produisaient, dans des sessions ultérieures, un meilleur code — non pas parce que le modèle avait changé, mais parce que les améliorations fusionnées étaient désormais visibles dans la base de code et que les agents les suivaient. Le contexte, il s'avère, reste l'ingrédient clé.

## Ce Que Cela Signifie Pour l'Écosystème JavaScript

Turborepo est une infrastructure fondamentale pour une grande partie du monde des monorepos JavaScript. Les améliorations de vitesse ici se cumulent sur chaque `turbo run build`, `turbo run test` et `turbo run lint` dans chaque dépôt qui en dépend. Le fait que l'optimisation ait été pilotée par des agents IA — mais validée par des humains — est une image réaliste de où en est le développement assisté par IA en 2026 : un accélérateur puissant pour trouver des victoires, encore dépendant du jugement humain pour séparer le signal du bruit.

Le format de profilage Markdown est déjà discuté comme un standard potentiel pour la sortie de performance lisible par LLM dans les projets d'outils Rust.
