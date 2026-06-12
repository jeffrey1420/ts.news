---
name: ts-news-publish
description: Use when creating, researching, translating, illustrating, validating, committing, or publishing new typescript.news articles. Triggers for daily AI, TypeScript, JavaScript, web platform, framework, runtime, tooling, security, performance, and ecosystem news, plus user-requested custom article topics.
---

# ts-news-publish

Create production-ready articles for typescript.news in the existing Nuxt Content format.

## Before Writing

1. Read `references/site-contract.md`.
2. Inspect the latest 8 to 12 English articles in `content/en/articles/` and at least one matching French and German article to refresh the current house style.
3. Check `git status --short --branch`. If the tree is dirty, preserve unrelated user work.
4. Build a short research dossier before drafting. Prefer primary sources: official release notes, project blogs, GitHub releases, CVEs/advisories, standards posts, benchmark repos, company announcements, and maintainer posts. Use secondary sources only to find leads or confirm impact.

## Story Selection

For the morning run, pick exactly two stories unless fewer than two meet the bar.

Prioritize:
- AI developer tools, coding agents, model/toolchain changes that affect builders.
- TypeScript, JavaScript, Node, Bun, Deno, npm, Vite, Oxc, SWC, Rolldown, Nuxt, Vue, React, Svelte, Astro, Fresh, Next, CSS, browser platform, web security, supply chain, and performance.
- Fresh releases or incidents from the last 24 to 72 hours.
- Stories with clear developer impact, verifiable facts, and enough substance for a standalone article.

Reject:
- Thin changelogs with no practical consequence.
- Rumors, unverified benchmark claims, and SEO reposts.
- Topics already covered unless there is a meaningful new development.

For a user-supplied topic, create the requested article count. If no count is given, create one strong article.

## Article Contract

Create the same slug in all three locales:
- `content/en/articles/YYYY-MM-DD--descriptive-slug.md`
- `content/fr/articles/YYYY-MM-DD--descriptive-slug.md`
- `content/de/articles/YYYY-MM-DD--descriptive-slug.md`

Frontmatter must include:

```yaml
---
title: "..."
description: "..."
date: YYYY-MM-DD
image: "/images/heroes/YYYY-MM-DD--descriptive-slug.png"
author: lschvn
tags: ["ai", "typescript", "tooling"]
tldr:
  - "..."
  - "..."
  - "..."
faq:
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
  - question: "..."
    answer: "..."
---
```

Use only canonical tag slugs from `shared/utils/topics.ts`: `typescript`, `javascript`, `runtimes`, `tooling`, `frameworks`, `css`, `ai`, `security`, `performance`, `ecosystem`. Use one to three tags. The first tag is the badge, so order it by the article's primary angle.

## Writing Standards

- Write like a sharp human editor, not a generic AI assistant.
- Never use the em dash character U+2014. Replace it with a comma, colon, semicolon, parentheses, or a new sentence.
- Avoid AI boilerplate and vague phrases such as "delves into", "landscape", "game changer", "it remains to be seen", "in today's fast-paced world", and "seamless".
- Keep claims specific, sourced, and proportionate. Do not invent dates, versions, benchmarks, prices, roadmap commitments, CVEs, or company relationships.
- Use links inline where they help the reader verify or continue reading.
- Include 2 to 4 contextual internal links to existing related articles when genuinely useful.
- Keep code snippets short and directly relevant.
- Prefer 700 to 1200 words for normal news, longer only for analysis pieces.

The TLDR should be three concrete bullets with facts and implications. The FAQ should answer real search or reader questions, not restate the headline. Answers should be concise and independently useful.

## Translation

Draft English first, then localize French and German from the final English version.

For translations:
- Translate title, description, tldr, faq, headings, and body.
- Keep `date`, `image`, `author`, `tags`, URLs, code, package names, API names, commands, filenames, slugs, and version numbers unchanged.
- Preserve meaning, nuance, and source links.
- Use natural French and German technical prose, not literal machine translation.
- Keep internal article links as `/articles/slug`.
- Ensure no English-only sentences remain in French or German, except product names and code.

## Hero Image

For every new slug:

1. Add one entry to the `HEROES` map in `scripts/generate-images.ts`:

```ts
'YYYY-MM-DD--descriptive-slug': ['Short display name', 'Kicker', 'primary-topic'],
```

2. `primary-topic` must match one key in `TOPIC_ACCENT`.
3. Run `bun scripts/generate-images.ts`.
4. Confirm `public/images/heroes/YYYY-MM-DD--descriptive-slug.png` exists.

## Validation

Run, in order:

```bash
bun scripts/consolidate-tags.ts --dry
bun run lint
bun run typecheck
bun run generate
```

Also manually scan changed Markdown for:
- U+2014 em dash.
- Placeholder text, TODOs, stray non-target language, malformed YAML, duplicate titles, and broken Markdown links.
- Missing source links for factual claims.
- Translation drift between locales.

If validation fails, fix and rerun the relevant command.

## Commit And Publish

If there are no content changes, do not commit.

Otherwise:

```bash
gh auth status
git status --short
git add content/en/articles content/fr/articles content/de/articles scripts/generate-images.ts public/images/heroes
git commit -m "Add daily news articles for YYYY-MM-DD"
git pull --ff-only origin "$(git branch --show-current)"
git push origin HEAD
```

If pushing to `main` is blocked or project policy prefers review, create a branch and draft PR:

```bash
git switch -c automation/YYYY-MM-DD-news
git push -u origin HEAD
gh pr create --draft --title "Add daily news articles for YYYY-MM-DD" --body "Adds two researched, localized typescript.news articles with generated hero images."
```
