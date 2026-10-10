/**
 * ============================================================================
 * GUNSHOT ESPORTS BROADCAST PORTFOLIO - CORE APPLICATION ENGINE
 * ============================================================================
 * Features:
 * - Dynamic rendering powered by GFF Latin font
 * - "WHERE I'VE PRODUCED" primary portfolio interface (e.g. FFWS BD FALL 2026 UNDER ECUBE)
 * - Concise About Me (Assistant Producer at ECUBE, GT Title Designer, Live Graphics, vMix/OBS)
 * - Interactive Client-Side Upload & Edit Bars for EVERY segment (Hero, About, Productions, Videos)
 * - Persistent storage via localStorage (instantly persists all your uploads and edits)
 * - Real-time broadcast timecode clock (BST HH:MM:SS:FF)
 * ============================================================================
 */

(function () {
  'use strict';

  // --------------------------------------------------------------------------
  // STATE & LOCAL STORAGE PERSISTENCE
  // --------------------------------------------------------------------------
  const STORAGE_KEY = 'gunshot_portfolio_custom_data_v2';

  const FONT_OPTIONS = [
    { name: 'GFF Latin Black (Official Free Fire)', value: "'GFF Latin Black', 'GFF Latin', sans-serif" },
    { name: 'GFF Latin Bold (Official Title)', value: "'GFF Latin', sans-serif" },
    { name: 'GFF Latin Medium (Official Subtitle)', value: "'GFF Latin', sans-serif" },
    { name: 'GFF Latin Condensed (Esports Cut)', value: "'GFF Latin Condensed', 'GFF Latin', sans-serif" },
    { name: 'Orbitron (Esports Cyber HUD)', value: "'Orbitron', sans-serif" },
    { name: 'Rajdhani (Tactical Condensed)', value: "'Rajdhani', sans-serif" },
    { name: 'Teko (Tournament Impact Display)', value: "'Teko', sans-serif" },
    { name: 'Chakra Petch (Combat Cybernetic)', value: "'Chakra Petch', sans-serif" },
    { name: 'Russo One (Heavy Impact)', value: "'Russo One', sans-serif" },
    { name: 'Bebas Neue (Bold Headline)', value: "'Bebas Neue', sans-serif" },
    { name: 'Oxanium (Esports HUD Telemetry)', value: "'Oxanium', sans-serif" },
    { name: 'Exo 2 (Futuristic Tactical)', value: "'Exo 2', sans-serif" },
    { name: 'Inter (Clean Pro Broadcast)', value: "'Inter', sans-serif" },
    { name: 'Space Grotesk (Tech Gaming)', value: "'Space Grotesk', sans-serif" },
    { name: 'Montserrat (Geometric Impact)', value: "'Montserrat', sans-serif" },
    { name: 'Poppins (Modern Sleek)', value: "'Poppins', sans-serif" },
    { name: 'Syne (Avant-Garde Futuristic)', value: "'Syne', sans-serif" },
    { name: 'JetBrains Mono (Telemetry Code)', value: "'JetBrains Mono', monospace" }
  ];

  function getInitialState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // 1. Ensure sectionHeaders exist and all keys are populated
        if (!parsed.sectionHeaders && window.portfolioData && window.portfolioData.sectionHeaders) {
          parsed.sectionHeaders = JSON.parse(JSON.stringify(window.portfolioData.sectionHeaders));
        } else if (parsed.sectionHeaders && window.portfolioData && window.portfolioData.sectionHeaders) {
          parsed.sectionHeaders = Object.assign({}, window.portfolioData.sectionHeaders, parsed.sectionHeaders);
        }

        // Clean any stale ECUBE from hero header / status pill
        if (parsed.sectionHeaders && parsed.sectionHeaders.hero) {
          if (parsed.sectionHeaders.hero.companyBadge) {
            delete parsed.sectionHeaders.hero.companyBadge;
          }
          if (parsed.sectionHeaders.hero.statusPill && parsed.sectionHeaders.hero.statusPill.includes('ECUBE')) {
            parsed.sectionHeaders.hero.statusPill = 'STATUS: ON AIR // LIVE BROADCAST';
          }
          if (!parsed.sectionHeaders.hero.companyLogo) {
            parsed.sectionHeaders.hero.companyLogo = 'assets/images/ecube-logo.png';
          }
        }

        // Clean any stale ECUBE text from about header / personalInfo
        if (parsed.sectionHeaders && parsed.sectionHeaders.about) {
          if (parsed.sectionHeaders.about.title && typeof parsed.sectionHeaders.about.title === 'string') {
            parsed.sectionHeaders.about.title = parsed.sectionHeaders.about.title.replace(/\s+ECUBE$/i, '').trim();
          }
          if (!parsed.sectionHeaders.about.logo) {
            parsed.sectionHeaders.about.logo = 'assets/images/ecube-logo.png';
          }
          if (parsed.sectionHeaders.about.showLogo === undefined) {
            parsed.sectionHeaders.about.showLogo = true;
          }
        }
        if (parsed.personalInfo && parsed.personalInfo.aboutHeading && typeof parsed.personalInfo.aboutHeading === 'string') {
          parsed.personalInfo.aboutHeading = parsed.personalInfo.aboutHeading.replace(/\s+ECUBE$/i, '').trim();
        }

        // 2. Ensure corePillars have id, icon, logo
        if (parsed.personalInfo) {
          if (!parsed.personalInfo.corePillars || !Array.isArray(parsed.personalInfo.corePillars) || parsed.personalInfo.corePillars.length === 0) {
            parsed.personalInfo.corePillars = JSON.parse(JSON.stringify(window.portfolioData.personalInfo.corePillars));
          } else {
            parsed.personalInfo.corePillars.forEach((p, idx) => {
              if (!p.id) p.id = `pillar-${idx + 1}`;
              if (!p.icon) p.icon = '⚡';
              if (p.logo === undefined) p.logo = '';
            });
          }
          if (!parsed.personalInfo.primaryTools) {
            parsed.personalInfo.primaryTools = (window.portfolioData && window.portfolioData.personalInfo && window.portfolioData.personalInfo.primaryTools) || 'vMix • OBS • GT Titles';
          }
        }

        // 3. Ensure socialChannels exist
        if (!parsed.socialChannels || !Array.isArray(parsed.socialChannels) || parsed.socialChannels.length === 0) {
          parsed.socialChannels = JSON.parse(JSON.stringify(window.portfolioData.socialChannels || []));
        } else {
          parsed.socialChannels.forEach((s, idx) => {
            if (!s.id) s.id = `soc-${idx + 1}`;
            if (!s.icon) s.icon = '🌐';
            if (s.logo === undefined) s.logo = '';
          });
        }

        // 4. Ensure productions have photos array, badgeText, badgeDate, logo
        if (parsed && parsed.productions && window.portfolioData && window.portfolioData.productions) {
          parsed.productions.forEach(prod => {
            if (!prod.photos || !Array.isArray(prod.photos) || prod.photos.length === 0) {
              const defaultMatch = window.portfolioData.productions.find(p => p.id === prod.id || p.title === prod.title);
              if (defaultMatch && defaultMatch.photos && defaultMatch.photos.length) {
                prod.photos = [...defaultMatch.photos];
              } else if (!prod.photos) {
                prod.photos = [];
              }
            }
            if (!prod.badgeText) prod.badgeText = "LIVE PRODUCTION";
            if (prod.badgeDate === undefined) prod.badgeDate = prod.date || "2026";
            if (prod.logo === undefined) prod.logo = "";
            if (!prod.liveLink) {
              const defaultMatch = window.portfolioData.productions.find(p => p.id === prod.id || p.title === prod.title);
              prod.liveLink = (defaultMatch && defaultMatch.liveLink) || prod.videoUrl || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
            }
          });
        }

        // 5. Ensure contactMethods exist
        if (!parsed.contactMethods || !Array.isArray(parsed.contactMethods) || parsed.contactMethods.length === 0) {
          parsed.contactMethods = JSON.parse(JSON.stringify(window.portfolioData.contactMethods || []));
        } else {
          parsed.contactMethods.forEach((m, idx) => {
            if (!m.id) m.id = `cm-${idx + 1}`;
            if (!m.icon) m.icon = '✉️';
            if (m.logo === undefined) m.logo = '';
          });
        }

        // 6. Ensure contactFormConfig exists
        if (!parsed.contactFormConfig && window.portfolioData && window.portfolioData.contactFormConfig) {
          parsed.contactFormConfig = JSON.parse(JSON.stringify(window.portfolioData.contactFormConfig));
        } else if (parsed.contactFormConfig && window.portfolioData && window.portfolioData.contactFormConfig) {
          parsed.contactFormConfig = Object.assign({}, window.portfolioData.contactFormConfig, parsed.contactFormConfig);
        }

        // 7. Ensure videos exist
        if (!parsed.videos || !Array.isArray(parsed.videos) || parsed.videos.length === 0) {
          if (window.portfolioData && window.portfolioData.videos) {
            parsed.videos = JSON.parse(JSON.stringify(window.portfolioData.videos));
          } else {
            parsed.videos = [];
          }
        }

        // 8. Ensure metricCards and eventStats exist
        if (!parsed.metricCards || !Array.isArray(parsed.metricCards) || parsed.metricCards.length === 0) {
          if (window.portfolioData && window.portfolioData.metricCards) {
            parsed.metricCards = JSON.parse(JSON.stringify(window.portfolioData.metricCards));
          } else {
            parsed.metricCards = [];
          }
        }
        // If parsed.eventStats had saved custom values, migrate them into metricCards
        if (parsed.eventStats && parsed.metricCards && parsed.metricCards.length >= 3) {
          if (parsed.eventStats.officialCount) parsed.metricCards[0].count = parsed.eventStats.officialCount;
          if (parsed.eventStats.officialLabel) parsed.metricCards[0].label = parsed.eventStats.officialLabel;
          if (parsed.eventStats.officialBadge) parsed.metricCards[0].badge = parsed.eventStats.officialBadge;
          if (parsed.eventStats.officialPing) parsed.metricCards[0].ping = parsed.eventStats.officialPing;
          if (parsed.eventStats.officialDesc) parsed.metricCards[0].description = parsed.eventStats.officialDesc;
          if (parsed.eventStats.officialFooterTag) parsed.metricCards[0].footerTag = parsed.eventStats.officialFooterTag;
          if (parsed.eventStats.officialFooterIcon) parsed.metricCards[0].footerIcon = parsed.eventStats.officialFooterIcon;

          if (parsed.eventStats.localCount) parsed.metricCards[1].count = parsed.eventStats.localCount;
          if (parsed.eventStats.localLabel) parsed.metricCards[1].label = parsed.eventStats.localLabel;
          if (parsed.eventStats.localBadge) parsed.metricCards[1].badge = parsed.eventStats.localBadge;
          if (parsed.eventStats.localPing) parsed.metricCards[1].ping = parsed.eventStats.localPing;
          if (parsed.eventStats.localDesc) parsed.metricCards[1].description = parsed.eventStats.localDesc;
          if (parsed.eventStats.localFooterTag) parsed.metricCards[1].footerTag = parsed.eventStats.localFooterTag;
          if (parsed.eventStats.localFooterIcon) parsed.metricCards[1].footerIcon = parsed.eventStats.localFooterIcon;

          if (parsed.eventStats.unofficialCount) parsed.metricCards[2].count = parsed.eventStats.unofficialCount;
          if (parsed.eventStats.unofficialLabel) parsed.metricCards[2].label = parsed.eventStats.unofficialLabel;
          if (parsed.eventStats.unofficialBadge) parsed.metricCards[2].badge = parsed.eventStats.unofficialBadge;
          if (parsed.eventStats.unofficialPing) parsed.metricCards[2].ping = parsed.eventStats.unofficialPing;
          if (parsed.eventStats.unofficialDesc) parsed.metricCards[2].description = parsed.eventStats.unofficialDesc;
          if (parsed.eventStats.unofficialFooterTag) parsed.metricCards[2].footerTag = parsed.eventStats.unofficialFooterTag;
          if (parsed.eventStats.unofficialFooterIcon) parsed.metricCards[2].footerIcon = parsed.eventStats.unofficialFooterIcon;
        }

        if (!parsed.eventStats && window.portfolioData && window.portfolioData.eventStats) {
          parsed.eventStats = JSON.parse(JSON.stringify(window.portfolioData.eventStats));
        } else if (parsed.eventStats && window.portfolioData && window.portfolioData.eventStats) {
          parsed.eventStats = Object.assign({}, window.portfolioData.eventStats, parsed.eventStats);
        }

        // 9. Ensure suggestions exist
        if (!parsed.suggestions || !Array.isArray(parsed.suggestions) || parsed.suggestions.length === 0) {
          if (window.portfolioData && window.portfolioData.suggestions) {
            parsed.suggestions = JSON.parse(JSON.stringify(window.portfolioData.suggestions));
          } else {
            parsed.suggestions = [];
          }
        }

        // 10. Ensure workedGames exist
        if (!parsed.workedGames || !Array.isArray(parsed.workedGames) || parsed.workedGames.length === 0) {
          if (window.portfolioData && window.portfolioData.workedGames) {
            parsed.workedGames = JSON.parse(JSON.stringify(window.portfolioData.workedGames));
          } else {
            parsed.workedGames = [];
          }
        }

        // 11. Ensure sectionHeaders.metrics and gamesWorked exist
        if (parsed.sectionHeaders) {
          if (!parsed.sectionHeaders.metrics && window.portfolioData && window.portfolioData.sectionHeaders && window.portfolioData.sectionHeaders.metrics) {
            parsed.sectionHeaders.metrics = JSON.parse(JSON.stringify(window.portfolioData.sectionHeaders.metrics));
          }
          if (!parsed.sectionHeaders.gamesWorked && window.portfolioData && window.portfolioData.sectionHeaders && window.portfolioData.sectionHeaders.gamesWorked) {
            parsed.sectionHeaders.gamesWorked = JSON.parse(JSON.stringify(window.portfolioData.sectionHeaders.gamesWorked));
          }
        }

        return parsed;
      } catch (e) {
        console.warn('Failed to parse saved state, using default portfolioData', e);
      }
    }
    return JSON.parse(JSON.stringify(window.portfolioData));
  }

  const appState = getInitialState();

  // --------------------------------------------------------------------------
  // AUDIO INTERFACE (SILENT / NO-OP FOR DARK ESPORTS THEME)
  // --------------------------------------------------------------------------
  const PaperAudio = {
    isEnabled: () => false,
    toggle: () => false,
    playPaperRustle: () => {},
    playPaperRip: () => {},
    playPaperPageFlip: () => {},
    playPaperStamp: () => {}
  };

  // --------------------------------------------------------------------------
  // INDEXEDDB VIDEO STORAGE ENGINE (SUPPORTS BULK HD / 4K LOCAL VIDEO FILES)
  // --------------------------------------------------------------------------
  const VideoStorage = (function () {
    const DB_NAME = 'GunshotEsportsVideoDB';
    const DB_VERSION = 1;
    const STORE_NAME = 'broadcast_videos';
    let dbPromise = null;
    const objectUrlMap = new Map();

    function openDatabase() {
      if (!dbPromise) {
        dbPromise = new Promise((resolve) => {
          if (!window.indexedDB) {
            console.warn('IndexedDB not supported in this browser context');
            return resolve(null);
          }
          const request = window.indexedDB.open(DB_NAME, DB_VERSION);
          request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
          };
          request.onsuccess = (e) => resolve(e.target.result);
          request.onerror = (e) => {
            console.error('Failed to open IndexedDB:', e.target.error);
            resolve(null);
          };
        });
      }
      return dbPromise;
    }

    return {
      async saveVideo(id, fileOrBlob, meta = {}) {
        const db = await openDatabase();
        if (!db) return null;

        return new Promise((resolve, reject) => {
          try {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const record = {
              id: id,
              blob: fileOrBlob,
              name: fileOrBlob.name || meta.name || 'broadcast_video.mp4',
              type: fileOrBlob.type || 'video/mp4',
              size: fileOrBlob.size || 0,
              createdAt: Date.now()
            };
            const req = store.put(record);
            req.onsuccess = () => {
              if (objectUrlMap.has(id)) {
                URL.revokeObjectURL(objectUrlMap.get(id));
                objectUrlMap.delete(id);
              }
              const newUrl = URL.createObjectURL(fileOrBlob);
              objectUrlMap.set(id, newUrl);
              resolve({ record, objectUrl: newUrl });
            };
            req.onerror = (e) => reject(e.target.error);
          } catch (err) {
            reject(err);
          }
        });
      },

      async getVideoBlob(id) {
        const db = await openDatabase();
        if (!db) return null;

        return new Promise((resolve) => {
          try {
            const tx = db.transaction(STORE_NAME, 'readonly');
            const store = tx.objectStore(STORE_NAME);
            const req = store.get(id);
            req.onsuccess = () => resolve(req.result ? req.result.blob : null);
            req.onerror = () => resolve(null);
          } catch (err) {
            resolve(null);
          }
        });
      },

      async getVideoUrl(id) {
        if (objectUrlMap.has(id)) {
          return objectUrlMap.get(id);
        }
        const blob = await this.getVideoBlob(id);
        if (blob) {
          const url = URL.createObjectURL(blob);
          objectUrlMap.set(id, url);
          return url;
        }
        return null;
      },

      async deleteVideo(id) {
        const db = await openDatabase();
        if (objectUrlMap.has(id)) {
          URL.revokeObjectURL(objectUrlMap.get(id));
          objectUrlMap.delete(id);
        }
        if (!db) return false;

        return new Promise((resolve) => {
          try {
            const tx = db.transaction(STORE_NAME, 'readwrite');
            const store = tx.objectStore(STORE_NAME);
            const req = store.delete(id);
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(false);
          } catch (err) {
            resolve(false);
          }
        });
      }
    };
  })();

  // Helper: Format raw video filename into clean title
  function formatVideoTitle(filename) {
    if (!filename) return 'Broadcast Reel';
    return filename
      .replace(/\.[^/.]+$/, '')          // remove file extension
      .replace(/[-_]+/g, ' ')           // replace underscores & dashes with spaces
      .replace(/\s+/g, ' ')             // collapse spaces
      .trim();
  }

  // Helper: Extract video thumbnail frame and duration via offscreen canvas
  function extractVideoMetadataAndFrame(fileOrBlob) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const tempUrl = URL.createObjectURL(fileOrBlob);
      video.src = tempUrl;
      video.muted = true;
      video.playsInline = true;
      video.preload = 'metadata';

      let durationStr = '00:00';
      const timeout = setTimeout(() => {
        URL.revokeObjectURL(tempUrl);
        resolve({
          duration: '03:30',
          thumbnail: 'assets/images/event-control-room.jpg'
        });
      }, 7000);

      video.onloadedmetadata = () => {
        if (video.duration && !isNaN(video.duration)) {
          const mins = Math.floor(video.duration / 60);
          const secs = Math.floor(video.duration % 60);
          durationStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
        const seekTarget = video.duration > 2 ? Math.min(1.5, video.duration / 2) : 0.1;
        video.currentTime = seekTarget;
      };

      video.onseeked = () => {
        clearTimeout(timeout);
        let thumbUrl = 'assets/images/event-control-room.jpg';
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          thumbUrl = canvas.toDataURL('image/jpeg', 0.88);
        } catch (e) {
          console.warn('Canvas frame capture fallback', e);
        }
        URL.revokeObjectURL(tempUrl);
        resolve({
          duration: durationStr,
          thumbnail: thumbUrl
        });
      };

      video.onerror = () => {
        clearTimeout(timeout);
        URL.revokeObjectURL(tempUrl);
        resolve({
          duration: '00:00',
          thumbnail: 'assets/images/event-control-room.jpg'
        });
      };
    });
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      PaperAudio.playPaperStamp();
    } catch (e) {
      console.warn('Could not save to localStorage (quota or private mode)', e);
    }
  }

  // --------------------------------------------------------------------------
  // DOM ELEMENT REFERENCES
  // --------------------------------------------------------------------------
  const elements = {
    navbar: document.getElementById('mainNavbar'),
    mobileToggle: document.getElementById('mobileToggle'),
    navMenu: document.getElementById('navMenu'),
    navLinks: document.querySelectorAll('.nav-link'),
    broadcastClock: document.getElementById('broadcastClock'),
    headerTimecode: document.getElementById('headerTimecode'),
    paperAudioToggleBtn: document.getElementById('paperAudioToggleBtn'),

    // Hero Segment Elements
    heroProfileImage: document.getElementById('heroProfileImage'),
    heroPhotoInput: document.getElementById('heroPhotoInput'),
    heroMetadata: document.getElementById('heroMetadata'),
    heroTagline: document.getElementById('heroTagline'),
    heroIntro: document.getElementById('heroIntro'),

    // About Segment Elements
    aboutProfileImage: document.getElementById('aboutProfileImage'),
    aboutPhotoInput: document.getElementById('aboutPhotoInput'),
    aboutStatement: document.getElementById('aboutStatement'),
    pillarsGrid: document.getElementById('pillarsGrid'),

    // Where I've Produced (Portfolio)
    productionsGrid: document.getElementById('productionsGrid'),

    // Video Showcase & Bulk Upload Toolbar
    videosGrid: document.getElementById('videosGrid'),
    bulkVideoInput: document.getElementById('bulkVideoInput'),
    singleVideoInput: document.getElementById('singleVideoInput'),
    videoUploadProgressWrap: document.getElementById('videoUploadProgressWrap'),
    videoUploadProgressBar: document.getElementById('videoUploadProgressBar'),
    videoUploadProgressPercent: document.getElementById('videoUploadProgressPercent'),
    videoUploadProgressTitle: document.getElementById('videoUploadProgressTitle'),
    videoUploadProgressSub: document.getElementById('videoUploadProgressSub'),

    // Hero Floating Badge Card
    heroFloatingBadge: document.getElementById('heroFloatingBadge'),
    heroBadgeLogoBox: document.getElementById('heroBadgeLogoBox'),
    heroBadgeRole: document.getElementById('heroBadgeRole'),
    heroBadgeSub: document.getElementById('heroBadgeSub'),
    heroLoginBadgeBtn: document.getElementById('heroLoginBadgeBtn'),

    // Broadcast Login & Viewer Intro Overlay
    broadcastLoginOverlay: document.getElementById('broadcastLoginOverlay'),
    loginScannerAvatar: document.getElementById('loginScannerAvatar'),
    loginOpTitle: document.getElementById('loginOpTitle'),
    loginOpSub: document.getElementById('loginOpSub'),
    loginScannerHudText: document.getElementById('loginScannerHudText'),
    loginPercentLabel: document.getElementById('loginPercentLabel'),
    loginProgressFill: document.getElementById('loginProgressFill'),
    loginDiagBox: document.getElementById('loginDiagBox'),
    loginAccessBanner: document.getElementById('loginAccessBanner'),
    loginEnterHomeBtn: document.getElementById('loginEnterHomeBtn'),
    loginAudioToggleBtn: document.getElementById('loginAudioToggleBtn'),
    loginAudioIcon: document.getElementById('loginAudioIcon'),
    loginSkipBtn: document.getElementById('loginSkipBtn'),

    // Contact & Socials
    contactMethods: document.getElementById('contactMethods'),
    socialLinksRow: document.getElementById('socialLinksRow'),
    footerSocials: document.getElementById('footerSocials'),
    contactForm: document.getElementById('contactForm'),

    // Modals
    videoModal: document.getElementById('videoModal'),
    videoModalContainer: document.getElementById('videoModalContainer'),
    editModal: document.getElementById('editModal'),
    editModalBody: document.getElementById('editModalBody'),

    // Photo Lightbox Modal
    photoLightboxModal: document.getElementById('photoLightboxModal'),
    lightboxPhotoImg: document.getElementById('lightboxPhotoImg'),
    lightboxPhotoCaption: document.getElementById('lightboxPhotoCaption'),
    lightboxPhotoSub: document.getElementById('lightboxPhotoSub'),
    lightboxPhotoCounter: document.getElementById('lightboxPhotoCounter'),
    prevLightboxPhotoBtn: document.getElementById('prevLightboxPhotoBtn'),
    nextLightboxPhotoBtn: document.getElementById('nextLightboxPhotoBtn'),

  };

  // Setup Paper Sound Toggle Button
  function setupPaperAudioToggle() {
    const btn = elements.paperAudioToggleBtn;
    if (!btn) return;

    const updateUI = (enabled) => {
      if (enabled) {
        btn.classList.remove('muted');
        btn.innerHTML = `<span>📄 SOUND: ON</span>`;
        btn.title = "Paper sound effects enabled (Click to mute)";
      } else {
        btn.classList.add('muted');
        btn.innerHTML = `<span>🔇 SOUND: OFF</span>`;
        btn.title = "Paper sound effects muted (Click to enable)";
      }
    };

    updateUI(PaperAudio.isEnabled());

    btn.addEventListener('click', () => {
      const isNowEnabled = PaperAudio.toggle();
      updateUI(isNowEnabled);
    });
  }

  // --------------------------------------------------------------------------
  // LEAD PRODUCER / OWNER ADMIN AUTHENTICATION & ACCESS CONTROL
  // --------------------------------------------------------------------------
  const STORAGE_KEY_ADMIN_AUTH = 'gunshot_pcr_admin_authenticated';
  const STORAGE_KEY_ADMIN_PASS = 'gunshot_pcr_admin_passcode';
  const DEFAULT_ADMIN_PASS = 'gunshot';

  const AdminAuthManager = {
    isAuthenticated: false,
    isEditModeActive: false,

    init() {
      // Check stored session
      this.isAuthenticated = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
      this.applyAuthState();

      // Discrete owner access triggers:
      // 1. Header timecode secret click
      document.getElementById('headerTimecode')?.addEventListener('click', () => {
        if (this.isAuthenticated) {
          this.toggleEditMode();
        } else {
          this.openModal();
        }
      });

      // 2. Footer broadcast clock secret click
      document.getElementById('broadcastClock')?.addEventListener('click', () => {
        if (this.isAuthenticated) {
          this.toggleEditMode();
        } else {
          this.openModal();
        }
      });

      // 3. URL Hash check (e.g. #admin)
      const checkAdminHash = () => {
        if (window.location.hash.toLowerCase() === '#admin') {
          if (!this.isAuthenticated) {
            this.openModal();
          } else {
            showBroadcastToast('👑 Lead Producer Admin Session is already active.');
          }
        }
      };
      checkAdminHash();
      window.addEventListener('hashchange', checkAdminHash);

      // Admin mode toggle button in navbar
      document.getElementById('adminModeToggleBtn')?.addEventListener('click', () => {
        this.toggleEditMode();
      });

      // Admin logout button in navbar
      document.getElementById('adminLogoutBtn')?.addEventListener('click', () => {
        this.logout();
      });

      // Modal close & cancel buttons
      document.getElementById('closeAdminAuthModalBtn')?.addEventListener('click', () => {
        this.closeModal();
      });

      document.getElementById('cancelAdminAuthBtn')?.addEventListener('click', () => {
        this.closeModal();
      });

      // Toggle password visibility
      document.getElementById('toggleAdminPassVisibilityBtn')?.addEventListener('click', () => {
        const passInput = document.getElementById('adminPasscode');
        if (passInput) {
          passInput.type = passInput.type === 'password' ? 'text' : 'password';
        }
      });

      // Form submit
      document.getElementById('adminAuthForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const passInput = document.getElementById('adminPasscode');
        const rememberCheckbox = document.getElementById('adminRememberMeCheckbox');
        const pass = passInput ? passInput.value.trim() : '';
        const remember = rememberCheckbox ? rememberCheckbox.checked : true;
        this.login(pass, remember);
      });

      // Keyboard shortcut Ctrl + Shift + A to open Admin modal / toggle edit mode
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
          e.preventDefault();
          if (this.isAuthenticated) {
            this.toggleEditMode();
          } else {
            this.openModal();
          }
        }
        if (e.key === 'Escape') {
          const authModal = document.getElementById('adminAuthModal');
          if (authModal && authModal.style.display !== 'none') {
            this.closeModal();
          }
        }
      });

      // Capturing click listener to block viewers from triggering any edit actions silently
      document.addEventListener('click', (e) => {
        const editTrigger = e.target.closest(
          '.toolbar-btn, .section-header-edit-btn, .metric-quick-edit-btn, .hero-chip-edit-btn, ' +
          '.hero-badge-edit-btn, .card-action-btn, .sug-reply-btn, .sug-del-btn, .prod-photo-add-tile, ' +
          '#navFontStudioBtn, #navLiveEditToggleBtn, #bulkPasteUrlsBtn, #addNewMetricCardDirectBtn, ' +
          '#editAllMetricsDirectBtn, #addNewGameHeaderBtn, #manageGamesBtn, #addNewProductionBtn, ' +
          '#dockLiveEditBtn, #dockFontStudioBtn, #dockGlowStudioBtn, #dockResetFontsBtn, #floatingHudDock button, ' +
          '[data-edit-action], [data-edit-modal], [data-admin-only]'
        );
        if (editTrigger && !this.isAuthenticated) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
        }
      }, true);
    },

    openModal() {
      const modal = document.getElementById('adminAuthModal');
      const passInput = document.getElementById('adminPasscode');
      const errEl = document.getElementById('adminAuthError');
      if (errEl) errEl.style.display = 'none';
      if (passInput) {
        passInput.value = '';
        passInput.type = 'password';
      }
      if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        setTimeout(() => passInput?.focus(), 120);
      }
    },

    closeModal() {
      const modal = document.getElementById('adminAuthModal');
      if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
      }
    },

    login(inputPass, remember = true) {
      const savedPass = localStorage.getItem(STORAGE_KEY_ADMIN_PASS) || DEFAULT_ADMIN_PASS;
      const errEl = document.getElementById('adminAuthError');

      if (inputPass === savedPass || inputPass === DEFAULT_ADMIN_PASS) {
        this.isAuthenticated = true;
        if (remember) {
          localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
        } else {
          sessionStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
        }
        this.applyAuthState();
        this.setEditMode(true);
        this.closeModal();

        showBroadcastToast('👑 PRODUCER ACCESS GRANTED: Lead Producer Admin Mode Enabled! Edit controls are now active.');
        if (typeof PaperAudio !== 'undefined') PaperAudio.playPaperStamp?.();
        try { renderSuggestions(); } catch (e) {}
      } else {
        if (errEl) {
          errEl.textContent = '❌ Invalid passcode. Access denied.';
          errEl.style.display = 'block';
        }
        if (typeof PaperAudio !== 'undefined') PaperAudio.playPaperCrumple?.();
      }
    },

    logout() {
      this.isAuthenticated = false;
      this.isEditModeActive = false;
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
      sessionStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
      this.applyAuthState();

      if (typeof LiveEditManager !== 'undefined' && LiveEditManager.isActive) {
        LiveEditManager.deactivate();
      }

      showBroadcastToast('🔒 LOGGED OUT: Switched to Viewer Presentation Mode.');
      if (typeof PaperAudio !== 'undefined') PaperAudio.playPaperFold?.();
      try { renderSuggestions(); } catch (e) {}
    },

    toggleEditMode() {
      if (!this.isAuthenticated) {
        this.openModal();
        return;
      }
      this.setEditMode(!this.isEditModeActive);
    },

    setEditMode(active) {
      this.isEditModeActive = active;
      const toggleLabel = document.getElementById('adminModeToggleLabel');
      const toggleBtn = document.getElementById('adminModeToggleBtn');

      if (active) {
        document.body.classList.add('admin-edit-active');
        if (toggleLabel) toggleLabel.textContent = '✏️ EDIT: ON';
        if (toggleBtn) toggleBtn.classList.add('active');
        showBroadcastToast('✏️ EDIT MODE ON: All editing bars, toolbars, and controls are now accessible.');
      } else {
        document.body.classList.remove('admin-edit-active');
        if (toggleLabel) toggleLabel.textContent = '✏️ EDIT: OFF';
        if (toggleBtn) toggleBtn.classList.remove('active');
        if (typeof LiveEditManager !== 'undefined' && LiveEditManager.isActive) {
          LiveEditManager.deactivate();
        }
        showBroadcastToast('👁️ CLEAN VIEW: Viewing site in clean presentation mode without edit clutter.');
      }
    },

    applyAuthState() {
      const adminSessionPill = document.getElementById('adminSessionPill');
      const navLoginBtn = document.getElementById('navAdminLoginBtn');
      const footerLoginBtn = document.getElementById('footerAdminAuthBtn');

      if (this.isAuthenticated) {
        document.body.classList.add('admin-authenticated');
        if (adminSessionPill) adminSessionPill.style.display = 'inline-flex';
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        if (footerLoginBtn) footerLoginBtn.style.display = 'none';
      } else {
        document.body.classList.remove('admin-authenticated', 'admin-edit-active');
        if (adminSessionPill) adminSessionPill.style.display = 'none';
        if (navLoginBtn) navLoginBtn.style.display = 'none';
        if (footerLoginBtn) footerLoginBtn.style.display = 'none';
      }
    }
  };

  function requireAdminAuth() {
    if (AdminAuthManager && AdminAuthManager.isAuthenticated) {
      return true;
    }
    if (AdminAuthManager) AdminAuthManager.openModal();
    return false;
  }

  // --------------------------------------------------------------------------
  // APP INITIALIZATION
  // --------------------------------------------------------------------------
  function initApp() {
    try { AdminAuthManager.init(); } catch (e) { console.error('AdminAuthManager error:', e); }
    try { initHeaderScrollObserver(); } catch (e) { console.error('initHeaderScrollObserver error:', e); }
    try { initBroadcastClock(); } catch (e) { console.error('initBroadcastClock error:', e); }
    try { setupPaperAudioToggle(); } catch (e) { console.error('setupPaperAudioToggle error:', e); }
    try { renderSectionHeaders(); } catch (e) { console.error('renderSectionHeaders error:', e); }
    try { renderHero(); } catch (e) { console.error('renderHero error:', e); }
    try { renderAbout(); } catch (e) { console.error('renderAbout error:', e); }
    try { renderEventStats(); } catch (e) { console.error('renderEventStats error:', e); }
    try { renderWorkedGames(); } catch (e) { console.error('renderWorkedGames error:', e); }
    try { renderProductions(); } catch (e) { console.error('renderProductions error:', e); }
    try { renderVideos(); } catch (e) { console.error('renderVideos error:', e); }
    try { renderContact(); } catch (e) { console.error('renderContact error:', e); }
    try { renderSuggestions(); } catch (e) { console.error('renderSuggestions error:', e); }
    try { setupNavigation(); } catch (e) { console.error('setupNavigation error:', e); }
    try { setupModals(); } catch (e) { console.error('setupModals error:', e); }
    try { setupGlobalUploads(); } catch (e) { console.error('setupGlobalUploads error:', e); }
    try { setupContactForm(); } catch (e) { console.error('setupContactForm error:', e); }
    try { setupSuggestions(); } catch (e) { console.error('setupSuggestions error:', e); }
    try { setupMetricsObserver(); } catch (e) { console.error('setupMetricsObserver error:', e); }
    try { setupMetricsInteractions(); } catch (e) { console.error('setupMetricsInteractions error:', e); }
    try { setupLoginAnimation(); } catch (e) { console.error('setupLoginAnimation error:', e); }
    try { setupInteractiveCursorEffects(); } catch (e) { console.error('setupInteractiveCursorEffects error:', e); }
    try { setupGlobalTextWordAnimation(); } catch (e) { console.error('setupGlobalTextWordAnimation error:', e); }
    try { TypographyManager.init(); } catch (e) { console.error('TypographyManager error:', e); }
    try { InlineTextEditor.init(); } catch (e) { console.error('InlineTextEditor error:', e); }
    try { TextGlowManager.init(); } catch (e) { console.error('TextGlowManager error:', e); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

  // --------------------------------------------------------------------------
  // HEADER SCROLL REVEAL & INTERSECTION OBSERVER
  // --------------------------------------------------------------------------
  function initHeaderScrollObserver() {
    const headers = document.querySelectorAll('.section-header');
    headers.forEach(h => h.classList.add('header-in-view'));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('header-in-view');
          }
        });
      }, {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px'
      });

      headers.forEach(h => observer.observe(h));
    }
  }

  // --------------------------------------------------------------------------
  // ESPORTS BROADCAST MASTER CONTROL ROOM (PCR) CONSOLE INTRO ENGINE
  // --------------------------------------------------------------------------
  let loginAudioCtx = null;
  let isLoginSoundEnabled = true;
  let isLoginAnimating = false;
  let loginTimeoutHandles = [];
  let pcrTelemetryAnimId = null;
  let pcrTimecodeInterval = null;

  function initLoginAudio() {
    if (!loginAudioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      loginAudioCtx = new AudioCtx();
    }
  }

  // Warm, cinematic studio master console boot chime (gentle chord with soft resonance)
  function playStudioConsoleBoot() {
    if (!isLoginSoundEnabled) return;
    initLoginAudio();
    if (!loginAudioCtx) return;
    try {
      if (loginAudioCtx.state === 'suspended') loginAudioCtx.resume();
      const ctx = loginAudioCtx;
      const now = ctx.currentTime;
      // D-major 9th studio chord: D3, A3, E4, F#4, A4
      const chord = [146.83, 220.00, 329.63, 369.99, 440.00];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.18, now + 0.25);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + 0.45);
      filter.frequency.exponentialRampToValueAtTime(500, now + 2.3);
      filter.Q.setValueAtTime(2.5, now);

      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = i < 2 ? 'sine' : 'triangle';
        const detune = (i % 2 === 0 ? 1 : -1) * (i * 2 + 1);
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime(detune, now);
        osc.connect(filter);
        osc.start(now);
        osc.stop(now + 2.5);
      });

      filter.connect(masterGain);
      masterGain.connect(ctx.destination);
    } catch (e) {
      console.warn('Studio audio startup notice', e);
    }
  }

  // Tactile broadcast switcher relay click on each diagnostic verification
  function playSwitcherRelayClick(freq = 1100) {
    if (!isLoginSoundEnabled) return;
    initLoginAudio();
    if (!loginAudioCtx) return;
    try {
      if (loginAudioCtx.state === 'suspended') loginAudioCtx.resume();
      const ctx = loginAudioCtx;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.045);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  // Clean 3-note broadcast tally stinger chime (C-E-G) when Program Feed goes Live
  function playProgramTallyChime() {
    if (!isLoginSoundEnabled) return;
    initLoginAudio();
    if (!loginAudioCtx) return;
    try {
      if (loginAudioCtx.state === 'suspended') loginAudioCtx.resume();
      const ctx = loginAudioCtx;
      const now = ctx.currentTime;

      // Broadcast stinger: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.5)
      const stingerNotes = [523.25, 659.25, 783.99, 1046.5];
      stingerNotes.forEach((f, idx) => {
        const noteTime = now + (idx * 0.09);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, noteTime);

        gain.gain.setValueAtTime(0.001, noteTime);
        gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.9);
      });
    } catch (e) {}
  }

  // --------------------------------------------------------------------------
  // HIGH-PRECISION BROADCAST TELEMETRY & AUDIO WAVEFORM CANVAS
  // --------------------------------------------------------------------------
  function startPcrTelemetryCanvas() {
    const canvas = document.getElementById('cyberMatrixCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let frame = 0;
    function render() {
      if (!isLoginAnimating) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const midY = h * 0.82;

      // Waveform 1: Primary Cyan Broadcast Audio Wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.28)';
      ctx.lineWidth = 1.8;
      for (let x = 0; x < w; x += 4) {
        const y = midY + Math.sin(x * 0.008 + frame * 0.035) * 18 + Math.cos(x * 0.02 - frame * 0.025) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Waveform 2: Studio Program Red Harmonic Line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 42, 85, 0.22)';
      ctx.lineWidth = 1.4;
      for (let x = 0; x < w; x += 5) {
        const y = midY + Math.sin(x * 0.012 - frame * 0.03) * 14 + Math.sin(x * 0.004 + frame * 0.02) * 12;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Subtle horizontal timecode datum rails
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, midY - 30);
      ctx.lineTo(w, midY - 30);
      ctx.moveTo(0, midY + 30);
      ctx.lineTo(w, midY + 30);
      ctx.stroke();

      frame++;
      pcrTelemetryAnimId = requestAnimationFrame(render);
    }

    if (pcrTelemetryAnimId) cancelAnimationFrame(pcrTelemetryAnimId);
    pcrTelemetryAnimId = requestAnimationFrame(render);
  }

  function stopPcrTelemetryCanvas() {
    if (pcrTelemetryAnimId) {
      cancelAnimationFrame(pcrTelemetryAnimId);
      pcrTelemetryAnimId = null;
    }
    const canvas = document.getElementById('cyberMatrixCanvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function clearLoginTimers() {
    loginTimeoutHandles.forEach(h => clearTimeout(h));
    loginTimeoutHandles = [];
    if (pcrTimecodeInterval) {
      clearInterval(pcrTimecodeInterval);
      pcrTimecodeInterval = null;
    }
  }

  function closeLoginOverlay() {
    clearLoginTimers();
    stopPcrTelemetryCanvas();
    isLoginAnimating = false;
    const overlay = document.getElementById('broadcastLoginOverlay');
    if (overlay) {
      overlay.classList.add('hidden-overlay');
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 480);
    }
    document.body.style.overflow = '';
  }

  function playBroadcastLoginAnimation(autoCloseDelay = 2400) {
    if (isLoginAnimating) return;
    isLoginAnimating = true;
    clearLoginTimers();

    const overlay = document.getElementById('broadcastLoginOverlay');
    if (!overlay) return;

    overlay.style.display = 'flex';
    requestAnimationFrame(() => {
      overlay.classList.remove('hidden-overlay');
    });
    document.body.style.overflow = 'hidden';

    // Start Telemetry Waveform & Warm Studio Audio Boot
    startPcrTelemetryCanvas();
    playStudioConsoleBoot();

    // Live Timecode ticker simulation
    let frames = 0;
    let seconds = 0;
    const timecodeEl = document.getElementById('pcrTimecodeTicker');
    pcrTimecodeInterval = setInterval(() => {
      frames += 2;
      if (frames >= 60) {
        frames = 0;
        seconds++;
      }
      if (timecodeEl) {
        const ff = String(frames).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');
        timecodeEl.textContent = `TC 01:00:${ss}:${ff} • 59.94 FPS`;
      }
    }, 33);

    // Sync operator info from appState
    const opName = (appState.personalInfo && (appState.personalInfo.fullName || appState.personalInfo.handle)) || 'GUNSHOT';
    const opRole = (appState.personalInfo && appState.personalInfo.currentRole) || 'ASSISTANT PRODUCER';
    const opImg = (appState.personalInfo && appState.personalInfo.profileImage) || 'assets/images/hero-portrait.jpg';

    const avatarEl = document.getElementById('loginScannerAvatar');
    const opTitleEl = document.getElementById('loginOpTitle');
    const opSubEl = document.getElementById('loginOpSub');
    const scannerHudText = document.getElementById('loginScannerHudText');
    const percentLabel = document.getElementById('loginPercentLabel');
    const progressFill = document.getElementById('loginProgressFill');
    const diagBox = document.getElementById('loginDiagBox');
    const accessBanner = document.getElementById('loginAccessBanner');
    const enterHomeBtn = document.getElementById('loginEnterHomeBtn');

    if (avatarEl) avatarEl.src = opImg;
    if (opTitleEl) opTitleEl.textContent = opName.toUpperCase();
    if (opSubEl) opSubEl.textContent = `${opRole.toUpperCase()} • GT TITLE DESIGNER`;
    if (scannerHudText) {
      scannerHudText.textContent = '● CAM-01 // 4K 12G-SDI LOCKED';
      scannerHudText.style.color = 'var(--accent-cyan)';
    }

    // Reset progress & logs
    if (percentLabel) percentLabel.textContent = '0%';
    if (progressFill) progressFill.style.width = '0%';
    if (diagBox) diagBox.innerHTML = '';
    if (accessBanner) accessBanner.style.display = 'none';
    if (enterHomeBtn) enterHomeBtn.style.display = 'none';

    playSwitcherRelayClick(1400);

    const steps = [
      { delay: 300, pct: 18, code: 'vMix-4K', text: 'INITIALIZING 60 FPS MASTER VIDEO BUS (12G-SDI / NDI-HB)... [SYNCED]', freq: 1100 },
      { delay: 650, pct: 38, code: 'GT-ENG', text: 'COMPILING GT TITLE DESIGNER LOWER-THIRDS & REPLAYS... [COMPILED]', freq: 1250 },
      { delay: 1000, pct: 58, code: 'DANTE', text: 'CALIBRATING DANTE 32-CH AUDIO INTERFACE & CASTER BUS... [LOCKED]', freq: 1400 },
      { delay: 1350, pct: 76, code: 'MATCH', text: 'OBSERVER FEEDS & LIVE TOURNAMENT API SYNCHRONIZATION... [ACTIVE]', freq: 1550 },
      { delay: 1700, pct: 92, code: 'STREAM', text: 'PRIMARY & BACKUP MULTI-CDN 4K STREAM ENCODERS... [HOT-STANDBY]', freq: 1700 },
      { delay: 2050, pct: 100, code: 'PCR-01', text: `MASTER PRODUCTION CONTROL AUTHORIZED // ${opName.toUpperCase()} ON-AIR... [LIVE]`, freq: 1950 },
    ];

    steps.forEach((step) => {
      const h = setTimeout(() => {
        if (!isLoginAnimating) return;

        if (diagBox) {
          const div = document.createElement('div');
          div.className = 'diag-line';
          div.innerHTML = `<span style="color: var(--accent-cyan); font-weight: 800;">● [${step.code}]</span> <span style="color: #cbd5e1;">${step.text}</span>`;
          diagBox.appendChild(div);
          diagBox.scrollTop = diagBox.scrollHeight;
        }

        if (progressFill) progressFill.style.width = `${step.pct}%`;
        if (percentLabel) percentLabel.textContent = `${step.pct}%`;

        playSwitcherRelayClick(step.freq);
      }, step.delay);

      loginTimeoutHandles.push(h);
    });

    // Final PCR Authorization Climax Step
    const finalH = setTimeout(() => {
      if (!isLoginAnimating) return;

      if (scannerHudText) {
        scannerHudText.textContent = '● PGM ON-AIR // ALL 8 CHANNELS LIVE @ 60 FPS';
        scannerHudText.style.color = '#00ff9d';
      }

      if (accessBanner) accessBanner.style.display = 'block';
      if (enterHomeBtn) enterHomeBtn.style.display = 'inline-flex';

      // Elegant 3-Note Broadcast Tally Stinger
      playProgramTallyChime();

      // Auto-close overlay after delay
      const closeH = setTimeout(() => {
        closeLoginOverlay();
      }, autoCloseDelay);
      loginTimeoutHandles.push(closeH);

    }, 2400);

    loginTimeoutHandles.push(finalH);
  }

  function setupLoginAnimation() {
    const audioToggleBtn = document.getElementById('loginAudioToggleBtn');
    const audioIcon = document.getElementById('loginAudioIcon');
    const skipBtn = document.getElementById('loginSkipBtn');
    const enterHomeBtn = document.getElementById('loginEnterHomeBtn');
    const heroLoginBadgeBtn = document.getElementById('heroLoginBadgeBtn');

    audioToggleBtn?.addEventListener('click', () => {
      isLoginSoundEnabled = !isLoginSoundEnabled;
      if (audioIcon) {
        audioIcon.textContent = isLoginSoundEnabled ? '🔊 STUDIO AUDIO ON' : '🔇 AUDIO MUTED';
      }
    });

    skipBtn?.addEventListener('click', closeLoginOverlay);
    enterHomeBtn?.addEventListener('click', closeLoginOverlay);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const overlay = document.getElementById('broadcastLoginOverlay');
        if (overlay && !overlay.classList.contains('hidden-overlay')) {
          closeLoginOverlay();
        }
      }
    });

    heroLoginBadgeBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      playBroadcastLoginAnimation(2400);
    });

    // Play animation on first website entry (sessionStorage)
    const hasSeenIntro = sessionStorage.getItem('gunshot_broadcast_login_seen');
    if (!hasSeenIntro) {
      sessionStorage.setItem('gunshot_broadcast_login_seen', 'true');
      setTimeout(() => {
        playBroadcastLoginAnimation(2200);
      }, 400);
    }
  }

  // --------------------------------------------------------------------------
  // REAL-TIME BROADCAST TIMECODE CLOCK (BST HH:MM:SS:FF)
  // --------------------------------------------------------------------------
  function initBroadcastClock() {
    let frame = 0;
    setInterval(() => {
      frame = (frame + 1) % 60; // 60fps
      const now = new Date();
      // Bangladesh Standard Time (UTC+6)
      const bstTime = new Date(now.getTime() + (now.getTimezoneOffset() + 360) * 60000);
      const hours = String(bstTime.getHours()).padStart(2, '0');
      const minutes = String(bstTime.getMinutes()).padStart(2, '0');
      const seconds = String(bstTime.getSeconds()).padStart(2, '0');
      const frames = String(frame).padStart(2, '0');

      const tcString = `BST ${hours}:${minutes}:${seconds}:${frames}`;

      if (elements.broadcastClock) elements.broadcastClock.textContent = tcString;
      if (elements.headerTimecode) elements.headerTimecode.textContent = tcString;
    }, 1000 / 30);
  }

  // --------------------------------------------------------------------------
  // VIDEO URL PARSER & EMBED GENERATOR (SUPPORTS YOUTUBE LIVE, VOD, TWITCH, FB, MP4)
  // --------------------------------------------------------------------------
  function parseVideoSource(rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
      return {
        embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0',
        directUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        platform: 'YouTube',
        isVideoFile: false
      };
    }

    const trimmed = rawUrl.trim();

    // 1. Direct Video Files (.mp4, .webm, .ogg, .mov, data:video)
    if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(trimmed) || trimmed.startsWith('data:video/')) {
      return {
        embedUrl: trimmed,
        directUrl: trimmed,
        platform: 'Direct Video Stream',
        isVideoFile: true
      };
    }

    // 2. YouTube Streams & Videos
    // Handles:
    // https://www.youtube.com/live/VIDEO_ID
    // https://youtube.com/live/VIDEO_ID?feature=share
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/shorts/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    // https://m.youtube.com/watch?v=VIDEO_ID
    const ytMatch = trimmed.match(/(?:youtube\.com\/(?:watch\?.*v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      const isLive = trimmed.includes('/live/') || trimmed.includes('live=1');
      return {
        embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`,
        directUrl: isLive ? `https://www.youtube.com/live/${videoId}` : `https://www.youtube.com/watch?v=${videoId}`,
        platform: isLive ? 'YouTube Live Stream' : 'YouTube',
        isVideoFile: false,
        videoId: videoId
      };
    }

    // Raw 11-char YouTube ID fallback (e.g. user pasted just the ID)
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return {
        embedUrl: `https://www.youtube-nocookie.com/embed/${trimmed}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1`,
        directUrl: `https://www.youtube.com/watch?v=${trimmed}`,
        platform: 'YouTube',
        isVideoFile: false,
        videoId: trimmed
      };
    }

    // 3. Twitch Channel or VOD
    const currentHost = window.location.hostname || 'localhost';
    const twitchVodMatch = trimmed.match(/twitch\.tv\/videos\/(\d+)/i);
    if (twitchVodMatch && twitchVodMatch[1]) {
      const videoId = twitchVodMatch[1];
      return {
        embedUrl: `https://player.twitch.tv/?video=${videoId}&parent=${currentHost}&autoplay=true`,
        directUrl: trimmed,
        platform: 'Twitch VOD',
        isVideoFile: false
      };
    }

    const twitchChannelMatch = trimmed.match(/twitch\.tv\/([a-zA-Z0-9_]{3,25})/i);
    if (twitchChannelMatch && twitchChannelMatch[1]) {
      const channel = twitchChannelMatch[1];
      return {
        embedUrl: `https://player.twitch.tv/?channel=${channel}&parent=${currentHost}&autoplay=true`,
        directUrl: trimmed,
        platform: 'Twitch Live Stream',
        isVideoFile: false
      };
    }

    // 4. Facebook Video / Live
    if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) {
      return {
        embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(trimmed)}&show_text=false&autoplay=true`,
        directUrl: trimmed,
        platform: 'Facebook Live',
        isVideoFile: false
      };
    }

    // 5. Vimeo
    const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
    if (vimeoMatch && vimeoMatch[3]) {
      const vimeoId = vimeoMatch[3];
      return {
        embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
        directUrl: `https://vimeo.com/${vimeoId}`,
        platform: 'Vimeo',
        isVideoFile: false
      };
    }

    // General fallback
    return {
      embedUrl: trimmed,
      directUrl: trimmed,
      platform: 'Broadcast Stream',
      isVideoFile: false
    };
  }

  // --------------------------------------------------------------------------
  // SECTION HEADERS RENDERING (EDITABLE ACROSS THE ENTIRE WEBSITE)
  // --------------------------------------------------------------------------
  function renderSectionHeaders() {
    const headers = appState.sectionHeaders || {};

    // Hero
    if (headers.hero) {
      const h = headers.hero;
      const greetingEl = document.getElementById('heroGreeting');
      const titleEl = document.getElementById('heroMainTitle');
      const statusPillText = document.getElementById('heroStatusPillText');
      const badgeBox = document.getElementById('heroBadgeLogoBox');
      const badgeRole = document.getElementById('heroBadgeRole');
      const badgeSub = document.getElementById('heroBadgeSub');

      if (greetingEl && h.title) greetingEl.textContent = `HELLO, I'M ${h.title}`;
      if (titleEl && h.roleTitle) {
        titleEl.textContent = h.roleTitle;
        if (h.titleFont) titleEl.style.fontFamily = h.titleFont;
      }
      if (statusPillText) {
        statusPillText.textContent = (h.statusPill && !h.statusPill.includes('ECUBE'))
          ? h.statusPill
          : 'STATUS: ON AIR // LIVE BROADCAST';
      }
      if (badgeBox) {
        const logoSrc = h.companyLogo || 'assets/images/ecube-logo.png';
        if (logoSrc) {
          badgeBox.innerHTML = `
            <div class="ecube-logo-inner-wrapper">
              <img src="${logoSrc}" class="ecube-animated-logo" alt="ECUBE Logo" />
              <div class="ecube-inner-sheen" style="-webkit-mask-image: url('${logoSrc}'); mask-image: url('${logoSrc}');"></div>
            </div>
          `;
        } else {
          badgeBox.textContent = (h.companyBadge && h.companyBadge !== 'ECUBE') ? h.companyBadge : '⚡';
        }
      }
      if (badgeRole) badgeRole.textContent = h.companyBadgeRole || 'ASSISTANT PRODUCER';
      if (badgeSub) badgeSub.textContent = h.companyBadgeSub || 'GT Titles & Live Graphics';
    }

    renderEventStats();

    // About
    if (headers.about) {
      const tag = document.getElementById('aboutSectionTag');
      const title = document.getElementById('aboutSectionTitle');
      const sub = document.getElementById('aboutSectionSub');
      if (tag) tag.textContent = headers.about.tag;
      if (title) {
        let titleText = (headers.about.title || 'ASSISTANT PRODUCER AT').replace(/\s+ECUBE$/i, '').trim();
        const logoSrc = headers.about.logo || 'assets/images/ecube-logo.png';
        const showLogo = headers.about.showLogo !== false;

        title.innerHTML = `
          <span class="section-title-text" id="aboutSectionTitleText">${titleText}</span>
          ${showLogo ? `
            <span class="about-title-logo-badge" id="aboutTitleLogoBadge" title="ECUBE (Event Execution Experts)" role="button" tabindex="0">
              <span class="about-title-logo-inner">
                <img src="${logoSrc}" class="about-header-ecube-img" alt="ECUBE Logo" />
                <span class="about-logo-sheen"></span>
              </span>
            </span>
          ` : ''}
        `;

        if (headers.about.titleFont) {
          const textSpan = document.getElementById('aboutSectionTitleText');
          if (textSpan) textSpan.style.fontFamily = headers.about.titleFont;
        }

        const logoBadge = document.getElementById('aboutTitleLogoBadge');
        if (logoBadge) {
          logoBadge.addEventListener('click', (e) => {
            e.stopPropagation();
            openSectionHeaderModal('about');
          });
          logoBadge.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openSectionHeaderModal('about');
            }
          });
        }
      }
      if (sub) sub.textContent = headers.about.subtitle;
    }

    // Metrics & Games Worked
    if (headers.metrics) {
      const tag = document.getElementById('metricsSectionTag');
      const title = document.getElementById('metricsSectionTitle');
      const sub = document.getElementById('metricsSectionSub');
      if (tag) tag.textContent = headers.metrics.tag;
      if (title) {
        title.textContent = headers.metrics.title;
        if (headers.metrics.titleFont) title.style.fontFamily = headers.metrics.titleFont;
      }
      if (sub) sub.textContent = headers.metrics.subtitle;
    }

    // Games Worked Ecosystems Subheader
    if (headers.gamesWorked) {
      const tag = document.getElementById('gamesWorkedSectionTag');
      const title = document.getElementById('gamesWorkedSectionTitle');
      const sub = document.getElementById('gamesWorkedSectionSub');
      if (tag) tag.textContent = headers.gamesWorked.tag || 'COMPETITIVE ECOSYSTEMS';
      if (title) {
        title.textContent = headers.gamesWorked.title || 'GAMES WORKED WITH IN BROADCAST & TITLE DESIGN';
        if (headers.gamesWorked.titleFont) title.style.fontFamily = headers.gamesWorked.titleFont;
      }
      if (sub) sub.textContent = headers.gamesWorked.subtitle || '';
    }

    // Productions
    if (headers.productions) {
      const tag = document.getElementById('productionsSectionTag');
      const title = document.getElementById('productionsSectionTitle');
      const sub = document.getElementById('productionsSectionSub');
      if (tag) tag.textContent = headers.productions.tag;
      if (title) {
        title.textContent = headers.productions.title;
        if (headers.productions.titleFont) title.style.fontFamily = headers.productions.titleFont;
      }
      if (sub) sub.textContent = headers.productions.subtitle;
    }

    // Videos
    if (headers.videos) {
      const tag = document.getElementById('videosSectionTag');
      const title = document.getElementById('videosSectionTitle');
      const sub = document.getElementById('videosSectionSub');
      if (tag) tag.textContent = headers.videos.tag;
      if (title) {
        title.textContent = headers.videos.title;
        if (headers.videos.titleFont) title.style.fontFamily = headers.videos.titleFont;
      }
      if (sub) sub.textContent = headers.videos.subtitle;
    }

    // Contact
    if (headers.contact) {
      const tag = document.getElementById('contactSectionTag');
      const title = document.getElementById('contactSectionTitle');
      const sub = document.getElementById('contactSectionSub');
      if (tag) tag.textContent = headers.contact.tag;
      if (title) {
        title.textContent = headers.contact.title;
        if (headers.contact.titleFont) title.style.fontFamily = headers.contact.titleFont;
      }
      if (sub) sub.textContent = headers.contact.subtitle;
    }

    // Suggestions
    if (headers.suggestions) {
      const tag = document.getElementById('suggestionsTag');
      const title = document.getElementById('suggestionsTitle');
      const sub = document.getElementById('suggestionsSubtitle');
      if (tag) tag.textContent = headers.suggestions.tag;
      if (title) {
        title.textContent = headers.suggestions.title;
        if (headers.suggestions.titleFont) title.style.fontFamily = headers.suggestions.titleFont;
      }
      if (sub) sub.textContent = headers.suggestions.subtitle;
    }
  }

  // --------------------------------------------------------------------------
  // EVENT METRICS / STATS RENDERING & COUNT-UP ANIMATION FROM 0
  // --------------------------------------------------------------------------
  let countersHasAnimated = false;

  function syncEventStatsFromMetricCards() {
    if (!appState.eventStats) appState.eventStats = {};
    if (appState.metricCards && appState.metricCards.length > 0) {
      if (appState.metricCards[0]) {
        appState.eventStats.officialCount = appState.metricCards[0].count;
        appState.eventStats.officialLabel = appState.metricCards[0].label;
        appState.eventStats.officialBadge = appState.metricCards[0].badge;
        appState.eventStats.officialPing = appState.metricCards[0].ping;
        appState.eventStats.officialDesc = appState.metricCards[0].description;
        appState.eventStats.officialFooterTag = appState.metricCards[0].footerTag;
        appState.eventStats.officialFooterIcon = appState.metricCards[0].footerIcon;
      }
      if (appState.metricCards[1]) {
        appState.eventStats.localCount = appState.metricCards[1].count;
        appState.eventStats.localLabel = appState.metricCards[1].label;
        appState.eventStats.localBadge = appState.metricCards[1].badge;
        appState.eventStats.localPing = appState.metricCards[1].ping;
        appState.eventStats.localDesc = appState.metricCards[1].description;
        appState.eventStats.localFooterTag = appState.metricCards[1].footerTag;
        appState.eventStats.localFooterIcon = appState.metricCards[1].footerIcon;
      }
      if (appState.metricCards[2]) {
        appState.eventStats.unofficialCount = appState.metricCards[2].count;
        appState.eventStats.unofficialLabel = appState.metricCards[2].label;
        appState.eventStats.unofficialBadge = appState.metricCards[2].badge;
        appState.eventStats.unofficialPing = appState.metricCards[2].ping;
        appState.eventStats.unofficialDesc = appState.metricCards[2].description;
        appState.eventStats.unofficialFooterTag = appState.metricCards[2].footerTag;
        appState.eventStats.unofficialFooterIcon = appState.metricCards[2].footerIcon;
      }
    }
  }

  // --------------------------------------------------------------------------
  // DIRECT INLINE TEXT EDITING HELPER (INSTANT CLICK-TO-EDIT & AUTO-SAVE)
  // --------------------------------------------------------------------------
  function makeElementDirectEditable(el, onSave) {
    if (!el) return;
    if (el.getAttribute('contenteditable') === 'true') return;

    const originalText = el.textContent.trim();
    el.setAttribute('data-original-text', originalText);
    el.setAttribute('contenteditable', 'true');
    el.focus();

    // Select text range
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } catch (e) {}

    let isSaved = false;

    const finishEdit = () => {
      if (isSaved) return;
      isSaved = true;
      el.removeAttribute('contenteditable');
      const newText = el.textContent.trim();
      if (newText !== originalText && typeof onSave === 'function') {
        onSave(newText);
        PaperAudio.playPaperStamp();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        el.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        isSaved = true;
        el.textContent = originalText;
        el.removeAttribute('contenteditable');
        el.removeEventListener('blur', finishEdit);
        el.removeEventListener('keydown', handleKeyDown);
      }
    };

    el.addEventListener('blur', finishEdit, { once: true });
    el.addEventListener('keydown', handleKeyDown);
  }

  function renderEventStats(shouldAnimate = false) {
    const grid = document.getElementById('metricsCardsGrid');
    if (!grid) return;

    if (!appState.metricCards || !Array.isArray(appState.metricCards) || appState.metricCards.length === 0) {
      if (window.portfolioData && window.portfolioData.metricCards) {
        appState.metricCards = JSON.parse(JSON.stringify(window.portfolioData.metricCards));
      } else {
        appState.metricCards = [
          {
            id: "metric-official",
            type: "official",
            colorTheme: "cyan",
            badge: "🏆 TIER 1 // PUBLISHER",
            badgeColor: "cyan",
            ping: "LIVE SYNC",
            count: (appState.eventStats && appState.eventStats.officialCount) || "10+",
            label: (appState.eventStats && appState.eventStats.officialLabel) || "OFFICIAL EVENTS",
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
            count: (appState.eventStats && appState.eventStats.localCount) || "200+",
            label: (appState.eventStats && appState.eventStats.localLabel) || "LOCAL EVENTS",
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
            count: (appState.eventStats && appState.eventStats.unofficialCount) || "5+",
            label: (appState.eventStats && appState.eventStats.unofficialLabel) || "UNOFFICIAL",
            description: "Creator invitationals, independent community cups, and custom esports showmatches with tailored broadcast packages.",
            footerTag: "CUSTOM BROADCASTING",
            footerIcon: "⚡"
          }
        ];
      }
    }

    const cards = appState.metricCards;

    const cardsHtml = cards.map((card, index) => {
      const parsed = parseCountTarget(card.count);
      const color = card.colorTheme || 'cyan';
      const badgeCls = `badge-${card.badgeColor || color}`;
      const textCls = `text-${color}`;
      const cardTypeCls = `metric-card-${color} metric-card-${card.type || color}`;
      const countId = `metric-${card.id || index}-count`;

      return `
        <div class="metric-card ${cardTypeCls} esports-box" data-metric="${card.id || index}" data-index="${index}">
          <div class="metric-card-header">
            <span class="metric-tier-badge ${badgeCls} font-mono" data-field="badge" data-direct-editable="true" title="Click to edit badge text">${card.badge || '🏆 MILESTONE'}</span>
            <div class="metric-card-header-right">
              <span class="metric-hud-ping ${textCls}" data-field="ping" data-direct-editable="true" title="Click to edit status">${card.ping || 'LIVE SYNC'}</span>
              <button class="metric-quick-edit-btn" data-index="${index}" title="Edit this milestone card">
                ✏️ EDIT
              </button>
            </div>
          </div>

          <div class="metric-counter-wrapper">
            <span class="metric-counter-num ${textCls} font-heading" id="${countId}" data-target="${parsed.num}" data-suffix="${parsed.suffix}" data-field="count" data-direct-editable="true" title="Click to edit number (e.g. 50+, 200+, 100K)">${card.count}</span>
          </div>

          <div class="metric-card-label" data-field="label" data-direct-editable="true" title="Click to edit label">${card.label || 'MILESTONE'}</div>

          <p class="metric-card-desc" data-field="description" data-direct-editable="true" title="Click to edit description">${card.description || ''}</p>

          <div class="metric-card-footer">
            <span class="metric-footer-tag font-mono" data-field="footerTag" data-direct-editable="true" title="Click to edit tag">${card.footerTag || 'BROADCAST ACCREDITED'}</span>
            <span class="metric-footer-icon ${textCls}" data-field="footerIcon" data-direct-editable="true" title="Click to edit icon">${card.footerIcon || '⚡'}</span>
          </div>

          <div class="card-action-bar metric-card-action-bar">
            <button class="card-action-btn edit-metric-card-btn" data-index="${index}" title="Edit this milestone card">
              <span>✏️ EDIT CARD</span>
            </button>
            <button class="card-action-btn duplicate-metric-card-btn" data-index="${index}" title="Duplicate this milestone card">
              <span>📋 DUPLICATE</span>
            </button>
            <button class="card-action-btn replay-single-metric-btn" data-index="${index}" title="Replay count animation">
              <span>⚡ REPLAY</span>
            </button>
            ${cards.length > 1 ? `
              <button class="card-action-btn delete-metric-card-btn" data-index="${index}" style="color: var(--accent-red); border-color: rgba(255,42,85,0.35);" title="Delete this card">
                <span>🗑️</span>
              </button>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    const addCardSlotHtml = `
      <div class="metric-card metric-add-card-slot esports-box" id="addMetricCardSlotBtn" title="Click to add a new tournament milestone card">
        <div class="metric-add-slot-inner">
          <div class="metric-add-icon">➕</div>
          <div class="metric-add-title">ADD NEW MILESTONE</div>
          <div class="metric-add-sub">Create a new tournament track record card</div>
        </div>
      </div>
    `;

    grid.innerHTML = cardsHtml + addCardSlotHtml;

    attachMetricCardEvents();

    if (shouldAnimate) {
      runCountersAnimation();
    }
  }

  function attachMetricCardEvents() {
    // Quick Edit & Full Edit Buttons
    document.querySelectorAll('.metric-quick-edit-btn, .edit-metric-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        openMetricCardEditModal(idx);
      });
    });

    // Duplicate Card
    document.querySelectorAll('.duplicate-metric-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const orig = appState.metricCards[idx];
        if (!orig) return;
        const copy = JSON.parse(JSON.stringify(orig));
        copy.id = `metric-${Date.now()}`;
        copy.label = `${orig.label} (COPY)`;
        appState.metricCards.splice(idx + 1, 0, copy);
        syncEventStatsFromMetricCards();
        saveState();
        renderEventStats(true);
        showBroadcastToast(`📋 Duplicated milestone "${orig.label}"!`);
      });
    });

    // Replay Count
    document.querySelectorAll('.replay-single-metric-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        replaySingleMetric(idx);
      });
    });

    // Delete Card
    document.querySelectorAll('.delete-metric-card-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const card = appState.metricCards[idx];
        if (confirm(`Delete milestone "${card.label || 'card'}"?`)) {
          appState.metricCards.splice(idx, 1);
          syncEventStatsFromMetricCards();
          saveState();
          renderEventStats(true);
          showBroadcastToast(`🗑️ Milestone deleted.`);
        }
      });
    });

    // Add Card Slot
    document.getElementById('addMetricCardSlotBtn')?.addEventListener('click', () => {
      openMetricCardEditModal(-1);
    });

    // Direct Inline Click-to-Edit for all text fields inside metric cards
    document.querySelectorAll('.metric-card:not(.metric-add-card-slot) [data-direct-editable="true"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardEl = el.closest('.metric-card');
        if (!cardEl) return;
        const idx = parseInt(cardEl.getAttribute('data-index'), 10);
        const field = el.getAttribute('data-field');
        if (idx >= 0 && field && appState.metricCards && appState.metricCards[idx]) {
          makeElementDirectEditable(el, (newVal) => {
            appState.metricCards[idx][field] = newVal;
            syncEventStatsFromMetricCards();
            saveState();
            showBroadcastToast(`✓ Updated ${field}: "${newVal}"`);
            if (field === 'count') {
              const parsed = parseCountTarget(newVal);
              el.setAttribute('data-target', parsed.num);
              el.setAttribute('data-suffix', parsed.suffix);
              animateCounterElement(el, parsed.num, parsed.suffix, 1200);
            }
          });
        }
      });
    });

    // Double click card anywhere to open modal
    document.querySelectorAll('.metric-card:not(.metric-add-card-slot)').forEach(card => {
      card.addEventListener('dblclick', (e) => {
        if (e.target.closest('button, input, select, textarea, [data-direct-editable="true"]')) return;
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openMetricCardEditModal(idx);
      });
    });
  }

  function replaySingleMetric(index) {
    const cardEl = document.querySelector(`.metric-card[data-index="${index}"]`);
    let el = cardEl ? cardEl.querySelector('.metric-counter-num') : null;
    const cards = appState.metricCards || [];
    const card = cards[index];
    if (!el && card) {
      el = document.getElementById(`metric-${card.id || index}-count`);
    }
    if (!el) return;
    const rawVal = (card && card.count) ? card.count : (el.getAttribute('data-target') || el.textContent);
    const parsed = parseCountTarget(rawVal);
    animateCounterElement(el, parsed.num, parsed.suffix || '+', 1600);
    if (window.PaperAudio && PaperAudio.playPaperPageFlip) PaperAudio.playPaperPageFlip();
    showBroadcastToast(`⚡ Replaying count for ${card ? (card.label || 'milestone') : 'milestone'}...`);
  }

  function parseCountTarget(str) {
    const raw = String(str || '').trim();
    const match = raw.match(/^(\d+)(.*)$/);
    if (match) {
      return {
        num: parseInt(match[1], 10),
        suffix: match[2] || ''
      };
    }
    return { num: 0, suffix: raw };
  }

  function animateCounterElement(element, targetNum, suffix, duration = 1800) {
    if (!element) return;
    let startTimestamp = null;
    element.textContent = '0' + suffix;
    element.classList.add('counter-ticking');

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth easeOutCubic curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * targetNum);
      element.textContent = current + suffix;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = targetNum + suffix;
        element.classList.remove('counter-ticking');
        element.classList.add('counter-settled');
        setTimeout(() => element.classList.remove('counter-settled'), 800);
      }
    }

    window.requestAnimationFrame(step);
  }

  function runCountersAnimation() {
    const cards = appState.metricCards || [];
    const numEls = document.querySelectorAll('.metric-card:not(.metric-add-card-slot) .metric-counter-num');
    
    numEls.forEach((el, index) => {
      const cardEl = el.closest('.metric-card');
      const idx = cardEl ? parseInt(cardEl.getAttribute('data-index'), 10) : index;
      const card = cards[idx];
      const rawVal = (card && card.count) ? card.count : (el.getAttribute('data-target') || el.textContent);
      const parsed = parseCountTarget(rawVal);
      setTimeout(() => {
        animateCounterElement(el, parsed.num, parsed.suffix || '+', 1600 + index * 120);
      }, index * 100);
    });
    if (window.PaperAudio && PaperAudio.playPaperPageFlip) PaperAudio.playPaperPageFlip();
  }

  function setupMetricsObserver() {
    const metricsSection = document.getElementById('metrics');
    if (!metricsSection) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !countersHasAnimated) {
            countersHasAnimated = true;
            runCountersAnimation();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(metricsSection);
    } else {
      runCountersAnimation();
    }
  }

  // --------------------------------------------------------------------------
  // GAMES WORKED WITH RENDERING (COMPETITIVE ESPORTS ECOSYSTEMS)
  // --------------------------------------------------------------------------
  function renderWorkedGames() {
    const container = document.getElementById('gamesWorkedGrid');
    if (!container) return;

    const games = appState.workedGames || (window.portfolioData && window.portfolioData.workedGames) || [];
    if (!games || games.length === 0) {
      container.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">No game ecosystems configured yet. Click "ADD GAME" to add titles.</div>`;
      return;
    }

    const gamesHtml = games.map((game, index) => {
      const badgeClass = game.badgeColor === 'purple' ? 'badge-purple' : (game.badgeColor === 'gold' ? 'badge-gold' : (game.badgeColor === 'emerald' ? 'badge-emerald' : (game.badgeColor === 'red' ? 'badge-red' : 'badge-cyan')));
      const toolTags = (game.tools || '').split('•').map(t => `<span class="game-tool-tag">${t.trim()}</span>`).filter(Boolean).join('');
      const isImgIcon = game.icon && (game.icon.startsWith('http') || game.icon.startsWith('assets') || game.icon.startsWith('data:image'));

      return `
        <div class="game-worked-card esports-box" data-id="${game.id}" data-index="${index}">
          <div class="game-card-header">
            <div class="game-card-title-group">
              <span class="game-icon-glyph" title="Click edit card to change icon or upload logo">
                ${isImgIcon ? `<img src="${game.icon}" alt="${game.name}" style="width: 32px; height: 32px; object-fit: contain;" />` : (game.icon || '🎮')}
              </span>
              <div>
                <span class="game-publisher-tag font-mono" data-field="publisher" data-direct-editable="true" title="Click to edit publisher">${game.publisher || 'ESPORTS PUBLISHER'}</span>
                <h4 class="game-title-text font-heading" data-field="name" data-direct-editable="true" title="Click to edit game title">${game.name}</h4>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="game-badge-chip ${badgeClass} font-mono" data-field="badge" data-direct-editable="true" title="Click to edit badge">${game.badge || 'PRO CIRCUIT'}</span>
              <button class="metric-quick-edit-btn edit-game-quick-btn" data-index="${index}" title="Edit this game title">
                ✏️ EDIT
              </button>
            </div>
          </div>

          <div class="game-role-strip">
            <span class="game-role-label font-mono">ROLE:</span>
            <span class="game-role-val" data-field="role" data-direct-editable="true" title="Click to edit role">${game.role || 'Assistant Producer'}</span>
          </div>

          <p class="game-card-desc" data-field="description" data-direct-editable="true" title="Click to edit description">${game.description || ''}</p>

          <div class="game-tournaments-box">
            <span class="font-mono text-cyan" style="font-size: 0.72rem; font-weight: 800;">TOURNAMENTS:</span>
            <span class="game-tournaments-val" data-field="tournaments" data-direct-editable="true" title="Click to edit tournaments" style="font-size: 0.8rem; color: #ffffff;">${game.tournaments || ''}</span>
          </div>

          <div class="game-card-footer">
            <div class="game-tools-tags">
              ${toolTags}
              <button type="button" class="add-tool-tag-btn" data-index="${index}" title="Add a tool / software tag">➕ TAG</button>
            </div>
            <span class="game-stats-val font-mono" data-field="stats" data-direct-editable="true" title="Click to edit stats">${game.stats || ''}</span>
          </div>

          <div class="card-action-bar game-card-action-bar">
            <div style="display: flex; gap: 6px; align-items: center;">
              <button class="card-action-btn edit-game-btn" data-index="${index}" title="Edit this game card">
                <span>✏️ EDIT CARD</span>
              </button>
              <button class="card-action-btn duplicate-game-btn" data-index="${index}" title="Duplicate this game title">
                <span>📋 DUPLICATE</span>
              </button>
            </div>
            <div style="display: flex; gap: 6px; align-items: center;">
              ${index > 0 ? `<button class="card-action-btn move-game-up-btn" data-index="${index}" title="Move card up"><span>▲</span></button>` : ''}
              ${index < games.length - 1 ? `<button class="card-action-btn move-game-down-btn" data-index="${index}" title="Move card down"><span>▼</span></button>` : ''}
              <button class="card-action-btn delete-game-btn" data-index="${index}" style="color: var(--accent-red); border-color: rgba(255,42,85,0.35);" title="Delete this game">
                <span>🗑️ DELETE</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    const addGameSlotHtml = `
      <div class="game-worked-card game-add-card-slot esports-box" id="addGameCardSlotBtn" title="Click to add a new esports game title">
        <div class="game-add-slot-inner">
          <div class="game-add-icon">➕</div>
          <div class="game-add-title">ADD NEW ESPORTS GAME</div>
          <div class="game-add-sub">Add a competitive game title with tournaments &amp; roles</div>
        </div>
      </div>
    `;

    container.innerHTML = gamesHtml + addGameSlotHtml;

    attachGameCardEvents();
  }

  function attachGameCardEvents() {
    // Quick Edit & Full Edit Buttons
    document.querySelectorAll('.edit-game-quick-btn, .edit-game-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        openGamesEditModal(idx);
      });
    });

    // Add Game Slot
    document.getElementById('addGameCardSlotBtn')?.addEventListener('click', () => {
      openGamesEditModal(-1);
    });

    // Add Tool Tag Button
    document.querySelectorAll('.add-tool-tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        const val = prompt('Enter new software / tool tag name (e.g. Unreal Engine, NDI Tools, CasparCG):');
        if (val && val.trim() && appState.workedGames && appState.workedGames[idx]) {
          const g = appState.workedGames[idx];
          g.tools = g.tools ? `${g.tools} • ${val.trim()}` : val.trim();
          saveState();
          renderWorkedGames();
          showBroadcastToast(`✓ Added tool "${val.trim()}"`);
        }
      });
    });

    // Duplicate Game Title
    document.querySelectorAll('.duplicate-game-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const original = appState.workedGames[idx];
        if (!original) return;
        const copy = JSON.parse(JSON.stringify(original));
        copy.id = `game-${Date.now()}`;
        copy.name = `${original.name} (COPY)`;
        appState.workedGames.splice(idx + 1, 0, copy);
        saveState();
        renderWorkedGames();
        showBroadcastToast(`📋 Duplicated "${original.name}"!`);
      });
    });

    // Move Up
    document.querySelectorAll('.move-game-up-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (idx > 0) {
          const item = appState.workedGames.splice(idx, 1)[0];
          appState.workedGames.splice(idx - 1, 0, item);
          saveState();
          renderWorkedGames();
        }
      });
    });

    // Move Down
    document.querySelectorAll('.move-game-down-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (idx < appState.workedGames.length - 1) {
          const item = appState.workedGames.splice(idx, 1)[0];
          appState.workedGames.splice(idx + 1, 0, item);
          saveState();
          renderWorkedGames();
        }
      });
    });

    // Delete Game
    document.querySelectorAll('.delete-game-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const g = appState.workedGames[idx];
        if (confirm(`Delete game title "${g.name}"?`)) {
          appState.workedGames.splice(idx, 1);
          saveState();
          renderWorkedGames();
          showBroadcastToast(`🗑️ Removed game title.`);
        }
      });
    });

    // Direct Inline Click-to-Edit for all text fields inside game cards
    document.querySelectorAll('.game-worked-card:not(.game-add-card-slot) [data-direct-editable="true"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const cardEl = el.closest('.game-worked-card');
        if (!cardEl) return;
        const idx = parseInt(cardEl.getAttribute('data-index'), 10);
        const field = el.getAttribute('data-field');
        if (idx >= 0 && field && appState.workedGames && appState.workedGames[idx]) {
          makeElementDirectEditable(el, (newVal) => {
            appState.workedGames[idx][field] = newVal;
            saveState();
            showBroadcastToast(`✓ Updated ${field}: "${newVal}"`);
          });
        }
      });
    });

    // Double-click card anywhere to open full modal
    document.querySelectorAll('.game-worked-card:not(.game-add-card-slot)').forEach(card => {
      card.addEventListener('dblclick', (e) => {
        if (e.target.closest('button, input, select, textarea, [data-direct-editable="true"]')) return;
        const idx = parseInt(card.getAttribute('data-index'), 10);
        openGamesEditModal(idx);
      });
    });
  }

  // --------------------------------------------------------------------------
  // METRICS & GAMES MODAL CONTROLLERS & INTERACTIONS
  // --------------------------------------------------------------------------
  function openMetricCardEditModal(index = 0) {
    if (!requireAdminAuth()) return;
    if (!appState.metricCards || !Array.isArray(appState.metricCards) || appState.metricCards.length === 0) {
      if (window.portfolioData && window.portfolioData.metricCards) {
        appState.metricCards = JSON.parse(JSON.stringify(window.portfolioData.metricCards));
      } else {
        appState.metricCards = [];
      }
    }

    const cards = appState.metricCards;
    const isNew = index === -1 || index >= cards.length;
    const card = isNew ? {
      id: `metric-${Date.now()}`,
      type: 'official',
      colorTheme: 'cyan',
      badge: '🏆 TIER 1 // PUBLISHER',
      badgeColor: 'cyan',
      ping: 'LIVE SYNC',
      count: '50+',
      label: 'NEW MILESTONE',
      description: 'Championship productions, stadium LANs, and premier broadcast arenas.',
      footerTag: 'BROADCAST ACCREDITED',
      footerIcon: '⚡'
    } : cards[index];

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <h3 style="font-size: 1.4rem; color: var(--accent-cyan); font-family: var(--font-heading); margin: 0;">
            ${isNew ? '➕ ADD NEW EVENT MILESTONE' : '✏️ EDIT EVENT MILESTONE CARD'}
          </h3>
          <span class="font-mono" style="font-size: 0.72rem; color: var(--accent-cyan); padding: 4px 10px; background: rgba(0,240,255,0.1); border-radius: var(--radius-chamfer-sm); border: 1px solid var(--accent-cyan);">
            METRIC CARD ${isNew ? `#${cards.length + 1}` : `#${index + 1}`}
          </span>
        </div>

        <form id="singleMetricCardForm">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Counter Value (e.g. 10+, 200+, 5+, 1000+)</label>
              <input type="text" id="sm_count" class="form-input" value="${card.count || ''}" placeholder="10+" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Card Title / Label (e.g. OFFICIAL EVENTS)</label>
              <input type="text" id="sm_label" class="form-input" value="${card.label || ''}" placeholder="OFFICIAL EVENTS" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Top Tier Badge (e.g. 🏆 TIER 1 // PUBLISHER)</label>
              <input type="text" id="sm_badge" class="form-input" value="${card.badge || ''}" placeholder="🏆 TIER 1 // PUBLISHER" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">HUD Ping / Live Status</label>
              <input type="text" id="sm_ping" class="form-input" value="${card.ping || ''}" placeholder="LIVE SYNC" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Color Theme / Card Glow</label>
              <select id="sm_colorTheme" class="form-input">
                <option value="cyan" ${card.colorTheme === 'cyan' ? 'selected' : ''}>Cyan (Tier 1 / Publisher)</option>
                <option value="purple" ${card.colorTheme === 'purple' ? 'selected' : ''}>Purple (Grassroots / LAN)</option>
                <option value="gold" ${card.colorTheme === 'gold' ? 'selected' : ''}>Gold (Invitational / Scene)</option>
                <option value="emerald" ${card.colorTheme === 'emerald' ? 'selected' : ''}>Emerald (Championship Green)</option>
                <option value="red" ${card.colorTheme === 'red' ? 'selected' : ''}>Red (Grand Finals / Neon Fire)</option>
              </select>
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Badge Border Accent</label>
              <select id="sm_badgeColor" class="form-input">
                <option value="cyan" ${(card.badgeColor || card.colorTheme) === 'cyan' ? 'selected' : ''}>Cyan</option>
                <option value="purple" ${(card.badgeColor || card.colorTheme) === 'purple' ? 'selected' : ''}>Purple</option>
                <option value="gold" ${(card.badgeColor || card.colorTheme) === 'gold' ? 'selected' : ''}>Gold</option>
                <option value="emerald" ${(card.badgeColor || card.colorTheme) === 'emerald' ? 'selected' : ''}>Emerald</option>
                <option value="red" ${(card.badgeColor || card.colorTheme) === 'red' ? 'selected' : ''}>Red</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Description Text</label>
            <textarea id="sm_desc" class="form-input" rows="3" placeholder="Publisher-sanctioned stadium tournaments, regional finals, and premier broadcast arenas with custom GT graphics.">${card.description || ''}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; margin-bottom: 18px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Footer Tag (e.g. TIER-1 ACCREDITED)</label>
              <input type="text" id="sm_footerTag" class="form-input" value="${card.footerTag || ''}" placeholder="TIER-1 ACCREDITED" />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Footer Icon / Glyph (e.g. ⚡, 🔥, 🎯, 🏆)</label>
              <input type="text" id="sm_footerIcon" class="form-input" value="${card.footerIcon || '⚡'}" placeholder="⚡" />
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <div>
              ${!isNew && cards.length > 1 ? `
                <button type="button" class="btn btn-secondary btn-sm" id="deleteSingleMetricBtn" style="color: var(--accent-red); border-color: rgba(255,42,85,0.4);">
                  🗑️ DELETE CARD
                </button>
              ` : ''}
            </div>
            <div style="display: flex; gap: 12px;">
              <button type="button" class="btn btn-secondary btn-sm" id="cancelSingleMetricBtn">CANCEL</button>
              <button type="submit" class="btn btn-primary btn-sm">SAVE MILESTONE</button>
            </div>
          </div>
        </form>

        ${cards.length > 0 ? `
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.12);">
            <div class="font-mono" style="font-size: 0.72rem; color: var(--accent-cyan); margin-bottom: 10px;">ALL MILESTONE CARDS (CLICK TO EDIT):</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${cards.map((c, idx) => `
                <button type="button" class="btn btn-secondary btn-sm quick-switch-metric-btn" data-idx="${idx}" style="font-size: 0.76rem; padding: 4px 10px; ${idx === index && !isNew ? 'border-color: var(--accent-cyan); color: #fff; background: rgba(0,240,255,0.12);' : ''}">
                  ${c.badge?.split(' ')[0] || '⚡'} ${c.label} (${c.count})
                </button>
              `).join('')}
              <button type="button" class="btn btn-primary btn-sm" id="addNewMetricModalBtn" style="font-size: 0.76rem; padding: 4px 10px;">
                ➕ ADD NEW
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    document.querySelectorAll('.quick-switch-metric-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        openMetricCardEditModal(idx);
      });
    });

    document.getElementById('addNewMetricModalBtn')?.addEventListener('click', () => {
      openMetricCardEditModal(-1);
    });

    document.getElementById('cancelSingleMetricBtn')?.addEventListener('click', closeModals);

    document.getElementById('deleteSingleMetricBtn')?.addEventListener('click', () => {
      if (confirm(`Delete milestone "${card.label}"?`)) {
        cards.splice(index, 1);
        syncEventStatsFromMetricCards();
        saveState();
        renderEventStats(true);
        closeModals();
        showBroadcastToast('🗑️ Milestone card deleted.');
      }
    });

    document.getElementById('singleMetricCardForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedCard = {
        id: card.id || `metric-${Date.now()}`,
        type: card.type || 'official',
        colorTheme: document.getElementById('sm_colorTheme').value,
        badge: document.getElementById('sm_badge').value.trim() || '🏆 TIER 1 // PUBLISHER',
        badgeColor: document.getElementById('sm_badgeColor').value,
        ping: document.getElementById('sm_ping').value.trim() || 'LIVE SYNC',
        count: document.getElementById('sm_count').value.trim() || '10+',
        label: document.getElementById('sm_label').value.trim() || 'OFFICIAL EVENTS',
        description: document.getElementById('sm_desc').value.trim(),
        footerTag: document.getElementById('sm_footerTag').value.trim() || 'TIER-1 ACCREDITED',
        footerIcon: document.getElementById('sm_footerIcon').value.trim() || '⚡'
      };

      if (isNew) {
        cards.push(updatedCard);
      } else {
        cards[index] = updatedCard;
      }

      syncEventStatsFromMetricCards();
      saveState();
      renderEventStats(true);
      closeModals();
      showBroadcastToast('✅ Milestone card saved!');
    });

    if (window.PaperAudio && PaperAudio.playPaperPageFlip) PaperAudio.playPaperPageFlip();
    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openMetricsStatsEditModal() {
    openMetricCardEditModal(0);
  }

  function openGamesHeaderEditModal() {
    const cur = (appState.sectionHeaders && appState.sectionHeaders.gamesWorked) || {
      tag: "COMPETITIVE ECOSYSTEMS",
      title: "GAMES WORKED WITH IN BROADCAST & TITLE DESIGN",
      subtitle: "Specialized in vMix multi-feed switching, custom GT Title scoreboards, and real-time observer telemetry across premier esports titles."
    };

    openEditModal({
      title: "✏️ EDIT GAMES ECOSYSTEMS SUBHEADER",
      fields: [
        { key: 'tag', label: 'Ecosystem Badge / Tag (e.g. COMPETITIVE ECOSYSTEMS)', value: cur.tag, type: 'text' },
        { key: 'title', label: 'Section Headline (e.g. GAMES WORKED WITH IN BROADCAST & TITLE DESIGN)', value: cur.title, type: 'text' },
        { 
          key: 'titleFont', 
          label: 'Headline Font', 
          value: cur.titleFont || '', 
          type: 'select', 
          options: [{ value: '', name: 'Default Heading Font' }, ...FONT_OPTIONS] 
        },
        { key: 'subtitle', label: 'Section Subtitle Description', value: cur.subtitle, type: 'textarea' }
      ],
      onSave: (vals) => {
        if (!appState.sectionHeaders) appState.sectionHeaders = {};
        appState.sectionHeaders.gamesWorked = Object.assign({}, cur, vals);
        saveState();
        renderSectionHeaders();
        showBroadcastToast('✅ Games section subheader updated!');
      }
    });
  }

  function openGamesEditModal(editIndex = -1) {
    if (!requireAdminAuth()) return;
    const games = appState.workedGames || (window.portfolioData && window.portfolioData.workedGames) || [];
    const isEditing = editIndex >= 0 && games[editIndex];
    const game = isEditing ? games[editIndex] : {
      id: `game-${Date.now()}`,
      name: '',
      publisher: '',
      badge: 'PRO CIRCUIT',
      badgeColor: 'cyan',
      icon: '🎮',
      role: 'Assistant Producer & GT Title Designer',
      tournaments: '',
      description: '',
      stats: '50+ Matches',
      tools: 'vMix • GT Titles • OBS'
    };

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <h3 style="font-size: 1.4rem; color: var(--accent-cyan); font-family: var(--font-heading); margin: 0;">
            🎮 ${isEditing ? 'EDIT ESPORTS GAME TITLE' : 'ADD NEW ESPORTS GAME TITLE'}
          </h3>
          <span class="font-mono" style="font-size: 0.72rem; color: var(--accent-cyan); padding: 4px 10px; background: rgba(0,240,255,0.1); border-radius: var(--radius-chamfer-sm); border: 1px solid var(--accent-cyan);">
            GAME ECOSYSTEMS
          </span>
        </div>

        <form id="gameEditForm">
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Game Title (e.g. GARENA FREE FIRE, TENCENT PUBG MOBILE)</label>
              <input type="text" id="g_name" class="form-input" value="${game.name}" placeholder="GARENA FREE FIRE" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Icon / Emoji or Logo Image</label>
              <div style="display: flex; gap: 6px;">
                <input type="text" id="g_icon" class="form-input" value="${game.icon || '🎮'}" placeholder="🔥 or URL" style="flex: 1;" required />
                <label class="btn btn-secondary btn-sm" style="margin: 0; padding: 4px 8px; font-size: 0.72rem; cursor: pointer; display: inline-flex; align-items: center;">
                  <span>📁</span>
                  <input type="file" id="g_icon_file" accept="image/*" style="display: none;" />
                </label>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Publisher / Rights Holder</label>
              <input type="text" id="g_publisher" class="form-input" value="${game.publisher}" placeholder="Garena / Tencent Games" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Circuit Badge &amp; Accent</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="g_badge" class="form-input" value="${game.badge || 'TIER 1'}" style="flex: 2;" required />
                <select id="g_badgeColor" class="form-input" style="flex: 1;">
                  <option value="cyan" ${game.badgeColor === 'cyan' ? 'selected' : ''}>Cyan</option>
                  <option value="purple" ${game.badgeColor === 'purple' ? 'selected' : ''}>Purple</option>
                  <option value="gold" ${game.badgeColor === 'gold' ? 'selected' : ''}>Gold</option>
                  <option value="emerald" ${game.badgeColor === 'emerald' ? 'selected' : ''}>Emerald</option>
                  <option value="red" ${game.badgeColor === 'red' ? 'selected' : ''}>Red</option>
                </select>
              </div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Broadcast Role Handled</label>
              <input type="text" id="g_role" class="form-input" value="${game.role}" placeholder="GT Title Designer & Assistant Producer" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Match Stats / Metric</label>
              <input type="text" id="g_stats" class="form-input" value="${game.stats}" placeholder="150+ Broadcast Matches" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Tournaments &amp; Championships Covered</label>
            <input type="text" id="g_tournaments" class="form-input" value="${game.tournaments}" placeholder="FFWS BD (Fall & Spring) • Free Fire World Series" required />
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Production Responsibilities &amp; Graphic Deliverables</label>
            <textarea id="g_desc" class="form-input" rows="3" placeholder="Engineered custom animated GT Title scoreboards, live survivor trackers, map feeds...">${game.description}</textarea>
          </div>

          <div class="form-group" style="margin-bottom: 18px;">
            <label class="form-label">Tools &amp; Graphics Engines (bullet separated by •)</label>
            <input type="text" id="g_tools" class="form-input" value="${game.tools}" placeholder="vMix GT Titles • Singular.live • OBS Telemetry" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <div>
              ${isEditing ? `<button type="button" class="btn btn-secondary btn-sm" id="deleteGameBtn" style="color: var(--accent-red); border-color: rgba(255,42,85,0.4);">🗑️ DELETE GAME</button>` : ''}
            </div>
            <div style="display: flex; gap: 12px;">
              <button type="button" class="btn btn-secondary btn-sm" id="cancelGameEditBtn">CANCEL</button>
              <button type="submit" class="btn btn-primary btn-sm">SAVE GAME</button>
            </div>
          </div>
        </form>

        <!-- List of Existing Games to Quickly Select -->
        ${games.length > 0 ? `
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed rgba(255,255,255,0.12);">
            <div class="font-mono" style="font-size: 0.72rem; color: var(--accent-cyan); margin-bottom: 10px;">ALL CURRENT GAME TITLES (CLICK TO EDIT):</div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${games.map((g, idx) => `
                <button type="button" class="btn btn-secondary btn-sm quick-edit-game-btn" data-idx="${idx}" style="font-size: 0.76rem; padding: 4px 10px; ${idx === editIndex ? 'border-color: var(--accent-cyan); color: #fff; background: rgba(0,240,255,0.12);' : ''}">
                  ${g.icon || '🎮'} ${g.name}
                </button>
              `).join('')}
              <button type="button" class="btn btn-primary btn-sm" id="addNewGameFromModalBtn" style="font-size: 0.76rem; padding: 4px 10px;">
                ➕ ADD NEW
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById('g_icon_file')?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          document.getElementById('g_icon').value = re.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    document.querySelectorAll('.quick-edit-game-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        openGamesEditModal(idx);
      });
    });

    document.getElementById('addNewGameFromModalBtn')?.addEventListener('click', () => {
      openGamesEditModal(-1);
    });

    document.getElementById('cancelGameEditBtn')?.addEventListener('click', closeModals);

    document.getElementById('deleteGameBtn')?.addEventListener('click', () => {
      if (confirm(`Delete ${game.name} from worked games?`)) {
        appState.workedGames.splice(editIndex, 1);
        saveState();
        renderWorkedGames();
        closeModals();
        showBroadcastToast('🗑️ Game title deleted.');
      }
    });

    document.getElementById('gameEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedGame = {
        id: game.id || `game-${Date.now()}`,
        name: document.getElementById('g_name').value.trim(),
        publisher: document.getElementById('g_publisher').value.trim(),
        badge: document.getElementById('g_badge').value.trim() || 'PRO CIRCUIT',
        badgeColor: document.getElementById('g_badgeColor').value,
        icon: document.getElementById('g_icon').value.trim() || '🎮',
        role: document.getElementById('g_role').value.trim(),
        tournaments: document.getElementById('g_tournaments').value.trim(),
        description: document.getElementById('g_desc').value.trim(),
        stats: document.getElementById('g_stats').value.trim(),
        tools: document.getElementById('g_tools').value.trim()
      };

      if (!Array.isArray(appState.workedGames)) appState.workedGames = [];
      if (isEditing) {
        appState.workedGames[editIndex] = updatedGame;
      } else {
        appState.workedGames.push(updatedGame);
      }

      saveState();
      renderWorkedGames();
      closeModals();
      showBroadcastToast('✅ Game card saved!');
    });

    if (window.PaperAudio && PaperAudio.playPaperPageFlip) PaperAudio.playPaperPageFlip();
    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function setupMetricsInteractions() {
    // Toolbar buttons (Matches user screenshot 1)
    document.getElementById('editMetricsStatsBtn')?.addEventListener('click', openMetricsStatsEditModal);
    document.getElementById('addNewMetricCardBtn')?.addEventListener('click', () => openMetricCardEditModal(-1));
    document.getElementById('addNewGameBtn')?.addEventListener('click', () => openGamesEditModal(-1));
    document.getElementById('replayCountersBtn')?.addEventListener('click', () => {
      runCountersAnimation();
    });

    // Section header edit button in toolbar [data-section="metrics"]
    document.querySelectorAll('#metrics [data-section="metrics"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSectionHeaderModal('metrics');
      });
    });

    // Subheader buttons for games
    document.getElementById('editGamesHeaderBtn')?.addEventListener('click', openGamesHeaderEditModal);
    document.getElementById('addNewGameHeaderBtn')?.addEventListener('click', () => openGamesEditModal(-1));
    document.getElementById('manageGamesBtn')?.addEventListener('click', () => openGamesEditModal(0));

    // Direct section action bar buttons (inside metrics segment)
    document.getElementById('addNewMetricCardDirectBtn')?.addEventListener('click', () => openMetricCardEditModal(-1));
    document.getElementById('editAllMetricsDirectBtn')?.addEventListener('click', openMetricsStatsEditModal);
    document.getElementById('replayCountersDirectBtn')?.addEventListener('click', () => {
      runCountersAnimation();
    });

    // Direct inline editable listeners for Games Subheader elements
    ['gamesWorkedSectionTag', 'gamesWorkedSectionTitle', 'gamesWorkedSectionSub'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.setAttribute('data-direct-editable', 'true');
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          const fieldMap = {
            'gamesWorkedSectionTag': 'tag',
            'gamesWorkedSectionTitle': 'title',
            'gamesWorkedSectionSub': 'subtitle'
          };
          const field = fieldMap[id];
          makeElementDirectEditable(el, (newVal) => {
            if (!appState.sectionHeaders.gamesWorked) appState.sectionHeaders.gamesWorked = {};
            appState.sectionHeaders.gamesWorked[field] = newVal;
            saveState();
            showBroadcastToast(`✓ Updated Games subheader ${field}`);
          });
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // HERO SEGMENT RENDERING
  // --------------------------------------------------------------------------
  function renderHero() {
    const { personalInfo } = appState;
    renderSectionHeaders();

    if (elements.heroProfileImage && personalInfo.profileImage) {
      elements.heroProfileImage.src = personalInfo.profileImage;
    }

    if (elements.heroTagline) {
      elements.heroTagline.textContent = `"${personalInfo.tagline}"`;
    }

    if (elements.heroIntro) {
      elements.heroIntro.textContent = personalInfo.shortIntro;
      if (appState.sectionHeaders && appState.sectionHeaders.hero && appState.sectionHeaders.hero.bioFont) {
        elements.heroIntro.style.fontFamily = appState.sectionHeaders.hero.bioFont;
      }
    }

    if (elements.heroMetadata) {
      elements.heroMetadata.innerHTML = `
        <div class="meta-chip meta-chip-editable" data-field="currentRole" title="Click to edit Current Role">
          <div class="meta-chip-label">Current Role <span class="meta-chip-edit-icon">✏️</span></div>
          <div class="meta-chip-value">${personalInfo.currentRole || 'Assistant Producer'}</div>
        </div>
        <div class="meta-chip meta-chip-editable" data-field="currentCompany" title="Click to edit Production Agency">
          <div class="meta-chip-label">Production Agency <span class="meta-chip-edit-icon">✏️</span></div>
          <div class="meta-chip-value">${personalInfo.currentCompany || 'ECUBE (Event Execution Experts)'}</div>
        </div>
        <div class="meta-chip meta-chip-editable" data-field="basedIn" title="Click to edit Based in / Location">
          <div class="meta-chip-label">Based in <span class="meta-chip-edit-icon">✏️</span></div>
          <div class="meta-chip-value">${personalInfo.basedIn || 'Dhaka, Bangladesh'}</div>
        </div>
        <div class="meta-chip meta-chip-editable" data-field="primaryTools" title="Click to edit Primary Tools">
          <div class="meta-chip-label">Primary Tools <span class="meta-chip-edit-icon">✏️</span></div>
          <div class="meta-chip-value text-cyan">${personalInfo.primaryTools || 'vMix • OBS • GT Titles'}</div>
        </div>
      `;

      elements.heroMetadata.querySelectorAll('.meta-chip-editable').forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.stopPropagation();
          openHeroMetadataEditModal();
        });
      });
    }
    setTimeout(() => applyWordFxToDOM(document.getElementById('hero')), 20);
  }

  // --------------------------------------------------------------------------
  // HERO FLOATING BADGE & METADATA MODALS
  // --------------------------------------------------------------------------
  function openFloatingBadgeEditModal() {
    if (!requireAdminAuth()) return;
    const heroHeaders = (appState.sectionHeaders && appState.sectionHeaders.hero) || {};
    let currentBadgeLogo = heroHeaders.companyLogo || 'assets/images/ecube-logo.png';

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <h3 style="font-size: 1.4rem; color: var(--accent-cyan); font-family: var(--font-heading); margin: 0;">
            ⚡ EDIT FLOATING BADGE &amp; LOGO
          </h3>
          <span class="font-mono" style="font-size: 0.72rem; color: var(--accent-cyan); padding: 4px 10px; background: rgba(0,240,255,0.1); border-radius: var(--radius-chamfer-sm); border: 1px solid var(--accent-cyan);">
            HERO BAR CONTROLLER
          </span>
        </div>

        <form id="floatingBadgeEditForm">
          <!-- Badge Roles -->
          <div style="padding: 16px; background: rgba(0,240,255,0.04); border: 1px solid rgba(0,240,255,0.25); border-radius: var(--radius-chamfer-sm); margin-bottom: 18px;">
            <div style="font-family: var(--font-heading); color: var(--accent-cyan); font-size: 0.85rem; font-weight: 800; margin-bottom: 12px;">
              BADGE ROLES &amp; TITLE
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Role Title (Main Header)</label>
                <input type="text" id="fb_role" class="form-input" value="${heroHeaders.companyBadgeRole || 'ASSISTANT PRODUCER'}" required />
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Subtitle / Specialization</label>
                <input type="text" id="fb_sub" class="form-input" value="${heroHeaders.companyBadgeSub || 'GT Titles & Live Graphics'}" required />
              </div>
            </div>

            <!-- Badge Logo Upload -->
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed rgba(255,255,255,0.1); display: flex; align-items: center; gap: 14px;">
              <div id="fb_logo_preview" class="company-logo-badge">
                ${currentBadgeLogo ? `<div class="ecube-logo-inner-wrapper"><img src="${currentBadgeLogo}" class="ecube-animated-logo" alt="Logo" /><div class="ecube-inner-sheen" style="-webkit-mask-image: url('${currentBadgeLogo}'); mask-image: url('${currentBadgeLogo}');"></div></div>` : '⚡'}
              </div>
              <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                  <span>📁 UPLOAD LOGO</span>
                  <input type="file" id="fb_logo_file" accept="image/*" style="display: none;" />
                </label>
                <button type="button" class="btn btn-secondary btn-sm" id="fb_remove_logo_btn" style="${currentBadgeLogo ? '' : 'display: none;'}">✕ REMOVE LOGO</button>
              </div>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelFbEditBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm">SAVE CHANGES</button>
          </div>
        </form>
      </div>
    `;

    const logoInput = document.getElementById('fb_logo_file');
    const removeLogoBtn = document.getElementById('fb_remove_logo_btn');
    const previewBox = document.getElementById('fb_logo_preview');

    logoInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          currentBadgeLogo = ev.target.result;
          if (previewBox) {
            previewBox.innerHTML = `<div class="ecube-logo-inner-wrapper"><img src="${currentBadgeLogo}" class="ecube-animated-logo" alt="Logo" /><div class="ecube-inner-sheen" style="-webkit-mask-image: url('${currentBadgeLogo}'); mask-image: url('${currentBadgeLogo}');"></div></div>`;
          }
          if (removeLogoBtn) removeLogoBtn.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
      }
    });

    removeLogoBtn?.addEventListener('click', () => {
      currentBadgeLogo = '';
      if (previewBox) previewBox.textContent = '⚡';
      removeLogoBtn.style.display = 'none';
    });

    document.getElementById('cancelFbEditBtn')?.addEventListener('click', closeModals);

    document.getElementById('floatingBadgeEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!appState.sectionHeaders) appState.sectionHeaders = {};
      if (!appState.sectionHeaders.hero) appState.sectionHeaders.hero = {};

      const h = appState.sectionHeaders.hero;
      h.companyBadgeRole = document.getElementById('fb_role').value.trim() || 'ASSISTANT PRODUCER';
      h.companyBadgeSub = document.getElementById('fb_sub').value.trim() || 'GT Titles & Live Graphics';
      h.companyLogo = currentBadgeLogo;

      saveState();
      renderSectionHeaders();
      closeModals();
      showBroadcastToast('✅ Floating badge and logo updated!');
    });

    if (window.PaperAudio && PaperAudio.playPaperPageFlip) PaperAudio.playPaperPageFlip();
    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function openHeroMetadataEditModal() {
    if (!requireAdminAuth()) return;
    const { personalInfo } = appState;

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
          <h3 style="font-size: 1.4rem; color: var(--accent-cyan); font-family: var(--font-heading); margin: 0;">
            ✏️ EDIT PRODUCTION DETAILS &amp; METRICS
          </h3>
          <span class="font-mono" style="font-size: 0.72rem; color: var(--accent-cyan); padding: 4px 10px; background: rgba(0,240,255,0.1); border-radius: var(--radius-chamfer-sm); border: 1px solid var(--accent-cyan);">
            HERO INFO CHIPS
          </span>
        </div>

        <form id="heroMetadataEditForm">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Current Role</label>
              <input type="text" id="meta_current_role" class="form-input" value="${personalInfo.currentRole || 'Assistant Producer'}" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Production Agency / Company</label>
              <input type="text" id="meta_current_company" class="form-input" value="${personalInfo.currentCompany || 'ECUBE (Event Execution Experts)'}" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Based in / Location</label>
              <input type="text" id="meta_based_in" class="form-input" value="${personalInfo.basedIn || 'Dhaka, Bangladesh'}" required />
            </div>
            <div class="form-group" style="margin-bottom: 0;">
              <label class="form-label">Primary Tools</label>
              <input type="text" id="meta_primary_tools" class="form-input" value="${personalInfo.primaryTools || 'vMix • OBS • GT Titles'}" required />
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelHeroMetaEditBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm">SAVE CHANGES</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('cancelHeroMetaEditBtn')?.addEventListener('click', closeModals);

    document.getElementById('heroMetadataEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      personalInfo.currentRole = document.getElementById('meta_current_role').value.trim() || 'Assistant Producer';
      personalInfo.currentCompany = document.getElementById('meta_current_company').value.trim() || 'ECUBE (Event Execution Experts)';
      personalInfo.basedIn = document.getElementById('meta_based_in').value.trim() || 'Dhaka, Bangladesh';
      personalInfo.primaryTools = document.getElementById('meta_primary_tools').value.trim() || 'vMix • OBS • GT Titles';

      saveState();
      renderHero();
      closeModals();
      showBroadcastToast('✅ Production details updated!');
    });

    if (window.PaperAudio && PaperAudio.playPaperPageFlip) PaperAudio.playPaperPageFlip();
    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // ABOUT ME SEGMENT RENDERING (CORE PILLARS WITH ICONS & CUSTOM LOGOS)
  // --------------------------------------------------------------------------
  function renderAbout() {
    const { personalInfo } = appState;

    if (elements.aboutProfileImage && (personalInfo.aboutImage || personalInfo.profileImage)) {
      elements.aboutProfileImage.src = personalInfo.aboutImage || personalInfo.profileImage;
    }

    if (elements.aboutStatement) {
      elements.aboutStatement.textContent = personalInfo.aboutStatement;
    }

    if (elements.pillarsGrid && personalInfo.corePillars) {
      elements.pillarsGrid.innerHTML = personalInfo.corePillars.map((p, pIndex) => `
        <div class="pillar-card hud-card" data-index="${pIndex}">
          <div class="pillar-card-header">
            <div class="pillar-icon-box">
              ${p.logo ? `<img src="${p.logo}" class="pillar-custom-logo" alt="${p.title}" />` : `<span class="pillar-icon-symbol">${p.icon || '⚡'}</span>`}
            </div>
            <div class="pillar-title">${p.title}</div>
            <div class="pillar-card-actions">
              <button class="pillar-mini-btn edit-pillar-btn" data-index="${pIndex}" title="Edit text, icon or upload custom logo">✏️</button>
              <button class="pillar-mini-btn del-btn delete-pillar-btn" data-index="${pIndex}" title="Delete pillar">🗑️</button>
            </div>
          </div>
          <div class="pillar-desc">${p.desc}</div>
        </div>
      `).join('');

      attachPillarEvents();
    }
  }

  function attachPillarEvents() {
    document.querySelectorAll('.edit-pillar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        openPillarEditModal(idx);
      });
    });

    document.querySelectorAll('.delete-pillar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const p = appState.personalInfo.corePillars[idx];
        if (confirm(`Delete pillar "${p.title}"?`)) {
          appState.personalInfo.corePillars.splice(idx, 1);
          saveState();
          renderAbout();
        }
      });
    });
    setTimeout(() => applyWordFxToDOM(document.getElementById('about')), 20);
  }

  // --------------------------------------------------------------------------
  // WHERE I'VE PRODUCED (PRIMARY PORTFOLIO) RENDERING
  // Interface: [TOURNAMENT NAME] UNDER [COMPANY/AGENCY]
  // --------------------------------------------------------------------------
  function renderProductions() {
    if (!elements.productionsGrid) return;
    const { productions } = appState;

    elements.productionsGrid.innerHTML = productions.map((item, index) => {
      const photos = Array.isArray(item.photos) ? item.photos : [];
      return `
      <div class="production-card hud-card" data-index="${index}" id="${item.id}">
        
        <!-- Banner & Badges -->
        <div class="production-banner-wrap">
          <img src="${item.banner}" alt="${item.title}" id="prodBanner-${index}" class="production-banner-bg" loading="lazy" />
          
          <div class="production-badge-bar">
            ${item.logo ? `<img src="${item.logo}" class="prod-banner-logo-badge prod-logo-click-trigger" data-index="${index}" alt="${item.title} Logo" title="Tournament Logo - Click to change" />` : ''}
          </div>
        </div>

        <!-- Body -->
        <div class="production-card-body">
          <!-- Tournament Title -->
          <h3 class="production-tournament-title" style="${item.titleFont ? `font-family: ${item.titleFont};` : ''}">${item.title}</h3>

          <!-- Agency Tag: UNDER ECUBE -->
          <div class="production-agency-tag">
            <span class="text-cyan">■</span>
            <span>${item.agency}</span>
            <span style="font-size: 0.8rem; opacity: 0.7; font-family: var(--font-mono); font-weight: 400;">(${item.game}${item.date ? ` • ${item.date}` : ''})</span>
          </div>

          <!-- My Role -->
          <div class="production-role-pill">
            <span class="text-cyan">ROLE:</span> ${item.role}
          </div>

          <!-- Description -->
          <p class="production-desc">${item.description}</p>

          <!-- Key Highlights -->
          ${item.highlights && item.highlights.length ? `
            <ul class="production-highlights-list">
              ${item.highlights.map(h => `<li>${h}</li>`).join('')}
            </ul>
          ` : ''}

          <!-- Event Photos Gallery Strip -->
          <div class="prod-photos-block">
            <div class="prod-photos-label">
              <span>📸 EVENT PHOTOS &amp; VOD FRAMES (${photos.length})</span>
              <span style="font-size: 0.7rem; color: var(--text-muted); font-family: var(--font-mono); font-weight: 400;">CLICK TO EXPAND • + TO UPLOAD</span>
            </div>
            
            <div class="prod-photos-strip">
              ${photos.length > 0 ? photos.map((imgUrl, pIndex) => `
                <div class="prod-photo-thumb" data-prod-index="${index}" data-photo-index="${pIndex}" data-src="${imgUrl}" title="Click to view full photo">
                  <img src="${imgUrl}" alt="${item.title} photo #${pIndex + 1}" loading="lazy" />
                  <button class="prod-photo-del-btn" data-prod-index="${index}" data-photo-index="${pIndex}" title="Remove this photo">✕</button>
                </div>
              `).join('') : `
                <span class="prod-photos-empty">No photos added yet. Use "+ ADD PIC" to add event pictures.</span>
              `}

              <!-- Add Photo Tile directly inside the strip -->
              <label class="prod-photo-add-tile" title="Upload photos for ${item.title}">
                <span style="font-size: 1.15rem; line-height: 1;">➕</span>
                <span>ADD PIC</span>
                <input type="file" multiple accept="image/*" class="prod-add-photo-input" data-index="${index}" style="display: none;" />
              </label>
            </div>
          </div>

          <!-- Video / Live Broadcast Trigger & Link Editor -->
          <div class="prod-trigger-row" style="margin-top: auto; display: flex; gap: 8px; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--border-subtle); flex-wrap: wrap;">
            <div style="display: inline-flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              <a href="${item.liveLink || item.videoUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm play-prod-video-btn" data-index="${index}" data-title="${item.title}" title="Auto-open live broadcast in new tab">
                <span>WATCH BROADCAST</span>
                <span>▶</span>
              </a>
              <button class="btn btn-outline btn-sm edit-prod-live-link-btn" data-index="${index}" title="Edit broadcast live stream link">
                <span>✏️ EDIT LINK</span>
              </button>
            </div>
            <span class="font-mono text-muted" style="font-size: 0.75rem;">📍 ${item.location}</span>
          </div>
        </div>

        <!-- Upload & Edit Tool Bar on Every Card -->
        <div class="card-action-bar">
          <button class="card-action-btn edit-prod-live-link-btn" data-index="${index}" title="Edit live broadcast stream URL">
            <span>🔗 LIVE LINK</span>
          </button>
          <label class="card-action-btn" title="Upload new banner image for this event">
            <span>📷 BANNER</span>
            <input type="file" accept="image/*" class="prod-banner-input" data-index="${index}" style="display: none;" />
          </label>
          <label class="card-action-btn" title="Add event photos from your device">
            <span>🖼️ ADD PHOTOS</span>
            <input type="file" multiple accept="image/*" class="prod-add-photo-input" data-index="${index}" style="display: none;" />
          </label>
          <label class="card-action-btn" title="Upload tournament broadcast video file">
            <span>🎬 UPLOAD VIDEO</span>
            <input type="file" accept="video/*" class="prod-video-file-input" data-index="${index}" style="display: none;" />
          </label>
          <button class="card-action-btn edit-prod-badge-logo-btn" data-index="${index}" title="Upload or change tournament logo emblem">
            <span>🏷️ LOGO</span>
          </button>
          <button class="card-action-btn edit-prod-text-btn" data-index="${index}" title="Edit tournament title, role, or description">
            <span>✏️ DETAILS</span>
          </button>
          <button class="card-action-btn delete-prod-btn" data-index="${index}" style="margin-left: auto; color: var(--accent-red);" title="Delete this production card">
            <span>🗑️</span>
          </button>
        </div>

      </div>
    `;
    }).join('');

    attachProductionEvents();
    if (window.rebindInteractiveEffects) window.rebindInteractiveEffects();
  }

  function attachProductionEvents() {
    // 1. Play video buttons -> auto-go to live link!
    document.querySelectorAll('.play-prod-video-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const prod = appState.productions[index];
        if (!prod) return;

        const liveUrl = (prod.liveLink || prod.videoUrl || '').trim();

        if (liveUrl && (liveUrl.startsWith('http://') || liveUrl.startsWith('https://'))) {
          PaperAudio.playPaperRip();
          // Native <a> tag target="_blank" handles opening live link directly in new tab
          return;
        }

        // If local video uploaded in IndexedDB and no external live URL
        if (prod.videoStorageKey) {
          e.preventDefault();
          openVideoPlayer(prod.videoStorageKey, prod.title, {
            event: `${prod.title} ${prod.agency}`,
            role: prod.role,
            description: prod.description,
            storageKey: prod.videoStorageKey
          });
          return;
        }

        // No link configured yet -> open edit modal directly to let user set it!
        e.preventDefault();
        PaperAudio.playPaperRip();
        openLiveLinkEditModal(index);
      });
    });

    // 1b. Direct edit live link buttons
    document.querySelectorAll('.edit-prod-live-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        PaperAudio.playPaperRip();
        openLiveLinkEditModal(index);
      });
    });

    // 2. Click thumbnail to open Photo Lightbox Modal
    document.querySelectorAll('.prod-photo-thumb').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        if (e.target.closest('.prod-photo-del-btn')) return;
        const prodIndex = parseInt(thumb.getAttribute('data-prod-index'), 10);
        const photoIndex = parseInt(thumb.getAttribute('data-photo-index'), 10);
        openPhotoLightbox(prodIndex, photoIndex);
      });
    });

    // 3. Delete individual photo button
    document.querySelectorAll('.prod-photo-del-btn').forEach(delBtn => {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodIndex = parseInt(delBtn.getAttribute('data-prod-index'), 10);
        const photoIndex = parseInt(delBtn.getAttribute('data-photo-index'), 10);
        const prod = appState.productions[prodIndex];
        if (confirm(`Remove this photo from "${prod.title}"?`)) {
          prod.photos.splice(photoIndex, 1);
          saveState();
          renderProductions();
        }
      });
    });

    // 4. Add photo(s) input handler
    document.querySelectorAll('.prod-add-photo-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const readFileAsDataURL = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        try {
          const loadedDataUrls = await Promise.all(files.map(readFileAsDataURL));
          if (!appState.productions[index].photos) {
            appState.productions[index].photos = [];
          }
          appState.productions[index].photos.push(...loadedDataUrls);
          saveState();
          renderProductions();
          alert(`Added ${loadedDataUrls.length} picture(s) to "${appState.productions[index].title}"!`);
        } catch (err) {
          console.error('Error uploading photos:', err);
          alert('Could not process some image files. Please try again.');
        }
      });
    });

    // 5. Upload banner input handlers
    document.querySelectorAll('.prod-banner-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            appState.productions[index].banner = ev.target.result;
            saveState();
            renderProductions();
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // 6. Edit Live Badges & Tournament Logo
    document.querySelectorAll('.prod-editable-badge, .prod-logo-click-trigger').forEach(badge => {
      badge.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        openTournamentBadgesModal(index);
      });
    });

    document.querySelectorAll('.edit-prod-badge-logo-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        openTournamentBadgesModal(index);
      });
    });

    // 7. Direct Broadcast Video File Upload (No Links)
    document.querySelectorAll('.prod-video-file-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const file = e.target.files && e.target.files[0];
        if (file) {
          const prod = appState.productions[index];
          const vidId = `prod-vid-${Date.now()}`;
          try {
            await VideoStorage.saveVideo(vidId, file, { name: file.name, title: prod.title });
            prod.videoStorageKey = vidId;
            prod.videoUrl = ''; // Clear legacy external URL
            saveState();
            PaperAudio.playPaperStamp();
            renderProductions();
            alert(`Video file "${file.name}" attached to "${prod.title}"! Click "WATCH BROADCAST" to play.`);
          } catch (err) {
            console.error('Error uploading production video:', err);
            alert('Could not process video file. Please try again.');
          }
        }
      });
    });

    // 8. Edit Details
    document.querySelectorAll('.edit-prod-text-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        openProductionEditModal(index);
      });
    });

    // 9. Delete Production
    document.querySelectorAll('.delete-prod-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        if (confirm(`Are you sure you want to delete "${appState.productions[index].title}"?`)) {
          appState.productions.splice(index, 1);
          saveState();
          renderProductions();
        }
      });
    });
    setTimeout(() => applyWordFxToDOM(document.getElementById('productions')), 20);
  }

  // --------------------------------------------------------------------------
  // EVENT PHOTO LIGHTBOX CONTROLLER
  // --------------------------------------------------------------------------
  let activeLightbox = {
    prodIndex: 0,
    photoIndex: 0
  };

  function openPhotoLightbox(prodIndex, photoIndex) {
    activeLightbox.prodIndex = prodIndex;
    activeLightbox.photoIndex = photoIndex;
    updateLightboxUI();

    PaperAudio.playPaperPageFlip();

    if (elements.photoLightboxModal) {
      elements.photoLightboxModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function updateLightboxUI() {
    const prod = appState.productions[activeLightbox.prodIndex];
    if (!prod || !prod.photos || prod.photos.length === 0) {
      closeModals();
      return;
    }

    if (activeLightbox.photoIndex >= prod.photos.length) activeLightbox.photoIndex = 0;
    if (activeLightbox.photoIndex < 0) activeLightbox.photoIndex = prod.photos.length - 1;

    const currentImg = prod.photos[activeLightbox.photoIndex];
    if (elements.lightboxPhotoImg) elements.lightboxPhotoImg.src = currentImg;
    if (elements.lightboxPhotoCaption) elements.lightboxPhotoCaption.textContent = prod.title;
    if (elements.lightboxPhotoSub) elements.lightboxPhotoSub.textContent = `${prod.agency} • ${prod.game} (${prod.date})`;
    if (elements.lightboxPhotoCounter) elements.lightboxPhotoCounter.textContent = `PHOTO ${activeLightbox.photoIndex + 1} / ${prod.photos.length}`;
  }

  function nextLightboxPhoto() {
    const prod = appState.productions[activeLightbox.prodIndex];
    if (!prod || !prod.photos || prod.photos.length <= 1) return;
    activeLightbox.photoIndex = (activeLightbox.photoIndex + 1) % prod.photos.length;
    updateLightboxUI();
    PaperAudio.playPaperPageFlip();
  }

  function prevLightboxPhoto() {
    const prod = appState.productions[activeLightbox.prodIndex];
    if (!prod || !prod.photos || prod.photos.length <= 1) return;
    activeLightbox.photoIndex = (activeLightbox.photoIndex - 1 + prod.photos.length) % prod.photos.length;
    updateLightboxUI();
    PaperAudio.playPaperPageFlip();
  }

  // --------------------------------------------------------------------------
  // BULK & SINGLE VIDEO UPLOAD HANDLERS (INDEXEDDB POWERED, ZERO LINKS)
  // --------------------------------------------------------------------------
  async function handleBulkVideoUpload(files) {
    if (!files || files.length === 0) return;

    // UI targets: station queue & legacy progress bar
    const queueWrap = document.getElementById('bulkUploadQueueWrap');
    const queueBar = document.getElementById('bulkQueueProgressBar');
    const queuePercent = document.getElementById('bulkQueuePercent');
    const queueTitle = document.getElementById('bulkQueueStatusTitle');
    const queueLog = document.getElementById('bulkQueueLogText');
    const queueList = document.getElementById('bulkQueueItemsList');

    const progressWrap = elements.videoUploadProgressWrap;
    const progressBar = elements.videoUploadProgressBar;
    const progressPercent = elements.videoUploadProgressPercent;
    const progressTitle = elements.videoUploadProgressTitle;
    const progressSub = elements.videoUploadProgressSub;

    if (queueWrap) {
      queueWrap.style.display = 'block';
      if (queueList) queueList.innerHTML = '';
    }
    if (progressWrap) progressWrap.style.display = 'block';

    const defaultEvent = document.getElementById('bulkDefaultEventInput')?.value.trim() || 'FFWS BD 2026 // LIVE REEL';
    const defaultRole = document.getElementById('bulkDefaultRoleInput')?.value.trim() || 'Assistant Producer & GT Title Designer';

    const total = files.length;
    let completed = 0;

    for (let i = 0; i < total; i++) {
      const file = files[i];
      const videoId = `vid-${Date.now()}-${i}`;
      const title = formatVideoTitle(file.name);

      const statusMsg = `INGESTING ${i + 1}/${total}: "${title.slice(0, 32)}" (${(file.size / (1024 * 1024)).toFixed(1)} MB)...`;
      if (queueTitle) queueTitle.textContent = statusMsg;
      if (queueLog) queueLog.textContent = `Extracting high-resolution thumbnail frame at 00:01 & calculating duration...`;
      if (progressTitle) progressTitle.textContent = statusMsg;
      if (progressSub) progressSub.textContent = `Processing video buffer in high-speed local storage...`;

      const percentVal = Math.round((i / total) * 100);
      if (queueBar) queueBar.style.width = `${percentVal}%`;
      if (queuePercent) queuePercent.textContent = `${percentVal}%`;
      if (progressBar) progressBar.style.width = `${percentVal}%`;
      if (progressPercent) progressPercent.textContent = `${percentVal}%`;

      try {
        // 1. Extract thumbnail frame and duration
        const meta = await extractVideoMetadataAndFrame(file);

        // 2. Save video file to IndexedDB
        await VideoStorage.saveVideo(videoId, file, { name: file.name, title: title });

        // 3. Add to appState.videos list
        const newVideoItem = {
          id: videoId,
          title: title,
          event: defaultEvent,
          role: defaultRole,
          duration: meta.duration || 'HD',
          thumbnail: meta.thumbnail,
          storageKey: videoId,
          description: `Master tournament broadcast reel for "${title}". Uploaded directly with high-definition playback.`
        };

        if (!Array.isArray(appState.videos)) {
          appState.videos = [];
        }
        appState.videos.unshift(newVideoItem);
        completed++;

        // Append to station queue HUD list
        if (queueList) {
          const itemDiv = document.createElement('div');
          itemDiv.className = 'bulk-queue-item';
          itemDiv.innerHTML = `
            <div class="bulk-queue-item-left">
              <img src="${meta.thumbnail || 'assets/images/event-control-room.jpg'}" class="bulk-queue-thumb" alt="${title}" />
              <div>
                <div class="bulk-queue-title">${title}</div>
                <div class="bulk-queue-badge font-mono">${(file.size / (1024 * 1024)).toFixed(1)} MB • ${meta.duration || 'HD'}</div>
              </div>
            </div>
            <span class="font-mono text-cyan" style="font-size: 0.78rem; font-weight: 800;">✓ INGESTED</span>
          `;
          queueList.appendChild(itemDiv);
        }
      } catch (err) {
        console.error('Failed to process video file:', file.name, err);
      }

      const finalPercent = Math.round(((i + 1) / total) * 100);
      if (queueBar) queueBar.style.width = `${finalPercent}%`;
      if (queuePercent) queuePercent.textContent = `${finalPercent}%`;
      if (progressBar) progressBar.style.width = `${finalPercent}%`;
      if (progressPercent) progressPercent.textContent = `${finalPercent}%`;
    }

    saveState();
    PaperAudio.playPaperStamp();
    renderVideos();

    if (queueTitle) queueTitle.textContent = `🎉 INGEST COMPLETE: ${completed} NEW VIDEO(S) READY TO WATCH!`;
    if (queueLog) queueLog.textContent = `All tournament showreels successfully stored in local client vault. Click any card below to play.`;
    if (progressTitle) progressTitle.textContent = `🎉 UPLOAD COMPLETE: ${completed} VIDEO(S) READY TO WATCH!`;
    if (progressSub) progressSub.textContent = `All uploaded videos are saved and can now be viewed immediately by clicking any card.`;

    setTimeout(() => {
      if (progressWrap) progressWrap.style.display = 'none';
    }, 3500);
  }

  async function handleSingleVideoUpload(file, replaceIndex = -1) {
    if (!file) return;
    const isReplacing = replaceIndex >= 0 && appState.videos[replaceIndex];
    const videoId = isReplacing && appState.videos[replaceIndex].storageKey
      ? appState.videos[replaceIndex].storageKey
      : `vid-${Date.now()}`;
    const title = isReplacing ? appState.videos[replaceIndex].title : formatVideoTitle(file.name);

    try {
      const meta = await extractVideoMetadataAndFrame(file);
      await VideoStorage.saveVideo(videoId, file, { name: file.name, title });

      if (isReplacing) {
        const item = appState.videos[replaceIndex];
        item.storageKey = videoId;
        item.duration = meta.duration || item.duration;
        item.thumbnail = meta.thumbnail || item.thumbnail;
        item.videoUrl = ''; // Clear legacy external link
      } else {
        const newItem = {
          id: videoId,
          title: title,
          event: 'FFWS BD // LIVE BROADCAST',
          role: 'Assistant Producer & GT Title Designer',
          duration: meta.duration || 'HD',
          thumbnail: meta.thumbnail,
          storageKey: videoId,
          description: `Master tournament broadcast reel: ${title}`
        };
        if (!Array.isArray(appState.videos)) appState.videos = [];
        appState.videos.unshift(newItem);
      }

      saveState();
      PaperAudio.playPaperStamp();
      renderVideos();
      alert(`Video file "${file.name}" uploaded successfully! Viewers can now play it immediately.`);
    } catch (e) {
      console.error('Error uploading video:', e);
      alert('Could not process video file. Please try again.');
    }
  }

  // --------------------------------------------------------------------------
  // EDIT VIDEO DETAILS MODAL (ZERO LINKS)
  // --------------------------------------------------------------------------
  function openVideoEditModal(index) {
    if (!requireAdminAuth()) return;
    const vid = appState.videos[index];
    if (!vid) return;

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <h3 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--accent-red); font-family: var(--font-heading);">
          ✏️ EDIT VIDEO DETAILS
        </h3>

        <form id="videoMetaEditForm">
          <div class="form-group">
            <label class="form-label">Video Title *</label>
            <input type="text" id="vid_edit_title" class="form-input" value="${vid.title || ''}" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div class="form-group">
              <label class="form-label">Event / Tournament Tag</label>
              <input type="text" id="vid_edit_event" class="form-input" value="${vid.event || ''}" placeholder="e.g. FFWS BD FALL 2026" />
            </div>
            <div class="form-group">
              <label class="form-label">Role Tag</label>
              <input type="text" id="vid_edit_role" class="form-input" value="${vid.role || ''}" placeholder="e.g. Assistant Producer" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Duration Display (e.g. 03:45 or HD)</label>
            <input type="text" id="vid_edit_duration" class="form-input" value="${vid.duration || 'HD'}" />
          </div>

          <div class="form-group">
            <label class="form-label">Description Overview</label>
            <textarea id="vid_edit_desc" class="form-textarea" rows="3">${vid.description || ''}</textarea>
          </div>

          <div style="padding: 14px; background: rgba(0, 240, 255, 0.04); border: 1.5px dashed var(--border-accent); border-radius: var(--radius-chamfer-sm); margin-bottom: 20px;">
            <div style="font-family: var(--font-heading); font-size: 0.85rem; font-weight: 800; color: var(--accent-cyan); letter-spacing: 0.04em; margin-bottom: 10px;">
              📁 VIDEO MEDIA ACTIONS (CLIENT VAULT)
            </div>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
              <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                <span>🎥 REPLACE VIDEO FILE</span>
                <input type="file" id="modalReplaceVideoFile" accept="video/*" style="display: none;" />
              </label>
              <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                <span>🖼️ CHANGE THUMBNAIL</span>
                <input type="file" id="modalReplaceThumbFile" accept="image/*" style="display: none;" />
              </label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelVidEditBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm">SAVE DETAILS</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('cancelVidEditBtn')?.addEventListener('click', closeModals);

    document.getElementById('modalReplaceVideoFile')?.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        closeModals();
        await handleSingleVideoUpload(file, index);
      }
    });

    document.getElementById('modalReplaceThumbFile')?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          vid.thumbnail = ev.target.result;
          saveState();
          renderVideos();
          alert('Thumbnail updated!');
        };
        reader.readAsDataURL(file);
      }
    });

    document.getElementById('videoMetaEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      vid.title = document.getElementById('vid_edit_title').value.trim();
      vid.event = document.getElementById('vid_edit_event').value.trim();
      vid.role = document.getElementById('vid_edit_role').value.trim();
      vid.duration = document.getElementById('vid_edit_duration').value.trim() || 'HD';
      vid.description = document.getElementById('vid_edit_desc').value.trim();
      saveState();
      renderVideos();
      closeModals();
    });

    PaperAudio.playPaperPageFlip();
    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // VIDEOS SHOWCASE RENDERING (DIRECT LOCAL PLAYBACK & VIEWING)
  // --------------------------------------------------------------------------
  function renderVideos() {
    if (!elements.videosGrid) return;
    const { videos } = appState;

    const countBadge = document.getElementById('bulkVideosCountBadge');
    if (countBadge) {
      const len = (videos || []).length;
      countBadge.textContent = `${len} SHOWREEL${len === 1 ? '' : 'S'} LOADED`;
    }

    if (!videos || videos.length === 0) {
      elements.videosGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: var(--bg-card); border: 2px dashed var(--border-accent); border-radius: var(--radius-chamfer-md); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);">
          <div style="font-size: 2.8rem; margin-bottom: 12px; filter: drop-shadow(0 0 16px var(--accent-cyan));">📁</div>
          <h3 style="font-family: var(--font-heading); color: var(--text-white); font-size: 1.4rem; letter-spacing: 0.04em; margin-bottom: 8px;">NO VIDEOS UPLOADED YET</h3>
          <p style="color: var(--text-secondary); max-width: 520px; margin: 0 auto 22px auto; font-size: 0.95rem; line-height: 1.6;">
            ${(typeof AdminAuthManager !== 'undefined' && AdminAuthManager.isAuthenticated)
              ? 'Use the <strong>"BROADCAST VIDEO INGESTION BAY"</strong> above to select multiple tournament showreels, GT title demos, or camera cuts directly from your computer!'
              : 'Official tournament showreels and broadcast archives will appear here once published by the Lead Producer.'}
          </p>
          ${(typeof AdminAuthManager !== 'undefined' && AdminAuthManager.isAuthenticated) ? `
          <label class="btn btn-primary btn-sm" style="cursor: pointer;">
            <span>📁 SELECT MULTIPLE VIDEO FILES</span>
            <input type="file" accept="video/*" multiple class="empty-state-bulk-vid" style="display: none;" />
          </label>` : ''}
        </div>
      `;
      if (typeof AdminAuthManager !== 'undefined' && AdminAuthManager.isAuthenticated) {
        document.querySelector('.empty-state-bulk-vid')?.addEventListener('change', (e) => {
          handleBulkVideoUpload(Array.from(e.target.files || []));
        });
      }
      return;
    }

    elements.videosGrid.innerHTML = videos.map((vid, index) => `
      <div class="video-card hud-card" data-index="${index}">
        <div class="video-thumb-container play-video-card-trigger" data-index="${index}" title="Click to watch ${vid.title}">
          <img src="${vid.thumbnail || 'assets/images/event-control-room.jpg'}" alt="${vid.title}" id="vidThumb-${index}" loading="lazy" />
          <div class="play-btn-overlay">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </div>
          <div class="video-duration-badge">${vid.duration || 'HD'}</div>
        </div>

        <div class="video-card-body">
          <h3 class="video-card-title play-video-card-trigger" data-index="${index}" style="cursor: pointer;" title="Click to play">${vid.title}</h3>
          <div class="video-card-event">⚡ ${vid.event} • <span class="text-secondary">${vid.role}</span></div>
          <p class="video-card-desc">${vid.description}</p>
        </div>

        <!-- Video Card Action Bar (Upload, Replace, Thumbnail, Edit Details, Delete - ZERO LINKS) -->
        <div class="card-action-bar">
          <label class="card-action-btn" title="Upload or replace video file for this card">
            <span>🎥 REPLACE VIDEO</span>
            <input type="file" accept="video/*" class="vid-replace-file-input" data-index="${index}" style="display: none;" />
          </label>
          <label class="card-action-btn" title="Upload custom thumbnail photo">
            <span>🖼️ THUMBNAIL</span>
            <input type="file" accept="image/*" class="vid-thumb-input" data-index="${index}" style="display: none;" />
          </label>
          <button class="card-action-btn edit-vid-meta-btn" data-index="${index}" title="Edit title and description">
            <span>✏️ DETAILS</span>
          </button>
          <button class="card-action-btn del-vid-btn" data-index="${index}" style="margin-left: auto; color: var(--accent-red);" title="Delete this video">
            <span>🗑️</span>
          </button>
        </div>
      </div>
    `).join('');

    // Attach click to play for cards & thumbnails
    document.querySelectorAll('.play-video-card-trigger').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        const index = parseInt(trigger.getAttribute('data-index'), 10);
        const vid = appState.videos[index];
        if (vid) {
          openVideoPlayer(vid.videoUrl || vid.storageKey, vid.title, vid);
        }
      });
    });

    // Replace video file directly from card
    document.querySelectorAll('.vid-replace-file-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const file = e.target.files && e.target.files[0];
        if (file) {
          await handleSingleVideoUpload(file, index);
        }
      });
    });

    // Upload thumbnail photo
    document.querySelectorAll('.vid-thumb-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            appState.videos[index].thumbnail = ev.target.result;
            saveState();
            renderVideos();
          };
          reader.readAsDataURL(file);
        }
      });
    });

    // Edit details (NO LINKS!)
    document.querySelectorAll('.edit-vid-meta-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        openVideoEditModal(index);
      });
    });

    // Delete video
    document.querySelectorAll('.del-vid-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
        const vid = appState.videos[index];
        if (confirm(`Delete video "${vid.title}"?`)) {
          if (vid.storageKey) {
            await VideoStorage.deleteVideo(vid.storageKey);
          }
          appState.videos.splice(index, 1);
          saveState();
          renderVideos();
        }
      });
    });

    if (window.rebindInteractiveEffects) window.rebindInteractiveEffects();
  }

  // --------------------------------------------------------------------------
  // CONTACT & SOCIAL LINKS
  // --------------------------------------------------------------------------
  function renderContact() {
    const { contactMethods, contactFormConfig, personalInfo } = appState;

    // 1. Render Contact Method Cards
    const methods = Array.isArray(contactMethods) && contactMethods.length > 0
      ? contactMethods
      : [
          { id: 'cm-email', label: 'DIRECT EMAIL', value: personalInfo.email || 'gunshot.broadcast@gmail.com', link: `mailto:${personalInfo.email || 'gunshot.broadcast@gmail.com'}`, icon: '✉️', logo: '' },
          { id: 'cm-phone', label: 'PHONE / WHATSAPP', value: personalInfo.phone || '+880 1700-000000', link: `tel:${(personalInfo.phone || '').replace(/[\s-]/g, '')}`, icon: '📞', logo: '' },
          { id: 'cm-location', label: 'BROADCAST BASE', value: personalInfo.location || 'Dhaka, Bangladesh', link: '', icon: '📍', logo: '' },
          { id: 'cm-discord', label: 'DISCORD COMMS HANDLE', value: personalInfo.discord || 'gunshot#0001', link: 'https://discord.com', icon: '🎧', logo: '' }
        ];

    if (elements.contactMethods) {
      elements.contactMethods.innerHTML = methods.map((m, idx) => `
        <div class="contact-method-card hud-card" data-index="${idx}">
          <div class="contact-method-icon">
            ${m.logo ? `<img src="${m.logo}" alt="${m.label}" />` : `<span>${m.icon || '✉️'}</span>`}
          </div>
          <div style="flex-grow: 1; min-width: 0;">
            <div class="meta-chip-label">${m.label}</div>
            ${m.link 
              ? `<a href="${m.link}" class="meta-chip-value" target="_blank" rel="noopener noreferrer">${m.value}</a>` 
              : `<div class="meta-chip-value">${m.value}</div>`
            }
          </div>
          <div class="contact-method-actions">
            <button type="button" class="pillar-mini-btn edit-cm-btn" data-index="${idx}" title="Edit this channel">✏️</button>
            <button type="button" class="pillar-mini-btn del-btn del-cm-btn" data-index="${idx}" title="Delete channel">🗑️</button>
          </div>
        </div>
      `).join('');

      // Attach card button listeners
      document.querySelectorAll('.edit-cm-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
          openContactMethodModal(idx);
        });
      });

      document.querySelectorAll('.del-cm-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const idx = parseInt(e.currentTarget.getAttribute('data-index'), 10);
          const item = appState.contactMethods[idx];
          if (confirm(`Delete contact channel "${item ? item.label : 'this method'}"?`)) {
            appState.contactMethods.splice(idx, 1);
            saveState();
            renderContact();
          }
        });
      });
    }

    // 2. Render Form Labels and Options
    const cfg = contactFormConfig || {
      formTitle: 'DIRECT BROADCAST DISPATCH',
      nameLabel: 'YOUR FULL NAME *',
      namePlaceholder: 'e.g. Alex Morgan',
      emailLabel: 'EMAIL ADDRESS *',
      emailPlaceholder: 'name@organization.com',
      subjectLabel: 'SUBJECT / PROJECT TYPE *',
      subjectOptions: [
        'Tournament Broadcast Production',
        'vMix GT Title Design Project',
        'Live Graphics & Overlays (Singular.live)',
        'General Broadcast Collaboration'
      ],
      messageLabel: 'MESSAGE DETAILS *',
      messagePlaceholder: 'Describe tournament scope, dates, or broadcast requirements...',
      submitBtnText: 'SEND TRANSMISSION DISPATCH ➔'
    };

    const formHeaderTag = document.getElementById('formHeaderTag');
    const contactNameLabel = document.getElementById('contactNameLabel');
    const contactName = document.getElementById('contactName');
    const contactEmailLabel = document.getElementById('contactEmailLabel');
    const contactEmail = document.getElementById('contactEmail');
    const contactSubjectLabel = document.getElementById('contactSubjectLabel');
    const contactSubject = document.getElementById('contactSubject');
    const contactMessageLabel = document.getElementById('contactMessageLabel');
    const contactMessage = document.getElementById('contactMessage');
    const contactSubmitBtnText = document.getElementById('contactSubmitBtnText');

    if (formHeaderTag && cfg.formTitle) formHeaderTag.textContent = cfg.formTitle;
    if (contactNameLabel && cfg.nameLabel) contactNameLabel.textContent = cfg.nameLabel;
    if (contactName && cfg.namePlaceholder) contactName.placeholder = cfg.namePlaceholder;
    if (contactEmailLabel && cfg.emailLabel) contactEmailLabel.textContent = cfg.emailLabel;
    if (contactEmail && cfg.emailPlaceholder) contactEmail.placeholder = cfg.emailPlaceholder;
    if (contactSubjectLabel && cfg.subjectLabel) contactSubjectLabel.textContent = cfg.subjectLabel;
    if (contactMessageLabel && cfg.messageLabel) contactMessageLabel.textContent = cfg.messageLabel;
    if (contactMessage && cfg.messagePlaceholder) contactMessage.placeholder = cfg.messagePlaceholder;
    if (contactSubmitBtnText && cfg.submitBtnText) contactSubmitBtnText.textContent = cfg.submitBtnText;

    if (contactSubject) {
      const options = Array.isArray(cfg.subjectOptions) ? cfg.subjectOptions : (cfg.subjectOptions || '').split(',').map(s => s.trim()).filter(Boolean);
      contactSubject.innerHTML = options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    }

    const channels = Array.isArray(appState.socialChannels) && appState.socialChannels.length > 0
      ? appState.socialChannels
      : [
          { id: 'soc-youtube', name: 'YOUTUBE', url: 'https://youtube.com', icon: '▶️', logo: '' },
          { id: 'soc-facebook', name: 'FACEBOOK', url: 'https://facebook.com', icon: '🌐', logo: '' },
          { id: 'soc-instagram', name: 'INSTAGRAM', url: 'https://instagram.com', icon: '📸', logo: '' },
          { id: 'soc-discord', name: 'DISCORD', url: 'https://discord.com', icon: '🎧', logo: '' },
          { id: 'soc-linkedin', name: 'LINKEDIN', url: 'https://linkedin.com', icon: '💼', logo: '' }
        ];

    if (elements.socialLinksRow) {
      elements.socialLinksRow.innerHTML = channels.map((s, idx) => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-channel-btn" data-index="${idx}" title="${s.name}">
          ${s.logo ? `<img src="${s.logo}" class="social-btn-logo" alt="${s.name}" />` : `<span class="social-icon-symbol">${s.icon || '🌐'}</span>`}
          <span>${s.name}</span>
        </a>
      `).join('');
    }

    if (elements.footerSocials) {
      elements.footerSocials.innerHTML = channels.map((s, idx) => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-channel-btn" data-index="${idx}" title="${s.name}">
          ${s.logo ? `<img src="${s.logo}" class="social-btn-logo" alt="${s.name}" />` : `<span class="social-icon-symbol">${s.icon || '🌐'}</span>`}
          <span>${s.name}</span>
        </a>
      `).join('');
    }

    if (window.rebindInteractiveEffects) window.rebindInteractiveEffects();
  }

  // --------------------------------------------------------------------------
  // VIEWER COMMENTS & SUGGESTIONS HUB
  // --------------------------------------------------------------------------
  let activeSuggestionFilter = 'all';
  let activeRatingSelection = 5;

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function renderSuggestions() {
    const listEl = document.getElementById('suggestionsList');
    if (!listEl) return;

    const countAllEl = document.getElementById('sugCountAll');
    const suggestions = appState.suggestions || [];

    if (countAllEl) {
      countAllEl.textContent = suggestions.length;
    }

    const filtered = activeSuggestionFilter === 'all'
      ? suggestions
      : suggestions.filter(s => s.category === activeSuggestionFilter);

    if (filtered.length === 0) {
      listEl.innerHTML = `
        <div class="hud-card" style="padding: 36px; text-align: center; border: 1px dashed var(--border-subtle); border-radius: var(--radius-chamfer-md);">
          <span style="font-size: 2rem; display: block; margin-bottom: 10px;">💬</span>
          <h4 style="color: #ffffff; font-family: var(--font-heading); margin-bottom: 6px;">NO COMMENTS IN THIS CATEGORY YET</h4>
          <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 440px; margin: 0 auto;">
            Be the first viewer to transmit a comment or suggestion using the form on the left!
          </p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = filtered.map((item) => {
      const realIndex = appState.suggestions.findIndex(s => s.id === item.id);
      const initials = (item.author || 'Viewer')
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

      const stars = '⭐'.repeat(item.rating || 5);
      const categoryBadge = getCategoryBadge(item.category);

      return `
        <div class="suggestion-card hud-card" data-id="${item.id}">
          <div class="suggestion-card-header">
            <div class="sug-author-row">
              <div class="sug-avatar">${initials}</div>
              <div>
                <div class="sug-author-name">${escapeHtml(item.author || 'Anonymous Viewer')}</div>
                <div class="sug-author-role">${escapeHtml(item.role || 'Esports Spectator')} • <span class="font-mono text-muted">${item.date || 'Recent'}</span></div>
              </div>
            </div>

            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
              ${categoryBadge}
              <span class="font-mono" style="font-size: 0.78rem; color: var(--accent-gold);">${stars}</span>
            </div>
          </div>

          <div class="suggestion-card-body">
            ${escapeHtml(item.message || '')}
          </div>

          ${item.reply ? `
            <div class="suggestion-reply-box">
              <div class="sug-reply-header">
                <span>⚡ GUNSHOT (Producer Response):</span>
              </div>
              <div class="sug-reply-content">
                ${escapeHtml(item.reply)}
              </div>
            </div>
          ` : ''}

          <div class="suggestion-footer-actions">
            <button class="sug-hype-btn" data-index="${realIndex}" title="Upvote this comment / hype feedback">
              <span>🔥 HYPE</span>
              <span class="sug-hype-count font-mono">${item.hypes || 0}</span>
            </button>

            ${(typeof AdminAuthManager !== 'undefined' && AdminAuthManager.isAuthenticated) ? `
            <div style="display: flex; gap: 10px; align-items: center;">
              <button class="sug-reply-btn" data-index="${realIndex}" title="${item.reply ? 'Edit producer reply' : 'Add producer reply'}">
                💬 ${item.reply ? 'EDIT REPLY' : 'REPLY'}
              </button>
              <button class="sug-del-btn" data-index="${realIndex}" title="Delete comment (Moderator)">
                🗑️ REMOVE
              </button>
            </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    attachSuggestionCardEvents();
    if (window.rebindInteractiveEffects) window.rebindInteractiveEffects();
  }

  function getCategoryBadge(cat) {
    switch (cat) {
      case 'suggestion':
        return `<span class="badge" style="border: 1px solid var(--accent-cyan); color: var(--accent-cyan); background: rgba(0,240,255,0.1); font-size: 0.72rem;">💡 SUGGESTION</span>`;
      case 'feedback':
        return `<span class="badge" style="border: 1px solid var(--accent-purple); color: var(--accent-purple); background: rgba(139,92,246,0.1); font-size: 0.72rem;">🎨 GRAPHICS FEEDBACK</span>`;
      case 'idea':
        return `<span class="badge" style="border: 1px solid var(--accent-gold); color: var(--accent-gold); background: rgba(255,184,0,0.1); font-size: 0.72rem;">🏆 TOURNAMENT IDEA</span>`;
      case 'shoutout':
      default:
        return `<span class="badge" style="border: 1px solid #ff2a55; color: #ff4d6d; background: rgba(255,42,85,0.1); font-size: 0.72rem;">🔥 SHOUTOUT</span>`;
    }
  }

  function attachSuggestionCardEvents() {
    // 1. Hype button
    document.querySelectorAll('.sug-hype-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        if (appState.suggestions[index]) {
          appState.suggestions[index].hypes = (appState.suggestions[index].hypes || 0) + 1;
          saveState();
          PaperAudio.playPaperRip();
          const countSpan = btn.querySelector('.sug-hype-count');
          if (countSpan) countSpan.textContent = appState.suggestions[index].hypes;
          btn.style.transform = 'scale(1.15)';
          setTimeout(() => { btn.style.transform = ''; }, 180);
        }
      });
    });

    // 2. Reply button
    document.querySelectorAll('.sug-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const item = appState.suggestions[index];
        if (!item) return;

        const currentReply = item.reply || '';
        const newReply = prompt(`Official Producer Response for "${item.author}":`, currentReply);
        if (newReply !== null) {
          item.reply = newReply.trim();
          saveState();
          renderSuggestions();
          PaperAudio.playPaperStamp();
          showBroadcastToast('✅ Producer reply updated!');
        }
      });
    });

    // 3. Delete button
    document.querySelectorAll('.sug-del-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const index = parseInt(btn.getAttribute('data-index'), 10);
        const item = appState.suggestions[index];
        if (!item) return;

        if (confirm(`Remove comment from "${item.author}"?`)) {
          appState.suggestions.splice(index, 1);
          saveState();
          renderSuggestions();
          PaperAudio.playPaperRip();
          showBroadcastToast('🗑️ Comment removed.');
        }
      });
    });
  }

  function setupSuggestions() {
    // 1. Form submission
    const form = document.getElementById('suggestionSubmitForm');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('sugAuthor');
      const roleInput = document.getElementById('sugRole');
      const categorySelect = document.getElementById('sugCategory');
      const messageInput = document.getElementById('sugMessage');

      const author = authorInput?.value.trim() || 'Anonymous Viewer';
      const role = roleInput?.value.trim() || 'Broadcast Spectator';
      const category = categorySelect?.value || 'suggestion';
      const message = messageInput?.value.trim();

      if (!message) return;

      const dateStr = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());

      const newSug = {
        id: `sug-${Date.now()}`,
        author: author,
        role: role,
        category: category,
        rating: activeRatingSelection,
        date: dateStr,
        message: message,
        hypes: 1,
        reply: ''
      };

      if (!appState.suggestions) appState.suggestions = [];
      appState.suggestions.unshift(newSug);
      saveState();
      renderSuggestions();
      PaperAudio.playPaperStamp();

      // Reset form fields
      if (authorInput) authorInput.value = '';
      if (roleInput) roleInput.value = '';
      if (messageInput) messageInput.value = '';

      showBroadcastToast(`🎉 Suggestion transmitted! Thank you, ${author}!`);

      // Scroll smoothly to top of feed on mobile
      const list = document.getElementById('suggestionsList');
      if (list && window.innerWidth < 768) {
        list.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // 2. Rating picker buttons
    document.querySelectorAll('.sug-star-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.sug-star-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeRatingSelection = parseInt(btn.getAttribute('data-rating'), 10) || 5;
        PaperAudio.playPaperRip();
      });
    });

    // 3. Category filter tabs
    document.querySelectorAll('.sug-filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sug-filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        activeSuggestionFilter = tab.getAttribute('data-filter') || 'all';
        PaperAudio.playPaperRip();
        renderSuggestions();
      });
    });

    // 4. Header edit button
    document.getElementById('editSuggestionsHeaderBtn')?.addEventListener('click', () => {
      openSectionHeaderModal('suggestions');
    });

    // 5. Reset defaults button
    document.getElementById('resetSuggestionsBtn')?.addEventListener('click', () => {
      if (confirm('Reset suggestions back to default portfolio comments?')) {
        appState.suggestions = JSON.parse(JSON.stringify((window.portfolioData && window.portfolioData.suggestions) || []));
        saveState();
        renderSuggestions();
        PaperAudio.playPaperStamp();
        showBroadcastToast('🔄 Suggestions reset to defaults.');
      }
    });
  }

  // --------------------------------------------------------------------------
  // GLOBAL UPLOAD & EDIT HANDLERS (HERO, ABOUT, MASTER TOOLBARS, HEADERS)
  // --------------------------------------------------------------------------
  function setupGlobalUploads() {
    // 1. Hero Picture Upload
    elements.heroPhotoInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          appState.personalInfo.profileImage = ev.target.result;
          saveState();
          renderHero();
        };
        reader.readAsDataURL(file);
      }
    });

    // 2. Hero Edit Texts & Floating Badge
    document.getElementById('editHeroIntroBtn')?.addEventListener('click', () => {
      const heroHeaders = (appState.sectionHeaders && appState.sectionHeaders.hero) || {};
      const stats = appState.eventStats || (window.portfolioData && window.portfolioData.eventStats) || {
        officialCount: '10+',
        officialLabel: 'OFFICIAL EVENTS',
        localCount: '200+',
        localLabel: 'LOCAL EVENTS',
        unofficialCount: '5+',
        unofficialLabel: 'UNOFFICIAL'
      };
      let currentBadgeLogo = heroHeaders.companyLogo || '';

      elements.editModalBody.innerHTML = `
        <div style="padding: 34px;">
          <h3 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--accent-cyan); font-family: var(--font-heading);">
            ✏️ EDIT HERO TEXTS &amp; FLOATING BADGE
          </h3>

          <form id="heroHeaderEditForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label class="form-label">Greeting Name</label>
                <input type="text" id="hero_title_input" class="form-input" value="${heroHeaders.title || 'GUNSHOT'}" />
              </div>
              <div class="form-group">
                <label class="form-label">Hero Main Role Title</label>
                <input type="text" id="hero_role_input" class="form-input" value="${heroHeaders.roleTitle || 'ESPORTS ASSISTANT PRODUCER'}" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Status Pill Text</label>
              <input type="text" id="hero_status_pill_input" class="form-input" value="${(heroHeaders.statusPill && !heroHeaders.statusPill.includes('ECUBE')) ? heroHeaders.statusPill : 'STATUS: ON AIR // LIVE BROADCAST'}" />
            </div>

            <div class="form-group">
              <label class="form-label">Hero Tagline</label>
              <input type="text" id="hero_tagline_input" class="form-input" value="${appState.personalInfo.tagline || ''}" />
            </div>

            <div class="form-group">
              <label class="form-label">Hero Introduction Bio</label>
              <textarea id="hero_intro_input" class="form-textarea" rows="3">${appState.personalInfo.shortIntro || ''}</textarea>
            </div>

            <!-- Hero Typography Options -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Hero Role Title Font</label>
                <select id="hero_title_font" class="form-input">
                  <option value="">Default Heading Font</option>
                  ${FONT_OPTIONS.map(f => `<option value="${f.value}" ${(heroHeaders.titleFont || '') === f.value ? 'selected' : ''}>${f.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label">Hero Bio / Intro Font</label>
                <select id="hero_bio_font" class="form-input">
                  <option value="">Default Body Font</option>
                  ${FONT_OPTIONS.map(f => `<option value="${f.value}" ${(heroHeaders.bioFont || '') === f.value ? 'selected' : ''}>${f.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <!-- Floating Badge Card Settings (Above Picture) -->
            <div style="padding: 16px; background: rgba(0,240,255,0.04); border: 1px solid rgba(0,240,255,0.25); border-radius: var(--radius-chamfer-sm); margin-bottom: 18px;">
              <div style="font-family: var(--font-heading); color: var(--accent-cyan); font-size: 0.85rem; font-weight: 800; margin-bottom: 10px;">
                FLOATING BADGE CARD (ABOVE PICTURE)
              </div>
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
                <div class="form-group" style="margin-bottom: 10px;">
                  <label class="form-label">Badge Role Text</label>
                  <input type="text" id="hero_badge_role" class="form-input" value="${heroHeaders.companyBadgeRole || 'ASSISTANT PRODUCER'}" />
                </div>
                <div class="form-group" style="margin-bottom: 10px;">
                  <label class="form-label">Badge Subtitle</label>
                  <input type="text" id="hero_badge_sub" class="form-input" value="${heroHeaders.companyBadgeSub || 'GT Titles & Live Graphics'}" />
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 12px; margin-top: 10px;">
                <div id="hero_badge_preview_box" class="company-logo-badge">
                  ${currentBadgeLogo ? `<div class="ecube-logo-inner-wrapper"><img src="${currentBadgeLogo}" class="ecube-animated-logo" alt="Logo" /><div class="ecube-inner-sheen" style="-webkit-mask-image: url('${currentBadgeLogo}'); mask-image: url('${currentBadgeLogo}');"></div></div>` : '⚡'}
                </div>
                <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                  <span>📁 UPLOAD BADGE LOGO</span>
                  <input type="file" id="hero_badge_logo_file" accept="image/*" style="display: none;" />
                </label>
                ${currentBadgeLogo ? `<button type="button" class="btn btn-secondary btn-sm" id="hero_remove_badge_logo_btn">✕ REMOVE LOGO</button>` : ''}
              </div>
            </div>

            <!-- Hero Quick Metadata Chips (Role, Agency, Location, Tools) -->
            <div style="padding: 16px; background: rgba(0,240,255,0.04); border: 1px solid rgba(0,240,255,0.25); border-radius: var(--radius-chamfer-sm); margin-bottom: 18px;">
              <div style="font-family: var(--font-heading); color: var(--accent-cyan); font-size: 0.85rem; font-weight: 800; margin-bottom: 10px;">
                HERO INFO CHIPS (ROLE, AGENCY, LOCATION &amp; TOOLS)
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 10px;">
                <div>
                  <label class="form-label">Current Role</label>
                  <input type="text" id="hero_meta_role" class="form-input" value="${appState.personalInfo.currentRole || 'Assistant Producer'}" />
                </div>
                <div>
                  <label class="form-label">Production Agency</label>
                  <input type="text" id="hero_meta_agency" class="form-input" value="${appState.personalInfo.currentCompany || 'ECUBE (Event Execution Experts)'}" />
                </div>
              </div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <label class="form-label">Based In</label>
                  <input type="text" id="hero_meta_location" class="form-input" value="${appState.personalInfo.basedIn || 'Dhaka, Bangladesh'}" />
                </div>
                <div>
                  <label class="form-label">Primary Tools</label>
                  <input type="text" id="hero_meta_tools" class="form-input" value="${appState.personalInfo.primaryTools || 'vMix • OBS • GT Titles'}" />
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
              <button type="button" class="btn btn-secondary btn-sm" id="cancelHeroEditBtn">CANCEL</button>
              <button type="submit" class="btn btn-primary btn-sm">SAVE CHANGES</button>
            </div>
          </form>
        </div>
      `;

      const logoFileInput = document.getElementById('hero_badge_logo_file');
      const removeLogoBtn = document.getElementById('hero_remove_badge_logo_btn');
      const previewBox = document.getElementById('hero_badge_preview_box');

      logoFileInput?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            currentBadgeLogo = ev.target.result;
            if (previewBox) previewBox.innerHTML = `<img src="${currentBadgeLogo}" style="width:100%; height:100%; object-fit:contain;" />`;
          };
          reader.readAsDataURL(file);
        }
      });

      removeLogoBtn?.addEventListener('click', () => {
        currentBadgeLogo = '';
        if (previewBox) previewBox.textContent = '⚡';
        removeLogoBtn.style.display = 'none';
      });

      document.getElementById('cancelHeroEditBtn')?.addEventListener('click', closeModals);

      document.getElementById('heroHeaderEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!appState.sectionHeaders) appState.sectionHeaders = {};
        if (!appState.sectionHeaders.hero) appState.sectionHeaders.hero = {};

        h.title = document.getElementById('hero_title_input').value.trim() || 'GUNSHOT';
        h.roleTitle = document.getElementById('hero_role_input').value.trim() || 'ESPORTS ASSISTANT PRODUCER';
        h.titleFont = document.getElementById('hero_title_font').value;
        h.bioFont = document.getElementById('hero_bio_font').value;
        h.statusPill = document.getElementById('hero_status_pill_input').value.trim() || 'STATUS: ON AIR // LIVE BROADCAST';
        h.companyBadgeRole = document.getElementById('hero_badge_role').value.trim() || 'ASSISTANT PRODUCER';
        h.companyBadgeSub = document.getElementById('hero_badge_sub').value.trim() || 'GT Titles & Live Graphics';
        h.companyLogo = currentBadgeLogo;
        
        appState.personalInfo.tagline = document.getElementById('hero_tagline_input').value.trim();
        appState.personalInfo.shortIntro = document.getElementById('hero_intro_input').value.trim();

        appState.personalInfo.currentRole = document.getElementById('hero_meta_role').value.trim() || 'Assistant Producer';
        appState.personalInfo.currentCompany = document.getElementById('hero_meta_agency').value.trim() || 'ECUBE (Event Execution Experts)';
        appState.personalInfo.basedIn = document.getElementById('hero_meta_location').value.trim() || 'Dhaka, Bangladesh';
        appState.personalInfo.primaryTools = document.getElementById('hero_meta_tools').value.trim() || 'vMix • OBS • GT Titles';

        saveState();
        renderHero();
        closeModals();
      });

      elements.editModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    // 2b. Floating Badge & Event Stats Direct Edit Option (Inside Floating Bar)
    document.getElementById('editFloatingBadgeBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openFloatingBadgeEditModal();
    });

    // 2c. Hero Metadata Chips Direct Edit Option
    document.getElementById('editHeroMetadataBtn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      openHeroMetadataEditModal();
    });

    // 3. About Picture Upload
    elements.aboutPhotoInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          appState.personalInfo.aboutImage = ev.target.result;
          saveState();
          renderAbout();
        };
        reader.readAsDataURL(file);
      }
    });

    // 4. About Statement Edit
    document.getElementById('editAboutStatementBtn')?.addEventListener('click', () => {
      openEditModal({
        title: 'EDIT ABOUT ME STATEMENT',
        fields: [
          { key: 'aboutStatement', label: 'Specific About Me Text', value: appState.personalInfo.aboutStatement, type: 'textarea' }
        ],
        onSave: (vals) => {
          appState.personalInfo.aboutStatement = vals.aboutStatement;
          saveState();
          renderAbout();
        }
      });
    });

    // 5. Edit Pillars Button
    document.getElementById('editPillarsBtn')?.addEventListener('click', () => {
      openPillarEditModal(-1);
    });

    // 6. Edit Social Channels Button
    document.getElementById('editSocialsBtn')?.addEventListener('click', () => {
      openSocialsManagerModal();
    });

    // 7. Contact Methods & Form Edit Listeners
    document.getElementById('editContactMethodsBtn')?.addEventListener('click', () => {
      openContactMethodsManagerModal();
    });
    document.getElementById('manageContactMethodsBtn')?.addEventListener('click', () => {
      openContactMethodsManagerModal();
    });
    document.getElementById('addContactMethodBtn')?.addEventListener('click', () => {
      openContactMethodModal(-1);
    });
    document.getElementById('editContactFormBtn')?.addEventListener('click', () => {
      openContactFormConfigModal();
    });
    document.getElementById('editFormInlineBtn')?.addEventListener('click', () => {
      openContactFormConfigModal();
    });

    // 7. Section Header Edit Buttons (All sections)
    document.querySelectorAll('[data-section]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sec = e.currentTarget.getAttribute('data-section');
        if (sec) openSectionHeaderModal(sec);
      });
    });

    // 8. Add New Production Button
    document.getElementById('addNewProductionBtn')?.addEventListener('click', () => {
      openProductionEditModal(-1); // -1 indicates create new
    });

    // 9. Bulk Video Ingestion Station & Multi-File Handlers
    document.getElementById('bulkStationFileInput')?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await handleBulkVideoUpload(files);
        e.target.value = '';
      }
    });

    elements.bulkVideoInput?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        await handleBulkVideoUpload(files);
        if (elements.bulkVideoInput) elements.bulkVideoInput.value = '';
      }
    });

    // Drag and Drop on Bulk Video Ingestion Bay
    const dropZone = document.getElementById('bulkVideoDropZone');
    if (dropZone) {
      ['dragenter', 'dragover'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.add('drag-active');
        });
      });

      ['dragleave', 'drop'].forEach(name => {
        dropZone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropZone.classList.remove('drag-active');
        });
      });

      dropZone.addEventListener('drop', async (e) => {
        const dt = e.dataTransfer;
        const files = Array.from(dt.files || []).filter(f => f.type.startsWith('video/') || /\.(mp4|webm|mov|ogg|mkv)$/i.test(f.name));
        if (files.length > 0) {
          await handleBulkVideoUpload(files);
        } else {
          alert('Please drop valid video files (.mp4, .webm, .mov)!');
        }
      });
    }

    // Toggle Collapse / Expand Bulk Station Bay
    const toggleStationBtn = document.getElementById('toggleBulkStationBtn');
    const stationBody = document.getElementById('bulkStationBody');
    const toggleText = document.getElementById('bulkStationToggleText');
    if (toggleStationBtn && stationBody) {
      toggleStationBtn.addEventListener('click', () => {
        const isHidden = stationBody.style.display === 'none';
        stationBody.style.display = isHidden ? 'block' : 'none';
        if (toggleText) {
          toggleText.textContent = isHidden ? '▲ COLLAPSE INGEST BAY' : '▼ EXPAND INGEST BAY';
        }
      });
    }

    // Jump to Bulk Upload Button
    document.getElementById('jumpToBulkUploadBtn')?.addEventListener('click', () => {
      const station = document.getElementById('bulkVideoStation');
      if (station) {
        if (stationBody && stationBody.style.display === 'none') {
          stationBody.style.display = 'block';
          if (toggleText) toggleText.textContent = '▲ COLLAPSE INGEST BAY';
        }
        station.scrollIntoView({ behavior: 'smooth', block: 'center' });
        dropZone?.classList.add('drag-active');
        setTimeout(() => dropZone?.classList.remove('drag-active'), 1200);
      }
    });

    // Batch Links Modal Openers
    const openBatchModal = () => {
      if (!requireAdminAuth()) return;
      const m = document.getElementById('bulkUrlModal');
      if (m) {
        m.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    };
    document.getElementById('bulkPasteUrlsBtn')?.addEventListener('click', openBatchModal);
    document.getElementById('toolbarBatchLinksBtn')?.addEventListener('click', openBatchModal);

    // Batch Links Modal Handlers
    document.getElementById('closeBulkUrlModalBtn')?.addEventListener('click', closeModals);
    document.getElementById('cancelBulkUrlBtn')?.addEventListener('click', closeModals);
    document.getElementById('confirmBulkUrlImportBtn')?.addEventListener('click', () => {
      const txt = document.getElementById('bulkUrlTextarea')?.value.trim();
      if (!txt) {
        alert('Please paste at least one video link!');
        return;
      }
      const defaultEvent = document.getElementById('bulkDefaultEventInput')?.value.trim() || 'FFWS BD 2026 // LIVE REEL';
      const defaultRole = document.getElementById('bulkDefaultRoleInput')?.value.trim() || 'Assistant Producer & GT Title Designer';

      const lines = txt.split('\n').map(l => l.trim()).filter(Boolean);
      let count = 0;

      lines.forEach((line, idx) => {
        let title = '';
        let url = '';
        let event = defaultEvent;
        let role = defaultRole;
        let duration = 'HD';

        if (line.includes('|')) {
          const parts = line.split('|').map(p => p.trim());
          if (parts[0] && parts[0].startsWith('http')) {
            url = parts[0];
            title = parts[1] || `Tournament Reel #${idx + 1}`;
            event = parts[2] || defaultEvent;
            role = parts[3] || defaultRole;
          } else {
            title = parts[0];
            url = parts[1];
            event = parts[2] || defaultEvent;
            role = parts[3] || defaultRole;
            duration = parts[4] || 'HD';
          }
        } else {
          url = line;
          title = `Tournament Showreel ${appState.videos.length + idx + 1}`;
        }

        if (url) {
          appState.videos.unshift({
            id: `vid-link-${Date.now()}-${idx}`,
            title: title || 'Tournament Broadcast Reel',
            event: event,
            role: role,
            duration: duration,
            thumbnail: 'assets/images/event-control-room.jpg',
            videoUrl: url,
            description: `Official tournament broadcast feed & showreel for "${title}".`
          });
          count++;
        }
      });

      if (count > 0) {
        saveState();
        PaperAudio.playPaperStamp();
        renderVideos();
        closeModals();
        alert(`Successfully imported ${count} video link(s)! They are now available in your video showcase.`);
      }
    });

    elements.singleVideoInput?.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        await handleSingleVideoUpload(file);
        if (elements.singleVideoInput) elements.singleVideoInput.value = '';
      }
    });

    // 10. Reset Data Button
    document.getElementById('resetDataBtn')?.addEventListener('click', () => {
      if (confirm('Reset portfolio back to default data? Any unsaved client edits in localStorage will be cleared.')) {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
      }
    });
  }

  // --------------------------------------------------------------------------
  // EDIT SECTION HEADER MODAL (ALL HEADERS EDITABLE)
  // --------------------------------------------------------------------------
  function openSectionHeaderModal(sectionKey) {
    if (!requireAdminAuth()) return;
    const headers = appState.sectionHeaders || {};
    const cur = headers[sectionKey] || { tag: '', title: '', subtitle: '' };

    if (sectionKey === 'about') {
      let currentLogo = cur.logo || 'assets/images/ecube-logo.png';
      let currentShowLogo = cur.showLogo !== false;
      const initialTitle = (cur.title || 'ASSISTANT PRODUCER AT').replace(/\s+ECUBE$/i, '').trim();

      elements.editModalBody.innerHTML = `
        <div style="padding: 34px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 12px;">
            <h3 style="font-size: 1.4rem; color: var(--accent-cyan); font-family: var(--font-heading); margin: 0;">
              ✏️ EDIT ABOUT HEADER &amp; LOGO
            </h3>
            <span class="font-mono" style="font-size: 0.72rem; color: var(--accent-cyan); padding: 4px 10px; background: rgba(0,240,255,0.1); border-radius: var(--radius-chamfer-sm); border: 1px solid var(--accent-cyan);">
              ABOUT SEGMENT
            </span>
          </div>

          <form id="aboutHeaderEditForm">
            <div class="form-group">
              <label class="form-label">Section Badge / Tag</label>
              <input type="text" id="ab_tag" class="form-input" value="${cur.tag || 'ABOUT ME'}" required />
            </div>

            <div class="form-group">
              <label class="form-label">Main Title Text (Prefix before logo)</label>
              <input type="text" id="ab_title" class="form-input" value="${initialTitle}" required />
              <small style="color: var(--text-muted); font-size: 0.8rem; display: block; margin-top: 4px;">e.g. "ASSISTANT PRODUCER AT" (The company logo will appear beside it)</small>
            </div>

            <div class="form-group">
              <label class="form-label">Title Font</label>
              <select id="ab_title_font" class="form-input">
                <option value="">Default Heading Font</option>
                ${FONT_OPTIONS.map(opt => `<option value="${opt.value}" ${opt.value === cur.titleFont ? 'selected' : ''}>${opt.name}</option>`).join('')}
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Section Subtitle Description</label>
              <textarea id="ab_subtitle" class="form-textarea" rows="3">${cur.subtitle || ''}</textarea>
            </div>

            <!-- Integrated Header Logo Settings -->
            <div style="padding: 16px; background: rgba(0,240,255,0.04); border: 1px solid rgba(0,240,255,0.25); border-radius: var(--radius-chamfer-sm); margin-bottom: 18px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--accent-cyan); font-weight: 700; font-size: 0.9rem;">
                  <input type="checkbox" id="ab_show_logo" ${currentShowLogo ? 'checked' : ''} style="accent-color: var(--accent-cyan); width: 18px; height: 18px;" />
                  <span>DISPLAY LOGO BESIDE TITLE</span>
                </label>
              </div>

              <div id="ab_logo_controls" style="display: ${currentShowLogo ? 'flex' : 'none'}; align-items: center; gap: 16px; margin-top: 10px;">
                <div id="ab_logo_preview" class="about-title-logo-badge" style="height: 48px; padding: 4px 14px; margin: 0; cursor: default;">
                  <span class="about-title-logo-inner">
                    <img src="${currentLogo}" class="about-header-ecube-img" id="ab_logo_preview_img" alt="Logo" />
                  </span>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                    <span>📁 UPLOAD NEW LOGO</span>
                    <input type="file" id="ab_logo_file" accept="image/*" style="display: none;" />
                  </label>
                  <button type="button" class="btn btn-secondary btn-sm" id="ab_reset_logo_btn">↺ DEFAULT LOGO</button>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
              <button type="button" class="btn btn-secondary btn-sm" id="cancelAboutHeaderBtn">CANCEL</button>
              <button type="submit" class="btn btn-primary btn-sm">SAVE CHANGES</button>
            </div>
          </form>
        </div>
      `;

      const showLogoCheckbox = document.getElementById('ab_show_logo');
      const logoControls = document.getElementById('ab_logo_controls');
      const logoFileInput = document.getElementById('ab_logo_file');
      const resetLogoBtn = document.getElementById('ab_reset_logo_btn');
      const previewImg = document.getElementById('ab_logo_preview_img');

      showLogoCheckbox?.addEventListener('change', (e) => {
        currentShowLogo = e.target.checked;
        if (logoControls) logoControls.style.display = currentShowLogo ? 'flex' : 'none';
      });

      logoFileInput?.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            currentLogo = ev.target.result;
            if (previewImg) previewImg.src = currentLogo;
          };
          reader.readAsDataURL(file);
        }
      });

      resetLogoBtn?.addEventListener('click', () => {
        currentLogo = 'assets/images/ecube-logo.png';
        if (previewImg) previewImg.src = currentLogo;
      });

      document.getElementById('cancelAboutHeaderBtn')?.addEventListener('click', closeModals);

      document.getElementById('aboutHeaderEditForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!appState.sectionHeaders) appState.sectionHeaders = {};
        appState.sectionHeaders.about = {
          tag: document.getElementById('ab_tag')?.value.trim() || 'ABOUT ME',
          title: (document.getElementById('ab_title')?.value.trim() || 'ASSISTANT PRODUCER AT').replace(/\s+ECUBE$/i, ''),
          titleFont: document.getElementById('ab_title_font')?.value || '',
          subtitle: document.getElementById('ab_subtitle')?.value.trim() || '',
          showLogo: currentShowLogo,
          logo: currentLogo || 'assets/images/ecube-logo.png'
        };
        saveState();
        renderSectionHeaders();
        closeModals();
        showBroadcastToast('✓ About header &amp; logo updated successfully!');
      });

      elements.editModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      return;
    }

    openEditModal({
      title: `✏️ EDIT ${sectionKey.toUpperCase()} HEADER &amp; SUBTITLE`,
      fields: [
        { key: 'tag', label: 'Section Badge / Tag (e.g. OFFICIAL PRODUCTION PORTFOLIO)', value: cur.tag, type: 'text' },
        { key: 'title', label: 'Main Section Title (e.g. WHERE I\'VE PRODUCED)', value: cur.title, type: 'text' },
        { 
          key: 'titleFont', 
          label: 'Section Title Font', 
          value: cur.titleFont || '', 
          type: 'select', 
          options: [{ value: '', name: 'Default Heading Font' }, ...FONT_OPTIONS] 
        },
        { key: 'subtitle', label: 'Section Subtitle Description', value: cur.subtitle, type: 'textarea' }
      ],
      onSave: (vals) => {
        if (!appState.sectionHeaders) appState.sectionHeaders = {};
        appState.sectionHeaders[sectionKey] = Object.assign({}, cur, vals);
        saveState();
        renderSectionHeaders();
        alert(`Header updated for ${sectionKey.toUpperCase()}!`);
      }
    });
  }

  // --------------------------------------------------------------------------
  // CORE PILLAR EDIT MODAL (TEXTS, ICONS, AND CUSTOM LOGOS)
  // --------------------------------------------------------------------------
  function openPillarEditModal(index) {
    if (!requireAdminAuth()) return;
    const isNew = index === -1;
    const pillars = appState.personalInfo.corePillars || [];
    const item = isNew ? {
      title: 'GT TITLE DESIGNER',
      desc: 'vMix animated GT scoreboards, lower thirds, match points & kill trackers',
      icon: '⚡',
      logo: ''
    } : pillars[index];

    let currentLogo = item.logo || '';

    if (!elements.editModalBody || !elements.editModal) return;

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <h3 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--accent-cyan); font-family: var(--font-heading);">
          ${isNew ? '➕ ADD NEW CORE PILLAR' : `✏️ EDIT PILLAR: ${item.title}`}
        </h3>

        <form id="pillarEditForm">
          <div class="form-group">
            <label class="form-label">Pillar Title *</label>
            <input type="text" id="pillar_title" class="form-input" value="${item.title || ''}" required />
          </div>

          <div class="form-group">
            <label class="form-label">Pillar Description *</label>
            <textarea id="pillar_desc" class="form-textarea" rows="3" required>${item.desc || ''}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Icon Emoji / Symbol</label>
              <input type="text" id="pillar_icon" class="form-input" value="${item.icon || '⚡'}" placeholder="e.g. ⚡ or 🎛️ or 🎥" />
            </div>

            <div class="form-group">
              <label class="form-label">Or Custom Logo Image</label>
              <div style="display: flex; gap: 10px; align-items: center;">
                <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                  <span>📁 UPLOAD LOGO</span>
                  <input type="file" id="pillar_logo_file" accept="image/*" style="display: none;" />
                </label>
                <button type="button" class="btn btn-secondary btn-sm" id="pillar_remove_logo" style="${currentLogo ? '' : 'display: none;'}">
                  ✕ REMOVE
                </button>
              </div>
            </div>
          </div>

          <!-- Logo Preview Box -->
          <div id="pillar_logo_preview_wrap" style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.4); border: 1px dashed var(--border-subtle); border-radius: var(--radius-chamfer-sm); display: flex; align-items: center; gap: 12px;">
            <div id="pillar_preview_box" style="width: 32px; height: 32px; border: 1px solid var(--accent-cyan); border-radius: var(--radius-chamfer-sm); display: flex; align-items: center; justify-content: center; background: rgba(0,240,255,0.08); overflow: hidden;">
              ${currentLogo ? `<img src="${currentLogo}" style="max-width:22px; max-height:22px; object-fit:contain;" />` : `<span style="font-size:0.95rem;">${item.icon || '⚡'}</span>`}
            </div>
            <div class="font-mono text-muted" style="font-size: 0.78rem;" id="pillar_preview_label">
              ${currentLogo ? 'Custom logo image selected' : `Using icon: ${item.icon || '⚡'}`}
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelPillarEditBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm">SAVE PILLAR</button>
          </div>
        </form>
      </div>
    `;

    const logoFileInput = document.getElementById('pillar_logo_file');
    const removeLogoBtn = document.getElementById('pillar_remove_logo');
    const previewBox = document.getElementById('pillar_preview_box');
    const previewLabel = document.getElementById('pillar_preview_label');
    const iconInput = document.getElementById('pillar_icon');

    iconInput?.addEventListener('input', () => {
      if (!currentLogo && previewBox && previewLabel) {
        previewBox.innerHTML = `<span style="font-size:1.4rem;">${iconInput.value || '⚡'}</span>`;
        previewLabel.textContent = `Using icon: ${iconInput.value || '⚡'}`;
      }
    });

    logoFileInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          currentLogo = ev.target.result;
          if (previewBox) previewBox.innerHTML = `<img src="${currentLogo}" style="width:100%; height:100%; object-fit:contain;" />`;
          if (previewLabel) previewLabel.textContent = 'Custom logo image loaded';
          if (removeLogoBtn) removeLogoBtn.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
      }
    });

    removeLogoBtn?.addEventListener('click', () => {
      currentLogo = '';
      if (previewBox) previewBox.innerHTML = `<span style="font-size:1.4rem;">${iconInput.value || '⚡'}</span>`;
      if (previewLabel) previewLabel.textContent = `Using icon: ${iconInput.value || '⚡'}`;
      removeLogoBtn.style.display = 'none';
    });

    document.getElementById('cancelPillarEditBtn')?.addEventListener('click', closeModals);

    document.getElementById('pillarEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newTitle = document.getElementById('pillar_title').value.trim();
      const newDesc = document.getElementById('pillar_desc').value.trim();
      const newIcon = document.getElementById('pillar_icon').value.trim() || '⚡';

      if (isNew) {
        appState.personalInfo.corePillars.push({
          id: `pillar-${Date.now()}`,
          title: newTitle,
          desc: newDesc,
          icon: newIcon,
          logo: currentLogo
        });
      } else {
        appState.personalInfo.corePillars[index] = {
          ...appState.personalInfo.corePillars[index],
          title: newTitle,
          desc: newDesc,
          icon: newIcon,
          logo: currentLogo
        };
      }

      saveState();
      renderAbout();
      closeModals();
    });

    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // TOURNAMENT LOGO MODAL (UPLOAD, CHANGE OR REMOVE TOURNAMENT LOGO)
  // --------------------------------------------------------------------------
  function openTournamentBadgesModal(prodIndex) {
    if (!requireAdminAuth()) return;
    const prod = appState.productions[prodIndex];
    if (!prod) return;

    let currentLogo = prod.logo || '';

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <h3 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--accent-cyan); font-family: var(--font-heading);">
          🏷️ TOURNAMENT LOGO EMBLEM: ${prod.title}
        </h3>

        <form id="prodBadgeForm">
          <div class="form-group">
            <label class="form-label">Tournament / Championship Logo</label>
            <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 14px; line-height: 1.55;">
              Upload or update the official tournament emblem (e.g. Free Fire FFWS, PUBG Mobile, or Valorant logo). It will be displayed cleanly centered on the banner header.
            </p>
            <div style="display: flex; gap: 10px; align-items: center;">
              <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                <span>📁 UPLOAD LOGO</span>
                <input type="file" id="prod_logo_file" accept="image/*" style="display: none;" />
              </label>
              <button type="button" class="btn btn-secondary btn-sm" id="prod_remove_logo" style="${currentLogo ? '' : 'display: none;'}">
                ✕ REMOVE LOGO
              </button>
            </div>
          </div>

          <div style="margin-top: 10px; padding: 14px; background: rgba(0,0,0,0.4); border: 1px dashed var(--border-subtle); border-radius: var(--radius-chamfer-sm); display: flex; align-items: center; gap: 14px;">
            <div id="prod_logo_preview_box" style="height: 52px; min-width: 64px; border: 1.5px solid var(--accent-cyan); border-radius: var(--radius-chamfer-sm); display: flex; align-items: center; justify-content: center; background: rgba(0,240,255,0.08); overflow: hidden; padding: 4px;">
              ${currentLogo ? `<img src="${currentLogo}" style="max-height:44px; max-width:60px; object-fit:contain;" />` : `<span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">NONE</span>`}
            </div>
            <div class="font-mono text-muted" style="font-size: 0.82rem;" id="prod_logo_preview_label">
              ${currentLogo ? 'Tournament emblem active' : 'No emblem attached (clean banner view)'}
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelProdBadgeBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm">SAVE LOGO</button>
          </div>
        </form>
      </div>
    `;

    const logoFileInput = document.getElementById('prod_logo_file');
    const removeLogoBtn = document.getElementById('prod_remove_logo');
    const previewBox = document.getElementById('prod_logo_preview_box');
    const previewLabel = document.getElementById('prod_logo_preview_label');

    logoFileInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          currentLogo = ev.target.result;
          if (previewBox) previewBox.innerHTML = `<img src="${currentLogo}" style="width:100%; height:100%; object-fit:contain;" />`;
          if (previewLabel) previewLabel.textContent = 'Tournament logo loaded';
          if (removeLogoBtn) removeLogoBtn.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
      }
    });

    removeLogoBtn?.addEventListener('click', () => {
      currentLogo = '';
      if (previewBox) previewBox.innerHTML = `<span style="font-size:0.85rem; color:var(--text-muted); font-family:var(--font-mono);">NONE</span>`;
      if (previewLabel) previewLabel.textContent = 'No logo attached';
      removeLogoBtn.style.display = 'none';
    });

    document.getElementById('cancelProdBadgeBtn')?.addEventListener('click', closeModals);

    document.getElementById('prodBadgeForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      prod.logo = currentLogo;
      saveState();
      renderProductions();
      closeModals();
    });

    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // BROADCAST HUD NOTIFICATION TOAST
  // --------------------------------------------------------------------------
  function showBroadcastToast(msg, duration = 3200) {
    let toast = document.getElementById('broadcastHudToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'broadcastHudToast';
      toast.className = 'broadcast-hud-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span style="font-size: 1.15rem; color: var(--accent-cyan);">⚡</span> <span>${msg}</span>`;
    toast.classList.add('active');

    if (window._toastTimeout) clearTimeout(window._toastTimeout);
    window._toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  }

  // --------------------------------------------------------------------------
  // LIVE BROADCAST LINK EDIT MODAL
  // --------------------------------------------------------------------------
  function openLiveLinkEditModal(prodIndex) {
    if (!requireAdminAuth()) return;
    const prod = appState.productions[prodIndex];
    if (!prod) return;

    const currentLink = prod.liveLink || prod.videoUrl || '';

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px 38px;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 16px;">
          <div>
            <span class="badge badge-live" style="font-size: 0.72rem; margin-bottom: 8px; display: inline-block;">BROADCAST LIVE STREAM LINK</span>
            <h3 style="font-size: 1.6rem; color: #ffffff; font-family: var(--font-heading); margin: 0; line-height: 1.2;">
              ${prod.title}
            </h3>
            <div style="font-size: 0.85rem; color: var(--accent-cyan); font-family: var(--font-mono); margin-top: 6px;">
              ${prod.role} • ${prod.agency}
            </div>
          </div>
        </div>

        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 22px;">
          Set the live broadcast stream destination. When viewers click 
          <strong style="color: var(--accent-cyan);">"WATCH BROADCAST ▶"</strong>, they will instantly and automatically open this live link in a new tab!
        </p>

        <form id="liveLinkEditForm">
          <div class="form-group" style="margin-bottom: 20px;">
            <label class="form-label" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span>BROADCAST STREAM URL (YouTube / Twitch / Facebook / Live Stream)</span>
              <span style="font-size: 0.72rem; color: var(--accent-cyan); font-family: var(--font-mono);">AUTO-OPENS ON CLICK</span>
            </label>
            <input type="url" id="editLiveLinkInput" class="form-input" 
              placeholder="https://www.youtube.com/watch?v=... or https://twitch.tv/..." 
              value="${currentLink}" 
              style="font-family: var(--font-mono); font-size: 0.95rem; padding: 14px 16px; border: 1.5px solid var(--accent-cyan); background: rgba(0,240,255,0.04);" 
              required />
            
            <div style="display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; align-items: center;">
              <span class="font-mono text-muted" style="font-size: 0.74rem;">Presets:</span>
              <button type="button" class="btn btn-outline btn-sm quick-preset-link-btn" data-url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" style="font-size: 0.72rem; padding: 4px 10px;">
                ▶ YouTube Sample
              </button>
              <button type="button" class="btn btn-outline btn-sm quick-preset-link-btn" data-url="https://www.twitch.tv/" style="font-size: 0.72rem; padding: 4px 10px;">
                🟣 Twitch TV
              </button>
              <button type="button" class="btn btn-outline btn-sm" id="testLiveLinkBtn" style="font-size: 0.74rem; padding: 4px 12px; margin-left: auto; border-color: var(--accent-gold); color: var(--accent-gold); font-weight: 700;">
                🧪 Test Link (Open in New Tab)
              </button>
            </div>
          </div>

          <div style="background: rgba(0, 240, 255, 0.05); border: 1px dashed rgba(0, 240, 255, 0.3); border-radius: var(--radius-chamfer-sm); padding: 12px 16px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 1.2rem;">⚡</span>
            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.4;">
              <strong>Auto-Direct Verified:</strong> Clicking <span class="text-cyan">WATCH BROADCAST ▶</span> directly launches this stream destination with zero delay.
            </div>
          </div>

          <div style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelLiveLinkModalBtn">
              CANCEL
            </button>
            <button type="submit" class="btn btn-primary btn-sm" id="saveLiveLinkBtn" style="min-width: 170px;">
              💾 SAVE LIVE LINK
            </button>
          </div>
        </form>
      </div>
    `;

    // Presets
    elements.editModalBody.querySelectorAll('.quick-preset-link-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        const input = document.getElementById('editLiveLinkInput');
        if (input) input.value = url;
      });
    });

    // Test Link
    document.getElementById('testLiveLinkBtn')?.addEventListener('click', () => {
      const input = document.getElementById('editLiveLinkInput');
      const val = input ? input.value.trim() : '';
      if (!val) {
        alert('Please enter a stream link first to test.');
        return;
      }
      window.open(val, '_blank', 'noopener,noreferrer');
    });

    // Cancel
    document.getElementById('cancelLiveLinkModalBtn')?.addEventListener('click', closeModals);

    // Save
    document.getElementById('liveLinkEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('editLiveLinkInput');
      const newUrl = input ? input.value.trim() : '';
      if (!newUrl) return;

      prod.liveLink = newUrl;
      prod.videoUrl = newUrl;
      saveState();
      renderProductions();
      closeModals();
      PaperAudio.playPaperStamp();

      showBroadcastToast(`✅ Live link saved for "${prod.title}"! Auto-navigation active.`);
    });

    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      const input = document.getElementById('editLiveLinkInput');
      if (input) {
        input.focus();
        input.select();
      }
    }, 100);
  }

  // --------------------------------------------------------------------------
  // SOCIALS MANAGER MODAL (EDIT CHANNELS, ICONS, AND CUSTOM LOGOS)
  // --------------------------------------------------------------------------
  function openSocialsManagerModal() {
    if (!requireAdminAuth()) return;
    const channels = Array.isArray(appState.socialChannels) ? JSON.parse(JSON.stringify(appState.socialChannels)) : [];

    function renderModalContent() {
      elements.editModalBody.innerHTML = `
        <div style="padding: 34px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-size: 1.5rem; color: var(--accent-cyan); font-family: var(--font-heading); margin-bottom: 0;">
              🌐 EDIT SOCIAL CHANNELS &amp; LOGOS
            </h3>
            <button type="button" class="btn btn-primary btn-sm" id="addNewSocialRowBtn">
              <span>➕ ADD CHANNEL</span>
            </button>
          </div>

          <div style="max-height: 52vh; overflow-y: auto; padding-right: 6px;">
            ${channels.map((s, idx) => `
              <div style="background: rgba(14,20,32,0.85); border: 1px solid var(--border-subtle); border-radius: var(--radius-chamfer-sm); padding: 14px; margin-bottom: 12px;" data-row-index="${idx}">
                <div style="display: grid; grid-template-columns: 80px 1fr 1fr auto; gap: 10px; align-items: center;">
                  <div>
                    <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">ICON</label>
                    <input type="text" class="form-input soc-icon-inp" data-index="${idx}" value="${s.icon || '🌐'}" style="text-align: center;" />
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">NAME</label>
                    <input type="text" class="form-input soc-name-inp" data-index="${idx}" value="${s.name || ''}" />
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">URL LINK</label>
                    <input type="text" class="form-input soc-url-inp" data-index="${idx}" value="${s.url || ''}" />
                  </div>
                  <div style="padding-top: 18px;">
                    <button type="button" class="pillar-mini-btn del-btn del-soc-btn" data-index="${idx}" title="Delete channel">🗑️</button>
                  </div>
                </div>

                <!-- Custom Logo Upload for this social item -->
                <div style="display: flex; align-items: center; gap: 12px; margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.08);">
                  <div style="width: 28px; height: 28px; border: 1px solid var(--accent-cyan); border-radius: 4px; display: flex; align-items: center; justify-content: center; background: rgba(0,240,255,0.08); overflow: hidden;">
                    ${s.logo ? `<img src="${s.logo}" style="width:100%; height:100%; object-fit:contain;" />` : `<span style="font-size:0.9rem;">${s.icon || '🌐'}</span>`}
                  </div>
                  <label class="btn btn-secondary btn-sm" style="cursor: pointer; padding: 4px 10px; font-size: 0.72rem; margin: 0;">
                    <span>📷 UPLOAD CUSTOM LOGO</span>
                    <input type="file" accept="image/*" class="soc-logo-file-inp" data-index="${idx}" style="display: none;" />
                  </label>
                  ${s.logo ? `<button type="button" class="btn btn-secondary btn-sm remove-soc-logo-btn" data-index="${idx}" style="padding: 4px 10px; font-size: 0.72rem;">✕ REMOVE</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelSocialsBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm" id="saveSocialsBtn">SAVE ALL CHANNELS</button>
          </div>
        </div>
      `;

      // Inputs handlers
      document.querySelectorAll('.soc-icon-inp').forEach(inp => {
        inp.addEventListener('input', (e) => {
          channels[parseInt(e.target.dataset.index, 10)].icon = e.target.value.trim();
        });
      });
      document.querySelectorAll('.soc-name-inp').forEach(inp => {
        inp.addEventListener('input', (e) => {
          channels[parseInt(e.target.dataset.index, 10)].name = e.target.value.trim();
        });
      });
      document.querySelectorAll('.soc-url-inp').forEach(inp => {
        inp.addEventListener('input', (e) => {
          channels[parseInt(e.target.dataset.index, 10)].url = e.target.value.trim();
        });
      });

      // Delete channel
      document.querySelectorAll('.del-soc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          channels.splice(idx, 1);
          renderModalContent();
        });
      });

      // Upload logo
      document.querySelectorAll('.soc-logo-file-inp').forEach(inp => {
        inp.addEventListener('change', (e) => {
          const idx = parseInt(e.target.dataset.index, 10);
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              channels[idx].logo = ev.target.result;
              renderModalContent();
            };
            reader.readAsDataURL(file);
          }
        });
      });

      // Remove logo
      document.querySelectorAll('.remove-soc-logo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          channels[idx].logo = '';
          renderModalContent();
        });
      });

      // Add new channel
      document.getElementById('addNewSocialRowBtn')?.addEventListener('click', () => {
        channels.push({
          id: `soc-${Date.now()}`,
          name: 'NEW CHANNEL',
          url: 'https://',
          icon: '🌐',
          logo: ''
        });
        renderModalContent();
      });

      document.getElementById('cancelSocialsBtn')?.addEventListener('click', closeModals);

      document.getElementById('saveSocialsBtn')?.addEventListener('click', () => {
        appState.socialChannels = channels;
        saveState();
        renderContact();
        closeModals();
      });
    }

    renderModalContent();
    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // CONTACT METHOD CARD MODAL (SINGLE CARD EDIT / ADD)
  // --------------------------------------------------------------------------
  function openContactMethodModal(index) {
    if (!requireAdminAuth()) return;
    const isNew = index === -1;
    const methods = Array.isArray(appState.contactMethods) ? appState.contactMethods : [];
    const item = isNew ? {
      id: `cm-${Date.now()}`,
      label: 'COMMUNICATION CHANNEL',
      value: 'yourname@handle.com',
      link: '',
      icon: '📞',
      logo: ''
    } : (methods[index] || {
      id: `cm-${Date.now()}`,
      label: 'COMMUNICATION CHANNEL',
      value: '',
      link: '',
      icon: '📞',
      logo: ''
    });

    let currentLogo = item.logo || '';

    if (!elements.editModalBody || !elements.editModal) return;

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <h3 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--accent-cyan); font-family: var(--font-heading);">
          ${isNew ? '➕ ADD NEW CONTACT METHOD' : `✏️ EDIT CONTACT CHANNEL: ${item.label}`}
        </h3>

        <form id="contactMethodEditForm">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Channel Label * (e.g. DIRECT EMAIL, PHONE / WHATSAPP)</label>
              <input type="text" id="cm_label" class="form-input" value="${item.label || ''}" required />
            </div>

            <div class="form-group">
              <label class="form-label">Display Value * (e.g. gunshot.broadcast@gmail.com)</label>
              <input type="text" id="cm_value" class="form-input" value="${item.value || ''}" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Clickable Link / URL (optional, e.g. mailto:..., tel:..., https://...)</label>
            <input type="text" id="cm_link" class="form-input" value="${item.link || ''}" placeholder="mailto:you@email.com or https://discord.com" />
          </div>

          <div style="display: grid; grid-template-columns: 120px 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Icon Emoji</label>
              <input type="text" id="cm_icon" class="form-input" value="${item.icon || '📞'}" style="text-align: center; font-size: 1.2rem;" />
            </div>

            <div class="form-group">
              <label class="form-label">Or Custom Logo Image</label>
              <div style="display: flex; gap: 10px; align-items: center;">
                <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;">
                  <span>📁 UPLOAD LOGO</span>
                  <input type="file" id="cm_logo_file" accept="image/*" style="display: none;" />
                </label>
                <button type="button" class="btn btn-secondary btn-sm" id="cm_remove_logo" style="${currentLogo ? '' : 'display: none;'}">
                  ✕ REMOVE
                </button>
              </div>
            </div>
          </div>

          <!-- Logo Preview Box -->
          <div style="margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.4); border: 1px dashed var(--border-subtle); border-radius: var(--radius-chamfer-sm); display: flex; align-items: center; gap: 12px;">
            <div id="cm_preview_box" style="width: 36px; height: 36px; border: 1px solid var(--accent-cyan); border-radius: var(--radius-chamfer-sm); display: flex; align-items: center; justify-content: center; background: rgba(0,240,255,0.08); overflow: hidden;">
              ${currentLogo ? `<img src="${currentLogo}" style="max-width:24px; max-height:24px; object-fit:contain;" />` : `<span style="font-size:1.1rem;">${item.icon || '📞'}</span>`}
            </div>
            <div class="font-mono text-muted" style="font-size: 0.78rem;" id="cm_preview_label">
              ${currentLogo ? 'Custom logo image loaded' : `Using icon: ${item.icon || '📞'}`}
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelCmEditBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm">SAVE CHANNEL</button>
          </div>
        </form>
      </div>
    `;

    const logoFileInput = document.getElementById('cm_logo_file');
    const removeLogoBtn = document.getElementById('cm_remove_logo');
    const previewBox = document.getElementById('cm_preview_box');
    const previewLabel = document.getElementById('cm_preview_label');
    const iconInput = document.getElementById('cm_icon');

    iconInput?.addEventListener('input', () => {
      if (!currentLogo && previewBox && previewLabel) {
        previewBox.innerHTML = `<span style="font-size:1.1rem;">${iconInput.value || '📞'}</span>`;
        previewLabel.textContent = `Using icon: ${iconInput.value || '📞'}`;
      }
    });

    logoFileInput?.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          currentLogo = ev.target.result;
          if (previewBox) previewBox.innerHTML = `<img src="${currentLogo}" style="max-width:24px; max-height:24px; object-fit:contain;" />`;
          if (previewLabel) previewLabel.textContent = 'Custom logo image loaded';
          if (removeLogoBtn) removeLogoBtn.style.display = 'inline-flex';
        };
        reader.readAsDataURL(file);
      }
    });

    removeLogoBtn?.addEventListener('click', () => {
      currentLogo = '';
      if (previewBox) previewBox.innerHTML = `<span style="font-size:1.1rem;">${iconInput.value || '📞'}</span>`;
      if (previewLabel) previewLabel.textContent = `Using icon: ${iconInput.value || '📞'}`;
      removeLogoBtn.style.display = 'none';
    });

    document.getElementById('cancelCmEditBtn')?.addEventListener('click', closeModals);

    document.getElementById('contactMethodEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const newLabel = document.getElementById('cm_label').value.trim();
      const newValue = document.getElementById('cm_value').value.trim();
      const newLink = document.getElementById('cm_link').value.trim();
      const newIcon = document.getElementById('cm_icon').value.trim() || '📞';

      if (!Array.isArray(appState.contactMethods)) {
        appState.contactMethods = [];
      }

      if (isNew) {
        appState.contactMethods.push({
          id: `cm-${Date.now()}`,
          label: newLabel,
          value: newValue,
          link: newLink,
          icon: newIcon,
          logo: currentLogo
        });
      } else {
        appState.contactMethods[index] = {
          ...appState.contactMethods[index],
          label: newLabel,
          value: newValue,
          link: newLink,
          icon: newIcon,
          logo: currentLogo
        };
      }

      saveState();
      renderContact();
      closeModals();
    });

    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // CONTACT METHODS MANAGER MODAL (BATCH EDIT ALL CHANNELS & CARDS)
  // --------------------------------------------------------------------------
  function openContactMethodsManagerModal() {
    if (!requireAdminAuth()) return;
    const list = Array.isArray(appState.contactMethods) ? JSON.parse(JSON.stringify(appState.contactMethods)) : [];

    function renderModalContent() {
      elements.editModalBody.innerHTML = `
        <div style="padding: 34px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h3 style="font-size: 1.5rem; color: var(--accent-cyan); font-family: var(--font-heading); margin-bottom: 0;">
              📞 MANAGE CONTACT CHANNELS &amp; INFO CARDS
            </h3>
            <button type="button" class="btn btn-primary btn-sm" id="addNewCmRowBtn">
              <span>➕ ADD CHANNEL</span>
            </button>
          </div>

          <div style="max-height: 52vh; overflow-y: auto; padding-right: 6px;">
            ${list.map((m, idx) => `
              <div style="background: rgba(14,20,32,0.85); border: 1px solid var(--border-subtle); border-radius: var(--radius-chamfer-sm); padding: 14px; margin-bottom: 12px;" data-row-index="${idx}">
                <div style="display: grid; grid-template-columns: 70px 1.2fr 1.5fr 1fr auto; gap: 10px; align-items: center;">
                  <div>
                    <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">ICON</label>
                    <input type="text" class="form-input cm-row-icon-inp" data-index="${idx}" value="${m.icon || '📞'}" style="text-align: center;" />
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">LABEL</label>
                    <input type="text" class="form-input cm-row-label-inp" data-index="${idx}" value="${m.label || ''}" placeholder="e.g. DIRECT EMAIL" />
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">VALUE</label>
                    <input type="text" class="form-input cm-row-val-inp" data-index="${idx}" value="${m.value || ''}" placeholder="e.g. name@domain.com" />
                  </div>
                  <div>
                    <label class="form-label" style="font-size: 0.72rem; margin-bottom: 4px;">LINK (OPTIONAL)</label>
                    <input type="text" class="form-input cm-row-link-inp" data-index="${idx}" value="${m.link || ''}" placeholder="mailto:... or tel:..." />
                  </div>
                  <div style="padding-top: 18px;">
                    <button type="button" class="pillar-mini-btn del-btn del-cm-row-btn" data-index="${idx}" title="Delete channel">🗑️</button>
                  </div>
                </div>

                <!-- Custom Logo Upload for this row -->
                <div style="display: flex; align-items: center; gap: 12px; margin-top: 10px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.08);">
                  <div style="width: 28px; height: 28px; border: 1px solid var(--accent-cyan); border-radius: 4px; display: flex; align-items: center; justify-content: center; background: rgba(0,240,255,0.08); overflow: hidden;">
                    ${m.logo ? `<img src="${m.logo}" style="width:100%; height:100%; object-fit:contain;" />` : `<span style="font-size:0.9rem;">${m.icon || '📞'}</span>`}
                  </div>
                  <label class="btn btn-secondary btn-sm" style="cursor: pointer; padding: 4px 10px; font-size: 0.72rem; margin: 0;">
                    <span>📷 UPLOAD CUSTOM LOGO</span>
                    <input type="file" accept="image/*" class="cm-row-logo-file-inp" data-index="${idx}" style="display: none;" />
                  </label>
                  ${m.logo ? `<button type="button" class="btn btn-secondary btn-sm remove-cm-row-logo-btn" data-index="${idx}" style="padding: 4px 10px; font-size: 0.72rem;">✕ REMOVE</button>` : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 22px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelCmManagerBtn">CANCEL</button>
            <button type="button" class="btn btn-primary btn-sm" id="saveCmManagerBtn">SAVE ALL CONTACT CHANNELS</button>
          </div>
        </div>
      `;

      // Inputs handlers
      document.querySelectorAll('.cm-row-icon-inp').forEach(inp => {
        inp.addEventListener('input', (e) => {
          list[parseInt(e.target.dataset.index, 10)].icon = e.target.value.trim();
        });
      });
      document.querySelectorAll('.cm-row-label-inp').forEach(inp => {
        inp.addEventListener('input', (e) => {
          list[parseInt(e.target.dataset.index, 10)].label = e.target.value.trim();
        });
      });
      document.querySelectorAll('.cm-row-val-inp').forEach(inp => {
        inp.addEventListener('input', (e) => {
          list[parseInt(e.target.dataset.index, 10)].value = e.target.value.trim();
        });
      });
      document.querySelectorAll('.cm-row-link-inp').forEach(inp => {
        inp.addEventListener('input', (e) => {
          list[parseInt(e.target.dataset.index, 10)].link = e.target.value.trim();
        });
      });

      // Delete channel
      document.querySelectorAll('.del-cm-row-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          list.splice(idx, 1);
          renderModalContent();
        });
      });

      // Upload logo
      document.querySelectorAll('.cm-row-logo-file-inp').forEach(inp => {
        inp.addEventListener('change', (e) => {
          const idx = parseInt(e.target.dataset.index, 10);
          const file = e.target.files && e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              list[idx].logo = ev.target.result;
              renderModalContent();
            };
            reader.readAsDataURL(file);
          }
        });
      });

      // Remove logo
      document.querySelectorAll('.remove-cm-row-logo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(e.currentTarget.dataset.index, 10);
          list[idx].logo = '';
          renderModalContent();
        });
      });

      // Add new channel row
      document.getElementById('addNewCmRowBtn')?.addEventListener('click', () => {
        list.push({
          id: `cm-${Date.now()}`,
          label: 'NEW CHANNEL',
          value: '',
          link: '',
          icon: '📞',
          logo: ''
        });
        renderModalContent();
      });

      document.getElementById('cancelCmManagerBtn')?.addEventListener('click', closeModals);

      document.getElementById('saveCmManagerBtn')?.addEventListener('click', () => {
        appState.contactMethods = list;
        saveState();
        renderContact();
        closeModals();
      });
    }

    renderModalContent();
    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // CONTACT FORM CONFIGURATION MODAL (EDIT ALL FORM LABELS, PLACEHOLDERS & OPTIONS)
  // --------------------------------------------------------------------------
  function openContactFormConfigModal() {
    if (!requireAdminAuth()) return;
    const cfg = appState.contactFormConfig || {
      formTitle: 'DIRECT BROADCAST DISPATCH',
      nameLabel: 'YOUR FULL NAME *',
      namePlaceholder: 'e.g. Alex Morgan',
      emailLabel: 'EMAIL ADDRESS *',
      emailPlaceholder: 'name@organization.com',
      subjectLabel: 'SUBJECT / PROJECT TYPE *',
      subjectOptions: [
        'Tournament Broadcast Production',
        'vMix GT Title Design Project',
        'Live Graphics & Overlays (Singular.live)',
        'General Broadcast Collaboration'
      ],
      messageLabel: 'MESSAGE DETAILS *',
      messagePlaceholder: 'Describe tournament scope, dates, or broadcast requirements...',
      submitBtnText: 'SEND TRANSMISSION DISPATCH ➔'
    };

    const subjectOptsStr = Array.isArray(cfg.subjectOptions)
      ? cfg.subjectOptions.join('\n')
      : (cfg.subjectOptions || '').replace(/,\s*/g, '\n');

    if (!elements.editModalBody || !elements.editModal) return;

    elements.editModalBody.innerHTML = `
      <div style="padding: 34px;">
        <h3 style="font-size: 1.5rem; margin-bottom: 20px; color: var(--accent-cyan); font-family: var(--font-heading);">
          📝 EDIT CONTACT FORM FIELDS &amp; OPTIONS
        </h3>

        <form id="contactFormConfigEditForm">
          <div class="form-group">
            <label class="form-label">Form Header Badge / Title</label>
            <input type="text" id="cfg_formTitle" class="form-input" value="${cfg.formTitle || 'DIRECT BROADCAST DISPATCH'}" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Name Field Label</label>
              <input type="text" id="cfg_nameLabel" class="form-input" value="${cfg.nameLabel || 'YOUR FULL NAME *'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Name Placeholder</label>
              <input type="text" id="cfg_namePlaceholder" class="form-input" value="${cfg.namePlaceholder || 'e.g. Alex Morgan'}" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Email Field Label</label>
              <input type="text" id="cfg_emailLabel" class="form-input" value="${cfg.emailLabel || 'EMAIL ADDRESS *'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Email Placeholder</label>
              <input type="text" id="cfg_emailPlaceholder" class="form-input" value="${cfg.emailPlaceholder || 'name@organization.com'}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Subject Field Label</label>
            <input type="text" id="cfg_subjectLabel" class="form-input" value="${cfg.subjectLabel || 'SUBJECT / PROJECT TYPE *'}" />
          </div>

          <div class="form-group">
            <label class="form-label">Subject Dropdown Options (one per line)</label>
            <textarea id="cfg_subjectOptions" class="form-textarea" rows="4">${subjectOptsStr}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div class="form-group">
              <label class="form-label">Message Field Label</label>
              <input type="text" id="cfg_messageLabel" class="form-input" value="${cfg.messageLabel || 'MESSAGE DETAILS *'}" />
            </div>
            <div class="form-group">
              <label class="form-label">Submit Button Text</label>
              <input type="text" id="cfg_submitBtnText" class="form-input" value="${cfg.submitBtnText || 'SEND TRANSMISSION DISPATCH ➔'}" />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Message Placeholder</label>
            <input type="text" id="cfg_messagePlaceholder" class="form-input" value="${cfg.messagePlaceholder || 'Describe tournament scope, dates, or broadcast requirements...'}" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelFormCfgBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm">SAVE FORM SETTINGS</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('cancelFormCfgBtn')?.addEventListener('click', closeModals);

    document.getElementById('contactFormConfigEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const rawOptions = document.getElementById('cfg_subjectOptions').value;
      const parsedOptions = rawOptions
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      appState.contactFormConfig = {
        formTitle: document.getElementById('cfg_formTitle').value.trim() || 'DIRECT BROADCAST DISPATCH',
        nameLabel: document.getElementById('cfg_nameLabel').value.trim() || 'YOUR FULL NAME *',
        namePlaceholder: document.getElementById('cfg_namePlaceholder').value.trim() || 'e.g. Alex Morgan',
        emailLabel: document.getElementById('cfg_emailLabel').value.trim() || 'EMAIL ADDRESS *',
        emailPlaceholder: document.getElementById('cfg_emailPlaceholder').value.trim() || 'name@organization.com',
        subjectLabel: document.getElementById('cfg_subjectLabel').value.trim() || 'SUBJECT / PROJECT TYPE *',
        subjectOptions: parsedOptions.length > 0 ? parsedOptions : ['Tournament Broadcast Production', 'vMix GT Title Design Project'],
        messageLabel: document.getElementById('cfg_messageLabel').value.trim() || 'MESSAGE DETAILS *',
        messagePlaceholder: document.getElementById('cfg_messagePlaceholder').value.trim() || 'Describe tournament scope, dates, or broadcast requirements...',
        submitBtnText: document.getElementById('cfg_submitBtnText').value.trim() || 'SEND TRANSMISSION DISPATCH ➔'
      };

      saveState();
      renderContact();
      closeModals();
    });

    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // PRODUCTION EDIT MODAL (CREATE / EDIT)
  // --------------------------------------------------------------------------
  function openProductionEditModal(index) {
    if (!requireAdminAuth()) return;
    const isNew = index === -1;
    const item = isNew ? {
      title: 'FFWS BD FALL 2026',
      agency: 'UNDER ECUBE',
      role: 'Assistant Producer & GT Title Designer',
      game: 'Garena Free Fire',
      date: 'Fall 2026',
      badgeText: 'LIVE PRODUCTION',
      badgeDate: 'FALL 2026',
      logo: '',
      location: 'Dhaka, Bangladesh',
      banner: 'assets/images/event-lan-arena.jpg',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      photos: [
        'assets/images/event-lan-arena.jpg',
        'assets/images/event-control-room.jpg'
      ],
      description: 'Describe live tournament production, GT title design, live graphics, and vMix switching...',
      highlights: ['GT Title Scoreboards', 'Live Graphics Overlays', 'vMix Master Switching']
    } : appState.productions[index];

    openEditModal({
      title: isNew ? '➕ ADD NEW TOURNAMENT PRODUCTION' : `✏️ EDIT: ${item.title}`,
      fields: [
        { key: 'title', label: 'Tournament Title (e.g. FFWS BD FALL 2026)', value: item.title, type: 'text' },
        { 
          key: 'titleFont', 
          label: 'Tournament Title Font', 
          value: item.titleFont || '', 
          type: 'select', 
          options: [{ value: '', name: 'Default Heading Font' }, ...FONT_OPTIONS] 
        },
        { key: 'agency', label: 'Production Agency (e.g. UNDER ECUBE)', value: item.agency, type: 'text' },
        { key: 'role', label: 'My Role', value: item.role, type: 'text' },
        { key: 'game', label: 'Game Title', value: item.game, type: 'text' },
        { key: 'date', label: 'Date / Season', value: item.date, type: 'text' },
        { key: 'liveLink', label: 'Broadcast Live Stream URL (Auto-opens on "WATCH BROADCAST")', value: item.liveLink || item.videoUrl || '', type: 'text' },
        { key: 'location', label: 'Location / Venue', value: item.location, type: 'text' },
        { key: 'photos', label: 'Event Photo Paths / URLs (comma-separated)', value: (item.photos || []).join(', '), type: 'textarea' },
        { key: 'description', label: 'Tournament Overview', value: item.description, type: 'textarea' },
        { key: 'highlights', label: 'Key Highlights (comma-separated)', value: (item.highlights || []).join(', '), type: 'text' }
      ],
      onSave: (vals) => {
        vals.highlights = vals.highlights ? vals.highlights.split(',').map(s => s.trim()).filter(Boolean) : [];
        vals.photos = vals.photos ? vals.photos.split(',').map(s => s.trim()).filter(Boolean) : (item.photos || []);
        vals.videoUrl = vals.liveLink || vals.videoUrl || '';
        if (isNew) {
          vals.id = `prod-${Date.now()}`;
          vals.banner = item.banner;
          vals.logo = item.logo || '';
          appState.productions.unshift(vals);
        } else {
          Object.assign(appState.productions[index], vals);
        }
        saveState();
        renderProductions();
      }
    });
  }

  // --------------------------------------------------------------------------
  // GENERIC QUICK EDIT MODAL
  // --------------------------------------------------------------------------
  function openEditModal(config) {
    if (!requireAdminAuth()) return;
    if (!elements.editModalBody || !elements.editModal) return;

    elements.editModalBody.innerHTML = `
      <div style="padding: 36px;">
        <h3 style="font-size: 1.6rem; margin-bottom: 20px; color: var(--accent-cyan); font-family: var(--font-heading);">
          ${config.title}
        </h3>

        <form id="genericEditForm">
          ${config.fields.map(f => `
            <div class="form-group">
              <label class="form-label">${f.label}</label>
              ${f.type === 'textarea' 
                ? `<textarea id="edit_${f.key}" class="form-textarea" rows="4">${f.value || ''}</textarea>` 
                : f.type === 'select'
                ? `<select id="edit_${f.key}" class="form-input">${(f.options || []).map(opt => `<option value="${opt.value !== undefined ? opt.value : opt}" ${(opt.value !== undefined ? opt.value : opt) === f.value ? 'selected' : ''}>${opt.label || opt.name || opt}</option>`).join('')}</select>`
                : `<input type="text" id="edit_${f.key}" class="form-input" value="${f.value || ''}" />`
              }
            </div>
          `).join('')}

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--border-subtle);">
            <button type="button" class="btn btn-secondary btn-sm" id="cancelEditModalBtn">CANCEL</button>
            <button type="submit" class="btn btn-primary btn-sm">SAVE CHANGES</button>
          </div>
        </form>
      </div>
    `;

    document.getElementById('cancelEditModalBtn')?.addEventListener('click', closeModals);

    document.getElementById('genericEditForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = {};
      config.fields.forEach(f => {
        const el = document.getElementById(`edit_${f.key}`);
        if (el) results[f.key] = el.value;
      });
      config.onSave(results);
      closeModals();
    });

    PaperAudio.playPaperPageFlip();
    elements.editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // VIDEO PLAYER MODAL (100% DARK ESPORTS THEME, ZERO WHITE BACKGROUND)
  // --------------------------------------------------------------------------
  async function openVideoPlayer(source, title, videoItem) {
    if (!elements.videoModalContainer || !elements.videoModal) return;

    let finalVideoUrl = '';

    // Check if video has an IndexedDB storageKey
    if (videoItem && videoItem.storageKey) {
      finalVideoUrl = await VideoStorage.getVideoUrl(videoItem.storageKey);
    } else if (typeof source === 'string' && source.startsWith('vid-')) {
      finalVideoUrl = await VideoStorage.getVideoUrl(source);
    }

    if (!finalVideoUrl && typeof source === 'string') {
      finalVideoUrl = source;
    }
    if (!finalVideoUrl && videoItem && videoItem.videoUrl) {
      finalVideoUrl = videoItem.videoUrl;
    }

    // Helper: convert any raw YouTube/Vimeo/Drive link to embeddable URL
    function getEmbedUrl(url) {
      if (!url || typeof url !== 'string') return '';
      const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      if (ytMatch && ytMatch[1]) {
        return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
      }
      const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
      if (vimeoMatch && vimeoMatch[1]) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
      }
      if (url.includes('drive.google.com/file/d/')) {
        return url.replace(/\/view.*$/, '/preview');
      }
      return url;
    }

    const embedUrl = getEmbedUrl(finalVideoUrl);
    const isEmbeddable = embedUrl.includes('youtube.com/embed') || embedUrl.includes('player.vimeo.com') || embedUrl.includes('drive.google.com');
    const isDirectVideo = finalVideoUrl && (
      finalVideoUrl.startsWith('blob:') || 
      finalVideoUrl.startsWith('data:video/') || 
      /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(finalVideoUrl)
    );

    let viewportContent = '';
    if (isEmbeddable) {
      viewportContent = `
        <iframe 
          src="${embedUrl}" 
          title="${title || 'Broadcast Video Player'}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
          allowfullscreen
          style="width: 100%; height: 100%; border: 0; background: #000000;">
        </iframe>
      `;
    } else if (isDirectVideo) {
      viewportContent = `
        <video 
          id="activeModalVideoPlayer"
          src="${finalVideoUrl}" 
          controls 
          autoplay 
          playsinline 
          style="width: 100%; height: 100%; background: #000000; object-fit: contain;">
          Your browser does not support HTML5 video playback.
        </video>
      `;
    } else {
      viewportContent = `
        <div style="position: absolute; inset: 0; background: radial-gradient(circle at center, #141923 0%, #080b10 100%); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 28px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 12px; filter: drop-shadow(0 0 16px var(--accent-cyan));">🎥</div>
          <h4 style="font-family: var(--font-heading); color: #ffffff; font-size: 1.3rem; font-weight: 700; letter-spacing: 0.04em; margin-bottom: 6px;">
            NO LOCAL VIDEO FILE ATTACHED
          </h4>
          <p style="color: var(--text-secondary); font-size: 0.9rem; max-width: 460px; margin-bottom: 22px; line-height: 1.55;">
            Upload your master video file (.mp4, .webm, .mov) or attach a stream URL for <strong>"${title || 'this tournament reel'}"</strong>.
          </p>
          ${(typeof AdminAuthManager !== 'undefined' && AdminAuthManager.isAuthenticated) ? `
          <div style="display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            <label class="btn btn-primary btn-sm" style="cursor: pointer;">
              <span>📁 UPLOAD LOCAL VIDEO</span>
              <input type="file" accept="video/*" id="instantModalVideoUpload" style="display: none;" />
            </label>
            <button type="button" class="btn btn-secondary btn-sm" id="modalAttachUrlBtn">
              <span>🔗 ATTACH VIDEO LINK</span>
            </button>
          </div>
          ` : `
          <p class="font-mono text-cyan" style="font-size: 0.8rem; margin: 0;">
            ● OFFICIAL SHOWREEL RECORDING IN PRODUCTION // CHECK BACK SOON
          </p>
          `}
        </div>
      `;
    }

    elements.videoModalContainer.innerHTML = `
      <div class="video-modal-header-bar">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="brand-tally tally-pulse" style="width: 9px; height: 9px; border-radius: 50%; background: var(--accent-red); box-shadow: 0 0 12px var(--accent-red); display: inline-block;"></span>
          <span class="font-mono" style="font-size: 0.82rem; font-weight: 800; color: #ffffff; letter-spacing: 0.08em;">
            BROADCAST PGM // LIVE CUT
          </span>
        </div>
        <div class="font-mono" style="font-size: 0.78rem; color: var(--accent-red); font-weight: 800; letter-spacing: 0.06em; display: flex; align-items: center; gap: 6px;">
          <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent-red);"></span>
          LOCAL MASTER 1080P 60FPS
        </div>
      </div>

      <div style="position: relative; aspect-ratio: 16/9; width: 100%; background: #000000; overflow: hidden; border-bottom: 1px solid var(--border-subtle);">
        ${viewportContent}
      </div>

      <div class="video-modal-esports-footer">
        <div class="video-modal-meta-left">
          <div class="video-modal-badges-row">
            <span class="video-modal-event-badge font-heading">
              ⚡ ${videoItem?.event || 'OFFICIAL PRODUCTION'}
            </span>
            <span class="video-modal-role-badge font-mono">
              ${videoItem?.role || 'Assistant Producer & GT Title Designer'}
            </span>
          </div>
          <h3 class="video-modal-title font-heading">
            ${title || 'Tournament Broadcast'}
          </h3>
          <p class="video-modal-desc">
            ${videoItem?.description || 'Broadcast master feed, real-time live graphics, and tournament showreel.'}
          </p>
        </div>
        
        <div class="video-modal-meta-right">
          <span class="video-modal-duration-chip font-mono">
            ⏱️ DURATION: ${videoItem?.duration || 'HD'}
          </span>
          <div style="display: flex; gap: 8px;">
            <label class="btn btn-secondary btn-sm" style="cursor: pointer; margin: 0;" title="Replace with a new video file">
              <span>🔄 REPLACE</span>
              <input type="file" accept="video/*" id="modalReplaceVideoInput" style="display: none;" />
            </label>
            <button type="button" class="btn btn-secondary btn-sm" id="modalEditMetaBtn" title="Edit video title and description">
              <span>✏️ EDIT</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Handler: Upload local video from modal
    const handleModalFile = async (file) => {
      if (!file) return;
      const vidId = `vid-${Date.now()}`;
      const meta = await extractVideoMetadataAndFrame(file);
      await VideoStorage.saveVideo(vidId, file, { name: file.name, title });
      if (videoItem) {
        videoItem.storageKey = vidId;
        videoItem.duration = meta.duration || 'HD';
        videoItem.thumbnail = meta.thumbnail || videoItem.thumbnail;
        videoItem.videoUrl = '';
        saveState();
        renderVideos();
        renderProductions();
      }
      const newUrl = await VideoStorage.getVideoUrl(vidId);
      openVideoPlayer(newUrl, title, videoItem);
    };

    document.getElementById('instantModalVideoUpload')?.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      await handleModalFile(file);
    });

    document.getElementById('modalReplaceVideoInput')?.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      await handleModalFile(file);
    });

    document.getElementById('modalAttachUrlBtn')?.addEventListener('click', () => {
      const newUrl = prompt('Enter YouTube, Vimeo, Google Drive, or direct video URL:', videoItem?.videoUrl || '');
      if (newUrl && newUrl.trim()) {
        if (videoItem) {
          videoItem.videoUrl = newUrl.trim();
          videoItem.storageKey = '';
          saveState();
          renderVideos();
        }
        openVideoPlayer(newUrl.trim(), title, videoItem);
      }
    });

    document.getElementById('modalEditMetaBtn')?.addEventListener('click', () => {
      const vidIndex = appState.videos ? appState.videos.indexOf(videoItem) : -1;
      if (vidIndex >= 0) {
        closeModals();
        openVideoEditModal(vidIndex);
      }
    });

    PaperAudio.playPaperPageFlip();
    elements.videoModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // --------------------------------------------------------------------------
  // MODAL CONTROLLERS & CLOSING
  // --------------------------------------------------------------------------
  function setupModals() {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModals();
      });
    });

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', closeModals);
    });

    // Lightbox navigation buttons
    elements.prevLightboxPhotoBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      prevLightboxPhoto();
    });

    elements.nextLightboxPhotoBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      nextLightboxPhoto();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModals();
      if (elements.photoLightboxModal && elements.photoLightboxModal.classList.contains('active')) {
        if (e.key === 'ArrowRight') nextLightboxPhoto();
        if (e.key === 'ArrowLeft') prevLightboxPhoto();
      }
    });
  }

  function closeModals() {
    document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
    const activeVid = document.getElementById('activeModalVideoPlayer');
    if (activeVid) {
      activeVid.pause();
      activeVid.src = '';
    }
    if (elements.videoModalContainer) elements.videoModalContainer.innerHTML = '';
    document.body.style.overflow = '';
  }

  // --------------------------------------------------------------------------
  // NAVIGATION & SCROLLSPY
  // --------------------------------------------------------------------------
  function setupNavigation() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        elements.navbar?.classList.add('scrolled');
      } else {
        elements.navbar?.classList.remove('scrolled');
      }
      updateActiveNavLink();
    });

    elements.mobileToggle?.addEventListener('click', () => {
      elements.mobileToggle.classList.toggle('active');
      elements.navMenu?.classList.toggle('open');
      document.body.style.overflow = elements.navMenu?.classList.contains('open') ? 'hidden' : '';
    });

    elements.navLinks.forEach(link => {
      link.addEventListener('click', () => {
        elements.mobileToggle?.classList.remove('active');
        elements.navMenu?.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 130;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        elements.navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // --------------------------------------------------------------------------
  // CONTACT FORM DISPATCH
  // --------------------------------------------------------------------------
  function setupContactForm() {
    elements.contactForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = elements.contactForm.querySelector('button[type="submit"]');
      const original = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>TRANSMITTING DISPATCH...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
        alert('DISPATCH RECEIVED: Message routed to GUNSHOT broadcast console.');
        elements.contactForm.reset();
      }, 1000);
    });
  }

  // --------------------------------------------------------------------------
  // INTERACTIVE CURSOR PHYSICS & SEGMENT SPOTLIGHT EFFECTS
  // --------------------------------------------------------------------------
  function setupInteractiveCursorEffects() {
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (!cursorDot || !cursorRing) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!isMoving) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        isMoving = true;
      }
    });

    // Smooth trailing physics for outer targeting ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover effect & Paper Rustle on buttons, cards, and interactive elements
    function attachHoverTriggers() {
      const interactiveTargets = document.querySelectorAll(
        'button, a, input, textarea, select, .hud-card, .production-card, .video-card, .toolbar-btn, .card-action-btn, .hero-image-frame, .pillar-card, .meta-chip, .about-statement-box, .prod-photo-thumb, .prod-photo-add-tile'
      );

      interactiveTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorRing.classList.add('cursor-hover');
          cursorDot.classList.add('cursor-hover');
          PaperAudio.playPaperRustle();
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.classList.remove('cursor-hover');
          cursorDot.classList.remove('cursor-hover');
        });
      });
    }

    // Dynamic Tactile Paper Tilt & Spotlight on Cards
    function attachCardSpotlight() {
      const tiltCards = document.querySelectorAll(
        '.hud-card, .production-card, .video-card, .about-statement-box, .pillar-card, .hero-image-frame, .meta-chip, .about-image-wrapper'
      );

      tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);

          // Tactile paper tilt perspective
          if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
          }
        });

        card.addEventListener('mouseleave', () => {
          card.style.setProperty('--mouse-x', `-999px`);
          card.style.setProperty('--mouse-y', `-999px`);
          card.style.transform = '';
        });
      });

      // Section-level ambient mouse paper spotlight
      document.querySelectorAll('section').forEach(sec => {
        sec.addEventListener('mousemove', (e) => {
          const rect = sec.getBoundingClientRect();
          sec.style.setProperty('--sec-mouse-x', `${e.clientX - rect.left}px`);
          sec.style.setProperty('--sec-mouse-y', `${e.clientY - rect.top}px`);
        });
        sec.addEventListener('mouseleave', () => {
          sec.style.setProperty('--sec-mouse-x', `-999px`);
          sec.style.setProperty('--sec-mouse-y', `-999px`);
        });
      });
    }

    // Click effect & Paper Tear / Rip sound trigger
    window.addEventListener('mousedown', (e) => {
      cursorRing.classList.add('cursor-active');
      if (e.target.closest('button, .btn, a, .toolbar-btn, .card-action-btn, .prod-photo-thumb, .prod-photo-add-tile, .meta-chip, .section-header-edit-btn, .paper-audio-btn')) {
        PaperAudio.playPaperRip();
      }
    });

    window.addEventListener('mouseup', () => cursorRing.classList.remove('cursor-active'));

    attachHoverTriggers();
    attachCardSpotlight();

    window.rebindInteractiveEffects = () => {
      attachHoverTriggers();
      attachCardSpotlight();
      applyWordFxToDOM(document.body);
      if (typeof InlineTextEditor !== 'undefined') {
        InlineTextEditor.applyOverridesToDOM();
        if (InlineTextEditor.isActive) {
          InlineTextEditor.markEligibleElements();
        }
      }
    };
  }

  // --------------------------------------------------------------------------
  // FULL-WEBSITE INTERACTIVE WORD & TEXT ANIMATION ENGINE
  // --------------------------------------------------------------------------
  function setupGlobalTextWordAnimation() {
    applyWordFxToDOM(document.body);

    // Instant delegated cursor tracking for all words across entire website
    document.addEventListener('mouseover', (e) => {
      const word = e.target.closest('.word-fx');
      if (!word) return;

      word.classList.add('word-active');
      const prev = word.previousElementSibling;
      const next = word.nextElementSibling;
      if (prev && prev.classList.contains('word-fx')) prev.classList.add('word-neighbor');
      if (next && next.classList.contains('word-fx')) next.classList.add('word-neighbor');

      const ring = document.getElementById('cursorRing');
      const dot = document.getElementById('cursorDot');
      if (ring) ring.classList.add('cursor-text-target');
      if (dot) dot.classList.add('cursor-text-target');
    });

    document.addEventListener('mouseout', (e) => {
      const word = e.target.closest('.word-fx');
      if (!word) return;

      word.classList.remove('word-active');
      const prev = word.previousElementSibling;
      const next = word.nextElementSibling;
      if (prev) prev.classList.remove('word-neighbor');
      if (next) next.classList.remove('word-neighbor');

      const ring = document.getElementById('cursorRing');
      const dot = document.getElementById('cursorDot');
      if (ring) ring.classList.remove('cursor-text-target');
      if (dot) dot.classList.remove('cursor-text-target');
    });
  }

  function applyWordFxToDOM(root = document.body) {
    if (!root) return;

    const targetSelectors = [
      'p',
      '.section-tag',
      '.section-subtitle',
      '.section-tag-row span',
      '.hero-intro',
      '.meta-chip-label',
      '.meta-chip-value',
      '.about-statement-text',
      '.pillar-title',
      '.pillar-desc',
      '.about-spec-label',
      '.about-spec-val',
      '.production-tournament-title',
      '.production-agency-tag',
      '.production-role-pill',
      '.production-desc',
      '.production-highlights-list li',
      '.prod-photos-label span',
      '.video-title',
      '.video-desc',
      '.contact-card-title',
      '.contact-card-sub',
      '.form-label',
      '.footer-brand-title',
      '.footer-brand-bio',
      '.footer-tagline',
      '.badge-stat-item span',
      '.brand-title',
      '.brand-sub',
      '.brand-tag',
      '.hero-badge-titles div'
    ];

    if (document.body.classList.contains('live-text-edit-active')) return;

    const elements = root.querySelectorAll(targetSelectors.join(', '));
    elements.forEach(el => {
      if (el.closest('input, textarea, select, button, script, style, .modal-backdrop, .hero-title-name, .section-title, .text-gradient, h1, h2, h3, h4, h5, h6, [contenteditable="true"], .inline-text-toolstrip, .floating-hud-dock')) return;
      if (el.querySelector('.word-fx')) return;

      wrapTextNodesWithWordFx(el);
    });
  }

  function wrapTextNodesWithWordFx(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentNode;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName ? parent.tagName.toLowerCase() : '';
        if (['script', 'style', 'input', 'textarea', 'select', 'button', 'svg', 'code', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest && parent.closest('.hero-title-name, .section-title, .text-gradient, h1, h2, h3, h4, h5, h6')) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.classList && parent.classList.contains('word-fx')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    textNodes.forEach(node => {
      const text = node.nodeValue;
      if (!text || !text.trim()) return;

      const words = text.split(/(\s+)/);
      if (words.length === 0) return;

      const frag = document.createDocumentFragment();
      words.forEach(w => {
        if (/^\s+$/.test(w)) {
          frag.appendChild(document.createTextNode(w));
        } else if (w.length > 0) {
          const span = document.createElement('span');
          span.className = 'word-fx';
          span.textContent = w;
          frag.appendChild(span);
        }
      });
      if (node.parentNode) {
        node.parentNode.replaceChild(frag, node);
      }
    });
  }

  // ==========================================================================
  // TYPOGRAPHY & FONT CUSTOMIZATION ENGINE (BROADCAST GRAPHICS STUDIO)
  // ==========================================================================
  const STORAGE_KEY_TYPOGRAPHY = 'gunshot_portfolio_typography_v2';
  const STORAGE_KEY_TEXT_OVERRIDES = 'gunshot_portfolio_text_overrides_v2';

  // FONT_OPTIONS declared globally at top of module scope

  const TYPO_PRESETS = {
    official: {
      name: 'Official Free Fire',
      globalFont: 'inherit',
      headingFont: "'GFF Latin Black', 'GFF Latin', sans-serif",
      bodyFont: "'Inter', sans-serif",
      badgeFont: "'GFF Latin', sans-serif",
      btnFont: "'GFF Latin', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSizeScale: 100,
      letterSpacing: 3,
      fontWeight: '900',
      transform: 'uppercase'
    },
    cyber: {
      name: 'Cyber Tactical',
      globalFont: 'inherit',
      headingFont: "'Orbitron', sans-serif",
      bodyFont: "'Chakra Petch', sans-serif",
      badgeFont: "'Orbitron', sans-serif",
      btnFont: "'Orbitron', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSizeScale: 100,
      letterSpacing: 4,
      fontWeight: '800',
      transform: 'uppercase'
    },
    tournament: {
      name: 'Tournament Pro',
      globalFont: 'inherit',
      headingFont: "'Teko', sans-serif",
      bodyFont: "'Rajdhani', sans-serif",
      badgeFont: "'Teko', sans-serif",
      btnFont: "'Teko', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSizeScale: 105,
      letterSpacing: 2,
      fontWeight: '700',
      transform: 'uppercase'
    },
    heavy: {
      name: 'Heavy Impact',
      globalFont: 'inherit',
      headingFont: "'Russo One', sans-serif",
      bodyFont: "'Space Grotesk', sans-serif",
      badgeFont: "'Russo One', sans-serif",
      btnFont: "'Russo One', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSizeScale: 100,
      letterSpacing: 2,
      fontWeight: '400',
      transform: 'uppercase'
    },
    headline: {
      name: 'Bold Headline',
      globalFont: 'inherit',
      headingFont: "'Bebas Neue', sans-serif",
      bodyFont: "'Montserrat', sans-serif",
      badgeFont: "'Bebas Neue', sans-serif",
      btnFont: "'Bebas Neue', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSizeScale: 105,
      letterSpacing: 3,
      fontWeight: '400',
      transform: 'uppercase'
    },
    condensed: {
      name: 'GFF Condensed',
      globalFont: 'inherit',
      headingFont: "'GFF Latin Condensed', 'GFF Latin', sans-serif",
      bodyFont: "'GFF Latin', sans-serif",
      badgeFont: "'GFF Latin Condensed', sans-serif",
      btnFont: "'GFF Latin Condensed', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSizeScale: 100,
      letterSpacing: 2,
      fontWeight: '500',
      transform: 'uppercase'
    },
    clean: {
      name: 'Clean Broadcast',
      globalFont: 'inherit',
      headingFont: "'Montserrat', sans-serif",
      bodyFont: "'Inter', sans-serif",
      badgeFont: "'Montserrat', sans-serif",
      btnFont: "'Montserrat', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSizeScale: 100,
      letterSpacing: 2,
      fontWeight: '800',
      transform: 'uppercase'
    },
    avant: {
      name: 'Avant-Garde',
      globalFont: 'inherit',
      headingFont: "'Syne', sans-serif",
      bodyFont: "'Poppins', sans-serif",
      badgeFont: "'Syne', sans-serif",
      btnFont: "'Syne', sans-serif",
      monoFont: "'JetBrains Mono', monospace",
      fontSizeScale: 100,
      letterSpacing: 1,
      fontWeight: '800',
      transform: 'uppercase'
    }
  };

  const TypographyManager = {
    current: null,

    getDefaults() {
      return JSON.parse(JSON.stringify(TYPO_PRESETS.official));
    },

    loadSettings() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_TYPOGRAPHY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return Object.assign(this.getDefaults(), parsed);
        }
      } catch (e) {
        console.warn('Failed to load saved typography', e);
      }
      return this.getDefaults();
    },

    saveSettings(settings) {
      this.current = Object.assign({}, this.current, settings);
      try {
        localStorage.setItem(STORAGE_KEY_TYPOGRAPHY, JSON.stringify(this.current));
      } catch (e) {
        console.warn('Could not save typography to localStorage', e);
      }
      this.applySettings(this.current);
    },

    applySettings(settings) {
      if (!settings) settings = this.current || this.getDefaults();
      this.current = settings;

      const root = document.documentElement;

      if (settings.globalFont && settings.globalFont !== 'inherit') {
        root.style.setProperty('--font-global', settings.globalFont);
        document.body.classList.add('has-global-font');
      } else {
        root.style.removeProperty('--font-global');
        document.body.classList.remove('has-global-font');
      }

      if (settings.headingFont) root.style.setProperty('--font-heading', settings.headingFont);
      if (settings.bodyFont) root.style.setProperty('--font-body', settings.bodyFont);
      if (settings.badgeFont) root.style.setProperty('--font-badge', settings.badgeFont);
      if (settings.btnFont) root.style.setProperty('--font-btn', settings.btnFont);
      if (settings.monoFont) root.style.setProperty('--font-mono', settings.monoFont);

      if (settings.fontSizeScale) {
        const scale = parseFloat(settings.fontSizeScale) / 100;
        root.style.setProperty('--font-scale', scale);
      }

      if (settings.letterSpacing !== undefined) {
        const ls = (parseFloat(settings.letterSpacing) / 100) + 'em';
        root.style.setProperty('--heading-letter-spacing', ls);
      }

      if (settings.fontWeight) {
        root.style.setProperty('--heading-font-weight', settings.fontWeight);
      }

      if (settings.transform) {
        root.style.setProperty('--heading-transform', settings.transform);
      }

      this.updatePreview();
    },

    resetDefaults() {
      const def = this.getDefaults();
      this.saveSettings(def);
      this.populateModalUI(def);
      showBroadcastToast('🔄 Typography reset to official GFF Latin defaults.');
    },

    loadCustomGoogleFont(fontName) {
      if (!fontName || !fontName.trim()) return null;
      const cleanName = fontName.trim();
      const fontId = `custom-font-${cleanName.replace(/\s+/g, '-').toLowerCase()}`;

      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanName)}:wght@400;500;600;700;800;900&display=swap`;
        document.head.appendChild(link);
      }

      const fontVal = `'${cleanName}', sans-serif`;
      if (!FONT_OPTIONS.some(f => f.name.toLowerCase() === cleanName.toLowerCase())) {
        FONT_OPTIONS.unshift({
          name: `${cleanName} (Google Font)`,
          value: fontVal
        });
        this.populateSelects();
      }
      return fontVal;
    },

    populateSelects() {
      const selects = [
        { el: document.getElementById('selectGlobalFont'), includeInherit: true },
        { el: document.getElementById('selectHeadingFont') },
        { el: document.getElementById('selectBodyFont') },
        { el: document.getElementById('selectBadgeFont') },
        { el: document.getElementById('selectBtnFont') },
        { el: document.getElementById('selectMonoFont') }
      ];

      selects.forEach(({ el, includeInherit }) => {
        if (!el) return;
        const currentVal = el.value;
        let html = '';
        if (includeInherit) {
          html += '<option value="inherit">Disabled (Use Category Fonts Below)</option>';
        }
        FONT_OPTIONS.forEach(opt => {
          html += `<option value="${opt.value}">${opt.name}</option>`;
        });
        el.innerHTML = html;
        if (currentVal) el.value = currentVal;
      });
    },

    populateModalUI(settings) {
      if (!settings) settings = this.current || this.getDefaults();
      this.populateSelects();

      const sg = document.getElementById('selectGlobalFont');
      const sh = document.getElementById('selectHeadingFont');
      const sb = document.getElementById('selectBodyFont');
      const sbg = document.getElementById('selectBadgeFont');
      const sbtn = document.getElementById('selectBtnFont');
      const sm = document.getElementById('selectMonoFont');
      const scaleRange = document.getElementById('fontSizeScaleRange');
      const scaleVal = document.getElementById('fontSizeScaleVal');
      const lsRange = document.getElementById('letterSpacingRange');
      const lsVal = document.getElementById('letterSpacingVal');
      const hwSelect = document.getElementById('selectHeadingWeight');
      const htSelect = document.getElementById('selectHeadingTransform');

      if (sg) sg.value = settings.globalFont || 'inherit';
      if (sh) sh.value = settings.headingFont || TYPO_PRESETS.official.headingFont;
      if (sb) sb.value = settings.bodyFont || TYPO_PRESETS.official.bodyFont;
      if (sbg) sbg.value = settings.badgeFont || TYPO_PRESETS.official.badgeFont;
      if (sbtn) sbtn.value = settings.btnFont || TYPO_PRESETS.official.btnFont;
      if (sm) sm.value = settings.monoFont || TYPO_PRESETS.official.monoFont;

      if (scaleRange) {
        scaleRange.value = settings.fontSizeScale || 100;
        if (scaleVal) scaleVal.textContent = `${scaleRange.value}%`;
      }

      if (lsRange) {
        lsRange.value = settings.letterSpacing !== undefined ? settings.letterSpacing : 3;
        if (lsVal) lsVal.textContent = `${(parseFloat(lsRange.value) / 100).toFixed(2)}em`;
      }

      if (hwSelect) hwSelect.value = settings.fontWeight || '900';
      if (htSelect) htSelect.value = settings.transform || 'uppercase';

      document.querySelectorAll('.typo-preset-card').forEach(card => {
        card.classList.remove('active');
      });

      this.updatePreview();
    },

    updatePreview() {
      const box = document.getElementById('typoLivePreviewBox');
      if (!box || !this.current) return;
      const s = this.current;

      const pHead = document.getElementById('previewH1');
      const pRole = document.getElementById('previewRole');
      const pBody = document.getElementById('previewBody');

      if (pHead) {
        pHead.style.fontFamily = s.globalFont && s.globalFont !== 'inherit' ? s.globalFont : s.headingFont;
        pHead.style.letterSpacing = (parseFloat(s.letterSpacing) / 100) + 'em';
        pHead.style.fontWeight = s.fontWeight;
        pHead.style.textTransform = s.transform;
      }
      if (pRole) {
        pRole.style.fontFamily = s.globalFont && s.globalFont !== 'inherit' ? s.globalFont : s.badgeFont;
      }
      if (pBody) {
        pBody.style.fontFamily = s.globalFont && s.globalFont !== 'inherit' ? s.globalFont : s.bodyFont;
      }
    },

    openModal() {
      if (!requireAdminAuth()) return;
      const modal = document.getElementById('fontStudioModal');
      if (!modal) return;
      this.populateModalUI(this.current);
      PaperAudio.playPaperPageFlip();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closeModal() {
      const modal = document.getElementById('fontStudioModal');
      if (modal) modal.classList.remove('active');
      document.body.style.overflow = '';
    },

    init() {
      this.current = this.loadSettings();
      this.applySettings(this.current);

      document.getElementById('navFontStudioBtn')?.addEventListener('click', () => this.openModal());
      document.getElementById('dockFontStudioBtn')?.addEventListener('click', () => this.openModal());
      document.getElementById('liveEditOpenFontsBtn')?.addEventListener('click', () => this.openModal());
      document.getElementById('closeFontStudioModalBtn')?.addEventListener('click', () => this.closeModal());
      document.getElementById('closeFontStudioFooterBtn')?.addEventListener('click', () => this.closeModal());

      document.getElementById('resetFontsModalBtn')?.addEventListener('click', () => this.resetDefaults());
      document.getElementById('dockResetFontsBtn')?.addEventListener('click', () => {
        if (confirm('Reset all website typography back to default GFF Latin fonts?')) {
          this.resetDefaults();
        }
      });

      document.querySelectorAll('.typo-preset-card').forEach(card => {
        card.addEventListener('click', () => {
          const presetKey = card.getAttribute('data-preset');
          if (TYPO_PRESETS[presetKey]) {
            document.querySelectorAll('.typo-preset-card').forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const newSettings = Object.assign({}, TYPO_PRESETS[presetKey]);
            this.current = newSettings;
            this.populateModalUI(newSettings);
            this.applySettings(newSettings);
            PaperAudio.playPaperStamp();
            showBroadcastToast(`⚡ Typography preset "${newSettings.name}" applied!`);
          }
        });
      });

      const handleLiveChange = () => {
        const sg = document.getElementById('selectGlobalFont')?.value;
        const sh = document.getElementById('selectHeadingFont')?.value;
        const sb = document.getElementById('selectBodyFont')?.value;
        const sbg = document.getElementById('selectBadgeFont')?.value;
        const sbtn = document.getElementById('selectBtnFont')?.value;
        const sm = document.getElementById('selectMonoFont')?.value;
        const scaleRange = document.getElementById('fontSizeScaleRange');
        const lsRange = document.getElementById('letterSpacingRange');
        const hwSelect = document.getElementById('selectHeadingWeight')?.value;
        const htSelect = document.getElementById('selectHeadingTransform')?.value;

        const updated = {
          globalFont: sg || 'inherit',
          headingFont: sh,
          bodyFont: sb,
          badgeFont: sbg,
          btnFont: sbtn,
          monoFont: sm,
          fontSizeScale: scaleRange ? parseInt(scaleRange.value, 10) : 100,
          letterSpacing: lsRange ? parseInt(lsRange.value, 10) : 3,
          fontWeight: hwSelect || '900',
          transform: htSelect || 'uppercase'
        };

        if (document.getElementById('fontSizeScaleVal') && scaleRange) {
          document.getElementById('fontSizeScaleVal').textContent = `${scaleRange.value}%`;
        }
        if (document.getElementById('letterSpacingVal') && lsRange) {
          document.getElementById('letterSpacingVal').textContent = `${(parseFloat(lsRange.value) / 100).toFixed(2)}em`;
        }

        this.applySettings(updated);
      };

      ['selectGlobalFont', 'selectHeadingFont', 'selectBodyFont', 'selectBadgeFont', 'selectBtnFont', 'selectMonoFont', 'selectHeadingWeight', 'selectHeadingTransform'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', handleLiveChange);
      });

      document.getElementById('fontSizeScaleRange')?.addEventListener('input', handleLiveChange);
      document.getElementById('letterSpacingRange')?.addEventListener('input', handleLiveChange);

      document.getElementById('loadCustomFontBtn')?.addEventListener('click', () => {
        const input = document.getElementById('customGoogleFontInput');
        const val = input ? input.value.trim() : '';
        if (val) {
          const fontVal = this.loadCustomGoogleFont(val);
          if (fontVal) {
            this.current.headingFont = fontVal;
            const sh = document.getElementById('selectHeadingFont');
            if (sh) sh.value = fontVal;
            this.applySettings(this.current);
            showBroadcastToast(`🚀 Google Font "${val}" loaded and applied to headings!`);
            input.value = '';
          }
        }
      });

      document.getElementById('saveAndApplyFontsBtn')?.addEventListener('click', () => {
        handleLiveChange();
        this.saveSettings(this.current);
        this.closeModal();
        PaperAudio.playPaperStamp();
        showBroadcastToast('💾 Typography settings permanently saved to localStorage!');
      });

      document.getElementById('chooseAnyTextFromFontStudioBtn')?.addEventListener('click', () => {
        this.closeModal();
        InlineTextEditor.activate();
        showBroadcastToast('🎯 CHOOSE ANY TEXT: Click on ANY text across the website to edit!');
      });
    }
  };

  // ==========================================================================
  // INLINE TEXT & FONT EDITOR (CLICK ANY TEXT TO EDIT TEXT & CHANGE FONT)
  // ==========================================================================
  const InlineTextEditor = {
    isActive: false,
    activeElement: null,
    overrides: {},

    loadOverrides() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_TEXT_OVERRIDES);
        return saved ? JSON.parse(saved) : {};
      } catch (e) {
        console.warn('Could not load text overrides', e);
        return {};
      }
    },

    saveOverrides() {
      try {
        localStorage.setItem(STORAGE_KEY_TEXT_OVERRIDES, JSON.stringify(this.overrides));
      } catch (e) {
        console.warn('Could not save text overrides', e);
      }
    },

    getElementKey(el) {
      if (el.id) return `#${el.id}`;
      if (el.hasAttribute('data-text-key')) return el.getAttribute('data-text-key');

      let path = [];
      let cur = el;
      while (cur && cur !== document.body && cur.parentNode) {
        let tag = cur.tagName.toLowerCase();
        if (cur.id) {
          path.unshift(`#${cur.id}`);
          break;
        } else {
          let sib = cur, idx = 1;
          while ((sib = sib.previousElementSibling)) {
            if (sib.tagName.toLowerCase() === tag) idx++;
          }
          path.unshift(`${tag}:nth-of-type(${idx})`);
        }
        cur = cur.parentNode;
      }
      return path.join(' > ');
    },

    applyOverridesToDOM() {
      this.overrides = this.loadOverrides();

      // Clean stale text override for #aboutSectionTitle if it contained ECUBE
      if (this.overrides['#aboutSectionTitle']) {
        const textVal = this.overrides['#aboutSectionTitle'].text;
        if (textVal && textVal.includes('ECUBE')) {
          delete this.overrides['#aboutSectionTitle'];
          this.saveOverrides();
        }
      }

      Object.keys(this.overrides).forEach(key => {
        try {
          if (key === '#aboutSectionTitle') return; // Handled specially by renderSectionHeaders to preserve logo badge
          const el = document.querySelector(key);
          if (el) {
            const data = this.overrides[key];
            if (data.text !== undefined) {
              el.textContent = data.text;
            }
            if (data.fontFamily) el.style.fontFamily = data.fontFamily;
            if (data.fontSize) el.style.fontSize = data.fontSize;
            if (data.color) el.style.color = data.color;
            if (data.fontWeight) el.style.fontWeight = data.fontWeight;
            if (data.textTransform) el.style.textTransform = data.textTransform;
            if (data.letterSpacing) el.style.letterSpacing = data.letterSpacing;
            if (data.glowSize && parseFloat(data.glowSize) > 0) {
              el.setAttribute('data-custom-glow', 'true');
              el.style.setProperty('--elem-glow-r', data.glowSize);
              if (data.glowColor) el.style.setProperty('--elem-glow-c', data.glowColor);
              if (data.glowAnim && data.glowAnim !== 'none') el.setAttribute('data-glow-anim', data.glowAnim);
              if (data.glowSpeed) el.style.setProperty('--elem-glow-speed', data.glowSpeed);
            }
          }
        } catch (e) {
          // Ignore invalid selector
        }
      });
    },

    resetAllTextOverrides() {
      if (confirm('Revert all inline text edits and font styling back to default content?')) {
        this.overrides = {};
        localStorage.removeItem(STORAGE_KEY_TEXT_OVERRIDES);
        location.reload();
      }
    },

    markEligibleElements() {
      // Target literally ANY text element across the entire website
      const candidates = document.querySelectorAll(
        'h1, h2, h3, h4, h5, h6, p, a, span, button, label, li, small, strong, b, em, time, code, ' +
        '.section-tag, .section-title, .section-title-text, .section-subtitle, ' +
        '.hero-title-greeting, .hero-title-name, .hero-subtitle-role, .hero-intro, ' +
        '.about-statement-text, .pillar-title, .pillar-desc, ' +
        '.production-tournament-title, .production-role-pill, .production-desc, ' +
        '.video-title, .video-desc, .contact-card-title, .contact-card-sub, ' +
        '.footer-brand-title, .footer-brand-sub, .footer-heading, .footer-links a, ' +
        '.badge, .toolbar-btn span, .btn span, .nav-link, ' +
        '.metric-tier-badge, .metric-hud-ping, .metric-counter-num, .metric-card-label, .metric-card-desc, .metric-footer-tag, .metric-footer-icon, ' +
        '.games-header-badge, .games-header-title, .games-header-sub, ' +
        '.game-publisher-tag, .game-title-text, .game-badge-chip, .game-role-val, .game-card-desc, .game-tool-tag, .game-stats-val'
      );

      candidates.forEach(el => {
        // Exclude UI controls, modals, background canvases, audio, scripts
        if (el.closest('.inline-text-toolstrip, #inlineTextToolstrip, .floating-hud-dock, #floatingHudDock, .live-edit-hud-bar, #liveEditHudBar, .modal-backdrop, #fontStudioModal, #textGlowStudioModal, #authModal, #soundToggleBtn, #cyberScreenGlitch, #cyberMatrixCanvas, #paperDustCanvas, script, style, noscript, svg')) {
          return;
        }

        // Strictly preserve ECUBE logo without modifications
        if (el.closest('.ecube-logo-badge, #aboutEcubeBadge, .nav-brand .brand-tally')) {
          return;
        }

        const text = el.textContent ? el.textContent.trim() : '';
        if (!text) return;

        // Skip massive layout containers
        if (['SECTION', 'MAIN', 'NAV', 'HEADER', 'FOOTER', 'BODY', 'HTML', 'FORM'].includes(el.tagName)) return;

        el.setAttribute('data-editable-text', 'true');
      });
    },

    findTargetTextElement(rawTarget) {
      if (!rawTarget || !(rawTarget instanceof Element)) return null;

      // Ignore editor controls & overlays
      if (rawTarget.closest(
        '#inlineTextToolstrip, #floatingHudDock, #liveEditHudBar, #fontStudioModal, #textGlowStudioModal, #authModal, .modal-backdrop, #soundToggleBtn, #paperOverlay, #paperDustCanvas, #cyberScreenGlitch, #cyberMatrixCanvas, script, style, noscript'
      )) {
        return null;
      }

      // Strictly preserve ECUBE logo
      if (rawTarget.closest('.ecube-logo-badge, #aboutEcubeBadge')) {
        return null;
      }

      // If clicked on an image or icon without text, check parent
      const ignoredTags = ['IMG', 'VIDEO', 'CANVAS', 'AUDIO', 'SVG', 'PATH', 'HR', 'BR', 'INPUT', 'TEXTAREA', 'SELECT'];
      if (ignoredTags.includes(rawTarget.tagName)) {
        const textParent = rawTarget.closest('button, a, label, [data-editable-text="true"], p, span, li');
        if (textParent && !textParent.closest('.ecube-logo-badge, #aboutEcubeBadge')) {
          return textParent;
        }
        return null;
      }

      // If target is inside .word-fx, resolve to parent text container
      if (rawTarget.classList.contains('word-fx') || rawTarget.closest('.word-fx')) {
        const parentContainer = rawTarget.closest(
          'h1, h2, h3, h4, h5, h6, p, .section-title, .hero-title-greeting, .hero-title-name, .hero-subtitle-role, .hero-intro, .about-statement-text, [data-editable-text="true"]'
        ) || rawTarget.parentElement;
        if (parentContainer && parentContainer !== document.body) {
          return parentContainer;
        }
      }

      // If already explicitly marked
      if (rawTarget.getAttribute('data-editable-text') === 'true') {
        return rawTarget;
      }

      // Traverse up to find closest text element
      let cur = rawTarget;
      const containerBlacklist = ['HTML', 'BODY', 'MAIN', 'SECTION', 'HEADER', 'NAV', 'FOOTER', 'FORM', 'UL', 'OL', 'TABLE', 'TBODY', 'TR'];
      while (cur && cur !== document.body) {
        if (containerBlacklist.includes(cur.tagName)) break;
        if (cur.getAttribute('data-editable-text') === 'true') return cur;
        const txt = cur.textContent ? cur.textContent.trim() : '';
        if (txt.length > 0) {
          const isKnownTextTag = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'BUTTON', 'LABEL', 'LI', 'B', 'STRONG', 'EM', 'SMALL', 'DIV', 'TIME', 'CODE'].includes(cur.tagName);
          const hasDirectText = Array.from(cur.childNodes).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0);
          if (hasDirectText || isKnownTextTag) {
            return cur;
          }
        }
        cur = cur.parentElement;
      }

      // Final fallback if rawTarget itself has text
      if (!containerBlacklist.includes(rawTarget.tagName) && (rawTarget.textContent || '').trim().length > 0) {
        return rawTarget;
      }

      return null;
    },

    toggle() {
      if (!requireAdminAuth()) return;
      if (this.isActive) {
        this.deactivate();
      } else {
        this.activate();
      }
    },

    activate() {
      if (!requireAdminAuth()) return;
      this.isActive = true;
      document.body.classList.add('live-text-edit-active');
      this.markEligibleElements();

      const hudBar = document.getElementById('liveEditHudBar');
      if (hudBar) hudBar.style.display = 'block';

      const navBtn = document.getElementById('navLiveEditToggleBtn');
      const navBtnText = document.getElementById('navLiveEditBtnText');
      if (navBtn) navBtn.classList.add('active');
      if (navBtnText) navBtnText.textContent = '✓ FINISH EDITING';

      const dockBtn = document.getElementById('dockLiveEditBtn');
      const dockLabel = document.getElementById('dockLiveEditLabel');
      if (dockBtn) dockBtn.classList.add('active');
      if (dockLabel) dockLabel.textContent = 'DONE';

      showBroadcastToast('✏️ LIVE EDIT MODE ON: Click any text to edit words & choose font!');
      PaperAudio.playPaperStamp();
    },

    deactivate() {
      if (this.activeElement) {
        this.saveCurrentElement(this.activeElement);
        this.activeElement.removeAttribute('contenteditable');
        this.activeElement = null;
      }

      this.isActive = false;
      document.body.classList.remove('live-text-edit-active');

      const hudBar = document.getElementById('liveEditHudBar');
      if (hudBar) hudBar.style.display = 'none';

      const toolstrip = document.getElementById('inlineTextToolstrip');
      if (toolstrip) toolstrip.style.display = 'none';

      const navBtn = document.getElementById('navLiveEditToggleBtn');
      const navBtnText = document.getElementById('navLiveEditBtnText');
      if (navBtn) navBtn.classList.remove('active');
      if (navBtnText) navBtnText.textContent = '✏️ EDIT TEXT';

      const dockBtn = document.getElementById('dockLiveEditBtn');
      const dockLabel = document.getElementById('dockLiveEditLabel');
      if (dockBtn) dockBtn.classList.remove('active');
      if (dockLabel) dockLabel.textContent = 'EDIT TEXT';

      document.querySelectorAll('[contenteditable="true"]').forEach(el => el.removeAttribute('contenteditable'));

      showBroadcastToast('✅ Live Edit Mode closed. All changes are saved!');
      PaperAudio.playPaperPageFlip();
    },

    showToolstripFor(el) {
      const toolstrip = document.getElementById('inlineTextToolstrip');
      if (!toolstrip) return;

      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollX = window.scrollX || window.pageXOffset;

      toolstrip.style.display = 'flex';

      const toolstripHeight = 50;
      let top = rect.top + scrollY - toolstripHeight - 10;
      if (rect.top < toolstripHeight + 70) {
        top = rect.bottom + scrollY + 10;
      }

      let left = rect.left + scrollX;
      if (left + 500 > window.innerWidth) {
        left = Math.max(10, window.innerWidth - 520);
      }

      toolstrip.style.top = `${Math.max(10, top)}px`;
      toolstrip.style.left = `${Math.max(10, left)}px`;

      const select = document.getElementById('inlineFontFamilySelect');
      if (select) {
        const currentFont = el.style.fontFamily;
        if (currentFont) {
          select.value = currentFont;
        } else {
          select.value = '';
        }
      }

      // Sync Glow Controls for Current Element
      const key = this.getElementKey(el);
      const savedGlow = this.overrides[key] || {};
      const curRadiusStr = el.style.getPropertyValue('--elem-glow-r') || savedGlow.glowSize || '0px';
      const curRadius = parseInt(curRadiusStr, 10) || 0;
      const curColor = el.style.getPropertyValue('--elem-glow-c') || savedGlow.glowColor || '#00f0ff';
      const curAnim = el.getAttribute('data-glow-anim') || savedGlow.glowAnim || 'none';
      const curSpeed = el.style.getPropertyValue('--elem-glow-speed') || savedGlow.glowSpeed || '3s';

      const glowBadge = document.getElementById('inlineGlowValBadge');
      if (glowBadge) glowBadge.textContent = `${curRadius}px`;

      const glowRange = document.getElementById('inlineGlowRange');
      if (glowRange) {
        glowRange.max = 120;
        glowRange.value = curRadius;
      }

      const glowRangeVal = document.getElementById('inlineGlowRangeVal');
      if (glowRangeVal) glowRangeVal.textContent = `${curRadius}px`;

      // Sync active state on quick glow limit chips
      document.querySelectorAll('#inlineGlowLimitChips .glow-limit-chip').forEach(ch => {
        const lim = parseInt(ch.getAttribute('data-limit'), 10);
        if (lim === curRadius) {
          ch.classList.add('active');
        } else {
          ch.classList.remove('active');
        }
      });

      document.querySelectorAll('#inlineGlowColorSwatches .glow-swatch').forEach(sw => {
        const swColor = sw.getAttribute('data-glow-color');
        if (curRadius === 0 && swColor === 'none') {
          sw.classList.add('active');
        } else if (swColor && swColor.toLowerCase() === curColor.toLowerCase()) {
          sw.classList.add('active');
        } else {
          sw.classList.remove('active');
        }
      });

      const glowAnimSelect = document.getElementById('inlineGlowAnimSelect');
      if (glowAnimSelect) glowAnimSelect.value = curAnim;

      const glowSpeedSelect = document.getElementById('inlineGlowSpeedSelect');
      if (glowSpeedSelect) glowSpeedSelect.value = curSpeed;
    },

    saveCurrentElement(el) {
      if (!el) return;
      const key = this.getElementKey(el);
      const text = el.textContent.trim();

      if (!this.overrides[key]) this.overrides[key] = {};
      this.overrides[key].text = text;

      if (el.style.fontFamily) this.overrides[key].fontFamily = el.style.fontFamily;
      if (el.style.fontSize) this.overrides[key].fontSize = el.style.fontSize;
      if (el.style.color) this.overrides[key].color = el.style.color;
      if (el.style.fontWeight) this.overrides[key].fontWeight = el.style.fontWeight;
      if (el.style.textTransform) this.overrides[key].textTransform = el.style.textTransform;
      if (el.style.letterSpacing) this.overrides[key].letterSpacing = el.style.letterSpacing;

      if (el.getAttribute('data-custom-glow') === 'true') {
        const r = el.style.getPropertyValue('--elem-glow-r');
        if (r && parseFloat(r) > 0) {
          this.overrides[key].glowSize = r;
          this.overrides[key].glowColor = el.style.getPropertyValue('--elem-glow-c') || '#00f0ff';
          this.overrides[key].glowAnim = el.getAttribute('data-glow-anim') || 'none';
          this.overrides[key].glowSpeed = el.style.getPropertyValue('--elem-glow-speed') || '3s';
        } else {
          delete this.overrides[key].glowSize;
          delete this.overrides[key].glowColor;
          delete this.overrides[key].glowAnim;
          delete this.overrides[key].glowSpeed;
        }
      } else if (this.overrides[key]) {
        delete this.overrides[key].glowSize;
        delete this.overrides[key].glowColor;
        delete this.overrides[key].glowAnim;
        delete this.overrides[key].glowSpeed;
      }

      this.saveOverrides();

      if (el.id === 'heroGreeting') {
        if (!appState.sectionHeaders.hero) appState.sectionHeaders.hero = {};
        appState.sectionHeaders.hero.title = text;
        saveState();
      } else if (el.id === 'heroMainTitle') {
        if (!appState.sectionHeaders.hero) appState.sectionHeaders.hero = {};
        appState.sectionHeaders.hero.roleTitle = text;
        saveState();
      } else if (el.id === 'heroTagline') {
        appState.personalInfo.tagline = text;
        saveState();
      } else if (el.id === 'heroIntro') {
        appState.personalInfo.shortIntro = text;
        saveState();
      } else if (el.id === 'aboutStatement') {
        appState.personalInfo.aboutStatement = text;
        saveState();
      } else if (el.id === 'aboutSectionTitleText' || el.id === 'aboutSectionTitle') {
        if (!appState.sectionHeaders.about) appState.sectionHeaders.about = {};
        appState.sectionHeaders.about.title = text.replace(/\s+ECUBE$/i, '').trim();
        saveState();
      } else if (el.id === 'aboutSectionTag') {
        if (!appState.sectionHeaders.about) appState.sectionHeaders.about = {};
        appState.sectionHeaders.about.tag = text;
        saveState();
      } else if (el.id === 'aboutSectionSub') {
        if (!appState.sectionHeaders.about) appState.sectionHeaders.about = {};
        appState.sectionHeaders.about.subtitle = text;
        saveState();
      } else if (el.id === 'gamesWorkedSectionTag') {
        if (!appState.sectionHeaders.gamesWorked) appState.sectionHeaders.gamesWorked = {};
        appState.sectionHeaders.gamesWorked.tag = text;
        saveState();
      } else if (el.id === 'gamesWorkedSectionTitle') {
        if (!appState.sectionHeaders.gamesWorked) appState.sectionHeaders.gamesWorked = {};
        appState.sectionHeaders.gamesWorked.title = text;
        saveState();
      } else if (el.id === 'gamesWorkedSectionSub') {
        if (!appState.sectionHeaders.gamesWorked) appState.sectionHeaders.gamesWorked = {};
        appState.sectionHeaders.gamesWorked.subtitle = text;
        saveState();
      } else {
        const metricCard = el.closest('.metric-card');
        if (metricCard) {
          const idx = parseInt(metricCard.getAttribute('data-index'), 10);
          if (appState.metricCards && appState.metricCards[idx]) {
            const card = appState.metricCards[idx];
            if (el.classList.contains('metric-card-label')) card.label = text;
            else if (el.classList.contains('metric-counter-num')) card.count = text;
            else if (el.classList.contains('metric-tier-badge')) card.badge = text;
            else if (el.classList.contains('metric-hud-ping')) card.ping = text;
            else if (el.classList.contains('metric-card-desc')) card.description = text;
            else if (el.classList.contains('metric-footer-tag')) card.footerTag = text;
            else if (el.classList.contains('metric-footer-icon')) card.footerIcon = text;
            syncEventStatsFromMetricCards();
            saveState();
          }
        }
        const gameCard = el.closest('.game-worked-card');
        if (gameCard) {
          const idx = parseInt(gameCard.getAttribute('data-index'), 10);
          if (appState.workedGames && appState.workedGames[idx]) {
            const g = appState.workedGames[idx];
            if (el.classList.contains('game-title-text')) g.name = text;
            else if (el.classList.contains('game-publisher-tag')) g.publisher = text;
            else if (el.classList.contains('game-badge-chip')) g.badge = text;
            else if (el.classList.contains('game-role-val')) g.role = text;
            else if (el.classList.contains('game-card-desc')) g.description = text;
            else if (el.closest('.game-tournaments-box')) g.tournaments = text;
            else if (el.classList.contains('game-stats-val')) g.stats = text;
            saveState();
          }
        }
      }
    },

    init() {
      this.applyOverridesToDOM();

      document.addEventListener('click', (e) => {
        if (!this.isActive) return;

        if (e.target.closest('#inlineTextToolstrip, #floatingHudDock, #liveEditHudBar, #fontStudioModal, #textGlowStudioModal, .modal-backdrop')) {
          return;
        }

        const target = this.findTargetTextElement(e.target);
        if (!target) return;

        e.preventDefault();
        e.stopPropagation();

        if (this.activeElement && this.activeElement !== target) {
          this.saveCurrentElement(this.activeElement);
          this.activeElement.removeAttribute('contenteditable');
        }

        this.activeElement = target;

        const wordFxSpans = target.querySelectorAll('.word-fx');
        if (wordFxSpans.length > 0) {
          const rawText = target.textContent;
          target.textContent = rawText;
        }

        target.setAttribute('data-editable-text', 'true');
        target.setAttribute('contenteditable', 'true');
        target.focus();

        this.showToolstripFor(target);
      }, true);

      document.getElementById('inlineFontFamilySelect')?.addEventListener('change', (e) => {
        if (!this.activeElement) return;
        const font = e.target.value;
        if (font) {
          this.activeElement.style.fontFamily = font;
        } else {
          this.activeElement.style.fontFamily = '';
        }
        this.saveCurrentElement(this.activeElement);
        showBroadcastToast(`🔤 Font updated for element!`);
      });

      document.getElementById('inlineFontSmallerBtn')?.addEventListener('click', () => {
        if (!this.activeElement) return;
        const comp = window.getComputedStyle(this.activeElement);
        const currentSize = parseFloat(comp.fontSize) || 16;
        const newSize = Math.max(10, currentSize - 2);
        this.activeElement.style.fontSize = `${newSize}px`;
        this.saveCurrentElement(this.activeElement);
      });

      document.getElementById('inlineFontBiggerBtn')?.addEventListener('click', () => {
        if (!this.activeElement) return;
        const comp = window.getComputedStyle(this.activeElement);
        const currentSize = parseFloat(comp.fontSize) || 16;
        const newSize = currentSize + 2;
        this.activeElement.style.fontSize = `${newSize}px`;
        this.saveCurrentElement(this.activeElement);
      });

      document.getElementById('inlineFontBoldBtn')?.addEventListener('click', () => {
        if (!this.activeElement) return;
        const comp = window.getComputedStyle(this.activeElement);
        const isBold = parseInt(comp.fontWeight, 10) >= 700 || comp.fontWeight === 'bold';
        this.activeElement.style.fontWeight = isBold ? '400' : '900';
        this.saveCurrentElement(this.activeElement);
      });

      document.getElementById('inlineFontCaseBtn')?.addEventListener('click', () => {
        if (!this.activeElement) return;
        const comp = window.getComputedStyle(this.activeElement);
        const isUpper = comp.textTransform === 'uppercase';
        this.activeElement.style.textTransform = isUpper ? 'none' : 'uppercase';
        this.saveCurrentElement(this.activeElement);
      });

      document.querySelectorAll('#inlineTextToolstrip .color-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          if (!this.activeElement) return;
          const color = dot.getAttribute('data-color');
          this.activeElement.style.color = color;
          this.saveCurrentElement(this.activeElement);
        });
      });

      // Per-element Glow Stepper Down (✨-)
      document.getElementById('inlineGlowDownBtn')?.addEventListener('click', () => {
        if (!this.activeElement) return;
        const curR = parseInt(this.activeElement.style.getPropertyValue('--elem-glow-r'), 10) || 0;
        const newR = Math.max(0, curR - 3);
        if (newR > 0) {
          this.activeElement.setAttribute('data-custom-glow', 'true');
          this.activeElement.style.setProperty('--elem-glow-r', `${newR}px`);
          if (!this.activeElement.style.getPropertyValue('--elem-glow-c')) {
            this.activeElement.style.setProperty('--elem-glow-c', '#00f0ff');
          }
        } else {
          this.activeElement.removeAttribute('data-custom-glow');
          this.activeElement.style.removeProperty('--elem-glow-r');
        }
        const badge = document.getElementById('inlineGlowValBadge');
        if (badge) badge.textContent = `${newR}px`;
        const range = document.getElementById('inlineGlowRange');
        if (range) range.value = newR;
        const rangeVal = document.getElementById('inlineGlowRangeVal');
        if (rangeVal) rangeVal.textContent = `${newR}px`;

        document.querySelectorAll('#inlineGlowLimitChips .glow-limit-chip').forEach(ch => {
          ch.classList.toggle('active', parseInt(ch.getAttribute('data-limit'), 10) === newR);
        });

        this.saveCurrentElement(this.activeElement);
        PaperAudio.playPaperRustle();
      });

      // Per-element Glow Stepper Up (✨+) - Expanded up to 120px Limit
      document.getElementById('inlineGlowUpBtn')?.addEventListener('click', () => {
        if (!this.activeElement) return;
        const curR = parseInt(this.activeElement.style.getPropertyValue('--elem-glow-r'), 10) || 0;
        const newR = Math.min(120, curR + 3);
        this.activeElement.setAttribute('data-custom-glow', 'true');
        this.activeElement.style.setProperty('--elem-glow-r', `${newR}px`);
        if (!this.activeElement.style.getPropertyValue('--elem-glow-c')) {
          this.activeElement.style.setProperty('--elem-glow-c', '#00f0ff');
        }
        const badge = document.getElementById('inlineGlowValBadge');
        if (badge) badge.textContent = `${newR}px`;
        const range = document.getElementById('inlineGlowRange');
        if (range) range.value = newR;
        const rangeVal = document.getElementById('inlineGlowRangeVal');
        if (rangeVal) rangeVal.textContent = `${newR}px`;

        document.querySelectorAll('#inlineGlowLimitChips .glow-limit-chip').forEach(ch => {
          ch.classList.toggle('active', parseInt(ch.getAttribute('data-limit'), 10) === newR);
        });

        this.saveCurrentElement(this.activeElement);
        PaperAudio.playPaperRustle();
      });

      // Per-element Glow Drawer Toggle
      document.getElementById('inlineGlowDrawerToggleBtn')?.addEventListener('click', () => {
        const drawer = document.getElementById('inlineGlowDrawer');
        if (!drawer) return;
        const isOpen = drawer.style.display !== 'none';
        drawer.style.display = isOpen ? 'none' : 'flex';
      });

      // Per-element Quick Glow Limit Chips (Instant Limit Jumps up to 120px)
      document.querySelectorAll('#inlineGlowLimitChips .glow-limit-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          if (!this.activeElement) return;
          const limit = parseInt(chip.getAttribute('data-limit'), 10) || 0;

          if (limit > 0) {
            this.activeElement.setAttribute('data-custom-glow', 'true');
            this.activeElement.style.setProperty('--elem-glow-r', `${limit}px`);
            if (!this.activeElement.style.getPropertyValue('--elem-glow-c')) {
              this.activeElement.style.setProperty('--elem-glow-c', '#00f0ff');
            }
          } else {
            this.activeElement.removeAttribute('data-custom-glow');
            this.activeElement.removeAttribute('data-glow-anim');
            this.activeElement.style.removeProperty('--elem-glow-r');
            this.activeElement.style.removeProperty('--elem-glow-c');
          }

          const badge = document.getElementById('inlineGlowValBadge');
          if (badge) badge.textContent = `${limit}px`;
          const range = document.getElementById('inlineGlowRange');
          if (range) range.value = limit;
          const rangeVal = document.getElementById('inlineGlowRangeVal');
          if (rangeVal) rangeVal.textContent = `${limit}px`;

          document.querySelectorAll('#inlineGlowLimitChips .glow-limit-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');

          this.saveCurrentElement(this.activeElement);
          PaperAudio.playPaperStamp();
          showBroadcastToast(`✨ Glow limit set to ${limit}px for selected text!`);
        });
      });

      // Per-element Glow Slider (Up to 120px)
      document.getElementById('inlineGlowRange')?.addEventListener('input', (e) => {
        if (!this.activeElement) return;
        const val = parseInt(e.target.value, 10) || 0;
        if (val > 0) {
          this.activeElement.setAttribute('data-custom-glow', 'true');
          this.activeElement.style.setProperty('--elem-glow-r', `${val}px`);
          if (!this.activeElement.style.getPropertyValue('--elem-glow-c')) {
            this.activeElement.style.setProperty('--elem-glow-c', '#00f0ff');
          }
        } else {
          this.activeElement.removeAttribute('data-custom-glow');
          this.activeElement.style.removeProperty('--elem-glow-r');
        }
        const badge = document.getElementById('inlineGlowValBadge');
        if (badge) badge.textContent = `${val}px`;
        const rangeVal = document.getElementById('inlineGlowRangeVal');
        if (rangeVal) rangeVal.textContent = `${val}px`;

        document.querySelectorAll('#inlineGlowLimitChips .glow-limit-chip').forEach(ch => {
          ch.classList.toggle('active', parseInt(ch.getAttribute('data-limit'), 10) === val);
        });

        this.saveCurrentElement(this.activeElement);
      });

      // Per-element Glow Swatches
      document.querySelectorAll('#inlineGlowColorSwatches .glow-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
          if (!this.activeElement) return;
          const color = sw.getAttribute('data-glow-color');
          document.querySelectorAll('#inlineGlowColorSwatches .glow-swatch').forEach(s => s.classList.remove('active'));
          sw.classList.add('active');

          if (color === 'none') {
            this.activeElement.removeAttribute('data-custom-glow');
            this.activeElement.removeAttribute('data-glow-anim');
            this.activeElement.style.removeProperty('--elem-glow-r');
            this.activeElement.style.removeProperty('--elem-glow-c');
            const badge = document.getElementById('inlineGlowValBadge');
            if (badge) badge.textContent = '0px';
            const range = document.getElementById('inlineGlowRange');
            if (range) range.value = 0;
            const rangeVal = document.getElementById('inlineGlowRangeVal');
            if (rangeVal) rangeVal.textContent = '0px';
          } else {
            this.activeElement.setAttribute('data-custom-glow', 'true');
            this.activeElement.style.setProperty('--elem-glow-c', color);
            let curR = parseInt(this.activeElement.style.getPropertyValue('--elem-glow-r'), 10) || 0;
            if (curR === 0) {
              curR = 12;
              this.activeElement.style.setProperty('--elem-glow-r', '12px');
            }
            const badge = document.getElementById('inlineGlowValBadge');
            if (badge) badge.textContent = `${curR}px`;
            const range = document.getElementById('inlineGlowRange');
            if (range) range.value = curR;
            const rangeVal = document.getElementById('inlineGlowRangeVal');
            if (rangeVal) rangeVal.textContent = `${curR}px`;
          }
          this.saveCurrentElement(this.activeElement);
          PaperAudio.playPaperStamp();
        });
      });

      // Per-element Glow Animation Select
      document.getElementById('inlineGlowAnimSelect')?.addEventListener('change', (e) => {
        if (!this.activeElement) return;
        const anim = e.target.value;
        if (anim === 'none') {
          this.activeElement.removeAttribute('data-glow-anim');
        } else {
          this.activeElement.setAttribute('data-glow-anim', anim);
          this.activeElement.setAttribute('data-custom-glow', 'true');
          let curR = parseInt(this.activeElement.style.getPropertyValue('--elem-glow-r'), 10) || 0;
          if (curR === 0) {
            curR = 12;
            this.activeElement.style.setProperty('--elem-glow-r', '12px');
            if (!this.activeElement.style.getPropertyValue('--elem-glow-c')) {
              this.activeElement.style.setProperty('--elem-glow-c', '#00f0ff');
            }
            const badge = document.getElementById('inlineGlowValBadge');
            if (badge) badge.textContent = `${curR}px`;
            const range = document.getElementById('inlineGlowRange');
            if (range) range.value = curR;
          }
        }
        this.saveCurrentElement(this.activeElement);
      });

      // Per-element Glow Speed Select
      document.getElementById('inlineGlowSpeedSelect')?.addEventListener('change', (e) => {
        if (!this.activeElement) return;
        const speed = e.target.value;
        this.activeElement.style.setProperty('--elem-glow-speed', speed);
        this.saveCurrentElement(this.activeElement);
      });

      document.getElementById('inlineSaveBtn')?.addEventListener('click', () => {
        if (this.activeElement) {
          this.saveCurrentElement(this.activeElement);
          this.activeElement.removeAttribute('contenteditable');
          this.activeElement = null;
        }
        document.getElementById('inlineTextToolstrip').style.display = 'none';
        showBroadcastToast('✅ Text & Font saved!');
      });

      document.getElementById('inlineCloseBtn')?.addEventListener('click', () => {
        if (this.activeElement) {
          this.activeElement.removeAttribute('contenteditable');
          this.activeElement = null;
        }
        document.getElementById('inlineTextToolstrip').style.display = 'none';
      });

      document.getElementById('navLiveEditToggleBtn')?.addEventListener('click', () => this.toggle());
      document.getElementById('dockLiveEditBtn')?.addEventListener('click', () => this.toggle());
      document.getElementById('liveEditDoneBtn')?.addEventListener('click', () => this.deactivate());
      document.getElementById('liveEditResetAllTextBtn')?.addEventListener('click', () => this.resetAllTextOverrides());

      document.addEventListener('blur', (e) => {
        if (this.isActive && e.target === this.activeElement) {
          this.saveCurrentElement(e.target);
        }
      }, true);
    }
  };

  // ==========================================================================
  // MASTER TEXT GLOW & LIGHT STUDIO ENGINE
  // Full site-wide illumination, neon color light tuning, and motion animations
  // ==========================================================================
  const STORAGE_KEY_MASTER_GLOW = 'gunshot_master_text_glow_v1';

  const MASTER_GLOW_PRESETS = {
    cyber_cyan: {
      name: 'Cyber Cyan',
      enabled: true,
      size: 14,
      color: '#00f0ff',
      animation: 'breathe',
      speed: '3s',
      scope: 'all'
    },
    neon_purple: {
      name: 'Neon Purple',
      enabled: true,
      size: 16,
      color: '#8b5cf6',
      animation: 'pulse',
      speed: '2.2s',
      scope: 'all'
    },
    tournament_gold: {
      name: 'Tournament Gold',
      enabled: true,
      size: 12,
      color: '#ffb800',
      animation: 'laser',
      speed: '2.8s',
      scope: 'all'
    },
    crimson_flicker: {
      name: 'Crimson Flicker',
      enabled: true,
      size: 15,
      color: '#ff2a55',
      animation: 'flicker',
      speed: '3s',
      scope: 'all'
    },
    matrix_emerald: {
      name: 'Matrix Emerald',
      enabled: true,
      size: 12,
      color: '#00ff9d',
      animation: 'breathe',
      speed: '3.2s',
      scope: 'all'
    },
    laser_white: {
      name: 'Laser White',
      enabled: true,
      size: 8,
      color: '#ffffff',
      animation: 'none',
      speed: '3s',
      scope: 'all'
    },
    glow_off: {
      name: 'Clean (No Glow)',
      enabled: false,
      size: 0,
      color: '#00f0ff',
      animation: 'none',
      speed: '3s',
      scope: 'all'
    }
  };

  const TextGlowManager = {
    current: null,

    getDefaults() {
      return {
        enabled: false,
        size: 0,
        color: '#00f0ff',
        animation: 'none',
        speed: '3s',
        scope: 'all'
      };
    },

    loadSettings() {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_MASTER_GLOW);
        if (saved) {
          const parsed = JSON.parse(saved);
          return Object.assign(this.getDefaults(), parsed);
        }
      } catch (e) {
        console.warn('Could not load master text glow settings', e);
      }
      return this.getDefaults();
    },

    saveSettings(settings) {
      try {
        localStorage.setItem(STORAGE_KEY_MASTER_GLOW, JSON.stringify(settings));
      } catch (e) {
        console.warn('Could not save master text glow settings', e);
      }
    },

    applySettings(s) {
      if (!s) s = this.current || this.getDefaults();
      const root = document.documentElement;

      root.style.setProperty('--master-text-glow-size', `${s.size}px`);
      root.style.setProperty('--master-text-glow-color', s.color);
      root.style.setProperty('--master-text-glow-speed', s.speed);

      // Remove existing master animation and scope classes
      document.body.classList.remove(
        'enable-master-text-glow',
        'enable-glow-all-texts',
        'enable-glow-headings-only',
        'master-glow-anim-breathe',
        'master-glow-anim-pulse',
        'master-glow-anim-flicker',
        'master-glow-anim-laser'
      );

      if (s.enabled && s.size > 0) {
        document.body.classList.add('enable-master-text-glow');
        if (s.scope === 'headings') {
          document.body.classList.add('enable-glow-headings-only');
        } else {
          document.body.classList.add('enable-glow-all-texts');
        }

        if (s.animation && s.animation !== 'none') {
          document.body.classList.add(`master-glow-anim-${s.animation}`);
        }
      }

      this.updatePreview(s);
    },

    updatePreview(s) {
      const previewBox = document.getElementById('glowLivePreviewBox');
      if (!previewBox) return;

      if (!s) s = this.current || this.getDefaults();
      const r = s.enabled ? s.size : 0;
      const c = s.color || '#00f0ff';
      const scope = s.scope || 'all';

      const shadowVal = r > 0
        ? `0 0 ${r * 0.35}px #ffffff, 0 0 ${r}px ${c}, 0 0 ${r * 1.8}px ${c}`
        : 'none';
      const shadowBodyVal = (r > 0 && scope === 'all')
        ? `0 0 ${r * 0.22}px #ffffff, 0 0 ${r * 0.75}px ${c}, 0 0 ${r * 1.45}px ${c}`
        : 'none';

      const pHead = document.getElementById('glowPreviewH1');
      const pRole = document.getElementById('glowPreviewRole');
      const pTag = document.getElementById('glowPreviewTag');
      const pBadge = document.getElementById('glowPreviewBadge') || previewBox.querySelector('.badge');
      const pDesc = document.getElementById('glowPreviewDesc') || previewBox.querySelector('p');

      if (pHead) { pHead.style.textShadow = shadowVal; pHead.style.transition = 'text-shadow 0.25s ease'; }
      if (pRole) { pRole.style.textShadow = shadowVal; pRole.style.transition = 'text-shadow 0.25s ease'; }
      if (pTag) { pTag.style.textShadow = shadowVal; pTag.style.transition = 'text-shadow 0.25s ease'; }
      if (pBadge) { pBadge.style.textShadow = shadowVal; pBadge.style.transition = 'text-shadow 0.25s ease'; }
      if (pDesc) { pDesc.style.textShadow = shadowBodyVal; pDesc.style.transition = 'text-shadow 0.25s ease'; }
    },

    syncModalUI(s) {
      if (!s) s = this.current || this.getDefaults();

      const badge = document.getElementById('masterGlowValBadge');
      const radiusVal = document.getElementById('masterGlowRadiusVal');
      const range = document.getElementById('masterGlowRadiusRange');
      const animSelect = document.getElementById('masterGlowAnimSelect');
      const speedSelect = document.getElementById('masterGlowSpeedSelect');
      const customColor = document.getElementById('masterGlowCustomColor');

      const sizeDisplay = s.enabled ? `${s.size}px` : '0px';
      if (badge) badge.textContent = sizeDisplay;
      if (radiusVal) radiusVal.textContent = sizeDisplay;
      if (range) range.value = s.enabled ? s.size : 0;

      if (animSelect) animSelect.value = s.animation || 'none';
      if (speedSelect) speedSelect.value = s.speed || '3s';
      if (customColor) customColor.value = s.color || '#00f0ff';

      document.querySelectorAll('#masterGlowColorSwatches .glow-swatch').forEach(sw => {
        const c = sw.getAttribute('data-color');
        if (c && c.toLowerCase() === s.color.toLowerCase()) {
          sw.classList.add('active');
        } else {
          sw.classList.remove('active');
        }
      });

      // Sync active state on master glow limit chips
      const currentRadius = s.enabled ? s.size : 0;
      document.querySelectorAll('#masterGlowLimitChips .glow-limit-chip').forEach(ch => {
        ch.classList.toggle('active', parseInt(ch.getAttribute('data-master-limit'), 10) === currentRadius);
      });

      // Sync Scope Buttons
      const scope = s.scope || 'all';
      const allScopeBtn = document.getElementById('glowScopeAllTextsBtn');
      const headingsScopeBtn = document.getElementById('glowScopeHeadingsBtn');
      if (allScopeBtn) allScopeBtn.classList.toggle('active', scope === 'all');
      if (headingsScopeBtn) headingsScopeBtn.classList.toggle('active', scope === 'headings');
    },

    openModal() {
      if (!requireAdminAuth()) return;
      const modal = document.getElementById('textGlowStudioModal');
      if (!modal) return;
      this.syncModalUI(this.current);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      PaperAudio.playPaperPageFlip();
    },

    closeModal() {
      const modal = document.getElementById('textGlowStudioModal');
      if (!modal) return;
      modal.classList.remove('active');
      document.body.style.overflow = '';
    },

    resetDefaults() {
      this.current = this.getDefaults();
      this.applySettings(this.current);
      this.syncModalUI(this.current);
      this.saveSettings(this.current);
      showBroadcastToast('🔄 Master text glow reset to default (Clean/No Glow)');
      PaperAudio.playPaperStamp();
    },

    init() {
      this.current = this.loadSettings();
      this.applySettings(this.current);

      document.getElementById('dockGlowStudioBtn')?.addEventListener('click', () => this.openModal());
      document.getElementById('liveEditOpenGlowBtn')?.addEventListener('click', () => this.openModal());
      document.getElementById('closeTextGlowModalBtn')?.addEventListener('click', () => this.closeModal());
      document.getElementById('closeTextGlowFooterBtn')?.addEventListener('click', () => this.closeModal());
      document.getElementById('resetGlowModalBtn')?.addEventListener('click', () => this.resetDefaults());

      document.getElementById('chooseAnyTextFromGlowStudioBtn')?.addEventListener('click', () => {
        this.closeModal();
        InlineTextEditor.activate();
        showBroadcastToast('🎯 CHOOSE ANY TEXT: Click on ANY text to set custom glow & light limit!');
      });

      // Glow Scope Selectors (ALL TEXTS vs HEADINGS ONLY)
      document.getElementById('glowScopeAllTextsBtn')?.addEventListener('click', () => {
        this.current.scope = 'all';
        if (!this.current.enabled || this.current.size === 0) {
          this.current.size = 14;
          this.current.enabled = true;
        }
        this.syncModalUI(this.current);
        this.applySettings(this.current);
        this.saveSettings(this.current);
        PaperAudio.playPaperStamp();
        showBroadcastToast('🌟 ALL TEXTS: Universal text glow applied across entire website!');
      });

      document.getElementById('glowScopeHeadingsBtn')?.addEventListener('click', () => {
        this.current.scope = 'headings';
        if (!this.current.enabled || this.current.size === 0) {
          this.current.size = 14;
          this.current.enabled = true;
        }
        this.syncModalUI(this.current);
        this.applySettings(this.current);
        this.saveSettings(this.current);
        PaperAudio.playPaperStamp();
        showBroadcastToast('👑 HEADINGS ONLY: Text glow scoped to primary headlines & titles.');
      });

      // Master Presets
      document.querySelectorAll('#masterGlowPresetsGrid .glow-preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const key = btn.getAttribute('data-glow-preset');
          const preset = MASTER_GLOW_PRESETS[key];
          if (preset) {
            this.current = Object.assign({}, preset);
            this.syncModalUI(this.current);
            this.applySettings(this.current);
            this.saveSettings(this.current);
            PaperAudio.playPaperStamp();
            showBroadcastToast(`✨ Applied glow preset: ${preset.name}!`);
          }
        });
      });

      // Quick Master Glow Limit Chips (Instant Jump up to 120px)
      document.querySelectorAll('#masterGlowLimitChips .glow-limit-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const limit = parseInt(chip.getAttribute('data-master-limit'), 10) || 0;
          this.current.size = limit;
          this.current.enabled = limit > 0;
          this.syncModalUI(this.current);
          this.applySettings(this.current);
          this.saveSettings(this.current);
          PaperAudio.playPaperStamp();
          showBroadcastToast(`✨ Master text glow limit set to ${limit}px!`);
        });
      });

      // Minus / Plus Step Buttons (Up to 120px)
      document.getElementById('masterGlowMinusBtn')?.addEventListener('click', () => {
        const cur = this.current.enabled ? this.current.size : 0;
        const next = Math.max(0, cur - 2);
        this.current.size = next;
        this.current.enabled = next > 0;
        this.syncModalUI(this.current);
        this.applySettings(this.current);
        this.saveSettings(this.current);
        PaperAudio.playPaperRustle();
      });

      document.getElementById('masterGlowPlusBtn')?.addEventListener('click', () => {
        const cur = this.current.enabled ? this.current.size : 0;
        const next = Math.min(120, cur + 2);
        this.current.size = next;
        this.current.enabled = true;
        this.syncModalUI(this.current);
        this.applySettings(this.current);
        this.saveSettings(this.current);
        PaperAudio.playPaperRustle();
      });

      // Range Slider
      document.getElementById('masterGlowRadiusRange')?.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10) || 0;
        this.current.size = val;
        this.current.enabled = val > 0;
        this.syncModalUI(this.current);
        this.applySettings(this.current);
      });

      // Color Swatches
      document.querySelectorAll('#masterGlowColorSwatches .glow-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
          const c = sw.getAttribute('data-color');
          if (c) {
            this.current.color = c;
            if (!this.current.enabled || this.current.size === 0) {
              this.current.size = 12;
              this.current.enabled = true;
            }
            this.syncModalUI(this.current);
            this.applySettings(this.current);
            PaperAudio.playPaperStamp();
          }
        });
      });

      // Custom Color Picker
      document.getElementById('masterGlowCustomColor')?.addEventListener('input', (e) => {
        this.current.color = e.target.value;
        if (!this.current.enabled || this.current.size === 0) {
          this.current.size = 12;
          this.current.enabled = true;
        }
        this.syncModalUI(this.current);
        this.applySettings(this.current);
      });

      // Animation Mode Select
      document.getElementById('masterGlowAnimSelect')?.addEventListener('change', (e) => {
        this.current.animation = e.target.value;
        if (this.current.animation !== 'none' && (!this.current.enabled || this.current.size === 0)) {
          this.current.size = 12;
          this.current.enabled = true;
        }
        this.syncModalUI(this.current);
        this.applySettings(this.current);
      });

      // Speed Select
      document.getElementById('masterGlowSpeedSelect')?.addEventListener('change', (e) => {
        this.current.speed = e.target.value;
        this.syncModalUI(this.current);
        this.applySettings(this.current);
      });

      // Save & Apply
      document.getElementById('saveAndApplyGlowBtn')?.addEventListener('click', () => {
        this.saveSettings(this.current);
        this.closeModal();
        PaperAudio.playPaperStamp();
        showBroadcastToast('💾 Master text glow settings saved permanently!');
      });
    }
  };

  window.TypographyManager = TypographyManager;
  window.InlineTextEditor = InlineTextEditor;
  window.TextGlowManager = TextGlowManager;
  window.playBroadcastLoginAnimation = playBroadcastLoginAnimation;

})();
