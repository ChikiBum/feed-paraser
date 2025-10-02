import { type Creative, Event, PrismaClient } from "@prisma/client";
import type { BidRequest, CreativeFilter } from "../types/ads.type";

export const filterBySize: CreativeFilter = async (creatives, req) => {
	if (!req.sizes || !Array.isArray(req.sizes) || !req.sizes[0]) {
		return [];
	}

	const validSizes = req.sizes.map(([w, h]) => `${w}x${h}`);
	const filteredCreatives = creatives.filter((cr) =>
		validSizes.includes(cr.size),
	);

	return filteredCreatives;
};

export const filterByGeo: CreativeFilter = async (creatives, req) => {
	console.log("filterByGeo ", filterByGeo);
	if (!req.geo) return creatives;
	return creatives.filter((cr) => cr.geo === req.geo);
};

export const filterByBidfloor: CreativeFilter = async (creatives, req) => {
	console.log("filterByBidfloor ", filterByBidfloor);
	if (!req.bidfloor) return creatives;
	return creatives.filter(
		(cr) => req.bidfloor !== undefined && Number(cr.minCpm) >= req.bidfloor,
	);
};

const prisma = new PrismaClient();

export const filterByAnonId: CreativeFilter = async (creatives, req) => {
	console.log("filterByAnonId ", filterByAnonId);
	const oneHourAgo = new Date();
  oneHourAgo.setHours(oneHourAgo.getHours() - 1);

	const events = await prisma.event.findMany({
		where: {
			anonId: req.anonId,
			type: "impression",
			adId: { in: creatives.map((c) => c.id) },
			createdAt: { gte: oneHourAgo }
		},
		select: { adId: true },
	});
	const shownAdIds = new Set(events.map((e) => e.adId));
	console.log("shownAdIds in filterByAnonId", shownAdIds);
	return creatives.filter((cr) => !shownAdIds.has(cr.id));
};

export async function applyFilters(
	creatives: Creative[],
	req: BidRequest,
	filters: CreativeFilter[],
) {
	let filtered = creatives;
	for (const filter of filters) {
		filtered = await filter(filtered, req);
		if (filtered.length === 0) break;
	}
	return filtered;
}
