import type { Prisma } from "@prisma/client";
import type { EventType } from "../../adsAnalitycs/types/analitycs.type";

export type EventGridFilters = {
	type?: EventType;
	adId?: string;
	anonId?: string;
	createdAt?: string;
	dateFrom?: string;
	dateTo?: string;
};

export type EventGridSort = {
	field: "createdAt" | "type" | "adId" | "anonId";
	direction: "asc" | "desc";
};

export type EventGridRequest = {
	page?: number;
	pageSize?: number;
	filters?: EventGridFilters;
	sort?: EventGridSort;
};

export type EventGridItem = {
	id: string;
	anonId: string;
	type: EventType;
	adId?: string;
	createdAt: string;
};

export type EventGridResponse = {
	total: number;
	page: number;
	pageSize: number;
	items: EventGridItem[];
};

export type EventGridWhere = Prisma.EventWhereInput;
