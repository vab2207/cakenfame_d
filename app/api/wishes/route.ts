import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  const result = await pool.query(
    `SELECT username, message
     FROM birthday_wishes
     WHERE profile_slug = $1
     ORDER BY created_at DESC`,
    [slug]
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  try {
    const { slug, message, username } = await req.json();

    if (!slug || !message || !username) {
      return NextResponse.json(
        { error: "Missing data" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO birthday_wishes
       (profile_slug, message, username)
       VALUES ($1, $2, $3)`,
      [slug, message, username]
    );

    return NextResponse.json({
      message: "Wish added successfully"
    });

  } catch (err) {
    console.error("Wish POST Error:", err);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}