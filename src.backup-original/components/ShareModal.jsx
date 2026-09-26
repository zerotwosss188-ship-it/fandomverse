import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  FaTimes,
  FaWhatsapp,
  FaEnvelope,
  FaTwitter,
  FaFacebookF,
  FaTelegramPlane,
  FaLink,
  FaCheck,
} from 'react-icons/fa';

export default function ShareModal({ open, onClose, title, text, url }) {
  const [copied, setCopied] = useState(false);

  const shareText = text || title || 'Check out this on FandomVerse';
  const shareUrl =
    url ||
    (typeof window !== 'undefined' ? window.location.href : '');

  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(shareUrl);
  const combined = encodeURIComponent(`${shareText}\n\n${shareUrl}`);

  const options = [
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: <FaWhatsapp />,
      color: '#25D366',
      href: `https://wa.me/?text=${combined}`,
    },
    {
      id: 'email',
      label: 'Email',
      icon: <FaEnvelope />,
      color: '#ea4335',
      href: `mailto:?subject=${encodedText}&body=${combined}`,
    },
    {
      id: 'twitter',
      label: 'Twitter / X',
      icon: <FaTwitter />,
      color: '#1DA1F2',
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
    },
    {
      id: 'facebook',
      label: 'Facebook',
      icon: <FaFacebookF />,
      color: '#1877F2',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      icon: <FaTelegramPlane />,
      color: '#0088cc',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* fallback */
    }
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
            background: 'rgba(0,0,0,0.75)',
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
            onClick={(e) => e.stopPropagation()}
            className="fv-modal-inner"
            style={{
              width: '100%',
              maxWidth: 420,
              background: '#151518',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: 24,
              position: 'relative',
            }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 14,
                right: 14,
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#f5f5f5',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              <FaTimes />
            </button>

            <h2
              style={{
                fontSize: 18,
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                color: '#f5f5f5',
                marginBottom: 6,
              }}
            >
              Share
            </h2>
            <p
              style={{
                fontSize: 12,
                color: '#a0a0a0',
                marginBottom: 20,
                fontFamily: 'Space Grotesk, sans-serif',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title || 'Share this page'}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 10,
                marginBottom: 16,
              }}
            >
              {options.map((opt) => (
                <a
                  key={opt.id}
                  href={opt.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                    padding: '14px 8px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    textDecoration: 'none',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = `${opt.color}66`;
                    e.currentTarget.style.background = `${opt.color}11`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      'rgba(255,255,255,0.06)';
                    e.currentTarget.style.background =
                      'rgba(255,255,255,0.02)';
                  }}
                >
                  <span
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: `${opt.color}22`,
                      border: `1px solid ${opt.color}55`,
                      color: opt.color,
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: 16,
                    }}
                  >
                    {opt.icon}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: '#e5e5e5',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    {opt.label}
                  </span>
                </a>
              ))}
            </div>

            <button
              onClick={handleCopy}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 10,
                color: '#cbd5e1',
                fontSize: 12,
                fontFamily: 'Space Grotesk, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(220,38,38,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              {copied ? <FaCheck style={{ color: '#34d399' }} /> : <FaLink />}
              <span style={{ flex: 1, textAlign: 'left' }}>
                {copied ? 'Link copied!' : 'Copy link'}
              </span>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}