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
    lineup: string[];
  };
  streamingLinks: {
    spotify?: string;
    appleMusic?: string;
    youtubeMusic?: string;
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
  ticketStatus: 'available' | 'selling_fast' | 'sold_out' | 'closed';
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
  socials: {
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

export const RELEASES_DATA: Release[] = [
  {
    _id: "rel-001",
    slug: "biddrohi-the-rebel",
    title: "BIDDROHI (The Rebel)",
    type: "album",
    releaseDate: "November 24, 2024",
    year: 2024,
    coverImage: "/assets/album_biddrohi.jpg",
    shortDescription: "The monumental full-length album capturing the raw ferocity and emotional depth of BIDDROHO's 13-year sonic evolution.",
    fullDescription: "Recorded across nine months of relentless intensity, 'BIDDROHI' represents the definitive modern Bengali rock opus. Fusing bone-crushing guitar riffs, intricate progressive keyboard textures, thunderous rhythmic foundations, and searing vocal delivery, the album confronts societal disillusionment, internal strife, and the triumph of the human spirit.",
    credits: {
      producedBy: "BIDDROHO & Shuvo Studio Labs",
      mixedMasteredBy: "Acoustic Fire Audio, Dhaka",
      recordedAt: "Studio 11 & Sonic Haven Records",
      artworkBy: "Rebel Design Collective",
      lineup: [
        "Srijon — Lead Vocals, Lyricist",
        "Mahir — Lead Guitars, Backing Vocals",
        "Alvi — Rhythm & Acoustic Guitars",
        "Aurko — Bass Guitars",
        "Arnob — Keyboards, Synthesizers, Atmospheric Textures",
        "Ridoy — Drums, Percussion, Heavy Groove"
      ]
    },
    streamingLinks: {
      spotify: "https://open.spotify.com",
      appleMusic: "https://music.apple.com",
      youtubeMusic: "https://music.youtube.com",
      tidal: "https://tidal.com"
    },
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    featured: true,
    tracks: [
      { number: 1, title: "Prothom Aghat (The First Strike)", duration: "4:18" },
      { number: 2, title: "Chhinno Prohor (Shattered Hours)", duration: "5:02" },
      { number: 3, title: "Ondhokarer Daanpote", duration: "4:45" },
      { number: 4, title: "Shikol Bhangar Gaan", duration: "6:12" },
      { number: 5, title: "Biddrohi (Title Track)", duration: "5:30" },
      { number: 6, title: "Roddur O Rokto", duration: "3:58" },
      { number: 7, title: "Kalo Megher Chhaya", duration: "4:24" },
      { number: 8, title: "Nisshongotar Chupkotha", duration: "5:40" },
      { number: 9, title: "Shesh Judhdho", duration: "6:33" },
      { number: 10, title: "Mukti (Outro)", duration: "3:10" }
    ]
  },
  {
    _id: "rel-002",
    slug: "shunyo-ep",
    title: "SHUNYO (Void)",
    type: "ep",
    releaseDate: "August 12, 2023",
    year: 2023,
    coverImage: "/assets/album_shunyo.jpg",
    shortDescription: "A dark ambient, progressive-metal conceptual EP exploring existential nihilism and the rebirth of rebellion.",
    fullDescription: "Born during midnight recording sessions amidst urban solitude, 'SHUNYO' delves into expansive soundscapes, polyrhythmic grooves, and ambient synth layers. It showed the band pushing musical boundaries beyond traditional heavy rock.",
    credits: {
      producedBy: "BIDDROHO",
      mixedMasteredBy: "Rebel Sound Labs",
      recordedAt: "Dhaka Audio Guild",
      artworkBy: "Eclipse Visuals",
      lineup: [
        "Srijon — Vocals",
        "Mahir — Guitars & FX",
        "Alvi — Guitars",
        "Aurko — Bass",
        "Arnob — Synthesizers & Soundscapes",
        "Ridoy — Drums & Percussion"
      ]
    },
    streamingLinks: {
      spotify: "https://open.spotify.com",
      appleMusic: "https://music.apple.com",
      youtubeMusic: "https://music.youtube.com"
    },
    youtubeUrl: "https://www.youtube.com",
    featured: false,
    tracks: [
      { number: 1, title: "Mohakash (Cosmos)", duration: "5:15" },
      { number: 2, title: "Shunyo Shobdo (Void Echoes)", duration: "4:50" },
      { number: 3, title: "Nirbashon (Exile)", duration: "5:34" },
      { number: 4, title: "Dhulor Manush", duration: "4:28" },
      { number: 5, title: "Probashir Shur (The Journey)", duration: "6:05" }
    ]
  },
  {
    _id: "rel-003",
    slug: "chhinno-prohor",
    title: "Chhinno Prohor",
    type: "single",
    releaseDate: "October 10, 2024",
    year: 2024,
    coverImage: "/assets/album_biddrohi.jpg",
    shortDescription: "The breakout heavy single with crushing riffs and soaring anthemic choruses that ignited rock radio.",
    fullDescription: "Single release predecessor to the full-length 'BIDDROHI' album. Received widespread acclaim across the underground and mainstream rock communities for its fierce momentum.",
    credits: {
      producedBy: "BIDDROHO",
      mixedMasteredBy: "Acoustic Fire Audio",
      recordedAt: "Studio 11",
      artworkBy: "Rebel Design",
      lineup: ["BIDDROHO All Members"]
    },
    streamingLinks: {
      spotify: "https://open.spotify.com",
      appleMusic: "https://music.apple.com"
    },
    youtubeUrl: "https://www.youtube.com",
    featured: false,
    tracks: [
      { number: 1, title: "Chhinno Prohor", duration: "5:02" },
      { number: 2, title: "Chhinno Prohor (Acoustic Redux)", duration: "4:30" }
    ]
  },
  {
    _id: "rel-004",
    slug: "protibad",
    title: "Protibad",
    type: "single",
    releaseDate: "March 15, 2023",
    year: 2023,
    coverImage: "/assets/album_shunyo.jpg",
    shortDescription: "A fierce political anthem decrying institutional hypocrisy and honoring the voices that refuse to be silenced.",
    fullDescription: "An electrifying live staple that consistently erupts mosh pits nationwide.",
    credits: {
      producedBy: "BIDDROHO",
      mixedMasteredBy: "Soundscape Studio",
      recordedAt: "Dhaka Central",
      artworkBy: "Rebel Art",
      lineup: ["BIDDROHO All Members"]
    },
    streamingLinks: {
      spotify: "https://open.spotify.com"
    },
    youtubeUrl: "https://www.youtube.com",
    featured: false,
    tracks: [
      { number: 1, title: "Protibad", duration: "4:42" }
    ]
  }
];

export const EVENTS_DATA: EventItem[] = [
  {
    _id: "evt-001",
    slug: "dhaka-rock-fest-2026",
    title: "Dhaka Rock Fest 2026",
    tourName: "BIDDROHO Nation Tour",
    date: "2026-11-20",
    formattedDate: "NOVEMBER 20, 2026",
    time: "6:00 PM - 11:00 PM",
    venue: "Army Stadium",
    city: "Dhaka",
    country: "Bangladesh",
    status: "upcoming",
    ticketStatus: "selling_fast",
    ticketPrice: "BDT 800 - BDT 2,500 (VIP)",
    ticketUrl: "https://shohoz.com",
    posterImage: "/assets/tour_poster.jpg",
    description: "The biggest rock celebration of the decade! BIDDROHO headlines alongside the greatest rock acts in the country for an unforgettable 5-hour sonic onslaught under stadium lights.",
    ageRestriction: "All Ages (Under 14 accompanied by adult)",
    doorsOpen: "4:30 PM",
    supportingActs: ["Nemesis", "Cryptic Fate", "Mechanix", "Powersurge"],
    galleryImages: [
      "/assets/hero_live.jpg",
      "/assets/members/srijon.png",
      "/assets/members/mahir.png"
    ]
  },
  {
    _id: "evt-002",
    slug: "chittagong-thunder-live",
    title: "Chittagong Thunder Live",
    tourName: "BIDDROHO Nation Tour",
    date: "2026-12-05",
    formattedDate: "DECEMBER 05, 2026",
    time: "7:00 PM - 10:30 PM",
    venue: "GEC Convention Centre",
    city: "Chittagong",
    country: "Bangladesh",
    status: "upcoming",
    ticketStatus: "available",
    ticketPrice: "BDT 600 - BDT 1,800",
    ticketUrl: "https://getmyticket.com",
    posterImage: "/assets/tour_poster.jpg",
    description: "Bringing the storm to the Port City. Expect a ruthless two-hour headline set featuring all tracks from 'BIDDROHI' and timeless classic anthems.",
    ageRestriction: "16+",
    doorsOpen: "5:30 PM",
    supportingActs: ["Stentorian", "Bay of Bengal"],
    galleryImages: [
      "/assets/hero_live.jpg",
      "/assets/members/alvi.png",
      "/assets/members/ridoy.png"
    ]
  },
  {
    _id: "evt-003",
    slug: "sylhet-sonic-rebellion",
    title: "Sylhet Sonic Rebellion",
    tourName: "BIDDROHO Nation Tour",
    date: "2026-12-18",
    formattedDate: "DECEMBER 18, 2026",
    time: "6:30 PM - 10:00 PM",
    venue: "Amanullah Convention Hall",
    city: "Sylhet",
    country: "Bangladesh",
    status: "upcoming",
    ticketStatus: "available",
    ticketPrice: "BDT 500 - BDT 1,500",
    ticketUrl: "https://shohoz.com",
    posterImage: "/assets/tour_poster.jpg",
    description: "BIDDROHO's triumphant return to Sylhet. High octane energy, immersive synchronized lighting, and intimate heavy rock vibes.",
    ageRestriction: "All Ages",
    doorsOpen: "5:00 PM",
    supportingActs: ["Level Five", "Local Heavy Outfit"],
    galleryImages: [
      "/assets/hero_live.jpg",
      "/assets/members/arnob.png",
      "/assets/members/aurko.png"
    ]
  },
  {
    _id: "evt-004",
    slug: "rock-carnival-dhaka-2025",
    title: "Rock Carnival Dhaka 2025",
    tourName: "BIDDROHI Album Showcase",
    date: "2025-12-14",
    formattedDate: "DECEMBER 14, 2025",
    time: "4:00 PM - 11:00 PM",
    venue: "ICCB Hall 4, Bashundhara",
    city: "Dhaka",
    country: "Bangladesh",
    status: "past",
    ticketStatus: "sold_out",
    posterImage: "/assets/tour_poster.jpg",
    description: "A sold-out spectacle of over 8,000 screaming rock enthusiasts. BIDDROHO debuted 6 brand-new unreleased tracks to an electrifying pit.",
    ageRestriction: "All Ages",
    doorsOpen: "3:00 PM",
    setlist: [
      "Prothom Aghat",
      "Chhinno Prohor",
      "Protibad",
      "Mohakash",
      "Shunyo Shobdo",
      "Shikol Bhangar Gaan",
      "Biddrohi (Encore)"
    ],
    galleryImages: [
      "/assets/hero_live.jpg",
      "/assets/members/srijon.png",
      "/assets/members/mahir.png",
      "/assets/members/ridoy.png"
    ]
  },
  {
    _id: "evt-005",
    slug: "underground-fury-khulna-2025",
    title: "Underground Fury Khulna",
    tourName: "Winter Rebellion",
    date: "2025-11-08",
    formattedDate: "NOVEMBER 08, 2025",
    time: "6:00 PM - 10:30 PM",
    venue: "Shaheed Hadis Park Grounds",
    city: "Khulna",
    country: "Bangladesh",
    status: "past",
    ticketStatus: "sold_out",
    posterImage: "/assets/tour_poster.jpg",
    description: "An explosive evening marked by unmatched crowd singalongs and raw rock intensity.",
    ageRestriction: "All Ages",
    doorsOpen: "5:00 PM",
    galleryImages: [
      "/assets/hero_live.jpg",
      "/assets/members/aurko.png",
      "/assets/members/alvi.png"
    ]
  }
];

export const BAND_MEMBERS: BandMember[] = [
  {
    id: "srijon",
    name: "Srijon",
    role: "Lead Vocalist & Songwriter",
    instrument: "Vocals",
    image: "/assets/members/srijon.png",
    bio: "The commanding voice and fiery spirit at the helm of BIDDROHO. Renowned for his piercing vocal range that seamlessly transitions from deep brooding baritone intimacy to razor-sharp stadium screams. Srijon's lyrical themes embody rebellion, human liberation, and philosophical awakening.",
    joinedYear: 2011,
    gear: [
      "Shure SM58 Wireless Beta",
      "Neumann KMS 105 Stage Condenser",
      "TC-Helicon VoiceLive 3 Extreme"
    ],
    quote: "Rock music in our blood is not mere entertainment; it is our refusal to submit to silence.",
    socials: {
      instagram: "https://instagram.com",
      facebook: "https://facebook.com"
    }
  },
  {
    id: "mahir",
    name: "Mahir",
    role: "Lead Guitarist",
    instrument: "Lead Guitars & Solos",
    image: "/assets/members/mahir.png",
    bio: "The architect of BIDDROHO's signature screaming solos and intricate modal harmonies. Blending neo-classical precision with ferocious groove metal riffs, Mahir's blistering leads deliver both technical supremacy and visceral emotional depth.",
    joinedYear: 2011,
    gear: [
      "PRS Custom 24 Ten Top",
      "Ibanez J.Custom RG Series",
      "Mesa/Boogie Dual Rectifier Head",
      "Kemper Profiler Stage",
      "Horizon Devices Precision Drive"
    ],
    quote: "A riff must punch through your ribs before it ever touches your ears.",
    socials: {
      instagram: "https://instagram.com"
    }
  },
  {
    id: "alvi",
    name: "Alvi",
    role: "Guitars & Harmonies",
    instrument: "Rhythm & Acoustic Guitars",
    image: "/assets/members/alvi.png",
    bio: "The rhythmic engine of the guitar wall. Alvi provides the chugging low-end aggression, tight syncopated picking, and lush acoustic textures that build BIDDROHO's titanic wall of sound.",
    joinedYear: 2013,
    gear: [
      "ESP E-II Eclipse Full Thickness",
      "Fender Telecaster American Ultra",
      "Peavey 5150 Mk II",
      "Strymon Timeline & BigSky"
    ],
    quote: "Tight rhythms turn chaotic noise into unstoppable momentum.",
    socials: {
      instagram: "https://instagram.com"
    }
  },
  {
    id: "aurko",
    name: "Aurko",
    role: "Bass Guitarist",
    instrument: "Bass Guitars",
    image: "/assets/members/aurko.png",
    bio: "Anchoring the band with bone-rattling low frequencies and dynamic counter-melodies. Aurko's groove locks seamlessly into the drums, supplying the visceral physical impact that defines every BIDDROHO live performance.",
    joinedYear: 2012,
    gear: [
      "Dingwall NG3 5-String Adam Nolly",
      "Fender Precision Bass 1974 Vintage",
      "Darkglass Microtubes 900 V2",
      "Darkglass B7K Ultra Preamp"
    ],
    quote: "If the floor isn't vibrating beneath your feet, we haven't done our job.",
    socials: {
      instagram: "https://instagram.com"
    }
  },
  {
    id: "arnob",
    name: "Arnob",
    role: "Keyboards & Synthesizers",
    instrument: "Keys, Synths & Sound Design",
    image: "/assets/members/arnob.png",
    bio: "The atmospheric mastermind weaving haunting orchestral arrangements, cutting analog synth lines, and cinematic soundscapes throughout the heavy wall of guitars. Arnob gives BIDDROHO its progressive and immersive dimension.",
    joinedYear: 2015,
    gear: [
      "Nord Stage 3 88",
      "Moog Subsequent 37 Analog Synth",
      "Sequential Prophet-6",
      "MainStage Live Rig"
    ],
    quote: "Between the heavy distortion lives space for haunting beauty.",
    socials: {
      instagram: "https://instagram.com"
    }
  },
  {
    id: "ridoy",
    name: "Ridoy",
    role: "Drums & Percussion",
    instrument: "Drums & Percussion",
    image: "/assets/members/ridoy.png",
    bio: "A human powerhouse behind the kit. Known for explosive double-kick footwork, surgical polyrhythms, and thunderous snare strikes that keep mosh pits in perpetual motion.",
    joinedYear: 2011,
    gear: [
      "Tama Starclassic Walnut/Birch Drum Kit",
      "Zildjian K Custom Dark Cymbals",
      "Trick Pro 1-V Bigfoot Double Pedals",
      "Vic Firth 5B Chop Sticks"
    ],
    quote: "Every hit is an explosion; the heartbeat never stops.",
    socials: {
      instagram: "https://instagram.com"
    }
  }
];

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: "med-001",
    title: "Srijon Unleashing The Anthems",
    type: "photo",
    category: "live",
    url: "/assets/members/srijon.png",
    thumbnailUrl: "/assets/members/srijon.png",
    date: "Dec 2025",
    caption: "Frontman Srijon commanding the stadium at Rock Carnival Dhaka.",
    location: "Army Stadium, Dhaka"
  },
  {
    id: "med-002",
    title: "Mahir's Solo Peak",
    type: "photo",
    category: "live",
    url: "/assets/members/mahir.png",
    thumbnailUrl: "/assets/members/mahir.png",
    date: "Dec 2025",
    caption: "Mahir in the zone during the blistering 3-minute solo of 'Chhinno Prohor'.",
    location: "ICCB, Dhaka"
  },
  {
    id: "med-003",
    title: "Alvi Heavy Riff Energy",
    type: "photo",
    category: "live",
    url: "/assets/members/alvi.png",
    thumbnailUrl: "/assets/members/alvi.png",
    date: "Dec 2025",
    caption: "Alvi laying down the heavy low-end rhythm assault under warm tungsten stage lights.",
    location: "Dhaka Live"
  },
  {
    id: "med-004",
    title: "Aurko Live Bass Groove",
    type: "photo",
    category: "live",
    url: "/assets/members/aurko.png",
    thumbnailUrl: "/assets/members/aurko.png",
    date: "Dec 2025",
    caption: "Aurko locking with the kick drum to shake the stadium floor.",
    location: "Chittagong Stage"
  },
  {
    id: "med-005",
    title: "Arnob Synth Atmosphere",
    type: "photo",
    category: "live",
    url: "/assets/members/arnob.png",
    thumbnailUrl: "/assets/members/arnob.png",
    date: "Nov 2025",
    caption: "Arnob orchestrating the haunting intros and synth soundscapes.",
    location: "Studio 11 Sessions"
  },
  {
    id: "med-006",
    title: "Ridoy Thunderous Drums",
    type: "photo",
    category: "live",
    url: "/assets/members/ridoy.png",
    thumbnailUrl: "/assets/members/ridoy.png",
    date: "Dec 2025",
    caption: "Ridoy in full flight on the Tama Starclassic kit.",
    location: "Rock Carnival Dhaka"
  },
  {
    id: "med-007",
    title: "Full Arena Stage Silhouette",
    type: "photo",
    category: "live",
    url: "/assets/hero_live.jpg",
    thumbnailUrl: "/assets/hero_live.jpg",
    date: "2025",
    caption: "25,000 flashlights lighting up the stage as BIDDROHO closes the night.",
    location: "National Rock Fest"
  },
  {
    id: "med-008",
    title: "Chhinno Prohor (Official Music Video)",
    type: "video",
    category: "live",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "/assets/hero_live.jpg",
    date: "Oct 2024",
    caption: "The official visual companion to the smash single 'Chhinno Prohor', filmed in industrial Dhaka.",
    youtubeId: "dQw4w9WgXcQ"
  },
  {
    id: "med-009",
    title: "Live at Rock Carnival — Full 4K Performance",
    type: "video",
    category: "live",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    thumbnailUrl: "/assets/tour_poster.jpg",
    date: "Jan 2026",
    caption: "Full multi-camera broadcast capture of the 80-minute headline set.",
    youtubeId: "dQw4w9WgXcQ"
  }
];

