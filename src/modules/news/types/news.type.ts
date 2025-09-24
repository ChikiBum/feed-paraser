export interface News {
	id: string;
  site: string; 
  url: string;
  parsed: boolean;
  forced: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface SerializedNews extends Omit<News, "createdAt" | "updatedAt"> {
  createdAt: string;
  updatedAt: string;
}