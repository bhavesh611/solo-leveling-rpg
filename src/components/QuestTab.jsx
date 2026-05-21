import QuestCard from './QuestCard';
import OrnateBox from './OrnateBox';

function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.5)',
      border: '1px solid #1e293b',
      borderLeft: '3px solid #1e293b',
      borderRadius: 6,
      padding: '14px 16px',
      overflow: 'hidden',
    }}>
      {[80, 120, 60].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? 10 : i === 1 ? 12 : 10,
          width: `${w}%`,
          background: 'linear-gradient(90deg, #1e293b 25%, #2d3f56 50%, #1e293b 75%)',
          backgroundSize: '400px 100%',
          borderRadius: 3,
          marginBottom: i === 2 ? 0 : 10,
          animation: 'shimmer 1.5s infinite linear',
        }} />
      ))}
    </div>
  );
}

export default function QuestTab({ quests, loading, onComplete, onRefresh, player }) {
  const completed = quests.filter(q => q.completed).length;
  const total = quests.length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 0', flexShrink: 0 }}>
        <OrnateBox style={{
          background: 'rgba(15,23,42,0.7)',
          border: '1px solid #1e293b',
          padding: '14px 20px',
          marginBottom: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 9,
                letterSpacing: '0.25em',
                color: '#475569',
                marginBottom: 4,
              }}>
                DAILY QUEST LOG
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontWeight: 900,
                  fontSize: 28,
                  color: completed === total && total > 0 ? '#4ade80' : '#1e90ff',
                  lineHeight: 1,
                  textShadow: `0 0 12px ${completed === total && total > 0 ? 'rgba(74,222,128,0.4)' : 'rgba(30,144,255,0.3)'}`,
                }}>
                  {completed}
                </span>
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 16,
                  color: '#334155',
                }}>
                  / {total}
                </span>
              </div>
              <div style={{
                fontFamily: 'Rajdhani, sans-serif',
                fontSize: 11,
                color: '#475569',
                marginTop: 2,
              }}>
                QUESTS COMPLETE
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 11,
                color: '#94a3b8',
                marginBottom: 2,
              }}>
                {player?.name}
              </div>
              <div style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 9,
                color: '#475569',
              }}>
                LV.{player?.level} — {player?.rank}-RANK
              </div>
            </div>
          </div>

          {/* Progress bar */}
          {total > 0 && (
            <div style={{ marginTop: 12, height: 3, background: '#1e293b', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(completed / total) * 100}%`,
                background: completed === total
                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                  : 'linear-gradient(90deg, #1e90ff, #7c3aed)',
                borderRadius: 2,
                transition: 'width 0.5s ease',
                boxShadow: '0 0 6px currentColor',
              }} />
            </div>
          )}
        </OrnateBox>

        {/* CAUTION bar */}
        {total > 0 && completed < total && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 4,
            padding: '7px 12px',
            marginBottom: 10,
          }}>
            <span style={{ color: '#ef4444', fontSize: 11 }}>⚠</span>
            <span style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: '#ef4444',
              letterSpacing: '0.06em',
            }}>
              CAUTION
            </span>
            <span style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 12,
              color: '#94a3b8',
              letterSpacing: '0.02em',
            }}>
              — INCOMPLETE QUESTS DELAY YOUR PROGRESSION.
            </span>
          </div>
        )}

        {completed === total && total > 0 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(74,222,128,0.06)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: 4,
            padding: '7px 12px',
            marginBottom: 10,
          }}>
            <span style={{ color: '#4ade80', fontSize: 11 }}>✦</span>
            <span style={{
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: '#4ade80',
              letterSpacing: '0.06em',
            }}>
              ALL QUESTS COMPLETE — EXCEPTIONAL PERFORMANCE, HUNTER.
            </span>
          </div>
        )}
      </div>

      {/* Quest list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '4px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}>
        {loading ? (
          [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
        ) : quests.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            color: '#334155',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 14,
            letterSpacing: '0.05em',
          }}>
            NO QUESTS LOADED
          </div>
        ) : (
          quests.map((q, i) => (
            <QuestCard
              key={q.id}
              quest={q}
              onComplete={onComplete}
              animDelay={i * 60}
            />
          ))
        )}
      </div>

      {/* Refresh */}
      <div style={{ padding: '10px 16px 14px', flexShrink: 0 }}>
        <button
          onClick={onRefresh}
          disabled={loading}
          style={{
            width: '100%',
            padding: '11px',
            background: 'rgba(124,58,237,0.08)',
            border: `1px solid ${loading ? '#1e293b' : 'rgba(124,58,237,0.4)'}`,
            borderRadius: 4,
            color: loading ? '#334155' : '#a78bfa',
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.2em',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {loading ? '◌ GENERATING QUESTS...' : '↺ REFRESH QUEST SET'}
        </button>
      </div>
    </div>
  );
}
