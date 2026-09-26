import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import HeroBanner from '../components/HeroBanner';
import HoverExpand from '../components/HoverExpand';
import ReleasesCalendar from '../components/ReleasesCalendar';
import TrendingSidebar from '../components/TrendingSidebar';
import QuickStrip from '../components/QuickStrip';
import MixedFeed from '../components/MixedFeed';
import CategoryRow from '../components/CategoryRow';
import FeaturedCarousel from '../components/FeaturedCarousel';
import IntroVideoBackground from '../components/IntroVideoBackground';
import { useData } from '../hooks/useData';

function getHeroMix(allContent) {
  if (!allContent || allContent.length === 0) return [];

  const categories = ['anime', 'gaming', 'movies', 'tv-shows', 'kpop', 'comics', 'manga'];
  const mixed = [];

  for (const cat of categories) {
    const top = allContent
      .filter((a) => a.category === cat)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 1);
    mixed.push(...top);
  }

  for (const cat of categories) {
    const second = allContent
      .filter((a) => a.category === cat)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(1, 2);
    mixed.push(...second);
  }

  for (const cat of ['anime', 'gaming', 'movies', 'tv-shows']) {
    const third = allContent
      .filter((a) => a.category === cat)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(2, 3);
    mixed.push(...third);
  }

  const shuffled = [];
  const buckets = {};
  mixed.forEach((item) => {
    if (!buckets[item.category]) buckets[item.category] = [];
    buckets[item.category].push(item);
  });

  let hasMore = true;
  while (hasMore) {
    hasMore = false;
    for (const cat of categories) {
      if (buckets[cat] && buckets[cat].length > 0) {
        shuffled.push(buckets[cat].shift());
        hasMore = true;
      }
    }
  }

  return shuffled.slice(0, 15);
}

const categories = [
  { name: 'Anime', path: '/category/anime', gradient: 'linear-gradient(135deg, #f472b6, #db2777)', subtitle: '100 characters · 24 articles', image: '/images/banners/demon-slayer.jpg' },
  { name: 'Gaming', path: '/category/gaming', gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)', subtitle: '16 games · 16 trailers', image: '/images/banners/gta-v.jpg' },
  { name: 'Movies', path: '/category/movies', gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)', subtitle: '20 movies · 24 trailers', image: '/images/banners/dune.jpg' },
  { name: 'TV Shows', path: '/category/tv-shows', gradient: 'linear-gradient(135deg, #34d399, #059669)', subtitle: '16 shows · 40 episodes', image: '/images/banners/stranger-things.jpg' },
  { name: 'K-Pop', path: '/category/kpop', gradient: 'linear-gradient(135deg, #a78bfa, #7c3aed)', subtitle: '20 groups · 40 MVs', image: '/images/banners/bts.jpg' },
  { name: 'Comics', path: '/category/comics', gradient: 'linear-gradient(135deg, #f87171, #dc2626)', subtitle: 'Marvel · DC · indie', image: '/images/banners/batman.jpg' },
  { name: 'Manga', path: '/category/manga', gradient: 'linear-gradient(135deg, #22d3ee, #0891b2)', subtitle: '40 volumes · 40 articles', image: '/images/banners/one-piece.jpg' },
];

// ⭐ Event category fallbacks
const EVENT_FALLBACKS = {
  anime: '/images/banners/demon-slayer.jpg',
  gaming: '/images/banners/gta-v.jpg',
  movies: '/images/banners/dune.jpg',
  'tv-shows': '/images/banners/stranger-things.jpg',
  kpop: '/images/banners/bts.jpg',
  comics: '/images/banners/x-men.jpg',
  manga: '/images/banners/one-piece.jpg',
};

