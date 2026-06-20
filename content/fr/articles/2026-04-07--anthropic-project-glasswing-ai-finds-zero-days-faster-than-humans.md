---
title: "Project Glasswing d'Anthropic : quand l'IA trouve les zero-days plus vite que les humains ne peuvent les compter"
description: "En un mois, Claude Mythos Preview a trouvé des milliers de vulnérabilités zero-day qui ont survécu à des décennies de revue humaine, dans OpenBSD, le noyau Linux, FFmpeg et chaque navigateur majeur. Nous avons creusé les détails techniques, la coalition industrielle et ce que cela signifie pour chaque équipe de sécurité de la planète."
date: 2026-04-07
image: "/images/heroes/2026-04-07--anthropic-project-glasswing-ai-finds-zero-days-faster-than-humans.png"
author: lschvn
tags: ["security", "ai"]
readingTime: 8
tldr:
  - "Claude Mythos Preview a trouvé des milliers de vulnérabilités zero-day en un mois, dont un bogue OpenBSD vieux de 27 ans et une faille FFmpeg de 16 ans qui a survécu à 5 millions de tests automatisés."
  - "Project Glasswing réunit Apple, Microsoft, Google, AWS, Cisco, CrowdStrike, JPMorganChase et 11 autres acteurs pour coordonner les correctifs de vulnérabilités assistés par IA sur les infrastructures critiques avant que des attaques n'armement ces capacités."
  - "Le calendrier d'attaque s'est effondré, passant de mois à quelques minutes. Des non-spécialistes chez Anthropic se sont réveillés face à des exploits fonctionnels écrits en une nuit par Mythos, sans formation en sécurité."
faq:
  - question: "Qu'est-ce que Project Glasswing ?"
    answer: "Une coalition de 13 entreprises (AWS, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, la Linux Foundation, Microsoft, NVIDIA et Palo Alto Networks) lancée le 7 avril 2026 pour coordonner la découverte de vulnérabilités assistée par IA sur les infrastructures logicielles les plus critiques au monde. Anthropic s'engage à hauteur de 100 M$ en crédits API et 4 M$ pour les organisations de sécurité open source."
  - question: "Qu'est-ce qui distingue Claude Mythos de Claude Opus ?"
    answer: "Mythos est un modèle de pointe spécialisé, entraîné pour les tâches de cybersécurité. Sur CyberGym (reproduction de vulnérabilités), il obtient 83,1 % contre 66,6 % pour Opus 4.6. Sur SWE-bench (ingénierie logicielle), il atteint 94,6 % contre 91,3 %. Il trouve et exploite les zero-days de manière autonome, ce qu'Opus ne fait pas de façon fiable."
  - question: "Quelles ont été les vulnérabilités les plus alarmantes découvertes ?"
    answer: "Un crash distant OpenBSD vieux de 27 ans (sans authentification requise), un bogue FFmpeg de 16 ans manqué par 5 millions de tests automatisés, une élévation de privilèges dans le noyau Linux (utilisateur vers root) et un exploit FreeBSD NFS accordant root à des utilisateurs non authentifiés. Tous les grands OS et navigateurs ont été touchés."
  - question: "Pourquoi Mythos n'est-il pas rendu public ?"
    answer: "Parce que les mêmes capacités qui trouvent des vulnérabilités écrivent aussi des exploits fonctionnels. Anthropic affirme explicitement qu'il serait irresponsable de publier un modèle que des non-spécialistes peuvent utiliser pour générer des exploits zero-day fonctionnels en une nuit. Le modèle n'est disponible que pour les partenaires Glasswing et une sélection de mainteneurs open source."
  - question: "Qu'est-ce que cela signifie pour les utilisateurs d'OpenClaw et les opérateurs d'agents IA ?"
    answer: "Deux choses : d'abord, les agents IA disposant d'un accès système font désormais partie de la surface d'attaque. Des capacités de type Mythos finiront par se propager, ce qui signifie que les agents autonomes ont besoin de contrôles de gouvernance. Ensuite, le paysage des vulnérabilités évolue plus vite que les équipes de sécurité humaines ne peuvent suivre. Une supervision IA managée (ce que propose Alizé) devient une infrastructure critique."
---

Ce bogue a résisté vingt-sept ans de recherche en sécurité par des humains. Des milliers de CVE ont été déposées et corrigées. D'innombrables auditeurs, testeurs de pénétration et chercheurs indépendants ont examiné le code. Puis, en l'espace de quelques minutes, un modèle d'intelligence artificielle a identifié une vulnérabilité de crash distant dans OpenBSD, sans nécessiter la moindre authentification. En quelques jours, l'exploit était rédigé et le correctif déployé. Voilà le récit de Claude [Mythos](/articles/2026-06-12--fable-5-distillation-guardrails) Preview et de Project Glasswing.

