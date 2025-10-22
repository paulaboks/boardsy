import z from "zod";

import { define } from "$/utils.ts";
import { db } from "$/src/db.ts";

const TaskData = z.object({
	id: z.optional(z.string()),
	data_created: z.optional(z.string()),
	name: z.string(),
	description: z.string(),
	color: z.string(),
	board_id: z.string(),
	column_id: z.string(),
});

export const handler = define.handlers({
	async POST(ctx) {
		const r = TaskData.safeParse(await ctx.req.json());
		if (!r.success) {
			return Response.json(
				{ error: `Dados errados: ${r.error.issues.map((error) => error.message).join(", ")}` },
				{ status: 400 },
			);
		}

		const new_task = await db.create_entry("board_tasks", {
			user_id: ctx.state.user.id,
			board_id: r.data.board_id,
			column_id: r.data.column_id,
			name: r.data.name,
			description: r.data.description,
			color: r.data.color,
		});

		return Response.json(new_task, { status: 201 });
	},
	async PUT(ctx) {
		const r = TaskData.safeParse(await ctx.req.json());
		if (!r.success) {
			return Response.json(
				{ error: `Dados errados: ${r.error.issues.map((error) => error.message).join(", ")}` },
				{ status: 400 },
			);
		}

		if (!r.data.id) {
			return Response.json(
				{ error: `Sem id` },
				{ status: 400 },
			);
		}

		await db.update_entry("board_tasks", r.data);

		return Response.json(true, { status: 201 });
	},
});
