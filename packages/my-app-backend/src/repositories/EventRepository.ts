import type { Pool } from "pg";
import { EventDTOBuilder } from "@my-app/common";
import type { EventDTO, EventStatus, EventEntityType } from "@my-app/common";

export class EventRepository {
  constructor(private readonly pool: Pool) {}

  private mapRow(row: Record<string, unknown>): EventDTO {
    return new EventDTOBuilder()
      .setId(String(row["id"]))
      .setGuildId(String(row["guild_id"]))
      .setName(String(row["name"]))
      .setDescription(row["description"] ? String(row["description"]) : undefined)
      .setChannelId(row["channel_id"] ? String(row["channel_id"]) : undefined)
      .setScheduledStartAt(new Date(String(row["scheduled_start_at"])))
      .setScheduledEndAt(row["scheduled_end_at"] ? new Date(String(row["scheduled_end_at"])) : undefined)
      .setStatus(String(row["status"]) as EventStatus)
      .setEntityType(String(row["entity_type"]) as EventEntityType)
      .setCreatedAt(new Date(String(row["created_at"])))
      .setUpdatedAt(new Date(String(row["updated_at"])))
      .build();
  }

  async findById(id: string): Promise<EventDTO | null> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM events WHERE id = $1",
      [id]
    );
    const row = result.rows[0];
    return row ? this.mapRow(row) : null;
  }

  async findByGuildId(guildId: string): Promise<EventDTO[]> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM events WHERE guild_id = $1 ORDER BY scheduled_start_at ASC",
      [guildId]
    );
    return result.rows.map((row) => this.mapRow(row));
  }

  async upsert(data: Omit<EventDTO, "id" | "createdAt" | "updatedAt"> & { id?: string }): Promise<EventDTO> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO events (id, guild_id, name, description, channel_id, scheduled_start_at, scheduled_end_at, status, entity_type)
       VALUES (COALESCE($1, uuid_generate_v4()), $2, $3, $4, $5, $6, $7, $8, $9)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         channel_id = EXCLUDED.channel_id,
         scheduled_start_at = EXCLUDED.scheduled_start_at,
         scheduled_end_at = EXCLUDED.scheduled_end_at,
         status = EXCLUDED.status,
         entity_type = EXCLUDED.entity_type,
         updated_at = NOW()
       RETURNING *`,
      [
        data.id ?? null,
        data.guildId,
        data.name,
        data.description ?? null,
        data.channelId ?? null,
        data.scheduledStartAt,
        data.scheduledEndAt ?? null,
        data.status,
        data.entityType,
      ]
    );
    const row = result.rows[0];
    if (!row) throw new Error("Failed to upsert event");
    return this.mapRow(row);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM events WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
