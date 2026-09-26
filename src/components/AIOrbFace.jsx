import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AIOrbFace({
  state = 'idle',
  size = 96,
  gaze = true,
  'aria-label': ariaLabel,
}) {
  const ref = useRef(null);
  const prefersReduced = useReducedMotion();
  const [gazeOffset, setGazeOffset] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  // Blink loop
  useEffect(() => {
    if (prefersReduced) return;
    let cancelled = false;
    const loop = () => {
      if (cancelled) return;
      const delay = 2200 + Math.random() * 3200;
      setTimeout(() => {
        if (cancelled) return;
        setBlink(true);
        setTimeout(() => {
          if (cancelled) return;
          setBlink(false);
          if (Math.random() < 0.15) {
            setTimeout(() => {
              setBlink(true);
              setTimeout(() => setBlink(false), 90);
            }, 140);
          }
          loop();
        }, 110);
      }, delay);
    };
    loop();
    return () => {
      cancelled = true;
    };
  }, [prefersReduced]);

  // Gaze follow
  useEffect(() => {
    if (!gaze || prefersReduced) return;
    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / 40;
      const dy = (e.clientY - cy) / 40;
      setGazeOffset({
        x: Math.max(-4, Math.min(4, dx)),
        y: Math.max(-3, Math.min(3, dy)),
      });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [gaze, prefersReduced]);

  const isThinking = state === 'thinking';
  const isListening = state === 'listening';
  const isStreaming = state === 'streaming';
  const isDone = state === 'done';
  const isError = state === 'error';

  // Eye shapes
  const eyeHeight = blink
    ? 1
    : isThinking
    ? 4
    : isStreaming
    ? 3
    : isListening
    ? 12
    : 8;

  const eyeWidth = isThinking ? 10 : isListening ? 8 : 8;

  const glowColor = isError
    ? '#f87171'
    : isDone
    ? '#34d399'
    : isThinking
    ? '#a78bfa'
    : '#60a5fa';

  return (
    <div
      ref={ref}
      role={ariaLabel ? 'img' : undefined}
      aria-label={ariaLabel}
      aria-hidden={!ariaLabel}
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {/* Breathing orb */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.08, 1] : isThinking ? [1, 0.97, 1] : [1, 1.03, 1],
        }}
        transition={{
          duration: isListening ? 1.2 : isThinking ? 2.4 : 3.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: `radial-gradient(circle at 30% 25%, ${glowColor}55, ${glowColor}15 45%, transparent 70%)`,
          boxShadow: `0 0 24px ${glowColor}66, inset 0 0 32px ${glowColor}33`,
          border: `1.5px solid ${glowColor}88`,
          transition: 'background 0.4s, box-shadow 0.4s, border 0.4s',
        }}
      />

      {/* Face container */}
      <motion.div
        animate={
          isError
            ? { rotate: [0, -6, 6, -4, 0] }
            : isDone
            ? { y: [0, -6, 0] }
            : { rotate: 0, y: 0 }
        }
        transition={{
          duration: isError ? 0.8 : 0.5,
          ease: 'easeInOut',
        }}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: size * 0.12,
        }}
      >
        {/* Left eye */}
        <Eye
          state={state}
          blink={blink}
          eyeWidth={eyeWidth}
          eyeHeight={eyeHeight}
          offsetX={prefersReduced ? 0 : gazeOffset.x}
          offsetY={prefersReduced ? 0 : gazeOffset.y}
          size={size}
          isDone={isDone}
          isError={isError}
        />
        {/* Right eye */}
        <Eye
          state={state}
          blink={blink}
          eyeWidth={eyeWidth}
          eyeHeight={eyeHeight}
          offsetX={prefersReduced ? 0 : gazeOffset.x}
          offsetY={prefersReduced ? 0 : gazeOffset.y}
          size={size}
          isDone={isDone}
          isError={isError}
        />
      </motion.div>

      {/* Mouth */}
      <Mouth state={state} size={size} isDone={isDone} isError={isError} isThinking={isThinking} />
    </div>
  );
}

function Eye({ state, blink, eyeWidth, eyeHeight, offsetX, offsetY, size, isDone, isError }) {
  const eyeBase = size * 0.14;
  const w = (eyeWidth / 8) * eyeBase;
  const h = (eyeHeight / 8) * eyeBase;

  if (isDone) {
    // Happy arc eyes
    return (
      <svg width={w * 1.4} height={h * 1.4} viewBox="0 0 20 20">
        <path
          d="M3 12 Q10 3 17 12"
          stroke="#fee2e2"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (isError) {
    // Spiral eyes
    return (
      <svg width={w * 1.4} height={h * 1.4} viewBox="0 0 20 20">
        <path
          d="M10 10 m0 -5 a5 5 0 1 1 -3 9 a3.5 3.5 0 1 0 2.5 -6 a2 2 0 1 1 -1 3"
          stroke="#fecaca"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <motion.div
      animate={{ x: offsetX, y: offsetY }}
      transition={{ type: 'spring', stiffness: 120, damping: 15 }}
      style={{
        width: w,
        height: h,
        background: '#fee2e2',
        borderRadius: blink ? '50%' : '50%',
        boxShadow: '0 0 8px rgba(224, 242, 254, 0.7)',
        transition: 'height 0.1s, width 0.2s',
      }}
    />
  );
}

function Mouth({ state, size, isDone, isError, isThinking }) {
  const mouthBase = size * 0.18;

  if (isDone) {
    return (
      <svg
        width={mouthBase * 1.6}
        height={mouthBase}
        viewBox="0 0 20 14"
        style={{ position: 'absolute', top: '62%' }}
      >
        <path
          d="M3 3 Q10 15 17 3"
          stroke="#fee2e2"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (isError) {
    return (
      <svg
        width={mouthBase * 1.6}
        height={mouthBase}
        viewBox="0 0 20 14"
        style={{ position: 'absolute', top: '66%' }}
      >
        <path
          d="M3 10 Q7 4 10 8 Q13 12 17 6"
          stroke="#fecaca"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (isThinking) {
    return (
      <div
        style={{
          position: 'absolute',
          top: '66%',
          width: mouthBase * 0.6,
          height: 3,
          borderRadius: 3,
          background: '#fee2e2',
          transform: 'translateX(-25%)',
          opacity: 0.85,
        }}
      />
    );
  }

  // Idle / streaming / listening - small smile
  return (
    <svg
      width={mouthBase * 1.2}
      height={mouthBase * 0.7}
      viewBox="0 0 20 12"
      style={{ position: 'absolute', top: '64%' }}
    >
      <path
        d="M4 3 Q10 10 16 3"
        stroke="#fee2e2"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}