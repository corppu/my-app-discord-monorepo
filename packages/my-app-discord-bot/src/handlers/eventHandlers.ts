import type { Client, GuildMember, GuildScheduledEvent } from "discord.js";
import { Events } from "discord.js";
import { GuildRepository, UserRepository, EventRepository, getPool } from "@my-app/backend";
import type { EventStatus, EventEntityType } from "@my-app/common";

function discordEventStatusToEventStatus(status: number): EventStatus {
  switch (status) {
    case 1: return "SCHEDULED";
    case 2: return "ACTIVE";
    case 3: return "COMPLETED";
    case 4: return "CANCELED";
    default: return "SCHEDULED";
  }
}

function discordEntityTypeToEntityType(entityType: number): EventEntityType {
  switch (entityType) {
    case 1: return "STAGE_INSTANCE";
    case 2: return "VOICE";
    case 3: return "EXTERNAL";
    default: return "EXTERNAL";
  }
}

export function registerEventHandlers(client: Client): void {
  const pool = getPool();
  const guildRepo = new GuildRepository(pool);
  const userRepo = new UserRepository(pool);
  const eventRepo = new EventRepository(pool);

  // Guild member add
  client.on(Events.GuildMemberAdd, async (member: GuildMember) => {
    try {
      await guildRepo.upsertGuild({
        id: member.guild.id,
        name: member.guild.name,
        iconUrl: member.guild.iconURL() ?? undefined,
        memberCount: member.guild.memberCount,
      });

      if (member.user.bot) return;

      const user = await userRepo.upsert({
        discordId: member.user.id,
        username: member.user.username,
        displayName: member.displayName,
        avatarUrl: member.user.displayAvatarURL() ?? undefined,
      });

      await guildRepo.upsertMember({
        userId: user.id,
        guildId: member.guild.id,
        nickname: member.nickname ?? undefined,
        roles: member.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.id),
        joinedAt: member.joinedAt ?? new Date(),
      });
    } catch (err) {
      console.error("Error handling GuildMemberAdd:", err);
    }
  });

  // Guild member remove
  client.on(Events.GuildMemberRemove, async (member) => {
    try {
      const user = await userRepo.findByDiscordId(member.user.id);
      if (user) {
        await guildRepo.deleteMember(user.id, member.guild.id);
      }
    } catch (err) {
      console.error("Error handling GuildMemberRemove:", err);
    }
  });

  // Guild member update
  client.on(Events.GuildMemberUpdate, async (_oldMember, newMember: GuildMember) => {
    try {
      const user = await userRepo.findByDiscordId(newMember.user.id);
      if (!user) return;

      await guildRepo.upsertMember({
        userId: user.id,
        guildId: newMember.guild.id,
        nickname: newMember.nickname ?? undefined,
        roles: newMember.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.id),
        joinedAt: newMember.joinedAt ?? new Date(),
      });
    } catch (err) {
      console.error("Error handling GuildMemberUpdate:", err);
    }
  });

  // Scheduled event create/update
  const handleScheduledEvent = async (event: GuildScheduledEvent): Promise<void> => {
    try {
      await eventRepo.upsert({
        guildId: event.guildId,
        name: event.name,
        description: event.description ?? undefined,
        channelId: event.channelId ?? undefined,
        scheduledStartAt: event.scheduledStartAt ?? new Date(),
        scheduledEndAt: event.scheduledEndAt ?? undefined,
        status: discordEventStatusToEventStatus(event.status),
        entityType: discordEntityTypeToEntityType(event.entityType),
      });
    } catch (err) {
      console.error("Error handling GuildScheduledEvent:", err);
    }
  };

  client.on(Events.GuildScheduledEventCreate, handleScheduledEvent);
  client.on(Events.GuildScheduledEventUpdate, (_old, newEvent) => {
    if (newEvent) handleScheduledEvent(newEvent).catch(console.error);
  });
  client.on(Events.GuildScheduledEventDelete, async (event) => {
    try {
      const events = await eventRepo.findByGuildId(event.guildId);
      const match = events.find((e) => e.name === event.name);
      if (match) await eventRepo.delete(match.id);
    } catch (err) {
      console.error("Error handling GuildScheduledEventDelete:", err);
    }
  });
}
