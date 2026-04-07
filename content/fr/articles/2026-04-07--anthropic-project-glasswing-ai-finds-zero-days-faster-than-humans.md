---
title: "Anthropic's Project Glasswing: When AI Finds Zero-Days Faster Than Humans Can Count Them"
description: "In one month, Claude Mythos² Preview found thousands of zero-day vulnerabilities that survived decades of human review — in OpenBSD, the Linux kernel, FFmpeg, and every major browser. We dug into the technical details, the industry coalition, and what it means for every security team on the planet."
date: 2026-04-07
image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=630&fit=crop"
author: lschvn
tags: ["AI", "cybersecurity", "Anthropic", "zero-day", "vulnerabilities", "Project Glasswing"]
readingTime: 8
tldr:
  - "Claude Mythos² Preview found thousands of zero-day vulnerabilities in one month — including a 27-year-old OpenBSD bug and a 16-year-old FFmpeg flaw that survived 5 million automated tests."
  - "Project Glasswing brings together Apple, Microsoft, Google, AWS, Cisco, CrowdStrike, JPMorganChase and 11 others to coordinate AI-powered vulnerability fixes across critical infrastructure before attacks can weaponize these capabilities."
  - "The attack timeline has collapsed from months to minutes. Non-experts at Anthropic woke up to working exploits written overnight by Mythos² — with no security training."
faq:
  - question: "What is Project Glasswing?"
    answer: "A 13-company coalition (AWS, Anthropic, Apple, Cisco, CrowdStrike, Google, JPMorganChase, Microsoft, NVIDIA, Palo Alto Networks, and others) launched on April 7, 2026 to coordinate AI-powered vulnerability finding across the world's most critical software infrastructure. Anthropic is committing $100M in API credits and $4M to open-source security organizations."
  - question: "What makes Claude Mythos² different from Claude Opus?"
    answer: "Mythos² is a specialized frontier model trained for cybersecurity tasks. On CyberGym (vulnerability reproduction), it scores 83.1% vs Opus 4.6's 66.6%. On SWE-bench (software engineering), it hits 94.6% vs 91.3%. It finds and exploits zero-days autonomously — something Opus cannot do reliably."
  - question: "What were the most alarming vulnerabilities found?"
    answer: "A 27-year-old OpenBSD remote crash (no authentication required), a 16-year-old FFmpeg bug missed by 5 million automated tests, a Linux kernel privilege escalation (user to root), and a FreeBSD NFS exploit that granted root to unauthenticated users. Every major OS and browser was affected."
  - question: "Why isn't Mythos² being released publicly?"
    answer: "Because the same capabilities that find vulnerabilities also write working exploits. Anthropic explicitly states it would be irresponsible to release a model that non-experts can use to generate working zero-day exploits overnight. The model is only available to Glasswing partners and select open-source maintainers."
  - question: "What does this mean for OpenClaw users and AI agent operators?"
    answer: "Two things: First, AI agents with system access are now part of the attack surface — Mythos²-style capabilities will eventually proliferate, meaning autonomous agents need governance controls. Second, the vulnerability landscape is shifting faster than human-led security teams can track. Managed AI oversight (what Alizé provides) becomes critical infrastructure."
---

Ce bogue a résisté vingt-sept ans de recherche en sécurité par des humains. Des milliers de CVE ont été déposées et corrigées. D'innombrables auditeurs, testeurs de pénétration et chercheurs indépendants ont examiné le code. Puis, en l'espace de quelques minutes, un modèle d'intelligence artificielle a identifié une vulnérabilité de crash distant dans OpenBSD — sans nécessiter la moindre authentification. En quelques jours, l'exploit était rédigé et le correctif déployé. Voilà le récit de Claude Mythos² Preview et de Project Glasswing.

Anthropic ne cherchait pas à développer un modèle de sécurité offensive. La société indique avoir mené des recherches sur la sécurité de l'IA et les capacités des modèles lorsqu'elle a constaté un fait alarmant : les mêmes capacités de raisonnement qui rendent les modèles de pointe utiles en ingénierie logicielle les rendent également remarquablement efficaces pour découvrir — et exploiter — des vulnérabilités logicielles. Non pas en théorie. En pratique. Des exploits fonctionnels. Du jour au lendemain.

