import { ValidationError } from "../errors/ValidationError.js";
import type { Locale } from "../translations/index.js";
import type { SessionDTO } from "../types/dtos.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const JWT_REGEX = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;

export class SessionDTOBuilder {
  private dto: Partial<SessionDTO> = {};

  constructor(private readonly locale: Locale = "en") {}

  setId(id: string): this {
    this.dto.id = id;
    return this;
  }

  setUserId(userId: string): this {
    this.dto.userId = userId;
    return this;
  }

  setAccessToken(accessToken: string): this {
    this.dto.accessToken = accessToken;
    return this;
  }

  setRefreshToken(refreshToken: string): this {
    this.dto.refreshToken = refreshToken;
    return this;
  }

  setJwtToken(jwtToken?: string): this {
    this.dto.jwtToken = jwtToken;
    return this;
  }

  setExpiresAt(expiresAt: Date): this {
    this.dto.expiresAt = expiresAt;
    return this;
  }

  setCreatedAt(createdAt: Date): this {
    this.dto.createdAt = createdAt;
    return this;
  }

  setUpdatedAt(updatedAt: Date): this {
    this.dto.updatedAt = updatedAt;
    return this;
  }

  build(): SessionDTO {
    const { id, userId, accessToken, refreshToken, jwtToken, expiresAt, createdAt, updatedAt } =
      this.dto;

    if (!id) {
      throw new ValidationError("validation.required", "id", this.locale);
    }
    if (!UUID_REGEX.test(id)) {
      throw new ValidationError("validation.invalidId", "id", this.locale);
    }

    if (!userId) {
      throw new ValidationError("validation.required", "userId", this.locale);
    }
    if (!UUID_REGEX.test(userId)) {
      throw new ValidationError("validation.invalidId", "userId", this.locale);
    }

    if (!accessToken) {
      throw new ValidationError("validation.required", "accessToken", this.locale);
    }
    if (accessToken.trim().length === 0) {
      throw new ValidationError("validation.invalidToken", "accessToken", this.locale);
    }

    if (!refreshToken) {
      throw new ValidationError("validation.required", "refreshToken", this.locale);
    }
    if (refreshToken.trim().length === 0) {
      throw new ValidationError("validation.invalidToken", "refreshToken", this.locale);
    }

    if (jwtToken !== undefined && !JWT_REGEX.test(jwtToken)) {
      throw new ValidationError("validation.invalidJwtToken", "jwtToken", this.locale);
    }

    if (!expiresAt || !(expiresAt instanceof Date) || isNaN(expiresAt.getTime())) {
      throw new ValidationError("validation.invalidDate", "expiresAt", this.locale);
    }

    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError("validation.invalidDate", "createdAt", this.locale);
    }

    if (!updatedAt || !(updatedAt instanceof Date) || isNaN(updatedAt.getTime())) {
      throw new ValidationError("validation.invalidDate", "updatedAt", this.locale);
    }

    return {
      id,
      userId,
      accessToken,
      refreshToken,
      jwtToken,
      expiresAt,
      createdAt,
      updatedAt,
    };
  }
}
