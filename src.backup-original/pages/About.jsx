import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRocket, FaUsers, FaHeart, FaBolt } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';

const values = [
  { icon: FaRocket, title: 'Unified Portal', desc: 'Seven fandoms, one place. No more hopping between sites.' },
  { icon: FaUsers, title: 'Community First', desc: 'Built for fans, by fans. Every feature serves the community.' },
  { icon: FaHeart, title: 'Fan Made', desc: 'All content belongs to respective owners. We curate, we don\'t own.' },
  { icon: FaBolt, title: 'Fast & Free', desc: 'No backend, no servers, no tracking. Just pure frontend magic.' },
];

export default function About() {
  return (
    <div className="fv-container" style={{ padding: '60px 24px 80px', maxWidth: 900 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Breadcrumbs items={[{ label: 'About' }]} />
        <h1 className="fv-section-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          About FandomVerse
        </h1>
        <p style={{ color: '#b8b0d0', lineHeight: 1.8, marginTop: 16, fontSize: '1.05rem' }}>
          FandomVerse is a unified portal built for fans of <strong style={{ color: '#fca5a5' }}>Anime, Gaming, Movies, TV Shows, K-Pop, Comics, and Manga</strong>. We bring together articles, character profiles, media galleries, event highlights, trailers, and merchandise into one place — so you never have to hop between ten different sites again.
        </p>
        <p style={{ color: '#b8b0d0', lineHeight: 1.8, marginTop: 16, fontSize: '1.05rem' }}>
          Built as a Single Page Application using React, this project demonstrates modern front-end architecture with JSON-driven content, client-side search/filter/sort, bookmarking, and a rule-based AI chatbot.
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 20,
          marginTop: 60,
        }}
      >
        {values.map((v, i) => {
          const Icon = v.icon;
          return (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="fv-card"
              style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #dc2626, #f97316)',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  fontSize: 20,
                  boxShadow: '0 6px 20px rgba(220,38,38,0.4)',
                }}
              >
                <Icon />
              </div>
              <h3 style={{ fontSize: 16, fontFamily: 'Orbitron, sans-serif', fontWeight: 600 }}>
                {v.title}
              </h3>
              <p style={{ fontSize: 13, color: '#8a94ad', lineHeight: 1.6 }}>{v.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <h2 className="fv-section-title" style={{ marginBottom: 16 }}>Ready to explore?</h2>
        <Link to="/category/anime" className="fv-btn fv-btn-primary">
          Start Your Journey →
        </Link>
      </div>
    </div>
  );
}