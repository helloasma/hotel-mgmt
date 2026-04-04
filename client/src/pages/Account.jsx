import { useState } from "react";
import { useNavigate } from "react-router-dom";

const colors = {
  navy:      "#12284B",
  lav:       "#BFB6CE",
  lavLight:  "#D4CEDF",
  lavPale:   "#EDE8F4",
  lavSofter: "#F3F0F8",
  sage:      "#406D61",
  sageDark:  "#34574d",
  cream:     "#FAF7F2",
  muted:     "#7a7090",
};

function HeartIcon({ size = 24, fill = colors.navy, opacity = 0.85 }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: size, fill, opacity }}>
      <path d="M16 27C16 27 4 19 4 11c0-4.2 3.6-7.5 8-7.5 1.8 0 3.4.7 4 1.6.6-.9 2.2-1.6 4-1.6C24.4 3.5 28 6.8 28 11c0 8-12 16-12 16z" />
    </svg>
  );
}

export default function Account() {
  const navigate = useNavigate();

  const [hoverLogin,  setHoverLogin]  = useState(false);
  const [hoverSignup, setHoverSignup] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: colors.lavPale,
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Background sprig — top left */}
        <svg style={{ position:"absolute", top:-10, left:-10, width:180, opacity:0.15, pointerEvents:"none", transform:"rotate(-10deg)" }}
          viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
          <line x1="100" y1="400" x2="100" y2="40" stroke="#9b92b8" strokeWidth="2.5"/>
          <line x1="65"  y1="400" x2="65"  y2="80" stroke="#9b92b8" strokeWidth="1.8"/>
          <line x1="135" y1="400" x2="135" y2="72" stroke="#9b92b8" strokeWidth="1.8"/>
          <ellipse cx="100" cy="25"  rx="13" ry="28" fill={colors.lav}/>
          <ellipse cx="65"  cy="65"  rx="10" ry="22" fill="#C4BCE0"/>
          <ellipse cx="135" cy="58"  rx="10" ry="22" fill={colors.lav}/>
          <ellipse cx="82"  cy="180" rx="15" ry="5" fill={colors.sage} opacity="0.5" transform="rotate(-30 82 180)"/>
          <ellipse cx="118" cy="180" rx="15" ry="5" fill={colors.sage} opacity="0.5" transform="rotate(30 118 180)"/>
          <ellipse cx="82"  cy="240" rx="15" ry="5" fill={colors.sage} opacity="0.45" transform="rotate(-30 82 240)"/>
          <ellipse cx="118" cy="240" rx="15" ry="5" fill={colors.sage} opacity="0.45" transform="rotate(30 118 240)"/>
        </svg>

        {/* Background sprig — bottom right */}
        <svg style={{ position:"absolute", bottom:-10, right:-10, width:150, opacity:0.13, pointerEvents:"none", transform:"rotate(170deg) scaleX(-1)" }}
          viewBox="0 0 200 400" xmlns="http://www.w3.org/2000/svg">
          <line x1="100" y1="400" x2="100" y2="40" stroke="#9b92b8" strokeWidth="2.5"/>
          <line x1="65"  y1="400" x2="65"  y2="80" stroke="#9b92b8" strokeWidth="1.8"/>
          <line x1="135" y1="400" x2="135" y2="72" stroke="#9b92b8" strokeWidth="1.8"/>
          <ellipse cx="100" cy="25"  rx="13" ry="28" fill={colors.lav}/>
          <ellipse cx="65"  cy="65"  rx="10" ry="22" fill="#C4BCE0"/>
          <ellipse cx="135" cy="58"  rx="10" ry="22" fill={colors.lav}/>
          <ellipse cx="82"  cy="180" rx="15" ry="5" fill={colors.sage} opacity="0.5" transform="rotate(-30 82 180)"/>
          <ellipse cx="118" cy="180" rx="15" ry="5" fill={colors.sage} opacity="0.5" transform="rotate(30 118 180)"/>
        </svg>

        {/* Card */}
        <div style={{
          background: colors.cream,
          border: `1px solid rgba(191,182,206,0.45)`,
          borderRadius: 16,
          padding: "52px 48px 44px",
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          boxShadow: "0 20px 50px rgba(18,40,75,0.09), 0 4px 12px rgba(18,40,75,0.05)",
          animation: "fadeUp 0.8s ease both",
          position: "relative",
          zIndex: 1,
        }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:9, marginBottom:28 }}>
            <HeartIcon size={26} />
            <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:400, letterSpacing:"0.15em", color:colors.navy }}>
              LOVENDER
            </span>
          </div>

          {/* Lock icon */}
          <div style={{
            width:56, height:56, borderRadius:"50%",
            background:colors.lavSofter, border:`1.5px solid ${colors.lavLight}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            margin:"0 auto 22px",
          }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width:22 }}>
              <rect x="5" y="11" width="14" height="10" rx="2" stroke={colors.lav} strokeWidth="1.5"/>
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={colors.lav} strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="12" cy="16" r="1.5" fill={colors.lav}/>
            </svg>
          </div>

          {/* Heading */}
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontWeight:400, fontSize:28, lineHeight:1.2, color:colors.navy, marginBottom:10 }}>
            You are not <em style={{ fontStyle:"italic", color:colors.muted }}>logged in</em>
          </h1>

          <p style={{ fontSize:13, fontWeight:300, color:colors.muted, lineHeight:1.7, maxWidth:300, margin:"0 auto 30px" }}>
            Sign in to access your island account, manage bookings, and enjoy your Lovender membership.
          </p>

          {/* Login button */}
          <button
            onClick={() => navigate("/Login")}
            onMouseEnter={() => setHoverLogin(true)}
            onMouseLeave={() => setHoverLogin(false)}
            style={{
              width:"100%", padding:"13px 0", borderRadius:9,
              background: hoverLogin ? colors.sageDark : colors.sage,
              color:"#fff", border:"none", cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, letterSpacing:"0.06em",
              display:"flex", alignItems:"center", justifyContent:"center", gap:9,
              boxShadow:"0 4px 14px rgba(64,109,97,0.28)",
              transform: hoverLogin ? "translateY(-1px)" : "none",
              transition:"background .25s, transform .2s",
            }}
          >
            <HeartIcon size={15} fill="white" opacity={0.85} />
            Sign In to My Account
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0" }}>
            <div style={{ flex:1, height:1, background:"rgba(191,182,206,0.5)" }} />
            <svg width="18" height="28" viewBox="0 0 18 28" xmlns="http://www.w3.org/2000/svg">
              <line x1="9" y1="28" x2="9" y2="10" stroke="#9b92b8" strokeWidth="1.2"/>
              <ellipse cx="9" cy="6" rx="5" ry="8" fill={colors.lav}/>
            </svg>
            <div style={{ flex:1, height:1, background:"rgba(191,182,206,0.5)" }} />
          </div>

          {/* Signup prompt */}
          <p style={{ fontSize:13, fontWeight:300, color:colors.muted, marginBottom:14 }}>
            Don't have an account? Join the island.
          </p>

          <button
            onClick={() => navigate("/Signup")}
            onMouseEnter={() => setHoverSignup(true)}
            onMouseLeave={() => setHoverSignup(false)}
            style={{
              width:"100%", padding:"12px 0", borderRadius:9,
              background:"transparent",
              color: hoverSignup ? colors.sage : colors.navy,
              border:`1.5px solid ${hoverSignup ? colors.sage : colors.lavLight}`,
              cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:400, letterSpacing:"0.06em",
              transform: hoverSignup ? "translateY(-1px)" : "none",
              transition:"border-color .25s, color .25s, transform .2s",
            }}
          >
            Create an Account
          </button>

        </div>
      </div>
    </>
  );
}
