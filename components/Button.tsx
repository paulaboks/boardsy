import { ButtonHTMLAttributes } from "preact";
import { twMerge } from "tailwind-merge";

export function Button(props: ButtonHTMLAttributes) {
	return (
		<button
			{...props}
			class={twMerge(
				"w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md transition duration-200",
				props.class as string ?? "",
			)}
		/>
	);
}
