import type { Serialized } from "./utils";

export type ErrorResponse = {
	path: string;
	name: string;
	cause: string;
};

type JSONPrimitive = string | number | boolean | null;

export type JSONStructure =
	| {
			[key in string]: JSONPrimitive | JSONStructure | (JSONStructure | JSONPrimitive)[];
	  }
	| JSONStructure[];

type Metadata = {
	success: boolean;
	timestamp: string;
};

type Content<T extends JSONStructure> = {
	data: T | null;
	error: ErrorResponse | null;
};

export type SerializedResponsePayload<T extends JSONStructure> = Metadata & {
	[K in keyof Content<T>]: Serialized<Content<T>[K]>;
};

export type ResponsePayload<T extends JSONStructure> = Metadata & Content<T>;
