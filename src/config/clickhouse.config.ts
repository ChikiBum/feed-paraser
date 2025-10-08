export const clickhouseConfig = {
	host: process.env.CLICKHOUSE_HOST || "http://localhost:8123",
	database: process.env.CLICKHOUSE_DB || "default",
	username: process.env.CLICKHOUSE_USER || "default",
	password: process.env.CLICKHOUSE_PASSWORD || "clickhouse123",
	application: "news-feed-app",
	keep_alive: {
		enabled: true,
	},
};
