"use client";

import { useState } from "react";
import Link from "next/link";

export default function TwinsiesSection() {

  const [birthday, setBirthday] = useState("");
  const [cityBorn, setCityBorn] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [age, setAge] = useState("");
  const [birthSign, setBirthSign] = useState("");

  const handleFindTwin = async () => {

    try {
      const response = await fetch("/api/twins", {
        method: "POST",
        body: JSON.stringify({
          birthday,
          cityBorn,
          age,
          birthSign
        }),
      });

      const data = await response.json();

      // ✅ SAFETY FIX
      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }

    } catch (err) {
      console.error(err);
      setResults([]);
    }
  };

  return (
    <section>

      <h2>Who Shares Your Birthday?</h2>

      <div className="twinsies-layout">

        <div className="twin-card">

          <h3>Twin Match Result</h3>

          {results.length === 0 ? (
            <p>No results</p>
          ) : (
            results.map((person) => {
              const slug = person.slug;

              return (
                <Link
                  key={slug}
                  href={`/profile/${slug}`}
                  className="twin-result-item"
                >
                  <img
                    src={
                      person.image && person.image.startsWith("http")
                        ? person.image
                        : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`
                    }
                    alt={person.name}
                    width="80"
                  />
                  <p>{person.name?.replace(/^_+/, "")}</p>
                </Link>
              );
            })
          )}

        </div>

        <div className="twinsies-form">

          <input
            suppressHydrationWarning
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />

          <input
            suppressHydrationWarning
            placeholder="City Born"
            value={cityBorn}
            onChange={(e) => setCityBorn(e.target.value)}
          />

          <input
            suppressHydrationWarning
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <input
            suppressHydrationWarning
            placeholder="Birth Sign"
            value={birthSign}
            onChange={(e) => setBirthSign(e.target.value)}
          />

          <button onClick={handleFindTwin}>
            Find My Twin
          </button>

        </div>

      </div>

    </section>
  );
}