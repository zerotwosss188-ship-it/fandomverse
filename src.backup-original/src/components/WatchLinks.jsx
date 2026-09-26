// (removed — no longer used)

const PLATFORMS = {
  anime: {
    heading: 'Where to Watch',
    services: [
      { name: 'Crunchyroll', color: '#F47521', url: (q) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(q)}` },
      { name: 'Netflix', color: '#E50914', url: (q) => `https://www.netflix.com/search?q=${encodeURIComponent(q)}` },
      { name: 'Hulu', color: '#1CE783', url: (q) => `https://www.hulu.com/search?q=${encodeURIComponent(q)}` },
      { name: 'Prime Video', color: '#00A8E1', url: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&i=instant-video` },
    ],
  },
  'tv-shows': {
    heading: 'Where to Watch',
    services: [
      { name: 'Netflix', color: '#E50914', url: (q) => `https://www.netflix.com/search?q=${encodeURIComponent(q)}` },
      { name: 'HBO Max', color: '#5822B4', url: (q) => `https://play.max.com/search?q=${encodeURIComponent(q)}` },
      { name: 'Prime Video', color: '#00A8E1', url: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&i=instant-video` },
      { name: 'Disney+', color: '#113CCF', url: (q) => `https://www.disneyplus.com/search?q=${encodeURIComponent(q)}` },
    ],
  },
  movies: {
    heading: 'Where to Watch',
    services: [
      { name: 'Netflix', color: '#E50914', url: (q) => `https://www.netflix.com/search?q=${encodeURIComponent(q)}` },
      { name: 'Prime Video', color: '#00A8E1', url: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&i=instant-video` },
      { name: 'Disney+', color: '#113CCF', url: (q) => `https://www.disneyplus.com/search?q=${encodeURIComponent(q)}` },
      { name: 'Apple TV', color: '#555555', url: (q) => `https://tv.apple.com/search?term=${encodeURIComponent(q)}` },
    ],
  },
  kpop: {
    heading: 'Listen On',
    services: [
      { name: 'YouTube Music', color: '#FF0000', url: (q) => `https://music.youtube.com/search?q=${encodeURIComponent(q)}` },
      { name: 'Spotify', color: '#1DB954', url: (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}` },
      { name: 'Apple Music', color: '#FA243C', url: (q) => `https://music.apple.com/search?term=${encodeURIComponent(q)}` },
      { name: 'Weverse', color: '#00C4A4', url: () => `https://weverse.io/` },
    ],
  },
  comics: {
    heading: 'Read On',
    services: [
      { name: 'Marvel Unlimited', color: '#ED1D24', url: (q) => `https://www.marvel.com/search?query=${encodeURIComponent(q)}` },
      { name: 'DC Universe', color: '#0078F0', url: (q) => `https://www.dcuniverseinfinite.com/search?q=${encodeURIComponent(q)}` },
      { name: 'ComiXology', color: '#00A8E1', url: (q) => `https://www.amazon.com/s?k=${encodeURIComponent(q)}&i=digital-text` },
    ],
  },
  manga: {
    heading: 'Read On',
    services: [
      { name: 'VIZ Media', color: '#EE3A23', url: (q) => `https://www.viz.com/search?query=${encodeURIComponent(q)}` },
      { name: 'Manga Plus', color: '#FF6B00', url: (q) => `https://mangaplus.shueisha.co.jp/search?query=${encodeURIComponent(q)}` },
      { name: 'Crunchyroll Manga', color: '#F47521', url: (q) => `https://www.crunchyroll.com/search?q=${encodeURIComponent(q)}` },
    ],
  },
};

export default function WatchLinks({ title, series, category }) {
  const config = PLATFORMS[category];
  if (!config) return null;

  const query = series || title;
  if (!query) return null;

  return (
    <div
      style={{
        marginTop: 40,
        paddingTop: 24,
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 14,
        }}
      >
        <span
          style={{
            width: 3,
            height: 16,
            borderRadius: 2,
            background: 'linear-gradient(180deg, #dc2626, #f97316)',
          }}
        />
        <span
          style={{
            fontSize: 12,
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            color: '#f5f5f5',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          {config.heading}
        </span>
        <span
          style={{
            fontSize: 12,
            color: '#a8a8a8',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          · {query}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {config.services.map((s) => (
          <a
            key={s.name}
            href={s.url(query)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              background: `${s.color}22`,
              border: `1px solid ${s.color}88`,
              color: s.color,
              fontSize: 13,
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `${s.color}40`;
              e.currentTarget.style.borderColor = s.color;
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `${s.color}22`;
              e.currentTarget.style.borderColor = `${s.color}88`;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                background: s.color,
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontSize: 9,
                fontWeight: 800,
                fontFamily: 'Orbitron, sans-serif',
                flexShrink: 0,
              }}
            >
              {s.name
                .split(' ')
                .map((w) => w[0])
                .slice(0, 2)
                .join('')}
            </span>
            {s.name}
          </a>
        ))}
      </div>
    </div>
  );
}