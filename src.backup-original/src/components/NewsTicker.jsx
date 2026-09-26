import { FaFire } from 'react-icons/fa';

const defaultNews = [
  { tag: 'ANIME', text: 'Demon Slayer S4 announced — arrives Spring 2026' },
  { tag: 'GAMING', text: 'GTA VI trailer breaks records with 200M views in 24h' },
  { tag: 'MOVIES', text: 'Dune Part Three starts filming this winter' },
  { tag: 'K-POP', text: 'BTS reunion world tour dates leaked' },
  { tag: 'TV', text: 'Stranger Things final season premiere date revealed' },
  { tag: 'MANGA', text: 'One Piece enters final saga after 28 years' },
  { tag: 'COMICS', text: 'Marvel announces new X-Men relaunch lineup' },
  { tag: 'ANIME', text: 'Jujutsu Kaisen movie confirmed for late 2026' },
];

export default function NewsTicker({ items = defaultNews, speed = 100 }) {
  const loop = [...items, ...items];

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        width: '100%',
        overflow: 'hidden',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(14px)',
        height: 46,
      }}
    >
      {/* LIVE badge */}
      <div
        style={{
          flexShrink: 0,
          padding: '0 20px',
          marginRight: 20,
          background: 'linear-gradient(135deg, #dc2626, #f97316)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Orbitron, sans-serif',
          letterSpacing: '0.15em',
          color: '#fff',
          boxShadow: '4px 0 20px rgba(220, 38, 38, 0.35)',
          zIndex: 2,
        }}
      >
        <FaFire /> LIVE
      </div>

      {/* Scrolling area */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Fade edges */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 24,
            background: 'linear-gradient(90deg, rgba(10,10,10,0.9), transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 24,
            background: 'linear-gradient(270deg, rgba(10,10,10,0.9), transparent)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Track */}
        <div
          style={{
            display: 'flex',
            gap: 110,
            animation: `fv-ticker ${speed}s linear infinite`,
            whiteSpace: 'nowrap',
            width: 'max-content',
            paddingLeft: 40,
            paddingRight: 40,
          }}
        >
          {loop.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 14,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  padding: '4px 10px',
                  borderRadius: 4,
                  background: getTagColor(item.tag),
                  color: '#fff',
                  fontFamily: 'Orbitron, sans-serif',
                }}
              >
                {item.tag}
              </span>
              <span style={{ color: '#e2e8f0' }}>{item.text}</span>
              <span
                style={{
                  color: '#dc2626',
                  fontSize: 10,
                  opacity: 0.7,
                  marginLeft: 6,
                }}
              >
                ◆
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fv-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}

function getTagColor(tag) {
  const colors = {
    ANIME: 'linear-gradient(135deg, #f472b6, #db2777)',
    GAMING: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    MOVIES: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    TV: 'linear-gradient(135deg, #34d399, #059669)',
    'K-POP': 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    COMICS: 'linear-gradient(135deg, #f87171, #dc2626)',
    MANGA: 'linear-gradient(135deg, #22d3ee, #0891b2)',
  };
  return colors[tag] || 'linear-gradient(135deg, #dc2626, #f97316)';
}