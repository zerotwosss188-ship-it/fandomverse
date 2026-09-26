import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginModal({ open, onClose, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);

  // ⭐ Sync mode when modal opens with a different initialMode
  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setForm({ name: '', email: '', password: '' });
      onClose();
    }, 1800);
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
              maxWidth: 400,
              background: 'rgba(10, 13, 24, 0.98)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: 18,
              padding: 32,
              position: 'relative',
              boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 60px rgba(220,38,38,0.2)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#8a94ad',
                fontSize: 18,
                cursor: 'pointer',
              }}
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <h2
              style={{
                fontSize: 22,
                fontFamily: 'Orbitron, sans-serif',
                marginBottom: 6,
                background: 'linear-gradient(90deg, #fca5a5, #fdba74)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {mode === 'login' ? 'Welcome Back' : 'Join FandomVerse'}
            </h2>
            <p style={{ fontSize: 13, color: '#8a94ad', marginBottom: 24 }}>
              Demo only — no real authentication.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mode === 'signup' && (
                <IconInput
                  icon={<FaUser />}
                  placeholder="Full name"
                  value={form.name}
                  onChange={(v) => setForm({ ...form, name: v })}
                  required
                />
              )}
              <IconInput
                icon={<FaEnvelope />}
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
              />
              <IconInput
                icon={<FaLock />}
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
                required
              />

              <button type="submit" className="fv-btn fv-btn-primary" style={{ marginTop: 8, padding: 12 }}>
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {success && (
              <div
                style={{
                  marginTop: 12,
                  padding: 10,
                  background: 'rgba(52,211,153,0.1)',
                  border: '1px solid rgba(52,211,153,0.3)',
                  borderRadius: 8,
                  color: '#34d399',
                  fontSize: 13,
                  textAlign: 'center',
                }}
              >
                ✓ {mode === 'login' ? 'Signed in' : 'Account created'} (demo)
              </div>
            )}

            <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#8a94ad' }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                style={{ color: '#fdba74', textDecoration: 'underline', cursor: 'pointer' }}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function IconInput({ icon, type = 'text', placeholder, value, onChange, required }) {
  return (
    <div style={{ position: 'relative' }}>
      <span
        style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#6b7590',
          fontSize: 13,
        }}
      >
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{
          width: '100%',
          padding: '12px 14px 12px 40px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: 10,
          color: '#fff',
          fontSize: 14,
          outline: 'none',
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      />
    </div>
  );
}