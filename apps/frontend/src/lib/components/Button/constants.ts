import type { ButtonColor, ButtonVariant } from "./types";
import { twMerge } from "tailwind-merge";

// Define common base styles used by all buttons.
export const twButtonBaseStyles = `
  border focus:ring-4 focus:outline-hidden focus:ring-offset-2 focus:ring-2 focus:ring-inherit
  font-medium rounded-lg text-sm px-5 py-2.5 text-center
`.trim();

interface ComputeButtonStylesParams {
	textColor: string; // for oulined and ghost variants (else white for solid)
	textHoverColor: string; // for outlined and ghost variants
	borderColor: string; // for solid and outlined variants
	bgColor: string; // for solid variant
}

function computeVariantStyles(
	variant: ButtonVariant,
	{ textColor, bgColor, textHoverColor, borderColor }: ComputeButtonStylesParams,
) {
	switch (variant) {
		case "solid": {
			return twMerge("text-gray-50 dark:text-white", bgColor, borderColor);
		}
		case "outlined": {
			return twMerge(textColor, textHoverColor, borderColor);
		}
		case "ghost": {
			return twMerge(textColor, textHoverColor, "border-none");
		}
	}
}

export function getTwButtonStyles(color: ButtonColor, variant: ButtonVariant) {
	switch (color) {
		case "info": {
			return computeVariantStyles(variant, {
				textColor: "text-orange-500 dark:text-orange-400",
				textHoverColor: "hover:text-orange-600 dark:hover:text-orange-300",
				borderColor: "border-orange-500 dark:border-orange-400",
				bgColor:
					"bg-orange-500 dark:bg-orange-400 hover:bg-orange-600/70 dark:hover:bg-orange-400/70",
			});
		}
		case "danger": {
			return computeVariantStyles(variant, {
				textColor: "text-red-700 dark:text-red-500",
				textHoverColor: "hover:text-red-800 dark:hover:text-red-400",
				borderColor: "border-red-700 dark:border-red-500",
				bgColor: "bg-red-700 dark:bg-red-500 hover:bg-red-800/70 dark:hover:bg-red-500/70",
			});
		}

		case "warning": {
			return computeVariantStyles(variant, {
				textColor: "text-yellow-700 dark:text-yellow-600",
				textHoverColor: "hover:text-yellow-800 dark:hover:text-yellow-400",
				borderColor: "border-yellow-700 dark:border-yellow-600",
				bgColor:
					"bg-yellow-700 dark:bg-yellow-600 hover:bg-yellow-800/70 dark:hover:bg-yellow-600/70",
			});
		}

		case "success": {
			return computeVariantStyles(variant, {
				textColor: "text-green-700 dark:text-green-500",
				textHoverColor: "hover:text-green-800 dark:hover:text-green-400",
				borderColor: "border-green-700 dark:border-green-500",
				bgColor: "bg-green-700 dark:bg-green-500 hover:bg-green-800/70 dark:hover:bg-green-500/70",
			});
		}
	}
}

export const twDisabledButtonStyles = `
  opacity-50 cursor-not-allowed
  hover:bg-opacity-0 
  active:bg-opacity-0
` as const;

export const buttonRawColors: Record<ButtonColor, string> = {
	info: "orange",
	danger: "red",
	warning: "yellow",
	success: "green",
} as const;
