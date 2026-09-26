import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight } from 'react-icons/fa';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

// Series → banner image map (exact match, series first)
const SERIES_IMAGES = {
  // Gaming
  'GTA VI': '/images/banners/gta-vi.jpg',
  'GTA V': '/images/banners/gta-v.jpg',
  'Hades II': '/images/banners/hades.jpg',
  'God of War': '/images/banners/god-of-war.jpg',
  'Elden Ring': '/images/banners/elden-ring.jpg',
  Minecraft: '/images/banners/minecraft.jpg',
  Fortnite: '/images/banners/fortnite.jpg',
  'Call of Duty': '/images/banners/call-of-duty.jpg',
  'Red Dead Redemption': '/images/banners/red-dead-redemption.jpg',
  'Cyberpunk 2077': '/images/banners/cyberpunk-2077.jpg',
  'The Witcher': '/images/banners/the-witcher.jpg',
  Valorant: '/images/banners/valorant.jpg',
  'Dark Souls': '/images/banners/dark-souls.jpg',
  'Resident Evil': '/images/banners/resident-evil.jpg',
  "Assassin's Creed": '/images/banners/assassin-s-creed.jpg',
  'The Last of Us': '/images/banners/the-last-of-us.jpg',

  // Anime
  'Demon Slayer': '/images/banners/demon-slayer.jpg',
  'Jujutsu Kaisen': '/images/banners/jujutsu-kaisen.jpg',
  'One Piece': '/images/banners/one-piece.jpg',
  'Attack on Titan': '/images/banners/attack-on-titan.jpg',
  Naruto: '/images/banners/naruto.jpg',
  Bleach: '/images/banners/bleach.jpg',
  'Solo Leveling': '/images/banners/solo-leveling.jpg',
  'My Hero Academia': '/images/banners/my-hero-academia.jpg',
  'Chainsaw Man': '/images/banners/chainsaw-man.jpg',
  'Fullmetal Alchemist': '/images/banners/fullmetal-alchemist.jpg',
  Frieren: '/images/banners/frieren.jpg',
  'Death Note': '/images/banners/death-note.jpg',
  'Black Clover': '/images/banners/black-clover.jpg',
  'Hunter x Hunter': '/images/banners/hunter-x-hunter.jpg',
  'Tokyo Ghoul': '/images/banners/tokyo-ghoul.jpg',
  'Vinland Saga': '/images/banners/vinland-saga.jpg',
  "JoJo's Bizarre Adventure": '/images/banners/jojo-s-bizarre-adventure.jpg',
  'Dan Da Dan': '/images/banners/dan-da-dan.jpg',
  'Dragon Ball': '/images/banners/dragon-ball.jpg',
  'The Apothecary Diaries': '/images/banners/the-apothecary-diaries.jpg',

  // Movies
  Dune: '/images/banners/dune.jpg',
  'The Matrix': '/images/banners/the-matrix.jpg',
  'Iron Man': '/images/banners/iron-man.jpg',
  Alien: '/images/banners/alien.jpg',
  Avengers: '/images/banners/avengers.jpg',
  'The Batman': '/images/banners/the-batman.jpg',
  'Spider-Man': '/images/banners/spider-man.jpg',
  Superman: '/images/banners/superman.jpg',
  'Harry Potter': '/images/banners/harry-potter.jpg',
  'The Lord of the Rings': '/images/banners/the-lord-of-the-rings.jpg',
  'Star Wars': '/images/banners/star-wars.jpg',
  'Jurassic Park': '/images/banners/jurassic-park.jpg',
  Interstellar: '/images/banners/interstellar.jpg',
  Joker: '/images/banners/joker.jpg',
  Avatar: '/images/banners/avatar.jpg',
  'Fast & Furious': '/images/banners/fast-furious.jpg',
  'The Walking Dead': '/images/banners/the-walking-dead.jpg',
  'Pirates of the Caribbean': '/images/banners/pirates-of-the-caribbean.jpg',
  'How to Train Your Dragon': '/images/banners/how-to-train-your-dragon.jpg',
  Transformers: '/images/banners/transformers.jpg',
  'The Hunger Games': '/images/banners/the-hunger-games.jpg',
  'The Conjuring': '/images/banners/the-conjuring.jpg',
  'Mission: Impossible': '/images/banners/mission-impossible.jpg',
  Frozen: '/images/banners/frozen.jpg',
  'The Dark Knight': '/images/banners/the-dark-knight.jpg',

  // TV Shows
  'Stranger Things': '/images/banners/stranger-things.jpg',
  'Breaking Bad': '/images/banners/breaking-bad.jpg',
  'Game of Thrones': '/images/banners/game-of-thrones.jpg',
  Wednesday: '/images/banners/wednesday.jpg',
  'The Boys': '/images/banners/the-boys.jpg',
  'House of the Dragon': '/images/banners/house-of-the-dragon.jpg',
  'Peaky Blinders': '/images/banners/peaky-blinders.jpg',
  'Money Heist': '/images/banners/money-heist.jpg',
  'Squid Game': '/images/banners/squid-game.jpg',
  Dark: '/images/banners/dark.jpg',
  'Cobra Kai': '/images/banners/cobra-kai.jpg',
  Daredevil: '/images/banners/daredevil.jpg',
  'Better Call Saul': '/images/banners/better-call-saul.jpg',
  'Black Mirror': '/images/banners/black-mirror.jpg',
  'The Umbrella Academy': '/images/banners/the-umbrella-academy.jpg',
  'The Mandalorian': '/images/banners/the-mandalorian.jpg',

  // K-Pop
  BTS: '/images/banners/bts.jpg',
  BLACKPINK: '/images/banners/blackpink.jpg',
  TWICE: '/images/banners/twice.jpg',
  'Stray Kids': '/images/banners/stray-kids.jpg',
  NewJeans: '/images/banners/newjeans.jpg',
  SEVENTEEN: '/images/banners/seventeen.jpg',
  IVE: '/images/banners/ive.jpg',
  aespa: '/images/banners/aespa.jpg',
  'LE SSERAFIM': '/images/banners/le-sserafim.jpg',
  ENHYPEN: '/images/banners/enhypen.jpg',
  TXT: '/images/banners/txt.jpg',
  NCT: '/images/banners/nct.jpg',
  'Red Velvet': '/images/banners/red-velvet.jpg',
  ITZY: '/images/banners/itzy.jpg',
  '(G)I-DLE': '/images/banners/g-i-dle.jpg',
  ATEEZ: '/images/banners/ateez.jpg',
  BABYMONSTER: '/images/banners/babymonster.jpg',
  ILLIT: '/images/banners/illit.jpg',
  RIIZE: '/images/banners/riize.jpg',
  EXO: '/images/banners/exo.jpg',

  // Comics
  'X-Men': '/images/banners/x-men.jpg',
  'Fantastic Four': '/images/banners/fantastic-four.jpg',
  'Captain America': '/images/banners/captain-america.jpg',
  Thor: '/images/banners/thor.jpg',
  'Black Panther': '/images/banners/black-panther.jpg',
  'Justice League': '/images/banners/justice-league.jpg',
  'Wonder Woman': '/images/banners/wonder-woman.jpg',
  'The Flash': '/images/banners/the-flash.jpg',
  'Green Lantern': '/images/banners/green-lantern.jpg',
  'Teen Titans': '/images/banners/teen-titans.jpg',
  'Suicide Squad': '/images/banners/suicide-squad.jpg',
  Watchmen: '/images/banners/watchmen.jpg',
  Marvel: '/images/banners/marvel.jpg',
  DC: '/images/banners/dc.jpg',

  // Manga (uses anime banners mostly)
  Berserk: '/images/banners/berserk.jpg',
};

