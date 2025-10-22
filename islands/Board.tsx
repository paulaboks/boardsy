import { useSignal } from "@preact/signals";

import type { Board, BoardColumns, BoardTasks } from "$/src/db.ts";

interface BoardProps {
	board: Board;
	columns: BoardColumns[];
	tasks: BoardTasks[];
}

export default function Board(props: BoardProps) {
	const board = useSignal(props.board);
	const columns = useSignal(props.columns);
	const tasks = useSignal(props.tasks);
	const dragging_task = useSignal<BoardTasks | undefined>(undefined);

	return (
		<main class="min-h-screen p-6">
			<header class="mb-6">
				<h1 class="text-3xl font-bold text-gray-800">{board.value.name}</h1>
				<p class="text-gray-700">aa{board.value.description}</p>
			</header>

			<div class="flex items-start space-x-6 overflow-x-auto pb-4">
				{columns.value.map((column) => (
					<div
						key={column.id}
						class="bg-gray-50 rounded-lg shadow-md w-80 flex-shrink-1 flex flex-col"
						onDragOver={(event) => {
							if (event.dataTransfer?.types.includes("task")) {
								event.preventDefault();
							}
						}}
						onDrop={() => {
							if (dragging_task.value) {
								dragging_task.value.column_id = column.id;
								tasks.value = [...tasks.value];
							}
						}}
					>
						<div class="p-4 border-b border-gray-200">
							<h2 class="font-semibold text-lg text-gray-700">{column.name}</h2>
						</div>
						<div class="flex-1 p-4 space-y-4 overflow-y-auto">
							{tasks.value.filter((task) => task.column_id === column.id).map((task) => (
								<div
									key={task.id}
									class="bg-white p-4 rounded shadow hover:shadow-md transition cursor-move"
									draggable
									onDragStart={(event) => {
										dragging_task.value = task;
										event.dataTransfer!.effectAllowed = "move";
										// Custom type to identify a task drag
										event.dataTransfer?.setData("task", "");
									}}
									onDragEnd={() => {
										dragging_task.value = undefined;
									}}
								>
									<p class="font-medium text-gray-800">{task.name}</p>
								</div>
							))}
						</div>
						<div class="p-4 border-t border-gray-300">
							<button
								type="button"
								class="text-sm text-indigo-600 font-medium"
								onClick={() => {
									tasks.value = [
										...tasks.value,
										{
											id: crypto.randomUUID(),
											name: "Nova tarefa",
											date_created: "",
											column_id: column.id,
										},
									];
								}}
							>
								+ Nova tarefa
							</button>
						</div>
					</div>
				))}

				<div class="bg-gray-50 rounded-lg shadow-md w-80 flex-shrink-1 flex flex-col">
					<div class="p-4">
						<button
							type="button"
							class="text-sm text-indigo-600 font-medium"
							onClick={() => {
								const order = columns.value.length;
								columns.value = [
									...columns.value,
									{ id: String(order), name: "Nova coluna", date_created: "", order },
								];
							}}
						>
							+ Nova coluna
						</button>
					</div>
				</div>
			</div>
		</main>
	);
}
