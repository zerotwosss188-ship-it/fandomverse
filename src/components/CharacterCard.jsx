import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStickyNote, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import NotesModal from './NotesModal';
import SmartImage from './SmartImage';
import { useCharacterImage, useSeriesImage } from '../hooks/useImages';
import { useBookmark } from '../hooks/useBookmark';

function getLocalBanner(series) {
  if (!series) return null;
  const slug = series.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `/images/banners/${slug}.jpg`;
}

export default function CharacterCard({ char, index = 0 }) {
  const [notesOpen, setNotesOpen] = useState(false);

  // ⭐ KEEP API fetch
  const characterImg = useCharacterImage(char.name, char.series, char.category);
  const seriesImg = useSeriesImage(char.series, char.category);
  const localBanner = getLocalBanner(char.series);

  // Final image priority: API → local banner
  const imgUrl = characterImg || seriesImg || localBanner;

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: char.id,
    title: char.name,
    type: 'character',
    category: char.category,
    image: imgUrl,
  });

  const initials = char.name.split(' ').map((w) => w[0]).slice(0, 2).join('');

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
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: '1 / 1',
            background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.18), rgba(168, 85, 247, 0.08))',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute', inset: 0,
              display: 'grid', placeItems: 'center',
              fontSize: 48, fontWeight: 800,
              fontFamily: 'Orbitron, sans-serif',
              color: 'rgba(255,255,255,0.15)',
            }}
          >
            {initials}
          </div>

          <SmartImage
            src={imgUrl}
            fallbackSrc={localBanner}
            alt={char.name}
            objectPosition="center top"
            loadingText="Loading"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
            }}
          />

          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 45%, rgba(21,21,24,0.9) 85%, rgba(21,21,24,0.98) 100%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, zIndex: 2 }}>
            <button
              onClick={toggleBookmark}
              aria-label="Bookmark"
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(10, 10, 10, 0.7)',
                border: `1px solid ${bookmarked ? 'rgba(251, 191, 36, 0.6)' : 'rgba(225, 29, 72, 0.4)'}`,
                color: bookmarked ? '#fbbf24' : '#fda4af',
                display: 'grid', placeItems: 'center',
                cursor: 'pointer', fontSize: 11, backdropFilter: 'blur(8px)',
              }}
            >
              {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
            </button>
            <button
              onClick={() => setNotesOpen(true)}
              aria-label="Note"
              style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'rgba(10, 10, 10, 0.7)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                color: '#fbbf24',
                display: 'grid', placeItems: 'center',
                cursor: 'pointer', fontSize: 11, backdropFilter: 'blur(8px)',
              }}
            >
              <FaStickyNote />
            </button>
          </div>

          <span
            style={{
              position: 'absolute', top: 12, left: 12,
              fontSize: 9, padding: '3px 8px', borderRadius: 4,
              background: 'rgba(10,10,10,0.75)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#cbd5e1',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontWeight: 700, fontFamily: 'Orbitron, sans-serif',
              backdropFilter: 'blur(8px)',
              maxWidth: 'calc(100% - 80px)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              zIndex: 2,
            }}
          >
            {char.series}
          </span>

          <div style={{ position: 'absolute', left: 14, right: 14, bottom: 12, zIndex: 2 }}>
            <h3
              style={{
                fontSize: 16, fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700, color: '#ffffff', margin: 0,
                textShadow: '0 2px 12px rgba(0,0,0,0.7)',
              }}
            >
              {char.name}
            </h3>
          </div>
        </div>

        <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p
            style={{
              fontSize: 12, color: '#a0a0a0', lineHeight: 1.5,
              fontFamily: 'Space Grotesk, sans-serif', margin: 0,
              display: '-webkit-box', WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}
          >
            {char.bio}
          </p>

          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {char.traits?.slice(0, 3).map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 999,
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#a0a0a0',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      <NotesModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        itemId={char.id}
        itemTitle={char.name}
        itemType="character"
      />
    </>
  );
}