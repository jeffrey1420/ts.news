import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const articleSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  readingTime: z.number().optional(),
  image: z.string().optional(),
  tldr: z.array(z.string()).optional(),
  faq: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
})

const authorSchema = z.object({
  name: z.string(),
  bio: z.string(),
  github: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
})

export default defineContentConfig({
  collections: {
    // English collections (default)
    articles_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/articles/**',
        prefix: '/articles',
      },
      schema: articleSchema,
    }),
    authors_en: defineCollection({
      type: 'page',
      source: {
        include: 'en/authors/**',
        prefix: '/authors',
      },
      schema: authorSchema,
    }),
    // French collections
    articles_fr: defineCollection({
      type: 'page',
      source: {
        include: 'fr/articles/**',
        prefix: '/articles',
      },
      schema: articleSchema,
    }),
    authors_fr: defineCollection({
      type: 'page',
      source: {
        include: 'fr/authors/**',
        prefix: '/authors',
      },
      schema: authorSchema,
    }),
    // German collections
    articles_de: defineCollection({
      type: 'page',
      source: {
        include: 'de/articles/**',
        prefix: '/articles',
      },
      schema: articleSchema,
    }),
    authors_de: defineCollection({
      type: 'page',
      source: {
        include: 'de/authors/**',
        prefix: '/authors',
      },
      schema: authorSchema,
    }),
  },
})
