# ts.news — SPEC.md

## 1. Concept & Vision

A clean, developer-focused news site for TypeScript and web tech. No fluff, no ads — just well-written long-form articles and news reporting. The vibe is sharp, editorial, trustworthy. Think "the type of site you'd actually read."

## 2. Design Language

- **Aesthetic**: Minimal editorial. White space, strong typography, readable at 2am.
- **Colors**: TBD (light theme, high contrast for readability)
- **Typography**: Something sharp and modern for headings (e.g., Inter, Geist), excellent readability for body text
- **Motion**: Subtle. Page transitions, link hovers only. No scroll animations.

## 3. Layout & Structure

- Homepage: Latest articles + featured article hero
- Article page: Clean reading experience, good line length (~65 chars), dark/light mode
- Navigation: Minimal — Home, Articles, About
- No sidebar, no clutter

## 4. Features

- Articles written in Markdown via Nuxt Content
- Nuxt UI for components (buttons, cards, typography)
- SEO: meta tags, OG images, sitemap, RSS
- Dark/light mode toggle
- Estimated reading time on articles
- Tags/categories for articles

## 5. Tech Stack

- Nuxt 4 (latest)
- Nuxt UI 3
- Nuxt Content v2
- @nuxtjs/seo (or equivalent for meta/OG/sitemap)
- TypeScript throughout

## 6. Workflow

Site built in waves of subagents:
- Wave 1: Nuxt init, UI setup, Content config
- Wave 2: Design system, layouts, components
- Wave 3: First article research + writing
- Wave 4: SEO, polish, deploy
