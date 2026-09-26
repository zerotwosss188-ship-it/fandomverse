import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaCalendarAlt,
  FaArrowRight,
  FaClock,
  FaFire,
} from 'react-icons/fa';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

const catNames = {
  anime: 'Anime',
  gaming: 'Gaming',
  movies: 'Movies',
  'tv-shows': 'TV Shows',
  kpop: 'K-Pop',
  comics: 'Comics',
  manga: 'Manga',
};

export const SERIES_IMAGES = {
  'GTA VI': '/images/banners/gta-vi.jpg',
  'GTA V': '/images/banners/gta-v.jpg',
  'Hades II': '/images/banners/hades.jpg',
  'Hades II Console': '/images/banners/hades.jpg',
  Hades: '/images/banners/hades.jpg',
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
  'Stranger Things S5 Vol 2': '/images/banners/stranger-things.jpg',
  'Stranger Things': '/images/banners/stranger-things.jpg',
  'The Last of Us S3': '/images/banners/the-last-of-us.jpg',
  'Breaking Bad': '/images/banners/breaking-bad.jpg',
  'Game of Thrones': '/images/banners/game-of-thrones.jpg',
  Wednesday: '/images/banners/wednesday.jpg',
  'The Boys': '/images/banners/the-boys.jpg',
  'House of the Dragon': '/images/banners/house-of-the-dragon.jpg',
  'Squid Game': '/images/banners/squid-game.jpg',
  'Peaky Blinders': '/images/banners/peaky-blinders.jpg',
  'BTS Reunion Tour Seoul': '/images/banners/bts.jpg',
  BTS: '/images/banners/bts.jpg',
  'BLACKPINK Comeback': '/images/banners/blackpink.jpg',
  BLACKPINK: '/images/banners/blackpink.jpg',
  TWICE: '/images/banners/twice.jpg',
  'Stray Kids': '/images/banners/stray-kids.jpg',
  SEVENTEEN: '/images/banners/seventeen.jpg',
  NewJeans: '/images/banners/newjeans.jpg',
  IVE: '/images/banners/ive.jpg',
  aespa: '/images/banners/aespa.jpg',
  "X-Men '97 S2": '/images/banners/x-men.jpg',
  'X-Men': '/images/banners/x-men.jpg',
  Batman: '/images/banners/batman.jpg',
  'Justice League': '/images/banners/justice-league.jpg',
  Watchmen: '/images/banners/watchmen.jpg',
  Avengers: '/images/banners/avengers.jpg',
  'Captain America': '/images/banners/captain-america.jpg',
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

export function getImageForRelease(release) {
  if (release.title && SERIES_IMAGES[release.title]) {
    return SERIES_IMAGES[release.title];
  }
  if (release.title) {
    const titleLower = release.title.toLowerCase();
    const sortedKeys = Object.keys(SERIES_IMAGES).sort(
      (a, b) => b.length - a.length
    );
    for (const key of sortedKeys) {
      if (titleLower.includes(key.toLowerCase())) {
        return SERIES_IMAGES[key];
      }
    }
  }
  return CATEGORY_FALLBACKS[release.category] || null;
}

function getTypeIcon(type) {
  const t = (type || '').toLowerCase();
  if (t.includes('game') || t.includes('album') || t.includes('concert'))
    return <FaFire />;
  if (t.includes('premiere') || t.includes('movie')) return <FaClock />;
  return <FaCalendarAlt />;
}

export default function ReleaseRow({ release: r }) {
  const [hovered, setHovered] = useState(false);

  const date = new Date(r.date);
  const now = new Date();
  const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
  const isPast = daysLeft < 0;
  const color = catColors[r.category] || '#e11d48';
  const catName = catNames[r.category] || r.category;
  const bgImage = getImageForRelease(r);
  const showBanner = hovered && bgImage;

  const dateStr = r.date.replace(/-/g, '');
  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(r.title)}` +
    `&dates=${dateStr}/${dateStr}` +
    `&details=${encodeURIComponent(
      `${r.type} — ${catName} release on FandomVerse`
    )}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        background: '#151518',
        border: `1px solid ${
          showBanner ? `${color}88` : 'rgba(255, 255, 255, 0.06)'
        }`,
        borderRadius: 14,
        overflow: 'hidden',
        opacity: isPast ? 0.7 : 1,
        transition:
          'border-color 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s ease',
        boxShadow: showBanner ? `0 8px 30px ${color}22` : 'none',
      }}
    >
      {/* Banner background */}
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
            opacity: showBanner ? 0.4 : 0,
            transform: showBanner ? 'scale(1.06)' : 'scale(1)',
            transition:
              'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'opacity, transform',
          }}
        />
      )}

      {/* Overlay */}
      {bgImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(21,21,24,0.97) 0%, rgba(21,21,24,0.85) 45%, rgba(21,21,24,0.35) 100%)',
            opacity: showBanner ? 1 : 0,
            transition: 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            pointerEvents: 'none',
            zIndex: 0,
            willChange: 'opacity',
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          padding: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        {/* Date block */}
        <div
          style={{
            flexShrink: 0,
            width: 68,
            textAlign: 'center',
            padding: '10px 0',
            borderRadius: 12,
            background: `${color}15`,
            border: `1px solid ${color}55`,
            color: color,
            fontFamily: 'Orbitron, sans-serif',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.12em',
              fontWeight: 700,
              opacity: 0.95,
            }}
          >
            {date
              .toLocaleDateString('en-US', { month: 'short' })
              .toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: '2px 0',
            }}
          >
            {date.getDate()}
          </div>
          <div style={{ fontSize: 9, opacity: 0.75 }}>
            {date.getFullYear()}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 6,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: color,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                textShadow: showBanner ? '0 1px 6px rgba(0,0,0,0.8)' : 'none',
                transition: 'text-shadow 0.4s ease',
              }}
            >
              {getTypeIcon(r.type)} {r.type}
            </span>
            <span
              style={{
                fontSize: 9,
                padding: '3px 8px',
                borderRadius: 4,
                background: `${color}22`,
                border: `1px solid ${color}55`,
                color: color,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontFamily: 'Orbitron, sans-serif',
              }}
            >
              {catName}
            </span>
          </div>

          <div
            style={{
              fontSize: 16,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              color: '#f5f5f5',
              marginBottom: 6,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
              textShadow: showBanner ? '0 2px 8px rgba(0,0,0,0.9)' : 'none',
              transition: 'text-shadow 0.4s ease',
            }}
          >
            {r.title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 12,
              color: '#a0a0a0',
              fontFamily: 'Space Grotesk, sans-serif',
              flexWrap: 'wrap',
              textShadow: showBanner ? '0 1px 6px rgba(0,0,0,0.8)' : 'none',
              transition: 'text-shadow 0.4s ease',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: isPast ? '#a8a8a8' : daysLeft <= 7 ? '#fda4af' : '#a0a0a0',
                fontWeight: daysLeft <= 7 && !isPast ? 600 : 400,
              }}
            >
              <FaClock style={{ fontSize: 10 }} />
              {isPast
                ? `${Math.abs(daysLeft)} days ago`
                : daysLeft === 0
                ? 'Today'
                : daysLeft === 1
                ? 'Tomorrow'
                : `in ${daysLeft} days`}
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                color: '#a8a8a8',
              }}
            >
              <FaCalendarAlt style={{ fontSize: 10 }} />
              {date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Right actions */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 8,
            flexShrink: 0,
          }}
        >
          {!isPast && (
            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 12px',
                borderRadius: 8,
                background: showBanner
                  ? `${color}33`
                  : 'rgba(255,255,255,0.04)',
                border: `1px solid ${
                  showBanner ? `${color}77` : 'rgba(255,255,255,0.08)'
                }`,
                color: showBanner ? color : '#a0a0a0',
                fontSize: 11,
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
              }}
              title="Add to Google Calendar"
            >
              <FaCalendarAlt style={{ fontSize: 10 }} />
              <span style={{ display: 'inline' }}>Add to calendar</span>
            </a>
          )}

          <Link
            to={`/category/${r.category}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 12px',
              borderRadius: 8,
              background: showBanner
                ? `${color}55`
                : 'rgba(255,255,255,0.06)',
              border: `1px solid ${
                showBanner ? color : 'rgba(255,255,255,0.1)'
              }`,
              color: showBanner ? '#fff' : '#cbd5e1',
              fontSize: 11,
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}
          >
            View {catName}
            <FaArrowRight style={{ fontSize: 9 }} />
          </Link>
        </div>
      </div>
    </div>
  );
}