import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Play,
  Calendar,
  Disc,
  Volume2,
  Ticket,
  Sparkles,
  ChevronRight,
  Music,
} from "lucide-react";
import {
  getReleases,
  getEvents,
  getMembers,
  getMedia,
  getNews,
} from "@/lib/dataService";
import ReleaseCard from "@/components/ReleaseCard";
import EventCard from "@/components/EventCard";
import AppleHeroScroller from "@/components/home/AppleHeroScroller";
import AppleTextReveal from "@/components/home/AppleTextReveal";
import AppleHorizontalReel from "@/components/home/AppleHorizontalReel";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [releases, events, members, mediaItems, newsItems] = await Promise.all([
    getReleases(),
    getEvents(),
    getMembers(),
    getMedia(),
    getNews(),
  ]);

  const latestRelease = (releases && releases.length > 0) ? releases[0] : null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isUpcoming = (e: any) => {
    if (e.status === "upcoming") return true;
    if (e.status === "past") return false;
    if (!e.date) return true;
    return new Date(e.date) >= today;
  };

  const upcomingEvents = events.filter(isUpcoming);
  const displayEvents = upcomingEvents.length > 0 ? upcomingEvents.slice(0, 2) : events.slice(0, 2);
  const isShowingUpcoming = upcomingEvents.length > 0;
  const featuredMedia = mediaItems.slice(0, 4);
  const latestNews = newsItems.slice(0, 3);

  return (
    <div>
      {/* 1 & 2. APPLE-STYLE SCROLLYTELLING HERO & ALBUM MORPH */}
      <AppleHeroScroller latestRelease={latestRelease} />

      {/* 3. APPLE-STYLE MANIFESTO & SOUND SPECS REVEAL */}
      <AppleTextReveal />

      {/* 3. EVENTS SHOWCASE (REAL MONGODB EVENTS) */}
      <section className="section-py" style={{ backgroundColor: "#050506" }}>
        <div className="site-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <span className="editorial-badge">
                {isShowingUpcoming ? "// ON THE ROAD" : "// STAGE ARCHIVE • LATEST CONCERT"}
              </span>
              <h2 className="section-title">
                {isShowingUpcoming ? "UPCOMING PERFORMANCES" : "RECENT LIVE PERFORMANCE"}
              </h2>
            </div>
            <Link href="/events" className="btn-outline-red">
              VIEW ALL DATES <ChevronRight size={16} />
            </Link>
          </div>

          {displayEvents.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {displayEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3.5rem 1.5rem",
                border: "1px dashed var(--border-subtle)",
                backgroundColor: "rgba(255, 255, 255, 0.01)",
              }}
            >
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "1rem",
                  margin: 0,
                }}
              >
                No upcoming dates announced yet. Check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. APPLE-STYLE HORIZONTAL MEMBER LINEUP TRACK */}
      <AppleHorizontalReel members={members} />

      {/* 5. FEATURED MEDIA SNAPSHOTS */}
      <section className="section-py" style={{ backgroundColor: "#050506" }}>
        <div className="site-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <span className="editorial-badge">// SIGHT & SOUND</span>
              <h2 className="section-title">FEATURED MEDIA</h2>
            </div>
            <Link href="/media" className="btn-outline-red">
              VISIT MEDIA VAULT <ChevronRight size={16} />
            </Link>
          </div>

          {featuredMedia.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
              }}
            >
              {featuredMedia.map((media) => (
                <div
                  key={media.id}
                  className="dark-card-interactive"
                  style={{ position: "relative", overflow: "hidden" }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/10",
                      width: "100%",
                      backgroundColor: "#000",
                    }}
                  >
                    <Image
                      src={media.thumbnailUrl}
                      alt={media.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    {media.type === "video" && (
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(0,0,0,0.4)",
                        }}
                      >
                        <div
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            backgroundColor: "var(--crimson-base)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 20px var(--crimson-glow)",
                          }}
                        >
                          <Play
                            size={20}
                            color="#fff"
                            style={{ marginLeft: "3px" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      padding: "1.25rem",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--crimson-base)",
                        letterSpacing: "0.15em",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {media.category.toUpperCase()} • {media.date}
                    </span>
                    <h3
                      className="font-display"
                      style={{
                        fontSize: "1.4rem",
                        color: "#fff",
                        marginTop: "4px",
                      }}
                    >
                      {media.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3.5rem 1.5rem",
                border: "1px dashed var(--border-subtle)",
                backgroundColor: "rgba(255, 255, 255, 0.01)",
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
        </div>
      </section>

      {/* 6. LATEST NEWS */}
      <section
        className="section-py"
        style={{
          backgroundColor: "#070709",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <div className="site-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "3rem",
              flexWrap: "wrap",
              gap: "1.5rem",
            }}
          >
            <div>
              <span className="editorial-badge">// OFFICIAL DISPATCH</span>
              <h2 className="section-title">LATEST NEWS</h2>
            </div>
            <Link href="/news" className="btn-outline-red">
              ALL NEWS ARTICLES <ChevronRight size={16} />
            </Link>
          </div>

          {latestNews.length === 1 ? (
            /* Single Compact Featured Card - Fits screen height cleanly */
            <Link
              key={latestNews[0]._id}
              href={`/news/${latestNews[0].slug}`}
              className="dark-card-interactive"
              style={{
                textDecoration: "none",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
                gap: "2rem",
                padding: "1.25rem",
                alignItems: "center",
                borderRadius: "14px",
                border: "1px solid var(--border-subtle)",
                background: "rgba(13, 13, 17, 0.75)",
                backdropFilter: "blur(12px)",
                maxWidth: "1080px",
                margin: "0 auto",
              }}
            >
              {/* Compact Cover Image with Top-Alignment */}
              <div
                style={{
                  position: "relative",
                  aspectRatio: "16/10",
                  maxHeight: "280px",
                  width: "100%",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "#070709",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <Image
                  src={latestNews[0].coverImage}
                  alt={latestNews[0].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 540px"
                  style={{
                    objectFit: "cover",
                    objectPosition: "center top",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "0.75rem",
                    background: "rgba(5, 5, 6, 0.88)",
                    backdropFilter: "blur(6px)",
                    padding: "0.2rem 0.65rem",
                    fontSize: "0.72rem",
                    color: "var(--crimson-base)",
                    border: "1px solid var(--border-subtle)",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.1em",
                    borderRadius: "4px",
                  }}
                >
                  {(latestNews[0].category || "NEWS").toUpperCase()}
                </div>
              </div>

              {/* Compact Story Details */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "0.5rem 0.5rem 0.5rem 0",
                }}
              >
                <div
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <span>{latestNews[0].date}</span>
                  <span>•</span>
                  <span>{latestNews[0].readTime || "3 min read"}</span>
                </div>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.5rem, 2.2vw, 2.1rem)",
                    color: "#fff",
                    lineHeight: 1.15,
                    marginBottom: "0.6rem",
                  }}
                >
                  {latestNews[0].title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.88rem",
                    lineHeight: 1.55,
                    marginBottom: "1.25rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {latestNews[0].excerpt}
                </p>
                <span
                  style={{
                    color: "var(--crimson-base)",
                    fontSize: "0.85rem",
                    fontFamily: "var(--font-display)",
                    letterSpacing: "0.1em",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                  }}
                >
                  READ FULL STORY ›
                </span>
              </div>
            </Link>
          ) : latestNews.length > 1 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
                gap: "1.5rem",
              }}
            >
              {latestNews.map((item) => (
                <Link
                  key={item._id}
                  href={`/news/${item.slug}`}
                  className="dark-card-interactive"
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid var(--border-subtle)",
                    background: "rgba(13, 13, 17, 0.75)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16/9",
                      maxHeight: "220px",
                      width: "100%",
                      backgroundColor: "#070709",
                    }}
                  >
                    <Image
                      src={item.coverImage}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover", objectPosition: "center top" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        left: "0.75rem",
                        background: "rgba(5, 5, 6, 0.85)",
                        backdropFilter: "blur(6px)",
                        padding: "0.2rem 0.6rem",
                        fontSize: "0.72rem",
                        color: "var(--crimson-base)",
                        border: "1px solid var(--border-subtle)",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.1em",
                        borderRadius: "4px",
                      }}
                    >
                      {(item.category || "NEWS").toUpperCase()}
                    </div>
                  </div>

                  <div
                    style={{
                      padding: "1.25rem",
                      display: "flex",
                      flexDirection: "column",
                      flex: "1 1 auto",
                    }}
                  >
                    <div
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.78rem",
                        marginBottom: "0.4rem",
                      }}
                    >
                      {item.date} • {item.readTime || "3 min read"}
                    </div>
                    <h3
                      className="font-display"
                      style={{
                        fontSize: "1.4rem",
                        color: "#fff",
                        lineHeight: 1.2,
                        marginBottom: "0.5rem",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.85rem",
                        lineHeight: 1.5,
                        marginBottom: "1rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {item.excerpt}
                    </p>
                    <span
                      style={{
                        color: "var(--crimson-base)",
                        fontSize: "0.82rem",
                        fontFamily: "var(--font-display)",
                        letterSpacing: "0.1em",
                        marginTop: "auto",
                      }}
                    >
                      READ STORY ›
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "3.5rem 1.5rem",
                border: "1px dashed var(--border-subtle)",
                backgroundColor: "rgba(255, 255, 255, 0.01)",
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
        </div>
      </section>

      {/* 7. CINEMATIC BOOKING CTA */}
      <section
        style={{
          position: "relative",
          padding: "7rem 0",
          backgroundColor: "#050506",
          borderTop: "1px solid var(--border-subtle)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.25,
            zIndex: 0,
          }}
        >
          <Image
            src="/assets/hero_live.jpg"
            alt="Concert background"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>

        <div
          className="site-container"
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "850px",
          }}
        >
          <span
            className="editorial-badge"
            style={{ justifyContent: "center" }}
          >
            // DIRECT ENGAGEMENT
          </span>
          <h2
            className="section-title"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
              marginBottom: "1.5rem",
            }}
          >
            BRING BIDDROHO TO YOUR STAGE
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.15rem",
              lineHeight: 1.8,
              marginBottom: "2.5rem",
              maxWidth: "650px",
              margin: "0 auto 2.5rem",
            }}
          >
            Available for national festivals, headline concerts, university
            galas, and corporate tours. Review technical specifications and
            initiate official booking.
          </p>

          <Link
            href="/book"
            className="btn-primary"
            style={{ fontSize: "1.35rem", padding: "1.15rem 3.5rem" }}
          >
            INITIATE BOOKING INQUIRY <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
