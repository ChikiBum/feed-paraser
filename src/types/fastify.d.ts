import type { createClient } from "@clickhouse/client";
import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { ToadScheduler } from "toad-scheduler";
import type { Config } from "../config/schema";
import type { JWTPayload } from "../modules/auth/types";

declare module "fastify" {
	interface FastifyInstance {
		config: Config;
		pluginLoaded: (pluginName: string) => void;
		prisma: PrismaClient;
		scheduler: ToadScheduler;

		authenticate: (
			request: FastifyRequest,
			reply: FastifyReply,
		) => Promise<void>;

		clickhouse: {
			client: ReturnType<typeof createClient>;
			ping(): Promise<boolean>;
			close(): Promise<void>;
		};
	}

	interface FastifyRequest {
		user?: JWTPayload;
	}
}
