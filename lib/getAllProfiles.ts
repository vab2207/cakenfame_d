import pool from "./db";

export async function getAllProfiles(limit = 300) {
  const result = await pool.query(
    `
    SELECT id, name, slug, profession, image, birthday
    FROM people
    ORDER BY name ASC
    LIMIT $1
    `,
    [limit]
  );

  return result.rows;
}