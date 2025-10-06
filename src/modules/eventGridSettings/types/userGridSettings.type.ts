export type GridSort = {
	field: string;
	direction: "asc" | "desc";
};

export type GridUserSettingsInput = {
	viewName?: string;
	filters: Record<string, any>;
	columns: string[];
	sort: GridSort[];
	pageSize: number;
};

export type GridUserSettings = {
	id: string;
	userId: string;
	viewName?: string | null;
	filters: Record<string, any>;
	columns: string[];
	sort: GridSort[];
	pageSize: number;
	createdAt: string;
	updatedAt: string;
};
