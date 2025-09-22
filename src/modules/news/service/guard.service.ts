import type { FastifyRequest } from "fastify";

export default function getUserId(request: FastifyRequest): string {
	const user = request.user as { id?: string } | undefined;
	if (!user?.id) {
		throw new Error("Unauthorized: User ID not found");
	}
	return user.id;
}

