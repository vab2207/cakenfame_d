import Link from "next/link";

type Props = {
  profile: any;
  allProfiles: any[];
};

// shows other profiles with the same profession
export default function OtherStarsSection({
  profile,
  allProfiles,
}: Props) {

  // filter profiles by profession (case insensitive) and exclude current profile
  const similarProfession = allProfiles.filter(
    (p) =>
      p.profession?.trim().toLowerCase() ===
      profile.profession?.trim().toLowerCase() &&
      p.slug !== profile.slug
  );

  return (
    <section className="section other-stars-section">

      <h3 className="section-title">
        Other {profile.profession}
      </h3>

      {similarProfession.length === 0 ? (
        <p className="empty-message">
          No other profiles available.
        </p>
      ) : (
        <div className="other-stars-list">
          {similarProfession.slice(0, 4).map((person: any, i: number) => (
            <Link
              key={i}
              href={`/profile/${person.name
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-")}`}
              className="other-star-card"
            >
              <img
                src={
                  person.image && person.image.startsWith("http")
                    ? person.image
                    : `/images/${person.image || "default.png"}`
                }
                alt={person.name}
                className="other-star-image"
              />
              <p className="other-star-name">{person.name}</p>
            </Link>
          ))}
        </div>
      )}

    </section>
  );
}