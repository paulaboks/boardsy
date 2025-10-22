import { hash } from "@denorg/scrypt";
import z from "zod";

import { define } from "$/utils.ts";
import { Label } from "$/components/Label.tsx";
import { Input } from "$/components/Input.tsx";
import { Button } from "$/components/Button.tsx";
import { Flashes } from "$/components/Flashes.tsx";
import { flash, redirect, redirect_to_origin } from "pocksy";
import { db } from "$/src/db.ts";
import { UserLevel } from "$/src/constants.ts";

const SignupForm = z.object({
	name: z.string().max(128),
	email: z.email({ error: "Email invalido" }).max(64),
	password: z.string(),
});

export const handler = define.handlers({
	POST: async (ctx) => {
		const form = Object.fromEntries((await ctx.req.formData()).entries());
		const r = SignupForm.safeParse(form);
		if (!r.success) {
			for (const error of r.error.issues) {
				flash(ctx.state.session, `error::Dados errados: ${error.message}`);
			}
			return redirect_to_origin(ctx.req);
		}

		// TODO: Email approval
		// const email_approved = await db.get_entry_by_index("approved_emails", "email", r.data.email);
		// if (!email_approved) {
		// 	flash(ctx.state.session, "error::Email não aprovado");
		// 	return redirect_to_origin(ctx.req);
		// }

		const maybe_user = await db.get_entry_by_index(
			"users",
			"email",
			r.data.email,
		);
		if (maybe_user) {
			flash(ctx.state.session, "error::Email ja cadastrado");
			return redirect_to_origin(ctx.req);
		}

		await db.create_entry("users", {
			email: r.data.email,
			password_hash: hash(r.data.password),
			name: r.data.name,
			user_level: UserLevel.user,
		});

		return redirect("/login");
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
						<Label for="name">Nome</Label>
						<Input type="text" name="name" required />
					</div>
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
						Cadastrar
					</Button>
				</form>

				<div class="mt-6 text-center text-sm text-gray-500">
					<span class="mr-0.5">Já tem uma conta?</span>
					<a href="/login" class="text-indigo-600 hover:underline">Login</a>
				</div>
			</div>
		</main>
	);
});
