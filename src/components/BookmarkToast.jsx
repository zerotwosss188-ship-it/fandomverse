import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaTrash } from 'react-icons/fa';

const MAX_TOASTS = 2; // Sirf 2 toasts max screen pe

export default function BookmarkToast() {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  useEffect(() => {
    const handler = (e) => {
      const { action, title } = e.detail || {};
      const id = Date.now() + Math.random();

      setToasts((prev) => {
        // ⭐ 1. Same title ke purane toasts turant hatao
        let filtered = prev.filter((t) => t.title !== title);

        // ⭐ 2. Agar limit cross ho rahi hai, sabse purane hatao
        if (filtered.length >= MAX_TOASTS) {
          // Purane timeouts clear karo
          const toRemove = filtered.slice(0, filtered.length - MAX_TOASTS + 1);
          toRemove.forEach((t) => {
            const timeout = timeoutsRef.current.get(t.id);
            if (timeout) {
              clearTimeout(timeout);
              timeoutsRef.current.delete(t.id);
            }
          });
          filtered = filtered.slice(-(MAX_TOASTS - 1));
        }

        return [...filtered, { id, action, title }];
      });

      // Auto-dismiss
      const timeout = setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
        timeoutsRef.current.delete(id);
      }, 2400);

      timeoutsRef.current.set(id, timeout);
    };

    window.addEventListener('fv-bookmark-toast', handler);

    return () => {
      window.removeEventListener('fv-bookmark-toast', handler);
      // Cleanup all timeouts on unmount
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current.clear();
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 100,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column-reverse', // Naya toast upar aayega
        gap: 10,
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          const isAdd = toast.action === 'added';
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.8 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
                layout: { duration: 0.2 },
              }}
              style={{
                padding: '12px 20px',
                borderRadius: 999,
                background: 'rgba(15, 15, 18, 0.95)',
                border: `1px solid ${
                  isAdd ? 'rgba(251, 191, 36, 0.5)' : 'rgba(225, 29, 72, 0.5)'
                }`,
                boxShadow: isAdd
                  ? '0 8px 32px rgba(251, 191, 36, 0.35), 0 0 24px rgba(251, 191, 36, 0.2)'
                  : '0 8px 32px rgba(225, 29, 72, 0.35)',
                backdropFilter: 'blur(14px)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 13,
                color: '#f5f5f5',
                fontWeight: 500,
                maxWidth: '90vw',
              }}
            >
              <motion.span
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{
                  delay: 0.1,
                  type: 'spring',
                  stiffness: 500,
                  damping: 15,
                }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  background: isAdd
                    ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                    : 'linear-gradient(135deg, #e11d48, #be123c)',
                  color: '#fff',
                  fontSize: 11,
                  flexShrink: 0,
                }}
              >
                {isAdd ? <FaCheck /> : <FaTrash />}
              </motion.span>

              <span
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {isAdd ? 'Bookmarked!' : 'Removed from Bookmarks'}
              </span>

              {toast.title && (
                <span
                  style={{
                    color: '#a8a8a8',
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: 200,
                  }}
                >
                  · {toast.title}
                </span>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}