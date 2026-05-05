import { Pool } from "pg";
import { getDbEnv } from "@/db/env";

const globalForDb = globalThis as unknown as {
  __pgPool?: Pool;
};

export function getDbPool() {
  if (!globalForDb.__pgPool) {
    const env = getDbEnv();
    globalForDb.__pgPool = new Pool({
      host: "localhost",
      port: 5432,
      user: env.user,
      password: env.password,
      database: "aui_clubs",
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return globalForDb.__pgPool;
}