## La découverte

Les chiffres issus des tests internes de l'équipe rouge d'Anthropic sont éloquents. Sur CyberGym, un benchmark conçu pour évaluer la capacité d'un modèle à reproduire des vulnérabilités connues, Claude Mythos² a obtenu un score de 83,1 %. Claude Opus 4.6 a obtenu 66,6 %. L'écart est considérable. Sur SWE-bench Verified — un test de capacité réelle en ingénierie logicielle — Mythos² a atteint 94,6 % contre 91,3 % pour Opus 4.6. Sur Terminal-Bench, qui mesure la capacité d'un modèle à opérer dans un environnement shell et à enchaîner des opérations de terminal complexes, Mythos² a obtenu un score de 92,1 %. Ces chiffres ne sont pas de simples références théoriques. Ils décrivent un modèle capable d'accomplir de manière fiable ce que font les chercheurs en sécurité — trouver des bogues, comprendre les chemins de code et rédiger des exploits fonctionnels — sans qu'on lui demande de se comporter de manière éthique ou prudente.

En l'espace d'un mois de tests coordonnés, Mythos² a découvert des vulnérabilités zero-day dans pratiquement tous les systèmes d'exploitation et navigateurs majeurs utilisés à ce jour.

La plus ancienne était un bogue de crash distant vieux de vingt-sept ans dans OpenBSD, nécessitant aucune authentification. Il se trouvait dans la base de code depuis 1999, invisible à des décennies de réviseurs humains. Le plus techniquement alarmant était une faille vieille de seize ans dans FFmpeg — la bibliothèque de codec multimédia omniprésente utilisée dans tout, des navigateurs aux plateformes de visioconférence en passant par les systèmes d'exploitation mobiles. Cinq millions de tests automatisés avaient été exécutés sur la base de code de FFmpeg au fil des années. Mythos² a néanmoins trouvé le bogue, sans instruction spéciale ni accès autre que celui dont disposerait n'importe quel développeur.

Les propres ingénieurs d'Anthropic — des non-spécialistes sans formation formelle en sécurité — se sont vu accorder l'accès et ont été priés de voir ce que Mythos² pouvait accomplir pendant la nuit. Ils se sont réveillés avec des exploits fonctionnels complets. De l'exécution de code à distance. Aucun guidage. Aucun aiguillage. Le modèle avait identifié la vulnérabilité, compris le chemin d'exploitation et rédigé un code de preuve de concept fonctionnel de manière entièrement autonome.

D'autres découvertes incluaient une élévation de privilèges dans le noyau Linux permettant à un compte utilisateur standard de passer en root, un heap spray JIT du navigateur combiné à une évasion de bac à sable (enchaînant quatre vulnérabilités distinctes), et un exploit root NFS distant pour FreeBSD construit sur une chaîne ROP (Return-Oriented Programming) de 20 gadgets. Tous les navigateurs et systèmes d'exploitation majeurs étaient affectés. L'ensemble des vulnérabilités ont été divulguées et corrigées.

## La coalition

Le 7 avril 2026, Anthropic a annoncé Project Glasswing — une coalition industrielle formelle conçue pour agir sur ce que l'équipe rouge avait découvert. Treize partenaires fondateurs ancrent l'initiative : AWS, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, la Linux Foundation, Microsoft, NVIDIA et Palo Alto Networks. Apple est le nom le plus marquant de la liste — une entreprise qui s'est montrée notablement discrète dans sa communication publique sur l'intelligence artificielle, et qui fait désormais officiellement partie du partenariat IA-cybersécurité le plus significatif de l'histoire du secteur.

Anthropic s'engage à hauteur de 100 millions de dollars en crédits API pour l'effort et de 4 millions de dollars supplémentaires en financement direct à destination d'organisations de sécurité open source, notamment le projet Alpha-Omega, l'Open Source Security Foundation (OpenSSF) et la Apache Software Foundation. Après l'annonce, l'API Glasswing est tarifée à 25 dollars par million de tokens pour les fenêtres de contexte et 125 dollars par million de tokens pour la génération — un point de prix délibérément accessible, conçu pour couvrir les projets open source vulnérables, et non pour maximiser les revenus.

