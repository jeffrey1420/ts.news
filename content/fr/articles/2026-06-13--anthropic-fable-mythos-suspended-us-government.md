---
title: "Le gouvernement américain ordonne à Anthropic de suspendre Fable 5 et Mythos 5 dans le monde entier ; Anthropic conteste"
description: "Le 12 juin 2026 à 17h21 ET, Anthropic a reçu une directive d'export control du gouvernement américain exigeant la désactivation de Fable 5 et Mythos 5 pour tous les utilisateurs, y compris les ressortissants étrangers présents aux États-Unis. Anthropic s'exécute tout en contestant publiquement la base technique de l'ordre."
date: 2026-06-13
image: "/images/heroes/2026-06-13--anthropic-fable-mythos-suspended-us-government.png"
author: lschvn
tags: ["security", "ai", "ecosystem"]
tldr:
  - "Anthropic a reçu le 12 juin à 17h21 ET une directive d'export control du gouvernement américain ordonnant la suspension de Fable 5 et Mythos 5 pour tout utilisateur, y compris les ressortissants étrangers présents aux États-Unis et les employés d'Anthropic de nationalité étrangère."
  - "Anthropic indique que la crainte citée est un « jailbreak étroit, non universel » qui demande au modèle de lire une base de code et d'identifier des failles, une capacité que l'entreprise dit déjà disponible dans GPT-5.5 et d'autres modèles publics, et que les défenseurs utilisent chaque jour."
  - "Anthropic se conforme et coupe l'accès pour tous les utilisateurs, mais conteste publiquement l'ordre et demande un « processus statutaire transparent, équitable, clair, et fondé sur des faits techniques » avant que ce standard ne soit appliqué à toute l'industrie."
faq:
  - question: "Que dit précisément l'ordre du gouvernement américain à Anthropic ?"
    answer: "Invoquant des autorités de sécurité nationale, le gouvernement américain a émis une directive d'export control qui exige d'Anthropic la suspension de tout accès à Fable 5 et Mythos 5 par tout ressortissant étranger, qu'il soit ou non présent aux États-Unis, y compris les employés d'Anthropic de nationalité étrangère. Comme Fable 5 et Mythos 5 sont servis de manière centralisée, la seule manière de se conformer est de désactiver les modèles pour tous les utilisateurs, pas seulement la sous-population concernée. L'accès aux autres modèles d'Anthropic n'est pas affecté."
  - question: "Pourquoi Anthropic est-elle en désaccord avec l'ordre ?"
    answer: "Anthropic indique que le gouvernement a fourni une preuve verbale d'un jailbreak étroit et non universel : demander au modèle de lire une base de code spécifique et d'identifier des failles logicielles. Anthropic a examiné le rapport sous-jacent et conclu que la capacité montrée est largement disponible dans d'autres modèles publics, dont GPT-5.5 d'OpenAI, et qu'il s'agit de la même capacité que les défenseurs utilisent chaque jour. Pour Anthropic, retirer un modèle commercial sur ce type de hallazgo reviendrait, en pratique, à stopper tout nouveau déploiement de modèle de pointe dans l'industrie."
  - question: "Quels modèles Claude restent disponibles ?"
    answer: "Fable 5, Mythos 5 et toute surface de produit ou d'API qui s'appuyait dessus (le mode haut de gamme de Claude Code, le routage frontier de Cursor, les déploiements Claude d'entreprise qui l'avaient choisi) sont concernés. Claude Opus 4.8, Claude Sonnet, Claude Haiku et le chemin d'accès Mythos Preview utilisé par Project Glasswing continuent de fonctionner."
  - question: "Comment cela affecte-t-il les développeurs TypeScript et JavaScript aujourd'hui ?"
    answer: "Si votre outil de dev routait silencieusement vers Fable 5, attendez-vous à ce que les prompts qui renvoyaient précédemment les meilleurs résultats basculent sur Opus 4.8, avec une latence et un coût moindres, et à perdre une partie de la capacité de planification long terme. La politique de rétention des données sur 30 jours qui accompagnait Fable cesse aussi de s'appliquer une fois Fable retirée de la surface de votre outil. Anthropic dit travailler à restaurer l'accès."
  - question: "Est-ce la même chose que la volte-face sur la distillation de Fable 5 du début de la semaine ?"
    answer: "Non. La volte-face du 11 juin portait sur la manière dont Anthropic gérait les requêtes suspectées d'être des tentatives de distillation de modèle : le throttling invisible avait été remplacé par un fallback visible vers Opus 4.8. Il s'agit ici d'une action différente et bien plus large. La directive d'export control désactive Fable 5 et Mythos 5 entièrement pour la population concernée, sur la base d'une préoccupation de cybersécurité, pas de distillation."
---

