import Link from "next/link";

type Props = {
  profile: any;
  allProfiles: any[];
};

// shows related profiles under "fans also viewed"
export default function FansSection({
  profile,
  allProfiles,
}: Props) {

  // match profiles by comparing names (case insensitive)
  const fansViewed = allProfiles.filter(
    (p) =>
      profile.fans_also_viewed?.some(
        (fan: any) =>
          fan.name.trim().toLowerCase() ===
          p.name.trim().toLowerCase()
      )
  );

  return (
    <section className="section fans-section">

      <h3 className="section-title">
        {profile.name} Fans Also Viewed
      </h3>

      {fansViewed.length === 0 ? (
        <p className="empty-message">
          No related profiles available.
        </p>
      ) : (
        <div className="fans-list">
          {fansViewed.slice(0, 4).map((person: any, i: number) => (
            <Link
              key={i}
              href={`/profile/${person.name
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-")}`}
              className="fan-card"
            >
              <img
                src={
                  person.image && person.image.startsWith("http")
                    ? person.image
                    : `/images/${person.image || "default.png"}`
                }
                alt={person.name}
                className="fan-image"
              />
              <p className="fan-name">{person.name}</p>
            </Link>
          ))}
        </div>
      )}

    </section>
  );
}