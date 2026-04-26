"use client";
import Link from "next/link";

type Props = {
  image: string;
  name: string;
  age: string;
  slug: string;
};

export default function ProfileCard({ image, name, age, slug }: Props) {

  const cleanName = name?.replace(/^_+/, "");

  return (
    <Link href={`/profile/${slug}`} className="profile-card">
      <div className="card-image-wrapper">

        <img
          src={
            image && image.startsWith("http")
              ? image
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(cleanName)}`
          }
          alt={cleanName}
          className="card-image"
        />

        <span className="card-star">★</span>

        <div className="card-overlay">
          <p className="card-name">{cleanName}</p>
          <p className="card-age">{age}</p>
        </div>

      </div>
    </Link>
  );
}