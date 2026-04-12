import type { Client } from "discord.js";
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

export async function syncGuild(client: Client, guildId: string): Promise<void> {
  const pool = getPool();
  const guildRepo = new GuildRepository(pool);
  const userRepo = new UserRepository(pool);
  const eventRepo = new EventRepository(pool);

  console.log(`Syncing guild: ${guildId}`);

  const discordGuild = await client.guilds.fetch(guildId);
  await guildRepo.upsertGuild({
    id: discordGuild.id,
    name: discordGuild.name,
    iconUrl: discordGuild.iconURL() ?? undefined,
    memberCount: discordGuild.memberCount,
  });

  // Sync members
  const members = await discordGuild.members.fetch();
  for (const member of members.values()) {
    if (member.user.bot) continue;

    try {
      const user = await userRepo.upsert(
        new UserDTOBuilder()
          .setId("00000000-0000-4000-8000-000000000000")
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
          .setGuildId(discordGuild.id)
          .setNickname(member.nickname ?? undefined)
          .setRoles(member.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.id))
          .setJoinedAt(member.joinedAt ?? new Date())
          .build()
      );
    } catch (err) {
      console.error(`Error syncing member ${member.user.id}:`, err);
    }
  }

  // Sync scheduled events
  const events = await discordGuild.scheduledEvents.fetch();
  for (const event of events.values()) {
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
      console.error(`Error syncing event ${event.id}:`, err);
    }
  }

  console.log(`Guild ${guildId} sync completed`);
}

export async function syncAllGuilds(client: Client, guildIds: string[]): Promise<void> {
  for (const guildId of guildIds) {
    await syncGuild(client, guildId).catch((err) => {
      console.error(`Failed to sync guild ${guildId}:`, err);
    });
  }
}
