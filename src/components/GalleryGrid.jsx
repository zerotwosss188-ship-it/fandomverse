import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GalleryDetailModal from './GalleryDetailModal';
import { getSeriesImage } from '../lib/imageService';
import SmartImage from './SmartImage';
import { useBookmark } from '../hooks/useBookmark';
import { FaBookmark, FaRegBookmark, FaStickyNote } from 'react-icons/fa';
import NotesModal from './NotesModal';

function GalleryTile({ item, index, onClick }) {
  const [imgUrl, setImgUrl] = useState(item.image || null);
  const [notesOpen, setNotesOpen] = useState(false);

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: item.id,
    title: item.caption || item.series || 'Gallery',
    type: 'gallery',
    category: item.category,
    image: item.image || null,
  });

  useEffect(() => {
    let cancelled = false;
    if (item.image) {
      setImgUrl(item.image);
    } else {
      getSeriesImage(item.series, item.category).then((url) => {
        if (!cancelled) setImgUrl(url);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [item.series, item.category, item.image]);

  return (
    <>
      <motion.div
        role="button"
        tabIndex={0}
        onClick={() => onClick(index)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(index);
          }
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        style={{
          position: 'relative',
          aspectRatio: '4 / 3',
          borderRadius: 14,
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          cursor: 'pointer',
          padding: 0,
          background: '#0f0f12',
          transition: 'border-color 0.2s ease, transform 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
          e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <SmartImage
          src={imgUrl}
          alt={item.caption}
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
              'linear-gradient(180deg, transparent 45%, rgba(10,10,10,0.95) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            fontSize: 9,
            padding: '3px 8px',
            borderRadius: 4,
            background: 'rgba(10,10,10,0.75)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#f5f5f5',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontWeight: 700,
            fontFamily: 'Orbitron, sans-serif',
            backdropFilter: 'blur(8px)',
            maxWidth: 'calc(100% - 20px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            zIndex: 3,
          }}
        >
          {item.series}
        </span>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(e);
          }}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(10,10,10,0.85)',
            border: `1px solid ${
              bookmarked
                ? 'rgba(251,191,36,0.6)'
                : 'rgba(225,29,72,0.4)'
            }`,
            color: bookmarked ? '#fbbf24' : '#fda4af',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            fontSize: 11,
            backdropFilter: 'blur(8px)',
            zIndex: 4,
          }}
        >
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>

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
            top: 44,
            right: 10,
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: 'rgba(10,10,10,0.85)',
            border: '1px solid rgba(251,191,36,0.4)',
            color: '#fbbf24',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            fontSize: 11,
            backdropFilter: 'blur(8px)',
            zIndex: 4,
          }}
        >
          <FaStickyNote />
        </button>

        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            right: 12,
            textAlign: 'left',
            color: '#e8ecf5',
            fontSize: 13,
            fontFamily: 'Space Grotesk, sans-serif',
            lineHeight: 1.4,
            textShadow: '0 2px 8px rgba(0,0,0,0.9)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            zIndex: 3,
          }}
        >
          {item.caption}
        </div>
      </motion.div>

      <NotesModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        itemId={item.id}
        itemTitle={item.caption || item.series || 'Gallery'}
        itemType="gallery"
      />
    </>
  );
}

export default function GalleryGrid({ images }) {
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const closeLightbox = () => setLightboxIndex(-1);

  const navigate = (idx) => {
    if (!images || images.length === 0) return;
    if (idx < 0) idx = images.length - 1;
    if (idx >= images.length) idx = 0;
    setLightboxIndex(idx);
  };

  if (!images || images.length === 0) {
    return (
      <div
        className="fv-card"
        style={{
          padding: 40,
          textAlign: 'center',
          color: '#a8a8a8',
          background: '#151518',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 14,
          fontSize: 14,
        }}
      >
        No gallery images yet.
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 14,
        }}
      >
        {images.map((img, i) => (
          <GalleryTile
            key={img.id}
            item={img}
            index={i}
            onClick={setLightboxIndex}
          />
        ))}
      </div>

      {lightboxIndex >= 0 && images[lightboxIndex] && (
        <GalleryDetailModal
          item={images[lightboxIndex]}
          index={lightboxIndex}
          total={images.length}
          onClose={closeLightbox}
          onNavigate={navigate}
        />
      )}
    </>
  );
}