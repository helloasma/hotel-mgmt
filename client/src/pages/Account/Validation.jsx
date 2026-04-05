import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Validation.css";

const colors = {
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
    { x: "12%", y: "18%", size: 5, duration: 8,  delay: 0   },
    { x: "78%", y: "30%", size: 4, duration: 10, delay: 2   },
    { x: "7%",  y: "55%", size: 6, duration: 12, delay: 1,  color: colors.sageLight },
    { x: "60%", y: "22%", size: 4, duration: 9,  delay: 3.5 },
    { x: "88%", y: "45%", size: 5, duration: 7,  delay: 1.5, color: colors.sageLight },
    { x: "30%", y: "65%", size: 3, duration: 11, delay: 4   },
    { x: "45%", y: "12%", size: 4, duration: 8,  delay: 2.5 },
  ];

  const tiles = [
    { label: "Status",     value: "Island Guest"   },
    { label: "Location",   value: "Heart Island"   },
    { label: "Season",     value: "Lavender Bloom" },
    { label: "Experience", value: "Curated Stay"   },
  ];

  return (
    <div className="val-scene">

      {/* Logo */}
      <div className="val-logo-top">
        <HeartIcon size={24} />
        <span className="val-logo-text">LOVENDER</span>
      </div>

      {/* Floating pollen */}
      {pollens.map((p, i) => <Pollen key={i} {...p} />)}

      {/* Heart Island */}
      <div className="val-island-wrap">
        <svg width="340" height="220" viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="170" cy="195" rx="130" ry="22" fill="rgba(18,40,75,0.14)" />
          <path d="M170 185C170 185 55 140 55 88c0-30 22-52 52-52 15 0 27 7 34 17 7-10 19-17 34-17 30 0 52 22 52 52 0 52-57 97-57 97z" fill="#7ea99a" />
          <path d="M170 168C170 168 82 130 82 90c0-20 14-34 33-34 11 0 20 5 26 14 6-9 15-14 26-14 19 0 33 14 33 34 0 40-26 78-26 78z" fill="#a8a0c4" opacity="0.55" />
          <path d="M170 168C170 168 90 135 90 95c0-18 12-30 29-30 10 0 18 4 22 11 4-7 12-11 22-11 17 0 29 12 29 30 0 40-24 73-24 73z" fill="#6b9a8b" opacity="0.6" />
          {/* Lavender sprigs on island */}
          {[138, 155, 170, 185, 202].map((x, i) => (
            <g key={i}>
              <line x1={x} y1={118 - i * 2} x2={x} y2={100 - i * 2} stroke="#7070a0" strokeWidth="1.5" />
              <ellipse cx={x} cy={94 - i * 2} rx="7" ry="12" fill={i % 2 === 0 ? "#b8b0d0" : "#c2bada"} />
            </g>
          ))}
          <ellipse cx="112" cy="124" rx="12" ry="9" fill="#406D61" opacity="0.75" />
          <ellipse cx="228" cy="122" rx="12" ry="9" fill="#406D61" opacity="0.75" />
          <ellipse cx="170" cy="140" rx="10" ry="8" fill="#406D61" opacity="0.65" />
          <rect x="158" y="108" width="24" height="16" fill={colors.cream} rx="2" opacity="0.9" />
          <rect x="162" y="112" width="6" height="12" fill={colors.lavLight} rx="1" />
          <rect x="172" y="112" width="6" height="12" fill={colors.lavLight} rx="1" />
          <path d="M155 108L170 100L185 108Z" fill={colors.navy} opacity="0.7" />
          <rect x="163" y="175" width="14" height="16" fill="rgba(18,40,75,0.25)" rx="2" />
        </svg>
      </div>

      {/* Lavender field */}
      <svg className="val-field-svg" viewBox="0 0 1440 500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <path d="M0 200 Q360 160 720 185 Q1080 210 1440 175 L1440 500 L0 500Z" fill="#6b9a8b" opacity="0.85" />
        <path d="M0 220 Q360 185 720 205 Q1080 225 1440 198 L1440 500 L0 500Z" fill="#5d8c7c" />
        {/* Far row */}
        {Array.from({ length: 29 }, (_, i) => i * 50 + 30).map((x) => (
          <g key={x} opacity="0.6">
            <line x1={x} y1="310" x2={x} y2="285" stroke="#8080a8" strokeWidth="1.1" />
            <ellipse cx={x} cy="278" rx="5" ry="10" fill={x % 100 === 30 ? "#b8b0d0" : "#b0a8c8"} />
          </g>
        ))}
        {/* Foreground row */}
        {Array.from({ length: 27 }, (_, i) => i * 55).map((x) => (
          <g key={x}>
            <line x1={x} y1="500" x2={x} y2="410" stroke="#68648c" strokeWidth="2" />
            <ellipse cx={x} cy="398" rx="10" ry="20" fill={x % 110 === 0 ? "#b4aed0" : x % 55 === 0 ? "#aaa4c8" : "#a09ac0"} />
          </g>
        ))}
      </svg>

      {/* Welcome Card */}
      <div className="val-card">

        <CheckCircle drawn={drawn} />

        {/* Animated mini sprigs */}
        <div className="val-sprigs-row" style={{ opacity: sprigsVisible ? 1 : 0 }}>
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

        <div className="val-badge">
          <HeartIcon size={13} fill={colors.lav} opacity={1} />
          <span className="val-badge-text">Access Granted</span>
        </div>

        <h1 className="val-h1">
          Welcome to<br />
          <em style={{ fontStyle: "italic", color: colors.muted }}>the Island</em>
        </h1>
        <p className="val-sub">
          You're now part of the Lovender family. The lavender is in bloom and the ocean is calm — your escape is ready.
        </p>

        {/* Lavender divider */}
        <div className="val-lav-divider">
          <div className="val-divider-line" />
          <MiniSprig width={18} height={30} />
          <div className="val-divider-line" />
        </div>

        {/* Info tiles */}
        <div className="val-tiles">
          {tiles.map((t) => (
            <div key={t.label} className="val-tile">
              <p className="val-tile-label">{t.label}</p>
              <p className="val-tile-val">{t.value}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="val-btn-row">
          <button className="val-btn-primary" onClick={() => navigate("/rooms")}>
            Explore the Island
          </button>
          <button
            className="val-btn-outline"
            onClick={() => navigate("/login")}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}