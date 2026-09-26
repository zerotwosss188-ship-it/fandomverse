import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaArrowRight, FaFilter } from 'react-icons/fa';
import { useData } from '../hooks/useData';
import Breadcrumbs from '../components/Breadcrumbs';

const catColors = {
  anime: '#f472b6',
  gaming: '#60a5fa',
  movies: '#fbbf24',
  'tv-shows': '#34d399',
  kpop: '#a78bfa',
  comics: '#f87171',
  manga: '#22d3ee',
};

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

export default function Releases() {
  const { data } = useData('releases');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('upcoming');

  const filtered = useMemo(() => {
    if (!data?.releases) return [];
    let items = [...data.releases];

    if (categoryFilter !== 'all') {
      items = items.filter((r) => r.category === categoryFilter);
    }

    const now = new Date();
    if (timeFilter === 'upcoming') {
      items = items.filter((r) => new Date(r.date) >= now);
    } else if (timeFilter === 'past') {
      items = items.filter((r) => new Date(r.date) < now);
    }

    items.sort((a, b) => {
      const da = new Date(a.date);
      const db = new Date(b.date);
      return timeFilter === 'past' ? db - da : da - db;
    });

    return items;
  }, [data, categoryFilter, timeFilter]);

  const groupedByMonth = useMemo(() => {
    const groups = {};
    filtered.forEach((item) => {
      const d = new Date(item.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
      if (!groups[key]) groups[key] = { label, items: [] };
      groups[key].items.push(item);
    });
    return Object.entries(groups).sort(([a], [b]) =>
      timeFilter === 'past' ? b.localeCompare(a) : a.localeCompare(b)
    );
  }, [filtered, timeFilter]);

  return (
    <div className="fv-container" style={{ padding: '56px 24px 80px' }}>
      <Breadcrumbs items={[{ label: 'Releases' }]} />
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 800,
            color: '#f5f5f5',
            marginBottom: 8,
            letterSpacing: '0.01em',
          }}
        >
          Releases
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#a0a0a0',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          Track every premiere, game drop, album, and movie across all fandoms.
        </p>
      </div>

      {/* Filters row */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          marginBottom: 28,
          paddingBottom: 24,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <FilterGroup
          label="Time"
          options={[
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'past', label: 'Past' },
            { id: 'all', label: 'All' },
          ]}
          value={timeFilter}
          onChange={setTimeFilter}
        />
        <FilterGroup
          label="Category"
          options={categories.map((c) => ({
            id: c,
            label: c === 'all' ? 'All' : c,
            capitalize: true,
          }))}
          value={categoryFilter}
          onChange={setCategoryFilter}
        />
      </div>

      {/* Count */}
      <p
        style={{
          fontSize: 13,
          color: '#a8a8a8',
          marginBottom: 24,
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {filtered.length} release{filtered.length !== 1 ? 's' : ''}
      </p>

      {filtered.length === 0 ? (
        <div
          style={{
            padding: 60,
            textAlign: 'center',
            color: '#a8a8a8',
            fontSize: 14,
            background: '#151518',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 16,
          }}
        >
          No releases found in this filter.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {groupedByMonth.map(([key, group]) => (
            <div key={key}>
              {/* Month header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  marginBottom: 18,
                }}
              >
                <h2
                  style={{
                    fontSize: 15,
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 700,
                    color: '#f5f5f5',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    margin: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {group.label}
                </h2>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: 'rgba(255, 255, 255, 0.06)',
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: '#a8a8a8',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.items.map((r) => {
                  const date = new Date(r.date);
                  const now = new Date();
                  const daysLeft = Math.ceil(
                    (date - now) / (1000 * 60 * 60 * 24)
                  );
                  const isPast = daysLeft < 0;
                  const color = catColors[r.category] || '#dc2626';

                  return (
                    <Link
                      key={r.id}
                      to={`/category/${r.category}`}
                      style={{
                        padding: 16,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                        textDecoration: 'none',
                        color: 'inherit',
                        background: '#151518',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: 12,
                        opacity: isPast ? 0.6 : 1,
                        transition: 'border-color 0.2s ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(255, 255, 255, 0.12)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor =
                          'rgba(255, 255, 255, 0.06)')
                      }
                    >
                      {/* Date block */}
                      <div
                        style={{
                          flexShrink: 0,
                          width: 56,
                          textAlign: 'center',
                          padding: '8px 0',
                          borderRadius: 10,
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: `1px solid ${color}44`,
                          color: color,
                          fontFamily: 'Orbitron, sans-serif',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            letterSpacing: '0.1em',
                            opacity: 0.9,
                          }}
                        >
                          {date
                            .toLocaleDateString('en-US', { month: 'short' })
                            .toUpperCase()}
                        </div>
                        <div
                          style={{
                            fontSize: 20,
                            fontWeight: 700,
                            lineHeight: 1.1,
                          }}
                        >
                          {date.getDate()}
                        </div>
                        <div style={{ fontSize: 9, opacity: 0.7 }}>
                          {date
                            .toLocaleDateString('en-US', { weekday: 'short' })
                            .toUpperCase()}
                        </div>
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 10,
                            color: color,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            fontFamily: 'Orbitron, sans-serif',
                            fontWeight: 700,
                            marginBottom: 4,
                          }}
                        >
                          {r.type}
                        </div>
                        <div
                          style={{
                            fontSize: 15,
                            fontFamily: 'Orbitron, sans-serif',
                            fontWeight: 600,
                            color: '#f5f5f5',
                            marginBottom: 4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            letterSpacing: '0.01em',
                          }}
                        >
                          {r.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: isPast ? '#a8a8a8' : '#a0a0a0',
                            fontFamily: 'Space Grotesk, sans-serif',
                          }}
                        >
                          {isPast
                            ? `${Math.abs(daysLeft)} days ago`
                            : daysLeft === 0
                            ? 'Today'
                            : daysLeft === 1
                            ? 'Tomorrow'
                            : `in ${daysLeft} days`}
                        </div>
                      </div>

                      <FaArrowRight
                        style={{ color: '#a8a8a8', fontSize: 11 }}
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          color: '#a8a8a8',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 600,
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map((opt) => {
          const isActive = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              style={{
                padding: '6px 14px',
                fontSize: 12,
                borderRadius: 8,
                background: isActive
                  ? 'rgba(220, 38, 38, 0.15)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: isActive
                  ? '1px solid rgba(220, 38, 38, 0.4)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                color: isActive ? '#fca5a5' : '#a0a0a0',
                cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 500,
                textTransform: opt.capitalize ? 'capitalize' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}