import { ValidationError } from "../errors/ValidationError.js";
import type { Locale } from "../translations/index.js";
import type { UserDTO } from "../types/dtos.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DISCORD_ID_REGEX = /^\d{17,19}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,32}$/;

export class UserDTOBuilder {
  private dto: Partial<UserDTO> = {};

  constructor(private readonly locale: Locale = "en") {}

  setId(id: string): this {
    this.dto.id = id;
    return this;
  }

  setDiscordId(discordId: string): this {
    this.dto.discordId = discordId;
    return this;
  }

  setUsername(username: string): this {
    this.dto.username = username;
    return this;
  }

  setDisplayName(displayName: string): this {
    this.dto.displayName = displayName;
    return this;
  }

  setEmail(email?: string): this {
    this.dto.email = email;
    return this;
  }

  setAvatarUrl(avatarUrl?: string): this {
    this.dto.avatarUrl = avatarUrl;
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

  build(): UserDTO {
    const {
      id,
      discordId,
      username,
      displayName,
      email,
      createdAt,
      updatedAt,
    } = this.dto;

    if (!id) {
      throw new ValidationError("validation.required", "id", this.locale);
    }
    if (!UUID_REGEX.test(id)) {
      throw new ValidationError("validation.invalidId", "id", this.locale);
    }

    if (!discordId) {
      throw new ValidationError(
        "validation.required",
        "discordId",
        this.locale,
      );
    }
    if (!DISCORD_ID_REGEX.test(discordId)) {
      throw new ValidationError(
        "validation.invalidDiscordId",
        "discordId",
        this.locale,
      );
    }

    if (!username) {
      throw new ValidationError("validation.required", "username", this.locale);
    }
    if (!USERNAME_REGEX.test(username)) {
      throw new ValidationError(
        "validation.invalidUsername",
        "username",
        this.locale,
      );
    }

    if (!displayName) {
      throw new ValidationError(
        "validation.required",
        "displayName",
        this.locale,
      );
    }
    if (displayName.length < 1 || displayName.length > 32) {
      throw new ValidationError(
        "validation.invalidDisplayName",
        "displayName",
        this.locale,
      );
    }

    if (email !== undefined && email !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new ValidationError(
          "validation.invalidEmail",
          "email",
          this.locale,
        );
      }
    }

    if (
      !createdAt ||
      !(createdAt instanceof Date) ||
      isNaN(createdAt.getTime())
    ) {
      throw new ValidationError(
        "validation.invalidDate",
        "createdAt",
        this.locale,
      );
    }

    if (
      !updatedAt ||
      !(updatedAt instanceof Date) ||
      isNaN(updatedAt.getTime())
    ) {
      throw new ValidationError(
        "validation.invalidDate",
        "updatedAt",
        this.locale,
      );
    }

    return {
      id,
      discordId,
      username,
      displayName,
      email: this.dto.email,
      avatarUrl: this.dto.avatarUrl,
      createdAt,
      updatedAt,
    };
  }
}
