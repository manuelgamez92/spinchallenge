"use client";

import { SESSION_COOKIE_NAME } from "@/src/features/authentication/constants/session.constants";
import { isAllowedLoginIdentifier } from "@/src/features/authentication/constants/login.constants";
import {
  consumeNextTransferOutcome,
  getMockControls,
  shouldSimulateTransferScenarios,
} from "@/src/features/accounts/services/mocks/mock-controls";
import { delay } from "@/src/lib/delay";
import type {
  ConfirmTransferPayload,
  Contact,
  LoginInput,
  RecentTransactionsPage,
  RecentTransactionsQueryInput,
  TransferResult,
  WalletAccount,
  WalletTransaction,
  WalletUser,
} from "@/src/types/wallet.types";
import { readMockDatabase, writeMockDatabase } from "@/src/features/accounts/services/mocks/mock-db";

const LATENCY = {
  login: 1200,
  summary: 900,
  confirmation: 1500,
};

const isTestEnvironment = process.env.NODE_ENV === "test";

function getLatency(ms: number) {
  return isTestEnvironment ? 1 : ms;
}

function generateUser(identifier: string): WalletUser {
  const normalized = identifier.trim();
  const normalizedLowerCase = normalized.toLowerCase();
  const isEmail = normalizedLowerCase.includes("@");

  return {
    id: "user-1",
    fullName: "Francisco Javier Hernandez Soto",
    email: "test.user@spin.com",
    phone: isEmail ? "+52 66 2298 5745" : normalized,
    clabe: "646180157012345670",
    accountNumber: "0041298765432109",
  };
}

function shouldFailLogin(identifier: string) {
  const controls = getMockControls();
  const normalized = identifier.trim().toLowerCase();

  if (!isAllowedLoginIdentifier(identifier)) {
    return true;
  }

  return Boolean(controls.loginFailure) || /fail|error|denied/.test(normalized);
}

function setSessionCookie(enabled: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  if (enabled) {
    document.cookie = `${SESSION_COOKIE_NAME}=active; path=/; max-age=86400; samesite=lax`;
    return;
  }

  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
}

export async function login(input: LoginInput) {
  await delay(getLatency(LATENCY.login));

  if (shouldFailLogin(input.identifier)) {
    throw new Error("No pudimos autenticar la sesión. Intenta de nuevo.");
  }

  const database = readMockDatabase();
  const user = generateUser(input.identifier);

  database.session = {
    isAuthenticated: true,
    user,
  };

  writeMockDatabase(database);
  setSessionCookie(true);

  return user;
}

export async function logout() {
  const database = readMockDatabase();
  database.session = {
    isAuthenticated: false,
    user: null,
  };
  writeMockDatabase(database);
  setSessionCookie(false);
}

export async function getAccountSummary(): Promise<WalletAccount> {
  await delay(getLatency(LATENCY.summary));

  const database = readMockDatabase();
  return database.account;
}

export async function getRecentTransactions(
  input: RecentTransactionsQueryInput = {},
): Promise<RecentTransactionsPage> {
  await delay(getLatency(LATENCY.summary + 150));

  const database = readMockDatabase();
  const totalCount = database.transactions.length;
  const cursor = Math.max(0, input.cursor ?? 0);
  const limit = Math.max(1, input.limit ?? 5);

  const items = database.transactions.slice(cursor, cursor + limit);
  const nextCursor = cursor + items.length < totalCount ? cursor + items.length : null;

  return {
    items,
    totalCount,
    cursor,
    limit,
    nextCursor,
    hasMore: nextCursor !== null,
  };
}

export async function getTransactionById(id: string): Promise<WalletTransaction | null> {
  await delay(getLatency(LATENCY.summary));

  const database = readMockDatabase();
  return database.transactions.find((transaction) => transaction.id === id) ?? null;
}

export async function getFavoriteContacts(): Promise<Contact[]> {
  await delay(getLatency(650));

  const database = readMockDatabase();
  return database.contacts.filter((contact) => contact.favorite);
}

function pickTransferScenario(amount: number, availableBalance: number) {
  if (!shouldSimulateTransferScenarios()) {
    return "success" as const;
  }

  const forcedOutcome = consumeNextTransferOutcome();

  if (forcedOutcome) {
    return forcedOutcome;
  }

  if (amount > availableBalance) {
    return "insufficient-funds" as const;
  }

  const roll = Math.random();

  if (roll < 0.55) {
    return "success" as const;
  }

  if (roll < 0.7) {
    return "network" as const;
  }

  if (roll < 0.8) {
    return "timeout" as const;
  }

  if (roll < 0.9) {
    return "insufficient-funds" as const;
  }

  return "unknown" as const;
}

export async function confirmTransfer(payload: ConfirmTransferPayload): Promise<TransferResult> {
  await delay(getLatency(LATENCY.confirmation));

  const database = readMockDatabase();
  const scenario = pickTransferScenario(payload.amount, database.account.availableBalance);

  if (scenario !== "success") {
    const messages = {
      network: "La red está inestable. Puedes reintentar la operación sin perder el borrador.",
      "insufficient-funds": "Fondos insuficientes para completar la transferencia.",
      timeout: "La validación tardó demasiado. Reintenta en unos segundos.",
      unknown: "Ocurrió un error inesperado al confirmar la transacción.",
    };

    return {
      outcome: "error",
      reason: scenario,
      message: messages[scenario],
    };
  }

  const receipt = {
    id: `txn-${Date.now()}`,
    amount: payload.amount,
    recipientName: payload.recipientName,
    recipientReference: payload.recipientReference,
    recipientAccountNumber: payload.recipientAccountNumber,
    createdAt: new Date().toISOString(),
    status: "completed" as const,
    description: "Transferencia enviada",
  };

  database.account.availableBalance -= payload.amount;
  database.transactions = [receipt, ...database.transactions];

  if (payload.saveRecipient) {
    database.contacts = [
      {
        id: `contact-${Date.now()}`,
        name: payload.recipientName,
        bankAlias: payload.bankAlias ?? "Guardado manual",
        accountReference: payload.recipientReference,
        accountNumber: payload.recipientAccountNumber,
        favorite: true,
      },
      ...database.contacts,
    ];
  }

  writeMockDatabase(database);

  return {
    outcome: "success",
    receipt,
    updatedBalance: database.account.availableBalance,
  };
}