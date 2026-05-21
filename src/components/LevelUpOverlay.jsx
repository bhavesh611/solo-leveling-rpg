import { useState, useEffect } from 'react';
import { getRankObj } from '../utils/gameLogic';

export default function LevelUpOverlay({ data, onDismiss }) {
  const [phase, setPhase] = useState('level'); // 'level' | 'rank' | 'done'
  const rankObj = getRankObj(data.rank);
  const oldRankObj = getRankObj(data.oldRank);

  useEffect(() => {
    if (data.rankChanged) {
      const t = setTimeout(() => setPhase('rank'), 1200);
      return () => clearTimeout(t);
    }
  }, [data.rankChanged]);

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(2,8,18,0.94)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
        animation: 'fadeInFast 0.2s ease both',
        cursor: 'pointer',
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, ${rankObj.color}18 0%, transparent 65%)`,
        pointerEvents: 'none',
      }} />

      {/* Horizontal scan lines */}
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          left: 0, right: 0,
          top: `${15 + i * 18}%`,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${rankObj.color}30, transparent)`,
          pointerEvents: 'none',
        }} />
      ))}

      {phase === 'level' && (
        <div style={{ textAlign: 'center', animation: 'levelPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 11,
            letterSpacing: '0.3em',
            color: rankObj.color,
            marginBottom: 12,
            opacity: 0.9,
          }}>
            ✦ LEVEL UP ✦
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 900,
            fontSize: 96,
            color: '#fff',
            lineHeight: 1,
            textShadow: `0 0 30px ${rankObj.color}, 0 0 60px ${rankObj.color}60`,
            letterSpacing: '-0.02em',
          }}>
            {data.level}
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 11,
            letterSpacing: '0.25em',
            color: '#64748b',
            marginTop: 10,
          }}>
            {data.rankChanged ? `${oldRankObj.label} → ${rankObj.label}` : rankObj.label}
          </div>
          {data.rankChanged && (
            <div style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 14,
              color: rankObj.color,
              marginTop: 8,
              opacity: 0.8,
            }}>
              RANK ADVANCEMENT DETECTED
            </div>
          )}
        </div>
      )}

      {phase === 'rank' && data.rankChanged && (
        <div style={{ textAlign: 'center', animation: 'rankReveal 0.8s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 11,
            letterSpacing: '0.3em',
            color: '#94a3b8',
            marginBottom: 20,
          }}>
            RANK ADVANCEMENT
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 900,
            fontSize: 110,
            color: rankObj.color,
            lineHeight: 1,
            textShadow: `0 0 40px ${rankObj.color}, 0 0 80px ${rankObj.color}80`,
          }}>
            {data.rank}
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 14,
            color: rankObj.color,
            letterSpacing: '0.2em',
            marginTop: 8,
          }}>
            {rankObj.label}
          </div>
          <div style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 13,
            color: '#94a3b8',
            marginTop: 12,
            maxWidth: 260,
            lineHeight: 1.5,
          }}>
            {rankObj.description}
          </div>
        </div>
      )}

      <div style={{
        position: 'absolute', bottom: 48,
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 9,
        letterSpacing: '0.2em',
        color: '#334155',
        animation: 'float 2s ease-in-out infinite',
      }}>
        TAP TO CONTINUE
      </div>
    </div>
  );
}
