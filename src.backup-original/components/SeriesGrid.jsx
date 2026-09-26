import { useState } from 'react';
import { motion } from 'framer-motion';
import SmartImage from './SmartImage';
import { useSeriesImage, useCharacterImage } from '../hooks/useImages';

function getLocalBanner(series) {
  if (!series) return null;
  const slug = series.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `/images/banners/${slug}.jpg`;
}

function SeriesTile({ series, onSelect, index, category }) {
  const { name, count, sample, firstChar } = series;

  // ⭐ KEEP API fetch
  const imgUrl = useSeriesImage(name, category);
  const avatarUrl = useCharacterImage(
    firstChar?.name || '', name, category, firstChar?.id
  );

  const localBanner = getLocalBanner(name);
  const finalImg = imgUrl || localBanner;

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(name)}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      whileHover={{ y: -3 }}
      style={{
        position: 'relative', padding: 0, textAlign: 'left',
        background: '#151518',
        border: '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: 14, cursor: 'pointer', color: 'inherit',
        fontFamily: 'inherit', overflow: 'hidden',
        minHeight: 180,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)')}
    >
      <div style={{ position: 'absolute', inset: 0, background: '#0f0f12' }} />

      <SmartImage
        src={finalImg}
        fallbackSrc={localBanner}
        alt=""
        loadingText="Loading"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          opacity: 0.6,
        }}
      />

      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(21,21,24,0.15) 0%, rgba(21,21,24,0.7) 55%, rgba(21,21,24,0.98) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{
        position: 'relative', padding: 16,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end', minHeight: 180, zIndex: 2,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            overflow: 'hidden', background: 'rgba(255,255,255,0.08)',
            border: '1.5px solid rgba(255,255,255,0.15)',
            flexShrink: 0, position: 'relative',
          }}>
            {avatarUrl && (
              <SmartImage
                src={avatarUrl}
                alt={firstChar?.name || name}
                objectPosition="center top"
                showLoadingText={false}
                style={{ width: '100%', height: '100%' }}
              />
            )}
          </div>
          <div style={{
            fontSize: 11, color: '#cbd5e1',
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 500,
            padding: '4px 10px', borderRadius: 999,
            background: 'rgba(10,10,10,0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(8px)',
          }}>
            {count} character{count !== 1 ? 's' : ''}
          </div>
        </div>

        <div style={{
          fontSize: 15, fontFamily: 'Orbitron, sans-serif',
          fontWeight: 700, color: '#f5f5f5',
          lineHeight: 1.3, marginBottom: 6,
          textShadow: '0 2px 12px rgba(0,0,0,0.7)',
        }}>
          {name}
        </div>

        {sample?.length > 0 && (
          <div style={{
            fontSize: 11, color: '#a0a0a0',
            fontFamily: 'Space Grotesk, sans-serif',
            overflow: 'hidden', textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            textShadow: '0 1px 6px rgba(0,0,0,0.8)',
          }}>
            {sample.slice(0, 2).join(' · ')}
            {sample.length > 2 ? ' · …' : ''}
          </div>
        )}
      </div>
    </motion.button>
  );
}

export default function SeriesGrid({ series, onSelect, category }) {
  return (
    <div className="fv-series-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 14,
    }}>
      {series.map((s, i) => (
        <SeriesTile key={s.name} series={s} onSelect={onSelect} index={i} category={category} />
      ))}
    </div>
  );
}