/**
 * ============================================================================
 * GUNSHOT PORTFOLIO - CENTRAL DATA STORE
 * ============================================================================
 * Esports Broadcast & Production Professional
 * Role: Assistant Producer at ECUBE
 * Focus: GT Title Designer | Live Graphics Designer | Expert in vMix & OBS
 * Location: Dhaka, Bangladesh
 * ============================================================================
 */

const portfolioData = {
  // --------------------------------------------------------------------------
  // 1. PERSONAL INFORMATION & BRANDING
  // --------------------------------------------------------------------------
  personalInfo: {
    handle: "GUNSHOT",
    firstName: "Gunshot",
    fullName: "Gunshot",
    title: "ESPORTS ASSISTANT PRODUCER & BROADCAST SPECIALIST",
    tagline: "GT Title Designer • Live Graphics Designer • Expert in vMix & OBS",
    shortIntro: "Currently working as an Assistant Producer at ECUBE, delivering high-tier esports tournament broadcasts with custom GT title animations, real-time graphics, and vMix/OBS master switching.",
    
    // Short, punchy About Me text (as requested: concise and specific)
    aboutHeading: "ASSISTANT PRODUCER AT",
    aboutStatement: "I am currently working in an Assistant Producer role at ECUBE. I specialize as a GT Title Designer, Live Graphics Designer, and an expert operator in vMix and OBS Studio for live esports championships and major tournament broadcasts.",
    
    basedIn: "Dhaka, Bangladesh",
    currentRole: "Assistant Producer",
    currentCompany: "ECUBE (Event Execution Experts)",
    primaryTools: "vMix • OBS • GT Titles",
    status: "ON AIR // READY FOR PRODUCTION",
    
    profileImage: "assets/images/hero-portrait.jpg",
    aboutImage: "assets/images/hero-portrait.jpg", // Using user's authentic photo
    
    // Direct Contact Details
    email: "gunshot.broadcast@gmail.com",
    phone: "+880 1700-000000",
    location: "Dhaka, Bangladesh",
    discord: "gunshot#0001",
    
    // Key Core Pillars (Fully editable text, icon, and custom logo)
    corePillars: [
      { id: "pillar-1", title: "GT TITLE DESIGNER", desc: "vMix animated GT scoreboards, lower thirds, match points & kill trackers", icon: "⚡", logo: "" },
      { id: "pillar-2", title: "LIVE GRAPHICS DESIGNER", desc: "Singular.live, dynamic web overlays, animated stingers & tournament brackets", icon: "⚡", logo: "" },
      { id: "pillar-3", title: "vMIX MASTER SWITCHER", desc: "Multi-input 4K switching, multi-cam directing, instant replay & macro shortcuts", icon: "⚡", logo: "" },
      { id: "pillar-4", title: "OBS STUDIO EXPERT", desc: "NDI/SRT remote ingest, encoding optimization, audio bus routing & stream telemetry", icon: "⚡", logo: "" }
    ]
  },

  // --------------------------------------------------------------------------
  // SECTION HEADERS (EDITABLE ACROSS ALL SEGMENTS)
  // --------------------------------------------------------------------------
  sectionHeaders: {
    hero: {
      tag: "OFFICIAL BROADCAST PORTFOLIO",
      title: "GUNSHOT",
      roleTitle: "ESPORTS ASSISTANT PRODUCER",
      tagline: "GT Title Designer • Live Graphics Designer • Expert in vMix & OBS",
      shortIntro: "Currently working as an Assistant Producer, delivering high-tier esports tournament broadcasts with custom GT title animations, real-time graphics, and vMix/OBS master switching.",
      statusPill: "STATUS: ON AIR // LIVE BROADCAST",
      companyBadgeRole: "ASSISTANT PRODUCER",
      companyBadgeSub: "GT Titles & Live Graphics",
      companyLogo: "assets/images/ecube-logo.png"
    },
    about: {
      tag: "ABOUT ME",
      title: "ASSISTANT PRODUCER AT",
      showLogo: true,
      logo: "assets/images/ecube-logo.png",
      subtitle: "Core specialization in live broadcast engineering, real-time title design, and master switching."
    },
    metrics: {
      tag: "BROADCAST METRICS & GAME TITLES",
      title: "TOURNAMENT TRACK RECORD & GAME ECOSYSTEMS",
      subtitle: "Official championships, local community events, and world-class competitive titles engineered live in production."
    },
    gamesWorked: {
      tag: "COMPETITIVE ECOSYSTEMS",
      title: "GAMES WORKED WITH IN BROADCAST & TITLE DESIGN",
      subtitle: "Specialized in vMix multi-feed switching, custom GT Title scoreboards, and real-time observer telemetry across premier esports titles."
    },
    productions: {
      tag: "OFFICIAL PRODUCTION PORTFOLIO",
      title: "WHERE I'VE PRODUCED",
      subtitle: "Tournaments, championships, and live broadcasts executed under ECUBE and esports partners. Use the upload and edit bars on each card to customize pictures, videos, or details."
    },
    videos: {
      tag: "BROADCAST MOTION",
      title: "VIDEO SHOWCASE & REELS",
      subtitle: "Watch showreels, live GT title animations, and control room switching in action."
    },
    contact: {
      tag: "COMMUNICATIONS",
      title: "CONNECT WITH ME",
      subtitle: "Inquire about tournament productions, GT title design projects, live broadcast crew booking, or general collaboration."
    },
    suggestions: {
      tag: "COMMUNITY & BROADCAST FEEDBACK",
      title: "VIEWER COMMENTS & SUGGESTIONS",
      subtitle: "Drop your tournament ideas, broadcast suggestions, GT Title design critiques, or community shoutouts for upcoming championship productions."
    }
  },

  // --------------------------------------------------------------------------
  // EVENT METRICS / STATS (DEDICATED SECTION)
  // --------------------------------------------------------------------------
  eventStats: {
    officialCount: "10+",
    officialLabel: "OFFICIAL EVENTS",
    officialBadge: "🏆 TIER 1 // PUBLISHER",
    officialPing: "LIVE SYNC",
    officialDesc: "Publisher-sanctioned stadium tournaments, regional finals, and premier broadcast arenas with custom GT graphics.",
    officialFooterTag: "TIER-1 ACCREDITED",
    officialFooterIcon: "⚡",

    localCount: "200+",
    localLabel: "LOCAL EVENTS",
    localBadge: "🏟️ GRASSROOTS // LAN ARENA",
    localPing: "HIGH FREQUENCY",
    localDesc: "Regional LAN showdowns, university esports leagues, gaming cafe tournaments, and community stage productions.",
    localFooterTag: "HIGH-VOLUME PRODUCTION",
    localFooterIcon: "🔥",

    unofficialCount: "5+",
    unofficialLabel: "UNOFFICIAL",
    unofficialBadge: "🎯 INVITATIONAL // SCENE",
    unofficialPing: "CUSTOM FORMAT",
    unofficialDesc: "Creator invitationals, independent community cups, and custom esports showmatches with tailored broadcast packages.",
    unofficialFooterTag: "CUSTOM BROADCASTING",
    unofficialFooterIcon: "⚡"
  },

  metricCards: [
    {
      id: "metric-official",
      type: "official",
      colorTheme: "cyan",
      badge: "🏆 TIER 1 // PUBLISHER",
      badgeColor: "cyan",
      ping: "LIVE SYNC",
      count: "10+",
      label: "OFFICIAL EVENTS",
      description: "Publisher-sanctioned stadium tournaments, regional finals, and premier broadcast arenas with custom GT graphics.",
      footerTag: "TIER-1 ACCREDITED",
      footerIcon: "⚡"
    },
    {
      id: "metric-local",
      type: "local",
      colorTheme: "purple",
      badge: "🏟️ GRASSROOTS // LAN ARENA",
      badgeColor: "purple",
      ping: "HIGH FREQUENCY",
      count: "200+",
      label: "LOCAL EVENTS",
      description: "Regional LAN showdowns, university esports leagues, gaming cafe tournaments, and community stage productions.",
      footerTag: "HIGH-VOLUME PRODUCTION",
      footerIcon: "🔥"
    },
    {
      id: "metric-unofficial",
      type: "unofficial",
      colorTheme: "gold",
      badge: "🎯 INVITATIONAL // SCENE",
      badgeColor: "gold",
      ping: "CUSTOM FORMAT",
      count: "5+",
      label: "UNOFFICIAL",
      description: "Creator invitationals, independent community cups, and custom esports showmatches with tailored broadcast packages.",
      footerTag: "CUSTOM BROADCASTING",
      footerIcon: "⚡"
    }
  ],

  // --------------------------------------------------------------------------
  // GAMES WORKED WITH (COMPETITIVE ESPORTS ECOSYSTEMS)
  // --------------------------------------------------------------------------
  workedGames: [
    {
      id: "game-free-fire",
      name: "GARENA FREE FIRE",
      publisher: "Garena",
      badge: "FLAGSHIP ESPORTS",
      badgeColor: "cyan",
      icon: "🔥",
      role: "GT Title Designer & Assistant Producer",
      tournaments: "FFWS BD (Fall & Spring) • Free Fire World Series • National Qualifiers",
      description: "Engineered custom animated GT Title scoreboards, real-time kill feed graphics, spectator lower-thirds, drop-zone map telemetry, and live survivor counter feeds.",
      stats: "150+ Broadcast Matches",
      tools: "vMix GT Titles • Singular.live • OBS Telemetry"
    },
    {
      id: "game-pubg-mobile",
      name: "TENCENT PUBG MOBILE",
      publisher: "Tencent Games / Krafton",
      badge: "TIER 1 BATTLE ROYALE",
      badgeColor: "purple",
      icon: "🎯",
      role: "vMix Master Switcher & Live Graphics",
      tournaments: "PUBG Mobile Pro Arena • PMCO Bangladesh • National Club Opens",
      description: "Master multi-device switching across 16 spectator camera feeds, dynamic zone shrinking clock telemetry, team kill scoreboards, and instant multi-angle replay triggers.",
      stats: "80+ Broadcast Matches",
      tools: "vMix 4K Switching • Dynamic Scoreboards • NDI Replay"
    },
    {
      id: "game-valorant",
      name: "RIOT GAMES VALORANT",
      publisher: "Riot Games",
      badge: "TACTICAL PC ESPORTS",
      badgeColor: "gold",
      icon: "⚡",
      role: "Live Graphics Operator & Technical Director",
      tournaments: "Valorant Challengers South Asia • Regional Invitational Cups",
      description: "Tactical spike plant countdown animations, economy charts, agent selection stingers, and high-framerate observer directing for regional circuit matches.",
      stats: "40+ Broadcast Matches",
      tools: "Live Stingers • Economy HUD • OBS Studio"
    },
    {
      id: "game-mlbb",
      name: "MOONTON MLBB",
      publisher: "Moonton",
      badge: "MOBILE MOBA",
      badgeColor: "cyan",
      icon: "🛡️",
      role: "Broadcast Producer & Overlay Engineer",
      tournaments: "Mobile Legends Regional Arena • Community Showdowns • Inter-College Cups",
      description: "Live hero draft pick/ban overlays, real-time team net worth gold bars, major monster objective alerts, and caster desk picture-in-picture coordination.",
      stats: "30+ Broadcast Matches",
      tools: "Draft Pick Overlays • Real-time Gold HUD • Clean Feeds"
    }
  ],

  // --------------------------------------------------------------------------
  // 2. WHERE I'VE PRODUCED (PRIMARY PORTFOLIO SHOWCASE)
  // Format: [TOURNAMENT NAME] UNDER [COMPANY/AGENCY]
  // --------------------------------------------------------------------------
  productions: [
    {
      id: "prod-ffws-fall-2026",
      title: "FFWS BD FALL 2026",
      agency: "UNDER ECUBE",
      role: "Assistant Producer & GT Title Designer",
      game: "Garena Free Fire",
      date: "Fall 2026",
      badgeText: "LIVE PRODUCTION",
      badgeDate: "FALL 2026",
      logo: "",
      location: "Dhaka, Bangladesh",
      venueType: "Official Regional Championship Arena",
      banner: "assets/images/event-lan-arena.jpg",
      liveLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      photos: [
        "assets/images/event-lan-arena.jpg",
        "assets/images/event-control-room.jpg",
        "assets/images/gallery-caster-desk.jpg",
        "assets/images/gallery-bts-crew.jpg"
      ],
      description: "Flagship Free Fire World Series Bangladesh regional finals. Engineered customized animated GT Title scoreboards, real-time team survival trackers, map overview overlays, and master vMix multi-view switching for stadium and online streams.",
      highlights: [
        "Custom vMix GT Title scoreboard and dynamic team elimination tickers",
        "Singular.live cloud graphics synchronization with tournament referee sheets",
        "Master vMix switching linking 12 player observer devices and caster desk cams",
        "Low-latency audio mixing for live stage PA and clean broadcast master"
      ]
    },
    {
      id: "prod-ffws-spring-2026",
      title: "FFWS BD SPRING 2026",
      agency: "UNDER ECUBE",
      role: "Assistant Producer & Live Graphics Designer",
      game: "Garena Free Fire",
      date: "Spring 2026",
      badgeText: "LIVE PRODUCTION",
      badgeDate: "SPRING 2026",
      logo: "",
      location: "Dhaka, Bangladesh",
      venueType: "National Esports Finals",
      banner: "assets/images/event-control-room.jpg",
      liveLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      photos: [
        "assets/images/event-control-room.jpg",
        "assets/images/gallery-bts-crew.jpg",
        "assets/images/gallery-rig-setup.jpg"
      ],
      description: "High-stakes Free Fire tournament broadcast. Designed custom lower thirds, starting soon countdowns, MVP post-match stat cards, and operated primary live production switcher in control room.",
      highlights: [
        "Live graphics automation using Singular.live and custom After Effects motion stingers",
        "vMix replay deck curation for instant round clutch highlights",
        "Dual OBS redundant backup encoding pipeline over fiber network"
      ]
    },
    {
      id: "prod-nova-force-2026",
      title: "NOVA FORCE CHAMPIONSHIP 2026",
      agency: "UNDER ECUBE",
      role: "GT Title & HUD Graphics Specialist",
      game: "Garena Free Fire",
      date: "June 2026",
      badgeText: "LIVE PRODUCTION",
      badgeDate: "JUNE 2026",
      logo: "",
      location: "Dhaka, Bangladesh",
      venueType: "Studio & Online Broadcast",
      banner: "assets/images/gallery-caster-desk.jpg",
      liveLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      photos: [
        "assets/images/gallery-caster-desk.jpg",
        "assets/images/event-lan-arena.jpg",
        "assets/images/gallery-rig-setup.jpg"
      ],
      description: "Complete in-game HUD and broadcast graphics redesign. Created custom player health bars, team standings overlays, sponsor lower thirds, and animated Booyah victory slates.",
      highlights: [
        "Developed custom vMix GT titles for team player frames and HP status",
        "Broadcast signal routing via NDI network to talent caster monitors",
        "Stream Deck XL macro integrations for zero-delay live transitions"
      ]
    },
    {
      id: "prod-valorant-south-asia",
      title: "VALORANT CHALLENGERS SOUTH ASIA",
      agency: "UNDER ECUBE",
      role: "Assistant Producer & vMix Operator",
      game: "Valorant 5v5",
      date: "January 2026",
      badgeText: "LIVE PRODUCTION",
      badgeDate: "JANUARY 2026",
      logo: "",
      location: "Dhaka, Bangladesh",
      venueType: "Hybrid Arena & Remote Studio",
      banner: "assets/images/gallery-bts-crew.jpg",
      liveLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      photos: [
        "assets/images/gallery-bts-crew.jpg",
        "assets/images/event-control-room.jpg",
        "assets/images/event-lan-arena.jpg"
      ],
      description: "Regional tactical shooter championship broadcast connecting remote international talent with central Dhaka production room over low-latency SRT caller pipelines.",
      highlights: [
        "6x Remote caster SRT feeds ingested and sync-locked with 128-tick observer feeds",
        "Singular.live live round scoreboard and agent pick/ban phase UI",
        "Dante IP audio matrix separating caster talkback from live stream"
      ]
    },
    {
      id: "prod-pubg-mobile-arena",
      title: "PUBG MOBILE PRO ARENA",
      agency: "UNDER ECUBE",
      role: "Live Production & Ingest Lead",
      game: "PUBG Mobile",
      date: "November 2025",
      badgeText: "LIVE PRODUCTION",
      badgeDate: "NOVEMBER 2025",
      logo: "",
      location: "Dhaka, Bangladesh",
      venueType: "Convention Arena LAN",
      banner: "assets/images/gallery-rig-setup.jpg",
      liveLink: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      photos: [
        "assets/images/gallery-rig-setup.jpg",
        "assets/images/gallery-caster-desk.jpg",
        "assets/images/event-control-room.jpg"
      ],
      description: "16-team stadium battle royale showdown with 64 synchronized player feeds, live stage caster desk, and arena LED displays.",
      highlights: [
        "Live player webcams switched via Blackmagic ATEM and vMix 4K",
        "Custom live graphics killfeed and match points calculations",
        "Arena speaker delay calibration and broadcast talkback comms"
      ]
    }
  ],

  // --------------------------------------------------------------------------
  // 3. BROADCAST VIDEO SHOWCASE
  // --------------------------------------------------------------------------
  videos: [
    {
      id: "vid-ffws-showreel",
      title: "FFWS BD Production & Live Switching Showreel",
      event: "FFWS BD FALL 2026 UNDER ECUBE",
      role: "Assistant Producer & GT Title Designer",
      duration: "03:20",
      thumbnail: "assets/images/event-lan-arena.jpg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
      description: "Showreel demonstrating live tournament camera cuts, instant GT Title animations, player eliminations, and hype stage moments."
    },
    {
      id: "vid-gt-title-demo",
      title: "vMix GT Title Designer & Graphics Automation Reel",
      event: "NOVA FORCE & FFWS Graphics Suite",
      role: "GT Title & Graphics Specialist",
      duration: "04:15",
      thumbnail: "assets/images/event-control-room.jpg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
      description: "Direct screen capture walkthrough showcasing responsive GT Title scoreboards, animated stingers, and live data controls in vMix."
    },
    {
      id: "vid-caster-desk-audio",
      title: "Caster Desk Audiovisuals & Control Room Comms",
      event: "Arena LAN Championships",
      role: "Assistant Producer",
      duration: "03:45",
      thumbnail: "assets/images/gallery-caster-desk.jpg",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
      description: "Behind-the-scenes PCR workflow: talent talkback, game audio balance, and Stream Deck macro execution under live tournament pressure."
    }
  ],

  // --------------------------------------------------------------------------
  // 4. SOCIAL & CONTACT INFORMATION (FULLY EDITABLE CHANNELS, ICONS & LOGOS)
  // --------------------------------------------------------------------------
  socialChannels: [
    { id: "soc-youtube", name: "YOUTUBE", url: "https://youtube.com", icon: "▶️", logo: "" },
    { id: "soc-facebook", name: "FACEBOOK", url: "https://facebook.com", icon: "🌐", logo: "" },
    { id: "soc-instagram", name: "INSTAGRAM", url: "https://instagram.com", icon: "📸", logo: "" },
    { id: "soc-discord", name: "DISCORD", url: "https://discord.com", icon: "🎧", logo: "" },
    { id: "soc-linkedin", name: "LINKEDIN", url: "https://linkedin.com", icon: "💼", logo: "" }
  ],

  contactMethods: [
    { id: "cm-email", label: "DIRECT EMAIL", value: "gunshot.broadcast@gmail.com", link: "mailto:gunshot.broadcast@gmail.com", icon: "✉️", logo: "" },
    { id: "cm-phone", label: "PHONE / WHATSAPP", value: "+880 1700-000000", link: "tel:+8801700000000", icon: "📞", logo: "" },
    { id: "cm-location", label: "BROADCAST BASE", value: "Dhaka, Bangladesh", link: "", icon: "📍", logo: "" },
    { id: "cm-discord", label: "DISCORD COMMS HANDLE", value: "gunshot#0001", link: "https://discord.com", icon: "🎧", logo: "" }
  ],

  contactFormConfig: {
    formTitle: "DIRECT BROADCAST DISPATCH",
    nameLabel: "YOUR FULL NAME *",
    namePlaceholder: "e.g. Alex Morgan",
    emailLabel: "EMAIL ADDRESS *",
    emailPlaceholder: "name@organization.com",
    subjectLabel: "SUBJECT / PROJECT TYPE *",
    subjectOptions: [
      "Tournament Broadcast Production",
      "vMix GT Title Design Project",
      "Live Graphics & Overlays (Singular.live)",
      "General Broadcast Collaboration"
    ],
    messageLabel: "MESSAGE DETAILS *",
    messagePlaceholder: "Describe tournament scope, dates, or broadcast requirements...",
    submitBtnText: "SEND TRANSMISSION DISPATCH ➔"
  },

  // --------------------------------------------------------------------------
  // 6. VIEWER COMMENTS & SUGGESTIONS HUB
  // --------------------------------------------------------------------------
  suggestions: [
    {
      id: "sug-1",
      author: "ApexCaster_BD",
      role: "Official Tournament Caster",
      category: "suggestion",
      categoryLabel: "💡 Broadcast Suggestion",
      rating: 5,
      date: "October 2026",
      message: "The team survival tickers and elimination banners at FFWS BD regional finals were blazing fast! For next season, would love to see an automated head-to-head radar chart during 1v1 clutches.",
      hypes: 18,
      reply: "Great call! Already prototyping the automated radar GT stinger in vMix for the upcoming championship finals."
    },
    {
      id: "sug-2",
      author: "Tariq_vMixOps",
      role: "Esports Technical Director",
      category: "feedback",
      categoryLabel: "🎨 GT Title Feedback",
      rating: 5,
      date: "September 2026",
      message: "Cleanest GT Title lower thirds in the South Asia regional circuit. The animated kill counter never desynced once during 6 straight hours of Swiss stage switching. Outstanding execution.",
      hypes: 24,
      reply: "Appreciate the feedback Tariq! Keeping latency rock-solid is always top priority."
    },
    {
      id: "sug-3",
      author: "GamerPulse_Dhaka",
      role: "Broadcast Viewer",
      category: "idea",
      categoryLabel: "🏆 Tournament Idea",
      rating: 5,
      date: "August 2026",
      message: "The stadium arena audio mix was crisp and hype. Please keep the player facecam reaction picture-in-picture during map overtime, it made the stream ten times more intense!",
      hypes: 12,
      reply: ""
    },
    {
      id: "sug-4",
      author: "NovaEsports_BD",
      role: "Team Captain",
      category: "shoutout",
      categoryLabel: "🔥 Shoutout & Praise",
      rating: 5,
      date: "July 2026",
      message: "Production quality felt like an international tier-1 major. Massive respect to GUNSHOT and the whole control room broadcast crew.",
      hypes: 31,
      reply: "Thank you for the hype and great matches!"
    }
  ],

  socialLinks: {
    email: "gunshot.broadcast@gmail.com",
    linkedin: "https://linkedin.com",
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    discord: "https://discord.com"
  }
};

// Export for module environments and attach to global window
if (typeof window !== "undefined") {
  window.portfolioData = portfolioData;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = portfolioData;
}
