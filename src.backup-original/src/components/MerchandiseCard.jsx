import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaShoppingCart,
  FaStickyNote,
  FaBookmark,
  FaRegBookmark,
} from 'react-icons/fa';
import NotesModal from './NotesModal';
import SmartImage from './SmartImage';
import { useBookmark } from '../hooks/useBookmark';
import MerchandiseDetailModal from './MerchandiseDetailModal';

// Deterministic numeric seed from item.id so each product gets a unique photo
function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % 100000;
}

export default function MerchandiseCard({ item, index = 0, onAdd }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);   // ⭐ ADD

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('fv_cart') || '[]');
    const existing = cart.find((c) => c.id === item.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });
    localStorage.setItem('fv_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('fv-cart-update'));
  };

  // ⭐ Local image priority → picsum fallback
  const seed = hashStr(item.id || item.name || '');
  const imgUrl =
    item.image || `https://picsum.photos/seed/fv-${seed}/600/450`;

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: item.id,
    title: item.name,
    type: 'merchandise',
    category: item.category,
    image: imgUrl,
  });

  return (
    <>
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ y: -3 }}
        onClick={() => setDetailOpen(true)}
        style={{
          background: '#151518',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 14,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          transition: 'border-color 0.2s ease',
          cursor: 'pointer',   // ⭐ ADD
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')
        }
      >
        {/* Image header */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '4 / 3',
            background: item.image
              ? 'radial-gradient(circle at center, #1a1a1f 0%, #0f0f12 100%)'
              : '#0f0f12',
            overflow: 'hidden',
          }}
        >
          <SmartImage
            src={imgUrl}
            alt={item.name}
            loadingText="Loading"
            showLoadingText={true}
            style={{
              width: '100%',
              height: '100%',
              opacity: 0.95,
              objectFit: item.image ? 'contain' : 'cover',
              objectPosition: 'center',
              padding: item.image ? 12 : 0,
            }}
          />

          {/* Dark gradient overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, rgba(21,21,24,0.15) 0%, rgba(21,21,24,0.55) 60%, rgba(21,21,24,0.98) 100%)',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Type badge */}
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontSize: 9,
              padding: '3px 8px',
              borderRadius: 4,
              background: 'rgba(10,10,10,0.75)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#f5f5f5',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: 'Orbitron, sans-serif',
              backdropFilter: 'blur(8px)',
              zIndex: 3,
            }}
          >
            {item.type}
          </span>

          {/* Bookmark + Note buttons */}
          <div
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 6,
              zIndex: 3,
            }}
          >
                        <button
              onClick={(e) => {
                e.stopPropagation();
                toggleBookmark(e);
              }}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(10,10,10,0.7)',
                border: `1px solid ${
                  bookmarked
                    ? 'rgba(251,191,36,0.6)'
                    : 'rgba(220,38,38,0.4)'
                }`,
                color: bookmarked ? '#fbbf24' : '#fca5a5',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                fontSize: 11,
                backdropFilter: 'blur(8px)',
              }}
              title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotesOpen(true);
              }}
              aria-label="Add note"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'rgba(10,10,10,0.7)',
                border: '1px solid rgba(251,191,36,0.4)',
                color: '#fbbf24',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                fontSize: 11,
                backdropFilter: 'blur(8px)',
              }}
              title="Add personal note"
            >
              <FaStickyNote />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          style={{
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: '#a8a8a8',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 600,
            }}
          >
            {item.series || item.category}
          </div>

          <h3
            style={{
              fontSize: 15,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              color: '#f5f5f5',
              lineHeight: 1.3,
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            {item.name}
          </h3>

          <p
            style={{
              fontSize: 12,
              color: '#a0a0a0',
              lineHeight: 1.5,
              margin: 0,
              fontFamily: 'Space Grotesk, sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              flex: 1,
            }}
          >
            {item.description}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 8,
              paddingTop: 12,
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 800,
                color: '#f5f5f5',
                letterSpacing: '0.01em',
              }}
            >
              ${item.price}
            </span>
            <button
  onClick={(e) => {
    e.stopPropagation();
    onAdd({ ...item, image: imgUrl });
  }}
  className="fv-btn fv-btn-primary"
              style={{
                padding: '7px 14px',
                fontSize: 12,
                gap: 6,
                fontWeight: 600,
              }}
            >
              <FaShoppingCart style={{ fontSize: 10 }} /> Add
            </button>
          </div>
        </div>
      </motion.div>
      
      <MerchandiseDetailModal
        item={item}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        onAdd={(i) => onAdd({ ...i, image: imgUrl })}
      />
      
      <NotesModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        itemId={item.id}
        itemTitle={item.name}
        itemType="merchandise"
      />
    </>
  );
}