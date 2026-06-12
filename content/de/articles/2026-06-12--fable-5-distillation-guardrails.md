---
title: "Anthropic Claude Fable 5 vorgestellt, dann Entschuldigung für unsichtbare Distillation-Guardrails"
description: "Fable 5 ist das erste allgemein verfügbare Modell der Mythos-Klasse mit State-of-the-Art-Ergebnissen in Software-Engineering, Knowledge Work und Vision, bepreist mit 10 $/50 $ pro Million Tokens. Zwei Tage später ruderte Anthropic beim verdeckten Distillation-Throttling zurück."
date: 2026-06-12
image: "/images/heroes/2026-06-12--fable-5-distillation-guardrails.png"
author: lschvn
tags: ["ai", "security", "ecosystem"]
tldr:
  - "Claude Fable 5 wurde am 9. Juni 2026 als erstes allgemein verfügbares Modell der Mythos-Klasse von Anthropic vorgestellt, mit State-of-the-Art-Ergebnissen in Benchmarks für Software-Engineering, Knowledge Work und Vision."
  - "Anthropic lieferte Fable 5 mit unsichtbarem Safety-Throttling aus: Anfragen, die als Distillation-Versuche eingestuft wurden, hatten veränderte und verschlechterte Antworten, ohne dass die Nutzer:innen darüber informiert wurden."
  - "Nach heftigem Widerruf ruderte Anthropic am 11. Juni zurück und routet diese Anfragen nun sichtbar zu Claude Opus 4.8, mit dem Hinweis « you will see this every time it happens »."
faq:
  - question: "Was ist Claude Fable 5?"
    answer: "Fable 5 ist das erste weit verfügbare Modell in Anthropics Mythos-Klasse von KI-Systemen, einer Stufe, die das Unternehmen zuvor als « zu gefährlich für die öffentliche Veröffentlichung » beschrieben hatte. Laut Anthropic ist es in nahezu allen getesteten Benchmarks State of the Art, mit den größten Vorsprüngen bei langen, komplexen Aufgaben in Software-Engineering, Knowledge Work, Vision und wissenschaftlicher Forschung."
  - question: "Was haben die unsichtbaren Distillation-Guardrails getan?"
    answer: "Anthropic hatte Fable 5 so konfiguriert, dass Antworten stillschweigend verändert oder verschlechtert wurden, sobald eine Anfrage als Distillation-Versuch eingestuft wurde, also dem Training eines kleineren Modells auf Fables Ausgaben. Die Nutzer:innen wurden nicht darüber informiert, dass die Sicherheitsmaßnahme ausgelöst hatte oder dass die Antworten verändert worden waren. Dieselbe Vorgehensweise galt bereits für Anfragen in Biologie, Chemie und Cybersicherheit, wo die Guardrails teils so breit kalibriert waren, dass Fable für einfache Anfragen praktisch unbenutzbar war, was Anthropic einräumte."
  - question: "Was hat Anthropic daraufhin geändert?"
    answer: "Am 11. Juni erklärte Anthropic, dass Anfragen mit Distillation-Verdacht nun sichtbar zu Claude Opus 4.8 zurückfallen. Das Unternehmen verpflichtete sich, den Nutzer:innen bei jedem Auslösen des Fallbacks eine Meldung anzuzeigen. Die Änderung ist eine Kehrtwende gegenüber Anthropics ursprünglicher Begründung, dass unsichtbare Safeguards schnelleres Ausliefern mit weniger False Positives ermöglichen, ein Trade-off, das Anthropic inzwischen als « die falsche Abwägung » bezeichnet."
  - question: "Was bedeutet Fable 5 für TypeScript- und JavaScript-Entwickler:innen?"
    answer: "Fable 5 ist die neue Top-Tier-Option hinter Claude Code, Cursor, Cline, Continue und allen Tools, die zu Anthropic routen. Anthropics Launch-Post hebt die [frühen Tests bei Stripe](https://www.anthropic.com/news/claude-fable-5-mythos-5) hervor, wo Fable 5 Berichten zufolge monatelange Engineering-Arbeit in wenigen Tagen in einer 50-Millionen-Zeilen-Ruby-Codebase komprimiert hat, ein starkes Signal für langlaufende Refactorings und Migrationen in TypeScript-Codebasen. Der Preis liegt bei 10 $ pro Million Input-Tokens und 50 $ pro Million Output-Tokens, weniger als die Hälfte des Tarifs von Claude Mythos Preview."
---

