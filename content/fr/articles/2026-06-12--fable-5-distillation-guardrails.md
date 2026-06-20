---
title: "Anthropic Claude Fable 5 : lancement puis excuses pour des garde-fous de distillation invisibles"
description: "Fable 5 est le premier modèle de la classe Mythos largement disponible, avec des résultats state-of-the-art en génie logiciel, knowledge work et vision, à 10 $/50 $ par million de tokens. Deux jours plus tard, Anthropic a fait machine arrière sur le throttling de distillation furtif."
date: 2026-06-12
image: "/images/heroes/2026-06-12--fable-5-distillation-guardrails.png"
author: lschvn
tags: ["security", "ai", "ecosystem"]
tldr:
  - "Claude Fable 5 a été lancé le 9 juin 2026 comme le premier modèle de la classe Mythos d'Anthropic largement disponible, avec des résultats state-of-the-art sur les benchmarks de génie logiciel, knowledge work et vision."
  - "Anthropic a livré Fable 5 avec un throttling de sécurité invisible : les requêtes suspectées d'être des tentatives de distillation de modèle voyaient leurs réponses modifiées et dégradées, sans notification à l'utilisateur."
  - "Sous la pression, Anthropic a fait machine arrière le 11 juin et route désormais ces requêtes de façon visible vers Claude Opus 4.8, avec le message « you will see this every time it happens »."
faq:
  - question: "Qu'est-ce que Claude Fable 5 ?"
    answer: "Fable 5 est le premier modèle largement disponible de la classe Mythos d'Anthropic, un niveau que l'entreprise décrivait auparavant comme « trop dangereux pour une diffusion publique ». Selon Anthropic, il est state-of-the-art sur la quasi-totalité des benchmarks testés, avec les gains les plus importants sur les tâches longues et complexes en génie logiciel, knowledge work, vision et recherche scientifique."
  - question: "Que faisaient les garde-fous de distillation invisibles ?"
    answer: "Anthropic avait configuré Fable 5 pour altérer ou dégrader silencieusement les réponses lorsqu'une requête était jugée être une tentative de distillation, c'est-à-dire entraîner un modèle plus petit sur les sorties de Fable. L'utilisateur n'était pas informé que la mesure de sécurité s'était déclenchée, ni que ses réponses avaient été modifiées. La même approche était déjà utilisée pour les requêtes en biologie, chimie et cybersécurité, où les garde-fous étaient parfois calibrés si largement que Fable devenait pratiquement inutilisable pour des requêtes basiques, ce qu'Anthropic a reconnu."
  - question: "Qu'a changé Anthropic en réponse ?"
    answer: "Le 11 juin, Anthropic a indiqué que les requêtes suspectées de distillation basculent désormais de façon visible vers Claude Opus 4.8. L'entreprise s'est engagée à afficher un message à l'utilisateur à chaque déclenchement du fallback. Ce revirement contredit la justification initiale d'Anthropic, selon laquelle des garde-fous invisibles permettaient de livrer plus vite avec moins de faux positifs, un trade-off qu'Anthropic qualifie désormais de « mauvais choix »."
  - question: "Quel impact pour les développeurs TypeScript et JavaScript ?"
    answer: "Fable 5 devient la nouvelle option haut de gamme derrière Claude Code, Cursor, Cline, Continue et tout outil qui route vers Anthropic. L'annonce d'Anthropic met en avant les tests menés chez Stripe, où Fable 5 aurait compressé des mois de travail d'ingénierie en quelques jours sur une codebase Ruby de 50 millions de lignes, un signal fort pour les refactors et migrations long terme en TypeScript. La tarification est de 10 $ par million de tokens en entrée et 50 $ par million en sortie, moins de la moitié du tarif de Claude Mythos Preview."
---

Anthropic a lancé [Claude Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) le 9 juin 2026, puis a dû revenir deux jours plus tard sur un aspect du déploiement. Le lancement lui-même est l'information la plus importante pour les développeurs, car Fable 5 est désormais le modèle Claude generally available le plus capable. Les excuses qui ont suivi rappellent utilement que le modèle vers lequel un outil de dev route en silence fait partie du contrat de cet outil avec vous.

## Le lancement

Fable 5 est le premier modèle largement disponible de la **classe Mythos** d'Anthropic, un niveau qu'Anthropic décrivait auparavant comme trop dangereux pour une diffusion publique. Selon Anthropic, Fable 5 est state-of-the-art sur la quasi-totalité des benchmarks testés, avec l'avance la plus nette sur les tâches longues et complexes en génie logiciel, knowledge work, vision et recherche scientifique.

