import { Router } from "express";
import { requireNativeAuth } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";
import { SessionRepository, getPool } from "@my-app/backend";
import { refreshTokens } from "../services/oidcService.js";

export const nativeRouter = Router();

// Get current session for native clients
nativeRouter.get("/session", requireNativeAuth, async (req: AuthRequest, res) => {
  const session = req.sessionData;
  if (!session) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Auto-refresh if within 5 minutes of expiry
  const fiveMinutesMs = 5 * 60 * 1000;
  if (session.expiresAt.getTime() - Date.now() < fiveMinutesMs) {
    try {
      const pool = getPool();
      const sessionRepo = new SessionRepository(pool);
      const refreshed = await refreshTokens(session.refreshToken);
      const expiresAt = new Date(Date.now() + (refreshed.expires_in ?? 3600) * 1000);
      const updated = await sessionRepo.update(session.id, {
        accessToken: String(refreshed.access_token ?? ""),
        refreshToken: String(refreshed.refresh_token ?? session.refreshToken),
        expiresAt,
      });
      if (updated) {
        res.json(updated);
        return;
      }
    } catch {
      // Return existing session if refresh fails
    }
  }

  res.json(session);
});
