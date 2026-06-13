---
name: ts-news-lint
description: Use when auditing, proofreading, cross-linking, repairing, validating, committing, or publishing existing typescript.news content. Triggers for daily news lint jobs, typo checks, metadata checks, translation QA, internal link creation, broken link repair, and article quality passes.
---

# ts-news-lint

Run the daily editorial maintenance pass for typescript.news.

## Before Editing

1. Read `references/site-contract.md`.
2. Check `git status --short --branch` and preserve unrelated user work.
3. Inspect recent article triples across `content/en/articles/`, `content/fr/articles/`, and `content/de/articles/`.
4. Prefer narrow, high-confidence edits. Do not rewrite a whole article unless a real quality issue requires it.

## Daily Lint Scope

Audit all Markdown articles, with extra focus on articles changed in the last 14 days.

Check:
- Required frontmatter exists and parses: `title`, `description`, `date`, `image`, `author`, `tags`, `tldr`, `faq`.
- Each locale has the same slug, date, image, author, and tag slugs.
- Title, description, TLDR, FAQ, headings, and body are localized into the correct language.
- No U+2014 em dash appears anywhere.
- No placeholders, TODOs, AI boilerplate, duplicate paragraphs, broken Markdown tables, malformed code fences, or stray non-target scripts.
- No obviously wrong version numbers, dates, company names, CVE IDs, command names, or package names. Browse authoritative sources when a fact looks unstable or suspicious.
- Hero image files referenced by `image` exist in `public/images/heroes/`.
- Canonical tags are from `shared/utils/topics.ts`.

## Internal Links

Improve inter-article links where helpful.

For each article:
- Add 1 to 4 contextual links to older related articles when the link improves the reader's understanding.
- Prefer links in explanatory paragraphs over link dumps.
- Use `/articles/slug`.
- Do not link every repeated keyword.
- Do not link to a missing article. Verify target files exist in all three locale folders when adding a link to localized content.
- Keep translations aligned: if an English link is added, add the equivalent link in French and German in the corresponding sentence or paragraph.

Also fix existing broken internal links. Pay special attention to slugs with double hyphens after the date.

## Language QA

English:
- Remove stray non-English words and awkward literal translations.
- Tighten headlines and descriptions for clarity.

French:
- Use natural technical French.
- Preserve product names, code identifiers, commands, and links.
- Avoid over-formal literal translations.

German:
- Use natural technical German.
- Preserve product names, code identifiers, commands, and links.
- Watch compound words and sentence length.

All locales:
- Keep facts identical across translations.
- Keep TLDR bullets and FAQ answers specific and useful.
- Replace em dashes with commas, colons, semicolons, parentheses, or new sentences.

## Validation

Run:

```bash
bun scripts/consolidate-tags.ts --dry
bun run lint
bun run typecheck
bun run generate
```

If validation fails, fix and rerun the relevant command.

Before committing, run targeted scans:

```bash
rg -n "\x{2014}|TODO|FIXME|\bdelves into\b|\blandscape\b|占比" content
rg -n "\](/articles/[^)]+\)" content
```

Investigate every match. Some words may be legitimate in quoted source names or existing prose, but do not leave obvious quality issues.

## Commit And Publish

**Cron rule (non-negotiable):** If real fixes were made on disk, this run MUST end with a committed and pushed result. The cron job does not get a "follow-up invocation"; the next tick is tomorrow. The deliverable is a commit on `main`, not a tidy report describing uncommitted edits.

**`[SILENT]` is reserved for "no work to do"**, not for "I started work and won't finish it". If you made real fixes and the budget is now tight, narrow the scope on the spot (e.g. skip optional polish for the last file you touched) and STILL commit what you have. Forbidding the "[SILENT] + defer" pattern: it has produced exactly the bug this skill is meant to prevent — the cron run shows `ok` while `git status` is full of unmerged fixes.

If no edits were needed, report "No content lint changes needed" and do not commit — that is the one case where `[SILENT]` is correct.

