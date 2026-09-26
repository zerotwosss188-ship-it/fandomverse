import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';

export default function Breadcrumbs({ items = [] }) {
  if (!items.length) return null;

  return (
    <div
      style={{
        fontSize: 13,
        color: '#a8a8a8',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
        fontFamily: 'Space Grotesk, sans-serif',
      }}
    >
      <Link
        to="/"
        style={{
          color: '#a8a8a8',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          textDecoration: 'none',
        }}
      >
        <FaHome style={{ fontSize: 12 }} /> Home
      </Link>

      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span
            key={`${item.label}-${i}`}
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <span>›</span>
            {isLast || !item.to ? (
              <span style={{ color: '#f5f5f5' }}>{item.label}</span>
            ) : (
              <Link
                to={item.to}
                style={{ color: '#a8a8a8', textDecoration: 'none' }}
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </div>
  );
}