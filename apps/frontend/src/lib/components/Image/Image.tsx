"use client";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";
import { default as NextImage } from "next/image";
import type { ImageProps } from "./types";
import { useState } from "react";

const defaultSkeletonStyle = "w-full h-full animate-pulse bg-gray-300 dark:bg-gray-700";

export function Image({ src, alt, skeletonClassName, ...rest }: ImageProps) {
	const [error, setError] = useState(false);

	return (
		<Suspense fallback={<div className={twMerge(defaultSkeletonStyle, skeletonClassName)} />}>
			<NextImage
				src={error ? "/common/empty-image.png" : src}
				alt={alt ?? ""}
				fill={!rest.height || !rest.width}
				className={twMerge("object-contain", rest.className)}
				onError={(e) => {
					console.warn("Image failed to load", e, src);
					setError(true);
				}}
				{...rest}
			/>
		</Suspense>
	);
}

export default Image;
