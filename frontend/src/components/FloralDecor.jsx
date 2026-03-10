export default function BalloonDecor() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 0,
      overflow: 'hidden'
    }}>

      {/* ===== BALÕES CANTO ESQUERDO ===== */}
      <svg
        style={{ position: 'absolute', top: -30, left: -20, width: 200, opacity: 0.18 }}
        viewBox="0 0 180 400"
        fill="none"
      >
        <path d="M60 320 Q55 350 58 390" stroke="#8b5e3c" strokeWidth="1.5" fill="none"/>
        <path d="M90 310 Q92 345 88 390" stroke="#8b5e3c" strokeWidth="1.5" fill="none"/>
        <path d="M115 330 Q120 360 115 390" stroke="#8b5e3c" strokeWidth="1.5" fill="none"/>
        <path d="M40 310 Q35 355 38 390" stroke="#8b5e3c" strokeWidth="1.5" fill="none"/>
        <ellipse cx="60"  cy="250" rx="36" ry="44" fill="#d4b896"/>
        <ellipse cx="92"  cy="210" rx="32" ry="40" fill="#b8895a"/>
        <ellipse cx="118" cy="240" rx="30" ry="37" fill="#c9a87a"/>
        <ellipse cx="38"  cy="225" rx="28" ry="35" fill="#b8895a" opacity="0.8"/>
        <ellipse cx="60"  cy="294" rx="5" ry="3" fill="#8b5e3c" opacity="0.5"/>
        <ellipse cx="92"  cy="250" rx="4" ry="3" fill="#8b5e3c" opacity="0.4"/>
        <ellipse cx="118" cy="277" rx="4" ry="3" fill="#8b5e3c" opacity="0.4"/>
      </svg>

      {/* ===== NUVEM TOPO DIREITO ===== */}
      <svg
        style={{ position: 'absolute', top: 0, right: 30, width: 200, opacity: 0.35 }}
        viewBox="0 0 200 100"
        fill="none"
      >
        <ellipse cx="100" cy="60" rx="70" ry="35" fill="#e8ddd3"/>
        <ellipse cx="70"  cy="50" rx="45" ry="30" fill="#ede4da"/>
        <ellipse cx="130" cy="55" rx="40" ry="25" fill="#e8ddd3"/>
        <ellipse cx="55"  cy="65" rx="30" ry="20" fill="#ede4da"/>
        <ellipse cx="145" cy="65" rx="35" ry="22" fill="#e8ddd3"/>
      </svg>

      {/* ===== NUVEM MEIO DIREITO ===== */}
      <svg
        style={{ position: 'absolute', top: '30%', right: '2%', width: 150, opacity: 0.28 }}
        viewBox="0 0 200 80"
        fill="none"
      >
        <ellipse cx="100" cy="50" rx="60" ry="28" fill="#e8ddd3"/>
        <ellipse cx="70"  cy="40" rx="40" ry="24" fill="#ede4da"/>
        <ellipse cx="130" cy="45" rx="38" ry="22" fill="#e8ddd3"/>
      </svg>

      {/* ===== NUVEM INFERIOR ESQUERDO ===== */}
      <svg
        style={{ position: 'absolute', bottom: '10%', left: '2%', width: 130, opacity: 0.22 }}
        viewBox="0 0 200 80"
        fill="none"
      >
        <ellipse cx="100" cy="50" rx="55" ry="26" fill="#e8ddd3"/>
        <ellipse cx="70"  cy="42" rx="38" ry="22" fill="#ede4da"/>
        <ellipse cx="130" cy="46" rx="36" ry="20" fill="#e8ddd3"/>
      </svg>

      {/* ===== ESTRELINHAS ===== */}
      {[[82, 12], [88, 35], [6, 20], [92, 65], [15, 75]].map(([x, y], i) => (
        <svg
          key={i}
          style={{
            position: 'absolute',
            top: `${y}%`,
            left: `${x}%`,
            width: 16,
            opacity: 0.35
          }}
          viewBox="0 0 20 20"
        >
          <path
            d="M10 2L11.5 8.5H18L12.5 12.5L14 19L10 15L6 19L7.5 12.5L2 8.5H8.5L10 2Z"
            fill="#b8895a"
          />
        </svg>
      ))}

    </div>
  )
}