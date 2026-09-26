  import { useState, useEffect } from 'react';
  import { Link } from 'react-router-dom';
  import { motion, AnimatePresence } from 'framer-motion';
  import { FaChevronLeft, FaChevronRight, FaFire } from 'react-icons/fa';
  import { useLegalImage } from '../hooks/useLegalImage';
  import SmartImage from './SmartImage';

  const catColors = {
    anime: '#f472b6',
    gaming: '#60a5fa',
    movies: '#fbbf24',
    'tv-shows': '#34d399',
    kpop: '#a78bfa',
    comics: '#f87171',
    manga: '#22d3ee',
  };

  const FIXED_HEIGHT = 340;
  const SLIDE_MS = 8000;

  export default function FeaturedCarousel({ items }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
      if (!items || items.length === 0) return;
      const t = setInterval(() => setIndex((i) => (i + 1) % items.length), SLIDE_MS);
      return () => clearInterval(t);
    }, [items]);

    if (!items || items.length === 0) return null;

    const item = items[index];
    
    const color = catColors[item.category] || '#dc2626';

    const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
    const next = () => setIndex((i) => (i + 1) % items.length);

  const { url: legalImage } = useLegalImage(
    item.category,
    item.title,
    item.series,
    item.banner || item.image
  );

  const imageUrl = legalImage || item.banner || item.image;

    return (
      <div
        className="fv-featured-card"
        style={{
          position: 'relative',
          overflow: 'hidden',
          height: FIXED_HEIGHT,
        }}
      >
        <AnimatePresence>
                    <motion.div
            initial={{ scale: 1.0, x: 0, y: 0 }}
            animate={{ scale: 1.08, x: -10, y: -5 }}
            transition={{ duration: SLIDE_MS / 1000 + 1, ease: 'linear' }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              willChange: 'transform',
            }}
          >
            <SmartImage
              src={imageUrl}
              alt=""
              loading="eager"
              loadingText="Loading Featured"
              showLoadingText={true}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </motion.div>
        </AnimatePresence>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.88) 30%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,0.15) 85%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(135deg, ${color}22, transparent 60%)`,
            pointerEvents: 'none',
            mixBlendMode: 'screen',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.7) 100%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            padding: '36px 44px 100px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
                      <FaFire /> Featured{' '}
          {item._kind === 'trailer' && '· Trailer'}
          {item._kind === 'event' && '· Event'}
          {item._kind === 'article' && `· ${item.category}`}
          </div>

          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${item.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  maxWidth: 640,
                }}
              >
                <h3
                  style={{
                    fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 700,
                    color: '#e8ecf5',
                    marginBottom: 12,
                    lineHeight: 1.2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '2.4em',
                    textShadow: '0 2px 20px rgba(0,0,0,0.7)',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: '#c4cfe0',
                    lineHeight: 1.7,
                    maxWidth: 560,
                    marginBottom: 20,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    minHeight: '3.4em',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {item.excerpt}
                </p>
                <Link
                to={item._linkTo || `/content/${item.id}`}
                className="fv-btn fv-btn-primary"
                style={{ gap: 8, pointerEvents: 'auto' }}
              >
                {item._cta || 'Read Article'} →
              </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 22,
            right: 30,
            display: 'flex',
            gap: 8,
            zIndex: 5,
            pointerEvents: 'auto',
          }}
        >
          <button
            onClick={prev}
            className="fv-btn fv-btn-ghost"
            style={{
              padding: '8px 12px',
              fontSize: 12,
              backdropFilter: 'blur(10px)',
            }}
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={next}
            className="fv-btn fv-btn-ghost"
            style={{
              padding: '8px 12px',
              fontSize: 12,
              backdropFilter: 'blur(10px)',
            }}
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            zIndex: 5,
            pointerEvents: 'auto',
            padding: '6px 12px',
            borderRadius: 999,
            background: 'rgba(10,10,10,0.4)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === index ? 22 : 8,
                height: 8,
                borderRadius: 4,
                background: i === index ? color : 'rgba(255,255,255,0.3)',
                transition: 'width 0.3s ease, background 0.3s ease',
                cursor: 'pointer',
                border: 'none',
                padding: 0,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>
    );
  }