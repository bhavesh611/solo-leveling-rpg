import { useState, useCallback, useRef } from 'react';
import ApiKeyScreen from './components/ApiKeyScreen';
import Onboarding from './components/Onboarding';
import QuestTab from './components/QuestTab';
import StatusTab from './components/StatusTab';
import AICoachTab from './components/AICoachTab';
import Notification from './components/Notification';
import LevelUpOverlay from './components/LevelUpOverlay';
import { generateQuests } from './utils/claude';
import { processXP, getStartingStats, calcXpToNext, getRankForLevel, getDefaultQuests } from './utils/gameLogic';

// ── Tab bar config ────────────────────────────────────────────────────────────
const TABS = [
  { id: 'quests', icon: '⚔', label: 'QUESTS' },
  { id: 'status', icon: '◈', label: 'STATUS' },
  { id: 'ai',     icon: '⬡', label: 'SYSTEM AI' },
];

export default function App() {
  const [screen,       setScreen]       = useState('apiKey'); // apiKey | onboarding | main
  const [apiKey,       setApiKey]       = useState('');
  const [profile,      setProfile]      = useState(null);
  const [player,       setPlayer]       = useState(null);
  const [quests,       setQuests]       = useState([]);
  const [activeTab,    setActiveTab]    = useState('quests');
  const [notifications,setNotifications]= useState([]);
  const [levelUpData,  setLevelUpData]  = useState(null);
  const [questLoading, setQuestLoading] = useState(false);
  const [chatHistory,  setChatHistory]  = useState([]);
  const questsRef = useRef([]);
  // Keep ref in sync so handleCompleteQuest always reads fresh quests
  const setQuestsAndRef = useCallback((val) => {
    const resolved = typeof val === 'function' ? val(questsRef.current) : val;
    questsRef.current = resolved;
    setQuests(resolved);
  }, []);

  // ── Notification helper ─────────────────────────────────────────────────────
  const showNotification = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3800);
  }, []);

  // ── XP award helper ─────────────────────────────────────────────────────────
  const awardXP = useCallback((xpGained, player, setPlayerFn) => {
    const result = processXP(player, xpGained);
    setPlayerFn(result);
    if (result._leveledUp) {
      setTimeout(() => {
        setLevelUpData({
          level: result.level,
          rank: result.rank,
          oldRank: result._oldRank,
          rankChanged: result._rankChanged,
        });
      }, 400);
    }
    return result;
  }, []);

  // ── API key submit ──────────────────────────────────────────────────────────
  const handleApiKeySubmit = (key) => {
    setApiKey(key);
    setScreen('onboarding');
  };

  // ── Onboarding complete ─────────────────────────────────────────────────────
  const handleOnboardingComplete = async (profileData) => {
    const startStats = getStartingStats(profileData.activityLevel);
    const initialPlayer = {
      name:    profileData.name,
      level:   1,
      rank:    'E',
      xp:      0,
      xpToNext: 100,
      stats:   startStats,
    };
    setProfile(profileData);
    setPlayer(initialPlayer);
    setScreen('main');

    // Generate first quest set
    setQuestLoading(true);
    showNotification('SYSTEM AWAKENING COMPLETE. GENERATING DAILY QUESTS...', 'system');
    try {
      const quests = await generateQuests(apiKey, initialPlayer, profileData);
      setQuestsAndRef(quests);
      showNotification('DAILY QUESTS ASSIGNED. YOUR TRAINING BEGINS NOW.', 'system');
    } catch (err) {
      showNotification('QUEST GENERATION FAILED. DEFAULT QUESTS ASSIGNED.', 'error');
        setQuestsAndRef(getDefaultQuests());
    } finally {
      setQuestLoading(false);
    }
  };

  // ── Complete quest ──────────────────────────────────────────────────────────
  const handleCompleteQuest = useCallback((questId) => {
    // Use ref to get latest quests without stale closure
    const quest = questsRef.current.find(q => q.id === questId);
    if (!quest || quest.completed) return;

    setQuestsAndRef(prev => prev.map(q => q.id === questId ? { ...q, completed: true } : q));
    showNotification(`+${quest.xp} XP  —  ${quest.title}`, 'xp');

    setPlayer(prev => {
      const result = processXP(prev, quest.xp);
      if (result._leveledUp) {
        setTimeout(() => setLevelUpData({
          level: result.level,
          rank: result.rank,
          oldRank: result._oldRank,
          rankChanged: result._rankChanged,
        }), 400);
      }
      return result;
    });
  }, [showNotification]);

  // ── Refresh quests ──────────────────────────────────────────────────────────
  const handleRefreshQuests = async () => {
    if (questLoading) return;
    setQuestLoading(true);
    showNotification('REQUESTING NEW QUEST ASSIGNMENT...', 'system');
    try {
      const newQuests = await generateQuests(apiKey, player, profile);
      setQuestsAndRef(newQuests);
      showNotification('NEW QUEST SET ASSIGNED BY THE SYSTEM.', 'system');
    } catch (err) {
      showNotification('QUEST REFRESH FAILED: ' + (err.message?.slice(0, 50) || 'ERROR'), 'error');
    } finally {
      setQuestLoading(false);
    }
  };

  // ── XP from AI chat ─────────────────────────────────────────────────────────
  const handleXPFromChat = useCallback((xp) => {
    setPlayer(prev => {
      const result = processXP(prev, xp);
      if (result._leveledUp) {
        setTimeout(() => setLevelUpData({
          level: result.level,
          rank: result.rank,
          oldRank: result._oldRank,
          rankChanged: result._rankChanged,
        }), 300);
      }
      return result;
    });
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────────
  if (screen === 'apiKey')    return <ApiKeyScreen onSubmit={handleApiKeySubmit} />;
  if (screen === 'onboarding') return <Onboarding onComplete={handleOnboardingComplete} />;

  return (
    <div style={{
      width: '100%', height: '100dvh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center',
      background: '#020812',
    }}>
      {/* Scanline effect */}
      <div className="scanline-overlay" />
      <div className="scan-beam" />

      {/* Mobile container */}
      <div style={{
        width: '100%',
        maxWidth: 480,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'linear-gradient(180deg, #050d1a 0%, #020812 100%)',
      }}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid #1e293b',
          background: 'rgba(5,13,26,0.95)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
          zIndex: 10,
        }}>
          {/* Rank badge */}
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: player?.rank === 'E' ? '#a0a0b0' :
                   player?.rank === 'D' ? '#4ade80' :
                   player?.rank === 'C' ? '#60a5fa' :
                   player?.rank === 'B' ? '#a78bfa' :
                   player?.rank === 'A' ? '#f59e0b' : '#f97316',
            padding: '3px 8px',
            border: '1px solid currentColor',
            borderRadius: 3,
            opacity: 0.85,
          }}>
            {player?.rank}-RANK
          </div>

          {/* Title */}
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 900,
            fontSize: 12,
            letterSpacing: '0.25em',
            color: '#1e90ff',
            textShadow: '0 0 10px rgba(30,144,255,0.4)',
          }}>
            SYSTEM
          </div>

          {/* Level */}
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 9,
            letterSpacing: '0.12em',
            color: '#475569',
          }}>
            LV.<span style={{ color: '#e2e8f0', fontWeight: 700 }}>{player?.level}</span>
            {' '}
            <span style={{ color: '#334155' }}>
              {player?.xp}/{player?.xpToNext}XP
            </span>
          </div>
        </div>

        {/* ── Tab content ────────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {activeTab === 'quests' && (
            <QuestTab
              quests={quests}
              loading={questLoading}
              onComplete={handleCompleteQuest}
              onRefresh={handleRefreshQuests}
              player={player}
            />
          )}
          {activeTab === 'status' && (
            <StatusTab player={player} profile={profile} />
          )}
          {activeTab === 'ai' && (
            <AICoachTab
              apiKey={apiKey}
              player={player}
              profile={profile}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              onXPAward={handleXPFromChat}
              showNotification={showNotification}
            />
          )}
        </div>

        {/* ── Bottom tab bar ──────────────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          borderTop: '1px solid #1e293b',
          background: 'rgba(5,13,26,0.98)',
          backdropFilter: 'blur(8px)',
          flexShrink: 0,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}>
          {TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: '12px 4px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  background: 'none',
                  border: 'none',
                  borderTop: `2px solid ${active ? '#1e90ff' : 'transparent'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
              >
                {active && (
                  <div style={{
                    position: 'absolute',
                    top: 0, left: '20%', right: '20%',
                    height: 2,
                    background: 'linear-gradient(90deg, transparent, #1e90ff, transparent)',
                    filter: 'blur(2px)',
                  }} />
                )}
                <span style={{
                  fontSize: 16,
                  opacity: active ? 1 : 0.4,
                  filter: active ? 'none' : 'grayscale(1)',
                  transition: 'all 0.15s',
                }}>
                  {tab.icon}
                </span>
                <span style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 7,
                  letterSpacing: '0.12em',
                  color: active ? '#1e90ff' : '#334155',
                  fontWeight: active ? 700 : 400,
                  transition: 'color 0.15s',
                }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Notification stack ────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9000,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: 'center',
        pointerEvents: 'none',
        width: '90%',
        maxWidth: 380,
      }}>
        {notifications.map(n => (
          <Notification key={n.id} notification={n} />
        ))}
      </div>

      {/* ── Level-up overlay ─────────────────────────────────────────────── */}
      {levelUpData && (
        <LevelUpOverlay
          data={levelUpData}
          onDismiss={() => setLevelUpData(null)}
        />
      )}
    </div>
  );
}
