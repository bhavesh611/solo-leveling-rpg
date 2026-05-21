import { useState } from 'react';
import OrnateBox from './OrnateBox';

const STEPS = [
  {
    id: 'name',
    system: 'HUNTER IDENTITY DETECTED. STATE YOUR NAME.',
    field: 'text',
    label: 'HUNTER NAME',
    placeholder: 'Enter your name...',
    key: 'name',
  },
  {
    id: 'goal',
    system: 'WHAT IS YOUR PRIMARY OBJECTIVE, HUNTER?',
    label: 'PRIMARY GOAL',
    key: 'goal',
    options: [
      { value: 'overall_fitness', label: 'OVERALL FITNESS', sub: 'Improve general health & energy' },
      { value: 'lose_weight',     label: 'LOSE WEIGHT',     sub: 'Reduce body fat and get leaner' },
      { value: 'build_muscle',    label: 'BUILD MUSCLE',    sub: 'Increase strength and muscle mass' },
      { value: 'eat_healthier',   label: 'EAT HEALTHIER',   sub: 'Improve nutrition and diet habits' },
    ],
  },
  {
    id: 'activity',
    system: 'THE SYSTEM REQUIRES YOUR CURRENT COMBAT READINESS.',
    label: 'ACTIVITY LEVEL',
    key: 'activityLevel',
    options: [
      { value: 'sedentary',    label: 'SEDENTARY',    sub: 'Desk job, little movement' },
      { value: 'lightly',      label: 'LIGHTLY ACTIVE', sub: 'Light activity 1–2x/week' },
      { value: 'moderately',   label: 'MODERATELY ACTIVE', sub: 'Exercise 3–5x/week' },
      { value: 'very',         label: 'VERY ACTIVE',  sub: 'Daily intense training' },
    ],
  },
  {
    id: 'time',
    system: 'HOW MUCH TIME CAN YOU DEDICATE EACH DAY?',
    label: 'DAILY TIME',
    key: 'timeAvailable',
    options: [
      { value: '15-30 min',  label: '15–30 MIN',  sub: 'Short but consistent' },
      { value: '30-45 min',  label: '30–45 MIN',  sub: 'Moderate commitment' },
      { value: '45-60 min',  label: '45–60 MIN',  sub: 'Solid dedication' },
      { value: '60+ min',    label: '60+ MIN',    sub: 'Full hunter training' },
    ],
  },
  {
    id: 'age',
    system: 'BIOLOGICAL DATA REQUIRED FOR CALIBRATION.',
    label: 'AGE RANGE',
    key: 'ageRange',
    options: [
      { value: 'Under 18', label: 'UNDER 18' },
      { value: '18-25',    label: '18–25' },
      { value: '26-35',    label: '26–35' },
      { value: '36-50',    label: '36–50' },
      { value: '50+',      label: '50+' },
    ],
  },
  {
    id: 'weight',
    system: 'PHYSICAL PARAMETERS DETECTED. INPUT BODY WEIGHT.',
    field: 'number',
    label: 'WEIGHT (KG)',
    placeholder: 'e.g. 75',
    key: 'weight',
  },
  {
    id: 'limitations',
    system: 'ANY PHYSICAL CONSTRAINTS THE SYSTEM MUST ACCOUNT FOR?',
    label: 'PHYSICAL LIMITATIONS',
    key: 'limitations',
    options: [
      { value: 'none',          label: 'NONE',          sub: 'No limitations' },
      { value: 'joint/back',    label: 'JOINT / BACK',  sub: 'Low-impact exercises only' },
      { value: 'vegetarian',    label: 'VEGETARIAN',    sub: 'Plant-based diet' },
      { value: 'vegan',         label: 'VEGAN',         sub: 'Fully plant-based' },
    ],
  },
];

