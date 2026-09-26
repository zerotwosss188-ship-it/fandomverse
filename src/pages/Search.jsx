import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import SortSelect from '../components/SortSelect';
import { Link } from 'react-router-dom';        // ⭐ ADD (agar pehle se nahi hai)
import ContentCard from '../components/ContentCard';
import CharacterCard from '../components/CharacterCard';
import EventCard from '../components/EventCard';
import MerchandiseCard from '../components/MerchandiseCard';
import TrailerCard from '../components/TrailerCard';
import VideoCard from '../components/VideoCard';       // ⭐ ADD
import AudioCard from '../components/AudioCard';       // ⭐ ADD
import { useData } from '../hooks/useData';
import Breadcrumbs from '../components/Breadcrumbs';

const categories = ['all', 'anime', 'gaming', 'movies', 'tv-shows', 'kpop', 'comics', 'manga'];
const types = [
  { id: 'all', label: 'All' },
  { id: 'article', label: 'Articles' },
  { id: 'character', label: 'Characters' },
  { id: 'event', label: 'Events' },
  { id: 'trailer', label: 'Trailers' },
  { id: 'video', label: 'Videos' },          // ⭐ ADD
  { id: 'audio', label: 'Audio' },           // ⭐ ADD
  { id: 'gallery', label: 'Gallery' },       // ⭐ ADD
  { id: 'merchandise', label: 'Merch' },
  { id: 'release', label: 'Releases' },      // ⭐ ADD
];

