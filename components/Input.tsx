import { InputHTMLAttributes } from "preact";
import { twMerge } from "tailwind-merge";

export function Input(props: InputHTMLAttributes) {
	return (
		<input
			{...props}
			id={props.id ?? props.name}
			class={twMerge(
				"mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
				props.class as string ?? "",
			)}
		/>
	);
}
