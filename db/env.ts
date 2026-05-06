type DbEnv = {
  user: string;
  password: string;
  database: string;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `\n❌  Missing required variable in .env: ${name}\n` +
      `    Open your .env file and add:\n\n` +
      `    ${name}=your_value_here\n`
    );
  }
  return value;
}

export function getDbEnv(): DbEnv {
  return {
    user: readRequiredEnv("DB_USER"),
    password: readRequiredEnv("DB_PASSWORD"),
    database: readRequiredEnv("DB_NAME"),
  };
}
