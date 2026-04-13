import { SessionRepository, getPool } from "@my-app/backend";

export async function cleanupExpiredSessions(): Promise<void> {
  const pool = getPool();
  const sessionRepo = new SessionRepository(pool);

  const deletedCount = await sessionRepo.deleteExpired();
  console.log(
    `[session-cleanup] Deleted ${deletedCount} expired sessions at ${new Date().toISOString()}`,
  );
}
