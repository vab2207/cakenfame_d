type Props = { profile: any };

export default function CareerSection({ profile }: Props) {
  const about =
    profile?.about ||
    profile?.content?.find(
      (item: any) => item.header === "About"
    )?.content;

  if (!about) return null;

  return (
    <section className="section">
      <h3 className="section-title">Career</h3>

      {about.split("\n").map((p: string, i: number) => (
        <p key={i} className="section-text">{p}</p>
      ))}
    </section>
  );
}