/// <reference lib="deno.unstable" />
import { Database, Model } from "boksy";

export type Schema = {
	users: {
		email: string;
		password_hash: string;
		user_level: number;

		name: string;
	};
	boards: {
		name: string;
		description: string;
	};
	board_members: {
		board_id: string;
		user_id: string;
		user_permission: number;
	};
	board_columns: {
		board_id: string;
		name: string;
		order: number;
	};
	board_tasks: {
		board_id: string;
		user_id: string;
		column_id: string;

		name: string;
		description: string;
		color: string;
	};
};

export type User = Model & Partial<Schema["users"]>;
export type Board = Model & Partial<Schema["boards"]>;
export type BoardColumns = Model & Partial<Schema["board_columns"]>;
export type BoardTasks = Model & Partial<Schema["board_tasks"]>;

export const db = new Database<Schema>(
	await Deno.openKv(undefined),
	{
		users: ["email"],
		board_members: ["board_id", "user_id"],
		board_columns: ["board_id"],
		board_tasks: ["board_id"],
	},
);
