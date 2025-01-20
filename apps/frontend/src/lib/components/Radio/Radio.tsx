"use client";
import * as RadioGroup from "@radix-ui/react-radio-group";
import type { RadioRootProps, RadioItemProps } from "./types";
import { useId } from "react";
import { twMerge } from "tailwind-merge";

export function RadioRoot(props: RadioRootProps) {
	return <RadioGroup.Root {...props} />;
}

export function RadioItem({ className, children, ...props }: RadioItemProps) {
	const id = useId();
	return (
		<div className={twMerge("flex items-center gap-2", className)}>
			<RadioGroup.Item
				{...props}
				id={id}
				className="flex items-center justify-center w-5 h-5 bg-orange-500 dark:bg-orange-400 rounded-full"
			>
				<RadioGroup.Indicator className="bg-white w-3/5 h-3/5 rounded-full" />
			</RadioGroup.Item>
			<label htmlFor={id} className="text-gray-600 dark:text-gray-400">
				{children}
			</label>
		</div>
	);
}
