export type Contact = {
  id: string;
  name: string;
  bankAlias: string;
  accountReference: string;
  accountNumber: string;
  favorite: boolean;
};

export type WalletUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  clabe: string;
  accountNumber: string;
};

export type WalletTransactionStatus = "completed" | "pending" | "failed";

export type WalletTransaction = {
  id: string;
  amount: number;
  recipientName: string;
  recipientReference: string;
  recipientAccountNumber: string;
  createdAt: string;
  status: WalletTransactionStatus;
  description: string;
};

export type WalletAccount = {
  availableBalance: number;
  currency: "MXN";
};

export type SessionRecord = {
  isAuthenticated: boolean;
  user: WalletUser | null;
};

export type WalletDatabase = {
  session: SessionRecord;
  account: WalletAccount;
  contacts: Contact[];
  transactions: WalletTransaction[];
};

export type RecentTransactionsQueryInput = {
  cursor?: number;
  limit?: number;
};

export type RecentTransactionsPage = {
  items: WalletTransaction[];
  totalCount: number;
  cursor: number;
  limit: number;
  nextCursor: number | null;
  hasMore: boolean;
};

export type LoginInput = {
  identifier: string;
};

export type TransferRecipientInput = {
  type: "favorite" | "manual";
  contactId?: string;
  name?: string;
  bankAlias?: string;
  accountReference?: string;
  accountNumber?: string;
  saveAsFavorite?: boolean;
};

export type CreateTransferInput = {
  amount: number;
  recipient: TransferRecipientInput;
};

export type ConfirmTransferPayload = {
  amount: number;
  recipientName: string;
  recipientReference: string;
  recipientAccountNumber: string;
  saveRecipient: boolean;
  bankAlias?: string;
};

export type TransferFailureReason = "network" | "insufficient-funds" | "timeout" | "unknown";

export type TransferResult =
  | {
      outcome: "success";
      receipt: WalletTransaction;
      updatedBalance: number;
    }
  | {
      outcome: "error";
      reason: TransferFailureReason;
      message: string;
    };