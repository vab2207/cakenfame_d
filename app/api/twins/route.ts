import { NextResponse } from "next/server";
import pool from "@/lib/db";

const birthdayDate = `TO_DATE(birthday, 'FMMonth FMDD, YYYY')`;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { birthday, cityBorn, birthSign } = body;

    let month = null;
    let day = null;

    if (birthday) {
      const parsed = new Date(birthday);

      if (!isNaN(parsed.getTime())) {
        month = parsed.getMonth() + 1;
        day = parsed.getDate();
      }
    }

    const result = await pool.query(
      `
      SELECT *
      FROM people
      WHERE ($1::int IS NULL OR EXTRACT(MONTH FROM ${birthdayDate}) = $1)
        AND ($2::int IS NULL OR EXTRACT(DAY FROM ${birthdayDate}) = $2)
        AND ($3 = '' OR LOWER(birthplace) LIKE LOWER($3))
        AND ($4 = '' OR LOWER(birth_sign) LIKE LOWER($4))
      LIMIT 10
      `,
      [
        month,
        day,
        cityBorn ? `%${cityBorn}%` : "",
        birthSign ? `%${birthSign}%` : "",
      ]
    );

    return NextResponse.json(result.rows);

  } catch (error) {
    console.error("Twins API Error:", error);

    return NextResponse.json(
      { error: "Twin search failed" },
      { status: 500 }
    );
  }
}