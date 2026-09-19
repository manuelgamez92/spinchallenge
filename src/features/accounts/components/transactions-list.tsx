import Link from "next/link";

import { formatAccountLast4, formatCurrency, formatDateTime } from "@/src/utils/format";
import type { TransactionsListProps } from "@/src/features/accounts/types/accounts.types";
import { transactionsListStyles } from "@/src/features/accounts/styles/wallet.styles";
import { EmptyState } from "@/src/components/feedback/empty-state";
import { ErrorState } from "@/src/components/feedback/error-state";
import { Spinner } from "@/src/components/ui/spinner";

export function TransactionsList({
  isLoading,
  isError,
  isFetching,
  transactions,
  totalCount,
  hasMore,
  onRetry,
  onLoadMore,
}: TransactionsListProps) {
  if (isLoading) {
    return (
      <div className={transactionsListStyles.loadingCard}>
        <div className={transactionsListStyles.loadingText}>
          <Spinner /> Cargando movimientos recientes...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        action={
          <button className="secondary-button" onClick={onRetry} type="button">
            Reintentar
          </button>
        }
        description="No pudimos recuperar tus movimientos. Intenta otra vez."
        title="Error al cargar actividad"
      />
    );
  }

  if (!transactions.length) {
    return (
      <EmptyState
        description="Cuando completes tu primera transacción, aparecerá aquí con su comprobante mockeado."
        title="Aún no hay movimientos"
      />
    );
  }

  return (
    <div className={transactionsListStyles.card}>
      <div className={transactionsListStyles.header}>
        <div>
          <h3 className={transactionsListStyles.title}>Movimientos recientes</h3>
          <p className={transactionsListStyles.subtitle}>Últimas operaciones registradas en el mock local</p>
          <p className={transactionsListStyles.summary}>
            Mostrando {transactions.length} de {totalCount}
          </p>
        </div>
      </div>

      <div className={transactionsListStyles.list}>
        {transactions.map((transaction) => (
          <article className={transactionsListStyles.item} key={transaction.id}>
            <div className={transactionsListStyles.itemRow}>
              <div>
                <div className={transactionsListStyles.recipientRow}>
                  <span className="status-dot bg-orange-300" />
                  <h4 className={transactionsListStyles.recipientName}>{transaction.recipientName}</h4>
                </div>
                <p className={transactionsListStyles.itemDescription}>{transaction.description}</p>
                <p className={transactionsListStyles.itemAccountNumber}>
                  CLABE terminacion {formatAccountLast4(transaction.recipientAccountNumber)}
                </p>
                <div className={transactionsListStyles.itemMetaRow}>
                  <p className={transactionsListStyles.itemReference}>{transaction.recipientReference}</p>
                  <Link className={transactionsListStyles.detailLink} href={`/transactions/${transaction.id}`}>
                    Ver detalles
                  </Link>
                </div>
              </div>
              <div className={transactionsListStyles.amountBlock}>
                <p className={transactionsListStyles.amountText}>
                  -{formatCurrency(transaction.amount)}
                  <span className={transactionsListStyles.amountCurrency}>MXN</span>
                </p>
                <p className={transactionsListStyles.dateText}>{formatDateTime(transaction.createdAt)}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {hasMore ? (
        <div className={transactionsListStyles.loadMoreRow}>
          <button className="secondary-button" disabled={isFetching} onClick={() => onLoadMore(5)} type="button">
            {isFetching ? (
              <span className={transactionsListStyles.pendingButtonText}>
                <Spinner /> Cargando 5 más...
              </span>
            ) : (
              "Cargar 5 más"
            )}
          </button>
        </div>
      ) : null}
    </div>
  );
}