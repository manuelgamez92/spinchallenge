"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { draftSaved, transferFailed, transferSucceeded } from "@/src/features/transfers/store/transfers.slice";
import { transferScreenStyles } from "@/src/features/transfers/styles/transfer.styles";
import {
  transferFormSchema,
  type TransferFormInput,
  type TransferFormOutput,
} from "@/src/features/transfers/schemas/transfer.schema";
import { validateTransferRules } from "@/src/features/transfers/utils/transfer-rules";
import { useSession } from "@/src/features/authentication/hooks/use-session";
import { confirmTransfer } from "@/src/features/accounts/services/wallet-api";
import { walletQueryKeys } from "@/src/features/accounts/services/wallet-query-keys";
import { WalletHeader } from "@/src/features/accounts/components/wallet-header";
import { useAccountSummaryQuery, useFavoriteContactsQuery } from "@/src/features/accounts/hooks/use-wallet-queries";
import { buildRecipient } from "@/src/features/transfers/utils/build-recipient";
import { useTransferScenarioControls } from "@/src/features/transfers/hooks/use-transfer-scenario-controls";
import { formatAccountLast4, formatCurrency } from "@/src/utils/format";
import { PageShell } from "@/src/components/layout/page-shell";
import { Spinner } from "@/src/components/ui/spinner";
import type { TransferOutcomeSelection } from "@/src/features/transfers/types/transfers.types";
import type { Contact, RecentTransactionsPage } from "@/src/types/wallet.types";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";

const EMPTY_CONTACTS: Contact[] = [];

function isRecentTransactionsPage(value: unknown): value is RecentTransactionsPage {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<RecentTransactionsPage>;

  return (
    Array.isArray(candidate.items) &&
    typeof candidate.totalCount === "number" &&
    typeof candidate.limit === "number" &&
    typeof candidate.cursor === "number" &&
    typeof candidate.hasMore === "boolean"
  );
}

