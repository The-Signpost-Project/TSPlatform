import { Button } from "@lib/components";
import type { PaginationProps } from "./types";

const defaultStyles = `
flex items-center justify-center 
text-gray-500 bg-white border border-gray-300 
hover:bg-gray-100 hover:text-gray-700 
dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
`;

export function Pagination({ showNext, showPrevious, hrefs, labels }: PaginationProps) {
	return (
		<div className="flex items-center gap-2" data-testid="pagination">
			{showPrevious && (
				<Button href={hrefs[0]} className={defaultStyles} data-testid="previous-button">
					<img src="/common/left-arrow.svg" alt="left arrow" className="w-4 h-4 me-2" />
					{labels[0]}
				</Button>
			)}
			{showNext && (
				<Button href={hrefs[1]} className={defaultStyles} data-testid="next-button">
					{labels[1]}
					<img src="/common/left-arrow.svg" alt="right arrow" className="w-4 h-4 ms-2 rotate-180" />
				</Button>
			)}
		</div>
	);
}
