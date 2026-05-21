// Reusable ornamental container matching Solo Leveling's UI aesthetic
export default function OrnateBox({ children, style, accentColor = '#00bfff', padding = '20px' }) {
  const s = accentColor;
  return (
    <div style={{ position: 'relative', padding, ...style }}>
      {/* Top-left */}
      <svg style={{ position:'absolute', top:0, left:0, width:28, height:28 }} viewBox="0 0 28 28" fill="none">
        <path d="M2 14 L2 2 L14 2" stroke={s} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M6 10 L6 6 L10 6" stroke={s} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <circle cx="2" cy="2" r="1.2" fill={s}/>
      </svg>
      {/* Top-right */}
      <svg style={{ position:'absolute', top:0, right:0, width:28, height:28 }} viewBox="0 0 28 28" fill="none">
        <path d="M26 14 L26 2 L14 2" stroke={s} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M22 10 L22 6 L18 6" stroke={s} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <circle cx="26" cy="2" r="1.2" fill={s}/>
      </svg>
      {/* Bottom-left */}
      <svg style={{ position:'absolute', bottom:0, left:0, width:28, height:28 }} viewBox="0 0 28 28" fill="none">
        <path d="M2 14 L2 26 L14 26" stroke={s} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M6 18 L6 22 L10 22" stroke={s} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <circle cx="2" cy="26" r="1.2" fill={s}/>
      </svg>
      {/* Bottom-right */}
      <svg style={{ position:'absolute', bottom:0, right:0, width:28, height:28 }} viewBox="0 0 28 28" fill="none">
        <path d="M26 14 L26 26 L14 26" stroke={s} strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M22 18 L22 22 L18 22" stroke={s} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        <circle cx="26" cy="26" r="1.2" fill={s}/>
      </svg>

      {children}
    </div>
  );
}
