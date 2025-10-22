import { define } from "$/utils.ts";
import { Label } from "$/components/Label.tsx";
import { Input } from "$/components/Input.tsx";
import { Button } from "$/components/Button.tsx";

export default define.page(function () {
	return (
		<main class="flex items-center justify-center min-h-screen">
			<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
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
