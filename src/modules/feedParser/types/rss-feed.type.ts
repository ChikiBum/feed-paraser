export interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate?: string;
  guid?: string;
  [key: string]: unknown
}

export interface RSSChannel {
  title: string;
  link: string;
  description?: string;
  item: RSSItem[] | RSSItem;
  [key: string]: unknown;
}

export interface RSSFeed {
  rss: {
    channel: RSSChannel;
    [key: string]: unknown;
  };
}

export interface SiteRecord {
  id: string;
  feed: string;
  parsed: boolean;
  forced: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface NewsRecord {
  id: string;
  site: string;
  url: string;
  title?: string;
  textContent?: string;
  htmlContent?: string;
  image?: string;
  parsed: boolean;
  forced: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  siteId?: string;
}

export type SiteShort = Pick<SiteRecord, "id" | "feed">;