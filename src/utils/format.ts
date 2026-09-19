const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  currencyDisplay: "narrowSymbol",
  maximumFractionDigits: 2,
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function formatAccountLast4(accountNumber: string) {
  const digits = accountNumber.replace(/\D/g, "");

  if (digits.length < 4) {
    return "****";
  }

  return `****${digits.slice(-4)}`;
}

export function formatClabe(accountNumber: string) {
  const digits = accountNumber.replace(/\D/g, "");

  if (digits.length !== 18) {
    return accountNumber;
  }

  return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 17)} ${digits.slice(17)}`;
}