import { LabelHTMLAttributes } from "preact";
import { twMerge } from "tailwind-merge";

export function Label(props: LabelHTMLAttributes) {
	return (
		<label
			{...props}
			class={twMerge("block text-sm font-medium text-gray-700", props.class as string ?? "")}
		/>
	);
}
