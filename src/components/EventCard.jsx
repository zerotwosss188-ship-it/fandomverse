import { useState } from 'react';
import EventDetailModal from './EventDetailModal';
import { motion } from 'framer-motion';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaStickyNote,
  FaUsers,
  FaTicketAlt,
} from 'react-icons/fa';
import NotesModal from './NotesModal';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useBookmark } from '../hooks/useBookmark';

const ORANGE = '#a855f7';
const ORANGE_DARK = '#e11d48';

function daysLabel(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  const diff = Math.round((date - now) / (1000 * 60 * 60 * 24));

  if (diff === 0) return { label: 'Today', color: '#34d399' };
  if (diff === 1) return { label: 'Tomorrow', color: '#34d399' };
  if (diff > 1 && diff <= 7)
    return { label: `in ${diff} days`, color: ORANGE };
  if (diff > 7) return { label: `in ${diff} days`, color: '#a0a0a0' };
  if (diff === -1) return { label: 'Yesterday', color: '#a8a8a8' };
  return { label: `${Math.abs(diff)} days ago`, color: '#a8a8a8' };
}

export default function EventCard({ event, index = 0 }) {
  const [notesOpen, setNotesOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const days = daysLabel(event.date);

  const { bookmarked, toggle: toggleBookmark } = useBookmark({
    id: event.id,
    title: event.title,
    type: 'event',
    category: event.category,
  });

  // Google Calendar link
  const gcalDates = event.date.replace(/-/g, '');
  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${gcalDates}/${gcalDates}` +
    `&details=${encodeURIComponent(event.description)}` +
    `&location=${encodeURIComponent(event.location)}`;

  return (
    <>
            <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        onClick={() => setDetailOpen(true)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        style={{
          padding: 18,
          cursor: 'pointer',
          display: 'flex',
          gap: 16,
          alignItems: 'stretch',
          position: 'relative',
          background: '#151518',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          borderRadius: 14,
          opacity: isPast ? 0.85 : 1,
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.35)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')
        }
      >
                {/* Left accent bar */}
                <span
          style={{
            position: 'absolute',
            left: 0,
            top: 12,
            bottom: 12,
            width: 3,
            borderRadius: '0 2px 2px 0',
            background: isPast
              ? 'rgba(168, 85, 247, 0.35)'
              : `linear-gradient(180deg, ${ORANGE_DARK}, ${ORANGE})`,
          }}
        />
        {/* Date block — orange gradient */}
        <div
          style={{
            flexShrink: 0,
            width: 64,
            textAlign: 'center',
            padding: '10px 0 12px',
            borderRadius: 10,
            background: isPast
            ? 'rgba(168, 85, 247, 0.15)'
            : `linear-gradient(135deg, ${ORANGE_DARK}, ${ORANGE})`,
            border: isPast
            ? '1px solid rgba(168, 85, 247, 0.3)'
            : 'none',
              color: '#fff',
            fontFamily: 'Orbitron, sans-serif',
            boxShadow: isPast
              ? 'none'
              : '0 6px 18px rgba(168, 85, 247, 0.35)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: '0.12em',
              fontWeight: 700,
              opacity: 0.95,
            }}
          >
            {eventDate
              .toLocaleDateString('en-US', { month: 'short' })
              .toUpperCase()}
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              lineHeight: 1.1,
              margin: '2px 0',
            }}
          >
            {eventDate.getDate()}
          </div>
          <div
            style={{
              fontSize: 9,
              opacity: 0.85,
              letterSpacing: '0.08em',
            }}
          >
            {eventDate
              .toLocaleDateString('en-US', { weekday: 'short' })
              .toUpperCase()}
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: 32 }}>
          {/* Row 1: Days label + Event type */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: days.color,
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 700,
                letterSpacing: '0.05em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <FaCalendarAlt style={{ fontSize: 10 }} />
              {days.label}
            </span>
            {event.type && (
              <span
                style={{
                  fontSize: 9,
                  padding: '3px 8px',
                  borderRadius: 4,
                  background: 'rgba(168, 85, 247, 0.12)',
                  border: `1px solid rgba(168, 85, 247, 0.35)`,
                  color: ORANGE,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontFamily: 'Orbitron, sans-serif',
                }}
              >
                {event.type}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: 15,
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              color: '#f5f5f5',
              marginBottom: 6,
              lineHeight: 1.3,
              letterSpacing: '0.01em',
            }}
          >
            {event.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontSize: 13,
              color: '#a0a0a0',
              lineHeight: 1.5,
              marginBottom: 12,
              fontFamily: 'Space Grotesk, sans-serif',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {event.description}
          </p>

          {/* Meta row: location · attendees · calendar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 12,
              color: '#a8a8a8',
              fontFamily: 'Space Grotesk, sans-serif',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <FaMapMarkerAlt
                style={{ color: isPast ? '#a8a8a8' : ORANGE, fontSize: 11 }}
              />
              {event.location}
            </span>

            {event.attendees && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <FaUsers style={{ color: '#a8a8a8', fontSize: 11 }} />
                {event.attendees}
              </span>
            )}

            {!isPast && (
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  color: ORANGE,
                  textDecoration: 'none',
                  fontWeight: 500,
                  transition: 'color 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = '#fbbf24')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = ORANGE)
                }
              >
                <FaTicketAlt style={{ fontSize: 10 }} />
                Add to calendar
              </a>
            )}


                    {/* Bookmark button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleBookmark(e);
          }}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(10, 10, 10, 0.75)',
            border: `1px solid ${bookmarked ? 'rgba(251, 191, 36, 0.6)' : 'rgba(225, 29, 72, 0.4)'}`,
            color: bookmarked ? '#fbbf24' : '#fda4af',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            fontSize: 12,
            backdropFilter: 'blur(8px)',
            zIndex: 3,
          }}
        >
          {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
          </div>
        </div>

      </motion.div>

      <EventDetailModal
        event={event}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />

      <NotesModal
        open={notesOpen}
        onClose={() => setNotesOpen(false)}
        itemId={event.id}
        itemTitle={event.title}
        itemType="event"
      />
    </>
  );
}