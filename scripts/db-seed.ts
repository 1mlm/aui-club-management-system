import { Client } from "pg";
import { getDbConfig, readSqlFile } from "./db-common";

const main = async () => {
  const config = getDbConfig();
  const sqlText = readSqlFile(config.seedFile);

  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  await client.connect();

  try {
    await client.query(sqlText);
    console.log("db:seed success");
  } finally {
    await client.end();
  }
};

main().catch((error) => {
  console.error("db:seed failed");
  console.error(error.message);
  process.exit(1);
});
