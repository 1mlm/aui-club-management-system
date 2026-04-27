import { Client } from "pg";
import { getDbConfig } from "./db-common";

const main = async () => {
  const config = getDbConfig();
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  try {
    await client.connect();

    const result = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM users) as user_count,
        (SELECT COUNT(*) FROM club) as club_count,
        (SELECT COUNT(*) FROM membership) as membership_count,
        (SELECT COUNT(*) FROM post) as post_count,
        (SELECT COUNT(*) FROM role) as role_count,
        (SELECT COUNT(*) FROM permission) as permission_count;
    `);

    const counts = result.rows[0];
    console.log(`db:test success: connected to ${config.database}`);
    console.log(`users: ${counts.user_count}`);
    console.log(`clubs: ${counts.club_count}`);
    console.log(`memberships: ${counts.membership_count}`);
    console.log(`posts: ${counts.post_count}`);
    console.log(`roles: ${counts.role_count}`);
    console.log(`permissions: ${counts.permission_count}`);
  } finally {
    await client.end().catch(() => undefined);
  }
};

main().catch((error) => {
  console.error("db:test failed");
  console.error(error.message);
  process.exit(1);
});
