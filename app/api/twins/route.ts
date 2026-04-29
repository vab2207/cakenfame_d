import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      birthday = "",
      cityBorn = "",
      birthSign = "",
      age = "",
    } = body;

    let month: number | null = null;
    let day: number | null = null;

    if (birthday) {
      const parsed = new Date(birthday);

      if (!isNaN(parsed.getTime())) {
        month = parsed.getMonth() + 1;
        day = parsed.getDate();
      }
    }

    const commonFields = `
      id,
      name,
      slug,
      image,
      profession,
      birthday,
      birthplace,
      birth_sign,
      age
    `;

    /* MAIN COMBINED MATCH */
    const mainResult = await pool.query(
      `
      SELECT ${commonFields}
      FROM people
      WHERE
        ($1::int IS NULL OR birth_month = $1)
        AND ($2::int IS NULL OR birth_day = $2)
        AND ($3 = '' OR LOWER(birthplace) LIKE LOWER($3))
        AND ($4 = '' OR LOWER(birth_sign) LIKE LOWER($4))
        AND ($5 = '' OR age = $5)
      LIMIT 10
      `,
      [
        month,
        day,
        cityBorn ? `%${cityBorn}%` : "",
        birthSign ? `%${birthSign}%` : "",
        age.trim(),
      ]
    );

    /* DOB ONLY */
    const dobMatches =
      month && day
        ? await pool.query(
            `
            SELECT ${commonFields}
            FROM people
            WHERE birth_month = $1
            AND birth_day = $2
            LIMIT 1
            `,
            [month, day]
          )
        : { rows: [] };

    /* CITY ONLY */
    const cityMatches = cityBorn
      ? await pool.query(
          `
          SELECT ${commonFields}
          FROM people
          WHERE LOWER(birthplace) LIKE LOWER($1)
          LIMIT 1
          `,
          [`%${cityBorn}%`]
        )
      : { rows: [] };

    /* SIGN ONLY */
    const signMatches = birthSign
      ? await pool.query(
          `
          SELECT ${commonFields}
          FROM people
          WHERE LOWER(birth_sign) LIKE LOWER($1)
          LIMIT 1
          `,
          [`%${birthSign}%`]
        )
      : { rows: [] };

    /* AGE ONLY */
    const ageMatches = age
      ? await pool.query(
          `
          SELECT ${commonFields}
          FROM people
          WHERE age = $1
          LIMIT 1
          `,
          [age.trim()]
        )
      : { rows: [] };

    return NextResponse.json({
      mainMatch: mainResult.rows,
      dobMatches: dobMatches.rows,
      cityMatches: cityMatches.rows,
      signMatches: signMatches.rows,
      ageMatches: ageMatches.rows,
    });
  } catch (error) {
    console.error("Twins API Error:", error);

    return NextResponse.json(
      { error: "Twin search failed" },
      { status: 500 }
    );
  }
}