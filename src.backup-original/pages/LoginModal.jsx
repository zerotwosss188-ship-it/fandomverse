import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FaTimes, FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginModal({ open, onClose }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [success, setSuccess] = useState(false);

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
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(10px)',
            zIndex: 500,
            display: 'grid',
            placeItems: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 400,
              background: '#151518',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 18,
              padding: 32,
              position: 'relative',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.6)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#a8a8a8',
                fontSize: 16,
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                padding: 4,
                display: 'grid',
                placeItems: 'center',
              }}
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <h2
              style={{
                fontSize: 20,
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                color: '#f5f5f5',
                marginBottom: 6,
                letterSpacing: '0.01em',
              }}
            >
              {mode === 'login' ? 'Welcome back' : 'Join FandomVerse'}
            </h2>
            <p style={{ fontSize: 13, color: '#a0a0a0', marginBottom: 24 }}>
              Demo only — no real authentication.
            </p>

            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
            >
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

              <button
                type="submit"
                className="fv-btn fv-btn-primary"
                style={{
                  marginTop: 8,
                  padding: 12,
                  width: '100%',
                  fontWeight: 600,
                }}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            {success && (
              <div
                style={{
                  marginTop: 14,
                  padding: 10,
                  background: 'rgba(52, 211, 153, 0.08)',
                  border: '1px solid rgba(52, 211, 153, 0.25)',
                  borderRadius: 8,
                  color: '#34d399',
                  fontSize: 13,
                  textAlign: 'center',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                ✓ {mode === 'login' ? 'Signed in' : 'Account created'} (demo)
              </div>
            )}

            <div
              style={{
                marginTop: 20,
                textAlign: 'center',
                fontSize: 13,
                color: '#a0a0a0',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {mode === 'login' ? "Don't have an account? " : 'Already have one? '}
              <button
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                style={{
                  color: '#fca5a5',
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  padding: 0,
                }}
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
          color: '#a8a8a8',
          fontSize: 13,
          display: 'grid',
          placeItems: 'center',
          pointerEvents: 'none',
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
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 10,
          color: '#f5f5f5',
          fontSize: 14,
          outline: 'none',
          fontFamily: 'Space Grotesk, sans-serif',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
      />
    </div>
  );
}