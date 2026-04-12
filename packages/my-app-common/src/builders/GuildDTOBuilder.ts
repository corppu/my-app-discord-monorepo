import { ValidationError } from "../errors/ValidationError.js";
import type { Locale } from "../translations/index.js";
import type { GuildDTO } from "../types/dtos.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class GuildDTOBuilder {
  private dto: Partial<GuildDTO> = {};
  constructor(private readonly locale: Locale = "en") {}

  setId(id: unknown): this {
    this.dto.id = typeof id === "string" ? id : String(id);
    return this;
  }
  setName(name: unknown): this {
    this.dto.name = typeof name === "string" ? name : String(name);
    return this;
  }
  setIconUrl(iconUrl: unknown): this {
    this.dto.iconUrl = iconUrl ? String(iconUrl) : undefined;
    return this;
  }
  setMemberCount(memberCount: unknown): this {
    this.dto.memberCount = typeof memberCount === "number" ? memberCount : Number(memberCount);
    return this;
  }
  setCreatedAt(createdAt: unknown): this {
    this.dto.createdAt = createdAt instanceof Date ? createdAt : new Date(String(createdAt));
    return this;
  }
  build(): GuildDTO {
    const { id, name, memberCount, createdAt } = this.dto;
    if (!id) throw new ValidationError("validation.required", "id", this.locale);
    if (!UUID_REGEX.test(id)) throw new ValidationError("validation.invalidId", "id", this.locale);
    if (!name) throw new ValidationError("validation.required", "name", this.locale);
    if (typeof memberCount !== "number" || isNaN(memberCount)) throw new ValidationError("validation.required", "memberCount", this.locale);
    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) throw new ValidationError("validation.invalidDate", "createdAt", this.locale);
    return {
      id,
      name: this.dto.name!,
      iconUrl: this.dto.iconUrl,
      memberCount,
      createdAt
    };
  }
}
