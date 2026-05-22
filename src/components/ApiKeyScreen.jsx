import { useState } from 'react';
import OrnateBox from './OrnateBox';
import { validateApiKey } from '../utils/claude';

export default function ApiKeyScreen({ onSubmit }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      setError('INVALID KEY FORMAT. KEY MUST BEGIN WITH sk-ant-');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await validateApiKey(trimmed);
      onSubmit(trimmed);
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('401') || msg.toLowerCase().includes('auth') || msg.toLowerCase().includes('invalid')) {
        setError('AUTHENTICATION FAILED. KEY REJECTED BY THE SYSTEM.');
      } else {
        setError(msg || 'CONNECTION TO SYSTEM FAILED.');
      }
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: '100%', height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0a1628 0%, #020812 70%)',
      padding: 24,
      animation: 'fadeIn 0.5s ease both',
    }}>
      <div className="scanline-overlay" />
      <div className="scan-beam" />

      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10,
            letterSpacing: '0.4em',
            color: '#1e90ff',
            marginBottom: 12,
            opacity: 0.8,
          }}>
            ⬡ SYSTEM INITIALIZATION ⬡
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 900,
            fontSize: 28,
            color: '#fff',
            letterSpacing: '0.05em',
            textShadow: '0 0 20px rgba(30,144,255,0.4)',
            lineHeight: 1.2,
          }}>
            SOLO LEVELING<br />
            <span style={{ color: '#1e90ff', fontSize: 20 }}>HEALTH RPG</span>
          </div>
        </div>

        <OrnateBox style={{
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid #1e293b',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 10,
              letterSpacing: '0.2em',
              color: '#64748b',
              marginBottom: 20,
              textAlign: 'center',
            }}>
              AUTHENTICATE WITH ANTHROPIC API KEY
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 9,
                letterSpacing: '0.15em',
                color: '#1e90ff',
                marginBottom: 8,
              }}>
                API KEY
              </div>
              <input
                type="password"
                value={key}
                onChange={e => { setKey(e.target.value); setError(''); }}
                placeholder="sk-ant-api03-..."
                autoComplete="off"
                style={{
                  width: '100%',
                  background: 'rgba(30,144,255,0.06)',
                  border: `1px solid ${error ? '#ef4444' : '#1e3a5c'}`,
                  borderRadius: 4,
                  padding: '12px 14px',
                  color: '#e2e8f0',
                  fontSize: 13,
                  fontFamily: 'monospace',
                  letterSpacing: '0.05em',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = '#1e90ff'}
                onBlur={e => e.target.style.borderColor = error ? '#ef4444' : '#1e3a5c'}
              />
            </div>

            {error && (
              <div style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 11,
                color: '#ef4444',
                marginBottom: 16,
                letterSpacing: '0.05em',
                padding: '8px 10px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 3,
              }}>
                ⚠ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!key.trim() || loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading
                  ? 'rgba(30,144,255,0.1)'
                  : 'linear-gradient(135deg, rgba(30,144,255,0.2), rgba(30,144,255,0.1))',
                border: `1px solid ${loading ? '#1e3a5c' : '#1e90ff'}`,
                borderRadius: 4,
                color: loading ? '#475569' : '#fff',
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.2em',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: loading ? 'none' : '0 0 12px rgba(30,144,255,0.2)',
              }}
            >
              {loading ? '◌ CONNECTING...' : '⚔ CONNECT TO SYSTEM'}
            </button>

            <div style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 11,
              color: '#334155',
              textAlign: 'center',
              marginTop: 16,
              lineHeight: 1.5,
            }}>
              Your API key is never stored. It stays in memory only<br />
              for this session. Get yours at console.anthropic.com
            </div>
          </form>
        </OrnateBox>
      </div>
    </div>
  );
}
