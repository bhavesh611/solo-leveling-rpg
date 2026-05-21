import OrnateBox from './OrnateBox';
import { RANKS, getRankObj, calcXpToNext } from '../utils/gameLogic';

function StatBar({ label, value, maxValue = 100, color = '#1e90ff' }) {
  const pct = Math.min(100, (value / maxValue) * 100);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 9,
          letterSpacing: '0.18em',
          color: '#94a3b8',
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: 11,
          fontWeight: 700,
          color,
        }}>
          {value}
        </span>
      </div>
      <div style={{ height: 5, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: 3,
          boxShadow: `0 0 6px ${color}80`,
          transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.7)',
      border: `1px solid ${color}30`,
      borderTop: `2px solid ${color}`,
      borderRadius: 6,
      padding: '12px',
      textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontWeight: 900,
        fontSize: 26,
        color,
        lineHeight: 1,
        textShadow: `0 0 12px ${color}60`,
      }}>
        {value}
      </div>
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 8,
        letterSpacing: '0.2em',
        color: '#475569',
        marginTop: 4,
      }}>
        {label}
      </div>
    </div>
  );
}

function Diamond() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1e3a5c',
      fontSize: 10,
      margin: '8px 0',
      letterSpacing: '6px',
    }}>
      ◆◆◆
    </div>
  );
}

