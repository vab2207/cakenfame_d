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
        })
      });

      const data = await response.json();

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

  const topMatch = results[0];

  return (
    <section style={{ width: "100%" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "1rem",
          padding: "2rem 1rem 5rem",
          alignItems: "stretch"
        }}
      >
        {/* LEFT FORM */}
        <div
          style={{
            padding: "1.4rem",
            borderRadius: "1.2rem",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)"
          }}
        >
          <h2 style={{ marginBottom: "1rem" }}>Who Shares Your Birthday?</h2>

          <input
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="City Born"
            value={cityBorn}
            onChange={(e) => setCityBorn(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Birth Sign"
            value={birthSign}
            onChange={(e) => setBirthSign(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* CENTER BUTTON */}
        <div
          style={{
            display: "grid",
            placeItems: "center"
          }}
        >
          <button
            onClick={handleFindTwin}
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "0.95rem 1.4rem",
              boxShadow: "0 10px 24px rgba(0,0,0,0.22)",
              fontWeight: 700,
              cursor: "pointer",
              background: "linear-gradient(135deg,#ff4e8a,#7a5cff)",
              color: "white",
              minWidth: "110px"
            }}
          >
            Match
          </button>
        </div>

        {/* RIGHT RESULT */}
        <div
          style={{
            padding: "1rem",
            borderRadius: "1.2rem",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(12px)"
          }}
        >
          <h3 style={{ marginBottom: "1rem" }}>Twin Match Result</h3>

          {!topMatch ? (
            <p style={{ opacity: 0.8 }}>No results yet</p>
          ) : (
            <Link
              href={`/profile/${topMatch.slug}`}
              style={{
                textDecoration: "none",
                color: "white"
              }}
            >
              <img
                src={
                  topMatch.image && topMatch.image.startsWith("http")
                    ? topMatch.image
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      topMatch.name
                    )}`
                }
                alt={topMatch.name}
                style={{
                  width: "100%",
                  height: "320px", 
                  objectFit: "cover",
                  borderRadius: "1rem",
                  marginBottom: "0.8rem"
                }}
              />

              <h3 style={{ marginBottom: "0.35rem" }}>{topMatch.name}</h3>
              <p style={{ opacity: 0.8 }}>
                {topMatch.profession || "Celebrity"}
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* BOTTOM MATCH BOXES */}
      <div
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: "1rem"
        }}
      >
        {[
          ["Birthday", birthday || "--"],
          ["City Born", cityBorn || "--"],
          ["Age", age || "--"],
          ["Birth Sign", birthSign || "--"]
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              padding: "1rem",
              borderRadius: "1rem",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.14)"
            }}
          >
            <p style={{ opacity: 0.75, marginBottom: "0.35rem" }}>{label}</p>
            <strong>{value}</strong>
          </div>
        ))}
      </div>

      {/* EXTRA RESULTS */}
      {results.length > 1 && (
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "1rem" }}>More Matches</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
              gap: "1rem"
            }}
          >
            {results.slice(1, 7).map((person) => (
              <Link
                key={person.slug}
                href={`/profile/${person.slug}`}
                style={{
                  textDecoration: "none",
                  color: "white",
                  padding: "0.8rem",
                  borderRadius: "1rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)"
                }}
              >
                <img
                  src={
                    person.image && person.image.startsWith("http")
                      ? person.image
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        person.name
                      )}`
                  }
                  alt={person.name}
                  style={{
                    width: "100%",
                    aspectRatio: "3/4",
                    objectFit: "cover",
                    borderRadius: "0.8rem",
                    marginBottom: "0.6rem"
                  }}
                />

                <p>{person.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.85rem 1rem",
  marginBottom: "0.8rem",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  color: "white",
  outline: "none"
};