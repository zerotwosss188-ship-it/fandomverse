export default function FilterChips({
    label,
    options,
    value,
    onChange,
    color = '#f97316',
    countFn,
  }) {
    if (!options || options.length === 0) return null;
  
    return (
      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 18,
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
              marginRight: 6,
            }}
          >
            {label}
          </span>
        )}
        {options.map((opt) => {
          const isActive = value === opt.id;
          const count = countFn ? countFn(opt.id) : null;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              style={{
                padding: '6px 12px',
                fontSize: 12,
                borderRadius: 8,
                background: isActive
                  ? 'rgba(249, 115, 22, 0.18)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isActive
                  ? '1px solid rgba(249, 115, 22, 0.8)'
                  : '1px solid rgba(249, 115, 22, 0.3)',
                color: isActive ? '#fdba74' : '#a0a0a0',
                cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                textTransform: opt.capitalize ? 'capitalize' : 'none',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                  e.currentTarget.style.color = '#fdba74';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.3)';
                  e.currentTarget.style.color = '#a0a0a0';
                }
              }}
            >
              {opt.label}
              {count !== null && (
                <span style={{ opacity: 0.7, marginLeft: 5 }}>({count})</span>
              )}
            </button>
          );
        })}
      </div>
    );
  }