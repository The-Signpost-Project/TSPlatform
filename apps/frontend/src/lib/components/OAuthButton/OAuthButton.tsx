"use client";

import { toast } from "react-hot-toast";
import { Button, Image } from "@lib/components";
import { useRouter } from "next/navigation";
import { query } from "@utils";
import type { OAuthButtonProps } from "./types";
import { OpenAuthUrlSchema } from "@shared/common/schemas";
import { useTransition } from "react";

export function OAuthButton({ location, iconPath, name }: OAuthButtonProps) {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const initOAuth = async () => {
		const { data, status } = await query({
			path: location,
			init: {
				method: "GET",
			},
			validator: OpenAuthUrlSchema,
		});

		if (status !== 200) {
			toast.error(`Failed to redirect to ${name} OAuth, try again later.`);
			return;
		}
		const url = data?.url;
		if (!url) {
			toast.error(`Failed to redirect to ${name} OAuth, try again later.`);
			return;
		}
		router.push(url);
	};

	return (
		<Button
			onClick={() => startTransition(initOAuth)}
			className="flex gap-1 items-center p-2 text-xs flex-grow"
			disabled={isPending}
		>
			<Image src={iconPath} alt="icon" width={24} height={24} />
			{name}
		</Button>
	);
}
