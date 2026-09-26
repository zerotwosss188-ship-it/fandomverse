import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStickyNote, FaTimes, FaSave } from 'react-icons/fa';

export default function NotesModal({ open, onClose, itemId, itemTitle, itemType }) {
  const key = `fv_note_${itemType}_${itemId}`;
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (open) {
      setNote(sessionStorage.getItem(key) || '');
      setSaved(false);
    }
  }, [open, key]);

  const save = () => {
    sessionStorage.setItem(key, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const clear = () => {
    sessionStorage.removeItem(key);
    setNote('');
    setSaved(false);
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
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 500,
            display: 'grid',
            placeItems: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: 'rgba(10, 13, 24, 0.98)',
              border: '1px solid rgba(225,29,72,0.3)',
              borderRadius: 18,
              padding: 28,
              position: 'relative',
              boxShadow:
                '0 20px 60px rgba(0,0,0,0.6), 0 0 60px rgba(225,29,72,0.2)',
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#8a94ad',
                fontSize: 18,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
              }}
            >
              <FaTimes />
            </button>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 8,
              }}
            >
              <FaStickyNote style={{ color: '#fbbf24', fontSize: 18 }} />
              <span
                style={{
                  fontSize: 13,
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#fbbf24',
                  letterSpacing: '0.1em',
                }}
              >
                PERSONAL NOTE
              </span>
            </div>

            <div
              style={{
                fontSize: 12,
                color: '#fda4af',
                marginBottom: 4,
                textTransform: 'capitalize',
              }}
            >
              {itemType}
            </div>
            <h3
              style={{
                fontSize: 15,
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 600,
                color: '#e8ecf5',
                lineHeight: 1.4,
                marginBottom: 6,
              }}
            >
              {itemTitle}
            </h3>
            <p style={{ fontSize: 11, color: '#6b7590', marginBottom: 18 }}>
              Session only — cleared when you close the browser tab.
            </p>

            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Jot down your thoughts..."
              rows={5}
              style={{
                width: '100%',
                padding: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(225,29,72,0.25)',
                borderRadius: 10,
                color: '#e8ecf5',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                resize: 'vertical',
                lineHeight: 1.6,
              }}
            />

            <div
              style={{
                display: 'flex',
                gap: 10,
                marginTop: 14,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={save}
                className="fv-btn fv-btn-primary"
                style={{ gap: 8, padding: '9px 18px', fontSize: 13 }}
              >
                <FaSave /> Save Note
              </button>
              <button
                onClick={clear}
                className="fv-btn fv-btn-ghost"
                style={{
                  padding: '9px 18px',
                  fontSize: 13,
                  color: '#f87171',
                  borderColor: 'rgba(248,113,113,0.3)',
                }}
              >
                Clear
              </button>
              {saved && (
                <span style={{ fontSize: 12, color: '#34d399' }}>
                  ✓ Saved
                </span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}