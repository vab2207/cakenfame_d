type Props = {
  profile: any;
};

// basic personal information section
export default function PersonalSection({ profile }: Props) {
  return (
    <section className="section personal-section">
      <h3 className="section-title">Personal</h3>
      <p className="section-text">
        Born and raised in {profile.birthplace}.
      </p>
    </section>
  );
}