export default function StatusTab({ player, profile }) {
  if (!player) return null;

  const rankObj = getRankObj(player.rank);
  const xpPct = Math.min(100, (player.xp / player.xpToNext) * 100);

  // HP/MP are cosmetic values based on stats
  const maxHp = player.stats.VIT * 120 + player.stats.END * 60;
  const curHp = Math.floor(maxHp * 0.42); // Simulate not-full HP
  const maxMp = player.stats.END * 80;
  const curMp = Math.floor(maxMp * 0.18);

  const GOAL_LABELS = {
    overall_fitness: 'Overall Fitness',
    lose_weight: 'Lose Weight',
    build_muscle: 'Build Muscle',
    eat_healthier: 'Eat Healthier',
  };
  const ACTIVITY_LABELS = {
    sedentary: 'Sedentary',
    lightly: 'Lightly Active',
    moderately: 'Moderately Active',
    very: 'Very Active',
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '16px' }}>
      {/* Main status box */}
      <OrnateBox
        accentColor={rankObj.color}
        style={{
          background: 'linear-gradient(160deg, rgba(15,23,42,0.95) 0%, rgba(10,16,28,0.98) 100%)',
          border: `1px solid ${rankObj.color}40`,
          marginBottom: 12,
          boxShadow: `0 0 20px ${rankObj.color}15`,
        }}
      >
        {/* Name / Level row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 9,
              letterSpacing: '0.15em',
              color: '#475569',
              marginBottom: 4,
            }}>
              NAME
            </div>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 700,
              fontSize: 16,
              color: '#fff',
              letterSpacing: '0.05em',
            }}>
              {player.name.toUpperCase()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 9,
              letterSpacing: '0.15em',
              color: '#475569',
              marginBottom: 4,
            }}>
              LEVEL
            </div>
            <div style={{
              fontFamily: 'Orbitron, sans-serif',
              fontWeight: 900,
              fontSize: 22,
              color: rankObj.color,
              textShadow: `0 0 12px ${rankObj.color}60`,
            }}>
              {player.level}
            </div>
          </div>
        </div>

        {/* Rank + Job */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: '#475569', marginBottom: 3, letterSpacing:'0.12em' }}>RANK</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: rankObj.bg,
              border: `1px solid ${rankObj.color}50`,
              borderRadius: 4, padding: '4px 10px',
            }}>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: 13, color: rankObj.color }}>
                {player.rank}-RANK
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: '#475569', marginBottom: 3, letterSpacing:'0.12em' }}>FATIGUE</div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 13, color: '#4ade80' }}>0</div>
          </div>
        </div>

        {/* HP bar */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: '#ef4444', letterSpacing: '0.15em' }}>HP</span>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, fontWeight: 700, color: '#ef4444' }}>
              {curHp} / {maxHp}
            </span>
          </div>
          <div style={{ height: 6, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(curHp / maxHp) * 100}%`,
              background: 'linear-gradient(90deg, #dc2626, #ef4444)',
              borderRadius: 3,
              boxShadow: '0 0 6px rgba(239,68,68,0.5)',
            }} />
          </div>
        </div>

        {/* MP bar */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: '#60a5fa', letterSpacing: '0.15em' }}>MP</span>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, fontWeight: 700, color: '#60a5fa' }}>
              {curMp} / {maxMp}
            </span>
          </div>
          <div style={{ height: 5, background: '#1e293b', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(curMp / maxMp) * 100}%`,
              background: 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
              borderRadius: 3,
              boxShadow: '0 0 6px rgba(96,165,250,0.4)',
            }} />
          </div>
        </div>

        <Diamond />

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
          <StatCard label="STRENGTH" value={player.stats.STR} color="#ef4444" />
          <StatCard label="VITALITY" value={player.stats.VIT} color="#4ade80" />
          <StatCard label="AGILITY"  value={player.stats.AGI} color="#f59e0b" />
          <StatCard label="ENDURANCE" value={player.stats.END} color="#a78bfa" />
        </div>

        <Diamond />

        {/* Physical damage reduction */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(30,144,255,0.06)', border: '1px solid rgba(30,144,255,0.15)',
          borderRadius: 4, padding: '8px 12px',
        }}>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, color: '#94a3b8', letterSpacing: '0.1em' }}>
            PHYSICAL DAMAGE REDUCTION
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 12, fontWeight: 700, color: '#60a5fa' }}>
              {Math.floor(player.stats.VIT / 5)}%
            </span>
            <span style={{
              fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: '#4ade80',
              background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)',
              borderRadius: 3, padding: '2px 6px', letterSpacing: '0.1em',
            }}>
              ACTIVE
            </span>
          </div>
        </div>
      </OrnateBox>

      {/* XP Progress */}
      <OrnateBox style={{
        background: 'rgba(15,23,42,0.7)', border: '1px solid #1e293b', marginBottom: 12,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, letterSpacing: '0.18em', color: '#475569' }}>
            EXPERIENCE
          </span>
          <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700, color: '#94a3b8' }}>
            {player.xp} / {player.xpToNext} XP
          </span>
        </div>
        <div style={{ height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${xpPct}%`,
            background: 'linear-gradient(90deg, #1e90ff, #7c3aed)',
            borderRadius: 4,
            boxShadow: '0 0 8px rgba(30,144,255,0.5)',
            transition: 'width 0.6s ease',
          }} />
        </div>
        <div style={{
          fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: '#334155',
          textAlign: 'right', marginTop: 5, letterSpacing: '0.1em',
        }}>
          {player.xpToNext - player.xp} XP TO LEVEL {player.level + 1}
        </div>
      </OrnateBox>

      {/* Stat bars */}
      <OrnateBox style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid #1e293b', marginBottom: 12 }}>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, letterSpacing: '0.2em', color: '#4ade80', marginBottom: 14 }}>
          COMBAT PARAMETERS
        </div>
        <StatBar label="STRENGTH"  value={player.stats.STR} color="#ef4444" />
        <StatBar label="AGILITY"   value={player.stats.AGI} color="#f59e0b" />
        <StatBar label="VITALITY"  value={player.stats.VIT} color="#4ade80" />
        <StatBar label="ENDURANCE" value={player.stats.END} color="#a78bfa" />
      </OrnateBox>

      {/* Rank progression */}
      <OrnateBox style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid #1e293b', marginBottom: 12 }}>
        <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, letterSpacing: '0.2em', color: '#4ade80', marginBottom: 14 }}>
          RANK PROGRESSION
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
          {RANKS.map((r, i) => {
            const isActive = r.name === player.rank;
            const isUnlocked = player.level >= r.minLevel;
            return (
              <div key={r.name} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32,
                  border: `2px solid ${isActive ? r.color : isUnlocked ? r.color + '60' : '#1e293b'}`,
                  borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? r.bg : 'transparent',
                  boxShadow: isActive ? `0 0 10px ${r.color}40` : 'none',
                  transition: 'all 0.3s',
                }}>
                  <span style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontWeight: 700,
                    fontSize: 11,
                    color: isActive ? r.color : isUnlocked ? r.color + '80' : '#334155',
                  }}>
                    {r.name}
                  </span>
                </div>
                {isActive && (
                  <div style={{
                    width: 4, height: 4, borderRadius: '50%',
                    background: r.color,
                    boxShadow: `0 0 4px ${r.color}`,
                  }} />
                )}
                <div style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 6,
                  color: isUnlocked ? '#475569' : '#1e293b',
                  letterSpacing: '0.05em',
                }}>
                  Lv.{r.minLevel}
                </div>
              </div>
            );
          })}
        </div>
        {rankObj.description && (
          <div style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 12,
            color: rankObj.color,
            textAlign: 'center',
            marginTop: 12,
            opacity: 0.7,
            fontStyle: 'italic',
          }}>
            "{rankObj.description}"
          </div>
        )}
      </OrnateBox>

      {/* Origin record */}
      {profile && (
        <OrnateBox style={{ background: 'rgba(15,23,42,0.7)', border: '1px solid #1e293b', marginBottom: 16 }}>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 9, letterSpacing: '0.2em', color: '#475569', marginBottom: 14 }}>
            ORIGIN RECORD
          </div>
          {[
            ['GOAL',       GOAL_LABELS[profile.goal] || profile.goal],
            ['ACTIVITY',   ACTIVITY_LABELS[profile.activityLevel] || profile.activityLevel],
            ['DAILY TIME', profile.timeAvailable],
            ['AGE RANGE',  profile.ageRange],
            ['WEIGHT',     `${profile.weight} kg`],
            ['LIMITS',     profile.limitations || 'None'],
          ].map(([k, v]) => (
            <div key={k} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '7px 0',
              borderBottom: '1px solid #1e293b',
            }}>
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 8, color: '#334155', letterSpacing: '0.12em' }}>
                {k}
              </span>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 600, color: '#64748b' }}>
                {v}
              </span>
            </div>
          ))}
        </OrnateBox>
      )}
    </div>
  );
}
