import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPaperPlane, FaArrowRight } from 'react-icons/fa';
import AIOrbFace from './AIOrbFace';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am VerseBot 🤖 Ask me about any fandom!' },
  ]);
  const [input, setInput] = useState('');
  const [aiState, setAiState] = useState('idle');
  const [kb, setKb] = useState(null);
  const scrollRef = useRef(null);

  const quickReplies = [
    'What is Anime?',
    'Trending games?',
    'Best movies right now?',
    'Recommend K-Pop',
    'How do I bookmark?',
    'What are upcoming releases?',
    'Show me merchandise',
    'Contact info',
    'About FandomVerse',
    'Search everything',
  ];

  useEffect(() => {
    fetch('/data/chatbot.json')
      .then((r) => r.json())
      .then(setKb)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const findReply = (text) => {
    if (!kb) {
      return { text: 'Still loading... try again.', link: null };
    }
    const q = text.toLowerCase();
    for (const r of kb.responses) {
      if (r.keywords.some((k) => q.includes(k.toLowerCase()))) {
        return { text: r.reply, link: r.link || null };
      }
    }
    return { text: kb.fallback, link: kb.fallbackLink || null };
  };

  const handleSend = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    setAiState('thinking');

    setTimeout(() => {
      setAiState('streaming');
      setTimeout(() => {
        const reply = findReply(text);
        setMessages((m) => [
          ...m,
          { from: 'bot', text: reply.text, link: reply.link },
        ]);
        setAiState('done');
        setTimeout(() => setAiState('idle'), 1800);
      }, 700);
    }, 900);
  };

  const showQuickReplies = messages.length <= 1;

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 68,
          height: 68,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '1px solid rgba(220, 38, 38, 0.4)',
          zIndex: 200,
          boxShadow: '0 8px 32px rgba(220, 38, 38, 0.5)',
          display: 'grid',
          placeItems: 'center',
          padding: 0,
          cursor: 'pointer',
        }}
        aria-label="Open chatbot"
      >
        {open ? (
          <span style={{ fontSize: 24, color: '#fca5a5' }}>×</span>
        ) : (
          <AIOrbFace state={aiState} size={60} gaze={true} />
        )}
      </button>

      {open && (
        <div
          className="fv-chat-panel"
          style={{
            position: 'fixed',
            bottom: 104,
            right: 24,
            width: 360,
            height: 520,
            background: 'rgba(10, 13, 24, 0.98)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: 18,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 200,
            overflow: 'hidden',
            backdropFilter: 'blur(16px)',
            fontFamily: 'Space Grotesk, sans-serif',
            boxShadow:
              '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(220,38,38,0.15)',
          }}
        >
          <div
            style={{
              padding: '14px 18px',
              borderBottom: '1px solid rgba(220, 38, 38, 0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'rgba(220, 38, 38, 0.04)',
            }}
          >
            <AIOrbFace state={aiState} size={38} gaze={false} />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontWeight: 700,
                  color: '#fca5a5',
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 13,
                  letterSpacing: '0.08em',
                }}
              >
                VERSEBOT
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: '#6b7590',
                  textTransform: 'capitalize',
                }}
              >
                {aiState === 'idle' ? 'online' : aiState}
              </span>
            </div>
          </div>

          <div ref={scrollRef} style={{ flex: 1, padding: 14, overflowY: 'auto' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: 10,
                  display: 'flex',
                  justifyContent: m.from === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: 8,
                }}
              >
                {m.from === 'bot' && (
                  <AIOrbFace state="idle" size={26} gaze={false} />
                )}
                <div
                  style={{
                    maxWidth: '78%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    alignItems: m.from === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      padding: '9px 13px',
                      borderRadius: 12,
                      fontSize: 13,
                      lineHeight: 1.5,
                      background:
                        m.from === 'user'
                          ? 'linear-gradient(135deg, #dc2626, #f97316)'
                          : 'rgba(220, 38, 38, 0.1)',
                      color: m.from === 'user' ? '#fff' : '#cbd5e1',
                      border:
                        m.from === 'bot'
                          ? '1px solid rgba(220, 38, 38, 0.15)'
                          : 'none',
                    }}
                  >
                    {m.text}
                  </div>

                  {m.from === 'bot' && m.link && (
                    <Link
                      to={m.link.to}
                      onClick={() => setOpen(false)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '6px 12px',
                        fontSize: 11,
                        borderRadius: 999,
                        background: 'rgba(220, 38, 38, 0.15)',
                        border: '1px solid rgba(220, 38, 38, 0.4)',
                        color: '#fca5a5',
                        textDecoration: 'none',
                        fontFamily: 'Orbitron, sans-serif',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          'rgba(220, 38, 38, 0.28)';
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          'rgba(220, 38, 38, 0.15)';
                        e.currentTarget.style.borderColor =
                          'rgba(220, 38, 38, 0.4)';
                        e.currentTarget.style.color = '#fca5a5';
                      }}
                    >
                      {m.link.label} <FaArrowRight style={{ fontSize: 9 }} />
                    </Link>
                  )}
                </div>
              </div>
            ))}

            {aiState === 'thinking' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AIOrbFace state="thinking" size={26} gaze={false} />
                <div
                  style={{
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: 'rgba(220, 38, 38, 0.1)',
                    fontSize: 12,
                    color: '#fca5a5',
                    display: 'flex',
                    gap: 4,
                  }}
                >
                  <Dot delay={0} />
                  <Dot delay={0.15} />
                  <Dot delay={0.3} />
                </div>
              </div>
            )}
          </div>

          {showQuickReplies && (
            <div
              style={{
                padding: '0 10px 6px',
                display: 'flex',
                gap: 6,
                flexWrap: 'wrap',
              }}
            >
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  style={{
                    fontSize: 11,
                    padding: '5px 10px',
                    borderRadius: 999,
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.25)',
                    color: '#fca5a5',
                    cursor: 'pointer',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          <div
            style={{
              display: 'flex',
              padding: 10,
              borderTop: '1px solid rgba(220, 38, 38, 0.15)',
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
              placeholder="Ask something..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                borderRadius: 8,
                padding: '9px 12px',
                color: '#fff',
                fontSize: 13,
                outline: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            />
            <button
              onClick={() => handleSend(input)}
              style={{
                padding: '9px 14px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #dc2626, #f97316)',
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
              }}
            >
              <FaPaperPlane style={{ fontSize: 13 }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Dot({ delay }) {
  return (
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: '50%',
        background: '#fca5a5',
        display: 'inline-block',
        animation: 'fv-dot 1.2s infinite',
        animationDelay: `${delay}s`,
      }}
    />
  );
}