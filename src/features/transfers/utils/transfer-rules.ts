import type { TransferRuleError, TransferRuleInput } from "@/src/features/transfers/types/transfers.types";

export function validateTransferRules({
  amount,
  availableBalance,
  recipientName,
  recipientReference,
  recipientAccountNumber,
}: TransferRuleInput) {
  const errors: TransferRuleError[] = [];

  if (amount <= 0) {
    errors.push({ field: "amount", message: "El monto debe ser mayor a cero" });
  }

  if (amount > availableBalance) {
    errors.push({ field: "amount", message: "El monto supera el saldo disponible" });
  }

  if (!recipientName?.trim() || !recipientReference?.trim() || !recipientAccountNumber?.trim()) {
    errors.push({ field: "recipient", message: "Debes seleccionar o ingresar un destinatario válido" });
  }

  return errors;
}