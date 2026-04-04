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
  sageLight: "#6B9B8E",
  cream:     "#FAF7F2",
  text:      "#2c2840",
  muted:     "#7a7090",
  error:     "#b5443a",
  errorBg:   "#fdf5f5",
  errorBorder:"#c0392b",
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/* ── Reusable sprig SVG ── */
function Sprig() {
  return (
    <svg viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <line x1="50" y1="180" x2="50" y2="52" stroke="#9b92b8" strokeWidth="1.5" />
      <line x1="32" y1="180" x2="32" y2="72" stroke="#9b92b8" strokeWidth="1.2" />
      <line x1="68" y1="180" x2="68" y2="68" stroke="#9b92b8" strokeWidth="1.2" />
      <ellipse cx="50" cy="42" rx="9" ry="18" fill={colors.lav} />
      <ellipse cx="32" cy="60" rx="7" ry="14" fill={colors.lav} />
      <ellipse cx="68" cy="56" rx="7" ry="14" fill={colors.lav} />
      <ellipse cx="40" cy="98" rx="9" ry="3.5" fill={colors.sageLight} opacity="0.7" transform="rotate(-28 40 98)" />
      <ellipse cx="60" cy="98" rx="9" ry="3.5" fill={colors.sageLight} opacity="0.7" transform="rotate(28 60 98)" />
      <ellipse cx="40" cy="120" rx="9" ry="3.5" fill={colors.sageLight} opacity="0.6" transform="rotate(-28 40 120)" />
      <ellipse cx="60" cy="120" rx="9" ry="3.5" fill={colors.sageLight} opacity="0.6" transform="rotate(28 60 120)" />
    </svg>
  );
}

/* ── Heart icon ── */
function HeartIcon({ size = 20, fill = colors.navy, opacity = 0.85 }) {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ width: size, fill, opacity }}>
      <path d="M16 27C16 27 4 19 4 11c0-4.2 3.6-7.5 8-7.5 1.8 0 3.4.7 4 1.6.6-.9 2.2-1.6 4-1.6C24.4 3.5 28 6.8 28 11c0 8-12 16-12 16z" />
    </svg>
  );
}

