import { z } from "zod";

const amountRegex = /^\d+(\.\d{1,2})?$/;

export const transferFormSchema = z
  .object({
    amount: z
      .string()
      .trim()
      .min(1, "Ingresa un monto")
      .refine((value) => amountRegex.test(value), {
        message: "Usa solo números y hasta 2 decimales (ej. 250.00)",
      })
      .refine((value) => Number(value) > 0, {
        message: "El monto debe ser mayor a cero",
      }),
    recipientType: z.enum(["favorite", "manual"]),
    contactId: z.string().optional(),
    name: z.string().optional(),
    bankAlias: z.string().optional(),
    accountReference: z.string().optional(),
    accountNumber: z.string().optional(),
    saveAsFavorite: z.boolean().default(false),
  })
  .superRefine((value, context) => {
    if (value.recipientType === "favorite" && !value.contactId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Selecciona un destinatario favorito",
        path: ["contactId"],
      });
    }

    if (value.recipientType === "manual") {
      if (!value.name?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresa el nombre del destinatario",
          path: ["name"],
        });
      }

      if (!value.accountReference?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresa un email, teléfono o alias del destinatario",
          path: ["accountReference"],
        });
      }

      const clabe = value.accountNumber?.trim() ?? "";

      if (!clabe) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Ingresa la CLABE interbancaria",
          path: ["accountNumber"],
        });
      } else if (!/^\d{18}$/.test(clabe)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La CLABE debe tener exactamente 18 dígitos numéricos",
          path: ["accountNumber"],
        });
      }
    }
  });

export type TransferFormValues = z.infer<typeof transferFormSchema>;
export type TransferFormInput = z.input<typeof transferFormSchema>;
export type TransferFormOutput = z.output<typeof transferFormSchema>;