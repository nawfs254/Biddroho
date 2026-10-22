"use client";

import React, { useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { useLiveContainerScroll } from "@/lib/useLiveContainerScroll";
import { Flame, Shield, Radio, Volume2 } from "lucide-react";

interface WordProps {
  word: string;
  range: [number, number];
  progress: any;
  isAccent?: boolean;
}

function Word({ word, range, progress, isAccent }: WordProps) {
  const opacity = useTransform(progress, range, [0.35, 1]);
  const color = useTransform(progress, range, [
    isAccent ? "rgba(229, 9, 20, 0.45)" : "rgba(255, 255, 255, 0.32)",
    isAccent ? "#ff1e27" : "#ffffff",
  ]);
  const textShadow = useTransform(progress, range, [
    "0 0 0px transparent",
    isAccent ? "0 0 20px rgba(229, 9, 20, 0.8)" : "0 0 15px rgba(255, 255, 255, 0.45)",
  ]);

  const scale = useTransform(progress, range, [0.97, 1.03]);

  return (
    <motion.span
      style={{
        opacity,
        color,
        scale,
        textShadow,
        display: "inline-block",
        marginRight: "0.28em",
        transition: "text-shadow 0.2s ease",
      }}
    >
      {word}
    </motion.span>
  );
}

export default function AppleTextReveal() {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollYProgress = useLiveContainerScroll(containerRef, {
    mode: "reveal",
  });

  const manifestoText =
    "Six souls. One sound. A decade of uncompromising Bangladeshi rock forged in the underground and amplified across the nation with raw energy, rebellious guitar riffs, and anthems that never surrender.";

  const words = manifestoText.split(" ");
  const accentWords = [
    "uncompromising",
    "Bangladeshi",
    "rebellious",
    "surrender.",
    "energy,",
  ];

  const stats = [
    { icon: Flame, label: "ESTABLISHED", val: "2011" },
    { icon: Radio, label: "ORIGINAL ANTHEMS", val: "STUDIO & LIVE" },
    { icon: Volume2, label: "SIGNATURE SOUND", val: "HEAVY ROCK" },
    { icon: Shield, label: "ETHOS", val: "PURE REBELLION" },
  ];

  return (
    <section
      ref={containerRef}
      style={{
        position: "relative",
        backgroundColor: "#070709",
        padding: "clamp(5rem, 12vh, 10rem) 1.5rem",
        borderTop: "1px solid var(--border-subtle)",
        borderBottom: "1px solid var(--border-subtle)",
        overflow: "hidden",
        touchAction: "pan-y",
      }}
    >
      {/* Ambient background light aura */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "70vw",
          height: "400px",
          background:
            "radial-gradient(ellipse at center, rgba(229, 9, 20, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
          filter: "blur(60px)",
        }}
      />

      <div
        className="site-container"
        style={{ maxWidth: "1080px", margin: "0 auto", textAlign: "center" }}
      >
        {/* Apple Sub-Header Tag */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 1rem",
            borderRadius: "999px",
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "2.5rem",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              letterSpacing: "0.2em",
              fontSize: "0.85rem",
              color: "var(--crimson-base)",
            }}
          >
            THE SOUND MANIFESTO
          </span>
        </motion.div>

        {/* Apple-style Large Dynamic Text Reveal */}
        <h2
          className="font-heading"
          style={{
            fontSize: "clamp(1.8rem, 4.2vw, 3.6rem)",
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
            margin: "0 auto 4rem",
            maxWidth: "1000px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {words.map((word, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            const isAccent = accentWords.includes(word);
            return (
              <Word
                key={i}
                word={word}
                range={[start, end]}
                progress={scrollYProgress}
                isAccent={isAccent}
              />
            );
          })}
        </h2>

        {/* Spec Callout Badges (Apple Specs Bar) */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            maxWidth: "950px",
            margin: "0 auto",
          }}
        >
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, borderColor: "rgba(229, 9, 20, 0.4)" }}
                style={{
                  background: "rgba(15, 15, 20, 0.6)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "16px",
                  padding: "1.5rem 1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.6rem",
                  transition: "border-color 0.2s ease, transform 0.2s ease",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    backgroundColor: "var(--crimson-subtle)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--crimson-base)",
                  }}
                >
                  <Icon size={18} />
                </div>
                <div
                  style={{
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  {s.label}
                </div>
                <div
                  className="font-display"
                  style={{
                    fontSize: "1.4rem",
                    color: "#ffffff",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.val}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
