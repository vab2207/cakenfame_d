import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    await pool.query(
      `INSERT INTO users (email, password)
       VALUES ($1, $2)`,
      [email.trim().toLowerCase(), password]
    );

    return NextResponse.json({
      message: "Account created successfully"
    });

  } catch (error: any) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}