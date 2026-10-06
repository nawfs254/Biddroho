import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Tag, Share2, ArrowRight } from 'lucide-react';
import { getNewsBySlug, getNews } from '@/lib/dataService';
import { NewsPost } from '@/data/mockData';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const news = await getNews();
  return news.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);
  if (!post) return { title: 'Article Not Found' };

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | BIDDROHO News`,
      description: post.excerpt,
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function SingleNewsPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getNewsBySlug(slug);

  if (!post) {
    notFound();
  }

  const allNews = await getNews();
  const relatedPosts = allNews.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div style={{ backgroundColor: '#050506', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* Breadcrumb */}
      <div style={{ borderBottom: '1px solid var(--border-subtle)', padding: '1.25rem 0' }}>
        <div className="site-container">
          <Link
            href="/news"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--text-secondary)',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              fontFamily: 'var(--font-display)'
            }}
          >
            <ArrowLeft size={16} /> BACK TO ALL NEWS
          </Link>
        </div>
      </div>

      {/* Article Content Container */}
      <article style={{ paddingTop: '3.5rem' }}>
        <div className="site-container" style={{ maxWidth: '880px' }}>
          {/* Category & Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'var(--crimson-base)',
                color: '#fff',
                padding: '0.2rem 0.75rem',
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                letterSpacing: '0.12em'
              }}
            >
              {post.category.toUpperCase()}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {post.date} • {post.readTime}
            </span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              By {post.author}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.4rem)',
              color: '#fff',
              lineHeight: 1.05,
              marginBottom: '1.75rem'
            }}
          >
            {post.title}
          </h1>

          {/* Excerpt Lead */}
          <p
            style={{
              fontSize: '1.25rem',
              color: '#d4d4d8',
              lineHeight: 1.7,
              marginBottom: '2.5rem',
              fontStyle: 'italic',
              borderLeft: '3px solid var(--crimson-base)',
              paddingLeft: '1.25rem'
            }}
          >
            {post.excerpt}
          </p>

          {/* Hero Cover Image */}
          <div
            style={{
              position: 'relative',
              aspectRatio: '16/9',
              width: '100%',
              marginBottom: '3.5rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
            }}
          >
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Main Body Paragraphs */}
          <div style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.9, display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '4rem' }}>
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {/* Tags */}
          {post.tags && (
            <div style={{ borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '1.5rem 0', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Tag size={15} /> TAGS:
              </span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    backgroundColor: '#121216',
                    border: '1px solid var(--border-subtle)',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)'
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '5rem', paddingTop: '4rem' }}>
          <div className="site-container" style={{ maxWidth: '880px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 className="font-display" style={{ fontSize: '2rem', color: '#fff' }}>
                RELATED ARTICLES
              </h3>
              <Link href="/news" className="btn-outline-red">
                ALL NEWS
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              {relatedPosts.map((rel) => (
                <Link
                  key={rel._id}
                  href={`/news/${rel.slug}`}
                  className="dark-card-interactive"
                  style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%' }}>
                    <Image src={rel.coverImage} alt={rel.title} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <span style={{ color: 'var(--crimson-base)', fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
                      {rel.category.toUpperCase()} • {rel.date}
                    </span>
                    <h4 className="font-display" style={{ fontSize: '1.4rem', color: '#fff', marginTop: '4px' }}>
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
