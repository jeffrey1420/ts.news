---
title: "Le problème de l'alignement vertical en CSS est enfin résolu : text-box-trim et margin-block"
description: "Pendant des décennies, le centrage vertical du texte dans les boutons, les badges et les mises en page semblait légèrement décalé. Le coupable : l'espace de tête, un remplissage invisible intégré dans les métriques de chaque police. Deux propriétés CSS le résolvent désormais à différents niveaux : text-box-trim pour le texte en ligne, et margin-block avec les unités cap/lh pour les mises en page en bloc."
date: 2026-04-13
image: "/images/heroes/2026-04-13--css-text-box-trim-margin-block-vertical-center.png"
author: lschvn
tags: ["css", "javascript"]
readingTime: 7
tldr:
  - "Le texte ne se centre jamais vraiment en CSS, car les navigateurs s'alignent sur la zone de line-height, pas sur les lettres visuelles. L'espace de tête (un remplissage invisible au-dessus et en dessous de la hauteur des capitales) décale chaque bouton, badge et titre."
  - "text-box-trim (expérimental) supprime directement l'espace de tête du texte en ligne, associé à text-box-edge pour spécifier la métrique de police à utiliser comme frontière."
  - "margin-block: calc(0.5cap - 0.5lh) obtient le même effet avec une bien meilleure compatibilité navigateur, en utilisant des unités relatives à la police qui fonctionnent en production dès aujourd'hui."
faq:
  - question: "Pourquoi le texte semble-t-il décalé verticalement même quand le CSS dit le contraire ?"
    answer: "Parce que les navigateurs alignent le texte sur la zone de line-height, pas sur les lettres visuelles. Les polices incluent un « espace de tête » invisible au-dessus de la hauteur des capitales et sous la ligne de base. Une police de 16px avec un line-height de 1,5 alloue 24px d'espace vertical, mais les lettres elles-mêmes n'occupent qu'environ 11px. Cette différence de 6 à 7px par ligne est ce qui fait paraître le texte mal aligné dans les boutons et les badges."
  - question: "Qu'est-ce que text-box-trim ?"
    answer: "Une propriété CSS expérimentale qui supprime l'espace de tête du texte en ligne. Utilisez text-box-trim: trim-both pour retirer l'espace au-dessus et en dessous des lettres visuelles, combinée avec text-box-edge: cap alphabetic pour rogner depuis la hauteur des capitales jusqu'à la ligne de base alphabétique. La prise en charge par les navigateurs est limitée aux versions de pointe."
  - question: "Comment margin-block obtient-il le même résultat ?"
    answer: "margin-block: calc(0.5cap - 0.5lh) décale la zone de line-height par rapport à la hauteur des capitales. La formule soustrait la moitié du line-height de la moitié de la hauteur des capitales, produisant une marge négative qui tire le texte visuel vers le centre de l'espace alloué. Cela fonctionne avec une excellente compatibilité navigateur dès aujourd'hui."
  - question: "Puis-je utiliser les deux techniques ensemble ?"
    answer: "Non, elles se cumulent et créent un double ajustement. Utilisez toujours @supports (text-box-trim: trim-both) pour détecter le support de text-box-trim et annuler le margin-block à l'intérieur de ce bloc. Le bon motif : partez de margin-block comme base, appliquez text-box-trim comme amélioration, annulez margin-block quand text-box-trim est disponible."
  - question: "Que sont les unités cap et lh ?"
    answer: "cap est la hauteur des lettres majuscules par rapport au em-box de la police. lh est la valeur calculée du line-height. Ce sont toutes deux des unités relatives à la police qui s'échelonnent avec elle, ce qui rend la formule margin-block correcte quelle que soit la taille ou la famille de police."
---

Ouvrez un bouton dans l'inspecteur de votre navigateur. Ajoutez du padding. Le texte semble centré. Ajoutez davantage de padding, ou changez de police. Soudain, il est décalé de 4 pixels. Ce n'est pas un bug dans votre CSS. C'est une inadéquation fondamentale entre la manière dont les navigateurs mesurent le texte et celle dont les êtres humains le perçoivent.

## Le problème: L'interlignage

Pour comprendre pourquoi le texte ne scentre jamais tout à fait, il faut comprendre ce que les navigateurs mesurent réellement. Chaque police possède un ensemble de métriques : la **hauteur des capitales** (la hauteur des lettres majuscules), la **ligne de base** (sur laquelle reposent les lettres), l'**ascendante** (distance entre la ligne de base et le sommet des lettres hautes) et la **descendante** (distance sous la ligne de base). Ces métriques définissent le carré em, la zone invisible qui contient chaque glyphe.

Mais il y a un piège. Lorsque vous définissez `line-height: 1.5` sur un texte de 16px, le navigateur alloue 24px d'espace vertical. Le texte visuel réel, les lettres elles-mêmes, n'occupent qu'environ 11px dans le centre vertical de cette zone de 24px. L'espace restant s'appelle **l'interlignage** : un padding invisible distribué au-dessus de la hauteur des capitales et sous la ligne de base.

Les navigateurs alignent le texte sur cette zone de line-height, et non sur les lettres visuelles. Voilà pourquoi le texte d'un bouton semble toujours se trouver dans la moitié inférieure de son conteneur, même avec `display: flex; align-items: center`. La zone de line-height s'étend plus haut au-dessus de la hauteur des capitales qu'elle ne descend sous la ligne de base, de sorte que le centre visuel des lettres se situe bien en dessous du centre géométrique de l'espace alloué.

