export interface CacheItem {
	id: string;
	event_type: string;
	source: string;
	subject: string;
	data: unknown;
	event_time: Date;
}
