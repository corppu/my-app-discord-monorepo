import { cleanupExpiredSessions } from "./tasks/sessionCleanup.js";
import { closePool } from "@my-app/backend";

// Interval in milliseconds (default: 1 hour)
const CLEANUP_INTERVAL_MS = parseInt(
  process.env["CLEANUP_INTERVAL_MS"] ?? String(60 * 60 * 1000),
  10,
);

async function runTasks(): Promise<void> {
  console.log(
    `my-app-tasks started. Cleanup interval: ${CLEANUP_INTERVAL_MS}ms`,
  );

  // Run immediately on startup
  await cleanupExpiredSessions().catch((err) => {
    console.error("Session cleanup failed:", err);
  });

  // Schedule periodic cleanup
  const interval = setInterval(async () => {
    await cleanupExpiredSessions().catch((err) => {
      console.error("Session cleanup failed:", err);
    });
  }, CLEANUP_INTERVAL_MS);

  // Graceful shutdown
  process.on("SIGTERM", async () => {
    console.log("SIGTERM received, shutting down...");
    clearInterval(interval);
    await closePool();
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("SIGINT received, shutting down...");
    clearInterval(interval);
    await closePool();
    process.exit(0);
  });
}

runTasks().catch((err) => {
  console.error("Fatal error in my-app-tasks:", err);
  process.exit(1);
});
