import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
  error:     "#b5443a",
  errorBg:   "#fdf5f5",
  errorBorder:"#c0392b",
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/* ── Reusable sprig SVG ── */
function Sprig() {
  return (
    <svg viewBox="0 0 100 180" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <line x1="50" y1="180" x2="50" y2="52" stroke={colors.lova} strokeWidth="1.5" />
      <line x1="32" y1="180" x2="32" y2="72" stroke={colors.lova}  strokeWidth="1.2" />
      <line x1="68" y1="180" x2="68" y2="68" stroke={colors.lova}  strokeWidth="1.2" />
      <ellipse cx="50" cy="42" rx="9" ry="18" fill={colors.lova} />
      <ellipse cx="32" cy="60" rx="7" ry="14" fill={colors.lova} />
      <ellipse cx="68" cy="56" rx="7" ry="14" fill={colors.lova} />
      <ellipse cx="40" cy="98" rx="9" ry="3.5" fill={colors.green} opacity="0.7" transform="rotate(-28 40 98)" />
      <ellipse cx="60" cy="98" rx="9" ry="3.5" fill={colors.green} opacity="0.7" transform="rotate(28 60 98)" />
      <ellipse cx="40" cy="120" rx="9" ry="3.5" fill={colors.green} opacity="0.6" transform="rotate(-28 40 120)" />
      <ellipse cx="60" cy="120" rx="9" ry="3.5" fill={colors.green} opacity="0.6" transform="rotate(28 60 120)" />
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
  const location = useLocation();
  const { login, loading } = useAuth();

  // Redirect to intended page after login, or default to /account
  const from = location.state?.from?.pathname || "/account";

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors]     = useState({});
  const [touched, setTouched]   = useState({});
  const [backendError, setBackendError] = useState("");

  const validate = (field, val) => {
    if (field === "email") {
      if (!val.trim()) return { status: "error", msg: "Email is required." };
      if (!isEmail(val)) return { status: "error", msg: "Please enter a valid email address." };
      return { status: "ok", msg: "" };
    }
    if (field === "password") {
      if (!val) return { status: "error", msg: "Password is required." };
      if (val.length < 8) return { status: "error", msg: "Password must be at least 8 characters." };
      return { status: "ok", msg: "" };
    }
    return { status: null, msg: "" };
  };

  const handleBlur = (field, val) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field, val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBackendError("");

    const emailResult = validate("email", email);
    const passResult  = validate("password", password);
    setErrors({ email: emailResult, password: passResult });
    setTouched({ email: true, password: true });

    if (emailResult.status !== "ok" || passResult.status !== "ok") return;

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setBackendError(result.message || "Login failed. Please check your credentials.");
    }
  };

  /* styles */
  const S = {
    page: {
      display: "grid", gridTemplateColumns: "55% 45%", minHeight: "100vh",
      fontFamily: "'DM Sans', sans-serif",
    },
    left: {
      position: "relative", overflow: "hidden",
      background: "#0e081f",
    },
    sceneSvg: { position: "absolute", inset: 0, width: "100%", height: "100%" },
    caption: { position: "absolute", top: 90, left: 44, right: 44, zIndex: 20 },
    eyebrow: {
      fontSize: 9, fontWeight: 500, letterSpacing: "0.32em", textTransform: "uppercase",
      color: colors.white, marginBottom: 10,
    },
    captionH2: {
      fontFamily: "'Playfair Display', serif", fontWeight: 400,
      fontSize: "clamp(28px, 3.2vw, 42px)", lineHeight: 1.18, color: colors.white, marginBottom: 11,
    },
    captionP: { fontSize: 12.5, fontWeight: 300, color: colors.white, lineHeight: 1.75, maxWidth: 300 },
    right: {
      background: colors.white, display: "flex", alignItems: "center", justifyContent: "center",
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
    h1: {
      fontFamily: "'Playfair Display', serif", fontWeight: 400,
      fontSize: 34, lineHeight: 1.15, color: colors.lova, marginBottom: 7,
    },
    subP: { fontSize: 13, fontWeight: 300, color: colors.lova, lineHeight: 1.65, marginBottom: 28 },
    passHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7, color: colors.lova },
    passLabel: {
      fontSize: 9.5, fontWeight: 500, letterSpacing: "0.2em",
      textTransform: "uppercase", color: colors.lova, opacity: 0.55,
    },
    forgotLink: { fontSize: 11, fontWeight: 300, color: colors.lova, textDecoration: "none" },
    rememberRow: { display: "flex", alignItems: "center", gap: 10, margin: "16px 0 22px" },
    rememberText: { fontSize: 12, fontWeight: 300, color: colors.lova, cursor: "pointer", userSelect: "none" },
    btnCta: {
      width: "100%", padding: 13, borderRadius: 9,
      background: loading ? colors.sageDark : colors.sage,
      color: "#fff", border: "none", cursor: loading ? "not-allowed" : "pointer",
      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
      display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
      boxShadow: "0 4px 14px rgba(64,109,97,0.28)", transition: "background .3s,transform .2s",
      opacity: loading ? 0.8 : 1,
    },
    divider: { display: "flex", alignItems: "center", gap: 12, margin: "18px 0" },
    dividerText: { fontSize: 9, letterSpacing: "0.2em", color: colors.lova, textTransform: "uppercase" },
    signupPrompt: { textAlign: "center", fontSize: 12, fontWeight: 300, color: colors.muted },
    backendErrorBox: {
      background: colors.errorBg,
      border: `1px solid ${colors.errorBorder}`,
      borderRadius: 8,
      padding: "10px 14px",
      marginBottom: 16,
      fontSize: 12,
      color: colors.error,
      fontWeight: 400,
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:none; } }
        input::placeholder { color: rgba(44,40,64,0.28); font-style: italic; }
      `}</style>
      <div style={S.page}>

        {/* ── LEFT PANEL ── */}
        <div style={S.left}>
          <div style={S.caption}>
            <p style={S.eyebrow}>Heart Island · Lavender Retreat</p>
            <h2 style={S.captionH2}>
              Where lavender<br />meets the <em style={{ fontStyle: "italic", color: colors.white }}>sea</em>
            </h2>
            <p style={S.captionP}>A heart-shaped island wrapped in lavender fields and ocean air. Your escape is always waiting.</p>
          </div>

          <svg style={S.sceneSvg} viewBox="0 0 760 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <path d="M0 430 Q150 360 300 400 Q450 435 610 370 Q690 340 760 380 L760 510 L0 510Z" fill="#c8c0da" opacity="0.38" />
            <path d="M0 460 Q130 400 280 435 Q430 468 580 405 Q680 370 760 415 L760 530 L0 530Z" fill="#b0a8c8" opacity="0.32" />
            <rect x="0" y="508" width="760" height="50" fill="url(#water)" opacity="0.55" />
            <path d="M0 518 Q95 512 190 518 Q285 524 380 518 Q475 512 570 518 Q665 524 760 518" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" />
            {[30,65,100,135,170,205,240,275,310,345,380,415,450,485,520,555,590,625,660,700,735].map((x) => (
              <g key={x} opacity="0.65">
                <line x1={x} y1="640" x2={x} y2="614" stroke="#9090b0" strokeWidth="1.1" />
                <ellipse cx={x} cy="607" rx="5" ry="9" fill={x % 60 === 0 ? "#bbb3cc" : "#b2aac8"} />
              </g>
            ))}
            {[15,55,95,135,175,215,255,295,335,375,415,455,495,535,575,615,655,695,735].map((x) => (
              <g key={x} opacity="0.82">
                <line x1={x} y1="710" x2={x} y2="673" stroke="#888" strokeWidth="1.4" />
                <ellipse cx={x} cy="666" rx="7" ry="14" fill={x % 80 === 0 ? "#b2aac8" : "#a8a0c4"} />
              </g>
            ))}
            {[0,40,80,120,160,200,240,280,320,360,400,440,480,520,560,600,640,680,720,760].map((x) => (
              <g key={x}>
                <line x1={x} y1="900" x2={x} y2="820" stroke="#76708c" strokeWidth="2" />
                <ellipse cx={x} cy="802" rx="10" ry="20" fill={x % 80 === 0 ? "#b4aed0" : x % 40 === 0 ? "#aaa4c8" : "#a09ac0"} />
              </g>
            ))}
          </svg>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={S.right}>
          <div style={S.sprigTR}><Sprig /></div>
          <div style={S.sprigBL}><Sprig /></div>
          <div style={S.formWrap}>

            <h1 style={S.h1}>
              Sign <em style={{ fontStyle: "italic", color: colors.lova }}>in</em> to<br />your island
            </h1>
            <p style={S.subP}>Welcome back. The lavender is in bloom.</p>

            {/* Backend error banner */}
            {backendError && (
              <div style={S.backendErrorBox}>
                {backendError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Email */}
              <Field
                label="Email Address"
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setBackendError(""); }}
                onBlur={() => handleBlur("email", email)}
                status={touched.email ? errors.email?.status : undefined}
                errorMsg={errors.email?.msg}
              >
                <svg style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", width:18, opacity:0.4, pointerEvents:"none" }}
                  viewBox="0 0 20 40" xmlns="http://www.w3.org/2000/svg">
                  <line x1="10" y1="40" x2="10" y2="14" stroke="#0e081f" strokeWidth="1.5" />
                  <ellipse cx="10" cy="9" rx="6" ry="11" fill={colors.lav} />
                </svg>
              </Field>

              {/* Password */}
              <div style={{ marginBottom: 20 }}>
                <div style={S.passHeader}>
                  <span style={S.passLabel}>Password</span>
                  <span
                    style={S.forgotLink}
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot password?
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setBackendError(""); }}
                    onBlur={() => handleBlur("password", password)}
                    style={{
                      width: "100%",
                      background: touched.password && errors.password?.status === "error" ? colors.errorBg : colors.lavSofter,
                      border: `1.5px solid ${touched.password && errors.password?.status === "error" ? colors.errorBorder : touched.password && errors.password?.status === "ok" ? colors.sageLight : "rgba(191,182,206,0.55)"}`,
                      borderRadius: 9, padding: "12px 14px",
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300, color: colors.lova, outline: "none",
                    }}
                  />
                </div>
                {touched.password && errors.password?.status === "error" && (
                  <p style={{ fontSize: 11, color: colors.error, marginTop: 5, fontWeight: 300 }}>
                    {errors.password.msg}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div style={S.rememberRow}>
                <div
                  onClick={() => setRemember(!remember)}
                  style={{
                    width: 16, height: 16, borderRadius: 4,
                    border: `1.5px solid ${colors.lova}`,
                    background: remember ? colors.lova : colors.white,
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
                disabled={loading}
              >
                {loading ? "Signing in…" : "Enter the Island"}
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
                onClick={() => navigate("/Signup")}
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
