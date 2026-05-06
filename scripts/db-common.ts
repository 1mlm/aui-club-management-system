import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

const envPath = path.resolve(process.cwd(), ".env");

if (!fs.existsSync(envPath)) {
  console.error(
    "\n❌  .env file not found!\n" +
    "    Did you forget to create it? Copy .env.example to get started:\n\n" +
    "    cp .env.example .env\n\n" +
    "    Then fill in your DB_USER, DB_PASSWORD, and DB_NAME.\n"
  );
  process.exit(1);
}

dotenv.config({ path: envPath });

const readRequired = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    console.error(
      `\n❌  Missing required variable in .env: ${name}\n` +
      `    Open your .env file and add:\n\n` +
      `    ${name}=your_value_here\n`
    );
    process.exit(1);
  }
  return value;
};

const quoteIdent = (identifier: string): string =>
  `"${String(identifier).replaceAll('"', '""')}"`;

const readSqlFile = (filePath: string): string =>
  fs.readFileSync(filePath, "utf8");

const stripCreateSqlDatabaseDirectives = (sqlText: string): string => {
  const lines = sqlText.split(/\r?\n/);
  return lines
    .filter((line) => {
      const normalized = line.trim().toUpperCase();
      if (!normalized) return true;
      if (normalized.startsWith("DROP DATABASE")) return false;
      if (normalized.startsWith("CREATE DATABASE")) return false;
      if (normalized.startsWith("\\C")) return false;
      return true;
    })
    .join("\n");
};

const getDbConfig = () => ({
  host: "localhost",
  port: 5432,
  user: readRequired("DB_USER"),
  password: readRequired("DB_PASSWORD"),
  database: readRequired("DB_NAME"),
  adminDatabase: "postgres",
  createSchemaFile: path.resolve(process.cwd(), "db/sql/create.sql"),
  seedFile: path.resolve(process.cwd(), "db/sql/populate.sql"),
});

export {
  getDbConfig,
  quoteIdent,
  readSqlFile,
  stripCreateSqlDatabaseDirectives,
};
