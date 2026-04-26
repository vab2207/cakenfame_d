import pool from "@/lib/db";

export async function getProfile(slug: string) {
  const result = await pool.query(
    `SELECT * FROM people WHERE slug = $1 LIMIT 1`,
    [slug]
  );

  const row = result.rows[0];

  console.log("ABOUT =", row?.about);
  console.log("FULL_BIO =", row?.full_bio);
  console.log("FANS =", row?.fans_also_viewed);

  return row;
}