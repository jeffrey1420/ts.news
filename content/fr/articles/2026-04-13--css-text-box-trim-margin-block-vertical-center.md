---
title: "The CSS vertical-align Problem Is Finally Solved: text-box-trim and margin-block"
description: "For decades, centering text vertically in buttons, badges, and layouts felt slightly off. The culprit: leading space — invisible padding built into every font's metrics. Two CSS properties now solve this at different levels: text-box-trim for inline text and margin-block with cap/lh units for block layouts."
date: 2026-04-13
image: "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=1200&h=630&fit=crop"
author: lschvn
tags: ["CSS", "frontend", "typography", "web development", "layout"]
readingTime: 7
tldr:
  - "Text never truly centers in CSS because browsers align to the line-height box, not the visual letters. Leading space (invisible padding above and below cap height) throws off every button, badge, and heading."
  - "text-box-trim (experimental) removes leading space directly for inline text, paired with text-box-edge to specify which font metric to use as boundaries."
  - "margin-block: calc(0.5cap - 0.5lh) achieves the same effect with superior browser support, using font-relative units that work in production today."
faq:
  - question: "Why does text appear vertically off-center even when CSS says otherwise?"
    answer: "Because browsers align text to the line-height box, not to the visual letters. Fonts include invisible 'leading space' above cap height and below the baseline. A 16px font with line-height 1.5 allocates 24px of vertical space — but the actual letters only occupy ~11px. That 6-7px difference per line is what makes text look misaligned in buttons and badges."
  - question: "What is text-box-trim?"
    answer: "An experimental CSS property that removes leading space from inline text. Use text-box-trim: trim-both to remove space above and below visual letters, combined with text-box-edge: cap alphabetic to specify trimming from cap height down to the alphabetic baseline. Browser support is limited to cutting-edge versions."
  - question: "How does margin-block achieve the same result?"
    answer: "margin-block: calc(0.5cap - 0.5lh) offsets the line-height box against the cap height. The formula subtracts half the line-height from half the cap height, producing a negative margin that pulls visual text up into the center of its allocated space. It works with excellent browser support today."
  - question: "Can I use both techniques together?"
    answer: "No — they stack and create double the adjustment. Always use @supports (text-box-trim: trim-both) to detect text-box-trim support and cancel margin-block inside that block. The correct pattern: start with margin-block as baseline, apply text-box-trim as enhancement, cancel margin-block when text-box-trim is available."
  - question: "What are cap and lh units?"
    answer: "cap is the height of capital letters relative to the font's em-box. lh is the computed line-height value. Both are font-relative units that scale with the font, making the margin-block formula work correctly regardless of font size or family."
---

Ouvrez un bouton dans l'inspecteur de votre navigateur. Ajoutez du padding. Le texte semble centré. Ajoutez davantage de padding, ou changez de police. Soudain, il est décalé de 4 pixels. Ce n'est pas un bug dans votre CSS. C'est une inadéquation fondamentale entre la manière dont les navigateurs mesurent le texte et celle dont les êtres humains le perçoivent.

## Le problème — L'interlignage

Pour comprendre pourquoi le texte ne scentre jamais tout à fait, il faut comprendre ce que les navigateurs mesurent réellement. Chaque police possède un ensemble de métriques : la **hauteur des capitales** (la hauteur des lettres majuscules), la **ligne de base** (sur laquelle reposent les lettres), l'**ascendante** (distance entre la ligne de base et le sommet des lettres hautes) et la **descendante** (distance sous la ligne de base). Ces métriques définissent le carré em, la zone invisible qui contient chaque glyphe.

Mais il y a un piège. Lorsque vous définissez `line-height: 1.5` sur un texte de 16px, le navigateur alloue 24px d'espace vertical. Le texte visuel réel — les lettres elles-mêmes — n'occupent qu'environ 11px dans le centre vertical de cette zone de 24px. L'espace restant s'appelle **l'interlignage** : un padding invisible distribué au-dessus de la hauteur des capitales et sous la ligne de base.

Les navigateurs alignent le texte sur cette zone de line-height, et non sur les lettres visuelles. Voilà pourquoi le texte d'un bouton semble toujours se trouver dans la moitié inférieure de son conteneur, même avec `display: flex; align-items: center`. La zone de line-height s'étend plus haut au-dessus de la hauteur des capitales qu'elle ne descend sous la ligne de base, de sorte que le centre visuel des lettres se situe bien en dessous du centre géométrique de l'espace alloué.

Cette inadéquation affecte chaque conteneur de texte étroit : boutons, badges, éléments de navigation, champs de saisie. Vous pouvez ajouter tout le padding souhaité — tant que vous n'adressez pas l'interlignage, le texte ne sera jamais vraiment centré.

## Solution 1 — text-box-trim

La spécification CSS Text Level 4 introduit `text-box-trim`, une propriété qui permet de supprimer directement l'interlignage du texte en ligne. La propriété accepte trois valeurs : `trim-start` supprime l'espace au-dessus du texte, `trim-end` supprime l'espace en dessous, et `trim-both` supprime les deux.

Pour contrôler précisément quelle partie de la métrique de la police est rogée, associez-la avec `text-box-edge`. Cette propriété accepte des valeurs comme `cap`, `alphabetic`, `ex` et `text` — chacune représentant une mesure différente dans le carré em de la police.

Pour l'ajustement vertical le plus étroit, utilisez `text-box-edge: cap alphabetic` combiné avec `text-box-trim: trim-both`. Cela indique au navigateur de rogner depuis la hauteur des capitales jusqu'à la ligne de base alphabétique, supprimant tout l'interlignage au-dessus et en dessous des lettres visibles.

```css
.button-text {
  text-box-edge: cap alphabetic;
  text-box-trim: trim-both;
}
```

La compatibilité avec les navigateurs est actuellement limitée aux versions les plus récentes. Cela fait de `text-box-trim` une amélioration progressive idéale : vous l'appliquez pour les navigateurs qui la supportent tout en maintenant un fallback pour les autres.

## Solution 2 — margin-block

Si vous avez besoin de code fonctionnel aujourd'hui, `margin-block` avec des unités relatives à la police délivre le même résultat avec une excellente compatibilité navigateurs. La technique utilise deux unités CSS moins connues : `cap`, qui équivaut à la hauteur des capitales de la police actuelle, et `lh`, qui équivaut à la valeur calculée de line-height.

La formule est élégante :

```css
.button-text {
  margin-block: calc(0.5cap - 0.5lh);
}
```

Cela produit une marge négative qui compense la zone de line-height par rapport à la hauteur des capitales. La moitié de la hauteur des capitales moins la moitié du line-height donne exactement la distance nécessaire pour tirer le texte visuel vers le centre de son espace alloué. Comme `cap` et `lh` s'échelonnent tous deux avec la police, cela fonctionne correctement quelle que soit la taille ou la famille de police.

Pour une police de 16px avec `line-height: 1.5` (24px), le calcul produit environ -4px. Cette marge négative soulève le texte visuel vers le centre géométrique. Le résultat est le même ajustement précis et serré que celui fourni par `text-box-trim` — mais disponible dans chaque navigateur moderne dès aujourd'hui.

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

Le texte a toujours été légèrement décalé au centre en CSS — non pas à cause de bugs, mais à cause de la manière dont les navigateurs mesurent l'espace. Avec `margin-block` disponible aujourd'hui et `text-box-trim` arrivant bientôt, cette époque est finalement révolue.
