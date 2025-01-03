import { Suspense } from "react";
import { twMerge } from "tailwind-merge";
import { default as NextImage } from "next/image";
import type { ImageProps } from "./types";

const defaultSkeletonStyle = "w-full h-full animate-pulse bg-gray-300 dark:bg-gray-700";

export function Image({ src, alt, skeletonClassName, ...rest }: ImageProps) {
	return (
		<Suspense fallback={<div className={twMerge(defaultSkeletonStyle, skeletonClassName)} />}>
			<NextImage
				src={src}
				alt={alt ?? ""}
				fill={!rest.height || !rest.width}
				className={twMerge("object-contain", rest.className)}
				{...rest}
			/>
		</Suspense>
	);
}

export default Image;
