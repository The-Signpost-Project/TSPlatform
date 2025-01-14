"use client";
import { Suspense } from "react";
import { twMerge } from "tailwind-merge";
import { default as NextImage } from "next/image";
import type { ImageProps } from "./types";
import { useState } from "react";

const defaultSkeletonStyle = "w-full h-full animate-pulse bg-gray-300 dark:bg-gray-700";

export function Image({ src, alt, skeletonClassName, ...rest }: ImageProps) {
	const [imgSrc, setImgSrc] = useState(src);

	return (
		<Suspense fallback={<div className={twMerge(defaultSkeletonStyle, skeletonClassName)} />}>
			<NextImage
				src={imgSrc}
				alt={alt ?? ""}
				fill={!rest.height || !rest.width}
				className={twMerge("object-contain", rest.className)}
				onError={(e) => {
					console.warn(e);
					setImgSrc("/common/empty-image.png");
				}}
				{...rest}
			/>
		</Suspense>
	);
}

export default Image;
