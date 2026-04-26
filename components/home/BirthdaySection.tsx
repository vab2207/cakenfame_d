import ProfileCard from "./ProfileCard";
import { getTodaysBirthdays, getUpcomingBirthdayCounts } from "@/lib/getProfilesByDate";

export default async function BirthdaySection() {

  const todaysBirthdays = await getTodaysBirthdays();
  console.log("TODAY:", todaysBirthdays);
  const upcomingBirthdays = await getUpcomingBirthdayCounts();

  return (
    <section className="birthday-section">

      <div className="birthday-today">
        <h2>Today's Birthdays</h2>

        <div className="birthday-grid">
          {todaysBirthdays.length === 0 && (
            <p>No birthdays today</p>
          )}

          {todaysBirthdays.map((profile: any) => (
            <ProfileCard
              key={profile.id}
              image={profile.image}
              name={profile.name}
              age={profile.age}
              slug={profile.slug}
            />
          ))}
        </div>
      </div>

      <div className="birthday-upcoming">
        <h3>Upcoming Birthdays</h3>

        <div className="birthday-upcoming-grid">
          {upcomingBirthdays.map((day: any, index: number) => (
            <div key={index} className="birthday-day">
              <span>{day.label} -- {day.count}</span>
            </div>
          ))}
        </div>
      </div>

    </section>

  );
}