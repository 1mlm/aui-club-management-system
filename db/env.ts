type DbEnv = {
  user: string;
  password: string;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getDbEnv(): DbEnv {
  return {
    user: readRequiredEnv("DB_USER"),
    password: readRequiredEnv("DB_PASSWORD"),
  };
}