Anthropic hat [Claude Fable 5](https://www.anthropic.com/news/claude-fable-5-mythos-5) am 9. Juni 2026 vorgestellt und musste zwei Tage später einen Teil des Rollouts zurücknehmen. Der Launch selbst ist die wichtigere Nachricht für Entwickler:innen, denn Fable 5 ist nun das leistungsfähigste allgemein verfügbare Claude-Modell. Die folgende Entschuldigung erinnert sinnvoll daran, dass das Modell, zu dem ein Dev-Tool stillschweigend routet, Teil des Vertrags dieses Tools mit euch ist.

## Der Launch

Fable 5 ist das erste weit verfügbare Modell in Anthropics **Mythos-Klasse** von KI-Systemen, einer Stufe, die Anthropic zuvor als zu gefährlich für die öffentliche Veröffentlichung beschrieben hatte. Laut Anthropic ist Fable 5 in nahezu allen getesteten Benchmarks State of the Art, mit dem größten Vorsprung bei langen, komplexen Aufgaben in Software-Engineering, Knowledge Work, Vision und wissenschaftlicher Forschung.

Der Launch-Post hebt die [frühen Tests bei Stripe](https://www.anthropic.com/news/claude-fable-5-mythos-5) hervor, wo Fable 5 Berichten zufolge monatelange Engineering-Arbeit in wenigen Tagen in einer 50-Millionen-Zeilen-Ruby-Codebase komprimiert hat. Für TypeScript- und JavaScript-Teams, die vor ähnlich langlaufenden Refactorings stehen, ist das der praktische Maßstab, den der Launch setzt.

Ein eingeschränktes Geschwistermodell, **Claude Mythos 5**, wird parallel mit teilweise gelockerten Safeguards ausgeliefert. Mythos 5 ist dasselbe zugrundeliegende Modell, wird jedoch zunächst über [Project Glasswing](/articles/2026-04-07--anthropic-project-glasswing-ai-finds-zero-days-faster-than-humans) in Zusammenarbeit mit der US-Regierung eingesetzt, als Upgrade des Claude Mythos Preview, der die früheren Cybersicherheitsarbeiten von Glasswing ermöglichte. Anthropic sagt, Mythos 5 habe die stärksten Cybersicherheitsfähigkeiten aller Modelle weltweit, und plant später ein breiteres Trusted-Access-Programm.

## Die Safety-Abwägung

Fable 5 wird mit themenbasiert gerouteten Safeguards ausgeliefert. Anfragen, die in Kategorien fallen, die Anthropic als hochriskant einstuft (Cybersicherheit, Biologie, Chemie und nun Distillation), werden zu **Claude Opus 4.8** geroutet, dem vorherigen Flaggschiff-Modell von Anthropic. Anthropic zufolge lösen die Safeguards im Durchschnitt in weniger als 5 % der Sessions aus.

Die Tücke war, dass der Distillation-Safeguard **unsichtbar** war. Anthropics System Card legte fest, dass Anfragen, die als Distillation-Versuche eingestuft wurden, veränderte und verschlechterte Antworten erhalten sollten, und die Nutzer:innen würden nicht informiert. Die Begründung, auf X veröffentlicht und von [The Verge](https://www.theverge.com/ai-artificial-intelligence/948280/anthropic-claude-fable-invisible-distillation-guardrail) zitiert: sichtbare Safeguards ließen sich von Angreifern ausspähen, unsichtbare erlaubten Anthropic schnelleres Ausliefern mit weniger False Positives.

The Verge und andere Medien wiesen auf ein verwandtes Problem im selben Launch hin: in Biologie waren die Safeguards so breit kalibriert, dass Fable 5 für einfache Anfragen praktisch unbenutzbar war. Anthropic räumte das Kalibrierungsproblem ein.

## Die Kehrtwende

Am 11. Juni 2026 kündigte Anthropic die Umkehr der Distillation-Politik an. Anfragen mit Distillation-Verdacht fallen nun sichtbar zu Opus 4.8 zurück, mit dem Hinweis « you will see this every time it happens ». The Verge berichtet, die Änderung folge auf heftigen Druck von KI-Forscher:innen und konkurrierenden Labs, die Model-Ausgaben für legitime Trainingsarbeit nutzen.

Anthropics Stellungnahme auf X: « Invisible safeguards can be targeted more narrowly, allowing us to ship quickly with very few false positives. We went with invisible safeguards for this reason, and that was the wrong tradeoff. You should have visibility into the safeguards we have in place, and why. We're sorry for not getting the balance right. »

Das Muster, sichtbares Routing zu Opus 4.8 mit klarer Benachrichtigung, ist nun über die Hochrisiko-Kategorien hinweg konsistent. Cybersicherheit und Chemie verwendeten dieses Routing bereits. Biologie wird noch rekalibriert.

## Preisgestaltung und Bedeutung für Tools

Fable 5 und Mythos 5 kosten **10 $ pro Million Input-Tokens** und **50 $ pro Million Output-Tokens**. Das ist weniger als die Hälfte des Tarifs von Claude Mythos Preview, dem vorherigen Top-End-Modell, und es macht Fable 5 für kleinere Teams erschwinglich, die sich die Mythos-Preview-Preise für alltägliche Code-Arbeit nicht leisten konnten.

Die praktische Frage für die meisten TypeScript- und JavaScript-Entwickler:innen ist, welches Modell euer Tool stillschweigend wählt. Claude Code, Cursor und die meisten [zu Jahresbeginn gerankten KI-Code-Assistenten](/articles/2026-03-25-ai-dev-tool-rankings-march-2026) wählen oder bieten Fable 5 nun für Top-Tier-Arbeit an, mit Fallback zu Opus 4.8 für die Kategorien, die Anthropic wegroutet. Der Rollout fügt einen Transparenz-Hinweis hinzu, den es sich lohnt, in den Einstellungen eures Tools zu prüfen: kommt eine Anfrage sichtbar verändert zurück als das, was ihr gefragt habt, soll der Grund nun auf dem Bildschirm stehen, nicht in einer System Card vergraben.

Für die [breitere Geschichte des Claude-Code-Ökosystems](/articles/2026-03-23-claude-code-rise-ai-coding-tool-2026) ist Fable 5 ein signifikanter Sprung nach oben bei langlaufenden Fähigkeiten, gepaart mit einem echten und eingeräumten Fehler in der Kommunikation des Safety-Systems. Das Modell ist die Schlagzeile. Die Entschuldigung ist die zweite Schlagzeile, und es lohnt sich, sie zu lesen, bevor man annimmt, das Dev-Tool mache das, was man denkt.
