import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 40,
        borderTop: '1px solid rgba(225, 29, 72, 0.12)',
        background: 'rgba(5, 6, 10, 0.75)',
        backdropFilter: 'blur(14px)',
        padding: '48px 0 24px',
      }}
    >
      <div className="fv-container">
        <div
          className="fv-footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 32,
            marginBottom: 32,
          }}
        >
          <div>
            <h4
              style={{
                marginBottom: 14,
                color: '#fda4af',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 15,
                letterSpacing: '0.05em',
              }}
            >
              FANDOMVERSE
            </h4>
            <p
              style={{
                color: '#8a94ad',
                fontSize: 14,
                lineHeight: 1.7,
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Your unified hub for Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga.
            </p>
          </div>

          <div>
            <h4
              style={{
                marginBottom: 14,
                color: '#fda4af',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 14,
                letterSpacing: '0.05em',
              }}
            >
              EXPLORE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['anime', 'gaming', 'movies', 'kpop'].map((s) => (
                <Link
                  key={s}
                  to={`/category/${s}`}
                  style={{
                    color: '#8a94ad',
                    fontSize: 14,
                    fontFamily: 'Space Grotesk, sans-serif',
                    textTransform: 'capitalize',
                  }}
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4
              style={{
                marginBottom: 14,
                color: '#fda4af',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 14,
                letterSpacing: '0.05em',
              }}
            >
              COMPANY
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/about" style={{ color: '#8a94ad', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
                About Us
              </Link>
              <Link to="/contact" style={{ color: '#8a94ad', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
                Contact
              </Link>
              <Link to="/releases" style={{ color: '#8a94ad', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
                Releases
              </Link>
              <Link to="/bookmarks" style={{ color: '#8a94ad', fontSize: 14, fontFamily: 'Space Grotesk, sans-serif' }}>
                Bookmarks
              </Link>
            </div>
          </div>

          <div>
            <h4
              style={{
                marginBottom: 14,
                color: '#fda4af',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 14,
                letterSpacing: '0.05em',
              }}
            >
              FOLLOW
            </h4>
            <div style={{ display: 'flex', gap: 14, fontSize: 18 }}>
              <span style={{ cursor: 'pointer' }}>🐦</span>
              <span style={{ cursor: 'pointer' }}>📸</span>
              <span style={{ cursor: 'pointer' }}>▶️</span>
              <span style={{ cursor: 'pointer' }}>💬</span>
            </div>
          </div>
        </div>

        {/* ============ ATTRIBUTION ============ */}
        <div
          style={{
            borderTop: '1px solid rgba(225, 29, 72, 0.08)',
            paddingTop: 20,
            paddingBottom: 16,
            textAlign: 'center',
            fontSize: 11,
            color: '#6b7590',
            fontFamily: 'Space Grotesk, sans-serif',
            lineHeight: 1.8,
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: '#a8a8a8' }}>Data Sources:</strong>{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fda4af', textDecoration: 'none' }}
            >
              TMDb
            </a>
            {' · '}
            <a
              href="https://rawg.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fda4af', textDecoration: 'none' }}
            >
              RAWG
            </a>
            {' · '}
            <a
              href="https://anilist.co"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fda4af', textDecoration: 'none' }}
            >
              AniList
            </a>
            {' · '}
            <a
              href="https://www.deezer.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fda4af', textDecoration: 'none' }}
            >
              Deezer
            </a>
            {' · '}
            <a
              href="https://loremflickr.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fda4af', textDecoration: 'none' }}
            >
              LoremFlickr
            </a>
            {' · '}
            <a
              href="https://www.soundhelix.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#fda4af', textDecoration: 'none' }}
            >
              SoundHelix
            </a>
          </div>

          <div>
            © {new Date().getFullYear()} FandomVerse · Non-commercial educational project · All
            trademarks and character designs belong to their respective owners.
          </div>
        </div>
      </div>
    </footer>
  );
}