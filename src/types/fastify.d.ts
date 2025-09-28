import type { PrismaClient } from "@prisma/client";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { Config } from "../config/schema";
import type { JWTPayload } from "../modules/auth/types";
import type { ToadScheduler } from "toad-scheduler";

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
	}

	interface FastifyRequest {
		user?: JWTPayload;
	}
}