Le gouvernement américain, invoquant des autorités de sécurité nationale, a émis une directive d'export control ordonnant à Anthropic de suspendre tout accès à Fable 5 et Mythos 5 pour tout ressortissant étranger, y compris les employés d'Anthropic de nationalité étrangère. Anthropic a [annoncé l'ordre le 12 juin 2026 à 17h21 ET](https://www.anthropic.com/news/fable-mythos-access) et s'y conforme, tout en contestant publiquement la base technique de l'ordre. L'effet pratique pour tout développeur qui utilise Claude aujourd'hui : les modèles Claude les plus puissants ont disparu, au moins pour l'instant, et toute l'industrie observe ce que le gouvernement fait ensuite.

## Ce que dit l'ordre

La directive couvre Fable 5, le modèle de classe Mythos généralement disponible qu'Anthropic a [lancé trois jours plus tôt](/articles/2026-06-12--fable-5-distillation-guardrails), et Mythos 5, le modèle frère restreint servi via [Project Glasswing](/articles/2026-04-07--anthropic-project-glasswing-ai-finds-zero-days-faster-than-humans). L'ordre s'applique à « tout ressortissant étranger, qu'il soit ou non présent aux États-Unis, y compris les employés d'Anthropic de nationalité étrangère ». Comme le modèle est servi de manière centralisée et qu'il n'existe pas de moyen par utilisateur d'exclure la population concernée, la seule voie de conformité est de désactiver les deux modèles pour tout le monde, pas seulement pour la sous-population étrangère.

Le communiqué d'Anthropic indique que la crainte du gouvernement est une « méthode de contournement, ou "jailbreaking", de Fable 5 ». Anthropic a examiné une démonstration de la technique et conclu que le hallazgo est étroit et non spécifique à Fable. Pour citer l'entreprise directement : « We have reviewed a report that we believe is the basis of the government's directive and validated that the level of capability displayed there is widely available from other models (including OpenAI's GPT-5.5), and is used every day by the defenders who keep systems safe. »

## À quoi ressemble la défense en profondeur d'Anthropic

Le désaccord ne porte pas sur le fait que Fable 5 ait des garde-fous. Il porte sur la bonne réponse lorsqu'un contournement étroit et non universel est divulgué. Le [post de lancement de Fable](https://www.anthropic.com/news/claude-fable-5-mythos-5) présentait la stratégie comme une défense en profondeur : rendre les jailbreaks étroits quand ils existent, coûteux à reproduire, et combiner cela avec une surveillance active pour détecter les abus. Le plan inclut une rétention de 30 jours des données clients sur le trafic Fable, un changement qu'Anthropic reconnaît « carries real costs for us with customers » mais qui permet à l'entreprise de rechercher et d'atténuer de futurs jailbreaks. Le post de lancement disait aussi explicitement que « perfect jailbreak resistance is not currently possible for any model provider » et que des jailbreaks universels seraient tôt ou tard trouvés. L'ordre actuel met cette posture à l'épreuve sur un hallazgo unique et étroit.

## Pourquoi Anthropic conteste

Le désaccord porte surtout sur la question de précédent. La position d'Anthropic est que retirer un modèle commercial pour un jailbreak étroit et non universel fixe une barre que toute l'industrie ne peut pas atteindre : « If this standard was applied across the industry, we believe it would essentially halt all new model deployments for all frontier model providers. »

Anthropic demande aussi un processus, pas seulement un résultat. Extrait du communiqué : « As we have stated publicly, we believe the government should have the ability to block unsafe deployments, as part of a statutory process that is transparent, fair, clear, and grounded in technical facts. This action does not adhere to those principles. » L'entreprise indique qu'elle partagera plus de détails dans les 24 prochaines heures et travaille à restaurer l'accès.

## Ce que cela signifie pour les outils de dev

Pour une équipe TypeScript ou JavaScript qui utilise Claude Code, Cursor, Aider, Continue, Cline ou toute autre surface qui routait vers Fable 5, l'impact pratique est inégal. La plus forte capacité de refactor long terme a disparu jusqu'à ce qu'Anthropic résolve l'ordre. La surface Claude intermédiaire (Opus 4.8, Sonnet, Haiku) n'est pas affectée. Les outils qui exposaient Fable 5 comme picker séparé basculeront sur Opus 4.8 sans raison visible pour l'utilisateur, et les équipes qui avaient configuré [un webhook ou un fallback spécifiquement sur Fable](/articles/2026-04-04-tanstack-db-06-sqlite-persistence-local-first) doivent savoir que l'identifiant de modèle n'est plus le bon défaut.

Il y a un effet de second ordre sur le [menu plus large des modèles de code auto-hébergés](/articles/2026-06-12--kimi-k2-7-code-mimo-code). Quand l'option closed-weight la plus forte devient indisponible, les équipes qui peuvent router vers GPT-5.5, Gemini 3 ou un Kimi K2.7-Code auto-hébergé obtiennent un boulevard plus clair. Le changement de rétention des données sur 30 jours qui accompagnait Fable cesse aussi de s'appliquer, ce qui supprime un point de confidentialité que certains acheteurs d'entreprise avaient signalé.

## Ce qu'il faut suivre

Trois fils méritent d'être suivis. Premièrement, si le suivi promis par Anthropic sous 24 heures contient un chemin de restauration. Deuxièmement, si les autres fournisseurs de modèles de pointe basés aux États-Unis (OpenAI, Google, xAI) publient leurs propres déclarations, puisque le même jailbreak théorique s'appliquerait à leurs modèles. Troisièmement, si l'ordre déclenche une réponse du Congrès ou de l'industrie, puisque la question sous-jacente, « quel est le standard pour retirer un modèle commercial déployé ? », est désormais sur la place publique.

Pour l'instant, Fable 5 et Mythos 5 sont coupés, Claude Code et Cursor exposeront un autre modèle, et le reste de [l'écosystème des outils de dev IA](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) est l'endroit où observer les retombées.
