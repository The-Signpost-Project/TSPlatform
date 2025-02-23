import type { AddButtonProps } from "./types";
import { Button } from "@lib/components";

export function AddButton({ subject, onClick }: AddButtonProps) {
	return (
		<Button
			onClick={onClick}
			type="button"
			className="flex items-center text-nowrap gap-2"
			variant="outlined"
			icon={
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="2.5"
					stroke="currentColor"
					className="w-4 h-4 text-orange-500 dark:text-orange-400"
					aria-hidden="true"
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
				</svg>
			}
		>
			Add {subject}
		</Button>
	);
}
