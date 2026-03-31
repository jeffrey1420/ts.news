# typescript.news

Daily TypeScript, JavaScript, and web platform news for developers who ship code.

## Tech Stack

- **Nuxt 4** — Vue-based full-stack framework
- **Nuxt UI 4** — 125+ accessible Vue components with Tailwind CSS theming
- **Nuxt Content 3** — file-based content layer with Markdown support
- **Tailwind CSS** — utility-first CSS framework

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server at http://localhost:3000
bun run dev

# Build for production
bun run build

# Generate static site
bun run generate

# Preview production build
bun run preview
```

## Content Workflow

### Adding Articles

Create a Markdown file in `content/articles/`:

```bash
touch content/articles/my-new-article.md
```

### Frontmatter Schema

```yaml
---
title: "Article Title"
description: "Short description for SEO and previews"
date: "2026-03-31"
author: "ts.news"
tags: ["typescript", "release", "compiler"]
readingTime: 5
image: "https://images.unsplash.com/photo-...?w=1200&h=630&fit=crop"
---
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Article title |
| `description` | string | yes | SEO description |
| `date` | string | yes | Publication date (YYYY-MM-DD) |
| `author` | string | no | Author name |
| `tags` | string[] | no | Topic tags |
| `readingTime` | number | no | Estimated reading time in minutes |
| `image` | string | no | Open Graph image URL |

### Publishing Process

1. Create or edit a Markdown file in `content/articles/`
2. Fill in the frontmatter fields
3. Write the article body below the frontmatter
4. Run `bun run dev` to preview locally
5. Commit and push — deployment is automatic

## Deployment

The site uses static site generation:

```bash
bun run generate
```

Output is written to `.output/public/` and can be deployed to any static host (Netlify, Vercel, Cloudflare Pages, etc.).

## Project Structure

```
app/
  app.vue            # Root layout with header, nav, footer
  pages/             # File-based routing
    index.vue        # Homepage
    articles/        # Article listing and detail pages
    tags/[tag].vue   # Tag filter pages
  components/        # Vue components
content/
  articles/          # Markdown articles (Nuxt Content)
server/
  routes/
    sitemap.xml.ts   # Auto-generated sitemap
    rss.xml.ts       # Auto-generated RSS feed
shared/
  utils/site.ts      # Site config and URL helpers
content.config.ts    # Nuxt Content collection schema
nuxt.config.ts       # Nuxt configuration
```

## Auto-Generated Feeds

- **RSS Feed** — `/rss.xml`
- **Sitemap** — `/sitemap.xml` (includes home, articles index, tag pages, and individual articles)
