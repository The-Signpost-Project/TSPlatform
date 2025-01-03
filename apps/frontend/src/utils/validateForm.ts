import type { z, ZodType } from "zod";
import type { Prettify } from "@shared/common/types";

/**
 * Type alias for form errors. It represents a record where each key is a property of the validated data
 * and each value is an array of error messages.
 *
 * @template T - A Zod schema representing the shape of the validated data.
 * @typedef {Record<keyof T, string[]>} FormErrors
 */
// biome-ignore lint/suspicious/noExplicitAny: allow the use of any in this file
type FormErrors<T extends ZodType<any>> = Record<keyof T, string[]>;

/**
 * Type representing the result of form validation. It's a union type that represents either a successful validation
 * or a failed validation.
 *
 * In case of successful validation:
 * - `isValid` is `true`
 * - `parsedData` contains the validated data
 * - `errors` is an empty object
 *
 * In case of failed validation:
 * - `isValid` is `false`
 * - `errors` contains the validation errors
 *
 * @template T - A Zod schema representing the shape of the validated data.
 * @typedef {Object} ValidateFormResult
 * @property {boolean} isValid - Whether the validation was successful.
 * @property {T} parsedData - The validated data. Only present if `isValid` is `true`.
 * @property {Prettify<FormErrors<T>>} errors - The validation errors. Only present if `isValid` is `false`.
 */
// biome-ignore lint/suspicious/noExplicitAny: allow the use of any in this file
export type ValidateFormResult<T extends ZodType<any>> =
	| {
			isValid: false;
			parsedData?: never;
			errors: Prettify<FormErrors<T>>;
	  }
	| {
			isValid: true;
			parsedData: T;
			errors: Prettify<FormErrors<T>>;
	  };

/**
 * Validates form data against a Zod schema.
 *
 * @template T - A Zod schema representing the shape of the validated data.
 * @param {T} schema - The Zod schema to validate against.
 * @param {FormData} data - The form data to validate.
 * @returns {ValidateFormResult<z.infer<T>>} - The result of the form validation.
 */
// biome-ignore lint/suspicious/noExplicitAny: allow the use of any in this file
export function validateForm<T extends ZodType<any>>(
	schema: T,
	data: FormData,
): ValidateFormResult<z.infer<T>> {
	const res = schema.safeParse(data);

	if (!res.success) {
		return {
			isValid: false,
			errors: res.error?.flatten().fieldErrors as FormErrors<z.infer<T>>,
		};
	}

	return {
		isValid: true,
		parsedData: res.data as z.infer<T>,
		errors: {} as FormErrors<z.infer<T>>,
	};
}
