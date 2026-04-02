---
title: "Le Changement Silencieux de GitHub Copilot : Votre Code Entrainera Leurs Modèles — Sauf si Vous Vous Y Opposez"
description: "À partir du 24 avril 2026, GitHub utilisera les données d'interaction des utilisateurs Free, Pro et Pro+ de Copilot pour entraîner des modèles IA — sauf opposition manuelle. Les offres Business et Enterprise ne sont pas concernées."
date: 2026-04-02
image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&h=630&fit=crop"
author: lschvn
tags: ["GitHub", "Copilot", "IA", "vie privée", "machine learning", "open source"]
readingTime: 5
tldr:
  - "À partir du 24 avril, GitHub utilisera les données d'interaction Copilot Free/Pro/Pro+ (entrées, sorties, extraits de code, contexte) pour entraîner des modèles IA par défaut — sauf opposition."
  - "Les utilisateurs Copilot Business et Enterprise, ainsi que ceux ayant déjà refusé, ne sont pas concernés. Le changement vise les abonnés individuels sur tous les plans payants."
  - "L'option de refus se trouve dans les paramètres GitHub, section Copilot, onglet Confidentialité. Si vous ne la modifiez pas, vos données de code améliorent Copilot pour tous."
---

Le 25 mars 2026, GitHub a discrètement mis à jour sa politique concernant les données d'interaction Copilot. En résumé : **sauf opposition active de votre part, votre activité de coding sur les plans Free, Pro et Pro+ sera utilisée pour entraîner les futurs modèles IA à partir du 24 avril**.

## Quelles Données Sont Collectées

Si vous restez inscrit :

- Les extraits de code que vous tapez et validez via les suggestions Copilot
- Les entrées envoyées à Copilot, y compris le contexte des fichiers environnants
- La structure des dépôts, noms de fichiers et motifs de navigation
- Les signaux de feedback comme les pouces levés/baissés
- Les conversations chat et les interactions avec les suggestions inline

GitHub exclut explicitement les données des offres Business, Enterprise et des dépôts appartenant à des entreprises. Si vous êtes sur un plan d'équipe, votre travail est protégé.

## Pourquoi Maintenant

GitHub indique avoir déjà observé des "améliorations significatives" après avoir intégré les données d'interaction des employés Microsoft : des taux d'acceptation plus élevés dans plusieurs langages. L'entreprise présente cela comme une pratique industrielle standard et défend un compromis qualité : contribuez vos motifs de code, recevez de meilleures suggestions.

Le contexte compte. Copilot fait face à une réelle concurrence de Claude Code, Cursor et des outils IA de JetBrains. Entraîner sur les données utilisateurs est un moyen de combler le gap sans augmenter les prix.

## Comment S'y Opposer

Si vous préférez ne pas contribuer :

1. Allez dans **GitHub Settings → Copilot** (ou directement sur `github.com/settings/copilot`)
2. Trouvez la section **"Confidentialité"**
3. Désactivez l'option d'entraînement des modèles

Si vous aviez déjà ce paramètre désactivé, votre préférence est automatiquement conservée.

## Le Contexte Plus Large

C'est un schéma familier à l'ère de l'IA : accès gratuit ou peu coûteux en échange de données. La différence ici est que les développeurs — naturellement soucieux de la vie privée — sont le produit. Les extraits de code peuvent révéler des logiques propriétaires, des conceptions d'API internes et des implémentations spécifiques à une entreprise.

Plusieurs mainteneurs open source ont déjà exprimé leurs inquiétudes. Le code déposé sur des dépôts publics GitHub est déjà scrapé pour l'entraînement ; cette politique étend cette dynamique aux dépôts privés utilisés via Copilot.

L'option de refus est disponible aujourd'hui. Que vous considériez cela comme un échange équitable pour un meilleur autocomplete est une question de jugement — mais sachez que le compte à rebours a commencé.

---

*Suivez l'actualité quotidienne de l'écosystème TypeScript et JavaScript sur [ts.news](/).*
