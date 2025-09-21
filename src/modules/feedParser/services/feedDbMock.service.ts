
const FEED_DB: { [key: string]: string } = {
  "https://example.com/rss": JSON.stringify([
    { title: "Cached News 1", link: "https://example.com/rss/1", date: new Date().toISOString() },
    { title: "Cached News 2", link: "https://example.com/rss/2", date: new Date().toISOString() }
  ])
};


export async function getFeedFromDb(url: string) {
  return FEED_DB[url] || null;
}

export async function saveFeedToDb(url: string, feed: { title: string; link: string; date: string; }[]) {
  FEED_DB[url] = JSON.stringify(feed);
}

export async function parseFeed(url: string) {
  return FEED_DB[url] ? JSON.parse(FEED_DB[url]) : [];
}