If a manual / interactive user explicitly asks for a commit in the same session, follow the steps below.

If pushing to `main` is blocked or review is preferred:

```bash
git switch -c automation/YYYY-MM-DD-news-lint
git push -u origin HEAD
gh pr create --draft --title "Polish article links and editorial quality" --body "Runs the daily article lint pass: internal links, typos, metadata, translations, and validation."
```

If pushing to `main` is blocked or review is preferred:

```bash
git switch -c automation/YYYY-MM-DD-news-lint
git push -u origin HEAD
gh pr create --draft --title "Polish article links and editorial quality" --body "Runs the daily article lint pass: internal links, typos, metadata, translations, and validation."
```

## Project Setup

Before the first run, read `references/project-setup.md` for the bun PATH convention, the Nuxt `nuxt prepare` requirement, and the repo/auth specifics for this site.

## Pitfalls

**Cron runs MUST commit in the same run.** If real fixes are on disk, you cannot exit with uncommitted edits, and you cannot use `[SILENT]` to mask a half-finished job. The one valid `[SILENT]` is "no work to do". If you are tempted to defer, narrow the scope (skip the last optional polish) and still commit what you have. A partial-but-committed lint pass is success; a "I did 25 fixes, here is a tidy report, no commit" is failure.

**em-dash detection uses the explicit U+2014 codepoint, not the rendered character.** Copy-pasted "—" in the source must be matched with `rg -nP "\x{2014}"` (ripgrep with PCRE) or `grep -P "\x{2014}"`. The naive literal-character grep misses it on some terminals and editors. Real hits in this codebase tend to be in parenthetical asides (e.g. "the spectrum — Biome bundles ... — but both are now mature enough"); the fix is to replace the em-dashes with parentheses: "(Biome bundles ...), but both are now mature enough".

**Internal link slugs use DOUBLE hyphen after the date.** The canonical format is `YYYY-MM-DD--descriptive-slug` (e.g. `2026-06-12--biome-v2-5-js-api-v6-major`), not `YYYY-MM-DD-descriptive-slug`. A link check that matches the wrong pattern will report false positives. The reliable check:

```bash
python3 -c "
import re, os, glob
for f in glob.glob('content/*/articles/*.md'):
    with open(f) as fh: t = fh.read()
    for m in re.finditer(r'\]\(/articles/([^)]+)\)', t):
        slug = m.group(1)
        ok = all(os.path.exists(f'content/{loc}/articles/{slug}.md') for loc in ('en','fr','de'))
        if not ok: print(f'BROKEN: {f} -> {slug}')
"
```

**`bun scripts/consolidate-tags.ts --apply` reorders by a global PRIORITY array**, not just canonicalizes. If an article's badge is intentionally not the highest-priority canonical (e.g. you wrote `["ai", "security", "ecosystem"]` for a story whose security angle is bigger, but the script's priority would promote `security` to first), `--apply` will demote your badge. Use `--dry` first, then run `--apply` only on files where the reorder matches the editorial intent.

**`bun scripts/generate-images.ts` re-renders ALL hero PNGs and charts** with byte-different output for unchanged entries. After the lint run, `git status --short` will show ~70 modified images you did not change. To verify your real diff is clean:

```bash
git diff --stat | tail -3   # should show 5-10 files for a normal pass
```

If you see 70+, your real edits are buried. Revert the noise with `git checkout main -- public/images public/og-default.png` and review the rest.

**Fresh worktrees need `bun x nuxt prepare` before `bun run lint` or `bun run typecheck`.** They read `.nuxt/eslint.config.mjs`, which `nuxt prepare` generates. Run it once per worktree after `bun install`.

**Pre-existing typecheck and generate failures on the repo are NOT your fault** if they also fail on a clean main. Verify first, document, do not try to fix app code in a content-only lint pass.

**When the working tree shows ~70 modified hero PNGs after running the validator scripts, those are noise.** Do not commit them. See the consolidate-tags / generate-images pitfalls above.
