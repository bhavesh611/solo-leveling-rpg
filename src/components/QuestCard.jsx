const TYPE = {
  workout:   { color: '#60a5fa', icon: '⚔', label: 'WORKOUT' },
  nutrition: { color: '#4ade80', icon: '🌿', label: 'NUTRITION' },
  hydration: { color: '#22d3ee', icon: '💧', label: 'HYDRATION' },
};

export default function QuestCard({ quest, onComplete, animDelay = 0 }) {
  const cfg = TYPE[quest.type] || TYPE.workout;

  return (
    <div style={{
      position: 'relative',
      background: quest.completed
        ? 'rgba(15,23,42,0.4)'
        : 'rgba(15,23,42,0.85)',
      border: `1px solid ${quest.completed ? '#1e293b' : cfg.color + '40'}`,
      borderLeft: `3px solid ${quest.completed ? '#334155' : cfg.color}`,
      borderRadius: 6,
      padding: '14px 16px',
      transition: 'all 0.3s ease',
      opacity: quest.completed ? 0.55 : 1,
      animation: `fadeIn 0.35s ease ${animDelay}ms both`,
      boxShadow: quest.completed ? 'none' : `0 2px 12px ${cfg.color}10`,
    }}>
      {/* Completed overlay */}
      {quest.completed && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 6,
          background: 'rgba(2,8,18,0.2)',
          zIndex: 1,
        }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 11,
            letterSpacing: '0.25em',
            color: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <span>✓</span> QUEST COMPLETE
          </div>
        </div>
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ flex: 1, paddingRight: 12 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            background: `${cfg.color}18`,
            border: `1px solid ${cfg.color}30`,
            borderRadius: 3,
            padding: '2px 7px',
            marginBottom: 6,
          }}>
            <span style={{ fontSize: 10 }}>{cfg.icon}</span>
            <span style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 8,
              color: cfg.color,
              letterSpacing: '0.15em',
            }}>
              {cfg.label}
            </span>
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            fontSize: 12,
            color: '#e2e8f0',
            letterSpacing: '0.06em',
            lineHeight: 1.3,
          }}>
            {quest.title}
          </div>
        </div>
        {/* XP badge */}
        <div style={{
          background: `linear-gradient(135deg, ${cfg.color}25, ${cfg.color}10)`,
          border: `1px solid ${cfg.color}50`,
          borderRadius: 4,
          padding: '5px 8px',
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 900,
            fontSize: 16,
            color: cfg.color,
            lineHeight: 1,
          }}>
            {quest.xp}
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 7,
            color: cfg.color,
            opacity: 0.7,
            letterSpacing: '0.1em',
          }}>
            XP
          </div>
        </div>
      </div>

      {/* Description */}
      <div style={{
        fontFamily: 'Rajdhani, sans-serif',
        fontSize: 13,
        fontWeight: 500,
        color: '#94a3b8',
        lineHeight: 1.5,
        marginBottom: 12,
      }}>
        {quest.description}
      </div>

      {/* Complete button */}
      {!quest.completed && (
        <button
          onClick={() => onComplete(quest.id)}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(30,144,255,0.08)',
            border: '1px solid rgba(30,144,255,0.3)',
            borderRadius: 4,
            color: '#1e90ff',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'rgba(30,144,255,0.18)';
            e.target.style.borderColor = '#1e90ff';
            e.target.style.boxShadow = '0 0 10px rgba(30,144,255,0.2)';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'rgba(30,144,255,0.08)';
            e.target.style.borderColor = 'rgba(30,144,255,0.3)';
            e.target.style.boxShadow = 'none';
          }}
        >
          COMPLETE QUEST
        </button>
      )}
    </div>
  );
}
