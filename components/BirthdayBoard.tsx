"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function BirthdayBoard({ profile }: any) {

  const [message, setMessage] = useState("");
  const [wishes, setWishes] = useState<any[]>([]);

  const { data: session } = useSession();

  const fetchWishes = async () => {
    const res = await fetch(`/api/wishes?slug=${profile.slug}`);
    const data = await res.json();
    setWishes(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchWishes();
  }, [profile.slug]);

  const handlePost = async () => {
    const localUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("user") || "null")
        : null;

    const user = session?.user || localUser;

    if (!user) {
      alert("Please login to post");
      return;
    }

    if (!message.trim()) return;

    const rawName =
      user.name ||
      user.username ||
      user.email?.split("@")[0] ||
      "Anonymous";

    const parts = rawName.trim().split(" ");

    let displayName = parts[0];

    if (parts.length > 1) {
      displayName = `${parts[0]} ${parts[1].charAt(0)}.`;
    }

    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        slug: profile.slug,
        message,
        username: displayName
      })
    });

    if (!res.ok) {
      alert("Failed to post");
      return;
    }

    setMessage("");
    fetchWishes();
  };

  return (
    <section className="birthday-board">

      <h3>Birthday Board</h3>

      <div>
        <input
          placeholder={`Wish ${profile.name}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handlePost}>Post</button>
      </div>

      <div>
        {wishes.map((wish, index) => (
          <div key={index}>
            <strong>{wish.username}</strong>
            <p>{wish.message}</p>
          </div>
        ))}
      </div>

    </section>
  );
}