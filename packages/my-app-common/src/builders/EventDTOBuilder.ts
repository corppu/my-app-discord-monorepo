import { ValidationError } from "../errors/ValidationError.js";
import type { Locale } from "../translations/index.js";
import type { EventDTO, EventEntityType, EventStatus } from "../types/dtos.js";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DISCORD_ID_REGEX = /^\d{17,19}$/;

const VALID_STATUSES: EventStatus[] = ["SCHEDULED", "ACTIVE", "COMPLETED", "CANCELED"];
const VALID_ENTITY_TYPES: EventEntityType[] = ["STAGE_INSTANCE", "VOICE", "EXTERNAL"];

export class EventDTOBuilder {
  private dto: Partial<EventDTO> = {};

  constructor(private readonly locale: Locale = "en") {}

  setId(id: string): this {
    this.dto.id = id;
    return this;
  }

  setGuildId(guildId: string): this {
    this.dto.guildId = guildId;
    return this;
  }

  setName(name: string): this {
    this.dto.name = name;
    return this;
  }

  setDescription(description?: string): this {
    this.dto.description = description;
    return this;
  }

  setChannelId(channelId?: string): this {
    this.dto.channelId = channelId;
    return this;
  }

  setScheduledStartAt(scheduledStartAt: Date): this {
    this.dto.scheduledStartAt = scheduledStartAt;
    return this;
  }

  setScheduledEndAt(scheduledEndAt?: Date): this {
    this.dto.scheduledEndAt = scheduledEndAt;
    return this;
  }

  setStatus(status: EventStatus): this {
    this.dto.status = status;
    return this;
  }

  setEntityType(entityType: EventEntityType): this {
    this.dto.entityType = entityType;
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

  build(): EventDTO {
    const { id, guildId, name, scheduledStartAt, status, entityType, createdAt, updatedAt } =
      this.dto;

    if (!id) {
      throw new ValidationError("validation.required", "id", this.locale);
    }
    if (!UUID_REGEX.test(id)) {
      throw new ValidationError("validation.invalidId", "id", this.locale);
    }

    if (!guildId) {
      throw new ValidationError("validation.required", "guildId", this.locale);
    }
    if (!DISCORD_ID_REGEX.test(guildId)) {
      throw new ValidationError("validation.invalidDiscordId", "guildId", this.locale);
    }

    if (!name) {
      throw new ValidationError("validation.required", "name", this.locale);
    }
    if (name.trim().length === 0) {
      throw new ValidationError("validation.invalidDisplayName", "name", this.locale);
    }

    if (
      !scheduledStartAt ||
      !(scheduledStartAt instanceof Date) ||
      isNaN(scheduledStartAt.getTime())
    ) {
      throw new ValidationError("validation.invalidDate", "scheduledStartAt", this.locale);
    }

    if (!status) {
      throw new ValidationError("validation.required", "status", this.locale);
    }
    if (!VALID_STATUSES.includes(status)) {
      throw new ValidationError("validation.invalidStatus", "status", this.locale);
    }

    if (!entityType) {
      throw new ValidationError("validation.required", "entityType", this.locale);
    }
    if (!VALID_ENTITY_TYPES.includes(entityType)) {
      throw new ValidationError("validation.invalidEntityType", "entityType", this.locale);
    }

    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError("validation.invalidDate", "createdAt", this.locale);
    }

    if (!updatedAt || !(updatedAt instanceof Date) || isNaN(updatedAt.getTime())) {
      throw new ValidationError("validation.invalidDate", "updatedAt", this.locale);
    }

    return {
      id,
      guildId,
      name,
      description: this.dto.description,
      channelId: this.dto.channelId,
      scheduledStartAt,
      scheduledEndAt: this.dto.scheduledEndAt,
      status,
      entityType,
      createdAt,
      updatedAt,
    };
  }
}
