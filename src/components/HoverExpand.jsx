import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useLegalImage } from '../hooks/useLegalImage';

export default function HoverExpand({
  items = [],
  orientation = 'horizontal',
  height = 500,
  activeIndex: controlledIndex,
  onActiveIndexChange,
  defaultActiveIndex = 0,
}) {
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReduced = useReducedMotion();
  const isControlled = controlledIndex !== undefined;
  const activeIndex = isControlled ? controlledIndex : internalIndex;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const setActive = (idx) => {
    if (!isControlled) setInternalIndex(idx);
    onActiveIndexChange?.(idx);
  };

  const effectiveOrientation = isMobile ? 'vertical' : orientation;
  const isHorizontal = effectiveOrientation === 'horizontal';

  return (
    <div
      role="group"
      aria-label="Expandable panels"
      style={{
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        gap: isMobile ? 16 : 12,
        width: '100%',
        height: isHorizontal ? height : 'auto',
      }}
    >
      {items.map((item, idx) => (
        <Panel
          key={item.id ?? idx}
          item={item}
          idx={idx}
          isActive={isMobile ? true : idx === activeIndex}
          setActive={setActive}
          prefersReduced={prefersReduced}
          isHorizontal={isHorizontal}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
}

function Panel({
  item,
  idx,
  isActive,
  setActive,
  prefersReduced,
  isHorizontal,
  isMobile,
}) {
  const navigate = useNavigate();

  const { url: dynamicImage } = useLegalImage(
    item.category,
    item.series || item.title,
    item.series,
    item.image
  );

  const finalImage = dynamicImage || item.image;

  const handleClick = () => {
    if (isMobile) {
      // On mobile, always navigate since all panels are active
      if (item.path) navigate(item.path);
    } else if (isActive) {
      // On desktop, only the active (expanded) panel navigates
      if (item.path) navigate(item.path);
    } else {
      // Inactive panel — first click just expands it
      setActive(idx);
    }
  };

  return (
    <motion.button
      type="button"
      aria-label={item.title}
      aria-pressed={isActive}
      onMouseEnter={() => !prefersReduced && !isMobile && setActive(idx)}
      onFocus={() => setActive(idx)}
      onClick={handleClick}
      animate={{
        flexGrow: isActive ? 4 : 1,
        flexBasis: isActive
          ? isHorizontal
            ? '40%'
            : 'auto'
          : isHorizontal
          ? '12%'
          : 'auto',
      }}
      transition={
        prefersReduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 220, damping: 30 }
      }
      style={{
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        border: isActive
          ? '1px solid rgba(225, 29, 72, 0.6)'
          : '1px solid rgba(225, 29, 72, 0.15)',
        background: item.bg || 'rgba(15, 23, 42, 0.85)',
        boxShadow: isActive
          ? '0 20px 60px rgba(225, 29, 72, 0.35), inset 0 0 80px rgba(225, 29, 72, 0.15)'
          : '0 4px 20px rgba(0, 0, 0, 0.3)',
        minWidth: isHorizontal ? 100 : 'auto',
        minHeight: isHorizontal ? 'auto' : isMobile ? 240 : 100,
        width: isMobile ? '100%' : 'auto',
        padding: 0,
        textAlign: 'left',
        color: 'inherit',
        fontFamily: 'inherit',
        transition: 'border 0.3s, box-shadow 0.3s',
        outline: 'none',
      }}
    >
      {/* Background image */}
      {finalImage && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${finalImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isActive ? 0.95 : 0.7,
            transform: isActive ? 'scale(1.06)' : 'scale(1.02)',
            transition: 'opacity 0.6s ease, transform 0.8s ease',
            filter: isActive
              ? 'saturate(1.05) brightness(0.9)'
              : 'saturate(0.75) brightness(0.55)',
            willChange: 'transform, opacity',
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: isActive
            ? 'linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.72) 35%, rgba(10,10,10,0.3) 65%, rgba(10,10,10,0.05) 100%)'
            : 'linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.7) 60%, rgba(10,10,10,0.85) 100%)',
          pointerEvents: 'none',
          transition: 'background 0.4s ease',
        }}
      />

      {/* Bottom vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, transparent 60%, rgba(10,10,10,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Inactive vertical title (desktop only) */}
      {!isActive && isHorizontal && !isMobile && (
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            left: '50%',
            transform: 'translateX(-50%) rotate(-90deg)',
            transformOrigin: 'center',
            whiteSpace: 'nowrap',
            fontSize: 14,
            letterSpacing: '0.14em',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            color: '#f5f5f5',
            textTransform: 'uppercase',
            textShadow: '0 2px 12px rgba(0,0,0,0.9)',
          }}
        >
          {item.title}
        </div>
      )}

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          padding: isMobile ? 20 : 22,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 10,
          }}
          transition={{
            duration: prefersReduced ? 0 : 0.3,
            delay: isActive ? 0.15 : 0,
          }}
          style={{ pointerEvents: isActive ? 'auto' : 'none' }}
        >
          {/* Count */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 10,
              fontSize: 11,
              color: '#a8a8a8',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#a855f7',
              }}
            />
            {item.count || 'Explore'}
          </div>

          {/* Tag */}
          {item.tag && (
            <div
              style={{
                fontSize: 11,
                color: '#fda4af',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: 8,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {item.tag}
            </div>
          )}

          {/* Title */}
          <div
            style={{
              fontSize: isMobile ? 20 : 22,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#fff',
              marginBottom: 8,
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            }}
          >
            {item.title}
          </div>

          {/* Description */}
          {item.description && (
            <div
              style={{
                fontSize: isMobile ? 12 : 13,
                lineHeight: 1.6,
                color: '#cbd5e1',
                maxWidth: 380,
                fontFamily: 'Space Grotesk, sans-serif',
                display: '-webkit-box',
                WebkitLineClamp: isMobile ? 3 : 4,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {item.description}
            </div>
          )}

          {/* CTA */}
          {item.cta && (
            <div
              style={{
                marginTop: 14,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#c4b5fd',
                fontWeight: 500,
              }}
            >
              {item.cta} →
            </div>
          )}
        </motion.div>
      </div>
    </motion.button>
  );
}