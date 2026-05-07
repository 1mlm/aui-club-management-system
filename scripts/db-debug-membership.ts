import { Client } from "pg";
import { getDbConfig } from "./db-common";

async function main() {
  const cfg = getDbConfig();
  const client = new Client({
    host: cfg.host,
    port: cfg.port,
    user: cfg.user,
    password: cfg.password,
    database: cfg.database,
  });
  await client.connect();
  try {
    const res = await client.query(`
      SELECT club_id, user_id FROM (
        SELECT club_id, ((club_id - 1) % 50) + 1 AS owner_id FROM generate_series(1,50) AS club_id
      ) clubs
      JOIN LATERAL (
        SELECT unnest(ARRAY[owner_id, ((owner_id % 50) + 1), ((owner_id % 50) + 2)]) AS user_id
      ) members ON TRUE
      ORDER BY club_id, user_id;
    `);
    console.log("rows:", res.rows.length);
    const out = res.rows.map((r) => ({
      club_id: r.club_id,
      user_id: Number(r.user_id),
    }));
    console.table(out);
    const bad = out.filter((r) => r.user_id > 50 || r.user_id < 1);
    console.log("bad rows count:", bad.length);
    if (bad.length) console.table(bad);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
