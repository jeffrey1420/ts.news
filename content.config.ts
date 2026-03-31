import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/**',
      schema: z.object({
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
      }),
    }),
    authors: defineCollection({
      type: 'page',
      source: 'authors/**',
      schema: z.object({
        name: z.string(),
        bio: z.string(),
        github: z.string().optional(),
        twitter: z.string().optional(),
        website: z.string().optional(),
      }),
    }),
  },
})
