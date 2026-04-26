import Link from "next/link";

type Props = {
  profile: any;
  sameDateProfiles: any[];
};

export default function BirthdaySidebar({
  profile,
  sameDateProfiles,
}: Props) {

  const date = new Date(profile.birthday);

  const monthDay = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className="birthday-d">

      <h3 className="d-title">
        More {monthDay} Birthdays
      </h3>

      <div className="sidebar-list">
        {sameDateProfiles.slice(0, 5).map((person: any, i: number) => (
          <Link
            key={i}
            href={`/profile/${person.slug}`}
            className="sidebar-item"
          >
            <img
              src={
                person.image && person.image.startsWith("http")
                  ? person.image
                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`
              }
              alt={person.name}
              className="sidebar-image"
            />
            <div>
              <p>{person.name?.replace(/^_+/, "")}</p>
              <p>{person.profession}</p>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}