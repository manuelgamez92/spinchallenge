"use client";

import { useCallback, useMemo } from "react";
import { useState } from "react";

import { useSession } from "@/src/features/authentication/hooks/use-session";
import { AccountBalanceCard } from "@/src/features/accounts/components/account-balance-card";
import { TransactionsList } from "@/src/features/accounts/components/transactions-list";
import { homeScreenStyles } from "@/src/features/accounts/styles/wallet.styles";
import { WalletHeader } from "@/src/features/accounts/components/wallet-header";
import { useAccountSummaryQuery, useRecentTransactionsQuery } from "@/src/features/accounts/hooks/use-wallet-queries";
import { formatAccountLast4 } from "@/src/utils/format";
import { PageShell } from "@/src/components/layout/page-shell";
import { Spinner } from "@/src/components/ui/spinner";

export function HomeScreen() {
  const session = useSession();
  const accountQuery = useAccountSummaryQuery();
  const [visibleTransactionLimit, setVisibleTransactionLimit] = useState(5);
  const transactionsQuery = useRecentTransactionsQuery(visibleTransactionLimit);
  const userFullName = session.user?.fullName ?? "Cliente";
  const userClabeSuffix = formatAccountLast4(session.user?.clabe ?? "");
  const userAccountSuffix = formatAccountLast4(session.user?.accountNumber ?? "");

  const transactionsData = useMemo(
    () => ({
      transactions: transactionsQuery.data?.items ?? [],
      totalCount: transactionsQuery.data?.totalCount ?? 0,
      hasMore: transactionsQuery.data ? transactionsQuery.data.items.length < transactionsQuery.data.totalCount : false,
    }),
    [transactionsQuery.data],
  );

  const handleRetryTransactions = useCallback(() => {
    void transactionsQuery.refetch();
  }, [transactionsQuery]);

  const handleLoadMoreTransactions = useCallback(
    (limit: 5 | 10) => {
      if (!transactionsData.hasMore) {
        return;
      }

      setVisibleTransactionLimit((currentLimit) => currentLimit + limit);
    },
    [transactionsData.hasMore],
  );

  return (
    <PageShell>
      <WalletHeader />

      <div className={homeScreenStyles.grid}>
        <div className={homeScreenStyles.mainColumn}>
          {accountQuery.isLoading ? (
            <div className={homeScreenStyles.loadingBalanceCard}>
              <div className={homeScreenStyles.loadingBalanceText}>
                <Spinner /> Cargando saldo disponible...
              </div>
            </div>
          ) : accountQuery.data ? (
            <AccountBalanceCard
              availableBalance={accountQuery.data.availableBalance}
            />
          ) : null}

          <TransactionsList
            isError={transactionsQuery.isError}
            isFetching={transactionsQuery.isFetching}
            isLoading={transactionsQuery.isPending}
            onLoadMore={handleLoadMoreTransactions}
            onRetry={handleRetryTransactions}
            totalCount={transactionsData.totalCount}
            hasMore={transactionsData.hasMore}
            transactions={transactionsData.transactions}
          />
        </div>

        <aside className={homeScreenStyles.aside}>
          <section className={homeScreenStyles.profileCard}>
            <p className={homeScreenStyles.overline}>Datos de la cuenta</p>
            <h2 className={homeScreenStyles.profileName}>{userFullName}</h2>
            <p className={homeScreenStyles.profileDescription}>
              Cuenta Premium
            </p>

            <div className={homeScreenStyles.profileGrid}>
              <article className={homeScreenStyles.profileItem}>
                <p className={homeScreenStyles.profileItemLabel}>CLABE</p>
                <p className={homeScreenStyles.profileItemValue}>{userClabeSuffix}</p>
              </article>
              <article className={homeScreenStyles.profileItem}>
                <p className={homeScreenStyles.profileItemLabel}>Nro. de cuenta</p>
                <p className={homeScreenStyles.profileItemValue}>{userAccountSuffix}</p>
              </article>
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}