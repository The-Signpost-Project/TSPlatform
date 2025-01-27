import type { StrictPeddler } from "@shared/common/types";

export interface EditPeddlerProps {
	peddler: StrictPeddler;
	revalidate: (controller: AbortController) => void;
}
