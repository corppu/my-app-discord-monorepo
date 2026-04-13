export interface EnvVariable {
  key: string;
  description: string;
  required: boolean;
  defaultValue?: string;
  validate?: (value: string) => boolean;
  sensitive?: boolean;
}

export interface EnvConfig {
  variables: EnvVariable[];
}

export const ENV_SCHEMA: EnvConfig = {
  variables: [
    {
      key: "NODE_ENV",
      description: "Application environment (development/production/test)",
      required: false,
      defaultValue: "development",
      validate: (v) => ["development", "production", "test"].includes(v),
    },
    {
      key: "DATABASE_URL",
      description:
        "PostgreSQL connection URL (e.g. postgresql://user:pass@host:5432/db)",
      required: true,
      validate: (v) =>
        v.startsWith("postgresql://") || v.startsWith("postgres://"),
      sensitive: true,
    },
    {
      key: "POSTGRES_USER",
      description: "PostgreSQL username",
      required: false,
      defaultValue: "myapp",
    },
    {
      key: "POSTGRES_PASSWORD",
      description: "PostgreSQL password",
      required: false,
      defaultValue: "myapp_password",
      sensitive: true,
    },
    {
      key: "POSTGRES_DB",
      description: "PostgreSQL database name",
      required: false,
      defaultValue: "myapp_db",
    },
    {
      key: "POSTGRES_PORT",
      description: "PostgreSQL port",
      required: false,
      defaultValue: "5432",
      validate: (v) => !isNaN(Number(v)) && Number(v) > 0 && Number(v) < 65536,
    },
    {
      key: "DISCORD_BOT_TOKEN",
      description: "Discord bot token from the Discord Developer Portal",
      required: true,
      sensitive: true,
    },
    {
      key: "DISCORD_GUILD_IDS",
      description: "Comma-separated list of Discord guild IDs to synchronize",
      required: true,
      validate: (v) =>
        v.split(",").every((id) => /^\d{17,19}$/.test(id.trim())),
    },
    {
      key: "EXPRESS_PORT",
      description: "Express server port",
      required: false,
      defaultValue: "3000",
      validate: (v) => !isNaN(Number(v)) && Number(v) > 0 && Number(v) < 65536,
    },
    {
      key: "OPENID_ISSUER_URL",
      description:
        "OpenID Connect issuer URL (e.g. https://accounts.google.com)",
      required: true,
      validate: (v) => v.startsWith("https://"),
    },
    {
      key: "OPENID_CLIENT_ID",
      description: "OpenID Connect client ID",
      required: true,
    },
    {
      key: "OPENID_CLIENT_SECRET",
      description: "OpenID Connect client secret",
      required: true,
      sensitive: true,
    },
    {
      key: "OPENID_REDIRECT_URI",
      description:
        "OpenID Connect redirect URI (e.g. http://localhost:3000/auth/callback)",
      required: true,
      validate: (v) => v.startsWith("http://") || v.startsWith("https://"),
    },
    {
      key: "JWT_SECRET",
      description: "Secret key for signing JWT tokens (min 32 characters)",
      required: true,
      sensitive: true,
      validate: (v) => v.length >= 32,
    },
    {
      key: "SESSION_SECRET",
      description: "Secret key for session management (min 32 characters)",
      required: true,
      sensitive: true,
      validate: (v) => v.length >= 32,
    },
    {
      key: "VITE_API_URL",
      description: "API URL for the React web app",
      required: false,
      defaultValue: "http://localhost:3000",
    },
    {
      key: "WEB_PORT",
      description: "Web frontend port",
      required: false,
      defaultValue: "8080",
      validate: (v) => !isNaN(Number(v)) && Number(v) > 0 && Number(v) < 65536,
    },
  ],
};
