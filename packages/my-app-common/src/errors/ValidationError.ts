import type { Locale, TranslationKey } from "../translations/index.js";
import { translate } from "../translations/index.js";

export class ValidationError extends Error {
  public readonly field: string;
  public readonly key: TranslationKey;
  public readonly locale: Locale;

  constructor(key: TranslationKey, field: string, locale: Locale = "en") {
    super(translate(key, locale, { field }));
    this.name = "ValidationError";
    this.field = field;
    this.key = key;
    this.locale = locale;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
