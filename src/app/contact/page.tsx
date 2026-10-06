'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import MusicLoader from '@/components/ui/MusicLoader';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#050506', minHeight: '100vh', paddingBottom: '7rem', color: '#f4f4f5' }}>
      {/* Hero Header */}
      <section
        style={{
          padding: '5rem 0 3.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="ambient-glow-spot" style={{ top: '-120px', left: '-50px' }} />
        <div className="site-container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="editorial-badge">// GENERAL COMMUNICATIONS & INQUIRIES</span>
          <h1 className="section-title">CONTACT BIDDROHO</h1>
          <p className="section-description">
            Connect directly with BIDDROHO management for collaborations, press, sponsorships, gear endorsements, or fan correspondence.
          </p>
        </div>
      </section>

      {/* Main Grid: Info + Form */}
      <section style={{ padding: '4rem 0' }}>
        <div className="site-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'start'
            }}
          >
            {/* Left: Contact Information Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div
                style={{
                  backgroundColor: '#0c0c0e',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '6px',
                  padding: '2rem'
                }}
              >
                <h3 className="font-display" style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1.25rem', letterSpacing: '0.05em' }}>
                  MANAGEMENT DESK
                </h3>
                <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                  Our management team reviews inbound communications daily. For stadium concerts, college tours, and festival contracts, please use our dedicated concert booking portal.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(225, 29, 72, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--crimson-base)'
                      }}
                    >
                      <Mail size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Official Email</div>
                      <a href="mailto:booking@biddroho.com" style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
                        booking@biddroho.com
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(225, 29, 72, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--crimson-base)'
                      }}
                    >
                      <MapPin size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#71717a', textTransform: 'uppercase', fontWeight: 600 }}>Headquarters & Studio</div>
                      <div style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>
                        Dhaka, Bangladesh
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '0.75rem' }}>
                    Organizing a live show or concert?
                  </div>
                  <Link
                    href="/book"
                    className="btn-primary"
                    style={{
                      display: 'inline-flex',
                      width: '100%',
                      textAlign: 'center',
                      justifyContent: 'center',
                      fontSize: '0.95rem',
                      padding: '0.75rem 1.5rem'
                    }}
                  >
                    GO TO CONCERT BOOKING FORM
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: Message Submission Form */}
            <div
              style={{
                backgroundColor: '#0c0c0e',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '6px',
                padding: '2.5rem'
              }}
            >
              <h2 className="font-display" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
                SEND A MESSAGE
              </h2>
              <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Inbound messages are routed directly to the band CRM portal.
              </p>

              {submitted ? (
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '6px',
                    padding: '2.5rem',
                    textAlign: 'center'
                  }}
                >
                  <CheckCircle2 size={44} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fff', marginBottom: '0.5rem' }}>
                    Message Received!
                  </h3>
                  <p style={{ color: '#a1a1aa', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    Thank you for reaching out. Your transmission has been safely logged in our management desk and team members will review it shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    style={{
                      backgroundColor: '#18181b',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      padding: '0.6rem 1.5rem',
                      borderRadius: '4px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {error && (
                    <div
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '4px',
                        padding: '0.75rem 1rem',
                        color: '#f87171',
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahedul Karim"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{
                        width: '100%',
                        backgroundColor: '#141418',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '4px',
                        padding: '0.75rem 1rem',
                        color: '#fff',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                      Your Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. contact@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{
                        width: '100%',
                        backgroundColor: '#141418',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '4px',
                        padding: '0.75rem 1rem',
                        color: '#fff',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Media Interview / Sponsorship Proposal / Fan Message"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      style={{
                        width: '100%',
                        backgroundColor: '#141418',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '4px',
                        padding: '0.75rem 1rem',
                        color: '#fff',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', marginBottom: '0.4rem', letterSpacing: '0.05em' }}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{
                        width: '100%',
                        backgroundColor: '#141418',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: '4px',
                        padding: '0.75rem 1rem',
                        color: '#fff',
                        fontSize: '0.95rem',
                        outline: 'none',
                        boxSizing: 'border-box',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      opacity: loading ? 0.7 : 1
                    }}
                  >
                    {loading ? (
                      <MusicLoader size="inline" text="TRANSMITTING MESSAGE..." showNotes={false} showEq={true} />
                    ) : (
                      <>
                        <Send size={16} />
                        <span>SEND MESSAGE</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
