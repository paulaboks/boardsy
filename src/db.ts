/// <reference lib="deno.unstable" />
import { Database, Model } from "boksy";

export type Schema = {
	users: {
		email: string;
		password_hash: string;
		user_level: number;

		name: string;
	};
};

export type User = Partial<Model & Schema["users"]>;

export const db = new Database<Schema>(
	await Deno.openKv(undefined),
	{
		users: ["email"],
	},
);
