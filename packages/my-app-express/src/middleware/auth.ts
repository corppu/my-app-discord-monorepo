import type { Request, Response, NextFunction } from "express";
import { SessionRepository } from "@my-app/backend";
import { getPool } from "@my-app/backend";
import { verifyJwt } from "../services/jwtService.js";

export interface AuthRequest extends Request {
  sessionData?: import("@my-app/common").SessionDTO;
  userId?: string;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const sessionId = req.cookies?.["session_id"] as string | undefined;

  if (!sessionId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const sessionRepo = new SessionRepository(getPool());
  const session = await sessionRepo.findById(sessionId).catch(() => null);

  if (!session) {
    res.status(401).json({ error: "Session not found or expired" });
    return;
  }

  if (session.expiresAt < new Date()) {
    res.status(401).json({ error: "Session expired" });
    return;
  }

  req.sessionData = session;
  req.userId = session.userId;
  next();
}

export async function requireNativeAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers["authorization"];

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const jwtToken = authHeader.slice(7);

  try {
    const payload = verifyJwt(jwtToken);
    const sessionRepo = new SessionRepository(getPool());
    const session = await sessionRepo.findByJwtToken(jwtToken).catch(() => null);

    if (!session) {
      res.status(401).json({ error: "Session not found or expired" });
      return;
    }

    if (session.expiresAt < new Date()) {
      res.status(401).json({ error: "Session expired" });
      return;
    }

    req.sessionData = session;
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
