export interface PaginationProps {
	labels?: [string, string];
	onClickNext: () => void;
	onClickPrevious: () => void;
	disableNext: boolean;
	disablePrevious: boolean;
}
