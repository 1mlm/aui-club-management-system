import bcrypt from "bcryptjs";
import type { AuthUser } from "@/db/auth-types";
import { getDbPool } from "@/db/client";
import {
  isAuiEmail,
  isValidDisplayName,
  isValidPassword,
  MIN_PASSWORD_LENGTH,
} from "@/util/authRules";

const PASSWORD_SALT_ROUNDS = 12;

type UserRow = {
  user_id: number;
  email: string;
  fname: string;
  lname: string;
  display_name: string;
  password_hash: string;
  is_system_admin: boolean;
};

type UserLookupRow = UserRow & {
  club_count: number;
};

const toDisplayName = (
  row: Pick<UserRow, "display_name" | "fname" | "lname">,
): string => row.display_name || `${row.fname} ${row.lname}`.trim();

const buildAuthUser = (row: UserLookupRow): AuthUser => ({
  id: row.user_id,
  email: row.email,
  displayName: toDisplayName(row),
  clubCount: row.club_count,
  isSystemAdmin: row.is_system_admin,
});

const validateRegisterInput = ({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}) => {
  if (!isValidDisplayName(displayName)) {
    throw new Error(
      "Display name can use letters, numbers, spaces, dots, underscores, and hyphens only.",
    );
  }

  if (!isAuiEmail(email)) {
    throw new Error("Email must end with @aui.ma or a subdomain of aui.ma.");
  }

  if (!isValidPassword(password)) {
    throw new Error(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    );
  }
};

const validateLoginInput = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!isAuiEmail(email)) {
    throw new Error("Email must end with @aui.ma or a subdomain of aui.ma.");
  }

  if (!password) {
    throw new Error("Password is required.");
  }
};

export async function registerUser({
  displayName,
  email,
  password,
}: {
  displayName: string;
  email: string;
  password: string;
}): Promise<AuthUser> {
  const normalizedDisplayName = displayName.trim();
  const normalizedEmail = email.trim().toLowerCase();
  const displayNameParts = normalizedDisplayName.split(/\s+/);
  const fname = displayNameParts
    .slice(0, Math.max(displayNameParts.length - 1, 1))
    .join(" ");
  const lname =
    displayNameParts.length > 1
      ? (displayNameParts.at(-1) ?? normalizedDisplayName)
      : normalizedDisplayName;

  validateRegisterInput({
    displayName: normalizedDisplayName,
    email: normalizedEmail,
    password,
  });

  const pool = getDbPool();
  const passwordHash = await bcrypt.hash(password, PASSWORD_SALT_ROUNDS);

  const idRes = await pool.query<{ next_id: number }>(
    `SELECT COALESCE(MAX(user_id),0)+1 AS next_id FROM "user";`,
  );
  const newUserId = idRes.rows[0].next_id;

  const inserted = await pool.query<
    Pick<UserRow, "user_id" | "email" | "fname" | "lname" | "display_name">
  >(
    `
    INSERT INTO "user" (
      user_id,
      email,
      fname,
      lname,
      display_name,
      password_hash,
      is_system_admin,
      created_at
    )
    VALUES ($1, $2, $3, $4, $5, $6, FALSE, NOW())
    RETURNING user_id, email, fname, lname, display_name;
  `,
    [
      newUserId,
      normalizedEmail,
      fname,
      lname,
      normalizedDisplayName,
      passwordHash,
    ],
  );

  const row = inserted.rows[0];
  if (!row) {
    throw new Error("Registration failed.");
  }

  return {
    id: row.user_id,
    email: row.email,
    displayName: toDisplayName(row),
    clubCount: await getClubCountByUserId(row.user_id),
  };
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthUser> {
  const normalizedEmail = email.trim().toLowerCase();
  validateLoginInput({ email: normalizedEmail, password });

  const pool = getDbPool();
  const result = await pool.query<UserLookupRow>(
    `
    SELECT
      u.user_id,
      u.email,
      u.fname,
      u.lname,
      u.display_name,
      u.password_hash,
      u.is_system_admin,
      (
        SELECT COUNT(DISTINCT c.club_id)::int
        FROM "club" c
        WHERE c.owner_id = u.user_id AND c.status = 'active'
      ) + (
        SELECT COUNT(DISTINCT m.club_id)::int
        FROM membership m
        INNER JOIN "club" c ON c.club_id = m.club_id
        WHERE m.user_id = u.user_id
          AND c.status = 'active'
      ) AS club_count
    FROM "user" u
    WHERE u.email = $1
    LIMIT 1;
  `,
    [normalizedEmail],
  );

  const row = result.rows[0];
  if (!row?.password_hash) {
    throw new Error("Invalid email or password.");
  }

  const matches = await bcrypt.compare(password, row.password_hash);
  if (!matches) {
    throw new Error("Invalid email or password.");
  }

  return buildAuthUser(row);
}

export async function getUserById(userId: number): Promise<AuthUser | null> {
  const pool = getDbPool();
  const result = await pool.query<UserLookupRow>(
    `
    SELECT
      u.user_id,
      u.email,
      u.fname,
      u.lname,
      u.display_name,
      u.password_hash,
      u.is_system_admin,
      (
        SELECT COUNT(DISTINCT c.club_id)::int
        FROM "club" c
        WHERE c.owner_id = u.user_id AND c.status = 'active'
      ) + (
        SELECT COUNT(DISTINCT m.club_id)::int
        FROM membership m
        INNER JOIN "club" c ON c.club_id = m.club_id
        WHERE m.user_id = u.user_id
          AND c.status = 'active'
      ) AS club_count
    FROM "user" u
    WHERE u.user_id = $1
    LIMIT 1;
  `,
    [userId],
  );

  const row = result.rows[0];
  if (!row) {
    return null;
  }

  return buildAuthUser(row);
}

async function getClubCountByUserId(userId: number): Promise<number> {
  const pool = getDbPool();
  const result = await pool.query<{ club_count: number }>(
    `
    SELECT
      (
        SELECT COUNT(DISTINCT c.club_id)::int
        FROM "club" c
        WHERE c.owner_id = $1 AND c.status = 'active'
      ) + (
        SELECT COUNT(DISTINCT m.club_id)::int
        FROM membership m
        INNER JOIN "club" c ON c.club_id = m.club_id
        WHERE m.user_id = $1
          AND c.status = 'active'
      ) AS club_count;
  `,
    [userId],
  );

  return result.rows[0]?.club_count ?? 0;
}
