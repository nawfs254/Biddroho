import { PermissionDefinition } from '@/models/types';

export const PERMISSIONS_LIST: PermissionDefinition[] = [
  // Dashboard
  { id: 'dashboard.view', label: 'View Dashboard', module: 'Dashboard', description: 'Access the admin overview and real-time statistics' },

  // Events
  { id: 'events.view', label: 'View Events', module: 'Events', description: 'View tour dates and concert listings' },
  { id: 'events.create', label: 'Create Events', module: 'Events', description: 'Create new tour dates and shows' },
  { id: 'events.update', label: 'Update Events', module: 'Events', description: 'Edit existing show dates, tickets, and details' },
  { id: 'events.delete', label: 'Delete Events', module: 'Events', description: 'Remove tour dates from the database' },
  { id: 'events.publish', label: 'Publish Events', module: 'Events', description: 'Toggle published / archived status on events' },

  // Music
  { id: 'music.view', label: 'View Music', module: 'Music', description: 'View discography, tracks, and releases' },
  { id: 'music.create', label: 'Create Music', module: 'Music', description: 'Add new albums, EPs, singles, and tracklists' },
  { id: 'music.update', label: 'Update Music', module: 'Music', description: 'Edit existing releases, credits, and streaming links' },
  { id: 'music.delete', label: 'Delete Music', module: 'Music', description: 'Delete music releases' },
  { id: 'music.publish', label: 'Publish Music', module: 'Music', description: 'Publish or unpublish releases for public streaming' },

  // News
  { id: 'news.view', label: 'View News', module: 'News', description: 'View news posts and announcements' },
  { id: 'news.create', label: 'Create News', module: 'News', description: 'Draft news articles and press releases' },
  { id: 'news.update', label: 'Update News', module: 'News', description: 'Edit news articles and categories' },
  { id: 'news.delete', label: 'Delete News', module: 'News', description: 'Delete news posts' },
  { id: 'news.publish', label: 'Publish News', module: 'News', description: 'Publish news posts to the official site' },

  // Media
  { id: 'media.view', label: 'View Media', module: 'Media', description: 'Browse photo and video archives' },
  { id: 'media.upload', label: 'Upload/Add Media', module: 'Media', description: 'Add photos and video URLs to archives' },
  { id: 'media.update', label: 'Update Media', module: 'Media', description: 'Edit media metadata and captions' },
  { id: 'media.delete', label: 'Delete Media', module: 'Media', description: 'Remove media assets from the archives' },

  // Band Members
  { id: 'members.view', label: 'View Band Members', module: 'Band Members', description: 'View official member lineups and profiles' },
  { id: 'members.create', label: 'Add Band Member', module: 'Band Members', description: 'Add new members or touring musicians' },
  { id: 'members.update', label: 'Update Band Member', module: 'Band Members', description: 'Edit bios, gear rigs, photos, and quotes' },
  { id: 'members.delete', label: 'Delete Band Member', module: 'Band Members', description: 'Remove members from the official lineup' },

  // Bookings CRM
  { id: 'bookings.view', label: 'View Bookings', module: 'Bookings CRM', description: 'View concert and festival booking inquiries' },
  { id: 'bookings.update', label: 'Manage Bookings', module: 'Bookings CRM', description: 'Update status, add internal notes, modify details' },
  { id: 'bookings.delete', label: 'Delete Bookings', module: 'Bookings CRM', description: 'Permanently remove booking inquiries' },

  // Contacts
  { id: 'contacts.view', label: 'View Contacts', module: 'Contacts', description: 'View general contact submissions' },
  { id: 'contacts.update', label: 'Manage Contacts', module: 'Contacts', description: 'Update read status and internal notes' },
  { id: 'contacts.delete', label: 'Delete Contacts', module: 'Contacts', description: 'Delete contact submissions' },

  // Subscribers
  { id: 'subscribers.view', label: 'View Subscribers', module: 'Subscribers', description: 'View newsletter subscriber list' },
  { id: 'subscribers.update', label: 'Manage Subscribers', module: 'Subscribers', description: 'Toggle subscription statuses' },
  { id: 'subscribers.delete', label: 'Delete Subscribers', module: 'Subscribers', description: 'Remove emails from subscriber list' },

  // Press
  { id: 'press.view', label: 'View Press Materials', module: 'Press', description: 'View official press releases and media kits' },
  { id: 'press.create', label: 'Create Press Materials', module: 'Press', description: 'Draft press releases and upload kits' },
  { id: 'press.update', label: 'Update Press Materials', module: 'Press', description: 'Edit press releases and media kit assets' },
  { id: 'press.delete', label: 'Delete Press Materials', module: 'Press', description: 'Remove press releases and media kits' },
  { id: 'press.publish', label: 'Publish Press Materials', module: 'Press', description: 'Publish press materials for public media kit' },

  // Users
  { id: 'users.view', label: 'View Users', module: 'User Management', description: 'View team accounts, roles, and statuses' },
  { id: 'users.create', label: 'Create Users', module: 'User Management', description: 'Invite or register new team members' },
  { id: 'users.update', label: 'Update Users', module: 'User Management', description: 'Modify roles, password resets, active/suspended status' },
  { id: 'users.delete', label: 'Delete Users', module: 'User Management', description: 'Remove team accounts' },

  // Roles & Permissions
  { id: 'roles.view', label: 'View Roles', module: 'Roles & RBAC', description: 'View role definitions and assigned permissions' },
  { id: 'roles.create', label: 'Create Roles', module: 'Roles & RBAC', description: 'Create custom security roles' },
  { id: 'roles.update', label: 'Update Roles', module: 'Roles & RBAC', description: 'Modify permission matrix for roles' },
  { id: 'roles.delete', label: 'Delete Roles', module: 'Roles & RBAC', description: 'Remove non-system roles' },

  // Settings
  { id: 'settings.view', label: 'View Settings', module: 'Settings', description: 'View system and band configurations' },
  { id: 'settings.update', label: 'Update Settings', module: 'Settings', description: 'Update official links, emails, and maintenance mode' },

  // Audit Logs
  { id: 'audit.view', label: 'View Audit Logs', module: 'Audit Logs', description: 'Inspect audit trail and administrative security logs' },
];

