import z from "zod";

import { define } from "$/utils.ts";
import { db } from "$/src/db.ts";

const ColumnData = z.object({
	board_id: z.string(),
	name: z.optional(z.string()),
	order: z.number(),
});

export const handler = define.handlers({
	async POST(ctx) {
		const r = ColumnData.safeParse(await ctx.req.json());
		if (!r.success) {
			return new Response(`Dados errados: ${r.error.issues.map((error) => error.message).join(", ")}`, {
				status: 400,
			});
		}

		const new_column = await db.create_entry("board_columns", {
			board_id: r.data.board_id,
			name: r.data.name ?? "Nova coluna",
			order: r.data.order,
		});

		return Response.json(new_column, { status: 201 });
	},
});
