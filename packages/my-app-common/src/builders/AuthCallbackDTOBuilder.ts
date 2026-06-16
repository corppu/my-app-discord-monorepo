import { ValidationError } from "../errors/ValidationError.js";
import type { Locale } from "../translations/index.js";
import type { AuthCallbackDTO } from "../types/dtos.js";

export class AuthCallbackDTOBuilder {
  private dto: Partial<AuthCallbackDTO> = {};

  constructor(private readonly locale: Locale = "en") {}

  setCode(code: string): this {
    this.dto.code = code;
    return this;
  }

  setState(state: string): this {
    this.dto.state = state;
    return this;
  }

  build(): AuthCallbackDTO {
    const { code, state } = this.dto;

    if (!code) {
      throw new ValidationError("validation.required", "code", this.locale);
    }
    if (code.trim().length === 0) {
      throw new ValidationError("validation.invalidCode", "code", this.locale);
    }

    if (!state) {
      throw new ValidationError("validation.required", "state", this.locale);
    }
    if (state.trim().length === 0) {
      throw new ValidationError(
        "validation.invalidState",
        "state",
        this.locale,
      );
    }

    return { code, state };
  }
}
