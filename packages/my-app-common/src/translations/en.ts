import type { Translations } from "./types.js";

export const en: Translations = {
  "validation.required": "Field '{field}' is required.",
  "validation.invalidEmail": "Field '{field}' must be a valid email address.",
  "validation.invalidId": "Field '{field}' must be a valid UUID.",
  "validation.invalidDiscordId":
    "Field '{field}' must be a valid Discord snowflake ID.",
  "validation.invalidUsername":
    "Field '{field}' must be a valid username (3-32 characters, alphanumeric and underscores).",
  "validation.invalidDisplayName":
    "Field '{field}' must be a valid display name (1-32 characters).",
  "validation.invalidToken": "Field '{field}' must be a valid token.",
  "validation.invalidDate": "Field '{field}' must be a valid date.",
  "validation.invalidStatus":
    "Field '{field}' must be one of the allowed status values.",
  "validation.invalidEntityType":
    "Field '{field}' must be one of the allowed entity types.",
  "validation.expiredSession": "The session has expired.",
  "validation.invalidJwtToken": "Field '{field}' must be a valid JWT token.",
  "validation.invalidCode":
    "Field '{field}' must be a valid authorization code.",
  "validation.invalidState": "Field '{field}' must be a valid state parameter.",
  "validation.invalidPage": "Field '{field}' must be a positive integer.",
  "validation.invalidPageSize": "Field '{field}' must be between 1 and 100.",
};
