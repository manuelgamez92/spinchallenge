import { z } from "zod";
import { isAllowedLoginIdentifier } from "@/src/features/authentication/constants/login.constants";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s()-]{8,18}$/;

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Ingresa tu email o teléfono")
    .refine((value) => emailRegex.test(value) || phoneRegex.test(value), {
      message: "Ingresa un email o teléfono válido",
    })
    .refine((value) => isAllowedLoginIdentifier(value), {
      message: "Solo se permite test.user@spin.com o el teléfono autorizado terminado en 45",
    }),
});

export type LoginSchemaInput = z.infer<typeof loginSchema>;