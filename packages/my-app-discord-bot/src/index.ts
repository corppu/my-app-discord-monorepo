import { Client, GatewayIntentBits, Events } from "discord.js";
import { runMigrations } from "@my-app/backend";
import { registerEventHandlers } from "./handlers/eventHandlers.js";
import { syncAllGuilds } from "./sync/guildSync.js";

const BOT_TOKEN = process.env["DISCORD_BOT_TOKEN"];
const GUILD_IDS_STR = process.env["DISCORD_GUILD_IDS"] ?? "";

if (!BOT_TOKEN) {
  console.error("DISCORD_BOT_TOKEN is required");
  process.exit(1);
}

const GUILD_IDS = GUILD_IDS_STR.split(",")
  .map((id) => id.trim())
  .filter((id) => id.length > 0);

if (GUILD_IDS.length === 0) {
  console.error("DISCORD_GUILD_IDS is required");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildScheduledEvents,
  ],
});

client.once(Events.ClientReady, async () => {
  console.log(`Discord bot logged in as ${client.user?.tag}`);

  try {
    await runMigrations();
    registerEventHandlers(client);
    await syncAllGuilds(client, GUILD_IDS);
    console.log("Initial guild sync completed");
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
});

client.on(Events.Error, (err) => {
  console.error("Discord client error:", err);
});

client.login(BOT_TOKEN).catch((err) => {
  console.error("Failed to login:", err);
  process.exit(1);
});
