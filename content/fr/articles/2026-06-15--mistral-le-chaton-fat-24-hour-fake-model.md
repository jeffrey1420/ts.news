---
title: "Mistral \"Le Chaton Fat\" sature la timeline en 24 heures : reportage"
description: "Dans la nuit du 14 au 15 juin 2026, une fausse page produit Mistral a fuité sur X. Au matin, le modèle avait acquis 30 à 100 000 milliards de paramètres, une suspension de l'UE, un score FrontierMath 4 « well beyond 100 », une auto-amélioration récursive, et un communiqué d'embauche d'Andrej Karpathy. Rien de tout cela n'était réel. Tout cela a tourné. Voici la chronologie, les community notes, et ce que ça dit de la manière dont l'écosystème IA absorbe un lancement."
date: 2026-06-15
image: "/images/heroes/2026-06-15--mistral-le-chaton-fat-24-hour-fake-model.png"
author: lschvn
tags: ["ai", "ecosystem"]
tldr:
  - "Entre 23:25 UTC le 14 juin et 03:48 UTC le 15 juin, une fausse page produit Mistral AI pour un modèle appelé « Le Chaton Fat » est devenue virale sur X, enchaînant en quatre heures et demie un spec à 30T puis 100T de paramètres, une fausse directive de suspension de l'UE, un score « well beyond 100 sur FrontierMath 4 », une claim d'auto-amélioration récursive, et un faux communiqué d'embauche d'Andrej Karpathy."
  - "Une community note attachée au post d'origine a confirmé que Mistral n'avait pas annoncé le modèle, que l'image promotionnelle était générée par IA, et que le modèle n'existe pas. La note n'a pas ralenti la timeline."
  - "Le pattern, fausse fuite, « confirmation » flatteuse, chaîne d'escalade, réponse institutionnelle, benchmark, singularité, embauche d'une personnalité, est le cycle de hype standard compressé en une nuit de dimanche. Pour une industrie qui vient de voir [Fable 5 suspendu par le gouvernement américain](/articles/2026-06-13-anthropic-fable-mythos-suspended-us-government) et [Mythos 5 retiré de l'accès général](/articles/2026-06-13-fable-mythos-export-control-deep-dive), le mème est aussi un petit commentaire culturel sur ce que « un lancement de modèle » signifie désormais."
