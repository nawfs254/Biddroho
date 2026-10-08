"use client";

import React from "react";
import Image from "next/image";
import { AlertTriangle, RefreshCw, Database, Radio } from "lucide-react";
import MusicLoader from "@/components/ui/MusicLoader";

export default function UnavailablePage() {
  const [reloading, setReloading] = React.useState(false);

  const handleReload = () => {
    setReloading(true);
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#050506",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "var(--font-sans, sans-serif)",
      }}
    >
      {/* Background glow effects */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(225, 29, 72, 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "560px",
          width: "100%",
          textAlign: "center",
          backgroundColor: "#0c0c0f",
          border: "1px solid rgba(225, 29, 72, 0.35)",
          borderRadius: "8px",
          padding: "48px 36px",
          boxShadow:
            "0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(225, 29, 72, 0.15)",
        }}
      >
        {/* Band Emblem & Icon */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div style={{ position: "relative", width: "56px", height: "56px" }}>
            <Image
              src="/assets/logo.png"
              alt="BIDDROHO Emblem"
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(225, 29, 72, 0.12)",
              border: "1px solid rgba(225, 29, 72, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#e11d48",
            }}
          >
            <Database size={24} />
          </div>
        </div>

        {/* Status Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "4px 12px",
            backgroundColor: "rgba(225, 29, 72, 0.15)",
            border: "1px solid #e11d48",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#e11d48",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#f43f5e",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            DATABASE OFFLINE • UNAVAILABLE PAGE
          </span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
            fontWeight: 800,
            letterSpacing: "0.08em",
            margin: "0 0 16px",
            color: "#ffffff",
            lineHeight: 1.15,
            fontFamily: "var(--font-display, sans-serif)",
          }}
        >
          SERVICE UNAVAILABLE
        </h1>

        {/* Explanatory Notice */}
        <p
          style={{
            fontSize: "14px",
            color: "#a1a1aa",
            lineHeight: 1.7,
            margin: "0 0 28px",
          }}
        >
          The official BIDDROHO portal cannot establish an active connection to
          the central servers. To ensure data integrity, site pages and media
          vaults are temporarily offline until the database connection is
          restored.
        </p>

        {/* Action button */}
        <div style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
          <button
            type="button"
            onClick={handleReload}
            disabled={reloading}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 28px",
              backgroundColor: "#e11d48",
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.05em",
              cursor: reloading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {reloading ? (
              <MusicLoader
                size="inline"
                text="RECONNECTING..."
                showNotes={false}
                showEq={true}
              />
            ) : (
              <>
                <RefreshCw size={15} />
                <span>RETRY CONNECTION</span>
              </>
            )}
          </button>
        </div>

        <div
          style={{
            marginTop: "32px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            fontSize: "11px",
            color: "#71717a",
            letterSpacing: "0.05em",
          }}
        >
          BIDDROHO DIGITAL PORTAL • STATUS 503 DATABASE UNAVAILABLE
        </div>
      </div>
    </div>
  );
}
