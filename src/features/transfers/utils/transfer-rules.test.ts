import { describe, expect, it } from "vitest";

import { validateTransferRules } from "@/src/features/transfers/utils/transfer-rules";

describe("validateTransferRules", () => {
  it("rejects zero or negative amounts", () => {
    const errors = validateTransferRules({
      amount: 0,
      availableBalance: 100,
      recipientName: "Ana",
      recipientReference: "ana@wallet.dev",
      recipientAccountNumber: "646180157012345678",
    });

    expect(errors).toContainEqual({ field: "amount", message: "El monto debe ser mayor a cero" });
  });

  it("rejects amounts above available balance", () => {
    const errors = validateTransferRules({
      amount: 120,
      availableBalance: 80,
      recipientName: "Ana",
      recipientReference: "ana@wallet.dev",
      recipientAccountNumber: "646180157012345678",
    });

    expect(errors).toContainEqual({ field: "amount", message: "El monto supera el saldo disponible" });
  });

  it("requires a recipient", () => {
    const errors = validateTransferRules({
      amount: 60,
      availableBalance: 100,
      recipientName: "",
      recipientReference: "",
      recipientAccountNumber: "",
    });

    expect(errors).toContainEqual({ field: "recipient", message: "Debes seleccionar o ingresar un destinatario válido" });
  });

  it("passes when data is valid", () => {
    const errors = validateTransferRules({
      amount: 60,
      availableBalance: 100,
      recipientName: "Ana",
      recipientReference: "ana@wallet.dev",
      recipientAccountNumber: "646180157012345678",
    });

    expect(errors).toHaveLength(0);
  });
});