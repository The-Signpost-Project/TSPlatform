import { PipeTransform, type ArgumentMetadata } from "@nestjs/common";
import { validateSchema } from "@utils/validateSchema";
import { ZodSchema } from "zod";

export class ValidationPipe<T> implements PipeTransform {
	constructor(private readonly schema: ZodSchema<T>) {}

	transform(value: unknown, _metadata: ArgumentMetadata) {
		const parsed = validateSchema(this.schema, value);
		return parsed;
	}
}