export function TransferScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const session = useSession();
  const accountQuery = useAccountSummaryQuery();
  const contactsQuery = useFavoriteContactsQuery();
  const currentDraft = useAppSelector((state) => state.transfer.draft);
  const [step, setStep] = useState<"form" | "review">("form");
  const [ruleMessage, setRuleMessage] = useState<string | null>(null);
  const [favoriteSearch, setFavoriteSearch] = useState("");
  const {
    featureFlags,
    scenarioEnabled,
    forcedOutcome,
    handleScenarioToggle,
    handleForcedOutcomeChange,
  } = useTransferScenarioControls();

  const form = useForm<TransferFormInput, undefined, TransferFormOutput>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      amount: currentDraft?.amount ? String(currentDraft.amount) : "",
      recipientType: currentDraft ? "manual" : "favorite",
      contactId: undefined,
      name: currentDraft?.recipientName ?? "",
      bankAlias: currentDraft?.bankAlias ?? "",
      accountReference: currentDraft?.recipientReference ?? "",
      accountNumber: currentDraft?.recipientAccountNumber ?? "",
      saveAsFavorite: currentDraft?.saveRecipient ?? false,
    },
  });

  const watchedValues = useWatch({ control: form.control });
  const normalizedWatchedValues = useMemo<TransferFormInput>(
    () => ({
      amount: watchedValues.amount ?? "",
      recipientType: watchedValues.recipientType ?? (currentDraft ? "manual" : "favorite"),
      contactId: watchedValues.contactId,
      name: watchedValues.name ?? "",
      bankAlias: watchedValues.bankAlias ?? "",
      accountReference: watchedValues.accountReference ?? "",
      accountNumber: watchedValues.accountNumber ?? "",
      saveAsFavorite: watchedValues.saveAsFavorite ?? false,
    }),
    [
      currentDraft,
      watchedValues.accountNumber,
      watchedValues.accountReference,
      watchedValues.amount,
      watchedValues.bankAlias,
      watchedValues.contactId,
      watchedValues.name,
      watchedValues.recipientType,
      watchedValues.saveAsFavorite,
    ],
  );
  const contacts = contactsQuery.data ?? EMPTY_CONTACTS;
  const hasFavorites = contacts.length > 0;

  const visibleFavoriteContacts = useMemo(() => {
    const normalizedQuery = favoriteSearch.trim().toLowerCase();

    if (!normalizedQuery) {
      return contacts.slice(0, 2);
    }

    return contacts.filter((contact) => {
      const haystack = `${contact.name} ${contact.accountReference} ${contact.accountNumber}`.toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [contacts, favoriteSearch]);

  useEffect(() => {
    if (normalizedWatchedValues.recipientType !== "favorite") {
      return;
    }

    const currentContactId = form.getValues("contactId");
    const currentIsVisible = visibleFavoriteContacts.some((contact) => contact.id === currentContactId);

    if (!currentIsVisible && visibleFavoriteContacts[0]) {
      form.setValue("contactId", visibleFavoriteContacts[0].id, { shouldValidate: true });
    }
  }, [form, normalizedWatchedValues.recipientType, visibleFavoriteContacts]);

  const selectedRecipient = useMemo(
    () => buildRecipient(normalizedWatchedValues, contacts),
    [contacts, normalizedWatchedValues],
  );
  const parsedAmount = Number(normalizedWatchedValues.amount) || 0;
  const reviewPayload = useMemo(
    () => ({
      amount: parsedAmount,
      recipientName: selectedRecipient?.name ?? "",
      recipientReference: selectedRecipient?.accountReference ?? "",
      recipientAccountNumber: selectedRecipient?.accountNumber ?? "",
      bankAlias: selectedRecipient?.bankAlias ?? "",
      saveRecipient:
        normalizedWatchedValues.recipientType === "manual" ? Boolean(normalizedWatchedValues.saveAsFavorite) : false,
    }),
    [
      normalizedWatchedValues.recipientType,
      normalizedWatchedValues.saveAsFavorite,
      parsedAmount,
      selectedRecipient,
    ],
  );

  const confirmMutation = useMutation({
    mutationFn: confirmTransfer,
    onSuccess: (result) => {
      if (result.outcome === "success") {
        dispatch(
          transferSucceeded({
            id: result.receipt.id,
            amount: result.receipt.amount,
            recipientName: result.receipt.recipientName,
            recipientReference: result.receipt.recipientReference,
            recipientAccountNumber: result.receipt.recipientAccountNumber,
            createdAt: result.receipt.createdAt,
            description: result.receipt.description,
          }),
        );

        queryClient.setQueryData(walletQueryKeys.account, {
          availableBalance: result.updatedBalance,
          currency: "MXN",
        });
        queryClient.setQueriesData<RecentTransactionsPage>(
          { queryKey: walletQueryKeys.transactionsBase },
          (current) => {
            if (!isRecentTransactionsPage(current)) {
              return current;
            }

            const nextTotalCount = current.totalCount + 1;
            const items = [result.receipt, ...current.items.filter((item) => item.id !== result.receipt.id)].slice(
              0,
              current.limit,
            );

            return {
              ...current,
              items,
              totalCount: nextTotalCount,
              hasMore: current.limit < nextTotalCount,
              nextCursor: current.limit < nextTotalCount ? current.limit : null,
            };
          },
        );
        queryClient.invalidateQueries({ queryKey: walletQueryKeys.contacts });
      } else {
        dispatch(transferFailed({ message: result.message, reason: result.reason }));
      }

      router.push("/transfer/result");
    },
  });

  const goToReview = form.handleSubmit((values) => {
    const recipient = buildRecipient(values, contacts);
    const amount = Number(values.amount);
    const errors = validateTransferRules({
      amount,
      availableBalance: accountQuery.data?.availableBalance ?? 0,
      recipientName: recipient?.name,
      recipientReference: recipient?.accountReference,
      recipientAccountNumber: recipient?.accountNumber,
    });

    if (errors.length > 0) {
      setRuleMessage(errors[0]?.message ?? null);
      return;
    }

    setRuleMessage(null);
    dispatch(
      draftSaved({
        amount,
        recipientName: recipient?.name ?? "",
        recipientReference: recipient?.accountReference ?? "",
        recipientAccountNumber: recipient?.accountNumber ?? "",
        bankAlias: recipient?.bankAlias ?? "",
        saveRecipient: values.recipientType === "manual" ? Boolean(values.saveAsFavorite) : false,
      }),
    );
    setStep("review");
  });

  async function handleConfirm() {
    await confirmMutation.mutateAsync(reviewPayload);
  }

  return (
    <PageShell>
      <WalletHeader />

      <div className={transferScreenStyles.layout}>
        <section className={transferScreenStyles.panel}>
          <div>
            <div>
              <p className={transferScreenStyles.overline}>Flujo de pago</p>
              <h2 className={transferScreenStyles.sectionTitle}>Nueva transacción</h2>
            </div>
          </div>

          <div className={transferScreenStyles.scenarioPill}>
            Feature flag de escenarios: {featureFlags.transferScenarioSimulation ? "ON" : "OFF"}
          </div>

          {step === "form" ? (
            <form className={transferScreenStyles.form} onSubmit={goToReview}>
              <div className={transferScreenStyles.fieldGroup}>
                <label className={transferScreenStyles.label} htmlFor="amount">
                  Monto a transferir
                </label>
                <input
                  {...form.register("amount")}
                  className="field-input"
                  id="amount"
                  inputMode="decimal"
                  onInput={(event) => {
                    const input = event.currentTarget;
                    const sanitized = input.value
                      .replace(/,/g, ".")
                      .replace(/[^\d.]/g, "")
                      .replace(/\.(?=.*\.)/g, "")
                      .replace(/^(\d+\.\d{0,2}).*$/, "$1");

                    input.value = sanitized;
                  }}
                  placeholder="250.00"
                />
                {form.formState.errors.amount ? (
                  <p className={transferScreenStyles.fieldError}>{form.formState.errors.amount.message}</p>
                ) : null}
              </div>

              <div className={transferScreenStyles.recipientSection}>
                <div className={transferScreenStyles.recipientTypeButtons}>
                  <button
                    className={normalizedWatchedValues.recipientType === "favorite" ? "primary-button" : "secondary-button"}
                    onClick={() => form.setValue("recipientType", "favorite")}
                    type="button"
                  >
                    Favoritos
                  </button>
                  <button
                    className={normalizedWatchedValues.recipientType === "manual" ? "primary-button" : "secondary-button"}
                    onClick={() => form.setValue("recipientType", "manual")}
                    type="button"
                  >
                    Nuevo destinatario
                  </button>
                </div>

                {normalizedWatchedValues.recipientType === "favorite" ? (
                  <div className={transferScreenStyles.contactsList}>
                    {hasFavorites ? (
                      <div className={transferScreenStyles.fieldGroup}>
                        <label className={transferScreenStyles.label} htmlFor="favoriteSearch">
                          Buscar favorito por nombre o correo
                        </label>
                        <input
                          className="field-input"
                          id="favoriteSearch"
                          onChange={(event) => setFavoriteSearch(event.target.value)}
                          placeholder="Ej. Ana o mariana.vega@mail.com"
                          value={favoriteSearch}
                        />
                      </div>
                    ) : null}

                    {contactsQuery.isLoading ? (
                      <div className={transferScreenStyles.contactLoading}>
                        <Spinner /> Cargando contactos favoritos...
                      </div>
                    ) : null}

                    {visibleFavoriteContacts.map((contact) => (
                      <label className={transferScreenStyles.contactRow} key={contact.id}>
                        <input
                          {...form.register("contactId")}
                          className="mt-1"
                          type="radio"
                          value={contact.id}
                        />
                        <div>
                          <p className="font-medium text-white">{contact.name}</p>
                          <p className="text-sm text-slate-200">{contact.accountReference}</p>
                          <p className="text-sm text-slate-200">CLABE terminación {formatAccountLast4(contact.accountNumber)}</p>
                          <p className={transferScreenStyles.contactBankAlias}>{contact.bankAlias}</p>
                        </div>
                      </label>
                    ))}

                    {!contactsQuery.isLoading && !hasFavorites ? (
                      <p className="text-sm text-slate-200">Sin favoritos.</p>
                    ) : null}

                    {!contactsQuery.isLoading && hasFavorites && visibleFavoriteContacts.length === 0 ? (
                      <p className="text-sm text-slate-200">No se encontraron favoritos con ese criterio.</p>
                    ) : null}

                    {form.formState.errors.contactId ? (
                      <p className={transferScreenStyles.fieldError}>{form.formState.errors.contactId.message}</p>
                    ) : null}
                  </div>
                ) : (
                  <div className={transferScreenStyles.manualGrid}>
                    <div className="md:col-span-2">
                      <div className={transferScreenStyles.fieldGroup}>
                        <label className={transferScreenStyles.label} htmlFor="name">
                        Nombre del destinatario
                        </label>
                        <input {...form.register("name")} className="field-input" id="name" placeholder="Ana Torres" />
                        {form.formState.errors.name ? (
                          <p className={transferScreenStyles.fieldError}>{form.formState.errors.name.message}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className={transferScreenStyles.fieldGroup}>
                        <label className={transferScreenStyles.label} htmlFor="accountReference">
                        Email, teléfono o alias
                        </label>
                        <input
                          {...form.register("accountReference")}
                          className="field-input"
                          id="accountReference"
                          placeholder="ana@wallet.dev"
                        />
                        {form.formState.errors.accountReference ? (
                          <p className={transferScreenStyles.fieldError}>{form.formState.errors.accountReference.message}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className={transferScreenStyles.fieldGroup}>
                        <label className={transferScreenStyles.label} htmlFor="accountNumber">
                          CLABE interbancaria (18 dígitos)
                        </label>
                        <input
                          {...form.register("accountNumber")}
                          className="field-input"
                          id="accountNumber"
                          inputMode="numeric"
                          maxLength={18}
                          onInput={(event) => {
                            const input = event.currentTarget;
                            input.value = input.value.replace(/\D/g, "").slice(0, 18);
                          }}
                          placeholder="646180157012345678"
                        />
                        {form.formState.errors.accountNumber ? (
                          <p className={transferScreenStyles.fieldError}>{form.formState.errors.accountNumber.message}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className={transferScreenStyles.fieldGroup}>
                      <label className={transferScreenStyles.label} htmlFor="bankAlias">
                        Alias / etiqueta
                      </label>
                      <input
                        {...form.register("bankAlias")}
                        className="field-input"
                        id="bankAlias"
                        placeholder="Cuenta personal"
                      />
                    </div>
                    <label className={transferScreenStyles.checkboxCard}>
                      <input {...form.register("saveAsFavorite")} type="checkbox" /> Guardar en favoritos
                    </label>
                  </div>
                )}
              </div>

              {ruleMessage ? (
                <div className={transferScreenStyles.ruleMessage}>
                  {ruleMessage}
                </div>
              ) : null}

              <div className={transferScreenStyles.actions}>
                <Link className="secondary-button" href="/home">
                  Cancelar
                </Link>
                <button className="primary-button" type="submit">
                  Revisar resumen
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <div className={transferScreenStyles.reviewCard}>
                <p className={transferScreenStyles.overline}>Resumen previo</p>
                <div className={transferScreenStyles.reviewGrid}>
                  <div>
                    <p className="text-sm text-slate-200">Monto</p>
                    <p className={transferScreenStyles.reviewValue}>{formatCurrency(reviewPayload.amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-200">Saldo restante estimado</p>
                    <p className={transferScreenStyles.reviewValue}>
                      {formatCurrency((accountQuery.data?.availableBalance ?? 0) - reviewPayload.amount)}
                    </p>
                  </div>
                </div>

                <div className={transferScreenStyles.reviewRecipientCard}>
                  <p className="text-sm text-slate-200">Destinatario</p>
                  <p className={transferScreenStyles.reviewRecipientName}>{reviewPayload.recipientName}</p>
                  <p className={transferScreenStyles.reviewRecipientReference}>{reviewPayload.recipientReference}</p>
                  <p className={transferScreenStyles.reviewRecipientReference}>CLABE {reviewPayload.recipientAccountNumber}</p>
                  <p className={transferScreenStyles.reviewRecipientAlias}>{reviewPayload.bankAlias}</p>
                </div>
              </div>

              <div className={transferScreenStyles.scenarioHintCard}>
                {scenarioEnabled
                  ? "La confirmación final usa escenarios simulados. Puedes dejar random o forzar el próximo resultado desde QA Controls."
                  : "La simulación está desactivada: la confirmación se comportará de forma determinista para demos controladas."}
              </div>

              <div className={transferScreenStyles.actions}>
                <button className="secondary-button" onClick={() => setStep("form")} type="button">
                  Editar datos
                </button>
                <button className="primary-button" disabled={confirmMutation.isPending} onClick={handleConfirm} type="button">
                  {confirmMutation.isPending ? (
                    <span className={transferScreenStyles.confirmPendingText}>
                      <Spinner /> Procesando transferencia...
                    </span>
                  ) : (
                    "Confirmar transacción"
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className={transferScreenStyles.aside}>
          <section className={transferScreenStyles.asideCard}>
            <p className={transferScreenStyles.overline}>Cliente activo</p>
            <h3 className={transferScreenStyles.asideTitle}>{session.user?.fullName ?? "Cliente"}</h3>
            <p className={transferScreenStyles.asideSubtitle}>{session.user?.email ?? session.user?.phone}</p>
          </section>

          <section className={transferScreenStyles.asideCard}>
            <p className={transferScreenStyles.overline}>Saldo actual</p>
            <h3 className={transferScreenStyles.balanceTitle}>
              {formatCurrency(accountQuery.data?.availableBalance ?? 0)}
              <span className={transferScreenStyles.balanceCurrency}>MXN</span>
            </h3>
            <p className={transferScreenStyles.balanceHint}>
              Las reglas de negocio impiden confirmar montos cero, negativos o mayores al saldo.
            </p>
          </section>

          <section className={transferScreenStyles.asideCard}>
            <h3 className={transferScreenStyles.activityTitle}>QA Controls</h3>
            <p className={transferScreenStyles.qaDescription}>
              Controla escenarios de confirmación desde el front para validar mensajes y estados de error.
            </p>

            <div className={transferScreenStyles.qaToggle}>
              <div>
                <p className={transferScreenStyles.qaToggleLabel}>Escenarios aleatorios</p>
                <p className={transferScreenStyles.qaToggleHint}>Feature flag de simulación</p>
              </div>
              <button
                className={scenarioEnabled ? transferScreenStyles.qaToggleOn : transferScreenStyles.qaToggleOff}
                onClick={handleScenarioToggle}
                type="button"
              >
                {scenarioEnabled ? "ON" : "OFF"}
              </button>
            </div>

            <div className={transferScreenStyles.qaSelectGroup}>
              <label className={transferScreenStyles.label} htmlFor="forcedOutcome">
                Próximo resultado de confirmación
              </label>
              <select
                className="field-input"
                id="forcedOutcome"
                onChange={(event) => handleForcedOutcomeChange(event.target.value as TransferOutcomeSelection)}
                value={forcedOutcome}
              >
                <option value="random">Random (según flag)</option>
                <option value="success">Success</option>
                <option value="network">Error de red</option>
                <option value="timeout">Timeout</option>
                <option value="insufficient-funds">Fondos insuficientes</option>
                <option value="unknown">Error desconocido</option>
              </select>
              <p className={transferScreenStyles.qaNote}>
                El valor elegido se consume en la siguiente confirmación y luego vuelve a random.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}