import type { WalletTransaction } from "@/src/types/wallet.types";

export type LoadMoreStep = 5 | 10;

export type AccountBalanceCardProps = {
  availableBalance: number;
};

export type TransactionsListProps = {
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  transactions: WalletTransaction[];
  totalCount: number;
  hasMore: boolean;
  onRetry: () => void;
  onLoadMore: (limit: LoadMoreStep) => void;
};

export type WalletNavigationItem = {
  href: string;
  label: string;
};

export type TransactionDetailScreenProps = {
  transactionId: string;
};
