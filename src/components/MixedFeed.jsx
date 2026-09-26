import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaHeadphones, FaBookOpen } from 'react-icons/fa';
import { useSeriesImage } from '../hooks/useImages';
import { useLegalImage } from '../hooks/useLegalImage';
import SmartImage from './SmartImage';

const TYPE_META = {
  article: { label: 'Article', color: '#a855f7', icon: <FaBookOpen /> },
  trailer: { label: 'Trailer', color: '#e11d48', icon: <FaPlay /> },
  audio: { label: 'Podcast', color: '#a78bfa', icon: <FaHeadphones /> },
};

function MixedCard({ item, index = 0 }) {
  const seriesImg = useSeriesImage(item.series || item.category, item.category);
// Priority: explicit image → series image → local banner fallback
const localBanner = item.series
  ? `/images/banners/${item.series
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}.jpg`
  : null;
const image = item.image || seriesImg || localBanner;const { url: legalImage } = useLegalImage(
  item.category,
  item.title,
  item.series,
  image
);

const finalImage = legalImage || image;
  const meta = TYPE_META[item.type] || TYPE_META.article;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
    >
      <Link
        to={item.link}
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: '16 / 10',
            borderRadius: 12,
            overflow: 'hidden',
            background: '#0f0f12',
            marginBottom: 12,
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <SmartImage
            src={finalImage}
            fallbackSrc={localBanner}
            alt={item.title}
            loadingText="Loading"
            showLoadingText={true}
            style={{ width: '100%', height: '100%' }}
          />

          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(180deg, transparent 50%, rgba(11,11,14,0.9) 100%)',
              pointerEvents: 'none',
            }}
          />

          {/* Type badge */}
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              fontSize: 9,
              padding: '3px 8px',
              borderRadius: 4,
              background: 'rgba(10,10,10,0.8)',
              border: `1px solid ${meta.color}66`,
              color: meta.color,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontWeight: 700,
              fontFamily: 'Orbitron, sans-serif',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              backdropFilter: 'blur(8px)',
            }}
          >
            {meta.icon}
            {meta.label}
          </span>
        </div>

        <h3
          style={{
            fontSize: 14,
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            color: '#f5f5f5',
            lineHeight: 1.3,
            marginBottom: 6,
            letterSpacing: '0.01em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.title}
        </h3>
        <div
          style={{
            fontSize: 11,
            color: '#a8a8a8',
            fontFamily: 'Space Grotesk, sans-serif',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span style={{ textTransform: 'capitalize' }}>{item.category}</span>
          <span style={{ color: '#3a3a3a' }}>·</span>
          <span>
            {new Date(item.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function buildFeed(contentData, trailerData, audioData) {
  const items = [];

  (contentData?.content || []).forEach((a) => {
    items.push({
      id: a.id,
      type: 'article',
      _key: `a-${a.id}`,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      series: a.series,
      date: a.date,
      link: `/content/${a.id}`,
      image: a.image,
    });
  });

  (trailerData?.trailers || []).forEach((t) => {
    items.push({
      id: t.id,
      type: 'trailer',
      _key: `t-${t.id}`,
      title: t.title,
      excerpt: t.releaseStatus === 'upcoming' ? 'Upcoming trailer' : 'Released trailer',
      category: t.category,
      date: t.date,
      link: `/category/${t.category}`,
      image: `https://img.youtube.com/vi/${t.youtubeId}/mqdefault.jpg`,
    });
  });

  (audioData?.audio || []).forEach((a) => {
    items.push({
      id: a.id,
      type: 'audio',
      _key: `au-${a.id}`,
      title: a.title,
      excerpt: `${a.type} · ${a.host}`,
      category: a.category,
      series: a.series,
      date: a.date,
      link: `/category/${a.category}`,
    });
  });

  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  const byType = {};
  items.forEach((i) => {
    if (!byType[i.type]) byType[i.type] = [];
    byType[i.type].push(i);
  });

  const types = Object.keys(byType);
  const mixed = [];
  let idx = 0;
  while (mixed.length < 16) {
    let added = false;
    for (const t of types) {
      if (byType[t][idx]) {
        mixed.push(byType[t][idx]);
        added = true;
      }
    }
    if (!added) break;
    idx++;
  }

  return mixed;
}

export default function MixedFeed({ contentData, trailerData, audioData }) {
  const feed = buildFeed(contentData, trailerData, audioData);

  if (feed.length === 0) return null;

  return (
    <div
      className="fv-mixed-feed"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 20,
      }}
    >
      {feed.map((item, i) => (
        <MixedCard key={item._key} item={item} index={i} />
      ))}
    </div>
  );
}