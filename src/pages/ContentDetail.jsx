import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FaHome,
  FaArrowLeft,
  FaBookmark,
  FaRegBookmark,
  FaHeart,
  FaRegHeart,
  FaCalendarAlt,
  FaFire,
  FaStickyNote,
  FaSave,
} from 'react-icons/fa';
import { useData } from '../hooks/useData';
import ContentCard from '../components/ContentCard';
import ShareButtons from '../components/ShareButtons';
import ArticleTrailer from '../components/ArticleTrailer';
import StoreLinks from '../components/StoreLinks';
import WatchLinks from '../components/WatchLinks';

const categoryData = {
  anime: { name: 'Anime', color: '#f472b6' },
  gaming: { name: 'Gaming', color: '#60a5fa' },
  movies: { name: 'Movies', color: '#fbbf24' },
  'tv-shows': { name: 'TV Shows', color: '#34d399' },
  kpop: { name: 'K-Pop', color: '#a78bfa' },
  comics: { name: 'Comics', color: '#f87171' },
  manga: { name: 'Manga', color: '#22d3ee' },
};

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useData('content');
  const { data: trailerData } = useData('trailers');
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const item = useMemo(() => {
    if (!data) return null;
    return data.content.find((c) => c.id === id);
  }, [data, id]);

  // Final banner — direct from JSON (banner field), fallback to image
  const finalBanner = item?.banner || item?.image || '';

  useEffect(() => {
    if (!item) return;
    const saved = JSON.parse(localStorage.getItem('fv_bookmarks') || '[]');
    setBookmarked(saved.some((b) => b.id === item.id));
  }, [item]);

  // Find best matching trailer — smarter scoring
  const matchedTrailer = useMemo(() => {
    if (!trailerData?.trailers || !item) return null;

    const candidates = trailerData.trailers.filter(
      (t) => t.category === item.category
    );
    if (candidates.length === 0) return null;

    const articleText = (
      item.title +
      ' ' +
      (item.series || '') +
      ' ' +
      (item.tags || []).join(' ')
    ).toLowerCase();

    const articleWords = articleText
      .split(/\W+/)
      .filter((w) => w.length >= 2);

    let best = null;
    let bestScore = 0;

    candidates.forEach((t) => {
      const tText = (
        (t.title || '') + ' ' + (t.series || '')
      ).toLowerCase();
      const tWords = tText.split(/\W+/).filter((w) => w.length >= 2);

      let score = 0;

      if (item.series && t.series && item.series === t.series) {
        score += 50;
      }

      if (item.series && tText.includes(item.series.toLowerCase())) {
        score += 20;
      }

      score += tWords.filter((w) => articleWords.includes(w)).length;

      if (
        item.title &&
        t.title &&
        (t.title.toLowerCase().includes(item.title.toLowerCase()) ||
          item.title.toLowerCase().includes(t.title.toLowerCase()))
      ) {
        score += 15;
      }

      if (score > bestScore) {
        bestScore = score;
        best = t;
      }
    });

    return bestScore > 0 ? best : null;
  }, [trailerData, item]);

  const toggleBookmark = () => {
    if (!item) return;
    const saved = JSON.parse(localStorage.getItem('fv_bookmarks') || '[]');
    let updated;
    if (bookmarked) {
      updated = saved.filter((b) => b.id !== item.id);
    } else {
      updated = [
        ...saved,
        {
          id: item.id,
          title: item.title,
          type: item.type,
          category: item.category,
          image: finalBanner || item.image,
        },
      ];
    }
    localStorage.setItem('fv_bookmarks', JSON.stringify(updated));
    setBookmarked(!bookmarked);
    window.dispatchEvent(new Event('fv-bookmarks-update'));
  };

  if (loading) {
    return (
      <div
        className="fv-container"
        style={{ padding: '120px 24px', textAlign: 'center', color: '#a8a8a8' }}
      >
        Loading...
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className="fv-container"
        style={{ padding: '120px 24px', textAlign: 'center' }}
      >
        <h1
          style={{
            fontFamily: 'Orbitron, sans-serif',
            marginBottom: 16,
            color: '#f5f5f5',
          }}
        >
          Content Not Found
        </h1>
        <p style={{ color: '#a0a0a0', marginBottom: 24 }}>
          The article you're looking for doesn't exist.
        </p>
        <Link to="/" className="fv-btn fv-btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const cat = categoryData[item.category] || {
    name: 'Unknown',
    color: '#e11d48',
  };

  const related = data.content
    .filter((c) => c.category === item.category && c.id !== item.id)
    .slice(0, 3);

  return (
    <div>
      {/* ============ BANNER ============ */}
      <div
        className="fv-detail-banner"
        style={{
          position: 'relative',
          width: '100%',
          height: 'clamp(320px, 42vw, 480px)',
          overflow: 'hidden',
          background: '#151518',
        }}
      >
        <img
          key={finalBanner}
          src={finalBanner}
          alt={item.title}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.3) 40%, rgba(10,10,10,0.85) 75%, rgba(10,10,10,1) 100%)',
          }}
        />

        <div
          className="fv-container"
          style={{
            position: 'absolute',
            top: 24,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            zIndex: 2,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="fv-btn fv-btn-ghost"
            style={{
              padding: '7px 14px',
              fontSize: 12,
              gap: 6,
              background: 'rgba(10,10,10,0.6)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <FaArrowLeft style={{ fontSize: 10 }} /> Back
          </button>
          <div
            style={{
              fontSize: 13,
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
              textShadow: '0 1px 8px rgba(0,0,0,0.8)',
            }}
          >
            <Link
              to="/"
              style={{
                color: '#cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <FaHome style={{ fontSize: 12 }} /> Home
            </Link>
            <span>›</span>
            <Link to={`/category/${item.category}`} style={{ color: '#cbd5e1' }}>
              {cat.name}
            </Link>
          </div>
        </div>

        <div
          className="fv-container"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingBottom: 40,
            zIndex: 2,
            maxWidth: 900,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  padding: '5px 12px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#f5f5f5',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontFamily: 'Orbitron, sans-serif',
                }}
              >
                {cat.name}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: '5px 12px',
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#cbd5e1',
                  letterSpacing: '0.05em',
                  textTransform: 'capitalize',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                {item.type}
              </span>
            </div>

            <h1
              className="fv-detail-title"
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 800,
                letterSpacing: '0.005em',
                lineHeight: 1.12,
                marginBottom: 18,
                color: '#ffffff',
                textShadow: '0 2px 24px rgba(0,0,0,0.6)',
              }}
            >
              {item.title}
            </h1>

            <div
              style={{
                display: 'flex',
                gap: 20,
                alignItems: 'center',
                flexWrap: 'wrap',
                fontSize: 13,
                color: '#cbd5e1',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FaCalendarAlt style={{ color: '#fda4af' }} />
                {new Date(item.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <FaFire style={{ color: '#fda4af' }} />
                {item.popularity} popularity
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============ TWO-COLUMN CONTENT ============ */}
      <div
        className="fv-container fv-detail-content"
        style={{ padding: '48px 24px 80px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="fv-article-layout"
          style={{
            display: 'grid',
            gridTemplateColumns: matchedTrailer ? 'minmax(0, 1fr) minmax(0, 1fr)' : '1fr',
            gap: 48,
            alignItems: 'flex-start',
          }}
        >
          {/* ============ LEFT COLUMN: ARTICLE ============ */}
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                display: 'flex',
                gap: 10,
                marginBottom: 32,
                paddingBottom: 24,
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => setLiked(!liked)}
                className="fv-btn fv-btn-ghost"
                style={{
                  gap: 8,
                  color: liked ? '#e11d48' : undefined,
                  borderColor: liked ? 'rgba(225, 29, 72, 0.5)' : undefined,
                }}
              >
                {liked ? <FaHeart /> : <FaRegHeart />}
                {liked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={toggleBookmark}
                className="fv-btn fv-btn-ghost"
                style={{
                  gap: 8,
                  color: bookmarked ? '#fbbf24' : undefined,
                  borderColor: bookmarked ? 'rgba(251, 191, 36, 0.5)' : undefined,
                }}
              >
                {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                {bookmarked ? 'Bookmarked' : 'Bookmark'}
              </button>
              <div style={{ marginLeft: 'auto' }}>
                <ShareButtons title={item.title} />
              </div>
            </div>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#cbd5e1',
                lineHeight: 1.7,
                marginBottom: 32,
                fontWeight: 400,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              {item.excerpt}
            </p>

            <div
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.85,
                color: '#d8dce8',
                fontFamily: 'Space Grotesk, sans-serif',
                marginBottom: 40,
              }}
            >
              {item.body}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                  marginBottom: 40,
                  paddingTop: 24,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 12,
                      padding: '5px 12px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#a0a0a0',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {item.category === 'gaming' && (
              <StoreLinks series={item.series} title={item.title} />
            )}

            {item.category !== 'gaming' && (
              <WatchLinks
                title={item.title}
                series={item.series}
                category={item.category}
              />
            )}

            <NotesSection contentId={item.id} />
          </div>

          {/* ============ RIGHT COLUMN: STICKY VIDEO ============ */}
          {matchedTrailer && (
            <div
              className="fv-article-sidebar"
              style={{
                position: 'sticky',
                top: 96,
                alignSelf: 'flex-start',
              }}
            >
              <ArticleTrailer trailer={matchedTrailer} />

              <div
                style={{
                  marginTop: 24,
                  padding: 18,
                  background: '#151518',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: '#a8a8a8',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 600,
                    marginBottom: 12,
                  }}
                >
                  About this article
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    fontSize: 12,
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: '#cbd5e1',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a8a8a8' }}>Category</span>
                    <span style={{ color: '#f5f5f5', fontWeight: 600 }}>
                      {cat.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a8a8a8' }}>Type</span>
                    <span
                      style={{
                        color: '#f5f5f5',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    >
                      {item.type}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a8a8a8' }}>Popularity</span>
                    <span style={{ color: '#f5f5f5', fontWeight: 600 }}>
                      {item.popularity}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#a8a8a8' }}>Published</span>
                    <span style={{ color: '#f5f5f5', fontWeight: 600 }}>
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                marginBottom: 24,
              }}
            >
              <span
                style={{
                  width: 3,
                  height: 24,
                  borderRadius: 2,
                  background: 'linear-gradient(180deg, #e11d48, #a855f7)',
                }}
              />
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
                More from {cat.name}
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: 16,
              }}
            >
              {related.map((r, i) => (
                <ContentCard key={`related-${r.id}`} item={r} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .fv-article-layout {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .fv-article-sidebar {
            position: static !important;
            top: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

function NotesSection({ contentId }) {
  const key = `fv_note_article_${contentId}`;
  const [note, setNote] = useState(() => sessionStorage.getItem(key) || '');
  const [saved, setSaved] = useState(false);

  const save = () => {
    sessionStorage.setItem(key, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div
      style={{
        marginTop: 40,
        paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <FaStickyNote style={{ color: '#fbbf24', fontSize: 13 }} />
        <span
          style={{
            fontSize: 12,
            fontFamily: 'Orbitron, sans-serif',
            color: '#fbbf24',
            letterSpacing: '0.12em',
            fontWeight: 600,
          }}
        >
          PERSONAL NOTES
        </span>
        <span style={{ fontSize: 11, color: '#a8a8a8' }}>
          (session only — cleared on refresh)
        </span>
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot down your thoughts about this article..."
        rows={4}
        style={{
          width: '100%',
          padding: 14,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10,
          color: '#f5f5f5',
          fontSize: 13,
          outline: 'none',
          fontFamily: 'Space Grotesk, sans-serif',
          resize: 'vertical',
          lineHeight: 1.6,
        }}
      />
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 10,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={save}
          className="fv-btn fv-btn-primary"
          style={{ gap: 8, padding: '8px 16px', fontSize: 12 }}
        >
          <FaSave /> Save Note
        </button>
        {saved && (
          <span style={{ fontSize: 12, color: '#34d399' }}>
            ✓ Saved to session
          </span>
        )}
      </div>
    </div>
  );
}