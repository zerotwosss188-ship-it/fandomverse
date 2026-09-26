import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useBookmark } from '../hooks/useBookmark';
import {
  FaPlay,
  FaPause,
  FaHeadphones,
  FaMicrophone,
  FaClock,
} from 'react-icons/fa';
import { useSeriesImage } from '../hooks/useImages';
import SmartImage from './SmartImage';
import { FaStickyNote } from 'react-icons/fa';
import NotesModal from './NotesModal';

export default function AudioCard({ audio, index = 0 }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);
  const [notesOpen, setNotesOpen] = useState(false);

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: audio.id,
    title: audio.title,
    type: 'audio',
    category: audio.category,
  });

  const seriesImg = useSeriesImage(audio.series, audio.category);
  const imgUrl = audio.image || seriesImg;

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => {
      if (el.duration) setProgress((el.currentTime / el.duration) * 100);
    };
    const onEnd = () => {
      setPlaying(false);
      setProgress(0);
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('ended', onEnd);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('ended', onEnd);
    };
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      document.querySelectorAll('audio').forEach((a) => {
        if (a !== el) a.pause();
      });
      el.play().catch(() => {});
      setPlaying(true);
    }
  };

  const isInterview = audio.type === 'interview';

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
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
      {/* Image header */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '16 / 9',
          background: '#0f0f12',
          overflow: 'hidden',
        }}
      >
        <SmartImage
          src={imgUrl}
          alt={audio.title}
          loadingText="Loading"
          showLoadingText={true}
          style={{ width: '100%', height: '100%', opacity: 0.9 }}
        />

        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(21,21,24,0.55) 60%, rgba(21,21,24,0.98) 100%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {/* Type badge top-left */}
        <span
          style={{
            position: 'absolute', top: 12, left: 12,
            fontSize: 9, padding: '4px 10px', borderRadius: 5,
            background: isInterview
              ? 'rgba(244, 114, 182, 0.15)'
              : 'rgba(249, 115, 22, 0.15)',
            border: `1px solid ${
              isInterview ? 'rgba(244, 114, 182, 0.5)' : 'rgba(249, 115, 22, 0.5)'
            }`,
            color: isInterview ? '#f472b6' : '#f97316',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            fontWeight: 700, fontFamily: 'Orbitron, sans-serif',
            display: 'inline-flex', alignItems: 'center', gap: 5,
            backdropFilter: 'blur(8px)', zIndex: 3,
          }}
        >
          {isInterview ? <FaMicrophone /> : <FaHeadphones />}
          {audio.type}
        </span>

        {/* Episode + duration top-right */}
        <div
          style={{
            position: 'absolute', top: 12, right: 12,
            display: 'flex', gap: 6, alignItems: 'center', zIndex: 3,
          }}
        >
          <button
            onClick={toggleBookmark}
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'rgba(10,10,10,0.75)',
              border: `1px solid ${bookmarked ? 'rgba(251, 191, 36, 0.6)' : 'rgba(220, 38, 38, 0.4)'}`,
              color: bookmarked ? '#fbbf24' : '#fca5a5',
              display: 'grid', placeItems: 'center',
              cursor: 'pointer', fontSize: 10,
              backdropFilter: 'blur(8px)',
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
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'rgba(10,10,10,0.75)',
              border: '1px solid rgba(251,191,36,0.4)',
              color: '#fbbf24',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: 10,
              backdropFilter: 'blur(8px)',
            }}
          >
            <FaStickyNote />
          </button>
          {audio.episode && (
            <span
              style={{
                fontSize: 9, padding: '4px 8px', borderRadius: 5,
                background: 'rgba(10,10,10,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700, letterSpacing: '0.08em',
                backdropFilter: 'blur(8px)',
              }}
            >
              {audio.episode}
            </span>
          )}
          <span
            style={{
              fontSize: 10, padding: '4px 8px', borderRadius: 5,
              background: 'rgba(10,10,10,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#cbd5e1',
              fontFamily: 'Space Grotesk, sans-serif',
              display: 'inline-flex', alignItems: 'center', gap: 4,
              backdropFilter: 'blur(8px)',
            }}
          >
            <FaClock style={{ fontSize: 9 }} /> {audio.duration}
          </span>
        </div>

        {/* Big play button overlay */}
        <button
          onClick={toggle}
          aria-label={playing ? 'Pause' : 'Play'}
          style={{
            position: 'absolute', bottom: 12, left: 12,
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #dc2626, #f97316)',
            color: '#fff', display: 'grid', placeItems: 'center',
            cursor: 'pointer', border: 'none',
            boxShadow: '0 6px 20px rgba(220, 38, 38, 0.6)',
            fontSize: 16, transition: 'transform 0.2s', zIndex: 3,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {playing ? <FaPause /> : <FaPlay style={{ marginLeft: 3 }} />}
        </button>
      </div>

      {/* Body */}
      <div
        style={{
          padding: 16, display: 'flex',
          flexDirection: 'column', gap: 8, flex: 1,
        }}
      >
        {audio.series && audio.series !== 'Various' && (
          <div
            style={{
              fontSize: 10, color: '#a8a8a8',
              letterSpacing: '0.12em', textTransform: 'uppercase',
              fontFamily: 'Orbitron, sans-serif', fontWeight: 600,
            }}
          >
            {audio.series}
          </div>
        )}

        <h3
          style={{
            fontSize: 15, fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700, color: '#f5f5f5', lineHeight: 1.3,
            margin: 0, letterSpacing: '0.01em',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}
        >
          {audio.title}
        </h3>

        <div
          style={{
            fontSize: 12, color: '#a0a0a0',
            fontFamily: 'Space Grotesk, sans-serif',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <FaMicrophone style={{ fontSize: 10, color: '#a8a8a8' }} />
          {audio.host}
        </div>

        <p
          style={{
            fontSize: 12, color: '#8a8a8a', lineHeight: 1.5,
            margin: 0, fontFamily: 'Space Grotesk, sans-serif',
            display: '-webkit-box', WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1,
          }}
        >
          {audio.description}
        </p>

        <div style={{ marginTop: 4 }}>
          <div
            style={{
              height: 3, borderRadius: 2,
              background: 'rgba(255,255,255,0.06)',
              overflow: 'hidden', position: 'relative',
            }}
          >
            <div
              style={{
                width: `${progress}%`, height: '100%',
                background: 'linear-gradient(90deg, #dc2626, #f97316)',
                borderRadius: 2, transition: 'width 0.2s linear',
              }}
            />
          </div>
          <div
            style={{
              marginTop: 6, display: 'flex',
              justifyContent: 'space-between', fontSize: 10,
              color: '#a8a8a8',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            <span>{playing ? 'Playing' : 'Paused'}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={audio.audioUrl} preload="none" />
    </motion.div>
      <NotesModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        itemId={audio.id}
        itemTitle={audio.title}
        itemType="audio"
      />
    </>
  );
}