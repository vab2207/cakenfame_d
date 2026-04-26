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
    const user = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;
    if (!user) {
      alert("Please login to post");
      return;
    }

    if (!message.trim()) return;

    const res = await fetch("/api/wishes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        slug: profile.slug,
        message,
        username: user?.username || user?.name || "Anonymous"
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