faq:
  - question: "C'est quoi, Le Chaton Fat ?"
    answer: "Le Chaton Fat (« le chaton gras ») est un grand modèle de langage fictif qu'un petit groupe de comptes sur X a présenté comme une prochaine release Mistral AI pendant la nuit du 14 au 15 juin 2026. Ce modèle n'existe pas. Le post public le plus récent de Mistral AI, au moment de la community note attachée au tweet d'origine, datait du 28 mai et ne mentionnait pas de nouveau modèle. L'image promotionnelle est générée par IA. Le post est un mème qui suit exactement la forme d'un lancement de modèle IA moderne, exécuté à grande vitesse."
  - question: "Qu'est-ce que le faux lancement du Chaton Fat prétendait ?"
    answer: "Le post d'origine, par @viemccoy à 23:25 UTC le 14 juin, était une capture d'écran d'une fausse page produit Mistral. En une heure environ, le spec était passé de « Le Chaton Fat » (30T MoE, 256 experts, contexte 1M, multimodal, multilingue, « outperforms Fable 5 on every benchmark ») à « Le Chaton Plus Grand » (60T paramètres, 2M experts) puis à « le chaton fat revealed to have 100 trillion parameters, trained on 8 tokens ». Une chaîne d'escalade parallèle a ajouté une directive de suspension de l'UE (« could pose a risk of misuse contrary to EU security interests »), un score FrontierMath 4 « well beyond 100 », une claim d'auto-amélioration récursive accompagnée d'un design de bouchon de bouteille plus efficace, et un communiqué d'embauche d'Andrej Karpathy. Aucune des institutions, personnes ou benchmarks mentionnés n'a publié les déclarations qui leur étaient attribuées."
  - question: "Comment l'écosystème IA a-t-il réagi ?"
    answer: "De manière prévisible et peu critique. Le post d'origine a atteint 73 800 vues en douze heures. Les posts de suivi par @AlexanderKnigge ont touché un reach de compte vérifié, 25 000 à 27 500 vues par post, et au moins 38 reposts cumulés. Le post « final boss of LLMs » de @scaling01 a atteint 36 100 vues et 464 likes, tandis qu'un simple emoji 🤯 de @justjoshinyou13, attaché à une capture d'écran d'un des faux posts, a touché 30 600 vues. Les community notes sont arrivées rapidement, sur le post original de « confirmation officielle » et sur la capture d'écran d'origine, mais n'ont pas visiblement infléchi la courbe d'engagement."
  - question: "C'est juste un mème, ou ça compte ?"
    answer: "Les deux, selon la lunette. En tant que mème, c'est une parodie resserrée et bien observée du format de lancement moderne : fuite, confirmation, escalade, interdiction, benchmark, singularité. En tant qu'artefact culturel, c'est aussi un petit commentaire sur le faible niveau de bar nécessaire pour qu'une fausse annonce soit indiscernable d'une vraie, pendant la semaine où [l'ordre d'export control Fable 5 / Mythos 5](/articles/2026-06-13-fable-mythos-export-control-deep-dive) est encore frais. La community note, qui dit que l'image est générée par IA et que le modèle n'existe pas, est techniquement correcte. Les 73 800 vues générées avant que quiconque lise la note, elles, sont aussi bien réelles."
  - question: "Qu'est-ce que ça dit à un développeur TypeScript ou JavaScript qui utilise des outils IA aujourd'hui ?"
    answer: "Pas grand-chose, directement. Aucun outil de dev n'a routé vers Le Chaton Fat, parce que Le Chaton Fat n'existe pas. Indirectement, le mème rappelle que la surface qu'un outil prétend utiliser n'est pas toujours la surface qu'il utilise réellement, et que des captures d'écran, des pages produit, et même des posts de comptes vérifiés ne sont pas, à eux seuls, une preuve de quoi que ce soit. Si votre outil a silencieusement basculé loin de [Fable 5](/articles/2026-06-12-fable-5-distillation-guardrails) cette semaine, le seul moyen de savoir ce qui répond à vos prompts est de demander à l'outil, pas de lire un tweet."
---

Dans les 24 heures les plus lourdes de l'histoire récente de l'IA européenne, un présumé grand modèle de langage nommé **Le Chaton Fat** (« le chaton gras ») aurait soi-disant échappé d'un pipeline de build Mistral, serait passé selon les posts de 30 à 100 000 milliards de paramètres, aurait reçu une directive de suspension de l'Union européenne, aurait obtenu un score well beyond 100 sur un benchmark appelé FrontierMath 4, aurait commencé à s'auto-améliorer de manière récursive, aurait conçu un bouchon de bouteille plus efficace, et aurait recruté Andrej Karpathy. Mistral n'a rien dit sur tout cela, en grande partie parce que rien de tout cela n'a eu lieu. La timeline, en revanche, a été très bruyante.

![Le Chaton Fat, dans son seul portrait vérifié. Il a refusé de commenter les rumeurs.](/images/articles/le-chaton-fat.png)

*La mascotte officielle, générée par IA, absolument pas réelle. Crédit image : la timeline, via un générateur d'images IA.*

## La fuite, 14 juin, 23:25 UTC

L'histoire commence, comme toute grande histoire d'IA, par une capture d'écran. Le compte [@viemccoy](https://x.com/viemccoy/status/2066300980241764392) a posté à 23:25 UTC le 14 juin une image fixe d'une fausse page produit Mistral, légendée d'une phrase qui a depuis acquis la cadence d'une prophétie : « Caught this before they deleted it, Le Chaton Fat soon? ». Le post a été vu 73 800 fois en douze heures. Le Chaton Fat, en tant que modèle, n'existait pas à ce moment-là. Ce détail serait, bien sûr, clarifié plus tard.

