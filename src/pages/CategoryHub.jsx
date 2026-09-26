import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import FilterChips from '../components/FilterChips';
import SortSelect from '../components/SortSelect';
import SeriesGrid from '../components/SeriesGrid';
import {
  FaDragon, FaGamepad, FaFilm, FaTv, FaMicrophone, FaBookOpen, FaBook, FaHome, FaSearch, FaTimes,
} from 'react-icons/fa';
import AnimatedTabs from '../components/AnimatedTabs';
import ContentCard from '../components/ContentCard';
import CharacterCard from '../components/CharacterCard';
import EventCard from '../components/EventCard';
import MerchandiseCard from '../components/MerchandiseCard';
import TrailerCard from '../components/TrailerCard';
import VideoCard from '../components/VideoCard';
import VideosBrowser from '../components/VideosBrowser';
import GalleryGrid from '../components/GalleryGrid';
import AudioCard from '../components/AudioCard';
import ReleaseRow from '../components/ReleaseRow';
import { useData } from '../hooks/useData';

const categoryData = {
  anime: { name: 'Anime', Icon: FaDragon, gradient: 'linear-gradient(135deg, #f472b6, #db2777)' },
  gaming: { name: 'Gaming', Icon: FaGamepad, gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)' },
  movies: { name: 'Movies', Icon: FaFilm, gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)' },
  'tv-shows': { name: 'TV Shows', Icon: FaTv, gradient: 'linear-gradient(135deg, #34d399, #059669)' },
  kpop: { name: 'K-Pop', Icon: FaMicrophone, gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)' },
  comics: { name: 'Comics', Icon: FaBookOpen, gradient: 'linear-gradient(135deg, #f87171, #e11d48)' },
  manga: { name: 'Manga', Icon: FaBook, gradient: 'linear-gradient(135deg, #22d3ee, #0891b2)' },
};

const tabs = [
  { id: 'articles', label: 'Articles' },
  { id: 'characters', label: 'Characters' },
  { id: 'events', label: 'Events' },
  { id: 'trailers', label: 'Trailers' },
  { id: 'videos', label: 'Videos' },
  { id: 'audio', label: 'Audio' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'merchandise', label: 'Merchandise' },
  { id: 'releases', label: 'Releases' },
];

