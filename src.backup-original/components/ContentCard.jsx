import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useState, useMemo } from 'react';
import { useBookmark } from '../hooks/useBookmark';
import { useLegalImage } from '../hooks/useLegalImage';
import SmartImage from './SmartImage';

// ------------------------------------------------------------
// Module-level assignment:
// Ensures each article of the same series gets a DIFFERENT variant
// index so the API returns a different image for each.
// Consistent across all pages for the same session.
// ------------------------------------------------------------
const seriesAssignments = new Map(); // "cat:series" -> [itemId, ...]
const itemVariantCache = new Map();  // itemId -> variant

function getVariant(item) {
  if (!item?.id) return 0;
  if (itemVariantCache.has(item.id)) return itemVariantCache.get(item.id);

  const seriesKey = `${item.category}:${item.series || item.title}`;
  const arr = seriesAssignments.get(seriesKey) || [];
  const variant = arr.length;
  arr.push(item.id);
  seriesAssignments.set(seriesKey, arr);
  itemVariantCache.set(item.id, variant);
  return variant;
}

export default function ContentCard({ item, index = 0 }) {
  const [liked, setLiked] = useState(false);

  const variantIndex = useMemo(() => getVariant(item), [item?.id]);

    // Skip API call when this card is rendered inside search results
    const isSearchContext = typeof window !== 'undefined' && window.location.pathname === '/search';

    const { url: legalImage } = useLegalImage(
      isSearchContext ? null : item?.category,   // pass null to skip fetch
      item?.title,
      item?.series,
      item?.image || item?.banner,
      item?.id
    );

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: item?.id,
    title: item?.title,
    type: item?.type || 'article',
    category: item?.category,
    image: legalImage || item?.image || item?.banner,
  });

  if (!item) return null;

  const finalImage = legalImage || item.image || item.banner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link
        to={`/content/${item.id}`}
        className="fv-card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          height: '100%',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <div
          style={{
            position: 'relative',
            height: 180,
            overflow: 'hidden',
            background: '#0a0d18',
          }}
        >
          <SmartImage
            src={finalImage}
            alt={item.title}
            loadingText="Loading"
            style={{ width: '100%', height: '100%' }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, transparent 40%, rgba(5,6,10,0.95) 100%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontSize: 10,
              padding: '4px 10px',
              borderRadius: 6,
              background: 'rgba(5,6,10,0.8)',
              border: '1px solid rgba(220,38,38,0.3)',
              color: '#fca5a5',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              fontFamily: 'Orbitron, sans-serif',
              zIndex: 2,
            }}
          >
            {item.type || 'article'}
          </div>

          <button
            onClick={toggleBookmark}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(5,6,10,0.8)',
              border: `1px solid ${bookmarked ? 'rgba(251,191,36,0.5)' : 'rgba(220,38,38,0.3)'}`,
              display: 'grid',
              placeItems: 'center',
              color: bookmarked ? '#fbbf24' : '#fca5a5',
              cursor: 'pointer',
              fontSize: 13,
              zIndex: 2,
            }}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
          </button>
        </div>

        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
          <h3
            style={{
              fontSize: 16,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.02em',
              color: '#e8ecf5',
              marginBottom: 8,
              lineHeight: 1.35,
            }}
          >
            {item.title}
          </h3>
          <p
            style={{
              fontSize: 13,
              color: '#8a94ad',
              lineHeight: 1.55,
              marginBottom: 14,
              flex: 1,
            }}
          >
            {item.excerpt}
          </p>

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginBottom: 12,
              }}
            >
              {item.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: 10,
                    padding: '3px 8px',
                    borderRadius: 999,
                    background: 'rgba(220, 38, 38, 0.08)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    color: '#fca5a5',
                    fontFamily: 'Space Grotesk, sans-serif',
                    letterSpacing: '0.02em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid rgba(220,38,38,0.1)',
              paddingTop: 12,
            }}
          >
            <span style={{ fontSize: 11, color: '#6b7590' }}>
              {new Date(item.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                setLiked(!liked);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: liked ? '#f472b6' : '#6b7590',
                cursor: 'pointer',
              }}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}
              {item.popularity}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}