/* ── Field component ── */
function Field({ label, id, type = "text", placeholder, value, onChange, onBlur, status, errorMsg, children }) {
  const borderColor =
    status === "error" ? colors.errorBorder :
    status === "ok"    ? colors.sageLight   :
    `rgba(191,182,206,0.55)`;
  const bg = status === "error" ? colors.errorBg : colors.lavSofter;

  return (
    <div style={{ marginBottom: 20 }}>
      {label && (
        <label style={{
          display: "block", fontSize: 9.5, fontWeight: 500,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: colors.text, opacity: 0.55, marginBottom: 7,
        }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete={type === "email" ? "email" : type === "password" ? "current-password" : "off"}
          style={{
            width: "100%", background: bg,
            border: `1.5px solid ${borderColor}`,
            borderRadius: 9, padding: "12px 38px 12px 14px",
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
            fontWeight: 300, color: colors.navy, outline: "none",
            transition: "border-color .25s, background .25s, box-shadow .25s",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = colors.lav;
            e.target.style.background = "#fff";
            e.target.style.boxShadow = "0 0 0 3px rgba(191,182,206,0.22)";
          }}
        />
        {children}
      </div>
      {status === "error" && (
        <p style={{ fontSize: 11, color: colors.error, marginTop: 5, fontWeight: 300 }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}

/* ══════════════════════════════
   LOGIN PAGE
══════════════════════════════ */
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});

  const validate = (field, val) => {
    if (field === "email")    return isEmail(val) ? "ok" : "error";
    if (field === "password") return val.length >= 8 ? "ok" : "error";
    return null;
  };

  const handleBlur = (field, val) => {
    if (!val) return;
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field, val) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailStatus = validate("email", email);
    const passStatus  = validate("password", password);
    setErrors({ email: emailStatus, password: passStatus });
    setTouched({ email: true, password: true });
    if (emailStatus === "ok" && passStatus === "ok") {
      navigate("/validation");
    }
  };

  /* styles */
  const S = {
    page: {
      display: "grid", gridTemplateColumns: "55% 45%", height: "100vh",
      fontFamily: "'DM Sans', sans-serif",
    },
    left: {
      position: "relative", overflow: "hidden",
      background: "linear-gradient(175deg,#ddd7ec 0%,#c8c0da 30%,#b0c4bc 70%,#8aafa6 100%)",
    },
    sceneSvg: { position: "absolute", inset: 0, width: "100%", height: "100%" },
    logoBar: {
      position: "absolute", top: 40, left: 44, zIndex: 20,
      display: "flex", alignItems: "center", gap: 10,
    },
    brandName: {
      fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 400,
      letterSpacing: "0.15em", color: colors.navy,
    },
    caption: { position: "absolute", bottom: 50, left: 44, right: 44, zIndex: 20 },
    eyebrow: {
      fontSize: 9, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase",
      color: colors.sage, marginBottom: 10,
    },
    captionH2: {
      fontFamily: "'Playfair Display', serif", fontWeight: 400,
      fontSize: "clamp(28px, 3.2vw, 42px)", lineHeight: 1.18, color: colors.navy, marginBottom: 11,
    },
    captionP: { fontSize: 12.5, fontWeight: 300, color: "rgba(44,40,64,0.72)", lineHeight: 1.75, maxWidth: 300 },
    right: {
      background: colors.cream, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 52px", position: "relative",
      borderLeft: `1px solid rgba(191,182,206,0.4)`, overflow: "hidden",
    },
    sprigTR: {
      position: "absolute", top: -8, right: 10, width: 110,
      opacity: 0.28, transform: "rotate(-15deg)", pointerEvents: "none",
    },
    sprigBL: {
      position: "absolute", bottom: -8, left: 5, width: 90,
      opacity: 0.22, transform: "rotate(165deg) scaleX(-1)", pointerEvents: "none",
    },
    formWrap: {
      width: "100%", maxWidth: 340, zIndex: 1,
      animation: "fadeUp .8s ease both",
    },
    badge: {
      display: "inline-flex", alignItems: "center", gap: 8,
      background: colors.lavSofter, border: `1px solid ${colors.lavLight}`,
      borderRadius: 20, padding: "5px 14px 5px 8px", marginBottom: 16,
    },
    badgeText: {
      fontSize: 9, fontWeight: 500, letterSpacing: "0.2em",
      textTransform: "uppercase", color: colors.muted,
    },
    h1: {
      fontFamily: "'Playfair Display', serif", fontWeight: 400,
      fontSize: 34, lineHeight: 1.15, color: colors.navy, marginBottom: 7,
    },
    subP: { fontSize: 13, fontWeight: 300, color: colors.muted, lineHeight: 1.65, marginBottom: 28 },
    passHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 },
    passLabel: {
      fontSize: 9.5, fontWeight: 500, letterSpacing: "0.2em",
      textTransform: "uppercase", color: colors.text, opacity: 0.55,
    },
    forgotLink: { fontSize: 11, fontWeight: 300, color: colors.sage, textDecoration: "none" },
    rememberRow: { display: "flex", alignItems: "center", gap: 10, margin: "16px 0 22px" },
    rememberText: { fontSize: 12, fontWeight: 300, color: colors.muted, cursor: "pointer", userSelect: "none" },
    btnCta: {
      width: "100%", padding: 13, borderRadius: 9,
      background: colors.sage, color: "#fff", border: "none", cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
      boxShadow: "0 4px 14px rgba(64,109,97,0.28)", transition: "background .3s,transform .2s",
    },
    divider: { display: "flex", alignItems: "center", gap: 12, margin: "18px 0" },
    dividerText: { fontSize: 9, letterSpacing: "0.2em", color: colors.lav, textTransform: "uppercase" },
    signupPrompt: { textAlign: "center", fontSize: 12, fontWeight: 300, color: colors.muted },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        input::placeholder { color: rgba(44,40,64,0.28); font-style: italic; }
      `}</style>
      <div style={S.page}>

        {/* ── LEFT PANEL ── */}
        <div style={S.left}>
          <svg style={S.sceneSvg} viewBox="0 0 760 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="sun" cx="50%" cy="18%" r="45%">
                <stop offset="0%" stopColor="rgba(255,248,225,0.7)" />
                <stop offset="100%" stopColor="rgba(255,248,225,0)" />
              </radialGradient>
              <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7bbbb2" />
                <stop offset="100%" stopColor="#4d9189" />
              </linearGradient>
            </defs>
            <ellipse cx="380" cy="140" rx="260" ry="130" fill="url(#sun)" />
            <circle cx="380" cy="155" r="40" fill="rgba(255,248,215,0.45)" />
            <circle cx="380" cy="155" r="25" fill="rgba(255,248,215,0.6)" />
            <path d="M0 430 Q150 360 300 400 Q450 435 610 370 Q690 340 760 380 L760 510 L0 510Z" fill="#c8c0da" opacity="0.38" />
            <path d="M0 460 Q130 400 280 435 Q430 468 580 405 Q680 370 760 415 L760 530 L0 530Z" fill="#b0a8c8" opacity="0.32" />
            <rect x="0" y="508" width="760" height="50" fill="url(#water)" opacity="0.55" />
            <path d="M0 518 Q95 512 190 518 Q285 524 380 518 Q475 512 570 518 Q665 524 760 518" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            {/* Heart island */}
            <g transform="translate(260,455)">
              <ellipse cx="120" cy="60" rx="110" ry="22" fill="rgba(18,40,75,0.16)" />
              <path d="M120 82C120 82 30 48 30 22 30 9 39 1 51 1 62 1 70 7 76 14 82 7 90 1 101 1 113 1 122 9 122 22 122 48 120 82 120 82Z" fill="#7da896" />
              <path d="M120 74C120 74 44 44 44 22 44 13 50 7 59 7 67 7 73 12 76 18 79 12 85 7 93 7 102 7 108 13 108 22 108 44 120 74 120 74Z" fill="#9bbfb3" />
              <ellipse cx="66" cy="34" rx="7" ry="13" fill="#b0a8ca" />
              <ellipse cx="80" cy="26" rx="7" ry="13" fill="#bab2d0" />
              <ellipse cx="94" cy="32" rx="7" ry="13" fill="#b0a8ca" />
              <line x1="66" y1="47" x2="66" y2="34" stroke="#8a84a8" strokeWidth="1.2" />
              <line x1="80" y1="39" x2="80" y2="26" stroke="#8a84a8" strokeWidth="1.2" />
              <line x1="94" y1="45" x2="94" y2="32" stroke="#8a84a8" strokeWidth="1.2" />
              <ellipse cx="52" cy="50" rx="8" ry="6" fill="#406D61" opacity="0.7" />
              <ellipse cx="108" cy="48" rx="8" ry="6" fill="#406D61" opacity="0.7" />
            </g>
            {/* Ground */}
            <path d="M0 550 Q190 520 380 542 Q570 564 760 530 L760 900 L0 900Z" fill="#7ea99a" opacity="0.8" />
            <path d="M0 565 Q190 540 380 558 Q570 576 760 548 L760 900 L0 900Z" fill="#6b9a8b" />
            {/* Lavender rows — far */}
            {[30,65,100,135,170,205,240,275,310,345,380,415,450,485,520,555,590,625,660,700,735].map((x) => (
              <g key={x} opacity="0.65">
                <line x1={x} y1="640" x2={x} y2="614" stroke="#9090b0" strokeWidth="1.1" />
                <ellipse cx={x} cy="607" rx="5" ry="9" fill={x % 60 === 0 ? "#bbb3cc" : "#b2aac8"} />
              </g>
            ))}
            {/* Lavender rows — mid */}
            {[15,55,95,135,175,215,255,295,335,375,415,455,495,535,575,615,655,695,735].map((x) => (
              <g key={x} opacity="0.82">
                <line x1={x} y1="710" x2={x} y2="673" stroke="#888" strokeWidth="1.4" />
                <ellipse cx={x} cy="666" rx="7" ry="14" fill={x % 80 === 0 ? "#b2aac8" : "#a8a0c4"} />
              </g>
            ))}
            {/* Lavender rows — foreground */}
            {[0,40,80,120,160,200,240,280,320,360,400,440,480,520,560,600,640,680,720,760].map((x) => (
              <g key={x}>
                <line x1={x} y1="900" x2={x} y2="820" stroke="#76708c" strokeWidth="2" />
                <ellipse cx={x} cy="802" rx="10" ry="20" fill={x % 80 === 0 ? "#b4aed0" : x % 40 === 0 ? "#aaa4c8" : "#a09ac0"} />
              </g>
            ))}
            {/* Floating pollen */}
            {[[200,280,7],[500,220,9],[340,350,8],[620,300,10]].map(([cx,cy,dur],i) => (
              <circle key={i} cx={cx} cy={cy} r={2.5} fill="#d4cedf" opacity="0.7">
                <animate attributeName="cy" values={`${cy};${cy-22};${cy}`} dur={`${dur}s`} repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;1;0.7" dur={`${dur}s`} repeatCount="indefinite" />
              </circle>
            ))}
          </svg>

          {/* Logo */}
          <div style={S.logoBar}>
            <HeartIcon size={28} />
            <span style={S.brandName}>LOVENDER</span>
          </div>

          {/* Caption */}
          <div style={S.caption}>
            <p style={S.eyebrow}>Heart Island · Lavender Retreat</p>
            <h2 style={S.captionH2}>
              Where lavender<br />meets the <em style={{ fontStyle: "italic", color: colors.sage }}>sea</em>
            </h2>
            <p style={S.captionP}>A heart-shaped island wrapped in lavender fields and ocean air. Your escape is always waiting.</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={S.right}>
          <div style={S.sprigTR}><Sprig /></div>
          <div style={S.sprigBL}><Sprig /></div>
          <div style={S.formWrap}>

            {/* Badge */}
            <div style={S.badge}>
              <HeartIcon size={14} fill={colors.lav} opacity={1} />
              <span style={S.badgeText}>Member Login</span>
            </div>

            <h1 style={S.h1}>
              Sign <em style={{ fontStyle: "italic", color: colors.muted }}>in</em> to<br />your island
            </h1>
            <p style={S.subP}>Welcome back. The lavender is in bloom.</p>

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <Field
                label="Email Address"
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email", email)}
                status={touched.email ? errors.email : undefined}
                errorMsg="Please enter a valid email address."
              >
                <svg style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:18, opacity:0.4, pointerEvents:"none" }}
                  viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg">
                  <line x1="10" y1="40" x2="10" y2="14" stroke="#9b92b8" strokeWidth="1.5" />
                  <ellipse cx="10" cy="9" rx="6" ry="11" fill={colors.lav} />
                </svg>
              </Field>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                <div style={S.passHeader}>
                  <span style={S.passLabel}>Password</span>
                  <a href="#" style={S.forgotLink}>Forgot password?</a>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => handleBlur("password", password)}
                    style={{
                      width: "100%", background: touched.password && errors.password === "error" ? colors.errorBg : colors.lavSofter,
                      border: `1.5px solid ${touched.password && errors.password === "error" ? colors.errorBorder : touched.password && errors.password === "ok" ? colors.sageLight : "rgba(191,182,206,0.55)"}`,
                      borderRadius: 9, padding: "12px 14px",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: colors.navy, outline: "none",
                    }}
                  />
                </div>
                {touched.password && errors.password === "error" && (
                  <p style={{ fontSize: 11, color: colors.error, marginTop: 5, fontWeight: 300 }}>
                    Password must be at least 8 characters.
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div style={S.rememberRow}>
                <div
                  onClick={() => setRemember(!remember)}
                  style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: `1.5px solid ${colors.lav}`,
                    background: remember ? colors.lav : colors.lavSofter,
                    cursor: "pointer", position: "relative", flexShrink: 0,
                    transition: "background .2s",
                  }}
                >
                  {remember && (
                    <span style={{
                      position: "absolute", top: 3, left: 5,
                      width: 4, height: 7,
                      borderRight: "1.5px solid white", borderBottom: "1.5px solid white",
                      transform: "rotate(45deg)", display: "block",
                    }} />
                  )}
                </div>
                <span style={S.rememberText} onClick={() => setRemember(!remember)}>Keep me signed in</span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                style={S.btnCta}
                onMouseEnter={(e) => { e.currentTarget.style.background = colors.sageDark; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = colors.sage; e.currentTarget.style.transform = "none"; }}
              >
                <svg viewBox="0 0 20 20" style={{ width: 15, opacity: 0.85 }} fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 18C10 18 2 13 2 7c0-3 2.2-5 5-5 1.2 0 2.3.5 3 1.4C10.7 2.5 11.8 2 13 2c2.8 0 5 2 5 5 0 6-8 11-8 11z" fill="white" opacity="0.85" />
                </svg>
                Enter the Island
              </button>
            </form>

            {/* Divider */}
            <div style={S.divider}>
              <div style={{ flex: 1, height: 1, background: "rgba(191,182,206,0.5)" }} />
              <span style={S.dividerText}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(191,182,206,0.5)" }} />
            </div>

            <p style={S.signupPrompt}>
              New to Lovender?{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{ color: colors.navy, fontWeight: 500, cursor: "pointer", borderBottom: `1px solid ${colors.lav}`, paddingBottom: 1 }}
              >
                Create an account
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


