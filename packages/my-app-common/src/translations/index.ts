import { en } from "./en.js";
import { fi } from "./fi.js";
import type { Locale, TranslationKey, TranslationMap } from "./types.js";

export * from "./types.js";
export { en, fi };

export const translations: TranslationMap = { en, fi };

export function translate(
  key: TranslationKey,
  locale: Locale = "en",
  vars: Record<string, string> = {},
): string {
  const map = translations[locale] ?? translations["en"];
  let message = map[key] ?? key;
  for (const [k, v] of Object.entries(vars)) {
    message = message.replaceAll(`{${k}}`, v);
  }
  return message;
}
