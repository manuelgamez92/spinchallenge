export const walletQueryKeys = {
  account: ["wallet", "account"] as const,
  contacts: ["wallet", "contacts"] as const,
  transactionsBase: ["wallet", "transactions"] as const,
  transactions: (limit: number) => ["wallet", "transactions", limit] as const,
  transactionDetail: (id: string) => ["wallet", "transaction-detail", id] as const,
};