const DEFAULTS = {
  name: '',
  goal: 'overall_fitness',
  activityLevel: 'sedentary',
  timeAvailable: '15-30 min',
  ageRange: '26-35',
  weight: '75',
  limitations: 'none',
};

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(DEFAULTS);
  const [textInput, setTextInput] = useState('');
  const current = STEPS[step];

  const getValue = () => {
    if (current.field) return textInput || data[current.key] || '';
    return data[current.key];
  };

  const canProceed = () => {
    if (current.field === 'text') return (textInput || data[current.key] || '').trim().length > 0;
    if (current.field === 'number') return parseFloat(textInput || data[current.key]) > 0;
    return !!data[current.key];
  };

  const handleNext = () => {
    let val = data[current.key];
    if (current.field) val = textInput.trim() || data[current.key];
    const updated = { ...data, [current.key]: val };
    setData(updated);
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
      setTextInput('');
    } else {
      onComplete({
        name: updated.name || 'Hunter',
        goal: updated.goal,
        activityLevel: updated.activityLevel,
        timeAvailable: updated.timeAvailable,
        ageRange: updated.ageRange,
        weight: updated.weight,
        limitations: updated.limitations,
      });
    }
  };

  const handleSelect = (value) => {
    setData(d => ({ ...d, [current.key]: value }));
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div style={{
      width: '100%', height: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0a1628 0%, #020812 70%)',
      padding: 20,
      animation: 'fadeIn 0.4s ease both',
    }}>
      <div className="scanline-overlay" />
      <div className="scan-beam" />

      <div style={{ width: '100%', maxWidth: 440 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 9,
            letterSpacing: '0.35em',
            color: '#1e90ff',
            marginBottom: 6,
          }}>
            SYSTEM AWAKENING PROTOCOL
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontWeight: 700,
            fontSize: 18,
            color: '#fff',
            letterSpacing: '0.05em',
          }}>
            HUNTER ASSESSMENT
          </div>
          {/* Progress bar */}
          <div style={{ marginTop: 14, height: 2, background: '#1e293b', borderRadius: 1 }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #1e90ff, #7c3aed)',
              borderRadius: 1,
              transition: 'width 0.4s ease',
              boxShadow: '0 0 6px rgba(30,144,255,0.5)',
            }} />
          </div>
          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 8,
            color: '#475569',
            marginTop: 6,
            letterSpacing: '0.1em',
          }}>
            {step + 1} / {STEPS.length}
          </div>
        </div>

        <OrnateBox
          key={step}
          style={{
            background: 'rgba(15,23,42,0.92)',
            border: '1px solid #1e293b',
            animation: 'fadeIn 0.3s ease both',
          }}
        >
          {/* System message */}
          <div style={{
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: '#1e90ff',
            letterSpacing: '0.08em',
            marginBottom: 20,
            paddingBottom: 14,
            borderBottom: '1px solid #1e293b',
            lineHeight: 1.4,
          }}>
            <span style={{ opacity: 0.5, marginRight: 6 }}>❯</span>
            {current.system}
          </div>

          <div style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 9,
            letterSpacing: '0.18em',
            color: '#475569',
            marginBottom: 12,
          }}>
            {current.label}
          </div>

          {/* Input field */}
          {current.field && (
            <input
              type={current.field === 'number' ? 'number' : 'text'}
              value={textInput}
              onChange={e => setTextInput(e.target.value)}
              placeholder={current.placeholder}
              autoFocus
              min={current.field === 'number' ? 1 : undefined}
              onKeyDown={e => e.key === 'Enter' && canProceed() && handleNext()}
              style={{
                width: '100%',
                background: 'rgba(30,144,255,0.06)',
                border: '1px solid #1e3a5c',
                borderRadius: 4,
                padding: '12px 14px',
                color: '#e2e8f0',
                fontSize: 16,
                fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.05em',
                marginBottom: 6,
              }}
              onFocus={e => e.target.style.borderColor = '#1e90ff'}
              onBlur={e => e.target.style.borderColor = '#1e3a5c'}
            />
          )}

          {/* Option grid */}
          {current.options && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: current.options.length <= 3 ? '1fr' : '1fr 1fr',
              gap: 8,
              marginBottom: 4,
            }}>
              {current.options.map(opt => {
                const selected = data[current.key] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    style={{
                      padding: '12px 14px',
                      background: selected
                        ? 'rgba(30,144,255,0.15)'
                        : 'rgba(15,23,42,0.5)',
                      border: `1px solid ${selected ? '#1e90ff' : '#1e293b'}`,
                      borderRadius: 4,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      boxShadow: selected ? '0 0 8px rgba(30,144,255,0.2)' : 'none',
                    }}
                  >
                    <div style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: 9,
                      fontWeight: 700,
                      color: selected ? '#1e90ff' : '#94a3b8',
                      letterSpacing: '0.1em',
                      marginBottom: opt.sub ? 3 : 0,
                    }}>
                      {selected && '✓ '}{opt.label}
                    </div>
                    {opt.sub && (
                      <div style={{
                        fontFamily: 'Rajdhani, sans-serif',
                        fontSize: 11,
                        color: selected ? '#94a3b8' : '#475569',
                      }}>
                        {opt.sub}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            style={{
              width: '100%',
              marginTop: 16,
              padding: '13px',
              background: canProceed()
                ? 'linear-gradient(135deg, rgba(30,144,255,0.25), rgba(30,144,255,0.12))'
                : 'rgba(30,144,255,0.05)',
              border: `1px solid ${canProceed() ? '#1e90ff' : '#1e293b'}`,
              borderRadius: 4,
              color: canProceed() ? '#fff' : '#334155',
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.2em',
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: canProceed() ? '0 0 10px rgba(30,144,255,0.15)' : 'none',
            }}
          >
            {step === STEPS.length - 1 ? '⚔ BEGIN AWAKENING' : 'CONFIRM ›'}
          </button>
        </OrnateBox>
      </div>
    </div>
  );
}
