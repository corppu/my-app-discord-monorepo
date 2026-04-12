import { Router } from "express";
import { randomBytes } from "crypto";
import { AuthCallbackDTOBuilder } from "@my-app/common";
import { SessionRepository, UserRepository, getPool } from "@my-app/backend";
import { buildAuthUrl, exchangeCode } from "../services/oidcService.js";
import { signJwt, getJwtExpiresAt } from "../services/jwtService.js";
import type { AuthRequest } from "../middleware/auth.js";
import { requireAuth } from "../middleware/auth.js";

export const authRouter = Router();

// Initiate OpenID login
authRouter.get("/login", async (_req, res) => {
  const state = randomBytes(16).toString("hex");
  const nonce = randomBytes(16).toString("hex");

  res.cookie("oidc_state", state, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 5 * 60 * 1000,
  });
  res.cookie("oidc_nonce", nonce, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 5 * 60 * 1000,
  });

  const authUrl = await buildAuthUrl(state, nonce);
  res.redirect(authUrl.toString());
});

// OpenID callback
authRouter.get("/callback", async (req, res) => {
  const callbackDto = new AuthCallbackDTOBuilder()
    .setCode(String(req.query["code"] ?? ""))
    .setState(String(req.query["state"] ?? ""))
    .build();

  const expectedState = req.cookies?.["oidc_state"] as string | undefined;
  const nonce = req.cookies?.["oidc_nonce"] as string | undefined;

  if (!expectedState || !nonce) {
    res.status(400).json({ error: "Missing OIDC state or nonce" });
    return;
  }

  const tokens = await exchangeCode(callbackDto.code, callbackDto.state, expectedState, nonce);

  const claims = tokens.claims();
  if (!claims) {
    res.status(400).json({ error: "No claims in token" });
    return;
  }

  const pool = getPool();
  const userRepo = new UserRepository(pool);
  const sessionRepo = new SessionRepository(pool);

  const sub = String(claims["sub"]);
  const user = await userRepo.upsert({
    discordId: sub,
    username: String(claims["preferred_username"] ?? claims["sub"]),
    displayName: String(claims["name"] ?? claims["preferred_username"] ?? claims["sub"]),
    email: claims["email"] ? String(claims["email"]) : undefined,
    avatarUrl: claims["picture"] ? String(claims["picture"]) : undefined,
  });

  const expiresAt = new Date(Date.now() + (tokens.expires_in ?? 3600) * 1000);

  const session = await sessionRepo.create({
    userId: user.id,
    accessToken: String(tokens.access_token ?? ""),
    refreshToken: String(tokens.refresh_token ?? ""),
    expiresAt,
  });

  res.clearCookie("oidc_state");
  res.clearCookie("oidc_nonce");

  res.cookie("session_id", session.id, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: expiresAt.getTime() - Date.now(),
  });

  res.json(session);
});

// Get native JWT token
authRouter.post("/native-token", requireAuth, async (req: AuthRequest, res) => {
  const session = req.sessionData;
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const pool = getPool();
  const sessionRepo = new SessionRepository(pool);

  const jwtExpiresAt = getJwtExpiresAt();
  const jwtToken = signJwt({ sub: session.userId, sessionId: session.id });

  const updated = await sessionRepo.update(session.id, { jwtToken, expiresAt: jwtExpiresAt });
  if (!updated) {
    res.status(500).json({ error: "Failed to update session" });
    return;
  }

  res.json({ jwtToken, expiresAt: jwtExpiresAt });
});

// Logout
authRouter.post("/logout", requireAuth, async (req: AuthRequest, res) => {
  const session = req.sessionData;
  if (session) {
    const pool = getPool();
    const sessionRepo = new SessionRepository(pool);
    await sessionRepo.deleteById(session.id).catch(() => undefined);
  }

  res.clearCookie("session_id");
  res.json({ message: "Logged out successfully" });
});
