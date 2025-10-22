import { define } from "$/utils.ts";
import { Button } from "$/components/Button.tsx";
import { db } from "$/src/db.ts";

export default define.page(async function (ctx) {
	const memberships = await db.get_entries_by_index("board_members", "user_id", ctx.state.user.id);
	const boards = await Promise.all(
		memberships.map(async (membership) => await db.get_entry("boards", membership.board_id!)),
	);

	return (
		<main class="min-h-screen py-10 px-4">
			<div class="max-w-4xl mx-auto">
				<div class="flex justify-between items-center mb-8">
					<h1 class="text-3xl font-bold text-gray-800">Seus quadros</h1>
					<form action="/panel/boards/new" method="POST">
						<Button type="submit">+ Criar novo quadro</Button>
					</form>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{boards.map((board) => (
						<a
							key={board?.id}
							href={`/panel/boards/${board?.id}`}
							class="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
						>
							<h2 class="text-xl font-semibold text-gray-800">{board?.name}</h2>
							<p class="text-gray-500 text-sm mt-2">{board?.description}</p>
						</a>
					))}
				</div>
			</div>
		</main>
	);
});
