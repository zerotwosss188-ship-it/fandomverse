import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaShoppingCart,
  FaArrowRight,
} from 'react-icons/fa';
import SmartImage from '../components/SmartImage';
import Breadcrumbs from '../components/Breadcrumbs';

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const load = () =>
      setCart(JSON.parse(localStorage.getItem('fv_cart') || '[]'));
    load();
    window.addEventListener('fv-cart-update', load);
    return () => window.removeEventListener('fv-cart-update', load);
  }, []);

  const update = (updated) => {
    localStorage.setItem('fv_cart', JSON.stringify(updated));
    setCart(updated);
    window.dispatchEvent(new Event('fv-cart-update'));
  };

  const changeQty = (id, delta) => {
    const updated = cart
      .map((c) => (c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
      .filter((c) => c.qty > 0);
    update(updated);
  };

  const remove = (id) => update(cart.filter((c) => c.id !== id));

  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  const itemsCount = cart.reduce((sum, c) => sum + c.qty, 0);

  return (
    <div
      className="fv-container"
      style={{ padding: '56px 24px 80px', maxWidth: 960 }}
    >
      <Breadcrumbs items={[{ label: 'Cart' }]} />
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
          Your Cart
        </h1>
        <p
          style={{
            fontSize: 14,
            color: '#a0a0a0',
            margin: 0,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          {itemsCount} item{itemsCount !== 1 ? 's' : ''} · Demo only — no real checkout
        </p>
      </div>

      {cart.length === 0 ? (
        <div
          style={{
            padding: 60,
            textAlign: 'center',
            background: '#151518',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: 16,
          }}
        >
          <FaShoppingCart
            style={{
              fontSize: 36,
              color: '#a8a8a8',
              marginBottom: 16,
              opacity: 0.6,
            }}
          />
          <div
            style={{
              fontSize: 15,
              color: '#f5f5f5',
              marginBottom: 8,
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            Your cart is empty.
          </div>
          <div
            style={{
              fontSize: 13,
              color: '#a8a8a8',
              marginBottom: 24,
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            Browse merchandise in any category to add items.
          </div>
          <Link to="/category/anime" className="fv-btn fv-btn-primary">
            Shop Now <FaArrowRight style={{ fontSize: 11 }} />
          </Link>
        </div>
      ) : (
        <>
          {/* Items list */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              marginBottom: 24,
            }}
          >
            {cart.map((item) => (
              <div
              key={item.id}
              className="fv-cart-row"
              style={{
                padding: 18,
                display: 'flex',
                gap: 16,
                alignItems: 'center',
                background: '#151518',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: 14,
                flexWrap: 'wrap',
              }}
            >
                {/* Thumb */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 10,
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {item.image ? (
                    <SmartImage
                      src={item.image}
                      alt={item.name}
                      loadingText=""
                      showLoadingText={false}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <span style={{ fontSize: 22 }}>🛍️</span>
                  )}
                </div>

                {/* Name + type */}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div
                    style={{
                      fontSize: 15,
                      fontFamily: 'Orbitron, sans-serif',
                      fontWeight: 600,
                      color: '#f5f5f5',
                      marginBottom: 4,
                      letterSpacing: '0.01em',
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: '#a8a8a8',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    {item.type}
                  </div>
                </div>

                {/* Quantity */}
                <div
                  className="fv-cart-qty"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: 8,
                    padding: 3,
                  }}
                >
                  <button
                    onClick={() => changeQty(item.id, -1)}
                    aria-label="Decrease"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'transparent',
                      border: 'none',
                      color: '#a0a0a0',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      fontSize: 10,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <FaMinus />
                  </button>
                  <span
                    style={{
                      minWidth: 26,
                      textAlign: 'center',
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#f5f5f5',
                    }}
                  >
                    {item.qty}
                  </span>
                  <button
                    onClick={() => changeQty(item.id, 1)}
                    aria-label="Increase"
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 6,
                      background: 'transparent',
                      border: 'none',
                      color: '#a0a0a0',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                      fontSize: 10,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <FaPlus />
                  </button>
                </div>

                {/* Price */}
                <div
                  className="fv-cart-price"
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#f5f5f5',
                    minWidth: 80,
                    textAlign: 'right',
                  }}
                >
                  ${(item.price * item.qty).toFixed(2)}
                </div>

                {/* Remove */}
                <button
                  onClick={() => remove(item.id)}
                  aria-label="Remove"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: '#a8a8a8',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    fontSize: 12,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)';
                    e.currentTarget.style.color = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.color = '#a8a8a8';
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              padding: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
              background: '#151518',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: 16,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 11,
                  color: '#a8a8a8',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                Total
              </div>
              <div
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 30,
                  fontWeight: 800,
                  color: '#f5f5f5',
                  letterSpacing: '0.01em',
                }}
              >
                ${total.toFixed(2)}
              </div>
            </div>
            <button
              onClick={() => alert('Demo only — no real checkout.')}
              className="fv-btn fv-btn-primary"
              style={{
                padding: '14px 28px',
                fontSize: 14,
                fontWeight: 600,
                gap: 8,
              }}
            >
              Proceed to Checkout <FaArrowRight style={{ fontSize: 11 }} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}