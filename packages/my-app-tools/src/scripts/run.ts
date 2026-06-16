import { setupEnv } from "./setup-env.js";

const filePath = process.argv[2];
setupEnv(filePath).catch((err: unknown) => {
  console.error("Fatal error during env setup:", err);
  process.exit(1);
});
