export const MIN_PASSWORD_LENGTH = 8;
export const MAX_DISPLAY_NAME_LENGTH = 40;

const AUI_EMAIL_PATTERN = /^[^\s@]+@([a-z0-9-]+\.)*aui\.ma$/i;
const DISPLAY_NAME_PATTERN = /^[A-Za-z0-9]+(?:[ ._-][A-Za-z0-9]+)*$/;

export function isAuiEmail(email: string): boolean {
  return AUI_EMAIL_PATTERN.test(email.trim());
}

export function isValidDisplayName(displayName: string): boolean {
  const normalized = displayName.trim();
  return (
    normalized.length >= 2 &&
    normalized.length <= MAX_DISPLAY_NAME_LENGTH &&
    DISPLAY_NAME_PATTERN.test(normalized)
  );
}

export function isValidPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}
