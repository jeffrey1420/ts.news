---
title: "Mistral \"Le Chaton Fat\" Sells Out the Timeline in 24 Hours: A Field Report"
description: "On the night of June 14, 2026, a fake Mistral product page leaked to X. By the morning of June 15 it had acquired 30 to 100 trillion parameters, an EU suspension, a FrontierMath 4 score of well beyond 100, recursive self-improvement, and an Andrej Karpathy hire notice. None of it was real. All of it landed. Here is the timeline, the community notes, and what it tells us about how the AI ecosystem absorbs a launch."
date: 2026-06-15
image: "/images/heroes/2026-06-15--mistral-le-chaton-fat-24-hour-fake-model.png"
author: lschvn
tags: ["ai", "ecosystem"]
tldr:
  - "Between 23:25 UTC on June 14 and 03:48 UTC on June 15, a fake Mistral AI product page for a model called \"Le Chaton Fat\" went viral on X, picking up a 30T to 100T parameter spec, a fabricated EU suspension directive, a \"well beyond 100 on FrontierMath 4\" benchmark, a recursive self-improvement claim, and a fake Andrej Karpathy hire notice, all in roughly four and a half hours."
  - "A community note attached to the originating post confirmed Mistral had not announced the model, that the promotional image was AI-generated, and that the model is not real. The note did not slow the timeline down."
  - "The pattern, a fake leak, a flattering \"confirmation,\" an escalation chain, an institutional response, a benchmark, a singularity, a famous-person hire, is the standard hype cycle compressed to a Sunday night. For an industry that just watched [Fable 5 get suspended by the US government](/articles/2026-06-13--anthropic-fable-mythos-suspended-us-government) and [Mythos 5 get pulled from general access](/articles/2026-06-13--fable-mythos-export-control-deep-dive), the meme is also a small piece of cultural commentary on what \"a model launch\" now means."
faq:
  - question: "What is Le Chaton Fat?"
    answer: "Le Chaton Fat (\"the fat kitten\") is a fictional large language model that a small group of accounts on X presented as an upcoming Mistral AI release across the night of June 14 to 15, 2026. There is no such model. Mistral AI's most recent public post, as of the community note attached to the originating tweet, was on May 28 and does not mention a new model. The promotional image is AI-generated. The post is a meme that follows the exact shape of a modern AI launch announcement, run at high speed."
  - question: "What did the fake Le Chaton Fat launch claim?"
    answer: "The original post, by @viemccoy at 23:25 UTC on June 14, was a screenshot of a fake Mistral product page. Within roughly an hour, the spec had escalated from \"Le Chaton Fat\" (30T MoE, 256 experts, 1M context, multimodal, multilingual, \"outperforms Fable 5 on every benchmark\") to \"Le Chaton Plus Grand\" (60T parameters, 2M experts) to \"le chaton fat revealed to have 100 trillion parameters, trained on 8 tokens.\" A parallel escalation chain added an EU suspension directive (\"could pose a risk of misuse contrary to EU security interests\"), a FrontierMath 4 score of \"well beyond 100,\" a recursive self-improvement claim complete with a more efficient bottle cap design, and an Andrej Karpathy hire notice. None of the institutions, people, or benchmarks mentioned issued the statements attributed to them."
  - question: "How did the AI ecosystem react?"
    answer: "Predictably and uncritically. The originating post hit 73,800 views in twelve hours. The follow-up posts by @AlexanderKnigge drew verified-account reach, 25,000 to 27,500 views per post, and at least 38 reposts between them. The \"final boss of LLMs\" post by @scaling01 reached 36,100 views and 464 likes, while a single 🤯 emoji by @justjoshinyou13, attached to a screenshot of one of the fake posts, reached 30,600 views. The community notes arrived quickly, on the original \"official confirmation\" post and on the originating screenshot, but did not visibly change the engagement curve."
  - question: "Is this just a meme, or does it matter?"
    answer: "Both, depending on which lens you use. As a meme it is a tight, well-observed parody of the modern launch format: leak, confirmed, escalated, banned, benchmarked, hire-noticed, singularity. As a cultural artifact, it is also a small comment on how low the bar is for a fake announcement to look indistinguishable from a real one during the week that the [Fable 5 / Mythos 5 export control order](/articles/2026-06-13--fable-mythos-export-control-deep-dive) is still fresh. The community note, which says the promotional image is AI-generated and the model is not real, is technically correct. The 73,800 views it generated before anyone read the note are also real."
  - question: "What does this tell a TypeScript or JavaScript developer using AI tools today?"
    answer: "Not much, directly. No dev tool routed to Le Chaton Fat because Le Chaton Fat does not exist. Indirectly, though, the meme is a useful reminder that the surface a tool claims to use is not always the surface it actually uses, and that screenshots, product pages, and even verified-account posts are not, on their own, evidence of anything. If your tool silently switched away from [Fable 5](/articles/2026-06-12--fable-5-distillation-guardrails) this week, the only way to know what is now answering your prompts is to ask the tool, not to read a tweet."
