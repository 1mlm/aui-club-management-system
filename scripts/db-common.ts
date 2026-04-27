import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const readRequired = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
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
  database: process.env.DB_NAME || "aui-clubs",
  adminDatabase: "postgres",
  createSchemaFile: path.resolve(process.cwd(), "db/create.sql"),
  appSchemaFile: path.resolve(process.cwd(), "db/query.sql"),
  seedFile: path.resolve(process.cwd(), "db/populate.sql"),
});

export {
  getDbConfig,
  quoteIdent,
  readSqlFile,
  stripCreateSqlDatabaseDirectives,
};
