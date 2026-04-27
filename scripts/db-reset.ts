import { Client } from "pg";
import {
  getDbConfig,
  quoteIdent,
  readSqlFile,
  stripCreateSqlDatabaseDirectives,
} from "./db-common";

const runSql = async (client: Client, sqlText: string, label: string) => {
  if (!sqlText.trim()) {
    console.log(`skip ${label}: empty sql`);
    return;
  }
  await client.query(sqlText);
  console.log(`applied ${label}`);
};

const main = async () => {
  const config = getDbConfig();

  const adminClient = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.adminDatabase,
  });

  await adminClient.connect();

  try {
    await adminClient.query(
      `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = $1 AND pid <> pg_backend_pid();`,
      [config.database],
    );

    await adminClient.query(
      `DROP DATABASE IF EXISTS ${quoteIdent(config.database)};`,
    );
    await adminClient.query(`CREATE DATABASE ${quoteIdent(config.database)};`);
    console.log(`database reset complete: ${config.database}`);
  } finally {
    await adminClient.end();
  }

  const appClient = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  await appClient.connect();

  try {
    const createSql = stripCreateSqlDatabaseDirectives(
      readSqlFile(config.createSchemaFile),
    );
    const appSchemaSql = readSqlFile(config.appSchemaFile);
    const seedSql = readSqlFile(config.seedFile);

    await runSql(appClient, createSql, "db/create.sql");
    await runSql(appClient, appSchemaSql, "db/query.sql");
    await runSql(appClient, seedSql, "db/populate.sql");
    console.log("db:reset success");
  } finally {
    await appClient.end();
  }
};

main().catch((error) => {
  console.error("db:reset failed");
  console.error(error.message);
  process.exit(1);
});
