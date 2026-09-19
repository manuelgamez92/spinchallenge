"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import { transferFlowReset } from "@/src/features/transfers/store/transfers.slice";
import { transferResultStyles } from "@/src/features/transfers/styles/transfer.styles";
import { WalletHeader } from "@/src/features/accounts/components/wallet-header";
import { formatCurrency, formatDateTime } from "@/src/utils/format";
import { PageShell } from "@/src/components/layout/page-shell";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

export function TransferResultScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { latestError, latestReceipt } = useAppSelector((state) => state.transfer);

  const handleRetry = useCallback(() => {
    router.push("/transfer");
  }, [router]);

  const handleReset = useCallback(() => {
    dispatch(transferFlowReset());
    router.push("/home");
  }, [dispatch, router]);

  const handleNewTransfer = useCallback(() => {
    dispatch(transferFlowReset());
    router.push("/transfer");
  }, [dispatch, router]);

  const errorReason = latestError?.reason;
  const isRetryableError = errorReason === "network" || errorReason === "timeout" || errorReason === "unknown";

  const errorTitle =
    errorReason === "timeout"
      ? "Timeout operativo"
      : errorReason === "insufficient-funds"
        ? "Fondos insuficientes"
        : errorReason === "network"
          ? "Error de red"
          : "Error al confirmar";

  const errorHint =
    errorReason === "insufficient-funds"
      ? "Edita el monto y vuelve a intentar con un valor menor o revisa el saldo en home."
      : isRetryableError
        ? "Puedes reintentar la confirmación. Tu borrador de transacción se mantiene."
        : "Vuelve al home y crea una nueva transferencia.";

  return (
    <PageShell>
      <WalletHeader />

      <section className={transferResultStyles.container}>
        {latestReceipt ? (
          <div className={transferResultStyles.card}>
            <div className={transferResultStyles.successIcon}>
              ✓
            </div>
            <p className={transferResultStyles.successOverline}>Transacción confirmada</p>
            <h1 className={transferResultStyles.title}>
              {formatCurrency(latestReceipt.amount)} enviados
            </h1>
            <p className={transferResultStyles.description}>
              El mock registró la operación y actualizó el saldo local para reflejar el nuevo movimiento en Home.
            </p>

            <div className={transferResultStyles.detailCard}>
              <div className={transferResultStyles.detailGrid}>
                <div>
                  <p className={transferResultStyles.detailLabel}>Destinatario</p>
                  <p className={transferResultStyles.detailValue}>{latestReceipt.recipientName}</p>
                  <p className={transferResultStyles.detailSubValue}>{latestReceipt.recipientReference}</p>
                </div>
                <div>
                  <p className={transferResultStyles.detailLabel}>Fecha</p>
                  <p className={transferResultStyles.detailValue}>{formatDateTime(latestReceipt.createdAt)}</p>
                  <p className={transferResultStyles.detailSubValue}>Comprobante {latestReceipt.id}</p>
                </div>
              </div>
            </div>

            <div className={transferResultStyles.actions}>
              <button className="secondary-button" onClick={handleReset} type="button">
                Volver al home
              </button>
              <button className="primary-button" onClick={handleNewTransfer} type="button">
                Hacer otra transferencia
              </button>
            </div>
          </div>
        ) : (
          <div className={transferResultStyles.card}>
            <div className={transferResultStyles.errorIcon}>
              !
            </div>
            <p className={transferResultStyles.errorOverline}>Transacción no completada</p>
            <h1 className={transferResultStyles.title}>{errorTitle}</h1>
            <p className={transferResultStyles.description}>
              {latestError?.message ?? "No hay una transacción reciente para mostrar."}
            </p>
            <p className={transferResultStyles.hint}>{errorHint}</p>

            <div className={transferResultStyles.actions}>
              {isRetryableError ? (
                <button className="secondary-button" onClick={handleRetry} type="button">
                  Reintentar
                </button>
              ) : (
                <button className="secondary-button" onClick={handleRetry} type="button">
                  Editar transacción
                </button>
              )}
              <button className="primary-button" onClick={handleReset} type="button">
                Volver al home
              </button>
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}