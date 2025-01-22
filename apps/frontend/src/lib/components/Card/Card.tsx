import type { CardProps } from "./types";
import { twMerge } from "tailwind-merge";
import { Title, Text, Image } from "@lib/components";

const defaultStyles =
	"flex flex-col max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700";

export function Card({
	children,
	imgSrc,
	title,
	description,
	date,
	className,
	innerClassName,
	titleClassName,
	descriptionClassName,
	dateClassName,
	...rest
}: CardProps) {
	const mergedStyles = twMerge(defaultStyles, className);

	return (
		<div className={mergedStyles} {...rest}>
			{imgSrc && (
				<div className="relative w-full h-48">
					<Image
						src={imgSrc}
						alt={title ?? imgSrc}
						className="w-full object-cover object-center rounded-t-lg"
						skeletonClassName="rounded-t-lg min-h-64"
					/>
				</div>
			)}
			<div
				className={twMerge(
					"px-6 py-2 flex flex-col gap-4 items-center text-center",
					innerClassName,
				)}
			>
				{date && (
					<Text
						order="sm"
						data-testid="card-date"
						className={twMerge("sm:text-sm text-xs", dateClassName)}
					>
						{date}
					</Text>
				)}
				{title && (
					<Title order={2} className={twMerge("sm:text-xl text-lg", titleClassName)}>
						{title}
					</Title>
				)}
				{description && (
					<Text className={twMerge("sm:text-base text-sm", descriptionClassName)} description>
						{description}
					</Text>
				)}
				{children}
			</div>
		</div>
	);
}