export default function CategoryHub() {
  const { slug } = useParams();
  const data = categoryData[slug] || { name: 'Unknown', Icon: FaBook, gradient: '#666' };
  const Icon = data.Icon;

  // ============ ALL STATE DECLARATIONS (must come first) ============
  const [activeTab, setActiveTab] = useState('articles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  // Sort states per tab
  const [articleSort, setArticleSort] = useState('newest');
  const [charSort, setCharSort] = useState('name-asc');
  const [eventSort, setEventSort] = useState('date-asc');
  const [trailerSort, setTrailerSort] = useState('newest');
  const [audioSort, setAudioSort] = useState('newest');
  const [gallerySort, setGallerySort] = useState('series-asc');
  const [merchSort, setMerchSort] = useState('default');

  // Filter states
  const [trailerStatus, setTrailerStatus] = useState('all');
  const [charFranchise, setCharFranchise] = useState('all');
  const [charTrait, setCharTrait] = useState('all');
  const [videoType, setVideoType] = useState('all');
  const [eventType, setEventType] = useState('all');
  const [audioType, setAudioType] = useState('all');
  const [gallerySeriesFilter, setGallerySeriesFilter] = useState('all');
  const [merchType, setMerchType] = useState('all');
  const [releaseType, setReleaseType] = useState('all');

  // ============ EFFECTS (after all useState) ============
  // ⭐ Reset all filters when slug changes
  useEffect(() => {
    setActiveTab('articles');
    setSelectedTags([]);
    setCharFranchise('all');
    setCharTrait('all');
    setVideoType('all');
    setEventType('all');
    setTrailerStatus('all');
    setAudioType('all');
    setGallerySeriesFilter('all');
    setMerchType('all');
    setReleaseType('all');
    setSearchQuery('');
  }, [slug]);

  // ============ DATA HOOKS ============
  const { data: contentData } = useData('content');
  const { data: charData } = useData('characters');
  const { data: eventData } = useData('events');
  const { data: merchData } = useData('merchandise');
  const { data: trailerData } = useData('trailers');
  const { data: videoData } = useData('videos');
  const { data: galleryData } = useData('galleries');
  const { data: audioData } = useData('audio');
  const { data: releaseData } = useData('releases');

  // ============ ARTICLES ============
  const articlesInCategory = useMemo(() => {
    if (!contentData) return [];
    return contentData.content.filter((c) => c.category === slug);
  }, [contentData, slug]);

  const tagCounts = useMemo(() => {
    const map = new Map();
    articlesInCategory.forEach((a) => {
      (a.tags || []).forEach((t) => {
        map.set(t, (map.get(t) || 0) + 1);
      });
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 12);
  }, [articlesInCategory]);

  const filteredContent = useMemo(() => {
    let items = articlesInCategory;

    // ⭐ Search filter (within this category only)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      items = items.filter((c) =>
        (c.title || '').toLowerCase().includes(q) ||
        (c.excerpt || '').toLowerCase().includes(q) ||
        (c.series || '').toLowerCase().includes(q) ||
        (c.tags || []).some((t) => String(t).toLowerCase().includes(q))
      );
    }

    if (selectedTags.length > 0) {
      items = items.filter((c) =>
        selectedTags.every((tag) => (c.tags || []).includes(tag))
      );
    }

    if (articleSort === 'newest') {
      items = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (articleSort === 'oldest') {
      items = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (articleSort === 'popular') {
      items = [...items].sort((a, b) => b.popularity - a.popularity);
    } else if (articleSort === 'az') {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (articleSort === 'za') {
      items = [...items].sort((a, b) => b.title.localeCompare(a.title));
    }

    return items;
  }, [articlesInCategory, articleSort, selectedTags, searchQuery]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearTags = () => setSelectedTags([]);

  // ============ CHARACTERS ============
  const allCharsInCategory = useMemo(
    () => (charData ? charData.characters.filter((c) => c.category === slug) : []),
    [charData, slug]
  );

  const franchises = useMemo(() => {
    const set = new Set(allCharsInCategory.map((c) => c.series));
    return ['all', ...Array.from(set)];
  }, [allCharsInCategory]);

  const charTraits = useMemo(() => {
    const map = new Map();
    allCharsInCategory.forEach((c) => {
      (c.traits || []).forEach((t) => {
        map.set(t, (map.get(t) || 0) + 1);
      });
    });
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [allCharsInCategory]);

  const filteredChars = useMemo(() => {
    let items =
      charFranchise === 'all'
        ? allCharsInCategory
        : allCharsInCategory.filter((c) => c.series === charFranchise);

    if (charTrait !== 'all') {
      items = items.filter((c) => (c.traits || []).includes(charTrait));
    }

    if (charSort === 'name-asc') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    } else if (charSort === 'name-desc') {
      items = [...items].sort((a, b) => b.name.localeCompare(a.name));
    } else if (charSort === 'series') {
      items = [...items].sort((a, b) => {
        const s = (a.series || '').localeCompare(b.series || '');
        if (s !== 0) return s;
        return a.name.localeCompare(b.name);
      });
    }

    return items;
  }, [allCharsInCategory, charFranchise, charTrait, charSort]);

  // ============ EVENTS ============
  const eventsInCategory = useMemo(
    () => (eventData ? eventData.events.filter((e) => e.category === slug) : []),
    [eventData, slug]
  );

  const eventTypes = useMemo(() => {
    const set = new Set(eventsInCategory.map((e) => e.type).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [eventsInCategory]);

  const filteredEvents = useMemo(() => {
    let items =
      eventType === 'all'
        ? eventsInCategory
        : eventsInCategory.filter((e) => e.type === eventType);

    if (eventSort === 'date-asc') {
      items = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (eventSort === 'date-desc') {
      items = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (eventSort === 'name-asc') {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (eventSort === 'name-desc') {
      items = [...items].sort((a, b) => b.title.localeCompare(a.title));
    }

    return items;
  }, [eventsInCategory, eventType, eventSort]);

  // ============ MERCH ============
  const merchInCategory = useMemo(
    () => (merchData ? merchData.merchandise.filter((m) => m.category === slug) : []),
    [merchData, slug]
  );

  const merchTypes = useMemo(() => {
    const set = new Set(merchInCategory.map((m) => m.type).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [merchInCategory]);

  const filteredMerch = useMemo(() => {
    let items = merchInCategory;
    if (merchType !== 'all') {
      items = items.filter((m) => m.type === merchType);
    }
    if (merchSort === 'price-asc') {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (merchSort === 'price-desc') {
      items = [...items].sort((a, b) => b.price - a.price);
    } else if (merchSort === 'name-asc') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    } else if (merchSort === 'name-desc') {
      items = [...items].sort((a, b) => b.name.localeCompare(a.name));
    }
    return items;
  }, [merchInCategory, merchType, merchSort]);

  // ============ TRAILERS ============
  const trailersInCategory = useMemo(
    () => (trailerData ? trailerData.trailers.filter((t) => t.category === slug) : []),
    [trailerData, slug]
  );

  const filteredTrailers = useMemo(() => {
    let items =
      trailerStatus === 'all'
        ? trailersInCategory
        : trailersInCategory.filter((t) => t.releaseStatus === trailerStatus);

    if (trailerSort === 'newest') {
      items = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (trailerSort === 'oldest') {
      items = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (trailerSort === 'name-asc') {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (trailerSort === 'name-desc') {
      items = [...items].sort((a, b) => b.title.localeCompare(a.title));
    }

    return items;
  }, [trailersInCategory, trailerStatus, trailerSort]);

  // ============ VIDEOS ============
  const videosInCategory = useMemo(() => {
    if (!videoData) return [];
    return videoData.videos.filter((v) => v.category === slug);
  }, [videoData, slug]);

  const videoTypes = useMemo(() => {
    const set = new Set(videosInCategory.map((v) => v.type).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [videosInCategory]);

  const filteredVideos = useMemo(() => {
    if (videoType === 'all') return videosInCategory;
    return videosInCategory.filter((v) => v.type === videoType);
  }, [videosInCategory, videoType]);

  // ============ AUDIO ============
  const audioInCategory = useMemo(
    () => (audioData ? audioData.audio.filter((a) => a.category === slug) : []),
    [audioData, slug]
  );

  const audioTypes = useMemo(() => {
    const set = new Set(audioInCategory.map((a) => a.type).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [audioInCategory]);

  const filteredAudio = useMemo(() => {
    let items =
      audioType === 'all'
        ? audioInCategory
        : audioInCategory.filter((a) => a.type === audioType);

    if (audioSort === 'newest') {
      items = [...items].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (audioSort === 'oldest') {
      items = [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (audioSort === 'name-asc') {
      items = [...items].sort((a, b) => a.title.localeCompare(b.title));
    } else if (audioSort === 'name-desc') {
      items = [...items].sort((a, b) => b.title.localeCompare(a.title));
    }

    return items;
  }, [audioInCategory, audioType, audioSort]);

  // ============ RELEASES ============
  const releasesInCategory = useMemo(
    () => (releaseData ? releaseData.releases.filter((r) => r.category === slug) : []),
    [releaseData, slug]
  );

  const releaseTypes = useMemo(() => {
    const set = new Set(releasesInCategory.map((r) => r.type).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [releasesInCategory]);

  const filteredReleases = useMemo(() => {
    let items = releasesInCategory;
    if (releaseType !== 'all') {
      items = items.filter((r) => r.type === releaseType);
    }
    return [...items].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [releasesInCategory, releaseType]);

  // ============ GALLERY ============
  const galleryInCategory = useMemo(
    () => (galleryData ? galleryData.galleries.filter((g) => g.category === slug) : []),
    [galleryData, slug]
  );

  const gallerySeriesList = useMemo(() => {
    const set = new Set(galleryInCategory.map((g) => g.series).filter(Boolean));
    return ['all', ...Array.from(set)];
  }, [galleryInCategory]);

  const filteredGallery = useMemo(() => {
    let items =
      gallerySeriesFilter === 'all'
        ? galleryInCategory
        : galleryInCategory.filter((g) => g.series === gallerySeriesFilter);

    if (gallerySort === 'series-asc') {
      items = [...items].sort((a, b) => (a.series || '').localeCompare(b.series || ''));
    } else if (gallerySort === 'series-desc') {
      items = [...items].sort((a, b) => (b.series || '').localeCompare(a.series || ''));
    } else if (gallerySort === 'caption-asc') {
      items = [...items].sort((a, b) => (a.caption || '').localeCompare(b.caption || ''));
    }

    return items;
  }, [galleryInCategory, gallerySeriesFilter, gallerySort]);

  const handleAddToCart = (item) => {
    const cart = JSON.parse(localStorage.getItem('fv_cart') || '[]');
    const existing = cart.find((c) => c.id === item.id);
    if (existing) existing.qty += 1;
    else cart.push({ ...item, qty: 1 });
    localStorage.setItem('fv_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('fv-cart-update'));
  };

  return (
    <div className="fv-container" style={{ padding: '48px 24px 80px' }}>
      {/* Breadcrumbs */}
      <div
        style={{
          fontSize: 13,
          color: '#a8a8a8',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Link to="/" style={{ color: '#a8a8a8', display: 'flex', alignItems: 'center', gap: 6 }}>
          <FaHome style={{ fontSize: 12 }} /> Home
        </Link>
        <span>›</span>
        <span style={{ color: '#f5f5f5' }}>{data.name}</span>
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: 36 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: data.gradient,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            <Icon />
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 800,
              color: '#f5f5f5',
              margin: 0,
              letterSpacing: '0.01em',
              lineHeight: 1.15,
            }}
          >
            {data.name}
          </h1>
        </div>
        <p style={{ fontSize: 14, color: '#a0a0a0', margin: 0, fontFamily: 'Space Grotesk, sans-serif' }}>
          Articles, characters, events, trailers, videos, and more from this universe.
        </p>
      </motion.div>

      {/* Articles toolbar */}
      {activeTab === 'articles' && (
        <div style={{ marginBottom: 22 }}>
          <div
            style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 380 }}>
              <FaSearch
                style={{
                  position: 'absolute',
                  left: 14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#a8a8a8',
                  fontSize: 12,
                  pointerEvents: 'none',
                  zIndex: 1,
                }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search in ${data.name}…`}
                style={{
                  width: '100%',
                  height: 40,
                  padding: '0 14px 0 36px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(168, 85, 247, 0.3)',
                  borderRadius: 10,
                  color: '#f5f5f5',
                  fontSize: 13,
                  fontFamily: 'Space Grotesk, sans-serif',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.6)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)')}
              />
            </div>

            <SortSelect
              value={articleSort}
              onChange={setArticleSort}
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'popular', label: 'Most Popular' },
                { value: 'az', label: 'A-Z' },
                { value: 'za', label: 'Z-A' },
              ]}
            />

            {selectedTags.length > 0 && (
              <button
                onClick={clearTags}
                style={{
                  padding: '8px 14px',
                  fontSize: 12,
                  borderRadius: 8,
                  background: 'rgba(225, 29, 72, 0.15)',
                  border: '1px solid rgba(225, 29, 72, 0.5)',
                  color: '#fda4af',
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontWeight: 500,
                }}
              >
                <FaTimes style={{ fontSize: 10 }} />
                Clear {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''}
              </button>
            )}
          </div>

          {tagCounts.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                marginTop: 14,
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: '#a8a8a8',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 600,
                  marginRight: 4,
                }}
              >
                Tags
              </span>
              {tagCounts.map(([tag, count]) => {
                const isActive = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    style={{
                      padding: '5px 11px',
                      fontSize: 11,
                      borderRadius: 999,
                      background: isActive ? 'rgba(168, 85, 247, 0.18)' : 'rgba(255,255,255,0.04)',
                      border: isActive
                        ? '1px solid rgba(168, 85, 247, 0.8)'
                        : '1px solid rgba(168, 85, 247, 0.3)',
                      color: isActive ? '#c4b5fd' : '#a0a0a0',
                      cursor: 'pointer',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 500,
                      transition: 'all 0.15s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    #{tag}
                    <span style={{ opacity: 0.6, fontSize: 10 }}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="fv-tabs-wrapper" style={{ marginBottom: 32 }}>
        <AnimatedTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={(id) => {
            setActiveTab(id);
            if (id !== 'trailers') setTrailerStatus('all');
            if (id !== 'characters') setCharFranchise('all');
            if (id !== 'events') setEventType('all');
            if (id !== 'audio') setAudioType('all');
            if (id !== 'gallery') setGallerySeriesFilter('all');
            if (id !== 'merchandise') setMerchType('all');
          }}
          variant="underline"
        />
      </div>

      {/* Articles */}
      {activeTab === 'articles' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: 16,
          }}
        >
          {filteredContent.map((item, i) => (
            <ContentCard key={item.id} item={item} index={i} />
          ))}
          {filteredContent.length === 0 && <EmptyState />}
        </div>
      )}

      {/* Characters */}
      {activeTab === 'characters' && (
        <>
          {charTraits.length > 0 && charFranchise === 'all' && (
            <div
              style={{
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: '#a8a8a8',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 600,
                  marginRight: 4,
                }}
              >
                Traits
              </span>
              <button
                onClick={() => setCharTrait('all')}
                style={{
                  padding: '5px 11px',
                  fontSize: 11,
                  borderRadius: 999,
                  background: charTrait === 'all' ? 'rgba(34, 211, 238, 0.18)' : 'rgba(255,255,255,0.04)',
                  border:
                    charTrait === 'all'
                      ? '1px solid rgba(34, 211, 238, 0.8)'
                      : '1px solid rgba(34, 211, 238, 0.3)',
                  color: charTrait === 'all' ? '#67e8f9' : '#a0a0a0',
                  cursor: 'pointer',
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontWeight: 500,
                }}
              >
                All
              </button>
              {charTraits.map(([trait, count]) => {
                const isActive = charTrait === trait;
                return (
                  <button
                    key={trait}
                    onClick={() => setCharTrait(isActive ? 'all' : trait)}
                    style={{
                      padding: '5px 11px',
                      fontSize: 11,
                      borderRadius: 999,
                      background: isActive ? 'rgba(34, 211, 238, 0.18)' : 'rgba(255,255,255,0.04)',
                      border: isActive
                        ? '1px solid rgba(34, 211, 238, 0.8)'
                        : '1px solid rgba(34, 211, 238, 0.3)',
                      color: isActive ? '#67e8f9' : '#a0a0a0',
                      cursor: 'pointer',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 500,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    {trait}
                    <span style={{ opacity: 0.6, fontSize: 10 }}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            {charFranchise !== 'all' && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  marginBottom: 18,
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => setCharFranchise('all')}
                  style={{
                    padding: '7px 14px',
                    fontSize: 12,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#a0a0a0',
                    cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  ← All series
                </button>
                <h2
                  style={{
                    fontSize: 16,
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 700,
                    color: '#f5f5f5',
                    margin: 0,
                  }}
                >
                  {charFranchise}
                </h2>
                <span style={{ fontSize: 12, color: '#a8a8a8', fontFamily: 'Space Grotesk, sans-serif' }}>
                  {filteredChars.length} character{filteredChars.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
            {charFranchise !== 'all' && (
              <SortSelect
                value={charSort}
                onChange={setCharSort}
                options={[
                  { value: 'name-asc', label: 'Name A-Z' },
                  { value: 'name-desc', label: 'Name Z-A' },
                  { value: 'series', label: 'By Series' },
                ]}
              />
            )}
          </div>

          {charFranchise === 'all' ? (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 18,
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    color: '#a8a8a8',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 600,
                    marginRight: 4,
                  }}
                >
                  Filter by
                </span>
                <button
                  onClick={() => setCharFranchise('all')}
                  style={{
                    padding: '6px 12px',
                    fontSize: 12,
                    borderRadius: 999,
                    background: 'rgba(225, 29, 72, 0.15)',
                    border: '1px solid rgba(225, 29, 72, 0.5)',
                    color: '#fda4af',
                    cursor: 'pointer',
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 500,
                  }}
                >
                  All series ({allCharsInCategory.length})
                </button>
              </div>

              <SeriesGrid
                category={slug}
                series={franchises
                  .filter((f) => f !== 'all')
                  .map((name) => {
                    const chars = allCharsInCategory.filter((c) => c.series === name);
                    return { name, count: chars.length, sample: chars.map((c) => c.name) };
                  })}
                onSelect={setCharFranchise}
              />
              {allCharsInCategory.length === 0 && <EmptyState />}
            </>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              {filteredChars.map((char, i) => (
                <CharacterCard key={char.id} char={char} index={i} />
              ))}
              {filteredChars.length === 0 && <EmptyState />}
            </div>
          )}
        </>
      )}

      {/* Events */}
      {activeTab === 'events' && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              {eventTypes.length > 1 && (
                <FilterChips
                  label="Type"
                  options={eventTypes.map((t) => ({
                    id: t,
                    label: t === 'all' ? 'All' : t,
                    capitalize: true,
                  }))}
                  value={eventType}
                  onChange={setEventType}
                  color="#a855f7"
                  countFn={(id) =>
                    id === 'all'
                      ? eventsInCategory.length
                      : eventsInCategory.filter((e) => e.type === id).length
                  }
                />
              )}
            </div>
            <SortSelect
              value={eventSort}
              onChange={setEventSort}
              options={[
                { value: 'date-asc', label: 'Date: Soonest' },
                { value: 'date-desc', label: 'Date: Latest' },
                { value: 'name-asc', label: 'Name A-Z' },
                { value: 'name-desc', label: 'Name Z-A' },
              ]}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: 16,
            }}
          >
            {filteredEvents.map((ev, i) => (
              <EventCard key={ev.id} event={ev} index={i} />
            ))}
            {filteredEvents.length === 0 && <EmptyState />}
          </div>
        </>
      )}

      {/* Trailers */}
      {activeTab === 'trailers' && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'upcoming', label: 'Upcoming' },
                { id: 'released', label: 'Released' },
              ].map((s) => {
                const count =
                  s.id === 'all'
                    ? trailersInCategory.length
                    : trailersInCategory.filter((t) => t.releaseStatus === s.id).length;
                const isActive = trailerStatus === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setTrailerStatus(s.id)}
                    style={{
                      padding: '6px 14px',
                      fontSize: 12,
                      borderRadius: 8,
                      background: isActive ? 'rgba(225, 29, 72, 0.15)' : 'rgba(255,255,255,0.04)',
                      border: isActive
                        ? '1px solid rgba(225, 29, 72, 0.4)'
                        : '1px solid rgba(255,255,255,0.08)',
                      color: isActive ? '#fda4af' : '#a0a0a0',
                      cursor: 'pointer',
                      fontFamily: 'Space Grotesk, sans-serif',
                      fontWeight: 500,
                    }}
                  >
                    {s.label} <span style={{ opacity: 0.7, marginLeft: 4 }}>({count})</span>
                  </button>
                );
              })}
            </div>
            <SortSelect
              value={trailerSort}
              onChange={setTrailerSort}
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'name-asc', label: 'Name A-Z' },
                { value: 'name-desc', label: 'Name Z-A' },
              ]}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {filteredTrailers.map((t, i) => (
              <TrailerCard key={t.id} trailer={t} index={i} />
            ))}
            {filteredTrailers.length === 0 && <EmptyState />}
          </div>
        </>
      )}

      {/* Videos */}
      {activeTab === 'videos' && (
        <>
          {videoTypes.length > 1 && (
            <div style={{ marginBottom: 22 }}>
              <FilterChips
                label="Type"
                options={videoTypes.map((t) => ({
                  id: t,
                  label: t === 'all' ? 'All' : t,
                  capitalize: true,
                }))}
                value={videoType}
                onChange={setVideoType}
                color="#db2777"
                countFn={(id) =>
                  id === 'all'
                    ? videosInCategory.length
                    : videosInCategory.filter((v) => v.type === id).length
                }
              />
            </div>
          )}
          <VideosBrowser videos={filteredVideos} category={slug} />
        </>
      )}

      {/* Audio */}
      {activeTab === 'audio' && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              {audioTypes.length > 1 && (
                <FilterChips
                  label="Type"
                  options={audioTypes.map((t) => ({
                    id: t,
                    label: t === 'all' ? 'All' : t,
                    capitalize: true,
                  }))}
                  value={audioType}
                  onChange={setAudioType}
                  color="#a78bfa"
                  countFn={(id) =>
                    id === 'all'
                      ? audioInCategory.length
                      : audioInCategory.filter((a) => a.type === id).length
                  }
                />
              )}
            </div>
            <SortSelect
              value={audioSort}
              onChange={setAudioSort}
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'name-asc', label: 'Name A-Z' },
                { value: 'name-desc', label: 'Name Z-A' },
              ]}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {filteredAudio.map((a, i) => (
              <AudioCard key={a.id} audio={a} index={i} />
            ))}
            {filteredAudio.length === 0 && <EmptyState />}
          </div>
        </>
      )}

      {/* Gallery */}
      {activeTab === 'gallery' && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              {gallerySeriesList.length > 2 && (
                <FilterChips
                  label="Series"
                  options={gallerySeriesList.map((s) => ({
                    id: s,
                    label: s === 'all' ? 'All' : s,
                  }))}
                  value={gallerySeriesFilter}
                  onChange={setGallerySeriesFilter}
                  color="#22d3ee"
                  countFn={(id) =>
                    id === 'all'
                      ? galleryInCategory.length
                      : galleryInCategory.filter((g) => g.series === id).length
                  }
                />
              )}
            </div>
            <SortSelect
              value={gallerySort}
              onChange={setGallerySort}
              options={[
                { value: 'series-asc', label: 'Series A-Z' },
                { value: 'series-desc', label: 'Series Z-A' },
                { value: 'caption-asc', label: 'Caption A-Z' },
              ]}
            />
          </div>
          <GalleryGrid images={filteredGallery} />
        </>
      )}

      {/* Merchandise */}
      {activeTab === 'merchandise' && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              {merchTypes.length > 1 && (
                <FilterChips
                  label="Type"
                  options={merchTypes.map((t) => ({
                    id: t,
                    label: t === 'all' ? 'All' : t,
                    capitalize: true,
                  }))}
                  value={merchType}
                  onChange={setMerchType}
                  color="#f87171"
                  countFn={(id) =>
                    id === 'all'
                      ? merchInCategory.length
                      : merchInCategory.filter((m) => m.type === id).length
                  }
                />
              )}
            </div>
            <SortSelect
              value={merchSort}
              onChange={setMerchSort}
              options={[
                { value: 'default', label: 'Default' },
                { value: 'price-asc', label: 'Price: Low → High' },
                { value: 'price-desc', label: 'Price: High → Low' },
                { value: 'name-asc', label: 'Name A-Z' },
                { value: 'name-desc', label: 'Name Z-A' },
              ]}
            />
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {filteredMerch.map((item, i) => (
              <MerchandiseCard key={item.id} item={item} index={i} onAdd={handleAddToCart} />
            ))}
            {filteredMerch.length === 0 && <EmptyState />}
          </div>
        </>
      )}

      {/* Releases */}
      {activeTab === 'releases' && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 18,
            }}
          >
            <div style={{ flex: 1, minWidth: 200 }}>
              {releaseTypes.length > 1 && (
                <FilterChips
                  label="Type"
                  options={releaseTypes.map((t) => ({
                    id: t,
                    label: t === 'all' ? 'All' : t,
                    capitalize: true,
                  }))}
                  value={releaseType}
                  onChange={setReleaseType}
                  color="#60a5fa"
                  countFn={(id) =>
                    id === 'all'
                      ? releasesInCategory.length
                      : releasesInCategory.filter((r) => r.type === id).length
                  }
                />
              )}
            </div>
          </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredReleases.map((r) => (
              <ReleaseRow key={r.id} release={r} />
            ))}
            {filteredReleases.length === 0 && <EmptyState />}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="fv-card"
      style={{
        padding: 40,
        textAlign: 'center',
        color: '#a8a8a8',
        gridColumn: '1 / -1',
        fontSize: 14,
      }}
    >
      No content found. Try a different filter.
    </div>
  );
}