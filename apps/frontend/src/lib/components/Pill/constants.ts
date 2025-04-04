import type { PillColor } from "./types";

export const twPillStyles: Record<PillColor, string> = {
	info: `
  py-2 px-4 shadow-sm no-underline rounded-full 
  bg-orange-600/90 text-white font-medium text-xs 
  border-orange btn-primary 
  dark:bg-orange-500/90 
  `,
	danger: `
  py-2 px-4 shadow-sm no-underline rounded-full
  bg-red-700 text-white font-medium text-xs
  border-red btn-danger
  dark:bg-red-500
  `,
	warning: `
  py-2 px-4 shadow-sm no-underline rounded-full
  bg-yellow-700 text-white font-medium text-xs
  border-yellow btn-warning
  dark:bg-yellow-500
  `,
	success: `
  py-2 px-4 shadow-sm no-underline rounded-full
  bg-green-700 text-white font-medium text-xs
  border-green btn-success
  dark:bg-green-500
  `,
};
