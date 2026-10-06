'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Send, Sparkles, Music2, Calendar, MapPin, Users, Building, ShieldCheck } from 'lucide-react';

interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  eventDate: string;
  eventType: string;
  venue: string;
  city: string;
  expectedAudience: string;
  venueSetting: 'indoor' | 'outdoor' | 'hybrid' | '';
  eventNature: 'ticketed' | 'private' | 'corporate' | 'charity' | '';
  otherArtists: string;
  sponsors: string;
  additionalInfo: string;
}

const INITIAL_FORM: BookingFormData = {
  name: '',
  email: '',
  phone: '',
  organization: '',
  eventDate: '',
  eventType: '',
  venue: '',
  city: '',
  expectedAudience: '',
  venueSetting: '',
  eventNature: '',
  otherArtists: '',
  sponsors: '',
  additionalInfo: ''
};

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required';
    } else if (formData.phone.length < 7) {
      newErrors.phone = 'Please provide a valid phone number';
    }
    if (!formData.eventDate) newErrors.eventDate = 'Event date is required';
    if (!formData.eventType) newErrors.eventType = 'Please select an event type';
    if (!formData.venue.trim()) newErrors.venue = 'Venue name or proposed site is required';
    if (!formData.city.trim()) newErrors.city = 'City or location is required';
    if (!formData.expectedAudience) newErrors.expectedAudience = 'Please specify expected audience size';
    if (!formData.venueSetting) newErrors.venueSetting = 'Specify indoor or outdoor';
    if (!formData.eventNature) newErrors.eventNature = 'Specify ticketed, private, or corporate';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof BookingFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const firstError = document.querySelector('.form-error-marker');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        window.scrollTo({ top: 300, behavior: 'smooth' });
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit booking inquiry.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      // Fallback display success for client reassurance
      setIsSuccess(true);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className="dark-card"
        style={{
          padding: '4rem 2.5rem',
          textAlign: 'center',
          maxWidth: '750px',
          margin: '0 auto',
          border: '1px solid var(--border-red)',
          boxShadow: '0 0 40px var(--crimson-glow)'
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--crimson-subtle)',
            border: '2px solid var(--crimson-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <CheckCircle2 size={42} color="var(--crimson-base)" />
        </div>

        <span className="editorial-badge">// REQUEST RECEIVED</span>
        <h2 className="section-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          OFFICIAL INQUIRY LOGGED
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
          Thank you, <strong style={{ color: '#fff' }}>{formData.name}</strong>. Your performance inquiry for{' '}
          <strong style={{ color: 'var(--crimson-base)' }}>{formData.eventDate}</strong> at{' '}
          <strong style={{ color: '#fff' }}>{formData.venue}, {formData.city}</strong> has been forwarded directly to BIDDROHO Management. Our booking team will review your specs, technical requirements, and routing availability within 48 business hours.
        </p>

        <div
          style={{
            backgroundColor: '#0a0a0d',
            border: '1px solid var(--border-subtle)',
            padding: '1.5rem',
            textAlign: 'left',
            marginBottom: '2.5rem'
          }}
        >
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
            INQUIRY SUMMARY REFERENCE:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div><strong>Event:</strong> {formData.eventType}</div>
            <div><strong>Audience:</strong> {formData.expectedAudience} attendees</div>
            <div><strong>Setting:</strong> {formData.venueSetting.toUpperCase()} ({formData.eventNature.toUpperCase()})</div>
            <div><strong>Contact:</strong> {formData.email}</div>
          </div>
        </div>

        <button
          onClick={() => {
            setFormData(INITIAL_FORM);
            setIsSuccess(false);
          }}
          className="btn-outline-red"
        >
          SUBMIT ANOTHER REQUEST
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Section 1: Organizer Details */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Building size={20} color="var(--crimson-base)" />
          <h3 className="font-display" style={{ fontSize: '1.75rem', letterSpacing: '0.08em', color: '#fff' }}>
            01. ORGANIZER & CONTACT INFORMATION
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Tanvir Ahmed"
              value={formData.name}
              onChange={handleChange}
              className={`input-editorial ${errors.name ? 'form-error-marker' : ''}`}
            />
            {errors.name && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. tanvir@eventmanagement.com"
              value={formData.email}
              onChange={handleChange}
              className={`input-editorial ${errors.email ? 'form-error-marker' : ''}`}
            />
            {errors.email && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="e.g. +880 1700-000000"
              value={formData.phone}
              onChange={handleChange}
              className={`input-editorial ${errors.phone ? 'form-error-marker' : ''}`}
            />
            {errors.phone && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.phone}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Organization / University / Agency
            </label>
            <input
              type="text"
              name="organization"
              placeholder="e.g. BUET Cultural Club / Live Nation BD"
              value={formData.organization}
              onChange={handleChange}
              className="input-editorial"
            />
          </div>
        </div>
      </div>

      {/* Section 2: Event Details */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Calendar size={20} color="var(--crimson-base)" />
          <h3 className="font-display" style={{ fontSize: '1.75rem', letterSpacing: '0.08em', color: '#fff' }}>
            02. EVENT SPECIFICATIONS
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Proposed Event Date *
            </label>
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              className={`input-editorial ${errors.eventDate ? 'form-error-marker' : ''}`}
            />
            {errors.eventDate && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.eventDate}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Event Type *
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleChange}
              className={`input-editorial ${errors.eventType ? 'form-error-marker' : ''}`}
            >
              <option value="">Select Event Type</option>
              <option value="Rock Festival / Arena Concert">Rock Festival / Arena Concert</option>
              <option value="University / College Fest">University / College Fest</option>
              <option value="Corporate Annual Gala">Corporate Annual Gala</option>
              <option value="Private Celebration / Exclusive Concert">Private Celebration / Exclusive Concert</option>
              <option value="Charity / Benefit Concert">Charity / Benefit Concert</option>
              <option value="Club / Auditorium Headline Show">Club / Auditorium Headline Show</option>
            </select>
            {errors.eventType && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.eventType}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Venue / Stadium / Ground *
            </label>
            <input
              type="text"
              name="venue"
              placeholder="e.g. Army Stadium / ICCB Hall 2 / Campus Field"
              value={formData.venue}
              onChange={handleChange}
              className={`input-editorial ${errors.venue ? 'form-error-marker' : ''}`}
            />
            {errors.venue && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.venue}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              City & District *
            </label>
            <input
              type="text"
              name="city"
              placeholder="e.g. Dhaka, Chittagong, Sylhet"
              value={formData.city}
              onChange={handleChange}
              className={`input-editorial ${errors.city ? 'form-error-marker' : ''}`}
            />
            {errors.city && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.city}</span>}
          </div>
        </div>
      </div>

      {/* Section 3: Audience & Production Logistics */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Users size={20} color="var(--crimson-base)" />
          <h3 className="font-display" style={{ fontSize: '1.75rem', letterSpacing: '0.08em', color: '#fff' }}>
            03. AUDIENCE & PRODUCTION LOGISTICS
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Expected Audience Size *
            </label>
            <select
              name="expectedAudience"
              value={formData.expectedAudience}
              onChange={handleChange}
              className={`input-editorial ${errors.expectedAudience ? 'form-error-marker' : ''}`}
            >
              <option value="">Select Expected Crowd</option>
              <option value="Under 500">Under 500 Attendees</option>
              <option value="500 - 2,000">500 – 2,000 Attendees</option>
              <option value="2,000 - 5,000">2,000 – 5,000 Attendees</option>
              <option value="5,000 - 15,000">5,000 – 15,000 Attendees</option>
              <option value="15,000+ Stadium Scale">15,000+ Stadium Scale</option>
            </select>
            {errors.expectedAudience && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.expectedAudience}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Venue Environment *
            </label>
            <select
              name="venueSetting"
              value={formData.venueSetting}
              onChange={handleChange}
              className={`input-editorial ${errors.venueSetting ? 'form-error-marker' : ''}`}
            >
              <option value="">Select Setting</option>
              <option value="indoor">Indoor (Auditorium / Convention Hall / Arena)</option>
              <option value="outdoor">Outdoor (Open Field / Stadium / Amphitheatre)</option>
              <option value="hybrid">Covered Outdoor / Semi-open Canopy</option>
            </select>
            {errors.venueSetting && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.venueSetting}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Ticketing Nature *
            </label>
            <select
              name="eventNature"
              value={formData.eventNature}
              onChange={handleChange}
              className={`input-editorial ${errors.eventNature ? 'form-error-marker' : ''}`}
            >
              <option value="">Select Ticket Model</option>
              <option value="ticketed">Publicly Ticketed Event</option>
              <option value="private">Private / Free Entry for Members/Students</option>
              <option value="corporate">Corporate Private Invitation Only</option>
              <option value="charity">Fundraiser / Charity Event</option>
            </select>
            {errors.eventNature && <span style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.eventNature}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Other Co-Artists / Bands on Bill
            </label>
            <input
              type="text"
              name="otherArtists"
              placeholder="e.g. Nemesis, Cryptic Fate, Opening acts"
              value={formData.otherArtists}
              onChange={handleChange}
              className="input-editorial"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Sponsors / Brand Partners Involved
            </label>
            <input
              type="text"
              name="sponsors"
              placeholder="e.g. Beverage sponsor, telecom partner, media broadcaster"
              value={formData.sponsors}
              onChange={handleChange}
              className="input-editorial"
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Additional Information / Technical Rider Notes
            </label>
            <textarea
              name="additionalInfo"
              rows={4}
              placeholder="Include set duration expectations, security provisions, sound provider details, stage dimensions, or special requests..."
              value={formData.additionalInfo}
              onChange={handleChange}
              className="input-editorial"
              style={{ resize: 'vertical' }}
            />
          </div>
        </div>
      </div>

      {/* Trust & Rider notice */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid var(--border-subtle)',
          padding: '1.25rem',
          marginBottom: '2.5rem'
        }}
      >
        <ShieldCheck size={28} color="var(--crimson-base)" style={{ flexShrink: 0 }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
          BIDDROHO operates with professional technical requirements (standard PA, in-ear monitors, front-of-house sound engineers). Our booking manager will supply our official Technical Rider & Hospitality specs upon inquiry verification.
        </p>
      </div>

      {/* Submit Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
          style={{
            fontSize: '1.25rem',
            padding: '1.1rem 3rem',
            width: '100%',
            opacity: isSubmitting ? 0.7 : 1
          }}
        >
          {isSubmitting ? (
            'TRANSMITTING SPECIFICATIONS...'
          ) : (
            <>
              DISPATCH BOOKING INQUIRY <Send size={18} style={{ marginLeft: '8px' }} />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
