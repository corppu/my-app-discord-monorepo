import type { Pool } from "pg";
import { GuildMemberDTOBuilder } from "@my-app/common";
import type { GuildMemberDTO, GuildDTO } from "@my-app/common";

export class GuildRepository {
  constructor(private readonly pool: Pool) {}

  private mapGuildRow(row: Record<string, unknown>): GuildDTO {
    return {
      id: String(row["id"]),
      name: String(row["name"]),
      iconUrl: row["icon_url"] ? String(row["icon_url"]) : undefined,
      memberCount: Number(row["member_count"]),
      createdAt: new Date(String(row["created_at"])),
    };
  }

  private mapMemberRow(row: Record<string, unknown>): GuildMemberDTO {
    return new GuildMemberDTOBuilder()
      .setUserId(String(row["user_id"]))
      .setGuildId(String(row["guild_id"]))
      .setNickname(row["nickname"] ? String(row["nickname"]) : undefined)
      .setRoles(Array.isArray(row["roles"]) ? (row["roles"] as string[]) : [])
      .setJoinedAt(new Date(String(row["joined_at"])))
      .build();
  }

  async findGuildById(id: string): Promise<GuildDTO | null> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM guilds WHERE id = $1",
      [id]
    );
    const row = result.rows[0];
    return row ? this.mapGuildRow(row) : null;
  }

  async upsertGuild(data: Omit<GuildDTO, "createdAt">): Promise<GuildDTO> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO guilds (id, name, icon_url, member_count)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         icon_url = EXCLUDED.icon_url,
         member_count = EXCLUDED.member_count,
         updated_at = NOW()
       RETURNING *`,
      [data.id, data.name, data.iconUrl ?? null, data.memberCount]
    );
    const row = result.rows[0];
    if (!row) throw new Error("Failed to upsert guild");
    return this.mapGuildRow(row);
  }

  async findMembersByGuildId(guildId: string): Promise<GuildMemberDTO[]> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM guild_members WHERE guild_id = $1",
      [guildId]
    );
    return result.rows.map((row) => this.mapMemberRow(row));
  }

  async upsertMember(data: GuildMemberDTO): Promise<GuildMemberDTO> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO guild_members (user_id, guild_id, nickname, roles, joined_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, guild_id) DO UPDATE SET
         nickname = EXCLUDED.nickname,
         roles = EXCLUDED.roles,
         updated_at = NOW()
       RETURNING *`,
      [data.userId, data.guildId, data.nickname ?? null, data.roles, data.joinedAt]
    );
    const row = result.rows[0];
    if (!row) throw new Error("Failed to upsert guild member");
    return this.mapMemberRow(row);
  }

  async deleteMember(userId: string, guildId: string): Promise<boolean> {
    const result = await this.pool.query(
      "DELETE FROM guild_members WHERE user_id = $1 AND guild_id = $2",
      [userId, guildId]
    );
    return (result.rowCount ?? 0) > 0;
  }
}
