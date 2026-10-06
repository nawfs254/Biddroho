import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { ShieldCheck, Calendar, PhoneCall, Mail, Headphones, Sparkles, MapPin } from 'lucide-react';
import BookingForm from '@/components/BookingForm';

export const metadata: Metadata = {
  title: 'Book BIDDROHO | Official Concert & Festival Booking',
  description: 'Initiate official booking inquiries for BIDDROHO. Stadium rock festivals, university concerts, corporate galas, and private headline appearances.'
};

export default function BookPage() {
  return (
    <div style={{ backgroundColor: '#050506', minHeight: '100vh', paddingBottom: '7rem' }}>
      {/* Header */}
      <section
        style={{
          padding: '5rem 0 3.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="ambient-glow-spot" style={{ top: '-120px', left: '-50px' }} />
        <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="editorial-badge">// PERFORMANCE CONTRACTS & TOURS</span>
          <h1 className="section-title">BOOK BIDDROHO</h1>
          <p className="section-description">
            Bring the sonic powerhouse of BIDDROHO to your stadium, festival, campus fest, or headline auditorium. Submit your event specifications to start direct management routing.
          </p>
        </div>
      </section>

      {/* Promoters Information / Rider Highlights */}
      <section style={{ padding: '3.5rem 0 2rem' }}>
        <div className="site-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem'
            }}
          >
            <div className="dark-card" style={{ padding: '1.75rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Headphones size={22} color="var(--crimson-base)" />
                <h3 className="font-display" style={{ fontSize: '1.35rem', color: '#fff' }}>FULL 6-PIECE LINEUP</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Every live appearance features the complete official band lineup (Vocals, Dual Guitars, Bass, Keys/Synths, Drums) accompanied by our dedicated front-of-house sound engineer.
              </p>
            </div>

            <div className="dark-card" style={{ padding: '1.75rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <Calendar size={22} color="var(--crimson-base)" />
                <h3 className="font-display" style={{ fontSize: '1.35rem', color: '#fff' }}>ROUTING & LEAD TIME</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Due to national tour commitments and studio recording schedules, we advise submitting inquiries at least 30 to 60 days in advance of the scheduled performance date.
              </p>
            </div>

            <div className="dark-card" style={{ padding: '1.75rem', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <ShieldCheck size={22} color="var(--crimson-base)" />
                <h3 className="font-display" style={{ fontSize: '1.35rem', color: '#fff' }}>DIRECT MANAGEMENT</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                All bookings are handled strictly through official representation. No unauthorized intermediaries or third-party brokers have permission to confirm BIDDROHO dates.
              </p>
            </div>
          </div>

          {/* Form Container */}
          <div
            className="dark-card"
            style={{
              padding: 'clamp(2rem, 5vw, 4rem)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Emergency / Press Contact */}
      <section style={{ paddingTop: '4rem' }}>
        <div className="site-container" style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.2em', fontFamily: 'var(--font-display)' }}>
            // DIRECT MANAGEMENT CONTACT
          </span>
          <div style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            For urgent tour confirmations or international booking agencies:
          </div>
          <div style={{ marginTop: '0.5rem', color: '#fff', fontSize: '1.25rem', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>
            BOOKING@BIDDROHO.COM • +880 1711-BIDDROHO
          </div>
        </div>
      </section>
    </div>
  );
}
