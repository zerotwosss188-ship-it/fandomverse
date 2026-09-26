import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaYoutube, FaExternalLinkAlt, FaClock, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import SmartImage from './SmartImage';
import { useBookmark } from '../hooks/useBookmark';
import { FaStickyNote } from 'react-icons/fa';
import NotesModal from './NotesModal';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

const typeLabels = {
  episode: 'Episode',
  movie: 'Movie',
  clip: 'Clip',
  special: 'Special',
  gameplay: 'Gameplay',
  mv: 'Music Video',
  essay: 'Video Essay',
  review: 'Review',
  bts: 'Behind the Scenes',
  'full-season': 'Full Season',
};

export default function VideoCard({ video, index = 0 }) {
  const [playing, setPlaying] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);  

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: video.id,
    title: video.title,
    type: 'video',
    category: video.category,
    image: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
  });

  const color = catColors[video.category] || '#e11d48';
  const typeLabel = typeLabels[video.type] || video.type;

  const thumbUrl = `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -3 }}
      style={{
        background: '#151518',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.2s ease',
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')
      }
    >
      {/* Video player / thumbnail */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          background: '#0f0f12',
          overflow: 'hidden',
        }}
      >
        {playing ? (
          <>
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={video.title}
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
                position: 'absolute', bottom: 10, right: 10, zIndex: 3,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 6,
                background: 'rgba(0,0,0,0.75)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#f5f5f5', fontSize: 11,
                fontFamily: 'Space Grotesk, sans-serif',
                textDecoration: 'none', backdropFilter: 'blur(8px)',
              }}
            >
              Open on YouTube <FaExternalLinkAlt style={{ fontSize: 9 }} />
            </a>
          </>
        ) : (
          <>
            <SmartImage
              src={thumbUrl}
              fallbackSrc={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
              alt={video.title}
              loadingText="Loading"
              showLoadingText={true}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
              }}
            />

            <div
              style={{
                position: 'absolute', inset: 0,
                background:
                  'linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.7) 100%)',
                pointerEvents: 'none', zIndex: 2,
              }}
            />

            <button
              onClick={() => setPlaying(true)}
              aria-label={`Play ${video.title}`}
              style={{
                position: 'absolute', inset: 0, display: 'grid',
                placeItems: 'center', background: 'transparent',
                cursor: 'pointer', border: 'none', zIndex: 3,
              }}
            >
              <span
                onMouseEnter={(e) =>
                  (e.currentTarget.style.boxShadow =
                    '0 8px 26px rgba(225, 29, 72, 0.6)')
                }
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'none')}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e11d48, #a855f7)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  fontSize: 20,
                  boxShadow: 'none',
                  paddingLeft: 4,
                  transition: 'box-shadow 0.25s ease',
                }}
              >
                <FaPlay />
              </span>
            </button>

            {/* Type badge (top-left) */}
            <span
              style={{
                position: 'absolute', top: 10, left: 10,
                fontSize: 9, padding: '4px 10px', borderRadius: 5,
                background: 'rgba(10,10,10,0.85)',
                border:
                  video.type === 'full-season'
                    ? '1px solid rgba(225, 29, 72, 0.6)'
                    : `1px solid ${color}66`,
                color: video.type === 'full-season' ? '#fda4af' : color,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontWeight: 700, fontFamily: 'Orbitron, sans-serif',
                backdropFilter: 'blur(8px)', zIndex: 4,
              }}
            >
              {video.type === 'full-season'
                ? `FULL SEASON · ${video.episodeCount || '?'} EP`
                : typeLabel}
            </span>

            {/* Bookmark button (top-right) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleBookmark(e);
              }}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
              style={{
                position: 'absolute', top: 10, right: 10,
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(10,10,10,0.85)',
                border: `1px solid ${
                  bookmarked ? 'rgba(251, 191, 36, 0.6)' : 'rgba(225, 29, 72, 0.4)'
                }`,
                color: bookmarked ? '#fbbf24' : '#fda4af',
                display: 'grid', placeItems: 'center',
                cursor: 'pointer', fontSize: 11,
                backdropFilter: 'blur(8px)', zIndex: 5,
              }}
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>

                        {/* Note button (bottom-left) */}
                        <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setNotesOpen(true);
              }}
              aria-label="Add note"
              title="Add personal note"
              style={{
                position: 'absolute',
                bottom: 10,
                left: 10,
                width: 28,
                height: 28,
                borderRadius: 6,
                background: 'rgba(10,10,10,0.85)',
                border: '1px solid rgba(251,191,36,0.4)',
                color: '#fbbf24',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                fontSize: 11,
                backdropFilter: 'blur(8px)',
                zIndex: 5,
              }}
            >
              <FaStickyNote />
            </button>

            {/* Duration badge (bottom-right) */}
            {video.duration && (
              <span
                style={{
                  position: 'absolute', bottom: 10, right: 10,
                  fontSize: 11, padding: '3px 8px', borderRadius: 4,
                  background: 'rgba(0,0,0,0.85)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#f5f5f5',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600, letterSpacing: '0.02em',
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  backdropFilter: 'blur(8px)', zIndex: 4,
                }}
              >
                <FaClock style={{ fontSize: 9, opacity: 0.8 }} />
                {video.duration}
              </span>
            )}
          </>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {video.series && (
          <div
            style={{
              fontSize: 10, color,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700, marginBottom: 6,
            }}
          >
            {video.series}
            {video.season && video.episodeNumber && (
              <span style={{ color: '#7d7d7d', marginLeft: 8 }}>
                · S{video.season}E{video.episodeNumber}
              </span>
            )}
          </div>
        )}

        <h3
          style={{
            fontSize: 14, fontFamily: 'Orbitron, sans-serif',
            fontWeight: 600, color: '#f5f5f5', lineHeight: 1.35,
            marginBottom: 8, letterSpacing: '0.01em',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {video.title}
        </h3>

        <div
          style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', gap: 8, marginTop: 'auto',
            paddingTop: 10,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: 11, color: '#7d7d7d',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          <span
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              overflow: 'hidden', textOverflow: 'ellipsis',
              whiteSpace: 'nowrap', maxWidth: '65%',
            }}
          >
            <FaYoutube style={{ color: '#ff0000', fontSize: 11, flexShrink: 0 }} />
            {video.channel}
          </span>
          <span style={{ flexShrink: 0 }}>
            {new Date(video.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            })}
          </span>
        </div>
      </div>
      </motion.div>
      <NotesModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        itemId={video.id}
        itemTitle={video.title}
        itemType="video"
      />
    </>
  );
}
