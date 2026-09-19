import { describe, expect, it } from "vitest";

import {
  login,
  confirmTransfer,
  getAccountSummary,
  getRecentTransactions,
  getTransactionById,
} from "@/src/features/accounts/services/wallet-api";

describe("walletApi", () => {
  it("persists a mock session after login", async () => {
    const user = await login({ identifier: "test.user@spin.com" });

    expect(user.fullName).toBe("Francisco Javier Hernandez Soto");
    expect(document.cookie).toContain("spin-wallet-session=active");
  });

  it("rejects non-allowed credentials", async () => {
    await expect(login({ identifier: "test.user@spin.dev" })).rejects.toThrow(
      "No pudimos autenticar la sesión. Intenta de nuevo.",
    );
  });

  it("updates balance and transactions after a successful transfer", async () => {
    window.localStorage.setItem(
      "spin.wallet.feature-flags",
      JSON.stringify({ transferScenarioSimulation: true }),
    );

    window.localStorage.setItem(
      "spin.wallet.test-controls",
      JSON.stringify({ nextTransferOutcome: "success" }),
    );

    const initialAccount = await getAccountSummary();
    const initialTransactions = await getRecentTransactions({ limit: 5 });
    const result = await confirmTransfer({
      amount: 100,
      recipientName: "Ana Torres",
      recipientReference: "ana@wallet.dev",
      recipientAccountNumber: "646180157012345671",
      saveRecipient: false,
      bankAlias: "Cuenta favorita",
    });

    expect(result.outcome).toBe("success");

    const updatedAccount = await getAccountSummary();
    const updatedTransactions = await getRecentTransactions({ limit: 5 });

    expect(updatedAccount.availableBalance).toBe(initialAccount.availableBalance - 100);
    expect(updatedTransactions.items).toHaveLength(5);
    expect(updatedTransactions.totalCount).toBe(initialTransactions.totalCount + 1);
    expect(updatedTransactions.items[0]?.recipientName).toBe("Ana Torres");
  });

  it("returns insufficient-funds error scenario when forced", async () => {
    window.localStorage.setItem(
      "spin.wallet.feature-flags",
      JSON.stringify({ transferScenarioSimulation: true }),
    );

    window.localStorage.setItem(
      "spin.wallet.test-controls",
      JSON.stringify({ nextTransferOutcome: "insufficient-funds" }),
    );

    const initialAccount = await getAccountSummary();
    const initialTransactions = await getRecentTransactions({ limit: 5 });
    const result = await confirmTransfer({
      amount: 75,
      recipientName: "Ana Torres",
      recipientReference: "ana@wallet.dev",
      recipientAccountNumber: "646180157012345671",
      saveRecipient: false,
      bankAlias: "Cuenta favorita",
    });

    expect(result.outcome).toBe("error");

    if (result.outcome === "error") {
      expect(result.reason).toBe("insufficient-funds");
      expect(result.message).toContain("Fondos insuficientes");
    }

    const updatedAccount = await getAccountSummary();
    const updatedTransactions = await getRecentTransactions({ limit: 5 });

    expect(updatedAccount.availableBalance).toBe(initialAccount.availableBalance);
    expect(updatedTransactions.items).toHaveLength(initialTransactions.items.length);
    expect(updatedTransactions.totalCount).toBe(initialTransactions.totalCount);
  });

  it("paginates recent transactions in blocks", async () => {
    const firstPage = await getRecentTransactions({ limit: 5 });
    const secondPage = await getRecentTransactions({ cursor: firstPage.nextCursor ?? 0, limit: 5 });

    expect(firstPage.items).toHaveLength(5);
    expect(secondPage.items).toHaveLength(5);
    expect(firstPage.totalCount).toBeGreaterThanOrEqual(10);
    expect(firstPage.items[0]?.id).not.toBe(secondPage.items[0]?.id);
  });

  it("returns a transaction by id when it exists", async () => {
    const page = await getRecentTransactions({ limit: 1 });
    const transactionId = page.items[0]?.id;

    expect(transactionId).toBeDefined();

    const transaction = await getTransactionById(transactionId ?? "");

    expect(transaction).not.toBeNull();
    expect(transaction?.id).toBe(transactionId);
  });
});