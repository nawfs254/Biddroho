import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { readFileSync, existsSync } from 'fs';

// Load .env.local if present
if (existsSync('.env.local')) {
  const content = readFileSync('.env.local', 'utf-8');
  for (const line of content.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "biddroho";

if (!uri) {
  console.error("❌ MONGODB_URI is not set. Please define MONGODB_URI in .env.local or environment.");
  process.exit(1);
}

const PERMISSIONS = [
  { id: 'dashboard.view', label: 'View Dashboard', module: 'Dashboard' },
  { id: 'events.view', label: 'View Events', module: 'Events' },
  { id: 'events.create', label: 'Create Events', module: 'Events' },
  { id: 'events.update', label: 'Update Events', module: 'Events' },
  { id: 'events.delete', label: 'Delete Events', module: 'Events' },
  { id: 'events.publish', label: 'Publish Events', module: 'Events' },
  { id: 'music.view', label: 'View Music', module: 'Music' },
  { id: 'music.create', label: 'Create Music', module: 'Music' },
  { id: 'music.update', label: 'Update Music', module: 'Music' },
  { id: 'music.delete', label: 'Delete Music', module: 'Music' },
  { id: 'music.publish', label: 'Publish Music', module: 'Music' },
  { id: 'news.view', label: 'View News', module: 'News' },
  { id: 'news.create', label: 'Create News', module: 'News' },
  { id: 'news.update', label: 'Update News', module: 'News' },
  { id: 'news.delete', label: 'Delete News', module: 'News' },
  { id: 'news.publish', label: 'Publish News', module: 'News' },
  { id: 'media.view', label: 'View Media', module: 'Media' },
  { id: 'media.upload', label: 'Upload/Add Media', module: 'Media' },
  { id: 'media.update', label: 'Update Media', module: 'Media' },
  { id: 'media.delete', label: 'Delete Media', module: 'Media' },
  { id: 'members.view', label: 'View Band Members', module: 'Band Members' },
  { id: 'members.create', label: 'Add Band Member', module: 'Band Members' },
  { id: 'members.update', label: 'Update Band Member', module: 'Band Members' },
  { id: 'members.delete', label: 'Delete Band Member', module: 'Band Members' },
  { id: 'bookings.view', label: 'View Bookings', module: 'Bookings CRM' },
  { id: 'bookings.update', label: 'Manage Bookings', module: 'Bookings CRM' },
  { id: 'bookings.delete', label: 'Delete Bookings', module: 'Bookings CRM' },
  { id: 'contacts.view', label: 'View Contacts', module: 'Contacts' },
  { id: 'contacts.update', label: 'Manage Contacts', module: 'Contacts' },
  { id: 'contacts.delete', label: 'Delete Contacts', module: 'Contacts' },
  { id: 'subscribers.view', label: 'View Subscribers', module: 'Subscribers' },
  { id: 'subscribers.update', label: 'Manage Subscribers', module: 'Subscribers' },
  { id: 'subscribers.delete', label: 'Delete Subscribers', module: 'Subscribers' },
  { id: 'press.view', label: 'View Press Materials', module: 'Press' },
  { id: 'press.create', label: 'Create Press Materials', module: 'Press' },
  { id: 'press.update', label: 'Update Press Materials', module: 'Press' },
  { id: 'press.delete', label: 'Delete Press Materials', module: 'Press' },
  { id: 'press.publish', label: 'Publish Press Materials', module: 'Press' },
  { id: 'users.view', label: 'View Users', module: 'User Management' },
  { id: 'users.create', label: 'Create Users', module: 'User Management' },
  { id: 'users.update', label: 'Update Users', module: 'User Management' },
  { id: 'users.delete', label: 'Delete Users', module: 'User Management' },
  { id: 'roles.view', label: 'View Roles', module: 'Roles & RBAC' },
  { id: 'roles.create', label: 'Create Roles', module: 'Roles & RBAC' },
  { id: 'roles.update', label: 'Update Roles', module: 'Roles & RBAC' },
  { id: 'roles.delete', label: 'Delete Roles', module: 'Roles & RBAC' },
  { id: 'settings.view', label: 'View Settings', module: 'Settings' },
  { id: 'settings.update', label: 'Update Settings', module: 'Settings' },
  { id: 'audit.view', label: 'View Audit Logs', module: 'Audit Logs' },
];

const ALL_PERM_IDS = PERMISSIONS.map(p => p.id);

const ROLES = [
  {
    name: 'ADMIN',
    description: 'Supreme administrator with unrestricted access across all CMS, RBAC, users, and CRM operations.',
    permissions: ALL_PERM_IDS,
    isSystem: true,
  },
  {
    name: 'BAND_MANAGER',
    description: 'Operational lead managing tour schedules, music, press, media, and booking negotiations.',
    permissions: [
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
    isSystem: true,
  },
  {
    name: 'EDITOR',
    description: 'Content creator capable of drafting news, releases, shows, and photos for approval.',
    permissions: [
      'dashboard.view',
      'events.view', 'events.create', 'events.update',
      'music.view', 'music.create', 'music.update',
      'news.view', 'news.create', 'news.update',
      'media.view', 'media.upload', 'media.update',
      'members.view', 'members.update',
      'press.view', 'press.create', 'press.update'
    ],
    isSystem: true,
  },
  {
    name: 'MODERATOR',
    description: 'Reviews comments, inquiries, and oversees content submissions.',
    permissions: [
      'dashboard.view',
      'events.view',
      'music.view',
      'news.view',
      'media.view',
      'members.view',
      'bookings.view',
      'contacts.view'
    ],
    isSystem: true,
  },
  {
    name: 'PRESS',
    description: 'External or internal PR personnel managing press releases and media kit assets.',
    permissions: [
      'dashboard.view',
      'press.view', 'press.create', 'press.update',
      'media.view', 'media.upload',
      'news.view'
    ],
    isSystem: true,
  },
  {
    name: 'BAND_MEMBER',
    description: 'Official BIDDROHO band musician with access to personal member profile and tour schedules.',
    permissions: [
      'dashboard.view',
      'members.view', 'members.update',
      'events.view',
      'music.view',
      'media.view',
      'press.view'
    ],
    isSystem: true,
  },
];

async function seed() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas...');
    const db = client.db(dbName);

    // 1. Roles
    console.log('Seeding Roles collection...');
    for (const r of ROLES) {
      await db.collection('roles').updateOne(
        { name: r.name },
        {
          $set: {
            ...r,
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          }
        },
        { upsert: true }
      );
    }

    // 2. Initial Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@biddroho.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'BiddrohoAdmin2026!';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    console.log(`Setting up Admin user (${adminEmail})...`);
    await db.collection('users').updateOne(
      { email: adminEmail },
      {
        $set: {
          name: 'BIDDROHO Super Admin',
          email: adminEmail,
          passwordHash: passwordHash,
          roles: ['ADMIN'],
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        }
      },
      { upsert: true }
    );

    // Also seed a demo Editor user for testing RBAC
    const editorEmail = 'editor@biddroho.com';
    const editorHash = await bcrypt.hash('BiddrohoEditor2026!', 10);
    await db.collection('users').updateOne(
      { email: editorEmail },
      {
        $set: {
          name: 'BIDDROHO Content Editor',
          email: editorEmail,
          passwordHash: editorHash,
          roles: ['EDITOR'],
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        }
      },
      { upsert: true }
    );

    // 3. Settings
    console.log('Seeding Band Settings...');
    await db.collection('settings').updateOne(
      { key: 'band_settings' },
      {
        $set: {
          key: 'band_settings',
          bandName: 'BIDDROHO',
          tagline: 'Heavy Rock & Raw Rebellion from Dhaka',
          contactEmail: 'contact@biddroho.com',
          bookingEmail: 'booking@biddroho.com',
          pressEmail: 'press@biddroho.com',
          phone: '+880 1711 000000',
          address: 'Dhaka, Bangladesh',
          spotifyUrl: 'https://open.spotify.com/artist/biddroho',
          appleMusicUrl: 'https://music.apple.com/artist/biddroho',
          youtubeUrl: 'https://youtube.com/@biddroho',
          facebookUrl: 'https://facebook.com/biddroho',
          instagramUrl: 'https://instagram.com/biddroho',
          bandcampUrl: 'https://biddroho.bandcamp.com',
          maintenanceMode: false,
          updatedAt: new Date(),
        }
      },
      { upsert: true }
    );

    // 4. Update existing content documents with status = 'PUBLISHED'
    console.log('Ensuring content statuses on existing records...');
    await db.collection('events').updateMany(
      { status: { $exists: false } },
      { $set: { status: 'PUBLISHED' } }
    );
    // If existing status is 'upcoming' or 'past', normalize to PUBLISHED while keeping time status
    await db.collection('events').updateMany(
      { status: { $in: ['upcoming', 'past'] } },
      { $set: { status: 'PUBLISHED' } }
    );

    await db.collection('releases').updateMany(
      { status: { $exists: false } },
      { $set: { status: 'PUBLISHED' } }
    );

    await db.collection('news').updateMany(
      { status: { $exists: false } },
      { $set: { status: 'PUBLISHED' } }
    );

    // 5. Sample Press Releases
    const pressCount = await db.collection('press_releases').countDocuments();
    if (pressCount === 0) {
      console.log('Seeding initial press releases...');
      await db.collection('press_releases').insertMany([
        {
          title: "BIDDROHO Announces Nationwide 'Shongram Tour 2026' Across 5 Major Divisions",
          slug: "shongram-tour-2026-announcement",
          date: "October 2026",
          excerpt: "Bengali heavy rock stalwarts BIDDROHO reveal dates for their most ambitious arena and stadium tour to date.",
          content: "Dhaka, Bangladesh — BIDDROHO has officially unveiled plans for the 'Shongram Tour 2026', bringing their electrifying live performances to Dhaka, Chattogram, Sylhet, Rajshahi, and Khulna. Known for intense sonic power and unapologetic Bengali rock poetry, the band promises high-voltage production and exclusive unreleased live arrangements.",
          status: "PUBLISHED",
          coverImage: "/assets/tour_poster.jpg",
          pdfUrl: "/press/shongram_tour_press_release.pdf",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Behind the Consoles: BIDDROHO Completes Mixing on Upcoming Heavy Rock Single",
          slug: "behind-the-consoles-new-single",
          date: "September 2026",
          excerpt: "Studio dispatch detailing the analogue mixing and heavy guitar tracking for their upcoming release.",
          content: "In a dedicated month-long studio retreat, BIDDROHO combined vintage valve preamps with crushing modern guitar rigs to construct their heaviest audio statement yet. Frontman Srijon and lead guitarist Mahir confirmed that the new anthem pushes the envelope of Bangladeshi heavy music.",
          status: "PUBLISHED",
          coverImage: "/assets/album_biddrohi.jpg",
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ]);
    }

    // 6. Sample Contacts & Subscribers
    const contactCount = await db.collection('contacts').countDocuments();
    if (contactCount === 0) {
      console.log('Seeding sample contacts...');
      await db.collection('contacts').insertMany([
        {
          name: "Rafiul Alam",
          email: "rafiul@rockfestbd.org",
          subject: "Inter-University Rock Showcase 2026 Headline Invitation",
          message: "Greetings BIDDROHO team. We are hosting the Inter-University Rock Fest at TSC Auditorium in November and would love to invite BIDDROHO as the headline artist. Please let us know availability and riders.",
          status: "UNREAD",
          internalNotes: "Reviewing calendar with Band Manager.",
          createdAt: new Date(Date.now() - 3600000 * 4),
          updatedAt: new Date(),
        },
        {
          name: "Farhan Ahmed",
          email: "farhan@soundstorm.com",
          subject: "Collaboration & Sound Gear Endorsement",
          message: "Would love to discuss custom stage monitoring and custom guitar cable sponsorships for the upcoming nationwide tour.",
          status: "READ",
          internalNotes: "Forwarded to Alvi and Mahir.",
          createdAt: new Date(Date.now() - 3600000 * 24),
          updatedAt: new Date(),
        }
      ]);
    }

    const subCount = await db.collection('subscribers').countDocuments();
    if (subCount === 0) {
      console.log('Seeding sample subscribers...');
      await db.collection('subscribers').insertMany([
        { email: "fan.rocker@gmail.com", status: "ACTIVE", source: "footer", createdAt: new Date() },
        { email: "guitarist.dhaka@yahoo.com", status: "ACTIVE", source: "footer", createdAt: new Date() },
        { email: "biddroho.army@gmail.com", status: "ACTIVE", source: "homepage", createdAt: new Date() },
        { email: "metalhead_bd@outlook.com", status: "ACTIVE", source: "footer", createdAt: new Date() },
      ]);
    }

    // 7. Initial Audit Log
    const auditCount = await db.collection('audit_logs').countDocuments();
    if (auditCount === 0) {
      console.log('Seeding initial audit logs...');
      await db.collection('audit_logs').insertOne({
        userId: 'system',
        userName: 'BIDDROHO Setup Engine',
        action: 'SYSTEM_INITIALIZED',
        resource: 'system',
        resourceId: 'biddroho_phase3',
        timestamp: new Date(),
        metadata: {
          version: '3.0.0',
          modules: ['auth', 'rbac', 'cms', 'crm', 'audit'],
          adminEmail: adminEmail,
        }
      });
    }

    console.log('Phase 3 Database Seeding Complete!');
  } finally {
    await client.close();
  }
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
