import { FaSteam, FaExternalLinkAlt } from 'react-icons/fa';
import { SiRockstargames, SiEpicgames, SiUbisoft, SiPlaystation } from 'react-icons/si';
import { useData } from '../hooks/useData';

// Auto-detect brand icon from label / URL
function getBrandIcon(label = '', url = '') {
  const text = `${label} ${url}`.toLowerCase();
  if (text.includes('rockstar')) return <SiRockstargames style={{ fontSize: 16 }} />;
  if (text.includes('epic')) return <SiEpicgames style={{ fontSize: 16 }} />;
  if (text.includes('ubisoft')) return <SiUbisoft style={{ fontSize: 16 }} />;
  if (text.includes('playstation') || text.includes('sony'))
    return <SiPlaystation style={{ fontSize: 16 }} />;
  return <FaExternalLinkAlt style={{ fontSize: 12 }} />;
}


export default function StoreLinks({ series, title }) {
  const { data } = useData('gameLinks');
  if (!data || (!series && !title)) return null;

  // Smart matching: exact series → series in title → title keyword match
  const game = data.gameLinks.find((g) => {
    if (series && g.series === series) return true;

    const haystack = `${series || ''} ${title || ''}`.toLowerCase();
    const needle = g.series.toLowerCase();

    // Exact substring match ("GTA VI" in "GTA VI Breaks All Records")
    if (haystack.includes(needle)) return true;

    // Keyword overlap for short titles like "GTA V" vs "GTA V: A Decade..."
    const gameWords = needle.split(/\s+/).filter((w) => w.length > 1);
    if (gameWords.length > 1) {
      const allMatch = gameWords.every((w) => haystack.includes(w));
      if (allMatch) return true;
    }

    return false;
  });

  if (!game) return null;

  const hasLinks = game.steam || game.official;
  if (!hasLinks) return null;

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
          Where to Play
        </span>
        <span
          style={{
            fontSize: 12,
            color: '#a8a8a8',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          · {game.series}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {game.steam && (
          <a
            href={game.steam}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              background: 'rgba(23, 47, 79, 0.4)',
              border: '1px solid rgba(102, 192, 244, 0.35)',
              color: '#66c0f4',
              fontSize: 13,
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(23, 47, 79, 0.7)';
              e.currentTarget.style.borderColor = '#66c0f4';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(23, 47, 79, 0.4)';
              e.currentTarget.style.borderColor = 'rgba(102, 192, 244, 0.35)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
           <FaSteam style={{ fontSize: 16 }} /> Steam
          </a>
        )}

        {game.official && (
          <a
            href={game.official}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              background: 'rgba(220, 38, 38, 0.12)',
              border: '1px solid rgba(220, 38, 38, 0.4)',
              color: '#fca5a5',
              fontSize: 13,
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.22)';
              e.currentTarget.style.borderColor = '#dc2626';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(220, 38, 38, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {getBrandIcon(game.label, game.official)}
            {game.label || 'Official site'}
          </a>
        )}
      </div>
    </div>
  );
}