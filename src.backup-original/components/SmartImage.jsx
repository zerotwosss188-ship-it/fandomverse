import { useState, useEffect } from 'react';

export default function SmartImage({
  src,
  fallbackSrc,
  alt = '',
  loading = 'lazy',
  className,
  style = {},
  objectFit = 'cover',
  objectPosition = 'center',
  loadingText = 'Loading',
  showLoadingText = true,
}) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setErrored(false);
  }, [src]);

  const showRedText = showLoadingText && !loaded;

  const handleError = () => {
    const s = currentSrc || '';

    // ⭐ YouTube maxresdefault often 404s → try hqdefault (always exists)
    if (s.includes('maxresdefault.jpg')) {
      setCurrentSrc(s.replace('maxresdefault.jpg', 'hqdefault.jpg'));
      setLoaded(false);
      return;
    }
    if (s.includes('sddefault.jpg')) {
      setCurrentSrc(s.replace('sddefault.jpg', 'hqdefault.jpg'));
      setLoaded(false);
      return;
    }

    // ⭐ Then try explicit fallback (local banner etc.)
    if (fallbackSrc && s !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setLoaded(false);
      return;
    }

    setErrored(true);
  };

  return (
    <>
      {showRedText && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              color: '#dc2626',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textShadow: '0 0 12px rgba(220, 38, 38, 0.9)',
              animation: 'fv-loading-pulse 1.5s ease-in-out infinite',
            }}
          >
            ⏳ {loadingText}
          </div>
        </div>
      )}

      {currentSrc && !errored && (
        <img
          key={currentSrc}
          src={currentSrc}
          alt={alt}
          loading={loading}
          decoding="async"
          className={className}
          onLoad={() => setLoaded(true)}
          onError={handleError}
          style={{
            ...style,
            objectFit,
            objectPosition,
            opacity: loaded ? (style.opacity ?? 1) : 0,
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        />
      )}
    </>
  );
}