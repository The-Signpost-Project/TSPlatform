"use client";
import type { VerifyAccountRowProps } from "./types";
import { Text, Button } from "@lib/components";
import { useTransition } from "react";

export function VerifyAccountRow({ onClick, isVerified }: VerifyAccountRowProps) {
	const [isPending, startTransition] = useTransition();

	return (
		<div className="flex gap-2 p-2 items-center justify-between">
			<Text order="lg">Verify Email</Text>
			{!isVerified ? (
				<Button
					onClick={() => startTransition(onClick)}
					color="info"
					disabled={isPending}
					variant="outlined"
				>
					Verify
				</Button>
			) : (
				<Text order="sm" className="flex items-center gap-1">
					<span>
						<svg
							className="w-6 h-6 text-green-600 dark:text-green-500"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							fill="none"
							viewBox="0 0 24 24"
						>
							<path
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 11.917 9.724 16.5 19 7.5"
							/>
						</svg>
					</span>
					Verified
				</Text>
			)}
		</div>
	);
}
