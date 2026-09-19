import type { Contact } from "@/src/types/wallet.types";
import type { TransferFormInput, TransferFormOutput } from "@/src/features/transfers/schemas/transfer.schema";

export function buildRecipient(values: TransferFormInput | TransferFormOutput, contacts: Contact[]) {
  if (values.recipientType === "favorite") {
    return contacts.find((contact) => contact.id === values.contactId) ?? null;
  }

  return {
    id: "manual",
    name: values.name?.trim() ?? "",
    bankAlias: values.bankAlias?.trim() || "Nuevo destinatario",
    accountReference: values.accountReference?.trim() ?? "",
    accountNumber: values.accountNumber?.trim() ?? "",
    favorite: Boolean(values.saveAsFavorite),
  } satisfies Contact;
}