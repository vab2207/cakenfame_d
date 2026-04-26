require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

function getAllJsonFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath));
    } else if (file.endsWith(".json")) {
      results.push(filePath);
    }
  });

  return results;
}

function slugify(name) {
  return name
    ?.toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-");
}

async function run() {
  try {
    const folder = path.join(__dirname, "data");
    const files = getAllJsonFiles(folder);

    for (const filePath of files) {
      try {
        const json = JSON.parse(fs.readFileSync(filePath, "utf8"));

        const name = json.name?.replace(/^_+/, "").trim();
        if (!name) continue;

        const slug = slugify(name);
        const profession = json.profession || null;

        
        const image =
          typeof json.image === "string" && json.image.startsWith("http")
            ? json.image
            : null;

        const aboutBlock = json.content?.find(
          (item) => item.header === "About"
        );
        const about = aboutBlock?.content || null;

        let birthday = null;
        if (json.birthday) {
          const parsed = new Date(json.birthday + " UTC");
          if (!isNaN(parsed)) {
            birthday = parsed.toISOString().split("T")[0];
          }
        }

        const birth_sign = json.birth_sign || null;
        const birthplace = json.birthplace || null;

        await pool.query(
          `INSERT INTO people
          (name, slug, profession, image, birthday, birth_sign, birthplace, about)
          VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
          ON CONFLICT (slug) DO NOTHING`,
          [
            name,
            slug,
            profession,
            image,
            birthday,
            birth_sign,
            birthplace,
            about,
          ]
        );

        console.log("Inserted:", name);
      } catch (err) {
        console.error("Error in file:", filePath, err.message);
      }
    }

    console.log("Import completed");
    process.exit();
  } catch (err) {
    console.error("Fatal error:", err.message);
    process.exit(1);
  }
}

run();