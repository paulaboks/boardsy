import { logout, redirect } from "pocksy";

import { define } from "$/utils.ts";

export const handler = define.handlers((ctx) => {
	logout(ctx.state.cookies);
	return redirect("/login");
});