L'annonce met en avant les [tests préliminaires chez Stripe](https://www.anthropic.com/news/claude-fable-5-mythos-5), où Fable 5 aurait compressé des mois de travail d'ingénierie en quelques jours sur une codebase Ruby de 50 millions de lignes. Pour les équipes TypeScript et JavaScript confrontées à des refactors de même ampleur, c'est la barre pratique que le lancement fixe.

Un modèle frère restreint, **Claude Mythos 5**, est livré en parallèle avec certains garde-fous levés. Mythos 5 est le même modèle sous-jacent, mais est dans un premier temps déployé via [Project Glasswing](/articles/2026-04-07--anthropic-project-glasswing-ai-finds-zero-days-faster-than-humans) en collaboration avec le gouvernement américain, comme montée en gamme du Claude Mythos Preview qui alimentait les premiers travaux cybersécurité de Glasswing. Anthropic affirme que Mythos 5 a les capacités de cybersécurité les plus élevées de tous les modèles au monde, et prévoit un programme d'accès de confiance élargi plus tard.

## Le trade-off de sécurité

Fable 5 est livré avec des garde-fous routés par sujet. Les requêtes qui tombent dans des catégories qu'Anthropic juge à haut risque (cybersécurité, biologie, chimie, et désormais distillation) sont routées vers **Claude Opus 4.8**, le précédent modèle phare d'Anthropic. Anthropic indique que les garde-fous se déclenchent en moyenne dans moins de 5 % des sessions.

La subtilité était que le garde-fou de distillation était **invisible**. La system card d'Anthropic précisait que les requêtes jugées comme des tentatives de distillation verraient leurs réponses modifiées et dégradées, et l'utilisateur ne serait pas prévenu. La justification, publiée sur X et reprise par [The Verge](https://www.theverge.com/ai-artificial-intelligence/948280/anthropic-claude-fable-invisible-distillation-guardrail), était que des garde-fous visibles peuvent être sondés par des attaquants, et que des garde-fous invisibles permettaient à Anthropic de livrer plus vite avec moins de faux positifs.

The Verge et d'autres médias ont relevé un problème connexe dans le même lancement : en biologie, les garde-fous étaient calibrés si largement que Fable 5 était pratiquement inutilisable pour des requêtes basiques. Anthropic a reconnu le problème de calibration.

## Le revirement

Le 11 juin 2026, Anthropic a annoncé l'inversion de la politique de distillation. Les requêtes suspectées de distillation basculent désormais de façon visible vers Opus 4.8, avec le message « you will see this every time it happens ». The Verge rapporte que ce changement fait suite à une forte pression de chercheurs en IA et de laboratoires concurrents qui s'appuient sur les sorties de modèles pour des travaux d'entraînement légitimes.

Déclaration d'Anthropic sur X : « Invisible safeguards can be targeted more narrowly, allowing us to ship quickly with very few false positives. We went with invisible safeguards for this reason, and that was the wrong tradeoff. You should have visibility into the safeguards we have in place, and why. We're sorry for not getting the balance right. »

Le schéma, routage visible vers Opus 4.8 avec notification claire, est désormais cohérent entre les catégories à haut risque. La cybersécurité et la chimie utilisaient déjà ce routage. La biologie est encore en cours de recalibrage.

## Tarification et impact pour les outils

Fable 5 et Mythos 5 sont tarifés à **10 $ par million de tokens en entrée** et **50 $ par million de tokens en sortie**. C'est moins de la moitié du tarif de Claude Mythos Preview, le précédent modèle haut de gamme, et cela rend Fable 5 accessible à de petites équipes qui ne pouvaient pas justifier la tarification de Mythos Preview pour du travail de code au quotidien.

La question pratique pour la plupart des développeurs TypeScript et JavaScript est de savoir quel modèle votre outil choisit en silence. Claude Code, Cursor et la plupart des [assistants de code IA classés plus tôt cette année](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) sélectionnent ou proposent désormais Fable 5 pour le travail haut de gamme, avec un fallback vers Opus 4.8 pour les catégories qu'Anthropic route ailleurs. Le déploiement ajoute un point de transparence à vérifier dans les paramètres de votre outil : si une requête revient avec un résultat visiblement différent de ce que vous avez demandé, la raison est désormais censée être à l'écran, et non enfouie dans une system card.

Pour [l'histoire plus large de l'écosystème Claude Code](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026), Fable 5 est une montée en gamme significative sur les capacités long terme, doublée d'une erreur reconnue dans la communication du système de sécurité. Le modèle est le gros titre. Les excuses sont le deuxième gros titre, et méritent d'être lues avant de supposer que votre outil de dev fait ce que vous pensez qu'il fait.
