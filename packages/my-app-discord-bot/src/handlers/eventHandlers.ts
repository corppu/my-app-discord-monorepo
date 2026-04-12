import {
  Client,
  GatewayIntentBits,
  Events,
  type GuildMember,
  type GuildScheduledEvent,
} from "discord.js";
import { GuildRepository, UserRepository, EventRepository, getPool } from "@my-app/backend";
import { UserDTOBuilder, GuildMemberDTOBuilder, EventDTOBuilder } from "@my-app/common";
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

      const user = await userRepo.upsert(
        new UserDTOBuilder()
          .setId("00000000-0000-4000-8000-000000000000") // placeholder, overridden by upsert
          .setDiscordId(member.user.id)
          .setUsername(member.user.username)
          .setDisplayName(member.displayName)
          .setAvatarUrl(member.user.displayAvatarURL() ?? undefined)
          .setCreatedAt(new Date())
          .setUpdatedAt(new Date())
          .build()
      );

      await guildRepo.upsertMember(
        new GuildMemberDTOBuilder()
          .setUserId(user.id)
          .setGuildId(member.guild.id)
          .setNickname(member.nickname ?? undefined)
          .setRoles(member.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.id))
          .setJoinedAt(member.joinedAt ?? new Date())
          .build()
      );
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

      await guildRepo.upsertMember(
        new GuildMemberDTOBuilder()
          .setUserId(user.id)
          .setGuildId(newMember.guild.id)
          .setNickname(newMember.nickname ?? undefined)
          .setRoles(newMember.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.id))
          .setJoinedAt(newMember.joinedAt ?? new Date())
          .build()
      );
    } catch (err) {
      console.error("Error handling GuildMemberUpdate:", err);
    }
  });

  // Scheduled event create/update
  const handleScheduledEvent = async (event: GuildScheduledEvent): Promise<void> => {
    try {
      await eventRepo.upsert(
        new EventDTOBuilder()
          .setId("00000000-0000-4000-8000-000000000000")
          .setGuildId(event.guildId)
          .setName(event.name)
          .setDescription(event.description ?? undefined)
          .setChannelId(event.channelId ?? undefined)
          .setScheduledStartAt(event.scheduledStartAt ?? new Date())
          .setScheduledEndAt(event.scheduledEndAt ?? undefined)
          .setStatus(discordEventStatusToEventStatus(event.status))
          .setEntityType(discordEntityTypeToEntityType(event.entityType))
          .setCreatedAt(event.createdAt)
          .setUpdatedAt(new Date())
          .build()
      );
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
