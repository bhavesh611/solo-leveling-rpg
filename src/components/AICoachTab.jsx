import { useState, useRef, useEffect } from 'react';
import { sendCoachMessage, parseXPAward } from '../utils/claude';

function SystemMessage({ msg }) {
  const isSystem = msg.role === 'assistant';
  const xpMatch = msg.content.match(/\[XP_AWARD:\s*(\d+)\]/i);
  const displayText = msg.content.replace(/\[XP_AWARD:\s*\d+\]/gi, '').trim();

  return (
    <div style={{
      display: 'flex',
      flexDirection: isSystem ? 'row' : 'row-reverse',
      alignItems: 'flex-end',
      gap: 8,
      animation: 'fadeIn 0.3s ease both',
    }}>
      {isSystem && (
        <div style={{
          width: 28, height: 28, borderRadius: 4, flexShrink: 0,
          background: 'linear-gradient(135deg, #1e3a5c, #0f172a)',
          border: '1px solid #1e90ff40',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12,
        }}>
          ⬡
        </div>
      )}
      <div style={{ maxWidth: '78%' }}>
        {isSystem && (
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 7, letterSpacing: '0.15em',
            color: '#1e90ff', marginBottom: 4, opacity: 0.7,
          }}>
            THE SYSTEM
          </div>
        )}
        <div style={{
          background: isSystem
            ? 'rgba(30,144,255,0.08)'
            : 'rgba(124,58,237,0.1)',
          border: `1px solid ${isSystem ? 'rgba(30,144,255,0.25)' : 'rgba(124,58,237,0.3)'}`,
          borderRadius: isSystem ? '4px 12px 12px 4px' : '12px 4px 4px 12px',
          padding: '10px 14px',
          boxShadow: isSystem
            ? '0 2px 12px rgba(30,144,255,0.08)'
            : '0 2px 12px rgba(124,58,237,0.08)',
        }}>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 14, fontWeight: 500,
            color: isSystem ? '#cbd5e1' : '#e2e8f0',
            lineHeight: 1.5,
            letterSpacing: '0.02em',
          }}>
            {displayText}
          </div>
        </div>
        {xpMatch && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.3)',
            borderRadius: 4, padding: '3px 8px',
            marginTop: 5,
          }}>
            <span style={{ color: '#4ade80', fontSize: 10 }}>✦</span>
            <span style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 9, fontWeight: 700,
              color: '#4ade80', letterSpacing: '0.12em',
            }}>
              +{xpMatch[1]} XP AWARDED
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 4, flexShrink: 0,
        background: 'linear-gradient(135deg, #1e3a5c, #0f172a)',
        border: '1px solid #1e90ff40',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
      }}>
        ⬡
      </div>
      <div style={{
        background: 'rgba(30,144,255,0.08)',
        border: '1px solid rgba(30,144,255,0.2)',
        borderRadius: '4px 12px 12px 4px',
        padding: '12px 16px',
        display: 'flex', gap: 5, alignItems: 'center',
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#1e90ff',
            animation: `float 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

const STARTER_PROMPTS = [
  'I just completed a 20-minute walk',
  'I drank 2 liters of water today',
  'I ate a high-protein meal',
  'How do I improve my endurance?',
  'Give me a motivation boost',
];

export default function AICoachTab({ apiKey, player, profile, chatHistory, setChatHistory, onXPAward, showNotification }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `The System acknowledges your presence, ${player?.name || 'hunter'}. You are ${player?.rank}-Rank. Report your activities. Meal consumed. Water ingested. Training completed. The System evaluates all submissions. Exceptional performance will be rewarded.`,
  }]);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Build history for API (skip the initial system greeting)
    const apiHistory = [...chatHistory, userMsg];

    try {
      const reply = await sendCoachMessage(apiKey, apiHistory, player, profile);
      const xp = parseXPAward(reply);
      const assistantMsg = { role: 'assistant', content: reply };
      setMessages(prev => [...prev, assistantMsg]);
      setChatHistory([...apiHistory, assistantMsg]);
      if (xp > 0) {
        onXPAward(xp);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Connection to the System was interrupted. Retry your transmission.',
      }]);
      showNotification('AI SYSTEM ERROR: ' + (err.message || 'UNKNOWN'), 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #1e293b',
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(30,144,255,0.2))',
          border: '1px solid rgba(124,58,237,0.4)',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16,
        }}>
          ⬡
        </div>
        <div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 11, fontWeight: 700, color: '#e2e8f0', letterSpacing: '0.08em' }}>
            SYSTEM AI
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 4px #4ade80' }} />
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: '#4ade80', letterSpacing: '0.05em' }}>
              ONLINE — HEALTH COACH ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '14px 14px',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {messages.map((msg, i) => (
          <SystemMessage key={i} msg={msg} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={endRef} />
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && !loading && (
        <div style={{ padding: '0 14px 8px', flexShrink: 0 }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif', fontSize: 7,
            color: '#334155', letterSpacing: '0.15em', marginBottom: 7,
          }}>
            QUICK REPORTS
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {STARTER_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => sendMessage(p)}
                style={{
                  padding: '5px 10px',
                  background: 'rgba(30,144,255,0.06)',
                  border: '1px solid rgba(30,144,255,0.2)',
                  borderRadius: 20,
                  color: '#64748b',
                  fontFamily: 'Rajdhani, sans-serif',
                  fontSize: 11, fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.color = '#93c5fd'; e.target.style.borderColor = 'rgba(30,144,255,0.4)'; }}
                onMouseLeave={e => { e.target.style.color = '#64748b'; e.target.style.borderColor = 'rgba(30,144,255,0.2)'; }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '10px 14px 14px',
        borderTop: '1px solid #1e293b',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
            placeholder="Report your activity to the System..."
            style={{
              flex: 1,
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid #1e3a5c',
              borderRadius: 6,
              padding: '10px 14px',
              color: '#e2e8f0',
              fontSize: 14,
              fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 500,
            }}
            onFocus={e => e.target.style.borderColor = '#1e90ff'}
            onBlur={e => e.target.style.borderColor = '#1e3a5c'}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            style={{
              width: 44, height: 44,
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, rgba(30,144,255,0.3), rgba(124,58,237,0.2))'
                : 'rgba(30,144,255,0.05)',
              border: `1px solid ${input.trim() && !loading ? '#1e90ff' : '#1e293b'}`,
              borderRadius: 6,
              color: input.trim() && !loading ? '#fff' : '#334155',
              fontSize: 16, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ↑
          </button>
        </div>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 10,
          color: '#1e3a5c', textAlign: 'center', marginTop: 6,
        }}>
          Report meals, workouts & water for bonus XP
        </div>
      </div>
    </div>
  );
}
