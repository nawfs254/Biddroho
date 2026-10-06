export interface Track {
  number: number;
  title: string;
  duration: string;
  previewUrl?: string;
  lyricsSnippet?: string;
}

export interface Release {
  _id: string;
  slug: string;
  title: string;
  type: 'album' | 'ep' | 'single';
  releaseDate: string;
  year: number;
  coverImage: string;
  shortDescription: string;
  fullDescription: string;
  credits: {
    producedBy: string;
    mixedMasteredBy: string;
    recordedAt: string;
    artworkBy: string;
    lineup: (string | { name: string; role?: string })[];
  };
  streamingLinks: {
    spotify?: string;
    appleMusic?: string;
    youtubeMusic?: string;
    soundcloud?: string;
    tidal?: string;
    amazonMusic?: string;
  };
  youtubeUrl: string;
  featured?: boolean;
  tracks: Track[];
}

export interface EventItem {
  _id: string;
  slug: string;
  title: string;
  tourName?: string;
  date: string;
  formattedDate: string;
  time: string;
  venue: string;
  city: string;
  country: string;
  status: 'upcoming' | 'past';
  ticketStatus: 'available' | 'selling_fast' | 'sold_out' | 'closed' | 'not_live_yet' | 'not_live';
  ticketPrice?: string;
  ticketUrl?: string;
  posterImage: string;
  description: string;
  ageRestriction: string;
  doorsOpen: string;
  setlist?: string[];
  supportingActs?: string[];
  galleryImages?: string[];
  videoRecapUrl?: string;
}

export interface BandMember {
  id: string;
  name: string;
  role: string;
  instrument: string;
  image: string;
  bio: string;
  joinedYear: number;
  gear: string[];
  quote: string;
  socials?: {
    instagram?: string;
    facebook?: string;
  };
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'photo' | 'video';
  category: 'live' | 'studio' | 'portrait' | 'backstage';
  url: string;
  thumbnailUrl: string;
  date: string;
  caption: string;
  location?: string;
  youtubeId?: string;
}

export interface NewsPost {
  _id: string;
  slug: string;
  title: string;
  date: string;
  category: 'Announcement' | 'Live' | 'Behind The Music' | 'Press';
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string[];
  author: string;
  featured?: boolean;
  tags: string[];
}

export const BAND_MEMBERS: BandMember[] = [
  {
    id: "srijon",
    name: "Srijon Tawsif Hossain",
    role: "Vocalist",
    instrument: "Lead Vocals",
    image: "/assets/members/srijon.png",
    bio: "The commanding frontman and vocal powerhouse of BIDDROHO. Known for intense vocal dynamics shifting from melodic depth to ferocious high-register rock screams.",
    joinedYear: 2011,
    gear: ["Shure Beta 58A", "TC-Helicon VoiceLive"],
    quote: "Every scream carries the weight of a thousand untold stories.",
    socials: { instagram: "https://instagram.com", facebook: "https://facebook.com" }
  },
  {
    id: "alvi",
    name: "Sayed Alvi Haque",
    role: "Guitarist",
    instrument: "Guitars & Harmonies",
    image: "/assets/members/alvi.png",
    bio: "Driving the rhythm engine and heavy chord textures. Delivers tight syncopated riffs and atmospheric acoustic layering in BIDDROHO's signature guitar wall.",
    joinedYear: 2013,
    gear: ["ESP E-II Eclipse", "Peavey 6505+"],
    quote: "Rhythm is the bone and muscle of heavy rock.",
    socials: { instagram: "https://instagram.com" }
  },
  {
    id: "mahir",
    name: "Mahir Sakib",
    role: "Guitarist",
    instrument: "Lead Guitars",
    image: "/assets/members/mahir.png",
    bio: "The architect of soaring lead melodies and lightning guitar solos. Fuses expressive vibrato and heavy melodic hooks that define the band's sonic punch.",
    joinedYear: 2011,
    gear: ["PRS Custom 24", "Mesa Boogie Dual Rectifier"],
    quote: "A solo is a vocal confession through six steel strings.",
    socials: { instagram: "https://instagram.com" }
  },
  {
    id: "arnob",
    name: "Nawfs Ul Ahsun Arnob",
    role: "Keyboardist",
    instrument: "Keyboards & Synthesizers",
    image: "/assets/members/arnob.png",
    bio: "The sonic architect crafting cinematic synth soundscapes, progressive keyboard progressions, and dark ambient intros that expand BIDDROHO's musical dimensions.",
    joinedYear: 2015,
    gear: ["Nord Stage 3", "Sequential Prophet Rev2", "Moog Subsequent 37"],
    quote: "Between the heavy distortion, keyboards create space for haunting beauty.",
    socials: { instagram: "https://instagram.com" }
  },
  {
    id: "aurko",
    name: "Zhasid Hasan Aurko",
    role: "Bassist",
    instrument: "Bass Guitars",
    image: "/assets/members/aurko.png",
    bio: "Anchoring the low-end frequency wall with punchy drive and dynamic groove. Locks tightly with the drum strikes to generate bone-shattering low end.",
    joinedYear: 2012,
    gear: ["Dingwall NG3 5-String", "Darkglass Microtubes 900"],
    quote: "If the stage floor isn't vibrating, we haven't done our job.",
    socials: { instagram: "https://instagram.com" }
  },
  {
    id: "ridoy",
    name: "Yasin Ridoy",
    role: "Drummer",
    instrument: "Drums & Percussion",
    image: "/assets/members/ridoy.png",
    bio: "The rhythmic thunder behind the drum kit. Renowned for surgical double-kick control, groove-laden syncopations, and relentless live stamina.",
    joinedYear: 2011,
    gear: ["Tama Starclassic Walnut/Birch", "Zildjian K Dark Cymbals"],
    quote: "The kick and snare are the unstoppable heartbeat of rebellion.",
    socials: { instagram: "https://instagram.com" }
  },
  {
    id: "tanim",
    name: "Tanim Reza",
    role: "Lyricist",
    instrument: "Lyrics & Conceptual Themes",
    image: "/assets/logo.png",
    bio: "The pen behind the rebellion. Penned iconic poetic themes exploring social defiance, existential solitude, and the resilient human spirit for BIDDROHO.",
    joinedYear: 2011,
    gear: ["Notebook & Ink", "Philosophy & Literature"],
    quote: "Words set the flame that the music turns into an inferno.",
    socials: { facebook: "https://facebook.com" }
  }
];

