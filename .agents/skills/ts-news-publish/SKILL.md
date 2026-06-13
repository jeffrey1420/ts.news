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
5. **Duplicate check.** For each candidate slug, verify it does not already exist in any locale before drafting:
   ```bash
   for slug in YYYY-MM-DD--descriptive-slug; do
     ls content/{en,fr,de}/articles/${slug}.md 2>/dev/null
   done
   ```
   Skip any candidate whose slug exists in any locale. For follow-ups to an existing article (e.g. v0.135 after a v0.134 piece), confirm the new development is meaningful (new feature, breaking change, new release line) before writing a "version N+1" piece.

## Manual Run: Research-Only Default

When the publisher is invoked interactively (a chat session, a one-off request, or any case where the user is present and reachable), the default flow is research-only, not write:

1. Build the research dossier, do the duplicate check, shortlist candidates.
2. Report findings in chat: each candidate with date, primary source URL, substance, and the explicit duplicate-check result (`slugs X, Y do not exist in en/fr/de; slug Z already covered`).
3. Ask the user which 1-2 stories to write, or accept feedback on the shortlist.
4. Do NOT write article files, hero images, or commit anything until the user explicitly greenlights a slug.

The cron job `ts-news-publish-daily` is the exception: it runs unattended, picks exactly two stories, writes, validates, commits, pushes, and posts a summary at the end. Same skill, different default.

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

**Cron rule (non-negotiable):** A cron run that produced real content changes MUST end with a committed, pushed, and (if applicable) merged result. The cron job does not have a "follow-up invocation"; the next tick is tomorrow on different content. "I'll defer to a follow-up" and "I ran out of tool budget" are forbidden outcomes. The deliverable of this skill, in cron mode, is **commit(s) on `main`**, not unmerged branches and not uncommitted work in a worktree.

**Default mode (manual / interactive run):** research-only. Report findings, ask the user which story to write, wait for greenlight. Skip the rest of this section.

**Cron mode (unattended, multi-turn):** see "Cron Mode" below. End-to-end: write, validate, commit, push, merge, push `main`.

If a manual / interactive user explicitly asks for a commit in the same session, follow the steps below.

If pushing to `main` is blocked or project policy prefers review, create a branch and draft PR:

```bash
git switch -c automation/YYYY-MM-DD-news
git push -u origin HEAD
gh pr create --draft --title "Add daily news articles for YYYY-MM-DD" --body "Adds researched, localized typescript.news articles with generated hero images."
```

## Cron Mode

When the skill runs as an unattended cron job (`ts-news-publish-daily`), it operates under a different default than the manual research-only flow.

**Scope: ONE story per cron tick.** A two-story run + commit + push + merge exhausts the tool-call budget and is the proven failure mode that produced the original "deferred the commit" bug. Pick the single strongest candidate from the morning research; do not start a second. If both are equally strong, pick the one with the most concrete primary source. Cron content is daily, not all-at-once; second-story coverage goes to tomorrow's tick.

**End-to-end in one run, in this order:**

1. **Research + duplicate check** on the one chosen story. Skip the user-clarify step — there is no user.
2. **Pre-warm a single worktree** for the story. Do not pre-warm two.
3. **Write, translate, generate hero, validate** the one story inside the worktree.
4. **Commit and push the worktree branch** to origin. Apply the hero-noise cleanup (see Pitfalls) so the branch has the 4-5 real files, not 70.
5. **Switch to `main` and merge** the worktree branch with `--no-ff`.
6. **Push `main` to origin.** This is the moment of success — `main` is now ahead of `origin/main` and contains today's article.
7. **Clean up**: `git worktree remove` the story worktree, `git branch -d` the feature branch, `git push origin --delete` it.
8. **Summary report** at the end: which story, which slugs, validation result, push/merge outcome, commit hash on `main`.

**If budget gets tight mid-run, the order of cuts is:**

- Drop the optional `bun run generate` (pre-existing failures on `main` are documented and out of scope).
- Drop `bun run typecheck` (same).
- Run `bun run lint` only on the changed Markdown files, not the whole repo.
- Drop optional internal links.
- Never cut the commit + push + merge + push-`main` chain. That is the deliverable.

