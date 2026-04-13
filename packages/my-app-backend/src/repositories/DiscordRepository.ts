import {
  Client,
  GatewayIntentBits,
  type Guild,
  type GuildMember,
} from "discord.js";
import type { GuildDTO, UserDTO, GuildMemberDTO } from "@my-app/common";

export class DiscordRepository {
  private client: Client;
  private ready = false;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildScheduledEvents,
      ],
    });
  }

  async connect(token: string): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      this.client.once("ready", () => {
        this.ready = true;
        resolve();
      });
      this.client.once("error", reject);
      this.client.login(token).catch(reject);
    });
  }

  async disconnect(): Promise<void> {
    this.client.destroy();
    this.ready = false;
  }

  private ensureReady(): void {
    if (!this.ready) {
      throw new Error("Discord client is not connected. Call connect() first.");
    }
  }

  async fetchGuild(guildId: string): Promise<GuildDTO | null> {
    this.ensureReady();
    try {
      const guild: Guild = await this.client.guilds.fetch(guildId);
      return {
        id: guild.id,
        name: guild.name,
        iconUrl: guild.iconURL() ?? undefined,
        memberCount: guild.memberCount,
        createdAt: guild.createdAt,
      };
    } catch {
      return null;
    }
  }

  async fetchGuildMembers(
    guildId: string,
  ): Promise<
    Array<{ user: Partial<UserDTO>; member: Partial<GuildMemberDTO> }>
  > {
    this.ensureReady();
    const guild = await this.client.guilds.fetch(guildId);
    const members = await guild.members.fetch();

    return members
      .filter((member) => !member.user.bot)
      .map((member: GuildMember) => ({
        user: {
          discordId: member.user.id,
          username: member.user.username,
          displayName: member.displayName,
          avatarUrl: member.user.displayAvatarURL() ?? undefined,
        },
        member: {
          guildId: guildId,
          nickname: member.nickname ?? undefined,
          roles: member.roles.cache
            .filter((r) => r.name !== "@everyone")
            .map((r) => r.id),
          joinedAt: member.joinedAt ?? new Date(),
        },
      }));
  }

  async fetchScheduledEvents(
    guildId: string,
  ): Promise<Array<Record<string, unknown>>> {
    this.ensureReady();
    const guild = await this.client.guilds.fetch(guildId);
    const events = await guild.scheduledEvents.fetch();

    return events.map((event) => ({
      discordEventId: event.id,
      guildId: guildId,
      name: event.name,
      description: event.description ?? undefined,
      channelId: event.channelId ?? undefined,
      scheduledStartAt: event.scheduledStartAt ?? new Date(),
      scheduledEndAt: event.scheduledEndAt ?? undefined,
      status: event.status,
      entityType: event.entityType,
    }));
  }
}
