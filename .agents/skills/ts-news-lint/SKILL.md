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
rg -n "\\x{2014}|TODO|FIXME|\\bdelves into\\b|\\blandscape\\b|占比" content
rg -n "\\](/articles/[^)]+\\)" content
```

Investigate every match. Some words may be legitimate in quoted source names or existing prose, but do not leave obvious quality issues.

## Commit And Publish

If no edits were needed, report "No content lint changes needed" and do not commit.

Otherwise:

```bash
gh auth status
git status --short
git add content scripts public/images
git commit -m "Polish article links and editorial quality"
git pull --ff-only origin "$(git branch --show-current)"
git push origin HEAD
```

If pushing to `main` is blocked or review is preferred:

```bash
git switch -c automation/YYYY-MM-DD-news-lint
git push -u origin HEAD
gh pr create --draft --title "Polish article links and editorial quality" --body "Runs the daily article lint pass: internal links, typos, metadata, translations, and validation."
```
