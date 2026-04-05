import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  lova: "#0e081f",
  white: "white",
  black: "black",
  green: "#406D61",

  navy:      "#12284B",
  lav:       "#BFB6CE",
  lavLight:  "#D4CEDF",
  lavPale:   "#EDE8F4",
  lavSofter: "#F3F0F8",
  sage:      "#406D61",
  sageDark:  "#34574d",
  sageLight: "#6B9B8E",
  cream:     "#FAF7F2",
  text:      "#2c2840",
  muted:     "#7a7090",
};

function HeartIcon({ size = 24, fill = colors.navy, opacity = 0.85 }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: size, fill, opacity }}>
      <path d="M16 27C16 27 4 19 4 11c0-4.2 3.6-7.5 8-7.5 1.8 0 3.4.7 4 1.6.6-.9 2.2-1.6 4-1.6C24.4 3.5 28 6.8 28 11c0 8-12 16-12 16z" />
    </svg>
  );
}

/* Small sprig for card decoration */
function MiniSprig({ width = 28, height = 52 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 28 52" xmlns="http://www.w3.org/2000/svg">
      <line x1="14" y1="52" x2="14" y2="14" stroke="#9b92b8" strokeWidth="1.3" />
      <ellipse cx="14" cy="9" rx="6" ry="12" fill={colors.lav} />
      <ellipse cx="6"  cy="25" rx="7" ry="3" fill={colors.sage} opacity="0.6" transform="rotate(-25 6 25)" />
      <ellipse cx="22" cy="25" rx="7" ry="3" fill={colors.sage} opacity="0.6" transform="rotate(25 22 25)" />
    </svg>
  );
}

/* Animated SVG check circle */
function CheckCircle({ drawn }) {
  return (
    <svg viewBox="0 0 70 70" xmlns="http://www.w3.org/2000/svg" style={{ width: 70, display: "block", margin: "0 auto 20px" }}>
      <circle
        cx="35" cy="35" r="32"
        fill="none" stroke={colors.sage} strokeWidth="1.5"
        transform="rotate(-90 35 35)"
        strokeDasharray="220"
        strokeDashoffset={drawn ? 0 : 220}
        style={{ transition: "stroke-dashoffset 0.9s ease" }}
      />
      <polyline
        points="20,35 30,46 50,24"
        fill="none" stroke={colors.sage} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="40"
        strokeDashoffset={drawn ? 0 : 40}
        style={{ transition: "stroke-dashoffset 0.4s ease 0.9s" }}
      />
    </svg>
  );
}

/* Floating pollen dot */
function Pollen({ x, y, size, duration, delay, color = colors.lav }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y,
      width: size, height: size, borderRadius: "50%",
      background: color, opacity: 0.6,
      animation: `floatPollen ${duration}s ease-in-out ${delay}s infinite`,
      pointerEvents: "none",
    }} />
  );
}

