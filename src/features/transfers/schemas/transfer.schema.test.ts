import { describe, expect, it } from "vitest";

import { transferFormSchema } from "@/src/features/transfers/schemas/transfer.schema";

describe("transferFormSchema", () => {
  it("requires a valid 18-digit CLABE for manual recipients", () => {
    const result = transferFormSchema.safeParse({
      amount: "100",
      recipientType: "manual",
      name: "Ana Torres",
      accountReference: "ana@wallet.dev",
      accountNumber: "1234ABCD",
      saveAsFavorite: true,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const accountNumberError = result.error.issues.find((issue) => issue.path[0] === "accountNumber");
      expect(accountNumberError?.message).toContain("18");
    }
  });

  it("accepts manual recipients with valid CLABE", () => {
    const result = transferFormSchema.safeParse({
      amount: "250",
      recipientType: "manual",
      name: "Ana Torres",
      accountReference: "ana@wallet.dev",
      accountNumber: "646180157012345678",
      saveAsFavorite: true,
    });

    expect(result.success).toBe(true);
  });
});
