import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Ticket,
  Clock,
  ArrowRight,
  ShieldCheck,
  Flame,
} from "lucide-react";
import { getEvents } from "@/lib/dataService";
import EventCard from "@/components/EventCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Live Shows & Tour Dates",
  description:
    "Official tour dates and concerts for BIDDROHO. Stadium shows, rock festivals, and venue performances across Bangladesh.",
};

export default async function EventsPage() {
  const events = await getEvents();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isUpcoming = (e: any) => {
    if (e.status === "upcoming") return true;
    if (e.status === "past") return false;
    if (!e.date) return true;
    return new Date(e.date) >= today;
  };

  const upcomingEvents = events.filter(isUpcoming);
  const pastEvents = events.filter((e) => !isUpcoming(e));

  return (
    <div
      style={{
        backgroundColor: "#050506",
        minHeight: "100vh",
        paddingBottom: "6rem",
      }}
    >
      {/* Header */}
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
          <span className="editorial-badge">// CONCERTS & TOURS</span>
          <h1 className="section-title">THE LIVE CRUCIBLE</h1>
          <p className="section-description">
            Experience the thunderous volume, physical intensity, and unified
            chanting of thousands. Secure official passes or review recaps of
            legendary past performances.
          </p>
        </div>
      </section>

      {/* 1. UPCOMING SHOWS */}
      <section
        className="section-py"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="site-container">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "2.5rem",
            }}
          >
            <Flame size={24} color="var(--crimson-base)" />
            <h2
              className="section-title"
              style={{ fontSize: "2.5rem", marginBottom: 0 }}
            >
              UPCOMING PERFORMANCES ({upcomingEvents.length})
            </h2>
          </div>

          {upcomingEvents.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {upcomingEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "4rem 1.5rem",
                border: "1px dashed var(--border-subtle)",
                background: "rgba(255, 255, 255, 0.01)",
              }}
            >
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "1rem",
                  margin: 0,
                }}
              >
                No data available
              </p>
            </div>
          )}

          {/* Ticket assurance banner */}
          <div
            style={{
              marginTop: "3.5rem",
              backgroundColor: "#0a0a0e",
              border: "1px solid var(--border-subtle)",
              padding: "1.75rem 2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "2rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <ShieldCheck size={28} color="var(--crimson-base)" />
              <div>
                <strong
                  style={{ color: "#fff", fontSize: "1rem", display: "block" }}
                >
                  OFFICIAL TICKETING GUARANTEE
                </strong>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                  }}
                >
                  Always purchase tickets only through authorized links
                  displayed on this official website to prevent counterfeit
                  passes.
                </p>
              </div>
            </div>

            <Link
              href="/book"
              className="btn-outline-red"
              style={{ fontSize: "0.85rem" }}
            >
              BOOK BIDDROHO FOR YOUR EVENT
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PAST PERFORMANCES */}
      {pastEvents.length > 0 && (
        <section className="section-py">
          <div className="site-container">
            <div style={{ marginBottom: "2.5rem" }}>
              <span className="editorial-badge">// ARCHIVES</span>
              <h2 className="section-title" style={{ fontSize: "2.5rem" }}>
                PAST CONCERT ARCHIVES
              </h2>
              <p className="section-description">
                Browse photo sets, setlists, and stage recaps from previous
                headline performances.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {pastEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
