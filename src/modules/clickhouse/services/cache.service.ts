import NodeCache from "node-cache";
import type { CacheItem } from "../types/сacheService.type";

class CacheService {
	private cache: NodeCache;
	private readonly CACHE_KEY = "clickhouse_events";

	constructor() {
		this.cache = new NodeCache({
			stdTTL: 3600,
			checkperiod: 60,
		});
	}

	addEvent(event: CacheItem): void {
		const events = this.getEvents();
		events.push(event);
		this.cache.set(this.CACHE_KEY, events);
		console.log(`Event cached. Total events in cache: ${events.length}`);
	}

	getEvents(): CacheItem[] {
		return this.cache.get(this.CACHE_KEY) || [];
	}

	clearEvents(): CacheItem[] {
		const events = this.getEvents();
		this.cache.del(this.CACHE_KEY);
		return events;
	}

	getEventCount(): number {
		return this.getEvents().length;
	}
}

export const cacheService = new CacheService();
