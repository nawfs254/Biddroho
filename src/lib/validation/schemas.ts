import { z } from 'zod';

export const normalizeSlug = (val: unknown): string => {
  if (typeof val !== 'string') return '';
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const slugSchema = z.preprocess(
  normalizeSlug,
  z.string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens')
);

export const eventSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: slugSchema,
  date: z.string().min(1, 'Date is required'),
  time: z.string().default('8:00 PM'),
  venue: z.string().min(2, 'Venue is required'),
  city: z.string().min(2, 'City is required'),
  country: z.string().default('Bangladesh'),
  description: z.string().default(''),
  status: z.enum(['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  ticketStatus: z.enum(['available', 'selling_fast', 'sold_out', 'closed', 'not_live_yet', 'not_live']).default('available'),
  ticketPrice: z.string().optional(),
  ticketUrl: z.string().optional(),
  posterImage: z.string().default('/assets/tour_poster.jpg'),
  featured: z.boolean().default(false),
  tourName: z.string().optional(),
  ageRestriction: z.string().default('All Ages / 16+'),
  doorsOpen: z.string().default('6:00 PM'),
});

export const newsSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: slugSchema,
  category: z.string().default('Announcement'),
  excerpt: z.string().min(5, 'Excerpt is required'),
  content: z.string().min(10, 'Full content is required'),
  coverImage: z.string().default('/assets/hero_live.jpg'),
  status: z.enum(['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  featured: z.boolean().default(false),
  readTime: z.string().default('3 min read'),
  author: z.string().default('BIDDROHO Official'),
});

export const musicReleaseSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: slugSchema,
  type: z.enum(['album', 'ep', 'single']).default('album'),
  releaseDate: z.string().min(1, 'Release date is required'),
  year: z.coerce.number().min(1950).max(2100).default(new Date().getFullYear()),
  coverImage: z.string().default('/assets/album_biddrohi.jpg'),
  shortDescription: z.string().default(''),
  fullDescription: z.string().default(''),
  status: z.enum(['DRAFT', 'IN_REVIEW', 'APPROVED', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  featured: z.boolean().default(false),
  youtubeUrl: z.string().optional(),
  streamingLinks: z.object({
    spotify: z.string().optional(),
    appleMusic: z.string().optional(),
    youtubeMusic: z.string().optional(),
    soundcloud: z.string().optional(),
    tidal: z.string().optional(),
  }).default({}),
  credits: z.object({
    producedBy: z.string().default('BIDDROHO'),
    mixedMasteredBy: z.string().default('Acoustic Fire Studios'),
    recordedAt: z.string().default('Studio 11, Dhaka'),
    artworkBy: z.string().default('BIDDROHO Arts'),
    lineup: z.array(z.union([
      z.string(),
      z.object({
        name: z.string(),
        role: z.string().optional().default(''),
      })
    ])).default([]),
  }).default({
    producedBy: 'BIDDROHO',
    mixedMasteredBy: 'Acoustic Fire Studios',
    recordedAt: 'Studio 11, Dhaka',
    artworkBy: 'BIDDROHO Arts',
    lineup: []
  }),
  tracks: z.array(z.object({
    number: z.coerce.number(),
    title: z.string().min(1),
    duration: z.string(),
    previewUrl: z.string().optional(),
    lyricsSnippet: z.string().optional(),
  })).default([]),
});

export const memberSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  role: z.string().min(2, 'Role is required'),
  instrument: z.string().min(2, 'Instrument is required'),
  bio: z.string().min(10, 'Biography is required'),
  joinedYear: z.coerce.number().min(2010).max(2030).default(2011),
  image: z.string().default('/assets/logo.png'),
  gear: z.array(z.string()).default([]),
  quote: z.string().default(''),
  socials: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
  }).optional(),
  active: z.boolean().default(true),
  displayOrder: z.coerce.number().default(1),
});

export const userCreateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  roles: z.array(z.string()).min(1, 'At least one role is required'),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INVITED']).default('ACTIVE'),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  roles: z.array(z.string()).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'INVITED']).optional(),
});

export const bookingStatusUpdateSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'IN_PROGRESS', 'CONFIRMED', 'REJECTED', 'CANCELLED']),
  internalNote: z.string().optional(),
});