export const NEWS_POSTS: NewsPost[] = [
  {
    _id: "news-001",
    slug: "nationwide-2026-thunder-tour-announced",
    title: "BIDDROHO Announces Nationwide 2026 Thunder Tour & New Studio Works",
    date: "OCTOBER 02, 2026",
    category: "Announcement",
    readTime: "4 min read",
    coverImage: "/assets/tour_poster.jpg",
    featured: true,
    excerpt: "The six-piece heavy rock behemoth prepares for their most ambitious cross-country arena tour to date, visiting Dhaka, Chittagong, Sylhet, and Rajshahi.",
    author: "BIDDROHO Official",
    tags: ["Tour", "Live", "Announcement", "Stage"],
    content: [
      "After eighteen months spent crafting and refining their latest sonic arsenal in the studio, BIDDROHO has officially unveiled dates for the 2026 Thunder Tour across Bangladesh.",
      "The tour marks a momentous milestone for the band, celebrating over fifteen years of independent rock defiance since their inception in 2011. Equipped with a custom-engineered arena lighting production, immersive sub-bass arrays, and an expanded setlist spanning classic anthems to never-before-heard cuts, the tour is slated to begin this November in Dhaka's Army Stadium.",
      "'We haven't been on the road with this scale of production ever before,' said frontman Srijon during a press brief. 'Every single town we visit is going to feel the physical tremor of this music. We are playing louder, harder, and closer to our fans than ever before.'",
      "Tickets for the Dhaka, Chittagong, and Sylhet shows are available immediately through official ticketing partners. Early bird passes in all sectors are moving swiftly."
    ]
  },
  {
    _id: "news-002",
    slug: "behind-the-riffs-chhinno-prohor",
    title: "Behind the Riffs: The Making of Our Heaviest Anthem 'Chhinno Prohor'",
    date: "SEPTEMBER 18, 2026",
    category: "Behind The Music",
    readTime: "6 min read",
    coverImage: "/assets/hero_live.jpg",
    featured: false,
    excerpt: "Guitarists Mahir and Alvi break down the Drop-D tuning, polyrhythmic time changes, and emotional crucible that birthed the chart-topping single.",
    author: "Mahir & Arnob",
    tags: ["Studio", "Guitars", "Production"],
    content: [
      "When we first sat down in Studio 11 at 2:00 AM last December, none of us expected 'Chhinno Prohor' to become the monster it is today.",
      "Mahir started jamming a jagged, off-kilter rhythm in 7/8 time over a pulsing analog Moog arpeggiation that Arnob had looping on repeat. Ridoy walked into the live room, picked up his sticks without saying a word, and delivered the syncopated groove that instantly gave the song its heart.",
      "The vocal delivery took over 40 takes to capture the exact degree of visceral exhaustion and emotional breakthrough that Srijon envisioned. We didn't use auto-tune; we didn't sanitize the grit. Every crack in the voice, every scrape of the guitar strings was deliberately kept raw.",
      "Today, watching tens of thousands of voices roar those exact lyrics back to us in concert is the greatest vindication any musician could ever dream of."
    ]
  },
  {
    _id: "news-003",
    slug: "biddroho-headlines-dhaka-rock-fest-25k-fans",
    title: "BIDDROHO Headlines Dhaka Rock Fest to a Roaring Crowd of 25,000",
    date: "AUGUST 30, 2026",
    category: "Live",
    readTime: "3 min read",
    coverImage: "/assets/album_biddrohi.jpg",
    featured: false,
    excerpt: "A historic night of blistering guitar solos, synchronized mosh pits, and deafening anthems as the capital celebrated raw underground rock.",
    author: "Music Desk",
    tags: ["Review", "Live", "Stadium"],
    content: [
      "The atmosphere inside Army Stadium on Saturday night was nothing short of incandescent. By the time BIDDROHO took the stage at 9:15 PM under deep red strobes, the 25,000-strong crowd was chanting the band's name in unison.",
      "Opening with the crushing intro of 'Prothom Aghat', the band never took their foot off the gas pedal. Between Mahir's searing solos, Aurko's chest-thumping bass riffs, and Srijon's electrifying stage presence, the entire venue became a single undulating wave of headbanging rock lovers.",
      "Critics and fans alike have hailed the performance as the undisputed concert benchmark of the year."
    ]
  },
  {
    _id: "news-004",
    slug: "exclusive-vinyl-and-merch-capsule-collection",
    title: "Upcoming 15th Anniversary Vinyl & Heavy Weight Apparel Drop",
    date: "JULY 14, 2026",
    category: "Press",
    readTime: "2 min read",
    coverImage: "/assets/album_shunyo.jpg",
    featured: false,
    excerpt: "A preview of the limited-edition 180g blood-splatter vinyl pressing of 'BIDDROHI' and bespoke heavyweight tour hoodies.",
    author: "BIDDROHO Merch Dept",
    tags: ["Merch", "Vinyl", "Collectibles"],
    content: [
      "To commemorate the 15th anniversary of BIDDROHO's founding in 2011, the band is proud to announce an ultra-limited collector's vinyl box set.",
      "Pressed on premium 180-gram blood-red marbled vinyl at Abbey Road Mastering, each copy will feature foil-embossed gatefold packaging, exclusive behind-the-scenes photography, and lyric inserts signed by all six band members.",
      "Pre-order notifications will be dispatched exclusively to subscribers on our official website later this season."
    ]
  }
];
