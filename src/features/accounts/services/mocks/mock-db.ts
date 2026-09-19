import { SESSION_STORAGE_KEY } from "@/src/features/authentication/constants/session.constants";
import { readStorage, writeStorage } from "@/src/services/storage.service";
import type { Contact, WalletDatabase, WalletTransaction } from "@/src/types/wallet.types";

const now = Date.now();

const seedDescriptions = [
  "Pago supermercado",
  "Transferencia recibida",
  "Gasolina",
  "Suscripción streaming",
  "Reembolso comida",
  "Pago internet",
  "Movimiento tarjeta",
  "Taxi aeropuerto",
  "Pago gimnasio",
  "Compra farmacia",
  "Transferencia entre cuentas",
  "Suscripción música",
  "Pago servicios",
  "Compra app store",
  "Reembolso coworking",
  "Pago comida",
  "Transferencia familiar",
  "Compra online",
  "Pago estacionamiento",
  "Suscripción nube",
];

function createMockClabe(seed: number) {
  const suffix = String(10_000_000_000 + seed).padStart(12, "0");
  return `646180${suffix}`;
}

const defaultTransactions: WalletTransaction[] = seedDescriptions.map((description, index) => {
  const minutesAgo = (index + 1) * 45;

  return {
    id: `txn-seed-${index + 1}`,
    amount: Number((35 + index * 8.75).toFixed(2)),
    recipientName: description,
    recipientReference: `seed-${index + 1}`,
    recipientAccountNumber: createMockClabe(index + 1),
    createdAt: new Date(now - minutesAgo * 60 * 1000).toISOString(),
    status: "completed",
    description,
  };
});

const defaultDatabase: WalletDatabase = {
  session: {
    isAuthenticated: false,
    user: null,
  },
  account: {
    availableBalance: 2000,
    currency: "MXN",
  },
  contacts: [
    {
      id: "contact-1",
      name: "Ana Torres",
      bankAlias: "Cuenta favorita",
      accountReference: "ana.torres@wallet",
      accountNumber: "646180157012345671",
      favorite: true,
    },
    {
      id: "contact-2",
      name: "Daniel Cruz",
      bankAlias: "Banco aliado",
      accountReference: "+525511223344",
      accountNumber: "646180157012345672",
      favorite: true,
    },
    {
      id: "contact-3",
      name: "Mariana Vega",
      bankAlias: "Cuenta personal",
      accountReference: "mariana.vega@mail.com",
      accountNumber: "646180157012345673",
      favorite: false,
    },
  ],
  transactions: defaultTransactions,
};

function normalizeContacts(contacts: Contact[]) {
  const normalizedContacts = contacts.map((contact, index) => ({
    ...contact,
    accountNumber: contact.accountNumber ?? createMockClabe(100 + index),
  }));

  if (normalizedContacts.some((contact) => contact.favorite)) {
    return normalizedContacts;
  }

  return normalizedContacts.map((contact, index) => ({
    ...contact,
    favorite: index < 2,
  }));
}

function normalizeTransaction(transaction: WalletTransaction, index: number): WalletTransaction {
  return {
    ...transaction,
    recipientAccountNumber: transaction.recipientAccountNumber ?? createMockClabe(200 + index),
  };
}

function normalizeTransactions(transactions: WalletTransaction[]) {
  const normalized = transactions.map((transaction, index) => normalizeTransaction(transaction, index));

  return normalized.sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

function mergeTransactions(existingTransactions: WalletTransaction[] = []) {
  const mergedTransactions = [...defaultTransactions, ...existingTransactions];
  const dedupedTransactions = Array.from(new Map(mergedTransactions.map((transaction) => [transaction.id, transaction])).values());

  return normalizeTransactions(dedupedTransactions);
}

export function initializeMockDatabase() {
  const existing = readStorage<WalletDatabase | null>(SESSION_STORAGE_KEY, null);

  if (existing) {
    const normalizedDatabase = {
      ...existing,
      contacts: normalizeContacts(existing.contacts),
      transactions: mergeTransactions(existing.transactions),
    };

    writeStorage(SESSION_STORAGE_KEY, normalizedDatabase);
    return normalizedDatabase;
  }

  writeStorage(SESSION_STORAGE_KEY, defaultDatabase);
  return defaultDatabase;
}

export function readMockDatabase() {
  return initializeMockDatabase();
}

export function writeMockDatabase(nextValue: WalletDatabase) {
  writeStorage(SESSION_STORAGE_KEY, nextValue);
}