Anthropic ne cherchait pas à développer un modèle de sécurité offensive. La société indique avoir mené des recherches sur la sécurité de l'IA et les capacités des modèles lorsqu'elle a constaté un fait alarmant : les mêmes capacités de raisonnement qui rendent les modèles de pointe utiles en ingénierie logicielle les rendent également remarquablement efficaces pour découvrir, et exploiter, des vulnérabilités logicielles. Non pas en théorie. En pratique. Des exploits fonctionnels. Du jour au lendemain.

## La découverte

Les chiffres issus des tests internes de l'équipe rouge d'Anthropic sont éloquents. Sur CyberGym, un benchmark conçu pour évaluer la capacité d'un modèle à reproduire des vulnérabilités connues, Claude Mythos a obtenu un score de 83,1 %. Claude Opus 4.6 a obtenu 66,6 %. L'écart est considérable. Sur SWE-bench Verified, un test de capacité réelle en ingénierie logicielle, Mythos a atteint 94,6 % contre 91,3 % pour Opus 4.6. Sur Terminal-Bench, qui mesure la capacité d'un modèle à opérer dans un environnement shell et à enchaîner des opérations de terminal complexes, Mythos a obtenu un score de 92,1 %. Ces chiffres ne sont pas de simples références théoriques. Ils décrivent un modèle capable d'accomplir de manière fiable ce que font les chercheurs en sécurité, trouver des bogues, comprendre les chemins de code et rédiger des exploits fonctionnels, sans qu'on lui demande de se comporter de manière éthique ou prudente.

![Claude Mythos Preview face à Opus 4.6 sur CyberGym et SWE-bench Verified](/images/charts/glasswing-benchmarks.png)

En l'espace d'un mois de tests coordonnés, Mythos a découvert des vulnérabilités zero-day dans pratiquement tous les systèmes d'exploitation et navigateurs majeurs utilisés à ce jour.

La plus ancienne était un bogue de crash distant vieux de vingt-sept ans dans OpenBSD, nécessitant aucune authentification. Il se trouvait dans la base de code depuis 1999, invisible à des décennies de réviseurs humains. Le plus techniquement alarmant était une faille vieille de seize ans dans FFmpeg, la bibliothèque de codec multimédia omniprésente utilisée dans tout, des navigateurs aux plateformes de visioconférence en passant par les systèmes d'exploitation mobiles. Cinq millions de tests automatisés avaient été exécutés sur la base de code de FFmpeg au fil des années. Mythos a néanmoins trouvé le bogue, sans instruction spéciale ni accès autre que celui dont disposerait n'importe quel développeur.

Les propres ingénieurs d'Anthropic, des non-spécialistes sans formation formelle en sécurité, se sont vu accorder l'accès et ont été priés de voir ce que Mythos pouvait accomplir pendant la nuit. Ils se sont réveillés avec des exploits fonctionnels complets. De l'exécution de code à distance. Aucun guidage. Aucun aiguillage. Le modèle avait identifié la vulnérabilité, compris le chemin d'exploitation et rédigé un code de preuve de concept fonctionnel de manière entièrement autonome.

D'autres découvertes incluaient une élévation de privilèges dans le noyau Linux permettant à un compte utilisateur standard de passer en root, un heap spray JIT du navigateur combiné à une évasion de bac à sable (enchaînant quatre vulnérabilités distinctes), et un exploit root NFS distant pour FreeBSD construit sur une chaîne ROP (Return-Oriented Programming) de 20 gadgets. Tous les navigateurs et systèmes d'exploitation majeurs étaient affectés. L'ensemble des vulnérabilités ont été divulguées et corrigées.

## La coalition

Le 7 avril 2026, Anthropic a annoncé Project Glasswing, une coalition industrielle formelle conçue pour agir sur ce que l'équipe rouge avait découvert. Treize partenaires fondateurs ancrent l'initiative : AWS, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, la Linux Foundation, Microsoft, NVIDIA et Palo Alto Networks. Apple est le nom le plus marquant de la liste, une entreprise qui s'est montrée notablement discrète dans sa communication publique sur l'intelligence artificielle, et qui fait désormais officiellement partie du partenariat IA-cybersécurité le plus significatif de l'histoire du secteur.

