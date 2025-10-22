import { ComponentChildren } from "preact";
import { useRef } from "preact/hooks";
import { Signal, useSignalEffect } from "@preact/signals";
import { twMerge } from "tailwind-merge";

interface ModalProps {
	children: ComponentChildren;
	is_open: Signal<boolean>;
	class?: string;
}

export default function Modal(props: ModalProps) {
	const dialog_ref = useRef<HTMLDialogElement>(null);

	useSignalEffect(() => {
		if (props.is_open.value) {
			dialog_ref.current?.showModal();
		} else {
			dialog_ref.current?.close();
		}
	});

	return (
		<dialog
			class={twMerge(`bg-white rounded-lg w-xl p-0 m-auto`, props.class ?? "")}
			ref={dialog_ref}
			onClick={(event) => {
				if (event.target === dialog_ref.current) {
					props.is_open.value = false;
				}
			}}
		>
			<div class="bg-gray-100 border-b border-gray-200 flex">
				<div class="flex-grow"></div>
				<button type="button" class="pr-1" onClick={() => props.is_open.value = false}>
					X
				</button>
			</div>
			{props.children}
		</dialog>
	);
}
