import { useState, useRef, useEffect } from 'react';

export default function SortSelect({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {label && (
        <span
          style={{
            fontSize: 10,
            color: '#a8a8a8',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          height: 40,
          padding: '0 34px 0 14px',
          background: open
            ? 'rgba(168, 85, 247, 0.08)'
            : 'rgba(255,255,255,0.04)',
          border: `1px solid ${
            open ? 'rgba(168, 85, 247, 0.7)' : 'rgba(168, 85, 247, 0.3)'
          }`,
          borderRadius: 10,
          color: '#f5f5f5',
          fontSize: 13,
          fontFamily: 'Space Grotesk, sans-serif',
          cursor: 'pointer',
          position: 'relative',
          textAlign: 'left',
          minWidth: 150,
          transition: 'all 0.15s',
        }}
      >
        {current?.label || value}
        <span
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            transform: `translateY(-50%) rotate(${open ? 180 : 0}deg)`,
            transition: 'transform 0.2s',
            color: '#a855f7',
            fontSize: 10,
            lineHeight: 1,
          }}
        >
          ▼
        </span>
      </button>

      {/* Custom dropdown menu */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            right: 0,
            minWidth: 170,
            padding: 6,
            background: '#151518',
            border: '1px solid rgba(168, 85, 247, 0.35)',
            borderRadius: 10,
            boxShadow:
              '0 10px 30px rgba(0,0,0,0.6), 0 0 20px rgba(168, 85, 247, 0.15)',
            zIndex: 50,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {options.map((o) => {
            const isActive = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                style={{
                  textAlign: 'left',
                  padding: '9px 12px',
                  fontSize: 13,
                  borderRadius: 7,
                  background: isActive
                    ? 'rgba(168, 85, 247, 0.18)'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(168, 85, 247, 0.5)'
                    : '1px solid transparent',
                  color: isActive ? '#c4b5fd' : '#d0d0d0',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background =
                      'rgba(168, 85, 247, 0.1)';
                    e.currentTarget.style.color = '#c4b5fd';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#d0d0d0';
                  }
                }}
              >
                {o.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}