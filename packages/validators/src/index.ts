import { z } from "zod";
import { AssetStatus, Role, TicketPriority, TicketStatus } from "@techdesk-pro/constants";

const roleSchema = z.nativeEnum(Role);
const ticketStatusSchema = z.nativeEnum(TicketStatus);
const ticketPrioritySchema = z.nativeEnum(TicketPriority);
const assetStatusSchema = z.nativeEnum(AssetStatus);

export const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8)
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	name: z.string().min(2),
	role: roleSchema.default(Role.EMPLOYEE)
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1)
});
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

export const AuthSchemas = {
	loginSchema,
	registerSchema,
	refreshTokenSchema
};

export const createTicketSchema = z.object({
	title: z.string().min(3).max(120),
	description: z.string().min(5).max(2000),
	priority: ticketPrioritySchema,
	assetId: z.string().cuid().optional()
});
export type CreateTicketInput = z.infer<typeof createTicketSchema>;

export const updateTicketSchema = z.object({
	title: z.string().min(3).max(120).optional(),
	description: z.string().min(5).max(2000).optional(),
	status: ticketStatusSchema.optional(),
	priority: ticketPrioritySchema.optional(),
	assignedToId: z.string().cuid().nullable().optional(),
	assetId: z.string().cuid().nullable().optional()
});
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;

export const addCommentSchema = z.object({
	content: z.string().min(1).max(1000)
});
export type AddCommentInput = z.infer<typeof addCommentSchema>;

export const ticketFilterSchema = z.object({
	page: z.coerce.number().int().min(1).default(1),
	limit: z.coerce.number().int().min(1).max(100).default(20),
	status: ticketStatusSchema.optional(),
	priority: ticketPrioritySchema.optional(),
	q: z.string().optional()
});
export type TicketFilterInput = z.infer<typeof ticketFilterSchema>;

export const TicketSchemas = {
	createTicketSchema,
	updateTicketSchema,
	addCommentSchema,
	ticketFilterSchema
};

export const createAssetSchema = z.object({
	name: z.string().min(2),
	category: z.string().min(2),
	serialNumber: z.string().min(2),
	model: z.string().min(1),
	manufacturer: z.string().min(1),
	purchaseDate: z.coerce.date().optional(),
	status: assetStatusSchema.default(AssetStatus.AVAILABLE),
	notes: z.string().optional()
});
export type CreateAssetInput = z.infer<typeof createAssetSchema>;

export const updateAssetSchema = z.object({
	name: z.string().min(2).optional(),
	category: z.string().min(2).optional(),
	serialNumber: z.string().min(2).optional(),
	model: z.string().min(1).optional(),
	manufacturer: z.string().min(1).optional(),
	purchaseDate: z.coerce.date().nullable().optional(),
	status: assetStatusSchema.optional(),
	notes: z.string().nullable().optional()
});
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;

export const assignAssetSchema = z.object({
	userId: z.string().cuid(),
	notes: z.string().optional()
});
export type AssignAssetInput = z.infer<typeof assignAssetSchema>;

export const AssetSchemas = {
	createAssetSchema,
	updateAssetSchema,
	assignAssetSchema
};

export const updateUserRoleSchema = z.object({
	role: roleSchema
});
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export const UserSchemas = {
	updateUserRoleSchema
};
