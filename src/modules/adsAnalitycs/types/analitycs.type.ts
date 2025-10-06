export const EVENT_TYPES = [
	"click",
	"close",
	"impression",
	"load_page",
	"load_ad_module",
	"auctionInit",
	"auctionEnd",
	"bidRequested",
	"bidResponse",
	"bidWon",
	"pageUnload"
] as const;
export type EventType = typeof EVENT_TYPES[number]; 

export type Event = {
	type: EventType;
	anonId: string;
	adId: string;
};
