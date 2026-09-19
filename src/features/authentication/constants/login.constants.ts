export const ALLOWED_LOGIN_EMAIL = "test.user@spin.com";
export const ALLOWED_LOGIN_PHONE_DIGITS = "526622985745";

export function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function isAllowedLoginIdentifier(identifier: string) {
  const normalized = identifier.trim().toLowerCase();

  if (normalized === ALLOWED_LOGIN_EMAIL) {
    return true;
  }

  return normalizePhoneDigits(normalized) === ALLOWED_LOGIN_PHONE_DIGITS;
}
