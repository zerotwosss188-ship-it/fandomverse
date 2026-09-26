import { useState, useEffect } from 'react';
import { FaPlay, FaYoutube } from 'react-icons/fa';

const THUMB_QUALITIES = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];

function useYouTubeThumbnail(youtubeId) {
  const [thumbUrl, setThumbUrl] = useState(null);
  const [thumbFailed, setThumbFailed] = useState(false);

  useEffect(() => {
    if (!youtubeId) {
      setThumbFailed(true);
      return;
    }
    let cancelled = false;
    setThumbUrl(null);
    setThumbFailed(false);

    const tryQuality = (index) => {
      if (cancelled) return;
      if (index >= THUMB_QUALITIES.length) {
        setThumbFailed(true);
        return;
      }
      const url = `https://img.youtube.com/vi/${youtubeId}/${THUMB_QUALITIES[index]}.jpg`;
      const probe = new Image();
      probe.onload = () => {
        if (cancelled) return;
        // YouTube serves a 120x90 gray placeholder when the video doesn't
        // have that resolution — treat tiny images as failures.
        if (probe.naturalWidth <= 120) {
          tryQuality(index + 1);
        } else {
          setThumbUrl(url);
        }
      };
      probe.onerror = () => {
        if (!cancelled) tryQuality(index + 1);
      };
      probe.src = url;
    };

    tryQuality(0);

    return () => {
      cancelled = true;
    };
  }, [youtubeId]);

  return { thumbUrl, thumbFailed };
}

export default function ArticleTrailer({ trailer }) {
  const [playing, setPlaying] = useState(false);
  const { thumbUrl, thumbFailed } = useYouTubeThumbnail(trailer?.youtubeId);

  if (!trailer) return null;

  const watchUrl = `https://www.youtube.com/watch?v=${trailer.youtubeId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${trailer.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div
      style={{
        marginTop: 0,
        paddingTop: 0,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            width: 3,
            height: 16,
            borderRadius: 2,
            background: 'linear-gradient(180deg, #dc2626, #f97316)',
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            color: '#f5f5f5',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Watch Trailer
        </span>
        {trailer.title && (
          <span
            style={{
              fontSize: 12,
              color: '#a8a8a8',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            · {trailer.title}
          </span>
        )}
      </div>

      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          borderRadius: 12,
          overflow: 'hidden',
          background: '#0f0f12',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {playing ? (
          <>
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={trailer.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              style={{ border: 0, position: 'absolute', inset: 0 }}
            />
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: 'absolute',
                bottom: 10,
                right: 10,
                zIndex: 3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 6,
                background: 'rgba(0,0,0,0.75)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#f5f5f5',
                fontSize: 11,
                fontFamily: 'Space Grotesk, sans-serif',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
              }}
            >
              Open on YouTube
            </a>
          </>
        ) : (
          <>
            {/* Thumbnail */}
            {thumbUrl && (
              <img
                src={thumbUrl}
                alt={trailer.title}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}

            {/* Fallback gradient if no thumbnail */}
            {(thumbFailed || !thumbUrl) && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(220,38,38,0.35), rgba(249,115,22,0.15))',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fca5a5',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(20px, 4vw, 40px)',
                  letterSpacing: '0.08em',
                }}
              >
                ▶
              </div>
            )}

            {/* Dark gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.6) 100%)',
                pointerEvents: 'none',
              }}
            />

            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              aria-label="Play trailer"
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'transparent',
                cursor: 'pointer',
                border: 'none',
              }}
            >
              <span
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #dc2626, #f97316)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  fontSize: 22,
                  boxShadow: '0 10px 30px rgba(220, 38, 38, 0.6)',
                  transition: 'transform 0.2s',
                  paddingLeft: 4,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = 'scale(1.08)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = 'scale(1)')
                }
              >
                <FaPlay />
              </span>
            </button>

            {/* YouTube badge */}
            <span
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 10px',
                borderRadius: 6,
                background: 'rgba(10,10,10,0.75)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#a0a0a0',
                fontSize: 10,
                fontFamily: 'Space Grotesk, sans-serif',
                backdropFilter: 'blur(8px)',
              }}
            >
              <FaYoutube style={{ color: '#ff0000', fontSize: 11 }} /> YouTube
            </span>
          </>
        )}
      </div>
    </div>
  );
}