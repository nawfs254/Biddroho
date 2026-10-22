"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { useLiveContainerScroll } from "@/lib/useLiveContainerScroll";
import {
  Play,
  Calendar,
  Disc,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { RELEASES_DATA } from "@/data/mockData";

interface Track {
  number: number;
  title: string;
  duration: string;
}

interface Release {
  _id?: string;
  title: string;
  slug: string;
  type: string;
  releaseDate: string;
  coverImage: string;
  fullDescription: string;
  tracks?: Track[];
  streamingLinks?: {
    spotify?: string;
    youtube?: string;
    appleMusic?: string;
  };
}

interface AppleHeroScrollerProps {
  latestRelease?: Release | null;
}

export default function AppleHeroScroller({
  latestRelease,
}: AppleHeroScrollerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const release = latestRelease || RELEASES_DATA[0];
  const hasRelease = true;

  // Track scroll through the 240vh container with live hardware-accurate scroll
  const scrollYProgress = useLiveContainerScroll(containerRef, {
    startOffset: 0,
  });

  if (typeof window !== "undefined") {
    (window as any).__heroProgress = scrollYProgress;
  }

  // Hero transformations (only morph if an album exists to reveal)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.32], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.40], [1, 0.88]);
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const heroRadius = useTransform(scrollYProgress, [0, 0.32], [0, 28]);
  const heroDarken = useTransform(scrollYProgress, [0, 0.32], [0, 0.85]);

  // Album reveal transformations (starts earlier, no black gap)
  const albumOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.42, 0.94, 1],
    [0, 1, 1, 0.9],
  );
  const albumScale = useTransform(scrollYProgress, [0.22, 0.45], [0.85, 1]);
  const albumY = useTransform(scrollYProgress, [0.22, 0.45], [70, 0]);

  // Vinyl disc slide-out (55% with left offset so label and disc grooves are 100% visible)
  const vinylX = useTransform(scrollYProgress, [0.24, 0.56], ["0%", "55%"]);
  const vinylRotate = useTransform(scrollYProgress, [0.22, 0.85], [0, 720]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        height: hasRelease ? "240vh" : "calc(100vh - 10px)",
        backgroundColor: "#050506",
        marginTop: "-80px",
        touchAction: "pan-y",
      }}
    >
      {/* Sticky Viewport Stage */}
      <div
        style={{
          position: hasRelease ? "sticky" : "relative",
          top: 0,
          height: hasRelease ? "100vh" : "100%",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "60px",
          touchAction: "pan-y",
        }}
      >
        {/* Layer A: CINEMATIC HERO (Scales down & morphs as you scroll) */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            opacity: heroOpacity,
            scale: heroScale,
            borderRadius: heroRadius,
            overflow: "hidden",
          }}
        >
          {/* Background Live Concert Visual */}
          <div
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <Image
              src="/assets/hero_live.jpg"
              alt="BIDDROHO Performing Live in Concert"
              fill
              priority
              style={{
                objectFit: "cover",
                objectPosition: "center 40%",
              }}
            />
            {/* Atmospheric Darkening on Scroll (GPU-composited) */}
            <motion.div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: "#050506",
                opacity: heroDarken,
              }}
            />
            {/* Atmospheric Vignette Gradients */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(5,5,6,0.7) 0%, rgba(5,5,6,0.2) 40%, rgba(5,5,6,0.92) 85%, #050506 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at center, transparent 30%, rgba(5,5,6,0.85) 90%)",
              }}
            />
          </div>

          {/* Ambient Crimson Glow */}
          <div
            style={{
              position: "absolute",
              top: "35%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "650px",
              height: "400px",
              background:
                "radial-gradient(circle, rgba(229, 9, 20, 0.22) 0%, transparent 70%)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />

          {/* Hero Typography & CTAs */}
          <motion.div
            style={{
              position: "relative",
              zIndex: 2,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 1.5rem",
              y: heroY,
            }}
          >
            {/* Band Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.85rem",
                marginBottom: "1.25rem",
                backgroundColor: "rgba(5, 5, 6, 0.75)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid var(--border-subtle)",
                padding: "0.45rem 1.35rem",
                borderRadius: "999px",
              }}
            >
              <div
                style={{ position: "relative", width: "20px", height: "20px" }}
              >
                <Image
                  src="/assets/logo.png"
                  alt="BIDDROHO Symbol"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.85rem",
                  letterSpacing: "0.22em",
                  color: "var(--crimson-base)",
                }}
              >
                ESTABLISHED 2011 • BANGLADESHI ROCK BAND
              </span>
            </div>

            {/* Giant Title */}
            <h1
              className="font-display"
              style={{
                fontSize: "clamp(4.2rem, 15vw, 11rem)",
                lineHeight: 0.88,
                letterSpacing: "0.04em",
                color: "#ffffff",
                textShadow:
                  "0 0 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(229, 9, 20, 0.3)",
                marginBottom: "1.5rem",
                textTransform: "uppercase",
              }}
            >
              BIDDROHO
            </h1>

            {/* Tagline */}
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(1.1rem, 2.5vw, 1.45rem)",
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "#e4e4e7",
                maxWidth: "680px",
                margin: "0 auto 2.5rem",
              }}
            >
              Six Souls, One Sound, Pure Energy !!!
            </p>

            {/* CTA Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/music"
                className="btn-primary"
                style={{
                  fontSize: "1.15rem",
                  padding: "0.95rem 2.4rem",
                }}
              >
                <Play size={18} fill="#fff" /> LISTEN NOW
              </Link>
              <Link
                href="/events"
                className="btn-secondary"
                style={{
                  fontSize: "1.15rem",
                  padding: "0.95rem 2.4rem",
                }}
              >
                <Calendar size={18} /> UPCOMING SHOWS
              </Link>
            </div>

            {/* Floating Apple-Style Scroll Prompt */}
            <div
              style={{
                position: "absolute",
                bottom: "2.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.4rem",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                letterSpacing: "0.25em",
                fontFamily: "var(--font-display)",
              }}
            >
              <span>SCROLL TO UNVEIL</span>
              <div
                style={{
                  width: "1px",
                  height: "24px",
                  backgroundColor: "var(--crimson-base)",
                  animation: "pulse 1.8s infinite ease-in-out",
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Layer B: APPLE-STYLE ALBUM REVEAL (Presents itself as user scrolls down) */}
        {release && (
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "calc(80px + 1rem)",
              paddingBottom: "1.5rem",
              paddingLeft: "1.5rem",
              paddingRight: "1.5rem",
              opacity: albumOpacity,
              scale: albumScale,
              y: albumY,
              pointerEvents: useTransform(scrollYProgress, (v: number) =>
                v < 0.22 ? "none" : "auto",
              ),
              zIndex: 3,
            }}
          >
            <div
              className="site-container"
              style={{
                maxWidth: "1100px",
                width: "100%",
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: `
                @media (max-width: 768px) {
                  .hero-album-card {
                    grid-template-columns: 1fr !important;
                    gap: 1.25rem !important;
                    padding: 1.25rem 1rem !important;
                    max-height: 86vh !important;
                    overflow: visible !important;
                  }
                  .hero-album-vinyl-box {
                    max-width: 175px !important;
                    margin: 0 auto 0.5rem !important;
                    transform: translateX(-24px) !important;
                  }
                  .hero-album-tracks {
                    display: none !important;
                  }
                }
              ` }} />
              <div
                className="hero-album-card"
                style={{
                  background: "rgba(15, 15, 20, 0.72)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "24px",
                  boxShadow:
                    "0 30px 80px rgba(0, 0, 0, 0.8), 0 0 50px rgba(229, 9, 20, 0.15)",
                  padding: "clamp(1.5rem, 4vw, 3rem)",
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                  gap: "clamp(3.5rem, 6.5vw, 6rem)",
                  alignItems: "center",
                  position: "relative",
                  overflow: "visible",
                }}
              >
                {/* Subtle Apple Gloss Accent on Card */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                  }}
                />

                {/* Left Column: Interactive Vinyl + Sleeve Showcase */}
                <div
                  className="hero-album-vinyl-box"
                  style={{
                    position: "relative",
                    width: "100%",
                    maxWidth: "340px",
                    margin: "0 auto",
                    aspectRatio: "1/1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* Vinyl Disc that slides out and spins */}
                  <motion.div
                    style={{
                      position: "absolute",
                      width: "92%",
                      height: "92%",
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, #111 20%, #1c1c1c 45%, #0d0d0d 65%, #181818 100%)",
                      border: "2px solid #2a2a2a",
                      boxShadow:
                        "0 15px 35px rgba(0,0,0,0.85), 0 0 35px rgba(229, 9, 20, 0.45), inset 0 0 20px rgba(0,0,0,0.9)",
                      x: vinylX,
                      rotate: vinylRotate,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    {/* Vinyl Conic Specular Highlight that rotates */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        background:
                          "conic-gradient(from 0deg, rgba(255,255,255,0.14) 0deg, transparent 40deg, rgba(255,255,255,0.08) 180deg, transparent 220deg, rgba(255,255,255,0.14) 360deg)",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Vinyl Grooves */}
                    <div
                      style={{
                        position: "absolute",
                        inset: "12%",
                        borderRadius: "50%",
                        border: "1px dashed rgba(255,255,255,0.08)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: "24%",
                        borderRadius: "50%",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    />

                    {/* Center Vinyl Label */}
                    <div
                      style={{
                        position: "relative",
                        width: "32%",
                        height: "32%",
                        borderRadius: "50%",
                        backgroundColor: "var(--crimson-dark)",
                        border: "3px solid #000",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        boxShadow: "0 0 10px rgba(0,0,0,0.8)",
                      }}
                    >
                      <Disc size={22} color="#fff" />

                      {/* Center Spindle Hole */}
                      <div
                        style={{
                          position: "absolute",
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: "#050506",
                          border: "2px solid rgba(255, 255, 255, 0.4)",
                          boxShadow: "inset 0 0 3px #000",
                        }}
                      />
                    </div>
                  </motion.div>

                  {/* Album Cover Sleeve */}
                  <div
                    style={{
                      position: "relative",
                      width: "94%",
                      height: "94%",
                      borderRadius: "14px",
                      overflow: "hidden",
                      boxShadow:
                        "0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(229, 9, 20, 0.25)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      zIndex: 2,
                      backgroundColor: "#0a0a0c",
                    }}
                  >
                    <Image
                      src={release.coverImage}
                      alt={release.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    {/* Glass Reflection Over Sleeve */}
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
                        pointerEvents: "none",
                      }}
                    />
                  </div>
                </div>

                {/* Right Column: Album Specs & Stream Links */}
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    paddingLeft: "clamp(0.5rem, 2vw, 1.5rem)",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "0.85rem",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "var(--crimson-subtle)",
                        color: "var(--crimson-base)",
                        border: "1px solid var(--border-red)",
                        padding: "0.25rem 0.75rem",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.85rem",
                        letterSpacing: "0.15em",
                        borderRadius: "6px",
                      }}
                    >
                      {release.type.toUpperCase()} • LATEST RECORD
                    </span>
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.85rem",
                      }}
                    >
                      {release.releaseDate}
                    </span>
                  </div>

                  <h2
                    className="font-display"
                    style={{
                      fontSize: "clamp(2.4rem, 4.5vw, 4rem)",
                      color: "#ffffff",
                      lineHeight: 1,
                      marginBottom: "1rem",
                      letterSpacing: "0.03em",
                    }}
                  >
                    {release.title}
                  </h2>

                  <p
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      marginBottom: "1.5rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {release.fullDescription}
                  </p>

                  {/* Top Tracks */}
                  {release.tracks && release.tracks.length > 0 && (
                    <div className="hero-album-tracks" style={{ marginBottom: "1.5rem" }}>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          letterSpacing: "0.15em",
                          color: "var(--text-muted)",
                          marginBottom: "0.5rem",
                          fontFamily: "var(--font-display)",
                        }}
                      >
                        FEATURED TRACKS
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.4rem",
                        }}
                      >
                        {release.tracks.slice(0, 3).map((track) => (
                          <div
                            key={track.number}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "0.5rem 0.85rem",
                              background: "rgba(255, 255, 255, 0.03)",
                              borderRadius: "8px",
                              border: "1px solid rgba(255, 255, 255, 0.06)",
                              fontSize: "0.88rem",
                            }}
                          >
                            <span style={{ color: "#fff", fontWeight: 500 }}>
                              <strong
                                style={{
                                  color: "var(--crimson-base)",
                                  marginRight: "8px",
                                }}
                              >
                                0{track.number}
                              </strong>
                              {track.title}
                            </span>
                            <span
                              style={{
                                color: "var(--text-muted)",
                                fontSize: "0.8rem",
                              }}
                            >
                              {track.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Buttons */}
                  <div
                    style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
                  >
                    <Link
                      href={`/music/${release.slug}`}
                      className="btn-primary"
                      style={{ padding: "0.85rem 1.8rem", fontSize: "1rem" }}
                    >
                      STREAM ALBUM <ArrowRight size={16} />
                    </Link>
                    {release.streamingLinks?.spotify?.trim() ? (
                      <a
                        href={release.streamingLinks.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ padding: "0.85rem 1.8rem", fontSize: "1rem" }}
                      >
                        SPOTIFY
                      </a>
                    ) : null}
                    <Link
                      href="/music"
                      className="btn-outline-red"
                      style={{ padding: "0.85rem 1.4rem", fontSize: "1rem" }}
                    >
                      ALL DISCOGRAPHY <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
