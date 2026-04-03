import { productSchema } from "../schemas/validators";
import type { z } from "zod";

export type ProductInput = z.infer<typeof productSchema>;