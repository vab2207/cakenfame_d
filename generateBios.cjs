require("dotenv").config();
const { Pool } = require("pg");
const OpenAI = require("openai");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BATCH_SIZE = 5;
const DELAY = 1200;
const MAX_RETRIES = 3;

function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function generateBio(name, profession, birthplace, birthday) {
  const prompt = `
Write a clean, natural, professional 3-paragraph biography for ${name}.

Details:
Profession: ${profession}
Birthplace: ${birthplace}
Birthday: ${birthday || "Unknown"}

Paragraph 1:
Introduce the person, profession, background.

Paragraph 2:
Career growth, achievements, recognition.

Paragraph 3:
Personal image, public appeal, current relevance.

Rules:
- Human sounding
- No fake claims
- No bullet points
- No headings
- 120 to 180 words total
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 260,
  });

  return response.choices?.[0]?.message?.content?.trim() || null;
}

async function processPerson(person) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const bio = await generateBio(
        person.name || "Unknown",
        person.profession || "Public figure",
        person.birthplace || "Unknown",
        person.birthday || ""
      );

      if (!bio) throw new Error("Empty bio");

      await pool.query(
        `UPDATE people SET full_bio = $1 WHERE id = $2`,
        [bio, person.id]
      );

      console.log("Saved:", person.id, person.name);
      return;

    } catch (err) {
      console.error(`Retry ${attempt}:`, person.name, err.message);

      if (attempt < MAX_RETRIES) {
        await sleep(1000);
      } else {
        console.error("FAILED:", person.id, person.name);
      }
    }
  }
}

async function run() {
  let processed = 0;

  while (true) {
    const result = await pool.query(
      `SELECT id, name, profession, birthplace, birthday
       FROM people
       WHERE full_bio IS NULL
       LIMIT $1`,
      [BATCH_SIZE]
    );

    if (result.rows.length === 0) {
      console.log("DONE ALL");
      break;
    }

    for (const person of result.rows) {
      await processPerson(person);
      processed++;
      await sleep(600);
    }

    console.log("Processed:", processed);

    await sleep(DELAY);
  }

  await pool.end();
  process.exit();
}

run();