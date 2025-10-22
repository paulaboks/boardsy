import { createDefine } from "fresh";
import { State as PState } from "pocksy";
import { User } from "$/src/db.ts";

export interface State extends PState {
	user: User;
}

export const define = createDefine<State>();
