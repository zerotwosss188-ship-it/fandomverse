import { useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaArrowRight } from 'react-icons/fa';
import SmartImage from './SmartImage';
import { useLegalImage } from '../hooks/useLegalImage';

const CAT_COLORS = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

const CAT_NAMES = {
  anime: 'Anime',
  gaming: 'Gaming',
  movies: 'Movies',
  'tv-shows': 'TV Shows',
  kpop: 'K-Pop',
  comics: 'Comics',
  manga: 'Manga',
};

// ------------------------------------------------------------
// Per-series variant tracking
// Ensures same-series articles get DIFFERENT API images.
// ------------------------------------------------------------
const seriesAssignments = new Map();
const itemVariantCache = new Map();

function getVariant(item) {
  if (!item?.id) return 0;
  if (itemVariantCache.has(item.id)) return itemVariantCache.get(item.id);

  const key = `${item.category}:${item.series || item.title}`;
  const arr = seriesAssignments.get(key) || [];
  const variant = arr.length;
  arr.push(item.id);
  seriesAssignments.set(key, arr);
  itemVariantCache.set(item.id, variant);
  return variant;
}

function RowCard({ item }) {
  const color = CAT_COLORS[item.category] || '#e11d48';

  const variantIndex = useMemo(() => getVariant(item), [item.id]);

  // ⭐ API fetch — with variantIndex so same-series items get different images
  const { url: legalImage } = useLegalImage(
    item.category,
    item.title,
    item.series,
    item.image,
    variantIndex
  );

  // Fallback chain: unique API image → unique local image → series banner
  const finalImage = legalImage || item.image || item.banner;

  return (
    <Link
      to={
        item._kind === 'character' || item._kind === 'trailer'
          ? `/category/${item.category}`
          : `/content/${item.id}`
      }
      style={{
        flexShrink: 0,
        width: 200,
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
      }}
    >
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 5',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#0f0f12',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: 10,
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')
        }
      >
        <SmartImage
          src={finalImage}
          fallbackSrc={item.banner || item.image}
          alt={item.title}
          loadingText="Loading"
          style={{ width: '100%', height: '100%' }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 45%, rgba(11,11,14,0.95) 100%)',
            pointerEvents: 'none',
          }}
        />

<span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontSize: 9,
            padding: '3px 8px',
            borderRadius: 4,
            background: 'rgba(10,10,10,0.85)',
            border: `1px solid ${
              item._kind === 'character'
                ? 'rgba(34,211,238,0.5)'
                : item._kind === 'trailer'
                ? 'rgba(225,29,72,0.5)'
                : `${color}66`
            }`,
            color:
              item._kind === 'character'
                ? '#22d3ee'
                : item._kind === 'trailer'
                ? '#fda4af'
                : color,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: 'Orbitron, sans-serif',
            backdropFilter: 'blur(8px)',
            zIndex: 2,
          }}
        >
          {item._kind === 'character' ? 'Character' : item.type}
        </span>
      </div>

      <h4
        style={{
          fontSize: 13,
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 600,
          color: '#f5f5f5',
          lineHeight: 1.3,
          marginBottom: 4,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {item.title}
      </h4>
      <div
        style={{
          fontSize: 10,
          color: '#a8a8a8',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })}
      </div>
    </Link>
  );
}

export default function CategoryRow({ category, items = [], limit = 10 }) {
  const scrollRef = useRef(null);
  const color = CAT_COLORS[category] || '#e11d48';
  const name = CAT_NAMES[category] || category;
  const list = items.slice(0, limit);

  if (list.length === 0) return null;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    const amount = 640;
    scrollRef.current.scrollBy({
      left: dir === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="fv-container" style={{ padding: '0 24px 48px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 3, height: 20, borderRadius: 2, background: color }} />
          <h2
            style={{
              fontSize: 16,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              color: '#f5f5f5',
              margin: 0,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            {name}
          </h2>
          <span style={{ fontSize: 11, color: '#a8a8a8', fontFamily: 'Space Grotesk, sans-serif' }}>
            {list.length} items
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#a0a0a0',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: 11,
            }}
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#a0a0a0',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: 11,
            }}
          >
            <FaChevronRight />
          </button>
          <Link
            to={`/category/${category}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#a0a0a0',
              fontSize: 12,
              fontFamily: 'Space Grotesk, sans-serif',
              textDecoration: 'none',
            }}
          >
            View all <FaArrowRight style={{ fontSize: 9 }} />
          </Link>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="fv-cat-row-scroll"
        style={{
          display: 'flex',
          gap: 14,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          paddingBottom: 8,
        }}
      >
        {list.map((item) => (
          <RowCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}