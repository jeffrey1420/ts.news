---
title: "TypeScript 6.0, Dernière Version Avant la Réécriture en Go"
description: "TypeScript 6.0 est disponible — et l'équipe Microsoft est claire : c'est une version de transition. La vraie histoire, c'est ce qui vient ensuite : TypeScript 7, écrit en Go et déjà disponible en preview, promet un gain de performance de 10x."
date: "2026-04-06"
image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&h=630&fit=crop"
author: lschvn
tags: ["typescript", "javascript", "microsoft", "compiler", "performance"]
---

TypeScript 6.0 est sorti le 23 mars 2026, et l'équipe Microsoft ne cache rien : c'est une version de transition. TypeScript 6.0 ouvre la voie à TypeScript 7 — une réécriture complète du compilateur et du langage de service en Go, avec un gain de performance de 10x déjà vérifié dans les builds preview.

## Ce qui change réellement dans la 6.0

La plupart des changements sont liés à l'alignement avec le comportement de TypeScript 7, mais plusieurs améliorations concrètes ont atterri dans cette version.

**Moins de sensibilité au contexte pour les fonctions sans `this`.** TypeScript 6.0 corrige un problème d'inférence de type récurrent quand les méthodes et callbacks n'utilisent pas `this`. Auparavant, une méthode comme `consume(y) { return y.toFixed(); }` pouvait échouer si une autre propriété précédait la sienne — car TypeScript supposait que `this` pouvait avoir besoin du type générique. Désormais, si `this` n'est jamais utilisé, TypeScript ignore le contrôle de sensibilité contextuelle et l'inférence fonctionne correctement quel que soit l'ordre des propriétés. Cette correction a été contribué par Mateusz Burzyński.

**Les importations de sous-chemins supportent maintenant le préfixe `#/`.** Node.js a ajouté le support de `#/` comme préfixe d'importation de sous-chemin nu (au lieu de `#root/` ou similaire). TypeScript 6.0 supporte ceci via `--moduleResolution nodenext` et `bundler`. Fini les contournements maladroits pour des importations internes propres.

**`--moduleResolution bundler` + `--module commonjs` est maintenant valide.** Auparavant cette combinaison était rejetée. Avec `--moduleResolution node` déprécié, la combinaison `bundler` + `commonjs` est désormais le chemin de migration recommandé pour de nombreux projets.

**Drapeau `--stableTypeOrdering`.** TypeScript 7 utilise la vérification de type parallèle, ce qui attribue des IDs de type internes différemment selon l'ordre de traitement. Cela peut causer des divergences dans les fichiers de déclaration entre la 6.0 et la 7.0. Le nouveau drapeau force un ordonnancement déterministe dans la 6.0 pour faciliter le repérage des différences pendant la migration. Note : cela peut ajouter jusqu'à 25% de slowdown, donc c'est un outil de migration, pas un paramètre permanent.

**`es2025` target et lib.** TypeScript 6.0 ajoute `es2025` comme option valide pour target et lib, incluant les nouveaux types pour `RegExp.escape`.

**Syntaxe d'assertion d'import dépréciée dans les appels `import()`.** La syntaxe `import(..., { assert: {...}})` est désormais dépréciée au même titre que la forme statique `import ... assert {...}`.

## Le vrai titre : TypeScript 7 est proche

TypeScript 6.0 existe principalement pour préparer l'écosystème à la 7.0. La réécriture en Go — nom de code "Project Corsa" — est en cours depuis début 2025. La preview native (`@typescript/native-preview` sur npm) est déjà suffisamment stable pour une utilisation quotidienne, et une extension VS Code est mise à jour chaque nuit.

Le langage de service (complétions, go-to-definition, rename, find-all-references) est déjà pleinement fonctionnel dans le port natif. La vérification de type du compilateur est décrite comme "quasi complète" — sur 20 000 cas de test, seulement 74 montrent des différences entre la 6.0 et la preview 7.0. Le parallélisme via la mémoire partagée est la victoire architecturale clé, permettant des gains de vitesse spectaculaires sur les grands monorepos.

Si vous êtes sur TypeScript 6.0 aujourd'hui, l'équipe vous encourage à essayer aussi la preview TypeScript 7. Les deux peuvent fonctionner côte à côte via `tsgo` (7.0) et `tsc` (6.0).

## FAQ

**TypeScript 6.0 est-il un changement cassant ?**
Pas significativement. La plupart des changements sont additifs ou des alignements comportementaux avec la 7.0. Le drapeau `--stableTypeOrdering` est nouveau, et la dépréciation de l'assertion d'import est un changement au niveau avertissement.

**Dois-je migrer de la 5.x à la 6.0 ?**
Oui, surtout si vous vous préparez au port natif 7.0. Le chemin de migration de la 6.0 à la 7.0 devrait être fluide.

**Comment essayer TypeScript 7 ?**
```bash
npm install -D @typescript/native-preview
# utiliser tsgo au lieu de tsc
npx tsgo build
```
Ou installez l'extension VS Code "TypeScript 7 (native preview)" depuis le marketplace.