const showcaseItems = [
  {
    id: 'anime',
    category: 'anime',
    series: 'Demon Slayer',         // ← ADD THIS
    tag: 'Trending Now',
    count: '24 articles · 100 characters · 20 trailers',
    title: 'Anime Universe',
    description: 'From shonen classics to seasonal hits — dive into character profiles, episode breakdowns and fan theories.',
    image: '/images/banners/demon-slayer.jpg',
    accent: 'linear-gradient(135deg, #f472b6, #db2777)',
    bg: 'linear-gradient(135deg, #2a0a1e, #0a0d18)',
    cta: 'Explore Anime',
  },
  {
    id: 'gaming',
    category: 'gaming',
    series: 'GTA V',                // ← ADD
    tag: 'Featured',
    count: '16 games · 16 trailers · 5 podcasts',
    title: 'Gaming Hub',
    description: 'Latest releases, esports highlights, and deep-dive reviews across PC, console, and mobile.',
    image: '/images/banners/gta-v.jpg',
    accent: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    bg: 'linear-gradient(135deg, #0a1530, #0a0d18)',
    cta: 'Enter the Arena',
  },
  {
    id: 'movies',
    category: 'movies',
    series: 'Dune',                 // ← ADD
    tag: 'Now Showing',
    count: '20 movies · 24 trailers · 10 essays',
    title: 'Cinema & TV',
    description: 'Blockbusters, indie gems, and binge-worthy series — trailers, reviews, and watchlists.',
    image: '/images/banners/dune.jpg',
    accent: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    bg: 'linear-gradient(135deg, #2a1e05, #0a0d18)',
    cta: 'See Trailers',
  },
  {
    id: 'kpop',
    category: 'kpop',
    series: 'BTS',                  // ← ADD
    tag: 'Hot Take',
    count: '20 groups · 40 MVs · 10 podcasts',
    title: 'K-Pop Wave',
    description: 'Comebacks, chart toppers, and fan events — all the beats in one place.',
    image: '/images/banners/blackpink.jpg',
    accent: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
    bg: 'linear-gradient(135deg, #1a0a30, #0a0d18)',
    cta: 'Join the Wave',
  },
  {
    id: 'comics',
    category: 'comics',
    series: 'The Batman',           // ← ADD
    tag: 'Fan Favorite',
    count: '20 series · 40 characters · 10 essays',
    title: 'Comics & Manga',
    description: 'Panels, series, and story arcs — from Marvel to indie webcomics.',
    image: '/images/banners/batman.jpg',
    accent: 'linear-gradient(135deg, #f87171, #dc2626)',
    bg: 'linear-gradient(135deg, #2a0808, #0a0d18)',
    cta: 'Read Now',
  },
];

