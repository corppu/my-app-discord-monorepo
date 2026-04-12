import * as jwt from "jsonwebtoken";
import type { SessionDTO } from "@my-app/common";

const JWT_SECRET = process.env["JWT_SECRET"];
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  sub: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

function getJwtSecret(): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is required");
  }
  return JWT_SECRET;
}

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}

export function getJwtExpiresAt(): Date {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
}

export function isSessionExpired(session: SessionDTO): boolean {
  return session.expiresAt < new Date();
}
