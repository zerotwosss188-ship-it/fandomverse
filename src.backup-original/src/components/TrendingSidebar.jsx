import { Link } from 'react-router-dom';
import SmartImage from './SmartImage';
import { useLegalImage } from '../hooks/useLegalImage';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

function getLocalBanner(series) {
  if (!series) return null;
  const slug = series.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `/images/banners/${slug}.jpg`;
}

function TrendingItem({ item, rank }) {
  // ⭐ KEEP API fetch
  const { url: dynamicImage } = useLegalImage(
    item.category,
    item.title,
    item.series,
    item.image
  );

  const finalImage = dynamicImage || item.image;
  const color = catColors[item.category] || '#dc2626';

  return (
    <Link
      to={`/content/${item.id}`}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: '10px 8px',
        borderRadius: 10,
        textDecoration: 'none',
        color: 'inherit',
      }}
    >
      <span
        style={{
          fontSize: 22,
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 800,
          color: rank <= 3 ? '#dc2626' : '#3a3a3a',
          minWidth: 26,
          textAlign: 'center',
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        {rank}
      </span>

      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          overflow: 'hidden',
          background: '#0f0f12',
          flexShrink: 0,
          border: '1px solid rgba(255, 255, 255, 0.04)',
          position: 'relative',
        }}
      >
        <SmartImage
          src={finalImage}
          alt=""
          showLoadingText={false}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 13,
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            color: '#e8e8e8',
            lineHeight: 1.3,
            marginBottom: 3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10 }}>
          <span
            style={{
              color: color,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 700,
              fontFamily: 'Orbitron, sans-serif',
            }}
          >
            {item.category}
          </span>
          <span style={{ color: '#a8a8a8' }}>♥ {item.popularity}</span>
        </div>
      </div>
    </Link>
  );
}

export default function TrendingSidebar({ items = [], limit = 8 }) {
  const ranked = [...items]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);

  if (ranked.length === 0) return null;

  return (
    <div
      style={{
        background: '#151518',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 16,
        padding: 20,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <h3
          style={{
            fontSize: 14,
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            color: '#f5f5f5',
            letterSpacing: '0.04em',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span
            style={{
              width: 3,
              height: 16,
              borderRadius: 2,
              background: 'linear-gradient(180deg, #dc2626, #f97316)',
            }}
          />
          Trending
        </h3>
        <Link to="/search" style={{ fontSize: 11, color: '#a8a8a8', fontFamily: 'Space Grotesk, sans-serif' }}>
          View all
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {ranked.map((item, i) => (
          <TrendingItem key={item.id} item={item} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}