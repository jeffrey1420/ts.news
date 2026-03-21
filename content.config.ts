import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: 'articles/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
        readTime: z.number().optional(),
        featured: z.boolean().optional(),
      }),
    }),
  },
})
