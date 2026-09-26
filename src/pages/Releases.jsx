import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight, FaFilter } from 'react-icons/fa';
import { useData } from '../hooks/useData';
import Breadcrumbs from '../components/Breadcrumbs';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

const categories = [
  'all',
  'anime',
  'gaming',
  'movies',
  'tv-shows',
  'kpop',
  'comics',
  'manga',
];

// ============================================================
// Series → banner image map (same as ReleasesCalendar)
// ============================================================
const SERIES_IMAGES = {
  // Gaming
  'GTA VI': '/images/banners/gta-vi.jpg',
  'GTA V': '/images/banners/gta-v.jpg',
  'Hades II': '/images/banners/hades.jpg',
  'Hades II Console': '/images/banners/hades.jpg',
  'God of War': '/images/banners/god-of-war.jpg',
  'Elden Ring': '/images/banners/elden-ring.jpg',
  Minecraft: '/images/banners/minecraft.jpg',
  Fortnite: '/images/banners/fortnite.jpg',
  'Call of Duty': '/images/banners/call-of-duty.jpg',
  'Red Dead Redemption': '/images/banners/red-dead-redemption.jpg',
  'Cyberpunk 2077': '/images/banners/cyberpunk-2077.jpg',
  'The Witcher': '/images/banners/the-witcher.jpg',
  Valorant: '/images/banners/valorant.jpg',
  'Dark Souls': '/images/banners/dark-souls.jpg',
  'Resident Evil': '/images/banners/resident-evil.jpg',
  "Assassin's Creed": '/images/banners/assassin-s-creed.jpg',
  'The Last of Us': '/images/banners/the-last-of-us.jpg',

  // Anime
  'Demon Slayer': '/images/banners/demon-slayer.jpg',
  'Demon Slayer S4': '/images/banners/demon-slayer.jpg',
  'Jujutsu Kaisen': '/images/banners/jujutsu-kaisen.jpg',
  'Jujutsu Kaisen Movie': '/images/banners/jujutsu-kaisen.jpg',
  'One Piece': '/images/banners/one-piece.jpg',
  'Attack on Titan': '/images/banners/attack-on-titan.jpg',
  Naruto: '/images/banners/naruto.jpg',
  Bleach: '/images/banners/bleach.jpg',
  'Solo Leveling': '/images/banners/solo-leveling.jpg',
  'My Hero Academia': '/images/banners/my-hero-academia.jpg',
  'Chainsaw Man': '/images/banners/chainsaw-man.jpg',
  'Fullmetal Alchemist': '/images/banners/fullmetal-alchemist.jpg',
  Frieren: '/images/banners/frieren.jpg',
  'Death Note': '/images/banners/death-note.jpg',

  // Movies
  'Dune Part Three': '/images/banners/dune.jpg',
  Dune: '/images/banners/dune.jpg',
  'Marvel Phase 7 Kickoff': '/images/banners/avengers.jpg',
  'The Matrix': '/images/banners/the-matrix.jpg',
  'The Batman': '/images/banners/the-batman.jpg',
  'Spider-Man': '/images/banners/spider-man.jpg',
  Superman: '/images/banners/superman.jpg',
  Interstellar: '/images/banners/interstellar.jpg',
  Avatar: '/images/banners/avatar.jpg',
  'Star Wars': '/images/banners/star-wars.jpg',

  // TV Shows
  'Stranger Things S5 Vol 2': '/images/banners/stranger-things.jpg',
  'Stranger Things': '/images/banners/stranger-things.jpg',
  'The Last of Us S3': '/images/banners/the-last-of-us.jpg',
  'The Last of Us': '/images/banners/the-last-of-us.jpg',
  'Breaking Bad': '/images/banners/breaking-bad.jpg',
  'Game of Thrones': '/images/banners/game-of-thrones.jpg',
  Wednesday: '/images/banners/wednesday.jpg',
  'The Boys': '/images/banners/the-boys.jpg',
  'House of the Dragon': '/images/banners/house-of-the-dragon.jpg',
  'Squid Game': '/images/banners/squid-game.jpg',
  'Peaky Blinders': '/images/banners/peaky-blinders.jpg',

  // K-Pop
  'BTS Reunion Tour Seoul': '/images/banners/bts.jpg',
  BTS: '/images/banners/bts.jpg',
  'BLACKPINK Comeback': '/images/banners/blackpink.jpg',
  BLACKPINK: '/images/banners/blackpink.jpg',
  TWICE: '/images/banners/twice.jpg',
  'Stray Kids': '/images/banners/stray-kids.jpg',
  SEVENTEEN: '/images/banners/seventeen.jpg',
  'NewJeans': '/images/banners/newjeans.jpg',
  IVE: '/images/banners/ive.jpg',
  aespa: '/images/banners/aespa.jpg',

  // Comics
  "X-Men '97 S2": '/images/banners/x-men.jpg',
  'X-Men': '/images/banners/x-men.jpg',
  Batman: '/images/banners/batman.jpg',
  'Justice League': '/images/banners/justice-league.jpg',
  Watchmen: '/images/banners/watchmen.jpg',
  Avengers: '/images/banners/avengers.jpg',
  'Captain America': '/images/banners/captain-america.jpg',

  // Manga
  'One Piece Live Action S2': '/images/banners/one-piece.jpg',
  Berserk: '/images/banners/berserk.jpg',
  'Vinland Saga': '/images/banners/vinland-saga.jpg',
  'Hunter x Hunter': '/images/banners/hunter-x-hunter.jpg',
};

