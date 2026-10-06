import { getDatabase } from './mongodb';
import type {
  Release,
  EventItem,
  BandMember,
  NewsPost,
  MediaItem,
} from '@/data/mockData';

function cleanDoc<T>(doc: any): T {
  if (!doc) return doc;
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id ? _id.toString() : undefined,
  } as T;
}

const PUBLIC_STATUS_FILTER = {
  $or: [
    { status: 'PUBLISHED' },
    { status: { $exists: false } }
  ]
};

export async function getReleases(): Promise<Release[]> {
  try {
    const db = await getDatabase();
    const releases = await db.collection('releases')
      .find(PUBLIC_STATUS_FILTER)
      .sort({ year: -1, releaseDate: -1 })
      .toArray();
    return (releases || []).map((r) => cleanDoc<Release>(r));
  } catch (error) {
    console.error('MongoDB query for releases failed:', error);
    return [];
  }
}

export async function getReleaseBySlug(slug: string): Promise<Release | null> {
  try {
    const db = await getDatabase();
    const release = await db.collection('releases').findOne({
      slug,
      ...PUBLIC_STATUS_FILTER
    });
    if (release) {
      return cleanDoc<Release>(release);
    }
  } catch (error) {
    console.error(`MongoDB query for release "${slug}" failed:`, error);
  }
  return null;
}

function normalizeEventDoc(doc: any): EventItem {
  const cleaned = cleanDoc<any>(doc);
  let eventTimeframe: 'upcoming' | 'past' = 'upcoming';
  if (cleaned.status === 'past' || cleaned.status === 'upcoming') {
    eventTimeframe = cleaned.status;
  } else if (cleaned.date) {
    try {
      const eventDate = new Date(cleaned.date);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      eventTimeframe = eventDate >= today ? 'upcoming' : 'past';
    } catch {
      eventTimeframe = 'upcoming';
    }
  }

  let formattedDate = cleaned.formattedDate;
  if (!formattedDate && cleaned.date) {
    try {
      const d = new Date(cleaned.date);
      formattedDate = d.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }).toUpperCase();
    } catch {
      formattedDate = cleaned.date;
    }
  }

  return {
    ...cleaned,
    status: eventTimeframe,
    publicationStatus: cleaned.status || 'PUBLISHED',
    formattedDate: formattedDate || cleaned.date,
  } as EventItem;
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const db = await getDatabase();
    const events = await db.collection('events')
      .find(PUBLIC_STATUS_FILTER)
      .sort({ date: 1 })
      .toArray();
    return (events || []).map((e) => normalizeEventDoc(e));
  } catch (error) {
    console.error('MongoDB query for events failed:', error);
    return [];
  }
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const db = await getDatabase();
    const event = await db.collection('events').findOne({
      slug,
      ...PUBLIC_STATUS_FILTER
    });
    if (event) {
      return normalizeEventDoc(event);
    }
  } catch (error) {
    console.error(`MongoDB query for event "${slug}" failed:`, error);
  }
  return null;
}

export async function getMembers(): Promise<BandMember[]> {
  try {
    const db = await getDatabase();
    const members = await db.collection('members')
      .find({ active: { $ne: false } })
      .sort({ displayOrder: 1 })
      .toArray();
    return (members || []).map((m) => cleanDoc<BandMember>(m));
  } catch (error) {
    console.error('MongoDB query for members failed:', error);
    return [];
  }
}

export async function getNews(): Promise<NewsPost[]> {
  try {
    const db = await getDatabase();
    const news = await db.collection('news')
      .find(PUBLIC_STATUS_FILTER)
      .sort({ createdAt: -1 })
      .toArray();
    return (news || []).map((n) => cleanDoc<NewsPost>(n));
  } catch (error) {
    console.error('MongoDB query for news failed:', error);
    return [];
  }
}

export async function getNewsBySlug(slug: string): Promise<NewsPost | null> {
  try {
    const db = await getDatabase();
    const post = await db.collection('news').findOne({
      slug,
      ...PUBLIC_STATUS_FILTER
    });
    if (post) {
      return cleanDoc<NewsPost>(post);
    }
  } catch (error) {
    console.error(`MongoDB query for news "${slug}" failed:`, error);
  }
  return null;
}

export async function getMedia(): Promise<MediaItem[]> {
  try {
    const db = await getDatabase();
    const media = await db.collection('media').find({}).toArray();
    return (media || []).map((m) => cleanDoc<MediaItem>(m));
  } catch (error) {
    console.error('MongoDB query for media failed:', error);
    return [];
  }
}
