import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPlay } from 'react-icons/fa';
import VideoCard from './VideoCard';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

// ---- Series Poster Card (Anikoto-style, theme colors) ----
function SeriesPosterCard({ series, onClick, index }) {
  const [loaded, setLoaded] = useState(false);

  const hasMovie = series.videos.some((v) => v.type === 'movie');
  const hasEpisode = series.videos.some((v) => v.type === 'episode');
  const typeLabel = hasEpisode ? 'TV' : hasMovie ? 'MOVIE' : 'ONA';

  const epCount = series.videos.filter(
    (v) => v.type === 'episode' || v.type === 'gameplay' || v.type === 'full-season'
  ).length;
  const seasonCount = new Set(
    series.videos.filter((v) => v.season).map((v) => v.season)
  ).size;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -4 }}
      style={{
        padding: 0,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontFamily: 'inherit',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Poster */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '2 / 3',
          borderRadius: 10,
          overflow: 'hidden',
          background: '#0f0f12',
          border: '1px solid rgba(225, 29, 72, 0.15)',
          transition: 'border-color 0.2s ease',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.5)')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.15)')
        }
      >
        {/* Skeleton */}
        {!loaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(90deg, #0f0f12 0%, #1a1a1e 50%, #0f0f12 100%)',
              backgroundSize: '200% 100%',
              animation: 'fv-skeleton 1.5s ease-in-out infinite',
            }}
          />
        )}

        {/* Poster image */}
        {series.poster && (
          <img
            src={series.poster}
            alt={series.name}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: loaded ? 1 : 0,
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.9) 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top-left: seasons badge — theme red */}
        {seasonCount > 1 && (
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontSize: 9,
              padding: '3px 7px',
              borderRadius: 4,
              background: 'rgba(10, 10, 10, 0.85)',
              border: '1px solid rgba(225, 29, 72, 0.55)',
              color: '#fda4af',
              letterSpacing: '0.08em',
              fontWeight: 700,
              fontFamily: 'Orbitron, sans-serif',
              backdropFilter: 'blur(8px)',
            }}
          >
            {seasonCount} SEASONS
          </span>
        )}

        {/* Bottom row: theme-consistent badges */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            right: 8,
            display: 'flex',
            gap: 4,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {epCount > 0 && (
            <Badge variant="primary" label={`EP ${epCount}`} />
          )}
          <Badge variant="muted" label="HD" />
          <Badge variant="primary" label={typeLabel} />
        </div>

        {/* Hover play overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(2px)',
            pointerEvents: 'none',
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #e11d48, #a855f7)',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontSize: 15,
              paddingLeft: 3,
              boxShadow: '0 6px 20px rgba(225,29,72,0.6)',
            }}
          >
            <FaPlay />
          </span>
        </motion.div>
      </div>

      {/* Title below */}
      <h3
        style={{
          fontSize: 13,
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 600,
          color: '#f5f5f5',
          lineHeight: 1.3,
          margin: 0,
          letterSpacing: '0.01em',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {series.name}
      </h3>
    </motion.button>
  );
}

// ---- Theme-consistent badge ----
function Badge({ variant = 'primary', label }) {
  const styles = {
    primary: {
      border: '1px solid rgba(225, 29, 72, 0.5)',
      color: '#fda4af',
    },
    muted: {
      border: '1px solid rgba(255, 255, 255, 0.18)',
      color: '#cbd5e1',
    },
  };

  const s = styles[variant] || styles.primary;

  return (
    <span
      style={{
        fontSize: 9,
        padding: '3px 7px',
        borderRadius: 4,
        background: 'rgba(10, 10, 10, 0.85)',
        border: s.border,
        color: s.color,
        letterSpacing: '0.08em',
        fontWeight: 700,
        fontFamily: 'Orbitron, sans-serif',
        backdropFilter: 'blur(8px)',
      }}
    >
      {label}
    </span>
  );
}

// ---- Main Browser ----
export default function VideosBrowser({ videos, category }) {
  const [selectedSeries, setSelectedSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(1);

  const color = catColors[category] || '#e11d48';

  // Reset selection whenever the videos list changes (e.g., switching categories)
  useEffect(() => {
    setSelectedSeries(null);
    setSelectedSeason(1);
  }, [videos]);

  // Group videos by series
  const seriesGroups = useMemo(() => {
    const map = new Map();
    videos.forEach((v) => {
      if (!map.has(v.series)) {
        map.set(v.series, {
          name: v.series,
          videos: [],
          poster: v.poster || null,
        });
      }
      const group = map.get(v.series);
      group.videos.push(v);
      if (!group.poster && v.poster) group.poster = v.poster;
    });
    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [videos]);

  const currentSeries = selectedSeries
    ? seriesGroups.find((g) => g.name === selectedSeries)
    : null;

  // Seasons within selected series
  const seasons = useMemo(() => {
    if (!currentSeries) return [];
    const set = new Set(
      currentSeries.videos
        .filter((v) => v.season)
        .map((v) => v.season)
    );
    return Array.from(set).sort((a, b) => a - b);
  }, [currentSeries]);

  // Episodes / items in selected season
  const seasonVideos = useMemo(() => {
    if (!currentSeries) return [];
    const withSeason = currentSeries.videos.filter((v) => v.season);
    const withoutSeason = currentSeries.videos.filter((v) => !v.season);

    if (withSeason.length === 0) {
      return withoutSeason;
    }

    const inSeason = withSeason.filter((v) => v.season === selectedSeason);
    const sortKey = (v) => v.episodeNumber ?? -1; // full-season entries (-1) come first
    return [...inSeason].sort((a, b) => sortKey(a) - sortKey(b));
  }, [currentSeries, selectedSeason]);

  // Extras (movies/specials)
  const extras = useMemo(() => {
    if (!currentSeries) return [];
    return currentSeries.videos.filter((v) => !v.season);
  }, [currentSeries]);

  // ---- View 1: Series grid ----
  if (!selectedSeries || !currentSeries) {
    if (seriesGroups.length === 0) {
      return (
        <div
          className="fv-card"
          style={{
            padding: 40,
            textAlign: 'center',
            color: '#a8a8a8',
            fontSize: 14,
          }}
        >
          No videos yet for this category.
        </div>
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 18,
        }}
      >
        {seriesGroups.map((s, i) => (
          <SeriesPosterCard
            key={s.name}
            series={s}
            index={i}
            onClick={() => {
              setSelectedSeries(s.name);
              const firstSeason = s.videos.find((v) => v.season)?.season;
              setSelectedSeason(firstSeason ?? 1);
            }}
          />
        ))}
      </motion.div>
    );
  }

  // ---- View 2: Series episodes ----
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedSeries}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.3 }}
      >
        {/* Back + header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setSelectedSeries(null)}
            style={{
              padding: '8px 14px',
              fontSize: 12,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#cbd5e1',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 500,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(225, 29, 72, 0.5)';
              e.currentTarget.style.color = '#fda4af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
          >
            <FaArrowLeft style={{ fontSize: 10 }} /> All series
          </button>
          <h2
            style={{
              fontSize: 'clamp(1.2rem, 2vw, 1.5rem)',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              color: '#f5f5f5',
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            {currentSeries.name}
          </h2>
          <span
            style={{
              fontSize: 12,
              color: '#a8a8a8',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {currentSeries.videos.length} video
            {currentSeries.videos.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Season tabs */}
        {seasons.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: 6,
              flexWrap: 'wrap',
              marginBottom: 24,
              paddingBottom: 16,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            {seasons.map((s) => {
              const isActive = s === selectedSeason;
              const label =
                currentSeries.videos.find((v) => v.season === s)?.seasonLabel ||
                `Season ${s}`;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSeason(s)}
                  style={{
                    padding: '8px 18px',
                    fontSize: 13,
                    borderRadius: 8,
                    background: isActive
                      ? 'rgba(225, 29, 72, 0.15)'
                      : 'rgba(255,255,255,0.04)',
                    border: isActive
                      ? '1px solid rgba(225, 29, 72, 0.5)'
                      : '1px solid rgba(255,255,255,0.08)',
                    color: isActive ? '#fda4af' : '#a0a0a0',
                    cursor: 'pointer',
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 600,
                    letterSpacing: '0.04em',
                    transition: 'all 0.15s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Episode grid */}
        {seasonVideos.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 18,
              marginBottom: extras.length > 0 ? 40 : 0,
            }}
          >
            {seasonVideos.map((v, i) => (
              <VideoCard key={v.id} video={v} index={i} />
            ))}
          </div>
        ) : (
          <div
            className="fv-card"
            style={{
              padding: 40,
              textAlign: 'center',
              color: '#a8a8a8',
              fontSize: 14,
            }}
          >
            No episodes in this season.
          </div>
        )}

        {/* Extras */}
        {extras.length > 0 && seasons.length > 0 && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 18,
                marginTop: 8,
              }}
            >
              <span
                style={{
                  width: 3,
                  height: 20,
                  borderRadius: 2,
                  background: 'linear-gradient(180deg, #e11d48, #a855f7)',
                }}
              />
              <h3
                style={{
                  fontSize: 14,
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 700,
                  color: '#f5f5f5',
                  margin: 0,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                Movies & Specials
              </h3>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 18,
              }}
            >
              {extras.map((v, i) => (
                <VideoCard key={v.id} video={v} index={i} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
}