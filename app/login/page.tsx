"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful");

      router.push("/");
      router.refresh();
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    await signIn("google", {
      callbackUrl: "/"
    });
  };

  return (
    <main className="auth-page">
      <div className="auth-card">

        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading || googleLoading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading || googleLoading}
        />

        <button
          className="auth-btn"
          onClick={handleLogin}
          disabled={loading || googleLoading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <hr style={{ margin: "20px 0", opacity: 0.3 }} />

        <button
          className="auth-btn"
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          {googleLoading ? "Signing in..." : "Continue with Google"}
        </button>

        <p className="auth-link">
          Don’t have an account? <Link href="/signup">Sign up</Link>
        </p>

      </div>
    </main>
  );
}