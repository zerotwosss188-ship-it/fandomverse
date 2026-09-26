import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay } from 'react-icons/fa';
import { useLegalImage } from '../hooks/useLegalImage';
import SmartImage from './SmartImage';

const catNames = {
  anime: 'Anime',
  gaming: 'Gaming',
  movies: 'Movies',
  'tv-shows': 'TV Shows',
  kpop: 'K-Pop',
  comics: 'Comics',
  manga: 'Manga',
};

const GAP = 16;
const AUTOPLAY_MS = 6000;
const SWIPE_VELOCITY = 500;

export default function HeroBanner({ items = [] }) {
  const [index, setIndex] = useState(0);
  const [liveIndex, setLiveIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const draggedRef = useRef(false);

  useLayoutEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const slideWidth = containerWidth;
  const slideStep = slideWidth + GAP;

  useEffect(() => {
    if (items.length <= 1 || isDragging) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [items.length, index, isDragging]);

  if (!items.length) return null;

  const displayIndex = liveIndex ?? index;

  const handleDragStart = () => {
    draggedRef.current = false;
    setIsDragging(true);
    setLiveIndex(index);
  };

  const handleDrag = (_, info) => {
    if (Math.abs(info.offset.x) > 5) draggedRef.current = true;
    const raw = index - info.offset.x / slideStep;
    const nearest = Math.round(Math.max(0, Math.min(items.length - 1, raw)));
    setLiveIndex(nearest);
  };

  const handleDragEnd = (_, info) => {
    const moved = info.offset.x;
    const velocity = info.velocity.x;
    const threshold = slideStep / 4;

    let target = index;
    if (
      (moved < -threshold || velocity < -SWIPE_VELOCITY) &&
      index < items.length - 1
    ) {
      target = index + 1;
    } else if (
      (moved > threshold || velocity > SWIPE_VELOCITY) &&
      index > 0
    ) {
      target = index - 1;
    }

    setIndex(target);
    setLiveIndex(null);
    setIsDragging(false);

    setTimeout(() => {
      draggedRef.current = false;
    }, 60);
  };

  return (
    <div className="fv-container">
      <div
        className="fv-hero-wrapper"
        ref={containerRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 4,
          paddingBottom: 4,
          minHeight: 'calc(clamp(320px, 38vw, 460px) + 40px)',
        }}
      >
        <motion.div
          drag="x"
          dragConstraints={{
            left: -(items.length - 1) * slideStep,
            right: 0,
          }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={{ x: -index * slideStep }}
          transition={{ type: 'spring', stiffness: 280, damping: 34, mass: 0.9 }}
          style={{
            display: 'flex',
            gap: GAP,
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'pan-y',
            userSelect: 'none',
          }}
        >
          {items.map((item, i) => (
            <Slide
              key={item.id}
              item={item}
              width={slideWidth}
              isActive={i === displayIndex}
              draggedRef={draggedRef}
            />
          ))}
        </motion.div>

        {isDragging && liveIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            style={{
              position: 'absolute',
              top: 16,
              right: 24,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(11,17,32,0.92)',
              border: '1px solid rgba(220,38,38,0.35)',
              color: '#fca5a5',
              fontSize: 12,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 600,
              letterSpacing: '0.1em',
              zIndex: 10,
              pointerEvents: 'none',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
            }}
          >
            {liveIndex + 1} / {items.length}
          </motion.div>
        )}

        {items.length > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 6,
              marginTop: 20,
            }}
          >
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === displayIndex ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  background:
                    i === displayIndex
                      ? 'linear-gradient(90deg, #dc2626, #f97316)'
                      : 'rgba(255,255,255,0.18)',
                  transition: isDragging
                    ? 'background 0.15s ease'
                    : 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Slide({ item, width, isActive, draggedRef }) {
  const catName = catNames[item.category] || item.category;

  // ⭐ TMDb image hook — fetches 4K backdrop for movies/TV
  const { url: legalImage } = useLegalImage(
    item.category,
    item.title,
    item.series,
    item.banner || item.image       // ← fallback: item.banner
  );

  const imageUrl = legalImage || item.banner || item.image;

  return (
    <Link
      to={`/content/${item.id}`}
      onClick={(e) => {
        if (draggedRef.current) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      draggable={false}
      className="fv-hero-slide"
      style={{
        flexShrink: 0,
        width,
        height: 'clamp(320px, 38vw, 460px)',
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        background: '#151518',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        textDecoration: 'none',
        color: 'inherit',
        opacity: isActive ? 1 : 0.5,
        transition: 'opacity 0.45s ease',
      }}
    >
      <SmartImage
        src={imageUrl}
        alt={item.title}
        loading="eager"
        loadingText="Loading Hero"
        showLoadingText={true}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.88) 30%, rgba(10,10,10,0.55) 55%, rgba(10,10,10,0.15) 80%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '55%',
          padding: 'clamp(28px, 3.2vw, 52px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: 11,
            padding: '5px 12px',
            borderRadius: 6,
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#f5f5f5',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: 'Orbitron, sans-serif',
            display: 'inline-block',
            alignSelf: 'flex-start',
            marginBottom: 18,
          }}
        >
          {catName}
        </div>

        <h2
          style={{
            fontSize: 'clamp(1.5rem, 2.6vw, 2.4rem)',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.12,
            letterSpacing: '0.005em',
            marginBottom: 16,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textShadow: '0 2px 20px rgba(0,0,0,0.6)',
          }}
        >
          {item.title}
        </h2>

        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={chipStyle}>HD</span>
          <span style={chipStyle}>{item.type}</span>
          <span style={chipStyle}>
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <p
          style={{
            fontSize: 13,
            lineHeight: 1.6,
            color: '#cbd5e1',
            marginBottom: 24,
            fontFamily: 'Space Grotesk, sans-serif',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            maxWidth: 480,
          }}
        >
          {item.excerpt}
        </p>

        <div
          className="fv-btn fv-btn-primary"
          style={{
            padding: '11px 24px',
            fontSize: 13,
            fontWeight: 600,
            alignSelf: 'flex-start',
            gap: 8,
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.45)',
          }}
        >
          <FaPlay style={{ fontSize: 10 }} />
          Read article
        </div>
      </div>
    </Link>
  );
}

const chipStyle = {
  fontSize: 11,
  padding: '4px 10px',
  borderRadius: 6,
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#e2e8f0',
  letterSpacing: '0.05em',
  fontFamily: 'Space Grotesk, sans-serif',
  fontWeight: 500,
  backdropFilter: 'blur(6px)',
};