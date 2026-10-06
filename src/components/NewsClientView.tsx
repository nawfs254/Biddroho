'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { NewsPost } from '@/data/mockData';

interface NewsClientViewProps {
  initialNews: NewsPost[];
}

export default function NewsClientView({ initialNews }: NewsClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Announcement', 'Live', 'Behind The Music', 'Press'];

  const filteredPosts = initialNews.filter((post) => {
    if (selectedCategory === 'All') return true;
    return post.category === selectedCategory;
  });

  const featuredPost = initialNews.find((p) => p.featured) || initialNews[0];
  const regularPosts = filteredPosts.filter((p) => p._id !== featuredPost?._id || selectedCategory !== 'All');

  return (
    <div>
      {/* Categories Filter */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              background: selectedCategory === cat ? 'var(--crimson-base)' : 'rgba(20, 20, 24, 0.8)',
              color: selectedCategory === cat ? '#ffffff' : 'var(--text-secondary)',
              border: selectedCategory === cat ? '1px solid var(--crimson-base)' : '1px solid var(--border-subtle)',
              padding: '0.6rem 1.4rem',
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              letterSpacing: '0.12em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 1. FEATURED ARTICLE (If 'All' is selected) */}
      {selectedCategory === 'All' && featuredPost && (
        <section className="section-py" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="site-container">
            <Link
              href={`/news/${featuredPost.slug}`}
              className="dark-card-interactive"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '3rem',
                padding: 'clamp(1.5rem, 4vw, 3rem)',
                textDecoration: 'none',
                alignItems: 'center'
              }}
            >
              <div style={{ position: 'relative', aspectRatio: '16/10', width: '100%', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'var(--crimson-base)',
                    color: '#fff',
                    padding: '0.25rem 0.75rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    letterSpacing: '0.12em'
                  }}
                >
                  FEATURED HEADLINE
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                  <span>•</span>
                  <span style={{ color: 'var(--crimson-base)' }}>{featuredPost.category}</span>
                </div>

                <h2 className="font-display" style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)', color: '#fff', lineHeight: 1.05, marginBottom: '1.25rem' }}>
                  {featuredPost.title}
                </h2>

                <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                  {featuredPost.excerpt}
                </p>

                <span className="btn-primary" style={{ display: 'inline-flex', fontSize: '1.05rem', padding: '0.8rem 1.8rem' }}>
                  READ FULL DISPATCH <ArrowRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* 2. ARTICLES GRID */}
      <section className="section-py">
        <div className="site-container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
            <h2 className="font-display" style={{ fontSize: '2.2rem', color: '#fff' }}>
              ALL DISPATCHES ({filteredPosts.length})
            </h2>
          </div>

          {filteredPosts.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '2.5rem'
              }}
            >
              {regularPosts.map((post) => (
                <Link
                  key={post._id}
                  href={`/news/${post.slug}`}
                  className="dark-card-interactive"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', overflow: 'hidden', borderBottom: '1px solid var(--border-subtle)' }}>
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        background: 'rgba(5, 5, 6, 0.85)',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.75rem',
                        color: 'var(--crimson-base)',
                        border: '1px solid var(--border-subtle)',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.1em'
                      }}
                    >
                      {post.category.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                      {post.date} • {post.readTime}
                    </div>

                    <h3 className="font-display" style={{ fontSize: '1.75rem', color: '#fff', lineHeight: 1.15, marginBottom: '0.75rem' }}>
                      {post.title}
                    </h3>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                      {post.excerpt}
                    </p>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                      <span style={{ color: 'var(--crimson-base)', fontSize: '0.9rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
                        READ STORY ›
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                        By {post.author}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
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
    </div>
  );
}