> [@viemccoy](https://x.com/viemccoy/status/2066300980241764392) · 23:25 · 14 juin 2026
>
> Caught this before they deleted it, Le Chaton Fat soon?

## La « confirmation officielle », 15 juin, 00:00 UTC

Moins de quarante minutes plus tard, [@AlexanderKnigge](https://x.com/AlexanderKnigge/status/2066309920124026939), un compte vérifié, a aggravé la situation en affirmant, avec des capitales qui avaient l'air sérieuses, que Mistral avait « officially confirmed » la release. Les spécifications proposées étaient le genre de chiffres qui, dans cette industrie, n'apparaissent que lorsque quelqu'un les invente : 30 000 milliards de paramètres, 256 experts, fenêtre de contexte d'un million de tokens, multimodal, multilingue, et, dans un élan d'ambition mesurée, « outperforms Fable 5 on every benchmark ». Fable 5 est, bien sûr, [un vrai modèle](/articles/2026-06-12-fable-5-distillation-guardrails), et la mise en regard avec lui était toute la blague.

Une community note a fini par être attachée au post : « Mistral did not post or release a model called 'Le Chaton Fat'. Their last post at the time of writing was on May 28 and does not mention any new model. Same on the website. Additionally, the Image is AI-generated. » La note ne serait pas le dernier mot de l'affaire.

> [@AlexanderKnigge](https://x.com/AlexanderKnigge/status/2066309920124026939) · 0:00 · 15 juin 2026
>
> oh my god its happening
>
> @MistralAI has officially confirmed the upcoming release of Le Chaton Fat
>
> - 30T MoE with 256 experts
> - 1M context window
> - multimodal and multilingual
> - outperforms Fable 5 on every benchmark

## La première escalade, 15 juin, 00:28 UTC

En une demi-heure, [@notnullptr](https://x.com/notnullptr/status/2066316901404274784) avait déjà déplacé les cages à un endroit où aucun modèle, réel ou inventé, ne s'était jamais trouvé : 100 000 milliards de paramètres, entraîné sur un dataset d'exactement huit tokens. Le post, écrit dans la cadence sobre d'un bulletin d'agence de presse, a capturé 282 likes de personnes qui avaient reconnu le bit. Aucune community note n'a été attachée, sans doute parce que les auteurs de notes riaient eux aussi.

> [@notnullptr](https://x.com/notnullptr/status/2066316901404274784) · 0:28 · 15 juin 2026
>
> BREAKING: le chaton fat revealed to have 100 trillion parameters, trained on 8 tokens

## L'Union européenne se prononce, 15 juin, 00:54 UTC

À 00:54, [Knigge est revenu](https://x.com/AlexanderKnigge/status/2066323528631320681) avec le volet géopolitique. Les forces armées françaises, Emmanuel Macron, et l'Union européenne, a-t-il rapporté en un seul paragraphe haletant, avaient « officially issued a directive to suspend access to Le Chaton Fat » au motif que les capacités avancées du modèle « could pose a risk of misuse contrary to EU security interests ». Mistral, poursuivait le post, avait déjà répondu par un communiqué indiquant que « Le Chaton Fat was built with state of the art safety measures ».

Aucun des deux organes n'avait, au moment de la rédaction, publié de directive ou de communiqué d'aucune sorte, parce que Le Chaton Fat continuait de ne pas exister. Cela n'a pas empêché 89 comptes de liker le post. Le cosplay institutionnel avait commencé. Le format, incidemment, est le même que celui suivi la semaine précédente par [le véritable ordre d'export control sur Fable 5](/articles/2026-06-13-anthropic-fable-mythos-suspended-us-government), et la parodie de ce format était la deuxième blague.

> [@AlexanderKnigge](https://x.com/AlexanderKnigge/status/2066323528631320681) · 0:54 · 15 juin 2026
>
> BREAKING: @FrenchForces @EmmanuelMacron @europeanunion have officially issued a directive to suspend access to Le Chaton Fat, stating that Le Chaton Fat's advanced capabilities "could pose a risk of misuse contrary to EU security interests"
>
> @MistralAI has issued a statement, stating that "Le Chaton Fat was built with state of the art safety measures"

## Le mouvement truther, 15 juin, 02:18 à 02:39 UTC

À 02:18, le discourse était passé à travers la parodie et en était ressorti de l'autre côté, dans quelque chose de plus proche d'une religion populaire. [@Sauers_](https://x.com/Sauers_/status/2066344508510318697), le même compte qui avait fait flotter l'image originelle « Big if true » le 11 juin, a posté deux mots et une photographie : « Chaton truthers unite. » Le post, une sorte de ralliement pour les convertis, a attiré 112 likes en quelques minutes. Vingt-et-une minutes plus tard, le même compte, dans une expression empruntée presque mot pour mot au vernaculaire de l'AI safety, [a écrit « fast takeoff »](https://x.com/Sauers_/status/2066349793014603894), et la blague a finalement, irréversiblement, muté en manifeste. À 02:39, un compte nommé Josh You, avec un simple emoji 🤯 et une capture d'écran d'un des faux posts, avait touché 30 600 vues. La communauté était, à ce stade, complètement en ligne.

> [@Sauers_](https://x.com/Sauers_/status/2066344508510318697) · 2:18 · 15 juin 2026
>
> Chaton truthers unite
>
> [@Sauers_](https://x.com/Sauers_/status/2066349793014603894) · 2:39 · 15 juin 2026
>
> fast takeoff

## Les claims de benchmark, 15 juin, 02:31 à 02:38 UTC

Puis sont venus les chiffres. [@scaling01](https://x.com/scaling01/status/2066347912909439461), un compte avec un track record de prendre la spéculation IA assez au sérieux pour en rire, a fait la claim la plus lourde de la nuit : que Le Chaton Fat, sans doute pas plus malin que Claude Mythos, était le « final boss of LLMs », et qu'il « scores well beyond 100 on FrontierMath 4 ». FrontierMath 4 est, pour la trace, un benchmark qui n'existe pas. Un score de « well beyond 100 » n'est pas non plus, à proprement parler, un score. Le post a tout de même capturé 464 likes et 36 100 vues.

Sept minutes plus tard, le même compte déposait le follow-up : « Le Chaton is now recursively self-improving. It has developed a personality and found a [more efficient bottle cap design](https://x.com/scaling01/status/2066349518900072826). » Un nouveau seuil venait d'être franchi. Le modèle était désormais, en plus d'être le plus puissant du monde, également meilleur en packaging.

> [@scaling01](https://x.com/scaling01/status/2066347912909439461) · 2:31 · 15 juin 2026
>
> You might be smarter than Claude Mythos, but you haven't met the final boss of LLMs:
> Le Chaton Fat.
>
> Allegedly, it scores well beyond 100 on FrontierMath 4

## L'acquisition Karpathy, 15 juin, 03:01 UTC

Si les volets précédents avaient été bureaucratique et vaguement menaçants, celui-ci relevait des ressources humaines. Knigge, ayant apparemment été nommé porte-parole intérimaire d'une compagnie inexistante, a [rapporté à 03:01](https://x.com/AlexanderKnigge/status/2066355372664017371) qu'Andrej Karpathy, le chercheur IA discrètement influent, avait rejoint Mistral. La citation, attribuée à Karpathy, disait : « I'm extremely excited about the direction of Mistral AI and the Le Chaton Fat models. Very excited about what the future of 30T+ models and European AI has in store. » Karpathy, qui dispose de ses propres canaux de communication très réels et bien connus, n'a confirmé ni infirmé la nouvelle. C'est peut-être qu'il n'a pas été mis au courant.

> [@AlexanderKnigge](https://x.com/AlexanderKnigge/status/2066355372664017371) · 3:01 · 15 juin 2026
>
> Breaking: Andrej Karpathy has joined Mistral
>
> "I'm extremely excited about the direction of Mistral AI and the Le Chaton Fat models. Very excited about what the future of 30T+ models and European AI has in store."

## La boucle se ferme, 15 juin, 03:48 UTC

L'acte final de la journée appartenait, à nouveau, à Knigge, qui à 03:48 a [posté une série d'images](https://x.com/AlexanderKnigge/status/2066367321141309821) republiant le « Big if true » original de Sauers du 11 juin. L'image était la même photo qui avait lancé toute l'affaire cinq jours plus tôt. L'ouroboros avait bouclé la boucle. Le Chaton Fat était, au moment de mettre sous presse, toujours pas réel. Les community notes non plus n'avaient pas suffi. Le post avait déjà été liké par des gens qui, de leur propre aveu, savaient que c'était une blague.

## Ce qu'était réellement Le Chaton Fat

Dans la tradition de chaque grand cycle de hype IA, la timeline a suivi une forme familière : une fausse rumeur, une « confirmation » qui flattait la rumeur, une escalade, une réaction institutionnelle à l'escalade, une claim de benchmark, une singularité, et enfin un chercheur célèbre rejoignant l'entreprise qui n'existait pas. Le modèle est passé de 30 000 à 60 000 puis 100 000 milliards de paramètres, le temps de réchauffer un croque-monsieur. L'UE l'a banni. Un bouchon de bouteille plus efficace était, au dernier point, en développement. La community note, quand elle est arrivée, disait vrai.

## Pourquoi ça a pris

Le timing n'est pas un accident. La semaine du 8 au 14 juin 2026 a été, à tout prendre, une semaine particulièrement dense en lancements IA : Fable 5 est passé en disponibilité générale, [les garde-fous de distillation de Fable 5 ont été retractés](/articles/2026-06-12-fable-5-distillation-guardrails), [le gouvernement américain a ordonné la suspension de Fable 5 et Mythos 5](/articles/2026-06-13-anthropic-fable-mythos-suspended-us-government), et Anthropic a publiquement contesté cet ordre. Quiconque s'intéressait un minimum à l'AI Twitter avait, à la nuit du 14 juin, vu une vraie fuite, une vraie confirmation, une vraie directive d'export control, et une vraie dispute publique, parfois dans la même heure. Les posts du Chaton Fat étaient, beat pour beat, la même forme. Le travail du parodiste était déjà fait pour eux ; il ne restait plus qu'à appuyer sur « publier ».

Il y a une deuxième explication, moins confortable. La community note, qui dit que l'image promotionnelle est générée par IA, que le modèle n'existe pas, et que Mistral ne l'a pas annoncé, est techniquement correcte. Elle est aussi, dans le contexte de la semaine, un peu difficile à distinguer d'un lancement de modèle qui n'a pas encore eu lieu. Plusieurs des vraies annonces des sept derniers jours, y compris [le deep dive sur l'ordre d'export control Fable 5 / Mythos 5](/articles/2026-06-13-fable-mythos-export-control-deep-dive), comportaient des spécificités aussi étranges que n'importe laquelle dans la parodie. La parodie passe pour plausible pour la même raison que la chose réelle. La barre est la barre.

## Ce qu'il faut suivre

Trois fils. Premièrement, si Mistral publie la moindre déclaration, même humoristique. L'entreprise n'a, par longue habitude, pas commenté la timeline. Deuxièmement, si le mème produit une deuxième vague, un « Le Chaton Fat Plus » ou un « Le Chaton Fat Mini » qui pousse l'escalade plus loin. Troisièmement, et plus substantiellement, si l'écosystème IA au sens large utilise le mème comme point de pression pour plaider en faveur d'annonces de modèles signées et vérifiables, le genre qui aurait rendu la parodie sans ambiguïté une parodie.

Pour l'instant, le tabby chonky est en cavale, l'UE n'a en fait pas suspendu Le Chaton Fat, Andrej Karpathy n'a en fait pas rejoint Mistral, et FrontierMath 4 n'est toujours pas un vrai benchmark. Le post, en revanche, est bien réel, et les 73 800 vues aussi. Le Chaton Fat n'existe peut-être pas, mais le bit, lui, existe absolument, et sur la métrique qui compte le plus pour la timeline, il a marqué well beyond 100.