export default function Search() {
  const [params, setParams] = useSearchParams();
const initial = params.get('q') || '';
const initialCategory = params.get('category') || 'all';
const [query, setQuery] = useState(initial);
const [debouncedQuery, setDebouncedQuery] = useState(initial);
const [category, setCategory] = useState(initialCategory);
  const [type, setType] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [visibleCount, setVisibleCount] = useState(60);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setVisibleCount(60);
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(60);
  }, [category, type, sortBy]);

  const { data: contentData } = useData('content');
  const { data: charData } = useData('characters');
  const { data: eventData } = useData('events');
  const { data: merchData } = useData('merchandise');
  const { data: trailerData } = useData('trailers');
  const { data: videoData } = useData('videos');       // ⭐ ADD
  const { data: audioData } = useData('audio');        // ⭐ ADD
  const { data: galleryData } = useData('galleries');  // ⭐ ADD
  const { data: releaseData } = useData('releases');   // ⭐ ADD

  const allItems = useMemo(() => {
    const items = [];
    if (contentData?.content) {
      items.push(
        ...contentData.content.map((c) => ({
          ...c,
          _type: 'article',
          _key: `article-${c.id}`,
        }))
      );
    }
    if (charData?.characters) {
      items.push(
        ...charData.characters.map((c) => ({
          ...c,
          _type: 'character',
          _key: `character-${c.id}`,
          title: c.name,
          excerpt: c.bio,
          popularity: 80,
          date: '2026-01-01',
        }))
      );
    }
    if (eventData?.events) {
      items.push(
        ...eventData.events.map((e) => ({
          ...e,
          _type: 'event',
          _key: `event-${e.id}`,
          excerpt: e.description,
          popularity: 70,
          date: e.date,
        }))
      );
    }
    if (trailerData?.trailers) {
      items.push(
        ...trailerData.trailers.map((t) => ({
          ...t,
          _type: 'trailer',
          _key: `trailer-${t.id}`,
          excerpt: `${t.releaseStatus === 'upcoming' ? 'Upcoming' : 'Released'} trailer`,
          popularity: 75,
        }))
      );
    }
    if (merchData?.merchandise) {
      items.push(
        ...merchData.merchandise.map((m) => ({
          ...m,
          _type: 'merchandise',
          _key: `merch-${m.id}`,
          title: m.name,
          excerpt: m.description,
          popularity: 60,
          date: '2026-01-01',
        }))
      );
    }
    if (videoData?.videos) {
      items.push(
        ...videoData.videos.map((v) => ({
          ...v,
          _type: 'video',
          _key: `video-${v.id}`,
          excerpt: `${v.type} · ${v.channel || ''}`,
          popularity: 70,
          image: `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`,
        }))
      );
    }
    if (audioData?.audio) {
      items.push(
        ...audioData.audio.map((a) => ({
          ...a,
          _type: 'audio',
          _key: `audio-${a.id}`,
          excerpt: `${a.type} · ${a.host || ''}`,
          popularity: 65,
        }))
      );
    }
    if (galleryData?.galleries) {
      items.push(
        ...galleryData.galleries.map((g) => ({
          ...g,
          _type: 'gallery',
          _key: `gallery-${g.id}`,
          title: g.caption,
          excerpt: g.series,
          popularity: 55,
          date: '2026-01-01',
        }))
      );
    }
    if (releaseData?.releases) {
      items.push(
        ...releaseData.releases.map((r) => ({
          ...r,
          _type: 'release',
          _key: `release-${r.id}`,
          excerpt: `${r.type} · ${r.category}`,
          popularity: 75,
        }))
      );
    }
    return items;
  }, [contentData, charData, eventData, merchData, trailerData, videoData, audioData, galleryData, releaseData]);

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    let items = allItems;

    if (category !== 'all') items = items.filter((i) => i.category === category);
    if (type !== 'all') items = items.filter((i) => i._type === type);

    if (q) {
      items = items.filter(
        (i) =>
          i.title?.toLowerCase().includes(q) ||
          i.excerpt?.toLowerCase().includes(q) ||
          i.tags?.some((t) => t.toLowerCase().includes(q)) ||
          i.series?.toLowerCase().includes(q)
      );
    }

    // Apply sort
    if (sortBy === 'relevance') {
      items = [...items].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortBy === 'newest') {
      items = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      items = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'popular') {
      items = [...items].sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
    } else if (sortBy === 'az') {
      items = [...items].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    } else if (sortBy === 'za') {
      items = [...items].sort((a, b) => (b.title || '').localeCompare(a.title || ''));
    }

    return items;
  }, [allItems, debouncedQuery, category, type, sortBy]);

  const submit = (e) => {
    e?.preventDefault();
    setParams(query ? { q: query } : {});
  };

  return (
    <div className="fv-container" style={{ padding: '56px 24px 80px' }}>
     <Breadcrumbs items={[{ label: 'Search' }]} />
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 800,
            color: '#f5f5f5',
            marginBottom: 8,
          }}
        >
          Search
        </h1>
        <p style={{ fontSize: 14, color: '#a0a0a0', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
          Articles, characters, events, trailers, and merch across all universes.
        </p>
      </div>

      <form onSubmit={submit} style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 640 }}>
          <FaSearch
            style={{
              position: 'absolute',
              left: 18,
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a8a8a8',
              fontSize: 14,
            }}
          />
          <input
            type="text"
            autoFocus
            placeholder="Search anything — anime, GTA, BTS, Dune..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px 14px 46px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 12,
              color: '#f5f5f5',
              fontSize: 15,
              outline: 'none',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          />
        </div>
      </form>

      {/* Filters row */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 28,
          paddingBottom: 24,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <FilterGroup label="Type" options={types} value={type} onChange={setType} />
          <FilterGroup
            label="Category"
            options={categories.map((c) => ({
              id: c,
              label: c === 'all' ? 'All' : c,
              capitalize: true,
            }))}
            value={category}
            onChange={setCategory}
          />
        </div>

        <SortSelect
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'relevance', label: 'Relevance' },
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'popular', label: 'Most Popular' },
            { value: 'az', label: 'A-Z' },
            { value: 'za', label: 'Z-A' },
          ]}
        />
      </div>

      <p style={{ fontSize: 13, color: '#a8a8a8', marginBottom: 20, fontFamily: 'Space Grotesk, sans-serif' }}>
        {query.trim() || category !== 'all' || type !== 'all'
          ? results.length > visibleCount
            ? `Showing ${visibleCount} of ${results.length} results`
            : `${results.length} result${results.length !== 1 ? 's' : ''}`
          : 'Start typing to search'}
      </p>

      {!query.trim() && category === 'all' && type === 'all' ? (
        <div
          className="fv-card"
          style={{
            padding: 60,
            textAlign: 'center',
            color: '#a8a8a8',
            fontSize: 14,
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.5 }}>🔍</div>
          <div style={{ fontSize: 16, color: '#f5f5f5', marginBottom: 8, fontFamily: 'Orbitron, sans-serif' }}>
            Search FandomVerse
          </div>
          <div style={{ fontSize: 13 }}>
            Type a keyword or pick a filter to start exploring.
          </div>
        </div>
      ) : results.length === 0 ? (
        <div
          className="fv-card"
          style={{ padding: 60, textAlign: 'center', color: '#a8a8a8', fontSize: 14 }}
        >
          No matches found. Try a different keyword or filter.
        </div>
      ) : (
        <div
          className="fv-search-results"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 16,
          }}
        >
             {results.slice(0, visibleCount).map((item, i) => {
            if (item._type === 'character') {
              return <CharacterCard key={item._key} char={item} index={i} />;
            }
            if (item._type === 'event') {
              return <EventCard key={item._key} event={item} index={i} />;
            }
            if (item._type === 'trailer') {
              return <TrailerCard key={item._key} trailer={item} index={i} />;
            }
            if (item._type === 'video') {
              return <VideoCard key={item._key} video={item} index={i} />;
            }
            if (item._type === 'audio') {
              return <AudioCard key={item._key} audio={item} index={i} />;
            }
            if (item._type === 'merchandise') {
              return (
                <MerchandiseCard
                  key={item._key}
                  item={item}
                  index={i}
                  onAdd={() => {
                    const cart = JSON.parse(localStorage.getItem('fv_cart') || '[]');
                    const existing = cart.find((c) => c.id === item.id);
                    if (existing) existing.qty += 1;
                    else cart.push({ ...item, qty: 1 });
                    localStorage.setItem('fv_cart', JSON.stringify(cart));
                    window.dispatchEvent(new Event('fv-cart-update'));
                  }}
                />
              );
            }
            if (item._type === 'gallery') {
              return (
                <div
                  key={item._key}
                  className="fv-card"
                  style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: 'rgba(34, 211, 238, 0.15)',
                      border: '1px solid rgba(34, 211, 238, 0.4)',
                      color: '#22d3ee',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontFamily: 'Orbitron, sans-serif',
                      alignSelf: 'flex-start',
                    }}
                  >
                    Gallery · {item.category}
                  </span>
                  <h3
                    style={{
                      fontSize: 14,
                      fontFamily: 'Orbitron, sans-serif',
                      fontWeight: 600,
                      color: '#f5f5f5',
                      lineHeight: 1.35,
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#8a94ad', margin: 0 }}>
                    {item.excerpt}
                  </p>
                  <Link
                    to={`/category/${item.category}`}
                    className="fv-btn fv-btn-primary"
                    style={{ padding: '8px 14px', fontSize: 12, marginTop: 8, fontWeight: 600 }}
                  >
                    Open Gallery
                  </Link>
                </div>
              );
            }
            if (item._type === 'release') {
              return (
                <div
                  key={item._key}
                  className="fv-card"
                  style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      padding: '3px 8px',
                      borderRadius: 4,
                      background: 'rgba(96, 165, 250, 0.15)',
                      border: '1px solid rgba(96, 165, 250, 0.4)',
                      color: '#60a5fa',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      fontFamily: 'Orbitron, sans-serif',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {item.type}
                  </span>
                  <h3
                    style={{
                      fontSize: 14,
                      fontFamily: 'Orbitron, sans-serif',
                      fontWeight: 600,
                      color: '#f5f5f5',
                      lineHeight: 1.35,
                      margin: 0,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 12, color: '#8a94ad', margin: 0 }}>
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <Link
                    to="/releases"
                    className="fv-btn fv-btn-primary"
                    style={{ padding: '8px 14px', fontSize: 12, marginTop: 8, fontWeight: 600 }}
                  >
                    View Releases
                  </Link>
                </div>
              );
            }
            return <ContentCard key={item._key} item={item} index={i} />;
          })}
        </div>
      )}

      {/* Load more button */}
      {results.length > visibleCount && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 32,
          }}
        >
          <button
            onClick={() => setVisibleCount((c) => c + 60)}
            className="fv-btn fv-btn-primary"
            style={{
              padding: '12px 28px',
              fontSize: 13,
              fontWeight: 600,
              gap: 8,
            }}
          >
            Load 60 more ({results.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div style={{ flex: '0 0 auto' }}>
      <div
        style={{
          fontSize: 11,
          color: '#a8a8a8',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                borderRadius: 8,
                background: isActive
                  ? 'rgba(225, 29, 72, 0.15)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isActive
                  ? '1px solid rgba(225, 29, 72, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? '#fda4af' : '#a0a0a0',
                cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                textTransform: opt.capitalize ? 'capitalize' : 'none',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}