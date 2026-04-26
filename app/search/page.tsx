import pool from "@/lib/db";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {

  const params = await searchParams;
  const query = params.q || "";

  const cleanedQuery = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();

  const result = await pool.query(
    `SELECT * FROM people
   WHERE 
     LOWER(name) ~* $1
     OR LOWER(profession) LIKE LOWER($2)
     OR LOWER(birthplace) LIKE LOWER($2)
     OR birth_sign ILIKE $2
     OR birthday ILIKE $2
   ORDER BY name ASC
   LIMIT 20`,
    [
      `\\m${cleanedQuery}\\M`,
      `%${query}%`
    ]
  );

  const profiles = result.rows;

  return (
    <main className="discovery-page">

      <Navbar />

      <div className="search-container">

        <h2 className="search-title">
          Search Results for "{query}"
        </h2>

        {profiles.length === 0 ? (
          <p className="search-empty">No results found.</p>
        ) : (
          <div className="search-grid">

            {profiles.map((person: any) => (
              <Link
                key={person.name}
                href={`/profile/${person.slug}`}
                className="search-card"
              >
                <img
                  src={
                    person.image && person.image.startsWith("http")
                      ? person.image
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`
                  }
                  alt={person.name}
                  className="search-image"
                />

                <div className="search-info">
                  <p className="search-name">
                    {person.name?.replace(/^_+/, "")}
                  </p>
                  <p className="search-profession">{person.profession}</p>
                </div>

              </Link>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}