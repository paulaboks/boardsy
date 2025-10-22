import { define } from "$/utils.ts";

export default define.page(function ({ Component }) {
	return (
		<html lang="pt-br">
			<head>
				<meta charset="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Boardsy</title>
			</head>
			<body class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
				<Component />
			</body>
		</html>
	);
});
