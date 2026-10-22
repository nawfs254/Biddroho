import React from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Quote,
  Sparkles,
  Disc,
  Flame,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { getMembers } from "@/lib/dataService";
import BandRosterClient from "@/components/BandRosterClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Band & Official Lineup",
  description:
    "The story, official members, and philosophy of BIDDROHO. Meet Srijon Tawsif Hossain, Sayed Alvi Haque, Mahir Sakib, Nawfs Ul Ahsun Arnob, Zhasid Hasan Aurko, Yasin Ridoy, and Tanim Reza.",
};

export default async function BandPage() {
  const members = await getMembers();

  return (
    <div
      style={{
        backgroundColor: "#050506",
        minHeight: "100vh",
        paddingBottom: "6rem",
      }}
    >
      {/* Editorial Header */}
      <section
        style={{
          padding: "5rem 0 3rem",
          borderBottom: "1px solid var(--border-subtle)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="ambient-glow-spot"
          style={{ top: "-100px", left: "-50px" }}
        />
        <div
          className="site-container"
          style={{ position: "relative", zIndex: 1 }}
        >
          <span className="editorial-badge">// THE OFFICIAL LINEUP</span>
          <h1 className="section-title">THE ARCHITECTS OF REBELLION</h1>
          <p className="section-description">
            Founded in Dhaka in 2011, BIDDROHO emerged with a solitary creed: to
            forge uncompromising Bangladeshi rock that balances technical
            mastery with raw street defiance.
          </p>
        </div>
      </section>

      {/* 1. THE BIDDROHO STORY */}
      <section
        className="section-py"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="site-container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "4rem",
              alignItems: "center",
            }}
          >
            {/* Story Text */}
            <div>
              <span className="editorial-badge">// CHAPTER I: ORIGINS</span>
              <h2
                className="section-title"
                style={{ fontSize: "clamp(2.4rem, 4.5vw, 3.8rem)" }}
              >
                FIFTEEN YEARS OF UNBROKEN RESISTANCE
              </h2>

              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                }}
              >
                BIDDROHO was forged in underground rehearsal spaces in Dhaka in
                2011 during a critical turning point for South Asian independent
                rock. Tired of commercial clichés and timid soundscapes, the
                founding members dedicated themselves to heavier tunings,
                blistering tempos, and lyrics that directly confronted the
                fractures of modern existence.
              </p>

              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "1.05rem",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                }}
              >
                Over the past decade and a half, the lineup solidified into its
                current power formation. Integrating multi-layered keyboards,
                dual guitar polyphony, and an earth-quaking rhythm section,
                BIDDROHO has grown from underground club favorites to packing
                stadiums with roaring choruses.
              </p>

              {/* Milestones stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1.5rem",
                  borderTop: "1px solid var(--border-subtle)",
                  paddingTop: "2rem",
                }}
              >
                <div>
                  <span
                    className="font-display"
                    style={{
                      fontSize: "2.8rem",
                      color: "var(--crimson-base)",
                      lineHeight: 1,
                    }}
                  >
                    2011
                  </span>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Founded In Dhaka
                  </p>
                </div>
                <div>
                  <span
                    className="font-display"
                    style={{ fontSize: "2.8rem", color: "#fff", lineHeight: 1 }}
                  >
                    250+
                  </span>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Concerts Performed
                  </p>
                </div>
                <div>
                  <span
                    className="font-display"
                    style={{
                      fontSize: "2.8rem",
                      color: "var(--crimson-base)",
                      lineHeight: 1,
                    }}
                  >
                    07
                  </span>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Creative Minds
                  </p>
                </div>
              </div>
            </div>

            {/* Emblem Artwork showcase */}
            <div style={{ textAlign: "center", position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "440px",
                  aspectRatio: "1/1",
                  margin: "0 auto",
                  backgroundColor: "#070709",
                  border: "1px solid var(--border-subtle)",
                  padding: "2rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 50px rgba(229, 9, 20, 0.15)",
                }}
              >
                <div
                  style={{ position: "relative", width: "85%", height: "85%" }}
                >
                  <Image
                    src="/assets/logo.png"
                    alt="BIDDROHO Official Distressed Emblem"
                    fill
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  marginTop: "1rem",
                  letterSpacing: "0.1em",
                }}
              >
                OFFICIAL EMBLEM: THE GUITAR & EQUALIZER REBELLION
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BAND MEMBERS IN-DEPTH PROFILES (REAL NAMES) */}
      <section className="section-py">
        <div className="site-container">
          <div
            style={{
              textAlign: "center",
              maxWidth: "700px",
              margin: "0 auto 4rem",
            }}
          >
            <span
              className="editorial-badge"
              style={{ justifyContent: "center" }}
            >
              // THE ROSTER
            </span>
            <h2 className="section-title">THE BAND MEMBERS</h2>
            <p className="section-description" style={{ margin: "0 auto" }}>
              Every member brings a distinct sonic identity, forming the unified
              juggernaut that is BIDDROHO.
            </p>
          </div>

          {/* Interactive Members Roster with Click-to-Modal Expansion */}
          <BandRosterClient members={members} />
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section
        style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "4rem",
        }}
      >
        <div className="site-container" style={{ textAlign: "center" }}>
          <h2
            className="section-title"
            style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
          >
            BRING THE ENTIRE LINEUP TO YOUR VENUE
          </h2>
          <p className="section-description" style={{ margin: "0 auto 2rem" }}>
            Book Srijon Tawsif Hossain, Sayed Alvi Haque, Mahir Sakib, Nawfs Ul
            Ahsun Arnob, Zhasid Hasan Aurko, Yasin Ridoy, and Tanim Reza for
            stadium tours and festival appearances.
          </p>
          <Link
            href="/book"
            className="btn-primary"
            style={{ fontSize: "1.2rem", padding: "1rem 2.5rem" }}
          >
            SUBMIT CONCERT BOOKING <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