/* ══════════════════════════════
   VALIDATION PAGE
══════════════════════════════ */
export default function Validation() {
  const navigate = useNavigate();

  const [drawn, setDrawn] = useState(false);
  const [sprigsVisible, setSprigsVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setDrawn(true), 600);
    const t2 = setTimeout(() => setSprigsVisible(true), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const pollens = [
    { x:"12%", y:"18%", size:5, duration:8,  delay:0   },
    { x:"78%", y:"30%", size:4, duration:10, delay:2   },
    { x:"7%",  y:"55%", size:6, duration:12, delay:1,  color:colors.sageLight },
    { x:"60%", y:"22%", size:4, duration:9,  delay:3.5 },
    { x:"88%", y:"45%", size:5, duration:7,  delay:1.5, color:colors.sageLight },
    { x:"30%", y:"65%", size:3, duration:11, delay:4   },
    { x:"45%", y:"12%", size:4, duration:8,  delay:2.5 },
  ];

  const tiles = [
    { label: "Status",     value: "Island Guest"    },
    { label: "Location",   value: "Heart Island"    },
    { label: "Season",     value: "Lavender Bloom"  },
    { label: "Experience", value: "Curated Stay"    },
  ];

  const S = {
    scene: {
      width: "100vw", minHeight: "100vh", position: "relative", overflow: "hidden",
      background: "#0e081f",
      fontFamily: "'DM Sans', sans-serif",
    },
    logoTop: {
      position: "fixed", top: 32, left: "50%", transform: "translateX(-50%)",
      zIndex: 30, display: "flex", alignItems: "center", gap: 9,
      animation: "fadeDown .7s ease both",
    },
    logoText: {
      fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 400,
      letterSpacing: "0.14em", color: colors.navy,
    },
    islandWrap: {
      position: "absolute", bottom: "38%", left: "50%",
      transform: "translateX(-50%)",
      animation: "islandRise 1.6s cubic-bezier(.22,1,.36,1) both",
      zIndex: 5,
    },
    fieldSvg: {
      position: "absolute", bottom: 0, left: 0, width: "100%", height: "55%",
      pointerEvents: "none",
    },
    card: {
      position: "absolute", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 20, width: "90%", maxWidth: 480,
      background: "rgba(250,247,242,0.9)",
      backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      border: `1px solid rgba(191,182,206,0.45)`,
      borderRadius: 16, padding: "44px 48px 40px",
      textAlign: "center",
      boxShadow: "0 32px 64px rgba(18,40,75,0.12), 0 6px 16px rgba(18,40,75,0.06)",
      animation: "cardIn 1.1s cubic-bezier(.22,1,.36,1) .5s both",
    },
    sprigsRow: {
      display: "flex", justifyContent: "center", gap: 12,
      marginBottom: 18, opacity: sprigsVisible ? 1 : 0,
      transition: "opacity 0.8s ease",
    },
    badge: {
      display: "inline-flex", alignItems: "center", gap: 7,
      background: colors.lavSofter, border: `1px solid ${colors.lavLight}`,
      borderRadius: 20, padding: "4px 14px 4px 8px", marginBottom: 14,
    },
    badgeText: { fontSize: 9, fontWeight: 500, letterSpacing: "0.2em", textTransform: "uppercase", color: colors.muted },
    h1: {
      fontFamily: "'Playfair Display', serif", fontWeight: 400,
      fontSize: 38, lineHeight: 1.15, color: colors.navy, marginBottom: 10,
    },
    sub: {
      fontSize: 13, fontWeight: 300, color: colors.muted, lineHeight: 1.75,
      marginBottom: 26, maxWidth: 330, marginLeft: "auto", marginRight: "auto",
    },
    lavDivider: { display: "flex", alignItems: "center", gap: 10, margin: "0 auto 24px", maxWidth: 260 },
    tiles: {
      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1,
      background: "rgba(191,182,206,0.3)", borderRadius: 10, overflow: "hidden",
      margin: "0 0 24px", border: "1px solid rgba(191,182,206,0.3)",
    },
    tile: { background: "rgba(250,247,242,0.9)", padding: "14px 16px", textAlign: "left" },
    tileLabel: { fontSize: 8.5, fontWeight: 500, letterSpacing: "0.25em", textTransform: "uppercase", color: colors.muted, marginBottom: 4 },
    tileVal: { fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 400, color: colors.navy },
    btnRow: { display: "flex", gap: 10 },
    btnP: {
      flex: 1, padding: 13, borderRadius: 9, background: colors.sage, color: "#fff",
      border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
      fontSize: 12.5, fontWeight: 500, letterSpacing: "0.06em",
      boxShadow: "0 4px 14px rgba(64,109,97,0.28)", transition: "background .3s,transform .2s",
    },
    btnO: {
      flex: 1, padding: 13, borderRadius: 9, background: "transparent", color: colors.navy,
      border: `1.5px solid rgba(191,182,206,0.7)`, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", fontSize: 12.5, fontWeight: 400, letterSpacing: "0.06em",
      transition: "border-color .3s,color .3s,transform .2s",
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes floatPollen {
          0%,100% { transform:translateY(0) rotate(0deg); opacity:.6; }
          50%      { transform:translateY(-28px) rotate(180deg); opacity:.95; }
        }
        @keyframes islandRise {
          from { opacity:0; transform:translateX(-50%) translateY(30px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translate(-50%,-44%) scale(.97); }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1); }
        }
        @keyframes fadeDown {
          from { opacity:0; transform:translateX(-50%) translateY(-14px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
      `}
      
      
      </style>

      <div style={S.scene}>

        {/* Floating pollen */}
        {pollens.map((p, i) => <Pollen key={i} {...p} />)}


        {/* Lavender field */}
        <svg style={S.fieldSvg} viewBox="0 0 1440 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 200 Q360 160 720 185 Q1080 210 1440 175 L1440 500 L0 500Z" fill={colors.muted} opacity="0.85" />
          <path d="M0 220 Q360 185 720 205 Q1080 225 1440 198 L1440 500 L0 500Z" fill={colors.muted} />
          {/* Far row */}
          {Array.from({ length: 29 }, (_, i) => i * 50 + 30).map((x) => (
            <g key={x} opacity="0.6">
              <line x1={x} y1="310" x2={x} y2="285" stroke={colors.lova} strokeWidth="1.1" />
              <ellipse cx={x} cy="278" rx="5" ry="10" fill={x % 100 === 30 ? "#0e081f" : "#0e081f"} />
            </g>
          ))}
          {/* Foreground row */}
          {Array.from({ length: 27 }, (_, i) => i * 55).map((x) => (
            <g key={x}>
              <line x1={x} y1="500" x2={x} y2="410" stroke={colors.lova} strokeWidth="2" />
              <ellipse cx={x} cy="398" rx="10" ry="20" fill={x % 110 === 0 ? "#0e081f" : x % 55 === 0 ? "#0e081f" : "#0e081f"} />
            </g>
          ))}
        </svg>

        {/* Welcome Card */}
        <div style={S.card}>

          <CheckCircle drawn={drawn} />

          {/* Animated mini sprigs */}
          <div style={S.sprigsRow}>
            <MiniSprig width={28} height={52} />
            <svg width="36" height="62" viewBox="0 0 36 62" xmlns="http://www.w3.org/2000/svg">
              <line x1="18" y1="62" x2="18" y2="16" stroke="#9b92b8" strokeWidth="1.5" />
              <ellipse cx="18" cy="10" rx="8" ry="16" fill={colors.lav} />
              <ellipse cx="8"  cy="30" rx="8" ry="3.5" fill={colors.sage} opacity="0.6" transform="rotate(-25 8 30)" />
              <ellipse cx="28" cy="30" rx="8" ry="3.5" fill={colors.sage} opacity="0.6" transform="rotate(25 28 30)" />
              <ellipse cx="8"  cy="46" rx="8" ry="3.5" fill={colors.sage} opacity="0.5" transform="rotate(-25 8 46)" />
              <ellipse cx="28" cy="46" rx="8" ry="3.5" fill={colors.sage} opacity="0.5" transform="rotate(25 28 46)" />
            </svg>
            <MiniSprig width={28} height={52} />
          </div>

          <div style={S.badge}>
            <HeartIcon size={13} fill={colors.lav} opacity={1} />
            <span style={S.badgeText}>Access Granted</span>
          </div>

          <h1 style={S.h1}>
            Welcome to<br />
            <em style={{ fontStyle: "italic", color: colors.muted }}>the Island</em>
          </h1>
          <p style={S.sub}>
            You're now part of the Lovender family. The lavender is in bloom and the ocean is calm — your escape is ready.
          </p>

          {/* Lavender divider */}
          <div style={S.lavDivider}>
            <div style={{ flex: 1, height: 1, background: "rgba(191,182,206,0.6)" }} />
            <MiniSprig width={18} height={30} />
            <div style={{ flex: 1, height: 1, background: "rgba(191,182,206,0.6)" }} />
          </div>

          {/* Info tiles */}
          <div style={S.tiles}>
            {tiles.map((t) => (
              <div key={t.label} style={S.tile}>
                <p style={S.tileLabel}>{t.label}</p>
                <p style={S.tileVal}>{t.value}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={S.btnRow}>
            <button
              style={S.btnP}
              onClick={() => navigate("/rooms")}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.sageDark;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.sage;
                e.currentTarget.style.transform = "none";
              }}
            >
              Explore the Island
            </button>

            <button
              style={S.btnO}
              onClick={() => navigate("/login")}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = colors.sage; e.currentTarget.style.color = colors.sage; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(191,182,206,0.7)"; e.currentTarget.style.color = colors.navy; e.currentTarget.style.transform = "none"; }}
            >
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
