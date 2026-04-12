export type TranslationKey =
  | "validation.required"
  | "validation.invalidEmail"
  | "validation.invalidId"
  | "validation.invalidDiscordId"
  | "validation.invalidUsername"
  | "validation.invalidDisplayName"
  | "validation.invalidToken"
  | "validation.invalidDate"
  | "validation.invalidStatus"
  | "validation.invalidEntityType"
  | "validation.expiredSession"
  | "validation.invalidJwtToken"
  | "validation.invalidCode"
  | "validation.invalidState"
  | "validation.invalidPage"
  | "validation.invalidPageSize";

export type Locale = "en" | "fi";

export type Translations = Record<TranslationKey, string>;

export type TranslationMap = Record<Locale, Translations>;
