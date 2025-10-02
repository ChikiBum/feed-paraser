export type Event = {
	type: "click" | "close" | "impression";
	anonId: string;
	adId: string;
};
