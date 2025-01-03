/**
 * Type alias for a utility that creates a new type with the same shape as the given type `T`.
 * It's useful for improving the readability of complex types in error messages and IDE tooltips.
 *
 * @template T - The type to prettify.
 * @typedef {Object} Prettify
 */
export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

/**
 * Type representing a partial version of the given type `T`.
 * Useful for creating objects where some properties are optional.
 *
 * @template T - The type to create a partial version of.
 * @typedef {Object} DeepPartial
 */
export type DeepPartial<T> = T extends object
	? {
			[P in keyof T]?: DeepPartial<T[P]>;
		}
	: T;

/**
 * Type representing a serialized version of the given type `T`.
 * Useful for converting complex types to a JSON-serializable format.
 *
 * @template T - The type to serialize.
 * @typedef {Object} Serialized
 */
export type Serialized<T> = T extends string | number | boolean | null
	? T
	: T extends Array<infer U>
		? Array<Serialized<U>>
		: T extends Date
			? string
			: // biome-ignore lint/complexity/noBannedTypes: intentionally using Function as a type only
				T extends Function
				? never
				: T extends object
					? { [K in keyof T]: Serialized<T[K]> }
					: never;
