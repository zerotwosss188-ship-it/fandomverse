import { useState } from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaLocationArrow,
  FaSpinner,
} from 'react-icons/fa';

const OFFICE_ADDRESS = '123 Fandom Ave, Los Angeles, CA';
const OFFICE_COORDS = { lat: 34.0522, lng: -118.2437 };

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  // GPS state
  const [gpsState, setGpsState] = useState('idle'); // 'idle' | 'loading' | 'ok' | 'error'
  const [userLocation, setUserLocation] = useState(null);
  const [gpsError, setGpsError] = useState('');

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name required';
    if (!form.email.trim()) errs.email = 'Email required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.message.trim()) errs.message = 'Message required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSent(true);
    setForm({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  // ---- GPS ----
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsState('error');
      setGpsError('GPS not supported by this browser.');
      return;
    }
    setGpsState('loading');
    setGpsError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setGpsState('ok');
      },
      (err) => {
        setGpsState('error');
        setGpsError(
          err.code === 1
            ? 'Location permission denied.'
            : 'Could not get your location.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // ---- Map URLs ----
  const officeMapUrl =
    `https://maps.google.com/maps?q=${encodeURIComponent(OFFICE_ADDRESS)}` +
    `&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const userMapUrl = userLocation
    ? `https://maps.google.com/maps?q=${userLocation.lat},${userLocation.lng}` +
      `&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : null;

  return (
    <div className="fv-container" style={{ padding: '60px 24px 80px' }}>
            <Breadcrumbs items={[{ label: 'Contact' }]} />
      <h1 className="fv-section-title">Contact Us</h1>
      <p className="fv-section-sub">We'd love to hear from you.</p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
          gap: 32,
          marginTop: 24,
        }}
      >
        {/* Form */}
        <div className="fv-card" style={{ padding: 28 }}>
          <h2 style={{ fontSize: 18, fontFamily: 'Orbitron, sans-serif', marginBottom: 20 }}>
            Send a Message
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={inputStyle(errors.name)}
              />
              {errors.name && <div style={errorStyle}>{errors.name}</div>}
            </div>
            <div>
              <input
                type="email"
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                style={inputStyle(errors.email)}
              />
              {errors.email && <div style={errorStyle}>{errors.email}</div>}
            </div>
            <div>
              <textarea
                placeholder="Your message"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                style={{
                  ...inputStyle(errors.message),
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              {errors.message && <div style={errorStyle}>{errors.message}</div>}
            </div>
            <button
              type="submit"
              className="fv-btn fv-btn-primary"
              style={{ alignSelf: 'flex-start' }}
            >
              Send Message
            </button>
            {sent && (
              <div
                style={{
                  fontSize: 13,
                  color: '#34d399',
                  padding: '10px 14px',
                  background: 'rgba(52,211,153,0.1)',
                  border: '1px solid rgba(52,211,153,0.3)',
                  borderRadius: 8,
                }}
              >
                ✓ Message validated. (Demo — no backend, nothing sent.)
              </div>
            )}
          </form>
        </div>

        {/* Info + Map */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            className="fv-card"
            style={{
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14,
                color: '#cbd5e1',
              }}
            >
              <FaEnvelope style={{ color: '#60a5fa' }} /> hello@fandomverse.dev
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14,
                color: '#cbd5e1',
              }}
            >
              <FaPhone style={{ color: '#60a5fa' }} /> +1 (555) 010-1234
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                fontSize: 14,
                color: '#cbd5e1',
              }}
            >
              <FaMapMarkerAlt style={{ color: '#60a5fa' }} /> {OFFICE_ADDRESS}
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 18, marginTop: 8 }}>
              <FaTwitter style={{ color: '#60a5fa', cursor: 'pointer' }} />
              <FaInstagram style={{ color: '#f472b6', cursor: 'pointer' }} />
              <FaYoutube style={{ color: '#f87171', cursor: 'pointer' }} />
            </div>
          </div>

          {/* GPS Button */}
          <div
            className="fv-card"
            style={{
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 12,
                color: '#a8a8a8',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontFamily: 'Orbitron, sans-serif',
                fontWeight: 600,
              }}
            >
              <FaLocationArrow style={{ color: '#dc2626' }} />
              Find Your Location
            </div>

            <button
              type="button"
              onClick={handleUseMyLocation}
              disabled={gpsState === 'loading'}
              className="fv-btn fv-btn-primary"
              style={{
                gap: 8,
                alignSelf: 'flex-start',
                opacity: gpsState === 'loading' ? 0.6 : 1,
                cursor: gpsState === 'loading' ? 'wait' : 'pointer',
              }}
            >
              {gpsState === 'loading' ? (
                <>
                  <FaSpinner style={{ animation: 'fv-spin 0.8s linear infinite' }} />
                  Locating...
                </>
              ) : (
                <>
                  <FaLocationArrow style={{ fontSize: 12 }} />
                  Use My Location
                </>
              )}
            </button>

            {gpsState === 'ok' && userLocation && (
              <div
                style={{
                  fontSize: 12,
                  color: '#34d399',
                  padding: '10px 12px',
                  background: 'rgba(52,211,153,0.08)',
                  border: '1px solid rgba(52,211,153,0.25)',
                  borderRadius: 8,
                  fontFamily: 'Space Grotesk, sans-serif',
                  lineHeight: 1.5,
                }}
              >
                ✓ Found you
                <br />
                Lat: <strong>{userLocation.lat.toFixed(4)}</strong> · Lng:{' '}
                <strong>{userLocation.lng.toFixed(4)}</strong>
                <br />
                <span style={{ color: '#a8a8a8', fontSize: 11 }}>
                  Accuracy: ±{userLocation.accuracy}m
                </span>
              </div>
            )}

            {gpsState === 'error' && (
              <div
                style={{
                  fontSize: 12,
                  color: '#f87171',
                  padding: '10px 12px',
                  background: 'rgba(248,113,113,0.08)',
                  border: '1px solid rgba(248,113,113,0.25)',
                  borderRadius: 8,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                ✗ {gpsError}
              </div>
            )}
          </div>

          {/* Map — shows your location if GPS is on, else office */}
          <div
            className="fv-card"
            style={{
              padding: 0,
              overflow: 'hidden',
              height: 280,
              position: 'relative',
            }}
          >
            <iframe
              title="map"
              src={userMapUrl || officeMapUrl}
              style={{
                width: '100%',
                height: '100%',
                border: 0,
                filter: 'invert(0.9) hue-rotate(180deg)',
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            {userLocation && (
              <div
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  padding: '6px 12px',
                  fontSize: 11,
                  borderRadius: 6,
                  background: 'rgba(10,10,10,0.85)',
                  border: '1px solid rgba(52,211,153,0.4)',
                  color: '#34d399',
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  backdropFilter: 'blur(8px)',
                }}
              >
                ● YOUR LOCATION
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fv-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = (hasError) => ({
  width: '100%',
  padding: '12px 16px',
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${
    hasError ? 'rgba(248,113,113,0.6)' : 'rgba(220,38,38,0.2)'
  }`,
  borderRadius: 10,
  color: '#fff',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'Space Grotesk, sans-serif',
});

const errorStyle = {
  fontSize: 11,
  color: '#f87171',
  marginTop: 4,
  marginLeft: 4,
};