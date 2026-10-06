export interface User {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  roles: string[];
  status: 'ACTIVE' | 'SUSPENDED' | 'INVITED';
  lastLoginAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PermissionDefinition {
  id: string;
  label: string;
  module: string;
  description: string;
}

export interface AuditLog {
  _id?: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  timestamp: string | Date;
  metadata?: Record<string, any>;
}

export type ContentStatus = 'DRAFT' | 'IN_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';

export type BookingStatus = 'NEW' | 'CONTACTED' | 'IN_PROGRESS' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED';

export interface BookingNote {
  id: string;
  author: string;
  authorEmail: string;
  text: string;
  createdAt: string | Date;
}

export interface BookingDocument {
  _id: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  eventDate: string;
  eventType: string;
  venue: string;
  city: string;
  country?: string;
  expectedAudience?: string;
  venueSetting?: string;
  eventNature?: string;
  budget?: string;
  otherArtists?: string;
  sponsors?: string;
  additionalInfo?: string;
  status: BookingStatus;
  retainedAmount?: string | number;
  cancellationReason?: string;
  internalNotes?: BookingNote[];
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface ContactDocument {
  _id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: 'UNREAD' | 'READ' | 'REPLIED' | 'ARCHIVED';
  internalNotes?: string;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface SubscriberDocument {
  _id: string;
  email: string;
  status: 'ACTIVE' | 'UNSUBSCRIBED';
  source?: string;
  createdAt: string | Date;
}

export interface PressReleaseDocument {
  _id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  pdfUrl?: string;
  status: ContentStatus;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface MediaKitAsset {
  id: string;
  title: string;
  category: 'Logos' | 'Hi-Res Photos' | 'Stage Plot' | 'Technical Rider' | 'Bio Sheet';
  fileUrl: string;
  fileSize?: string;
  format?: string;
  downloadCount?: number;
}

export interface ConnectLinkItem {
  id?: string;
  label: string;
  url?: string;
}

export interface BandSettings {
  bandName: string;
  tagline: string;
  contactEmail: string;
  bookingEmail: string;
  pressEmail: string;
  phone: string;
  address: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  bandcampUrl?: string;
  connectLinks?: ConnectLinkItem[];
  maintenanceMode: boolean;
}
