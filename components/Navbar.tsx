"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {

  const [query, setQuery] = useState("");
  const [localUser, setLocalUser] = useState<any>(null);

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setLocalUser(JSON.parse(stored));
  }, []);

  const user = localUser || session?.user;

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search?q=${query}`);
  };

  return (
    <header className="navbar">

      {/* LOGO */}
      <h1 className="navbar-logo">
        Cake<span className="logo-accent">&</span>Fame
      </h1>

      {/* RIGHT SIDE */}
      <div className="navbar-right">

        {/* SEARCH */}
        <div className="navbar-search-wrapper">
          <input
            type="text"
            placeholder="Search..."
            className="navbar-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <button
            className="navbar-search-btn"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {/* AUTH SECTION */}
        <div className="navbar-auth">
            <br />
          {!user ? (
            <Link href="/login" className="auth-login-btn">
              Login
            </Link>
          ) : (
            <>
              <span className="auth-username">
                {user.username || user.name}
              </span>

              <button
                className="auth-logout-btn"
                onClick={() => {
                  localStorage.removeItem("user");
                  signOut();
                  window.location.reload();
                }}
              >
                Logout
              </button>
            </>
          )}

        </div>
      </div>
    </header>
  );
}