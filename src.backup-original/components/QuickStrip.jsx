import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSeriesImage } from '../hooks/useImages';

function StripItem({ item }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const imgUrl = useSeriesImage(item.series || item.category, item.category);

  const linkTo =
    item.linkType === 'trailer'
      ? `/category/${item.category}`
      : `/content/${item.id}`;

  return (
    <Link
      to={linkTo}
      style={{
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        padding: '8px',
        borderRadius: 8,
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = 'transparent')
      }
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          overflow: 'hidden',
          background: '#0f0f12',
          flexShrink: 0,
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {imgUrl && !errored && (
          <img
            src={imgUrl}
            alt=""
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.4s',
            }}
          />
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            color: '#e0e0e0',
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            marginBottom: 3,
          }}
        >
          {item.title || item.name}
        </div>
        <div
          style={{
            fontSize: 9,
            color: '#a8a8a8',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 600,
          }}
        >
          {item.series || item.category}
        </div>
      </div>
    </Link>
  );
}

export default function QuickStrip({ title, items = [], limit = 5 }) {
  const list = items.slice(0, limit);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            width: 3,
            height: 14,
            borderRadius: 2,
            background: 'linear-gradient(180deg, #dc2626, #f97316)',
          }}
        />
        <h3
          style={{
            fontSize: 12,
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            color: '#f5f5f5',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          {title}
        </h3>
        <span
          style={{
            fontSize: 10,
            color: '#a8a8a8',
            fontFamily: 'Space Grotesk, sans-serif',
            marginLeft: 'auto',
          }}
        >
          {list.length} items
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {list.map((item) => (
          <StripItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}