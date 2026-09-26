import { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaBookmark,
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaCalendarAlt,
  FaChevronDown,
  FaDragon,
  FaGamepad,
  FaFilm,
  FaTv,
  FaMicrophone,
  FaBookOpen,
  FaBook,
  FaClock,
  FaEye,
  FaSearch,
} from 'react-icons/fa';
import LoginModal from './LoginModal';
import GlobalSearch from './GlobalSearch';
import { useData } from '../hooks/useData';

const exploreItems = [
  {
    name: 'Anime',
    path: '/category/anime',
    desc: 'Series, movies & OVAs',
    color: '#f472b6',
    Icon: FaDragon,
    banner: '/images/banners/demon-slayer.jpg',
  },
  {
    name: 'Gaming',
    path: '/category/gaming',
    desc: 'PC, console & mobile',
    color: '#60a5fa',
    Icon: FaGamepad,
    banner: '/images/banners/gta-v.jpg',
  },
  {
    name: 'Movies',
    path: '/category/movies',
    desc: 'Blockbusters & indie films',
    color: '#fbbf24',
    Icon: FaFilm,
    banner: '/images/banners/dune.jpg',
  },
  {
    name: 'TV Shows',
    path: '/category/tv-shows',
    desc: 'Binge-worthy series',
    color: '#34d399',
    Icon: FaTv,
    banner: '/images/banners/stranger-things.jpg',
  },
  {
    name: 'K-Pop',
    path: '/category/kpop',
    desc: 'Idols & music culture',
    color: '#a78bfa',
    Icon: FaMicrophone,
    banner: '/images/banners/blackpink.jpg',
  },
  {
    name: 'Comics',
    path: '/category/comics',
    desc: 'Marvel, DC & indie',
    color: '#f87171',
    Icon: FaBookOpen,
    banner: '/images/banners/batman.jpg',
  },
  {
    name: 'Manga',
    path: '/category/manga',
    desc: 'Japanese graphic novels',
    color: '#22d3ee',
    Icon: FaBook,
    banner: '/images/banners/one-piece.jpg',
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [newBookmarksCount, setNewBookmarksCount] = useState(0);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [hoveredExplore, setHoveredExplore] = useState(null);
  const [exploreQuery, setExploreQuery] = useState('');
  const [clock, setClock] = useState(new Date());
  const [visits, setVisits] = useState(0);
  const exploreRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // ⭐ Search data
  const { data: contentData } = useData('content');
  const { data: charData } = useData('characters');
  const { data: eventData } = useData('events');
  const { data: trailerData } = useData('trailers');
  const { data: merchData } = useData('merchandise');

  // ⭐ Build lightweight index
  const searchIndex = useMemo(() => {
    const items = [];
    (contentData?.content || []).forEach((c) => {
      items.push({
        id: c.id,
        type: 'article',
        title: c.title,
        category: c.category,
        series: c.series,
        image: c.image || c.banner,
        link: `/content/${c.id}`,
        popularity: c.popularity || 50,
      });
    });
    (charData?.characters || []).forEach((c) => {
      items.push({
        id: c.id,
        type: 'character',
        title: c.name,
        category: c.category,
        series: c.series,
        link: `/category/${c.category}`,
        popularity: 70,
      });
    });
    (trailerData?.trailers || []).forEach((t) => {
      items.push({
        id: t.id,
        type: 'trailer',
        title: t.title,
        category: t.category,
        series: t.series,
        link: `/category/${t.category}`,
        popularity: 65,
      });
    });
    (merchData?.merchandise || []).forEach((m) => {
      items.push({
        id: m.id,
        type: 'merchandise',
        title: m.name,
        category: m.category,
        series: m.series,
        link: `/category/${m.category}`,
        popularity: 55,
      });
    });
    (eventData?.events || []).forEach((e) => {
      items.push({
        id: e.id,
        type: 'event',
        title: e.title,
        category: e.category,
        link: `/category/${e.category}`,
        popularity: 60,
      });
    });
    return items;
  }, [contentData, charData, trailerData, merchData, eventData]);

  // ⭐ Compute suggestions
  const exploreSuggestions = useMemo(() => {
    const q = exploreQuery.trim().toLowerCase();
    if (!q) return [];
    return searchIndex
      .map((item) => {
        let score = 0;
        const t = item.title.toLowerCase();
        const s = (item.series || '').toLowerCase();
        if (t === q) score += 100;
        else if (t.startsWith(q)) score += 60;
        else if (t.includes(q)) score += 40;
        if (s.includes(q)) score += 25;
        return { ...item, _score: score };
      })
      .filter((i) => i._score > 0)
      .sort((a, b) => b._score - a._score || b.popularity - a.popularity)
      .slice(0, 6);
  }, [searchIndex, exploreQuery]);

  // ⭐ Highlight index for keyboard nav
  const [exploreHighlight, setExploreHighlight] = useState(0);

  useEffect(() => {
    setExploreHighlight(0);
  }, [exploreQuery]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ⭐ Live clock (updates every second)
  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // ⭐ Visitor counter (localStorage, per-session increment)
  useEffect(() => {
    const key = 'fv_visits_total';
    let total = parseInt(localStorage.getItem(key) || '0', 10);
    if (!sessionStorage.getItem('fv_visit_counted')) {
      total += 1;
      localStorage.setItem(key, String(total));
      sessionStorage.setItem('fv_visit_counted', '1');
    }
    // Starting count
    const baseline = 1000;
    setVisits(baseline + total);
  }, []);

  useEffect(() => {
    const load = () => {
      const cart = JSON.parse(localStorage.getItem('fv_cart') || '[]');
      setCartCount(cart.reduce((s, c) => s + c.qty, 0));
    };
    load();
    window.addEventListener('fv-cart-update', load);
    return () => window.removeEventListener('fv-cart-update', load);
  }, []);

  useEffect(() => {
    const load = () => {
      const bookmarks = JSON.parse(localStorage.getItem('fv_bookmarks') || '[]');
      const seen = parseInt(
        localStorage.getItem('fv_bookmarks_seen_count') || '0',
        10
      );
      const seenSafe = Number.isFinite(seen) ? seen : 0;
      const diff = bookmarks.length - seenSafe;
      setNewBookmarksCount(diff > 0 ? diff : 0);
    };
    load();
    window.addEventListener('fv-bookmarks-new-count', load);
    window.addEventListener('fv-bookmarks-update', load);
    window.addEventListener('storage', load);
    return () => {
      window.removeEventListener('fv-bookmarks-new-count', load);
      window.removeEventListener('fv-bookmarks-update', load);
      window.removeEventListener('storage', load);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target)) {
        setExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setExploreOpen(false);
    setOpen(false);
    setMobileExploreOpen(false);
    setExploreQuery('');
  }, [location.pathname]);

  // (Hover-based open/close removed — dropdown opens on click only)

  const isExploreActive = exploreItems.some((item) =>
    location.pathname.startsWith(item.path)
  );

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          width: '100%',
          background: scrolled ? 'rgba(10, 10, 10, 0.94)' : 'rgba(10, 10, 10, 0.55)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: scrolled
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(255, 255, 255, 0.04)',
          transition: 'background 0.2s ease, border-color 0.2s ease',
        }}
      >
        {/* ============ TOP UTILITY BAR ============ */}
        <div
          className="fv-container fv-utility-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            height: 28,
            fontSize: 10,
            letterSpacing: '0.08em',
            color: '#6b7590',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          {/* Left: Date + Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
            }}
          >
            <FaClock style={{ fontSize: 9, opacity: 0.6 }} />
            <span style={{ color: '#6b7590' }}>
              {clock.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span
              style={{
                color: '#f5f5f5',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '0.05em',
              }}
            >
              {clock.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              })}
            </span>
          </div>


          {/* Right: Visitor counter */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
              lineHeight: 1,
            }}
          >
            <FaEye
              style={{
                fontSize: 9,
                opacity: 0.6,
                display: 'inline-block',
                position: 'relative',
                top: -0.5,
              }}
            />
            <span
              style={{
                color: '#6b7590',
                lineHeight: 1,
                display: 'inline-block',
              }}
            >
              Total Visits:
            </span>
            <span
              style={{
                color: '#fca5a5',
                fontWeight: 700,
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.05em',
                lineHeight: 1,
                display: 'inline-block',
              }}
            >
              {visits.toLocaleString()}
            </span>
            <span
              className="fv-live-indicator"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                marginLeft: 6,
                paddingLeft: 8,
                borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
                lineHeight: 1,
                verticalAlign: 'middle',
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#dc2626',
                  boxShadow: '0 0 6px #dc2626',
                  animation: 'fvPulseDot 1.6s ease-in-out infinite',
                  display: 'inline-block',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: '#fca5a5',
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  lineHeight: 1,
                  display: 'inline-block',
                  position: 'relative',
                  top: 0.5,
                }}
              >
                LIVE
              </span>
            </span>
          </div>
        </div>

        {/* ============ MAIN NAV ROW ============ */}
        <div
          className="fv-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
            height: 62,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
              textDecoration: 'none',
            }}
          >
            <img
              src="/images/Logo/logo.png"
              alt="FandomVerse"
              className="fv-nav-logo-img"
              style={{
                height: 36,
                width: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
          </Link>

          {/* ---------- Center nav ---------- */}
          <div
            className="fv-desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flex: 1,
              justifyContent: 'center',
              minWidth: 0,
              height: '100%',
            }}
          >
            {/* Home */}
            <Link
              to="/"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                height: '100%',
                padding: '0 16px',
                fontSize: 11,
                lineHeight: 1,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                color: location.pathname === '/' ? '#fca5a5' : '#8a8a8a',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/')
                  e.currentTarget.style.color = '#e5e5e5';
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/')
                  e.currentTarget.style.color = '#8a8a8a';
              }}
            >
              Home
              {location.pathname === '/' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 12,
                    height: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #dc2626, #f97316)',
                  }}
                />
              )}
            </Link>

            {/* ⭐ Explore Content mega-menu */}
            <div
              ref={exploreRef}
              style={{ position: 'relative', height: '100%' }}
            >
              <button
                onClick={() => setExploreOpen((o) => !o)}
                aria-haspopup="true"
                aria-expanded={exploreOpen}
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  height: '100%',
                  padding: '0 16px',
                  fontSize: 11,
                  lineHeight: 1,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  color: isExploreActive ? '#fca5a5' : '#8a8a8a',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isExploreActive)
                    e.currentTarget.style.color = '#e5e5e5';
                }}
              >
                Explore Content
                <FaChevronDown
                  style={{
                    fontSize: 9,
                    transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 0.2s ease',
                    opacity: 0.75,
                  }}
                />
                {isExploreActive && (
                  <span
                    style={{
                      position: 'absolute',
                      left: 16,
                      right: 16,
                      bottom: 12,
                      height: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(90deg, #dc2626, #f97316)',
                    }}
                  />
                )}
              </button>

              {/* ============ Mega-menu panel ============ */}
              {exploreOpen && (
                <div
                  style={{
                    position: 'fixed',
                    top: 94,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 'min(1100px, calc(100vw - 40px))',
                    background: 'rgba(10, 10, 10, 0.98)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 16,
                    padding: 20,
                    boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    zIndex: 200,
                    animation: 'fvDropdownIn 0.2s ease-out both',
                  }}
                >
                  {/* Arrow pointing at button */}
                  <span
                    style={{
                      position: 'absolute',
                      top: -6,
                      left: '50%',
                      transform: 'translateX(-50%) rotate(45deg)',
                      width: 12,
                      height: 12,
                      background: 'rgba(10, 10, 10, 0.98)',
                      borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  />

                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '6px 8px 14px',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                      marginBottom: 14,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        fontFamily: 'Orbitron, sans-serif',
                        fontWeight: 700,
                        color: '#8a8a8a',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: '#dc2626',
                        }}
                      />
                      Explore Fandoms
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontFamily: 'Space Grotesk, sans-serif',
                        color: '#6b7590',
                      }}
                    >
                      7 Universes · 1 Portal
                    </span>
                  </div>

                  {/* Cards grid — 3 per row */}
                  <div
                    className="fv-explore-grid"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: 12,
                    }}
                  >
                    {exploreItems.map((item) => {
                      const isActive = location.pathname.startsWith(item.path);
                      const isHovered = hoveredExplore === item.path;
                      const Icon = item.Icon;
                      const showBanner = (isHovered || isActive) && item.banner;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setExploreOpen(false)}
                          onMouseEnter={() => setHoveredExplore(item.path)}
                          onMouseLeave={() => setHoveredExplore(null)}
                          style={{
                            position: 'relative',
                            display: 'flex',
                            gap: 14,
                            alignItems: 'center',
                            padding: '16px 18px',
                            borderRadius: 12,
                            background: isActive
                              ? 'rgba(220, 38, 38, 0.1)'
                              : 'rgba(255, 255, 255, 0.02)',
                              border: `1px solid ${
                                isActive
                                  ? 'rgba(220, 38, 38, 0.4)'
                                  : isHovered
                                  ? 'rgba(255, 255, 255, 0.14)'
                                  : 'rgba(255, 255, 255, 0.06)'
                              }`,
                              textDecoration: 'none',
                              transition:
                                'border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1), background 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            isolation: 'isolate',
                          }}
                        >
                          {/* ⭐ Banner background (smooth fade + subtle zoom) */}
                          {item.banner && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                backgroundImage: `url(${item.banner})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                opacity: showBanner ? 0.4 : 0,
                                transform: showBanner
                                  ? 'scale(1.06)'
                                  : 'scale(1)',
                                transition:
                                  'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                zIndex: 0,
                                pointerEvents: 'none',
                                willChange: 'opacity, transform',
                              }}
                            />
                          )}

                          {/* Dark overlay for readability */}
                          {item.banner && (
                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                  'linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.85) 100%)',
                                opacity: showBanner ? 1 : 0,
                                transition:
                                  'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                                zIndex: 0,
                                pointerEvents: 'none',
                                willChange: 'opacity',
                              }}
                            />
                          )}

                          {/* Icon */}
                          <span
                            style={{
                              position: 'relative',
                              zIndex: 1,
                              width: 32,
                              height: 32,
                              display: 'grid',
                              placeItems: 'center',
                              color: isActive || isHovered ? '#fca5a5' : '#8a8a8a',
                              fontSize: 18,
                              flexShrink: 0,
                              transition: 'color 0.25s ease',
                            }}
                          >
                            <Icon />
                          </span>

                          {/* Text — stays crisp on top */}
                          <div style={{ position: 'relative', zIndex: 1, minWidth: 0, flex: 1 }}>
                            <div
                              style={{
                                fontSize: 13,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                fontFamily: 'Space Grotesk, sans-serif',
                                fontWeight: 600,
                                color: isActive ? '#fca5a5' : '#e5e5e5',
                                marginBottom: 4,
                                textShadow: showBanner
                                  ? '0 1px 6px rgba(0,0,0,0.8)'
                                  : 'none',
                                transition: 'color 0.25s ease, text-shadow 0.4s ease',
                              }}
                            >
                              {item.name}
                            </div>
                            <div
                              style={{
                                fontSize: 12,
                                color: '#6b7590',
                                fontFamily: 'Space Grotesk, sans-serif',
                                textTransform: 'none',
                                letterSpacing: '0.02em',
                                textShadow: showBanner
                                  ? '0 1px 6px rgba(0,0,0,0.8)'
                                  : 'none',
                              }}
                            >
                              {item.desc}
                            </div>
                          </div>

                          {isActive && (
                            <span
                              style={{
                                position: 'relative',
                                zIndex: 1,
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                background: '#dc2626',
                                boxShadow: '0 0 8px #dc2626',
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>

                  {/* ⭐ Bottom search input with suggestions */}
                  <div
                    style={{
                      marginTop: 14,
                      paddingTop: 14,
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      position: 'relative',
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <FaSearch
                        style={{
                          position: 'absolute',
                          left: 14,
                          top: 18,
                          color: '#6b7590',
                          fontSize: 12,
                          pointerEvents: 'none',
                          zIndex: 1,
                        }}
                      />
                      <input
                        type="text"
                        value={exploreQuery}
                        onChange={(e) => setExploreQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            setExploreHighlight((i) =>
                              Math.min(i + 1, exploreSuggestions.length - 1)
                            );
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setExploreHighlight((i) =>
                              Math.max(i - 1, 0)
                            );
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            const sel = exploreSuggestions[exploreHighlight];
                            const q = exploreQuery.trim();
                            setExploreOpen(false);
                            setExploreQuery('');
                            if (sel) {
                              // Direct link to highlighted item
                              navigate(sel.link);
                            } else if (q) {
                              navigate(`/search?q=${encodeURIComponent(q)}`);
                            } else {
                              navigate('/search');
                            }
                          }
                        }}
                        placeholder="Search everything..."
                        style={{
                          width: '100%',
                          padding: '11px 60px 11px 40px',
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: 10,
                          color: '#f5f5f5',
                          fontSize: 12,
                          fontFamily: 'Space Grotesk, sans-serif',
                          letterSpacing: '0.02em',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'all 0.2s ease',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor =
                            'rgba(220, 38, 38, 0.5)';
                          e.currentTarget.style.background =
                            'rgba(220, 38, 38, 0.06)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor =
                            'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.background =
                            'rgba(255, 255, 255, 0.03)';
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: 10,
                          top: 18,
                          fontSize: 9,
                          padding: '3px 7px',
                          borderRadius: 5,
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#8a94ad',
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 600,
                          letterSpacing: '0.08em',
                          pointerEvents: 'none',
                        }}
                      >
                        ENTER
                      </span>
                    </div>

                    {/* ⭐ Suggestions dropdown */}
                    {exploreQuery.trim() && exploreSuggestions.length > 0 && (
                      <div
                        style={{
                          marginTop: 8,
                          padding: 4,
                          background: 'rgba(15, 15, 18, 0.98)',
                          border: '1px solid rgba(220, 38, 38, 0.35)',
                          borderRadius: 10,
                          boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                          maxHeight: 280,
                          overflowY: 'auto',
                        }}
                      >
                        {exploreSuggestions.map((s, i) => {
                          const isHi = i === exploreHighlight;
                          const typeColors = {
                            article: '#f97316',
                            character: '#22d3ee',
                            trailer: '#dc2626',
                            merchandise: '#fbbf24',
                            event: '#a78bfa',
                          };
                          const color = typeColors[s.type] || '#dc2626';
                          return (
                            <button
                              key={`${s.type}-${s.id}`}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                navigate(s.link);
                                setExploreOpen(false);
                                setExploreQuery('');
                              }}
                              onMouseEnter={() => setExploreHighlight(i)}
                              style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '8px 10px',
                                background: isHi
                                  ? 'rgba(220, 38, 38, 0.12)'
                                  : 'transparent',
                                border: 'none',
                                borderRadius: 7,
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.1s',
                              }}
                            >
                              {s.image ? (
                                <img
                                  src={s.image}
                                  alt=""
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    objectFit: 'cover',
                                    flexShrink: 0,
                                    background: '#0f0f12',
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 6,
                                    background: `${color}22`,
                                    border: `1px solid ${color}55`,
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: 12,
                                    fontFamily: 'Space Grotesk, sans-serif',
                                    fontWeight: 600,
                                    color: '#f5f5f5',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {s.title}
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    gap: 6,
                                    alignItems: 'center',
                                    fontSize: 9,
                                    color: '#8a94ad',
                                    fontFamily: 'Space Grotesk, sans-serif',
                                    marginTop: 2,
                                  }}
                                >
                                  <span
                                    style={{
                                      color,
                                      letterSpacing: '0.08em',
                                      textTransform: 'uppercase',
                                      fontWeight: 700,
                                    }}
                                  >
                                    {s.type}
                                  </span>
                                  <span>·</span>
                                  <span style={{ textTransform: 'capitalize' }}>
                                    {s.category}
                                  </span>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* About Us */}
            <Link
              to="/about"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                height: '100%',
                padding: '0 16px',
                fontSize: 11,
                lineHeight: 1,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                color:
                  location.pathname === '/about' ? '#fca5a5' : '#8a8a8a',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/about')
                  e.currentTarget.style.color = '#e5e5e5';
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/about')
                  e.currentTarget.style.color = '#8a8a8a';
              }}
            >
              About Us
              {location.pathname === '/about' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 12,
                    height: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #dc2626, #f97316)',
                  }}
                />
              )}
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                height: '100%',
                padding: '0 16px',
                fontSize: 11,
                lineHeight: 1,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                color:
                  location.pathname === '/contact' ? '#fca5a5' : '#8a8a8a',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/contact')
                  e.currentTarget.style.color = '#e5e5e5';
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/contact')
                  e.currentTarget.style.color = '#8a8a8a';
              }}
            >
              Contact
              {location.pathname === '/contact' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 12,
                    height: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #dc2626, #f97316)',
                  }}
                />
              )}
            </Link>

            {/* Releases */}
            <Link
              to="/releases"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                height: '100%',
                padding: '0 16px',
                fontSize: 11,
                lineHeight: 1,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                color:
                  location.pathname === '/releases' ? '#fca5a5' : '#8a8a8a',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/releases')
                  e.currentTarget.style.color = '#e5e5e5';
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/releases')
                  e.currentTarget.style.color = '#8a8a8a';
              }}
            >
              Releases
              {location.pathname === '/releases' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 12,
                    height: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #dc2626, #f97316)',
                  }}
                />
              )}
            </Link>

            {/* Trailers */}
            <Link
              to="/trailers"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                height: '100%',
                padding: '0 16px',
                fontSize: 11,
                lineHeight: 1,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                color:
                  location.pathname === '/trailers' ? '#fca5a5' : '#8a8a8a',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/trailers')
                  e.currentTarget.style.color = '#e5e5e5';
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/trailers')
                  e.currentTarget.style.color = '#8a8a8a';
              }}
            >
              Trailers
              {location.pathname === '/trailers' && (
                <span
                  style={{
                    position: 'absolute',
                    left: 16,
                    right: 16,
                    bottom: 12,
                    height: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(90deg, #dc2626, #f97316)',
                  }}
                />
              )}
            </Link>
          </div>

          {/* ---------- Right actions ---------- */}
          <div
            className="fv-nav-right"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexShrink: 0,
            }}
          >
            <div className="fv-nav-search">
              <GlobalSearch />
            </div>

            <Link
              to="/releases"
              aria-label="Releases"
              className="fv-nav-icon-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                color: '#a0a0a0',
                fontSize: 14,
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0a0')}
            >
              <FaCalendarAlt />
            </Link>

            <Link
              to="/bookmarks"
              aria-label="Bookmarks"
              className="fv-nav-icon-btn"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                color: '#a0a0a0',
                fontSize: 14,
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0a0')}
            >
              <FaBookmark />
              {newBookmarksCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    minWidth: 15,
                    height: 15,
                    padding: '0 4px',
                    borderRadius: 999,
                    background: '#dc2626',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'Orbitron, sans-serif',
                    lineHeight: 1,
                  }}
                >
                  {newBookmarksCount > 9 ? '9+' : newBookmarksCount}
                </span>
              )}
            </Link>

            <Link
              to="/cart"
              aria-label="Cart"
              className="fv-nav-icon-btn always-show"
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 34,
                height: 34,
                color: '#a0a0a0',
                fontSize: 14,
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f5f5f5')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0a0')}
            >
              <FaShoppingCart />
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    minWidth: 15,
                    height: 15,
                    padding: '0 4px',
                    borderRadius: 999,
                    background: '#dc2626',
                    color: '#fff',
                    fontSize: 9,
                    fontWeight: 700,
                    display: 'grid',
                    placeItems: 'center',
                    fontFamily: 'Orbitron, sans-serif',
                    lineHeight: 1,
                  }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <span
              className="fv-nav-divider"
              style={{
                width: 1,
                height: 22,
                background: 'rgba(255, 255, 255, 0.1)',
                margin: '0 8px',
              }}
            />

            <button
              onClick={() => setLoginOpen(true)}
              className="fv-nav-signin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 34,
                padding: '0 16px',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                color: '#e5e5e5',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Sign In
            </button>

            <button
              onClick={() => setSignupOpen(true)}
              className="fv-nav-signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 34,
                padding: '0 18px',
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg, #dc2626, #f97316)',
                border: '1px solid transparent',
                borderRadius: 8,
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.35)',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 6px 22px rgba(220, 38, 38, 0.6)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(220, 38, 38, 0.35)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Sign Up
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="fv-hamburger"
              style={{
                display: 'none',
                fontSize: 18,
                padding: 6,
                color: '#f5f5f5',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Menu"
            >
              {open ? <FaTimes /> : <FaBars />}
            </button>
            </div>
        </div>

        {/* ============ SEARCH BAR ROW ============ */}
        <div
          className="fv-search-row"
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.04)',
            padding: '10px 24px 14px',
            background: scrolled
              ? 'rgba(10, 10, 10, 0.94)'
              : 'rgba(10, 10, 10, 0.55)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div className="fv-search-bar-wrapper">
            <GlobalSearch fullWidth />
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              background: 'rgba(10, 10, 10, 0.98)',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <Link
              to="/"
              onClick={() => setOpen(false)}
              style={mobileLinkStyle}
            >
              Home
            </Link>

            <button
              onClick={() => setMobileExploreOpen((o) => !o)}
              style={{
                ...mobileLinkStyle,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                justifyContent: 'space-between',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              <span>Explore Content</span>
              <FaChevronDown
                style={{
                  fontSize: 10,
                  transform: mobileExploreOpen ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s',
                }}
              />
            </button>

            {mobileExploreOpen && (
              <div
                style={{
                  paddingLeft: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  borderLeft: '2px solid rgba(220, 38, 38, 0.3)',
                  marginLeft: 12,
                  marginBottom: 4,
                }}
              >
                {exploreItems.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  const Icon = item.Icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setOpen(false)}
                      style={{
                        padding: '8px 10px',
                        color: isActive ? item.color : '#a0a0a0',
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: 12,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <Icon style={{ color: item.color, fontSize: 12 }} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}

            <Link
              to="/about"
              onClick={() => setOpen(false)}
              style={mobileLinkStyle}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              style={mobileLinkStyle}
            >
              Contact
            </Link>
            <Link
              to="/releases"
              onClick={() => setOpen(false)}
              style={mobileLinkStyle}
            >
              <FaCalendarAlt style={{ fontSize: 13 }} /> Releases
            </Link>
            <Link
              to="/trailers"
              onClick={() => setOpen(false)}
              style={mobileLinkStyle}
            >
              Trailers
            </Link>
            <Link
              to="/bookmarks"
              onClick={() => setOpen(false)}
              style={mobileLinkStyle}
            >
              <FaBookmark style={{ fontSize: 13 }} /> Bookmarks
            </Link>
            <Link
              to="/cart"
              onClick={() => setOpen(false)}
              style={mobileLinkStyle}
            >
              <FaShoppingCart style={{ fontSize: 13 }} /> Cart
            </Link>
          </div>
        )}

        <style>{`
          .fv-nav-search + .fv-nav-icon-btn {
            display: none !important;
          }

          @keyframes fvDropdownIn {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }

          @keyframes fvPulseDot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.4; transform: scale(0.85); }
          }

          @media (max-width: 1280px) {
            .fv-nav-search { display: none !important; }
            .fv-nav-search + .fv-nav-icon-btn {
              display: inline-flex !important;
            }
          }
          @media (max-width: 1180px) {
            .fv-desktop-nav { display: none !important; }
            .fv-hamburger { display: block !important; }
          }
          @media (max-width: 900px) {
            .fv-explore-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
          }
          @media (max-width: 768px) {
            .fv-nav-logo-img { height: 28px !important; }
            .fv-nav-divider,
            .fv-nav-signin { display: none !important; }
            .fv-top-tagline { display: none !important; }
            .fv-search-row { display: none !important; }
          }
          @media (max-width: 500px) {
            .fv-live-indicator { display: none !important; }
          }
          @media (max-width: 480px) {
            .fv-nav-signup {
              padding: 0 12px !important;
              font-size: 10px !important;
            }
          }
          @media (max-width: 640px) {
            .fv-utility-bar {
              height: auto !important;
              min-height: 24px !important;
              padding: 4px 0 !important;
              font-size: 9px !important;
              gap: 8px !important;
            }
            .fv-utility-bar > div:first-child span:first-child {
              font-size: 9px !important;
            }
          }
          @media (max-width: 900px) and (min-width: 769px) {
            .fv-search-bar-wrapper {
              width: 88% !important;
            }
          }
          @media (max-width: 1100px) and (min-width: 901px) {
            .fv-search-bar-wrapper {
              width: 85% !important;
            }
          }

          /* ⭐ Search bar wrapper — 80% width, centered */
          .fv-search-bar-wrapper {
            width: 80%;
            max-width: 1100px;
            min-width: 280px;
          }

          /* ⭐ Force inner search elements to fill wrapper */
          .fv-search-bar-wrapper > * {
            width: 100% !important;
            max-width: 100% !important;
          }
          .fv-search-bar-wrapper input {
            width: 100% !important;
          }
          .fv-search-bar-wrapper form {
            width: 100% !important;
          }
        `}</style>
      </nav>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <LoginModal
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        initialMode="signup"
      />
    </>
  );
}

const mobileLinkStyle = {
  padding: '10px 12px',
  color: '#cbd5e1',
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: 13,
  letterSpacing: '0.06em',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  textDecoration: 'none',
};