import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import TrailerCard from '../components/TrailerCard';
import FilterChips from '../components/FilterChips';
import SortSelect from '../components/SortSelect';
import { useData } from '../hooks/useData';
import { FaVideo } from 'react-icons/fa';
import Breadcrumbs from '../components/Breadcrumbs';

const categories = [
  'all',
  'anime',
  'gaming',
  'movies',
  'tv-shows',
  'kpop',
  'comics',
  'manga',
];

export default function Trailers() {
  const { data } = useData('trailers');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const allTrailers = data?.trailers || [];

  const filtered = useMemo(() => {
    let items = [...allTrailers];

    if (categoryFilter !== 'all') {
      items = items.filter((t) => t.category === categoryFilter);
    }
    if (statusFilter !== 'all') {
      items = items.filter((t) => t.releaseStatus === statusFilter);
    }

    if (sortBy === 'newest') {
      items = items.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === 'oldest') {
      items = items.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === 'name-asc') {
      items = items.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'name-desc') {
      items = items.sort((a, b) => b.title.localeCompare(a.title));
    }

    return items;
  }, [allTrailers, categoryFilter, statusFilter, sortBy]);

  const upcomingCount = allTrailers.filter((t) => t.releaseStatus === 'upcoming').length;
  const releasedCount = allTrailers.filter((t) => t.releaseStatus === 'released').length;

  return (
    <div className="fv-container" style={{ padding: '56px 24px 80px' }}>
        <Breadcrumbs items={[{ label: 'Trailers' }]} />
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #dc2626, #f97316)',
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              fontSize: 16,
            }}
          >
            <FaVideo />
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 800,
              color: '#f5f5f5',
              margin: 0,
              letterSpacing: '0.01em',
            }}
          >
            Trailers
          </h1>
        </div>
        <p
          style={{
            fontSize: 14,
            color: '#a0a0a0',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          Every trailer from every universe — all in one place.
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 28,
          paddingBottom: 24,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <FilterChips
            label="Category"
            options={categories.map((c) => ({
              id: c,
              label: c === 'all' ? 'All' : c,
              capitalize: true,
            }))}
            value={categoryFilter}
            onChange={setCategoryFilter}
            color="#dc2626"
            countFn={(id) =>
              id === 'all'
                ? allTrailers.length
                : allTrailers.filter((t) => t.category === id).length
            }
          />
          <FilterChips
            label="Status"
            options={[
              { id: 'all', label: 'All' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'released', label: 'Released' },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            color="#f97316"
            countFn={(id) =>
              id === 'all'
                ? allTrailers.length
                : id === 'upcoming'
                ? upcomingCount
                : releasedCount
            }
          />
        </div>

        <SortSelect
          value={sortBy}
          onChange={setSortBy}
          options={[
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'name-asc', label: 'Name A-Z' },
            { value: 'name-desc', label: 'Name Z-A' },
          ]}
        />
      </div>

      {/* Count */}
      <p
        style={{
          fontSize: 13,
          color: '#a8a8a8',
          marginBottom: 20,
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {filtered.length} trailer{filtered.length !== 1 ? 's' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div
          className="fv-card"
          style={{
            padding: 60,
            textAlign: 'center',
            color: '#a8a8a8',
            fontSize: 14,
          }}
        >
          No trailers match this filter.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 18,
          }}
        >
          {filtered.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: (i % 8) * 0.04 }}
            >
              <TrailerCard trailer={t} index={i} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}