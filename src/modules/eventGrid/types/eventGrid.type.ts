import type { EventType } from "../../adsAnalitycs/types/analitycs.type";
import type { Prisma } from "@prisma/client"; 

export type EventGridFilters = {
  type?: EventType;
  adId?: string;
  anonId?: string;
  dateFrom?: string; // ISO date
  dateTo?: string;   // ISO date
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