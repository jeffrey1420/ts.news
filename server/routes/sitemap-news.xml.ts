import { defineEventHandler } from 'h3'
import { buildNewsSitemap } from '../utils/newsSitemap'

// Alias of /news-sitemap.xml using the commonly requested /sitemap-news.xml path.
export default defineEventHandler(event => buildNewsSitemap(event))