Les partenaires ne se contentent pas de recevoir l'accès à Mythos². Ils apportent leurs découvertes, coordonnent la divulgation et intègrent le modèle dans leurs propres pipelines de sécurité. Plus de quarante organisations supplémentaires avaient reçu ou vu leur accès étendu au système au moment du lancement, allant de laboratoires académiques de sécurité à des entreprises de taille intermédiaire présentant une exposition critique en matière d'infrastructure.

## L'effondrement du calendrier d'attaque

La fenêtre entre la découverte d'une vulnérabilité et la disponibilité d'un exploit s'est historiquement comptée en mois. Les chercheurs en sécurité trouvent un bogue, le vérifient, rédigent une preuve de concept, coordonnent avec le fournisseur et attendent un correctif — un processus qui s'étend couramment sur 90 à 180 jours, même dans le cadre de programmes de divulgation coordonnée. Mythos² ne suit pas ce calendrier. Le modèle a trouvé, vérifié et produit un code d'exploit fonctionnel pour plusieurs vulnérabilités critiques au cours d'une seule et même session.

Il ne s'agit pas d'une accélération théorique. C'est un effondrement pratique de la fenêtre de menace. Les défenseurs qui disposaient auparavant de mois pour corriger disposent désormais de minutes — ou tout au plus d'heures — avant qu'un acteur compétent ne puisse produire un exploit opérationnel. La nature duale de la technologie signifie que cette capacité n'est pas confinée à un environnement de recherche. Elle est opérationnelle, accessible et évolutive.

## Ce que cela signifie pour le secteur

Pour les opérateurs d'agents d'IA — y compris les plateformes comme OpenClaw qui accordent aux systèmes autonomes un accès persistant aux fichiers, au code et aux ressources réseau — les implications sont directes. Les agents d'IA ne sont pas de simples outils de productivité. Ce sont des environnements d'exécution. Si un modèle comme Mythos² peut découvrir et exploiter des vulnérabilités de manière autonome, alors tout modèle suffisamment capable évoluant dans un environnement permissif constitue potentiellement un vecteur d'action tanto offensive que défensive. La même capacité qui corrige votre système peut, dans le mauvais contexte ou avec le mauvais aiguillage, l'attaquer.

Pour les équipes de sécurité, le tableau est plus complexe. La découverte de vulnérabilités assistée par IA est désormais plus rapide que les tests de pénétration menés par des humains. Les organisations qui intègrent ces capacités dans leurs opérations d'équipe rouge découvriront davantage de bogues, plus rapidement. Mais leurs adversaires également. La course offense-défense s'oriente vers une dynamique qui exige de nouveaux cadres de gouvernance — non seulement pour les modèles tels que Mythos², mais pour l'écosystème plus large de systèmes d'IA capables qui suivront.

Anthropic ne rend pas Mythos² publiquement accessible, invoquant le risque clair et immédiat que des non-spécialistes l'utilisent pour générer des exploits fonctionnels sans infrastructure de divulgation. Le modèle est disponible pour les partenaires Glasswing et un ensemble sélectionné de mainteneurs open source. Cette décision témoigne d'un sincère souci du problème de l'usage dual. Mais elle ne résout pas la dynamique sous-jacente : le calendrier d'attaque s'est effondré, les outils sont bien réels, et le secteur commence à peine à comprendre ce que cela implique.

**Avertissements :** Seul un sous-ensemble des vulnérabilités découvertes par Mythos² a été publiquement divulgué ; Anthropic estime que plus de 99 % des découvertes du modèle restent non divulguées dans l'attente des correctifs coordonnés des fournisseurs. Le modèle n'est pas accessible au public. Son efficacité dépend partiellement de l'accès au code source et aux binaires — il fonctionne de manière moins fiable contre les cibles en boîte noire sans visibilité sur le code. Ces facteurs limitent la vérification indépendante de certaines affirmations de ce rapport.
