import { useState, useEffect } from 'react';
import { getLegalImage } from '../lib/legalImages';

const SLIDES = [
  { category: 'anime',    query: 'Demon Slayer',    series: 'Demon Slayer' },
  { category: 'gaming',   query: 'Elden Ring',      series: 'Elden Ring' },
  { category: 'movies',   query: 'Dune',            series: 'Dune' },
  { category: 'tv-shows', query: 'Stranger Things', series: 'Stranger Things' },
  { category: 'kpop',     query: 'BLACKPINK',       series: 'BLACKPINK' },
  { category: 'comics',   query: 'Batman',          series: 'Batman' },
  { category: 'manga',    query: 'One Piece',       series: 'One Piece' },
];

const ROTATE_MS = 7000;
const FADE_MS = 1800;

export default function IntroVideoBackground() {
  const [urls, setUrls] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      SLIDES.map((s) =>
        getLegalImage(s.category, s.query, s.series).catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setUrls(results.filter(Boolean));
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (urls.length <= 1) return;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % urls.length);
    }, ROTATE_MS);
    return () => clearInterval(t);
  }, [urls.length]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        background: '#0a0a0a',
      }}
    >
            {urls.map((url, i) => {
        const isActive = i === index;
        return (
          <div
            key={url}
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              opacity: isActive ? 1 : 0,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
              willChange: 'opacity',
            }}
          >
            {/* Inner div remounts on state toggle — see key below */}
            <div
              key={`${i}-${isActive ? 'on' : 'off'}`}
              className={isActive ? 'fv-kenburns-bg' : ''}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'saturate(1.1) brightness(0.78)',
              }}
            />
          </div>
        );
      })}

      {/* Dark gradient overlay — keeps text readable */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 40%, rgba(10,10,10,0.45) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,10,10,0.5) 0%, transparent 30%, transparent 70%, rgba(10,10,10,0.85) 100%)',
        }}
      />

      {/* Red ambience */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 20% 50%, rgba(225,29,72,0.15) 0%, transparent 60%)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(5,5,5,0.9) 100%)',
        }}
      />

      {urls.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 40%, #1a0a0e 0%, #0a0a0a 60%, #050505 100%)',
          }}
        >
          {/* Decorative orb to fill empty space */}
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '60%',
              width: 400,
              height: 400,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(225,29,72,0.25) 0%, transparent 70%)',
              filter: 'blur(60px)',
            }}
          />
        </div>
      )}


    </div>
  );
}