import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Quote, Sparkles, Disc, Flame, ArrowRight, ShieldCheck } from 'lucide-react';
import { getMembers } from '@/lib/dataService';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Band & Official Lineup',
  description: 'The story, official members, and philosophy of BIDDROHO. Meet Srijon Tawsif Hossain, Sayed Alvi Haque, Mahir Sakib, Nawfs Ul Ahsun Arnob, Zhasid Hasan Aurko, Yasin Ridoy, and Tanim Reza.'
};

export default async function BandPage() {
  const members = await getMembers();

  return (
    <div style={{ backgroundColor: '#050506', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Editorial Header */}
      <section
        style={{
          padding: '5rem 0 3rem',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="ambient-glow-spot" style={{ top: '-100px', left: '-50px' }} />
        <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="editorial-badge">// THE OFFICIAL LINEUP (MONGODB)</span>
          <h1 className="section-title">THE ARCHITECTS OF REBELLION</h1>
          <p className="section-description">
            Founded in Dhaka in 2011, BIDDROHO emerged with a solitary creed: to forge uncompromising heavy rock that balances technical mastery with raw street defiance.
          </p>
        </div>
      </section>

      {/* 1. THE BIDDROHO STORY */}
      <section className="section-py" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="site-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center'
            }}
          >
            {/* Story Text */}
            <div>
              <span className="editorial-badge">// CHAPTER I: ORIGINS</span>
              <h2 className="section-title" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>
                FIFTEEN YEARS OF UNBROKEN RESISTANCE
              </h2>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                BIDDROHO was forged in underground rehearsal spaces in Dhaka in 2011 during a critical turning point for South Asian independent rock. Tired of commercial clichés and timid soundscapes, the founding members dedicated themselves to heavier tunings, blistering tempos, and lyrics that directly confronted the fractures of modern existence.
              </p>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                Over the past decade and a half, the lineup solidified into its current power formation. Integrating multi-layered keyboards, dual guitar polyphony, and an earth-quaking rhythm section, BIDDROHO has grown from underground club favorites to packing stadiums with roaring choruses.
              </p>

              {/* Milestones stats */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '2rem'
                }}
              >
                <div>
                  <span className="font-display" style={{ fontSize: '2.8rem', color: 'var(--crimson-base)', lineHeight: 1 }}>
                    2011
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Founded In Dhaka</p>
                </div>
                <div>
                  <span className="font-display" style={{ fontSize: '2.8rem', color: '#fff', lineHeight: 1 }}>
                    250+
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Concerts Performed</p>
                </div>
                <div>
                  <span className="font-display" style={{ fontSize: '2.8rem', color: 'var(--crimson-base)', lineHeight: 1 }}>
                    07
                  </span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Creative Minds</p>
                </div>
              </div>
            </div>

            {/* Emblem Artwork showcase */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '440px',
                  aspectRatio: '1/1',
                  margin: '0 auto',
                  backgroundColor: '#070709',
                  border: '1px solid var(--border-subtle)',
                  padding: '2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 50px rgba(229, 9, 20, 0.15)'
                }}
              >
                <div style={{ position: 'relative', width: '85%', height: '85%' }}>
                  <Image
                    src="/assets/logo.png"
                    alt="BIDDROHO Official Distressed Emblem"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem', letterSpacing: '0.1em' }}>
                OFFICIAL EMBLEM: THE GUITAR & EQUALIZER REBELLION
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BAND MEMBERS IN-DEPTH PROFILES (REAL NAMES) */}
      <section className="section-py">
        <div className="site-container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 4rem' }}>
            <span className="editorial-badge" style={{ justifyContent: 'center' }}>
              // THE ROSTER (MONGODB)
            </span>
            <h2 className="section-title">THE BAND MEMBERS</h2>
            <p className="section-description" style={{ margin: '0 auto' }}>
              Every member brings a distinct sonic identity, forming the unified juggernaut that is BIDDROHO.
            </p>
          </div>

          {/* Members Detailed Cards */}
          {members.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
              {members.map((member, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={member.id}
                  className="dark-card"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '3rem',
                    padding: 'clamp(2rem, 4vw, 3.5rem)',
                    border: '1px solid var(--border-subtle)',
                    alignItems: 'center'
                  }}
                >
                  {/* Portrait Column */}
                  <div
                    style={{
                      position: 'relative',
                      aspectRatio: '3/4',
                      maxWidth: '420px',
                      width: '100%',
                      margin: '0 auto',
                      order: isEven ? 1 : 2,
                      border: '1px solid var(--border-subtle)',
                      boxShadow: '0 20px 45px rgba(0, 0, 0, 0.8)'
                    }}
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 40vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 70%, rgba(5,5,6,0.9) 100%)'
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        left: '1rem',
                        background: 'rgba(5, 5, 6, 0.85)',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.25rem 0.75rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.85rem',
                        color: 'var(--crimson-base)',
                        letterSpacing: '0.1em'
                      }}
                    >
                      MEMBER SINCE {member.joinedYear}
                    </div>
                  </div>

                  {/* Biography & Specs Column */}
                  <div style={{ order: isEven ? 2 : 1 }}>
                    <div style={{ color: 'var(--crimson-base)', fontFamily: 'var(--font-display)', fontSize: '1rem', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>
                      // {member.instrument.toUpperCase()}
                    </div>

                    <h3 className="font-display" style={{ fontSize: 'clamp(2.3rem, 4.5vw, 3.8rem)', color: '#fff', lineHeight: 1, marginBottom: '0.5rem' }}>
                      {member.name}
                    </h3>

                    <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.5rem' }}>
                      {member.role}
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
                      {member.bio}
                    </p>

                    {/* Member Quote */}
                    {member.quote && (
                      <div
                        style={{
                          backgroundColor: 'rgba(229, 9, 20, 0.05)',
                          borderLeft: '3px solid var(--crimson-base)',
                          padding: '1rem 1.25rem',
                          marginBottom: '2rem'
                        }}
                      >
                        <p style={{ color: '#fff', fontStyle: 'italic', fontSize: '0.95rem' }}>
                          &ldquo;{member.quote}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Gear / Weapons */}
                    {member.gear && member.gear.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.15em', fontFamily: 'var(--font-display)', marginBottom: '0.75rem' }}>
                          RIG & EQUIPMENT SPECIFICATIONS
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {member.gear.map((gearItem, gIdx) => (
                            <span
                              key={gIdx}
                              style={{
                                backgroundColor: '#0a0a0e',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)',
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.8rem'
                              }}
                            >
                              {gearItem}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 1.5rem',
                border: '1px dashed var(--border-subtle)',
                backgroundColor: 'rgba(255, 255, 255, 0.01)',
              }}
            >
              <p style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>
                No data available
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Booking CTA Banner */}
      <section style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '4rem' }}>
        <div className="site-container" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            BRING THE ENTIRE LINEUP TO YOUR VENUE
          </h2>
          <p className="section-description" style={{ margin: '0 auto 2rem' }}>
            Book Srijon Tawsif Hossain, Sayed Alvi Haque, Mahir Sakib, Nawfs Ul Ahsun Arnob, Zhasid Hasan Aurko, Yasin Ridoy, and Tanim Reza for stadium tours and festival appearances.
          </p>
          <Link href="/book" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 2.5rem' }}>
            SUBMIT CONCERT BOOKING <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
