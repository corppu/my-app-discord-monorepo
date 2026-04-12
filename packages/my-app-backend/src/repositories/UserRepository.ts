import type { Pool } from "pg";
import { UserDTOBuilder } from "@my-app/common";
import type { UserDTO } from "@my-app/common";

export class UserRepository {
  constructor(private readonly pool: Pool) {}

  private mapRow(row: Record<string, unknown>): UserDTO {
    return new UserDTOBuilder()
      .setId(String(row["id"]))
      .setDiscordId(String(row["discord_id"]))
      .setUsername(String(row["username"]))
      .setDisplayName(String(row["display_name"]))
      .setEmail(row["email"] ? String(row["email"]) : undefined)
      .setAvatarUrl(row["avatar_url"] ? String(row["avatar_url"]) : undefined)
      .setCreatedAt(new Date(String(row["created_at"])))
      .setUpdatedAt(new Date(String(row["updated_at"])))
      .build();
  }

  async findById(id: string): Promise<UserDTO | null> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );
    const row = result.rows[0];
    return row ? this.mapRow(row) : null;
  }

  async findByDiscordId(discordId: string): Promise<UserDTO | null> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM users WHERE discord_id = $1",
      [discordId]
    );
    const row = result.rows[0];
    return row ? this.mapRow(row) : null;
  }

  async upsert(data: Omit<UserDTO, "id" | "createdAt" | "updatedAt">): Promise<UserDTO> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO users (discord_id, username, display_name, email, avatar_url)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (discord_id) DO UPDATE SET
         username = EXCLUDED.username,
         display_name = EXCLUDED.display_name,
         email = EXCLUDED.email,
         avatar_url = EXCLUDED.avatar_url,
         updated_at = NOW()
       RETURNING *`,
      [data.discordId, data.username, data.displayName, data.email ?? null, data.avatarUrl ?? null]
    );
    const row = result.rows[0];
    if (!row) throw new Error("Failed to upsert user");
    return this.mapRow(row);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM users WHERE id = $1", [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
