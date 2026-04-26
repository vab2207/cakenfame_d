import ProfileCard from "./ProfileCard";
import { getYesterdaysBirthdays } from "@/lib/getProfilesByDate";

// section showing yesterday's birthdays
export default async function YesterdaySection() {

  const yesterdaysBirthdays = await getYesterdaysBirthdays();

  return (
    <section>

      <h2 className="section-title">Yesterday’s Birthdays</h2>

      {yesterdaysBirthdays.length === 0 ? (
        <p>No birthdays yesterday.</p>
      ) : (
        <div className="scroll-row">
          {yesterdaysBirthdays.map((person: any) => (
            <ProfileCard
              key={person.name}
              image={person.image}
              name={person.name}
              age={person.age}
              slug={person.slug}
            />
          ))}
        </div>
      )}

    </section>
  );
}