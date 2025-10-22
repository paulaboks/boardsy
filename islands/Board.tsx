import { useSignal } from "@preact/signals";

import type { Board, BoardColumns, BoardTasks } from "$/src/db.ts";
import Modal from "./Modal.tsx";
import { Label } from "$/components/Label.tsx";
import { Input } from "$/components/Input.tsx";
import { Button } from "$/components/Button.tsx";
import { TextArea } from "$/components/TextArea.tsx";

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

	const new_task_is_open = useSignal(false);
	const column_edit_is_open = useSignal(false);
	const column_selected = useSignal<BoardColumns | undefined>(undefined);

	return (
		<>
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
							onDrop={async () => {
								if (dragging_task.value) {
									dragging_task.value.column_id = column.id;
									await fetch("/panel/boards/api/tasks", {
										method: "PUT",
										headers: {
											"Accept": "application/json",
											"Content-Type": "application/json",
										},
										body: JSON.stringify(dragging_task.value),
									});
									tasks.value = [...tasks.value];
								}
							}}
						>
							<div class="p-4 border-b border-gray-200 flex flex-row">
								<h2 class="font-semibold text-lg text-gray-700 grow">{column.name}</h2>
								<button
									type="button"
									onClick={() => {
										column_edit_is_open.value = true;
										column_selected.value = column;
									}}
								>
									⚙️
								</button>
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
										new_task_is_open.value = true;
										column_selected.value = column;
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
								onClick={async () => {
									const order = columns.value.length;
									const response = await fetch("/panel/boards/api/columns", {
										method: "POST",
										headers: {
											"Accept": "application/json",
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											board_id: board.value.id,
											order,
										}),
									});
									if (response.ok) {
										columns.value = [...columns.value, await response.json()];
									}
								}}
							>
								+ Nova coluna
							</button>
						</div>
					</div>
				</div>
			</main>
			<Modal is_open={new_task_is_open}>
				<form
					class="p-4 flex flex-col gap-3"
					onSubmit={async (event) => {
						event.preventDefault();
						const formdata = new FormData(event.currentTarget);
						const data = Object.fromEntries(formdata.entries());
						const response = await fetch("/panel/boards/api/tasks", {
							method: "POST",
							headers: {
								"Accept": "application/json",
								"Content-Type": "application/json",
							},
							body: JSON.stringify(data),
						});
						if (response.ok) {
							tasks.value = [...tasks.value, await response.json()];
						}
						new_task_is_open.value = false;
					}}
				>
					<input type="hidden" name="board_id" value={board.value.id} />
					<input type="hidden" name="column_id" value={column_selected.value?.id} />
					<div>
						<Label>Nome da tarefa</Label>
						<Input name="name" />
					</div>
					<div>
						<Label>Descrição</Label>
						<TextArea name="description" rows={3} />
					</div>
					<div class="flex flex-row gap-2 items-center">
						<Label>Cor da tarefa</Label>
						<Input type="color" name="color" class="p-0 w-10" value="#ffffff" />
					</div>
					<Button type="submit">Criar tarefa</Button>
				</form>
			</Modal>
			<Modal is_open={column_edit_is_open}>
				<form
					class="p-4 flex flex-col gap-3"
					onSubmit={async (event) => {
						event.preventDefault();
						const formdata = new FormData(event.currentTarget);
						const data = {
							order: column_selected.value?.order,
							...Object.fromEntries(formdata.entries()),
						};
						const response = await fetch("/panel/boards/api/columns", {
							method: "PUT",
							headers: {
								"Accept": "application/json",
								"Content-Type": "application/json",
							},
							body: JSON.stringify(data),
						});
						if (response.ok) {
							tasks.value = [...tasks.value, await response.json()];
						}
						new_task_is_open.value = false;
					}}
				>
					<input type="hidden" name="id" value={column_selected.value?.id} />
					<input type="hidden" name="board_id" value={board.value.id} />
					<div>
						<Label>Nome da coluna</Label>
						<Input name="name" value={column_selected.value?.name} />
					</div>

					<Button type="submit">Editar coluna</Button>
				</form>
			</Modal>
		</>
	);
}
