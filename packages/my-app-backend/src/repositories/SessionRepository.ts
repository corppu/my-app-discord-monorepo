import type { Pool } from "pg";
import { mapRecordToSessionDTO } from "@my-app/common";
import type { SessionDTO } from "@my-app/common";

export class SessionRepository {
  constructor(private readonly pool: Pool) {}

  async findById(id: string): Promise<SessionDTO | null> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM sessions WHERE id = $1 AND expires_at > NOW()",
      [id],
    );
    const row = result.rows[0];
    return row ? mapRecordToSessionDTO(row) : null;
  }

  async findByUserId(userId: string): Promise<SessionDTO | null> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM sessions WHERE user_id = $1 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1",
      [userId],
    );
    const row = result.rows[0];
    return row ? mapRecordToSessionDTO(row) : null;
  }

  async findByJwtToken(jwtToken: string): Promise<SessionDTO | null> {
    const result = await this.pool.query<Record<string, unknown>>(
      "SELECT * FROM sessions WHERE jwt_token = $1 AND expires_at > NOW()",
      [jwtToken],
    );
    const row = result.rows[0];
    return row ? mapRecordToSessionDTO(row) : null;
  }

  async create(
    data: Omit<SessionDTO, "id" | "createdAt" | "updatedAt">,
  ): Promise<SessionDTO> {
    const result = await this.pool.query<Record<string, unknown>>(
      `INSERT INTO sessions (user_id, access_token, refresh_token, jwt_token, expires_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        data.userId,
        data.accessToken,
        data.refreshToken,
        data.jwtToken ?? null,
        data.expiresAt,
      ],
    );
    const row = result.rows[0];
    if (!row) throw new Error("Failed to create session");
    return mapRecordToSessionDTO(row);
  }

  async update(
    id: string,
    data: Partial<
      Pick<
        SessionDTO,
        "accessToken" | "refreshToken" | "jwtToken" | "expiresAt"
      >
    >,
  ): Promise<SessionDTO | null> {
    const sets: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (data.accessToken !== undefined) {
      sets.push(`access_token = $${idx++}`);
      values.push(data.accessToken);
    }
    if (data.refreshToken !== undefined) {
      sets.push(`refresh_token = $${idx++}`);
      values.push(data.refreshToken);
    }
    if (data.jwtToken !== undefined) {
      sets.push(`jwt_token = $${idx++}`);
      values.push(data.jwtToken);
    }
    if (data.expiresAt !== undefined) {
      sets.push(`expires_at = $${idx++}`);
      values.push(data.expiresAt);
    }

    if (sets.length === 0) return this.findById(id);

    sets.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.pool.query<Record<string, unknown>>(
      `UPDATE sessions SET ${sets.join(", ")} WHERE id = $${idx} RETURNING *`,
      values,
    );
    const row = result.rows[0];
    return row ? mapRecordToSessionDTO(row) : null;
  }

  async deleteById(id: string): Promise<boolean> {
    const result = await this.pool.query("DELETE FROM sessions WHERE id = $1", [
      id,
    ]);
    return (result.rowCount ?? 0) > 0;
  }

  async deleteExpired(): Promise<number> {
    const result = await this.pool.query(
      "DELETE FROM sessions WHERE expires_at <= NOW()",
    );
    return result.rowCount ?? 0;
  }

  async deleteByUserId(userId: string): Promise<number> {
    const result = await this.pool.query(
      "DELETE FROM sessions WHERE user_id = $1",
      [userId],
    );
    return result.rowCount ?? 0;
  }
}
