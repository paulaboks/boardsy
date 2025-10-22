import { flash, redirect } from "pocksy";

import { define } from "$/utils.ts";
import { Board as BoardType, BoardColumns, BoardTasks, db } from "$/src/db.ts";
import Board from "$/islands/Board.tsx";

export default define.page(async function (ctx) {
	const board_members = await db.get_entries_by_index("board_members", "board_id", ctx.params.board);
	if (!board_members.find((member) => member.user_id === ctx.state.user.id)) {
		flash(ctx.state.session, "Sem permissão");
		return redirect("/panel");
	}

	const board = await db.get_entry("boards", ctx.params.board);
	if (!board) {
		flash(ctx.state.session, "Algo de errado ocorreu");
		return redirect("/panel");
	}

	const columns = await db.get_entries_by_index("board_columns", "board_id", board.id!);
	const tasks = await db.get_entries_by_index("board_tasks", "board_id", board.id!);

	return (
		<Board
			board={board as unknown as BoardType}
			columns={columns as unknown as BoardColumns[]}
			tasks={tasks as unknown as BoardTasks[]}
		/>
	);
});
