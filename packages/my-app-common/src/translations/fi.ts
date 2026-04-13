import type { Translations } from "./types.js";

export const fi: Translations = {
  "validation.required": "Kenttä '{field}' on pakollinen.",
  "validation.invalidEmail":
    "Kentän '{field}' täytyy olla kelvollinen sähköpostiosoite.",
  "validation.invalidId": "Kentän '{field}' täytyy olla kelvollinen UUID.",
  "validation.invalidDiscordId":
    "Kentän '{field}' täytyy olla kelvollinen Discord-lumihiutale-ID.",
  "validation.invalidUsername":
    "Kentän '{field}' täytyy olla kelvollinen käyttäjänimi (3–32 merkkiä, kirjaimet, numerot ja alaviivat).",
  "validation.invalidDisplayName":
    "Kentän '{field}' täytyy olla kelvollinen näyttönimi (1–32 merkkiä).",
  "validation.invalidToken": "Kentän '{field}' täytyy olla kelvollinen token.",
  "validation.invalidDate":
    "Kentän '{field}' täytyy olla kelvollinen päivämäärä.",
  "validation.invalidStatus":
    "Kentän '{field}' täytyy olla yksi sallituista tilamuuttujista.",
  "validation.invalidEntityType":
    "Kentän '{field}' täytyy olla yksi sallituista entiteettityypeistä.",
  "validation.expiredSession": "Istunto on vanhentunut.",
  "validation.invalidJwtToken":
    "Kentän '{field}' täytyy olla kelvollinen JWT-token.",
  "validation.invalidCode":
    "Kentän '{field}' täytyy olla kelvollinen valtuutuskoodi.",
  "validation.invalidState":
    "Kentän '{field}' täytyy olla kelvollinen tilaparametri.",
  "validation.invalidPage":
    "Kentän '{field}' täytyy olla positiivinen kokonaisluku.",
  "validation.invalidPageSize": "Kentän '{field}' täytyy olla välillä 1–100.",
};