export const ALL_PERMISSION_IDS = PERMISSIONS_LIST.map((p) => p.id);

export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ALL_PERMISSION_IDS,

  BAND_MANAGER: [
    'dashboard.view',
    'events.view', 'events.create', 'events.update', 'events.delete', 'events.publish',
    'music.view', 'music.create', 'music.update', 'music.delete', 'music.publish',
    'news.view', 'news.create', 'news.update', 'news.delete', 'news.publish',
    'media.view', 'media.upload', 'media.update', 'media.delete',
    'members.view', 'members.create', 'members.update',
    'bookings.view', 'bookings.update', 'bookings.delete',
    'contacts.view', 'contacts.update', 'contacts.delete',
    'subscribers.view', 'subscribers.update',
    'press.view', 'press.create', 'press.update', 'press.delete', 'press.publish',
    'settings.view', 'settings.update',
    'audit.view'
  ],

  EDITOR: [
    'dashboard.view',
    'events.view', 'events.create', 'events.update',
    'music.view', 'music.create', 'music.update',
    'news.view', 'news.create', 'news.update',
    'media.view', 'media.upload', 'media.update',
    'members.view', 'members.update',
    'press.view', 'press.create', 'press.update'
  ],

  MODERATOR: [
    'dashboard.view',
    'events.view',
    'music.view',
    'news.view',
    'media.view',
    'members.view',
    'bookings.view',
    'contacts.view'
  ],

  PRESS: [
    'dashboard.view',
    'press.view', 'press.create', 'press.update',
    'media.view', 'media.upload',
    'news.view'
  ],

  BAND_MEMBER: [
    'dashboard.view',
    'members.view', 'members.update',
    'events.view',
    'music.view',
    'media.view',
    'press.view'
  ],
};
