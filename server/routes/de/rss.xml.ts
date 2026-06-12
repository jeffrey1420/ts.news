import { defineEventHandler } from 'h3'
import { buildRssFeed } from '../../utils/rssFeed'

export default defineEventHandler(event => buildRssFeed(event, 'de'))