export const RELEASES_DATA: Release[] = [
  {
    _id: "demo-rel-001",
    slug: "demo-album-biddrohi",
    title: "[DEMO] BIDDROHI (The Rebel)",
    type: "album",
    releaseDate: "November 2024",
    year: 2024,
    coverImage: "/assets/album_biddrohi.jpg",
    shortDescription: "Demo studio album showcase demonstrating MongoDB-driven tracklists, streaming links, and production credits.",
    fullDescription: "This is sample demo release data stored in the MongoDB 'releases' collection. In Phase 2 and admin dashboard integrations, administrators can modify or replace this album content in real time.",
    credits: {
      producedBy: "BIDDROHO & Demo Audio Labs",
      mixedMasteredBy: "Acoustic Fire Audio, Dhaka",
      recordedAt: "Studio 11 (Demo)",
      artworkBy: "Official Artwork Team",
      lineup: [
        "Srijon Tawsif Hossain — Vocalist",
        "Sayed Alvi Haque — Guitarist",
        "Mahir Sakib — Guitarist",
        "Nawfs Ul Ahsun Arnob — Keyboardist",
        "Zhasid Hasan Aurko — Bassist",
        "Yasin Ridoy — Drummer",
        "Tanim Reza — Lyricist"
      ]
    },
    streamingLinks: {
      spotify: "https://open.spotify.com",
      appleMusic: "https://music.apple.com",
      youtubeMusic: "https://music.youtube.com"
    },
    youtubeUrl: "https://www.youtube.com",
    featured: true,
    tracks: [
      { number: 1, title: "[Demo Track 01] Prothom Aghat", duration: "4:18" },
      { number: 2, title: "[Demo Track 02] Chhinno Prohor", duration: "5:02" },
      { number: 3, title: "[Demo Track 03] Ondhokarer Daanpote", duration: "4:45" },
      { number: 4, title: "[Demo Track 04] Shikol Bhangar Gaan", duration: "6:12" },
      { number: 5, title: "[Demo Track 05] Biddrohi", duration: "5:30" }
    ]
  },
  {
    _id: "demo-rel-002",
    slug: "demo-ep-shunyo",
    title: "[DEMO] SHUNYO (Void) EP",
    type: "ep",
    releaseDate: "August 2023",
    year: 2023,
    coverImage: "/assets/album_shunyo.jpg",
    shortDescription: "Demo conceptual EP demonstrating multi-track listings and high-definition artwork fetched dynamically from MongoDB.",
    fullDescription: "Sample demo EP record demonstrating how MongoDB manages album categories, genres, track durations, and digital distribution portals.",
    credits: {
      producedBy: "BIDDROHO (Demo)",
      mixedMasteredBy: "Rebel Sound Labs",
      recordedAt: "Dhaka Central",
      artworkBy: "Eclipse Visuals",
      lineup: ["BIDDROHO Official Band Lineup"]
    },
    streamingLinks: {
      spotify: "https://open.spotify.com"
    },
    youtubeUrl: "https://www.youtube.com",
    featured: false,
    tracks: [
      { number: 1, title: "[Demo Track 01] Mohakash", duration: "5:15" },
      { number: 2, title: "[Demo Track 02] Shunyo Shobdo", duration: "4:50" },
      { number: 3, title: "[Demo Track 03] Nirbashon", duration: "5:34" }
    ]
  },
  {
    _id: "demo-rel-003",
    slug: "demo-single-chhinno-prohor",
    title: "[DEMO] Chhinno Prohor (Single)",
    type: "single",
    releaseDate: "October 2024",
    year: 2024,
    coverImage: "/assets/album_biddrohi.jpg",
    shortDescription: "Demo standalone single entry illustrating single release templates and acoustic redux cuts.",
    fullDescription: "Demo data stored inside MongoDB showing single track metadata.",
    credits: {
      producedBy: "BIDDROHO",
      mixedMasteredBy: "Acoustic Fire Audio",
      recordedAt: "Studio 11",
      artworkBy: "Rebel Design",
      lineup: ["BIDDROHO All Members"]
    },
    streamingLinks: {
      spotify: "https://open.spotify.com"
    },
    youtubeUrl: "https://www.youtube.com",
    featured: false,
    tracks: [
      { number: 1, title: "[Demo Single] Chhinno Prohor", duration: "5:02" }
    ]
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    _id: "demo-evt-001",
    slug: "demo-dhaka-rock-fest-2026",
    title: "[DEMO EVENT] Dhaka Rock Fest 2026",
    tourName: "BIDDROHO Live Tour (Demo)",
    date: "2026-11-20",
    formattedDate: "NOVEMBER 20, 2026",
    time: "6:00 PM - 11:00 PM",
    venue: "Army Stadium",
    city: "Dhaka",
    country: "Bangladesh",
    status: "upcoming",
    ticketStatus: "selling_fast",
    ticketPrice: "BDT 800 - BDT 2,500 (Demo)",
    ticketUrl: "https://shohoz.com",
    posterImage: "/assets/tour_poster.jpg",
    description: "Sample demo concert event pulled live from MongoDB Atlas. Demonstrates ticket tiering, venue geolocation, and supporting act billings.",
    ageRestriction: "All Ages",
    doorsOpen: "4:30 PM",
    supportingActs: ["Co-Artist 01 (Demo)", "Co-Artist 02 (Demo)"],
    galleryImages: [
      "/assets/hero_live.jpg",
      "/assets/members/srijon.png",
      "/assets/members/mahir.png"
    ]
  },
  {
    _id: "demo-evt-002",
    slug: "demo-chittagong-thunder-live",
    title: "[DEMO EVENT] Chittagong Thunder Live",
    tourName: "BIDDROHO Live Tour (Demo)",
    date: "2026-12-05",
    formattedDate: "DECEMBER 05, 2026",
    time: "7:00 PM - 10:30 PM",
    venue: "GEC Convention Centre",
    city: "Chittagong",
    country: "Bangladesh",
    status: "upcoming",
    ticketStatus: "available",
    ticketPrice: "BDT 600 - BDT 1,800 (Demo)",
    ticketUrl: "https://getmyticket.com",
    posterImage: "/assets/tour_poster.jpg",
    description: "Sample demo upcoming headline concert entry managed inside MongoDB Atlas.",
    ageRestriction: "16+",
    doorsOpen: "5:30 PM",
    supportingActs: ["Guest Outfit (Demo)"],
    galleryImages: [
      "/assets/hero_live.jpg",
      "/assets/members/alvi.png",
      "/assets/members/ridoy.png"
    ]
  },
  {
    _id: "demo-evt-003",
    slug: "demo-past-rock-carnival-2025",
    title: "[DEMO EVENT] Past Rock Carnival 2025",
    tourName: "Winter Showcase (Demo)",
    date: "2025-12-14",
    formattedDate: "DECEMBER 14, 2025",
    time: "4:00 PM - 11:00 PM",
    venue: "ICCB Hall 4",
    city: "Dhaka",
    country: "Bangladesh",
    status: "past",
    ticketStatus: "sold_out",
    posterImage: "/assets/tour_poster.jpg",
    description: "Sample past concert record showcasing historical setlists and stage galleries.",
    ageRestriction: "All Ages",
    doorsOpen: "3:00 PM",
    setlist: [
      "Demo Track 01 - Prothom Aghat",
      "Demo Track 02 - Chhinno Prohor",
      "Demo Track 03 - Biddrohi"
    ],
    galleryImages: [
      "/assets/hero_live.jpg",
      "/assets/members/srijon.png",
      "/assets/members/ridoy.png"
    ]
  }
];

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "med-001",
    title: "Srijon Tawsif Hossain — Live Frontman",
    type: "photo",
    category: "live",
    url: "/assets/members/srijon.png",
    thumbnailUrl: "/assets/members/srijon.png",
    date: "Demo 2025",
    caption: "Vocalist Srijon Tawsif Hossain commanding the live audience.",
    location: "Live Stage, Dhaka"
  },
  {
    id: "med-002",
    title: "Sayed Alvi Haque — Rhythm Riff Assault",
    type: "photo",
    category: "live",
    url: "/assets/members/alvi.png",
    thumbnailUrl: "/assets/members/alvi.png",
    date: "Demo 2025",
    caption: "Guitarist Sayed Alvi Haque delivering heavy rhythm riffs.",
    location: "Live Stage, Dhaka"
  },
  {
    id: "med-003",
    title: "Mahir Sakib — Searing Lead Solo",
    type: "photo",
    category: "live",
    url: "/assets/members/mahir.png",
    thumbnailUrl: "/assets/members/mahir.png",
    date: "Demo 2025",
    caption: "Guitarist Mahir Sakib performing a blistering lead guitar solo.",
    location: "Live Stage, Dhaka"
  },
  {
    id: "med-004",
    title: "Nawfs Ul Ahsun Arnob — Synth Atmosphere",
    type: "photo",
    category: "live",
    url: "/assets/members/arnob.png",
    thumbnailUrl: "/assets/members/arnob.png",
    date: "Demo 2025",
    caption: "Keyboardist Nawfs Ul Ahsun Arnob orchestrating synth soundscapes.",
    location: "Studio & Live"
  },
  {
    id: "med-005",
    title: "Zhasid Hasan Aurko — Stage Low End",
    type: "photo",
    category: "live",
    url: "/assets/members/aurko.png",
    thumbnailUrl: "/assets/members/aurko.png",
    date: "Demo 2025",
    caption: "Bassist Zhasid Hasan Aurko holding down the stadium low end.",
    location: "Concert Stage"
  },
  {
    id: "med-006",
    title: "Yasin Ridoy — Drums Power",
    type: "photo",
    category: "live",
    url: "/assets/members/ridoy.png",
    thumbnailUrl: "/assets/members/ridoy.png",
    date: "Demo 2025",
    caption: "Drummer Yasin Ridoy delivering thunderous live percussion.",
    location: "Live Stage, Dhaka"
  },
  {
    id: "med-007",
    title: "Stadium Silhouette Live",
    type: "photo",
    category: "live",
    url: "/assets/hero_live.jpg",
    thumbnailUrl: "/assets/hero_live.jpg",
    date: "Demo 2025",
    caption: "Full arena crowd singing along under stage lights.",
    location: "Stadium Arena"
  },
  {
    id: "med-008",
    title: "[DEMO VIDEO] Chhinno Prohor Live Concert Footage",
    type: "video",
    category: "live",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "/assets/hero_live.jpg",
    date: "Demo 2025",
    caption: "Demo concert video embed demonstrating MongoDB media documents.",
    youtubeId: "dQw4w9WgXcQ"
  }
];

