import type { ResponsePayload, ErrorResponse, JSONStructure } from "@shared/common/types";

type ConstructResponseData = {
	data?: JSONStructure;
	error?: ErrorResponse;
};

export function constructResponse({
	data,
	error,
}: ConstructResponseData): ResponsePayload<JSONStructure> {
	return {
		success: !error,
		data: data ?? null,
		error: error ?? null,
		timestamp: new Date().toISOString(),
	};
}
