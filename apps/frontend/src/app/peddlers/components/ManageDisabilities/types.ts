import type { Disability } from "@shared/common/types";
import type { QueryResult } from "@utils";

export interface ManageDisabilitiesProps {
	disabilities: Promise<Pick<QueryResult<Disability[]>, "data" | "error">>;
}
