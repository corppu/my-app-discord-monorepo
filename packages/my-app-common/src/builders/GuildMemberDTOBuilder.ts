import { ValidationError } from "../errors/ValidationError.js";
import type { Locale } from "../translations/index.js";
import type { GuildMemberDTO } from "../types/dtos.js";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DISCORD_ID_REGEX = /^\d{17,19}$/;

export class GuildMemberDTOBuilder {
  private dto: Partial<GuildMemberDTO> = {};

  constructor(private readonly locale: Locale = "en") {}

  setUserId(userId: string): this {
    this.dto.userId = userId;
    return this;
  }

  setGuildId(guildId: string): this {
    this.dto.guildId = guildId;
    return this;
  }

  setNickname(nickname?: string): this {
    this.dto.nickname = nickname;
    return this;
  }

  setRoles(roles: string[]): this {
    this.dto.roles = roles;
    return this;
  }

  setJoinedAt(joinedAt: Date): this {
    this.dto.joinedAt = joinedAt;
    return this;
  }

  build(): GuildMemberDTO {
    const { userId, guildId, roles, joinedAt } = this.dto;

    if (!userId) {
      throw new ValidationError("validation.required", "userId", this.locale);
    }
    if (!UUID_REGEX.test(userId)) {
      throw new ValidationError("validation.invalidId", "userId", this.locale);
    }

    if (!guildId) {
      throw new ValidationError("validation.required", "guildId", this.locale);
    }
    if (!DISCORD_ID_REGEX.test(guildId)) {
      throw new ValidationError(
        "validation.invalidDiscordId",
        "guildId",
        this.locale,
      );
    }

    if (!roles) {
      throw new ValidationError("validation.required", "roles", this.locale);
    }

    if (!joinedAt || !(joinedAt instanceof Date) || isNaN(joinedAt.getTime())) {
      throw new ValidationError(
        "validation.invalidDate",
        "joinedAt",
        this.locale,
      );
    }

    return {
      userId,
      guildId,
      nickname: this.dto.nickname,
      roles,
      joinedAt,
    };
  }
}
