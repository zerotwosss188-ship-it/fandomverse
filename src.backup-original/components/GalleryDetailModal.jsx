import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaStar,
} from 'react-icons/fa';
import { getSeriesImage, getSeriesInfo } from '../lib/imageService';
import { useData } from '../hooks/useData';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

export default function GalleryDetailModal({
  item,
  index,
  total,
  onClose,
  onNavigate,
}) {
  const [imgUrl, setImgUrl] = useState(null);
  const [info, setInfo] = useState(null);
  const { data: charData } = useData('characters');

  useEffect(() => {
    if (!item) return;
    let cancelled = false;
    setInfo(null);
  
    if (item.image) {
      setImgUrl(item.image);
    } else {
      setImgUrl(null);
      getSeriesImage(item.series, item.category).then((url) => {
        if (!cancelled) setImgUrl(url);
      });
    }
  
    getSeriesInfo(item.series, item.category).then((data) => {
      if (!cancelled) setInfo(data);
    });
  
    return () => {
      cancelled = true;
    };
  }, [item]);

  // Keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onNavigate(index - 1);
      if (e.key === 'ArrowRight') onNavigate(index + 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, onClose, onNavigate]);

  if (!item) return null;

  const color = catColors[item.category] || '#dc2626';

  const seriesChars = charData?.characters?.filter(
    (c) => c.series === item.series && c.category === item.category
  ) || [];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(16px)',
          zIndex: 600,
          display: 'grid',
          placeItems: 'center',
          padding: 20,
        }}
      >
        {/* Prev / Next */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index - 1);
          }}
          aria-label="Previous"
          style={{
            position: 'absolute',
            left: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f5f5f5',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(index + 1);
          }}
          aria-label="Next"
          style={{
            position: 'absolute',
            right: 20,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#f5f5f5',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          <FaChevronRight />
        </button>

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.96, y: 16 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="fv-gallery-modal"
          style={{
            width: '100%',
            maxWidth: 900,
            maxHeight: '90vh',
            overflowY: 'auto',
            background: '#151518',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 18,
            position: 'relative',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
          }}
        >
          {/* Close */}
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
              background: 'rgba(10,10,10,0.7)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#f5f5f5',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: 13,
              zIndex: 3,
              backdropFilter: 'blur(8px)',
            }}
          >
            <FaTimes />
          </button>

          {/* Hero image */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              background: '#0f0f12',
              overflow: 'hidden',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
            }}
          >
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={item.caption}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, #0f0f12 0%, #1a1a1e 50%, #0f0f12 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'fv-skeleton 1.5s ease-in-out infinite',
                }}
              />
            )}

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(10,10,10,0.3) 0%, transparent 30%, rgba(10,10,10,0.9) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Counter */}
            <span
              style={{
                position: 'absolute',
                top: 14,
                left: 14,
                fontSize: 11,
                padding: '5px 10px',
                borderRadius: 6,
                background: 'rgba(10,10,10,0.75)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#cbd5e1',
                fontFamily: 'Space Grotesk, sans-serif',
                backdropFilter: 'blur(8px)',
              }}
            >
              {index + 1} / {total}
            </span>
          </div>

          {/* Body */}
          <div style={{ padding: '24px 28px 32px' }}>
            {/* Category + title */}
            <div style={{ marginBottom: 18 }}>
              <span
                style={{
                  fontSize: 10,
                  padding: '4px 10px',
                  borderRadius: 5,
                  background: `${color}22`,
                  border: `1px solid ${color}55`,
                  color: color,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontFamily: 'Orbitron, sans-serif',
                  display: 'inline-block',
                  marginBottom: 12,
                }}
              >
                {item.category}
              </span>
              <h2
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  margin: 0,
                  marginBottom: 8,
                  letterSpacing: '0.01em',
                }}
              >
                {item.series}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: '#a0a0a0',
                  margin: 0,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {item.caption}
              </p>
            </div>

            {/* Meta row */}
            {info && (
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  marginBottom: 20,
                  flexWrap: 'wrap',
                  fontSize: 12,
                  color: '#a0a0a0',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {info.year && (
                  <span>
                    <span style={{ color: '#a8a8a8' }}>Year: </span>
                    {info.year}
                  </span>
                )}
                {info.score && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <FaStar style={{ color: '#fbbf24', fontSize: 11 }} />
                    <span style={{ color: '#f5f5f5', fontWeight: 600 }}>
                      {info.score}
                    </span>
                    <span style={{ color: '#a8a8a8' }}>/100</span>
                  </span>
                )}
                {info.genres?.length > 0 && (
                  <span style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {info.genres.slice(0, 4).map((g) => (
                      <span
                        key={g}
                        style={{
                          fontSize: 10,
                          padding: '3px 9px',
                          borderRadius: 4,
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#a0a0a0',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {g}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            )}

            {/* Description */}
            {info?.description && (
              <p
                style={{
                  fontSize: 14,
                  color: '#cbd5e1',
                  lineHeight: 1.75,
                  marginBottom: 24,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {info.description}
              </p>
            )}

            {/* Characters */}
            {seriesChars.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: '#a8a8a8',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontFamily: 'Orbitron, sans-serif',
                    marginBottom: 12,
                  }}
                >
                  Characters
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fill, minmax(180px, 1fr))',
                    gap: 8,
                  }}
                >
                  {seriesChars.slice(0, 8).map((c) => (
                    <div
                      key={c.id}
                      style={{
                        padding: 12,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 4,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontFamily: 'Orbitron, sans-serif',
                          fontWeight: 600,
                          color: '#f5f5f5',
                          lineHeight: 1.3,
                        }}
                      >
                        {c.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#a8a8a8',
                          fontFamily: 'Space Grotesk, sans-serif',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          lineHeight: 1.4,
                        }}
                      >
                        {c.bio}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link
                to={`/category/${item.category}`}
                className="fv-btn fv-btn-primary"
                style={{
                  gap: 8,
                  padding: '11px 20px',
                  fontSize: 13,
                  fontWeight: 600,
                  flex: 1,
                  justifyContent: 'center',
                  minWidth: 180,
                }}
              >
                Browse {item.series} content
                <FaExternalLinkAlt style={{ fontSize: 10 }} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}