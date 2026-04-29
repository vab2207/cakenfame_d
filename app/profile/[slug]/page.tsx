import { getProfile } from "@/lib/getProfile";
import { getProfilesByExactDate } from "@/lib/getProfilesByDate";
import { getAllProfiles } from "@/lib/getAllProfiles";

import Navbar from "@/components/Navbar";
import ProfileHeader from "@/components/ProfileHeader";
import PersonalSection from "@/components/PersonalSection";
import CollaborationSection from "@/components/CollaborationSection";
import BirthdaySidebar from "@/components/BirthdaySidebar";
import FansSection from "@/components/FansSection";
import OtherStarsSection from "@/components/OtherStarsSection";
import BirthdayBoard from "@/components/BirthdayBoard";
import BioSection from "@/components/BioSection";

// dynamic profile page based on slug
export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // extract slug from params
  const { slug } = await params;

  // fetch main profile
  const profile: any = await getProfile(slug);

  // fetch all profiles (used in related sections)
  const allProfiles: any[] = await getAllProfiles(150);
  // basic fallback if profile not found
  if (!profile) return <div>Profile not found</div>;

  // get people with same birthday (excluding current)
  const sameDateProfiles: any[] = await getProfilesByExactDate(
    profile.birthday
  );

  // fallback styled version (kept as is)
  if (!profile) return <div className="not-found">Profile not found</div>;

  return (
    <main className="profile-page">

      <Navbar />

      <div className="profile-container">

        <ProfileHeader profile={profile} />

        <div className="profile-layout">
          <section className="profile-main">
            <BioSection profile={profile} />
            <PersonalSection profile={profile} />
            <CollaborationSection
              profile={profile}
              allProfiles={allProfiles}
            />
          </section>

          <aside className="profile-sidebar">

            <BirthdayBoard profile={profile} />

            <BirthdaySidebar
              profile={profile}
              sameDateProfiles={sameDateProfiles}
            />

          </aside>
        </div>

        <section className="profile-bottom">
          <FansSection
            profile={profile}
            allProfiles={allProfiles}
          />
          <OtherStarsSection
            profile={profile}
            allProfiles={allProfiles}
          />
        </section>

      </div>

    </main>
  );
}