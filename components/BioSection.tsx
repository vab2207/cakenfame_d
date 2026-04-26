type Props = { profile: any };

export default function BioSection({ profile }: Props) {
  const raw = profile?.full_bio || profile?.bio || "";

  const clean = raw.replace(/\s+/g, " ").trim();

  let sentences = clean
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);

  // remove repeated intro-like lines
  sentences = sentences.filter(
    (line: string) =>
      !line.toLowerCase().includes("year-old") &&
      !line.toLowerCase().includes(`from ${profile.birthplace}`.toLowerCase()) &&
      !line.toLowerCase().includes(`born on ${profile.birthday}`.toLowerCase())
  );

  const para1 = `${profile.name} is a ${profile.profession} from ${profile.birthplace}. Born on ${profile.birthday}, ${profile.name} is associated with the ${profile.birth_sign} zodiac sign and has gained recognition in the entertainment world.`;

  const para2 =
    sentences.slice(0, 3).join(" ") ||
    `${profile.name} has built a respected career and gained public attention through consistent work.`;

  const para3 =
    sentences.slice(3, 6).join(" ") ||
    `${profile.name} continues to remain active and appreciated by fans.`;

  return (
    <section className="section">
      <h3 className="section-title">Bio</h3>

      <p className="section-text">{para1}</p>
      <p className="section-text">{para2}</p>
      <p className="section-text">{para3}</p>
    </section>
  );
}