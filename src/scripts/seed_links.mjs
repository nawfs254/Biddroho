import { MongoClient } from 'mongodb';
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
if (!uri) {
  console.error("❌ MONGODB_URI is not set. Please define MONGODB_URI in .env.local or environment.");
  process.exit(1);
}
const client = new MongoClient(uri);

async function main() {
  await client.connect();
  const db = client.db('biddroho');

  const initialLinks = [
    { id: 'link_spotify', label: 'Spotify', url: 'https://open.spotify.com/artist/biddroho' },
    { id: 'link_applemusic', label: 'Apple Music', url: 'https://music.apple.com/artist/biddroho' },
    { id: 'link_youtube', label: 'YouTube Official', url: 'https://youtube.com/@biddroho' },
    { id: 'link_facebook', label: 'Facebook Official', url: 'https://facebook.com/biddroho' },
    { id: 'link_instagram', label: 'Instagram', url: 'https://instagram.com/biddroho' }
  ];

  await db.collection('settings').updateOne(
    { key: 'band_settings' },
    { $set: { connectLinks: initialLinks, updatedAt: new Date() } },
    { upsert: true }
  );

  const doc = await db.collection('settings').findOne({ key: 'band_settings' });
  console.log('SAVED CONNECT LINKS:', doc.connectLinks);
  await client.close();
}

main().catch(console.error);