// Category-level fallback if series not found
const CATEGORY_FALLBACKS = {
  anime: '/images/banners/demon-slayer.jpg',
  gaming: '/images/banners/gta-v.jpg',
  movies: '/images/banners/dune.jpg',
  'tv-shows': '/images/banners/stranger-things.jpg',
  kpop: '/images/banners/blackpink.jpg',
  comics: '/images/banners/batman.jpg',
  manga: '/images/banners/one-piece.jpg',
};

function getImageForRelease(release) {
  // Try exact series match
  if (release.series && SERIES_IMAGES[release.series]) {
    return SERIES_IMAGES[release.series];
  }

  // Try matching series keyword in title
  if (release.title) {
    for (const [key, img] of Object.entries(SERIES_IMAGES)) {
      if (release.title.toLowerCase().includes(key.toLowerCase())) {
        return img;
      }
    }
  }

  // Fallback to category
  return CATEGORY_FALLBACKS[release.category] || null;
}

export default function ReleasesCalendar({ releases, limit = 6 }) {
  const upcoming = releases
    .filter((r) => new Date(r.date) > new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, limit);

  if (upcoming.length === 0) {
    return (
      <div
        className="fv-card"
        style={{ padding: 40, textAlign: 'center', color: '#8a94ad' }}
      >
        No upcoming releases.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {upcoming.map((r, i) => {
        const date = new Date(r.date);
        const daysLeft = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
        const color = catColors[r.category] || '#e11d48';
        const bgImage = getImageForRelease(r);

        return (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link
              to={`/category/${r.category}`}
              style={{
                position: 'relative',
                padding: 18,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                textDecoration: 'none',
                color: 'inherit',
                background: '#151518',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 16,
                overflow: 'hidden',
                minHeight: 92,
                transition: 'border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${color}66`;
                const img = e.currentTarget.querySelector('.fv-release-bg');
                if (img) img.style.opacity = '0.45';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                const img = e.currentTarget.querySelector('.fv-release-bg');
                if (img) img.style.opacity = '0.28';
              }}
            >
              {/* Background image */}
              {bgImage && (
                <div
                  className="fv-release-bg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center right',
                    opacity: 0.28,
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg, rgba(21,21,24,0.98) 0%, rgba(21,21,24,0.85) 50%, rgba(21,21,24,0.35) 100%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Date block */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  flexShrink: 0,
                  width: 64,
                  textAlign: 'center',
                  padding: '8px 0',
                  borderRadius: 12,
                  background: `${color}22`,
                  border: `1px solid ${color}55`,
                  color,
                  fontFamily: 'Orbitron, sans-serif',
                  backdropFilter: 'blur(4px)',
                }}
              >
                <div style={{ fontSize: 10, letterSpacing: '0.1em' }}>
                  {date
                    .toLocaleDateString('en-US', { month: 'short' })
                    .toUpperCase()}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1 }}>
                  {date.getDate()}
                </div>
                <div style={{ fontSize: 9, color: '#a8a8a8' }}>
                  {date.getFullYear()}
                </div>
              </div>

              {/* Info */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 2,
                  flex: 1,
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    fontFamily: 'Orbitron, sans-serif',
                    marginBottom: 4,
                    fontWeight: 700,
                  }}
                >
                  {r.type} · {r.category}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 600,
                    color: '#e8ecf5',
                    marginBottom: 6,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {r.title}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    color: '#a0a0a0',
                  }}
                >
                  <FaCalendarAlt style={{ color: '#60a5fa' }} />
                  in {daysLeft} day{daysLeft !== 1 ? 's' : ''}
                </div>
              </div>

              <FaArrowRight
                style={{
                  position: 'relative',
                  zIndex: 2,
                  color: '#7d7d7d',
                  fontSize: 12,
                }}
              />
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}