import { PipeTransform, type ArgumentMetadata } from "@nestjs/common";
import { AppError, AppErrorTypes } from "@utils/appErrors";

interface FileValidationPipeOptions {
	optional?: boolean;
}

export class FileValidationPipe implements PipeTransform {
	private optional: boolean;
	private maxFileSize = 1024 * 1024 * 10; // 10MB
	private acceptedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif", "image/webp"];

	constructor({ optional = false }: FileValidationPipeOptions = {}) {
		this.optional = optional;
	}
	transform(value: unknown, _metadata: ArgumentMetadata) {
		if (this.optional && !value) {
			return null;
		}
		// check if value is a file
		if (!value) {
			throw new AppError(AppErrorTypes.FormValidationError("No file uploaded."));
		}

		if (!(value instanceof Object)) {
			throw new AppError(AppErrorTypes.FormValidationError("Invalid file."));
		}

		if (
			!("size" in value) ||
			value.size instanceof Number ||
			!("mimetype" in value) ||
			value.mimetype instanceof String
		) {
			throw new AppError(AppErrorTypes.FormValidationError("Invalid file."));
		}

		if ((value.size as number) > this.maxFileSize) {
			throw new AppError(
				AppErrorTypes.FormValidationError("File size is too large. Max size is 10MB."),
			);
		}

		if (!this.acceptedMimeTypes.includes(value.mimetype as string)) {
			throw new AppError(
				AppErrorTypes.FormValidationError(
					"File type is not supported. Supported types are: png, jpeg, jpg, gif, webp.",
				),
			);
		}

		return value;
	}
}
