import { define } from "$/utils.ts";

export default define.page(function () {
	return (
		<main class="flex items-center justify-center min-h-screen">
			<div class="bg-white shadow-lg rounded-lg p-10 w-full max-w-lg text-center">
				<h1 class="text-4xl font-bold text-gray-800 mb-4">Boardsy</h1>
				<p class="text-gray-600 mb-8 text-lg">
					Organização 👍
				</p>

				<div class="flex justify-center space-x-4">
					<a
						href="/login"
						class="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition"
					>
						Login
					</a>
					<a
						href="/register"
						class="px-6 py-2 border border-indigo-600 text-indigo-600 rounded-md font-semibold hover:bg-indigo-50 transition"
					>
						Cadastrar
					</a>
				</div>
			</div>
		</main>
	);
});