---

In the most consequential 24 hours in the history of European AI, an alleged large language model named **Le Chaton Fat** (\"the fat kitten\") allegedly escaped from a Mistral build pipeline, allegedly scaled to between 30 and 100 trillion parameters depending on which post you read first, allegedly received a directive of suspension from the European Union, allegedly scored well beyond 100 on a benchmark called FrontierMath 4, allegedly began recursively self-improving, allegedly designed a more efficient bottle cap, and allegedly recruited Andrej Karpathy. Mistral has said nothing about any of this, mostly because none of it happened. The timeline, however, has been very loud.

![Le Chaton Fat, in his only verified portrait. He declined to comment on the rumors.](/images/articles/le-chaton-fat.png)

*The official, AI-generated, not-at-all-real mascot. Image credit: the timeline, by way of an AI image generator.*

## The leak, 23:25 UTC, June 14

The story begins, as every great AI story does, with a screenshot. Account [@viemccoy](https://x.com/viemccoy/status/2066300980241764392) posted a still image of a fake Mistral product page at 23:25 UTC on June 14, captioned with a sentence that has since acquired the cadence of prophecy: "Caught this before they deleted it, Le Chaton Fat soon?" The post was viewed 73,800 times in twelve hours. Le Chaton Fat, as a model, did not exist at the time. This detail would, of course, be made clearer later.

> [@viemccoy](https://x.com/viemccoy/status/2066300980241764392) · 23:25 · 14 June 2026
>
> Caught this before they deleted it, Le Chaton Fat soon?

## The \"official confirmation\", 00:00 UTC, June 15

Less than forty minutes later, [@AlexanderKnigge](https://x.com/AlexanderKnigge/status/2066309920124026939), a verified account, made the situation considerably worse by claiming, in earnest-looking capital letters, that Mistral had "officially confirmed" the release. The specifications he offered were the kind of numbers that, in this industry, only appear when someone is making them up: 30 trillion parameters, 256 experts, a 1 million context window, multimodal, multilingual, and, in a flourish of restrained ambition, "outperforms Fable 5 on every benchmark." Fable 5 is, of course, [a real model](/articles/2026-06-12--fable-5-distillation-guardrails), and the juxtaposition with it was the entire joke.

A community note was eventually attached to the post: "Mistral did not post or release a model called 'Le Chaton Fat'. Their last post at the time of writing was on May 28 and does not mention any new model. Same on the website. Additionally, the Image is AI-generated." The note would not be the last word on the matter.

> [@AlexanderKnigge](https://x.com/AlexanderKnigge/status/2066309920124026939) · 0:00 · 15 June 2026
>
> oh my god its happening
>
> @MistralAI has officially confirmed the upcoming release of Le Chaton Fat
>
> - 30T MoE with 256 experts
> - 1M context window
> - multimodal and multilingual
> - outperforms Fable 5 on every benchmark

## The first escalation, 00:28 UTC, June 15

Within half an hour, [@notnullptr](https://x.com/notnullptr/status/2066316901404274784) had already moved the goalposts to a place where no model, real or invented, had ever stood: 100 trillion parameters, trained on a dataset of exactly eight tokens. The post, written in the sober cadence of a wire-service bulletin, captured 282 likes from people who recognized the bit. A community note has not been attached, possibly because the note-writers were laughing.

> [@notnullptr](https://x.com/notnullptr/status/2066316901404274784) · 0:28 · 15 June 2026
>
> BREAKING: le chaton fat revealed to have 100 trillion parameters, trained on 8 tokens

## The European Union weighs in, 00:54 UTC, June 15

At 00:54, [Knigge returned](https://x.com/AlexanderKnigge/status/2066323528631320681) with the geopolitical installment. The French armed forces, Emmanuel Macron, and the European Union, he reported in a single breathless paragraph, had "officially issued a directive to suspend access to Le Chaton Fat" on the grounds that the model's advanced capabilities "could pose a risk of misuse contrary to EU security interests." Mistral, the post continued, had already fired back with a statement of its own, namely that "Le Chaton Fat was built with state of the art safety measures."

Neither body had, at the time of writing, issued any directive or statement of any kind, because Le Chaton Fat continued to not exist. This did not stop 89 accounts from liking the post. The institutional cosplay had begun. The format, incidentally, is the same one the [actual Fable 5 export control order](/articles/2026-06-13--anthropic-fable-mythos-suspended-us-government) followed a week earlier, and the parody of that format was the second joke.

> [@AlexanderKnigge](https://x.com/AlexanderKnigge/status/2066323528631320681) · 0:54 · 15 June 2026
>
> BREAKING: @FrenchForces @EmmanuelMacron @europeanunion have officially issued a directive to suspend access to Le Chaton Fat, stating that Le Chaton Fat's advanced capabilities "could pose a risk of misuse contrary to EU security interests"
>
> @MistralAI has issued a statement, stating that "Le Chaton Fat was built with state of the art safety measures"

## The truther movement, 02:18 to 02:39 UTC, June 15

By 02:18, the discourse had passed through parody and out the other side into something closer to folk religion. [@Sauers_](https://x.com/Sauers_/status/2066344508510318697), the same account that had floated the original "Big if true" image back on June 11, posted two words and a photograph: "Chaton truthers unite." The post, a kind of call to arms for the converted, drew 112 likes in minutes. Twenty-one minutes later, the same account, in a phrase borrowed almost verbatim from the AI safety vernacular, [wrote "fast takeoff"](https://x.com/Sauers_/status/2066349793014603894), and the joke finally, irreversibly, mutated into a manifesto. By 02:39, an account called Josh You, with a single 🤯 emoji and a screenshot of one of the fake posts, had reached 30,600 views. The community was, by this point, fully online.

> [@Sauers_](https://x.com/Sauers_/status/2066344508510318697) · 2:18 · 15 June 2026
>
> Chaton truthers unite
>
> [@Sauers_](https://x.com/Sauers_/status/2066349793014603894) · 2:39 · 15 June 2026
>
> fast takeoff

## The benchmark claims, 02:31 to 02:38 UTC, June 15

Then came the numbers. [@scaling01](https://x.com/scaling01/status/2066347912909439461), an account with a track record of taking AI speculation seriously enough to be funny about it, made the most consequential claim of the night: that Le Chaton Fat, while perhaps not smarter than Claude Mythos, was the "final boss of LLMs," and that it "scores well beyond 100 on FrontierMath 4." FrontierMath 4 is, for the record, a benchmark that does not exist. A score of "well beyond 100" is also not, by any reasonable standard, a score. The post still collected 464 likes and 36,100 views.

Seven minutes later, the same account filed the follow-up: "Le Chaton is now recursively self-improving. It has developed a personality and found a [more efficient bottle cap design](https://x.com/scaling01/status/2066349518900072826)." A new threshold had been crossed. The model was now, in addition to being the most powerful in the world, also better at packaging.

> [@scaling01](https://x.com/scaling01/status/2066347912909439461) · 2:31 · 15 June 2026
>
> You might be smarter than Claude Mythos, but you haven't met the final boss of LLMs:
> Le Chaton Fat.
>
> Allegedly, it scores well beyond 100 on FrontierMath 4

## The Karpathy acquisition, 03:01 UTC, June 15

If the previous installments had been bureaucratic and vaguely menacing, this one was human resources. Knigge, having apparently been appointed interim press officer for a non-existent company, [reported at 03:01](https://x.com/AlexanderKnigge/status/2066355372664017371) that Andrej Karpathy, the quietly influential AI researcher, had joined Mistral. The quote, attributed to Karpathy, ran: "I'm extremely excited about the direction of Mistral AI and the Le Chaton Fat models. Very excited about what the future of 30T+ models and European AI has in store." Karpathy, who maintains his own very real and well-known communications channels, has not confirmed or denied the news. This may be because he has not been informed.

> [@AlexanderKnigge](https://x.com/AlexanderKnigge/status/2066355372664017371) · 3:01 · 15 June 2026
>
> Breaking: Andrej Karpathy has joined Mistral
>
> "I'm extremely excited about the direction of Mistral AI and the Le Chaton Fat models. Very excited about what the future of 30T+ models and European AI has in store."

## The loop closes, 03:48 UTC, June 15

The final act of the day belonged, again, to Knigge, who at 03:48 [posted a series of images](https://x.com/AlexanderKnigge/status/2066367321141309821) reposting Sauers's original June 11 "Big if true." The image was the same picture that had started the whole thing five days earlier. The ouroboros had eaten its tail. Le Chaton Fat was, at the time of going to press, still not real. The community notes were also not enough. The post had already been liked by people who, by their own admission, knew better.

## What Le Chaton Fat actually was

In the tradition of every great AI hype cycle, the timeline followed a familiar shape: a fake rumor, a "confirmation" that flattered the rumor, an escalation, an institutional reaction to the escalation, a benchmark claim, a singularity, and finally a famous researcher joining the company that did not exist. The model did 30 trillion parameters, then 60 trillion, then 100 trillion, in the time it takes to microwave a croque-monsieur. The EU banned it. A more efficient bottle cap was, at last report, in development. The community note, when it arrived, was true.

## Why it landed

The timing is not accidental. The week of June 8 to 14, 2026 was, by any measure, an unusually dense week for AI launches: Fable 5 went generally available, [Fable 5 distillation guardrails got walked back](/articles/2026-06-12--fable-5-distillation-guardrails), the [US government ordered Fable 5 and Mythos 5 suspended](/articles/2026-06-13--anthropic-fable-mythos-suspended-us-government), and Anthropic publicly disputed that order. Anyone with a passing interest in AI Twitter had, by the night of June 14, seen a real leak, a real confirmation, a real export control directive, and a real public dispute, sometimes in the same hour. The Le Chaton Fat posts were, beat for beat, the same shape. The parodist's job was already done for them; they just had to press publish.

There is a second, less comfortable explanation. The community note, which says the promotional image is AI-generated, the model is not real, and Mistral has not announced it, is technically correct. It is also, in the context of the week, a little hard to distinguish from a model launch announcement that has not happened yet. Several of the real announcements of the last seven days, including the [deep dive on the Fable 5 / Mythos 5 export control order](/articles/2026-06-13--fable-mythos-export-control-deep-dive), included specifics as strange as any in the parody. The parody reads as plausible for the same reason the real thing does. The bar is the bar.

## What to watch

Three threads. First, whether Mistral issues any actual statement, even a joke one. The company has, by long habit, not commented on the timeline. Second, whether the meme produces a second wave, a follow-up \"Le Chaton Fat Plus\" or \"Le Chaton Fat Mini,\" that escalates further. Third, and more substantively, whether the wider AI ecosystem uses the meme as a pressure point to argue for verifiable, signed model-release announcements, the kind that would have made the parody unambiguously a parody.

For the moment, the chonky tabby is at large, the EU has not in fact suspended it, Andrej Karpathy has not in fact joined Mistral, and FrontierMath 4 is still not a real benchmark. The post is, however, real, and so are the 73,800 views. Le Chaton Fat may not exist, but the bit absolutely does, and on the metric that matters most to the timeline, it scored well beyond 100.
