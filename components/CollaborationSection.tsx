import Link from "next/link";

type Props = {
  profile: any;
  allProfiles: any[];
};

// shows related profiles based on fans_also_viewed names
export default function CollaborationSection({
  profile,
  allProfiles,
}: Props) {

  // match internal profiles by name (case insensitive)
  const collaborations = allProfiles.filter(
    (p) =>
      profile.fans_also_viewed?.some(
        (fan: any) =>
          fan.name.trim().toLowerCase() ===
          p.name.trim().toLowerCase()
      )
  );

  return (
    <section className="section collaboration-section">
      <h3 className="section-title">Collaborations</h3>

      {collaborations.length === 0 ? (
        <p className="empty-message">
          No collaborations available.
        </p>
      ) : (
        <div className="collaboration-list">
          {collaborations.slice(0, 4).map((person: any, i: number) => (
            <Link
              key={i}
              href={`/profile/${person.name
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, "")
                .replace(/\s+/g, "-")}`}
              className="collaboration-card"
            >
              <img
                src={
                  person.image && person.image.startsWith("http")
                    ? person.image
                    : `/images/${person.image || "default.png"}`
                }
                alt={person.name}
                className="collaboration-image"
              />
              <p className="collaboration-name">{person.name}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}