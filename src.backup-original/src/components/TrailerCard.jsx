import { useState } from 'react';
import {
  FaPlay,
  FaYoutube,
  FaExternalLinkAlt,
  FaBookmark,
  FaRegBookmark,
  FaStickyNote,
} from 'react-icons/fa';
import { useBookmark } from '../hooks/useBookmark';
import SmartImage from './SmartImage';
import NotesModal from './NotesModal';

export default function TrailerCard({ trailer, index = 0 }) {
  const [playing, setPlaying] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: trailer.id,
    title: trailer.title,
    type: 'trailer',
    category: trailer.category,
    image: `https://img.youtube.com/vi/${trailer.youtubeId}/hqdefault.jpg`,
  });

  const watchUrl = `https://www.youtube.com/watch?v=${trailer.youtubeId}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${trailer.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  const thumbUrl = `https://img.youtube.com/vi/${trailer.youtubeId}/maxresdefault.jpg`;

  return (
    <>
      <div className="fv-card" style={{ overflow: 'hidden', padding: 0 }}>
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            background: '#000',
            overflow: 'hidden',
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
                  background: 'rgba(0, 0, 0, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#f5f5f5',
                  fontSize: 11,
                  fontFamily: 'Space Grotesk, sans-serif',
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                }}
              >
                Open on YouTube <FaExternalLinkAlt style={{ fontSize: 9 }} />
              </a>
            </>
          ) : (
            <>
              <SmartImage
                src={thumbUrl}
                alt={trailer.title}
                loadingText="Loading"
                showLoadingText={true}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(180deg, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.7) 100%)',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />

              <button
                onClick={() => setPlaying(true)}
                aria-label={`Play ${trailer.title}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'grid',
                  placeItems: 'center',
                  background: 'transparent',
                  cursor: 'pointer',
                  border: 'none',
                  zIndex: 3,
                }}
              >
                <span
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #dc2626, #f97316)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    fontSize: 20,
                    boxShadow: '0 8px 26px rgba(220, 38, 38, 0.6)',
                    paddingLeft: 4,
                  }}
                >
                  <FaPlay />
                </span>
              </button>

              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  display: 'flex',
                  gap: 6,
                  alignItems: 'center',
                  zIndex: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: 'rgba(10, 10, 10, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color:
                      trailer.releaseStatus === 'upcoming'
                        ? '#fbbf24'
                        : '#34d399',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                    fontFamily: 'Orbitron, sans-serif',
                  }}
                >
                  {trailer.releaseStatus === 'upcoming' ? 'Upcoming' : 'Released'}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleBookmark(e);
                  }}
                  aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: 'rgba(10, 10, 10, 0.85)',
                    border: `1px solid ${
                      bookmarked
                        ? 'rgba(251, 191, 36, 0.6)'
                        : 'rgba(220, 38, 38, 0.4)'
                    }`,
                    color: bookmarked ? '#fbbf24' : '#fca5a5',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: 11,
                  }}
                >
                  {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                </button>
              </div>

              <span
                style={{
                  position: 'absolute',
                  bottom: 10,
                  left: 10,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 10,
                  padding: '4px 10px',
                  borderRadius: 6,
                  background: 'rgba(10, 10, 10, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#a0a0a0',
                  fontFamily: 'Space Grotesk, sans-serif',
                  zIndex: 4,
                }}
              >
                <FaYoutube style={{ color: '#ff0000' }} /> YouTube
              </span>

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
                  left: 90,
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: 'rgba(10,10,10,0.75)',
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
            </>
          )}
        </div>

        <div style={{ padding: 16 }}>
          <h3
            style={{
              fontSize: 14,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 600,
              color: '#f5f5f5',
              lineHeight: 1.35,
              marginBottom: 6,
              letterSpacing: '0.01em',
            }}
          >
            {trailer.title}
          </h3>
          <div
            style={{
              fontSize: 11,
              color: '#a8a8a8',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {new Date(trailer.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </div>
        </div>
      </div>

      <NotesModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        itemId={trailer.id}
        itemTitle={trailer.title}
        itemType="trailer"
      />
    </>
  );
}