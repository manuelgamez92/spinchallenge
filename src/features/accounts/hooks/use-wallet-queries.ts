"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import {
  getAccountSummary,
  getFavoriteContacts,
  getRecentTransactions,
  getTransactionById,
} from "@/src/features/accounts/services/wallet-api";
import { walletQueryKeys } from "@/src/features/accounts/services/wallet-query-keys";

export function useAccountSummaryQuery() {
  return useQuery({
    queryKey: walletQueryKeys.account,
    queryFn: getAccountSummary,
  });
}

export function useRecentTransactionsQuery(limit: number) {
  return useQuery({
    queryKey: walletQueryKeys.transactions(limit),
    queryFn: () => getRecentTransactions({ cursor: 0, limit }),
    placeholderData: keepPreviousData,
  });
}

export function useFavoriteContactsQuery() {
  return useQuery({
    queryKey: walletQueryKeys.contacts,
    queryFn: getFavoriteContacts,
  });
}

export function useTransactionByIdQuery(id: string) {
  return useQuery({
    queryKey: walletQueryKeys.transactionDetail(id),
    queryFn: () => getTransactionById(id),
    enabled: id.trim().length > 0,
  });
}