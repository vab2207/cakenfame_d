"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import "../style3.css";

export default function TwinzyPage() {
  const [birthday, setBirthday] = useState("");
  const [cityBorn, setCityBorn] = useState("");
  const [birthSign, setBirthSign] = useState("");
  const [age, setAge] = useState("");

  const [mainMatch, setMainMatch] = useState<any[]>([]);
  const [dobMatches, setDobMatches] = useState<any[]>([]);
  const [cityMatches, setCityMatches] = useState<any[]>([]);
  const [signMatches, setSignMatches] = useState<any[]>([]);
  const [ageMatches, setAgeMatches] = useState<any[]>([]);

  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleMatch() {
    try {
      setLoading(true);

      const res = await fetch("/api/twins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          birthday,
          cityBorn,
          birthSign,
          age,
        }),
      });

      const data = await res.json();

      setMainMatch(data.mainMatch || []);
      setDobMatches(data.dobMatches || []);
      setCityMatches(data.cityMatches || []);
      setSignMatches(data.signMatches || []);
      setAgeMatches(data.ageMatches || []);

      setSearched(true);
    } catch (error) {
      console.error(error);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }

  const topMatch = mainMatch[0];

  function getImage(person: any) {
    if (person?.image && person.image.startsWith("http")) {
      return person.image;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      person?.name || "Celebrity"
    )}`;
  }

  const cards = [
    { label: "Date of Birth", person: dobMatches[0] },
    { label: "Birth City", person: cityMatches[0] },
    { label: "Sun Sign", person: signMatches[0] },
    { label: "Age", person: ageMatches[0] },
    { label: "Popular Match", person: mainMatch[1] },
    { label: "Trending", person: mainMatch[2] },
    { label: "More Twins", person: mainMatch[3] },
  ];

  return (
    <main className="twinzy-page">
      <Navbar />

      <section className="twinzy-shell">
        <div className="twinzy-panel">

          <h1 className="twinzy-title">
            Find your Ultimate Twinzy!
          </h1>

          <div className="twinzy-top-grid">

            <div className="twinzy-form">
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />

              <input
                placeholder="City Born"
                value={cityBorn}
                onChange={(e) => setCityBorn(e.target.value)}
              />

              <input
                placeholder="Sun Sign"
                value={birthSign}
                onChange={(e) => setBirthSign(e.target.value)}
              />

              <input
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="twinzy-action">
              <button onClick={handleMatch}>
                {loading ? "..." : "Match"}
              </button>
            </div>

            <div className="twinzy-result">
              {!searched ? (
                <div className="result-empty">
                  Start Matching
                </div>
              ) : !topMatch ? (
                <div className="result-empty">
                  No Twin Found
                </div>
              ) : (
                <Link
                  href={`/profile/${topMatch.slug}`}
                  className="result-card"
                >
                  <img
                    src={getImage(topMatch)}
                    alt={topMatch.name}
                  />

                  <div className="result-info">
                    <h3>{topMatch.name}</h3>
                    <p>
                      {topMatch.profession || "Celebrity"}
                    </p>
                  </div>
                </Link>
              )}
            </div>

          </div>

          <div className="matches-heading">
            Your matches based on:
          </div>

          <div className="matches-grid">
            {cards.map((item) => (
              item.person ? (
                <Link
                  href={`/profile/${item.person.slug}`}
                  className="mini-card"
                  key={item.label}
                >
                  <span>{item.label}</span>
                  <strong>1+</strong>
                  <small>Matches</small>

                  <img
                    src={getImage(item.person)}
                    alt={item.person.name}
                  />

                  <p className="mini-name">
                    {item.person.name}
                  </p>
                </Link>
              ) : (
                <div
                  className="mini-card"
                  key={item.label}
                >
                  <span>{item.label}</span>
                  <strong>--</strong>
                  <small>Idle</small>

                  <div className="mini-placeholder">
                    ?
                  </div>

                  <p className="mini-name">
                    Not Found
                  </p>
                </div>
              )
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}