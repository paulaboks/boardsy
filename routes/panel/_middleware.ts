import { flash, redirect } from "pocksy";

import { define } from "$/utils.ts";

export const handler = define.middleware((ctx) => {
	if (!ctx.state.user?.id) {
		flash(ctx.state.session, "error::Faça login antes");
		return redirect("/login");
	}

	return ctx.next();
});