function SectionHeader({ title, subtitle, actionTo, actionLabel }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 28,
        flexWrap: 'wrap',
      }}
    >
      <div>
        <h2 className="fv-section-title" style={{ marginBottom: subtitle ? 6 : 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p className="fv-section-sub" style={{ margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actionTo && (
        <Link
          to={actionTo}
          className="fv-btn fv-btn-ghost"
          style={{ padding: '8px 16px', fontSize: 13, gap: 6, flexShrink: 0 }}
        >
          {actionLabel || 'View all'} <FaArrowRight style={{ fontSize: 10 }} />
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const { data: contentData } = useData('content');
  const { data: releaseData } = useData('releases');
  const { data: trailerData } = useData('trailers');
  const { data: audioData } = useData('audio');
  const { data: eventData } = useData('events');    // ⭐ ADD
  const { data: charData } = useData('characters');

  const articlesByCategory = (cat) =>
    (contentData?.content || []).filter((c) => c.category === cat);

  // ⭐ Mix articles + characters + trailers for richer CategoryRows
  const buildCategoryMix = (cat) => {
    const articles = (contentData?.content || [])
      .filter((c) => c.category === cat)
      .slice(0, 6)
      .map((a) => ({ ...a, _kind: 'article' }));

    const characters = (charData?.characters || [])
      .filter((c) => c.category === cat)
      .slice(0, 3)
      .map((c) => ({
        id: `char-${c.id}`,
        _kind: 'character',
        title: c.name,
        excerpt: c.bio,
        category: c.category,
        series: c.series,
        image: null,
        banner: `/images/banners/${c.series
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')}.jpg`,
        date: '2026-01-01',
        type: 'character',
      }));

    const trailers = (trailerData?.trailers || [])
      .filter((t) => t.category === cat)
      .slice(0, 3)
      .map((t) => ({
        id: `trail-${t.id}`,
        _kind: 'trailer',
        title: t.title,
        excerpt: `${t.releaseStatus === 'upcoming' ? 'Upcoming' : 'Released'} trailer`,
        category: t.category,
        image: `https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg`,
        date: t.date,
        type: 'trailer',
      }));

    // Interleave: article, character, trailer, article, article, character, ...
    const mixed = [];
    const buckets = [articles, characters, trailers];
    let i = 0;
    while (mixed.length < 12) {
      let added = false;
      for (const b of buckets) {
        if (b[i]) {
          mixed.push(b[i]);
          added = true;
        }
      }
      if (!added) break;
      i++;
    }
    return mixed;
  };

  const featuredItems = useMemo(() => {
    if (!contentData?.content) return [];

    // ---- Articles ----
    let articles = contentData.content.filter((c) => c.featured);
    if (articles.length >= 5) {
      articles = articles.slice(0, 6);
    } else {
      articles = [...contentData.content]
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, 6);
    }
    const articleItems = articles.map((a) => ({
      ...a,
      _kind: 'article',
      _linkTo: `/content/${a.id}`,
      _cta: 'Read Article',
    }));

    // ---- Trailers ----
    const trailerItems = (trailerData?.trailers || [])
      .filter((t) => t.releaseStatus === 'upcoming')
      .slice(0, 2)
      .map((t) => ({
        id: `t-${t.id}`,
        _kind: 'trailer',
        _linkTo: `/category/${t.category}`,
        _cta: 'Watch Trailer',
        title: t.title,
        category: t.category,
        series: t.series,
        excerpt: `Upcoming trailer · ${t.category}`,
        image: `https://img.youtube.com/vi/${t.youtubeId}/hqdefault.jpg`,
        banner: `https://img.youtube.com/vi/${t.youtubeId}/maxresdefault.jpg`,
        date: t.date,
      }));

    // ---- Events ----
    const eventItems = (eventData?.events || [])
      .filter((e) => new Date(e.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2)
      .map((e) => ({
        id: `e-${e.id}`,
        _kind: 'event',
        _linkTo: `/category/${e.category}`,
        _cta: 'View Event',
        title: e.title,
        category: e.category,
        excerpt: `${e.location} · ${e.type || 'Event'}`,
        image: EVENT_FALLBACKS[e.category],
        banner: EVENT_FALLBACKS[e.category],
        date: e.date,
      }));

    return [...articleItems, ...trailerItems, ...eventItems];
  }, [contentData, trailerData, eventData]);
  return (
    <div>
      {/* ============ INTRODUCTION (SRS Required) ============ */}
      <section
        className="fv-intro-section"
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          padding: '60px 24px 60px',
          marginBottom: 48,
        }}
      >
        {/* Full-width video background */}
        <IntroVideoBackground videoId="VQRLujxTm3c" />

        {/* Content wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1100,
            margin: '0 auto',
          }}
        >
          {/* FLEX ROW: Orb left + Text right */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {/* Text content */}
            <div
              style={{
                flex: '1 1 100%',
                maxWidth: 780,
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
              }}
            >
              {/* Small label — looping word-by-word reveal */}
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: '0.24em',
                  textTransform: 'uppercase',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 700,
                  color: '#f97316',
                  marginBottom: 14,
                  alignSelf: 'flex-start',
                  display: 'flex',
                  gap: 8,
                  flexWrap: 'wrap',
                }}
              >
                {['Fandom,', 'all', 'in', 'one', 'place'].map((word, i) => (
                  <motion.span
                    key={word + i}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      y: [6, 0, 0, -4],
                      filter: ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(4px)'],
                    }}
                    transition={{
                      duration: 1.5,
                      times: [0, 0.15, 0.75, 1],
                      delay: i * 0.12,
                      repeat: Infinity,
                      repeatDelay: 0.2,
                      ease: 'easeInOut',
                    }}
                    style={{ display: 'inline-block' }}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  fontSize: 'clamp(1.7rem, 3.2vw, 2.5rem)',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: '0.005em',
                  marginBottom: 16,
                  color: '#f5f5f5',
                  textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                }}
              >
                Seven fandoms.
                <br />
                One place to keep up.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                style={{
                  fontSize: 'clamp(0.92rem, 1.2vw, 1rem)',
                  color: '#b8b0d0',
                  lineHeight: 1.75,
                  marginBottom: 22,
                  fontFamily: 'Space Grotesk, sans-serif',
                  maxWidth: 560,
                }}
              >
                FandomVerse pulls together articles, character profiles, trailers,
                videos, events, and merchandise from{' '}
                <strong style={{ color: '#e5e7eb', fontWeight: 600 }}>Anime</strong>,{' '}
                <strong style={{ color: '#e5e7eb', fontWeight: 600 }}>Gaming</strong>,{' '}
                <strong style={{ color: '#e5e7eb', fontWeight: 600 }}>Movies</strong>,{' '}
                <strong style={{ color: '#e5e7eb', fontWeight: 600 }}>TV</strong>,{' '}
                <strong style={{ color: '#e5e7eb', fontWeight: 600 }}>K-Pop</strong>,{' '}
                <strong style={{ color: '#e5e7eb', fontWeight: 600 }}>Comics</strong>,
                and{' '}
                <strong style={{ color: '#e5e7eb', fontWeight: 600 }}>Manga</strong> — one
                portal, no more tab-hopping.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                style={{
                  display: 'flex',
                  gap: 20,
                  flexWrap: 'wrap',
                  marginBottom: 24,
                  fontFamily: 'Space Grotesk, sans-serif',
                  fontSize: 13,
                }}
              >
                {['Articles', 'Characters', 'Trailers', 'Videos', 'Podcasts', 'Merch', 'Events'].map(
                  (label, i, arr) => (
                    <span
                      key={label}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 20,
                        color: '#8a8a8a',
                      }}
                    >
                      {label}
                      {i < arr.length - 1 && (
                        <span style={{ color: '#2a2a2a', marginLeft: -4 }}>·</span>
                      )}
                    </span>
                  )
                )}
              </motion.div>
            </div>
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              gap: 'clamp(16px, 3vw, 48px)',
              flexWrap: 'wrap',
              marginTop: 32,
              paddingTop: 24,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              maxWidth: 900,
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            {[
              { value: '246', label: 'Articles' },
              { value: '100+', label: 'Characters' },
              { value: '119', label: 'Videos' },
              { value: '22', label: 'K-Pop Groups' },
              { value: '7', label: 'Universes' },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 800,
                    fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)',
                    background: 'linear-gradient(90deg, #fca5a5, #fdba74)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: '#7d7d7d',
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ============ HERO ============ */}
      {contentData?.content?.length > 0 && (
        <section style={{ padding: '8px 0 48px' }}>
          <HeroBanner items={getHeroMix(contentData.content)} />
        </section>
      )}

      {/* ============ FEATURED CAROUSEL ============ */}
      {featuredItems.length > 0 && (
        <section className="fv-container" style={{ padding: '0 24px 60px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              title="Featured this week"
              subtitle="Hand-picked highlights from across the multiverse."
              actionTo="/search"
              actionLabel="See all"
            />
            <FeaturedCarousel items={featuredItems} />
          </motion.div>
        </section>
      )}

      {/* ============ MIXED FEED ============ */}
      {contentData?.content?.length > 0 && (
        <section className="fv-container" style={{ padding: '0 24px 80px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <SectionHeader
              title="Latest across FandomVerse"
              subtitle="Fresh drops from every universe — articles, trailers, and podcasts."
              actionTo="/search"
              actionLabel="Browse all"
            />
            <MixedFeed
              contentData={contentData}
              trailerData={trailerData}
              audioData={audioData}
            />
          </motion.div>
        </section>
      )}

      {/* ============ TRENDING + QUICK STRIPS ============ */}
      {contentData?.content?.length > 0 && (
        <section className="fv-container" style={{ padding: '0 24px 80px' }}>
          <div
            className="fv-home-2col"
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1fr) 360px',
              gap: 32,
              alignItems: 'flex-start',
            }}
          >
            <div
              className="fv-quick-strips"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 32,
                background: '#151518',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 16,
                padding: 28,
              }}
            >
              <QuickStrip
                title="New Articles"
                items={(contentData?.content || []).slice(0, 5)}
              />
              <QuickStrip
                title="New Trailers"
                items={(trailerData?.trailers || []).slice(0, 5).map((t) => ({
                  ...t,
                  image: `https://img.youtube.com/vi/${t.youtubeId}/mqdefault.jpg`,
                  linkType: 'trailer',
                }))}
              />
              <QuickStrip
                title="New Audio"
                items={(audioData?.audio || []).slice(0, 5)}
              />
            </div>

            <div className="fv-trending-col">
              <TrendingSidebar items={contentData.content} limit={10} />
            </div>
          </div>
        </section>
      )}

      {/* ============ CATEGORY ROWS (mixed content) ============ */}
      {contentData?.content && (
        <>
          <CategoryRow category="anime" items={buildCategoryMix('anime')} limit={12} />
          <CategoryRow category="gaming" items={buildCategoryMix('gaming')} limit={12} />
          <CategoryRow category="movies" items={buildCategoryMix('movies')} limit={12} />
          <CategoryRow category="tv-shows" items={buildCategoryMix('tv-shows')} limit={12} />
          <CategoryRow category="kpop" items={buildCategoryMix('kpop')} limit={12} />
          <CategoryRow category="comics" items={buildCategoryMix('comics')} limit={12} />
          <CategoryRow category="manga" items={buildCategoryMix('manga')} limit={12} />
        </>
      )}

      {/* ============ DISCOVER YOUR FANDOM ============ */}
      <section className="fv-container" style={{ padding: '32px 24px 100px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <SectionHeader
            title="Discover Your Fandom"
            subtitle="Hover over a panel to explore what's inside."
          />
        </motion.div>
        <HoverExpand items={showcaseItems} height={460} />
      </section>

      {/* ============ UPCOMING + EXPLORE ALL ============ */}
      {releaseData && (
        <section className="fv-container" style={{ padding: '0 24px 100px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 40,
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionHeader
                title="Upcoming Releases"
                subtitle="Mark your calendar — what's dropping soon."
                actionTo="/releases"
                actionLabel="Full schedule"
              />
              <ReleasesCalendar releases={releaseData.releases} limit={6} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <SectionHeader
                title="Explore All"
                subtitle="Seven universes, one portal."
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {categories.map((c) => (
                  <Link
                    key={c.path}
                    to={c.path}
                    style={{
                      position: 'relative',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      textDecoration: 'none',
                      color: 'inherit',
                      background: '#151518',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderRadius: 12,
                      overflow: 'hidden',
                      minHeight: 72,
                      transition: 'border-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)';
                      const img = e.currentTarget.querySelector('.fv-explore-bg');
                      if (img) img.style.opacity = '0.55';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                      const img = e.currentTarget.querySelector('.fv-explore-bg');
                      if (img) img.style.opacity = '0.32';
                    }}
                  >
                    {c.image && (
                      <div
                        className="fv-explore-bg"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${c.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center right',
                          opacity: 0.32,
                          transition: 'opacity 0.3s ease, transform 0.4s ease',
                          pointerEvents: 'none',
                        }}
                      />
                    )}

                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(90deg, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.45) 75%, rgba(10,10,10,0.15) 100%)',
                        pointerEvents: 'none',
                      }}
                    />

                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 3,
                        background: c.gradient,
                        zIndex: 2,
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 2 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontFamily: 'Orbitron, sans-serif',
                          fontWeight: 700,
                          color: '#f5f5f5',
                          marginBottom: 3,
                          letterSpacing: '0.01em',
                        }}
                      >
                        {c.name}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#a0a0a0',
                          fontFamily: 'Space Grotesk, sans-serif',
                        }}
                      >
                        {c.subtitle}
                      </div>
                    </div>

                    <FaArrowRight
                      style={{
                        color: '#7d7d7d',
                        fontSize: 11,
                        flexShrink: 0,
                        position: 'relative',
                        zIndex: 2,
                      }}
                    />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}