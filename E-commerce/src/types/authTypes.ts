import { z } from "zod";
import { registerSchema, loginSchema, changePasswordSchema } from "../schemas/validators";

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePassword = z.infer<typeof changePasswordSchema>
