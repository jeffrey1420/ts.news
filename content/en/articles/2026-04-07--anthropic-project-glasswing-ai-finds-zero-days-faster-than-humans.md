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

It survived 27 years of human security research. Thousands of CVEs were filed and patched. Countless auditors, penetration testers, and independent researchers looked at the code. And then, in a matter of minutes, an AI model found a remote crash vulnerability in OpenBSD — one that required no authentication whatsoever. Within days, the exploit was written and the patch was live. That is the story of Claude Mythos² Preview and Project Glasswing.

Anthropic didn't set out to build an offensive security model. The company says it was researching AI safety and model capabilities when researchers noticed something alarming: the same reasoning capabilities that make frontier models useful for software engineering also make them extraordinarily effective at finding — and exploiting — software vulnerabilities. Not in theory. In practice. Working exploits. Overnight.

## The Discovery

The numbers from Anthropic's internal red team testing are stark. On CyberGym, a benchmark designed to test a model's ability to reproduce known vulnerabilities, Claude Mythos² scored 83.1%. Claude Opus 4.6 scored 66.6%. The gap is large. On SWE-bench Verified — a test of genuine software engineering capability — Mythos² hit 94.6% versus Opus 4.6's 91.3%. On Terminal-Bench, which measures a model's ability to operate in a shell environment and chain complex terminal operations, Mythos² scored 92.1%. These aren't just benchmarks. They're a picture of a model that can reliably do what security researchers do — find bugs, understand code paths, and write working exploits — without being prompted to behave ethically or safely.

In one month of coordinated testing, Mythos² found zero-day vulnerabilities across nearly every major operating system and browser in use today.

The oldest was a 27-year-old remote crash bug in OpenBSD that required no authentication. It had been sitting in the codebase since 1999, invisible to decades of human reviewers. The most technically alarming was a 16-year-old flaw in FFmpeg — the ubiquitous multimedia codec library used in everything from browsers to video conferencing platforms to mobile operating systems. Five million automated tests had run against FFmpeg's codebase over the years. Mythos² found the bug anyway, without any special prompting or access beyond what any developer would have.

Anthropic's own engineers — non-experts with no formal security training — were given access and asked to see what Mythos² could do overnight. They woke up to complete working exploits. Remote code execution. No guidance. No steering. The model had identified the vulnerability, understood the exploitation path, and written functional proof-of-concept code entirely on its own.

Other findings included a Linux kernel privilege escalation that allowed a standard user account to escalate to root, a browser JIT compiler heap spray combined with a sandbox escape (chaining four separate vulnerabilities together), and a FreeBSD NFS remote root exploit built on a 20-gadget ROP (Return-Oriented Programming) chain. Every major browser and operating system was affected. All vulnerabilities have been disclosed and patched.

## The Coalition

On April 7, 2026, Anthropic announced Project Glasswing — a formal industry coalition designed to act on what the red team had found. Thirteen founding partners anchor the initiative: AWS, Anthropic, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, the Linux Foundation, Microsoft, NVIDIA, and Palo Alto Networks. Apple is the most conspicuous name on the list — a company that has been notably restrained in its public positioning on artificial intelligence, yet which is now formally part of the most significant AI-cybersecurity partnership in the industry's history.

Anthropic is committing $100 million in API credits to the effort and an additional $4 million in direct funding to open-source security organizations, including the Alpha-Omega Project, the Open Source Security Foundation (OpenSSF), and the Apache Software Foundation. Post-announcement, the Glasswing API is priced at $25 per million tokens for context windows and $125 per million tokens for generation — a deliberately accessible price point designed to get vulnerable open-source projects covered, not to maximize revenue.

Partners are not just receiving access to Mythos². They are contributing findings, coordinating disclosure, and integrating the model into their own security pipelines. More than 40 additional organizations had received or been extended access to the system by launch, ranging from academic security labs to mid-sized software companies with critical infrastructure exposure.

## The Attack Timeline Collapsed

The window between vulnerability discovery and exploit availability has historically been measured in months. Security researchers find a bug, verify it, write a proof-of-concept, coordinate with the vendor, and wait for a patch — a process that routinely stretches across 90 to 180 days even under coordinated disclosure programs. Mythos² doesn't follow that timeline. It found, verified, and produced working exploit code for multiple critical vulnerabilities in a single session.

This is not a theoretical acceleration. It is a practical collapse of the threat window. Defenders who previously had months to patch now have minutes — or at best, hours — before a capable actor could produce an operational exploit. The dual-use nature of the technology means this capability is not confined to a research environment. It is live, accessible, and scalable.

## What It Means for the Industry

For operators of AI agents — including platforms like OpenClaw that give autonomous systems persistent access to files, code, and network resources — the implications are direct. AI agents are not just productivity tools. They are execution environments. If a model like Mythos² can find and exploit vulnerabilities autonomously, then any sufficiently capable model operating in a permissive environment is potentially a vector for both offensive and defensive action. The same capability that patches your system can, in the wrong context or with the wrong prompting, attack it.

For security teams, the picture is more complex. AI-assisted vulnerability finding is now faster than human-led penetration testing. Organizations that integrate these capabilities into their red team operations will find more bugs, faster. But so will their adversaries. The offense-defense race has tilted in a direction that demands new governance frameworks — not just for models like Mythos², but for the broader ecosystem of capable AI systems that will follow.

Anthropic is not releasing Mythos² publicly, citing the clear and immediate risk of non-experts using it to generate working exploits without disclosure infrastructure. The model is available to Glasswing partners and a curated set of open-source maintainers. That decision reflects genuine seriousness about the dual-use problem. But it does not resolve the underlying dynamic: the attack timeline has collapsed, the tools are real, and the industry is only beginning to understand what that means.

**Caveats:** Only a subset of the vulnerabilities discovered by Mythos² have been publicly disclosed; Anthropic estimates that more than 99% of the model's findings remain undisclosed pending coordinated vendor patches. The model is not publicly available. Its effectiveness is partly dependent on access to source code and binaries — it performs less reliably against black-box targets with no code visibility. These factors limit independent verification of some claims in this report.