## Multi-story Run

When the user wants more than one story in a single run, isolate each story in its own git worktree on its own branch. The main worktree stays on main for the merge step. This avoids git index races (no two writers in the same workdir) and keeps each story's commit reviewable.

Setup once, before any writing starts:

```bash
cd <REPO>
for slug in <slug-1> <slug-2> ...; do
  git worktree add -b news/<DATE>--$slug .worktrees/$slug main
done
# bun install in each worktree (shared cache, ~440ms each)
for w in <slug-1> <slug-2> ...; do
  (cd .worktrees/$w && bun install --frozen-lockfile) &
done; wait
```

After all stories are written, validated, and pushed to their branches, merge them into main sequentially:

```bash
git switch main
for slug in <slug-1> <slug-2> ...; do
  git merge --no-ff news/<DATE>--$slug -m "Merge news/<DATE>: <title>"
done
git push origin main
```

When multiple branches each add a HEROES entry at the same insertion point in `scripts/generate-images.ts`, the merge will conflict. The fix is mechanical: each feature branch already contains all prior entries plus its own, so `git checkout --theirs scripts/generate-images.ts` for the latest-merged branch keeps the correct cumulative state. Then `git commit` resumes the merge. Do this once per conflicting branch in merge order (fable → oxc → biome → kimi worked cleanly).

## Project Setup

Before the first run, read `references/project-setup.md` for the bun PATH convention, the Nuxt `nuxt prepare` requirement, and the repo/auth specifics for this site.

## Pitfalls

**Cron runs MUST commit in the same run. "I started the work but ran out of budget" and "I'll defer to a follow-up" are forbidden outcomes.** See the Cron Mode section for the end-to-end order. If you find yourself writing one of those rationales into the run output, you have already failed the contract; either narrow the scope on the spot or abandon the second story at the start, but the run MUST end with a commit (or with no work at all). Cron content is daily, not all-at-once; the second story goes to tomorrow's tick, not to a "follow-up invocation" that never comes.

**`bun scripts/generate-images.ts` regenerates ALL hero PNGs on any HEROES change.** The output is byte-different from committed versions even for entries that did not change (non-deterministic font placement or timestamp). After running, the worktree will show ~70 modified images you did not actually change. Workaround:

```bash
git reset HEAD                                       # unstage everything
git checkout main -- public/images public/og-default.png   # drop the noise
# Stage only the 4-5 files you actually want
git add content/en/articles/<slug>.md \
        content/fr/articles/<slug>.md \
        content/de/articles/<slug>.md \
        public/images/heroes/<slug>.png \
        scripts/generate-images.ts
git commit -m "..."
git push --force origin news/<DATE>--<slug>          # first push included 70 files; this fixes it
```

This is the single biggest source of merge noise in the workflow. Bake the cleanup into every per-story commit.

**Fresh worktrees need `bun x nuxt prepare` before `bun run lint` or `bun run typecheck`.** They read `.nuxt/eslint.config.mjs`, which `nuxt prepare` generates. Run it once per worktree right after `bun install`. The error is `Cannot find module '.nuxt/eslint.config.mjs'` (lint) or `tinyexec` timeouts (typecheck).

**Pre-existing typecheck and generate failures on the repo are NOT your fault.** Verify by running both on a clean main checkout before publishing. If they fail there too, document and move on. The publisher is responsible for the articles, not the app code.

**`bun scripts/consolidate-tags.ts --apply` reorders tags by a global PRIORITY array**, not just canonicalizes. If you intentionally chose a different badge than the script's priority order (e.g. a Fable-style story where the model launch is the primary angle but the script's priority wants to promote "security" to first), skip `--apply` and let the lint pass decide. Use `--dry` for awareness.

**When the working tree shows ~70 modified hero PNGs after a successful build, those are noise.** Do not commit them. See the first pitfall.

## References

- `references/site-contract.md` — Nuxt Content schema, canonical tags, hero path format, validation commands.
- `references/research-sources.md` — primary-source fallbacks when the meta-search is dead (GitHub Releases API + RSS feeds), the article census and duplicate-check shell snippets, and the list of repos worth polling for fresh releases.
