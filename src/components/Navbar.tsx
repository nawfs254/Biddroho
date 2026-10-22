"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { name: "MUSIC", href: "/music" },
  { name: "EVENTS", href: "/events" },
  { name: "MEDIA", href: "/media" },
  { name: "BAND", href: "/band" },
  { name: "NEWS", href: "/news" },
  { name: "CONTACT", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          document.body.classList.add("mobile-menu-active");
        } else {
          document.body.classList.remove("mobile-menu-active");
        }
      }
      return next;
    });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    if (typeof document !== "undefined") {
      document.body.classList.remove("mobile-menu-active");
    }
  }, []);

  // Listen for scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("mobile-menu-active");
      }
    };
  }, []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 10000,
          transition: "background-color 0.3s ease, border-color 0.3s ease, padding 0.3s ease",
          backgroundColor:
            scrolled || mobileMenuOpen ? "rgba(5, 5, 6, 0.96)" : "transparent",
          backdropFilter: scrolled || mobileMenuOpen ? "blur(16px)" : "none",
          WebkitBackdropFilter: scrolled || mobileMenuOpen ? "blur(16px)" : "none",
          borderBottom:
            scrolled || mobileMenuOpen
              ? "1px solid rgba(255, 255, 255, 0.08)"
              : "1px solid transparent",
          padding: scrolled ? "0.65rem 0" : "1.1rem 0",
        }}
      >
        <div
          className="site-container"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.75rem",
          }}
        >
          {/* Brand Logo & Name */}
          <Link
            href="/"
            onClick={closeMobileMenu}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none",
              maxWidth: "calc(100% - 60px)",
              flexShrink: 1,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "relative",
                width: "38px",
                height: "38px",
                flexShrink: 0,
              }}
            >
              <Image
                src="/assets/logo.png"
                alt="BIDDROHO Official Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
                overflow: "hidden",
              }}
            >
              <span
                className="font-display"
                style={{
                  fontSize: "clamp(1.35rem, 5vw, 1.75rem)",
                  letterSpacing: "0.12em",
                  lineHeight: 1,
                  color: "#ffffff",
                  whiteSpace: "nowrap",
                }}
              >
                BIDDROHO
              </span>
              <span
                className="brand-subtitle"
                style={{
                  fontSize: "0.62rem",
                  letterSpacing: "0.22em",
                  color: "var(--crimson-base)",
                  fontWeight: 600,
                  marginTop: "2px",
                  whiteSpace: "nowrap",
                }}
              >
                EST. 2011<span className="brand-subtitle-extra"> • BANGLADESHI ROCK</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            style={{
              display: "none",
              alignItems: "center",
              gap: "2.5rem",
            }}
            className="desktop-nav"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="font-display"
                  style={{
                    fontSize: "1.05rem",
                    letterSpacing: "0.14em",
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    position: "relative",
                    padding: "0.5rem 0",
                    transition: "color 0.2s ease",
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        height: "2px",
                        backgroundColor: "var(--crimson-base)",
                        boxShadow: "0 0 10px var(--crimson-glow)",
                      }}
                    />
                  )}
                </Link>
              );
            })}

            {/* CTA: BOOK BIDDROHO */}
            <Link
              href="/book"
              className="btn-outline-red"
              style={{
                fontSize: "0.95rem",
                padding: "0.55rem 1.4rem",
              }}
            >
              BOOK BIDDROHO
            </Link>
          </nav>

          {/* Mobile Menu Button with Touch and Click Support */}
          <button
            id="mobile-nav-toggle"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleMobileMenu();
            }}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            style={{
              background: mobileMenuOpen
                ? "rgba(229, 9, 20, 0.2)"
                : "rgba(255, 255, 255, 0.08)",
              border: mobileMenuOpen
                ? "1px solid var(--crimson-base)"
                : "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              padding: "0.6rem",
              minWidth: "46px",
              minHeight: "46px",
              width: "46px",
              height: "46px",
              flexShrink: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "6px",
              position: "relative",
              zIndex: 10005,
              touchAction: "manipulation",
              WebkitTapHighlightColor: "transparent",
            }}
            className="mobile-toggle"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Full Screen Mobile Navigation Menu */}
      <div
        id="mobile-nav-overlay"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          height: "100%",
          width: "100%",
          backgroundColor: "#050506",
          zIndex: 9999,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          animation: "fadeIn 0.25s ease forwards",
          display: mobileMenuOpen ? "block" : "none",
        }}
      >
        <div
          style={{
            minHeight: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding:
              "6.5rem 1.75rem calc(2.5rem + env(safe-area-inset-bottom, 24px))",
            gap: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <span
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.25em",
                color: "var(--crimson-base)",
                textTransform: "uppercase",
              }}
            >
              // NAVIGATION
            </span>
            {NAV_LINKS.map((link, idx) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-display"
                onClick={closeMobileMenu}
                style={{
                  fontSize: "clamp(1.85rem, 5.5vw, 2.25rem)",
                  letterSpacing: "0.08em",
                  color:
                    pathname === link.href ? "var(--crimson-base)" : "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  0{idx + 1}
                </span>
                {link.name}
              </Link>
            ))}

            <Link
              href="/book"
              onClick={closeMobileMenu}
              className="btn-primary"
              style={{
                marginTop: "0.75rem",
                fontSize: "1.15rem",
                textAlign: "center",
                padding: "1rem 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              BOOK BIDDROHO
            </Link>
          </div>

          {/* Mobile Menu Footer */}
          <div
            style={{
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div
              style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}
            >
              DHAKA, BANGLADESH
            </div>
            <div
              style={{
                display: "flex",
                gap: "1.25rem",
                color: "var(--text-secondary)",
                fontSize: "0.85rem",
              }}
            >
              <span>SPOTIFY</span>
              <span>YOUTUBE</span>
              <span>FACEBOOK</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