const CATEGORY_FALLBACKS = {
  anime: '/images/banners/demon-slayer.jpg',
  gaming: '/images/banners/gta-v.jpg',
  movies: '/images/banners/dune.jpg',
  'tv-shows': '/images/banners/stranger-things.jpg',
  kpop: '/images/banners/blackpink.jpg',
  comics: '/images/banners/batman.jpg',
  manga: '/images/banners/one-piece.jpg',
};

function getImageForRelease(release) {
  // Try exact title match
  if (release.title && SERIES_IMAGES[release.title]) {
    return SERIES_IMAGES[release.title];
  }

  // Try matching keyword in title
  if (release.title) {
    const titleLower = release.title.toLowerCase();
    // Sort keys by length (longest first) for better matching
    const sortedKeys = Object.keys(SERIES_IMAGES).sort(
      (a, b) => b.length - a.length
    );
    for (const key of sortedKeys) {
      if (titleLower.includes(key.toLowerCase())) {
        return SERIES_IMAGES[key];
      }
    }
  }

  // Fallback to category
  return CATEGORY_FALLBACKS[release.category] || null;
}

export default function Releases() {
  const { data } = useData('releases');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');

  const filtered = useMemo(() => {
    if (!data?.releases) return [];
    let items = [...data.releases];

    if (categoryFilter !== 'all') {
      items = items.filter((r) => r.category === categoryFilter);
    }

    const now = new Date();
    if (timeFilter === 'upcoming') {
      items = items.filter((r) => new Date(r.date) >= now);
    } else if (timeFilter === 'past') {
      items = items.filter((r) => new Date(r.date) < now);
    }

    items.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      return timeFilter === 'past' ? db - da : da - db;
    });

    return items;
  }, [data, categoryFilter, timeFilter]);

  const groupedByMonth = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      if (!groups[key]) groups[key] = { label, items: [] };
      groups[key].items.push(item);
    });
    return Object.entries(groups).sort(([a], [b]) =>
      timeFilter === 'past' ? b.localeCompare(a) : a.localeCompare(b)
    );
  }, [filtered, timeFilter]);

  return (
    <div className="fv-container" style={{ padding: '56px 24px 80px' }}>
      <Breadcrumbs items={[{ label: 'Releases' }]} />
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 800,
            color: '#f5f5f5',
            marginBottom: 8,
            letterSpacing: '0.01em',
          }}
        >
          Releases
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#a0a0a0',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          Track every premiere, game drop, album, and movie across all fandoms.
        </p>
      </div>

      {/* Filters row */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          marginBottom: 28,
          paddingBottom: 24,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <FilterGroup
          label="Time"
          options={[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'past', label: 'Past' },
            { id: 'all', label: 'All' },
          ]}
          value={timeFilter}
          onChange={setTimeFilter}
        />
        <FilterGroup
          label="Category"
          options={categories.map((c) => ({
            id: c,
            label: c === 'all' ? 'All' : c,
            capitalize: true,
          }))}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      {/* Count */}
      <p
        style={{
          fontSize: 13,
          color: '#a8a8a8',
          marginBottom: 24,
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {filtered.length} release{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: 60,
            textAlign: 'center',
            color: '#a8a8a8',
            fontSize: 14,
            background: '#151518',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 16,
          }}
        >
          No releases found in this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {groupedByMonth.map(([key, group]) => (
            <div key={key}>
              {/* Month header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 18,
                }}
              >
                <h2
                  style={{
                    fontSize: 15,
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 700,
                    color: '#f5f5f5',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    margin: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.label}
                </h2>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: 'rgba(255, 255, 255, 0.06)',
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: '#a8a8a8',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map((r) => (
                  <ReleaseRow key={r.id} release={r} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Release Row — hover pe banner dikhata hai
// ============================================================
// ============================================================
// Release Row — hover pe banner dikhata hai (Explore menu style)
// ============================================================
function ReleaseRow({ release: r }) {
  const [hovered, setHovered] = useState(false);
  const date = new Date(r.date);
  const now = new Date();
  const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  const isPast = daysLeft < 0;
  const color = catColors[r.category] || '#e11d48';
  const bgImage = getImageForRelease(r);
  const showBanner = hovered && bgImage;

  return (
    <Link
      to={`/category/${r.category}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        textDecoration: 'none',
        color: 'inherit',
        background: '#151518',
        border: `1px solid ${
          showBanner ? `${color}66` : 'rgba(255, 255, 255, 0.06)'
        }`,
        borderRadius: 12,
        opacity: isPast ? 0.6 : 1,
        overflow: 'hidden',
        transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* ⭐ Banner background — Explore menu jaisa smooth */}
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            opacity: showBanner ? 0.45 : 0,
            transform: showBanner ? 'scale(1.06)' : 'scale(1)',
            transition:
              'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'opacity, transform',
          }}
        />
      )}

      {/* ⭐ Overlay gradient — Explore menu jaisa */}
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(21,21,24,0.95) 0%, rgba(21,21,24,0.75) 50%, rgba(21,21,24,0.35) 100%)',
            opacity: showBanner ? 1 : 0,
            transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'opacity',
          }}
        />
      )}

      {/* Date block */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flexShrink: 0,
          width: 56,
          textAlign: 'center',
          padding: '8px 0',
          borderRadius: 10,
          background: 'rgba(255, 255, 255, 0.04)',
          border: `1px solid ${color}44`,
          color: color,
          fontFamily: 'Orbitron, sans-serif',
          backdropFilter: 'blur(4px)',
        }}
      >
        <div style={{ fontSize: 9, letterSpacing: '0.1em', opacity: 0.9 }}>
          {date
            .toLocaleDateString('en-US', { month: 'short' })
            .toUpperCase()}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>
          {date.getDate()}
        </div>
        <div style={{ fontSize: 9, opacity: 0.7 }}>
          {date
            .toLocaleDateString('en-US', { weekday: 'short' })
            .toUpperCase()}
        </div>
      </div>

      {/* Info */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            color: color,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            marginBottom: 4,
            textShadow: showBanner ? '0 1px 6px rgba(0,0,0,0.8)' : 'none',
            transition: 'text-shadow 0.4s ease',
          }}
        >
          {r.type}
        </div>
        <div
          style={{
            fontSize: 15,
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 600,
            color: '#f5f5f5',
            marginBottom: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            letterSpacing: '0.01em',
            textShadow: showBanner ? '0 1px 6px rgba(0,0,0,0.9)' : 'none',
            transition: 'text-shadow 0.4s ease',
          }}
        >
          {r.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: isPast ? '#a8a8a8' : '#a0a0a0',
            fontFamily: 'Space Grotesk, sans-serif',
            textShadow: showBanner ? '0 1px 6px rgba(0,0,0,0.8)' : 'none',
            transition: 'text-shadow 0.4s ease',
          }}
        >
          {isPast
            ? `${Math.abs(daysLeft)} days ago`
            : daysLeft === 0
            ? 'Today'
            : daysLeft === 1
            ? 'Tomorrow'
            : `in ${daysLeft} days`}
        </div>
      </div>

      <FaArrowRight
        style={{
          position: 'relative',
          zIndex: 2,
          color: showBanner ? '#fda4af' : '#a8a8a8',
          fontSize: 11,
          transition:
            'color 0.3s ease, transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: showBanner ? 'translateX(3px)' : 'translateX(0)',
        }}
      />
    </Link>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: '#a8a8a8',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                borderRadius: 8,
                background: isActive
                  ? 'rgba(225, 29, 72, 0.15)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isActive
                  ? '1px solid rgba(225, 29, 72, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? '#fda4af' : '#a0a0a0',
                cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                textTransform: opt.capitalize ? 'capitalize' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}