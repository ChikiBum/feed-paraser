import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createUserGridSettingsSchema } from "../schemas/createUserGridSettings.schema";
import { deleteUserGridSettingsSchema } from "../schemas/deleteUserGridSettingsSchema.schema";
import { getUserGridSettingsSchema } from "../schemas/getUserGridSettings.schema";
import { updateUserGridSettingsSchema } from "../schemas/updateUserGridSettingsSchema";
import type {
	GridSort,
	GridUserSettings,
	GridUserSettingsInput,
} from "../types/userGridSettings.type";

export async function userGridSettingsRoutes(fastify: FastifyInstance) {
	fastify.get(
		"/get-user-grid-settings",
		{
			preValidation: [fastify.authenticate],
			schema: getUserGridSettingsSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const userId = (request.user as { id: string }).id;
				const settings = await fastify.prisma.userGridSettings.findMany({
					where: { userId },
					orderBy: { createdAt: "desc" },
				});
				reply.send({ settings });
			} catch (err) {
				fastify.log.error("Error fetching user grid settings:", err);
				reply.internalServerError("Could not fetch grid settings");
			}
		},
	);

	fastify.post(
		"/save-user-grid-settings",
		{
			preValidation: [fastify.authenticate],
			schema: createUserGridSettingsSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const userId = (request.user as { id: string }).id;
				const body = request.body as GridUserSettingsInput;

				let settings: GridUserSettings;

				if (body.viewName) {
					settings = (await fastify.prisma.userGridSettings.upsert({
						where: {
							userId_viewName: {
								userId,
								viewName: body.viewName,
							},
						},
						update: {
							filters: body.filters,
							visibleColumns: body.visibleColumns,
							sort: body.sort,
							pageSize: body.pageSize,
							updatedAt: new Date(),
						},
						create: {
							userId,
							viewName: body.viewName,
							filters: body.filters,
							visibleColumns: body.visibleColumns,
							sort: body.sort,
							pageSize: body.pageSize,
						},
					})) as unknown as GridUserSettings;
				} else {
					settings = (await fastify.prisma.userGridSettings.create({
						data: {
							userId,
							filters: body.filters,
							visibleColumns: body.visibleColumns,
							sort: body.sort,
							pageSize: body.pageSize,
						},
					})) as unknown as GridUserSettings;
				}

				reply.code(201).send({
					settings: {
						...settings,
						viewName: settings.viewName ?? undefined,
					},
				});
			} catch (err) {
				fastify.log.error("Error saving user grid settings:", err);
				reply.badRequest("Invalid data");
			}
		},
	);

	fastify.patch(
		"/user-grid-settings/:id",
		{
			preValidation: [fastify.authenticate],
			schema: updateUserGridSettingsSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const userId = (request.user as { id: string }).id;
				const { id } = request.params as { id: string };
				const body = request.body as GridUserSettingsInput;

				const existing = await fastify.prisma.userGridSettings.findUnique({
					where: { id },
				});

				if (!existing || existing.userId !== userId) {
					return reply.code(404).send({ message: "Settings not found" });
				}

				const updated = await fastify.prisma.userGridSettings.update({
					where: { id },
					data: { ...body, updatedAt: new Date() },
				});

				const settings: GridUserSettings = {
					...updated,
					sort: updated.sort as GridSort[],
					filters: updated.filters as Record<string, any>,
					viewName: updated.viewName ?? undefined,
					createdAt:
						updated.createdAt instanceof Date
							? updated.createdAt.toISOString()
							: updated.createdAt,
					updatedAt:
						updated.updatedAt instanceof Date
							? updated.updatedAt.toISOString()
							: updated.updatedAt,
				};

				reply.send({ settings });
			} catch (err) {
				fastify.log.error("Error updating grid settings:", err);
				reply.badRequest("Invalid data");
			}
		},
	);

	fastify.delete(
		"/delete-user-grid-settings/:id",
		{
			preValidation: [fastify.authenticate],
			schema: deleteUserGridSettingsSchema,
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			try {
				const userId = (request.user as { id: string }).id;
				const { id } = request.params as { id: string };

				const existing = await fastify.prisma.userGridSettings.findUnique({
					where: { id },
				});

				if (!existing || existing.userId !== userId) {
					return reply.code(404).send({ message: "Settings not found" });
				}

				await fastify.prisma.userGridSettings.delete({
					where: { id },
				});

				reply.send({ success: true, message: "Settings deleted" });
			} catch (err) {
				fastify.log.error("Error deleting grid settings:", err);
				reply.badRequest("Invalid data");
			}
		},
	);
}
