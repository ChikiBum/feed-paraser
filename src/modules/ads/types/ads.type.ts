import { type Creative, Event, PrismaClient } from "@prisma/client";

export type BidRequest = {
	bidId: string;
	anonId: string;
	adUnitCode: string;
	sizes: [number, number][];
	pageUrl: string;
	userAgent: string;
	geo?: string;
	bidfloor?: number;
};

export type BidResponse = {
	requestId: string;
	creativeId?: string;
	adType?: string;
	width?: number;
	height?: number;
	cpm?: number;
	creativeUrl?: string;
	adContent?: string;
	currency?: string;
	ttl?: number;
	meta?: {
		advertiserDomains?: string[];
	};
	nobid?: boolean;
};

export type CreativeFilter = (
	creatives: Creative[],
	req: BidRequest,
) => Promise<Creative[]>;
