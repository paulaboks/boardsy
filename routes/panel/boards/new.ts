import { redirect } from "pocksy";

import { define } from "$/utils.ts";
import { db } from "$/src/db.ts";
import { UserBoardPermission } from "$/src/constants.ts";

export const handler = define.handlers({
	async POST(ctx) {
		// Create the board
		const new_board = await db.create_entry("boards", {
			name: "New board",
			description: "",
		});

		// Make sure the creator is an owner
		await db.create_entry("board_members", {
			board_id: new_board.id,
			user_id: ctx.state.user.id,
			user_permission: UserBoardPermission.owner,
		});

		return redirect(`/panel/boards/${new_board.id}`);
	},
});
