
const FEED_CACHE: Record<string, unknown[]> = {};

export async function getFeedFromDb(url: string) {
  return FEED_CACHE[url] || null;
}

export async function saveFeedToDb(url: string, feed: unknown[]) {
  FEED_CACHE[url] = feed;
}