export const NEWS_POSTS: NewsPost[] = [
  {
    _id: "demo-news-001",
    slug: "demo-tour-announcement-2026",
    title: "[DEMO ARTICLE] BIDDROHO Announces 2026 Live Tour Dates",
    date: "OCTOBER 02, 2026",
    category: "Announcement",
    readTime: "3 min read",
    coverImage: "/assets/tour_poster.jpg",
    featured: true,
    excerpt: "Demo news post retrieved live from MongoDB database, illustrating article formatting, tags, and categories.",
    author: "BIDDROHO Management",
    tags: ["Tour", "Demo", "MongoDB", "Announcement"],
    content: [
      "This is an official demo press article dynamically pulled from your MongoDB Atlas database collection 'news'.",
      "The full lineup features Vocalist Srijon Tawsif Hossain, Guitarists Sayed Alvi Haque and Mahir Sakib, Keyboardist Nawfs Ul Ahsun Arnob, Bassist Zhasid Hasan Aurko, Drummer Yasin Ridoy, and Lyricist Tanim Reza.",
      "In Phase 2, this section will connect directly with an admin CMS for creating, drafting, and publishing articles."
    ]
  },
  {
    _id: "demo-news-002",
    slug: "demo-studio-sessions-recordings",
    title: "[DEMO ARTICLE] Inside The Studio Sessions: Heavy Guitar Recordings",
    date: "SEPTEMBER 20, 2026",
    category: "Behind The Music",
    readTime: "4 min read",
    coverImage: "/assets/hero_live.jpg",
    featured: false,
    excerpt: "Demo behind-the-scenes recording breakdown stored in MongoDB.",
    author: "Sayed Alvi Haque & Mahir Sakib",
    tags: ["Studio", "Guitars", "Demo"],
    content: [
      "Sample studio log demonstrating rich editorial formatting pulled from the database.",
      "The audio gear and progressive arrangements reflect the band's authentic heavy rock ethos."
    ]
  }
];