Cette inadéquation affecte chaque conteneur de texte étroit : boutons, badges, éléments de navigation, champs de saisie. Vous pouvez ajouter tout le padding souhaité, tant que vous n'adressez pas l'interlignage, le texte ne sera jamais vraiment centré.

## Solution 1: text-box-trim

La spécification CSS Text Level 4 introduit `text-box-trim`, une propriété qui permet de supprimer directement l'interlignage du texte en ligne. La propriété accepte trois valeurs : `trim-start` supprime l'espace au-dessus du texte, `trim-end` supprime l'espace en dessous, et `trim-both` supprime les deux.

Pour contrôler précisément quelle partie de la métrique de la police est rogée, associez-la avec `text-box-edge`. Cette propriété accepte des valeurs comme `cap`, `alphabetic`, `ex` et `text`, chacune représentant une mesure différente dans le carré em de la police.

Pour l'ajustement vertical le plus étroit, utilisez `text-box-edge: cap alphabetic` combiné avec `text-box-trim: trim-both`. Cela indique au navigateur de rogner depuis la hauteur des capitales jusqu'à la ligne de base alphabétique, supprimant tout l'interlignage au-dessus et en dessous des lettres visibles.

```css
.button-text {
  text-box-edge: cap alphabetic;
  text-box-trim: trim-both;
}
```

La compatibilité avec les navigateurs est actuellement limitée aux versions les plus récentes. Cela fait de `text-box-trim` une amélioration progressive idéale : vous l'appliquez pour les navigateurs qui la supportent tout en maintenant un fallback pour les autres.

## Solution 2: margin-block

Si vous avez besoin de code fonctionnel aujourd'hui, `margin-block` avec des unités relatives à la police délivre le même résultat avec une excellente compatibilité navigateurs. La technique utilise deux unités CSS moins connues : `cap`, qui équivaut à la hauteur des capitales de la police actuelle, et `lh`, qui équivaut à la valeur calculée de line-height.

La formule est élégante :

```css
.button-text {
  margin-block: calc(0.5cap - 0.5lh);
}
```

Cela produit une marge négative qui compense la zone de line-height par rapport à la hauteur des capitales. La moitié de la hauteur des capitales moins la moitié du line-height donne exactement la distance nécessaire pour tirer le texte visuel vers le centre de son espace alloué. Comme `cap` et `lh` s'échelonnent tous deux avec la police, cela fonctionne correctement quelle que soit la taille ou la famille de police.

Pour une police de 16px avec `line-height: 1.5` (24px), le calcul produit environ -4px. Cette marge négative soulève le texte visuel vers le centre géométrique. Le résultat est le même ajustement précis et serré que celui fourni par `text-box-trim`, mais disponible dans chaque navigateur moderne dès aujourd'hui.

## Motif d'amélioration progressive

L'approche judicieuse combine les deux techniques : commencez par `margin-block` comme base, puis enrichissez avec `text-box-trim` là où c'est supporté. La clé consiste à utiliser `@supports` pour détecter le support de `text-box-trim` et annuler le margin-block à l'intérieur de ce bloc.

```css
.button-text {
  /* Base : fonctionne partout */
  margin-block: calc(0.5cap - 0.5lh);
}

/* Amélioration : utiliser text-box-trim lorsqu'il est disponible */
@supports (text-box-trim: trim-both) {
  .button-text {
    text-box-edge: cap alphabetic;
    text-box-trim: trim-both;
    margin-block: 0;
  }
}
```

Ce motif garantit que chaque navigateur obtient un alignement textuel correct. Les navigateurs plus anciens obtiennent la solution `margin-block`. Les navigateurs à la pointe obtiennent l'approche native `text-box-trim`. Aucun navigateur n'obtient un double ajustement ni une mise en page cassée.

## Cas d'utilisation réels

**Texte de bouton** : Appliquez `margin-block: calc(0.5cap - 0.5lh)` à l'élément texte du bouton tandis que le bouton lui-même utilise `display: inline-flex; align-items: center`. Cela vous donne un texte de bouton parfaitement centré qui tient lorsque vous changez de police ou ajustez le padding.

**Badges et pilules** : Les conteneurs à padding serré révèlent l'inadéquation instantanément. Ajoutez `margin-block` au texte du badge et regardez l'étiquette s'aligner au centre géométrique, même avec un padding asymétrique.

**Titres hero** : Le texte d'affichage de grande taille rend même de minuscules inadéquations évidentes. `margin-block` sur un titre de 72px avec `line-height: 1.1` délivre l'alignement au pixel près que les designs premium exigent.

**Icône + texte** : Lors de l'appairage d'une icône avec du texte en utilisant `display: flex; align-items: center`, ajouter `margin-block` à l'élément texte garantit que l'icône et les lettres partagent la même ligne de base visuelle, même lorsque leurs métriques internes diffèrent.

Le texte a toujours été légèrement décalé au centre en CSS, non pas à cause de bugs, mais à cause de la manière dont les navigateurs mesurent l'espace. Avec `margin-block` disponible aujourd'hui et `text-box-trim` arrivant bientôt, cette époque est finalement révolue.
