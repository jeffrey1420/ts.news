import { JWT } from 'google-auth-library'

/**
 * Real-time search-engine notification helpers.
 *
 * Two independent mechanisms:
 *  - Google Indexing API (`URL_UPDATED` / `URL_DELETED`) for individual URLs.
 *  - WebSub / PubSubHubbub ping for the RSS feed, so hubs re-fetch immediately.
 *
 * This module is intentionally free of Nuxt/Nitro `~~` aliases and only depends
 * on `google-auth-library` + the global `fetch`, so it can be imported from
 * both a Nitro server route and a standalone `bun scripts/notify-indexing.ts`.
 *
 * @see https://developers.google.com/search/apis/indexing-api/v3/quickstart
 * @see https://www.w3.org/TR/websub/
 */

const INDEXING_SCOPE = 'https://www.googleapis.com/auth/indexing'
const INDEXING_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish'

/** Default public WebSub hub (Google's hosted PubSubHubbub). */
export const DEFAULT_WEBSUB_HUB = 'https://pubsubhubbub.appspot.com/'

export type IndexingActionType = 'URL_UPDATED' | 'URL_DELETED'

export interface GoogleIndexingCredentials {
  /** Service account email (`client_email` in the JSON key). */
  clientEmail: string
  /** Service account private key (`private_key`); literal `\n` are normalized. */
  privateKey: string
}

export interface IndexingResult {
  url: string
  ok: boolean
  status?: number
  error?: string
}

/**
 * Create an authenticated JWT client scoped to the Indexing API. Reuse a single
 * client across many `notifyGoogleIndexing` calls so the access token is cached.
 */
export function createIndexingClient(credentials: GoogleIndexingCredentials): JWT {
  if (!credentials.clientEmail || !credentials.privateKey) {
    throw new Error('Google Indexing credentials missing: clientEmail and privateKey are required.')
  }
  return new JWT({
    email: credentials.clientEmail,
    // Env-stored keys typically have escaped newlines; normalize them.
    key: credentials.privateKey.replace(/\\n/g, '\n'),
    scopes: [INDEXING_SCOPE],
  })
}

/**
 * Notify the Google Indexing API that a single URL was updated or deleted.
 * Never throws — returns a structured {@link IndexingResult} so callers can
 * push many URLs and report per-URL outcomes.
 */
export async function notifyGoogleIndexing(
  client: JWT,
  url: string,
  type: IndexingActionType = 'URL_UPDATED',
): Promise<IndexingResult> {
  try {
    const res = await client.request<{ urlNotificationMetadata?: unknown }>({
      url: INDEXING_ENDPOINT,
      method: 'POST',
      data: { url, type },
    })
    return { url, ok: true, status: res.status }
  }
  catch (error: unknown) {
    const err = error as { response?: { status?: number }, message?: string }
    return { url, ok: false, status: err.response?.status, error: err.message ?? String(error) }
  }
}

/**
 * Notify a batch of URLs sequentially (the Indexing API quota is per-project and
 * modest; sequential keeps it simple and avoids burst 429s for small batches).
 */
export async function notifyGoogleIndexingBatch(
  client: JWT,
  urls: string[],
  type: IndexingActionType = 'URL_UPDATED',
): Promise<IndexingResult[]> {
  const results: IndexingResult[] = []
  for (const url of urls) {
    results.push(await notifyGoogleIndexing(client, url, type))
  }
  return results
}

export interface WebSubResult {
  ok: boolean
  status?: number
  error?: string
}

/**
 * Ping a WebSub/PubSubHubbub hub to publish (re-fetch) a feed. Subscribers
 * (and crawlers watching the hub) get the new entries near-instantly.
 */
export async function pingWebSub(
  feedUrl: string,
  hubUrl: string = DEFAULT_WEBSUB_HUB,
): Promise<WebSubResult> {
  try {
    const body = new URLSearchParams({ 'hub.mode': 'publish', 'hub.url': feedUrl })
    const res = await fetch(hubUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })
    if (!res.ok) {
      return { ok: false, status: res.status, error: `Hub responded ${res.status} ${res.statusText}` }
    }
    return { ok: true, status: res.status }
  }
  catch (error: unknown) {
    return { ok: false, error: (error as Error).message ?? String(error) }
  }
}
