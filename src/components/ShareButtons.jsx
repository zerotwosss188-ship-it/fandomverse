import { FaTwitter, FaFacebook, FaWhatsapp, FaLink, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encoded = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title || 'Check this out on FandomVerse');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  const shareLinks = [
    { icon: <FaTwitter />, color: '#1DA1F2', url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}` },
    { icon: <FaFacebook />, color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encoded}` },
    { icon: <FaWhatsapp />, color: '#25D366', url: `https://wa.me/?text=${encodedTitle}%20${encoded}` },
  ];

  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {shareLinks.map((s, i) => (
        <a
          key={i}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="fv-btn fv-btn-ghost"
          style={{ padding: '8px 12px', fontSize: 13, color: s.color }}
          aria-label="Share"
        >
          {s.icon}
        </a>
      ))}
      <button
        onClick={copyLink}
        className="fv-btn fv-btn-ghost"
        style={{
          padding: '8px 12px',
          fontSize: 13,
          color: copied ? '#34d399' : undefined,
          borderColor: copied ? '#34d399' : undefined,
          gap: 6,
        }}
      >
        {copied ? <FaCheck /> : <FaLink />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}