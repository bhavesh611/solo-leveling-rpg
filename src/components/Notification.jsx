import { useEffect, useState } from 'react';

const TYPE_CONFIG = {
  system: { color: '#1e90ff', icon: '⬡', label: 'SYSTEM' },
  xp:     { color: '#4ade80', icon: '✦', label: 'XP AWARDED' },
  error:  { color: '#ef4444', icon: '⚠', label: 'SYSTEM ERROR' },
  rank:   { color: '#f97316', icon: '★', label: 'RANK UP' },
  info:   { color: '#a78bfa', icon: '◈', label: 'NOTICE' },
};

export default function Notification({ notification }) {
  const [leaving, setLeaving] = useState(false);
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;

  useEffect(() => {
    const t = setTimeout(() => setLeaving(true), 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'rgba(2,8,18,0.96)',
      border: `1px solid ${cfg.color}`,
      borderLeft: `3px solid ${cfg.color}`,
      borderRadius: 4,
      padding: '10px 16px',
      minWidth: 280,
      maxWidth: 340,
      boxShadow: `0 0 16px ${cfg.color}30, 0 4px 20px rgba(0,0,0,0.6)`,
      animation: leaving
        ? 'slideUp 0.3s ease forwards'
        : 'slideDown 0.3s ease both',
      backdropFilter: 'blur(8px)',
    }}>
      <span style={{ color: cfg.color, fontSize: 16, flexShrink: 0 }}>{cfg.icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 9,
          color: cfg.color,
          letterSpacing: '0.12em',
          marginBottom: 2,
          opacity: 0.8,
        }}>
          {cfg.label}
        </div>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          color: '#e2e8f0',
          letterSpacing: '0.04em',
          lineHeight: 1.3,
        }}>
          {notification.message}
        </div>
      </div>
      {/* Glow line */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: 1,
        background: `linear-gradient(90deg, ${cfg.color}00, ${cfg.color}60, ${cfg.color}00)`,
        borderRadius: '0 0 4px 4px',
      }} />
    </div>
  );
}
