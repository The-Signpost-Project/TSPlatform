import type { InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

const defaultClassName = `relative w-11 h-6 
  bg-gray-200 dark:bg-gray-700 rounded-full 
  peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 
  peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white 
  after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
  dark:border-gray-600 peer-checked:bg-blue-600`;

export function Toggle({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
	const styles = twMerge(defaultClassName, className);

	return (
		<label className="inline-flex items-center cursor-pointer">
			<input type="checkbox" className="sr-only peer" {...rest} />
			<div className={styles} />
		</label>
	);
}
