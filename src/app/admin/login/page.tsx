"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import MusicLoader from "@/components/ui/MusicLoader";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to authenticate.");
      }

      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#070709",
        backgroundImage:
          "radial-gradient(circle at 50% 20%, rgba(225, 29, 72, 0.08) 0%, transparent 60%)",
        padding: "24px",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          backgroundColor: "#0f0f13",
          border: "1px solid rgba(255, 255, 255, 0.09)",
          borderRadius: "6px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
          overflow: "hidden",
        }}
      >
        {/* Top Crimson Accent Strip */}
        <div style={{ height: "3px", backgroundColor: "#e11d48" }} />

        <div style={{ padding: "36px 32px" }}>
          {/* Logo & Headline */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                width: "54px",
                height: "54px",
                borderRadius: "6px",
                backgroundColor: "#18181b",
                border: "1px solid rgba(225, 29, 72, 0.35)",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/assets/logo.png"
                alt="BIDDROHO"
                width={38}
                height={38}
                style={{ objectFit: "contain" }}
              />
            </div>

            <h1
              style={{
                fontSize: "22px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                color: "#f4f4f5",
                fontFamily: "Cinzel, Georgia, serif",
                margin: "0 0 6px 0",
              }}
            >
              BIDDROHO
            </h1>

            <div
              style={{
                fontSize: "11px",
                letterSpacing: "0.18em",
                fontWeight: 700,
                color: "#e11d48",
                textTransform: "uppercase",
              }}
            >
              ADMINISTRATION & CMS PORTAL
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#71717a",
                marginTop: "10px",
              }}
            >
              Restricted management suite. Sign in with your band team
              credentials.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "4px",
                color: "#fca5a5",
                fontSize: "13px",
                marginBottom: "20px",
              }}
            >
              <AlertCircle
                size={16}
                color="#ef4444"
                style={{ flexShrink: 0 }}
              />
              <div>{error}</div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "#a1a1aa",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Team Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  color="#71717a"
                  style={{ position: "absolute", left: "12px", top: "12px" }}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin email"
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 38px",
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "4px",
                    color: "#f4f4f5",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#e11d48")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")
                  }
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  color: "#a1a1aa",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Security Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  color="#71717a"
                  style={{ position: "absolute", left: "12px", top: "12px" }}
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: "100%",
                    padding: "10px 14px 10px 38px",
                    backgroundColor: "#18181b",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "4px",
                    color: "#f4f4f5",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#e11d48")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(255, 255, 255, 0.12)")
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                backgroundColor: "#e11d48",
                color: "#ffffff",
                border: "none",
                borderRadius: "4px",
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                marginTop: "8px",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#be123c";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = "#e11d48";
              }}
            >
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <MusicLoader
                    size="inline"
                    text="AUTHENTICATING..."
                    showNotes={false}
                    showEq={true}
                  />
                </div>
              ) : (
                <>
                  <span>Enter Admin Portal</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", backgroundColor: "#070709" }} />
      }
    >
      <LoginForm />
    </Suspense>
  );
}
