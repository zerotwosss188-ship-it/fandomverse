import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  FaTimes,
  FaShoppingCart,
  FaBookmark,
  FaRegBookmark,
  FaStickyNote,
} from 'react-icons/fa';
import { useBookmark } from '../hooks/useBookmark';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h) % 100000;
}

export default function MerchandiseDetailModal({ item, open, onClose, onAdd }) {
  const [qty, setQty] = useState(1);

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: item?.id,
    title: item?.name,
    type: 'merchandise',
    category: item?.category,
    image: item ? `https://picsum.photos/seed/fv-${hashStr(item.id)}/600/450` : null,
  });

  // Reset qty when modal opens with a new item
  useEffect(() => {
    if (open) setQty(1);
  }, [open, item?.id]);

  // ESC key closes
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!item) return null;

  const color = catColors[item.category] || '#dc2626';
  const imgUrl = `https://picsum.photos/seed/fv-${hashStr(item.id)}/800/600`;
  const totalPrice = (item.price * qty).toFixed(2);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) onAdd(item);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)',
            zIndex: 600,
            display: 'grid',
            placeItems: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.94, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            className="fv-event-modal"
            style={{
              width: '100%',
              maxWidth: 720,
              maxHeight: '92vh',
              overflow: 'auto',
              background: '#151518',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 18,
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'rgba(10,10,10,0.85)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#f5f5f5',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                fontSize: 14,
                zIndex: 5,
                backdropFilter: 'blur(8px)',
              }}
            >
              <FaTimes />
            </button>

            {/* Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4 / 3',
                background: '#0f0f12',
                overflow: 'hidden',
              }}
            >
              <img
                src={imgUrl}
                alt={item.name}
                loading="eager"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, transparent 55%, rgba(21,21,24,0.9) 100%)',
                  pointerEvents: 'none',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 14,
                  fontSize: 10,
                  padding: '5px 10px',
                  borderRadius: 5,
                  background: 'rgba(10,10,10,0.8)',
                  border: `1px solid ${color}66`,
                  color: color,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontFamily: 'Orbitron, sans-serif',
                  backdropFilter: 'blur(8px)',
                }}
              >
                {item.type}
              </span>
            </div>

            {/* Body */}
            <div style={{ padding: 28 }}>
              <div
                style={{
                  fontSize: 11,
                  color: color,
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {item.series || item.category}
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 800,
                  color: '#f5f5f5',
                  lineHeight: 1.25,
                  marginBottom: 14,
                  letterSpacing: '0.01em',
                }}
              >
                {item.name}
              </h2>

              <p
                style={{
                  fontSize: 14,
                  color: '#cbd5e1',
                  lineHeight: 1.7,
                  marginBottom: 24,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {item.description}
              </p>

              {/* Info grid */}
              <div
                className="fv-event-meta-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 12,
                  marginBottom: 24,
                  padding: 16,
                  background: 'rgba(255,255,255,0.02)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#a8a8a8',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontFamily: 'Orbitron, sans-serif',
                      marginBottom: 4,
                    }}
                  >
                    Category
                  </div>
                  <div style={{ fontSize: 14, color: '#f5f5f5', textTransform: 'capitalize' }}>
                    {item.category}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#a8a8a8',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontFamily: 'Orbitron, sans-serif',
                      marginBottom: 4,
                    }}
                  >
                    Type
                  </div>
                  <div style={{ fontSize: 14, color: '#f5f5f5' }}>{item.type}</div>
                </div>
              </div>

              {/* Price row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  paddingBottom: 20,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#a8a8a8',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontFamily: 'Orbitron, sans-serif',
                      marginBottom: 4,
                    }}
                  >
                    Price
                  </div>
                  <div
                    style={{
                      fontSize: 26,
                      fontFamily: 'Orbitron, sans-serif',
                      fontWeight: 800,
                      color: '#f5f5f5',
                    }}
                  >
                    ${item.price}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#a8a8a8',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontFamily: 'Orbitron, sans-serif',
                      marginBottom: 6,
                      textAlign: 'right',
                    }}
                  >
                    Quantity
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8,
                      padding: 3,
                    }}
                  >
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      style={{
                        width: 30,
                        height: 30,
                        background: 'transparent',
                        border: 'none',
                        color: '#a0a0a0',
                        cursor: 'pointer',
                        fontSize: 16,
                        borderRadius: 6,
                      }}
                    >
                      −
                    </button>
                    <span
                      style={{
                        minWidth: 32,
                        textAlign: 'center',
                        fontFamily: 'Orbitron, sans-serif',
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#f5f5f5',
                      }}
                    >
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      style={{
                        width: 30,
                        height: 30,
                        background: 'transparent',
                        border: 'none',
                        color: '#a0a0a0',
                        cursor: 'pointer',
                        fontSize: 16,
                        borderRadius: 6,
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: '#a8a8a8',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  Total ({qty} item{qty !== 1 ? 's' : ''})
                </span>
                <span
                  style={{
                    fontSize: 20,
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 800,
                    color: '#fbbf24',
                  }}
                >
                  ${totalPrice}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button
                  onClick={handleAdd}
                  className="fv-btn fv-btn-primary"
                  style={{
                    flex: 1,
                    minWidth: 180,
                    gap: 8,
                    padding: '12px 20px',
                    fontWeight: 600,
                  }}
                >
                  <FaShoppingCart style={{ fontSize: 12 }} /> Add {qty} to Cart
                </button>

                <button
                  onClick={toggleBookmark}
                  className="fv-btn fv-btn-ghost"
                  style={{
                    gap: 8,
                    padding: '12px 20px',
                    color: bookmarked ? '#fbbf24' : undefined,
                    borderColor: bookmarked ? 'rgba(251,191,36,0.5)' : undefined,
                  }}
                >
                  {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                  {bookmarked ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}