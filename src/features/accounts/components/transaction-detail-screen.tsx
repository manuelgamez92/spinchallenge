"use client";

import Link from "next/link";

import type { TransactionDetailScreenProps } from "@/src/features/accounts/types/accounts.types";
import { transactionDetailStyles } from "@/src/features/accounts/styles/wallet.styles";
import { WalletHeader } from "@/src/features/accounts/components/wallet-header";
import { useTransactionByIdQuery } from "@/src/features/accounts/hooks/use-wallet-queries";
import { formatClabe, formatCurrency, formatDateTime } from "@/src/utils/format";
import { EmptyState } from "@/src/components/feedback/empty-state";
import { ErrorState } from "@/src/components/feedback/error-state";
import { PageShell } from "@/src/components/layout/page-shell";
import { Spinner } from "@/src/components/ui/spinner";

export function TransactionDetailScreen({ transactionId }: TransactionDetailScreenProps) {
  const transactionQuery = useTransactionByIdQuery(transactionId);

  return (
    <PageShell>
      <WalletHeader />

      <div className={transactionDetailStyles.container}>
        {transactionQuery.isPending ? (
          <div className={transactionDetailStyles.loadingCard}>
            <div className={transactionDetailStyles.loadingText}>
              <Spinner /> Cargando transacción...
            </div>
          </div>
        ) : null}

        {transactionQuery.isError ? (
          <ErrorState
            action={
              <button className="secondary-button" onClick={() => void transactionQuery.refetch()} type="button">
                Reintentar
              </button>
            }
            description="No pudimos cargar la transacción seleccionada."
            title="Error al recuperar detalle"
          />
        ) : null}

        {!transactionQuery.isPending && !transactionQuery.isError && !transactionQuery.data ? (
          <EmptyState
            action={
              <Link className="secondary-button" href="/home">
                Volver a movimientos
              </Link>
            }
            description="El id no existe en el mock local o fue removido de la sesión actual."
            title="Transacción no encontrada"
          />
        ) : null}

        {!transactionQuery.isPending && !transactionQuery.isError && transactionQuery.data ? (
          <article className={transactionDetailStyles.card}>
            <div className={transactionDetailStyles.topRow}>
              <div>
                <p className={transactionDetailStyles.overline}>Detalle de transacción</p>
                <h2 className={transactionDetailStyles.title}>Operación {transactionQuery.data.id}</h2>
              </div>
            </div>

            <p className={transactionDetailStyles.amount}>
              -{formatCurrency(transactionQuery.data.amount)}
              <span className={transactionDetailStyles.amountCurrency}>MXN</span>
            </p>

            <div className={transactionDetailStyles.grid}>
              <div className={transactionDetailStyles.item}>
                <p className={transactionDetailStyles.label}>Destinatario</p>
                <p className={transactionDetailStyles.value}>{transactionQuery.data.recipientName}</p>
              </div>

              <div className={transactionDetailStyles.item}>
                <p className={transactionDetailStyles.label}>Referencia</p>
                <p className={transactionDetailStyles.value}>{transactionQuery.data.recipientReference}</p>
              </div>

              <div className={transactionDetailStyles.item}>
                <p className={transactionDetailStyles.label}>CLABE</p>
                <p className={transactionDetailStyles.value}>{formatClabe(transactionQuery.data.recipientAccountNumber)}</p>
              </div>

              <div className={transactionDetailStyles.item}>
                <p className={transactionDetailStyles.label}>Fecha</p>
                <p className={transactionDetailStyles.value}>{formatDateTime(transactionQuery.data.createdAt)}</p>
              </div>

              <div className={transactionDetailStyles.item}>
                <p className={transactionDetailStyles.label}>Descripción</p>
                <p className={transactionDetailStyles.value}>{transactionQuery.data.description}</p>
              </div>
            </div>

            <div className={transactionDetailStyles.actions}>
              <Link className={transactionDetailStyles.actionSecondary} href="/home">
                Volver al inicio
              </Link>
              <Link className={transactionDetailStyles.actionPrimary} href="/transfer">
                Nueva transacción
              </Link>
            </div>
          </article>
        ) : null}
      </div>
    </PageShell>
  );
}
