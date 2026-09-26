import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaTimes,
  FaBookOpen,
  FaUser,
  FaCalendarAlt,
  FaVideo,
  FaPlay,
  FaHeadphones,
  FaBookmark,
} from 'react-icons/fa';
import { useData } from '../hooks/useData';

const TYPE_META = {
  article: { icon: <FaBookOpen />, color: '#f97316', label: 'Article' },
  character: { icon: <FaUser />, color: '#22d3ee', label: 'Character' },
  event: { icon: <FaCalendarAlt />, color: '#a78bfa', label: 'Event' },
  trailer: { icon: <FaVideo />, color: '#dc2626', label: 'Trailer' },
  video: { icon: <FaPlay />, color: '#f472b6', label: 'Video' },
  audio: { icon: <FaHeadphones />, color: '#a78bfa', label: 'Audio' },
  merchandise: { icon: <FaBookmark />, color: '#fbbf24', label: 'Merch' },
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

export default function GlobalSearch({ fullWidth = false }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const { data: contentData } = useData('content');
  const { data: charData } = useData('characters');
  const { data: eventData } = useData('events');
  const { data: merchData } = useData('merchandise');
  const { data: trailerData } = useData('trailers');
  const { data: videoData } = useData('videos');
  const { data: audioData } = useData('audio');

  // Build unified search index
  const allItems = useMemo(() => {
    const items = [];

    (contentData?.content || []).forEach((c) => {
      items.push({
        id: c.id,
        type: 'article',
        title: c.title,
        excerpt: c.excerpt,
        category: c.category,
        series: c.series,
        tags: c.tags || [],
        image: c.image || c.banner,
        popularity: c.popularity || 50,
        link: `/content/${c.id}`,
      });
    });

    (charData?.characters || []).forEach((c) => {
      items.push({
        id: c.id,
        type: 'character',
        title: c.name,
        excerpt: c.bio,
        category: c.category,
        series: c.series,
        tags: c.traits || [],
        popularity: 70,
        link: `/category/${c.category}`,
      });
    });

    (eventData?.events || []).forEach((e) => {
      items.push({
        id: e.id,
        type: 'event',
        title: e.title,
        excerpt: e.description,
        category: e.category,
        tags: [e.type, e.location].filter(Boolean),
        popularity: 60,
        link: `/category/${e.category}`,
      });
    });

    (trailerData?.trailers || []).forEach((t) => {
      items.push({
        id: t.id,
        type: 'trailer',
        title: t.title,
        excerpt: `${t.releaseStatus} trailer`,
        category: t.category,
        series: t.series,
        tags: [t.releaseStatus],
        popularity: 65,
        link: `/category/${t.category}`,
      });
    });

    (videoData?.videos || []).forEach((v) => {
      items.push({
        id: v.id,
        type: 'video',
        title: v.title,
        excerpt: `${v.seasonLabel || ''} ${v.channel || ''}`.trim(),
        category: v.category,
        series: v.series,
        tags: [v.type, v.channel].filter(Boolean),
        popularity: 68,
        link: `/category/${v.category}`,
      });
    });

    (audioData?.audio || []).forEach((a) => {
      items.push({
        id: a.id,
        type: 'audio',
        title: a.title,
        excerpt: a.description,
        category: a.category,
        series: a.series,
        tags: [a.type, a.host].filter(Boolean),
        popularity: 58,
        link: `/category/${a.category}`,
      });
    });

    (merchData?.merchandise || []).forEach((m) => {
      items.push({
        id: m.id,
        type: 'merchandise',
        title: m.name,
        excerpt: m.description,
        category: m.category,
        series: m.series,
        tags: [m.type],
        popularity: 55,
        link: `/category/${m.category}`,
      });
    });

    return items;
  }, [contentData, charData, eventData, trailerData, videoData, audioData, merchData]);

  // Search + score
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const scored = allItems
      .map((item) => {
        let score = 0;
        const title = item.title.toLowerCase();
        const excerpt = (item.excerpt || '').toLowerCase();
        const series = (item.series || '').toLowerCase();

        if (title === q) score += 100;
        else if (title.startsWith(q)) score += 60;
        else if (title.includes(q)) score += 40;

        if (series.includes(q)) score += 25;
        (item.tags || []).forEach((t) => {
          const tag = String(t).toLowerCase();
          if (tag === q) score += 20;
          else if (tag.includes(q)) score += 10;
        });
        if (excerpt.includes(q)) score += 8;

        return { ...item, _score: score };
      })
      .filter((i) => i._score > 0)
      .sort((a, b) => b._score - a._score || b.popularity - a.popularity);

    return scored.slice(0, 8);
  }, [allItems, query]);

  // Reset highlight on results change
  useEffect(() => {
    setHighlightIndex(0);
  }, [results.length, query]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Cmd/Ctrl + K shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[highlightIndex]) {
        navigate(results[highlightIndex].link);
        setOpen(false);
        setQuery('');
      } else if (query.trim()) {
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleSelect = (item) => {
    navigate(item.link);
    setOpen(false);
    setQuery('');
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: fullWidth ? '100%' : 'auto',
      }}
    >
      {/* Search input */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          width: fullWidth ? '100%' : open ? 280 : 200,
          transition: fullWidth ? 'none' : 'width 0.25s ease',
        }}
      >
        <FaSearch
          style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#a8a8a8',
            fontSize: 12,
            pointerEvents: 'none',
          }}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search everything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: 38,
            padding: '0 32px 0 34px',
            background: open
              ? 'rgba(249, 115, 22, 0.08)'
              : 'rgba(255, 255, 255, 0.04)',
            border: `1px solid ${
              open ? 'rgba(249, 115, 22, 0.6)' : 'rgba(255, 255, 255, 0.08)'
            }`,
            borderRadius: 10,
            color: '#f5f5f5',
            fontSize: 13,
            outline: 'none',
            fontFamily: 'Space Grotesk, sans-serif',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box',
          }}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            aria-label="Clear"
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)',
              border: 'none',
              color: '#a0a0a0',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              fontSize: 10,
            }}
          >
            <FaTimes />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: fullWidth ? 'auto' : 0,
            left: fullWidth ? 0 : 'auto',
            width: fullWidth ? '100%' : 420,
            maxHeight: 480,
            overflowY: 'auto',
            background: '#151518',
            border: '1px solid rgba(249, 115, 22, 0.35)',
            borderRadius: 12,
            boxShadow:
              '0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(249, 115, 22, 0.1)',
            zIndex: 200,
            padding: 6,
          }}
        >
          {results.length === 0 ? (
            <div
              style={{
                padding: '20px 14px',
                textAlign: 'center',
                fontSize: 13,
                color: '#a0a0a0',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              No results for "{query}"
            </div>
          ) : (
            <>
              {results.map((item, i) => {
                const meta = TYPE_META[item.type] || TYPE_META.article;
                const isHighlighted = i === highlightIndex;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setHighlightIndex(i)}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      background: isHighlighted
                        ? 'rgba(249, 115, 22, 0.12)'
                        : 'transparent',
                      border: 'none',
                      borderRadius: 8,
                      cursor: 'pointer',
                      color: 'inherit',
                      transition: 'background 0.1s',
                    }}
                  >
                    {/* Thumbnail / Icon */}
                    {item.image ? (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          overflow: 'hidden',
                          flexShrink: 0,
                          background: '#0f0f12',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    ) : (
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          flexShrink: 0,
                          background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}11)`,
                          border: `1px solid ${meta.color}44`,
                          display: 'grid',
                          placeItems: 'center',
                          color: meta.color,
                          fontSize: 16,
                        }}
                      >
                        {meta.icon}
                      </div>
                    )}

                    {/* Text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontFamily: 'Orbitron, sans-serif',
                          fontWeight: 600,
                          color: '#f5f5f5',
                          marginBottom: 3,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.title}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          alignItems: 'center',
                          fontSize: 11,
                          color: '#a0a0a0',
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            padding: '2px 6px',
                            borderRadius: 4,
                            background: 'rgba(255,255,255,0.05)',
                            border: `1px solid ${meta.color}44`,
                            color: meta.color,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            fontWeight: 700,
                          }}
                        >
                          {meta.label}
                        </span>
                        <span style={{ textTransform: 'capitalize' }}>
                          {catNames[item.category] || item.category}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Footer — search all */}
              <button
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  marginTop: 4,
                  padding: '10px 12px',
                  background: 'rgba(249, 115, 22, 0.08)',
                  border: '1px solid rgba(249, 115, 22, 0.25)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  color: '#fdba74',
                  fontSize: 12,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 600,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <FaSearch style={{ fontSize: 10 }} />
                See all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}