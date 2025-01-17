import { z } from "zod";

export const NullSchema = z.null();

export const NonEmptyStringSchema = z.string().nonempty();
