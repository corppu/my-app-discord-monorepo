import { getPool } from "./pool.js";

export async function runMigrations(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create extensions
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        discord_id VARCHAR(20) NOT NULL UNIQUE,
        username VARCHAR(32) NOT NULL,
        display_name VARCHAR(32) NOT NULL,
        email VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Create guilds table
    await client.query(`
      CREATE TABLE IF NOT EXISTS guilds (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon_url TEXT,
        member_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Create guild_members table
    await client.query(`
      CREATE TABLE IF NOT EXISTS guild_members (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        guild_id VARCHAR(20) NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
        nickname VARCHAR(32),
        roles TEXT[] NOT NULL DEFAULT '{}',
        joined_at TIMESTAMPTZ NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (user_id, guild_id)
      )
    `);

    // Create events table
    await client.query(`
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        guild_id VARCHAR(20) NOT NULL REFERENCES guilds(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        channel_id VARCHAR(20),
        scheduled_start_at TIMESTAMPTZ NOT NULL,
        scheduled_end_at TIMESTAMPTZ,
        status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
        entity_type VARCHAR(20) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Create sessions table with JWT token for native clients
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        access_token TEXT NOT NULL,
        refresh_token TEXT NOT NULL,
        jwt_token TEXT,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    // Create indexes
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_sessions_jwt_token ON sessions(jwt_token) WHERE jwt_token IS NOT NULL`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_guild_members_guild_id ON guild_members(guild_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_events_guild_id ON events(guild_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_events_scheduled_start ON events(scheduled_start_at)`);

    await client.query("COMMIT");
    console.log("Database migrations completed successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