Anthropic s'engage à hauteur de 100 millions de dollars en crédits API pour l'effort et de 4 millions de dollars supplémentaires en financement direct à destination d'organisations de sécurité open source, notamment le projet Alpha-Omega, l'Open Source Security Foundation (OpenSSF) et la Apache Software Foundation. Après l'annonce, l'API Glasswing est tarifée à 25 dollars par million de tokens pour les fenêtres de contexte et 125 dollars par million de tokens pour la génération, un point de prix délibérément accessible, conçu pour couvrir les projets open source vulnérables, et non pour maximiser les revenus.

Les partenaires ne se contentent pas de recevoir l'accès à Mythos. Ils apportent leurs découvertes, coordonnent la divulgation et intègrent le modèle dans leurs propres pipelines de sécurité. Plus de quarante organisations supplémentaires avaient reçu ou vu leur accès étendu au système au moment du lancement, allant de laboratoires académiques de sécurité à des entreprises de taille intermédiaire présentant une exposition critique en matière d'infrastructure.

## L'effondrement du calendrier d'attaque

La fenêtre entre la découverte d'une vulnérabilité et la disponibilité d'un exploit s'est historiquement comptée en mois. Les chercheurs en sécurité trouvent un bogue, le vérifient, rédigent une preuve de concept, coordonnent avec le fournisseur et attendent un correctif, un processus qui s'étend couramment sur 90 à 180 jours, même dans le cadre de programmes de divulgation coordonnée. Mythos ne suit pas ce calendrier. Le modèle a trouvé, vérifié et produit un code d'exploit fonctionnel pour plusieurs vulnérabilités critiques au cours d'une seule et même session.

Il ne s'agit pas d'une accélération théorique. C'est un effondrement pratique de la fenêtre de menace. Les défenseurs qui disposaient auparavant de mois pour corriger disposent désormais de minutes, ou tout au plus d'heures, avant qu'un acteur compétent ne puisse produire un exploit opérationnel. La nature duale de la technologie signifie que cette capacité n'est pas confinée à un environnement de recherche. Elle est opérationnelle, accessible et évolutive.

## Ce que cela signifie pour le secteur

Pour les opérateurs d'agents d'IA, y compris les plateformes comme [OpenClaw](/articles/2026-03-31--hermes-agent-vs-openclaw-ai-agent-comparison) qui accordent aux systèmes autonomes un accès persistant aux fichiers, au code et aux ressources réseau, les implications sont directes. Les agents d'IA ne sont pas de simples outils de productivité. Ce sont des environnements d'exécution. Si un modèle comme Mythos peut découvrir et exploiter des vulnérabilités de manière autonome, alors tout modèle suffisamment capable évoluant dans un environnement permissif constitue potentiellement un vecteur d'action tanto offensive que défensive. La même capacité qui corrige votre système peut, dans le mauvais contexte ou avec le mauvais aiguillage, l'attaquer.

Pour les équipes de sécurité, le tableau est plus complexe. La découverte de vulnérabilités assistée par IA est désormais plus rapide que les tests de pénétration menés par des humains. Les organisations qui intègrent ces capacités dans leurs opérations d'équipe rouge découvriront davantage de bogues, plus rapidement. Mais leurs adversaires également. La course offense-défense s'oriente vers une dynamique qui exige de nouveaux cadres de gouvernance, non seulement pour les modèles tels que Mythos, mais pour l'écosystème plus large de systèmes d'IA capables qui suivront.

Anthropic ne rend pas Mythos publiquement accessible, invoquant le risque clair et immédiat que des non-spécialistes l'utilisent pour générer des exploits fonctionnels sans infrastructure de divulgation. Le modèle est disponible pour les partenaires Glasswing et un ensemble sélectionné de mainteneurs open source. Cette décision témoigne d'un sincère souci du problème de l'usage dual. Mais elle ne résout pas la dynamique sous-jacente : le calendrier d'attaque s'est effondré, les outils sont bien réels, et le secteur commence à peine à comprendre ce que cela implique.

**Avertissements :** Seul un sous-ensemble des vulnérabilités découvertes par Mythos a été publiquement divulgué ; Anthropic estime que plus de 99 % des découvertes du modèle restent non divulguées dans l'attente des correctifs coordonnés des fournisseurs. Le modèle n'est pas accessible au public. Son efficacité dépend partiellement de l'accès au code source et aux binaires, il fonctionne de manière moins fiable contre les cibles en boîte noire sans visibilité sur le code. Ces facteurs limitent la vérification indépendante de certaines affirmations de ce rapport.
