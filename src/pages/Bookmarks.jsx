import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FilterChips from '../components/FilterChips';
import SortSelect from '../components/SortSelect';
import SmartImage from '../components/SmartImage';
import ShareModal from '../components/ShareModal';
import {
  FaTrash,
  FaDownload,
  FaBookmark,
  FaArrowRight,
  FaBookOpen,
  FaUser,
  FaCalendarAlt,
  FaVideo,
  FaPlay,
  FaHeadphones,
  FaStickyNote,
  FaShareAlt,
} from 'react-icons/fa';
import NotesModal from '../components/NotesModal';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

const typeIcons = {
  article: <FaBookOpen />,
  character: <FaUser />,
  event: <FaCalendarAlt />,
  trailer: <FaVideo />,
  video: <FaPlay />,
  audio: <FaHeadphones />,
  merchandise: <FaBookmark />,
};

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [notesOpen, setNotesOpen] = useState(false);
  const [noteItem, setNoteItem] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareItem, setShareItem] = useState(null);
  useEffect(() => {
    const load = () => {
      const saved = JSON.parse(localStorage.getItem('fv_bookmarks') || '[]');
      setBookmarks(saved);
    };
    load();
    window.addEventListener('fv-bookmarks-update', load);
    return () => window.removeEventListener('fv-bookmarks-update', load);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'fv_bookmarks_seen_count',
      String(bookmarks.length)
    );
    window.dispatchEvent(new Event('fv-bookmarks-new-count'));
  }, [bookmarks.length]);

  const remove = (id, type) => {
    const targetKey = `${type || 'article'}:${id}`;
    const updated = bookmarks.filter(
      (b) => `${b.type || 'article'}:${b.id}` !== targetKey
    );
    localStorage.setItem('fv_bookmarks', JSON.stringify(updated));
setBookmarks(updated);
window.dispatchEvent(new Event('fv-bookmarks-update'));
window.dispatchEvent(new Event('fv-bookmarks-new-count'));

// ⭐ Toast event
window.dispatchEvent(
  new CustomEvent('fv-bookmark-toast', {
    detail: { action: 'removed' },
  })
);
  };

  // ============ EXCEL EXPORT ============
  const exportToExcel = () => {
    const escapeHtml = (str) => {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    };

    const dateStr = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; }
          h1 { color: #e11d48; font-size: 22px; margin-bottom: 4px; }
          h2 { color: #e11d48; font-size: 15px; margin-top: 32px; margin-bottom: 10px; border-bottom: 2px solid #e11d48; padding-bottom: 6px; }
          p.meta { color: #666; font-size: 11px; margin: 0 0 20px 0; }
          table { border-collapse: collapse; width: 100%; margin-bottom: 12px; }
          th {
            background: #e11d48;
            color: white;
            padding: 10px 12px;
            text-align: left;
            font-size: 12px;
            border: 1px solid #be123c;
          }
          td {
            padding: 8px 12px;
            font-size: 12px;
            border: 1px solid #e5e5e5;
            vertical-align: top;
          }
          tr:nth-child(even) td { background: #f9f9f9; }
          .note-filled { color: #b45309; font-style: italic; }
          .note-empty { color: #999; font-style: italic; }
          .type-article { color: #ea580c; font-weight: 600; }
          .type-character { color: #0891b2; font-weight: 600; }
          .type-event { color: #7c3aed; font-weight: 600; }
          .type-trailer { color: #e11d48; font-weight: 600; }
          .type-video { color: #db2777; font-weight: 600; }
          .type-audio { color: #7c3aed; font-weight: 600; }
          .type-merchandise { color: #ca8a04; font-weight: 600; }
        </style>
      </head>
      <body>
        <h1>FandomVerse — Bookmarks Export</h1>
        <p class="meta">Exported: ${dateStr} · Total: ${filteredBookmarks.length} item${filteredBookmarks.length !== 1 ? 's' : ''}</p>
        <table>
          <thead>
            <tr>
              <th width="40">#</th>
              <th width="300">Title</th>
              <th width="100">Type</th>
              <th width="100">Category</th>
              <th width="400">Personal Note</th>
            </tr>
          </thead>
          <tbody>
    `;

    filteredBookmarks.forEach((b, i) => {
      const noteKey = `fv_note_${b.type}_${b.id}`;
      const note = sessionStorage.getItem(noteKey) || '';
      const noteTrimmed = note.trim();
      const noteClass = noteTrimmed ? 'note-filled' : 'note-empty';
      const noteDisplay = noteTrimmed ? escapeHtml(noteTrimmed) : '—';
      const typeClass = `type-${b.type || 'article'}`;

      html += `
        <tr>
          <td>${i + 1}</td>
          <td>${escapeHtml(b.title)}</td>
          <td class="${typeClass}">${b.type || 'article'}</td>
          <td>${b.category || ''}</td>
          <td class="${noteClass}">${noteDisplay}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>
    `;

    // Section: Bookmarks grouped by Category
    const byCategory = {};
    filteredBookmarks.forEach((b) => {
      const cat = b.category || 'other';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(b);
    });

    if (Object.keys(byCategory).length > 1) {
      html += `<h2>📁 Grouped by Category</h2>`;
      Object.entries(byCategory).forEach(([cat, items]) => {
        html += `
          <table>
            <thead>
              <tr>
                <th colspan="2" style="background:#9f1239; font-size: 13px;">${escapeHtml(cat.toUpperCase())} · ${items.length} item${items.length !== 1 ? 's' : ''}</th>
              </tr>
              <tr>
                <th width="40">#</th>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
        `;
        items.forEach((b, i) => {
          html += `
            <tr>
              <td>${i + 1}</td>
              <td>${escapeHtml(b.title)} <span style="color:#999; font-size:10px;">[${b.type}]</span></td>
            </tr>
          `;
        });
        html += `</tbody></table>`;
      });
    }

    html += `
      </body>
      </html>
    `;

    const blob = new Blob([html], {
      type: 'application/vnd.ms-excel;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `fandomverse-bookmarks-${stamp}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };
  // ============ /EXCEL EXPORT ============

  const categoryOptions = useMemo(() => {
    const set = new Set(bookmarks.map((b) => b.category).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [bookmarks]);

  const typeOptions = useMemo(() => {
    const set = new Set(bookmarks.map((b) => b.type).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    let items = bookmarks;
    if (categoryFilter !== 'all') {
      items = items.filter((b) => b.category === categoryFilter);
    }
    if (typeFilter !== 'all') {
      items = items.filter((b) => b.type === typeFilter);
    }

    if (sortBy === 'recent') {
      items = [...items].reverse();
    } else if (sortBy === 'title-asc') {
      items = [...items].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'title-desc') {
      items = [...items].sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    } else if (sortBy === 'category') {
      items = [...items].sort((a, b) => {
        const c = (a.category || '').localeCompare(b.category || '');
        if (c !== 0) return c;
        return (a.title || '').localeCompare(b.title || '');
      });
    } else if (sortBy === 'type') {
      items = [...items].sort((a, b) => {
        const t = (a.type || '').localeCompare(b.type || '');
        if (t !== 0) return t;
        return (a.title || '').localeCompare(b.title || '');
      });
    }

    return items;
  }, [bookmarks, categoryFilter, typeFilter, sortBy]);

  return (
    <div className="fv-container" style={{ padding: '56px 24px 80px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 20,
          marginBottom: 32,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 800,
              color: '#f5f5f5',
              marginBottom: 8,
            }}
          >
            Bookmarks
          </h1>
          <p style={{ fontSize: 14, color: '#a0a0a0', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
            {filteredBookmarks.length} of {bookmarks.length} saved item{bookmarks.length !== 1 ? 's' : ''}
          </p>
        </div>
        {bookmarks.length > 0 && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => {
                setShareItem(null);
                setShareOpen(true);
              }}
              className="fv-btn fv-btn-ghost"
              style={{ gap: 8, fontSize: 13 }}
            >
              <FaShareAlt style={{ fontSize: 11 }} /> Share
            </button>
            <button
              onClick={exportToExcel}
              className="fv-btn fv-btn-ghost"
              style={{ gap: 8, fontSize: 13 }}
            >
              <FaDownload style={{ fontSize: 11 }} /> Export Excel
            </button>
          </div>
        )}
      </div>

      {bookmarks.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          {categoryOptions.length > 2 && (
            <FilterChips
              label="Category"
              options={categoryOptions.map((c) => ({
                id: c,
                label: c === 'all' ? 'All' : c,
                capitalize: true,
              }))}
              value={categoryFilter}
              onChange={setCategoryFilter}
              color="#e11d48"
              countFn={(id) =>
                id === 'all' ? bookmarks.length : bookmarks.filter((b) => b.category === id).length
              }
            />
          )}
          {typeOptions.length > 2 && (
            <FilterChips
              label="Type"
              options={typeOptions.map((t) => ({
                id: t,
                label: t === 'all' ? 'All' : t,
                capitalize: true,
              }))}
              value={typeFilter}
              onChange={setTypeFilter}
              color="#a855f7"
              countFn={(id) =>
                id === 'all' ? bookmarks.length : bookmarks.filter((b) => b.type === id).length
              }
            />
          )}
          <SortSelect
            label="Sort"
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'recent', label: 'Recently Added' },
              { value: 'title-asc', label: 'Title A-Z' },
              { value: 'title-desc', label: 'Title Z-A' },
              { value: 'category', label: 'By Category' },
              { value: 'type', label: 'By Type' },
            ]}
          />
        </div>
      )}

      {bookmarks.length === 0 ? (
        <div
          style={{
            padding: 60,
            textAlign: 'center',
            background: '#151518',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 16,
          }}
        >
          <FaBookmark style={{ fontSize: 36, color: '#a8a8a8', marginBottom: 16, opacity: 0.6 }} />
          <div style={{ fontSize: 15, color: '#f5f5f5', marginBottom: 8 }}>
            No bookmarks yet.
          </div>
          <div style={{ fontSize: 13, color: '#a8a8a8', marginBottom: 24 }}>
            Browse content and click the bookmark icon to save.
          </div>
          <Link to="/category/anime" className="fv-btn fv-btn-primary">
            Start Exploring <FaArrowRight style={{ fontSize: 11 }} />
          </Link>
        </div>
      ) : filteredBookmarks.length === 0 ? (
        <div
          className="fv-card"
          style={{ padding: 60, textAlign: 'center', color: '#a8a8a8', fontSize: 14 }}
        >
          No bookmarks match this filter.
          <div style={{ marginTop: 16 }}>
            <button
              onClick={() => {
                setCategoryFilter('all');
                setTypeFilter('all');
              }}
              className="fv-btn fv-btn-ghost"
              style={{ fontSize: 13 }}
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 18,
          }}
        >
          <AnimatePresence>
            {filteredBookmarks.map((b) => {
              const color = catColors[b.category] || '#e11d48';
              const icon = typeIcons[b.type] || <FaBookmark />;
              return (
                <motion.div
                  key={`${b.type || 'article'}-${b.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#151518',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 14,
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '16 / 9',
                      background: b.image
                        ? '#0f0f12'
                        : `linear-gradient(135deg, ${color}33, ${color}11)`,
                      overflow: 'hidden',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {b.image ? (
  <SmartImage
    src={b.image}
    alt={b.title}
    loadingText="Loading"
    showLoadingText={true}
    style={{ width: '100%', height: '100%' }}
  />
) : (
  <span style={{ fontSize: 36, color: color, opacity: 0.55 }}>{icon}</span>
)}
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 55%, rgba(21,21,24,0.9) 100%)',
                        pointerEvents: 'none',
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
                        background: 'rgba(10,10,10,0.8)',
                        border: `1px solid ${color}66`,
                        color: color,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontFamily: 'Orbitron, sans-serif',
                        backdropFilter: 'blur(8px)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      {icon} {b.type}
                    </span>
                    <span
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        fontSize: 9,
                        padding: '3px 8px',
                        borderRadius: 4,
                        background: 'rgba(10,10,10,0.8)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        color: '#cbd5e1',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        fontFamily: 'Orbitron, sans-serif',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {b.category}
                    </span>
                  </div>

                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                    <Link
                      to={
                        b.type === 'character' ||
                        b.type === 'video' ||
                        b.type === 'trailer' ||
                        b.type === 'event' ||
                        b.type === 'audio'
                          ? `/category/${b.category}`
                          : `/content/${b.id}`
                      }
                      style={{
                        fontSize: 14,
                        fontFamily: 'Orbitron, sans-serif',
                        fontWeight: 600,
                        color: '#f5f5f5',
                        lineHeight: 1.35,
                        textDecoration: 'none',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {b.title}
                    </Link>
                    <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                      <Link
                        to={
                          b.type === 'character' ||
                          b.type === 'video' ||
                          b.type === 'trailer' ||
                          b.type === 'event' ||
                          b.type === 'audio'
                            ? `/category/${b.category}`
                            : `/content/${b.id}`
                        }
                        className="fv-btn fv-btn-primary"
                        style={{ padding: '8px 14px', fontSize: 12, flex: 1, fontWeight: 600 }}
                      >
                        Open
                      </Link>
                      <button
                        onClick={() => {
                          setShareItem(b);
                          setShareOpen(true);
                        }}
                        aria-label="Share"
                        title="Share"
                        style={{
                          width: 36,
                          height: 34,
                          borderRadius: 10,
                          background: 'transparent',
                          border: '1px solid rgba(96, 165, 250, 0.4)',
                          color: '#60a5fa',
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                          fontSize: 12,
                          transition: 'all 0.15s',
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#60a5fa';
                          e.currentTarget.style.background =
                            'rgba(96, 165, 250, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor =
                            'rgba(96, 165, 250, 0.4)';
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <FaShareAlt />
                      </button>
                      <button
                        onClick={() => remove(b.id, b.type)}
                        aria-label="Remove bookmark"
                        style={{
                          width: 36,
                          height: 34,
                          borderRadius: 10,
                          background: 'transparent',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          color: '#a8a8a8',
                          display: 'grid',
                          placeItems: 'center',
                          cursor: 'pointer',
                          fontSize: 12,
                          transition: 'all 0.15s',
                          flexShrink: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.5)';
                          e.currentTarget.style.color = '#e11d48';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.color = '#a8a8a8';
                        }}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

<NotesModal
        open={notesOpen}
        onClose={() => {
          setNotesOpen(false);
          setNoteItem(null);
        }}
        itemId={noteItem?.id}
        itemTitle={noteItem?.title}
        itemType={noteItem?.type}
      />

      <ShareModal
        open={shareOpen}
        onClose={() => {
          setShareOpen(false);
          setShareItem(null);
        }}
        title={
          shareItem
            ? `Share "${shareItem.title}" on FandomVerse`
            : 'Share my FandomVerse Bookmarks'
        }
        text={
          shareItem
            ? `Check out "${shareItem.title}" (${shareItem.type}) on FandomVerse!`
            : `Check out my ${bookmarks.length} saved bookmarks on FandomVerse!`
        }
        url={
          shareItem
            ? `${window.location.origin}${
                shareItem.type === 'character' ||
                shareItem.type === 'video' ||
                shareItem.type === 'trailer' ||
                shareItem.type === 'event' ||
                shareItem.type === 'audio'
                  ? `/category/${shareItem.category}`
                  : `/content/${shareItem.id}`
              }`
            : window.location.href
        }
      />
    </div>
  );
}