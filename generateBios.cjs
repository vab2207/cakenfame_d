require("dotenv").config();
const { Pool } = require("pg");
const OpenAI = require("openai");

/* ================= CONFIG ================= */

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const MODEL = "gpt-4o-mini";

const BATCH_SIZE = 1;       // safe start
const DELAY_MS = 1500;      // between batches
const ROW_DELAY_MS = 700;   // between rows
const MAX_RETRIES = 3;

/* ================= HELPERS ================= */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clean(value) {
  if (!value) return "Unknown";
  return String(value).trim();
}

/* ================= PROMPT ================= */

async function generateBio(person) {
  const name = clean(person.name);
  const profession = clean(person.profession);
  const birthplace = clean(person.birthplace);
  const birthday = clean(person.birthday);
  const birthSign = clean(person.birth_sign);
  const age = clean(person.age);

  const prompt = `
Write a natural, clean, professional FIVE paragraph biography about ${name}.

Use these known details only when useful:
Name: ${name}
Profession: ${profession}
Birthplace: ${birthplace}
Birthday: ${birthday}
Birth Sign: ${birthSign}
Age: ${age}

Paragraph rules:
1. Exactly 5 paragraphs.
2. Each paragraph 2 to 4 sentences.
3. Human sounding and engaging.
4. No headings.
5. No bullet points.
6. No fake awards, fake relationships, fake controversies, or made-up claims.
7. If information is limited, write generally and safely.
8. Mention career relevance and public recognition naturally.
9. Clean grammar and readable style.
10. Total around 220 to 420 words.

Tone:
Premium celebrity profile website style.
`;

  const response = await openai.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 700,
  });

  return response.choices?.[0]?.message?.content?.trim() || null;
}

/* ================= PROCESS ONE ROW ================= */

async function processPerson(person) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const bio = await generateBio(person);

      if (!bio) {
        throw new Error("Empty bio");
      }

      await pool.query(
        `
        UPDATE people
        SET full_bio = $1
        WHERE id = $2
        `,
        [bio, person.id]
      );

      console.log(`Saved: ${person.id} | ${person.name}`);
      return true;

    } catch (error) {
      console.error(
        `Retry ${attempt}/${MAX_RETRIES}: ${person.id} | ${person.name} | ${error.message}`
      );

      if (attempt < MAX_RETRIES) {
        await sleep(1200);
      } else {
        console.error(`FAILED: ${person.id} | ${person.name}`);
        return false;
      }
    }
  }
}

/* ================= MAIN RUN ================= */

async function run() {
  let processed = 0;
  let failed = 0;

  console.log("Starting bulk bio generation...");

  while (true) {
    const result = await pool.query(
      `
      SELECT
        id,
        name,
        profession,
        birthplace,
        birthday,
        birth_sign,
        age
      FROM people
      WHERE full_bio IS NULL
      ORDER BY id ASC
      LIMIT $1
      `,
      [BATCH_SIZE]
    );

    const rows = result.rows;

    if (rows.length === 0) {
      console.log("DONE ALL RECORDS");
      break;
    }

    for (const person of rows) {
      const ok = await processPerson(person);

      if (ok) {
        processed++;
      } else {
        failed++;
      }

      await sleep(ROW_DELAY_MS);
    }

    console.log(
      `Progress => Saved: ${processed} | Failed: ${failed}`
    );

    await sleep(DELAY_MS);
  }

  await pool.end();

  console.log("Completed.");
  process.exit();
}

run();