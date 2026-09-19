import type { TransferFailureReason } from "@/src/types/wallet.types";
import type { TransferOutcomeControl } from "@/src/features/accounts/services/mocks/mock-controls";

export type TransferDraft = {
  amount: number;
  recipientName: string;
  recipientReference: string;
  recipientAccountNumber: string;
  bankAlias: string;
  saveRecipient: boolean;
};

export type TransferReceipt = {
  id: string;
  amount: number;
  recipientName: string;
  recipientReference: string;
  recipientAccountNumber: string;
  createdAt: string;
  description: string;
};

export type TransferError = {
  reason: TransferFailureReason;
  message: string;
};

export type TransferState = {
  draft: TransferDraft | null;
  latestReceipt: TransferReceipt | null;
  latestError: TransferError | null;
};

export type TransferRuleInput = {
  amount: number;
  availableBalance: number;
  recipientName?: string;
  recipientReference?: string;
  recipientAccountNumber?: string;
};

export type TransferRuleError = {
  field: "amount" | "recipient";
  message: string;
};

export type TransferOutcomeSelection = "random" | TransferOutcomeControl;
