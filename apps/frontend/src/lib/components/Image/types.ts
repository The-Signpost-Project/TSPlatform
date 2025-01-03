import type { ImageProps as NextImageProps } from "next/image";

export interface ImageProps extends Omit<NextImageProps, "alt"> {
	alt?: string;
	skeletonClassName?: string;
}
