type Props = {
  profile: any;
};



// basic personal information section
export default function PersonalSection({ profile }: Props) {
  return (
    
    <div className="profile-header">

      <img
        src={
          profile.image ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}`
        }
        alt={profile.name}
        className="profile-image"
      />

      <div className="profile-info">
        <h1 className="profile-name">{profile.name}</h1>

        <p className="profile-profession">{profile.profession}</p>

        <div className="profile-meta">
          <p>
            <strong>Birthday:</strong>{" "}
            <a href={`/search?q=${new Date(profile.birthday).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric"
            })}`}>
              {new Date(profile.birthday).toDateString()}
            </a>
          </p>

          <p>
            <strong>Birthplace:</strong>{" "}
            <a href={`/search?q=${profile.birthplace}`}>
              {profile.birthplace}
            </a>
          </p>

          <p>
            <strong>Birth Sign:</strong>{" "}
            <a href={`/search?q=${profile.birth_sign}`}>
              {profile.birth_sign}
            </a>
          </p>

          <p>
            <strong>Profession:</strong>{" "}
            <a href={`/search?q=${profile.profession}`}>
              {profile.profession}
            </a>
          </p>
        </div>
      </div>

    </div>
  );
}