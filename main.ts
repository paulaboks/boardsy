import { App, staticFiles } from "fresh";
import { blue, green, red, yellow } from "@std/fmt/colors";
import { CookieJar, flash, redirect, save_session, Session, start_session, verify_token } from "pocksy";

import { define, type State } from "$/utils.ts";
import { db } from "$/src/db.ts";

export const app = new App<State>();

app.use(staticFiles());

app.use(define.middleware(async (ctx) => {
	const req = ctx.req;
	let resp: Response;
	try {
		resp = await ctx.next();
	} catch (_error: unknown) {
		resp = new Response("Um erro ocorreu", { status: 500 });
		console.error(_error);
	}

	let draw_function = green;
	if (resp.status >= 300 && resp.status < 400) {
		draw_function = blue;
	}
	if (resp.status >= 400 && resp.status < 500) {
		draw_function = yellow;
	}
	if (resp.status >= 500) {
		draw_function = red;
	}
	console.log(draw_function(`[${req.method}] (${resp.status}) - ${req.url}`));
	return resp;
}));

app.use(async (ctx) => {
	ctx.state.cookies = CookieJar.from_string(ctx.req.headers.get("cookie"));
	ctx.state.session = new Session();

	await start_session(ctx.state);

	let auth = ctx.state.cookies.get("authorization")?.value;

	// Check if its logout to avoid infinite loop in case this redirects
	if (auth && !ctx.req.url.includes("/logout")) {
		auth = decodeURIComponent(auth);
		auth = auth.split("Bearer ")[1];

		try {
			// Throws if invalid token
			const user_id = await verify_token(auth);
			const user = await db.get_entry("users", user_id.data as string);

			if (!user) {
				flash(ctx.state.session, "error::Usuario não encontrado");
				return redirect("/logout");
			}
			ctx.state.user = user;
		} catch (_e) {
			// Erase the cookie if it is invalid
			return redirect("/logout");
		}
	}

	const resp = await ctx.next();

	await save_session(ctx.state);

	ctx.state.cookies.append_into_header(resp.headers);

	return resp;
});

// Include file-system based routes here
app.fsRoutes();
