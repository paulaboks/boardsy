import { get_flashed_messages, Session } from "pocksy";

interface StyledFlash {
	message: string;
	style: string;
}

const styles: Record<string, string> = {
	success: "bg-green-600",
	error: "bg-red-600",
};

interface FlashesProps {
	session: Session;
}

export function Flashes(props: FlashesProps) {
	const flashes = get_flashed_messages(props.session);

	const styled_flashes: StyledFlash[] = [];
	for (const flash of flashes) {
		const [type, message] = flash.split("::");
		styled_flashes.push({
			message,
			style: styles[type],
		});
	}

	return (
		<>
			{styled_flashes.map(
				(flash) => (
					<>
						<div
							class={`border border-black p-3 m-1 mb-3 mx-auto max-w-screen-md w-full rounded text-white font-bold
								${flash.style}`}
						>
							{flash.message}
						</div>
					</>
				),
			)}
		</>
	);
}
