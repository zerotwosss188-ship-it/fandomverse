import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaTicketAlt,
  FaStickyNote,
  FaExternalLinkAlt,
} from 'react-icons/fa';
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

const catNames = {
  anime: 'Anime',
  gaming: 'Gaming',
  movies: 'Movies',
  'tv-shows': 'TV Shows',
  kpop: 'K-Pop',
  comics: 'Comics',
  manga: 'Manga',
};

export default function EventDetailModal({ event, open, onClose }) {
  const [notesOpen, setNotesOpen] = useState(false);

  if (!event) return null;

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const catColor = catColors[event.category] || '#dc2626';
  const ORANGE = '#f97316';

  const fullDate = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const gcalDates = event.date.replace(/-/g, '');
  const calendarUrl =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(event.title)}` +
    `&dates=${gcalDates}/${gcalDates}` +
    `&details=${encodeURIComponent(event.description || '')}` +
    `&location=${encodeURIComponent(event.location || '')}`;

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    event.location || ''
  )}`;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(12px)',
              zIndex: 500,
              display: 'grid',
              placeItems: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ scale: 0.96, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="fv-event-modal"
              style={{
                width: '100%',
                maxWidth: 620,
                maxHeight: '88vh',
                overflowY: 'auto',
                background: '#151518',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 18,
                position: 'relative',
                boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
              }}
            >
              {/* Header banner */}
              <div
                style={{
                  position: 'relative',
                  padding: '32px 32px 24px',
                  background: `linear-gradient(135deg, ${catColor}20, transparent 70%)`,
                  borderTopLeftRadius: 18,
                  borderTopRightRadius: 18,
                  overflow: 'hidden',
                }}
              >
                {/* Left orange accent */}
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 20,
                    bottom: 20,
                    width: 3,
                    background: isPast
                      ? 'rgba(249, 115, 22, 0.4)'
                      : `linear-gradient(180deg, #dc2626, ${ORANGE})`,
                  }}
                />

                {/* Close button */}
                <button
                  onClick={onClose}
                  aria-label="Close"
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#a0a0a0',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: 12,
                    zIndex: 2,
                  }}
                >
                  <FaTimes />
                </button>

                {/* Category + type pills */}
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    marginBottom: 16,
                    flexWrap: 'wrap',
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      padding: '4px 10px',
                      borderRadius: 5,
                      background: 'rgba(255,255,255,0.06)',
                      border: `1px solid ${catColor}55`,
                      color: catColor,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontFamily: 'Orbitron, sans-serif',
                    }}
                  >
                    {catNames[event.category] || event.category}
                  </span>
                  {event.type && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: '4px 10px',
                        borderRadius: 5,
                        background: 'rgba(249, 115, 22, 0.12)',
                        border: `1px solid rgba(249, 115, 22, 0.35)`,
                        color: ORANGE,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontFamily: 'Orbitron, sans-serif',
                      }}
                    >
                      {event.type}
                    </span>
                  )}
                  {isPast && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: '4px 10px',
                        borderRadius: 5,
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#a8a8a8',
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontFamily: 'Orbitron, sans-serif',
                      }}
                    >
                      Past
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2
                  style={{
                    fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 800,
                    color: '#ffffff',
                    lineHeight: 1.2,
                    margin: 0,
                    letterSpacing: '0.01em',
                  }}
                >
                  {event.title}
                </h2>
              </div>

              {/* Body */}
              <div style={{ padding: '8px 32px 32px' }}>
                {/* Date row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 14,
                    color: '#d0d0d0',
                    marginBottom: 16,
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  <FaCalendarAlt style={{ color: ORANGE, fontSize: 13 }} />
                  {fullDate}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: 15,
                    color: '#b8b8b8',
                    lineHeight: 1.7,
                    marginBottom: 24,
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {event.description}
                </p>

                {/* Meta cards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 12,
                    marginBottom: 24,
                  }}
                  className="fv-event-meta-grid"
                >
                  {/* Location */}
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 10,
                      padding: 14,
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: 10,
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(249, 115, 22, 0.4)';
                      e.currentTarget.style.background =
                        'rgba(249, 115, 22, 0.06)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        'rgba(255,255,255,0.06)';
                      e.currentTarget.style.background =
                        'rgba(255,255,255,0.03)';
                    }}
                  >
                    <FaMapMarkerAlt
                      style={{ color: ORANGE, fontSize: 13, marginTop: 2 }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 10,
                          color: '#a8a8a8',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          marginBottom: 4,
                          fontFamily: 'Orbitron, sans-serif',
                          fontWeight: 600,
                        }}
                      >
                        Location
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          color: '#e0e0e0',
                          fontFamily: 'Space Grotesk, sans-serif',
                          fontWeight: 500,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        {event.location}
                        <FaExternalLinkAlt
                          style={{ color: '#a8a8a8', fontSize: 9 }}
                        />
                      </div>
                    </div>
                  </a>

                  {/* Attendees */}
                  {event.attendees && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        padding: 14,
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 10,
                      }}
                    >
                      <FaUsers
                        style={{ color: ORANGE, fontSize: 13, marginTop: 2 }}
                      />
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 10,
                            color: '#a8a8a8',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: 4,
                            fontFamily: 'Orbitron, sans-serif',
                            fontWeight: 600,
                          }}
                        >
                          Expected
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            color: '#e0e0e0',
                            fontFamily: 'Space Grotesk, sans-serif',
                            fontWeight: 500,
                          }}
                        >
                          {event.attendees} attendees
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  {!isPast && (
                    <a
                      href={calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fv-btn fv-btn-primary"
                      style={{
                        gap: 8,
                        padding: '11px 20px',
                        fontSize: 13,
                        fontWeight: 600,
                        flex: 1,
                        justifyContent: 'center',
                        minWidth: 160,
                      }}
                    >
                      <FaTicketAlt style={{ fontSize: 11 }} />
                      Add to calendar
                    </a>
                  )}
                  <button
                    onClick={() => setNotesOpen(true)}
                    className="fv-btn fv-btn-ghost"
                    style={{
                      gap: 8,
                      padding: '11px 20px',
                      fontSize: 13,
                      flex: 1,
                      justifyContent: 'center',
                      minWidth: 140,
                    }}
                  >
                    <FaStickyNote style={{ fontSize: 11 }} />
                    Add note
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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