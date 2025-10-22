import { flash, login, redirect } from "pocksy";
import { z } from "zod";
import { verify } from "@denorg/scrypt";

import { define } from "$/utils.ts";
import { Label } from "$/components/Label.tsx";
import { Input } from "$/components/Input.tsx";
import { Button } from "$/components/Button.tsx";
import { Flashes } from "$/components/Flashes.tsx";
import { db } from "$/src/db.ts";

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

const LoginForm = z.object({
	email: z.email({ error: "Email invalido" }).max(64),
	password: z.string(),
});

export const handler = define.handlers({
	async POST(ctx) {
		const form = Object.fromEntries((await ctx.req.formData()).entries());
		const r = LoginForm.safeParse(form);
		if (!r.success) {
			for (const error of r.error.issues) {
				flash(ctx.state.session, `error::Dados errados: ${error.message}`);
			}
			return redirect("/login");
		}

		const user = await db.get_entry_by_index(
			"users",
			"email",
			r.data.email,
		);

		if (!user) {
			flash(ctx.state.session, "error::Email ou senha incorretos");
			return redirect("/login");
		}

		if (!verify(r.data.password, user.password_hash!)) {
			flash(ctx.state.session, "error::Email ou senha incorretos");
			return redirect("/login");
		}

		const now = Date.now();
		login(ctx.state.cookies, user.id, now + ONE_YEAR);

		return redirect("/painel");
	},
});

export default define.page(function (ctx) {
	return (
		<main class="flex items-center justify-center min-h-screen">
			<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
				<Flashes session={ctx.state.session} />
				<div class="text-center mb-6">
					<h1 class="text-3xl font-bold text-gray-800">Boardsy</h1>
				</div>

				<form action="#" method="POST" class="space-y-5">
					<div>
						<Label for="email">Email</Label>
						<Input type="email" name="email" required />
					</div>

					<div>
						<Label for="password">Senha</Label>
						<Input
							type="password"
							name="password"
							required
						/>
					</div>

					<Button type="submit">
						Logar
					</Button>
				</form>

				<div class="mt-6 text-center text-sm text-gray-500">
					<span class="mr-0.5">Não tem uma conta?</span>
					<a href="/register" class="text-indigo-600 hover:underline">Cadastre-se</a>
				</div>
			</div>
		</main>
	);
});
