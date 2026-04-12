import type { GuildDTO, GuildMemberDTO, UserDTO, SessionDTO, EventDTO } from "../types";
import { GuildMemberDTOBuilder, UserDTOBuilder, SessionDTOBuilder, EventDTOBuilder } from "../builders";
import type { EventStatus, EventEntityType } from "../types";

export function mapRecordToGuildDTO(row: Record<string, unknown>): GuildDTO {
  return {
    id: String(row["id"]),
    name: String(row["name"]),
    iconUrl: row["icon_url"] ? String(row["icon_url"]) : undefined,
    memberCount: Number(row["member_count"]),
    createdAt: new Date(String(row["created_at"]))
  };
}

export function mapRecordToGuildMemberDTO(row: Record<string, unknown>): GuildMemberDTO {
  return new GuildMemberDTOBuilder()
    .setUserId(String(row["user_id"]))
    .setGuildId(String(row["guild_id"]))
    .setNickname(row["nickname"] ? String(row["nickname"]) : undefined)
    .setRoles(Array.isArray(row["roles"]) ? (row["roles"] as string[]) : [])
    .setJoinedAt(new Date(String(row["joined_at"])))
    .build();
}

export function mapRecordToUserDTO(row: Record<string, unknown>): UserDTO {
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

export function mapRecordToSessionDTO(row: Record<string, unknown>): SessionDTO {
  return new SessionDTOBuilder()
    .setId(String(row["id"]))
    .setUserId(String(row["user_id"]))
    .setAccessToken(String(row["access_token"]))
    .setRefreshToken(String(row["refresh_token"]))
    .setJwtToken(row["jwt_token"] ? String(row["jwt_token"]) : undefined)
    .setExpiresAt(new Date(String(row["expires_at"])))
    .setCreatedAt(new Date(String(row["created_at"])))
    .setUpdatedAt(new Date(String(row["updated_at"])))
    .build();
}

export function mapRecordToEventDTO(row: Record<string, unknown>): EventDTO {
  return new EventDTOBuilder()
    .setId(String(row["id"]))
    .setGuildId(String(row["guild_id"]))
    .setName(String(row["name"]))
    .setDescription(row["description"] ? String(row["description"]) : undefined)
    .setChannelId(row["channel_id"] ? String(row["channel_id"]) : undefined)
    .setScheduledStartAt(new Date(String(row["scheduled_start_at"])))
    .setScheduledEndAt(row["scheduled_end_at"] ? new Date(String(row["scheduled_end_at"])) : undefined)
    .setStatus(String(row["status"]) as EventStatus)
    .setEntityType(String(row["entity_type"]) as EventEntityType)
    .setCreatedAt(new Date(String(row["created_at"])))
    .setUpdatedAt(new Date(String(row["updated_at"])))
    .build();
}
