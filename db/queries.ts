import { getDbPool } from "@/db/client";
import type { ClubQueryRow, ClubRecord } from "@/db/types";
import { validateClubColor, validateClubIcon } from "@/db/validators";

const LIST_CLUBS_QUERY = `
  SELECT
    c.club_id AS id,
    c.name AS name,
    c.description AS description,
    c.main_color AS color,
    ci.icon_key AS icon
  FROM club c
  LEFT JOIN club_icon ci ON ci.club_id = c.club_id
  WHERE c.deleted_flag IS NOT TRUE
  ORDER BY c.club_id ASC;
`;

export async function listClubs(): Promise<ClubRecord[]> {
  const pool = getDbPool();
  const result = await pool.query<ClubQueryRow>(LIST_CLUBS_QUERY);

  return result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    color: validateClubColor(row.color),
    icon: validateClubIcon(row.icon),
  }));
}
