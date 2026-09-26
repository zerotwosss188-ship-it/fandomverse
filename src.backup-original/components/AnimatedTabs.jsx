import { motion } from 'framer-motion';
import { useId } from 'react';

export default function AnimatedTabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pill', // 'pill' | 'underline' | 'segment'
  size = 'md',       // 'sm' | 'md' | 'lg'
  fullWidth = false,
}) {
  const layoutId = useId();

  const paddingMap = {
    sm: '7px 14px',
    md: '10px 20px',
    lg: '13px 26px',
  };
  const fontSizeMap = { sm: 12, md: 14, lg: 15 };

  const padding = paddingMap[size];
  const fontSize = fontSizeMap[size];

  return (
    <div
      style={{
        display: fullWidth ? 'flex' : 'inline-flex',
        width: fullWidth ? '100%' : 'auto',
        gap: variant === 'segment' ? 4 : 6,
        padding: variant === 'pill' ? 6 : variant === 'segment' ? 4 : 0,
        borderRadius: variant === 'underline' ? 0 : 12,
        background:
          variant === 'pill'
            ? 'rgba(10, 13, 24, 0.6)'
            : variant === 'segment'
            ? 'rgba(10, 13, 24, 0.8)'
            : 'transparent',
        border:
          variant === 'underline'
            ? 'none'
            : '1px solid rgba(220, 38, 38, 0.15)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            style={{
              position: 'relative',
              padding,
              fontSize,
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#fff' : '#8a94ad',
              borderRadius: variant === 'underline' ? 0 : 8,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 0.25s ease',
              flex: fullWidth ? 1 : 'none',
              whiteSpace: 'nowrap',
              zIndex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            {/* Animated background */}
            {isActive && variant !== 'underline' && (
              <motion.div
                layoutId={`tabs-bg-${layoutId}`}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 32,
                }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 8,
                  background:
                    'linear-gradient(135deg, #dc2626, #f97316)',
                  boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
                  zIndex: -1,
                }}
              />
            )}

            {/* Underline variant */}
            {isActive && variant === 'underline' && (
              <motion.div
                layoutId={`tabs-line-${layoutId}`}
                transition={{
                  type: 'spring',
                  stiffness: 380,
                  damping: 32,
                }}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: -1,
                  height: 2,
                  borderRadius: 2,
                  background:
                    'linear-gradient(90deg, #dc2626, #f97316)',
                  boxShadow: '0 0 12px rgba(220, 38, 38, 0.6)',
                }}
              />
            )}

            {/* Icon + label */}
            {tab.icon && <span style={{ fontSize: fontSize + 2 }}>{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}