// User DTO
export interface UserDTO {
  id: string;
  discordId: string;
  username: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Guild Member DTO
export interface GuildMemberDTO {
  userId: string;
  guildId: string;
  nickname?: string;
  roles: string[];
  joinedAt: Date;
}

// Guild DTO
export interface GuildDTO {
  id: string;
  name: string;
  iconUrl?: string;
  memberCount: number;
  createdAt: Date;
}

// Session DTO
export interface SessionDTO {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  jwtToken?: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Event DTO
export interface EventDTO {
  id: string;
  guildId: string;
  name: string;
  description?: string;
  channelId?: string;
  scheduledStartAt: Date;
  scheduledEndAt?: Date;
  status: EventStatus;
  entityType: EventEntityType;
  createdAt: Date;
  updatedAt: Date;
}

export type EventStatus = "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELED";
export type EventEntityType = "STAGE_INSTANCE" | "VOICE" | "EXTERNAL";

// Auth DTO
export interface AuthCallbackDTO {
  code: string;
  state: string;
}

export interface TokenDTO {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
}

export interface NativeTokenDTO {
  jwtToken: string;
  expiresAt: Date;
}

// Pagination DTO
export interface PaginationDTO {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedResultDTO<T> {
  items: T[];
  pagination: PaginationDTO;
}
